import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import { WHATSAPP_COURSE_MESSAGES } from "@/lib/links";
import VideoTestimonials from "@/components/VideoTestimonials";
import Reveal from "@/components/Reveal";
import PromoBanner from "@/components/sales/PromoBanner";
import FlamencoHero from "@/components/sales/FlamencoHero";
import BadgeStrip from "@/components/sales/BadgeStrip";
import CourseModules from "@/components/sales/CourseModules";
import CourseCurriculum from "@/components/sales/CourseCurriculum";
import TeacherInterview from "@/components/sales/TeacherInterview";
import CommonMistakes from "@/components/sales/CommonMistakes";
import LearnForReal from "@/components/sales/LearnForReal";
import PricingCTA from "@/components/sales/PricingCTA";
import ValueStack from "@/components/sales/ValueStack";
import Guarantee from "@/components/sales/Guarantee";
import FinalCTA from "@/components/sales/FinalCTA";
import Faq from "@/components/sales/Faq";
import { flamencoFaqs } from "@/components/sales/faqData";
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

// Quarta porta do SKU de Estudantes: o curso de Flamenco mora na Trilha
// Clássico, então preço, bônus e checkout são os mesmos das outras páginas de
// estudante e saem todos de src/lib/ofertas.ts. Ver a skill `precificacao`.
const preco = precoDaPagina("flamenco");
const bonus = bonusDaPagina("flamenco");

const descricao =
  "Rasgueos, golpes, alzapúa, trêmolo, picado e os palos flamencos, do básico ao avançado. Curso de técnicas de violão flamenco com o professor Cleber Assumpção.";

