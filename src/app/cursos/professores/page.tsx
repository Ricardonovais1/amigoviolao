import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import Reveal from "@/components/Reveal";
import PromoBanner from "@/components/sales/PromoBanner";
import ProvicHero from "@/components/sales/ProvicHero";
import BadgeStrip from "@/components/sales/BadgeStrip";
import CommonMistakes from "@/components/sales/CommonMistakes";
import LearnForReal from "@/components/sales/LearnForReal";
import CourseModules from "@/components/sales/CourseModules";
import ProvicFeatures from "@/components/sales/ProvicFeatures";
import ProvicTeachers from "@/components/sales/ProvicTeachers";
import TextTestimonials from "@/components/sales/TextTestimonials";
import CrossSell from "@/components/sales/CrossSell";
import NaveCourses from "@/components/sales/NaveCourses";
import PricingCTA from "@/components/sales/PricingCTA";
import Faq from "@/components/sales/Faq";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";
import { HOTMART_PROVIC_CHECKOUT_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Curso PROVIC - Professor de Violão para Crianças - Amigo Violão",
  description:
    "Seja um professor de violão mais reconhecido e valorize suas aulas, reduzindo a desmotivação e desistências. Curso PROVIC com o professor Ricardo Novais.",
};

const badges = [
  "Se torne um professor certificado",
  "Estude quando e de onde quiser",
  "Aprendizado completo",
];

const mistakes = [
  "Acreditar que todas as crianças vão aprender como nós mesmos aprendemos;",
  "Infantilizar demasiadamente a abordagem com as crianças;",
  "Facilitar ao máximo na explicação, com excelente didática, mas usando material que não leva em consideração a cognição infantil;",
  "Acreditar que ensinar para crianças, por ser mais “básico”, é mais fácil;",
];

const modules = [
  {
    title: "Cordas soltas",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-1-imagem-ilustrativa.jpg",
  },
  {
    title: "Leitura gráfica",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-2-imagem-ilustrativa.jpg",
  },
  {
    title: "Melodias pelo braço do violão",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-3-imagem-ilustrativa.jpg",
  },
  {
    title: "Solinhos iniciais",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-4-imagem-ilustrativa.jpg",
  },
  {
    title: "Músicas de acordes",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-5-imagem-ilustrativa.jpg",
  },
  {
    title: "Primeiras peças solo",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-6-imagem-ilustrativa-1.jpg",
  },
  {
    title: "Jogos didáticos",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-7-imagem-ilustrativa.jpg",
  },
  {
    title: "Leitura relativa e absoluta",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/M%C3%B3dulo-8-imagem-ilustrativa.jpg",
  },
];

const bonusItems = [
  {
    title: "Contrato para você firmar com seus alunos",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/Imagem-contrato_tamanho.png",
  },
  {
    title: "Cartão de visitas Amigo Violão",
    image:
      "https://amigoviolao.com/wp-content/uploads/2018/05/Cart%C3%A3o-de-Visitas-1.jpg",
  },
  {
    title: "Certificado 45 Horas após aprovação nas avaliações",
    image:
      "https://amigoviolao.com/wp-content/uploads/2022/02/Certificado-Eduardo-1024x711-1.png",
  },
];

const bio = [
  "Sou bacharel em violão pela UFMG desde 2006.",
  "Tocar violão sempre foi minha paixão. E há 20 anos venho ensinando.",
  "As crianças abriram as portas para que eu me tornasse um didata do instrumento.",
  "O Amigo Violão abriu as portas do mundo para meu trabalho, através da internet.",
  "Eu valorizo os alunos que, apesar de terem um professor, são antes de tudo autodidatas, pois buscam o conhecimento.",
];

const inclusions = [
  "PROVIC - Para professores (acesso vitalício)",
  "Bônus: cursos para você ensinar iniciantes",
  "Bônus: cursos de técnica, teoria e leitura",
  "Bônus: método de violão clássico",
  "PDF e áudios para baixar",
  "Certificação por avaliações dentro do curso",
  "Mentorias pelo Zoom e por WhatsApp",
];

