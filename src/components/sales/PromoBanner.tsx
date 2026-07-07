type PromoBannerProps = {
  text?: string;
  color?: "teal" | "primary";
};

export default function PromoBanner({
  text = "🌞 Promoção de Férias — Um mês para iniciar uma vida de amizade com o violão",
  color = "teal",
}: PromoBannerProps) {
  return (
    <div
      className={`px-6 py-3 text-center text-sm font-semibold text-white ${
        color === "teal" ? "bg-teal" : "bg-primary"
      }`}
    >
      {text}
    </div>
  );
}
