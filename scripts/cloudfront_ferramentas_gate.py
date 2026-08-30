"""
Restringe /ferramentas/* (hoje so o Calendario do Professor) para abrir apenas
embutido como iframe dentro do Hotmart, mais uma chave de bypass pro Ricardo.

Contexto: a funcao CloudFront amigo-violao-staging-url-rewrite ja roda em
viewer-request pra todas as rotas, mas ela SO enxerga headers/cookies/query
strings que a Cache Policy da behavior selecionada permite encaminhar. A
Default Cache Behavior usa uma policy "none/none/none" (nada de header,
cookie ou querystring chega na funcao) -- entao checar Referer/Sec-Fetch-Dest
exige uma Cache Policy propria, e essa so pode ficar numa Cache Behavior
dedicada (mudar a policy default fragmentaria o cache do site inteiro por
Referer). Por isso este script cria:

  1. Cache Policy "amigo-violao-ferramentas-gate": TTL efetivamente zero
     (Max 1s -- a API do CloudFront rejeita header/cookie/querystring
     "whitelist" com Min/Default/Max todos 0, e trata isso como o caso
     especial "caching desligado"), evita servir um 403 velho depois que o
     pedido passa a ser legitimo. Encaminha Referer + Sec-Fetch-Dest, cookie
     "av_prof", querystring "k".
  2. Response Headers Policy "amigo-violao-ferramentas-headers": a policy
     default do site forca X-Frame-Options: DENY (bom pra tudo, mas
     bloquearia QUALQUER iframe, inclusive o do Hotmart). Esta nova policy
     omite X-Frame-Options e usa Content-Security-Policy:
     frame-ancestors https://*.hotmart.com no lugar -- e o equivalente
     moderno do XFO ALLOW-FROM (que o Chrome nunca implementou).
  3. Atualiza a function (DEV -> testa -> publica LIVE) com o gate:
       - uri comeca com "/ferramentas/": exige cookie av_prof=<chave> OU
         (Referer *.hotmart.com E Sec-Fetch-Dest: iframe); senao, 403.
       - "?k=<chave>" seta o cookie (Max-Age 1 ano) e redireciona sem a
         querystring -- e o acesso do Ricardo fora do Hotmart.
       - mantem o rewrite de .html existente pra todo o resto, inalterado.
  4. Cria (ou atualiza) a Cache Behavior "/ferramentas/*" ligando as duas
     policies novas + a mesma function.
  5. Invalida "/ferramentas/*" na distribution.

A chave de bypass NAO e criptografia -- e so uma senha de URL, no mesmo nivel
de forca do resto do gate (Referer/Sec-Fetch-Dest sao forjaveis por quem
souber). Serve pra barrar o link circulando por aí, nao um atacante dedicado.

Uso: python scripts/cloudfront_ferramentas_gate.py
Requer credenciais AWS no ambiente (boto3). Idempotente: pode rodar de novo
se falhar no meio -- reaproveita policies/behavior existentes pelo nome.
"""

import json

import boto3

REGION = "us-east-1"
DISTRIBUTION_ID = "E2Q2YNHFJ1GG9P"
FUNCTION_NAME = "amigo-violao-staging-url-rewrite"
ORIGIN_ID = "staging-s3-origin"
BASELINE_RESPONSE_HEADERS_POLICY_ID = "20e4a199-3574-4f32-9284-72830b7ed0c1"

CACHE_POLICY_NAME = "amigo-violao-ferramentas-gate"
RESPONSE_HEADERS_POLICY_NAME = "amigo-violao-ferramentas-headers"
PATH_PATTERN = "/ferramentas/*"

ACCESS_COOKIE_NAME = "av_prof"
ACCESS_KEY = "tZT1EwL8eh6MvXkvSfJCScBS"

