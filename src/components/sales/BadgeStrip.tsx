import Reveal from "../Reveal";

export default function BadgeStrip({ badges }: { badges: string[] }) {
  return (
    <div className="-mt-px bg-dark pb-12 md:pb-16">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-3">
        {badges.map((badge, i) => (
          <Reveal key={badge} delay={i * 60}>
            <span className="block rounded-full bg-teal px-6 py-3 text-center text-sm font-semibold text-white">
              {badge}
            </span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
