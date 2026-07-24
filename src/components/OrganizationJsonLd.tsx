// Structured data for the site as a whole: Organization schema, injected once
// in the root layout. Mirrors the conventions in blog/ArticleJsonLd.tsx.

const SITE = "https://amigoviolao.com";
const LOGO =
  "https://amigoviolao.com/wp-content/uploads/2021/05/cropped-cropped-Logo-Branca-site-Amigo-Violao-2.png.webp";

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
