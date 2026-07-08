import Image from "next/image";

// Renders a post's cover image, or a branded placeholder when the post has no
// image (e.g. a text/video post, or one whose source video was deleted).
// Always meant to fill a parent with a set aspect ratio (position: relative).

export default function PostCover({
  src,
  alt = "",
  sizes,
  priority = false,
}: {
  src?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal/25 to-primary/15">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-1/3 w-1/3 text-primary/40"
      >
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>
    </div>
  );
}
