import Reveal from "./Reveal";

const audiences = ["Crianças de 5 a 12 anos", "Jovens", "Adultos"];

export default function AudienceStrip() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-teal sm:text-3xl">
            O seu acesso inclui cursos para:
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
          {audiences.map((audience, i) => (
            <Reveal key={audience} delay={i * 60}>
              <span className="block rounded-full bg-teal px-8 py-3 text-sm font-semibold text-white sm:text-base">
                {audience}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
