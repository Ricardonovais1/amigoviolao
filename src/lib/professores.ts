import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Build-time Jamstack data layer for teacher profiles, mirroring src/lib/blog.ts.
// Each professor is a Markdown file in content/professores/*.md: front-matter
// carries the structured fields (photo, city, contact), the body is the
// teacher's own words (what they love about teaching, favorite artists, tips,
// videos) rendered with the same PostBody renderer used for blog posts.

const PROFESSORES_DIR = path.join(process.cwd(), "content", "professores");

export interface ProfessorFrontmatter {
  name: string;
  title: string;
  slug: string;
  city?: string;
  photo?: string;
  whatsapp?: string;
  email?: string;
  description: string;
  date: string;
  modified?: string;
}

export interface Professor extends ProfessorFrontmatter {
  /** Raw Markdown body (front-matter stripped) — the teacher's own words. */
  content: string;
}

/** Lightweight card projection for listing pages. */
export interface ProfessorCardData {
  slug: string;
  name: string;
  title: string;
  city?: string;
  photo?: string;
  description: string;
}

export const toProfessorCardData = (professor: Professor): ProfessorCardData => ({
  slug: professor.slug,
  name: professor.name,
  title: professor.title,
  city: professor.city,
  photo: professor.photo,
  description: professor.description,
});

function readProfessorFile(fileName: string): Professor {
  const raw = fs.readFileSync(path.join(PROFESSORES_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<ProfessorFrontmatter>;
  return {
    name: fm.name ?? "",
    title: fm.title ?? fm.name ?? "",
    slug: fm.slug ?? fileName.replace(/\.md$/, ""),
    city: fm.city,
    photo: fm.photo,
    whatsapp: fm.whatsapp,
    email: fm.email,
    description: fm.description ?? "",
    date: fm.date ?? "",
    modified: fm.modified,
    content: content.trim(),
  };
}

export function getAllProfessores(): Professor[] {
  if (!fs.existsSync(PROFESSORES_DIR)) return [];
  return fs
    .readdirSync(PROFESSORES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readProfessorFile)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function getProfessor(slug: string): Professor | undefined {
  return getAllProfessores().find((p) => p.slug === slug);
}

export function professorWhatsappHref(whatsapp: string, name: string): string {
  const message = `Olá, ${name}! Vi seu perfil no site do Amigo Violão e gostaria de saber mais sobre suas aulas de violão.`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