export const metadata: Metadata = {
  title: "Curso de Técnicas de Violão Flamenco - Amigo Violão",
  description: descricao,
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso de Técnicas de Violão Flamenco",
  description: descricao,
  url: "https://amigoviolao.com/cursos/flamenco",
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
  mainEntity: flamencoFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const badges = [
  "54 videoaulas em 8 módulos",
  "Técnica a serviço da música",
  "Do básico aos palos flamencos",
];

// A arte de cada módulo já traz o título escrito; o texto aqui vira o `alt`.
const modules = [
  {
    title: "Postura, posicionamento das mãos e relaxamento",
    image: "/images/flamenco/modulo-1.webp",
  },
  {
    title: "Sonoridade flamenca",
    image: "/images/flamenco/modulo-2.webp",
  },
  {
    title: "Técnicas percussivas: rasgueos e golpes",
    image: "/images/flamenco/modulo-3.webp",
  },
  {
    title: "Técnicas do polegar, alzapúa e toque alternado de polegar e indicador",
    image: "/images/flamenco/modulo-4.webp",
  },
  {
    title: "Técnicas de arpejos, trêmolo e picado",
    image: "/images/flamenco/modulo-5.webp",
  },
  {
    title: "Toques “a compás” sobre os principais ritmos (palos) flamencos",
    image: "/images/flamenco/modulo-6.webp",
  },
];

/**
 * O programa como ele está montado na plataforma, conferido pelo professor.
 * São 8 módulos e 54 videoaulas — as artes acima, feitas na época do
 * lançamento, agrupam as mesmas técnicas em 6 cartões temáticos, por isso as
 * duas seções não batem em número e a de cima não fala em "módulos".
 */
const curriculumStats = [
  { value: "8", label: "módulos" },
  { value: "54", label: "videoaulas" },
  { value: "≈ 5h30", label: "de vídeo" },
  { value: "PDF", label: "material escrito para baixar" },
];

const curriculumOpening = [
  "Vídeo de abertura do curso",
  "O violão e as principais posturas",
];

const curriculumModules = [
  {
    title: "Rasgueos",
    lessons: "9 videoaulas",
    description:
      "Rasgueo de dedos e rasgueo de pulso: as considerações de cada um, os acordes para estudar, as fórmulas e um estudo completo para cada técnica.",
  },
  {
    title: "Golpes",
    lessons: "8 videoaulas",
    description:
      "O golpe abaixo e acima das cordas, em sete exercícios que constroem a percussão no tampo sem atrapalhar o som nem forçar a mão. É aqui também que entra a levada de rumba.",
  },
  {
    title: "Arpejos",
    lessons: "5 videoaulas",
    description:
      "As fórmulas de arpejo e os estudos que as aplicam, entre eles um por alegrías e um por soleá por bulerías.",
  },
  {
    title: "Polegar",
    lessons: "6 videoaulas",
    description:
      "Treze exercícios progressivos de polegar, da mecânica do movimento ao ataque com peso, apoio e precisão.",
  },
  {
    title: "Alzapúa",
    lessons: "6 videoaulas",
    description:
      "Onze exercícios de alzapúa, o toque em que o polegar vai e volta entre a nota solta e o acorde.",
  },
  {
    title: "Trêmolo",
    lessons: "4 videoaulas",
    description:
      "Três exercícios e um estudo de trêmolo, para a mão direita ganhar regularidade e velocidade sem tensão.",
  },
  {
    title: "Picado",
    lessons: "7 videoaulas",
    description:
      "Dezenove exercícios de picado até o estudo final: a escala flamenca saindo seca e limpa, mesmo em andamento rápido.",
  },
  {
    title: "Introdução aos ritmos (palos) flamencos",
    lessons: "9 videoaulas",
    description:
      "Tangos, tientos, sevillanas, fandangos de Huelva, alegrías, bulerías, soleá por bulerías e soleá: o compás de cada um e como tocar dentro dele.",
  },
];

// Depoimentos da plataforma (os mesmos da página do Clássico, trilha onde o
// curso de Flamenco mora). Ainda não há depoimento em vídeo específico dele.
const videos = [
  { duration: "01:17", name: "Bella", youtubeId: "pgj2c2Vhgo4" },
  { duration: "01:00", name: "Wilkerson", youtubeId: "4tNNyEJbgvg" },
  { duration: "01:41", name: "André Horta", youtubeId: "lIEgxkuShzQ" },
  { duration: "01:20", name: "Flávio Bessa", youtubeId: "Bq7yzPSRrq0" },
];

// Não são depoimentos de alunos: são gravações do próprio Cleber tocando, do
// canal dele. Títulos conferidos no YouTube.
const performances = [
  { name: "Falseta por Alegrías", youtubeId: "B7_pqr03Wv4" },
  { name: "Guajiras", youtubeId: "MLKrpSRQ5ok" },
  { name: "Horizonte Distante", youtubeId: "GXKvwZYZo4M" },
  { name: "Caravana (Geraldo Azevedo e Alceu Valença)", youtubeId: "wrLbHvUr88Q" },
  { name: "Gitana", youtubeId: "RSD8K5uHkok" },
  { name: "Guitarra Flamenca Regis Bonilha", youtubeId: "A5XcLYmwCW4" },
  { name: "Sons de Carrilhões (João Pernambuco)", youtubeId: "s9xzQlFr8ac" },
  { name: "Samba do Avião", youtubeId: "a4ZVlkQr0sU" },
  { name: "Sorri / Smile (Charles Chaplin, versão de Djavan)", youtubeId: "vWRMS3Hcpzk" },
].map((v) => ({ ...v, caption: v.name }));

const obstacles = [
  "Escalas que embolam quando você tenta tocar rápido;",
  "Mãos esquerda e direita fora de sincronia;",
  "Força demais e tensão onde deveria haver relaxamento;",
  "Mão direita sem independência entre os dedos;",
  "A sensação de estar estagnado depois de anos tocando.",
];

const valueStackCoreItems = [
  "As 3 Trilhas completas — Clássico, Iniciantes e Infantil (14 cursos)",
  "Curso de Técnicas de Violão Flamenco: 8 módulos e 54 videoaulas, dentro da Trilha Clássico",
  "Leitura, teoria, técnica e repertório de violão solo na mesma trilha",
  "Acesso por 2 anos, com app para celular, tablet e TV",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

const valueStackBonuses = bonus.map((b) => ({
  label: b.titulo,
  value: formatarInteiroBRL(b.valor),
  description: b.descricao,
}));

// Texto em primeira pessoa, revisado e completado pelo próprio Cleber.
const bio = [
  "Venho de família de músicos: comecei a tocar em casa, com meu pai e meu avô, entre rodas de choro e seresta, o pop e o rock.",
  "O flamenco entrou na minha vida por uma fita cassete do Paco de Lucía. Foi um impacto gigantesco — e levei anos para entender como aquelas técnicas eram feitas.",
  "Sou bacharel em violão pela FAMUSC, em Pindamonhangaba, onde estudei com o professor Luiz Cláudio Stelzer, e tive aulas particulares com Henrique Pinto, no violão erudito, e com Fernando Corrêa, na guitarra jazz. O flamenco eu estudei com o professor Fernando de La Rua e, depois, com o professor Flávio Rodrigues.",
  "Toquei guitarra, jazz e violão de sete cordas, sempre buscando uma unidade: quanto mais técnicas de gêneros diferentes eu desenvolvo, maior a aquarela de cores que tenho para me expressar.",
  "Dou aulas há cerca de 30 anos e acompanho grupos de dança flamenca, com trabalhos em São Paulo, Taubaté e São José dos Campos.",
  "Conheci o Amigo Violão como aluno do PROVIC. Hoje é uma honra somar com a plataforma, ensinando com calma e precisão as técnicas que transformaram o meu violão.",
];

export default function CursoDeFlamencoPage() {
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
      <Header studentCtas={false} />
      <main className="flex-1 zoom-images">
        <PromoBanner
          text="🔥 Rasgueos e golpes • ⭐ Picado, trêmolo e alzapúa • ⚡ Acesso imediato • 🛡️ 30 dias de garantia"
          color="primary"
        />
        <FlamencoHero />
        <BadgeStrip badges={badges} />
        <CourseModules
          heading="As técnicas que você vai dominar:"
          modules={modules}
          columns={3}
          captions={false}
        />

        <CourseCurriculum
          heading="O programa completo do curso:"
          subheading="Oito módulos, uma técnica por vez, do rasgueo ao compás dos palos — cada um com as considerações do professor, os exercícios na ordem e um estudo para aplicar o que foi treinado."
          stats={curriculumStats}
          opening={curriculumOpening}
          modules={curriculumModules}
          closing="Considerações finais e agradecimentos"
          note="As 54 videoaulas são as dos oito módulos: o vídeo de abertura, a aula sobre o violão e as posturas e o encerramento vêm além delas. E dá para estudar tudo isso no violão de náilon que você já tem — violão flamenco não é pré-requisito."
        />

        <div className="bg-white pb-10 pt-6">
          <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xl font-bold text-charcoal sm:text-2xl">
              Acesso completo a este curso e a toda a plataforma, hoje!
            </p>
          </Reveal>
        </div>

        <LearnForReal
          headingHighlight="é precisão"
          headingRest="Velocidade não é força:"
          highlightPosition="second"
          paragraph="A estética do flamenco explora o virtuosismo, e por isso tudo nele exige precisão desde os estudos mais básicos: o sincronismo entre as duas mãos, o toque relaxado, o ataque com certeza. É por isso que a técnica flamenca ajuda qualquer violonista a se desenvolver, seja qual for o gênero que toca. Quanto mais técnica você tem, mais expressiva fica a sua música — e menos a técnica aparece."
          image={{
            src: "/images/flamenco/ilustracao-flamenco.webp",
            alt: "Ilustração de um violonista acompanhando um casal que dança flamenco",
            width: 540,
            height: 540,
          }}
          imagePosition="right"
          bgColor="cream"
        />
        <VideoTestimonials videos={videos} aspect="video" />
        <CommonMistakes
          headingHighlight="5 travas de quem já toca"
          headingRest="que a técnica flamenca destrava:"
          highlightColor="charcoal"
          items={obstacles}
          image={{
            src: "/images/flamenco/colagem-flamenco.webp",
            alt: "Mãos de violonistas tocando violão flamenco",
            width: 540,
            height: 540,
          }}
        />
        <LearnForReal
          headingHighlight="toque lento e pense rápido"
          headingRest="Para tocar rápido,"
          highlightPosition="second"
          paragraph="Parece contraditório, mas é o centro do curso: cada técnica é estudada bem devagar, com atenção ao movimento e à qualidade do som de cada nota. Depois que o cérebro ensina o comando certo ao dedo, a fluência vem — e o picado sai seco e limpo, os rasgueos ganham independência e o ritmo assenta sobre o compás de cada palo."
          image={{
            src: "/images/flamenco/mao-direita-flamenco.webp",
            alt: "Mão direita de um violonista tocando violão flamenco",
            width: 540,
            height: 540,
          }}
          imagePosition="left"
          bgColor="white"
        />
        <div className="bg-white py-2">
          <hr className="mx-auto max-w-4xl border-black/10" />
        </div>

        <Trilhas
          heading="O Flamenco vem dentro da Trilha Clássico — e você leva as três"
          subheading="Técnica se apoia em base: na mesma trilha estão leitura, teoria, técnica clássica e repertório de violão solo. E o acesso traz também a trilha que começa do zero e a infantil, no mesmo login e sem pagar nada a mais."
          trilhas={trilhasDaPagina("flamenco")}
          destaque={TRILHA_CARRO_CHEFE.flamenco}
          rotuloDestaque="Onde está o Flamenco"
          rotuloSecundario="Você também leva"
        />

        <About
          name="Cleber Assumpção"
          photo={{
            src: "/images/flamenco/cleber-assumpcao.webp",
            width: 800,
            height: 800,
          }}
          paragraphs={bio}
          whatsappMessage={WHATSAPP_COURSE_MESSAGES.flamenco}
        />
        {/* O bate-papo saiu do herói quando o vídeo de apresentação entrou lá;
            o Cleber pediu para mantê-lo na página, e aqui ele funciona melhor:
            logo depois da bio, para quem quer ouvir o professor falar. */}
        <TeacherInterview
          heading="Vale a pena aprender violão flamenco?"
          paragraph="Ricardo Novais e Cleber Assumpção conversam sobre o que a técnica flamenca acrescenta a quem já toca — de onde vêm os rasgueos, por que o picado exige tanta precisão e o que muda no violão de quem estuda isso a sério."
          photo={{
            src: "/images/flamenco/cleber-violao-abracado.webp",
            alt: "Cleber Assumpção abraçado ao violão flamenco",
            width: 1000,
            height: 816,
          }}
          youtubeId="vhM-wJZ0AOc"
          videoTitle="Bate-papo com Cleber Assumpção: vale a pena aprender violão flamenco?"
        />
        <VideoTestimonials
          videos={performances}
          aspect="video"
          columns={3}
          eyebrow="Ouça o professor"
          heading="Cleber Assumpção tocando"
        />
        <ValueStack
          coreItems={valueStackCoreItems}
          bonuses={valueStackBonuses}
          totalNote={`Somando apenas os bônus, são ${formatarInteiroBRL(
            totalDosBonus("flamenco"),
          )} que você leva sem pagar nada a mais.`}
        />
        <PricingCTA
          eyebrow="Menos de um quarto de uma mensalidade de aula particular."
          heading="Leve o seu violão a um outro nível com a técnica flamenca."
          ctaText="SIM! QUERO APRENDER VIOLÃO FLAMENCO"
          inclusions={null}
          checkoutUrl={checkoutDaPagina("flamenco")}
          anchorPrice={preco.ancora}
          installments={preco.parcelas}
          installmentPrice={preco.parcela}
          cashPrice={preco.aVista}
          campanha={preco.campanha}
        />
        <Guarantee text="Experimente o curso por 30 dias. Se você não gostar por qualquer motivo, é só pedir o reembolso dentro da própria plataforma e devolvemos 100% do valor, sem perguntas e sem burocracia. Todo o risco é nosso." />
        <Faq faqs={flamencoFaqs} />
        <FinalCTA
          heading="Você está a um passo de dominar as técnicas do violão flamenco"
          subtext="Comece hoje. Se em até 30 dias você achar que não é para você, devolvemos 100% do valor — sem perguntas."
          ctaText="QUERO APRENDER VIOLÃO FLAMENCO AGORA"
          checkoutUrl={checkoutDaPagina("flamenco")}
        />
      </main>
      <Footer />
      <StickyMobileCTA
        label="Quero a técnica flamenca"
        price={`${preco.parcelas}x de ${formatarBRL(preco.parcela)}`}
      />
    </>
  );
}
