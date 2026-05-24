# Fold 2 — Value-Prop / "Who We Are"

Replaces `#who` with a 4-act, pinned, scroll-driven comparison theater that tells the entire AutoImports story (problem → diagnosis → new model → proof) in one fold. Locked Excel numbers: G63 $185K / ₪2.1M / ₪915K delta / 78% / 200pt / 4.9★ / 0 complaints.

**Entry points:** wrapper class `.gita-vp` on `#who`; sub-classes `.vp-track` (pin container), `.vp-stage` (sticky 100vh stage), `.vp-act` / `.vp-act-1..4` (each act), `.vp-bar-fill[data-w]` (price bars), `.vp-donut .vp-seg[data-final-dash]` (donut chart), `.vp-tile` (model tiles), `.vp-logo` (media placeholders), `.vp-advisor .vp-circ` (advisor circles).

Boots via `window.__GITA_VALUE_PROP__()` (auto-runs on DOMContentLoaded). Loads GSAP+ScrollTrigger from CDN if absent; mobile (≤768px) and `prefers-reduced-motion` fall back to IntersectionObserver reveals with no pinning. Palette strict: `#0a0e1a / #0f1320 / #1a2030`, cobalt `#1e5fff / #4a8fff`, contrast red `#ff4d4d` (importer-price only).
