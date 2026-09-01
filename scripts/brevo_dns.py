"""
Cria no Cloudflare os registros que a Brevo exige para autenticar o envio a
partir de amigoviolao.com.

Sao seis: o codigo de verificacao, dois DKIM e tres CNAME de marca (links,
redirecionamento e imagens dos e-mails). O DMARC a propria integracao da Brevo
com o Cloudflare ja criou.

**O cuidado que justifica este arquivo:** o codigo de verificacao e um TXT no
apex, onde ja existe o TXT do SPF. Um "upsert" ingenuo casaria por
(nome, tipo), encontraria o SPF e o sobrescreveria -- derrubando a entrega de
e-mail do dominio inteiro para consertar um formulario de contato. Aqui o TXT
do apex e casado pelo *conteudo* (prefixo `brevo-code:`), e SPF, DKIM da
ElasticEmail e MX nunca sao tocados.

Tudo entra como DNS only: registro de validacao ou de rastreamento proxiado
pelo Cloudflare responde o IP do proxy em vez do valor esperado, e a
verificacao nunca fecha.

Uso:
  python scripts/brevo_dns.py --dry-run   # mostra o que faria
  python scripts/brevo_dns.py

Depois, no painel da Brevo, clique em verificar o dominio.
Requer CLOUDFLARE_API_TOKEN no .env.local (ver scripts/cloudflare_dns.py).
"""

import argparse

from cloudflare_dns import ZONE_NAME, all_records, call, load_token, zone_id

TTL = 3600

REGISTROS = [
    ("TXT", ZONE_NAME, "brevo-code:f063bd396c528babf08389d0387a7690"),
    ("CNAME", f"brevo1._domainkey.{ZONE_NAME}", "b1.amigoviolao-com.dkim.brevo.com"),
    ("CNAME", f"brevo2._domainkey.{ZONE_NAME}", "b2.amigoviolao-com.dkim.brevo.com"),
    ("CNAME", f"contato.{ZONE_NAME}", "contato-amigoviolao-com.brand.brevosend.com"),
    ("CNAME", f"r.contato.{ZONE_NAME}", "contato-amigoviolao-com.r.brand.brevosend.com"),
    ("CNAME", f"img.contato.{ZONE_NAME}", "contato-amigoviolao-com.img.brand.brevosend.com"),
]

# Nenhum registro com este conteudo pode ser alterado por este script.
INTOCAVEIS = ("v=spf1", "v=DKIM1", "v=DMARC1")


def existente(registros: list, tipo: str, nome: str, conteudo: str):
    """Acha o registro correspondente sem confundir TXT diferentes no mesmo nome."""
    candidatos = [r for r in registros if r["name"] == nome and r["type"] == tipo]
    if tipo != "TXT":
        return candidatos[0] if candidatos else None
    prefixo = conteudo.split(":")[0]
    for r in candidatos:
        if r["content"].strip('"').startswith(prefixo):
            return r
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description="Registros DNS da Brevo.")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    token = load_token()
    zid = zone_id(token)
    registros = all_records(token, zid)

    for tipo, nome, conteudo in REGISTROS:
        atual = existente(registros, tipo, nome, conteudo)
        if atual:
            if any(atual["content"].strip('"').startswith(p) for p in INTOCAVEIS):
                raise SystemExit(f"ABORTADO: {nome} casou com um registro protegido ({atual['content'][:40]})")
            if atual["content"].strip('"') == conteudo:
                print(f"  = {tipo:5s} {nome:44s} ja correto")
                continue
            if args.dry_run:
                print(f"  ~ {tipo:5s} {nome:44s} {atual['content'][:30]} -> {conteudo}")
                continue
            call("PATCH", f"/zones/{zid}/dns_records/{atual['id']}", token,
                 {"type": tipo, "name": nome, "content": conteudo, "ttl": TTL, "proxied": False})
            print(f"  ~ {tipo:5s} {nome:44s} -> {conteudo}")
        else:
            if args.dry_run:
                print(f"  + {tipo:5s} {nome:44s} -> {conteudo}")
                continue
            call("POST", f"/zones/{zid}/dns_records", token,
                 {"type": tipo, "name": nome, "content": conteudo, "ttl": TTL, "proxied": False})
            print(f"  + {tipo:5s} {nome:44s} -> {conteudo}")

    if not args.dry_run:
        print("\nPronto. Volte na Brevo e clique em verificar o dominio.")


if __name__ == "__main__":
    main()
