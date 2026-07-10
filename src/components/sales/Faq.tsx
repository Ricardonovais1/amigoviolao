"use client";

import { useState } from "react";
import Reveal from "../Reveal";
import { defaultFaqs, type FaqItem } from "./faqData";

type FaqProps = {
  faqs?: FaqItem[];
};

export default function Faq({ faqs = defaultFaqs }: FaqProps) {
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
