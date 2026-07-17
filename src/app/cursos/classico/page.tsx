import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import WhyLearn from "@/components/WhyLearn";
import VideoTestimonials from "@/components/VideoTestimonials";
import Reveal from "@/components/Reveal";
import PromoBanner from "@/components/sales/PromoBanner";
import ClassicoHero from "@/components/sales/ClassicoHero";
import BadgeStrip from "@/components/sales/BadgeStrip";
import CourseModules from "@/components/sales/CourseModules";
import RicardoPlaying from "@/components/sales/RicardoPlaying";
import CommonMistakes from "@/components/sales/CommonMistakes";
import LearnForReal from "@/components/sales/LearnForReal";
import PricingCTA from "@/components/sales/PricingCTA";
import ValueStack from "@/components/sales/ValueStack";
import Guarantee from "@/components/sales/Guarantee";
import FinalCTA from "@/components/sales/FinalCTA";
import Faq from "@/components/sales/Faq";
import { classicoFaqs } from "@/components/sales/faqData";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";

export const metadata: Metadata = {
  title: "Curso de Violão Clássico - Amigo Violão",
  description:
    "Saiba tocar suas primeiras peças de violão solo, aprenda a ler partituras de forma interativa. Curso de violão clássico com o professor Ricardo Novais.",
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso de Violão Clássico",
  description:
    "Saiba tocar suas primeiras peças de violão solo, aprenda a ler partituras de forma interativa. Curso de violão clássico com o professor Ricardo Novais.",
  url: "https://amigoviolao.com/cursos/classico",
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
  mainEntity: classicoFaqs.map((faq) => ({
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

const modules = [
  {
    title: "Leitura de partituras",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/09/Leitura-Hipotese-1024x576.png",
  },
  {
    title: "Teoria musical",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/09/Teoria-Hip%C3%B3tese-1024x576.png",
  },
  {
    title: "Técnica clássica",
    image:
      "https://amigoviolao.com/wp-content/uploads/2020/07/T%C3%A9cnica-de-Viol%C3%A3o-Aprender-Viol%C3%A3o-Cl%C3%A1ssico-1024x576.jpg.webp",
  },
  {
    title: "Repertório",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/09/Repert%C3%B3rio-1024x576.png",
  },
];

const videos = [
  { duration: "01:17", name: "Bella" },
  { duration: "01:00", name: "Wilkerson" },
  { duration: "01:41", name: "André Horta" },
  { duration: "01:20", name: "Flávio Bessa" },
];

const obstacles = [
  "Falta de conhecimentos de leitura;",
  "Vícios técnicos;",
  "Falta de conhecimentos teóricos;",
  "Ausência de orientação para o estudo;",
  "Cultura musical limitada.",
];

const valueStackCoreItems = [
  "Curso completo de violão clássico (leitura, teoria, técnica e repertório)",
  "Mais de 100 videoaulas distribuídas em 4 cursos",
  "20 quizzes interativos de teoria e leitura",
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
  {
    label: "Curso para professores (PROVIC)",
    value: "R$ 479,00",
    description:
      "A formação para quem quer ensinar violão: didática, planejamento de aulas e método comprovado.",
  },
];

const bio = [
  "Tocar violão sempre foi minha paixão. E há 20 anos venho ensinando.",
  "Me formei no bacharelado em violão na UFMG em 2006.",
  "O Amigo Violão abriu as portas do mundo para meu trabalho, através da internet.",
  "O violão clássico é uma pérola especial na minha vida. É onde realmente me encontro com a música.",
];

export default function CursoDeClassicoPage() {
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
        <PromoBanner text="APROVEITE O PREÇO PROMOCIONAL" color="primary" />
        <ClassicoHero />
        <BadgeStrip badges={badges} />
        <CourseModules
          heading="Cursos presentes no programa de violão clássico:"
          modules={modules}
          columns={4}
        />

        <div className="bg-white pb-10 pt-6">
          <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xl font-bold text-charcoal sm:text-2xl">
              Acesso completo a este curso e a toda a plataforma, hoje!
            </p>
          </Reveal>
        </div>

        <WhyLearn
          image={{
            src: "https://amigoviolao.com/wp-content/uploads/2022/01/Violao-classico.png",
            alt: "Ilustração de pessoa tocando violão clássico",
            width: 600,
            height: 400,
          }}
        />
        <VideoTestimonials videos={videos} aspect="video" />
        <RicardoPlaying />
        <CommonMistakes
          headingHighlight="5 obstáculos do violão"
          headingRest="que vamos derrubar:"
          highlightColor="charcoal"
          items={obstacles}
          image={{
            src: "https://amigoviolao.com/wp-content/uploads/2022/02/Copia-de-Sem-nome23.png",
            alt: "Professor de violão clássico",
            width: 650,
            height: 750,
          }}
        />
        <LearnForReal
          headingHighlight="Quizes/ avaliações"
          headingRest="Aprenda com"
          highlightPosition="second"
          paragraph="O curso conta com 20 quizes (questionários), onde você poderá exercitar seus conhecimentos, podendo responder a cada um deles quantas vezes quiser. São perguntas de múltipla escolha, preencher lacunas ou de combinação entre colunas. Os questionários fazem parte dos cursos de teoria e leitura."
          image={{
            src: "https://amigoviolao.com/wp-content/uploads/2018/09/Quizes-1.png",
            alt: "Exemplos de quizzes do curso",
            width: 876,
            height: 538,
          }}
          imagePosition="left"
          bgColor="cream"
        />
        <div className="bg-white py-2">
          <hr className="mx-auto max-w-4xl border-black/10" />
        </div>

        <About paragraphs={bio} />
        <ValueStack
          coreItems={valueStackCoreItems}
          bonuses={valueStackBonuses}
          totalNote="Somando apenas os bônus, são R$ 1.352,00 em conteúdos que você leva sem pagar nada a mais."
        />
        <PricingCTA
          heading="Aproveite a promoção, adquirindo o curso de violão clássico por apenas:"
          ctaText="SIM! QUERO TOCAR VIOLÃO CLÁSSICO"
          inclusions={null}
        />
        <Guarantee text="Experimente o curso por 30 dias. Se você não gostar por qualquer motivo, é só pedir o reembolso dentro da própria plataforma e devolvemos 100% do valor, sem perguntas e sem burocracia. Todo o risco é nosso." />
        <Faq faqs={classicoFaqs} />
        <FinalCTA
          heading="Você está a um passo de tocar suas primeiras peças de violão solo"
          subtext="Comece hoje. Se em até 30 dias você achar que não é para você, devolvemos 100% do valor — sem perguntas."
          ctaText="QUERO TOCAR VIOLÃO CLÁSSICO AGORA"
        />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
