import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import { WHATSAPP_COURSE_MESSAGES } from "@/lib/links";
import VideoTestimonials from "@/components/VideoTestimonials";
import ImageTestimonials from "@/components/sales/ImageTestimonials";
import PromoBanner from "@/components/sales/PromoBanner";
import SalesHero from "@/components/sales/SalesHero";
import FeatureBadges from "@/components/sales/FeatureBadges";
import SalesWhyLearn from "@/components/sales/SalesWhyLearn";
import CourseModules from "@/components/sales/CourseModules";
import CommonMistakes from "@/components/sales/CommonMistakes";
import WhoIsItFor from "@/components/sales/WhoIsItFor";
import PricingCTA from "@/components/sales/PricingCTA";
import ValueStack from "@/components/sales/ValueStack";
import Guarantee from "@/components/sales/Guarantee";
import FinalCTA from "@/components/sales/FinalCTA";
import Faq from "@/components/sales/Faq";
import { defaultFaqs } from "@/components/sales/faqData";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";
import Trilhas from "@/components/sales/Trilhas";
import {
  TRILHA_CARRO_CHEFE,
  bonusDaPagina,
  checkoutDaPagina,
  formatarBRL,
  formatarInteiroBRL,
  precoDaPagina,
  totalDosBonus,
  trilhasDaPagina,
} from "@/lib/ofertas";

// Preço, bônus e checkout saem de src/lib/ofertas.ts — as três páginas de
// estudante vendem o mesmo produto e não podem divergir. Ver a skill
// `precificacao`.
const preco = precoDaPagina("criancas");
const bonus = bonusDaPagina("criancas");

export const metadata: Metadata = {
  title: "Curso de Violão para Crianças - Amigo Violão",
  description:
    "Desperte o talento musical de seu filho com o violão. O melhor curso de violão para crianças do Brasil, com o professor Ricardo Novais.",
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso de Violão para Crianças",
  description:
    "Desperte o talento musical de seu filho com o violão. O melhor curso de violão para crianças do Brasil, com o professor Ricardo Novais.",
  url: "https://amigoviolao.com/cursos/criancas",
  inLanguage: "pt-BR",
  provider: {
    "@type": "Organization",
    name: "Amigo Violão",
    url: "https://amigoviolao.com",
  },
  offers: {
    "@type": "Offer",
    price: preco.aVista.toFixed(2),
    priceCurrency: "BRL",
    category: "Paid",
    availability: "https://schema.org/InStock",
  },
};

const coreItems = [
  "As 3 Trilhas completas — Infantil, Iniciantes e Clássico (14 cursos)",
  "Jogos musicais interativos para manter a criança motivada",
  "Acesso por 2 anos, com app para celular, tablet e TV",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

const screenshots = [
  {
    src: "/images/criancas/depoimentos/depoimento-1.webp",
    width: 591,
    height: 573,
    alt: "Comentários de pais sobre as aulas de violão para crianças do Amigo Violão",
  },
  {
    src: "/images/criancas/depoimentos/depoimento-2.webp",
    width: 900,
    height: 1600,
    alt: "Depoimento no Instagram de aluna que aprendeu violão com o Amigo Violão ainda criança",
  },
  {
    src: "/images/criancas/depoimentos/depoimento-3.webp",
    width: 900,
    height: 1600,
    alt: "Pai e filha tocando violão juntos com o método Amigo Violão",
  },
];

const bonusFormatado = bonus.map((b) => ({
  label: b.titulo,
  value: formatarInteiroBRL(b.valor),
  description: b.descricao,
}));

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: defaultFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function CursoParaCriancasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main className="flex-1 zoom-images">
        <PromoBanner text="⭐ Mais de 10 mil alunos • 🎸 14 cursos inclusos • ⚡ Acesso imediato • 🛡️ 30 dias de garantia" />
        <SalesHero />
        <FeatureBadges />
        <SalesWhyLearn />
        <CourseModules />
        <VideoTestimonials aspect="video" />
        <ImageTestimonials
          heading="O que as famílias estão dizendo"
          subheading="Mensagens reais de pais e crianças aprendendo violão com o Amigo Violão."
          screenshots={screenshots}
        />
        <CommonMistakes />
        <WhoIsItFor />

        <Trilhas
          heading="E você ainda leva as outras duas trilhas"
          subheading="O acesso não é só o curso infantil. São as três trilhas completas, no mesmo login e sem pagar nada a mais — para o seu filho aprender e para você aprender junto."
          trilhas={trilhasDaPagina("criancas")}
          destaque={TRILHA_CARRO_CHEFE.criancas}
          rotuloDestaque="O curso do seu filho"
          rotuloSecundario="Você também leva"
        />

        <About whatsappMessage={WHATSAPP_COURSE_MESSAGES.criancas} />
        <ValueStack
          coreItems={coreItems}
          bonuses={bonusFormatado}
          totalNote={`Somando apenas os bônus, são ${formatarInteiroBRL(
            totalDosBonus("criancas"),
          )} que você leva sem pagar nada a mais.`}
        />
        <PricingCTA
          eyebrow="Menos de um quarto de uma mensalidade de aula particular."
          heading="Seu filho aprende hoje. A família inteira colhe os frutos amanhã."
          inclusions={null}
          checkoutUrl={checkoutDaPagina("criancas")}
          anchorPrice={preco.ancora}
          installments={preco.parcelas}
          installmentPrice={preco.parcela}
          cashPrice={preco.aVista}
        />
        <Guarantee />
        <Faq />
        <FinalCTA checkoutUrl={checkoutDaPagina("criancas")} />
      </main>
      <Footer />
      <StickyMobileCTA
        label="Quero inscrever meu filho(a)"
        price={`${preco.parcelas}x de ${formatarBRL(preco.parcela)}`}
      />
    </>
  );
}
