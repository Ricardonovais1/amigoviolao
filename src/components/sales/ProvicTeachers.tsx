import Image from "next/image";
import Reveal from "../Reveal";

const videos = [
  {
    name: "Verônica",
    duration: "00:50",
    thumb:
      "https://i.vimeocdn.com/video/1155509267-682127a4cf2ceb906b850118aad5c5b16c81084b1f910c0610eca04220ca8c6a-d_640",
  },
  {
    name: "Gilliard",
    duration: "01:50",
    thumb:
      "https://i.vimeocdn.com/video/1086799321-3b238395441c481a0a996b381b6a956b39612a3d7a3ccd59436e19858b416b2f-d_640",
  },
  {
    name: "Rafael",
    duration: "01:40",
    thumb:
      "https://i.vimeocdn.com/video/1086798963-77ce3e4a510bf26a1d9683829f8001c6d84d9b8496b7637cbc39e6e34308fd04-d_640",
  },
  {
    name: "Leandro Cesar Miguel",
    duration: "02:05",
    thumb:
      "https://i.vimeocdn.com/video/739894615-3fce7ec4bad8e8e988950ad042297e0bc0986b33b24402574492aaef0ea57be2-d_640",
  },
  {
    name: "Alisson Jázer",
    thumb: "https://img.youtube.com/vi/aQ7_EmOkDNw/hqdefault.jpg",
  },
  {
    name: "Fran Moreira",
    duration: "01:29",
    thumb:
      "https://i.vimeocdn.com/video/1210685353-56da8fd858e64ac4b7f694f327e594495607e8804896d4e665789a6f772085da-d_640",
  },
  {
    name: "Johnny Pains",
    thumb: "https://img.youtube.com/vi/_7HJsDsRcso/hqdefault.jpg",
  },
  {
    name: "Rodrigo Marques de Carvalho",
    thumb: "https://img.youtube.com/vi/e9NyTamXHt8/hqdefault.jpg",
  },
];

export default function ProvicTeachers() {
  return (
    <section className="bg-teal py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Professores alunos do PROVIC
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <Reveal key={video.name} delay={i * 50}>
              <div className="group relative aspect-video overflow-hidden rounded-xl bg-dark transition-transform duration-150 ease-snappy active:scale-[0.97]">
                <Image
                  src={video.thumb}
                  alt={video.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                {video.duration && (
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                    {video.duration}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-teal transition-transform duration-200 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
                    ▶
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-white/90">
                {video.name}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
