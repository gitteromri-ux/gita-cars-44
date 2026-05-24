/* ============================================================
   FOLD 2 — VALUE-PROP / WHO WE ARE
   Scroll-driven 4-act comparison theater.
   Pinned timeline on desktop, IntersectionObserver on mobile.
   ============================================================ */
(function () {
  'use strict';

  const MOUNT_SEL = '#who';

  // Donut data — partner-locked split of the ₪915k "delta"
  const DONUT = [
    { key: 'importer', cls: 'vp-seg-importer', pct: 40, label: 'רווח יבואן' },
    { key: 'tax',      cls: 'vp-seg-tax',      pct: 25, label: 'מס קנייה' },
    { key: 'vat',      cls: 'vp-seg-vat',      pct: 18, label: 'מע״מ' },
    { key: 'ship',     cls: 'vp-seg-ship',     pct: 10, label: 'שילוח ומכס' },
    { key: 'other',    cls: 'vp-seg-other',    pct:  7, label: 'אחר' }
  ];

  const MEDIA = ['Globes', 'TheMarker', 'Calcalist', 'Maakor', 'Walla', 'Ynet', 'Forbes IL', 'TechCrunch IL'];

  const ADVISORS = [
    { initial: 'ע',  name: 'ד״ר ענת לוי',       role: 'יועצת רגולציה' },
    { initial: 'מ',  name: 'מאיר גרופר',         role: 'יו״ר' },
    { initial: 'ח',  name: 'חנן סילונסון',       role: 'מימון' },
    { initial: 'ו',  name: 'וולט ישראל',         role: 'לוגיסטיקה' }
  ];

  // ------------------------------------------------------------
  // SVG donut builder
  // ------------------------------------------------------------
  function buildDonutSVG() {
    const R = 78, CX = 100, CY = 100;
    const C = 2 * Math.PI * R; // ~490
    let acc = 0;
    const segs = DONUT.map((s) => {
      const len = (s.pct / 100) * C;
      const dash = `${len} ${C - len}`;
      const offset = -acc; // negative because we rotate -90deg in CSS
      acc += len;
      return `<circle class="vp-seg ${s.cls}" cx="${CX}" cy="${CY}" r="${R}"
                stroke-dasharray="0 ${C}" data-final-dash="${dash}"
                stroke-dashoffset="${offset}" pathLength="${C}"></circle>`;
    }).join('');
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="none"
              stroke="rgba(255,255,255,.04)" stroke-width="22"></circle>
      ${segs}
    </svg>`;
  }

  // ------------------------------------------------------------
  // HTML
  // ------------------------------------------------------------
  function buildHTML() {
    const logosHTML = MEDIA.map(m => `<div class="vp-logo">${m}</div>`).join('');
    const advHTML = ADVISORS.map(a => `
      <div class="vp-advisor">
        <div class="vp-circ" aria-hidden="true">${a.initial}</div>
        <div class="vp-adv-name">${a.name}</div>
        <div class="vp-adv-role">${a.role}</div>
      </div>`).join('');

    const legendHTML = DONUT.map(s => {
      const isImp = s.key === 'importer';
      return `<div class="vp-legend-row l-${s.key === 'importer' ? 'imp' : s.key}">
        ${isImp ? '<b>אצלנו 0</b>' : ''}<i></i>${s.label} · ${s.pct}%
      </div>`;
    }).join('');

    return `
<div class="vp-track">
  <div class="vp-stage">
    <div class="vp-eyebrow">מי אנחנו · המודל החדש</div>

    <!-- ACT 1 — THE PROBLEM -->
    <section class="vp-act vp-act-1" data-act="1">
      <div class="vp-stack">
        <span class="vp-line vp-l1">מרצדס G63</span>
        <span class="vp-line vp-l2"><span class="vp-tag">באמריקה</span>$185,000</span>
        <span class="vp-line vp-l3"><span class="vp-tag">בישראל</span>₪2,100,000</span>
      </div>
    </section>

    <!-- ACT 2 — THE DIAGNOSIS -->
    <section class="vp-act vp-act-2" data-act="2">
      <div class="vp-diag">
        <div class="vp-bars">
          <div class="vp-bar is-bad">
            <div class="vp-bar-meta"><span>אצל היבואן בישראל</span><b>₪2,100,000</b></div>
            <div class="vp-bar-track"><div class="vp-bar-fill" data-w="100"></div></div>
          </div>
          <div class="vp-bar is-good">
            <div class="vp-bar-meta"><span>מחיר נחיתה אצלנו</span><b>₪1,185,000</b></div>
            <div class="vp-bar-track"><div class="vp-bar-fill" data-w="56"></div></div>
          </div>
          <div class="vp-delta">
            <span class="vp-arrow">↓</span>
            <b>₪915,000</b>
            <span>הפרש — לאן הולך הכסף?</span>
          </div>
        </div>
        <div class="vp-donut-wrap">
          <div class="vp-donut">
            ${buildDonutSVG()}
            <div class="vp-donut-center">
              <div class="vp-dc-tag">פילוח ההפרש</div>
              <div class="vp-dc-val">₪915K</div>
              <div class="vp-dc-sub">אצלנו 0% רווח יבואן</div>
            </div>
          </div>
          <div class="vp-legend">
            ${legendHTML}
          </div>
        </div>
      </div>
    </section>

    <!-- ACT 3 — THE NEW MODEL -->
    <section class="vp-act vp-act-3" data-act="3">
      <div class="vp-tiles">
        <article class="vp-tile">
          <div class="vp-tile-tag">המודל</div>
          <div class="vp-tile-num">01</div>
          <div class="vp-tile-body">
            <h3>לא יבואן.</h3>
            <p>אנחנו לא מוכרים לך. אנחנו קונים בשבילך. הצד שלך בעסקה — לא הצד שמרוויח מהמחיר.</p>
          </div>
        </article>
        <article class="vp-tile">
          <div class="vp-tile-tag">השקיפות</div>
          <div class="vp-tile-num">02</div>
          <div class="vp-tile-body">
            <h3>מחיר אחד סופי.</h3>
            <p>כל המיסים, מע״מ, שילוח, מכס, ועמלה של 5% — בשקלים, לפני שמתחילים. בלי הפתעות.</p>
          </div>
        </article>
        <article class="vp-tile">
          <div class="vp-tile-tag">השיטה</div>
          <div class="vp-tile-num">03</div>
          <div class="vp-tile-body">
            <h3>תחרות, לא מחירון.</h3>
            <p>סורקים את כל ארה״ב, מריצים תחרות בין השותפים שלנו, מגישים את הזוכה. עד 78% מתחת למחיר היבואן.</p>
          </div>
        </article>
      </div>
    </section>

    <!-- ACT 4 — PROOF -->
    <section class="vp-act vp-act-4" data-act="4">
      <div class="vp-proof">
        <div class="vp-proof-head">
          <div class="vp-eye">הוכחה</div>
          <h3>בורד מייעץ · הופעות תקשורת · <em>אפס תלונות</em></h3>
        </div>
        <div class="vp-logos">${logosHTML}</div>
        <div class="vp-advisors">${advHTML}</div>
        <div class="vp-trust">
          <div class="t"><b>200</b><span>נקודות בדיקה</span></div>
          <div class="t"><b>4.9★</b><span>דירוג ממוצע</span></div>
          <div class="t"><b>0</b><span>תלונות</span></div>
          <div class="t"><b>72h</b><span>זמן הצעה</span></div>
        </div>
      </div>
    </section>

    <div class="vp-progress" aria-hidden="true">
      <i data-step="1" class="on"></i><i data-step="2"></i><i data-step="3"></i><i data-step="4"></i>
    </div>
  </div>
</div>`;
  }

  // ------------------------------------------------------------
  // GSAP loader (CDN if absent)
  // ------------------------------------------------------------
  function loadScript(src) {
    return new Promise((res, rej) => {
      if ([...document.scripts].some(s => s.src === src)) return res();
      const s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  async function ensureGSAP() {
    if (window.gsap && window.ScrollTrigger) return true;
    try {
      if (!window.gsap)
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
      if (!window.ScrollTrigger)
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
      return !!(window.gsap && window.ScrollTrigger);
    } catch { return false; }
  }

  // ------------------------------------------------------------
  // Desktop pinned timeline
  // ------------------------------------------------------------
  function bootDesktop(root) {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    const stage = root.querySelector('.vp-stage');
    const track = root.querySelector('.vp-track');
    const acts = root.querySelectorAll('.vp-act');
    const progressDots = root.querySelectorAll('.vp-progress i');

    // Initial state
    gsap.set(acts, { opacity: 0 });
    gsap.set(root.querySelectorAll('.vp-line'), { opacity: 0, y: 60 });
    gsap.set(root.querySelectorAll('.vp-tile'), { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          let active = 1;
          if (p > 0.78) active = 4;
          else if (p > 0.52) active = 3;
          else if (p > 0.26) active = 2;
          progressDots.forEach(d => d.classList.toggle('on', +d.dataset.step <= active));
        }
      }
    });

    // ----- ACT 1: 0 → 0.25
    tl.to('.vp-act-1', { opacity: 1, duration: 0.04 }, 0)
      .to('.vp-act-1 .vp-l1', { opacity: 1, y: 0, duration: 0.05 }, 0.02)
      .to('.vp-act-1 .vp-l2', { opacity: 1, y: 0, duration: 0.05 }, 0.08)
      .to('.vp-act-1 .vp-l3', { opacity: 1, y: 0, duration: 0.05 }, 0.14)
      .to('.vp-act-1 .vp-line', {
        scale: 1.08, duration: 0.05, transformOrigin: 'center center'
      }, 0.20)
      .to('.vp-act-1', { opacity: 0, duration: 0.04 }, 0.24);

    // ----- ACT 2: 0.26 → 0.52
    tl.to('.vp-act-2', { opacity: 1, duration: 0.04 }, 0.26);
    root.querySelectorAll('.vp-bar-fill').forEach(el => {
      tl.fromTo(el, { width: '0%' },
        { width: el.dataset.w + '%', duration: 0.10, ease: 'power2.out' }, 0.30);
    });
    // Donut: animate stroke-dasharray for each seg
    const segs = root.querySelectorAll('.vp-donut .vp-seg');
    segs.forEach((seg, i) => {
      const finalDash = seg.dataset.finalDash;
      const C = 2 * Math.PI * 78;
      tl.to(seg, {
        attr: { 'stroke-dasharray': finalDash },
        duration: 0.06, ease: 'power2.out'
      }, 0.36 + i * 0.015);
    });
    tl.to('.vp-act-2', { opacity: 0, duration: 0.04 }, 0.50);

    // ----- ACT 3: 0.52 → 0.78
    tl.to('.vp-act-3', { opacity: 1, duration: 0.04 }, 0.52);
    root.querySelectorAll('.vp-tile').forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.55 + i * 0.04);
    });
    tl.to('.vp-act-3', { opacity: 0, duration: 0.04 }, 0.76);

    // ----- ACT 4: 0.78 → 1
    tl.to('.vp-act-4', { opacity: 1, duration: 0.05 }, 0.78);

    return tl;
  }

  // ------------------------------------------------------------
  // Mobile fallback — IntersectionObserver per act
  // ------------------------------------------------------------
  function bootMobile(root) {
    const acts = root.querySelectorAll('.vp-act');
    acts.forEach(a => a.classList.add('is-pre'));

    // Static donut: set final dasharray immediately
    root.querySelectorAll('.vp-donut .vp-seg').forEach(seg => {
      seg.setAttribute('stroke-dasharray', seg.dataset.finalDash);
    });
    // Static bars: set final width
    root.querySelectorAll('.vp-bar-fill').forEach(el => {
      el.style.width = el.dataset.w + '%';
    });
    // Static lines
    root.querySelectorAll('.vp-line, .vp-tile').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
    });

    if (!('IntersectionObserver' in window)) {
      acts.forEach(a => { a.classList.remove('is-pre'); a.classList.add('is-in'); });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('is-pre');
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    acts.forEach(a => io.observe(a));
  }

  // ------------------------------------------------------------
  // Main entry
  // ------------------------------------------------------------
  async function init() {
    const root = document.querySelector(MOUNT_SEL);
    if (!root) return;

    // Wipe existing content + apply scope class
    root.classList.add('gita-vp');
    root.removeAttribute('data-reveal');
    root.innerHTML = buildHTML();

    // Force native-scroll fallback on ALL viewports (no GSAP ScrollTrigger pinning)
    bootMobile(root);
    return;
  }

  window.__GITA_VALUE_PROP__ = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
