import Reveal from "../Reveal";
import type { CSSProperties } from "react";
import Ambient from "../Ambient";

type GuaranteeProps = {
  heading?: string;
  text?: string;
};

export default function Guarantee({
  heading = "Risco zero para você",
  text = "Experimente o curso com seu filho por 30 dias. Se ele não se adaptar — ou se você não gostar por qualquer motivo — é só pedir o reembolso dentro da própria plataforma e devolvemos 100% do valor, sem perguntas e sem burocracia. Todo o risco é nosso.",
}: GuaranteeProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white py-20">
      <Ambient preset="light" />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <div
            className="hairline flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-cream to-white p-8 text-center shadow-soft sm:flex-row sm:gap-8 sm:text-left"
            style={
              {
                "--hairline":
                  "linear-gradient(145deg, rgba(22,163,74,0.45), rgba(72,194,195,0.25) 55%, rgba(62,69,72,0.08))",
              } as CSSProperties
            }
          >
            <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-4 border-green-600 bg-white text-green-700 shadow-[0_12px_30px_-14px_rgba(22,163,74,0.7)]">
              <span className="text-3xl font-extrabold leading-none">30</span>
              <span className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide">
                dias de
                <br />
                garantia
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-charcoal">
                {heading}
              </h2>
              <p className="mt-3 leading-relaxed text-foreground/70">{text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
