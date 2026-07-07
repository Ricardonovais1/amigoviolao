"use client";

import { useState } from "react";
import Reveal from "../Reveal";

const faqs = [
  {
    question: "Este curso funciona para quais idades?",
    answer:
      "A partir de 5 anos até adultos. Vale salientar que você terá acesso ao conteúdo integral da NAVE, e tem conteúdos para alunos adultos também, que você pode usar se também quiser aprender!",
  },
  {
    question: "As aulas são gravadas ou ao vivo?",
    answer:
      "Você terá acesso a aulas gravadas, acessadas dentro da plataforma NAVE AMIGO VIOLÃO.",
  },
  {
    question: "Aqui em casa ninguém sabe nada. Funciona para nós?",
    answer:
      "Não apenas funciona, como o curso foi pensado também para famílias como a sua. Você verá que as crianças realmente aprendem, então tudo que você terá que fazer é auxiliá-las em momentos pontuais, como o acesso, por exemplo.",
  },
  {
    question: "Online dá certo mesmo?",
    answer:
      'Com este método funciona. A maior dificuldade da grande parte dos professores de violão em ensinar online é que, ao tentar ensinar conteúdos muito desafiadores acabam sentindo falta de poder "segurar as mãos" dos alunos. Com conteúdos adequados isso não é um problema. Esta é a arte de ensinar violão, que é a marca do Amigo Violão.',
  },
  {
    question: "Qual diferença deste método para outros métodos de violão para crianças?",
    answer:
      "A diferença é que sabemos quão importante é ter um material desenvolvido especificamente para as crianças, e não apenas tratá-las com mais paciência. Aqui trabalhamos conteúdos realmente acessíveis, devido ao tempo, dedicação e amor investidos na didática do violão para os pequenos ao longo de muitos anos.",
  },
  {
    question: "E a garantia como funciona?",
    answer:
      "Você tem direito a 30 dias de garantia após o pagamento. Acreditamos realmente que este é o melhor curso de violão online que você pode ter acesso. Não apenas o método é o melhor, como a forma de ensinar também não deixa por menos.",
  },
  {
    question: "Quanto tempo terei acesso ao curso?",
    answer: "Seu acesso é por 2 anos.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold text-charcoal sm:text-3xl">
            Perguntas Frequentes
          </h2>
        </Reveal>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.question} delay={i * 40}>
                <div className="rounded-xl border border-black/10">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-charcoal"
                  >
                    <span>
                      {i + 1}. {faq.question}
                    </span>
                    <span
                      className={`shrink-0 text-primary transition-transform duration-200 ease-snappy ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-snappy ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-foreground/70">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
