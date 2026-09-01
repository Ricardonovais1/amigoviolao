"""
Recebe o formulario de /contato e entrega na Brevo.

Por que existe: o site e export estatico no S3/CloudFront, sem servidor. A API
da Brevo exige uma chave no header -- chamada direto do navegador, essa chave
ficaria publica no JavaScript e qualquer um poderia disparar e-mail em nome do
dominio. Esta Lambda e o pedaco minimo de servidor que guarda a chave.

O que faz, por requisicao:

  1. Valida o payload e descarta bot (campo isca "website" preenchido).
  2. Manda um e-mail transacional pro endereco de contato, com replyTo do
     visitante -- responder a mensagem e so apertar "responder".
  3. SE o visitante marcou o aceite, cadastra o contato na lista da Brevo.
     Sem marcar, ele nao entra em lista nenhuma: quem escreve pedindo ajuda
     nao esta consentindo em receber marketing, e a LGPD trata as duas coisas
     como finalidades diferentes.

O passo 3 falhar nao derruba o passo 2: a mensagem chegar importa mais que o
cadastro, e o visitante nao tem culpa se a lista deu erro.
"""

import json
import os
import re
import urllib.error
import urllib.request

BREVO_API = "https://api.brevo.com/v3"
API_KEY = os.environ["BREVO_API_KEY"]
NOTIFY_TO = os.environ["NOTIFY_TO"]
SENDER_EMAIL = os.environ["SENDER_EMAIL"]
SENDER_NAME = os.environ.get("SENDER_NAME", "Site Amigo Violao")
LIST_ID = int(os.environ["BREVO_LIST_ID"])

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s.]+\.[^@\s]+$")
LIMITES = {"name": 120, "email": 200, "message": 5000}


def responder(status: int, corpo: dict) -> dict:
    # O CORS real e configurado na Function URL; o header aqui cobre o caso de
    # erro, em que a Lambda responde antes daquela camada montar a resposta.
    return {
        "statusCode": status,
        "headers": {"content-type": "application/json; charset=utf-8"},
        "body": json.dumps(corpo, ensure_ascii=False),
    }


def brevo(caminho: str, payload: dict) -> tuple:
    req = urllib.request.Request(
        f"{BREVO_API}{caminho}",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={
            "api-key": API_KEY,
            "content-type": "application/json",
            "accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", "replace")


def notificar(nome: str, email: str, mensagem: str, aceite: bool) -> tuple:
    corpo = (
        f"<p><strong>Nome:</strong> {escapar(nome)}<br>"
        f"<strong>E-mail:</strong> {escapar(email)}<br>"
        f"<strong>Aceitou receber novidades:</strong> {'sim' if aceite else 'nao'}</p>"
        f"<p><strong>Mensagem:</strong></p><p>{escapar(mensagem).replace(chr(10), '<br>')}</p>"
    )
    return brevo(
        "/smtp/email",
        {
            "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
            "to": [{"email": NOTIFY_TO}],
            # Responder ao e-mail cai direto no visitante, nao no remetente tecnico.
            "replyTo": {"email": email, "name": nome},
            "subject": f"Contato pelo site — {nome}",
            "htmlContent": corpo,
        },
    )


def cadastrar(nome: str, email: str) -> tuple:
    return brevo(
        "/contacts",
        {
            "email": email,
            # OPT_IN e atributo que ja existe na conta: registrar o aceite
            # ali deixa o consentimento auditavel dentro da propria Brevo, em
            # vez de existir so no navegador de quem preencheu.
            "attributes": {"NOME": nome, "OPT_IN": True},
            "listIds": [LIST_ID],
            "updateEnabled": True,
        },
    )


def escapar(texto: str) -> str:
    return (
        texto.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def handler(event, context):
    metodo = event.get("requestContext", {}).get("http", {}).get("method", "POST")
    if metodo == "OPTIONS":
        return responder(204, {})
    if metodo != "POST":
        return responder(405, {"erro": "metodo nao permitido"})

    try:
        dados = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return responder(400, {"erro": "payload invalido"})

    # Campo isca: invisivel pro visitante, irresistivel pro bot que preenche
    # tudo que encontra. Responde 200 de proposito -- um 400 ensinaria o bot.
    if (dados.get("website") or "").strip():
        return responder(200, {"ok": True})

    nome = (dados.get("name") or "").strip()
    email = (dados.get("email") or "").strip().lower()
    mensagem = (dados.get("message") or "").strip()
    aceite = bool(dados.get("optIn"))

    if not nome or not mensagem or not EMAIL_RE.match(email):
        return responder(400, {"erro": "preencha nome, e-mail valido e mensagem"})
    for campo, valor in (("name", nome), ("email", email), ("message", mensagem)):
        if len(valor) > LIMITES[campo]:
            return responder(400, {"erro": f"campo {campo} longo demais"})

    status, corpo = notificar(nome, email, mensagem, aceite)
    if status >= 300:
        print(f"brevo /smtp/email falhou: {status} {corpo}")
        return responder(502, {"erro": "nao foi possivel enviar agora"})

    if aceite:
        status_lista, corpo_lista = cadastrar(nome, email)
        # 201 criado, 204 atualizado; qualquer outra coisa fica no log e pronto
        # -- a mensagem ja chegou, e nao ha o que o visitante possa fazer.
        if status_lista >= 300:
            print(f"brevo /contacts falhou: {status_lista} {corpo_lista}")

    return responder(200, {"ok": True})
