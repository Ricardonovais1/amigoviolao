"use client";

import { useEffect, useState } from "react";

type StickyMobileCTAProps = {
  /** Ação principal, específica de cada curso (ex.: "Tocar violão do zero"). */
  label?: string;
  price?: string;
  /**
   * Segunda linha antes de a pessoa chegar ao bloco de preço. Anunciar o valor
   * antes de a página ter feito o trabalho de valor só dá um número para o
   * visitante comparar — a garantia, nesse momento, tira o risco sem antecipar
   * a objeção.
   */
  preNote?: string;
  /** Id da seção de preço observada para liberar o valor. */
  priceSectionId?: string;
};

export default function StickyMobileCTA({
  label = "Quero garantir minha vaga",
  price,
  preNote = "30 dias de garantia",
  priceSectionId = "comprar",
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const [precoLiberado, setPrecoLiberado] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);

      // Uma vez alcançada a seção de preço, o valor fica exposto até o fim da
      // navegação — daí o `antes ||`, que trava em true e não volta atrás
      // quando a pessoa rola para cima.
      const secao = document.getElementById(priceSectionId);
      if (secao) {
        // 0,85 da altura da janela: dispara quando a seção começa a entrar na
        // tela. Exigir que ela cruzasse o meio deixava o valor escondido
        // enquanto o título do bloco de preço já estava visível — a barra
        // contradizia a página.
        const alcancou =
          secao.getBoundingClientRect().top < window.innerHeight * 0.85;
        setPrecoLiberado((antes) => antes || alcancou);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [priceSectionId]);

  const segundaLinha = precoLiberado && price ? `por ${price}` : preNote;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-snappy md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={`#${priceSectionId}`}
        className="flex w-full flex-col items-center rounded-full bg-primary py-2.5 text-center text-white transition-transform duration-150 ease-snappy active:scale-[0.97]"
      >
        <span className="text-sm font-bold leading-tight">{label}</span>
        {segundaLinha && (
          <span className="text-xs font-semibold leading-tight opacity-90">
            {segundaLinha}
          </span>
        )}
      </a>
    </div>
  );
}
