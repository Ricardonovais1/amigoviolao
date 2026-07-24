import Image from "next/image";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "O Amigo Violão me deu conhecimento e confiança para explorar o ensino do violão. O método do Ricardo Novais é simples e direto, não deixando dúvidas para o educador e o educando.",
    name: "Júnior Oliveira",
    city: "São Paulo",
    avatar: "/images/testimonials/junior-oliveira.jpg",
  },
  {
    quote:
      "Ricardo Novais preparou meticulosamente o conteúdo. Graças à sua paciência e senso de organização didática, ele abre as portas para o aprendizado do violão de uma maneira fácil e objetiva.",
    name: "Marlon Nascimento",
    city: "Belo Horizonte",
    avatar: "/images/testimonials/marlon-nascimento.jpg",
  },
  {
    quote:
      "Estou utilizando o Amigo Violão nas minhas aulas. O conteúdo é exatamente a proposta pedagógica do projeto e também o que eu sempre busquei no ensino do violão, unindo o lado técnico ao lúdico.",
    name: "Renato Lourenço",
    city: "Araçatuba",
    avatar: null,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-charcoal py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 text-center" delay={0}>
          <div className="mb-4 flex justify-center gap-1 text-2xl text-amber-400">
            {"★★★★★"}
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Professores aprovam a metodologia
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-2xl bg-white/5 p-6">
                <blockquote className="flex-1 text-sm italic leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {t.avatar ? (
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-white/60">{t.city}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
