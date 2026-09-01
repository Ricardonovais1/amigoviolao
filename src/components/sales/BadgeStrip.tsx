import Reveal from "../Reveal";

// Faixa própria, não um rodapé do herói. Antes ela era bg-dark colada no
// herói (-mt-px, sem padding em cima), então lia como se fosse a última
// linha dele. Agora tem o mesmo respiro em cima e embaixo, cor própria
// (charcoal, um passo mais claro que o dark do herói, mantendo o contraste
// das pílulas laranja) e o filete de costura que o resto do site usa nas
// fronteiras entre blocos de cor.

export default function BadgeStrip({ badges }: { badges: string[] }) {
  return (
    <div className="seam-top relative bg-charcoal py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-3">
        {badges.map((badge, i) => (
          <Reveal key={badge} delay={i * 60}>
            <span className="relative block overflow-hidden rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white">
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-teal [animation:badge-wipe-in_2s_linear_forwards] [clip-path:inset(0_100%_0_0)]"
              />
              <span className="relative z-10">{badge}</span>
            </span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
