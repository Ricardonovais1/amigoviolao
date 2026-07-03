import Image from "next/image";
import Link from "next/link";

const legalLinks = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Serviços", href: "/termos-de-servicos" },
  { label: "Políticas de Cancelamento", href: "/politicas-de-cancelamento" },
];

const bottomLinks = [
  { label: "Home", href: "/" },
  { label: "Aulas", href: "/aulas" },
  { label: "Login", href: "/login" },
];

export default function Footer() {
  return (
    <footer id="contato" className="bg-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            Amigo Violão {new Date().getFullYear()} - Feito com amor por
            Ricardo Novais - CNPJ: 51.747.455/0001-06
          </p>
          <div className="flex gap-4">
            {bottomLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
                {i < bottomLinks.length - 1 && (
                  <span className="text-white/20">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
