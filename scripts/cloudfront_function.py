"""
Fonte unica da CloudFront Function que roda em viewer-request no site.

POR QUE ESTE ARQUIVO EXISTE: ate 2026-08-31 tres scripts diferentes
(cloudfront_redirects.py, cloudfront_ferramentas_gate.py,
fix_cloudfront_trailing_slash.py) tinham cada um a sua copia INTEIRA do
codigo da function e publicavam por cima do outro. O ultimo a rodar vencia --
foi assim que o gate do /ferramentas apagou silenciosamente os 62 redirects
301 da migracao do WordPress, e ninguem percebeu ate a vespera do corte de
DNS. Agora o codigo da function vive so aqui; quem provisiona policies e
behaviors (cloudfront_ferramentas_gate.py) importa FUNCTION_CODE deste
modulo em vez de manter a sua propria copia.

O que a function faz, nesta ordem:

  0. www.amigoviolao.com -> amigoviolao.com (301, host canonico).
  1. /ferramentas/*      -> gate do Hotmart (iframe + Referer, ou cookie de
                            bypass via ?k=<chave>).
  2. REDIRECT_MAP        -> 301 das URLs antigas do WordPress pras novas.
  3. barra final         -> 301 de "/x/" pra "/x" (o WP indexou tudo com
                            barra; o site novo canonicaliza sem).
  4. rewrite .html       -> "/x" -> "/x.html", exigido pelo export estatico
                            servido por S3+OAC (que nao resolve index.html
                            implicito como o static website hosting faria).

Por que no CloudFront e nao no next.config.ts: o projeto usa
`output: "export"`, e `redirects()` do Next exige servidor Node em runtime.

Uso:
  python scripts/cloudfront_function.py --env staging
  python scripts/cloudfront_function.py --env prod

Fluxo: update (DEVELOPMENT) -> test_function -> publish (LIVE) ->
invalidation. Requer credenciais AWS no ambiente (boto3).
"""

import argparse
import json
import time

import boto3

ENVIRONMENTS = {
    "staging": {
        "function_name": "amigo-violao-staging-url-rewrite",
        "distribution_id": "E2Q2YNHFJ1GG9P",
    },
    "prod": {
        "function_name": "amigo-violao-prod-url-rewrite",
        "distribution_id": "E3FJ0EHZEHRZ2B",
    },
}

# Gate do /ferramentas -- ver cloudfront_ferramentas_gate.py pro contexto das
# policies que fazem Referer/Sec-Fetch-Dest chegarem ate aqui. A chave nao e
# criptografia: e senha de URL, so pra barrar link circulando por ai.
ACCESS_COOKIE_NAME = "av_prof"
ACCESS_KEY = "tZT1EwL8eh6MvXkvSfJCScBS"