FUNCTION_CODE = """function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var headers = request.headers;
  var querystring = request.querystring;
  var cookies = request.cookies;

  if (uri.indexOf("/ferramentas/") === 0) {
    var COOKIE_NAME = "%(cookie_name)s";
    var ACCESS_KEY = "%(access_key)s";

    var hasValidCookie =
      cookies[COOKIE_NAME] && cookies[COOKIE_NAME].value === ACCESS_KEY;

    if (!hasValidCookie && querystring.k && querystring.k.value === ACCESS_KEY) {
      var redirectResponse = {
        statusCode: 302,
        statusDescription: "Found",
        headers: {
          location: { value: uri },
        },
        cookies: {},
      };
      redirectResponse.cookies[COOKIE_NAME] = {
        value: ACCESS_KEY,
        attributes: "Max-Age=31536000; Path=/ferramentas; Secure; HttpOnly; SameSite=Lax",
      };
      return redirectResponse;
    }

    if (!hasValidCookie) {
      var referer =
        headers.referer && headers.referer.value ? headers.referer.value : "";
      var secFetchDest =
        headers["sec-fetch-dest"] && headers["sec-fetch-dest"].value
          ? headers["sec-fetch-dest"].value
          : "";

      if (!isHotmartReferer(referer) || secFetchDest !== "iframe") {
        return {
          statusCode: 403,
          statusDescription: "Forbidden",
          headers: {
            "content-type": { value: "text/plain; charset=utf-8" },
          },
          body: {
            encoding: "text",
            data: "Acesso restrito.",
          },
        };
      }
    }
  }

  if (uri === "/") {
    request.uri = "/index.html";
  } else if (uri.endsWith("/")) {
    request.uri = uri.slice(0, -1) + ".html";
  } else if (!uri.includes(".")) {
    request.uri += ".html";
  }

  return request;
}

function isHotmartReferer(referer) {
  if (referer.indexOf("https://") !== 0) return false;
  var rest = referer.slice(8);
  var slashIdx = rest.indexOf("/");
  var host = (slashIdx === -1 ? rest : rest.slice(0, slashIdx)).toLowerCase();
  return (
    host === "hotmart.com" ||
    (host.length > 12 && host.slice(-12) === ".hotmart.com")
  );
}
""" % {"cookie_name": ACCESS_COOKIE_NAME, "access_key": ACCESS_KEY}


def ensure_cache_policy(c):
    existing = c.list_cache_policies(Type="custom")
    for item in existing.get("CachePolicyList", {}).get("Items", []):
        if item["CachePolicy"]["CachePolicyConfig"]["Name"] == CACHE_POLICY_NAME:
            print("Cache Policy ja existe:", item["CachePolicy"]["Id"])
            return item["CachePolicy"]["Id"]

    resp = c.create_cache_policy(
        CachePolicyConfig={
            "Comment": "Gate de /ferramentas/*: Referer/Sec-Fetch-Dest/cookie/?k= visiveis pra function, TTL 0",
            "Name": CACHE_POLICY_NAME,
            "DefaultTTL": 0,
            "MaxTTL": 1,
            "MinTTL": 0,
            "ParametersInCacheKeyAndForwardedToOrigin": {
                "EnableAcceptEncodingGzip": True,
                "EnableAcceptEncodingBrotli": True,
                "HeadersConfig": {
                    "HeaderBehavior": "whitelist",
                    "Headers": {
                        "Quantity": 2,
                        "Items": ["Referer", "Sec-Fetch-Dest"],
                    },
                },
                "CookiesConfig": {
                    "CookieBehavior": "whitelist",
                    "Cookies": {"Quantity": 1, "Items": [ACCESS_COOKIE_NAME]},
                },
                "QueryStringsConfig": {
                    "QueryStringBehavior": "whitelist",
                    "QueryStrings": {"Quantity": 1, "Items": ["k"]},
                },
            },
        }
    )
    policy_id = resp["CachePolicy"]["Id"]
    print("Cache Policy criada:", policy_id)
    return policy_id


