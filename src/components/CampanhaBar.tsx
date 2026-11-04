"use client";

import Link from "next/link";
import type { CampanhaAtiva } from "@/lib/ofertas";
import { useTempoRestante } from "./Contagem";

/**
 * Faixa da campanha no topo de todas as páginas. Fica acima do Header, que é
 * sticky: ela rola junto com a página e o menu continua grudado no topo.
 *
 * Some sozinha no navegador quando a campanha termina. O preço das páginas de
 * venda só muda no rebuild agendado de 01/12 (deploy-site.yml), mas a faixa
 * anunciando uma promoção encerrada seria a pior parte de um atraso nele.
 */
export default function CampanhaBar({ campanha }: { campanha: CampanhaAtiva }) {
  const restante = useTempoRestante(campanha.termina);
  if (restante === 0) return null;

  return (
    <Link
      href="/#cursos"
      className="group block bg-black px-4 py-2.5 text-center text-sm text-white"
    >
      <span className="font-extrabold uppercase tracking-wide">
        {campanha.nome}
      </span>
      <span className="mx-2 text-white/50" aria-hidden>
        ·
      </span>
      <span>
        Todos os cursos com{" "}
        <strong className="font-extrabold text-primary-light">
          {campanha.desconto}
        </strong>{" "}
        até {campanha.terminaDia}
      </span>
      <span className="ml-2 font-semibold underline decoration-primary-light underline-offset-4 transition-colors group-hover:text-primary-light">
        Ver cursos →
      </span>
    </Link>
  );
}
