import Reveal from "../Reveal";

export type CurriculumModule = {
  /** "Módulo 1 — Rasgueos" */
  title: string;
  /** Contagem de aulas do módulo, já formatada: "9 videoaulas". */
  lessons: string;
  description: string;
};

export type CurriculumStat = {
  value: string;
  label: string;
};

type CourseCurriculumProps = {
  heading: string;
  subheading?: string;
  stats: CurriculumStat[];
  /** Aulas que vêm antes do módulo 1 (abertura, boas-vindas). */
  opening?: string[];
  modules: CurriculumModule[];
  /** Aula de encerramento, depois do último módulo. */
  closing?: string;
  note?: string;
};

/**
 * O programa do curso em texto, com a contagem de aulas por módulo.
 *
 * Existe ao lado do `CourseModules` (a grade de artes) porque as duas seções
 * respondem a perguntas diferentes: a arte mostra *quais técnicas* o curso
 * cobre, esta mostra *quanta aula* existe ali dentro — que é o que decide a
 * compra de quem está comparando cursos.
 */
export default function CourseCurriculum({
  heading,
  subheading,
  stats,
  opening,
  modules,
  closing,
  note,
}: CourseCurriculumProps) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mx-auto mt-4 max-w-2xl text-foreground/75">
              {subheading}
            </p>
          )}
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div className="hairline h-full rounded-2xl bg-primary-soft px-4 py-6 text-center shadow-soft">
                <p className="text-2xl font-extrabold text-primary-dark">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-charcoal">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {opening && opening.length > 0 && (
          <Reveal delay={80} className="mt-10">
            <div className="hairline rounded-2xl bg-cream px-6 py-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-text">
                Para começar
              </p>
              <ul className="mt-3 space-y-1.5 text-foreground/80">
                {opening.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-primary-dark">
                      ▸
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {/* Grade de <div>, não <ol>: o Reveal envolve cada card com uma div, e
            uma div entre <ol> e <li> é marcação inválida. A ordem já está no
            texto — "Módulo 1", "Módulo 2" — e no número de cada cartão. */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {modules.map((module, i) => (
            <Reveal key={module.title} delay={i * 50}>
              <div className="hairline flex h-full gap-4 rounded-2xl bg-white p-5 shadow-soft transition-shadow duration-300 ease-snappy hoverable:shadow-lift">
                {/* Sem aria-hidden: como a grade não é mais um <ol>, este
                    número é o que diz a ordem do módulo também para quem
                    navega por leitor de tela. */}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/20 text-base font-extrabold text-teal-text">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-charcoal">{module.title}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-primary-dark">
                    {module.lessons}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                    {module.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {closing && (
          <Reveal delay={80} className="mt-6">
            <div className="hairline rounded-2xl bg-cream px-6 py-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-text">
                Para fechar
              </p>
              <p className="mt-3 flex gap-2.5 text-foreground/80">
                <span aria-hidden="true" className="text-primary-dark">
                  ▸
                </span>
                {closing}
              </p>
            </div>
          </Reveal>
        )}

        {note && (
          <Reveal delay={120}>
            <p className="mt-8 text-center text-sm text-foreground/70">{note}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
