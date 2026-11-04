import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { WHATSAPP_AULAS_PARTICULARES, whatsappUrl } from "@/lib/links";
import { campanhaAtiva } from "@/lib/ofertas";
import styles from "./links.module.css";

// A PÁGINA DA BIO DO INSTAGRAM (04/11/2026).
//
// Uma folha só, com desenho próprio: o fundo é o jacarandá do braço do violão,
// seis cordas de bronze passam atrás do retrato, e a foto fica dentro da
// roseta da boca. O layout tira o botão flutuante de WhatsApp, o "voltar ao
// topo" e a faixa da campanha nesta rota (ver WhatsAppFloat, BackToTop e
// CampanhaBar) — a campanha aparece aqui dentro, num selo por curso.
//
// Os cursos são só dois de propósito (pedido do Ricardo): o de crianças, para
// os pais, e o PROVIC, para professores. O resto está no site.

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-links-display",
});

export const metadata: Metadata = {
  title: "Ricardo Novais · Amigo Violão",
  description:
    "Aulas particulares de violão, o Curso de Violão para Crianças, a formação PROVIC para professores e o GuitPlay.",
  alternates: { canonical: "/links" },
};

const UTM = "utm_source=instagram&utm_medium=bio";

const ESPESSURAS = ["1px", "1.3px", "1.7px", "2.2px", "2.7px", "3.2px"];

function Seta({ tamanho = 20 }: { tamanho?: number }) {
  return (
    <svg className={styles.seta} width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LinksPage() {
  const campanha = campanhaAtiva();
  const selo = campanha ? `${campanha.nome} · ${campanha.desconto}` : null;

  return (
    <main className={`${styles.pagina} ${display.variable}`}>
      <div className={styles.folha}>
        <header className={styles.topo}>
          <div className={styles.cordas} aria-hidden="true">
            {ESPESSURAS.map((g) => (
              <i key={g} style={{ height: g }} />
            ))}
          </div>
          <div className={styles.roseta}>
            {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imagens sem otimização */}
            <img src="/images/links/ricardo-novais.jpg" alt="Ricardo Novais com o violão" width={182} height={182} />
          </div>
        </header>

        <section className={styles.quem}>
          <h1>Ricardo Novais</h1>
          <p>
            <em>Professor de violão</em>
            <br />
            Criador do método Amigo Violão
          </p>
        </section>

        <a className={styles.whats} href={whatsappUrl(WHATSAPP_AULAS_PARTICULARES)} target="_blank" rel="noopener noreferrer">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
          </svg>
          <div>
            <b>Aulas particulares de violão</b>
            <span>Fale comigo no WhatsApp</span>
          </div>
          <Seta tamanho={22} />
        </a>

        <nav className={styles.grupo} aria-labelledby="links-pais">
          <h2 id="links-pais">Para os pais</h2>
          <Link className={styles.link} href={`/cursos/criancas?${UTM}`}>
            <div>
              <b>Curso de Violão para Crianças</b>
              <span>Aulas em vídeo para aprender em casa, com o método Amigo Violão.</span>
              {selo && <span className={styles.selo}>{selo}</span>}
            </div>
            <Seta />
          </Link>
        </nav>

        <nav className={styles.grupo} aria-labelledby="links-prof">
          <h2 id="links-prof">Para professores</h2>
          <Link className={styles.link} href={`/cursos/professores?${UTM}`}>
            <div>
              <b>PROVIC</b>
              <span>Formação de professores de violão para crianças, com certificado.</span>
              {selo && <span className={styles.selo}>{selo}</span>}
            </div>
            <Seta />
          </Link>
          <a className={styles.link} href={`https://guitplay.com/?${UTM}`} target="_blank" rel="noopener noreferrer">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imagens sem otimização */}
              <img className={styles.logo} src="/images/links/logo-guitplay-fundo-escuro.png" alt="GuitPlay" width={800} height={199} />
              <span>O app do professor de violão: material, prática em casa e acompanhamento.</span>
              <span className={styles.selo}>Lista de espera</span>
            </div>
            <Seta />
          </a>
        </nav>

        <footer className={styles.rodape}>
          <span>Amigo Violão · desde 2016</span>
          <Link href="/">amigoviolao.com</Link>
        </footer>
      </div>
    </main>
  );
}
