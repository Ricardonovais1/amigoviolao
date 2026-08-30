import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Ambient from "./Ambient";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Professores", href: "/professores" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

const legalLinks = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Serviços", href: "/termos-de-servicos" },
  { label: "Políticas de Cancelamento", href: "/politicas-de-cancelamento" },
];

const headingClasses =
  "mb-4 border-l-4 border-primary pl-3 font-semibold text-white";

const linkClasses =
  "inline-flex items-center gap-1.5 text-white/70 transition-[color,transform] duration-200 ease-snappy hoverable:translate-x-1 hoverable:text-primary";

export default function Footer() {
  return (
    <footer
      id="contato"
      // Filete laranja e não o branco 0.22 das outras seções escuras: é o
      // fecho da página, assinatura de marca deliberada, não esquecimento.
      className="seam-top relative isolate overflow-hidden bg-dark text-white/80"
      style={{ "--seam-color": "rgba(239,84,0,0.45)" } as CSSProperties}
    >
      <Ambient preset="dark" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className={headingClasses}>Navegue</h3>
          <ul className="space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClasses}>Legal</h3>
          <ul className="space-y-2.5 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClasses}>Informações De Contato</h3>
          <p className="text-sm leading-relaxed text-white/70">
            Fone (Whatsapp):
            <br />
            <span className="font-medium text-white/90">(31) 9 9142-0455</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Email:
            <br />
            <span className="font-medium text-white/90">
              falarcom@amigoviolao.com
            </span>
          </p>
        </div>

        <div className="flex items-start sm:justify-end">
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2021/06/Nave-Amigo-Violao-300x131.png"
            alt="Nave Amigo Violão"
            width={160}
            height={70}
            className="h-auto opacity-85 transition-opacity duration-300 ease-snappy hoverable:opacity-100"
          />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-white/50">
          <p>
            Amigo Violão {new Date().getFullYear()} - Feito com amor por
            Ricardo Novais - CNPJ: 51.747.455/0001-06
          </p>
        </div>
      </div>
    </footer>
  );
}
