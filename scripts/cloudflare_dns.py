"""
DNS do amigoviolao.com no Cloudflare: validacao do certificado ACM e o corte
do dominio do WordPress (Cloudways) para o CloudFront.

O registrador e a BomDominio, mas quem resolve o dominio e o Cloudflare
(nameservers bailey/lloyd.ns.cloudflare.com) -- qualquer registro tem que ser
criado aqui, nao na DigitalOcean nem na BomDominio.

Acoes:

  --status        mostra os registros atuais do apex, do www e dos MX (e-mail),
                  sem alterar nada.
  --backup        salva TODOS os registros da zona em backups/cloudflare-dns-
                  <timestamp>.json. O --cutover faz isso sozinho antes de
                  mexer; este flag existe pra rodar antes, por seguranca.
  --validate-acm  cria os dois CNAME de validacao do certificado ACM
                  (apex + www). DNS only, sempre -- registro de validacao
                  proxiado nao valida.
  --cutover       aponta apex e www pro CloudFront: apaga os A/AAAA atuais
                  (Cloudways) e cria CNAME -> <distribuicao>.cloudfront.net,
                  DNS only, TTL 300. Nao toca em MX, TXT, nem em nenhum outro
                  subdominio -- o e-mail do dominio continua exatamente como
                  esta.
  --rollback <arquivo.json>
                  restaura apex e www a partir de um backup.

Por que DNS only (nuvem cinza) e nao proxiado: o CloudFront ja e CDN e ja
termina o TLS. Empilhar o proxy do Cloudflare em cima significaria dois caches
para limpar a cada publicacao e um salto a mais para depurar. O apex fica como
CNAME mesmo -- o Cloudflare achata CNAME de raiz automaticamente.

O token vai em .env.local (git-ignored) como:
  CLOUDFLARE_API_TOKEN=...
com permissao Zone:DNS:Edit na zona amigoviolao.com.

Uso: python scripts/cloudflare_dns.py --status
"""

import argparse
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ZONE_NAME = "amigoviolao.com"
API = "https://api.cloudflare.com/client/v4"
REPO_ROOT = Path(__file__).resolve().parent.parent
BACKUP_DIR = REPO_ROOT / "backups"

# TTL curto no corte: se algo der errado, o rollback propaga em minutos em vez
# de horas. Vale subir depois que o site estiver estavel.
CUTOVER_TTL = 300


def load_token() -> str:
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    if token:
        return token.strip()
    env_file = REPO_ROOT / ".env.local"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            if line.startswith("CLOUDFLARE_API_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit(
        "CLOUDFLARE_API_TOKEN nao encontrado.\n"
        "Crie o token em Cloudflare > My Profile > API Tokens (template 'Edit zone DNS',\n"
        f"zona {ZONE_NAME}) e adicione em .env.local como CLOUDFLARE_API_TOKEN=..."
    )


