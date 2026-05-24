#!/usr/bin/env python3
"""Run v2 generation, priority angles first then secondary if time permits."""
import json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/home/user/workspace")
TARGET_DIR = ROOT / "gita-v2" / "images"
MANIFEST = ROOT / "gita-v2" / "prompts_manifest_v3.json"
LOG = ROOT / "gita-v2" / "gen_v2.log"

mode = sys.argv[1] if len(sys.argv) > 1 else "priority"  # priority | secondary | all

with open(MANIFEST) as f:
    manifest = json.load(f)

# Refresh exists check
for item in manifest:
    p = TARGET_DIR / f"{item['filename']}.png"
    item["exists"] = p.exists() and p.stat().st_size > 50000

if mode == "priority":
    todo = [m for m in manifest if m["priority"] and not m["exists"]]
elif mode == "secondary":
    todo = [m for m in manifest if not m["priority"] and not m["exists"]]
else:
    todo = [m for m in manifest if not m["exists"]]

def log(msg):
    with open(LOG, "a") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {msg}\n")
    print(msg, flush=True)

log(f"=== START mode={mode} todo={len(todo)} ===")


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
            capture_output=True, text=True, timeout=240,
        )
        src = ROOT / f"{item['filename']}.png"
        dst = TARGET_DIR / f"{item['filename']}.png"
        if src.exists():
            src.replace(dst)
            return ("ok", item["filename"], dst.stat().st_size)
        else:
            err = (proc.stderr or proc.stdout or "")[-200:]
            if attempt < 2:
                time.sleep(2)
                return generate_one(item, attempt+1)
            return ("fail", item["filename"], err)
    except subprocess.TimeoutExpired:
        if attempt < 2:
            return generate_one(item, attempt+1)
        return ("timeout", item["filename"], "")
    except Exception as e:
        return ("error", item["filename"], str(e)[:200])


ok = 0
failed = []
with ThreadPoolExecutor(max_workers=10) as ex:
    futures = {ex.submit(generate_one, item): item for item in todo}
    for i, fut in enumerate(as_completed(futures), 1):
        status, name, info = fut.result()
        if status == "ok":
            ok += 1
            log(f"[{i}/{len(todo)}] OK {name} ({info//1024}KB)")
        else:
            failed.append({"name": name, "status": status, "info": str(info)})
            log(f"[{i}/{len(todo)}] FAIL {name}: {status}")

log(f"=== DONE mode={mode}: {ok} ok, {len(failed)} failed ===")
with open(f"/home/user/workspace/gita-v2/gen_{mode}_summary.json", "w") as f:
    json.dump({"ok": ok, "failed": failed}, f, indent=2)
