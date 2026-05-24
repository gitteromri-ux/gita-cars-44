/* ============================================================
   FOLD: CALC  (#calc)
   Luxury price calculator — dial + segmented + live ledger.
   Excel-locked formula. USD/ILS = 2.93.
   ============================================================ */
(function () {
  'use strict';

  // ── Excel-locked constants ──────────────────────────────
  const FX               = 2.93;          // USD → ILS
  const SHIPPING_USD     = 2000;
  const CUSTOMS_NIS      = 2000;
  const SERVICE_FEE_PCT  = 0.05;
  const GITA_DISC_USD    = 3000;
  const VAT_PCT          = 0.18;
  const ISRAEL_RATIO     = 1.78;          // landed → estimated dealer price

  // Purchase-tax brackets (Excel: gas 43-101%, EV 35-55%).
  // Default rate per fuel:
  const TAX_DEFAULT = { gas: 0.83, diesel: 0.83, hybrid: 0.55, ev: 0.45 };
  const TAX_RANGE   = { gas: [.43,1.01], diesel: [.43,1.01], hybrid: [.35,.83], ev: [.35,.55] };

  // ── State ────────────────────────────────────────────────
  const MSRP_MIN = 30000, MSRP_MAX = 250000;
  const state = {
    msrp:   100000,
    fuel:   'gas',
    body:   'suv',
    tax:    TAX_DEFAULT.gas,
    cond:   'new',
    taxOpen: false,
    optsOpen: false
  };

  // ── Helpers ──────────────────────────────────────────────
  const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US');
  const fmtNIS = n => '₪' + Math.round(n).toLocaleString('en-US');
  const fmtPct = n => Math.round(n * 100) + '%';
  const clamp  = (v, a, b) => Math.max(a, Math.min(b, v));

  // ── Markup ───────────────────────────────────────────────
  function markup() {
    return `
    <div class="calc-split">
      <!-- INPUT THEATER -->
      <div class="panel input-panel">
        <div class="panel-title"><b>01</b> בחר את הרכב שלך</div>

        <div class="dial-wrap" id="calcDial">
          <svg class="dial-svg" viewBox="0 0 300 170" aria-label="MSRP dial">
            <defs>
              <linearGradient id="calcCobaltGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"  stop-color="#2b6fff"/>
                <stop offset="100%" stop-color="#4d8bff"/>
              </linearGradient>
            </defs>
            <!-- semi-circle from 30,150 → 270,150 radius 120 -->
            <path class="dial-track" d="M 30 150 A 120 120 0 0 1 270 150"/>
            <path class="dial-fill"  id="calcDialFill" d="M 30 150 A 120 120 0 0 1 270 150"/>
            <g class="dial-ticks" id="calcDialTicks"></g>
            <circle class="dial-knob" id="calcDialKnob" cx="270" cy="150" r="9"/>
          </svg>
          <div class="dial-center">
            <div class="dial-label">MSRP בארה״ב</div>
            <div class="dial-value" id="calcDialValue">$100,000</div>
            <div class="dial-sub" id="calcDialSub">≈ ₪293,000</div>
          </div>
        </div>
        <div class="dial-bounds">
          <span>$30K</span>
          <span>$140K</span>
          <span>$250K</span>
        </div>

        <!-- Fuel -->
        <div class="seg-label">סוג דלק</div>
        <div class="seg" id="calcFuel">
          ${segBtn('gas',     'בנזין',   iconGas())}
          ${segBtn('diesel',  'דיזל',    iconDiesel())}
          ${segBtn('hybrid',  'היברידי', iconHybrid())}
          ${segBtn('ev',      'חשמלי',   iconEV())}
        </div>

        <!-- Body -->
        <div class="seg-label">סוג רכב</div>
        <div class="chips" id="calcBody">
          <button data-v="suv"   class="active">SUV</button>
          <button data-v="sedan">סדאן</button>
          <button data-v="coupe">קופה</button>
          <button data-v="pickup">פיק-אפ</button>
        </div>

        <!-- Options expander -->
        <div class="opts" id="calcOpts">
          <button class="opts-tog" type="button" id="calcOptsTog">אופציות נוספות</button>
          <div class="opts-body"><div>
            <div class="cond-toggle" id="calcCond">
              <button data-v="new" class="active">רכב חדש</button>
              <button data-v="used">יד שנייה</button>
            </div>
          </div></div>
        </div>
      </div>

      <!-- OUTPUT LEDGER -->
      <div class="panel output-panel">
        <div class="panel-title"><b>02</b> מחיר סופי לישראל</div>

        <div class="ledger" id="calcLedger">
          <div class="row"><div class="row-lbl">MSRP בארה״ב</div><div class="row-val" data-k="msrp">$0</div></div>
          <div class="row tax-row">
            <div class="row-lbl">
              <span data-k="taxLabel">מיסי קניה (83%)</span>
              <button class="tax-toggle" id="calcTaxTog" type="button">שנה</button>
            </div>
            <div class="row-val" data-k="tax">$0</div>
          </div>
          <div class="tax-slide" id="calcTaxSlide">
            <div class="tax-slide-head">
              <span>שיעור מס קניה</span>
              <b id="calcTaxVal">83%</b>
            </div>
            <input type="range" class="tax-input" id="calcTaxInput" min="35" max="101" step="1" value="83">
          </div>
          <div class="row"><div class="row-lbl">מע״מ <small>18%</small></div><div class="row-val" data-k="vat">$0</div></div>
          <div class="row"><div class="row-lbl">שילוח</div><div class="row-val" data-k="ship">$2,000</div></div>
          <div class="row"><div class="row-lbl">מכס ועמלות</div><div class="row-val" data-k="customs">₪2,000</div></div>
          <div class="row"><div class="row-lbl">עמלת שירות <small>5%</small></div><div class="row-val" data-k="svc">$0</div></div>
          <div class="row discount"><div class="row-lbl">הנחה ייעודית</div><div class="row-val" data-k="disc">−$3,000</div></div>
        </div>

        <div class="final">
          <div class="final-lbl">סופי לישראל · ON-ROAD</div>
          <div class="final-val" id="calcFinal">₪0</div>
        </div>

        <div class="compare">
          <div class="compare-row strike">
            <span>מחיר ממוצע אצל יבואן</span>
            <span class="strike-val" id="calcIsrael">₪0</span>
          </div>
          <div class="compare-row save">
            <span>חיסכון משוער</span>
            <b><span id="calcSaveNIS">₪0</span> · <span id="calcSavePct">0%</span></b>
          </div>
        </div>

        <button class="cta-find" id="calcCTA" type="button">
          <span>מצא את הרכב הזה בקטלוג שלי</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      </div>
    </div>`;
  }

  function segBtn(v, label, icon) {
    return `<button data-v="${v}" class="${v==='gas'?'active':''}">${icon}<span>${label}</span></button>`;
  }
  // tiny inline SVG icons
  function iconGas()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M4 21h11M9 9h3"/><path d="M15 9l3 3v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-9l-3-3"/></svg>`; }
  function iconDiesel() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="M17 10h2l2 3v5h-4"/><circle cx="7" cy="19" r="1.5"/><circle cx="17.5" cy="19" r="1.5"/></svg>`; }
  function iconHybrid() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 7h14l-2 5h2l-7 8 2-7H10l2-6H5z"/></svg>`; }
  function iconEV()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>`; }

  // ── Math (Excel breakdown) ──────────────────────────────
  function compute(s) {
    const msrp     = s.msrp;
    const tax      = msrp * s.tax;
    // VAT 18% applied on (MSRP + purchase tax + shipping + customs_usd)
    const customsUSD = CUSTOMS_NIS / FX;
    const vatBase  = msrp + tax + SHIPPING_USD + customsUSD;
    const vat      = vatBase * VAT_PCT;
    const svc      = (msrp + tax) * SERVICE_FEE_PCT;
    const disc     = GITA_DISC_USD;
    const landedUSD = msrp + tax + vat + SHIPPING_USD + customsUSD + svc - disc;
    const landedNIS = landedUSD * FX;
    const israelNIS = landedNIS * ISRAEL_RATIO;
    const saveNIS   = israelNIS - landedNIS;
    const savePct   = saveNIS / israelNIS;
    return { msrp, tax, vat, svc, disc, landedNIS, israelNIS, saveNIS, savePct };
  }

  // ── Animated number counter ─────────────────────────────
  const counters = new WeakMap();
  function countTo(el, to, formatter) {
    if (!el) return;
    const prev = counters.get(el) ?? to;
    if (Math.abs(prev - to) < 0.5) { el.textContent = formatter(to); counters.set(el, to); return; }
    const start = performance.now(), dur = 280, from = prev;
    cancelAnimationFrame(el._raf || 0);
    function tick(now) {
      const t = clamp((now - start) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      const cur = from + (to - from) * e;
      el.textContent = formatter(cur);
      if (t < 1) el._raf = requestAnimationFrame(tick);
      else { counters.set(el, to); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    }
    el._raf = requestAnimationFrame(tick);
  }

  // ── Dial math ───────────────────────────────────────────
  // semi-circle: center (150,150), radius 120, angle: 180° (left, $30K) → 0° (right, $250K)
  const DIAL_CX = 150, DIAL_CY = 150, DIAL_R = 120;

  function msrpToAngleDeg(msrp) {
    const t = (msrp - MSRP_MIN) / (MSRP_MAX - MSRP_MIN);
    return 180 - 180 * t;          // 180° → 0°
  }
  function angleDegToMsrp(deg) {
    const t = (180 - deg) / 180;
    return clamp(MSRP_MIN + t * (MSRP_MAX - MSRP_MIN), MSRP_MIN, MSRP_MAX);
  }
  function polarPoint(angDeg) {
    const a = (angDeg * Math.PI) / 180;
    return { x: DIAL_CX + DIAL_R * Math.cos(a), y: DIAL_CY - DIAL_R * Math.sin(a) };
  }

  function drawDial() {
    const fill = document.getElementById('calcDialFill');
    const knob = document.getElementById('calcDialKnob');
    if (!fill || !knob) return;
    const angle = msrpToAngleDeg(state.msrp);
    const p = polarPoint(angle);

    // dasharray: total arc length ≈ π*r
    const arcLen = Math.PI * DIAL_R;
    const t = (state.msrp - MSRP_MIN) / (MSRP_MAX - MSRP_MIN);
    fill.style.strokeDasharray = arcLen;
    fill.style.strokeDashoffset = arcLen * (1 - t);

    knob.setAttribute('cx', p.x.toFixed(2));
    knob.setAttribute('cy', p.y.toFixed(2));
  }
  function drawTicks() {
    const g = document.getElementById('calcDialTicks');
    if (!g) return;
    let html = '';
    for (let i = 0; i <= 22; i++) {
      const ang = 180 - i * (180 / 22);
      const major = i % 2 === 0;
      const r1 = DIAL_R + 8;
      const r2 = DIAL_R + (major ? 16 : 12);
      const a = (ang * Math.PI) / 180;
      const x1 = DIAL_CX + r1 * Math.cos(a), y1 = DIAL_CY - r1 * Math.sin(a);
      const x2 = DIAL_CX + r2 * Math.cos(a), y2 = DIAL_CY - r2 * Math.sin(a);
      html += `<line class="${major?'major':''}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    g.innerHTML = html;
  }

  // ── Render ──────────────────────────────────────────────
  function render() {
    const r = compute(state);

    const ledger = document.getElementById('calcLedger');
    if (!ledger) return;
    const lblTax = ledger.querySelector('[data-k=taxLabel]');
    if (lblTax) lblTax.textContent = `מיסי קניה (${Math.round(state.tax*100)}%)`;

    countTo(ledger.querySelector('[data-k=msrp]'),    r.msrp,        v => fmtUSD(v));
    countTo(ledger.querySelector('[data-k=tax]'),     r.tax,         v => '+ ' + fmtUSD(v));
    countTo(ledger.querySelector('[data-k=vat]'),     r.vat,         v => '+ ' + fmtUSD(v));
    countTo(ledger.querySelector('[data-k=svc]'),     r.svc,         v => '+ ' + fmtUSD(v));
    // static
    ledger.querySelector('[data-k=ship]').textContent    = '+ $2,000';
    ledger.querySelector('[data-k=customs]').textContent = '+ ₪2,000';
    ledger.querySelector('[data-k=disc]').textContent    = '− $3,000';

    countTo(document.getElementById('calcFinal'),    r.landedNIS,    v => fmtNIS(v));
    countTo(document.getElementById('calcIsrael'),   r.israelNIS,    v => fmtNIS(v));
    countTo(document.getElementById('calcSaveNIS'),  r.saveNIS,      v => fmtNIS(v));
    countTo(document.getElementById('calcSavePct'),  r.savePct*100,  v => Math.round(v) + '%');

    // dial value + sub
    const dv = document.getElementById('calcDialValue');
    const ds = document.getElementById('calcDialSub');
    if (dv) countTo(dv, state.msrp,        v => fmtUSD(v));
    if (ds) countTo(ds, state.msrp * FX,   v => '≈ ' + fmtNIS(v));

    drawDial();
  }

  // ── Wiring ──────────────────────────────────────────────
  function setMsrp(v, snap=false) {
    state.msrp = clamp(Math.round(v / (snap?1000:500)) * (snap?1000:500), MSRP_MIN, MSRP_MAX);
    render();
  }
  function setTax(pct) {
    state.tax = clamp(pct, 0.30, 1.05);
    const v = document.getElementById('calcTaxVal');
    const r = document.getElementById('calcTaxInput');
    if (v) v.textContent = Math.round(state.tax*100) + '%';
    if (r) {
      r.value = Math.round(state.tax*100);
      r.style.setProperty('--p', ((state.tax*100 - r.min) / (r.max - r.min) * 100) + '%');
    }
    render();
  }

  function wireDial() {
    const wrap = document.getElementById('calcDial');
    if (!wrap) return;
    let dragging = false;

    function pointToMsrp(clientX, clientY) {
      const rect = wrap.getBoundingClientRect();
      // map to svg coords (viewBox 300x170)
      const sx = ((clientX - rect.left) / rect.width)  * 300;
      const sy = ((clientY - rect.top)  / rect.height) * 170;
      const dx = sx - DIAL_CX;
      const dy = DIAL_CY - sy;
      let ang = (Math.atan2(dy, dx) * 180) / Math.PI;   // 0..180 over the top semi-circle
      ang = clamp(ang, 0, 180);
      return angleDegToMsrp(ang);
    }

    function onDown(e) {
      dragging = true;
      wrap.classList.add('dragging');
      wrap.setPointerCapture?.(e.pointerId);
      onMove(e);
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      setMsrp(pointToMsrp(e.clientX, e.clientY));
    }
    function onUp(e) {
      dragging = false;
      wrap.classList.remove('dragging');
      try { wrap.releasePointerCapture?.(e.pointerId); } catch (_) {}
      setMsrp(state.msrp, true);   // snap to 1K on release
    }

    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup',   onUp);
    wrap.addEventListener('pointercancel', onUp);

    // wheel
    wrap.addEventListener('wheel', e => {
      e.preventDefault();
      const step = e.shiftKey ? 10000 : 1000;
      setMsrp(state.msrp + (e.deltaY < 0 ? step : -step));
    }, { passive: false });

    // keyboard
    wrap.tabIndex = 0;
    wrap.addEventListener('keydown', e => {
      const step = e.shiftKey ? 10000 : 1000;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight')   { e.preventDefault(); setMsrp(state.msrp + step); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); setMsrp(state.msrp - step); }
      else if (e.key === 'Home') { e.preventDefault(); setMsrp(MSRP_MIN); }
      else if (e.key === 'End')  { e.preventDefault(); setMsrp(MSRP_MAX); }
    });
  }

  function wireSegments() {
    const fuel = document.getElementById('calcFuel');
    fuel?.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      fuel.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.fuel = b.dataset.v;
      state.tax  = TAX_DEFAULT[state.fuel];
      // resize range bounds
      const r = document.getElementById('calcTaxInput');
      if (r) {
        const [mn, mx] = TAX_RANGE[state.fuel];
        r.min = Math.round(mn * 100);
        r.max = Math.round(mx * 100);
      }
      setTax(state.tax);
    }));

    const body = document.getElementById('calcBody');
    body?.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      body.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.body = b.dataset.v;
    }));

    const cond = document.getElementById('calcCond');
    cond?.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      cond.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.cond = b.dataset.v;
    }));

    document.getElementById('calcOptsTog')?.addEventListener('click', () => {
      const o = document.getElementById('calcOpts');
      o.classList.toggle('open');
    });

    const taxTog = document.getElementById('calcTaxTog');
    const slide  = document.getElementById('calcTaxSlide');
    taxTog?.addEventListener('click', () => {
      state.taxOpen = !state.taxOpen;
      slide.classList.toggle('open', state.taxOpen);
    });

    const taxInput = document.getElementById('calcTaxInput');
    taxInput?.addEventListener('input', e => {
      setTax((+e.target.value) / 100);
    });

    document.getElementById('calcCTA')?.addEventListener('click', () => {
      // Filter catalog to current body+fuel, then scroll there.
      try {
        if (typeof window.gitaCatalogFilter === 'function') {
          window.gitaCatalogFilter({ body: state.body, fuel: state.fuel });
        }
      } catch (_) {}
      const cat = document.getElementById('catalog');
      cat?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ── Mount ────────────────────────────────────────────────
  function mount() {
    const host = document.getElementById('calcWidget');
    if (!host) return;
    host.innerHTML = markup();

    drawTicks();
    drawDial();

    // init tax input bounds & default
    const r = document.getElementById('calcTaxInput');
    if (r) {
      const [mn, mx] = TAX_RANGE[state.fuel];
      r.min = Math.round(mn * 100);
      r.max = Math.round(mx * 100);
      r.value = Math.round(state.tax * 100);
    }
    setTax(state.tax);   // also renders

    wireDial();
    wireSegments();

    render();
  }

  window.__GITA_CALC__ = mount;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