def call(method: str, path: str, token: str, body: dict | None = None) -> dict:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(
        f"{API}{path}",
        data=data,
        method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        raise SystemExit(f"Cloudflare {method} {path} -> HTTP {exc.code}\n{detail}")
    if not payload.get("success"):
        raise SystemExit(f"Cloudflare {method} {path} falhou:\n{json.dumps(payload.get('errors'), indent=1)}")
    return payload


def zone_id(token: str) -> str:
    result = call("GET", f"/zones?name={ZONE_NAME}", token)["result"]
    if not result:
        raise SystemExit(f"zona {ZONE_NAME} nao encontrada -- o token tem acesso a ela?")
    return result[0]["id"]


def all_records(token: str, zid: str) -> list:
    records, page = [], 1
    while True:
        payload = call("GET", f"/zones/{zid}/dns_records?per_page=100&page={page}", token)
        records.extend(payload["result"])
        info = payload.get("result_info", {})
        if page >= info.get("total_pages", 1):
            return records
        page += 1


def describe(record: dict) -> str:
    proxy = "proxied" if record.get("proxied") else "dns-only"
    return f"  {record['type']:6s} {record['name']:45s} {record['content'][:60]:60s} ttl={record['ttl']:<6} {proxy}"


def cmd_status(token: str, zid: str) -> None:
    records = all_records(token, zid)
    apex = [r for r in records if r["name"] == ZONE_NAME and r["type"] in ("A", "AAAA", "CNAME")]
    www = [r for r in records if r["name"] == f"www.{ZONE_NAME}" and r["type"] in ("A", "AAAA", "CNAME")]
    mail = [r for r in records if r["type"] in ("MX", "TXT") and r["name"] == ZONE_NAME]
    others = [r for r in records if r not in apex + www + mail]

    print(f"zona {ZONE_NAME} ({len(records)} registros)\n")
    print("apex:")
    for r in apex or []:
        print(describe(r))
    print("\nwww:")
    for r in www or []:
        print(describe(r))
    print("\ne-mail / verificacao (NAO tocar):")
    for r in mail:
        print(describe(r))
    print(f"\noutros {len(others)} registros (subdominios, validacoes) ficam intactos:")
    for r in others[:15]:
        print(describe(r))
    if len(others) > 15:
        print(f"  ... e mais {len(others) - 15}")


def cmd_backup(token: str, zid: str) -> Path:
    BACKUP_DIR.mkdir(exist_ok=True)
    records = all_records(token, zid)
    path = BACKUP_DIR / f"cloudflare-dns-{time.strftime('%Y%m%d-%H%M%S')}.json"
    path.write_text(json.dumps(records, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"backup: {path.relative_to(REPO_ROOT)} ({len(records)} registros)")
    return path


def upsert(token: str, zid: str, records: list, name: str, rtype: str, content: str, proxied: bool, ttl: int) -> None:
    existing = next((r for r in records if r["name"] == name and r["type"] == rtype), None)
    body = {"type": rtype, "name": name, "content": content, "ttl": ttl, "proxied": proxied}
    if existing:
        if existing["content"] == content and existing.get("proxied") == proxied:
            print(f"  = {rtype} {name} ja aponta pra {content}")
            return
        call("PATCH", f"/zones/{zid}/dns_records/{existing['id']}", token, body)
        print(f"  ~ {rtype} {name} -> {content}")
    else:
        call("POST", f"/zones/{zid}/dns_records", token, body)
        print(f"  + {rtype} {name} -> {content}")


def cmd_validate_acm(token: str, zid: str) -> None:
    import boto3

    acm = boto3.client("acm", region_name="us-east-1")
    cert_arn = None
    for summary in acm.list_certificates(CertificateStatuses=["PENDING_VALIDATION", "ISSUED"])["CertificateSummaryList"]:
        if summary["DomainName"] == ZONE_NAME:
            cert_arn = summary["CertificateArn"]
            break
    if not cert_arn:
        raise SystemExit(f"nenhum certificado ACM para {ZONE_NAME} em us-east-1")

    cert = acm.describe_certificate(CertificateArn=cert_arn)["Certificate"]
    print(f"certificado {cert_arn}\nstatus atual: {cert['Status']}\n")
    if cert["Status"] == "ISSUED":
        print("ja emitido -- nada a fazer aqui.")
        return

    records = all_records(token, zid)
    for option in cert["DomainValidationOptions"]:
        rr = option["ResourceRecord"]
        # DNS only: um CNAME de validacao proxiado responde o IP do Cloudflare
        # em vez do valor esperado, e o ACM nunca valida.
        upsert(token, zid, records, rr["Name"].rstrip("."), rr["Type"], rr["Value"].rstrip("."), False, 300)
    print("\nCNAME de validacao criados. O ACM costuma emitir em poucos minutos.")
    print("Acompanhe com: python scripts/provision_prod.py --status")


def cmd_cutover(token: str, zid: str, target: str) -> None:
    cmd_backup(token, zid)
    records = all_records(token, zid)

    print(f"\napontando {ZONE_NAME} e www para {target} (DNS only, TTL {CUTOVER_TTL}):")
    for name in (ZONE_NAME, f"www.{ZONE_NAME}"):
        # Apex e www hoje sao A/AAAA do Cloudways proxiados. Um CNAME nao pode
        # coexistir com A/AAAA no mesmo nome, entao os antigos saem primeiro.
        for record in [r for r in records if r["name"] == name and r["type"] in ("A", "AAAA")]:
            call("DELETE", f"/zones/{zid}/dns_records/{record['id']}", token)
            print(f"  - {record['type']:4s} {name} ({record['content']})")
        upsert(token, zid, records, name, "CNAME", target, False, CUTOVER_TTL)

    print("\nCorte feito. Propagacao: minutos (TTL 300).")
    print("Confira com: curl -sSI https://amigoviolao.com | head -5")


def cmd_rollback(token: str, zid: str, backup_path: str) -> None:
    saved = json.loads(Path(backup_path).read_text(encoding="utf-8"))
    records = all_records(token, zid)
    names = {ZONE_NAME, f"www.{ZONE_NAME}"}

    print(f"restaurando apex e www a partir de {backup_path}:")
    for record in [r for r in records if r["name"] in names and r["type"] in ("A", "AAAA", "CNAME")]:
        call("DELETE", f"/zones/{zid}/dns_records/{record['id']}", token)
        print(f"  - {record['type']:5s} {record['name']} ({record['content']})")
    for record in [r for r in saved if r["name"] in names and r["type"] in ("A", "AAAA", "CNAME")]:
        call(
            "POST",
            f"/zones/{zid}/dns_records",
            token,
            {
                "type": record["type"],
                "name": record["name"],
                "content": record["content"],
                "ttl": record["ttl"],
                "proxied": record.get("proxied", False),
            },
        )
        print(f"  + {record['type']:5s} {record['name']} -> {record['content']}")


def main() -> None:
    parser = argparse.ArgumentParser(description="DNS do amigoviolao.com no Cloudflare.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--status", action="store_true")
    group.add_argument("--backup", action="store_true")
    group.add_argument("--validate-acm", action="store_true")
    group.add_argument("--cutover", metavar="DOMINIO_CLOUDFRONT", help="ex.: d1abc2def3.cloudfront.net")
    group.add_argument("--rollback", metavar="BACKUP_JSON")
    args = parser.parse_args()

    token = load_token()
    zid = zone_id(token)

    if args.status:
        cmd_status(token, zid)
    elif args.backup:
        cmd_backup(token, zid)
    elif args.validate_acm:
        cmd_validate_acm(token, zid)
    elif args.cutover:
        cmd_cutover(token, zid, args.cutover)
    elif args.rollback:
        cmd_rollback(token, zid, args.rollback)


if __name__ == "__main__":
    main()
