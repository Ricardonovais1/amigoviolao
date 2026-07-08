import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Cancelamento - Amigo Violão",
  description:
    "Garantia incondicional de 30 dias nos cursos do Amigo Violão: como solicitar o cancelamento e o reembolso da sua compra.",
};

export default function PoliticasDeCancelamentoPage() {
  return (
    <LegalLayout
      title="Política de Cancelamento"
      updatedAt="8 de julho de 2026"
    >
      <p>
        Queremos que você aprenda violão com tranquilidade e confiança. Por
        isso, os cursos do <strong>Amigo Violão</strong> contam com uma{" "}
        <strong>garantia incondicional de 30 (trinta) dias</strong>. Esta
        política explica como funciona o cancelamento e o reembolso da sua
        compra.
      </p>

      <h2>Garantia de 30 dias</h2>
      <p>
        Se, por qualquer motivo, você não ficar satisfeito com o curso, pode
        solicitar o cancelamento e receber <strong>100% do valor pago</strong>{" "}
        de volta, desde que o pedido seja feito dentro de 30 dias a contar da
        data da compra. Não é preciso justificar — a garantia é incondicional.
      </p>
      <p>
        Essa garantia já contempla e supera o direito de arrependimento previsto
        no artigo 49 do Código de Defesa do Consumidor (7 dias para compras
        feitas fora do estabelecimento comercial).
      </p>

      <h2>Como solicitar o cancelamento</h2>
      <ol>
        <li>
          Envie um e-mail para{" "}
          <a href="mailto:falarcom@amigoviolao.com">falarcom@amigoviolao.com</a>{" "}
          a partir do mesmo e-mail utilizado na compra;
        </li>
        <li>
          Informe que deseja cancelar a sua compra e, se quiser, o motivo (é
          opcional);
        </li>
        <li>
          Você receberá a confirmação e as orientações do reembolso em até 72
          horas.
        </li>
      </ol>

      <h2>Como funciona o reembolso</h2>
      <p>
        As compras dos cursos são processadas pela plataforma{" "}
        <strong>Hotmart</strong>. O reembolso é realizado pela própria Hotmart,
        de acordo com a forma de pagamento utilizada:
      </p>
      <ul>
        <li>
          <strong>Cartão de crédito:</strong> o valor é estornado na fatura do
          cartão. Dependendo da operadora, o estorno pode aparecer na fatura
          seguinte;
        </li>
        <li>
          <strong>Boleto ou Pix:</strong> o valor é devolvido na conta bancária
          informada durante o processo de cancelamento.
        </li>
      </ul>
      <p>
        O prazo de processamento segue as regras da Hotmart e das instituições
        financeiras envolvidas, podendo variar conforme o meio de pagamento.
      </p>

      <h2>Após o período de garantia</h2>
      <p>
        Passados os 30 dias da compra, não é possível solicitar reembolso, pois
        o prazo de garantia terá se encerrado. O seu acesso ao curso permanece
        ativo pelo período contratado.
      </p>

      <h2>Dúvidas</h2>
      <p>
        Se tiver qualquer dúvida sobre cancelamento ou reembolso, fale conosco:
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
