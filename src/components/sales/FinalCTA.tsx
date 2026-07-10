import Reveal from "../Reveal";
import { HOTMART_CHECKOUT_URL } from "@/lib/links";

type FinalCTAProps = {
  heading?: string;
  subtext?: string;
  ctaText?: string;
  checkoutUrl?: string;
  guaranteeNote?: string;
};

export default function FinalCTA({
  heading = "Seu filho está a um passo de descobrir a música",
  subtext = "Comece hoje. Se em até 30 dias você achar que não é para vocês, devolvemos 100% do valor — sem perguntas.",
  ctaText = "QUERO INSCREVER MEU FILHO AGORA",
  checkoutUrl = HOTMART_CHECKOUT_URL,
  guaranteeNote = "Garantia incondicional de 30 dias · Compra segura via Hotmart",
}: FinalCTAProps) {
  return (
    <section className="border-b border-white/15 bg-dark py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{subtext}</p>
        </Reveal>

        <Reveal delay={80}>
          <a
            href={checkoutUrl}
            className="mt-8 inline-block w-full rounded-full bg-green-600 px-8 py-4 text-center text-lg font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-green-700 active:scale-[0.97] sm:w-auto sm:px-16"
          >
            {ctaText}
          </a>
          <p className="mt-4 text-xs uppercase tracking-wide text-white/60">
            {guaranteeNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
