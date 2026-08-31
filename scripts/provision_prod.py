"""
Provisiona a stack de PRODUCAO na AWS: bucket S3 + OAC + distribuicao
CloudFront, clonando a configuracao da distribuicao de staging.

Por que clonar em vez de escrever do zero: a distribuicao de staging ja carrega
meses de ajuste fino que nao esta documentado em lugar nenhum -- quatro cache
behaviors (`_next/static/*`, `*.html`, `/quiz/*`, `/ferramentas/*`), cada uma
com a sua cache policy e response headers policy. Recriar "na mao" era garantia
de esquecer uma e so descobrir em producao. As policies sao objetos de conta,
entao a distribuicao nova simplesmente referencia os mesmos IDs.

O que muda em relacao ao clone:

  - Origin: bucket `amigo-violao-website-prod` (novo), com OAC proprio.
  - Function: `amigo-violao-prod-url-rewrite` (publicada por
    scripts/cloudfront_function.py --env prod), separada da de staging pra que
    um deploy de staging nunca mexa no comportamento de producao.
  - CustomErrorResponses: 403 do S3 vira 404 de verdade servindo /404.html.
    Em staging isso estava mapeado pra /index.html com status 200, o que fazia
    QUALQUER URL inexistente responder 200 com a Home -- soft 404 em massa. Com
    o dominio real apontando pra ca, seriam centenas de URLs velhas do
    WordPress (area de membros, /feed, /wp-json) todas devolvendo 200 com a
    Home, e o Google trata isso como conteudo duplicado.
  - Aliases: NENHUM na criacao. Anexar `amigoviolao.com` exige o certificado
    ACM ja ISSUED, e ele so e emitido depois que os CNAME de validacao entram
    no Cloudflare. Rode `--attach-domain` depois disso (idempotente).

Uso:
  python scripts/provision_prod.py                 # cria bucket + OAC + distribuicao
  python scripts/provision_prod.py --attach-domain # anexa apex + www + cert (depois do ACM)
  python scripts/provision_prod.py --status        # so mostra o estado atual

Idempotente: reaproveita bucket/OAC/distribuicao existentes pelo nome/comment.
Requer credenciais AWS no ambiente (boto3).
"""

import argparse
import json
import time

import boto3

ACCOUNT_ID = "291768628850"
REGION_BUCKET = "sa-east-1"

STAGING_DISTRIBUTION_ID = "E2Q2YNHFJ1GG9P"

PROD_BUCKET = "amigo-violao-website-prod"
PROD_ORIGIN_ID = "prod-s3-origin"
PROD_OAC_NAME = "amigo-violao-prod-oac"
PROD_FUNCTION_NAME = "amigo-violao-prod-url-rewrite"
PROD_COMMENT = "amigo-violao producao (amigoviolao.com)"

DOMAINS = ["amigoviolao.com", "www.amigoviolao.com"]
CERT_DOMAIN = "amigoviolao.com"

ERROR_RESPONSES = {
    "Quantity": 2,
    "Items": [
        # S3 via OAC responde 403 (AccessDenied) pra chave inexistente, porque a
        # policy nao concede ListBucket -- por isso o 403 tambem tem que virar 404.
        {"ErrorCode": 403, "ResponsePagePath": "/404.html", "ResponseCode": "404", "ErrorCachingMinTTL": 60},
        {"ErrorCode": 404, "ResponsePagePath": "/404.html", "ResponseCode": "404", "ErrorCachingMinTTL": 60},
    ],
}


def ensure_bucket(s3) -> None:
    try:
        s3.head_bucket(Bucket=PROD_BUCKET)
        print(f"bucket {PROD_BUCKET}: ja existe")
        return
    except s3.exceptions.ClientError:
        pass
    s3.create_bucket(
        Bucket=PROD_BUCKET,
        CreateBucketConfiguration={"LocationConstraint": REGION_BUCKET},
    )
    s3.put_public_access_block(
        Bucket=PROD_BUCKET,
        PublicAccessBlockConfiguration={
            "BlockPublicAcls": True,
            "IgnorePublicAcls": True,
            "BlockPublicPolicy": True,
            "RestrictPublicBuckets": True,
        },
    )
    s3.put_bucket_versioning(Bucket=PROD_BUCKET, VersioningConfiguration={"Status": "Enabled"})
    print(f"bucket {PROD_BUCKET}: criado (privado, versionado)")


