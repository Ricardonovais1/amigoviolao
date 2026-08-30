import Ambient from "./Ambient";
import Reveal from "./Reveal";
import YouTubeVideo from "./YouTubeVideo";

const defaultVideos = [
  { duration: "00:37", name: "Flávia Pietro", youtubeId: "bfyrt14fmEE" },
  { duration: "02:05", name: "Leandro Cesar Miguel", youtubeId: "Cejci79BHKw" },
  { duration: "00:31", name: "LIPE", youtubeId: "ytAvGlx260E" },
  { duration: "00:59", name: "Verônica", youtubeId: "kTHa84n_8m0" },
];

type Video = {
  duration: string;
  name: string;
  youtubeId?: string;
};

type VideoTestimonialsProps = {
  videos?: Video[];
  aspect?: "portrait" | "video";
};

export default function VideoTestimonials({
  videos = defaultVideos,
  aspect = "portrait",
}: VideoTestimonialsProps) {
  const isWide = aspect === "video";

  return (
    <section className="seam-top grain relative isolate overflow-hidden bg-dark py-20">
      <Ambient preset="dark" />

      <div
        className={`relative mx-auto px-6 text-center ${
          isWide ? "max-w-5xl" : "max-w-6xl"
        }`}
      >
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Em vídeo
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            O que dizem do Amigo Violão
          </h2>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
        </Reveal>

        <div
          className={`mt-10 grid grid-cols-1 ${
            isWide
              ? "gap-6 sm:grid-cols-2"
              : "gap-4 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {videos.map((video, i) => (
            <Reveal key={i} delay={i * 80} variant="scale">
              <div className="group">
                <div
                  className={`hairline relative overflow-hidden rounded-2xl bg-dark shadow-panel transition-[transform,box-shadow] duration-300 ease-snappy hoverable:-translate-y-1 ${
                    isWide ? "aspect-video" : "aspect-[9/16]"
                  }`}
                >
                  {video.youtubeId ? (
                    <YouTubeVideo
                      id={video.youtubeId}
                      title={`Depoimento de ${video.name}`}
                      duration={video.duration}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-snappy active:scale-[0.97]">
                      <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                        {video.duration}
                      </span>
                      <span className="pulse-ring relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-teal transition-transform duration-300 ease-spring [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
                        ▶
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-base font-semibold text-primary transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-primary-light sm:text-lg">
                  Depoimento de {video.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
