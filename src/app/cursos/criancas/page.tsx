import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import { WHATSAPP_COURSE_MESSAGES } from "@/lib/links";
import VideoTestimonials from "@/components/VideoTestimonials";
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
    price: "479.00",
    priceCurrency: "BRL",
    category: "Paid",
    availability: "https://schema.org/InStock",
  },
};

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
        <PromoBanner />
        <SalesHero />
        <FeatureBadges />
        <SalesWhyLearn />
        <CourseModules />
        <VideoTestimonials aspect="video" />
        <CommonMistakes />
        <WhoIsItFor />
        <About whatsappMessage={WHATSAPP_COURSE_MESSAGES.criancas} />
        <ValueStack />
        <PricingCTA inclusions={null} />
        <Guarantee />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA label="Quero inscrever meu filho(a)" />
    </>
  );
}
