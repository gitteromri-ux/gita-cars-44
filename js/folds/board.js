/* ============================================================
   FOLD 4 — BOARD / TOP 10 SAVINGS
   Renders ticker + 10-card data grid + KPI strip.
   ============================================================ */
(function () {
  'use strict';

  const fmt = (n) => {
    try { return new Intl.NumberFormat('he-IL').format(Math.round(n)); }
    catch (e) { return String(Math.round(n)); }
  };

  // Build a Bloomberg-style symbol from English name + rank.
  function buildSymbol(car) {
    const base = (car.nameEn || car.name || '')
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    // Prefer alphanumeric token of length >= 2 (e.g. G63, GLS, X5)
    let key = '';
    for (const t of base) {
      if (/[A-Z]\d/.test(t) || /\d/.test(t)) { key = t; break; }
    }
    if (!key) {
      key = base.slice(0, 2).map(t => t.slice(0, 3)).join('');
    }
    key = key.slice(0, 5);
    return `${key}-${car.rank}`;
  }

  function renderTicker(top10) {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const oneSet = top10.map((c) => {
      const sym = buildSymbol(c);
      return `
        <span class="tk-item">
          <span class="tk-sym">${sym}</span>
          <span class="tk-name">${c.name}</span>
          <span class="tk-price">₪${fmt(c.landedNIS)}</span>
          <span class="tk-delta">▲ ${c.savePct}%</span>
        </span>
      `;
    }).join('');

    // Duplicate for seamless loop
    track.innerHTML = oneSet + oneSet;
  }

  function renderGrid(top10) {
    const grid = document.getElementById('boardGrid');
    if (!grid) return;

    grid.innerHTML = top10.map((c, idx) => {
      const sym = buildSymbol(c);
      const body = (c.body || '').toUpperCase();
      const year = c.year || '';
      const tag = [year, body].filter(Boolean).join(' · ');
      // Cap visual fill at 100% even when savePct > 100
      const fillPct = Math.min(100, Math.max(4, c.savePct));
      const flickerDelay = (Math.random() * 2.5).toFixed(2);

      return `
        <article class="b-card"
          data-slug="${c.slug}"
          data-fill="${fillPct}"
          style="--flicker-delay:${flickerDelay}s">
          <span class="b-rank">${c.rank}</span>
          <span class="b-sym">${sym}</span>

          <div class="b-img">
            <img src="./images/car-${c.slug}.png" alt="${c.name}" loading="lazy" decoding="async" />
            <div class="b-meta">
              <div class="b-name">${c.name}</div>
              <div class="b-tag">${tag}</div>
            </div>
          </div>

          <div class="b-panel">
            <div class="b-row">
              <span class="b-label">סופי · NIS</span>
              <span class="b-val">₪${fmt(c.landedNIS)}</span>
            </div>
            <div class="b-row b-row-mute">
              <span class="b-label">ישראל</span>
              <span class="b-val">₪${fmt(c.israelNIS)}</span>
            </div>
            <div class="b-bar-wrap">
              <div class="b-bar-label">
                <span class="b-save-amt">חיסכון ₪${fmt(c.israelNIS - c.landedNIS)}</span>
                <span class="b-save-pct">▲ ${c.savePct}%</span>
              </div>
              <div class="b-bar">
                <div class="b-bar-fill" style="width:0%"></div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    wireCards(grid);
  }

  function renderKpis(top10, totalCount) {
    const wrap = document.querySelector('#board .board-w');
    if (!wrap) return;

    const avg = Math.round(
      top10.reduce((s, c) => s + (c.israelNIS - c.landedNIS), 0) / top10.length
    );

    let strip = document.getElementById('boardKpis');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'boardKpis';
      strip.className = 'b-kpis';
      wrap.appendChild(strip);
    }

    strip.innerHTML = `
      <div class="b-kpi">
        <span class="b-kpi-tag">AVG</span>
        <span class="b-kpi-val">₪${fmt(avg)}</span>
        <span class="b-kpi-label">חיסכון ממוצע · עשרת המובילים</span>
      </div>
      <div class="b-kpi">
        <span class="b-kpi-tag">FLEET</span>
        <span class="b-kpi-val">${top10.length}/${totalCount}</span>
        <span class="b-kpi-label">דגמים זמינים · מתוך הקטלוג</span>
      </div>
      <div class="b-kpi">
        <span class="b-kpi-tag">USD/ILS</span>
        <span class="b-kpi-val">$2.93</span>
        <span class="b-kpi-label">שער חליפין נוכחי · עודכן עכשיו</span>
      </div>
    `;
  }

  function ensureHead() {
    const head = document.querySelector('#board .board-head');
    if (!head) return;
    const title = head.querySelector('.board-title');
    if (title) {
      title.innerHTML = `
        <span class="eyebrow"><span class="dot-eb"></span>שידור חי · עודכן עכשיו</span>
        <h2 class="h-1">עשרת המובילים בחיסכון</h2>
        <p>20 דגמים. מחיר אמריקאי מול מחיר ישראלי. עודכן כל 60 שניות.</p>
      `;
    }
    // Keep the live-tag visible
  }

  // ============== INTERACTIONS ==============
  function wireCards(grid) {
    const cards = grid.querySelectorAll('.b-card');
    const isCoarse = window.matchMedia('(hover: none)').matches;

    cards.forEach((card) => {
      // Click → VDP
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        if (slug && typeof window.openVDP === 'function') {
          window.openVDP(slug);
        }
      });

      if (isCoarse) return;

      // 3D tilt with lerp
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const MAX = 6;

      function onMove(e) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        cx = (py - 0.5) * -2 * MAX;   // rotateX (vertical mouse → tilt up/down)
        cy = (px - 0.5) *  2 * MAX;   // rotateY
        if (!raf) raf = requestAnimationFrame(tick);
      }

      function tick() {
        tx += (cx - tx) * 0.16;
        ty += (cy - ty) * 0.16;
        card.style.setProperty('--tilt-x', tx.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', ty.toFixed(2) + 'deg');
        if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = null;
        }
      }

      function onLeave() {
        cx = 0; cy = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      }

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });

    // Reveal savings bars on enter
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          const fill = card.querySelector('.b-bar-fill');
          if (fill) {
            const pct = card.dataset.fill || '0';
            // Stagger by index in row
            const delay = Array.from(card.parentNode.children).indexOf(card) * 80;
            setTimeout(() => { fill.style.width = pct + '%'; }, delay);
          }
          io.unobserve(card);
        });
      }, { threshold: 0.25 });
      cards.forEach((c) => io.observe(c));
    } else {
      cards.forEach((c) => {
        const fill = c.querySelector('.b-bar-fill');
        if (fill) fill.style.width = (c.dataset.fill || '0') + '%';
      });
    }
  }

  // ============== BOOT ==============
  function run() {
    const CARS = window.CARS;
    if (!Array.isArray(CARS) || CARS.length === 0) return false;

    const sorted = [...CARS].sort((a, b) => (b.saveUSD || 0) - (a.saveUSD || 0));
    const top10 = sorted.slice(0, 10);

    ensureHead();
    renderTicker(top10);
    renderGrid(top10);
    renderKpis(top10, CARS.length);
    return true;
  }

  window.__GITA_BOARD__ = run;

  function boot() {
    if (run()) return;
    const tick = setInterval(() => {
      if (run()) clearInterval(tick);
    }, 200);
    // Safety cap
    setTimeout(() => clearInterval(tick), 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
