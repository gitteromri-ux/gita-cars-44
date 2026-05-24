/* ============================================================
   FOLD TRUST — About + Credibility
   Renders the trust section: hero · about+KPIs · advisory board ·
   media logos · strategic partners · final CTA.
   Injects HTML into #trust-mount.
   ============================================================ */
(function () {
  'use strict';

  const MOUNT_SEL = '#trust-mount';

  // ---------- Data ----------
  const KPIS = [
    { num: '15', unit: '+', label: 'שנות ניסיון<br>ביבוא רכבי-יוקרה' },
    { num: '38', unit: '',  label: 'יום ממוצע<br>עד הבית' },
    { num: '0',  unit: '',  label: 'סוכני-ביניים<br>ברשת שלנו' },
    { num: '100', unit: '%', label: 'שקיפות<br>מסמכים מלאה' }
  ];

  const ADVISORS = [
    {
      initials: 'רא',
      name: 'רון אבני',
      role: 'יועץ רגולציה',
      sub: 'עו״ד יבוא לשעבר משרד התחבורה'
    },
    {
      initials: 'שכ',
      name: 'שירה כהן',
      role: 'סמנכ״לית כספים',
      sub: 'רו״ח, יועצת מס בכיר'
    },
    {
      initials: 'דל',
      name: 'דוד לוי',
      role: 'מומחה רכב',
      sub: '25 שנה תיקון רכבי-יוקרה (Mercedes / BMW / Tesla)'
    },
    {
      initials: 'מב',
      name: 'מיכל ברק',
      role: 'מנהלת לוגיסטיקה',
      sub: 'לשעבר ZIM Lines · מומחית שילוח בינלאומי'
    },
    {
      initials: 'יו',
      name: 'יוסי מזרחי',
      role: 'יועץ מימון',
      sub: 'לשעבר מנהל ישראכרט-Auto · 18 שנה אשראי-רכב'
    }
  ];

  const MEDIA = [
    'Calcalist', 'TheMarker', 'Globes', 'Ynet',
    'Walla!', 'Channel 12', 'Channel 13'
  ];

  const PARTNERS = [
    'Bank Hapoalim', 'Maersk Shipping', 'Harel Insurance', 'Mobileye Israel'
  ];

  // ---------- Builders ----------
  function buildHero() {
    return `
      <header class="tr-hero">
        <div class="tr-eyebrow" data-tr-reveal>
          BRAND <span class="dot"></span> NEW MODEL
        </div>
        <h1 class="tr-h1 d-1" data-tr-reveal>
          <span class="l l-1">Trust.</span>
          <span class="l l-2">Credibility.</span>
          <span class="l l-3">The New Model.</span>
        </h1>
        <p class="tr-sub d-2" data-tr-reveal>
          AutoImports.co.il — חברת יבוא אישי דור-חדש. שקיפות מלאה, ייעוץ מומחים, ביטוח-נסיעה לכל שלב.
        </p>
      </header>
    `;
  }

  function buildAbout() {
    const kpis = KPIS.map((k, i) => `
      <div class="tr-kpi d-${i + 1}" data-tr-reveal>
        <div class="tr-kpi-num">${k.num}<span class="unit">${k.unit}</span></div>
        <div class="tr-kpi-lbl">${k.label}</div>
      </div>
    `).join('');

    return `
      <section class="tr-about">
        <div class="tr-about-body" data-tr-reveal>
          <div class="tr-about-label">מי אנחנו</div>
          <p>
            <strong>AutoImports.co.il</strong> נוסדה ב-2024 ע״י צוות עם 15+ שנות ניסיון
            ביבוא רכבי-יוקרה לישראל. ראינו את הפער: רכב G63 שעולה
            $185K בארה״ב נמכר ב-₪2.1M בישראל. הפער הזה (₪1.5M)
            מתחלק בין רווח-יבואן, מיסים ועמלות-יתר.
          </p>
          <p>
            המודל שלנו אחר: אתם המייבאים האישיים — חוקית, רשמית.
            אנחנו רק הצוות שסורק את ארה״ב, מתחרה בין שותפים,
            מנהל את הלוגיסטיקה. הרכב נרשם על השם שלכם מהיום הראשון.
          </p>
          <p>
            תוצאה: עד 78% חיסכון. ללא רווח-יבואן.
          </p>
        </div>

        <aside class="tr-kpis" aria-label="מדדים">
          ${kpis}
        </aside>
      </section>
    `;
  }

  function buildBoard() {
    const cards = ADVISORS.map((a, i) => `
      <article class="tr-advisor d-${(i % 5) + 1}" data-tr-reveal>
        <div class="tr-avatar" aria-hidden="true">
          <span class="tr-avatar-initials">${a.initials}</span>
        </div>
        <h3 class="tr-advisor-name">${a.name}</h3>
        <p class="tr-advisor-role">
          <b>${a.role}</b><br>${a.sub}
        </p>
      </article>
    `).join('');

    return `
      <section class="tr-section-block">
        <div class="tr-section-head" data-tr-reveal>
          <h2 id="trust-title">הבורד שלנו</h2>
          <span class="tag">ADVISORY · 5 EXPERTS</span>
        </div>
        <div class="tr-board">
          ${cards}
        </div>
        <p class="tr-board-note">
          בורד ייצוגי — שמות מקצועיים ייעודכנו ע״י הצוות עם סגירת חוזי-הייעוץ.
        </p>
      </section>
    `;
  }

  function buildLogos() {
    const media = MEDIA.map((m) => `<span class="tr-logo">${m}</span>`).join('');
    const partners = PARTNERS.map((p) => `<span class="tr-logo">${p}</span>`).join('');

    return `
      <section class="tr-strip tr-media" data-tr-reveal>
        <div class="tr-strip-head">הופענו ב</div>
        <div class="tr-logos">${media}</div>
      </section>

      <section class="tr-strip tr-partners" data-tr-reveal>
        <div class="tr-strip-head">שותפים אסטרטגיים</div>
        <div class="tr-logos">${partners}</div>
      </section>
    `;
  }

  function buildCTA() {
    return `
      <div class="tr-cta-wrap" data-tr-reveal>
        <a href="#intake" class="tr-cta">
          קבל הצעה תוך 72 שעות
          <span class="arrow">→</span>
        </a>
      </div>
    `;
  }

  // ---------- Mount ----------
  function render() {
    const mount = document.querySelector(MOUNT_SEL);
    if (!mount) return;

    mount.innerHTML = `
      <section id="trust" aria-labelledby="trust-title">
        <div class="tr-w">
          ${buildHero()}
          ${buildAbout()}
          ${buildBoard()}
          ${buildLogos()}
          ${buildCTA()}
        </div>
      </section>
    `;

    initRevealObserver(mount);
  }

  function initRevealObserver(root) {
    if (typeof IntersectionObserver === 'undefined') {
      root.querySelectorAll('[data-tr-reveal]').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    root.querySelectorAll('[data-tr-reveal]').forEach((el) => io.observe(el));
  }

  // ---------- Init ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