const faqs = [
  {
    question: "Este curso funciona só para professores ou para meu filho também?",
    answer:
      "Para seu filho opte por outro curso, “Violão para Crianças”. Ele também está presente no acesso à plataforma.",
  },
  {
    question: "Como é o acesso ao curso?",
    answer:
      "Você terá acesso a aulas dentro da plataforma do Amigo Violão, com login e senha, que serão enviados a você após sua inscrição.",
  },
  {
    question: "Este método funciona para aulas em grupo também?",
    answer:
      "Sim! A estratégia e aplicação das músicas e atividades do Método Amigo Violão PROVIC está 100% alinhada com as possibilidades e exigências de aulas em grupo.",
  },
  {
    question: "Esse curso funciona para ensinar violão para adolescentes e adultos também?",
    answer:
      "Sim. A metodologia Amigo Violão foi essencialmente desenhada para crianças, porém o conteúdo é apropriado para iniciar adultos e adolescentes com dificuldade de aprendizagem, ou que tenham preconceitos que por fim acabam por tornar o violão mais difícil do que é, sem necessidade. Além disso, você recebe acesso aos demais conteúdos do site, que o assistirão com alunos diversos.",
  },
  {
    question: "Professores sem experiência conseguem implementar?",
    answer:
      "Sim! O curso possui muitos vídeos muito bem estruturados, que servem inclusive leigos ou para pais e mães que queiram aprender violão e ensinar para seus filhos.",
  },
  {
    question: "Onde esse Método já foi aplicado? Realmente funciona?",
    answer:
      "O Método do PROVIC já foi aplicado por mais de 500 professores no Brasil, possuindo um alto índice de aprovação. Foi desenvolvido em aulas com centenas de alunos e reunido de forma organizada e inteligível neste curso.",
  },
  {
    question: "É preciso saber ler partituras?",
    answer:
      "Não, pois 95% do que fazemos nas aulas com as crianças não chega a abordar este assunto. No entanto, caso você ainda não possua este conhecimento, dentro da plataforma há cursos bem estruturados voltados exatamente para isso, com leitura e teoria de forma prática e teórica.",
  },
  {
    question: "Nesse método, o professor precisa ter alguma formação prévia?",
    answer:
      "Não! Toda estratégia e aplicação da metodologia Amigo Violão é extremamente acessível e poderá ser usada por quem quer que se disponha a isso. Porém, para ser um professor certificado precisará passar pelas avaliações do curso.",
  },
  {
    question: "Serve para quem nunca ensinou?",
    answer:
      "Sim, independente do seu nível de experiência você conseguirá ter resultados. Passei muitos anos até desenvolver tudo isso, mas receber pronto é bem mais simples.",
  },
  {
    question: "O Curso é muito longo? São quantos módulos e aulas?",
    answer:
      "Meu objetivo com o curso é que você estude 100% do curso e aplique o máximo possível, então o curso é bem direto ao ponto, são 9 módulos + Bônus exclusivos, cada módulo tem em média 8 aulas, e por fim, cada aula tem em média 5 minutos.",
  },
  {
    question: "Quantas horas de estudo precisa por dia para ter resultados?",
    answer:
      "Se você estudar 30min por dia e aplicar, conseguirá evoluir rapidamente com a metodologia do PROVIC.",
  },
  {
    question: "Como são as avaliações do curso PROVIC?",
    answer:
      "São de 3 tipos: 1 – Perguntas de múltipla escolha dentro da área de membros; 2 – Avaliações escritas; 3 – Vídeos enviados para avaliação.",
  },
  {
    question: "O curso é online ou ao vivo?",
    answer:
      "As aulas são gravadas, você receberá nossa área de membros com todo o conteúdo em vídeo, PDFs, Áudios e ainda as atualizações e suporte exclusivo pelo grupo de alunos e whatsapp.",
  },
  {
    question: "Quanto tempo de acesso?",
    answer:
      "O acesso ao PROVIC é vitalício, através da plataforma do Hotmart. Paralelamente você recebe o acesso à NAVE AMIGO VIOLÃO por 2 anos, que possui os bônus descritos na pergunta a seguinte.",
  },
  {
    question: "Quais são os conteúdos bônus?",
    answer:
      "Acesso à NAVE AMIGO VIOLÃO com os seguintes conteúdos: Curso para iniciantes; Curso para crianças; Técnicas do violão flamenco; Violão na musicalização infantil; Improvisação básica; Teoria Musical; Leitura de partituras; Jogos musicais interativos para crianças. Contrato para firmar com alunos; Arte do cartão de visita de professor credenciado Amigo Violão e certificado.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "A garantia é condicional. Se você não gostar da qualidade do produto seu dinheiro será devolvido até 30 dias.",
  },
];

