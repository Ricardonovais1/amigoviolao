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
    <section className="bg-dark py-16">
      <div
        className={`mx-auto px-6 text-center ${
          isWide ? "max-w-5xl" : "max-w-6xl"
        }`}
      >
        <Reveal>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            O que dizem do Amigo Violão
          </h2>
        </Reveal>

        <div
          className={`mt-10 grid grid-cols-1 ${
            isWide
              ? "gap-6 sm:grid-cols-2"
              : "gap-4 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {videos.map((video, i) => (
            <Reveal key={i} delay={i * 60}>
              <div>
                <div
                  className={`relative overflow-hidden rounded-xl bg-dark ${
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
                    <div className="group absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-snappy active:scale-[0.97]">
                      <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                        {video.duration}
                      </span>
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-teal transition-transform duration-200 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
                        ▶
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-lg font-semibold text-primary">
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
