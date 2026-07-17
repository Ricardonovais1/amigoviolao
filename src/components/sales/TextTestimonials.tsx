"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "../Reveal";

const testimonials = [
  {
    quote:
      "Essa metodologia de violão infantil é simplesmente incrível! É um método que acolhe a criança, trazendo o aluno para o universo da música de modo afetivo desde os primeiros contatos com o violão. Melodias com dificuldade gradativa, muito boas de ouvir, ensinar e acompanhar e os jogos que o método oferece são sempre uma ótima pedida, servindo de estímulo e promovendo uma brincadeira sadia e muito divertida. Como professora de violão, super recomendo!",
    name: "Cris Aquino",
    role: "Professora de violão",
    photo:
      "https://amigoviolao.com/wp-content/uploads/2024/11/Cris-Aquino.jpeg.webp",
  },
  {
    quote:
      "Compor uma didática voltada para a criança não é tarefa fácil pois exige muita experiência e sensibilidade. O amigo violão conseguiu unir ingredientes essenciais para uma boa aula de violão para crianças: a simplicidade, a satisfação do aluno de superar cada fase e a alegria em conseguir tocar!",
    name: "Flávia Gonzaga",
    role: "Professora de violão",
    photo:
      "https://amigoviolao.com/wp-content/uploads/2024/11/Flavia-Gonzaga.jpeg.webp",
  },
  {
    quote:
      "O curso professor de violão para crianças do amigo violão foi excelente, todo aprendizado foi muito prático, cada módulo super bem explicado, logo nas primeiras aulas já consegui aplicar os conteúdos para meus alunos. E o professor Ricardo sempre muito atencioso e paciente, sempre respondendo as perguntas e sanando todas as dúvidas.",
    name: "Mikael Silva",
    role: "Educador Musical",
    photo: null,
  },
  {
    quote:
      "Pensa em um material rico, completo, e extremamente eficaz no ensino de violão para crianças. Esse é o Amigo Violão. Tudo conduzido de forma muito didática e bem pensada para a linguagem das crianças mas que pela forma divertida de apresentar a proposta certamente conquista muito adulto também.",
    name: "Fábio Martins",
    role: "Professor de Violão",
    photo: null,
  },
  {
    quote:
      "Comprei e uso direto com meus alunos! Muito didático e prático! Excelente para crianças pequenas! Curso online de melhor investimento e que mais contribuiu para a minha prática como professora de instrumento! Super indico!!!",
    name: "Claudia Thomas Queiroz",
    role: "Professora de Violão",
    photo: null,
  },
  {
    quote: "Excelente profissional! Super indico",
    name: "Alexandre Barbosa",
    role: "Professor de Violão",
    photo: null,
  },
  {
    quote: "Incrível o trabalho que eles fazem. PARABÉNS!!!!",
    name: "Fabiane Caires",
    role: "Mãe de aluno",
    photo: null,
  },
];

export default function TextTestimonials() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="text-4xl text-primary">&ldquo;</span>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Depoimento anterior"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-4xl leading-none text-white shadow-md transition-transform duration-150 ease-snappy hoverable:bg-primary-dark hoverable:scale-110 active:scale-[0.9]"
            >
              ‹
            </button>

            <p className="min-h-[9rem] flex-1 text-lg italic leading-relaxed text-foreground/80">
              {t.quote}
            </p>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próximo depoimento"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-4xl leading-none text-white shadow-md transition-transform duration-150 ease-snappy hoverable:bg-primary-dark hoverable:scale-110 active:scale-[0.9]"
            >
              ›
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            {t.photo ? (
              <Image
                src={t.photo}
                alt={t.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {t.name.charAt(0)}
              </span>
            )}
            <p className="font-semibold text-charcoal">{t.name}</p>
            <p className="text-sm text-foreground/60">{t.role}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
