import type { CSSProperties } from "react";

/**
 * Camada de luz de fundo: manchas radiais grandes, de baixíssima opacidade,
 * que derivam devagar. Serve para tirar o aspecto de "bloco de cor chapado"
 * das seções sem introduzir imagem nenhuma.
 *
 * É puramente decorativa — fica atrás do conteúdo, sem eventos de ponteiro e
 * escondida de leitores de tela. A animação mexe só em transform, então roda
 * na GPU e não repinta a seção; com prefers-reduced-motion as manchas ficam
 * paradas (o degradê continua, o movimento some).
 */

type Blob = {
  /** Cor central da mancha; as bordas se dissolvem sozinhas. */
  color: string;
  /** Tamanho do círculo. Aceita qualquer unidade CSS. */
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Deslocamento máximo da deriva, em % do próprio tamanho. */
  x?: string;
  y?: string;
  scale?: string;
  duration?: string;
  delay?: string;
};

const PRESETS = {
  /** Herói escuro: brasa laranja de um lado, teal frio do outro. */
  hero: [
    {
      color: "rgba(239, 84, 0, 0.34)",
      size: "clamp(20rem, 46vw, 40rem)",
      top: "-18%",
      left: "-12%",
      x: "10%",
      y: "6%",
      scale: "1.18",
      duration: "26s",
    },
    {
      color: "rgba(72, 194, 195, 0.24)",
      size: "clamp(18rem, 40vw, 34rem)",
      bottom: "-22%",
      right: "-10%",
      x: "-8%",
      y: "-8%",
      scale: "1.12",
      duration: "32s",
      delay: "-8s",
    },
    {
      color: "rgba(255, 122, 47, 0.16)",
      size: "clamp(14rem, 30vw, 26rem)",
      top: "38%",
      right: "22%",
      x: "-12%",
      y: "10%",
      scale: "1.25",
      duration: "38s",
      delay: "-16s",
    },
  ],
  /** Seção clara: sopro de cor nas quinas, quase imperceptível. */
  light: [
    {
      color: "rgba(239, 84, 0, 0.09)",
      size: "clamp(18rem, 38vw, 32rem)",
      top: "-30%",
      right: "-12%",
      x: "-7%",
      y: "8%",
      scale: "1.15",
      duration: "30s",
    },
    {
      color: "rgba(72, 194, 195, 0.1)",
      size: "clamp(16rem, 34vw, 28rem)",
      bottom: "-28%",
      left: "-14%",
      x: "9%",
      y: "-6%",
      scale: "1.1",
      duration: "36s",
      delay: "-12s",
    },
  ],
  /** Seção escura (depoimentos, vídeos): halos frios e discretos. */
  dark: [
    {
      color: "rgba(72, 194, 195, 0.18)",
      size: "clamp(18rem, 40vw, 34rem)",
      top: "-24%",
      left: "8%",
      x: "8%",
      y: "6%",
      scale: "1.16",
      duration: "34s",
    },
    {
      color: "rgba(239, 84, 0, 0.16)",
      size: "clamp(16rem, 34vw, 30rem)",
      bottom: "-26%",
      right: "4%",
      x: "-9%",
      y: "-7%",
      scale: "1.12",
      duration: "28s",
      delay: "-10s",
    },
  ],
  /** Bloco teal: variação de profundidade dentro da própria cor. */
  teal: [
    {
      color: "rgba(255, 255, 255, 0.24)",
      size: "clamp(18rem, 42vw, 36rem)",
      top: "-32%",
      left: "-8%",
      x: "9%",
      y: "8%",
      scale: "1.14",
      duration: "30s",
    },
    {
      color: "rgba(47, 159, 160, 0.5)",
      size: "clamp(16rem, 36vw, 30rem)",
      bottom: "-30%",
      right: "-6%",
      x: "-8%",
      y: "-6%",
      scale: "1.18",
      duration: "26s",
      delay: "-9s",
    },
  ],
} satisfies Record<string, Blob[]>;

export type AmbientPreset = keyof typeof PRESETS;

export default function Ambient({
  preset,
  className = "",
}: {
  preset: AmbientPreset;
  className?: string;
}) {
  return (
    <div className={`ambient ${className}`} aria-hidden="true">
      {PRESETS[preset].map((blob, i) => (
        <span
          key={i}
          className="ambient-blob"
          style={
            {
              width: blob.size,
              height: blob.size,
              top: blob.top,
              left: blob.left,
              right: blob.right,
              bottom: blob.bottom,
              "--blob-color": blob.color,
              "--blob-x": blob.x ?? "6%",
              "--blob-y": blob.y ?? "-5%",
              "--blob-scale": blob.scale ?? "1.14",
              "--blob-duration": blob.duration ?? "24s",
              "--blob-delay": blob.delay ?? "0s",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
