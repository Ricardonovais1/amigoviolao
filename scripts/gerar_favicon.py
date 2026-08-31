"""
Gera os icones do site a partir da marca do violao (public/images/logo-amigo-violao.webp).

Produz, em src/app/ (convencao de arquivo do App Router -- o Next injeta as tags
<link> sozinho, nao precisa mexer no layout.tsx):

  favicon.ico    16, 32 e 48 px, cada tamanho renderizado separadamente
  apple-icon.png 180 px, fundo branco

Nao geramos um icon.png grande de proposito: declarado junto com o .ico, parte
dos navegadores (Firefox inclusive) prefere o PNG maior e reduz ele mesmo pra
16 px -- jogando fora o tratamento de traco abaixo e devolvendo o icone
lavado. Com so o .ico, cada tamanho e servido como foi desenhado.

Duas decisoes que nao sao obvias:

1. **A margem vazia sai fora.** O PNG de origem tem o violao ocupando so 66% da
   largura; recortado no conteudo e recentrado, o desenho fica visivelmente
   maior na aba com o mesmo numero de pixels.

2. **Em 16 px o traco e engrossado antes de reduzir.** A marca e desenho de
   contorno fino: reduzida direto, a linha vira pixel semitransparente e o
   icone aparece lavado, quase branco. Dilatar em resolucao intermediaria
   (MaxFilter) e depois reduzir preserva a silhueta -- da pra reconhecer o
   violao e o coracao. Em 48 px isso nao e necessario e so engrossaria o
   desenho a toa, entao o reforco e proporcional ao tamanho.

O apple-icon vai com fundo branco de proposito: o iOS nao respeita
transparencia em icone de tela inicial, renderiza o vazio como preto.

Uso: python scripts/gerar_favicon.py
Requer Pillow.
"""

import struct
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageFilter

REPO = Path(__file__).resolve().parent.parent
ORIGEM = REPO / "public/images/logo-amigo-violao.webp"
DESTINO = REPO / "src/app"

MARGEM = 0.06        # respiro em volta da marca, proporcao do lado
ICO_TAMANHOS = [16, 32, 48]
APPLE_TAMANHO = 180
APPLE_OCUPACAO = 0.76


def marca_quadrada() -> Image.Image:
    """Recorta a marca no conteudo e centraliza num quadrado transparente."""
    src = Image.open(ORIGEM).convert("RGBA")
    recorte = src.crop(src.getchannel("A").getbbox())
    lado = max(recorte.size)
    margem = round(lado * MARGEM)
    canvas = Image.new("RGBA", (lado + 2 * margem,) * 2, (0, 0, 0, 0))
    canvas.paste(
        recorte,
        (margem + (lado - recorte.width) // 2, margem + (lado - recorte.height) // 2),
        recorte,
    )
    return canvas.resize((512, 512), Image.LANCZOS)


def renderizar(marca: Image.Image, tamanho: int) -> Image.Image:
    """Reduz preservando a legibilidade do traco fino nos tamanhos pequenos."""
    if tamanho >= 48:
        return marca.resize((tamanho, tamanho), Image.LANCZOS)

    intermediario = marca.resize((tamanho * 4,) * 2, Image.LANCZOS)
    intermediario = intermediario.filter(ImageFilter.MaxFilter(3))
    reduzido = intermediario.resize((tamanho,) * 2, Image.LANCZOS)
    # Gama no alpha: recupera o contorno que o downscale deixou semitransparente.
    alpha = reduzido.getchannel("A").point(lambda v: min(255, int(255 * (v / 255) ** 0.6)))
    reduzido.putalpha(alpha)
    return reduzido


def escrever_ico(imagens: list, destino: Path) -> None:
    """Monta o .ico com um PNG por tamanho.

    Escrito na mao porque o save() do Pillow reamostra tudo a partir de UMA
    imagem -- aqui cada tamanho tem o seu proprio tratamento de traco.
    """
    blocos = []
    for im in imagens:
        buf = BytesIO()
        im.save(buf, "PNG")
        blocos.append(buf.getvalue())

    cabecalho = struct.pack("<HHH", 0, 1, len(blocos))
    offset = len(cabecalho) + 16 * len(blocos)
    diretorio, dados = b"", b""
    for im, bloco in zip(imagens, blocos):
        lado = 0 if im.width >= 256 else im.width
        diretorio += struct.pack("<BBBBHHII", lado, lado, 0, 0, 1, 32, len(bloco), offset)
        offset += len(bloco)
        dados += bloco
    destino.write_bytes(cabecalho + diretorio + dados)


def main() -> None:
    marca = marca_quadrada()

    escrever_ico([renderizar(marca, t) for t in ICO_TAMANHOS], DESTINO / "favicon.ico")
    print(f"favicon.ico     {', '.join(f'{t}px' for t in ICO_TAMANHOS)}")

    apple = Image.new("RGB", (APPLE_TAMANHO,) * 2, (255, 255, 255))
    lado = round(APPLE_TAMANHO * APPLE_OCUPACAO)
    reduzida = marca.resize((lado,) * 2, Image.LANCZOS)
    apple.paste(reduzida, ((APPLE_TAMANHO - lado) // 2,) * 2, reduzida)
    apple.save(DESTINO / "apple-icon.png")
    print(f"apple-icon.png  {APPLE_TAMANHO}px, fundo branco")


if __name__ == "__main__":
    main()
