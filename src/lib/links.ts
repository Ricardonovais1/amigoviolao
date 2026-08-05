export const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/K46456415L";
export const HOTMART_PROVIC_CHECKOUT_URL = "https://pay.hotmart.com/T4530896P";

/**
 * Area do aluno ("Já sou aluno"). Portal unificado da propria Hotmart: o aluno
 * loga com o e-mail da compra e ve TODOS os produtos que ja comprou (Crianças,
 * Iniciantes, Clássico, Completo/PROVIC, ...) em "Minhas Compras", cada um com
 * link pro seu club.
 *
 * Deliberadamente nao aponta pro club de um produto especifico (ex.: o antigo
 * .../club/nave-amigo-violao/auth/login): como cada pacote e vendido como um
 * produto Hotmart separado, um link fixo por produto so funcionaria pra quem
 * comprou aquele produto e desviaria os demais. consumer.hotmart.com nao
 * depende de qual produto o aluno tem -- nao precisa de manutencao quando um
 * pacote novo entra no catálogo.
 */
export const HOTMART_CLUB_LOGIN_URL = "https://consumer.hotmart.com";

export const WHATSAPP_NUMBER = "5531991420455";

/** Primeira parte, igual em todas as páginas — o "Olá!" só existe aqui. */
const WHATSAPP_GREETING = "Olá! Estou no site do Amigo Violão.";

export const WHATSAPP_DEFAULT_MESSAGE = `${WHATSAPP_GREETING} Gostaria de obter algumas informações.`;

/** Mensagem por curso — a chave é o slug em /cursos/<slug>. */
export const WHATSAPP_COURSE_MESSAGES = {
  criancas: `${WHATSAPP_GREETING} Estou buscando informações sobre o curso de violão para crianças.`,
  iniciantes: `${WHATSAPP_GREETING} Estou buscando informações sobre o curso de violão para iniciantes.`,
  classico: `${WHATSAPP_GREETING} Estou buscando informações sobre o curso de violão clássico.`,
  professores: `${WHATSAPP_GREETING} Estou buscando informações sobre o curso para professores (PROVIC).`,
} as const;

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
