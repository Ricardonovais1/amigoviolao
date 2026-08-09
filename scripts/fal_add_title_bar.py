#!/usr/bin/env python3
"""
Aplica a tarja de titulo (faixa colorida translucida + logo branca + titulo
grande) numa capa de blog ja gerada. Passo separado da geracao em si -- pedir
pro modelo de imagem desenhar texto e a logo real nao e confiavel (ver
SKILL.md), entao isso e composicao deterministica com Pillow.

A cor da tarja e escolhida automaticamente entre 6 cores oficiais da marca
(laranja, laranja escuro, teal, teal escuro, escuro, grafite) com base na cor
media da regiao da imagem que a tarja vai cobrir -- contraste complementar:
fundo frio puxa as quentes, fundo quente puxa as frias, fundo neutro/escuro
puxa as neutras. Nunca repete nenhuma cor usada nas ultimas 4 geracoes
(rastreado em .fal_bar_color_history.json) -- com so 3 cores (versao
anterior), capas seguidas de cena de tom parecido saiam sempre na mesma;
com 6 da pra garantir variedade real. Da pra forcar uma cor especifica com
--bar-color.

Uso:
  python scripts/fal_add_title_bar.py \
    --image public/images/blog/<slug>.jpg \
    --title "Como trocar acordes mais rapido"

Roda ANTES do optimize_images.py (a tarja vira parte do raster; o optimize
so converte pra webp e redimensiona depois).
"""

from __future__ import annotations

import argparse
import colorsys
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent
FONT_PATH = Path(__file__).resolve().parent / "fonts" / "Poppins-SemiBold.ttf"
DEFAULT_LOGO = REPO_ROOT / "public" / "images" / "logo-amigo-violao-branco.webp"
COLOR_HISTORY_FILE = Path(__file__).resolve().parent / ".fal_bar_color_history.json"

BAR_HEIGHT_PCT = 0.49
BAR_OPACITY = 0.72
TITLE_FONT_SIZE = 72
TITLE_LINE_SPACING = 1.08
TITLE_COLOR = (255, 255, 255)
SIDE_PADDING_PCT = 0.06  # margem esquerda/direita do titulo, em % da largura
LOGO_HEIGHT_PCT = 0.08  # altura da logo, em % da altura da imagem
LOGO_TOP_PAD_PCT = 0.10  # espaco entre o topo da tarja e a logo, em % da altura da tarja
TITLE_TOP_GAP_PCT = 0.06  # espaco entre a logo e a primeira linha do titulo, em % da altura da tarja

# RGB das 6 cores oficiais da marca que rendem texto branco legivel (ver
# src/app/globals.css --brand-*; cream fica de fora -- e clara demais pro
# texto branco). Ter 6 em vez de so 3 e o que permite variedade de verdade
# ao longo de varias capas seguidas, mesmo evitando as ultimas usadas.
BRAND_COLORS = {
    "orange": (239, 84, 0),  # --brand-primary
    "orange-dark": (201, 70, 0),  # --brand-primary-dark
    "teal": (72, 194, 195),  # --brand-teal
    "teal-dark": (31, 122, 122),  # --brand-teal-text
    "dark": (33, 33, 33),  # --brand-dark
    "charcoal": (62, 69, 72),  # --brand-charcoal
}

# Nao repete nenhuma cor usada nas ultimas N geracoes (ver choose_bar_color).
COLOR_HISTORY_SIZE = 4


def rank_bar_colors(image: Image.Image, bar_top: int) -> list[str]:
    """Ordena as 6 cores da marca da mais pra menos harmoniosa com a regiao
    que a tarja vai cobrir. A 1a e a escolha ideal isolada; a lista inteira
    existe pra dar pra pular as ja usadas recentemente (ver choose_bar_color)
    sem cair numa cor arbitraria."""
    region = image.convert("RGB").crop((0, bar_top, image.width, image.height))
    small = region.resize((24, 24))
    pixels = [small.getpixel((x, y)) for x in range(24) for y in range(24)]
    n = len(pixels)
    avg = tuple(sum(p[i] for p in pixels) / n for i in range(3))
    h, s, v = colorsys.rgb_to_hsv(avg[0] / 255, avg[1] / 255, avg[2] / 255)
    hue_deg = h * 360

    if s < 0.15 or v < 0.18:
        # fundo neutro/escuro -> tarjas escuras primeiro; as vivas ficariam
        # berrantes num fundo sem cor propria.
        return ["dark", "charcoal", "teal-dark", "orange-dark", "teal", "orange"]
    if hue_deg < 70 or hue_deg > 330:
        # fundo quente (vermelho/laranja/amarelo) -> contraste com tarja fria;
        # as quentes ficam por ultimo, pois se misturam ao fundo.
        return ["teal", "teal-dark", "charcoal", "dark", "orange-dark", "orange"]
    # fundo frio (verde/azul/roxo) -> contraste com tarja quente, espelhado.
    return ["orange", "orange-dark", "charcoal", "dark", "teal-dark", "teal"]


def load_color_history() -> list[str]:
    if not COLOR_HISTORY_FILE.exists():
        return []
    return json.loads(COLOR_HISTORY_FILE.read_text(encoding="utf-8")).get("recent", [])