CANONICAL_HOST = "amigoviolao.com"
# URLs antigas (WordPress) -> URLs novas. Chaves SEM barra final: a function
# normaliza antes de consultar, entao "/curso-para-criancas/" tambem casa.
#
# NAO entram aqui, de proposito:
#
#   - Os 92 posts do blog: mantiveram os slugs originais na raiz (/<slug>),
#     entao respondem no mesmo endereco que o Google ja indexou.
#   - Os arquivos de categoria: o WordPress ja usa /blog/categoria/<slug>,
#     path identico ao do site novo (so muda a barra final, tratada em separado).
#   - As paginas da area de membros (/login, /minha-conta, /perfil, /membros,
#     /rm_login, /painel-principal-dos-cursos, ...): a area de membros foi
#     descontinuada, entao 404 e a resposta correta. Redirecionar pagina morta
#     pra Home vira soft 404 e o Google penaliza.
#
# Levantado com um diff entre a REST API do WordPress (103 posts + 106 pages) e
# as rotas que o site novo gera. Todas as chaves abaixo foram verificadas
# respondendo 200 no site atual.
REDIRECT_MAP = {
    # Paginas de venda.
    "/curso-para-criancas": "/cursos/criancas",
    "/curso-para-iniciantes": "/cursos/iniciantes",
    "/curso-para-professores": "/cursos/professores",
    "/curso-de-classico": "/cursos/classico",
    # Endereco antigo da mesma pagina de vendas do curso infantil.
    "/violao-para-criancas": "/cursos/criancas",
    # Perfis de professor: eram paginas de topo, viraram /professores/<slug>.
    # Varios professores tinham dois enderecos (com e sem o prefixo "professor-").
    "/alan-alves": "/professores/alan-alves",
    "/alexandre-zampieri": "/professores/alexandre-zampieri",
    "/einstein-solles": "/professores/einstein-solles",
    "/ivan-matias": "/professores/ivan-matias",
    "/leandro-mourao": "/professores/leandro-mourao",
    "/marcel-alcantara": "/professores/marcel-alcantara",
    "/marlon-nascimento": "/professores/marlon-nascimento",
    "/ricardo-novais": "/professores/ricardo-novais",
    "/professor-ricardo-novais": "/professores/ricardo-novais",
    "/roberta-gomes": "/professores/roberta-gomes",
    "/samuel-calazans": "/professores/samuel-calazans",
    "/professor-samuel-calazans": "/professores/samuel-calazans",
    # Legal / institucional: o WP usava o singular em "termos".
    "/termos-de-servico": "/termos-de-servicos",
    "/propriedade-intelectual": "/termos-de-servicos",
    "/quem-somos": "/sobre",
    #
    # --- Produtos legados -> pacote equivalente hoje ---------------------------
    #
    # Nomes antigos de produto que nao existem mais como SKU proprio. O criterio
    # e o catalogo atual (ver a skill de precificacao): o curso que a pagina
    # vendia hoje vive dentro de um dos quatro pacotes, e o 301 aponta pra la.
    #
    # Iniciantes.
    "/movi-metodo-otimizado-de-violao-para-iniciantes": "/cursos/iniciantes",
    "/jornada-do-violao-iniciantes": "/cursos/iniciantes",
    "/cursos-para-iniciantes": "/cursos/iniciantes",
    # Classico: INVIC era a iniciacao ao classico; LIV/LEVI eram os metodos de
    # leitura musical; Flamenco hoje e um curso dentro do pacote Classico.
    "/invic-iniciacao-ao-violao-classico": "/cursos/classico",
    "/invic-inicio": "/cursos/classico",
    "/metodo-liv": "/cursos/classico",
    "/metodo-liv-leitura-interativa-ao-violao": "/cursos/classico",
    "/metodo-levi-30-leitura-musical-no-violao-em-30-dias": "/cursos/classico",
    "/curso-tecnicas-do-violao-flamenco": "/cursos/classico",
    "/solicitar-o-guia-do-violao-classico": "/cursos/classico",
    # Criancas.
    "/curso-de-violao-querubins": "/cursos/criancas",
    "/violao-para-pais-e-filhos-ricardo-novais": "/cursos/criancas",
    "/violao-para-criancas-pais-e-filhos": "/cursos/criancas",
    "/criancas-violao": "/cursos/criancas",
    "/pagina-criancas-dezembro-2021": "/cursos/criancas",
    "/precos-e-planos-violao-para-criancas": "/cursos/criancas",
    # Formacao docente: o tier "Completo" (/cursos/professores) contem PROVIC e
    # VEM, entao as landings antigas de PROVIC e da NAVE apontam pra ele.
    "/provic-2": "/cursos/professores",
    "/provic-professor-de-violao-para-criancas": "/cursos/professores",
    "/violao-para-criancas-provic-3-0": "/cursos/professores",
    "/professor-de-violao-para-criancas-3-0": "/cursos/professores",
    "/professor-de-violao-para-criancas-3-0-2": "/cursos/professores",
    "/didatica-do-violao-para-criancas-ricardo-novais": "/cursos/professores",
    "/nave-amigo-violao": "/cursos/professores",
    "/cursos-nave-amigo-violao": "/cursos/professores",
    "/mentoria-amigo-violao": "/cursos/professores",
    "/tabela-de-precos-nave": "/cursos/professores",
    "/precos-academy": "/cursos/professores",
    "/provic-promocao-2020": "/cursos/professores",
    "/provic-semana-das-criancas": "/cursos/professores",
    "/provic-especial-mes-das-criancas": "/cursos/professores",
    # Versoes antigas da Home, que continuam vendendo a mesma coisa que a Home
    # atual vende -- destino legitimo, nao soft 404.
    "/home": "/",
    "/home-simples": "/",
    "/home-2022-n": "/",
    # Catalogo generico.
    "/cursos-2": "/cursos/criancas",
    "/pagina-de-cursos-alternativa": "/cursos/criancas",
    "/categoria-cursos": "/cursos/criancas",
    "/precos-aulas-de-violao": "/cursos/iniciantes",
    "/criancas-ou-adultos": "/",
    # Gui Clementino, Malaquias Hipoliton e Cleber Assumpcao NAO tem perfil no
    # site novo, e nao da pra criar: as paginas deles no WP sao portais de login
    # de aluno ("Suporte de aulas particulares"), sem biografia e sem nenhum
    # conteudo publico -- pertencem a area de membros descontinuada. Vao pro
    # indice de professores, que e a pagina de categoria natural desse conteudo.
    "/professor-gui-clementino": "/professores",
    "/professor-malaquias-hipoliton": "/professores",
    "/professor-cleber-assumpcao": "/professores",
    "/certificado-edson-lucas-borges": "/professores",
}

