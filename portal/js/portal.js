/* ============================================================
   PORTAL CORE — login, nav, modal, greeting, theme
   ============================================================ */

const Portal = {
  customer: {
    name: 'עומרי גיטר',
    firstName: 'עומרי',
    initials: 'OG',
    caseId: 'AI-2025-G63-001',
    email: 'omri.gitter@example.com',
    car: {
      model: 'Mercedes-Benz G63 AMG',
      year: 2025,
      color: 'Obsidian Black',
      vin: 'WDCYC7HJ5LX•••••842',
      price: 1180000,
      paidPct: 25
    },
    ship: {
      vessel: 'Atlantic Sky',
      day: 12,
      totalDays: 38,
      eta: '4 באוקטובר',
      lat: 35.18,
      lng: -12.45,
      speed: 18
    }
  },
  muted: false,
  lenis: null
};

/* ============ LOGIN ============ */
function initLogin() {
  const form = document.getElementById('loginForm');
  const loginScreen = document.getElementById('loginScreen');
  const dashboard = document.getElementById('dashboard');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Animate out login
    loginScreen.style.transition = 'opacity 0.6s, transform 0.6s';
    loginScreen.style.opacity = '0';
    loginScreen.style.transform = 'scale(1.08)';
    setTimeout(() => {
      loginScreen.style.display = 'none';
      dashboard.hidden = false;
      // Animate dashboard in
      requestAnimationFrame(() => {
        dashboard.style.opacity = '0';
        dashboard.style.transform = 'translateY(20px)';
        dashboard.style.transition = 'opacity 0.6s, transform 0.6s';
        requestAnimationFrame(() => {
          dashboard.style.opacity = '1';
          dashboard.style.transform = 'translateY(0)';
        });
      });
      onDashboardReady();
    }, 600);
  });
}

/* ============ GREETING ============ */
function setGreeting() {
  const h = new Date().getHours();
  let g = 'ערב טוב';
  if (h >= 5 && h < 12) g = 'בוקר טוב';
  else if (h >= 12 && h < 17) g = 'צהריים טובים';
  else if (h >= 17 && h < 21) g = 'ערב טוב';
  else g = 'לילה טוב';
  const pill = document.getElementById('greetingPill');
  if (pill) pill.textContent = g;

  const title = document.querySelector('.d-hero-title');
  if (title) {
    title.innerHTML = `${g}, <span class="accent-grad">${Portal.customer.firstName}.</span><br>הרכב שלך<br>בדרך הביתה.`;
  }
}

/* ============ NAV ACTIVE STATE ============ */
function initNavActive() {
  const links = document.querySelectorAll('.d-nav-links a');
  const sections = ['#hero', '#timeline', '#tracking', '#moments', '#vault', '#comm']
    .map(id => document.querySelector(id))
    .filter(Boolean);

  if (!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-30% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));

  links.forEach(l => {
    l.addEventListener('click', (e) => {
      const target = document.querySelector(l.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============ MUTE ============ */
function initMute() {
  const btn = document.getElementById('muteBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    Portal.muted = !Portal.muted;
    btn.classList.toggle('muted', Portal.muted);
  });
}

/* ============ MODAL ============ */
const Modal = {
  root: null, backdrop: null, close: null, content: null,
  init() {
    this.root = document.getElementById('modalRoot');
    this.backdrop = document.getElementById('modalBackdrop');
    this.close = document.getElementById('modalClose');
    this.content = document.getElementById('modalContent');
    this.backdrop.addEventListener('click', () => this.hide());
    this.close.addEventListener('click', () => this.hide());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.hide(); });
  },
  show(html) {
    this.content.innerHTML = html;
    this.root.hidden = false;
    document.body.style.overflow = 'hidden';
  },
  hide() {
    this.root.hidden = true;
    document.body.style.overflow = '';
  }
};
Portal.modal = Modal;

/* ============ SOUND chime (cobalt-tone) ============ */
function chime() {
  if (Portal.muted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}
Portal.chime = chime;

/* ============ LENIS smooth scroll ============ */
function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis === 'undefined') return;
  Portal.lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    direction: 'vertical'
  });
  function raf(time) { Portal.lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
    Portal.lenis.on('scroll', ScrollTrigger.update);
  }
}

