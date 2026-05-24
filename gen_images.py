#!/usr/bin/env python3
"""Generate 100 car images in parallel by calling asi-generate-image."""
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/home/user/workspace")
TARGET_DIR = ROOT / "gita-v2" / "images"
MANIFEST = ROOT / "gita-v2" / "prompts_manifest.json"

with open(MANIFEST) as f:
    manifest = json.load(f)

# Filter: skip any that already exist in the target dir
todo = []
for item in manifest:
    out_path = TARGET_DIR / f"{item['filename']}.png"
    if out_path.exists() and out_path.stat().st_size > 50000:
        continue
    todo.append(item)

print(f"Total prompts: {len(manifest)} | Already done: {len(manifest)-len(todo)} | To generate: {len(todo)}", flush=True)


def generate_one(item, attempt=1):
    payload = {
        "prompt": item["prompt"],
        "filename": item["filename"],
        "model": "gpt_image_2",
        "aspect_ratio": "16:9",
    }
    try:
        proc = subprocess.run(
            ["asi-generate-image", json.dumps(payload)],
            capture_output=True, text=True, timeout=300,
        )
        # Output saved to /home/user/workspace/{filename}.png  -- move into target
        src = ROOT / f"{item['filename']}.png"
        dst = TARGET_DIR / f"{item['filename']}.png"
        if src.exists():
            src.replace(dst)
            return ("ok", item["filename"], dst.stat().st_size)
        else:
            err = proc.stderr.strip() or proc.stdout.strip()
            if attempt < 2:
                return generate_one(item, attempt+1)
            return ("fail", item["filename"], err[:200])
    except subprocess.TimeoutExpired:
        if attempt < 2:
            return generate_one(item, attempt+1)
        return ("timeout", item["filename"], "")
    except Exception as e:
        return ("error", item["filename"], str(e)[:200])


ok, failed = 0, []
# 8 concurrent workers
with ThreadPoolExecutor(max_workers=8) as ex:
    futures = {ex.submit(generate_one, item): item for item in todo}
    for i, fut in enumerate(as_completed(futures), 1):
        status, name, info = fut.result()
        if status == "ok":
            ok += 1
            print(f"[{i}/{len(todo)}] OK {name} ({info//1024}KB)", flush=True)
        else:
            failed.append((name, status, info))
            print(f"[{i}/{len(todo)}] FAIL {name}: {status} {info}", flush=True)

print(f"\n=== DONE: {ok} ok, {len(failed)} failed ===", flush=True)
for f in failed:
    print(f"  {f}", flush=True)

# write summary
with open("/home/user/workspace/gita-v2/gen_summary.json", "w") as f:
    json.dump({"ok": ok, "failed": failed}, f, indent=2)