FUNCTION_CODE = """function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var headers = request.headers;
  var querystring = request.querystring;
  var cookies = request.cookies;

  // 0. Host canonico: www -> apex. O header "host" sempre chega na function
  // em viewer-request (ao contrario de referer/sec-fetch-dest, que so chegam
  // se a cache policy da behavior encaminhar).
  var host = headers.host && headers.host.value ? headers.host.value.toLowerCase() : "";
  if (host === "www.__CANONICAL_HOST__") {
    return permanent("https://__CANONICAL_HOST__" + uri, querystring);
  }

  // 1. Gate do /ferramentas/*: so abre embutido no Hotmart, ou com a chave.
  if (uri.indexOf("/ferramentas/") === 0) {
    var COOKIE_NAME = "__COOKIE_NAME__";
    var ACCESS_KEY = "__ACCESS_KEY__";

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

  // Chave de busca: sem barra final (as URLs indexadas do WordPress terminam
  // em "/", as do mapa nao).
  var key = uri !== "/" && uri.endsWith("/") ? uri.slice(0, -1) : uri;

  var REDIRECTS = __REDIRECT_MAP__;

  // 2. Migracao WordPress -> site novo.
  if (Object.prototype.hasOwnProperty.call(REDIRECTS, key)) {
    return permanent(REDIRECTS[key], querystring);
  }

  // 3. Barra final -> canonica sem barra.
  if (uri !== "/" && uri.endsWith("/")) {
    return permanent(key, querystring);
  }

  // 4. Export estatico flat: "/x" -> "/x.html".
  if (uri === "/") {
    request.uri = "/index.html";
  } else if (!uri.includes(".")) {
    request.uri += ".html";
  }

  return request;
}

function permanent(location, querystring) {
  var qs = buildQueryString(querystring);
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      "location": { "value": location + qs },
      "cache-control": { "value": "max-age=3600" }
    }
  };
}

// Preserva a query string (utm_*, gclid) atraves do redirect -- sem isso a
// atribuicao de campanha se perde no salto.
function buildQueryString(querystring) {
  var parts = [];
  for (var key in querystring) {
    var param = querystring[key];
    if (param.multiValue) {
      for (var i = 0; i < param.multiValue.length; i++) {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(param.multiValue[i].value));
      }
    } else if (param.value === "") {
      parts.push(encodeURIComponent(key));
    } else {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(param.value));
    }
  }
  return parts.length ? "?" + parts.join("&") : "";
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
"""


def build_code() -> bytes:
    code = (
        FUNCTION_CODE.replace("__REDIRECT_MAP__", json.dumps(REDIRECT_MAP, ensure_ascii=False))
        .replace("__CANONICAL_HOST__", CANONICAL_HOST)
        .replace("__COOKIE_NAME__", ACCESS_COOKIE_NAME)
        .replace("__ACCESS_KEY__", ACCESS_KEY)
    )
    return code.encode("utf-8")


# (uri, headers, cookies, querystring, esperado), com esperado sendo
#   ("301"|"302", location) | ("403", None) | ("rewrite", uri repassado ao origin)
HOTMART = {
    "referer": {"value": "https://club.hotmart.com/aula/1"},
    "sec-fetch-dest": {"value": "iframe"},
}
WWW = {"host": {"value": "www.amigoviolao.com"}}
APEX = {"host": {"value": "amigoviolao.com"}}
FERRAMENTA = "/ferramentas/calendario-do-professor"

TEST_CASES = [
    # Host canonico.
    ("/", WWW, {}, {}, ("301", "https://amigoviolao.com/")),
    ("/blog", WWW, {}, {}, ("301", "https://amigoviolao.com/blog")),
    ("/cursos/criancas", WWW, {}, {}, ("301", "https://amigoviolao.com/cursos/criancas")),
    # Migracao WordPress.
    ("/curso-para-criancas", APEX, {}, {}, ("301", "/cursos/criancas")),
    ("/curso-para-criancas/", APEX, {}, {}, ("301", "/cursos/criancas")),
    ("/curso-de-classico/", APEX, {}, {}, ("301", "/cursos/classico")),
    ("/professor-samuel-calazans/", APEX, {}, {}, ("301", "/professores/samuel-calazans")),
    ("/termos-de-servico/", APEX, {}, {}, ("301", "/termos-de-servicos")),
    # Barra final.
    ("/quizzes/", APEX, {}, {}, ("301", "/quizzes")),
    ("/apreciacao-musical/", APEX, {}, {}, ("301", "/apreciacao-musical")),
    (
        "/blog/categoria/as-criancas-conseguem/",
        APEX,
        {},
        {},
        ("301", "/blog/categoria/as-criancas-conseguem"),
    ),
    # Rewrite do export estatico.
    ("/", APEX, {}, {}, ("rewrite", "/index.html")),
    ("/apreciacao-musical", APEX, {}, {}, ("rewrite", "/apreciacao-musical.html")),
    ("/cursos/criancas", APEX, {}, {}, ("rewrite", "/cursos/criancas.html")),
    ("/images/logo.png", APEX, {}, {}, ("rewrite", "/images/logo.png")),
    # Gate do /ferramentas.
    (FERRAMENTA, APEX, {}, {}, ("403", None)),
    (FERRAMENTA, dict(APEX, **HOTMART), {}, {}, ("rewrite", FERRAMENTA + ".html")),
    (FERRAMENTA, APEX, {ACCESS_COOKIE_NAME: {"value": ACCESS_KEY}}, {}, ("rewrite", FERRAMENTA + ".html")),
    (FERRAMENTA, APEX, {}, {"k": {"value": ACCESS_KEY}}, ("302", FERRAMENTA)),
    # A query string tem que sobreviver ao 301 (atribuicao de campanha).
    ("/curso-para-criancas/", APEX, {}, {"utm_source": {"value": "fb"}}, ("301", "/cursos/criancas?utm_source=fb")),
]


