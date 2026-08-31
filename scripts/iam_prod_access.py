"""
Estende o acesso do GitHub Actions (OIDC) para a stack de producao.

Hoje a role `github-actions-deploy-role` so confia em pushes na branch
`staging` e so pode escrever no bucket de staging. Com o deploy de producao
saindo de `master` (mesmo workflow, .github/workflows/deploy-site.yml), ela
precisa de:

  - trust policy aceitando tambem `refs/heads/master`;
  - s3:PutObject/DeleteObject/ListBucket no bucket `amigo-violao-website-prod`;
  - cloudfront:CreateInvalidation na distribuicao de producao.

O ID da distribuicao nao e fixo aqui: e descoberto pelo Comment, do mesmo jeito
que provision_prod.py faz -- assim o script continua valendo se a distribuicao
for recriada.

Uso: python scripts/iam_prod_access.py
Idempotente. Requer credenciais AWS no ambiente (boto3).
"""

import json

import boto3

from provision_prod import ACCOUNT_ID, PROD_BUCKET, find_prod_distribution

ROLE_NAME = "github-actions-deploy-role"
POLICY_NAME = "amigoviolao-staging-deploy"
REPO = "Ricardonovais1/amigoviolao"
BRANCHES = ["staging", "master"]

STAGING_BUCKET = "amigo-violao-website-staging"
STAGING_DISTRIBUTION_ID = "E2Q2YNHFJ1GG9P"


def bucket_arns(bucket: str) -> list:
    return [f"arn:aws:s3:::{bucket}", f"arn:aws:s3:::{bucket}/*"]


def main() -> None:
    iam = boto3.client("iam")
    cf = boto3.client("cloudfront", region_name="us-east-1")

    prod_distribution = find_prod_distribution(cf)
    if not prod_distribution:
        raise SystemExit("distribuicao de producao nao encontrada -- rode scripts/provision_prod.py antes")

    trust = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": f"arn:aws:iam::{ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringEquals": {"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"},
                    "StringLike": {
                        "token.actions.githubusercontent.com:sub": [
                            f"repo:{REPO}:ref:refs/heads/{branch}" for branch in BRANCHES
                        ]
                    },
                },
            }
        ],
    }
    iam.update_assume_role_policy(RoleName=ROLE_NAME, PolicyDocument=json.dumps(trust))
    print(f"trust policy: branches {', '.join(BRANCHES)} do repo {REPO}")

    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "S3DeployBuckets",
                "Effect": "Allow",
                "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
                "Resource": bucket_arns(STAGING_BUCKET) + bucket_arns(PROD_BUCKET),
            },
            {
                "Sid": "CloudFrontInvalidate",
                "Effect": "Allow",
                "Action": "cloudfront:CreateInvalidation",
                "Resource": [
                    f"arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{STAGING_DISTRIBUTION_ID}",
                    f"arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{prod_distribution}",
                ],
            },
        ],
    }
    iam.put_role_policy(RoleName=ROLE_NAME, PolicyName=POLICY_NAME, PolicyDocument=json.dumps(policy))
    print(f"policy {POLICY_NAME}: buckets {STAGING_BUCKET} + {PROD_BUCKET}")
    print(f"                    invalidacao em {STAGING_DISTRIBUTION_ID} + {prod_distribution}")
    print(f"\nFalta o secret no GitHub:\n  gh secret set CLOUDFRONT_DISTRIBUTION_ID_PROD --body {prod_distribution}")


if __name__ == "__main__":
    main()
