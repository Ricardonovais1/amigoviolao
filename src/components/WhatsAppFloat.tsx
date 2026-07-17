"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_COURSE_MESSAGES, whatsappUrl } from "@/lib/links";
import WhatsAppIcon from "./WhatsAppIcon";

/**
 * Botão flutuante de WhatsApp presente em todo o site (montado no layout).
 * Nas páginas de vendas (/cursos/*) a mensagem pré-preenchida cita o curso
 * e o botão sobe para não brigar com a barra fixa do StickyMobileCTA.
 */
export default function WhatsAppFloat() {
  const pathname = usePathname();
  // As paginas de quiz sao incorporadas via iframe no Hotmart — nada de
  // botoes flutuantes do site por cima da aula.
  if (pathname?.startsWith("/quiz")) return null;
  const slug = pathname?.match(/^\/cursos\/([^/]+)/)?.[1];
  const message =
    slug && slug in WHATSAPP_COURSE_MESSAGES
      ? WHATSAPP_COURSE_MESSAGES[slug as keyof typeof WHATSAPP_COURSE_MESSAGES]
      : undefined;

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className={`fixed left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-150 ease-snappy hoverable:scale-110 active:scale-95 ${
        message ? "bottom-20 md:bottom-6" : "bottom-6"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
