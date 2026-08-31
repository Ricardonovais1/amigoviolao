import type { MetadataRoute } from "next";

// Necessario com output: "export" — sem isso o Next trata a rota como dinamica
// (por causa da leitura de process.env) e o build falha.
export const dynamic = "force-static";

const PRODUCTION = "https://amigoviolao.com";
const SITE = process.env.SITE_URL || PRODUCTION;
// A Vercel injeta VERCEL=1 no build. O projeto continua ligado ao repo e
// publica em amigoviolao.vercel.app a cada push no master; sem esta guarda
// esse deploy passaria a se declarar indexavel (SITE_URL vazio => PRODUCTION)
// e competiria com o dominio real por conteudo duplicado.
const IS_PRODUCTION = SITE === PRODUCTION && !process.env.VERCEL;

export default function robots(): MetadataRoute.Robots {
  // Qualquer build que nao seja o de producao (hoje staging.amigoviolao.com,
  // via SITE_URL no deploy-site.yml) bloqueia os crawlers inteiro: o staging
  // serve uma copia identica do site e seria conteudo duplicado competindo com
  // o dominio principal.
  if (!IS_PRODUCTION) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // /ferramentas/* sao ferramentas de aluno e professor, embutidas no Hotmart
    // Club. Nao sao conteudo de busca e nao devem ser indexadas.
    rules: { userAgent: "*", allow: "/", disallow: "/ferramentas/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
