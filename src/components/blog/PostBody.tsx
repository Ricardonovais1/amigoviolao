import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders the Markdown body as a styled article. Runs in a Server Component,
// so the HTML is produced at build time with zero client JS. react-markdown
// does NOT render embedded raw HTML by default -> no XSS from post content.

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="text-[1.05rem] leading-relaxed text-charcoal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, ...p }) => (
            <h2 className="mt-10 mb-4 text-2xl font-bold text-dark" {...p} />
          ),
          h3: ({ node, ...p }) => (
            <h3 className="mt-8 mb-3 text-xl font-semibold text-dark" {...p} />
          ),
          p: ({ node, children, ...p }) => {
            // A paragraph that is just a YouTube/Vimeo link -> inline player.
            const only =
              node?.children.length === 1 ? node.children[0] : undefined;
            if (only && only.type === "element" && only.tagName === "a") {
              const href = String(only.properties?.href ?? "");
              const yt = href.match(
                /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
              );
              const vm = href.match(/vimeo\.com\/(\d+)/);
              if (yt || vm) {
                const src = yt
                  ? `https://www.youtube-nocookie.com/embed/${yt[1]}`
                  : `https://player.vimeo.com/video/${vm![1]}`;
                return (
                  <span className="my-8 block aspect-video w-full overflow-hidden rounded-xl bg-dark">
                    <iframe
                      src={src}
                      title="Vídeo"
                      loading="lazy"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="h-full w-full border-0"
                    />
                  </span>
                );
              }
            }
            return (
              <p className="mb-5" {...p}>
                {children}
              </p>
            );
          },
          a: ({ node, href, ...p }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                className="text-primary underline underline-offset-2 transition-colors hoverable:text-primary-dark"
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                {...p}
              />
            );
          },
          ul: ({ node, ...p }) => (
            <ul className="mb-5 list-disc space-y-2 pl-6" {...p} />
          ),
          ol: ({ node, ...p }) => (
            <ol className="mb-5 list-decimal space-y-2 pl-6" {...p} />
          ),
          blockquote: ({ node, ...p }) => (
            <blockquote
              className="my-6 border-l-4 border-teal pl-4 italic text-charcoal/80"
              {...p}
            />
          ),
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ node, ...p }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="my-6 h-auto w-full rounded-xl" loading="lazy" {...p} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
