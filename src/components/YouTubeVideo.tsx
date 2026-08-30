"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type YouTubeVideoProps = {
  id: string;
  title: string;
  duration?: string;
};

// Nem todo vídeo tem maxresdefault. Quando não tem, o YouTube ainda responde
// 200 OK — mas com um placeholder cinza de 120x90 — então onError nunca
// dispara e precisamos detectar o placeholder pelas dimensões reais.
// hqdefault existe sempre; é 4:3 com barras de letterbox, mas o object-cover
// do container 16:9 recorta exatamente as barras.
const PLACEHOLDER_WIDTH = 120;

export default function YouTubeVideo({ id, title, duration }: YouTubeVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault"
  );
  const imgRef = useRef<HTMLImageElement>(null);

  // A imagem é lazy, então costuma carregar bem depois da hidratação e o
  // onLoad do React pode não pegar esse load — daí o listener nativo.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || thumb !== "maxresdefault") return;

    const check = () => {
      if (img.naturalWidth === PLACEHOLDER_WIDTH) setThumb("hqdefault");
    };

    if (img.complete) check();
    img.addEventListener("load", check);
    return () => img.removeEventListener("load", check);
  }, [thumb]);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir: ${title}`}
      /* offset negativo: o botão preenche um container com overflow-hidden,
         então um anel para fora seria recortado e sumiria. */
      className="group absolute inset-0 cursor-pointer transition-transform duration-200 ease-snappy focus-ring-inset active:scale-[0.97]"
    >
      <Image
        ref={imgRef}
        src={`https://img.youtube.com/vi/${id}/${thumb}.jpg`}
        alt={title}
        fill
        className="object-cover"
        sizes="(min-width: 640px) 50vw, 100vw"
        onError={() => setThumb("hqdefault")}
      />
      {/* Escurece a thumb no repouso e limpa no hover: o play ganha contraste
          sem precisar de um overlay opaco. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90 transition-opacity duration-300 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-60"
      />
      {duration && (
        <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {duration}
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="pulse-ring relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 pl-1 text-teal shadow-[0_10px_25px_-10px_rgba(0,0,0,0.7)] transition-[transform,background-color] duration-300 ease-spring [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-white">
          ▶
        </span>
      </span>
    </button>
  );
}
