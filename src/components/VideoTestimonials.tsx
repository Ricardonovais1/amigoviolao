import Reveal from "./Reveal";

const videos = [
  { duration: "00:37" },
  { duration: "02:05" },
  { duration: "00:31" },
  { duration: "00:59" },
];

export default function VideoTestimonials() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            O que dizem do Amigo Violão
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="group relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-xl bg-dark transition-transform duration-150 ease-snappy active:scale-[0.97]">
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                  {video.duration}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-teal transition-transform duration-200 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
                  ▶
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
