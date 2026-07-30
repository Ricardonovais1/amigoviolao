"""
Segue de onde fix_cloudfront_trailing_slash.py travou: confirma se a function
foi publicada no LIVE com o codigo novo e cria a invalidation que nao rodou.

Uso: python scripts/verify_and_invalidate.py
"""

import json

import boto3

FUNCTION_NAME = "amigo-violao-staging-url-rewrite"
DISTRIBUTION_ID = "E2Q2YNHFJ1GG9P"


def main():
    c = boto3.client("cloudfront", region_name="us-east-1")

    live = c.get_function(Name=FUNCTION_NAME, Stage="LIVE")
    code = live["FunctionCode"].read().decode("utf-8")
    print("--- Codigo atual no LIVE ---")
    print(code)

    if "uri.slice(0, -1)" in code:
        print(">>> LIVE ja esta com o codigo corrigido.\n")
    else:
        print(">>> LIVE AINDA esta com o codigo antigo. Publicando de novo...")
        desc = c.describe_function(Name=FUNCTION_NAME, Stage="DEVELOPMENT")
        dev_etag = desc["ETag"]
        pub_resp = c.publish_function(Name=FUNCTION_NAME, IfMatch=dev_etag)
        print("Resposta publish_function:", json.dumps(pub_resp, default=str, indent=2))

    print("Criando invalidation /* ...")
    import time

    inv = c.create_invalidation(
        DistributionId=DISTRIBUTION_ID,
        InvalidationBatch={
            "CallerReference": f"fix-trailing-slash-{int(time.time())}",
            "Paths": {"Quantity": 1, "Items": ["/*"]},
        },
    )
    print("Invalidation criada:", inv["Invalidation"]["Id"], inv["Invalidation"]["Status"])


if __name__ == "__main__":
    main()
