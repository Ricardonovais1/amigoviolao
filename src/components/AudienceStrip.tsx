import Ambient from "./Ambient";
import Reveal from "./Reveal";

const audiences = [
  "Crianças de 5 a 12 anos",
  "Iniciantes do zero",
  "Professores de violão",
  "Quem busca técnicas avançadas",
];

export default function AudienceStrip() {
  // Sem seam-top: a fronteira com o herói escuro já é de alto contraste. O
  // filete existe para costurar transição macia (About sob Courses, Footer sob
  // About), não para reforçar um corte que já se lê sozinho.
  return (
    <section className="relative isolate overflow-hidden bg-sand py-20">
      <Ambient preset="light" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
            Para quem é
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-teal-text sm:text-3xl">
            Possuímos cursos de violão para:
          </h2>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-4 sm:grid sm:grid-cols-2">
          {audiences.map((audience, i) => (
            <Reveal key={audience} delay={i * 70} variant="scale">
              <span className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-teal to-teal-deep px-7 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-[transform,box-shadow] duration-300 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_18px_35px_-18px_rgba(47,159,160,0.75)] sm:whitespace-nowrap sm:text-base">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 opacity-80 transition-transform duration-300 ease-spring [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110"
                >
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {audience}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
