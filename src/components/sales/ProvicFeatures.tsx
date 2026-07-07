import Reveal from "../Reveal";

const features = [
  {
    icon: "📋",
    title: "Aulas Passo a Passo",
    description:
      "Vídeos detalhados e objetivos com tudo para você aplicar",
  },
  {
    icon: "🎧",
    title: "Áudios Para Suas Aulas",
    description: "Você pode baixar ou ouvir de dentro da área exclusiva",
  },
  {
    icon: "💬",
    title: "Mentoria Para Tirar Dúvidas",
    description: "Suporte direto por WhatsApp e Grupo de Alunos",
  },
  {
    icon: "🏆",
    title: "Certificado De 45 Horas",
    description: "Este certificado é baseado nas avaliações do curso",
  },
];

export default function ProvicFeatures() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            O PROVIC tem:
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 70}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/15 text-3xl">
                {feature.icon}
              </div>
              <h3 className="mt-4 font-bold text-charcoal">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
