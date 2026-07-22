import { professorWhatsappHref } from "@/lib/professores";

export default function ProfessorContact({
  name,
  whatsapp,
  email,
}: {
  name: string;
  whatsapp?: string;
  email?: string;
}) {
  if (!whatsapp && !email) return null;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {whatsapp ? (
        <a
          href={professorWhatsappHref(whatsapp, name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white transition-colors hoverable:bg-teal/90"
        >
          Falar no WhatsApp
        </a>
      ) : null}
      {email ? (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hoverable:bg-cream/70"
        >
          Enviar e-mail
        </a>
      ) : null}
    </div>
  );
}
