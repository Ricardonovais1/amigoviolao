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
import ImageTestimonials from "@/components/sales/ImageTestimonials";
import ProfessorsShowcase from "@/components/sales/ProfessorsShowcase";
import Trilhas from "@/components/sales/Trilhas";
import PricingCTA from "@/components/sales/PricingCTA";
import ValueStack from "@/components/sales/ValueStack";
import Guarantee from "@/components/sales/Guarantee";
import FinalCTA from "@/components/sales/FinalCTA";
import Faq from "@/components/sales/Faq";
import StickyMobileCTA from "@/components/sales/StickyMobileCTA";
import { WHATSAPP_COURSE_MESSAGES } from "@/lib/links";
import {
  TRILHAS,
  bonusDaPagina,
  checkoutDaPagina,
  formatarBRL,
  formatarInteiroBRL,
  precoDaPagina,
  totalDosBonus,
} from "@/lib/ofertas";

// Preço, bônus e checkout saem todos de src/lib/ofertas.ts — nenhum número
// desta página é digitado à mão. Ver .claude/skills/precificacao.
const preco = precoDaPagina("professores");
const bonus = bonusDaPagina("professores");
const checkout = checkoutDaPagina("professores");

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

const bio = [
  "Sou bacharel em violão pela UFMG desde 2006.",
  "Tocar violão sempre foi minha paixão. E há 20 anos venho ensinando.",
  "As crianças abriram as portas para que eu me tornasse um didata do instrumento.",
  "O Amigo Violão abriu as portas do mundo para meu trabalho, através da internet.",
  "Eu valorizo os alunos que, apesar de terem um professor, são antes de tudo autodidatas, pois buscam o conhecimento.",
];

// A formação é a oferta principal: método docente + as 3 trilhas de aplicação
// + a credencial. Nada disso é bônus — chamar curso inteiro de brinde encolhe
// a promessa em vez de aumentá-la.
const valueStackCoreItems = [
  "Curso PROVIC completo, com acesso por 2 anos",
  "VEM — Violão para Educadores Musicais: musicalização e aula em grupo",
  "Organização e condução das aulas: como escolher o próximo passo de cada aluno",
  "As 3 Trilhas de Aplicação completas — Infantil, Iniciantes e Clássico",
  "Certificação de 45h após aprovação nas avaliações",
  "Atividades imprimíveis, PDFs e áudios para usar nas suas aulas",
  "Comunidade de professores Amigo Violão e suporte por WhatsApp",
  "Garantia de 30 dias",
];

const valueStackBonuses = bonus.map((b) => ({
  label: b.titulo,
  value: formatarInteiroBRL(b.valor),
  description: b.descricao,
}));

