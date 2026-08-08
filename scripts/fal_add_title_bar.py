#!/usr/bin/env python3
"""
Aplica a tarja de titulo (branco translucido + logo) numa capa de blog ja
gerada. Passo separado da geracao em si -- pedir pro modelo de imagem
desenhar texto e a logo real nao e confiavel (ver SKILL.md), entao isso e
composicao deterministica com Pillow.

Uso:
  python scripts/fal_add_title_bar.py \
    --image public/images/blog/<slug>.jpg \
    --title "Como trocar acordes mais rapido"

Roda ANTES do optimize_images.py (a tarja vira parte do raster; o optimize
so converte pra webp e redimensiona depois).
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent
FONT_PATH = Path(__file__).resolve().parent / "fonts" / "Poppins-SemiBold.ttf"
DEFAULT_LOGO = REPO_ROOT / "public" / "images" / "logo-amigo-violao-completo.png"

BAR_HEIGHT_PCT = 0.13
BAR_OPACITY = 0.55
FONT_SIZE = 28
TEXT_COLOR = (33, 33, 33)  # brand dark (--brand-dark #212121)
PADDING_PCT = 0.04  # margem esquerda (texto) e direita (logo), em % da largura
LOGO_VPAD_PCT = 0.20  # margem vertical da logo dentro da tarja, em % da altura da tarja


def add_title_bar(image_path: Path, title: str, logo_path: Path, out_path: Path) -> None:
    base = Image.open(image_path).convert("RGBA")
    w, h = base.size

    bar_h = round(h * BAR_HEIGHT_PCT)
    bar = Image.new("RGBA", (w, bar_h), (255, 255, 255, round(255 * BAR_OPACITY)))

    composed = base.copy()
    composed.alpha_composite(bar, (0, h - bar_h))

    draw = ImageDraw.Draw(composed)
    font = ImageFont.truetype(str(FONT_PATH), FONT_SIZE)
    padding_x = round(w * PADDING_PCT)

    bar_top = h - bar_h
    text_bbox = draw.textbbox((0, 0), title, font=font)
    text_h = text_bbox[3] - text_bbox[1]
    text_y = bar_top + (bar_h - text_h) / 2 - text_bbox[1]
    draw.text((padding_x, text_y), title, font=font, fill=TEXT_COLOR)

    logo = Image.open(logo_path).convert("RGBA")
    logo_vpad = round(bar_h * LOGO_VPAD_PCT)
    logo_target_h = bar_h - 2 * logo_vpad
    logo_target_w = round(logo.width * (logo_target_h / logo.height))
    logo = logo.resize((logo_target_w, logo_target_h), Image.LANCZOS)

    logo_x = w - padding_x - logo_target_w
    logo_y = bar_top + logo_vpad
    composed.alpha_composite(logo, (logo_x, logo_y))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    if out_path.suffix.lower() in (".jpg", ".jpeg"):
        composed.convert("RGB").save(out_path, quality=92)
    else:
        composed.save(out_path)
    print(f"Salvo em {out_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--image", required=True, type=Path, help="Capa ja gerada (jpg/png/webp)")
    parser.add_argument("--title", required=True, help="Texto da tarja (normalmente o titulo do post)")
    parser.add_argument("--logo", default=DEFAULT_LOGO, type=Path, help=f"Logo (default: {DEFAULT_LOGO})")
    parser.add_argument("--out", type=Path, default=None, help="Saida (default: sobrescreve --image)")
    args = parser.parse_args()

    if not FONT_PATH.exists():
        raise SystemExit(
            f"Fonte nao encontrada em {FONT_PATH}. Extraia de src/lib/calendario/poppins.ts "
            "(POPPINS_SEMIBOLD_BASE64) antes de rodar este script."
        )

    add_title_bar(args.image, args.title, args.logo, args.out or args.image)


if __name__ == "__main__":
    main()
