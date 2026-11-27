"""Costanti condivise della pipeline hero 3D (vedi docs/superpowers/plans/2026-11-26-hero-3d-scroll.md)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WORK = ROOT / "work"
ASSETS = ROOT / "assets"
FRAMES = WORK / "frames"

TOTAL_FRAMES = 150
PHASES = {
    "apertura": (1, 22),
    "forma": (23, 60),
    "tensione": (61, 90),
    "dettagli": (91, 127),
    "chiusura": (128, 150),
}

SERIES = {
    "desktop": (1920, 1080),
    "mobile": (1080, 1440),
}

# Palette del sito (niente oro).
NERO = (0.0, 0.0, 0.0)
BLU = (0x35 / 255, 0x33 / 255, 0xCD / 255)
ROSSO = (0xE3 / 255, 0x19 / 255, 0x19 / 255)

# Aggancio: perno ralla 0,9 m dietro il frontale del semirimorchio (stessa costante dell'app rilievo).
PERNO_DIETRO_FRONTALE = 0.9
