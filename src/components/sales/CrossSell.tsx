import Image from "next/image";
import Reveal from "../Reveal";

const items = [
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

export default function CrossSell() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal">
            Aprenda também:
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="relative aspect-video overflow-hidden rounded-lg shadow-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
