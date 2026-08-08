type AssinaturaRicardoProps = {
  /**
   * "criancas" fecha a frase em "ensino do violão para crianças"; "geral"
   * fecha em "ensino do violão". É a única diferença entre as quatro páginas.
   */
  foco?: "criancas" | "geral";
};

const negrito = "font-bold text-white";

/**
 * Linha de autoridade sob a headline. Vive num componente só porque aparece
 * nos quatro heroes: quatro cópias do mesmo parágrafo divergiriam na primeira
 * revisão de copy.
 */
export default function AssinaturaRicardo({
  foco = "geral",
}: AssinaturaRicardoProps) {
  return (
    <p className="mt-3 text-sm leading-snug text-white/70">
      Criado por <strong className={negrito}>Ricardo Novais</strong>, professor
      de violão há mais de 20 anos e{" "}
      <strong className={negrito}>pesquisador</strong> dedicado ao{" "}
      {foco === "criancas" ? (
        <>
          ensino do{" "}
          <strong className={negrito}>violão para crianças</strong>
        </>
      ) : (
        <strong className={negrito}>ensino do violão</strong>
      )}
      .
    </p>
  );
}