def run_tests(client, function_name: str, etag: str) -> None:
    for uri, headers, cookies, querystring, expected in TEST_CASES:
        event = {
            "version": "1.0",
            "context": {"eventType": "viewer-request"},
            "viewer": {"ip": "1.2.3.4"},
            "request": {
                "method": "GET",
                "uri": uri,
                "querystring": querystring,
                "headers": headers,
                "cookies": cookies,
            },
        }
        result = client.test_function(
            Name=function_name,
            IfMatch=etag,
            Stage="DEVELOPMENT",
            EventObject=json.dumps(event).encode("utf-8"),
        )["TestResult"]
        if result.get("FunctionErrorMessage"):
            raise SystemExit(f"{uri}: erro na function -> {result['FunctionErrorMessage']}")

        output = json.loads(result["FunctionOutput"])
        kind, want = expected
        label = f"{uri} [{headers.get('host', {}).get('value', '-')}]"

        if kind == "rewrite":
            assert "response" not in output, f"{label}: esperava rewrite, veio response"
            got = output["request"]["uri"]
            assert got == want, f"{label}: esperava rewrite {want}, veio {got}"
            print(f"  ok  {label:58s} -> rewrite {got}")
        else:
            response = output.get("response")
            assert response, f"{label}: esperava {kind}, veio rewrite {output['request']['uri']}"
            status = str(response["statusCode"])
            assert status == kind, f"{label}: esperava {kind}, veio {status}"
            if want is None:
                print(f"  ok  {label:58s} -> {status}")
            else:
                got = response["headers"]["location"]["value"]
                assert got == want, f"{label}: esperava {want}, veio {got}"
                print(f"  ok  {label:58s} -> {status} {got}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Publica a CloudFront Function do site.")
    parser.add_argument("--env", choices=sorted(ENVIRONMENTS), required=True)
    parser.add_argument("--no-invalidate", action="store_true")
    args = parser.parse_args()

    env = ENVIRONMENTS[args.env]
    function_name = env["function_name"]
    distribution_id = env["distribution_id"]
    client = boto3.client("cloudfront", region_name="us-east-1")

    code = build_code()
    print(f"{args.env}: {function_name} ({len(code)} bytes; limite 10 KB)")
    if len(code) > 10 * 1024:
        raise SystemExit("codigo acima do limite de 10 KB da CloudFront Function")

    config = {"Comment": "url rewrite + 301 da migracao WP + gate /ferramentas", "Runtime": "cloudfront-js-2.0"}
    try:
        etag = client.get_function(Name=function_name, Stage="DEVELOPMENT")["ETag"]
        etag = client.update_function(
            Name=function_name, IfMatch=etag, FunctionConfig=config, FunctionCode=code
        )["ETag"]
    except client.exceptions.NoSuchFunctionExists:
        etag = client.create_function(Name=function_name, FunctionConfig=config, FunctionCode=code)["ETag"]
        print("  function criada")

    print("\ntestes:")
    run_tests(client, function_name, etag)

    published = client.publish_function(Name=function_name, IfMatch=etag)
    print("\npublicado em LIVE:", published["FunctionSummary"]["FunctionMetadata"]["FunctionARN"])

    if not args.no_invalidate and not distribution_id.startswith("__"):
        inv = client.create_invalidation(
            DistributionId=distribution_id,
            InvalidationBatch={
                "Paths": {"Quantity": 1, "Items": ["/*"]},
                "CallerReference": f"fn-{int(time.time())}",
            },
        )
        print("invalidacao:", inv["Invalidation"]["Id"])


if __name__ == "__main__":
    main()
