"""PNG -> WebP per il sito, dentro i budget di peso. Scrive anche poster e immagini statiche.

Uso: python3 tools/hero3d/encode.py
Esce con codice 1 se qualche fotogramma resta fuori budget.
"""
import io
import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
if (HERE / "config.py").exists():  # nel repo
    sys.path.insert(0, str(HERE))
    from config import FRAMES, ROOT, TOTAL_FRAMES  # noqa: E402
    OUT = ROOT.parent.parent / "public" / "sequenze" / "hero"
else:  # cartella di rendering sul PC: frames/ accanto, uscita in sito/
    FRAMES, TOTAL_FRAMES = HERE / "frames", 150
    OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "sito"
BUDGET = {"desktop": (80_000, 6_000_000), "mobile": (50_000, 3_000_000)}  # per fotogramma, totale
STATICI = (1, 75, 150)


def webp_entro(img: Image.Image, limite: int) -> bytes:
    q = 85
    while True:
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= limite or q <= 50:
            return buf.getvalue()
        q -= 4


def main() -> int:
    fuori = []
    for serie, (per_frame, totale) in BUDGET.items():
        dest = OUT / serie
        dest.mkdir(parents=True, exist_ok=True)
        somma, massimo = 0, 0
        for i in range(1, TOTAL_FRAMES + 1):
            src = FRAMES / serie / f"{i:04d}.png"
            if not src.exists():
                print(f"manca {src}")
                return 1
            img = Image.open(src).convert("RGB")
            data = webp_entro(img, per_frame)
            (dest / f"{i:04d}.webp").write_bytes(data)
            somma += len(data)
            massimo = max(massimo, len(data))
            if len(data) > per_frame:
                fuori.append(f"{serie}/{i:04d}.webp {len(data) // 1000} KB")
            if i == 1:
                (OUT / f"poster-{serie}.webp").write_bytes(webp_entro(img, per_frame))
            if i in STATICI:
                n = STATICI.index(i) + 1
                (OUT / f"statici-{serie}-{n}.webp").write_bytes(webp_entro(img, per_frame))
        print(f"{serie}: {somma // 1000} KB totali, max {massimo // 1000} KB")
        if somma > totale:
            fuori.append(f"{serie} totale {somma // 1000} KB > {totale // 1000} KB")
    if fuori:
        print("FUORI BUDGET:\n" + "\n".join(fuori))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
