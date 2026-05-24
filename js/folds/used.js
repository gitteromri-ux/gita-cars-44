/* ==========================================================================
   FOLD — USED CARS · Carfax + PPI + Warranty
   Injects 3-layer trust story + mini cost calc into #used-mount.
   Source-of-truth: MESSAGING_BIBLE.md §6 Fold 8 + Excel Website!B15 + 'תהליך מוצע' D9
   ========================================================================== */

(function () {
  'use strict';

  const mount = document.getElementById('used-mount');
  if (!mount) return;

  // ---- inline SVG icons (stroke 1.5, cobalt via currentColor) ----
  const icoCarfax = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
      <path d="M14 3v4h4"/>
      <circle cx="12" cy="14" r="3.2"/>
      <path d="M12 12.4v1.6l1.1 1.1"/>
    </svg>`;
  const icoPPI = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 6.3a3.5 3.5 0 0 0-4.8 4.8L4 17l3 3 5.9-5.9a3.5 3.5 0 0 0 4.8-4.8l-2.2 2.2-1.9-1.9 2.1-2.3Z"/>
      <path d="m9 18 4-4"/>
      <path d="m17 13 4 4-2 2-4-4"/>
    </svg>`;
  const icoShield = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6l-8-3Z"/>
      <path d="m8.6 12.2 2.4 2.4L15.6 10"/>
    </svg>`;

  // ---- build markup ----
  mount.innerHTML = `
    <section id="used" aria-labelledby="used-h1">
      <div class="u-bg" aria-hidden="true"></div>

      <div class="u-wrap">

        <!-- BLOCK A — Headline -->
        <header class="u-head">
          <div class="u-eyebrow">יד שנייה · 3 שכבות בטחון</div>
          <h2 class="u-h1" id="used-h1">
            קונים יד-שנייה?<br>
            אנחנו בודקים אותו <span class="u-num">3</span> פעמים<br>
            <span class="u-accent">לפני שאתם משלמים שקל.</span>
          </h2>
          <p class="u-sub">
            כל רכב משומש שאנחנו מביאים עובר Carfax מלא, PPI במכון-מורשה בארה״ב,
            וקבל אחריות יבואן-רשמי. שקוף — תוכלו לקרוא את הדוחות לפני שאתם מאשרים.
          </p>
        </header>

        <!-- BLOCK B — 3 שכבות -->
        <div class="u-layers" role="list">

          <article class="u-card" role="listitem">
            <div class="u-card-icon" aria-hidden="true">${icoCarfax}</div>
            <h3 class="u-card-title">
              <span class="u-step">01</span>
              Carfax מלא
            </h3>
            <p class="u-card-body">
              היסטוריה מלאה של הרכב מרגע הייצור: כל מכירה, כל תאונה,
              כל טיפול-מוסך. הדוח הרשמי של ארה״ב — 100% מתקבל
              ע״י משרד התחבורה הישראלי.
            </p>
            <div class="u-card-stat">
              <b>1980+</b><span>שנה ממנה Carfax חובה</span>
            </div>
            <a class="u-card-link" href="#carfax-sample" data-used-link="carfax">ראה דוגמה</a>
          </article>

          <article class="u-card" role="listitem">
            <div class="u-card-icon" aria-hidden="true">${icoPPI}</div>
            <h3 class="u-card-title">
              <span class="u-step">02</span>
              PPI במכון מורשה
            </h3>
            <p class="u-card-body">
              Pre-Purchase Inspection: נציגנו בארה״ב לוקח את הרכב
              למוסך-מורשה (לא של המוכר), בודק 150+ נקודות:
              מנוע, גיר, מתלים, פנים, אלקטרוניקה. מקבלים דוח מצולם
              מלא לפני שאתם מאשרים את הרכישה.
            </p>
            <div class="u-card-stat">
              <b>150+</b><span>נקודות בדיקה</span>
            </div>
            <button class="u-card-link" type="button" data-used-link="ppi">כל הנקודות</button>
          </article>

          <article class="u-card" role="listitem">
            <div class="u-card-icon" aria-hidden="true">${icoShield}</div>
            <h3 class="u-card-title">
              <span class="u-step">03</span>
              אחריות יבואן רשמי
            </h3>
            <p class="u-card-body">
              רכבי יצרני ארה״ב (Ford, Chevy, Jeep, Tesla, Rivian) נהנים
              מאחריות עולמית מהיצרן. מרצדס/BMW/Audi: AutoImports
              מציעה אחריות יבוא-אישי של 24 חודש דרך מוסכים מורשים
              בישראל. + ביטוח-טרנזיט מלא מהיציאה מארה״ב עד הבית.
            </p>
            <div class="u-card-stat">
              <b>24</b><span>חודש אחריות מינימלית</span>
            </div>
          </article>

        </div>

        <!-- BLOCK C — Mini Calc -->
        <div class="u-calc" role="group" aria-labelledby="used-calc-title">
          <div class="u-calc-head">
            <span class="u-calc-eyebrow">תוספת אופציונלית · רכב משומש</span>
            <h3 class="u-calc-title" id="used-calc-title">כמה עולה הבדיקה?</h3>
          </div>

          <ul class="u-calc-list">
            <li class="u-calc-row">
              <div>
                <div class="u-calc-row-label">Carfax</div>
                <div class="u-calc-row-note">דוח היסטוריה רשמי מארה״ב</div>
              </div>
              <div class="u-calc-row-price is-free">כלול בחינם ✓</div>
            </li>
            <li class="u-calc-row">
              <div>
                <div class="u-calc-row-label">PPI במכון מורשה</div>
                <div class="u-calc-row-note">כלול במחיר אם בחרת באופציית "אישור-PPI"</div>
              </div>
              <div class="u-calc-row-price">$150-300</div>
            </li>
            <li class="u-calc-row">
              <div>
                <div class="u-calc-row-label">ביטוח-טרנזיט</div>
                <div class="u-calc-row-note">מהיציאה מארה״ב עד הבית — אופציה</div>
              </div>
              <div class="u-calc-row-price">$200-400</div>
            </li>
          </ul>

          <div class="u-calc-summary">
            <p>סה״כ תוספת אופציונלית: <b>$350-700</b> <span style="color:var(--u-ink-mute)">(~₪1,000-2,000)</span></p>
            <p>לעומת ערך-הסיכון של רכב לא-בדוק: <span class="u-risk">₪50,000+</span></p>
          </div>

          <a class="u-cta" href="#intake" data-used-link="cta">כל המידע על יד-שנייה</a>
        </div>

      </div>
    </section>
  `;

  // ---- light interactivity: track link clicks (no modal yet) ----
  mount.addEventListener('click', (e) => {
    const t = e.target.closest('[data-used-link]');
    if (!t) return;
    const kind = t.getAttribute('data-used-link');
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'used_fold_click', kind });
    }
  });

})();
