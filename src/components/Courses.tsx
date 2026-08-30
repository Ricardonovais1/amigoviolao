import Link from "next/link";
import Ambient from "./Ambient";
import Reveal from "./Reveal";
import SpotlightGroup from "./SpotlightGroup";

const courses = [
  { title: "Curso para Crianças", href: "/cursos/criancas" },
  { title: "Curso para Iniciantes", href: "/cursos/iniciantes" },
  { title: "Curso de Clássico", href: "/cursos/classico" },
  { title: "Para Professores", href: "/cursos/professores" },
];

export default function Courses() {
  return (
    <section
      id="cursos"
      className="relative isolate overflow-hidden bg-mist py-20"
    >
      <Ambient preset="light" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
            Catálogo
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-charcoal sm:text-3xl">
            Conheça os Cursos Amigo Violão:
          </h2>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
        </Reveal>

        <SpotlightGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, i) => (
            <Reveal key={course.href} delay={i * 80} variant="blur">
              <Link
                href={course.href}
                data-spotlight
                className="hairline spotlight group flex h-full items-center justify-between gap-3 rounded-2xl bg-white px-6 py-7 text-left font-semibold text-charcoal shadow-soft transition-[transform,box-shadow,color] duration-300 ease-snappy hoverable:-translate-y-1.5 hoverable:text-primary-dark hoverable:shadow-lift active:scale-[0.98]"
              >
                {course.title}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary transition-[background-color,transform] duration-300 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
