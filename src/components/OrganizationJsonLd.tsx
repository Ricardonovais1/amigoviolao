// Structured data for the site as a whole: Organization schema, injected once
// in the root layout. Mirrors the conventions in blog/ArticleJsonLd.tsx.

const SITE = "https://amigoviolao.com";
// JSON-LD exige URL absoluta — root-relative aqui e o Google descarta o logo.
const LOGO = `${SITE}/images/logo-amigo-violao-branco.webp`;

export default function OrganizationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Amigo Violão",
    url: SITE,
    logo: LOGO,
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (data-only, no user HTML).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
