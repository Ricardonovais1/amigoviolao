import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import { WHATSAPP_COURSE_MESSAGES } from "@/lib/links";
import VideoTestimonials from "@/components/VideoTestimonials";
import PromoBanner from "@/components/sales/PromoBanner";
import IniciantesHero from "@/components/sales/IniciantesHero";
import FeatureBadges from "@/components/sales/FeatureBadges";
import SalesWhyLearn from "@/components/sales/SalesWhyLearn";
import CourseModules from "@/components/sales/CourseModules";
import LearnForReal from "@/components/sales/LearnForReal";
import WhoIsItFor from "@/components/sales/WhoIsItFor";
import PricingCTA from "@/components/sales/PricingCTA";
import ValueStack from "@/components/sales/ValueStack";
import Guarantee from "@/components/sales/Guarantee";
import FinalCTA from "@/components/sales/FinalCTA";
import Faq from "@/components/sales/Faq";
import { iniciantesFaqs } from "@/components/sales/faqData";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";

export const metadata: Metadata = {
  title: "Curso de Violão para Iniciantes - Amigo Violão",
  description:
    "Toque violão passando por pequenos degraus bem testados e dimensionados. Curso para iniciantes com o professor Ricardo Novais.",
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso de Violão para Iniciantes",
  description:
    "Toque violão passando por pequenos degraus bem testados e dimensionados. Curso para iniciantes com o professor Ricardo Novais.",
  url: "https://amigoviolao.com/cursos/iniciantes",
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
  mainEntity: iniciantesFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const badges = [
  "Curso super gradual e acessível",
  "Estude quando e de onde quiser",
  "Aprendizado completo",
];

const whyLearnFeatures = [
  {
    title: "O Amigo Violão é líder",
    description:
      "Em ensinar violão de forma gradual e eficaz, inclusive para quem já tentou e não conseguiu.",
  },
  {
    title: "Tudo começa aqui",
    description:
      "Acesse aulas, exercícios, playbacks, cifras, tabs e suporte direto.",
  },
  {
    title: "Aprenda com os melhores!",
    description:
      "Professores especialistas em didática. Ensinar é uma arte que valorizamos.",
  },
  {
    title: "Para toda a família",
    description:
      "O acesso inclui este e muitos outros cursos, para que toda a família aprenda.",
  },
];

const modules = [
  {
    title: "Músicas cifradas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2021/07/Design-sem-nome74.png.webp",
  },
  {
    title: "Solos para violão",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Sem-nome11.jpg",
  },
  {
    title: "Melodias lindas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Sem-nome12.jpg",
  },
];

const videos = [
  { duration: "01:43", name: "Fátima", youtubeId: "Ke3r2ffbz2A" },
  { duration: "02:03", name: "Sizenando", youtubeId: "eajqt7bQkGQ" },
  { duration: "01:17", name: "Bella", youtubeId: "pgj2c2Vhgo4" },
  { duration: "01:09", name: "Wilkerson", youtubeId: "4tNNyEJbgvg" },
];

const audience = [
  "Pessoas de todas as idades que amam o violão e querem tocar também;",
  "Para quem já tentou e não conseguiu aprender;",
  "Para quem quer aumentar o repertório e tocar com os amigos;",
];

const valueStackCoreItems = [
  "Curso completo de violão para iniciantes (cifras, solos e melodias)",
  "Acesso por 2 anos na plataforma NAVE",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

const valueStackBonuses = [
  {
    label: "Curso de Violão para Crianças",
    value: "R$ 479,00",
    description:
      "O curso completo para os pequenos — perfeito para incentivar os filhos e aprender em família.",
  },
  {
    label: "Iniciação ao Violão Clássico",
    value: "R$ 479,00",
    description:
      "Primeiros passos no violão erudito, com técnica de dedilhado e repertório clássico.",
  },
  {
    label: "Técnicas de violão flamenco",
    value: "R$ 197,00",
    description:
      "Rasgueados, percussão e outras técnicas do flamenco para dar um novo colorido ao seu violão.",
  },
  {
    label: "Improvisação na guitarra",
    value: "R$ 197,00",
    description:
      "Aprenda a improvisar solos e criar frases musicais com liberdade, do violão à guitarra.",
  },
];

export default function CursoParaIniciantesPage() {
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
      <main className="flex-1">
        <PromoBanner />
        <IniciantesHero />
        <FeatureBadges badges={badges} />
        <SalesWhyLearn features={whyLearnFeatures} />
        <CourseModules
          heading="Conteúdos do curso de violão para iniciantes:"
          modules={modules}
        />
        <VideoTestimonials videos={videos} aspect="video" />
        <LearnForReal />
        <WhoIsItFor
          audience={audience}
          image={{
            src: "https://amigoviolao.com/wp-content/uploads/2022/01/Violao-online.png",
            alt: "Ilustração de aula de violão online",
            width: 600,
            height: 400,
          }}
        />
        <About whatsappMessage={WHATSAPP_COURSE_MESSAGES.iniciantes} />
        <ValueStack
          coreItems={valueStackCoreItems}
          bonuses={valueStackBonuses}
        />
        <PricingCTA
          eyebrow="APROVEITE ESTA OFERTA!"
          heading="Acesso completo a este curso e a toda a plataforma, por apenas:"
          ctaText="SIM! QUERO MUITO APRENDER VIOLÃO!"
          inclusions={null}
        />
        <Guarantee text="Experimente o curso por 30 dias. Se você não gostar por qualquer motivo, é só pedir o reembolso dentro da própria plataforma e devolvemos 100% do valor, sem perguntas e sem burocracia. Todo o risco é nosso." />
        <Faq faqs={iniciantesFaqs} />
        <FinalCTA
          heading="Você está a um passo de tocar suas primeiras músicas"
          subtext="Comece hoje. Se em até 30 dias você achar que não é para você, devolvemos 100% do valor — sem perguntas."
          ctaText="QUERO APRENDER VIOLÃO AGORA"
        />
      </main>
      <Footer />
      <StickyMobileCTA label="Quero tocar violão do zero" />
    </>
  );
}
