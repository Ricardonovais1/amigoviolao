import Image from "next/image";
import Reveal from "../Reveal";

type LearnForRealProps = {
  headingHighlight?: string;
  headingRest?: string;
  highlightPosition?: "first" | "second";
  paragraph?: string;
  image?: { src: string; alt: string; width: number; height: number };
  imagePosition?: "left" | "right";
};

export default function LearnForReal({
  headingHighlight = "Aprenda violão de verdade",
  headingRest = "para tocar o que quiser",
  highlightPosition = "first",
  paragraph = "O jeito Amigo Violão de aprender é o que possibilita iniciantes, inclusive crianças e aqueles com mais dificuldade, chegarem mais rápido e de forma mais prazerosa ao objetivo de tocar violão com os amigos. O segredo está em músicas que te permitem tocar com excelência desde a primeira aula, aquilo que é proposto.",
  image = {
    src: "https://amigoviolao.com/wp-content/uploads/2021/06/Duple-de-violao-2.png",
    alt: "Duas pessoas tocando violão juntas",
    width: 600,
    height: 500,
  },
  imagePosition = "right",
}: LearnForRealProps) {
  const textOrder = imagePosition === "right" ? "order-1" : "order-2";
  const imageOrder = imagePosition === "right" ? "order-2" : "order-1";
  const highlight = (
    <span className="text-primary">{headingHighlight}</span>
  );
  const rest = <span className="text-charcoal">{headingRest}</span>;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal className={textOrder}>
          <h2 className="text-3xl font-extrabold">
            {highlightPosition === "first" ? (
              <>
                {highlight} {rest}
              </>
            ) : (
              <>
                {rest} {highlight}
              </>
            )}
          </h2>
          <p className="mt-6 text-foreground/80">{paragraph}</p>
        </Reveal>

        <Reveal delay={100} className={imageOrder}>
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
