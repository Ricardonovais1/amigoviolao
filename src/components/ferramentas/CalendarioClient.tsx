"use client";

import dynamic from "next/dynamic";

// A ferramenta é inteiramente client-side e parte de "hoje" como data padrão.
// Sem `ssr: false` o valor calculado na exportação estática divergiria do
// calculado no navegador, e a hidratação acusaria — além de obrigar a montar o
// estado inicial dentro de um efeito.
const Calendario = dynamic(() => import("./CalendarioDoProfessor"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-6xl px-6 py-20 text-center text-white/40">
      Carregando a ferramenta…
    </div>
  ),
});

export default function CalendarioClient() {
  return <Calendario />;
}
