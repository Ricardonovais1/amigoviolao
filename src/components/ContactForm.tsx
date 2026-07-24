"use client";

import { useState } from "react";

// Posts directly to FormSpree (https://formspree.io) — no backend of our own,
// consistent with the static export. The endpoint is provided by Ricardo
// once the FormSpree account exists; until then the form renders a notice
// instead of silently failing.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (!FORMSPREE_ENDPOINT) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT as string, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
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
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        />
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
          className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

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
