"""
Provisiona a Lambda que recebe o formulario de /contato (lambda/contato/handler.py).

Cria, em sa-east-1 (mesma regiao do bucket, latencia menor pro Brasil):

  - role IAM `amigo-violao-contato-lambda-role` com a policy basica de execucao
    (so escrever log no CloudWatch -- a funcao nao acessa nada da conta);
  - a funcao `amigo-violao-contato`, runtime python3.12, sem dependencia
    externa (urllib da stdlib fala com a Brevo);
  - uma Function URL publica com CORS restrito aos dominios do site.

Por que Function URL e nao API Gateway: e uma rota unica, sem autenticacao,
sem plano de uso. API Gateway seria uma peca a mais pra manter e pagar sem
entregar nada aqui.

Duas protecoes, ja que a URL e publica:

  - teto de concorrencia: a funcao tenta reservar 5 execucoes; em conta com o
    limite inicial de 10 a AWS recusa a reserva, e tudo bem -- esse limite de
    conta ja e o teto que a reserva buscava;
  - o campo isca no handler descarta bot sem gastar chamada na Brevo.

Configuracao vem do .env.local (git-ignored):

  BREVO_API_KEY=...           chave v3 (Brevo > SMTP & API > API Keys)
  BREVO_LIST_ID=...           id da lista que recebe quem aceitar novidades
  CONTATO_SENDER_EMAIL=...    remetente verificado na Brevo
  CONTATO_NOTIFY_TO=...       quem recebe a mensagem (padrao: falarcom@amigoviolao.com)

Uso:
  python scripts/provision_contato_lambda.py            # cria ou atualiza
  python scripts/provision_contato_lambda.py --status   # so mostra a URL e a config

Idempotente. Requer credenciais AWS no ambiente (boto3).
"""

import argparse
import io
import json
import time
import zipfile
from pathlib import Path

import boto3

REGIAO = "sa-east-1"
FUNCAO = "amigo-violao-contato"
ROLE = "amigo-violao-contato-lambda-role"
HANDLER = Path(__file__).resolve().parent.parent / "lambda/contato/handler.py"
REPO_ROOT = Path(__file__).resolve().parent.parent

ORIGENS = [
    "https://amigoviolao.com",
    "https://www.amigoviolao.com",
    "https://staging.amigoviolao.com",
    "http://localhost:3000",
]
CONCORRENCIA_MAXIMA = 5
PADRAO_NOTIFY = "falarcom@amigoviolao.com"


def env_local() -> dict:
    arquivo = REPO_ROOT / ".env.local"
    valores = {}
    if arquivo.exists():
        for linha in arquivo.read_text(encoding="utf-8").splitlines():
            if "=" in linha and not linha.strip().startswith("#"):
                chave, valor = linha.split("=", 1)
                valores[chave.strip()] = valor.strip().strip('"')
    return valores


def variaveis(cfg: dict) -> dict:
    faltando = [c for c in ("BREVO_API_KEY", "BREVO_LIST_ID", "CONTATO_SENDER_EMAIL") if not cfg.get(c)]
    if faltando:
        raise SystemExit("faltando no .env.local: " + ", ".join(faltando))
    return {
        "BREVO_API_KEY": cfg["BREVO_API_KEY"],
        "BREVO_LIST_ID": str(cfg["BREVO_LIST_ID"]),
        "SENDER_EMAIL": cfg["CONTATO_SENDER_EMAIL"],
        "SENDER_NAME": cfg.get("CONTATO_SENDER_NAME", "Site Amigo Violao"),
        "NOTIFY_TO": cfg.get("CONTATO_NOTIFY_TO", PADRAO_NOTIFY),
    }


def pacote() -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("handler.py", HANDLER.read_text(encoding="utf-8"))
    return buffer.getvalue()


def garantir_role(iam) -> str:
    confianca = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole",
            }
        ],
    }
    try:
        arn = iam.get_role(RoleName=ROLE)["Role"]["Arn"]
        print(f"role {ROLE}: ja existe")
    except iam.exceptions.NoSuchEntityException:
        arn = iam.create_role(
            RoleName=ROLE,
            AssumeRolePolicyDocument=json.dumps(confianca),
            Description="Execucao da Lambda do formulario de contato",
        )["Role"]["Arn"]
        iam.attach_role_policy(
            RoleName=ROLE,
            PolicyArn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        )
        print(f"role {ROLE}: criada")
        # A role recem-criada leva alguns segundos pra ficar utilizavel pelo
        # Lambda; sem esta espera o create_function falha com InvalidParameter.
        time.sleep(12)
    return arn


