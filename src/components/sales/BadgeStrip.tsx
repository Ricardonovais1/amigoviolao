import Reveal from "../Reveal";

export default function BadgeStrip({ badges }: { badges: string[] }) {
  return (
    <div className="-mt-px bg-dark pb-12 md:pb-16">
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
