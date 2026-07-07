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
import CrossSell from "@/components/sales/CrossSell";
import PricingCTA from "@/components/sales/PricingCTA";
import Faq from "@/components/sales/Faq";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";

export const metadata: Metadata = {
  title: "Curso de Violão Clássico - Amigo Violão",
  description:
    "Saiba tocar suas primeiras peças de violão solo, aprenda a ler partituras de forma interativa. Curso de violão clássico com o professor Ricardo Novais.",
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

const bonusCourses = [
  {
    title: "Curso de Violão Flamenco",
    subtitle: "Prof. Cléber Assumpção",
    image:
      "https://amigoviolao.com/wp-content/uploads/2023/11/Curso-de-Violao-Flemenco-1024x459.jpg.webp",
  },
  {
    title: "Curso de improvisação",
    subtitle: "Prof. Yuri Camargo",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
  {
    title: "Tópicos de Violão Popular",
    subtitle: "Prof. Ricardo Novais",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Copia-de-Copia-de-Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
  {
    title: "Organização do estudo",
    subtitle: "Prof. Jéfrey Andrade",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/01/Copia-de-Materiais-de-apoio-1024x459.jpg",
  },
];

const bio = [
  "Tocar violão sempre foi minha paixão. E há 20 anos venho ensinando.",
  "Me formei no bacharelado em violão na UFMG em 2006.",
  "O Amigo Violão abriu as portas do mundo para meu trabalho, através da internet.",
  "O violão clássico é uma pérola especial na minha vida. É onde realmente me encontro com a música.",
];

const inclusions = [
  "Curso completo de violão clássico (leitura, teoria, técnica e repertório)",
  "Mais de 100 videoaulas distribuídas em 4 cursos",
  "20 quizzes interativos de teoria e leitura",
  "4 cursos bônus (flamenco, improvisação, tópicos populares, organização do estudo)",
  "Acesso por 2 anos",
  "Garantia incondicional de 30 dias",
];

const faqs = [
  {
    question: "Este curso também funciona para quem é totalmente iniciante?",
    answer:
      "O objetivo do curso é ensinar leitura, teoria, técnica e repertório inicial para quem já toca pelo menos os primeiros acordes.",
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
    question: "Este curso funciona para quem quer fazer curso superior de música?",
    answer:
      "O curso visa preparar você para ler músicas em uma partitura, habilidade esta necessária para se cursar a faculdade de música. Mas o curso é focado em introduzir o violão clássico. Para concorrer a uma vaga na universidade será necessário estudar outros tópicos que o INVIC não aborda.",
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
  {
    question: "Quais conhecimentos prévios preciso ter?",
    answer:
      "Basta você tocar alguns acordes. O curso não é avançado, mas não aborda os primeiros passos. Com o pouco que souber e vontade de aprender, você já é um aluno apto.",
  },
  {
    question: "O curso é muito longo? São quantos módulos e aulas?",
    answer:
      "O programa de violão clássico possui 4 cursos: Leitura (17 módulos com aprox. 50 vídeo aulas), Teoria (4 módulos com aprox. 20 vídeo aulas), Técnica (5 módulos, com aprox. 15 vídeo aulas) e Repertório (6 módulos com aprox. 15 vídeo aulas).",
  },
  {
    question: "Quantas horas de estudo precisa por dia para ter resultados?",
    answer:
      "Se você estudar 30 min a 1 hora por dia, conseguirá evoluir rapidamente com a metodologia do INVIC. Importante salientar que muitas horas mal aproveitadas valem menos que alguns minutos bem estudados.",
  },
  {
    question: "Como é o suporte do INVIC?",
    answer:
      "Você terá acesso ao grupo secreto de alunos Amigo Violão onde terá interação com alunos e o professor. E poderá enviar vídeos para obter feedback por e-mail ou pelo grupo. Poderá também optar por mentorias pelo Zoom, após se inscrever.",
  },
];

export default function CursoDeClassicoPage() {
  return (
    <>
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
        <CrossSell heading="Aprenda de bônus:" items={bonusCourses} />

        <div className="bg-white py-2">
          <hr className="mx-auto max-w-4xl border-black/10" />
        </div>

        <About paragraphs={bio} />
        <PricingCTA
          heading="Aproveite a promoção, adquirindo o curso de violão clássico por apenas:"
          ctaText="SIM! QUERO TOCAR VIOLÃO CLÁSSICO"
          inclusions={inclusions}
        />
        <Faq faqs={faqs} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
