import type { MetadataRoute } from "next";

// Necessario com output: "export" — sem isso o Next trata a rota como dinamica
// (por causa da leitura de process.env) e o build falha.
export const dynamic = "force-static";

const PRODUCTION = "https://amigoviolao.com";
const SITE = process.env.SITE_URL || PRODUCTION;

export default function robots(): MetadataRoute.Robots {
  // Qualquer build que nao seja o de producao (hoje staging.amigoviolao.com,
  // via SITE_URL no deploy-site.yml) bloqueia os crawlers inteiro: o staging
  // serve uma copia identica do site e seria conteudo duplicado competindo com
  // o dominio principal.
  if (SITE !== PRODUCTION) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
