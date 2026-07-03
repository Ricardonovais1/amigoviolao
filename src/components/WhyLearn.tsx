import Image from "next/image";
import Reveal from "./Reveal";

const features = [
  {
    title: "Especialistas em violão",
    description:
      "Metodologia criada por quem ensina violão há mais de 20 anos, para todas as idades.",
  },
  {
    title: "Tudo para você aprender",
    description:
      "Videoaulas, jogos musicais interativos e certificados a cada módulo concluído.",
  },
  {
    title: "Didática em primeiro lugar",
    description:
      "Conteúdo simples e direto, sem deixar dúvidas para o educador e o educando.",
  },
  {
    title: "Turma de dúvidas responsável",
    description:
      "Suporte por WhatsApp, comunidade e lives ao vivo para tirar todas as suas dúvidas.",
  },
];

export default function WhyLearn() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="text-3xl font-extrabold text-primary">
                Porque aprender no Amigo Violão?
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Image
                src="https://amigoviolao.com/wp-content/uploads/2022/01/Amigo-Violao.png.webp"
                alt="Pessoas aprendendo violão juntas"
                width={480}
                height={320}
                className="mt-8 h-auto w-full max-w-sm"
              />
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 70}>
                <div className="rounded-2xl border border-black/5 p-6 shadow-sm transition-shadow duration-200 ease-snappy hoverable:shadow-md">
                  <h3 className="font-bold text-charcoal">{feature.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
