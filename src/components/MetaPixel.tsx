"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// "Pixel de Ricardo Novais" no Gerenciador de Eventos (conta de anúncios
// 10200565641681613). O ID é público por natureza — vai no HTML de qualquer
// site que usa pixel —, então fica aqui em vez de num secret do deploy.
const META_PIXEL_ID = "433782650299153";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// /ferramentas/* roda dentro da área de membros do Hotmart (iframe): quem
// passa por lá já é aluno, e contá-lo como visitante do site poluiria o
// público de remarketing com quem já comprou.
function foraDoPixel(pathname: string) {
  return pathname.startsWith("/ferramentas");
}

export default function MetaPixel({ ativo }: { ativo: boolean }) {
  const pathname = usePathname();
  const ignorar = !ativo || foraDoPixel(pathname);
  const primeiraVisita = useRef(true);

  // O código-base do pixel já dispara o PageView da primeira página; as
  // navegações seguintes do App Router não recarregam o documento, então
  // cada troca de rota precisa do seu PageView.
  useEffect(() => {
    if (ignorar) return;
    if (primeiraVisita.current) {
      primeiraVisita.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname, ignorar]);

  if (ignorar) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