/* ============ REVEAL ON SCROLL ============ */
function initReveals() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.tl-card, .moment-card, .doc-card, .excite-card, .hs-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power3.out',
      delay: (i % 4) * 0.06,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ============ TILT ON HOVER ============ */
function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('mousemove', () => {}, { passive: true });
  document.querySelectorAll('.hero-car-card, .doc-card, .moment-card, .excite-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============ DASHBOARD READY ============ */
function onDashboardReady() {
  setGreeting();
  initNavActive();
  initMute();
  Modal.init();
  initLenis();

  // Init each module
  if (window.SceneCar) window.SceneCar.initGlobe();
  if (window.TimelineModule) window.TimelineModule.init();
  if (window.MapTracking) window.MapTracking.init();
  if (window.MagicMomentsModule) window.MagicMomentsModule.init();

  initVault();
  initChat();
  initEmails();
  initExcite();

  // Slight delay before reveals
  setTimeout(() => { initReveals(); initTilt(); chime(); }, 300);
}

/* ============ VAULT ============ */
function initVault() {
  const grid = document.getElementById('vaultGrid');
  if (!grid) return;
  const docs = [
    { name: 'הסכם רכישה (Bill of Sale)', date: '21.09.2025', status: 'done', cat: 'legal', icon: 'contract' },
    { name: 'תעודת זהות + רישיון נהיגה', date: '15.09.2025', status: 'done', cat: 'legal', icon: 'id' },
    { name: 'אישור הפקדת מקדמה (₪500)', date: '15.09.2025', status: 'done', cat: 'legal', icon: 'receipt' },
    { name: 'Carfax Report — VIN מלא', date: '19.09.2025', status: 'done', cat: 'vehicle', icon: 'car' },
    { name: 'PPI — Pre-Purchase Inspection', date: '20.09.2025', status: 'done', cat: 'vehicle', icon: 'check' },
    { name: 'אישור תשלום סופי ($164,500)', date: '25.09.2025', status: 'done', cat: 'legal', icon: 'receipt' },
    { name: 'שטר מטען (Bill of Lading)', date: '28.09.2025', status: 'done', cat: 'shipping', icon: 'ship' },
    { name: 'אישור פרישת ביטוח שילוח', date: '28.09.2025', status: 'done', cat: 'shipping', icon: 'shield' },
    { name: 'רישיון יבוא — משרד התחבורה', date: 'בתהליך', status: 'progress', cat: 'import', icon: 'license' },
    { name: 'טופס 21 — מכס ישראל', date: 'ממתין', status: 'pending', cat: 'import', icon: 'form' },
    { name: 'אישור סטנדרטיזציה', date: 'ממתין', status: 'pending', cat: 'import', icon: 'check' },
    { name: 'רישיון רכב ישראלי', date: 'ממתין', status: 'pending', cat: 'vehicle', icon: 'license' }
  ];

  const icons = {
    contract: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>',
    id: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><line x1="14" y1="9" x2="18" y2="9"/><line x1="14" y1="13" x2="18" y2="13"/>',
    receipt: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 2V2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/>',
    car: '<path d="M3 17h2l1.5-4h11L19 17h2v-5l-3-7H6L3 12z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    ship: '<path d="M2 20l2-8h16l2 8M4 12V7h16v5M12 7V3"/>',
    shield: '<path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-0.5 8-5 8-10V6l-8-4z"/>',
    license: '<rect x="3" y="6" width="18" height="12" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>',
    form: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>'
  };

  function render(cat) {
    const list = cat === 'all' ? docs : docs.filter(d => d.cat === cat);
    grid.innerHTML = list.map(d => `
      <div class="doc-card is-${d.status}" data-doc="${d.name}">
        <div class="doc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[d.icon]}</svg></div>
        <div class="doc-name">${d.name}</div>
        <div class="doc-date">${d.date}</div>
        <div class="doc-status">
          ${d.status === 'done' ? '✓ הושלם' : d.status === 'progress' ? '🔵 בתהליך' : '⏳ ממתין'}
        </div>
        <div class="doc-action">${d.status === 'pending' ? 'נעול' : 'פתח/הורד ←'}</div>
      </div>
    `).join('');

    // Click handlers
    grid.querySelectorAll('.doc-card').forEach(c => {
      c.addEventListener('click', () => {
        const name = c.dataset.doc;
        Modal.show(`
          <div class="modal-eyebrow">מסמך · ${docs.find(d=>d.name===name)?.date || ''}</div>
          <h2 class="modal-title">${name}</h2>
          <div class="modal-body">
            <p>זוהי תצוגת mock של המסמך. בגרסת ה-production, כאן יוצג ה-PDF המלא עם אפשרויות הורדה, שיתוף וחתימה דיגיטלית.</p>
            <p><strong>סטטוס:</strong> ${c.classList.contains('is-done') ? '✓ הושלם ונחתם' : c.classList.contains('is-progress') ? '🔵 בתהליך' : '⏳ ממתין למסמכים נוספים'}</p>
            <p><strong>אבטחה:</strong> כל המסמכים מאוחסנים בצופן AES-256, גישה רק לבעל התיק ולמנהל התיק.</p>
          </div>
        `);
      });
    });
  }

  render('all');

  document.querySelectorAll('.vault-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.vault-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      render(t.dataset.tab);
    });
  });
}

