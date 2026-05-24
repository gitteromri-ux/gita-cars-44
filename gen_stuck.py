#!/usr/bin/env python3
"""Retry the 5 stubbornly-failed prompts with minimal short prompts."""
import json, subprocess, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = Path("/home/user/workspace")
TARGET = ROOT / "gita-v2" / "images"

STUCK = {
    "mercedes-g500-interior":
        "2024 Mercedes-Benz G500 W463 interior cockpit, Nappa leather seats, dual 12.3-inch widescreen displays, classic square G-Class dashboard with passenger grab handle. Premium cobalt-blue cinematic studio lighting. Photorealistic 8K editorial automotive photography. Clean shot, no people, no text, no watermark.",
    "mercedes-g580-eq-interior":
        "2025 Mercedes G580 EQ electric G-Class interior cabin, Nappa leather seats, dual digital widescreen displays, classic square G-Class dashboard with passenger grab handle, blue ambient lighting accents. Cinematic studio lighting, premium cobalt-blue setting, photorealistic 8K editorial automotive photography. Clean shot, no people, no text, no watermark.",
    "chevy-tahoe-high-country-front":
        "2025 Chevrolet Tahoe High Country full-size SUV, front three-quarter studio view. Bold chrome horizontal grille bar with Chevrolet bowtie center emblem, dual LED headlamps with C-shape DRL, chrome window surrounds, black metallic paint, 22-inch polished chrome wheels. Premium cobalt-blue gradient backdrop, deep navy floor, cinematic studio lighting, photorealistic 8K editorial automotive photography. Clean shot, no people, no text, no watermark.",
    "mercedes-g500-side":
        "2024 Mercedes-Benz G500 W463 standard G-Class, pure side profile view, full silhouette. Square boxy SUV body, classic G-Wagen proportions, designo manufaktur olive green metallic paint, 19-inch five-spoke wheels, side-exit single exhaust. Premium cobalt-blue gradient backdrop, photorealistic 8K editorial automotive photography. Clean shot, no people, no text, no watermark.",
    "mercedes-g580-eq-front":
        "2025 Mercedes-Benz G580 electric G-Class W465, front three-quarter studio view. Closed solid front panel with illuminated star pattern, round LED headlights, alpine grey magno matte finish, 20-inch EV aero wheels, square G-Wagen silhouette. Premium cobalt-blue gradient backdrop, deep navy floor, cinematic studio lighting, photorealistic 8K editorial automotive photography. Clean shot, no people, no text, no watermark.",
}

def gen(name, prompt, attempt=1):
    payload = {"prompt": prompt, "filename": name, "model": "gpt_image_2", "aspect_ratio": "16:9"}
    try:
        proc = subprocess.run(["asi-generate-image", json.dumps(payload)],
                             capture_output=True, text=True, timeout=240)
        src = ROOT / f"{name}.png"
        dst = TARGET / f"{name}.png"
        if src.exists():
            src.replace(dst)
            return ("ok", name)
        if attempt < 3:
            time.sleep(3)
            return gen(name, prompt, attempt+1)
        return ("fail", name)
    except Exception as e:
        return ("err", name)

with ThreadPoolExecutor(max_workers=5) as ex:
    futs = {ex.submit(gen, n, p): n for n, p in STUCK.items()}
    for f in as_completed(futs):
        s, n = f.result()
        print(f"{s} {n}", flush=True)