def garantir_funcao(lam, role_arn: str, env: dict) -> None:
    codigo = pacote()
    try:
        lam.get_function(FunctionName=FUNCAO)
        lam.update_function_code(FunctionName=FUNCAO, ZipFile=codigo)
        esperar_atualizacao(lam)
        lam.update_function_configuration(
            FunctionName=FUNCAO,
            Environment={"Variables": env},
            Timeout=15,
            MemorySize=256,
        )
        print(f"funcao {FUNCAO}: atualizada")
    except lam.exceptions.ResourceNotFoundException:
        lam.create_function(
            FunctionName=FUNCAO,
            Runtime="python3.12",
            Role=role_arn,
            Handler="handler.handler",
            Code={"ZipFile": codigo},
            Environment={"Variables": env},
            Timeout=15,
            MemorySize=256,
            Description="Formulario de contato do site -> Brevo",
        )
        print(f"funcao {FUNCAO}: criada")
    esperar_atualizacao(lam)
    try:
        lam.put_function_concurrency(FunctionName=FUNCAO, ReservedConcurrentExecutions=CONCORRENCIA_MAXIMA)
        print(f"concorrencia reservada: {CONCORRENCIA_MAXIMA}")
    except lam.exceptions.InvalidParameterValueException:
        # Contas novas vem com limite de 10 execucoes simultaneas na conta
        # inteira, e a AWS nao deixa reservar nada que derrube o pool comum
        # abaixo desse minimo. Sem problema: o teto que eu queria por na funcao
        # ja existe, so que no nivel da conta -- ninguem consegue fazer esta
        # Lambda escalar alem de 10 execucoes de qualquer jeito.
        print("concorrencia reservada: pulada (limite de 10 da conta ja e o teto)")


def esperar_atualizacao(lam) -> None:
    for _ in range(30):
        estado = lam.get_function_configuration(FunctionName=FUNCAO)
        if estado.get("LastUpdateStatus") != "InProgress" and estado.get("State") != "Pending":
            return
        time.sleep(2)


def garantir_url(lam) -> str:
    cors = {
        "AllowOrigins": ORIGENS,
        "AllowMethods": ["POST"],
        "AllowHeaders": ["content-type"],
        "MaxAge": 86400,
    }
    try:
        url = lam.get_function_url_config(FunctionName=FUNCAO)["FunctionUrl"]
        lam.update_function_url_config(FunctionName=FUNCAO, AuthType="NONE", Cors=cors)
        print("function url: atualizada")
    except lam.exceptions.ResourceNotFoundException:
        url = lam.create_function_url_config(FunctionName=FUNCAO, AuthType="NONE", Cors=cors)["FunctionUrl"]
        print("function url: criada")

    try:
        lam.add_permission(
            FunctionName=FUNCAO,
            StatementId="AllowPublicFunctionUrl",
            Action="lambda:InvokeFunctionUrl",
            Principal="*",
            FunctionUrlAuthType="NONE",
        )
        print("permissao publica de invocacao: adicionada")
    except lam.exceptions.ResourceConflictException:
        pass
    return url


def main() -> None:
    parser = argparse.ArgumentParser(description="Provisiona a Lambda do formulario de contato.")
    parser.add_argument("--status", action="store_true")
    args = parser.parse_args()

    lam = boto3.client("lambda", region_name=REGIAO)

    if args.status:
        cfg = lam.get_function_configuration(FunctionName=FUNCAO)
        url = lam.get_function_url_config(FunctionName=FUNCAO)
        print(f"funcao   {FUNCAO} ({cfg['Runtime']}, {cfg['MemorySize']}MB, timeout {cfg['Timeout']}s)")
        print(f"url      {url['FunctionUrl']}")
        print(f"cors     {url['Cors']['AllowOrigins']}")
        env = cfg.get("Environment", {}).get("Variables", {})
        print(f"lista    {env.get('BREVO_LIST_ID')}")
        print(f"remetente {env.get('SENDER_EMAIL')} -> {env.get('NOTIFY_TO')}")
        return

    cfg = env_local()
    role_arn = garantir_role(boto3.client("iam"))
    garantir_funcao(lam, role_arn, variaveis(cfg))
    url = garantir_url(lam)

    print(f"\nendpoint: {url}")
    print("Agora:")
    print(f'  gh secret set NEXT_PUBLIC_CONTACT_ENDPOINT --body "{url}"')
    print("  e republicar (Actions > Deploy Site > Run workflow > producao)")


if __name__ == "__main__":
    main()
