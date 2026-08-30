"use client";

import { useState } from "react";
import Reveal from "../Reveal";
import Ambient from "../Ambient";
import { defaultFaqs, type FaqItem } from "./faqData";

type FaqProps = {
  faqs?: FaqItem[];
};

export default function Faq({ faqs = defaultFaqs }: FaqProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative isolate overflow-hidden bg-white py-20">
      <Ambient preset="light" />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-charcoal sm:text-3xl">
            Perguntas Frequentes
          </h2>
        </Reveal>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.question} delay={i * 40}>
                <div
                  className={`hairline rounded-2xl transition-[background-color,box-shadow] duration-300 ease-snappy ${
                    isOpen
                      ? "bg-primary-soft shadow-lift"
                      : "bg-white shadow-soft hoverable:shadow-lift"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-charcoal transition-colors duration-200 hoverable:text-primary-dark"
                  >
                    <span>
                      {i + 1}. {faq.question}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary transition-[background-color,transform] duration-300 ease-spring ${
                        isOpen ? "rotate-45 bg-white" : "bg-primary-soft"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 2.5v9M2.5 7h9"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-snappy ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
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
