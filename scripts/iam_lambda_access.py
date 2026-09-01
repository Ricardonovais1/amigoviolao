"""
Concede ao usuario amigo-violao-cli o minimo para provisionar e depurar a
Lambda do formulario de contato.

O usuario ja tem S3, CloudFront, ACM e IAM completos, mas nenhuma permissao de
Lambda -- por isso scripts/provision_contato_lambda.py para no primeiro
get_function. Em vez de anexar a AWSLambda_FullAccess da AWS, esta policy fica
presa a UMA funcao pelo ARN: se algum dia esta chave vazar, ela nao vira uma
conta inteira de Lambda.

Tres blocos:

  - a funcao em si (criar, atualizar codigo e config, concorrencia, Function
    URL e a permissao publica de invocacao);
  - iam:PassRole so na role de execucao dela -- sem isso o CreateFunction
    falha, porque criar funcao significa entregar uma role pro servico Lambda,
    e a AWS exige permissao explicita pra isso;
  - leitura do log dela no CloudWatch, pra dar pra investigar erro de entrega
    sem abrir o console.

Uso: python scripts/iam_lambda_access.py
Idempotente. Requer credenciais AWS no ambiente (boto3).
"""

import json

import boto3

from provision_contato_lambda import FUNCAO, REGIAO, ROLE

USUARIO = "amigo-violao-cli"
POLICY = "amigo-violao-contato-lambda"
ACCOUNT_ID = "291768628850"

FUNCAO_ARN = f"arn:aws:lambda:{REGIAO}:{ACCOUNT_ID}:function:{FUNCAO}"
ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/{ROLE}"
LOG_ARN = f"arn:aws:logs:{REGIAO}:{ACCOUNT_ID}:log-group:/aws/lambda/{FUNCAO}:*"


def main() -> None:
    iam = boto3.client("iam")
    documento = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "GerenciarFuncaoDoContato",
                "Effect": "Allow",
                "Action": [
                    "lambda:GetFunction",
                    "lambda:GetFunctionConfiguration",
                    "lambda:CreateFunction",
                    "lambda:UpdateFunctionCode",
                    "lambda:UpdateFunctionConfiguration",
                    "lambda:PutFunctionConcurrency",
                    "lambda:DeleteFunctionConcurrency",
                    "lambda:AddPermission",
                    "lambda:RemovePermission",
                    "lambda:GetPolicy",
                    "lambda:CreateFunctionUrlConfig",
                    "lambda:GetFunctionUrlConfig",
                    "lambda:UpdateFunctionUrlConfig",
                    "lambda:InvokeFunction",
                ],
                "Resource": FUNCAO_ARN,
            },
            {
                "Sid": "EntregarRoleDeExecucao",
                "Effect": "Allow",
                "Action": "iam:PassRole",
                "Resource": ROLE_ARN,
                "Condition": {"StringEquals": {"iam:PassedToService": "lambda.amazonaws.com"}},
            },
            {
                "Sid": "LerLogDaFuncao",
                "Effect": "Allow",
                "Action": [
                    "logs:DescribeLogGroups",
                    "logs:DescribeLogStreams",
                    "logs:GetLogEvents",
                    "logs:FilterLogEvents",
                ],
                "Resource": LOG_ARN,
            },
        ],
    }
    iam.put_user_policy(UserName=USUARIO, PolicyName=POLICY, PolicyDocument=json.dumps(documento))
    print(f"policy {POLICY} aplicada em {USUARIO}, escopada em:")
    print(f"  funcao {FUNCAO_ARN}")
    print(f"  role   {ROLE_ARN}")
    print("\nAgora rode de novo: python scripts/provision_contato_lambda.py")


if __name__ == "__main__":
    main()
