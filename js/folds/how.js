/* =====================================================================
 * FOLD 3 — HOW IT WORKS · Horizontal Pinned Scrollytelling
 * GSAP + ScrollTrigger. Hebrew RTL. 6 steps. Step 03 = value moment.
 * Boots on DOMContentLoaded. Exports window.__GITA_HOW__().
 * ===================================================================== */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // DATA — 6 compressed steps. Verbatim where possible (Excel "תהליך מוצע").
  // ---------------------------------------------------------------------
  const STEPS = [
    {
      n: '01',
      name: 'בחירה',
      desc: 'אתם נכנסים, בוחרים דגם, צבע, רמת גימור — מקבלים אומדן ראשוני.',
      time: '60 שניות',
      video: './videos/ignition-button.mp4',
      vlabel: 'CHOICE',
    },
    {
      n: '02',
      name: 'פתיחת תיק',
      desc: '₪500 פתיחת תיק — חוזר אם אין התאמה. פורטל אישי נפתח.',
      time: '5 דקות',
      video: './videos/happy-dealership.mp4',
      vlabel: 'OPEN FILE',
    },
    {
      n: '03',
      name: 'תחרות',
      desc: 'אנחנו רצים תחרות בין השותפים שלנו ברחבי ארה״ב, ומגישים את ההצעה הזוכה תוך 72 שעות.',
      time: '72 שעות',
      video: './videos/fast-sports-rural.mp4',
      vlabel: 'COMPETITION',
      isValueMoment: true,
    },
    {
      n: '04',
      name: 'בדיקה',
      desc: 'בדיקת 200 נקודות בארה״ב — סרטוני 4K לפורטל. דו״ח Carfax מלא.',
      time: '5 ימים',
      video: './videos/garage-lift.mp4',
      vlabel: 'INSPECTION',
    },
    {
      n: '05',
      name: 'שילוח',
      desc: 'RoRo או קונטיינר. ביטוח מלא. מעקב חי בפורטל. ממוצע 38 ימי שיט.',
      time: '38 ימים',
      video: './videos/drone-roro-shipping.mp4',
      vlabel: 'SHIPPING',
    },
    {
      n: '06',
      name: 'מסירה',
      desc: 'שחרור מהמכס באשדוד, סטנדרטיזציה, רישוי — ומסירת מפתחות.',
      time: '7-10 ימי עסקים',
      video: './videos/container-dock-israel.mp4',
      vlabel: 'DELIVERY',
      isFinal: true,
    },
  ];

  // Small SVG clock icon for time pills
  const CLOCK_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;

  // ---------------------------------------------------------------------
  // HTML BUILDER
  // ---------------------------------------------------------------------
  function buildHTML() {
    const panels = STEPS.map((s, i) => {
      const isFirst = i === 0;
      const tag = s.isValueMoment
        ? `<span class="hpanel-tag">לב המודל · The Value Moment</span>` : '';
      const finalBadge = s.isFinal
        ? `<div class="hpanel-finalbadge">סך הכל: <strong>8-12 שבועות</strong> מהפנייה ועד המפתח.</div>` : '';
      const finalClass = s.isFinal ? ' is-final' : '';

      return `
        <article class="hpanel${finalClass}" data-step="${i + 1}">
          <div class="hpanel-text">
            ${tag}
            <div class="hpanel-num" aria-hidden="true">${s.n}</div>
            <h3 class="hpanel-name">${s.name}</h3>
            <p class="hpanel-desc">${s.desc}</p>
            <span class="hpanel-pill" aria-label="זמן: ${s.time}">
              ${CLOCK_SVG}
              <span>${s.time}</span>
            </span>
            ${finalBadge}
          </div>
          <div class="hpanel-media">
            <span class="corner c-tl"></span><span class="corner c-tr"></span>
            <span class="corner c-bl"></span><span class="corner c-br"></span>
            <span class="vlabel">${s.vlabel} · STEP ${s.n}</span>
            <video
              muted autoplay loop playsinline webkit-playsinline
              preload="${isFirst ? 'auto' : 'metadata'}"
              src="${s.video}"
              aria-hidden="true"></video>
          </div>
        </article>
      `;
    }).join('');

    const dots = STEPS.map((s, i) =>
      `<button class="hrail-dot" data-i="${i}" data-n="${s.n}" aria-label="עבור לשלב ${s.n} — ${s.name}"></button>`
    ).join('');

    return `
      <div class="how-intro">
        <div class="eyebrow">תהליך · How it works</div>
        <h2>מהקליק <span class="accent">למפתחות</span> —<br>שישה שלבים. שקיפות מלאה.</h2>
        <p>בלי תיווך מיותר. בלי מחיר נסתר. שישה צעדים מסונכרנים בפורטל אישי — מהבחירה הראשונית ועד שחרור הרכב מהמכס באשדוד.</p>
      </div>

      <div class="htrack-stage">
        <div class="htrack" id="howTrack">
          ${panels}
        </div>

        <div class="hrail" aria-hidden="true">
          <div class="hrail-line"></div>
          <div class="hrail-fill" id="howRailFill"></div>
          ${dots}
        </div>

        <div class="how-cta-row">
          <button class="btn-30steps" id="open30Steps" type="button">
            <span>ראה את כל 30 שלבי הרגולציה</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------
  // MOTION BOOTSTRAP
  // ---------------------------------------------------------------------
  function boot() {
    const section = document.getElementById('how');
    if (!section) return;

    // Inject our CSS link once
    if (!document.querySelector('link[data-fold="how"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './css/folds/how.css';
      link.dataset.fold = 'how';
      document.head.appendChild(link);
    }

    // Replace innerHTML
    section.innerHTML = buildHTML();

    // Reconnect the 30-step modal trigger (it's used elsewhere via openReg30)
    const cta = section.querySelector('#open30Steps');
    if (cta) {
      cta.addEventListener('click', () => {
        const modal = document.getElementById('reg30Modal');
        if (modal) {
          modal.classList.add('open');
          modal.setAttribute('aria-hidden', 'false');
        } else if (typeof window.openReg30 === 'function') {
          window.openReg30();
        }
      });
    }

    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || reduced || !window.gsap || !window.ScrollTrigger) {
      // Mobile / no-GSAP fallback: simple IntersectionObserver to toggle .is-active
      const panels = section.querySelectorAll('.hpanel');
      const railFill = section.querySelector('#howRailFill');
      const dots = section.querySelectorAll('.hrail-dot');
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            panels.forEach((p) => p.classList.remove('is-active'));
            e.target.classList.add('is-active');
            const idx = parseInt(e.target.dataset.step, 10) - 1;
            dots.forEach((d, i) => d.classList.toggle('is-on', i <= idx));
            if (railFill) railFill.style.width = ((idx + 1) / panels.length * 100) + '%';
          }
        });
      }, { threshold: [0, 0.4, 0.7, 1] });
      panels.forEach((p) => io.observe(p));
      // Activate first
      if (panels[0]) panels[0].classList.add('is-active');
      return;
    }

    // --- Desktop: GSAP ScrollTrigger horizontal pinned scroll ---
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    const track = section.querySelector('#howTrack');
    const panels = section.querySelectorAll('.hpanel');
    const dots = section.querySelectorAll('.hrail-dot');
    const railFill = section.querySelector('#howRailFill');
    const stage = section.querySelector('.htrack-stage');

    // Activate first panel by default
    panels[0] && panels[0].classList.add('is-active');

    // Horizontal scroll tween
    const hScroll = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Rail fill follows progress
          if (railFill) railFill.style.width = (progress * 100) + '%';
          // Active panel by progress
          const idx = Math.min(panels.length - 1, Math.floor(progress * panels.length + 0.0001));
          panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
          dots.forEach((d, i) => d.classList.toggle('is-on', i <= idx));
        },
      },
    });

    // Per-panel number reveal — fires when each panel enters horizontally.
    // Because the section is pinned vertically, we use individual ScrollTriggers
    // attached to the horizontal scroll using `containerAnimation`.
    panels.forEach((panel) => {
      const num = panel.querySelector('.hpanel-num');
      const name = panel.querySelector('.hpanel-name');
      const desc = panel.querySelector('.hpanel-desc');
      const pill = panel.querySelector('.hpanel-pill');
      const media = panel.querySelector('.hpanel-media');

      // Initial state
      gsap.set([num, name, desc, pill], { y: 60, opacity: 0 });
      gsap.set(num, { scale: 0.9, y: 80 });
      gsap.set(media, { opacity: 0.5, scale: 0.92 });

      ST.create({
        trigger: panel,
        containerAnimation: hScroll,
        start: 'left 75%',
        end:   'right 25%',
        onEnter: () => animateIn(panel, { num, name, desc, pill, media }),
        onEnterBack: () => animateIn(panel, { num, name, desc, pill, media }),
      });
    });

    function animateIn(panel, els) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(els.media, { opacity: 1, scale: 1, duration: 0.9 }, 0)
        .to(els.num,   { y: 0, opacity: 1, scale: 1, duration: 1.0 }, 0.05)
        .to(els.name,  { y: 0, opacity: 1, duration: 0.7 }, 0.2)
        .to(els.desc,  { y: 0, opacity: 1, duration: 0.7 }, 0.3)
        .to(els.pill,  { y: 0, opacity: 1, duration: 0.6 }, 0.4);
    }

    // Dot navigation — click any dot to jump to that panel
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const st = hScroll.scrollTrigger;
        if (!st) return;
        const targetProgress = i / (panels.length - 1);
        const scrollY = st.start + targetProgress * (st.end - st.start);
        window.scrollTo({ top: scrollY, behavior: 'smooth' });
      });
    });

    // Refresh on font load / resize
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ST.refresh());
    }
  }

  // Public re-init hook
  window.__GITA_HOW__ = boot;

  // Auto-run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    // Run on next frame so other scripts settle
    requestAnimationFrame(boot);
  }
})();
