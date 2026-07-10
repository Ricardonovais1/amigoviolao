import Reveal from "../Reveal";

const defaultCoreItems = [
  "Curso completo de violão para crianças (5 módulos)",
  "Acesso por 2 anos na plataforma NAVE",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

const defaultBonuses = [
  {
    label: "Curso de Violão para Iniciantes",
    value: "R$ 479,00",
    description:
      "O método completo para quem está começando do zero — perfeito para você aprender junto com seu filho.",
  },
  {
    label: "Iniciação ao Violão Clássico",
    value: "R$ 479,00",
    description:
      "Primeiros passos no violão erudito, com técnica de dedilhado e repertório clássico.",
  },
  {
    label: "Violão GOSPEL",
    value: "R$ 197,00",
    description:
      "Repertório gospel adaptado para o violão, para tocar em família as músicas que vocês já amam.",
  },
  {
    label: "Jogos musicais interativos",
    value: "R$ 197,00",
    description:
      "Quizzes e jogos que transformam o estudo em brincadeira e mantêm a criança motivada.",
  },
];

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
  totalNote = "Somando apenas os bônus, são R$ 1.352,00 em conteúdos que você leva sem pagar nada a mais.",
}: ValueStackProps) {
  return (
    <section className="bg-cream pt-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
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

        <Reveal delay={80}>
          <p className="mt-10 text-lg font-extrabold uppercase tracking-wide text-primary">
            E mais estes bônus:
          </p>
        </Reveal>

        <div className="mt-4 space-y-4">
          {bonuses.map((bonus, i) => (
            <Reveal key={bonus.label} delay={120 + i * 60}>
              <div className="rounded-xl bg-white p-5 text-left shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-bold text-charcoal">
                    <span className="mr-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-extrabold uppercase text-primary">
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
