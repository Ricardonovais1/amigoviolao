import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfessorCard from "@/components/professores/ProfessorCard";
import { getAllProfessores, toProfessorCardData } from "@/lib/professores";

export const metadata: Metadata = {
  title: "Professores - Amigo Violão",
  description:
    "Conheça os professores certificados na metodologia Amigo Violão, de norte a sul do Brasil.",
};

export default function ProfessoresIndex() {
  const professores = getAllProfessores().map(toProfessorCardData);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-black/5 bg-cream/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Professores
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-dark">
              Conheça nossos professores
            </h1>
            <p className="mt-3 max-w-2xl text-charcoal/80">
              Educadores por todo o Brasil que levam a metodologia Amigo Violão
              para suas salas de aula, cada um com sua própria história e
              paixão pela música.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10">
          {professores.length === 0 ? (
            <p className="text-charcoal/70">Nenhum professor cadastrado ainda.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {professores.map((professor) => (
                <ProfessorCard key={professor.slug} professor={professor} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
