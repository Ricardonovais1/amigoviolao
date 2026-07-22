import Image from "next/image";

// Circular avatar for a teacher profile. Falls back to a branded placeholder
// silhouette when a professor has no photo yet.

export default function ProfessorPhoto({
  src,
  alt,
  size = 140,
}: {
  src?: string;
  alt: string;
  size?: number;
}) {
  if (src) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full shadow-md ring-4 ring-white"
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal/25 to-primary/15 shadow-md ring-4 ring-white"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-1/2 w-1/2 text-primary/40"
      >
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
      </svg>
    </div>
  );
}
