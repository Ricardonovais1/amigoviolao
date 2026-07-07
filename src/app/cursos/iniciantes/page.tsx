import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import WhyLearn from "@/components/WhyLearn";
import VideoTestimonials from "@/components/VideoTestimonials";
import PromoBanner from "@/components/sales/PromoBanner";
import IniciantesHero from "@/components/sales/IniciantesHero";
import BadgeStrip from "@/components/sales/BadgeStrip";
import LearnForReal from "@/components/sales/LearnForReal";
import WhoIsItFor from "@/components/sales/WhoIsItFor";
import CrossSell from "@/components/sales/CrossSell";
import PricingCTA from "@/components/sales/PricingCTA";
import CourseModules from "@/components/sales/CourseModules";
import Faq from "@/components/sales/Faq";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";

export const metadata: Metadata = {
  title: "Curso de Violão para Iniciantes - Amigo Violão",
  description:
    "Toque violão passando por pequenos degraus bem testados e dimensionados. Curso para iniciantes com o professor Ricardo Novais.",
};

const badges = [
  "Curso super gradual e acessível",
  "Estude quando e de onde quiser",
  "Aprendizado completo",
];

const videos = [
  { duration: "01:43", name: "Fátima" },
  { duration: "02:03", name: "Sizenando" },
  { duration: "01:17", name: "Bella" },
  { duration: "01:09", name: "Wilkerson" },
];

const audience = [
  "Pessoas de todas as idades que amam o violão e querem tocar também;",
  "Para quem já tentou e não conseguiu aprender;",
  "Para quem quer aumentar o repertório e tocar com os amigos;",
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

const faqs = [
  {
    question: "Como saber se este curso é para meu nível?",
    answer:
      "A nossa plataforma contém diferentes cursos, voltados a: Crianças; Iniciantes de qualquer idade; Alunos de violão que querem avançar (teoria, técnica, solos de violão, etc); Quem quer ensinar violão.",
  },
  {
    question: "Como é o acesso ao curso?",
    answer:
      "Você terá acesso a aulas dentro da plataforma do Amigo Violão, com login e senha, que serão enviados a você após sua inscrição.",
  },
  {
    question: "O que diferencia este curso de outros cursos de violão?",
    answer:
      "1 – Metodologia que funciona inclusive para crianças e alunos com mais dificuldades, usando recursos que preparam a musculatura, o entendimento musical e a coordenação motora, antes de chegar ao que outros métodos consideram “fácil”, que são os acordes e batidas. 2 – Sistema de ensino, que possui mentorias para que os alunos recebam feedback personalizado e nunca fiquem travados pelo fato do curso ser online. 3 – Cursos diferentes na plataforma para públicos diferentes. Crianças aprendem de um jeito diferente de adultos. E os objetivos de cada um são diferentes.",
  },
  {
    question: "Este curso me levará a um nível avançado?",
    answer:
      "Este é o objetivo deste curso. Te ajudar com as melhores ferramentas e estratégias a chegar no melhor nível possível no violão.",
  },
  {
    question: "Por quanto tempo teremos acesso?",
    answer: "Acesso por 2 anos à plataforma.",
  },
  {
    question: "E a garantia como funciona?",
    answer:
      "Você tem direito a 30 dias de garantia após o pagamento. Acreditamos realmente que este é o melhor curso de violão online que você pode ter acesso. Não apenas o método é o melhor, como a forma de ensinar também não deixa por menos. Aulas gravadas e suporte direto com o professor pelo Zoom. Não tem como dar errado. Por isso acreditamos muito neste curso e sabemos que você não precisará usar a garantia. Mas se quiser, claro, devolveremos seu dinheiro.",
  },
];

export default function CursoParaIniciantesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PromoBanner />
        <IniciantesHero />
        <BadgeStrip badges={badges} />
        <WhyLearn />
        <VideoTestimonials videos={videos} />
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
        <CrossSell />
        <About />
        <PricingCTA
          eyebrow="APROVEITE ESTA OFERTA!"
          heading="Acesso completo a este curso e a toda a plataforma, por apenas:"
          ctaText="SIM! QUERO MUITO APRENDER VIOLÃO!"
          inclusions={[
            "Curso completo de violão para iniciantes (cifras, solos e melodias)",
            "Acesso a toda a plataforma NAVE (cursos para crianças, avançar e ensinar também)",
            "Acesso por 2 anos",
            "Suporte direto com o professor",
            "Garantia incondicional de 30 dias",
          ]}
        />
        <CourseModules
          heading="Conteúdos do curso de violão para iniciantes:"
          modules={modules}
        />
        <Faq faqs={faqs} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