/* ============ CHAT ============ */
function initChat() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const chats = [
    { from: 'them', text: 'בוקר טוב עומרי! 😊 רציתי לעדכן — הרכב עלה לאונייה בשלום אתמול בלילה.', time: '08:42' },
    { from: 'me',   text: 'מעולה! יש תמונות?', time: '09:14' },
    { from: 'them', text: 'בטח. העלאתי 12 תמונות לפיד הרגעים שלך. תיכנס לראות, זה ממש מרגש לראות את ה-G63 שלך נכנס לסיפון.', time: '09:18' },
    { from: 'them', text: 'גם — ה-ETA לחיפה התעדכן: 17 באוקטובר. יום-יומיים לפני שהיינו בתכנון. בונוס 🎁', time: '09:19' },
    { from: 'me',   text: 'יאללה! ומתי בערך אני מקבל את הרכב בלוד?', time: '12:31' },
    { from: 'them', text: 'אחרי מכס וסטנדרטיזציה — בערך 8-10 ימים מהגעה. כלומר סביבות ה-25 באוקטובר. אעדכן ברגע שיש לוח מדויק. 🚗💨', time: '12:46' }
  ];
  messages.innerHTML = chats.map(c => `
    <div class="msg msg-${c.from}">
      ${c.text}
      <span class="msg-time">${c.time}</span>
    </div>
  `).join('');
  messages.scrollTop = messages.scrollHeight;
}