def ensure_oac(cf) -> str:
    for item in cf.list_origin_access_controls().get("OriginAccessControlList", {}).get("Items", []):
        if item["Name"] == PROD_OAC_NAME:
            print(f"OAC {PROD_OAC_NAME}: ja existe ({item['Id']})")
            return item["Id"]
    resp = cf.create_origin_access_control(
        OriginAccessControlConfig={
            "Name": PROD_OAC_NAME,
            "Description": "OAC do bucket de producao",
            "SigningProtocol": "sigv4",
            "SigningBehavior": "always",
            "OriginAccessControlOriginType": "s3",
        }
    )
    oac_id = resp["OriginAccessControl"]["Id"]
    print(f"OAC {PROD_OAC_NAME}: criado ({oac_id})")
    return oac_id


def find_prod_distribution(cf):
    for item in cf.list_distributions().get("DistributionList", {}).get("Items", []):
        if item.get("Comment") == PROD_COMMENT:
            return item["Id"]
    return None


def build_prod_config(cf, oac_id: str) -> dict:
    cfg = cf.get_distribution_config(Id=STAGING_DISTRIBUTION_ID)["DistributionConfig"]
    function_arn = f"arn:aws:cloudfront::{ACCOUNT_ID}:function/{PROD_FUNCTION_NAME}"

    cfg["CallerReference"] = f"amigo-violao-prod-{int(time.time())}"
    cfg["Comment"] = PROD_COMMENT
    cfg["Aliases"] = {"Quantity": 0, "Items": []}
    cfg["ViewerCertificate"] = {"CloudFrontDefaultCertificate": True}
    cfg["CustomErrorResponses"] = ERROR_RESPONSES

    cfg["Origins"] = {
        "Quantity": 1,
        "Items": [
            {
                "Id": PROD_ORIGIN_ID,
                "DomainName": f"{PROD_BUCKET}.s3.{REGION_BUCKET}.amazonaws.com",
                "OriginPath": "",
                "CustomHeaders": {"Quantity": 0},
                "S3OriginConfig": {"OriginAccessIdentity": ""},
                "OriginAccessControlId": oac_id,
                "ConnectionAttempts": 3,
                "ConnectionTimeout": 10,
                "OriginShield": {"Enabled": False},
            }
        ],
    }

    def retarget(behavior: dict) -> dict:
        behavior["TargetOriginId"] = PROD_ORIGIN_ID
        assoc = behavior.get("FunctionAssociations", {})
        for item in assoc.get("Items", []):
            item["FunctionARN"] = function_arn
        return behavior

    retarget(cfg["DefaultCacheBehavior"])
    for behavior in cfg.get("CacheBehaviors", {}).get("Items", []):
        retarget(behavior)
    return cfg


