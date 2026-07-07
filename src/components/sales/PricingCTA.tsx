import Reveal from "../Reveal";
import { HOTMART_CHECKOUT_URL } from "@/lib/links";

export default function PricingCTA() {
  return (
    <section id="comprar" className="bg-cream py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            O melhor curso de violão para crianças por apenas:
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-6 text-2xl text-red-500/80 line-through">
            R$697,00
          </p>
          <p className="text-5xl font-extrabold text-primary">R$479,00</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            ou 12x R$49,54
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Garantia de 30 dias
          </p>
        </Reveal>

        <Reveal delay={140}>
          <a
            href={HOTMART_CHECKOUT_URL}
            className="mt-6 inline-block w-full rounded-full bg-green-600 px-8 py-4 text-center text-lg font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-green-700 active:scale-[0.97] sm:w-auto sm:px-16"
          >
            SIM! QUERO INSCREVER MEU FILHO!
          </a>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60">
            <span className="text-amber-400">★★★★★</span>
            <span>Compra segura via Hotmart</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
