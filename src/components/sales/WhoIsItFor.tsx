import Image from "next/image";
import Reveal from "../Reveal";

const audience = [
  "Para quem quer seus filhos tendo uma relação saudável e duradoura com a música;",
  "Para quem quer incentivar o violão sem traumatizar;",
  "Para quem quer que o tempo de tela de seus filhos seja de qualidade;",
  "Para crianças comuns, que não saibam nada de violão e queiram aprender;",
];

export default function WhoIsItFor() {
  return (
    <section className="bg-white pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal>
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2018/05/Ilustra%C3%A7%C3%A3o-1.png"
            alt="Ilustração de material de estudo de violão"
            width={640}
            height={701}
            className="mx-auto h-auto w-full max-w-xs"
          />
        </Reveal>

        <Reveal delay={100}>
          <h2 className="text-3xl font-extrabold text-primary">
            Para quem é o curso?
          </h2>
          <ol className="mt-6 space-y-3 text-foreground/80">
            {audience.map((item, i) => (
              <li key={i}>
                <span className="font-bold text-charcoal">{i + 1} - </span>
                {item}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
