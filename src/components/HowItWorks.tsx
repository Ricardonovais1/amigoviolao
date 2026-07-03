"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const tabs = [
  {
    label: "Para Crianças",
    items: [
      "Curso de violão para crianças: 5 módulos, de cordas soltas a acordes. Certificados a cada módulo. Ao concluir, vai para o MOVI (Iniciantes).",
      "Jogos Musicais Interativos (quizes interativos).",
      "Curso de violão GOSPEL para crianças: aborda músicas bem simples até que as crianças consigam tocar e cantar seus primeiros louvores.",
    ],
  },
  {
    label: "Para iniciantes",
    items: [
      "Curso MOVI: do primeiro acorde às primeiras músicas completas.",
      "Repertório popular guiado passo a passo.",
      "Acompanhamento de evolução por módulo.",
    ],
  },
  {
    label: "Para avançar",
    items: [
      "Curso de violão clássico e técnica avançada.",
      "Leitura de partitura e arranjos.",
      "Desafios mensais de repertório.",
    ],
  },
  {
    label: "Para ensinar",
    items: [
      "Metodologia completa para professores de violão.",
      "Material de apoio pronto para usar em aula.",
      "Comunidade de professores para trocar experiências.",
    ],
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="como-funciona" className="bg-teal py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-white">
            Como funciona?
          </h2>
          <p className="mt-2 text-lg font-medium text-white/90">
            Um único acesso que inclui tudo isso:
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                onClick={() => setActive(index)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-snappy active:scale-[0.97] ${
                  active === index
                    ? "bg-white text-teal"
                    : "bg-white/10 text-white hoverable:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div
            key={active}
            className="mt-6 rounded-2xl bg-primary p-8 text-left shadow-lg [animation:tab-content-in_220ms_var(--ease-snappy)_both] motion-reduce:[animation:none]"
          >
            <ul className="space-y-3 text-white">
              {tabs[active].items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
