"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * Faz a luz do `.spotlight` seguir o cursor dentro dos cards filhos.
 *
 * Um único listener no contêiner cobre a grade inteira (em vez de um por
 * card), e a escrita das CSS vars é agendada em requestAnimationFrame para não
 * intercalar leitura de layout com escrita de estilo a cada pixel de mouse.
 *
 * É enriquecimento puro: sem JS, ou em toque, os cards só não acendem — o
 * gradiente `.spotlight::after` fica no default e a opacidade é 0.
 */
export default function SpotlightGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const frame = useRef(0);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    []
  );

  const handleMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    // Em toque o "hover" fica grudado depois do tap; só mouse/caneta.
    if (event.pointerType === "touch") return;

    const card = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-spotlight]"
    );
    if (!card || frame.current) return;

    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    });
  }, []);

  return (
    <div className={className} onPointerMove={handleMove}>
      {children}
    </div>
  );
}
