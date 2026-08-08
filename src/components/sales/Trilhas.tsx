import Reveal from "../Reveal";
import type { Trilha } from "@/lib/ofertas";

type TrilhasProps = {
  heading: string;
  subheading?: string;
  trilhas: Trilha[];
  /** Trilha que dá a promessa da página — ganha destaque visual. */
  destaque?: Trilha["id"];
  /** Rótulo da trilha em destaque, em laranja. */
  rotuloDestaque?: string;
  /**
   * Rótulo das demais trilhas, em verde. É o que transforma a seção inteira
   * em ganho percebido: sem ele, o leitor pode ler as outras duas como cursos
   * à venda em vez de conteúdo que já vem junto.
   */
  rotuloSecundario?: string;
};

/**
 * As trilhas são o conteúdo principal da oferta, não bônus. Esta seção ocupa o
 * lugar do antigo bloco de cross-sell, que anunciava curso inteiro como brinde
 * — o que encolhia a promessa em vez de aumentá-la.
 */
export default function Trilhas({
  heading,
  subheading,
  trilhas,
  destaque,
  rotuloDestaque = "O seu ponto de partida",
  rotuloSecundario,
}: TrilhasProps) {
  return (
    <section className="bg-cream/50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold text-charcoal sm:text-3xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
              {subheading}
            </p>
          )}
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {trilhas.map((trilha, i) => {
            const emDestaque = trilha.id === destaque;
            return (
              <Reveal key={trilha.id} delay={i * 70}>
                <div
                  className={`flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ${
                    emDestaque ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {emDestaque ? (
                    <span className="mb-3 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-primary">
                      {rotuloDestaque}
                    </span>
                  ) : (
                    rotuloSecundario && (
                      <span className="mb-3 self-start rounded-full bg-green-600/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-green-700">
                        {rotuloSecundario}
                      </span>
                    )
                  )}
                  <h3 className="text-lg font-extrabold text-charcoal">
                    {trilha.nome}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {trilha.resumo}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-cream pt-4">
                    {trilha.cursos.map((curso) => (
                      <li
                        key={curso}
                        className="flex gap-2 text-sm text-foreground/80"
                      >
                        <span className="text-teal-text">✓</span>
                        <span>{curso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
