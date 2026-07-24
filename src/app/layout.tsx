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

export const metadata: Metadata = {
  metadataBase: new URL("https://amigoviolao.com"),
  // TODO: remover antes do lançamento oficial — impede indexação pelo Google
  // enquanto o site está em teste no domínio .vercel.app
  robots: {
    index: false,
    follow: false,
  },
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
    url: "https://amigoviolao.com",
    images: [
      {
        url: "https://amigoviolao.com/wp-content/uploads/2021/05/cropped-cropped-Logo-Branca-site-Amigo-Violao-2.png.webp",
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
        <Analytics />
        <OrganizationJsonLd />
        {children}
        <BackToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
