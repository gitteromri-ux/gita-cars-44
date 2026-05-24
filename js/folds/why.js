/* =====================================================================
 * FOLD 2 — WHY BUY WITH US · AutoImports.co.il
 * Injects the entire <section id="why"> into #why-mount.
 * Vanilla JS + GSAP/ScrollTrigger (already loaded globally).
 * Builds: A) Headline, B) Pain cards, C) Comparison chart, D) Donut + CTA.
 * ===================================================================== */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // DATA — verbatim from MESSAGING_BIBLE / brief. No invented numbers.
  // ---------------------------------------------------------------------
  // Solution columns — 3 ways to buy the same car
  const SOLUTIONS = [
    { key:'official',  name:'קנייה בישראל', sub:'יבואן רשמי',     emoji:'🚗', tone:'dark'   },
    { key:'parallel',  name:'יבוא מקביל',   sub:'סוחר-יד-2',       emoji:'📦', tone:'mid'    },
    { key:'autoimports', name:'AutoImports', sub:'יבוא אישי דרכנו', emoji:'⭐', tone:'cobalt', badge:'מומלץ' },
  ];

  // 14 parameters, each with value+marker per solution.
  // marker: 'ok' ✅ | 'warn' ⚠️ | 'bad' ❌
  const PARAMS = [
    { p:'מחיר G63 לדוגמה',
      official:{ v:'₪2.1M',                m:'bad'  },
      parallel:{ v:'₪1.55M',               m:'warn' },
      autoimports:{ v:'₪1.18M',            m:'ok'   } },
    { p:'חיסכון מול יבואן',
      official:{ v:'0%',                   m:'bad'  },
      parallel:{ v:'~26%',                 m:'warn' },
      autoimports:{ v:'עד 44%',            m:'ok'   } },
    { p:'שקיפות עלויות',
      official:{ v:'חלקית',                m:'warn' },
      parallel:{ v:'סגורה',                m:'bad'  },
      autoimports:{ v:'מלאה, פירוט שקל-שקל', m:'ok' } },
    { p:'בחירת דגם / צבע / גימור',
      official:{ v:'מה שיש במלאי',         m:'warn' },
      parallel:{ v:'מה שהסוחר השיג',       m:'bad'  },
      autoimports:{ v:'אתה בוחר — סורקים את כל ארה״ב', m:'ok' } },
    { p:'רכב חדש (0 ק״מ)',
      official:{ v:'זמין',                 m:'ok'   },
      parallel:{ v:'לא תמיד',              m:'warn' },
      autoimports:{ v:'זמין',              m:'ok'   } },
    { p:'רכב משומש (יד-2)',
      official:{ v:'רק שלהם',              m:'bad'  },
      parallel:{ v:'זמין',                 m:'ok'   },
      autoimports:{ v:'זמין + Carfax + PPI', m:'ok' } },
    { p:'זמן עד הבית',
      official:{ v:'מיידי',                m:'ok'   },
      parallel:{ v:'2-4 חודשים',           m:'warn' },
      autoimports:{ v:'8-12 שבועות',       m:'ok'   } },
    { p:'אחריות יצרן רשמית',
      official:{ v:'יש',                   m:'ok'   },
      parallel:{ v:'ספק',                  m:'warn' },
      autoimports:{ v:'ארה״ב=עולמית · מרצדס/BMW 24 חודש דרכנו', m:'ok' } },
    { p:'רישום על שמך מהיום הראשון',
      official:{ v:'כן',                   m:'ok'   },
      parallel:{ v:'לרוב לא',              m:'bad'  },
      autoimports:{ v:'כן — אתה המייבא החוקי', m:'ok' } },
    { p:'רווח-יבואן בתוך המחיר',
      official:{ v:'~35%',                 m:'bad'  },
      parallel:{ v:'~15%',                 m:'warn' },
      autoimports:{ v:'0%',                m:'ok'   } },
    { p:'עמלת שירות',
      official:{ v:'אין (סמוי)',           m:'bad'  },
      parallel:{ v:'אין (סמוי)',           m:'bad'  },
      autoimports:{ v:'5% גלויה',          m:'ok'   } },
    { p:'מקדמה לפתיחת תיק',
      official:{ v:'₪10K-₪50K',            m:'bad'  },
      parallel:{ v:'₪25K-₪80K',            m:'bad'  },
      autoimports:{ v:'₪500',              m:'ok'   } },
    { p:'מימון',
      official:{ v:'רק שלהם',              m:'warn' },
      parallel:{ v:'סוחר',                 m:'warn' },
      autoimports:{ v:'בנק + שותף-מימון',  m:'ok'   } },
    { p:'שירות אחרי-מכירה',
      official:{ v:'סוכנות',               m:'ok'   },
      parallel:{ v:'ספק',                  m:'warn' },
      autoimports:{ v:'מוסכים מורשים בארץ',m:'ok'   } },
  ];

  const DONUT = [
    { key:'importer', pct:35, color:'#FF4D6D', label:'רווח-יבואן', strike:true },
    { key:'taxes',    pct:40, color:'#5A6985', label:'מיסים' },
    { key:'vat',      pct:18, color:'#8896B5', label:'מע״מ' },
    { key:'ship',     pct: 5, color:'#3E4861', label:'שילוח + סטנדרטיזציה' },
    { key:'other',    pct: 2, color:'#2A3147', label:'אחר' },
  ];

  // ---------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------
  const fmtM  = v => `₪${v.toFixed(2)}M`;
  const fmtK  = v => `₪${v}K`;
  const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></svg>`;

  // ---------------------------------------------------------------------
  // BLOCK A — Headline
  // ---------------------------------------------------------------------
  function buildA(){
    return `
      <div class="why-A">
        <span class="why-A__eyebrow">למה דווקא AutoImports</span>
        <h2 class="why-A__h1">
          <span class="ln">המחיר בישראל</span>
          <span class="ln red">לא הגיוני.</span>
          <span class="ln cobalt">ככה אנחנו חותכים אותו.</span>
        </h2>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // BLOCK B — Pain cards
  // ---------------------------------------------------------------------
  function buildB(){
    return `
      <div class="why-B" role="list">
        <article class="why-B__card is-red" role="listitem">
          <span class="why-B__tag">ישראל</span>
          <p class="why-B__num">₪2.1M</p>
          <p class="why-B__label">מחיר Mercedes G63 בישראל</p>
        </article>
        <article class="why-B__card is-grey" role="listitem">
          <span class="why-B__tag">ארה״ב</span>
          <p class="why-B__num">$185K</p>
          <p class="why-B__label">אותו רכב, אותו שנתון, בארה״ב (≈ ₪542K)</p>
        </article>
        <article class="why-B__card is-cobalt" role="listitem">
          <span class="why-B__tag">AutoImports</span>
          <p class="why-B__num">₪915K</p>
          <p class="why-B__label">החיסכון שלך עם AutoImports</p>
        </article>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // BLOCK C — Checklist of 3 buying solutions (Monday/ClickUp style)
  // ---------------------------------------------------------------------
  const MARKER = {
    ok:   `<svg class="why-C__mk why-C__mk--ok"  viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(61,220,151,.14)"/><path d="m7.5 12.5 3 3 6-7" fill="none" stroke="#3DDC97" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warn: `<svg class="why-C__mk why-C__mk--warn" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(232,179,65,.16)"/><path d="M12 7v6" stroke="#E8B341" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17" r="1.3" fill="#E8B341"/></svg>`,
    bad:  `<svg class="why-C__mk why-C__mk--bad"  viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(255,77,109,.14)"/><path d="m8 8 8 8M16 8l-8 8" stroke="#FF4D6D" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  };

  function cell(obj){
    return `<div class="why-C__cell why-C__cell--${obj.m}">
      ${MARKER[obj.m]}
      <span class="why-C__cell-v">${obj.v}</span>
    </div>`;
  }

  function buildC(){
    // Header row — solution names
    const headerCells = SOLUTIONS.map(s => `
      <div class="why-C__head-cell why-C__head-cell--${s.tone}">
        ${s.badge ? `<span class="why-C__badge">${s.badge}</span>` : ''}
        <span class="why-C__emoji" aria-hidden="true">${s.emoji}</span>
        <span class="why-C__solname">${s.name}</span>
        <span class="why-C__solsub">${s.sub}</span>
      </div>`).join('');

    // Desktop rows (one row per parameter, 4 columns: param + 3 solutions)
    const rowsHtml = PARAMS.map((row, i) => `
      <div class="why-C__row" data-i="${i}">
        <div class="why-C__param">${row.p}</div>
        ${cell(row.official)}
        ${cell(row.parallel)}
        <div class="why-C__cell why-C__cell--${row.autoimports.m} why-C__cell--ai">
          ${MARKER[row.autoimports.m]}
          <span class="why-C__cell-v">${row.autoimports.v}</span>
        </div>
      </div>`).join('');

    // Mobile accordion cards (one card per solution)
    const mobileCards = SOLUTIONS.map((s, idx) => {
      const rows = PARAMS.map(p => `
        <li class="why-C__macc-row">
          <span class="why-C__macc-p">${p.p}</span>
          <span class="why-C__macc-v why-C__cell--${p[s.key].m}">
            ${MARKER[p[s.key].m]}
            <span>${p[s.key].v}</span>
          </span>
        </li>`).join('');
      const isAI = s.key === 'autoimports';
      return `
        <details class="why-C__macc why-C__macc--${s.tone}" ${isAI ? 'open' : ''}>
          <summary class="why-C__macc-sum">
            ${s.badge ? `<span class="why-C__badge">${s.badge}</span>` : ''}
            <span class="why-C__emoji" aria-hidden="true">${s.emoji}</span>
            <span class="why-C__macc-name">
              <strong>${s.name}</strong>
              <em>${s.sub}</em>
            </span>
            <svg class="why-C__macc-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </summary>
          <ul class="why-C__macc-list">${rows}</ul>
        </details>`;
    }).join('');

    return `
      <div class="why-C">
        <div class="why-C__head">
          <h3 class="why-C__title">איך נראית הקנייה? השוואת 3 פתרונות.</h3>
          <p class="why-C__sub">אותו רכב, 3 דרכים לקנות אותו. ככה זה נראה בעיניים שלך:</p>
        </div>

        <div class="why-C__grid" role="table" aria-label="השוואת 3 פתרונות קנייה">
          <div class="why-C__header-row" role="row">
            <div class="why-C__head-cell why-C__head-cell--label" aria-hidden="true"></div>
            ${headerCells}
          </div>
          ${rowsHtml}
        </div>

        <div class="why-C__mobile" aria-hidden="false">
          ${mobileCards}
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // BLOCK D — Donut + copy + CTA
  // ---------------------------------------------------------------------
  function buildD(){
    const R = 80;
    const C = 2 * Math.PI * R; // ~502.65
    let offset = 0;
    const segs = DONUT.map(d => {
      const len = (d.pct / 100) * C;
      const dasharray = `${len} ${C - len}`;
      const dashoffset = -offset;
      offset += len;
      return `<circle class="seg" data-seg="${d.key}" r="${R}" cx="120" cy="120"
        stroke="${d.color}"
        stroke-dasharray="0 ${C}"
        data-final="${dasharray}"
        stroke-linecap="butt"></circle>`;
    }).join('');

    const legend = DONUT.map(d => `
      <li>
        <span class="sw" style="background:${d.color}"></span>
        <span class="pct">${d.pct}%</span>
        <span class="${d.strike ? 'lbl-strike' : ''}">${d.label}${d.strike ? ' · זה מה שאנחנו חותכים' : ''}</span>
      </li>`).join('');

    return `
      <div class="why-D">
        <div class="why-D__copy">
          <h3 class="why-D__title">לאן הולכים ה-₪915K בישראל?</h3>
          <div class="why-D__lines">
            <span class="ln-red">0% רווח-יבואן.</span>
            <span class="ln-cobalt">5% עמלת שירות שקופה.</span>
            <span class="ln-ink">זה ההפרש.</span>
          </div>
          <ul class="why-D__legend">${legend}</ul>
          <a href="#calc" class="why-D__cta">
            חשב את החיסכון שלי
            ${arrow}
          </a>
        </div>
        <div class="why-D__chart" aria-hidden="true">
          <svg viewBox="0 0 240 240" role="img" aria-label="פירוק עלויות יבוא רכב לישראל">
            <circle class="seg seg-track" r="${R}" cx="120" cy="120" stroke-dasharray="${C} 0"></circle>
            ${segs}
          </svg>
          <div class="why-D__center">
            <div class="why-D__center-num">35%</div>
            <div class="why-D__center-lbl">רווח-יבואן · נחתך</div>
          </div>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // BUILD + INJECT
  // ---------------------------------------------------------------------
  function buildHTML(){
    return `
      <section id="why" class="why-fold" aria-labelledby="why-headline">
        <div class="why-wrap">
          ${buildA()}
          ${buildB()}
          ${buildC()}
          ${buildD()}
        </div>
      </section>`;
  }

  function mount(){
    const host = document.querySelector('#why-mount');
    if (!host) {
      console.warn('[why] #why-mount not found — aborting');
      return;
    }
    host.innerHTML = buildHTML();
    // Give the headline an id for aria
    const h = host.querySelector('.why-A__h1');
    if (h) h.id = 'why-headline';
    animate();
  }

  // ---------------------------------------------------------------------
  // ANIMATIONS — ScrollTrigger when available, fallback to IO.
  // ---------------------------------------------------------------------
  function animate(){
    const section = document.querySelector('#why.why-fold');
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rows — fall in one after another (top → bottom), markers pop with stagger
    const headerRow = section.querySelector('.why-C__header-row');
    const rows = section.querySelectorAll('.why-C__row');
    const playRows = () => {
      if (headerRow) headerRow.classList.add('is-in');
      rows.forEach((row, i) => {
        setTimeout(() => {
          row.classList.add('is-in');
        }, reduced ? 0 : 120 + i * 75);
      });
    };

    // Donut — animate dasharray from "0 C" to its final value
    const segs = section.querySelectorAll('.why-D__chart .seg[data-final]');
    const playDonut = () => {
      segs.forEach((seg, i) => {
        const final = seg.getAttribute('data-final');
        if (!final) return;
        setTimeout(() => {
          seg.style.transition = 'stroke-dasharray 1.2s cubic-bezier(.2,.7,.2,1)';
          seg.setAttribute('stroke-dasharray', final);
        }, reduced ? 0 : 200 + i * 140);
      });
    };

    // GSAP path if available
    if (window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);

      // Headline reveal
      const h1 = section.querySelector('.why-A__h1');
      if (h1){
        const lines = h1.querySelectorAll('.ln');
        gsap.set(lines, { yPercent: 110, opacity: 0 });
        ScrollTrigger.create({
          trigger: h1,
          start: 'top 82%',
          once: true,
          onEnter: () => gsap.to(lines, {
            yPercent: 0, opacity: 1, duration: .8, stagger: .12, ease: 'power3.out'
          })
        });
      }

      // Pain cards
      const cards = section.querySelectorAll('.why-B__card');
      gsap.set(cards, { y: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: section.querySelector('.why-B'),
        start: 'top 78%',
        once: true,
        onEnter: () => gsap.to(cards, {
          y: 0, opacity: 1, duration: .7, stagger: .12, ease: 'power3.out'
        })
      });

      // Comparison rows
      ScrollTrigger.create({
        trigger: section.querySelector('.why-C__grid'),
        start: 'top 80%',
        once: true,
        onEnter: playRows,
      });

      // Donut + copy
      const dLines = section.querySelectorAll('.why-D__lines > span');
      gsap.set(dLines, { y: 24, opacity: 0 });
      ScrollTrigger.create({
        trigger: section.querySelector('.why-D'),
        start: 'top 72%',
        once: true,
        onEnter: () => {
          playDonut();
          gsap.to(dLines, { y: 0, opacity: 1, duration: .7, stagger: .12, ease: 'power3.out', delay: .2 });
        }
      });
    } else {
      // Fallback — IntersectionObserver
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const t = e.target;
          if (t.classList.contains('why-C__grid')) playRows();
          if (t.classList.contains('why-D__chart')) playDonut();
          io.unobserve(t);
        });
      }, { rootMargin: '0px 0px -15% 0px' });
      const grid  = section.querySelector('.why-C__grid');
      const chart = section.querySelector('.why-D__chart');
      if (grid) io.observe(grid);
      if (chart) io.observe(chart);
    }
  }

  // ---------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once:true });
  } else {
    mount();
  }

  // expose for debugging
  window.__AI_WHY__ = { mount, SOLUTIONS, PARAMS, DONUT };
})();
