import Image from "next/image";
import Reveal from "../Reveal";

const videos = [
  { id: "U1k2A6-iwp8", title: "Valsa Venezuelana nº3 - A. Lauro" },
  { id: "CYpwNDINqq4", title: "Mazurca Choro - H. Villa-Lobos" },
  { id: "A7c3rVZDPb4", title: "Uma Valsa e Dois Amores - Dilermando Reis" },
  { id: "JJjDa1Rz-EY", title: '"Se ela perguntar" - Dilermando Reis' },
];

export default function RicardoPlaying() {
  return (
    <section className="bg-teal py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Professor Ricardo tocando
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <Reveal key={video.id} delay={i * 60}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-video overflow-hidden rounded-xl bg-dark transition-transform duration-150 ease-snappy active:scale-[0.97]"
              >
                <Image
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-transform duration-200 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
                    ▶
                  </span>
                </div>
              </a>
              <p className="mt-2 text-sm font-medium text-white/90">
                {video.title}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
