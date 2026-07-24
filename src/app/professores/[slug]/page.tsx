import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostBody from "@/components/blog/PostBody";
import ProfessorPhoto from "@/components/professores/ProfessorPhoto";
import ProfessorContact from "@/components/professores/ProfessorContact";
import ProfessorJsonLd from "@/components/professores/ProfessorJsonLd";
import { getAllProfessores, getProfessor } from "@/lib/professores";

// Statically generate every teacher profile at build time (Jamstack).
export function generateStaticParams() {
  return getAllProfessores().map((professor) => ({ slug: professor.slug }));
}

// Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const professor = getProfessor(slug);
  if (!professor) return {};

  return {
    title: `${professor.title} - Amigo Violão`,
    description: professor.description,
    openGraph: {
      title: professor.title,
      description: professor.description,
      type: "profile",
      images: professor.photo ? [{ url: professor.photo }] : undefined,
    },
  };
}

export default async function ProfessorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const professor = getProfessor(slug);
  if (!professor) notFound();

  return (
    <>
      <Header />
      <ProfessorJsonLd professor={professor} />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-12">
          <nav className="mb-6 text-sm text-charcoal/60">
            <Link href="/" className="hoverable:text-primary">
              Início
            </Link>
            <span className="mx-2">/</span>
            <Link href="/professores" className="hoverable:text-primary">
              Professores
            </Link>
          </nav>

          <header className="flex flex-col items-center text-center">
            <ProfessorPhoto src={professor.photo} alt={professor.name} size={140} />
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-dark sm:text-4xl">
              {professor.title}
            </h1>
            {professor.city ? (
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-teal-text">
                {professor.city}
              </p>
            ) : null}
            <ProfessorContact
              name={professor.name}
              whatsapp={professor.whatsapp}
              email={professor.email}
            />
          </header>

          <div className="mt-10 border-t border-black/10 pt-10">
            <PostBody content={professor.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
