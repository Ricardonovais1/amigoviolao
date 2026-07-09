"use client";

import { useEffect, useRef, useState } from "react";

// Fixed reading-progress bar for blog posts. Sits flush against the bottom
// edge of the sticky site header (measured at runtime) and fills with the
// brand orange: 0% at the start of the article content, 100% exactly when
// the end of the text enters the viewport.

export default function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");

    const measure = () => {
      setTop(header ? Math.round(header.getBoundingClientRect().height) : 0);
    };
    measure();

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.getElementById(targetId);
      const bar = barRef.current;
      if (!el || !bar) return;

      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;
      // Reading starts when the article top passes the header's bottom edge;
      // it ends when the article bottom reaches the bottom of the viewport.
      const start = absoluteTop - headerHeight;
      const end = absoluteTop + rect.height - window.innerHeight;

      let progress: number;
      if (end <= start) {
        // Article shorter than the viewport: full once we're past its start.
        progress = window.scrollY >= start ? 1 : 0;
      } else {
        progress = (window.scrollY - start) / (end - start);
      }
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      requestUpdate();
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);

    // Track header height changes (e.g. mobile menu opening).
    const ro =
      header && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    if (header && ro) ro.observe(header);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      style={{ top }}
      className="pointer-events-none fixed inset-x-0 z-50 h-[3px]"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-primary"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
