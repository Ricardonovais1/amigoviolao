import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade - Amigo Violão",
  description:
    "Como o Amigo Violão coleta, usa, armazena e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="8 de julho de 2026">
      <p>
        A sua privacidade é importante para nós. Esta Política de Privacidade
        explica como o <strong>Amigo Violão</strong> coleta, utiliza, armazena,
        compartilha e protege os seus dados pessoais quando você acessa o site{" "}
        <a href="https://amigoviolao.com">amigoviolao.com</a> ou adquire um de
        nossos cursos. Ao utilizar o site, você concorda com as práticas
        descritas neste documento, em conformidade com a Lei nº 13.709/2018
        (Lei Geral de Proteção de Dados Pessoais — LGPD).
      </p>

      <h2>1. Quem é o responsável pelos seus dados</h2>
      <p>
        O responsável (controlador) pelo tratamento dos seus dados pessoais é
        Ricardo Miranda de Novais (Amigo Violão), inscrito no CNPJ sob o nº
        51.747.455/0001-06, com endereço na Rua São João Evangelista, 295,
        Bairro São Pedro, Belo Horizonte/MG, CEP 30330-152. Em caso de dúvidas
        sobre esta política ou sobre o tratamento dos seus dados, entre em
        contato pelo e-mail{" "}
        <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a>.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <p>Coletamos dados de duas formas:</p>
      <h3>Dados que você nos fornece</h3>
      <ul>
        <li>
          Nome, e-mail e telefone/WhatsApp, quando você preenche formulários,
          solicita um material gratuito (como o Guia do Violão para Crianças),
          se inscreve na nossa lista ou entra em contato conosco;
        </li>
        <li>
          Dados de cadastro e de compra necessários para liberar o acesso aos
          cursos.
        </li>
      </ul>
      <h3>Dados coletados automaticamente</h3>
      <ul>
        <li>
          Endereço IP, tipo de navegador e dispositivo, páginas visitadas,
          tempo de navegação e outras informações de uso, coletadas por meio de
          cookies e tecnologias semelhantes.
        </li>
      </ul>
      <p>
        <strong>Dados de pagamento:</strong> as compras dos cursos são
        processadas pela plataforma <strong>Hotmart</strong>. Os dados
        financeiros (como número de cartão) são informados diretamente à Hotmart
        e tratados de acordo com a política de privacidade dela —{" "}
        <em>não temos acesso nem armazenamos os dados completos do seu cartão</em>.
      </p>

      <h2>3. Para que usamos os seus dados</h2>
      <ul>
        <li>Liberar e dar suporte ao seu acesso aos cursos adquiridos;</li>
        <li>
          Enviar comunicações, novidades, conteúdos gratuitos e ofertas por
          e-mail (marketing), sempre com opção de descadastro;
        </li>
        <li>Responder a solicitações, dúvidas e pedidos de suporte;</li>
        <li>
          Analisar o uso do site para melhorar a experiência, o conteúdo e a
          navegação;
        </li>
        <li>
          Exibir e mensurar anúncios em plataformas como Google e Meta
          (Facebook e Instagram);
        </li>
        <li>Cumprir obrigações legais, regulatórias e fiscais.</li>
      </ul>

      <h2>4. Cookies e tecnologias de rastreamento</h2>
      <p>
        Utilizamos cookies e ferramentas de terceiros para entender como o site
        é usado e para tornar a comunicação mais relevante. Entre elas:
      </p>
      <ul>
        <li>
          <strong>Google Analytics</strong> — para medir acessos e entender o
          comportamento de navegação de forma agregada;
        </li>
        <li>
          <strong>Meta Pixel (Facebook/Instagram)</strong> — para mensurar
          resultados e exibir anúncios a públicos relevantes (remarketing).
        </li>
      </ul>
      <p>
        Você pode gerenciar ou bloquear cookies nas configurações do seu
        navegador. Ao desabilitá-los, algumas funcionalidades do site podem
        deixar de funcionar corretamente.
      </p>

      <h2>5. E-mail marketing</h2>
      <p>
        Ao informar o seu e-mail, você poderá receber conteúdos, novidades e
        ofertas do Amigo Violão. Você pode cancelar o recebimento a qualquer
        momento clicando no link de descadastro presente em todos os e-mails ou
        solicitando pelo e-mail{" "}
        <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a>.
      </p>

      <h2>6. Com quem compartilhamos os seus dados</h2>
      <p>
        Não vendemos os seus dados pessoais. Compartilhamos informações apenas
        quando necessário para operar o serviço, com parceiros que atuam como
        operadores de dados, tais como:
      </p>
      <ul>
        <li>
          <strong>Hotmart</strong> — processamento de pagamentos e entrega do
          acesso aos cursos;
        </li>
        <li>
          <strong>Google</strong> e <strong>Meta</strong> — métricas de acesso
          e veiculação de anúncios;
        </li>
        <li>
          Ferramentas de e-mail marketing e de suporte utilizadas para
          comunicação com você.
        </li>
      </ul>
      <p>
        Também poderemos compartilhar dados quando exigido por lei, ordem
        judicial ou autoridade competente.
      </p>

      <h2>7. Segurança e armazenamento</h2>
      <p>
        Adotamos medidas técnicas e organizacionais razoáveis para proteger os
        seus dados contra acesso não autorizado, perda ou uso indevido. Nenhum
        sistema, porém, é 100% seguro, e não podemos garantir segurança
        absoluta.
      </p>

      <h2>8. Por quanto tempo guardamos os seus dados</h2>
      <p>
        Mantemos os seus dados pelo tempo necessário para cumprir as finalidades
        descritas nesta política e para atender a obrigações legais e fiscais.
        Quando não houver mais necessidade ou base legal, os dados serão
        eliminados ou anonimizados.
      </p>

      <h2>9. Os seus direitos como titular</h2>
      <p>Nos termos da LGPD, você pode, a qualquer momento:</p>
      <ul>
        <li>Confirmar a existência de tratamento dos seus dados;</li>
        <li>Acessar os seus dados;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>
          Solicitar a anonimização, o bloqueio ou a eliminação de dados
          desnecessários ou tratados em desconformidade com a lei;
        </li>
        <li>Solicitar a portabilidade dos seus dados;</li>
        <li>Revogar o consentimento e solicitar a exclusão dos seus dados;</li>
        <li>Ser informado sobre com quem compartilhamos os seus dados.</li>
      </ul>
      <p>
        Para exercer qualquer um desses direitos, envie um e-mail para{" "}
        <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a>.
      </p>

      <h2>10. Crianças e adolescentes</h2>
      <p>
        Embora nossos cursos ajudem crianças a aprender violão, as compras e o
        cadastro devem ser feitos por um adulto responsável. Não coletamos
        intencionalmente dados de menores de idade sem o consentimento e a
        supervisão dos pais ou responsáveis legais.
      </p>

      <h2>11. Alterações nesta política</h2>
      <p>
        Podemos atualizar esta Política de Privacidade periodicamente. A versão
        vigente estará sempre disponível nesta página, com a data da última
        atualização indicada no topo. Recomendamos que você a revise
        regularmente.
      </p>

      <h2>12. Contato</h2>
      <p>
        Em caso de dúvidas, solicitações ou reclamações sobre privacidade e
        proteção de dados, fale conosco:
      </p>
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
