"use client";

import { useState } from "react";

// Posta numa Lambda com Function URL (lambda/contato/handler.py), que guarda a
// chave da Brevo e faz duas coisas: manda a mensagem por e-mail e, se a pessoa
// marcar o aceite, cadastra o contato na lista. A chave nao pode vir pra ca --
// no export estatico ela ficaria publica no JavaScript.
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = "idle" | "submitting" | "success" | "error";

const campoClasses =
  "w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (!CONTACT_ENDPOINT) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const dados = new FormData(form);
    setStatus("submitting");

    try {
      const response = await fetch(CONTACT_ENDPOINT as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dados.get("name"),
          email: dados.get("email"),
          message: dados.get("message"),
          optIn: dados.get("optIn") === "on",
          website: dados.get("website"),
        }),
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-2xl bg-teal/10 px-6 py-8 text-center font-medium text-dark">
        Mensagem enviada! Em breve alguém da nossa equipe entra em contato.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal">
          Nome
        </label>
        <input id="name" name="name" type="text" required maxLength={120} className={campoClasses} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
          E-mail
        </label>
        <input id="email" name="email" type="email" required maxLength={200} className={campoClasses} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          className={campoClasses}
        />
      </div>

      {/* Campo isca: escondido de quem enxerga e de quem navega por teclado ou
          leitor de tela, mas visivel pro bot que preenche todos os inputs. Se
          vier preenchido, o servidor descarta. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-charcoal">
        <input
          name="optIn"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 rounded border-black/20 accent-primary"
        />
        <span>
          Quero receber dicas de violão e novidades por e-mail. Você pode sair da
          lista quando quiser.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97] disabled:opacity-60"
      >
        {status === "submitting" ? "Enviando..." : "Enviar mensagem"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-primary">
          Não foi possível enviar agora. Tente de novo ou fale com a gente pelo
          WhatsApp.
        </p>
      ) : null}
    </form>
  );
}