export default function CursoParaProfessoresPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PromoBanner
          text="PROMO DE FÉRIAS: Se prepare para ser excelente nas aulas do segundo semestre."
          color="teal"
        />
        <ProvicHero />
        <BadgeStrip badges={badges} />

        <CommonMistakes
          headingHighlight="4 Erros Principais do Ensino"
          headingRest="do Violão para Crianças:"
          highlightColor="primary"
          items={mistakes}
          image={{
            src: "https://amigoviolao.com/wp-content/uploads/2018/05/Ilustra%C3%A7%C3%A3o-1.png",
            alt: "Ilustração de material de estudo de violão",
            width: 640,
            height: 701,
          }}
        />

        <div className="bg-white py-2">
          <hr className="mx-auto max-w-4xl border-primary/40" />
        </div>

        <LearnForReal
          headingHighlight="aulas de violão:"
          headingRest="Seja eficiente nas suas"
          highlightPosition="second"
          paragraph="O que o Professor de Violão credenciado na metodologia Amigo Violão sabe fazer, é identificar as músicas e atividades certas para cada momento de seus alunos. E isso requer conhecimentos de ordem prática e conceitual. Cada aluno trás seus sonhos e desejos, que não devem ser ignorados, mas sim incorporados à didática e às estratégias de aula."
          image={{
            src: "https://amigoviolao.com/wp-content/uploads/2018/05/Ilustra%C3%A7%C3%A3o-iii.png",
            alt: "Ilustração de professor ensinando violão",
            width: 640,
            height: 497,
          }}
          imagePosition="left"
        />

        <CourseModules
          heading="Módulos do curso Provic:"
          modules={modules}
          columns={4}
        />

        <ProvicFeatures />

        <div className="bg-white pb-10 pt-6">
          <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xl font-bold text-charcoal sm:text-2xl">
              Acesso completo a este curso e a toda a plataforma, hoje!
            </p>
          </Reveal>
        </div>

        <PricingCTA
          heading="Compre agora e tenha acesso a:"
          ctaText="COMECE AGORA O CURSO"
          checkoutUrl={HOTMART_PROVIC_CHECKOUT_URL}
          inclusions={inclusions}
        />

        <ProvicTeachers />
        <TextTestimonials />

        <div className="bg-white pt-2">
          <hr className="mx-auto max-w-4xl border-primary/40" />
        </div>

        <div className="bg-white pt-16">
          <Reveal className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
              Bônus:
            </h2>
            <p className="mt-6 text-foreground/70">
              Fazendo as atividades propostas no curso você poderá obter o
              certificado do Amigo Violão, para atuar como Professor de
              Violão para Crianças
            </p>
          </Reveal>
        </div>
        <CrossSell
          heading={null}
          items={bonusItems}
          columns={3}
          topPadding="none"
        />

        <NaveCourses />
        <About paragraphs={bio} />

        <PricingCTA
          heading="Compre agora e tenha acesso a:"
          ctaText="COMECE AGORA O CURSO"
          checkoutUrl={HOTMART_PROVIC_CHECKOUT_URL}
          inclusions={inclusions}
          sectionId="comprar-final"
        />

        <Faq faqs={faqs} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