def ensure_response_headers_policy(c):
    existing = c.list_response_headers_policies(Type="custom")
    for item in existing.get("ResponseHeadersPolicyList", {}).get("Items", []):
        cfg = item["ResponseHeadersPolicy"]["ResponseHeadersPolicyConfig"]
        if cfg["Name"] == RESPONSE_HEADERS_POLICY_NAME:
            print("Response Headers Policy ja existe:", item["ResponseHeadersPolicy"]["Id"])
            return item["ResponseHeadersPolicy"]["Id"]

    resp = c.create_response_headers_policy(
        ResponseHeadersPolicyConfig={
            "Comment": "Como a policy default (XFO DENY) bloquearia o iframe do Hotmart",
            "Name": RESPONSE_HEADERS_POLICY_NAME,
            "SecurityHeadersConfig": {
                "XSSProtection": {"Override": True, "Protection": True, "ModeBlock": True},
                "ReferrerPolicy": {
                    "Override": True,
                    "ReferrerPolicy": "strict-origin-when-cross-origin",
                },
                "ContentTypeOptions": {"Override": True},
                "ContentSecurityPolicy": {
                    "Override": True,
                    "ContentSecurityPolicy": "frame-ancestors https://*.hotmart.com",
                },
            },
        }
    )
    policy_id = resp["ResponseHeadersPolicy"]["Id"]
    print("Response Headers Policy criada:", policy_id)
    return policy_id


def update_and_publish_function(c):
    dev = c.get_function(Name=FUNCTION_NAME, Stage="DEVELOPMENT")
    print("DEV ETag atual:", dev["ETag"])

    updated = c.update_function(
        Name=FUNCTION_NAME,
        IfMatch=dev["ETag"],
        FunctionConfig={
            "Comment": "Rewrite .html do export estatico + gate de /ferramentas/* pro Hotmart",
            "Runtime": "cloudfront-js-2.0",
        },
        FunctionCode=FUNCTION_CODE.encode("utf-8"),
    )
    etag = updated["ETag"]
    print("DEV atualizado. Novo ETag:", etag)

    def run_test(desc, request_overrides, expect):
        event = {
            "version": "1.0",
            "context": {"eventType": "viewer-request"},
            "viewer": {"ip": "1.2.3.4"},
            "request": {
                "method": "GET",
                "uri": "/ferramentas/calendario-do-professor",
                "querystring": {},
                "headers": {},
                "cookies": {},
            },
        }
        event["request"].update(request_overrides)
        resp = c.test_function(
            Name=FUNCTION_NAME,
            IfMatch=etag,
            Stage="DEVELOPMENT",
            EventObject=json.dumps(event).encode("utf-8"),
        )
        test_result = resp["TestResult"]
        error_msg = test_result.get("FunctionErrorMessage")
        if error_msg:
            log = test_result.get("FunctionExecutionLogs") or []
            print(f"  [ERRO] {desc}: {error_msg}")
            for line in log:
                print("    log:", line)
            raise AssertionError(f"Function lancou erro em '{desc}': {error_msg}")

        output = json.loads(test_result["FunctionOutput"])
        result = output.get("request", output.get("response"))
        ok = expect(output)
        print(f"  [{'OK' if ok else 'FALHOU'}] {desc}: {json.dumps(result)}")
        if not ok:
            raise AssertionError(f"Teste falhou: {desc} -> {output}")

    print("Testando cenarios antes de publicar:")

    run_test(
        "sem referer/cookie -> 403",
        {},
        lambda o: o.get("response", {}).get("statusCode") == 403,
    )

    run_test(
        "referer hotmart + iframe -> passa e reescreve .html",
        {
            "headers": {
                "referer": {"value": "https://sun.hotmart.com/club/aula-x"},
                "sec-fetch-dest": {"value": "iframe"},
            }
        },
        lambda o: o.get("request", {}).get("uri") == "/ferramentas/calendario-do-professor.html",
    )

    run_test(
        "referer hotmart mas sem sec-fetch-dest -> 403",
        {"headers": {"referer": {"value": "https://sun.hotmart.com/club/aula-x"}}},
        lambda o: o.get("response", {}).get("statusCode") == 403,
    )

    run_test(
        "?k= correto -> 302 + cookie",
        {"querystring": {"k": {"value": ACCESS_KEY}}},
        lambda o: o.get("response", {}).get("statusCode") == 302
        and ACCESS_COOKIE_NAME in o.get("response", {}).get("cookies", {}),
    )

    run_test(
        "cookie av_prof valido -> passa",
        {"cookies": {ACCESS_COOKIE_NAME: {"value": ACCESS_KEY}}},
        lambda o: o.get("request", {}).get("uri") == "/ferramentas/calendario-do-professor.html",
    )

    run_test(
        "rota fora de /ferramentas/ nao afetada",
        {"uri": "/cursos/classico"},
        lambda o: o.get("request", {}).get("uri") == "/cursos/classico.html",
    )

    print("Todos os testes passaram. Publicando em LIVE...")
    published = c.publish_function(Name=FUNCTION_NAME, IfMatch=etag)
    stage = published["FunctionSummary"]["FunctionMetadata"]["Stage"]
    print("Publicado. Stage:", stage)


