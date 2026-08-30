import Reveal from "../Reveal";

// Defaults deliberadamente genéricos: as quatro páginas de venda passam os
// seus próprios itens, montados a partir de src/lib/ofertas.ts. Deixar um
// default com preço ou composição concreta aqui é convite para uma página
// futura herdar número errado sem ninguém perceber.
const defaultCoreItems = [
  "As 3 Trilhas completas — Infantil, Iniciantes e Clássico",
  "Acesso por 2 anos",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

const defaultBonuses: Bonus[] = [];

type Bonus = {
  label: string;
  value: string;
  description?: string;
};

type ValueStackProps = {
  heading?: string;
  coreItems?: string[];
  bonuses?: Bonus[];
  totalNote?: string;
};

export default function ValueStack({
  heading = "Tudo o que você recebe hoje:",
  coreItems = defaultCoreItems,
  bonuses = defaultBonuses,
  totalNote,
}: ValueStackProps) {
  // Sem Ambient: PricingCTA vem logo abaixo, no mesmo bg-cream e com o próprio
  // Ambient. Duas camadas recortadas na mesma fronteira deixam uma linha de
  // banding visível em telas de gama ampla.
  return (
    <section className="relative isolate overflow-hidden bg-cream pb-1 pt-20">
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-charcoal sm:text-3xl">
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={40}>
          <ul className="mx-auto mt-8 max-w-md space-y-2 text-left">
            {coreItems.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-foreground/80">
                <span className="text-green-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {bonuses.length > 0 && (
          <Reveal delay={80}>
            <p className="mt-10 text-lg font-extrabold uppercase tracking-wide text-primary">
              E mais estes bônus:
            </p>
          </Reveal>
        )}

        <div className="mt-4 space-y-4">
          {bonuses.map((bonus, i) => (
            <Reveal key={bonus.label} delay={120 + i * 60}>
              <div className="hairline rounded-2xl bg-white p-5 text-left shadow-soft transition-[transform,box-shadow] duration-300 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-lift">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-bold text-charcoal">
                    <span className="mr-2 rounded-md bg-gradient-to-b from-primary to-primary-dark px-2 py-0.5 text-xs font-extrabold uppercase text-white shadow-[0_6px_14px_-8px_rgba(239,84,0,0.9)]">
                      Bônus {i + 1}
                    </span>
                    {bonus.label}
                  </p>
                  <p className="text-sm">
                    <span className="text-red-500/80 line-through">
                      {bonus.value}
                    </span>{" "}
                    <span className="font-bold text-green-600">grátis</span>
                  </p>
                </div>
                {bonus.description && (
                  <p className="mt-2 text-sm text-foreground/70">
                    {bonus.description}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {totalNote && (
          <Reveal delay={120 + bonuses.length * 60}>
            <p className="mt-6 text-sm font-semibold text-foreground/70">
              {totalNote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