/* ============ EMAILS ============ */
function initEmails() {
  const list = document.getElementById('emailsList');
  if (!list) return;
  const emails = [
    { subject: 'מסע ה-G63 שלך — סיכום שבועי #2', from: 'AutoImports · אוטומטי', date: '01.10', status: 'unread' },
    { subject: 'תמונות מ-Atlantic Sky (12 תמונות חדשות)', from: 'שרה כהן', date: '30.09', status: 'seen' },
    { subject: 'אישור תשלום סופי — תיק AI-2025-G63-001', from: 'מחלקת חשבונאות', date: '25.09', status: 'seen' },
    { subject: '5 דברים שלא ידעת על G63 שלך', from: 'AutoImports · תוכן', date: '23.09', status: 'seen' },
    { subject: 'הרכב נרכש! פרטים על המעבר לשלב הבא', from: 'שרה כהן', date: '21.09', status: 'seen' },
    { subject: 'תוצאות PPI ו-Carfax — הכל ירוק 🟢', from: 'מחלקת בקרת איכות', date: '20.09', status: 'seen' }
  ];
  list.innerHTML = emails.map(e => `
    <div class="email-row is-${e.status}">
      <div class="email-info">
        <div class="email-subject">${e.subject}</div>
        <div class="email-from">${e.from}</div>
      </div>
      <div class="email-meta">
        <span class="email-date">${e.date}</span>
        <span class="email-status ${e.status}">${e.status === 'seen' ? 'נצפה' : 'חדש'}</span>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.email-row').forEach((row, i) => {
    row.addEventListener('click', () => {
      const e = emails[i];
      Modal.show(`
        <div class="modal-eyebrow">${e.from} · ${e.date}</div>
        <h2 class="modal-title">${e.subject}</h2>
        <div class="modal-body">
          <p>שלום עומרי,</p>
          <p>עוד שבוע מאחורינו, ועוד שלב לקראת הרגע הגדול. הנה סיכום קצר של מה שקרה השבוע:</p>
          <p><strong>· מיקום אחרון של האונייה:</strong> 35.18°N · 12.45°W (כ-450 ק״מ מערבית לליסבון)</p>
          <p><strong>· מהירות ממוצעת:</strong> 17.8 קשרים</p>
          <p><strong>· ETA לחיפה:</strong> 17 באוקטובר (יום-יומיים מוקדם)</p>
          <p><strong>· מסמכי מכס:</strong> בהכנה. יישלחו לחתימתך בעוד 3 ימים.</p>
          <p>אם יש שאלות — אני כאן.</p>
          <p>שרה כהן · מנהלת התיק שלך</p>
        </div>
      `);
    });
  });
}

/* ============ EXCITEMENT ============ */
function initExcite() {
  const grid = document.getElementById('exciteGrid');
  if (!grid) return;
  const items = [
    {
      tag: 'דו״ח שבועי', icon: '📊',
      title: 'מסע ה-G63 שלך — סיכום שבועי',
      snippet: 'גרפיקה אינטראקטיבית, סטטיסטיקות תהליך, ETA חדשה, תמונות. הסיכום השבועי השני שלך.',
      modal: `
        <div class="modal-eyebrow">דו״ח שבועי · 30.09.2025</div>
        <h2 class="modal-title">מסע ה-G63 שלך · שבוע 2</h2>
        <div class="modal-stats">
          <div class="modal-stat"><span class="modal-stat-num">12</span><span class="modal-stat-lbl">ימים במסע</span></div>
          <div class="modal-stat"><span class="modal-stat-num">68%</span><span class="modal-stat-lbl">מהדרך</span></div>
          <div class="modal-stat"><span class="modal-stat-num">26</span><span class="modal-stat-lbl">ימים נותרו</span></div>
        </div>
        <div class="modal-body">
          <p><strong>השבוע:</strong> האונייה Atlantic Sky עזבה את נמל Savannah, חצתה את האטלנטי הצפוני וכעת ממוקמת 450 ק״מ מערבית לליסבון.</p>
          <p><strong>תחזית:</strong> בעוד 5 ימים האונייה תיכנס לים-התיכון. בעוד 12 ימים — חיפה.</p>
          <p><strong>הכנות מבעוד מועד:</strong> מסמכי מכס יישלחו לחתימתך בעוד 3 ימים.</p>
        </div>
      `
    },
    {
      tag: 'טריוויה', icon: '⭐',
      title: '5 דברים שלא ידעת על ה-G63 שלך',
      snippet: 'ההסטוריה של המנוע V8 ביטורבו, מספר הצבעים המיוחדים, מקור השם "Geländewagen" ועוד.',
      modal: `
        <div class="modal-eyebrow">טריוויה · ידע</div>
        <h2 class="modal-title">5 דברים על ה-G63 שלך</h2>
        <div class="modal-body">
          <p><strong>1. שם המקור: Geländewagen.</strong> פירושו "רכב שטח" בגרמנית. נוסד ב-1979 כפרויקט צבאי לצבא איראני.</p>
          <p><strong>2. ידנית, לא בקו ייצור.</strong> כל G63 נבנה ידנית בגראץ (אוסטריה) — אותו מפעל מאז 1979.</p>
          <p><strong>3. הצורה לא השתנתה ב-46 שנים.</strong> רק 5 דורות, אבל הקווים — זהים.</p>
          <p><strong>4. המנוע: M177 V8 4.0L Biturbo.</strong> 585 כ״ס, 850 Nm, 0-100 ב-4.5 שניות.</p>
          <p><strong>5. הצליל.</strong> ה-G63 מצויד ב-AMG Performance Exhaust ייחודי. הצליל הוא חתימה.</p>
        </div>
      `
    },
    {
      tag: 'קהילה', icon: '👥',
      title: 'פגוש את הקהילה — 47 לקוחות G63 השנה',
      snippet: '47 לקוחות שייבאנו להם G63 השנה. מפת ישראל, סיפורים, ביקורות מאומתות.',
      modal: `
        <div class="modal-eyebrow">קהילה · AutoImports</div>
        <h2 class="modal-title">47 בעלי G63 ב-2025</h2>
        <div class="modal-stats">
          <div class="modal-stat"><span class="modal-stat-num">47</span><span class="modal-stat-lbl">לקוחות</span></div>
          <div class="modal-stat"><span class="modal-stat-num">₪43M</span><span class="modal-stat-lbl">חיסכון מצטבר</span></div>
          <div class="modal-stat"><span class="modal-stat-num">4.9</span><span class="modal-stat-lbl">דירוג ממוצע</span></div>
        </div>
        <div class="modal-body">
          <p>47 לקוחות בחרו ב-AutoImports השנה ליבוא G63. החיסכון הממוצע שלהם: ₪912K לעומת מחיר היבואן הרשמי.</p>
          <p><strong>פיזור גיאוגרפי:</strong> תל אביב (18), הרצליה (8), רעננה (5), כפר שמריהו (4), אילת (3), אחר (9).</p>
          <p><strong>הצעות הוואטסאפ של הקהילה:</strong> טיפים, מוסכים, ביטוחים, אביזרים — קבוצה פרטית רק לבעלי G63 שיובאו דרכנו.</p>
        </div>
      `
    },
    {
      tag: 'הסטוריה', icon: '🕰',
      title: 'ההסטוריה של ה-G-Class · 1979-2025',
      snippet: '46 שנות אגדה. מהפרויקט הצבאי בגראץ, דרך השאה של איראן, ועד לרחובות הוליווד היום.',
      modal: `
        <div class="modal-eyebrow">סיפור</div>
        <h2 class="modal-title">G-Class · 46 שנים</h2>
        <div class="modal-body">
          <p><strong>1979:</strong> ה-G הראשון יוצא מהקו. פרויקט שהזמין השאה של איראן — שהודח בדיוק לפני שקיבל את ההזמנה.</p>
          <p><strong>1990:</strong> Mercedes-Benz מאמצת רשמית את ה-G לסדרת האזרחים שלה.</p>
          <p><strong>1999:</strong> AMG מקבלת את ה-G לראשונה — G55 AMG.</p>
          <p><strong>2018:</strong> דור חדש — הראשון בכ-40 שנה. אותה צורה, חדש לחלוטין מבפנים.</p>
          <p><strong>2025:</strong> G63 שלך. אגדה בת 46.</p>
        </div>
      `
    },
    {
      tag: 'DIY · הכנה', icon: '🏠',
      title: 'DIY: הכן את הבית למסירה ב-3 שלבים',
      snippet: 'מקום חניה ייעודי, מגן לחזית, ביטוח מקיף — איך להכין את הבית והחיים שלך לרגע ה-G63.',
      modal: `
        <div class="modal-eyebrow">DIY · הכנה</div>
        <h2 class="modal-title">3 שלבים לפני המסירה</h2>
        <div class="modal-body">
          <p><strong>שלב 1 — חניה ייעודית.</strong> ה-G63 הוא 4.87 מ׳ אורך × 1.99 מ׳ רוחב + 1.97 מ׳ גובה. ודא שיש לך גישה לחניה גבוהה ורחבה. מומלץ לסמן כדי לא לפגוע.</p>
          <p><strong>שלב 2 — מגן Paint Protection Film.</strong> בארה״ב הרכב יצא חדש לגמרי. מומלץ לכסות את החזית, את הדלתות והכנפיים ב-PPF. שותף שלנו בלוד מציע 8,500₪ לכיסוי מלא.</p>
          <p><strong>שלב 3 — ביטוח מקיף.</strong> בגלל ערכו (₪1.18M) צריך ביטוח מקיף עם סוכן מומחה. שותף הביטוח שלנו (Howden) מציע הצעה ראשונית בתוך 24 שעות.</p>
        </div>
      `
    }
  ];

  grid.innerHTML = items.map((e, i) => `
    <article class="excite-card" data-i="${i}">
      <div class="excite-tag">${e.tag}</div>
      <div class="excite-icon">${e.icon}</div>
      <div class="excite-title">${e.title}</div>
      <div class="excite-snippet">${e.snippet}</div>
      <div class="excite-cta">קרא הכל</div>
    </article>
  `).join('');

  grid.querySelectorAll('.excite-card').forEach(c => {
    c.addEventListener('click', () => {
      const i = parseInt(c.dataset.i, 10);
      Modal.show(items[i].modal);
    });
  });
}

/* ============ BOOT ============ */
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});
