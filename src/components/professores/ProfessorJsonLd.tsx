import type { Professor } from "@/lib/professores";

// Structured data for a teacher profile: Person + BreadcrumbList in a single
// @graph, mirroring src/components/blog/ArticleJsonLd.tsx.

const SITE = "https://amigoviolao.com";

export default function ProfessorJsonLd({ professor }: { professor: Professor }) {
  const url = `${SITE}/professores/${professor.slug}`;

  const graph = [
    {
      "@type": "Person",
      name: professor.name,
      jobTitle: "Professor de violão",
      description: professor.description,
      image: professor.photo ? `${SITE}${professor.photo}` : undefined,
      address: professor.city
        ? { "@type": "PostalAddress", addressLocality: professor.city }
        : undefined,
      worksFor: { "@type": "Organization", name: "Amigo Violão", url: SITE },
      url,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Professores", item: `${SITE}/professores` },
        { "@type": "ListItem", position: 3, name: professor.title, item: url },
      ],
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (data-only, no user HTML).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