def save_color_history(recent: list[str]) -> None:
    COLOR_HISTORY_FILE.write_text(json.dumps({"recent": recent}), encoding="utf-8")


def record_bar_color(color_name: str) -> None:
    recent = load_color_history()
    recent.append(color_name)
    save_color_history(recent[-COLOR_HISTORY_SIZE:])


def choose_bar_color(image: Image.Image, bar_top: int) -> tuple[str, tuple[int, int, int]]:
    ranked = rank_bar_colors(image, bar_top)
    recent = load_color_history()
    # Nunca repete nenhuma das ultimas COLOR_HISTORY_SIZE cores usadas -- com
    # capas seguidas de cena de tom parecido (comum em cenas domesticas
    # aconchegantes), a 1a opcao seria sempre a mesma; pula pra proxima da
    # lista (ainda harmoniosa, so nao a ideal) ate achar uma nao usada
    # recentemente.
    chosen = next((c for c in ranked if c not in recent), ranked[0])
    record_bar_color(chosen)
    return chosen, BRAND_COLORS[chosen]


def wrap_title(draw: ImageDraw.ImageDraw, title: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = title.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def add_title_bar(
    image_path: Path,
    title: str,
    logo_path: Path,
    out_path: Path,
    bar_color_choice: str,
) -> None:
    base = Image.open(image_path).convert("RGBA")
    w, h = base.size

    bar_h = round(h * BAR_HEIGHT_PCT)
    bar_top = h - bar_h

    if bar_color_choice == "auto":
        color_name, color_rgb = choose_bar_color(base, bar_top)
    else:
        color_name, color_rgb = bar_color_choice, BRAND_COLORS[bar_color_choice]
        record_bar_color(color_name)

    bar = Image.new("RGBA", (w, bar_h), (*color_rgb, round(255 * BAR_OPACITY)))
    composed = base.copy()
    composed.alpha_composite(bar, (0, bar_top))

    draw = ImageDraw.Draw(composed)
    side_padding = round(w * SIDE_PADDING_PCT)
    max_text_width = w - 2 * side_padding

    # Logo, centralizada horizontalmente, perto do topo da tarja.
    logo = Image.open(logo_path).convert("RGBA")
    logo_h = round(h * LOGO_HEIGHT_PCT)
    logo_w = round(logo.width * (logo_h / logo.height))
    logo = logo.resize((logo_w, logo_h), Image.LANCZOS)
    logo_x = (w - logo_w) // 2
    logo_y = bar_top + round(bar_h * LOGO_TOP_PAD_PCT)
    composed.alpha_composite(logo, (logo_x, logo_y))

    # Titulo, ate 2 linhas, centralizado, abaixo da logo. Reduz a fonte se
    # nao couber (titulos longos) em vez de estourar a tarja.
    font_size = TITLE_FONT_SIZE
    while font_size > 32:
        font = ImageFont.truetype(str(FONT_PATH), font_size)
        lines = wrap_title(draw, title, font, max_text_width)
        if len(lines) <= 2 and all(draw.textlength(line, font=font) <= max_text_width for line in lines):
            break
        font_size -= 4

    line_height = font_size * TITLE_LINE_SPACING
    text_top = logo_y + logo_h + round(bar_h * TITLE_TOP_GAP_PCT)
    text_block_h = line_height * len(lines)
    # Reserva uma margem embaixo simetrica ao respiro que a logo tem em cima,
    # senao o texto (com descendentes tipo "rapido") fica colado na borda.
    bottom_margin = round(bar_h * LOGO_TOP_PAD_PCT)
    available_h = h - bottom_margin - text_top
    text_top += max(0, (available_h - text_block_h) / 2)

    for i, line in enumerate(lines):
        line_w = draw.textlength(line, font=font)
        x = (w - line_w) / 2
        y = text_top + i * line_height
        draw.text((x, y), line, font=font, fill=TITLE_COLOR)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    if out_path.suffix.lower() in (".jpg", ".jpeg"):
        composed.convert("RGB").save(out_path, quality=92)
    else:
        composed.save(out_path)
    print(f"Tarja '{color_name}' aplicada. Salvo em {out_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--image", required=True, type=Path, help="Capa ja gerada (jpg/png/webp)")
    parser.add_argument("--title", required=True, help="Texto da tarja (normalmente o titulo do post, curto)")
    parser.add_argument("--logo", default=DEFAULT_LOGO, type=Path, help=f"Logo branca (default: {DEFAULT_LOGO})")
    parser.add_argument(
        "--bar-color",
        default="auto",
        choices=["auto", *BRAND_COLORS],
        help="Cor da tarja (default: auto -- escolhe por contraste com a imagem)",
    )
    parser.add_argument("--out", type=Path, default=None, help="Saida (default: sobrescreve --image)")
    args = parser.parse_args()

    if not FONT_PATH.exists():
        raise SystemExit(
            f"Fonte nao encontrada em {FONT_PATH}. Extraia de src/lib/calendario/poppins.ts "
            "(POPPINS_SEMIBOLD_BASE64) antes de rodar este script."
        )

    add_title_bar(args.image, args.title, args.logo, args.out or args.image, args.bar_color)


if __name__ == "__main__":
    main()
