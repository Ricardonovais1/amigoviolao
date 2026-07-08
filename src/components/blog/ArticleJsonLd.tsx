import type { Post } from "@/lib/blog";

// Structured data injected into the post page: Article + BreadcrumbList in a
// single @graph. Built deterministically from the front-matter by the SEO agent.

const SITE = "https://amigoviolao.com";
const LOGO =
  "https://amigoviolao.com/wp-content/uploads/2021/05/cropped-cropped-Logo-Branca-site-Amigo-Violao-2.png.webp";

export default function ArticleJsonLd({ post }: { post: Post }) {
  const url = post.canonical || `${SITE}/blog/${post.slug}`;

  const graph = [
    {
      "@type": "Article",
      headline: post.title,
      description: post.description,
      image: post.og_image || post.featured_image,
      datePublished: post.date,
      dateModified: post.modified || post.date,
      author: { "@type": "Organization", name: "Amigo Violão", url: SITE },
      publisher: {
        "@type": "Organization",
        name: "Amigo Violão",
        logo: { "@type": "ImageObject", url: LOGO },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
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
