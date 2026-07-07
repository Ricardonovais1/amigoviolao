import Reveal from "../Reveal";

const features = [
  {
    title: "O Amigo Violão é líder",
    description:
      "Em ensinar violão para crianças de maneira divertida e eficaz.",
  },
  {
    title: "Tudo começa aqui",
    description:
      "Acesse aulas, exercícios, playbacks, cifras, tabs e suporte direto.",
  },
  {
    title: "Aprenda com os melhores!",
    description:
      "Professores especialistas em didática. Ensinar é uma arte que valorizamos.",
  },
  {
    title: "Para toda a família",
    description:
      "O acesso inclui cursos para crianças e muitos outros, para que toda a família aprenda.",
  },
];

export default function SalesWhyLearn() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-primary">
            Porque aprender no Amigo Violão?
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-black/5 p-6 text-left shadow-sm transition-shadow duration-200 ease-snappy hoverable:shadow-md">
                <h3 className="font-bold text-charcoal">{feature.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <a
            href="#comprar"
            className="mt-10 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            GARANTIR MINHA VAGA
          </a>
        </Reveal>
      </div>
    </section>
  );
}
