import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { whatsappUrl } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contato - Amigo Violão",
  description:
    "Fale com o Amigo Violão por WhatsApp, e-mail ou pelo formulário de contato.",
};

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-black/5 bg-cream/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Contato
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-dark">
              Fale com a gente
            </h1>
            <p className="mt-3 max-w-2xl text-charcoal/80">
              Tire suas dúvidas sobre os cursos, parcerias ou qualquer outro
              assunto. Respondemos o mais rápido possível.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-2">
          <div>
            <ContactForm />

            <div className="mt-8 space-y-4 border-t border-black/10 pt-8 text-sm text-charcoal/80">
              <p>
                Prefere falar direto?{" "}
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hoverable:underline"
                >
                  Chama no WhatsApp
                </a>{" "}
                — (31) 9 9142-0455.
              </p>
              <p>
                Ou mande um e-mail para{" "}
                <a
                  href="mailto:falarcom@amigoviolao.com"
                  className="font-semibold text-primary hoverable:underline"
                >
                  falarcom@amigoviolao.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
