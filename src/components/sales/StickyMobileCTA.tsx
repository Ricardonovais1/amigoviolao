"use client";

import { useEffect, useState } from "react";

type StickyMobileCTAProps = {
  /** Ação principal, específica de cada curso (ex.: "Tocar violão do zero"). */
  label?: string;
  price?: string;
};

export default function StickyMobileCTA({
  label = "Quero garantir minha vaga",
  price = "12x de R$49,54",
}: StickyMobileCTAProps) {
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
        className="flex w-full flex-col items-center rounded-full bg-primary py-2.5 text-center text-white transition-transform duration-150 ease-snappy active:scale-[0.97]"
      >
        <span className="text-sm font-bold leading-tight">{label}</span>
        <span className="text-xs font-semibold leading-tight opacity-90">
          por {price}
        </span>
      </a>
    </div>
  );
}