def ensure_bucket_policy(s3, distribution_id: str) -> None:
    policy = {
        "Version": "2008-10-17",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipalReadOnly",
                "Effect": "Allow",
                "Principal": {"Service": "cloudfront.amazonaws.com"},
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{PROD_BUCKET}/*",
                "Condition": {
                    "StringEquals": {
                        "AWS:SourceArn": f"arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{distribution_id}"
                    }
                },
            }
        ],
    }
    s3.put_bucket_policy(Bucket=PROD_BUCKET, Policy=json.dumps(policy))
    print(f"bucket policy: leitura liberada so pra distribuicao {distribution_id}")


def attach_domain(cf, acm, distribution_id: str) -> None:
    cert_arn = None
    for summary in acm.list_certificates(CertificateStatuses=["ISSUED"])["CertificateSummaryList"]:
        if summary["DomainName"] == CERT_DOMAIN:
            cert_arn = summary["CertificateArn"]
            break
    if not cert_arn:
        raise SystemExit(
            "Nenhum certificado ISSUED para amigoviolao.com em us-east-1.\n"
            "O ACM so emite depois que os CNAME de validacao entram no Cloudflare."
        )

    resp = cf.get_distribution_config(Id=distribution_id)
    cfg, etag = resp["DistributionConfig"], resp["ETag"]
    cfg["Aliases"] = {"Quantity": len(DOMAINS), "Items": DOMAINS}
    cfg["ViewerCertificate"] = {
        "ACMCertificateArn": cert_arn,
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021",
        "Certificate": cert_arn,
        "CertificateSource": "acm",
    }
    cf.update_distribution(Id=distribution_id, IfMatch=etag, DistributionConfig=cfg)
    print(f"dominios anexados: {', '.join(DOMAINS)}")
    print(f"certificado: {cert_arn}")


def fix_error_responses(cf, distribution_id: str) -> None:
    """Troca o 403->/index.html (200) por 404 de verdade.

    Enquanto valeu so pra staging isso era feio; com o dominio real
    apontando pra ca vira problema de SEO: toda URL morta do WordPress
    responderia 200 com a Home.
    """
    resp = cf.get_distribution_config(Id=distribution_id)
    cfg, etag = resp["DistributionConfig"], resp["ETag"]
    if cfg.get("CustomErrorResponses") == ERROR_RESPONSES:
        print(f"{distribution_id}: respostas de erro ja corretas")
        return
    cfg["CustomErrorResponses"] = ERROR_RESPONSES
    cf.update_distribution(Id=distribution_id, IfMatch=etag, DistributionConfig=cfg)
    cf.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
            "Paths": {"Quantity": 1, "Items": ["/*"]},
            "CallerReference": f"errors-{int(time.time())}",
        },
    )
    print(f"{distribution_id}: 403 e 404 agora servem /404.html com status 404")


def show_status(cf, distribution_id: str) -> None:
    dist = cf.get_distribution(Id=distribution_id)["Distribution"]
    cfg = dist["DistributionConfig"]
    print(f"distribuicao {distribution_id}")
    print(f"  status   {dist['Status']}")
    print(f"  dominio  {dist['DomainName']}")
    print(f"  aliases  {cfg['Aliases'].get('Items', []) or '(nenhum)'}")
    print(f"  origin   {cfg['Origins']['Items'][0]['DomainName']}")
    errs = [
        f"{i['ErrorCode']}->{i['ResponsePagePath']} ({i['ResponseCode']})"
        for i in cfg.get("CustomErrorResponses", {}).get("Items", [])
    ]
    print(f"  erros    {', '.join(errs)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Provisiona a stack de producao.")
    parser.add_argument("--attach-domain", action="store_true", help="anexa apex + www + certificado ACM")
    parser.add_argument("--status", action="store_true", help="so mostra o estado atual")
    parser.add_argument(
        "--fix-staging-errors",
        action="store_true",
        help="aplica em staging o mesmo mapeamento de erro (403/404 -> /404.html)",
    )
    args = parser.parse_args()

    cf = boto3.client("cloudfront", region_name="us-east-1")
    acm = boto3.client("acm", region_name="us-east-1")
    s3 = boto3.client("s3", region_name=REGION_BUCKET)

    if args.fix_staging_errors:
        fix_error_responses(cf, STAGING_DISTRIBUTION_ID)
        return

    distribution_id = find_prod_distribution(cf)

    if args.status:
        if not distribution_id:
            raise SystemExit("distribuicao de producao ainda nao existe")
        show_status(cf, distribution_id)
        return

    if args.attach_domain:
        if not distribution_id:
            raise SystemExit("distribuicao de producao ainda nao existe -- rode sem --attach-domain antes")
        attach_domain(cf, acm, distribution_id)
        show_status(cf, distribution_id)
        return

    ensure_bucket(s3)
    oac_id = ensure_oac(cf)

    try:
        cf.describe_function(Name=PROD_FUNCTION_NAME)
    except cf.exceptions.NoSuchFunctionExists:
        raise SystemExit(
            f"A function {PROD_FUNCTION_NAME} nao existe ainda. Rode antes:\n"
            "  python scripts/cloudfront_function.py --env prod"
        )

    if distribution_id:
        print(f"distribuicao de producao: ja existe ({distribution_id})")
    else:
        cfg = build_prod_config(cf, oac_id)
        created = cf.create_distribution(DistributionConfig=cfg)["Distribution"]
        distribution_id = created["Id"]
        print(f"distribuicao criada: {distribution_id} ({created['DomainName']})")

    ensure_bucket_policy(s3, distribution_id)
    print()
    show_status(cf, distribution_id)
    print(
        "\nProximos passos:\n"
        f"  1. Anote o ID {distribution_id} em ENVIRONMENTS['prod'] de scripts/cloudfront_function.py\n"
        f"  2. gh secret set CLOUDFRONT_DISTRIBUTION_ID_PROD --body {distribution_id}\n"
        "  3. Validar o certificado no Cloudflare e rodar --attach-domain"
    )


if __name__ == "__main__":
    main()
