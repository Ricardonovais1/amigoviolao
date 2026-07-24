import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Professores", href: "/professores" },
  { label: "Contato", href: "/contato" },
];

const legalLinks = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Serviços", href: "/termos-de-servicos" },
  { label: "Políticas de Cancelamento", href: "/politicas-de-cancelamento" },
];

export default function Footer() {
  return (
    <footer id="contato" className="bg-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-4 border-l-4 border-primary pl-3 font-semibold text-white">
            Navegue
          </h3>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-primary pl-3 font-semibold text-white">
            Legal
          </h3>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-primary pl-3 font-semibold text-white">
            Informações De Contato
          </h3>
          <p className="text-sm">
            Fone (Whatsapp):
            <br />
            (31) 9 9142-0455
          </p>
          <p className="mt-3 text-sm">
            Email:
            <br />
            falarcom@amigoviolao.com
          </p>
        </div>

        <div className="flex items-start sm:justify-end">
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2021/06/Nave-Amigo-Violao-300x131.png"
            alt="Nave Amigo Violão"
            width={160}
            height={70}
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-white/60">
          <p>
            Amigo Violão {new Date().getFullYear()} - Feito com amor por
            Ricardo Novais - CNPJ: 51.747.455/0001-06
          </p>
        </div>
      </div>
    </footer>
  );
}
