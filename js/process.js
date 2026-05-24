/* ============================================================
   PROCESS TRACKER v2 — Mercedes USA grade
   Interactive timeline · keyboard nav · scroll-snap · pulse
   ============================================================ */

(function(){
  // Step durations and actor mapping (assigned, not from Excel)
  const STEP_ACTOR = {
    1:'CLIENT', 2:'BOTH', 3:'CLIENT', 4:'AutoImports', 5:'AutoImports',
    6:'BOTH',  7:'AutoImports', 8:'AutoImports',  9:'AutoImports',10:'AutoImports',
    11:'BOTH',12:'AutoImports',13:'AutoImports', 14:'AutoImports',15:'CLIENT'
  };
  const ACTOR_LABEL = {
    CLIENT: { he:'אתה',    cls:'is-client', sub:'פעולה שלך' },
    GITA:   { he:'הצוות',  cls:'is-gita',   sub:'אנחנו מטפלים' },
    BOTH:   { he:'יחד',     cls:'is-gita',   sub:'שיתוף פעולה' }
  };
  const STEP_ETA = {
    1:'דקות',2:'בכל עת',3:'10 דקות',4:'48–72 שעות',5:'~72 שעות',
    6:'24 שעות',7:'מיידי',8:'3–5 ימים',9:'~38 ימים',10:'5–7 ימים',
    11:'3–5 ימים',12:'~14 ימים',13:'5–7 ימים',14:'1–2 ימים',15:'30 דקות'
  };
  const STEP_DOCS = {
    1:['קונפיגורציה','הערכת מחיר ראשונית'],
    2:['שיחת ייעוץ','שאלות יבוא'],
    3:['רישיון נהיגה','תעודת זהות','מקדמה ₪500'],
    4:['CARFAX','איתור מ-3+ שותפים'],
    5:['הצעה מלאה','VIN','ציר זמן'],
    6:['חוזה רכישה','אישור מימון'],
    7:['Title','אישור רכישה'],
    8:['בדיקת מכון מורשה','דו"ח טכני'],
    9:['Bill of Lading','ביטוח טרנזיט ימי'],
    10:['טופס 21','אישור יבואן','רישיון יבוא'],
    11:['חישוב מסים','דרישת תשלום מהמכס'],
    12:['בדיקת סטנדרטיזציה','מד מהירות מטרי'],
    13:['רישיון רכב','לוחיות'],
    14:['טסט (לרכבים מעל 3 שנים)'],
    15:['מפתחות','הצעת ביטוח תחרותית']
  };
  const STEP_BACKSTAGE = {
    1: 'המחשבון שלנו רץ ברקע על מס קנייה, מע״מ ושילוח. אתה רואה את התוצאה — לא את החישוב.',
    2: 'נציג בכיר ממתין על הקו. כל שיחה מוקלטת ומתועדת לשרשרת ראיות.',
    3: 'המקדמה נסלקת דרך חשבון נאמנות נפרד. כסף שלך, מוגן.',
    4: 'אלגוריתם פנימי סורק 4,200 דילרים ברחבי ארה״ב כל 6 שעות.',
    5: 'בנייה אוטומטית של הצעה מלאה בפורטל אישי מאובטח SSL.',
    6: 'אינטגרציה ישירה עם מערכת מימון של בנק מרכנתיל ויהב — תשובה תוך 90 שניות.',
    7: 'הטיטל מועבר לחשבון נאמנות אמריקאי בשמך. אנחנו רק עדים.',
    8: 'הנציג שלנו ב-NJ/CA/FL אוסף ומעביר למכון מורשה (Carmax/AAA).',
    9: 'שיגור ב-RoRo דרך Wallenius-Wilhelmsen / Höegh — אותם מובילים של המרצדס.',
    10: 'עמיל מכס מורשה מגיש דיגיטלית מול נמל אשדוד/חיפה.',
    11: 'תיק מס נפתח ישירות מול ארנונה — אתה רואה את החשבון לפני שהוא נסגר.',
    12: 'יום אחד במגרש משרד התחבורה. אנחנו לוקחים את הרכב, אתה לא.',
    13: 'הרישוי על שמך מהדקה הראשונה. הרכב יוצא מהמשרד עם לוחית כחולה.',
    14: 'אם הרכב חדש (עד 3 שנים) — דילוג. אם משומש — מסירה לבדיקת רכב.',
    15: 'מסירה במוסך הרשמי. אתה חותם. הוא שלך.'
  };

  // ---------------- DOM building ----------------
  const root = document.getElementById('processV2');
  if(!root) return;

  // Header + progress + timeline + stage + phase rail
  root.innerHTML = `
    <div class="pv2-wrap">
      <div class="pv2-head">
        <div>
          <div class="pv2-eyebrow">Your Journey · 15 Steps</div>
          <h2 class="pv2-title">תהליך אחד.<br>
            <span class="accent">חוויה בלי פשרות.</span>
          </h2>
        </div>
        <p class="pv2-sub">חמש פאזות, חמש־עשרה תחנות, אחריות מלאה לאורך הדרך.
          בנינו עבורך מסלול שקוף ברמה של יצרני יוקרה — אתה תמיד יודע איפה הרכב שלך, מי מטפל בו, ומה השלב הבא.</p>
      </div>

      <div class="pv2-progress">
        <span class="pv2-prog-label">Progress</span>
        <div class="pv2-prog-bar"><div class="pv2-prog-fill" id="pv2Fill"></div></div>
        <div class="pv2-prog-stat"><span class="num" id="pv2Cur">01</span>/ 15</div>
      </div>

      <div class="pv2-timeline" id="pv2Timeline" data-progress style="--p:0%">
        <div class="pv2-rail"></div>
        <div class="pv2-vehicle" id="pv2Vehicle">
          <svg viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f5e3b3"/>
                <stop offset="100%" stop-color="#b8975a"/>
              </linearGradient>
            </defs>
            <!-- Mercedes-style silhouette -->
            <path d="M6 22 L12 14 Q14 11 18 11 L52 11 Q56 11 60 14 L70 22 L74 22 Q76 22 76 24 L76 26 Q76 27 75 27 L68 27 Q67 24 64 24 Q61 24 60 27 L24 27 Q23 24 20 24 Q17 24 16 27 L9 27 Q8 27 8 26 L8 24 Q8 22 6 22 Z"
              fill="url(#vg)" stroke="#f0d28f" stroke-width=".5"/>
            <circle cx="20" cy="26" r="3.2" fill="#0a0b0d" stroke="#d9b977" stroke-width=".5"/>
            <circle cx="64" cy="26" r="3.2" fill="#0a0b0d" stroke="#d9b977" stroke-width=".5"/>
            <path d="M22 14 L30 12 L30 18 L22 18 Z" fill="rgba(10,11,13,.6)"/>
            <path d="M34 12 L52 12 L52 18 L34 18 Z" fill="rgba(10,11,13,.6)"/>
          </svg>
        </div>
        <div class="pv2-nodes" id="pv2Nodes"></div>
      </div>

      <div class="pv2-stage">
        <div class="pv2-stage-main" id="pv2Stage"></div>
        <aside class="pv2-phases" id="pv2Phases"></aside>
      </div>

      <div class="pv2-hint">
        <span>נווט עם</span>
        <kbd>←</kbd><kbd>→</kbd>
        <span>או לחץ על כל שלב בציר</span>
      </div>
    </div>
  `;

  const nodesEl   = document.getElementById('pv2Nodes');
  const phasesEl  = document.getElementById('pv2Phases');
  const stageEl   = document.getElementById('pv2Stage');
  const fillEl    = document.getElementById('pv2Fill');
  const curEl     = document.getElementById('pv2Cur');
  const vehicleEl = document.getElementById('pv2Vehicle');
  const timeline  = document.getElementById('pv2Timeline');

  // Build nodes
  PROCESS_STEPS.forEach((s, i) => {
    const idx = i + 1;
    const n = document.createElement('button');
    n.className = 'pv2-node';
    n.setAttribute('data-step', idx);
    n.setAttribute('aria-label', `שלב ${idx}: ${s.title}`);
    n.innerHTML = `
      <span class="pv2-node-phase">P${s.phase}</span>
      <span class="pv2-node-num">${String(idx).padStart(2,'0')}</span>
      <span class="pv2-dot"></span>
      <span class="pv2-node-label">${s.label}</span>
    `;
    n.addEventListener('click', ()=> setActive(idx));
    nodesEl.appendChild(n);
  });

  // Build phases
  PHASES.forEach(p => {
    const ph = document.createElement('div');
    ph.className = 'pv2-phase';
    ph.setAttribute('data-phase', p.num);
    ph.innerHTML = `
      <div class="pv2-phase-num">PHASE 0${p.num}</div>
      <div class="pv2-phase-name">${p.name}</div>
      <div class="pv2-phase-desc">${p.desc}</div>
      <div class="pv2-phase-range">${p.range}</div>
    `;
    phasesEl.appendChild(ph);
  });

  // Render stage detail for a step
  function renderStage(idx) {
    const s = PROCESS_STEPS[idx-1];
    const actor = STEP_ACTOR[idx];
    const a = ACTOR_LABEL[actor];
    const docs = STEP_DOCS[idx] || [];
    const eta = STEP_ETA[idx] || '—';
    const back = STEP_BACKSTAGE[idx] || '';

    stageEl.innerHTML = `
      <div class="pv2-stage-num">${String(idx).padStart(2,'0')}</div>
      <div class="pv2-stage-meta">
        <span class="pv2-pill ${a.cls}"><span class="dot"></span>${a.he} · ${a.sub}</span>
        <span class="pv2-pill"><span class="dot"></span>זמן · ${eta}</span>
        <span class="pv2-pill"><span class="dot"></span>פאזה ${s.phase} · ${PHASES[s.phase-1].name}</span>
      </div>
      <h3 class="pv2-stage-title">${s.title}</h3>
      <p class="pv2-stage-desc">${s.desc}</p>
      <div class="pv2-stage-details">
        <div class="pv2-detail">
          <h5>מה נדרש בשלב הזה</h5>
          <div class="chips">
            ${docs.map(d => `<span class="chip">${d}</span>`).join('')}
          </div>
        </div>
        <div class="pv2-detail">
          <h5>מה קורה אצלנו ברקע</h5>
          <p>${back}</p>
        </div>
      </div>
      <div class="pv2-nav">
        <button class="pv2-arrow" id="pv2Prev" aria-label="שלב קודם">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        </button>
        <button class="pv2-arrow" id="pv2Next" aria-label="שלב הבא">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>
      </div>
    `;
    document.getElementById('pv2Prev').addEventListener('click', ()=> setActive(Math.max(1, current-1)));
    document.getElementById('pv2Next').addEventListener('click', ()=> setActive(Math.min(15, current+1)));
  }

  let current = 1;
  function setActive(idx) {
    current = idx;
    const total = PROCESS_STEPS.length;
    const pct = ((idx - 1) / (total - 1)) * 100;
    const fillPct = (idx / total) * 100;

    // Nodes
    nodesEl.querySelectorAll('.pv2-node').forEach((n, i) => {
      n.classList.toggle('is-active', i+1 === idx);
      n.classList.toggle('is-done', i+1 < idx);
    });

    // Phases
    const activePhase = PROCESS_STEPS[idx-1].phase;
    phasesEl.querySelectorAll('.pv2-phase').forEach((p, i) => {
      p.classList.toggle('is-active', i+1 === activePhase);
      p.classList.toggle('is-done', i+1 < activePhase);
    });

    // Progress
    fillEl.style.width = fillPct + '%';
    curEl.textContent = String(idx).padStart(2,'0');
    timeline.style.setProperty('--p', pct + '%');

    // Vehicle position — snap to active node
    const node = nodesEl.querySelector(`[data-step="${idx}"]`);
    if (node) {
      const rect = node.getBoundingClientRect();
      const railRect = timeline.getBoundingClientRect();
      const nodeCenter = rect.left + rect.width/2 - railRect.left;
      vehicleEl.style.left = nodeCenter + 'px';
      // Scroll node into view smoothly
      node.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    }

    renderStage(idx);
  }

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (!isInViewport(root)) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      // RTL: right arrow goes back, left goes forward
      const dir = e.key === 'ArrowLeft' ? +1 : -1;
      setActive(Math.max(1, Math.min(15, current + dir)));
    }
  });

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  // Auto-advance on scroll into view (first time)
  let initialized = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !initialized) {
        initialized = true;
        setActive(1);
        // Subtle reveal: pulse forward over the first 3 steps
        let p = 1;
        const tick = setInterval(()=>{
          p++;
          if (p > 3) { clearInterval(tick); return; }
          // Don't override user choice
          if (current === p-1) setActive(p);
        }, 1400);
      }
    });
  }, { threshold: .25 });
  obs.observe(root);

  // Recompute vehicle position on resize
  window.addEventListener('resize', () => {
    const node = nodesEl.querySelector(`[data-step="${current}"]`);
    if (node) {
      const rect = node.getBoundingClientRect();
      const railRect = timeline.getBoundingClientRect();
      vehicleEl.style.left = (rect.left + rect.width/2 - railRect.left) + 'px';
    }
  });
})();
