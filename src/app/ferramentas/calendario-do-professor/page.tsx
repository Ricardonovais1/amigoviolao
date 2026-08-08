import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalendarioClient from "@/components/ferramentas/CalendarioClient";

// Ferramenta de aluno/professor: fica fora do índice e fora do sitemap. A
// proteção de verdade é a CloudFront Function em viewer-request; o noindex
// aqui é a segunda camada, para o caso da URL vazar por outro caminho.
export const metadata: Metadata = {
  title: "Calendário do Professor - Amigo Violão",
  description:
    "Gere o calendário de aulas do seu aluno, com feriados e semanas de descanso remunerado já calculados.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function CalendarioDoProfessorPage() {
  return (
    <>
      <Header />
      {/* Fundo escuro: as duas folhas A4 brancas da pré-visualização são o
          assunto da tela, e sobre o branco elas sumiam na página. */}
      <main className="flex-1 bg-dark">
        <section className="border-b border-white/10 py-10">
          <div className="mx-auto max-w-[1600px] px-6">
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Calendário do Professor
            </h1>
            <p className="mt-2 max-w-3xl text-white/60">
              Monte o calendário do seu aluno com os dias de aula, os feriados e
              as semanas de descanso remunerado já calculados. O documento sai
              em PDF de duas páginas e serve também de contrato.
            </p>
          </div>
        </section>
        <CalendarioClient />
      </main>
      <Footer />
    </>
  );
}
