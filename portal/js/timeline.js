/* ============================================================
   TIMELINE — 7 steps, horizontal scroll, 3D reveal
   ============================================================ */

window.TimelineModule = (function() {

  const steps = [
    {
      n: 1, status: 'complete', magic: true, icon: '🎉',
      title: 'פתחתם תיק',
      date: '15 בספטמבר · 14:32',
      desc: 'הצטרפתם ל-AutoImports! פתחנו תיק על שם עומרי גיטר. מספר תיק: AI-2025-G63-001. הפקדתם 500₪ דמי טיפול ראשוניים.',
      detail: 'זה הרגע שהכל התחיל. ה-G63 שלך עדיין לא נמצא — אבל הצוות שלנו כבר התחיל לחפש את הרכב המושלם עבורך מתוך כ-14,000 G63 זמינים בארה״ב.',
      svgIcon: '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>'
    },
    {
      n: 2, status: 'complete',
      title: 'תחרות בין שותפים',
      date: '18 בספטמבר · 09:15',
      desc: '3 דילרים בארה״ב התחרו על הצעה. המנצח: ABC Dealership באטלנטה, ג׳ורג׳יה. הצעה זוכה: $164,500.',
      detail: 'מודל ה-AutoImports — ההצעה הטובה ביותר תמיד מנצחת. השווינו את ABC Dealership (Atlanta, $164,500), Mercedes of Atlanta ($168,200) ו-Beck Premium Motors (Houston, $169,800). חיסכון של $5,300 בזכות התחרות בלבד.',
      svgIcon: '<path d="M6 9l6 6 6-6"/><path d="M6 15h12"/><path d="M9 5h6"/>'
    },
    {
      n: 3, status: 'complete',
      title: 'הצעה תואמת + חוזה',
      date: '21 בספטמבר · 11:00',
      desc: 'הסכמתם על מחיר סופי. הרכב הוגדר: G63 AMG 2025, Obsidian Black, ריפוד נאפה אדום, חבילת Night Package. סה״כ ₪1,180,000.',
      detail: 'הצעה סופית כללה: רכב $164,500, שילוח $2,000, מכס/מע״מ ₪245K, הנחת AutoImports -$3,000, עמלת שירות 5%. סה״כ עברית: ₪1,180,000. חתמתם על חוזה דיגיטלי באותו יום.',
      svgIcon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>'
    },
    {
      n: 4, status: 'complete',
      title: 'תשלום ראשוני בארה״ב',
      date: '25 בספטמבר · 16:42',
      desc: 'הרכב נרכש רשמית מ-ABC Dealership. ה-G63 שלך! נציג AutoImports במקום אסף את הרכב והעביר לנמל סוואנה.',
      detail: 'תשלום סופי בוצע ישירות מאיתנו לדילר: $164,500. ה-VIN שויך אליך: WDCYC7HJ5LX•••••842. רכב חדש, 12 מייל בלבד, אחריות יצרן מלאה.',
      svgIcon: '<path d="M3 17h2l1.5-4h11L19 17h2v-5l-3-7H6L3 12z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'
    },
    {
      n: 5, status: 'active',
      title: 'שילוח',
      date: '[פעיל] · יום 12/38',
      desc: 'הרכב על האונייה Atlantic Sky (RoRo). יצא מנמל סוואנה ב-28 בספטמבר. מיקום נוכחי: 450 ק״מ מערבית לליסבון. ETA חיפה: 17 באוקטובר.',
      detail: 'האונייה היא RoRo (Roll-on/Roll-off) מתמחה. הרכב שלך נעול בסיפון 7, חניה M-42. ביטוח מלא במהלך הים. תוכל לעקוב אחרי המסלול בזמן אמת.',
      svgIcon: '<path d="M2 20l2-8h16l2 8M4 12V7h16v5M12 7V3"/>'
    },
    {
      n: 6, status: 'pending',
      title: 'מכס וסטנדרטיזציה',
      date: 'מתוכנן · 18-25 באוקטובר',
      desc: 'בהגעה לחיפה: שחרור מכס (3-4 ימים), העברה למכון הסטנדרטיזציה (תקני בטיחות ישראליים), קבלת רישיון רכב.',
      detail: 'תהליך מוסדר: בקרת בטיחות, התקנת לוחיות זיהוי ישראליות, אישור פליטות, רישום במשרד התחבורה. אנחנו מטפלים בכל זה — אתה לא מגיע פיזית.',
      svgIcon: '<path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-0.5 8-5 8-10V6l-8-4z"/>'
    },
    {
      n: 7, status: 'pending',
      title: 'מסירה בלוד',
      date: 'מתוכנן · 25 באוקטובר',
      desc: 'מסירה רשמית במרכז AutoImports בלוד. טיפול ראשון, הסבר על המערכות, מפתחות חדשים, צילום משותף, ושיגור הביתה.',
      detail: 'יום המסירה: 09:00 קפה ומפגש עם הצוות, 09:30 סקירה מלאה של הרכב, 10:30 חוזה רישום (אם רלוונטי), 11:00 מפתחות + צילום, 11:15 נסיעה ראשונה.',
      svgIcon: '<path d="M9 22V12h6v10"/><path d="M3 9l9-7 9 7v13a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>'
    }
  ];

  let trackEl, railEl;

  function render() {
    trackEl = document.getElementById('timelineTrack');
    if (!trackEl) return;
    trackEl.innerHTML = steps.map(s => `
      <article class="tl-card is-${s.status}" data-step="${s.n}">
        ${s.magic ? '<div class="tl-magic-badge">🎉 רגע קסם</div>' : ''}
        <div class="tl-step">
          <span class="tl-step-num">${s.n}</span>
          <span>שלב ${s.n} מתוך 7</span>
        </div>
        <div class="tl-icon-wrap">
          <svg class="tl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.svgIcon}</svg>
        </div>
        <h3 class="tl-title">${s.title}</h3>
        <div class="tl-date">${s.date}</div>
        <p class="tl-desc">${s.desc}</p>
        ${s.status !== 'pending' ? '<button class="tl-cta">צפו בעדכון מלא ←</button>' : ''}
      </article>
    `).join('');

    // Modal click handlers
    trackEl.querySelectorAll('.tl-cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.tl-card');
        const idx = parseInt(card.dataset.step, 10) - 1;
        const s = steps[idx];
        Portal.modal.show(`
          <div class="modal-eyebrow">שלב ${s.n} מתוך 7 · ${s.date}</div>
          <h2 class="modal-title">${s.title}</h2>
          <div class="modal-body">
            <p>${s.desc}</p>
            <p><strong>פרטים מורחבים:</strong> ${s.detail}</p>
            ${s.status === 'complete' ? '<p style="color: var(--success);"><strong>✓ הושלם בהצלחה.</strong> מסמכים זמינים בכספת.</p>' : ''}
            ${s.status === 'active' ? '<p style="color: var(--cobalt-bright);"><strong>🔵 שלב פעיל כרגע.</strong> תוכל לעקוב חי בלשונית "מעקב חי".</p>' : ''}
          </div>
        `);
        if (window.Portal && Portal.chime) Portal.chime();
      });
    });
  }

  function initScroll() {
    railEl = document.getElementById('timelineRail');
    if (!railEl) return;

    const next = document.getElementById('tlNext');
    const prev = document.getElementById('tlPrev');
    const fill = document.getElementById('tlProgressFill');

    function updateProgress() {
      const max = railEl.scrollWidth - railEl.clientWidth;
      if (max <= 0) { fill.style.width = '100%'; return; }
      // RTL scroll: scrollLeft will be 0 at start, negative or shifted depending on browser
      let pct;
      const sl = railEl.scrollLeft;
      // For RTL containers, scrollLeft typically goes from 0 → -(max) in modern browsers
      // or 0 → max if browser uses default.
      pct = Math.abs(sl) / max;
      fill.style.width = (pct * 100) + '%';
    }

    next.addEventListener('click', () => {
      railEl.scrollBy({ left: -350, behavior: 'smooth' });
    });
    prev.addEventListener('click', () => {
      railEl.scrollBy({ left: 350, behavior: 'smooth' });
    });
    railEl.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Scroll active card into view on first render
    setTimeout(() => {
      const active = trackEl.querySelector('.tl-card.is-active');
      if (active) {
        const offset = active.offsetLeft - (railEl.clientWidth / 2) + (active.offsetWidth / 2);
        railEl.scrollTo({ left: -offset, behavior: 'smooth' });
      }
    }, 400);

    // 3D reveal animation
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.tl-card', {
        opacity: 0,
        rotationY: -25,
        scale: 0.9,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: railEl,
          start: 'top 80%',
          once: true
        }
      });
    }
  }

  function init() {
    render();
    initScroll();
  }

  return { init };
})();
