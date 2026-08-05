import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { getAllProfessores } from "@/lib/professores";
import { getAllQuizzes } from "@/lib/quizzes";
import { postPath, categoryPath } from "@/lib/routes";

// Sitemap nativo do Next (funciona com output: "export" -> vira out/sitemap.xml
// no build). Substitui o next-sitemap, cuja versao 4.2.3 nao le os manifests do
// Next 16 e gerava um <sitemapindex> vazio.

// Necessario com output: "export" — sem isso o Next trata a rota como dinamica
// (por causa da leitura de process.env) e o build falha.
export const dynamic = "force-static";

const SITE = process.env.SITE_URL || "https://amigoviolao.com";

const url = (path: string) => `${SITE}${path === "/" ? "" : path}`;

// Paginas sem fonte de dados — listadas a mao. Ao criar uma pagina nova de
// topo, acrescente aqui.
const STATIC_PATHS: Array<[path: string, priority: number]> = [
  ["/", 1.0],
  ["/blog", 0.9],
  ["/cursos/criancas", 0.9],
  ["/cursos/iniciantes", 0.9],
  ["/cursos/professores", 0.9],
  ["/cursos/classico", 0.9],
  ["/professores", 0.7],
  ["/sobre", 0.7],
  ["/quizzes", 0.7],
  ["/contato", 0.5],
  ["/politica-de-privacidade", 0.2],
  ["/politicas-de-cancelamento", 0.2],
  ["/termos-de-servicos", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map(([path, priority]) => ({
    url: url(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  // Posts na raiz (/<slug>) — mesmos slugs do WordPress antigo.
  const posts = getAllPosts().map((post) => ({
    url: url(postPath(post.slug)),
    lastModified: new Date(post.modified || post.date || now),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = getAllCategories().map((cat) => ({
    url: url(categoryPath(cat.slug)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const professores = getAllProfessores().map((professor) => ({
    url: url(`/professores/${professor.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const quizzes = getAllQuizzes().map((quiz) => ({
    url: url(`/quiz/${quiz.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...posts, ...categories, ...professores, ...quizzes];
}
