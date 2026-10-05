import Image from "next/image";
import Ambient from "../Ambient";
import Reveal from "../Reveal";
import YouTubeVideo from "../YouTubeVideo";

type TeacherInterviewProps = {
  eyebrow?: string;
  heading: string;
  paragraph: string;
  youtubeId: string;
  videoTitle: string;
  duration?: string;
  photo?: { src: string; alt: string; width: number; height: number };
};

/**
 * Um vídeo só, em destaque: a conversa em que o professor explica o próprio
 * trabalho. Vem logo depois do "Quem ensina" — o texto apresenta, o vídeo
 * deixa a pessoa decidir se gosta de quem vai ensiná-la.
 *
 * Fundo escuro como o das outras seções de vídeo do site: além de dar palco
 * ao player, é o que separa esta seção das vizinhas — o "Quem ensina" acima é
 * branco e o ValueStack abaixo é creme, então um fundo claro aqui colaria em
 * um dos dois.
 */
export default function TeacherInterview({
  eyebrow = "Conheça o professor",
  heading,
  paragraph,
  youtubeId,
  videoTitle,
  duration,
  photo,
}: TeacherInterviewProps) {
  return (
    <section className="seam-top grain relative isolate overflow-hidden bg-dark py-16">
      <Ambient preset="dark" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {photo && (
          <Reveal variant="scale">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 768px) 320px, 70vw"
              className="hairline mx-auto mb-8 h-auto w-[70%] max-w-xs rounded-2xl shadow-panel"
            />
          </Reveal>
        )}
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            {paragraph}
          </p>
        </Reveal>

        <Reveal delay={100} variant="scale">
          <div className="hairline relative mt-8 aspect-video overflow-hidden rounded-2xl bg-dark shadow-panel">
            <YouTubeVideo
              id={youtubeId}
              title={videoTitle}
              duration={duration}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
