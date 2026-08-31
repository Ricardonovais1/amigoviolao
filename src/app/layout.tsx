import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import Analytics from "@/components/Analytics";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const PRODUCTION = "https://amigoviolao.com";
const SITE = process.env.SITE_URL || PRODUCTION;
// Ver src/app/robots.ts: o build da Vercel nunca conta como producao.
const IS_PRODUCTION = SITE === PRODUCTION && !process.env.VERCEL;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // Só o build de produção é indexável. Qualquer outro (staging, preview da
  // Vercel) serve uma cópia idêntica do site e competiria com o domínio
  // principal por conteúdo duplicado — mesma regra do src/app/robots.ts.
  ...(IS_PRODUCTION ? {} : { robots: { index: false, follow: false } }),
  title: "Amigo Violão - Cursos de violão online para toda a família",
  description:
    "Ensine ou aprenda violão com leveza e alegria. Cursos para crianças, iniciantes e professores.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Amigo Violão",
    title: "Amigo Violão - Cursos de violão online para toda a família",
    description:
      "Ensine ou aprenda violão com leveza e alegria. Cursos para crianças, iniciantes e professores.",
    url: SITE,
    images: [
      {
        url: "/images/logo-amigo-violao-branco.webp",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-[#3a3a3a]">
        {/* Sem JS o IntersectionObserver nunca marca data-visible e a página
            ficaria em branco: o estado inicial de .reveal é opacity 0. */}
        <noscript>
          <style>{`.reveal[data-blur]{opacity:1;transform:none;filter:none}`}</style>
        </noscript>
        <Analytics />
        <OrganizationJsonLd />
        {children}
        <BackToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
