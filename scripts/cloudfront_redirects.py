"""
Atualiza a CloudFront Function amigo-violao-staging-url-rewrite com os 301 de
migracao do site WordPress + a normalizacao de barra final, mantendo o rewrite
de .html do export estatico.

Por que no CloudFront e nao no next.config.ts: este projeto usa
`output: "export"` (static export), e `redirects()` do Next exige um servidor
Node em runtime -- nao roda no export. Entao o 301 tem que sair no edge.

Tres comportamentos, nesta ordem:

  1. REDIRECT_MAP  -> 301 das URLs antigas do WordPress para as novas.
  2. barra final   -> 301 de "/x/" para "/x" (as URLs indexadas do WP terminam
                      em "/", e o site novo canonicaliza sem barra; sem isso a
                      mesma pagina responde 200 nos dois enderecos = conteudo
                      duplicado).
  3. rewrite .html -> comportamento existente do export estatico flat.

Uso: python scripts/cloudfront_redirects.py

Requer credenciais AWS no ambiente (boto3). Ver tambem
scripts/fix_cloudfront_trailing_slash.py, de onde veio o fluxo
update -> test -> publish -> invalidation.
"""

import json

import boto3

FUNCTION_NAME = "amigo-violao-staging-url-rewrite"
DISTRIBUTION_ID = "E2Q2YNHFJ1GG9P"

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

  // Chave de busca: sem barra final (as URLs indexadas do WordPress terminam
  // em "/", as do mapa nao).
  var key = uri !== "/" && uri.endsWith("/") ? uri.slice(0, -1) : uri;

  var REDIRECTS = __REDIRECT_MAP__;

  // 1. Migracao WordPress -> site novo.
  if (Object.prototype.hasOwnProperty.call(REDIRECTS, key)) {
    return permanent(REDIRECTS[key], request.querystring);
  }

  // 2. Barra final -> canonica sem barra.
  if (uri !== "/" && uri.endsWith("/")) {
    return permanent(key, request.querystring);
  }

  // 3. Export estatico flat: "/x" -> "/x.html".
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
"""

# uri de entrada -> resultado esperado. String = Location do 301,
# ("rewrite", "/x.html") = request repassado ao origin.
TEST_CASES = {
    "/curso-para-criancas": "/cursos/criancas",
    "/curso-para-criancas/": "/cursos/criancas",
    "/curso-de-classico/": "/cursos/classico",
    "/professor-samuel-calazans/": "/professores/samuel-calazans",
    "/ricardo-novais/": "/professores/ricardo-novais",
    "/termos-de-servico/": "/termos-de-servicos",
    "/quizzes/": "/quizzes",
    "/apreciacao-musical/": "/apreciacao-musical",
    "/blog/categoria/as-criancas-conseguem/": "/blog/categoria/as-criancas-conseguem",
    "/apreciacao-musical": ("rewrite", "/apreciacao-musical.html"),
    "/cursos/criancas": ("rewrite", "/cursos/criancas.html"),
    "/termos-de-servicos": ("rewrite", "/termos-de-servicos.html"),
    "/": ("rewrite", "/index.html"),
    "/images/logo.png": ("rewrite", "/images/logo.png"),
}


def build_code() -> bytes:
    code = FUNCTION_CODE.replace(
        "__REDIRECT_MAP__", json.dumps(REDIRECT_MAP, ensure_ascii=False)
    )
    return code.encode("utf-8")


def run_tests(client, etag: str) -> None:
    for uri, expected in TEST_CASES.items():
        event = {
            "version": "1.0",
            "context": {"eventType": "viewer-request"},
            "viewer": {"ip": "1.2.3.4"},
            "request": {
                "method": "GET",
                "uri": uri,
                "querystring": {},
                "headers": {},
                "cookies": {},
            },
        }
        resp = client.test_function(
            Name=FUNCTION_NAME,
            IfMatch=etag,
            Stage="DEVELOPMENT",
            EventObject=json.dumps(event).encode("utf-8"),
        )
        result = resp["TestResult"]
        if result.get("FunctionErrorMessage"):
            raise SystemExit(f"{uri}: erro na function -> {result['FunctionErrorMessage']}")

        output = json.loads(result["FunctionOutput"])

        if isinstance(expected, tuple):
            got = output["request"]["uri"]
            assert "response" not in output, f"{uri}: esperava rewrite, veio response"
            assert got == expected[1], f"{uri}: esperava rewrite {expected[1]}, veio {got}"
            print(f"  ok  {uri:34s} -> rewrite {got}")
        else:
            response = output.get("response")
            assert response, f"{uri}: esperava 301, veio rewrite {output['request']['uri']}"
            status = response["statusCode"]
            location = response["headers"]["location"]["value"]
            assert status == 301, f"{uri}: esperava 301, veio {status}"
            assert location == expected, f"{uri}: esperava {expected}, veio {location}"
            print(f"  ok  {uri:34s} -> 301 {location}")


def main() -> None:
    client = boto3.client("cloudfront", region_name="us-east-1")

    dev = client.get_function(Name=FUNCTION_NAME, Stage="DEVELOPMENT")
    print("DEV ETag atual:", dev["ETag"])

    updated = client.update_function(
        Name=FUNCTION_NAME,
        IfMatch=dev["ETag"],
        FunctionConfig={
            "Comment": "301 de migracao WP + barra final + rewrite .html",
            "Runtime": "cloudfront-js-2.0",
        },
        FunctionCode=build_code(),
    )
    print("DEV atualizado. Novo ETag:", updated["ETag"])

    print("\nTestes:")
    run_tests(client, updated["ETag"])

    published = client.publish_function(Name=FUNCTION_NAME, IfMatch=updated["ETag"])
    print("\nPublicado em LIVE. ETag:", published["ETag"])

    inv = client.create_invalidation(
        DistributionId=DISTRIBUTION_ID,
        InvalidationBatch={
            "CallerReference": f"redirects-{updated['ETag']}",
            "Paths": {"Quantity": 1, "Items": ["/*"]},
        },
    )
    print("Invalidation:", inv["Invalidation"]["Id"])
    print(
        "\nPronto. Em ~1min, confira:\n"
        "  curl -sI https://staging.amigoviolao.com/curso-para-criancas/ | head -3\n"
        "  curl -sI https://staging.amigoviolao.com/apreciacao-musical | head -3"
    )


if __name__ == "__main__":
    main()
