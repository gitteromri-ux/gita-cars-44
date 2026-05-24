/* ============================================================
   MAGIC MOMENTS — Instagram-style story feed
   ============================================================ */

window.MagicMomentsModule = (function() {

  const moments = [
    {
      tag: 'יום 1', when: '+12 שעות', magic: true,
      title: 'הרכב נכנס לאונייה — צפו במשלוח!',
      desc: 'רגע מרגש: ה-G63 שלך עולה על Atlantic Sky בנמל סוואנה. צפינו על הסיפון יחד.',
      media: 'video', icon: '🎬',
      bg: 'linear-gradient(135deg, #1a3a6e 0%, #0A1530 100%)',
      stats: '1,247 לקוחות עקבו · 4 דקות',
      modal: {
        title: 'הרכב על Atlantic Sky',
        body: '<p>זו אונייה RoRo בעלת 7 סיפונים, יכולת לשאת עד 4,800 רכבים. ה-G63 שלך מוצב בסיפון 7, חניה M-42. וידאו בן 4 דקות מתעד את כל העלייה לאונייה — מהכניסה דרך הרמפה ועד לעיגון.</p><p><strong>צוות הצילום:</strong> נציג AutoImports בארה״ב, יורם, צילם בעצמו. הוידאו זמין במלואו ב-4K.</p>'
      }
    },
    {
      tag: 'יום 4', when: '+3 ימים',
      title: 'האונייה הגיעה לאוקיינוס האטלנטי',
      desc: 'עזיבת נמל סוואנה. מתחילים את החצייה הגדולה. תחזית: 9 ימים עד שנראה את חופי אירופה.',
      media: 'image', icon: '🌊',
      bg: 'linear-gradient(135deg, #0A1530 0%, #1a3a6e 100%)',
      stats: '892 לקוחות צפו · 2 שעות',
      modal: {
        title: 'יציאה לאטלנטי',
        body: '<p>השעה: 04:30 בבוקר זמן ארה״ב. Atlantic Sky מפליגה החוצה מהנמל בליווי גוררות. הים שקט (Beaufort 3), הסיכויים לחצייה חלקה — מצוינים.</p><p><strong>תחזית:</strong> 9 ימי הפלגה לליסבון, סה״כ ~5,400 ימי-מייל בים.</p>'
      }
    },
    {
      tag: 'יום 6', when: '+5 ימים',
      title: 'תמונה מהאונייה — הרכב שלכם בקדמה',
      desc: 'תמונה ייחודית של נציג סיפון: ה-G63 שלך, ראשון בשורה, נצפה מהגשר.',
      media: 'image', icon: '📸',
      bg: 'linear-gradient(135deg, #4A8BFF 0%, #0A1530 100%)',
      stats: '1,543 לקוחות צפו · 8 שעות',
      modal: {
        title: 'ה-G63 שלך באמצע האוקיינוס',
        body: '<p>צוות הסיפון שולח לנו תמונות שבועיות של רכבים פרטיים. זו התמונה הראשונה — הרכב שלך, ראשון בשורה M, מבריק כמו ביום הראשון.</p><p><strong>תנאי אחסון:</strong> טמפרטורה 18°C, לחות 45%, ללא חשיפה לים-מלוח. הרכב מקובע ב-4 רצועות נילון.</p>'
      }
    },
    {
      tag: 'יום 12', when: 'עכשיו', magic: true,
      title: 'חצינו את האטלנטי! 🎉',
      desc: 'אבן-דרך משמעותית: 450 ק״מ מערבית לליסבון. הגדה הזו של האוקיינוס מאחורינו.',
      media: 'video', icon: '⚡',
      bg: 'linear-gradient(135deg, #6BA5FF 0%, #4A8BFF 100%)',
      stats: '423 לקוחות צופים עכשיו · LIVE',
      modal: {
        title: 'חציית האטלנטי — בוצעה',
        body: '<p>מומנט גדול: Atlantic Sky חצתה את ה-25°W (קו האטלנטי המרכזי) הבוקר ב-06:14 שעון ספינה. בעוד 60 שעות בערך — ייכנסו למיצרי גיברלטר.</p><p><strong>אנליטיקה:</strong> מהירות ממוצעת השבוע 17.8 קשרים. שיא: 20.4 קשרים אתמול אחה״צ. הספינה לפני התכנון ב-1.8 ימים.</p>'
      }
    },
    {
      tag: 'יום 18', when: '+6 ימים',
      title: 'כניסה לים-התיכון',
      desc: 'מעבר מיצרי גיברלטר. הים נרגע, הטמפרטורה עולה. עוד 7 ימים עד חיפה.',
      media: 'image', icon: '🌊',
      bg: 'linear-gradient(135deg, #0A1530 0%, #4A8BFF 100%)',
      stats: 'מתוכנן',
      future: true,
      modal: {
        title: 'מיצרי גיברלטר',
        body: '<p>אחד הצמתים הימיים העמוסים בעולם — 300+ ספינות עוברות בו מדי יום. Atlantic Sky מתעדפת בעדיפות בינונית-גבוהה.</p>'
      }
    },
    {
      tag: 'יום 24', when: '+12 ימים', magic: true,
      title: 'הגעה לחיפה — קבלת פנים',
      desc: 'הרגע! הרכב שלך נוחת בארץ. אנחנו בנמל לפגוש את האונייה ולקבל אותו.',
      media: 'video', icon: '🚢',
      bg: 'linear-gradient(135deg, #3DDC97 0%, #0A1530 100%)',
      stats: 'מתוכנן · 17 באוקטובר',
      future: true,
      modal: {
        title: 'הגעה לחיפה',
        body: '<p>נציג AutoImports יחכה בנמל. צילום בלעדי של הרכב יורד מהאונייה — אחד הרגעים החשובים. תמונות וידאו יעלו לפיד שלך אוטומטית.</p>'
      }
    }
  ];

  function init() {
    const feed = document.getElementById('momentsFeed');
    if (!feed) return;

    feed.innerHTML = moments.map((m, i) => `
      <article class="moment-card ${m.magic ? 'moment-magic' : ''}" data-i="${i}">
        <div class="moment-media" style="background: ${m.bg}">
          <div class="moment-media-icon">${m.icon}</div>
          ${m.media === 'video' ? `
            <div class="moment-play">
              <button class="moment-play-btn" aria-label="נגן">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
              </button>
            </div>
          ` : ''}
          <div class="moment-tag">${m.tag}</div>
        </div>
        <div class="moment-body">
          <div class="moment-title">${m.title}</div>
          <div class="moment-desc">${m.desc}</div>
          <div class="moment-meta">
            <span class="moment-meta-item">⏱ ${m.when}</span>
            <span class="moment-meta-item">👁 ${m.stats}</span>
          </div>
        </div>
      </article>
    `).join('');

    feed.querySelectorAll('.moment-card').forEach(c => {
      c.addEventListener('click', () => {
        const i = parseInt(c.dataset.i, 10);
        const m = moments[i];
        Portal.modal.show(`
          <div class="modal-eyebrow">${m.tag} · ${m.when}</div>
          <h2 class="modal-title">${m.modal.title}</h2>
          <div class="modal-body">
            ${m.modal.body}
            ${m.future ? '<p style="color: var(--warning);"><strong>⏳ עתיד — מתוכנן.</strong> ההתראה תקפוץ באוטומט ברגע שזה קורה.</p>' : ''}
            ${m.magic && !m.future ? '<p style="color: var(--cobalt-bright);"><strong>🎉 רגע קסם.</strong> שמרנו את זה לעמוד הזיכרון שלך.</p>' : ''}
          </div>
        `);
        if (Portal.chime) Portal.chime();
      });
    });
  }

  return { init };
})();
