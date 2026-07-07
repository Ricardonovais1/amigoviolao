"use client";

import { useEffect, useState } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-snappy md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#comprar"
        className="block w-full rounded-full bg-primary py-3 text-center text-sm font-bold text-white transition-transform duration-150 ease-snappy active:scale-[0.97]"
      >
        Garantir minha vaga — R$479,00
      </a>
    </div>
  );
}
