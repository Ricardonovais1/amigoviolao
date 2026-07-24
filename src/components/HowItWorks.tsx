"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";

type TabItem = { title: string; text: string };

type Tab = {
  label: string;
  items: TabItem[];
  cta: { label: string; href: string };
};

const tabs: Tab[] = [
  {
    label: "Para Crianças",
    items: [
      {
        title: "Violão para crianças",
        text: "De cordas soltas a acordes. Ao concluir, o aluno avança para o curso de Iniciantes, já incluso no seu acesso.",
      },
      {
        title: "Jogos Musicais Interativos",
        text: "Quizzes dinâmicos para treinar a percepção musical de forma divertida.",
      },
      {
        title: "Violão Gospel Infantil",
        text: "Músicas simples e consagradas, seguindo a consagrada metodologia Amigo Violão.",
      },
    ],
    cta: { label: "Quero Inscrever Meu Filho", href: "/cursos/criancas" },
  },
  {
    label: "Para iniciantes",
    items: [
      {
        title: "Curso MOVI",
        text: "Toque desde músicas simples com apenas um dedo até canções completas com acordes.",
      },
      {
        title: "Repertório Progressivo",
        text: "De melodias simples a solos instrumentais completos e detalhados.",
      },
      {
        title: "Método Passo a Passo",
        text: "Evolução estruturada e descomplicada ao longo de 6 módulos práticos.",
      },
    ],
    cta: { label: "Quero Tocar Violão do Zero", href: "/cursos/iniciantes" },
  },
  {
    label: "Para avançar",
    items: [
      {
        title: "Violão Clássico",
        text: "Teoria, leitura musical e técnica refinada com uma abordagem leve e interativa.",
      },
      {
        title: "Violão Flamenco",
        text: "Técnicas e ritmos espanhóis para dominar o instrumento como poucos.",
      },
      {
        title: "Harmonia e Improvisação",
        text: "Domine harmonia funcional, escalas e arpejos para tocar com liberdade.",
      },
    ],
    cta: { label: "Dominar Minha Técnica de violão", href: "/cursos/classico" },
  },
  {
    label: "Para ensinar",
    items: [
      {
        title: "Metodologia Amigo Violão",
        text: "O passo a passo definitivo para professores que ensinam violão para crianças.",
      },
      {
        title: "Materiais Didáticos",
        text: "PDF de apoio prontos para baixar e usar em aula, além de cifras e bônus exclusivos.",
      },
      {
        title: "Comunidade de Professores",
        text: "Um espaço ativo para trocar experiências, tirar dúvidas e compartilhar ideias.",
      },
    ],
    cta: {
      label: "Quero Ser um Professor Amigo Violão",
      href: "/cursos/professores",
    },
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
                    ? "bg-white text-teal-text"
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
            className="mt-6 rounded-2xl bg-primary p-8 text-left shadow-lg [animation:tab-content-in_220ms_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:[animation:none]"
          >
            <ul className="space-y-3 text-white">
              {tabs[active].items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-bold">{i + 1}.</span>
                  <span>
                    <strong className="font-bold">{item.title}:</strong>{" "}
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Link
                href={tabs[active].cta.href}
                className="inline-block rounded-full bg-white px-7 py-3 text-sm font-bold text-primary transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-cream active:scale-[0.97]"
              >
                {tabs[active].cta.label}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
