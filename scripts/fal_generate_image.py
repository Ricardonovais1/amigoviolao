#!/usr/bin/env python3
"""
Gera uma imagem via Fal.AI (https://fal.ai) e salva em public/images/blog/.

Requer FAL_KEY em .env.local (ver instrucoes la no arquivo) -- nao precisa
de nenhuma lib externa, so a stdlib.

Uso:
  python scripts/fal_generate_image.py \
    --prompt "painterly illustration of a child practicing guitar, visible brushstrokes" \
    --out public/images/blog/como-afinar-o-violao.jpg

  python scripts/fal_generate_image.py --prompt "..." --out ... \
    --model fal-ai/flux-pro/v1.1 --aspect-ratio 16:9

Modelos (preco confirmado em fal.ai/models, por megapixel, arredondado pra
cima -- nossas imagens (ate 1MP) saem no preco de 1 unidade):
  fal-ai/flux/schnell     (padrao) -- $0.003/MP -- mais barato, usar sempre que possivel
  fal-ai/flux/dev                  -- $0.025/MP
  fal-ai/flux-pro/v1.1             -- $0.04/MP  -- melhor qualidade, mais caro

Teto de gasto: por padrao o script recusa gerar se o total acumulado (rastreado
localmente em scripts/.fal_spend.json, so uma estimativa -- o dashboard do
Fal.AI e que tem o valor real) passar de US$3. Ajuste com --budget ou confira
com --show-spend.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"
SPEND_LEDGER = Path(__file__).resolve().parent / ".fal_spend.json"

DEFAULT_BUDGET_USD = 3.0

ASPECT_TO_IMAGE_SIZE = {
    "1:1": "square_hd",
    "4:3": "landscape_4_3",
    "3:4": "portrait_4_3",
    "16:9": "landscape_16_9",
    "9:16": "portrait_16_9",
}

# USD por megapixel, confirmado em fal.ai/models/<id> (pagina de cada modelo).
PRICE_PER_MEGAPIXEL = {
    "fal-ai/flux/schnell": 0.003,
    "fal-ai/flux/dev": 0.025,
    "fal-ai/flux-pro/v1.1": 0.04,
}

# Megapixels cobrados por imagem (Fal arredonda pra cima ao MP mais proximo).
# Todas as resolucoes que usamos (square, 4:3, 16:9 e variantes portrait) ficam
# abaixo de 1MP, exceto square_hd (~1.05MP -> 2MP).
MEGAPIXELS_BY_IMAGE_SIZE = {
    "square_hd": 2,
    "square": 1,
    "landscape_4_3": 1,
    "portrait_4_3": 1,
    "landscape_16_9": 1,
    "portrait_16_9": 1,
}


def estimate_cost_usd(model: str, image_size: str) -> float:
    price_per_mp = PRICE_PER_MEGAPIXEL.get(model)
    if price_per_mp is None:
        sys.exit(
            f"Nao tenho o preco de '{model}' cadastrado em PRICE_PER_MEGAPIXEL -- "
            f"confira o valor em https://fal.ai/models/{model} e adicione antes de "
            "usar um modelo novo (o teto de gasto depende disso)."
        )
    return price_per_mp * MEGAPIXELS_BY_IMAGE_SIZE[image_size]


def load_spend() -> dict:
    if not SPEND_LEDGER.exists():
        return {"total_usd": 0.0, "generations": []}
    return json.loads(SPEND_LEDGER.read_text(encoding="utf-8"))


def save_spend(ledger: dict) -> None:
    SPEND_LEDGER.write_text(json.dumps(ledger, indent=2, ensure_ascii=False), encoding="utf-8")


def record_spend(ledger: dict, model: str, cost_usd: float, prompt: str) -> None:
    ledger["total_usd"] = round(ledger["total_usd"] + cost_usd, 6)
    ledger["generations"].append(
        {"model": model, "estimated_usd": cost_usd, "prompt": prompt[:120]}
    )
    save_spend(ledger)


def load_fal_key() -> str:
    if not ENV_FILE.exists():
        sys.exit(f"Nao encontrei {ENV_FILE}")
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^FAL_KEY=(.*)$", line.strip())
        if match:
            key = match.group(1).strip()
            if key:
                return key
            break
    sys.exit(
        "FAL_KEY vazia em .env.local. Crie uma key em "
        "https://fal.ai/dashboard/keys e cole na linha FAL_KEY=..."
    )


def generate(prompt: str, model: str, aspect_ratio: str, seed: int | None, budget_usd: float) -> str:
    image_size = ASPECT_TO_IMAGE_SIZE.get(aspect_ratio)
    if image_size is None:
        sys.exit(f"aspect-ratio '{aspect_ratio}' invalido. Use uma de: {', '.join(ASPECT_TO_IMAGE_SIZE)}")

    cost = estimate_cost_usd(model, image_size)
    ledger = load_spend()
    projected = ledger["total_usd"] + cost
    if projected > budget_usd:
        sys.exit(
            f"Teto de US${budget_usd:.2f} estourado: ja gastos ~US${ledger['total_usd']:.4f} "
            f"+ ~US${cost:.4f} desta geracao = US${projected:.4f}.\n"
            f"Confira o gasto real em fal.ai/dashboard/billing. Se estiver ok, rode de novo "
            f"com --budget mais alto, ou apague {SPEND_LEDGER.name} pra zerar o contador local."
        )

    payload: dict = {
        "prompt": prompt,
        "image_size": image_size,
        "num_images": 1,
    }
    if seed is not None:
        payload["seed"] = seed

    req = urllib.request.Request(
        f"https://fal.run/{model}",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Key {load_fal_key()}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        sys.exit(f"Fal.AI retornou erro {e.code}:\n{detail}")

    images = body.get("images") or []
    if not images:
        sys.exit(f"Resposta sem imagens: {json.dumps(body)[:500]}")

    # So registra o gasto depois que o Fal confirmou a geracao (e portanto ja cobrou).
    record_spend(ledger, model, cost, prompt)
    return images[0]["url"]


def download(url: str, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as resp:
        out.write_bytes(resp.read())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--prompt", help="Descricao da imagem (em ingles funciona melhor nos modelos FLUX)")
    parser.add_argument("--out", type=Path, help="Caminho de saida, ex: public/images/blog/meu-post.jpg")
    parser.add_argument("--model", default="fal-ai/flux/schnell", help="Modelo Fal.AI (default: fal-ai/flux/schnell, o mais barato)")
    parser.add_argument("--aspect-ratio", default="16:9", choices=sorted(ASPECT_TO_IMAGE_SIZE), help="Proporcao da imagem (default: 16:9, mesma do PostCover do blog)")
    parser.add_argument("--seed", type=int, default=None, help="Seed fixa, para reproduzir/variar uma mesma composicao")
    parser.add_argument("--budget", type=float, default=DEFAULT_BUDGET_USD, help=f"Teto de gasto acumulado em USD (default: {DEFAULT_BUDGET_USD})")
    parser.add_argument("--show-spend", action="store_true", help="So mostra o gasto acumulado estimado e sai (nao gera imagem)")
    args = parser.parse_args()

    if args.show_spend:
        ledger = load_spend()
        print(f"Gasto acumulado estimado: US${ledger['total_usd']:.4f} ({len(ledger['generations'])} geracoes)")
        return

    if not args.prompt or not args.out:
        parser.error("--prompt e --out sao obrigatorios (a menos que use --show-spend)")

    print(f"Gerando com {args.model} ({args.aspect_ratio})...")
    url = generate(args.prompt, args.model, args.aspect_ratio, args.seed, args.budget)
    download(url, args.out)
    size_kb = args.out.stat().st_size / 1024
    print(f"Salvo em {args.out} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
