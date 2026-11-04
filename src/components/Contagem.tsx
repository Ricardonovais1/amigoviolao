"use client";

import { useEffect, useState } from "react";

/** Milissegundos que faltam para `termina`, ou null antes de montar no navegador. */
export function useTempoRestante(termina: string): number | null {
  const [restante, setRestante] = useState<number | null>(null);

  useEffect(() => {
    const fim = Date.parse(termina);
    const tick = () => setRestante(Math.max(0, fim - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [termina]);

  return restante;
}

const doisDigitos = (n: number) => String(n).padStart(2, "0");

function formatarRestante(ms: number): string {
  const total = Math.floor(ms / 1000);
  const dias = Math.floor(total / 86400);
  const horas = Math.floor((total % 86400) / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;
  const relogio = `${doisDigitos(horas)}h ${doisDigitos(minutos)}m ${doisDigitos(segundos)}s`;
  return dias > 0 ? `${dias}d ${relogio}` : relogio;
}

/**
 * "Termina em 26d 04h 12m 08s". No HTML estático (e sem JS) mostra a data fixa:
 * o build não sabe a que horas a página vai ser aberta, então a contagem só
 * começa depois de hidratar, sem trocar o tamanho do texto de forma brusca.
 */
export default function Contagem({
  termina,
  terminaRotulo,
}: {
  termina: string;
  terminaRotulo: string;
}) {
  const restante = useTempoRestante(termina);

  if (restante === null) return <>Termina {terminaRotulo}</>;
  if (restante === 0) return <>Promoção encerrada</>;
  return (
    <>
      Termina em <span className="tabular-nums">{formatarRestante(restante)}</span>
    </>
  );
}
