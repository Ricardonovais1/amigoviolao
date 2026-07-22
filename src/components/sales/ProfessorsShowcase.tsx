import Link from "next/link";
import Reveal from "../Reveal";
import ProfessorCard from "../professores/ProfessorCard";
import { getAllProfessores, toProfessorCardData } from "@/lib/professores";

// Prova social para a página do PROVIC: mostra alguns professores certificados
// reais e convida a conhecer o diretório completo em /professores.

export default function ProfessorsShowcase() {
  const all = getAllProfessores().map(toProfessorCardData);
  const featured = all.slice(0, 6);
  const remaining = all.length - featured.length;

  if (featured.length === 0) return null;

  return (
    <section className="bg-cream/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            Professores certificados Amigo Violão
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-foreground/70">
            Educadores por todo o Brasil que já aplicam a metodologia PROVIC
            em suas próprias aulas.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((professor, i) => (
            <div key={professor.slug} className={i >= 3 ? "hidden sm:block" : undefined}>
              <Reveal delay={i * 50}>
                <ProfessorCard professor={professor} />
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal className="mt-10 text-center" delay={featured.length * 50}>
          <Link
            href="/professores"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hoverable:bg-primary/90"
          >
            {remaining > 0
              ? `Ver todos os professores (+${remaining})`
              : "Ver todos os professores"}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
