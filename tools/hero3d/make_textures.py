"""Genera la grafica del telo laterale (rosso, logo grande al centro, fascia rifrangente).

Uso: python3 tools/hero3d/make_textures.py
Scrive assets/telo_laterale.png (colore) e assets/telo_laterale_mask.png (bianco = fascia rifrangente).
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import ASSETS, ROSSO  # noqa: E402

# Telo del modello: 13,42 m x 2,45 m.
W = 4096
H = round(W * 2.45 / 13.42)


def main():
    rgb = tuple(round(c * 255) for c in ROSSO)
    img = Image.new("RGB", (W, H), rgb)
    mask = Image.new("L", (W, H), 0)

    logo_png = ASSETS / "_logo.png"
    lh = round(H * 0.82)
    subprocess.run(
        ["rsvg-convert", "-h", str(lh), str(ASSETS / "logo-su-rosso.svg"), "-o", str(logo_png)],
        check=True,
    )
    logo = Image.open(logo_png).convert("RGBA")
    img.paste(logo, ((W - logo.width) // 2, round(H * 0.035)), logo)
    logo_png.unlink()

    # Fascia rifrangente: linea tratteggiata vicino al bordo basso, come sul bilico vero.
    d, dm = ImageDraw.Draw(img), ImageDraw.Draw(mask)
    y0, y1 = round(H * 0.88), round(H * 0.905)
    x = 30
    while x < W - 30:
        d.rectangle([x, y0, x + 38, y1], fill=(235, 238, 242))
        dm.rectangle([x, y0, x + 38, y1], fill=255)
        x += 52

    img.save(ASSETS / "telo_laterale.png")
    mask.save(ASSETS / "telo_laterale_mask.png")
    print(f"[hero3d] texture {W}x{H} scritte in {ASSETS}")


if __name__ == "__main__":
    main()
