#!/usr/bin/env python3
"""
Otimizador de imagens do site (public/images/).

O que faz:
  - Converte .jpg/.jpeg/.png para .webp (mesmo diretório, mesmo nome-base).
    Mantém o arquivo original ao lado -- ele so deixa de existir quando
    alguem atualiza as referencias no codigo e o remove (git rm).
  - Redimensiona qualquer imagem (de entrada ou ja .webp) que seja mais
    larga que --max-width, preservando a proporcao.
  - Com --reencode-webp, tambem reprocessa .webp existentes (redimensiona
    se necessario e reencoda na qualidade alvo), sobrescrevendo apenas
    quando o resultado for menor -- nesse caso o caminho nao muda, entao
    nenhuma referencia no codigo precisa ser tocada.
  - Nunca piora um arquivo: se o resultado nao for menor, o original fica
    como estava.

Uso:
  python scripts/optimize_images.py                        # relatorio + grava .webp novos
  python scripts/optimize_images.py --dry-run               # so mostra o que faria
  python scripts/optimize_images.py --reencode-webp          # tambem reotimiza .webp existentes
  python scripts/optimize_images.py --src public/images/quiz --max-width 1200

Requer Pillow (pip install Pillow).
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

CONVERT_EXTENSIONS = {".jpg", ".jpeg", ".png"}
WEBP_EXTENSION = ".webp"


@dataclass
class Result:
    path: Path
    action: str  # "convert", "reencode", "resize", "skip"
    before_bytes: int
    after_bytes: int

    @property
    def saved_bytes(self) -> int:
        return self.before_bytes - self.after_bytes

    @property
    def saved_pct(self) -> float:
        if self.before_bytes == 0:
            return 0.0
        return 100 * self.saved_bytes / self.before_bytes


def human(n: int) -> str:
    for unit in ("B", "KB", "MB"):
        if abs(n) < 1024:
            return f"{n:.0f}{unit}" if unit == "B" else f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}GB"


def resized(img: Image.Image, max_width: int | None) -> Image.Image:
    if not max_width or img.width <= max_width:
        return img
    ratio = max_width / img.width
    new_size = (max_width, max(1, round(img.height * ratio)))
    return img.resize(new_size, Image.LANCZOS)


def encode_webp(img: Image.Image, quality: int) -> bytes:
    from io import BytesIO

    buf = BytesIO()
    # Preserva transparencia (RGBA) quando existir; senao usa RGB.
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
    img.save(buf, format="WEBP", quality=quality, method=6)
    return buf.getvalue()


def process_convertible(path: Path, quality: int, max_width: int | None, dry_run: bool) -> Result | None:
    """jpg/jpeg/png -> .webp irmao, sem apagar o original."""
    target = path.with_suffix(WEBP_EXTENSION)
    if target.exists():
        return None  # ja tem um webp correspondente; nao mexe

    before = path.stat().st_size
    with Image.open(path) as img:
        img = resized(img, max_width)
        data = encode_webp(img, quality)

    if not dry_run:
        target.write_bytes(data)

    return Result(path=target, action="convert", before_bytes=before, after_bytes=len(data))


def process_webp(path: Path, quality: int, max_width: int | None, dry_run: bool) -> Result | None:
    """Reencoda um .webp existente, sobrescrevendo so se for menor."""
    before = path.stat().st_size
    with Image.open(path) as img:
        was_resized = bool(max_width and img.width > max_width)
        img = resized(img, max_width)
        data = encode_webp(img, quality)

    if len(data) >= before and not was_resized:
        return Result(path=path, action="skip", before_bytes=before, after_bytes=before)

    if not dry_run:
        path.write_bytes(data)

    action = "resize" if was_resized else "reencode"
    return Result(path=path, action=action, before_bytes=before, after_bytes=len(data))


def walk_images(src: Path):
    for path in sorted(src.rglob("*")):
        if path.is_file():
            yield path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--src", default="public/images", help="Diretorio a varrer (default: public/images)")
    parser.add_argument("--quality", type=int, default=82, help="Qualidade WebP 1-100 (default: 82)")
    parser.add_argument("--max-width", type=int, default=1920, help="Largura maxima em px, 0 desativa (default: 1920)")
    parser.add_argument("--reencode-webp", action="store_true", help="Tambem reotimiza .webp ja existentes")
    parser.add_argument("--dry-run", action="store_true", help="So mostra o que seria feito, nao grava nada")
    args = parser.parse_args()

    max_width = args.max_width or None
    src = Path(args.src)
    if not src.exists():
        raise SystemExit(f"Diretorio nao encontrado: {src}")

    results: list[Result] = []
    for path in walk_images(src):
        ext = path.suffix.lower()
        if ext in CONVERT_EXTENSIONS:
            r = process_convertible(path, args.quality, max_width, args.dry_run)
        elif ext == WEBP_EXTENSION and args.reencode_webp:
            r = process_webp(path, args.quality, max_width, args.dry_run)
        else:
            continue
        if r:
            results.append(r)

    acted = [r for r in results if r.action != "skip"]
    if not acted:
        print("Nada para otimizar (ou tudo ja esta no tamanho ideal).")
        return

    label = "[dry-run] " if args.dry_run else ""
    print(f"{label}{'Arquivo':<70} {'Ação':<10} {'Antes':>8} {'Depois':>8} {'Economia':>10}")
    total_before = total_after = 0
    for r in acted:
        rel = r.path.as_posix()
        print(f"{rel:<70} {r.action:<10} {human(r.before_bytes):>8} {human(r.after_bytes):>8} "
              f"{r.saved_pct:>8.0f}%")
        total_before += r.before_bytes
        total_after += r.after_bytes

    total_saved = total_before - total_after
    pct = 100 * total_saved / total_before if total_before else 0
    print(f"\n{len(acted)} arquivo(s) processado(s). Total: {human(total_before)} -> {human(total_after)} "
          f"(economia de {human(total_saved)}, {pct:.0f}%).")

    converts = [r for r in acted if r.action == "convert"]
    if converts:
        print(f"\n{len(converts)} novo(s) .webp criado(s) ao lado do original (jpg/png).")
        print("Original NAO foi apagado -- atualize as referencias no código para o novo .webp")
        print("e só então remova o arquivo antigo (git rm).")


if __name__ == "__main__":
    main()
