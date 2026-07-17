import Image from "next/image";
import Reveal from "../Reveal";

const defaultItems = [
  {
    title: "Organização do estudo",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
  {
    title: "Curso de improvisação",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
  {
    title: "Curso de Guitar Pro",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Copia-de-Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
  {
    title: "Tópicos de Violão Popular",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Copia-de-Copia-de-Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
];

type CrossSellProps = {
  heading?: string | null;
  items?: { title: string; image: string; subtitle?: string }[];
  columns?: 3 | 4;
  topPadding?: "normal" | "none";
};

export default function CrossSell({
  heading = "Aprenda também:",
  items = defaultItems,
  columns = 4,
  topPadding = "normal",
}: CrossSellProps) {
  return (
    <section
      className={`bg-white pb-16 ${topPadding === "none" ? "pt-0" : "pt-16"}`}
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        {heading && (
          <Reveal>
            <h2 className="text-2xl font-extrabold text-charcoal">
              {heading}
            </h2>
          </Reveal>
        )}

        <div
          className={`grid gap-4 sm:grid-cols-2 ${
            heading ? "mt-8" : "mt-0"
          } ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
        >
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div>
                <div className="relative aspect-[640/396] overflow-hidden rounded-lg shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      columns === 3
                        ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className="object-cover"
                  />
                </div>
                {item.subtitle && (
                  <p className="mt-2 text-sm text-primary">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
