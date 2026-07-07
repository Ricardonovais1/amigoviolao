import Image from "next/image";
import Reveal from "../Reveal";

const defaultMistakes = [
  "Acreditar que todas as crianças vão aprender como nós mesmos aprendemos;",
  "Infantilizar demasiadamente a abordagem com as crianças;",
  "Facilitar ao máximo na explicação, com excelente didática, mas usando material que não leva em consideração a cognição infantil (cifras, partituras, teoria);",
  "Acreditar que ensinar para crianças, por ser mais “básico”, é mais fácil;",
];

type CommonMistakesProps = {
  headingHighlight?: string;
  headingRest?: string;
  highlightColor?: "primary" | "charcoal";
  items?: string[];
  image?: { src: string; alt: string; width: number; height: number };
};

export default function CommonMistakes({
  headingHighlight = "Principais erros",
  headingRest = "no ensino do violão para crianças",
  highlightColor = "primary",
  items = defaultMistakes,
  image = {
    src: "https://amigoviolao.com/wp-content/uploads/2021/12/Criancas-com-violao-NAVE.png",
    alt: "Ilustração de crianças aprendendo violão",
    width: 600,
    height: 500,
  },
}: CommonMistakesProps) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <h2 className="text-3xl font-extrabold">
            <span
              className={
                highlightColor === "primary" ? "text-primary" : "text-charcoal"
              }
            >
              {headingHighlight}
            </span>{" "}
            <span className="text-charcoal">{headingRest}</span>
          </h2>
          <ol className="mt-6 space-y-3 text-foreground/80">
            {items.map((item, i) => (
              <li key={i}>
                <span className="font-bold text-charcoal">{i + 1} - </span>
                {item}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={100} className="order-1 md:order-2">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="mx-auto h-auto w-full max-w-md"
          />
        </Reveal>
      </div>
    </section>
  );
}