const faqs = [
  {
    question: "Este curso funciona só para professores ou para meu filho também?",
    answer:
      "A Formação é para quem vai ensinar. Mas ela inclui a Trilha Infantil completa, com o curso “Violão para Crianças” — então o seu filho pode estudar pelo mesmo acesso. Se você não pretende dar aulas, a turma de Estudantes já entrega as três trilhas por um valor menor; o que só existe aqui é a formação docente e a certificação.",
  },
  {
    question: "Qual a diferença entre esta formação e o curso para estudantes?",
    answer:
      "A turma de Estudantes traz as 3 Trilhas — Infantil, Iniciantes e Clássico — para quem quer aprender a tocar. A Formação de Professor traz tudo isso mais o método PROVIC, o VEM, o módulo de organização e condução das aulas, os bônus de carreira e a certificação de 45 horas. Quem já é aluno pode fazer o upgrade pagando só a diferença.",
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
      "O Método do PROVIC já foi aplicado por mais de 850 professores no Brasil, possuindo um alto índice de aprovação. Foi desenvolvido em aulas com centenas de alunos e reunido de forma organizada e inteligível neste curso.",
  },
  {
    question: "É preciso saber ler partituras?",
    answer:
      "Não, pois 95% do que fazemos nas aulas com as crianças não chega a abordar este assunto. E caso você ainda não tenha esse conhecimento, a Trilha Clássico inclui os cursos de Leitura musical e Teoria musical, voltados exatamente para isso, de forma prática.",
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
      "São 2 anos de acesso a tudo — formação, trilhas e bônus — pela plataforma da Hotmart, numa única turma.",
  },
  {
    question: "O que exatamente está incluído?",
    answer:
      "A formação docente (PROVIC, VEM e o módulo de organização e condução das aulas), as 3 Trilhas de Aplicação completas — Infantil, Iniciantes e Clássico, com 14 cursos entre elas — a certificação de 45 horas, a comunidade de professores e os bônus de carreira: o Calendário do Professor, o Guia de Precificação e Captação de Alunos e o Kit de Credenciamento.",
  },
  {
    question: "Quais são os bônus?",
    answer:
      "São três, e todos tratam do lado comercial da profissão, que nenhum curso do catálogo cobre: o Calendário do Professor, que monta o calendário e o contrato do seu aluno garantindo as suas semanas de férias remuneradas; o Guia de Precificação e Captação de Alunos; e o Kit de Credenciamento, com a arte do cartão de visita e o selo de professor credenciado. O curso te ensina a ensinar — os bônus te ensinam a viver disso.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "A garantia é condicional. Se você não gostar da qualidade do produto seu dinheiro será devolvido até 30 dias.",
  },
  {
    question: "Tem aplicativo para assistir às aulas?",
    answer:
      "Sim! O acesso às aulas é feito pela plataforma da Hotmart, que tem aplicativo gratuito para celular e tablet (Android e iOS). É só baixar o app da Hotmart, entrar com o e-mail usado na compra e todo o curso estará lá — dá inclusive para baixar as aulas e assistir sem internet.",
  },
  {
    question: "É possível assistir pela TV?",
    answer:
      "Sim! Você pode assistir de três formas: abrindo a plataforma pelo navegador da sua smart TV, transmitindo do celular para a TV via Chromecast ou AirPlay pelo app da Hotmart, ou espelhando a tela do celular. Na tela grande fica muito mais fácil acompanhar as aulas.",
  },
];

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso PROVIC - Professor de Violão para Crianças",
  description:
    "Seja um professor de violão mais reconhecido e valorize suas aulas, reduzindo a desmotivação e desistências. Curso PROVIC com o professor Ricardo Novais.",
  url: "https://amigoviolao.com/cursos/professores",
  inLanguage: "pt-BR",
  provider: {
    "@type": "Organization",
    name: "Amigo Violão",
    url: "https://amigoviolao.com",
  },
  // O preço estruturado sai da mesma fonte do preço exibido: divergir entre os
  // dois é inconsistência que o Google lê.
  offers: {
    "@type": "Offer",
    price: preco.aVista.toFixed(2),
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
    url: "https://amigoviolao.com/cursos/professores",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function CursoParaProfessoresPage() {
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
          text="⭐ Mais de 850 professores • 🎸 Formação + 14 cursos inclusos • ⚡ Acesso imediato • 🛡️ 30 dias de garantia"
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

        <Trilhas
          heading="As 3 Trilhas de Aplicação"
          subheading="A Formação te habilita a ensinar nas três vertentes. Cada trilha é o método pronto de uma delas, com o repertório e o material de apoio que a sustenta — não são bônus, são o que você vai levar para a sua sala de aula."
          trilhas={TRILHAS}
          destaque="infantil"
          rotuloDestaque="A metodologia"
          rotuloSecundario="Também incluso"
        />

        <ProvicFeatures />

        <ProvicTeachers />
        <ProfessorsShowcase />
        <TextTestimonials />
        <ImageTestimonials />

        <div className="bg-white pt-2">
          <hr className="mx-auto max-w-4xl border-primary/40" />
        </div>

        <div className="bg-white pt-16">
          <Reveal className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
              O curso te ensina a ensinar.
            </h2>
            <p className="mt-2 text-foreground/70">
              Os bônus te ensinam a viver disso — são {formatarInteiroBRL(
                totalDosBonus("professores"),
              )}{" "}
              em ferramentas de carreira que nenhum curso do catálogo cobre.
            </p>
          </Reveal>
        </div>
        <About paragraphs={bio} whatsappMessage={WHATSAPP_COURSE_MESSAGES.professores} />

        <ValueStack
          heading="Tudo o que você recebe hoje:"
          coreItems={valueStackCoreItems}
          bonuses={valueStackBonuses}
          totalNote={`Somando apenas os bônus, são ${formatarInteiroBRL(
            totalDosBonus("professores"),
          )} em ferramentas que você leva sem pagar nada a mais.`}
        />

        <PricingCTA
          eyebrow="Com dois alunos novos em três meses, a formação já se pagou."
          heading="Invista na formação que pode transformar sua carreira como professor de violão."
          ctaText="COMECE AGORA A FORMAÇÃO"
          checkoutUrl={checkout}
          anchorPrice={preco.ancora}
          installments={preco.parcelas}
          installmentPrice={preco.parcela}
          cashPrice={preco.aVista}
          inclusions={null}
          // "comprar" é o id que o botão do hero e o CTA fixo do mobile
          // procuram. Esta página usava "comprar-final", de quando havia dois
          // blocos de preço — os dois âncoras caíam no vazio.
          sectionId="comprar"
        />

        <Guarantee text="Você tem 30 dias de garantia. Faça o curso, comece a aplicar a metodologia nas suas aulas e, se não gostar da qualidade do conteúdo, é só solicitar o reembolso dentro da plataforma dentro desse prazo que devolvemos o valor investido." />

        <Faq faqs={faqs} />

        <FinalCTA
          heading="Você está a um passo de transformar as suas aulas de violão"
          subtext="Comece hoje com a metodologia PROVIC. Você tem 30 dias de garantia para colocar tudo em prática com os seus alunos."
          ctaText="QUERO SER UM PROFESSOR AMIGO VIOLÃO"
          checkoutUrl={checkout}
          guaranteeNote="Garantia de 30 dias · Compra segura via Hotmart"
        />
      </main>
      <Footer />
      <StickyMobileCTA
        label="Quero ser um professor melhor"
        price={`${preco.parcelas}x de ${formatarBRL(preco.parcela)}`}
      />
    </>
  );
}
