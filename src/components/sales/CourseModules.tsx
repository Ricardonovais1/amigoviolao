import Image from "next/image";
import Reveal from "../Reveal";

const modules = [
  {
    title: "Músicas de cordas soltas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-1-imagem-ilustrativa.jpg",
  },
  {
    title: "Escrita gráfica",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-2-imagem-ilustrativa.jpg",
  },
  {
    title: "Melodias lindas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-3-imagem-ilustrativa.jpg",
  },
  {
    title: "Músicas cifradas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-5-imagem-ilustrativa.jpg",
  },
  {
    title: "Solos de violão",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-6-imagem-ilustrativa.jpg",
  },
  {
    title: "Técnica aplicada em músicas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-4-imagem-ilustrativa.jpg",
  },
];

export default function CourseModules() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            Conteúdos do curso de violão para crianças:
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, i) => (
            <Reveal key={module.title} delay={i * 60}>
              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative aspect-[5/3] w-full">
                  <Image
                    src={module.image}
                    alt={module.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="p-4 font-semibold text-charcoal">
                  {module.title}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