def ensure_cache_behavior(c, cache_policy_id, response_headers_policy_id):
    dist = c.get_distribution_config(Id=DISTRIBUTION_ID)
    cfg = dist["DistributionConfig"]
    dist_etag = dist["ETag"]

    behavior = {
        "PathPattern": PATH_PATTERN,
        "TargetOriginId": ORIGIN_ID,
        "TrustedSigners": {"Enabled": False, "Quantity": 0},
        "TrustedKeyGroups": {"Enabled": False, "Quantity": 0},
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["HEAD", "GET"],
            "CachedMethods": {"Quantity": 2, "Items": ["HEAD", "GET"]},
        },
        "SmoothStreaming": False,
        "Compress": True,
        "LambdaFunctionAssociations": {"Quantity": 0},
        "FunctionAssociations": {
            "Quantity": 1,
            "Items": [
                {
                    "FunctionARN": f"arn:aws:cloudfront::291768628850:function/{FUNCTION_NAME}",
                    "EventType": "viewer-request",
                }
            ],
        },
        "FieldLevelEncryptionId": "",
        "CachePolicyId": cache_policy_id,
        "ResponseHeadersPolicyId": response_headers_policy_id,
        "GrpcConfig": {"Enabled": False},
    }

    items = cfg["CacheBehaviors"]["Items"]
    replaced = False
    for i, existing in enumerate(items):
        if existing["PathPattern"] == PATH_PATTERN:
            items[i] = behavior
            replaced = True
            break
    if not replaced:
        items.append(behavior)
    cfg["CacheBehaviors"]["Quantity"] = len(items)

    updated = c.update_distribution(Id=DISTRIBUTION_ID, IfMatch=dist_etag, DistributionConfig=cfg)
    print(
        ("Cache Behavior atualizada" if replaced else "Cache Behavior criada"),
        "para",
        PATH_PATTERN,
        "- distribution status:",
        updated["Distribution"]["Status"],
    )


def invalidate(c):
    inv = c.create_invalidation(
        DistributionId=DISTRIBUTION_ID,
        InvalidationBatch={
            "CallerReference": f"ferramentas-gate-{ACCESS_KEY[:8]}",
            "Paths": {"Quantity": 1, "Items": [PATH_PATTERN]},
        },
    )
    print("Invalidation criada:", inv["Invalidation"]["Id"])


def main():
    c = boto3.client("cloudfront", region_name=REGION)

    cache_policy_id = ensure_cache_policy(c)
    response_headers_policy_id = ensure_response_headers_policy(c)
    update_and_publish_function(c)
    ensure_cache_behavior(c, cache_policy_id, response_headers_policy_id)
    invalidate(c)

    print("\nPronto. A distribution pode levar alguns minutos para propagar (Status muda pra Deployed).")
    print(f"Chave de acesso do Ricardo: ?k={ACCESS_KEY}")
    print(
        "Teste direto (fora do Hotmart, so pra confirmar o deploy): "
        f"https://staging.amigoviolao.com/ferramentas/calendario-do-professor?k={ACCESS_KEY}"
    )
    print(
        "Depois de abrir esse link uma vez, o cookie fica valido por 1 ano e "
        "voce acessa direto sem o ?k=."
    )


if __name__ == "__main__":
    main()
