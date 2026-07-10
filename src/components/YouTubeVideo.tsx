"use client";

import { useState } from "react";
import Image from "next/image";

type YouTubeVideoProps = {
  id: string;
  title: string;
  duration?: string;
};

export default function YouTubeVideo({ id, title, duration }: YouTubeVideoProps) {
  const [playing, setPlaying] = useState(false);
  // maxresdefault (1280x720) e mqdefault (320x180) são 16:9 nativos, sem as
  // faixas pretas de letterbox da hqdefault (4:3). Nem todo vídeo tem
  // maxresdefault, então caímos para mqdefault se ela não existir.
  const [thumb, setThumb] = useState<"maxresdefault" | "mqdefault">(
    "maxresdefault"
  );

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
      className="group absolute inset-0 cursor-pointer transition-transform duration-150 ease-snappy active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
    >
      <Image
        src={`https://img.youtube.com/vi/${id}/${thumb}.jpg`}
        alt={title}
        fill
        className="object-cover"
        sizes="(min-width: 640px) 50vw, 100vw"
        onError={() => setThumb("mqdefault")}
      />
      {duration && (
        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
          {duration}
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-teal transition-transform duration-200 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
          ▶
        </span>
      </span>
    </button>
  );
}
