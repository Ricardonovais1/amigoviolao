import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Serviço - Amigo Violão",
  description:
    "Condições de uso do site e dos cursos online do Amigo Violão: cadastro, acesso, pagamento, propriedade intelectual e responsabilidades.",
};

export default function TermosDeServicosPage() {
  return (
    <LegalLayout title="Termos de Serviço" updatedAt="8 de julho de 2026">
      <p>
        Estes Termos de Serviço regulam o uso do site{" "}
        <a href="https://amigoviolao.com">amigoviolao.com</a> e a contratação
        dos cursos online oferecidos pelo <strong>Amigo Violão</strong>. Ao
        acessar o site ou adquirir um curso, você declara que leu, entendeu e
        concorda com estas condições. Se não concordar, por favor não utilize o
        site nem os nossos serviços.
      </p>

      <h2>1. Quem somos</h2>
      <p>
        O Amigo Violão é uma plataforma de cursos online de violão de
        responsabilidade de Ricardo Miranda de Novais, inscrito no CNPJ sob o nº
        51.747.455/0001-06, com endereço na Rua São João Evangelista, 295,
        Bairro São Pedro, Belo Horizonte/MG, CEP 30330-152. Contato:{" "}
        <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a> —
        WhatsApp (31) 9 9142-0455.
      </p>

      <h2>2. Serviços oferecidos</h2>
      <p>
        Oferecemos cursos de violão em formato de videoaulas e materiais
        complementares, acessados por uma área de membros mediante login e
        senha. Os cursos têm caráter educacional e não garantem resultados
        específicos, que dependem também da dedicação e da prática de cada
        aluno.
      </p>

      <h2>3. Cadastro e conta de acesso</h2>
      <ul>
        <li>
          Para acessar os cursos, você recebe um login e senha pessoais e
          intransferíveis, enviados após a confirmação da compra;
        </li>
        <li>
          Você é responsável por manter a confidencialidade dos seus dados de
          acesso e por todas as atividades realizadas na sua conta;
        </li>
        <li>
          O compartilhamento de login, senha ou conteúdo com terceiros é
          proibido e pode resultar no cancelamento do acesso, sem reembolso.
        </li>
      </ul>

      <h2>4. Compra, pagamento e acesso</h2>
      <ul>
        <li>
          As compras são processadas pela plataforma{" "}
          <strong>Hotmart</strong>, que oferece diferentes formas de pagamento;
        </li>
        <li>
          Após a confirmação do pagamento, o acesso ao curso é liberado
          conforme as condições informadas na página de venda;
        </li>
        <li>
          Salvo indicação diferente na oferta, o acesso à plataforma é
          concedido pelo período de 2 (dois) anos a partir da compra.
        </li>
      </ul>

      <h2>5. Garantia e cancelamento</h2>
      <p>
        Oferecemos uma garantia incondicional de 30 (trinta) dias. Dentro desse
        prazo, você pode solicitar o cancelamento e o reembolso integral. As
        regras completas estão descritas na nossa{" "}
        <a href="/politicas-de-cancelamento">Política de Cancelamento</a>.
      </p>

      <h2>6. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo disponibilizado — videoaulas, materiais em PDF,
        partituras, textos, marca, logotipo e identidade visual — é de
        propriedade do Amigo Violão ou de seus licenciadores e está protegido
        pela legislação de direitos autorais. É concedida a você uma licença
        pessoal, limitada e intransferível de uso do conteúdo, exclusivamente
        para fins de aprendizado próprio.
      </p>
      <p>É expressamente proibido:</p>
      <ul>
        <li>
          Copiar, reproduzir, distribuir, vender, publicar ou compartilhar o
          conteúdo, no todo ou em parte;
        </li>
        <li>Gravar, baixar ou retransmitir as aulas por qualquer meio;</li>
        <li>
          Disponibilizar o acesso a terceiros ou utilizar o conteúdo para
          ministrar cursos próprios sem autorização por escrito.
        </li>
      </ul>

      <h2>7. Conduta do usuário</h2>
      <p>
        Ao utilizar o site e os cursos, você concorda em não praticar atos
        ilícitos, não violar direitos de terceiros, não tentar burlar
        mecanismos de segurança e não utilizar os serviços para finalidades
        diversas das previstas nestes Termos.
      </p>

      <h2>8. Suporte</h2>
      <p>
        O suporte aos alunos é prestado pelos canais oficiais do Amigo Violão,
        principalmente pelo e-mail{" "}
        <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a>.
      </p>

      <h2>9. Limitação de responsabilidade</h2>
      <p>
        O Amigo Violão empenha-se para manter o site e a plataforma disponíveis
        e funcionando corretamente, mas não garante disponibilidade
        ininterrupta, podendo haver instabilidades, manutenções ou
        interrupções. Não nos responsabilizamos por danos decorrentes do uso
        indevido do conteúdo, de falhas de conexão do usuário ou de fatores
        fora do nosso controle razoável.
      </p>

      <h2>10. Privacidade</h2>
      <p>
        O tratamento dos seus dados pessoais é regido pela nossa{" "}
        <a href="/politica-de-privacidade">Política de Privacidade</a>, que é
        parte integrante destes Termos.
      </p>

      <h2>11. Alterações dos Termos</h2>
      <p>
        Podemos alterar estes Termos de Serviço a qualquer momento. A versão
        vigente estará sempre publicada nesta página, com a data da última
        atualização. O uso continuado do site após alterações representa a sua
        concordância com os novos termos.
      </p>

      <h2>12. Legislação aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil.
        Fica eleito o foro do domicílio do consumidor para dirimir eventuais
        controvérsias, conforme o Código de Defesa do Consumidor.
      </p>

      <h2>13. Contato</h2>
      <ul>
        <li>
          E-mail:{" "}
          <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a>
        </li>
        <li>WhatsApp: (31) 9 9142-0455</li>
      </ul>
    </LegalLayout>
  );
}
