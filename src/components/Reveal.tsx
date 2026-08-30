"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * `variant` escolhe de onde o elemento chega. O padrão continua sendo "up"
 * (subir 1rem enquanto aparece), que é o comportamento histórico de todas as
 * chamadas existentes; as demais dão direção ao olho — blocos laterais entram
 * do lado a que pertencem, mídia entra crescendo, texto de destaque entra
 * saindo de foco.
 *
 * O estado inicial e o respeito a prefers-reduced-motion vivem na classe
 * `.reveal` (globals.css); aqui só se decide *quando* virar data-visible.
 */
type Variant = "up" | "fade" | "scale" | "left" | "right" | "blur";

// Deslocamento de partida de cada variante, em CSS vars lidas por `.reveal`.
const OFFSETS: Record<Variant, CSSProperties> = {
  up: { "--reveal-y": "1rem" },
  fade: { "--reveal-y": "0" },
  scale: { "--reveal-y": "0", "--reveal-scale": "0.94" },
  left: { "--reveal-y": "0", "--reveal-x": "-1.5rem" },
  right: { "--reveal-y": "0", "--reveal-x": "1.5rem" },
  blur: { "--reveal-y": "0.75rem" },
} as Record<Variant, CSSProperties>;

export default function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
  duration = 500,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: Variant;
  /** Duração da transição em ms. */
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible}
      data-blur={variant === "blur"}
      style={
        {
          ...OFFSETS[variant],
          "--reveal-delay": `${delay}ms`,
          "--reveal-duration": `${duration}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
