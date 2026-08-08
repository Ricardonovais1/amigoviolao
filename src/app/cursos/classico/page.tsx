import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import { WHATSAPP_COURSE_MESSAGES } from "@/lib/links";
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

// Mesmo produto das outras duas páginas de estudante: preço, bônus e checkout
// saem todos de src/lib/ofertas.ts. Ver a skill `precificacao`.
const preco = precoDaPagina("classico");
const bonus = bonusDaPagina("classico");

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
    price: preco.aVista.toFixed(2),
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
  { duration: "01:17", name: "Bella", youtubeId: "pgj2c2Vhgo4" },
  { duration: "01:00", name: "Wilkerson", youtubeId: "4tNNyEJbgvg" },
  { duration: "01:41", name: "André Horta", youtubeId: "lIEgxkuShzQ" },
  { duration: "01:20", name: "Flávio Bessa", youtubeId: "Bq7yzPSRrq0" },
];

const obstacles = [
  "Falta de conhecimentos de leitura;",
  "Vícios técnicos;",
  "Falta de conhecimentos teóricos;",
  "Ausência de orientação para o estudo;",
  "Cultura musical limitada.",
];

const valueStackCoreItems = [
  "As 3 Trilhas completas — Clássico, Iniciantes e Infantil (14 cursos)",
  "Mais de 100 videoaulas de leitura, teoria, técnica e repertório",
  "20 quizzes interativos de teoria e leitura",
  "Acesso por 2 anos, com app para celular, tablet e TV",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

const valueStackBonuses = bonus.map((b) => ({
  label: b.titulo,
  value: formatarInteiroBRL(b.valor),
  description: b.descricao,
}));

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
      <main className="flex-1 zoom-images">
        <PromoBanner
          text="🎸 Leitura e teoria • ⭐ Técnica e repertório • ⚡ Acesso imediato • 🛡️ 30 dias de garantia"
          color="primary"
        />
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

        <Trilhas
          heading="E você ainda leva as outras duas trilhas"
          subheading="Muita gente chega ao erudito vindo da cifra — e às vezes precisa voltar um passo. O acesso traz também a trilha que começa do zero e a infantil, no mesmo login e sem pagar nada a mais."
          trilhas={trilhasDaPagina("classico")}
          destaque={TRILHA_CARRO_CHEFE.classico}
          rotuloDestaque="O seu ponto de partida"
          rotuloSecundario="Você também leva"
        />

        <About paragraphs={bio} whatsappMessage={WHATSAPP_COURSE_MESSAGES.classico} />
        <ValueStack
          coreItems={valueStackCoreItems}
          bonuses={valueStackBonuses}
          totalNote={`Somando apenas os bônus, são ${formatarInteiroBRL(
            totalDosBonus("classico"),
          )} que você leva sem pagar nada a mais.`}
        />
        <PricingCTA
          eyebrow="Menos de um quarto de uma mensalidade de aula particular."
          heading="Construa uma formação sólida no violão clássico."
          ctaText="SIM! QUERO TOCAR VIOLÃO CLÁSSICO"
          inclusions={null}
          checkoutUrl={checkoutDaPagina("classico")}
          anchorPrice={preco.ancora}
          installments={preco.parcelas}
          installmentPrice={preco.parcela}
          cashPrice={preco.aVista}
        />
        <Guarantee text="Experimente o curso por 30 dias. Se você não gostar por qualquer motivo, é só pedir o reembolso dentro da própria plataforma e devolvemos 100% do valor, sem perguntas e sem burocracia. Todo o risco é nosso." />
        <Faq faqs={classicoFaqs} />
        <FinalCTA
          heading="Você está a um passo de tocar suas primeiras peças de violão solo"
          subtext="Comece hoje. Se em até 30 dias você achar que não é para você, devolvemos 100% do valor — sem perguntas."
          ctaText="QUERO TOCAR VIOLÃO CLÁSSICO AGORA"
          checkoutUrl={checkoutDaPagina("classico")}
        />
      </main>
      <Footer />
      <StickyMobileCTA
        label="Quero dominar o violão"
        price={`${preco.parcelas}x de ${formatarBRL(preco.parcela)}`}
      />
    </>
  );
}
