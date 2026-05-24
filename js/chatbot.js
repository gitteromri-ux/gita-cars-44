/* ===========================================================
   AutoImports AI — Chatbot 2026
   Self-injecting · Knowledge-base · Voice · Context-aware
   Hebrew first · RTL · Glassmorphic
   =========================================================== */
(function () {
  'use strict';

  if (window.__AI_CHAT_INIT) return;
  window.__AI_CHAT_INIT = true;

  /* ---------- CONTEXT DETECTION ---------- */
  const ctx = (() => {
    const path = location.pathname.toLowerCase();
    const isPortal = path.includes('/portal');
    const isVDP = path.includes('/vdp') || path.includes('/car/');
    const params = new URLSearchParams(location.search);
    const carHint = params.get('car') || params.get('model') || null;
    let customerName = null;
    try {
      const raw = localStorage.getItem('ai_customer') || sessionStorage.getItem('ai_customer');
      if (raw) {
        const c = JSON.parse(raw);
        customerName = c && (c.name || c.firstName) || null;
      }
    } catch (_) {}
    return { isPortal, isVDP, carHint, customerName };
  })();

  /* ---------- KNOWLEDGE BASE (50+ patterns) ---------- */
  // Each entry: { keys: [regex|string...], a: '...answer...', actions: [{label, href}], chips: [...] }
  const KB = [
    // === SAVINGS / PRICES BY MODEL ===
    { keys: [/g\s*-?\s*63|ג'?י\s*-?\s*63|מרצדס\s*g/i],
      a: 'G63 AMG — בישראל: ₪2.1M. אצלנו: ₪1.18M.\nחיסכון: ₪915K (כ-44%).\nכולל שילוח, מכס, מע״מ, סטנדרטיזציה ועמלת שירות 5%.',
      chips: ['פתח תיק על G63', 'מה זמן האספקה?', 'דבר עם נציג'] },
    { keys: [/gls\s*450|gls450/i],
      a: 'GLS 450d — בישראל: ₪900K. אצלנו: ₪520K.\nחיסכון: ₪380K (כ-42%).',
      chips: ['פתח תיק על GLS', 'איך זה עובד?'] },
    { keys: [/gle\s*450|gle450/i],
      a: 'GLE 450d — בישראל: ₪750K. אצלנו: ₪460K.\nחיסכון: ₪290K (כ-39%).',
      chips: ['פתח תיק על GLE', 'חישוב חיסכון אישי'] },
    { keys: [/cayenne|קאיין/i],
      a: 'Porsche Cayenne — בישראל: ₪780K. אצלנו: ₪480K.\nחיסכון: ₪300K (כ-38%).',
      chips: ['פתח תיק על Cayenne', 'מה התהליך?'] },
    { keys: [/911|פורשה\s*911/i],
      a: 'Porsche 911 — בישראל: ₪1.2M. אצלנו: ₪740K.\nחיסכון: ₪460K (כ-38%).',
      chips: ['חישוב חיסכון אישי', 'דבר עם נציג'] },
    { keys: [/x5|במוו\s*x5/i],
      a: 'BMW X5 — בישראל: ₪650K. אצלנו: ₪400K.\nחיסכון: ₪250K (כ-38%).',
      chips: ['פתח תיק', 'מה הזמן?'] },
    { keys: [/x7/i],
      a: 'BMW X7 — בישראל: ₪880K. אצלנו: ₪510K.\nחיסכון: ₪370K (כ-42%).',
      chips: ['פתח תיק', 'איך זה עובד?'] },
    { keys: [/m5|m-5/i],
      a: 'BMW M5 — בישראל: ₪1.05M. אצלנו: ₪630K.\nחיסכון: ₪420K (כ-40%).',
      chips: ['פתח תיק', 'דבר עם נציג'] },
    { keys: [/range\s*rover|ריינג\'?\s*רובר/i],
      a: 'Range Rover — בישראל: ₪1.1M. אצלנו: ₪660K.\nחיסכון: ₪440K (כ-40%).',
      chips: ['פתח תיק', 'מה התהליך?'] },
    { keys: [/defender|דיפנדר/i],
      a: 'Land Rover Defender — בישראל: ₪650K. אצלנו: ₪395K.\nחיסכון: ₪255K (כ-39%).',
      chips: ['פתח תיק'] },
    { keys: [/tesla\s*x|טסלה\s*x|model\s*x/i],
      a: 'Tesla Model X — בישראל: ₪620K. אצלנו: ₪380K.\nחיסכון: ₪240K (כ-39%).',
      chips: ['פתח תיק', 'דבר עם נציג'] },
    { keys: [/model\s*s|טסלה\s*s/i],
      a: 'Tesla Model S — בישראל: ₪580K. אצלנו: ₪360K.\nחיסכון: ₪220K (כ-38%).',
      chips: ['פתח תיק'] },
    { keys: [/audi\s*q[78]|אאודי\s*q/i],
      a: 'Audi Q7/Q8 — בישראל: ₪700K. אצלנו: ₪420K.\nחיסכון: ₪280K (כ-40%).',
      chips: ['פתח תיק', 'איך זה עובד?'] },
    { keys: [/rs[6-7]|אר\.?אס/i],
      a: 'Audi RS6/RS7 — בישראל: ₪1.1M. אצלנו: ₪650K.\nחיסכון: ₪450K (כ-41%).',
      chips: ['פתח תיק'] },
    { keys: [/f-?150|ford\s*f|פורד\s*f/i],
      a: 'Ford F-150 Raptor/Lightning — בישראל: ₪550K. אצלנו: ₪310K.\nחיסכון: ₪240K (כ-44%).',
      chips: ['פתח תיק'] },

    // === PROCESS / TIMING ===
    { keys: [/כמה\s*זמן|זמן\s*משלוח|מתי\s*אצלי|אספקה|delivery|when/i],
      a: 'הזמנים שלנו:\n• 72 שעות — הצעה מותאמת אישית\n• 8-12 שבועות — מהזמנה עד מסירה אצלך בבית\n• כולל סטנדרטיזציה ורישוי.',
      chips: ['התחל תהליך', 'מה ההבדל מיבואן רשמי?'] },
    { keys: [/איך\s*זה\s*עובד|תהליך|process|how/i],
      a: '6 שלבים פשוטים:\n1. בוחרים דגם + צבע + תוספות באתר\n2. ₪500 מקדמה + ת״ז + רישיון\n3. אנחנו סורקים את כל ארה״ב ומתחרים בין שותפים\n4. הצעה תוך 72 שעות\n5. רכישה (מזומן או מימון)\n6. עד-הבית — שילוח, מכס, סטנדרטיזציה, רישוי',
      chips: ['פתח תיק עכשיו', 'מה זה כולל?', 'דבר עם נציג'] },
    { keys: [/מקדמה|כמה\s*עולה\s*להתחיל|deposit/i],
      a: '₪500 בלבד לפתיחת תיק.\nאם לא נמצאה התאמה שמתאימה לך — הסכום חוזר במלואו.',
      chips: ['פתח תיק עכשיו', 'איך זה עובד?'] },
    { keys: [/עמלה|עמלת\s*שירות|fee|commission/i],
      a: '5% עמלת שירות שקופה — והכל גלוי בהצעה: רכב, שילוח, מכס, מע״מ.\nאפס רווח-יבואן נסתר.',
      chips: ['ראה דוגמת תמחור', 'התחל תהליך'] },

    // === SAVINGS GENERIC ===
    { keys: [/כמה\s*אחסוך|חיסכון|savings|save/i],
      a: 'החיסכון הממוצע: 38-44% מהמחיר בישראל.\nרוצה חישוב מדויק לדגם ספציפי? בחרו:',
      chips: ['G63', 'GLS 450d', 'Range Rover', 'חישוב חיסכון אישי'] },
    { keys: [/מחשבון|calculator|חשב/i],
      a: 'מחשבון חיסכון אישי — הקלידו תקציב בארה״ב ($) ונחשב בזמן-אמת:',
      calc: true,
      chips: ['פתח תיק', 'דבר עם נציג'] },

    // === TRUST / GUARANTEES ===
    { keys: [/carfax|היסטוריה/i],
      a: 'כן — כל רכב מקבל Carfax מלא חינם.\nבנוסף: PPI (Pre-Purchase Inspection) במכון מורשה בארה״ב לפני רכישה.',
      chips: ['התחל תהליך', 'מה זה PPI?'] },
    { keys: [/ppi|pre.?purchase|בדיקה/i],
      a: 'PPI = בדיקה מקצועית במכון מורשה בארה״ב לפני שאנחנו רוכשים את הרכב.\n200+ נקודות בדיקה. דו״ח מלא בידייך.',
      chips: ['התחל תהליך', 'דבר עם נציג'] },
    { keys: [/אחריות|warranty/i],
      a: 'אחריות יצרן עוברת אתך לישראל (תלוי דגם ויצרן).\nבנוסף: אחריות שירות 12 חודש דרכנו על כל היבוא.',
      chips: ['מה התהליך?', 'דבר עם נציג'] },
    { keys: [/ביטוח|insurance/i],
      a: 'אנחנו עובדים עם שותפי-ביטוח מובילים. הצעת ביטוח מותאמת ניתנת לפני הקנייה.',
      chips: ['דבר עם נציג'] },
    { keys: [/מימון|finance|הלוואה|לוו/i],
      a: 'יש לנו שותפי-מימון בנקאיים. עד 80% מימון, ריבית תחרותית, אישור עקרוני תוך 48 שעות.',
      chips: ['קבל אישור עקרוני', 'דבר עם נציג'] },

    // === COMPARISON ===
    { keys: [/יבואן\s*רשמי|רשמי\s*מול|הבדל\s*בין|vs|מול\s*יבואן/i],
      a: 'יבואן רשמי vs יבוא אישי דרכנו:\n• מחיר: יבואן ₪2.1M / אנחנו ₪1.18M\n• זמן: זהה (8-12 שבועות)\n• אחריות: אצל שניהם\n• תוספות: אצלנו אתה בוחר בדיוק מה שיש בארה״ב\n• שקיפות: 100% אצלנו, 0% אצל היבואן',
      chips: ['G63', 'התחל תהליך', 'דבר עם נציג'] },
    { keys: [/למה\s*זול|איך\s*זה\s*זול|חוקי|legal/i],
      a: 'זה חוקי לחלוטין. יבוא אישי מותר על-פי חוק בישראל.\nאנחנו זולים כי:\n• אין רווח-יבואן (35% מהמחיר בישראל)\n• תחרות בין שותפינו בארה״ב\n• עמלה של 5% בלבד — שקופה',
      chips: ['התחל תהליך', 'מה התהליך?'] },

    // === REGULATIONS ===
    { keys: [/מכס|customs|מיסים|tax/i],
      a: 'מכס + מע״מ + אגרות — כלולים בהצעה.\nמע״מ 17% על מחיר רכב + שילוח. מס קנייה משתנה לפי דגם וזיהום.\nהכל מחושב מראש בהצעה השקופה.',
      chips: ['ראה דוגמת תמחור', 'התחל תהליך'] },
    { keys: [/סטנדרטיזציה|standard|רישוי|license/i],
      a: 'אנחנו מטפלים בכל הסטנדרטיזציה הישראלית + הרישוי במשרד התחבורה. אתה מקבל רכב עם לוחיות.',
      chips: ['מה התהליך?', 'התחל תהליך'] },
    { keys: [/שילוח|shipping|אונייה/i],
      a: 'שילוח ימי מנמלי ארה״ב (NY/LA/Houston) לאשדוד.\nכ-4-6 שבועות. כולל ביטוח מטען מלא.',
      chips: ['מה התהליך?'] },

    // === CONTACT ===
    { keys: [/נציג|אנושי|לדבר|human|agent|טלפון|phone|וואטס/i],
      a: 'בשמחה — אקח ממך פרטים ונציג יחזור תוך 30 דקות:',
      form: true },
    { keys: [/מייל|email|אימייל/i],
      a: 'אפשר לפנות ב-info@autoimports.co.il — או להשאיר טלפון ונחזור תוך 30 דק׳:',
      form: true },
    { keys: [/כתובת|איפה|location|משרד/i],
      a: 'המשרד בתל אביב. פגישות בתיאום מראש.\nרוצה לקבוע פגישה?',
      form: true },

    // === FAQ-EXTRA ===
    { keys: [/yad\s*sheni|יד\s*שניה|used|משומש/i],
      a: 'כן — אנחנו מייבאים גם רכבי-יוקרה משומשים מארה״ב.\nחיסכון לרוב גבוה יותר (40-50%) — אבל תלוי באבטחת-איכות וב-Carfax.',
      chips: ['Carfax', 'התחל תהליך'] },
    { keys: [/חשמלי|ev|electric|hybrid|היברידי/i],
      a: 'התמחות שלנו: Tesla, EQS, iX, Lucid, Rivian — וכל רכב חשמלי/היברידי.\nמטענים מותאמים לישראל מותקנים אצלך.',
      chips: ['Tesla Model X', 'התחל תהליך'] },
    { keys: [/צבע|color|תוספות|options/i],
      a: 'אתה בוחר בדיוק כמו ב-build & price של היצרן.\nכל צבע, כל פנים, כל חבילה — מה שיש בארה״ב, יש לך.',
      chips: ['התחל תהליך', 'דבר עם נציג'] },
    { keys: [/שנה|year|דגם\s*חדש/i],
      a: 'בעיקר דגמים 2024-2026 (חדשים מ-0). אבל אנחנו מייבאים גם 2-3 שנים אחורה לפי דרישה.',
      chips: ['התחל תיק'] },
    { keys: [/בטחון|אמין|trust|reliable|ניסיון/i],
      a: 'אנחנו עם בורד-יועצים בכיר, כיסוי תקשורתי (Calcalist, TheMarker, Globes), ושותפים פיננסיים מהשורה הראשונה.\nכל לקוח מקבל מסמך-תיק מלא בכל שלב.',
      chips: ['התחל תהליך', 'דבר עם נציג'] },
    { keys: [/פורטל|portal|מעקב|status|track/i],
      a: 'אחרי שפותחים תיק — אתה מקבל גישה לפורטל אישי עם:\n• מעקב Live של הרכב (US→ים→מכס→הבית)\n• כל המסמכים\n• צ׳אט-ישיר עם הרכז שלך',
      chips: ['התחל תהליך'] },

    // === GREETINGS ===
    { keys: [/^(שלום|היי|hello|hi|hey|בוקר|ערב)/i],
      a: ctx.customerName
        ? `שלום ${ctx.customerName}! 👋 איך אני יכול לעזור?`
        : 'שלום! 👋 אני העוזר החכם של AutoImports.\nבמה אוכל לעזור?',
      chips: ['כמה אחסוך על G63?', 'איך מתחיל התהליך?', 'דבר עם נציג'] },
    { keys: [/תודה|thanks|thank/i],
      a: 'בשמחה! 🙏 משהו נוסף שאוכל לעזור?',
      chips: ['התחל תהליך', 'דבר עם נציג'] },
    { keys: [/^(כן|yes|אוקיי|ok)$/i],
      a: 'מעולה! מה הדבר הבא שתרצה לדעת?',
      chips: ['חישוב חיסכון', 'איך זה עובד?', 'דבר עם נציג'] },
  ];

  /* ---------- PRICE DATA FOR MINI-CALC ---------- */
  // Rough multipliers from USD → ISR market and USD → AI cost
  const PRICE_MAP = {
    default: { israelMul: 11.3, ourMul: 6.4 },  // generic — ~44% savings
    g63:     { israelMul: 11.3, ourMul: 6.4 },
    gls:     { israelMul: 10.5, ourMul: 6.1 },
    cayenne: { israelMul: 9.2,  ourMul: 5.7 },
    tesla:   { israelMul: 8.8,  ourMul: 5.5 },
  };

  /* ---------- DOM HELPERS ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const ce = (tag, props = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'attrs') Object.entries(v).forEach(([a, b]) => el.setAttribute(a, b));
      else el[k] = v;
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  };

  const nowTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const fmtNIS = (n) => '₪' + Math.round(n).toLocaleString('en-US');

  /* ---------- SVG ICONS ---------- */
  const ICON_BOT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="9" cy="13" r="1.2" fill="currentColor"/><circle cx="15" cy="13" r="1.2" fill="currentColor"/><path d="M9 17h6"/><path d="M12 3v3"/><circle cx="12" cy="2" r="1" fill="currentColor"/></svg>`;
  const ICON_FAB = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22.5V9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12l-6 4.5z"/><circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1.4" fill="currentColor" stroke="none"/><circle cx="20" cy="14" r="1.4" fill="currentColor" stroke="none"/></svg>`;
  const ICON_X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
  const ICON_MIN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>`;
  const ICON_SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
  const ICON_MIC = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/></svg>`;

  /* ---------- BUILD UI ---------- */
  const root = ce('div', { id: 'ai-chatbot-root', attrs: { dir: 'rtl' } });
  document.body.appendChild(root);

  // FAB
  const fab = ce('button', {
    class: 'ai-fab',
    attrs: { 'aria-label': 'פתח עוזר חכם', 'aria-expanded': 'false' },
    html: ICON_FAB
  });
  const badge = ce('span', { class: 'ai-fab-badge', text: '1', attrs: { 'aria-hidden': 'true' } });
  const tooltip = ce('span', { class: 'ai-fab-tooltip', text: 'שאלו מה שתרצו', attrs: { role: 'tooltip' } });
  fab.appendChild(badge);
  fab.appendChild(tooltip);
  root.appendChild(fab);

  // CHAT
  const chat = ce('div', {
    class: 'ai-chat',
    attrs: { role: 'dialog', 'aria-label': 'עוזר חכם AutoImports', 'aria-hidden': 'true' }
  });

  // Header
  const headAvatar = ce('div', { class: 'ai-head-avatar', html: ICON_BOT, attrs: { 'aria-hidden': 'true' } });
  const headMeta = ce('div', { class: 'ai-head-meta' }, [
    ce('div', { class: 'ai-head-name', text: 'AutoImports AI' }),
    ce('div', { class: 'ai-head-status', text: 'פעיל · משיב מיידית' })
  ]);
  const btnMin = ce('button', { class: 'ai-head-btn', html: ICON_MIN, attrs: { 'aria-label': 'מזער' } });
  const btnClose = ce('button', { class: 'ai-head-btn', html: ICON_X, attrs: { 'aria-label': 'סגור' } });
  const head = ce('div', { class: 'ai-head' }, [
    headAvatar, headMeta,
    ce('div', { class: 'ai-head-btns' }, [btnMin, btnClose])
  ]);
  chat.appendChild(head);

  // Body
  const body = ce('div', { class: 'ai-body', attrs: { 'aria-live': 'polite', 'aria-atomic': 'false' } });
  chat.appendChild(body);

  // Input
  const input = ce('textarea', {
    class: 'ai-input',
    attrs: { rows: '1', placeholder: 'הקלידו שאלה...', 'aria-label': 'הקלידו הודעה' }
  });
  const btnMic = ce('button', { class: 'ai-btn-icon', html: ICON_MIC, attrs: { 'aria-label': 'הקלטה קולית', type: 'button' } });
  const btnSend = ce('button', { class: 'ai-btn-icon ai-btn-send', html: ICON_SEND, attrs: { 'aria-label': 'שלח', type: 'button' } });
  const inputWrap = ce('div', { class: 'ai-input-wrap' }, [input, btnMic, btnSend]);
  chat.appendChild(inputWrap);

  // Footer
  chat.appendChild(ce('div', { class: 'ai-foot', text: 'AutoImports.co.il · המודל החדש של רכישת רכב' }));

  root.appendChild(chat);

  /* ---------- STATE ---------- */
  let isOpen = false;
  let messageCount = 0;
  let history = [];
  let lastBotInput = null; // last user input → for follow-up suggestions

  /* ---------- OPEN / CLOSE ---------- */
  function setOpen(open) {
    isOpen = open;
    chat.setAttribute('data-open', open ? 'true' : 'false');
    chat.setAttribute('aria-hidden', open ? 'false' : 'true');
    fab.setAttribute('data-open', open ? 'true' : 'false');
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      badge.setAttribute('data-show', 'false');
      setTimeout(() => input.focus(), 300);
      if (messageCount === 0) startConversation();
    }
  }
  fab.addEventListener('click', () => setOpen(true));
  btnClose.addEventListener('click', () => setOpen(false));
  btnMin.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });

  /* ---------- ADD MESSAGE ---------- */
  function addMessage(from, content, opts = {}) {
    const wrap = ce('div', { class: 'ai-msg', attrs: { 'data-from': from } });
    const bubble = ce('div', { class: 'ai-msg-bubble' });

    if (typeof content === 'string') {
      bubble.textContent = content;
    } else {
      bubble.appendChild(content);
    }
    wrap.appendChild(bubble);

    // Quick actions inside bubble
    if (opts.actions && opts.actions.length) {
      const actions = ce('div', { class: 'ai-actions' });
      opts.actions.forEach(({label, href, onclick}) => {
        const el = href
          ? ce('a', { class: 'ai-action', href, text: label, attrs: { role: 'button' } })
          : ce('button', { class: 'ai-action', text: label, onclick });
        actions.appendChild(el);
      });
      bubble.appendChild(actions);
    }

    // Calc widget
    if (opts.calc) {
      bubble.appendChild(buildCalc());
    }

    // Lead form
    if (opts.form) {
      bubble.appendChild(buildForm());
    }

    wrap.appendChild(ce('div', { class: 'ai-msg-time', text: nowTime() }));

    // Chips
    if (opts.chips && opts.chips.length) {
      const chips = ce('div', { class: 'ai-chips' });
      opts.chips.forEach(label => {
        const c = ce('button', { class: 'ai-chip', text: label, attrs: { type: 'button' } });
        c.addEventListener('click', () => {
          handleUserInput(label);
        });
        chips.appendChild(c);
      });
      wrap.appendChild(chips);
    }

    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    messageCount++;
    history.push({ from, content: typeof content === 'string' ? content : '[widget]' });
  }

  /* ---------- TYPING ---------- */
  function showTyping() {
    const t = ce('div', { class: 'ai-typing', attrs: { 'aria-label': 'הבוט מקליד' } }, [
      ce('span'), ce('span'), ce('span')
    ]);
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  /* ---------- KNOWLEDGE LOOKUP ---------- */
  function findAnswer(text) {
    const t = (text || '').trim();
    if (!t) return null;
    for (const entry of KB) {
      for (const k of entry.keys) {
        if (k instanceof RegExp ? k.test(t) : t.toLowerCase().includes(String(k).toLowerCase())) {
          return entry;
        }
      }
    }
    return null;
  }

  function genericFallback() {
    return {
      a: 'שאלה מצוינת. אני אתחבר אותך לנציג אנושי תוך 30 שניות. רוצה?',
      chips: ['כן, חבר אותי לנציג', 'שאל שאלה אחרת']
    };
  }

  /* ---------- SUGGESTED FOLLOWUPS ---------- */
  function maybeSuggestFollowup() {
    if (messageCount < 5) return;
    // every 4th bot message offer a contextual nudge
    if (messageCount % 4 !== 0) return;
    const carMentioned = lastBotInput && /g63|gls|gle|cayenne|911|x5|x7|m5|tesla|range|defender|audi|f-?150/i.test(lastBotInput);
    if (carMentioned) {
      setTimeout(() => {
        addMessage('bot', 'ראיתי שאתה מתעניין ברכב ספציפי. רוצה לראות איך נראה תהליך-קנייה ב-72 שעות?', {
          chips: ['כן, הראה לי', 'אולי אחר כך'],
          actions: [{ label: 'פתח תיק עכשיו', href: '#intake' }]
        });
      }, 900);
    }
  }

  /* ---------- HANDLE USER INPUT ---------- */
  function handleUserInput(text) {
    const t = (text || '').trim();
    if (!t) return;

    addMessage('user', t);
    input.value = '';
    autoResize();
    lastBotInput = t;

    // Special chip aliases
    const lower = t.toLowerCase();
    if (/(פתח|התחל)\s*(תיק|תהליך)|אינטייק|intake/i.test(t)) {
      typeAndAnswer({
        a: 'מעולה! אני מעביר אותך לטופס פתיחת-תיק.\n₪500 מקדמה (חוזר אם אין התאמה).',
        actions: [{ label: 'פתח תיק עכשיו ←', href: '#intake' }],
        chips: ['מה צריך?', 'דבר עם נציג']
      });
      return;
    }
    if (/חישוב\s*חיסכון|מחשבון/i.test(t)) {
      typeAndAnswer({
        a: 'מחשבון חיסכון אישי — הקלידו תקציב בארה״ב ($):',
        calc: true,
        chips: ['פתח תיק', 'דבר עם נציג']
      });
      return;
    }
    if (/תצוגת\s*לקוח|פורטל|portal/i.test(t)) {
      typeAndAnswer({
        a: 'פורטל הלקוח מאפשר לעקוב Live אחר הרכב: מארה״ב → ים → מכס → הבית.',
        actions: [{ label: 'פתח פורטל ←', href: './portal/' }],
        chips: ['התחל תהליך', 'דבר עם נציג']
      });
      return;
    }

    const found = findAnswer(t) || genericFallback();
    typeAndAnswer(found);
    setTimeout(maybeSuggestFollowup, 1400);
  }

  function typeAndAnswer(entry) {
    const typing = showTyping();
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      typing.remove();
      addMessage('bot', entry.a, {
        chips: entry.chips,
        actions: entry.actions,
        calc: entry.calc,
        form: entry.form
      });
    }, delay);
  }

  /* ---------- MINI CALCULATOR WIDGET ---------- */
  function buildCalc() {
    const wrap = ce('div', { class: 'ai-calc', attrs: { role: 'group', 'aria-label': 'מחשבון חיסכון' } });
    const row = ce('div', { class: 'ai-calc-row' });
    row.appendChild(ce('label', { text: 'תקציב ($):', attrs: { for: 'ai-calc-usd' } }));
    const inp = ce('input', { attrs: { type: 'number', id: 'ai-calc-usd', min: '10000', step: '1000', placeholder: '185000' } });
    row.appendChild(inp);
    wrap.appendChild(row);

    const result = ce('div', { class: 'ai-calc-result' });
    result.innerHTML = '<span>הזן סכום למעלה →</span>';
    wrap.appendChild(result);

    const calcKey = (() => {
      const t = (lastBotInput || '').toLowerCase();
      if (/g63|g-63/.test(t)) return 'g63';
      if (/gls/.test(t)) return 'gls';
      if (/cayenne/.test(t)) return 'cayenne';
      if (/tesla|model\s*[sx]/.test(t)) return 'tesla';
      return 'default';
    })();
    const { israelMul, ourMul } = PRICE_MAP[calcKey] || PRICE_MAP.default;

    inp.addEventListener('input', () => {
      const usd = parseFloat(inp.value) || 0;
      if (usd < 1000) { result.innerHTML = '<span>הזן סכום למעלה →</span>'; return; }
      const israelPrice = usd * israelMul;
      const ourPrice = usd * ourMul;
      const savings = israelPrice - ourPrice;
      const pct = Math.round((savings / israelPrice) * 100);
      result.innerHTML =
        `<div>מחיר בישראל: <strong>${fmtNIS(israelPrice)}</strong></div>
         <div>אצלנו: <strong>${fmtNIS(ourPrice)}</strong></div>
         <div>חיסכון: <strong style="color:#22D3EE">${fmtNIS(savings)} (${pct}%)</strong></div>`;
    });
    return wrap;
  }

  /* ---------- LEAD FORM WIDGET ---------- */
  function buildForm() {
    const form = ce('form', { class: 'ai-form', attrs: { 'aria-label': 'טופס יצירת קשר' } });
    const name = ce('input', { attrs: { type: 'text', name: 'name', placeholder: 'שם מלא', required: 'true', 'aria-label': 'שם' } });
    const phone = ce('input', { attrs: { type: 'tel', name: 'phone', placeholder: 'טלפון', required: 'true', 'aria-label': 'טלפון', pattern: '[0-9\\-\\s+]{9,}' } });
    const car = ce('input', { attrs: { type: 'text', name: 'car', placeholder: 'רכב מעוניין (לא חובה)', 'aria-label': 'רכב' } });
    const btn = ce('button', { text: 'שלח — נציג יתקשר תוך 30 דק׳', attrs: { type: 'submit' } });
    form.append(name, phone, car, btn);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      btn.textContent = '✓ נשלח! נציג בדרך אליך';
      btn.disabled = true;
      // Store to localStorage as a soft lead (no backend)
      try {
        const leads = JSON.parse(localStorage.getItem('ai_leads') || '[]');
        leads.push({ name: name.value, phone: phone.value, car: car.value, ts: Date.now(), ctx });
        localStorage.setItem('ai_leads', JSON.stringify(leads));
      } catch (_) {}
      setTimeout(() => {
        addMessage('bot', 'תודה! פרטיך נקלטו. נציג ייצור איתך קשר בקרוב.\nבינתיים — אפשר לעיין במחירון:', {
          actions: [{ label: 'מחירון Top-10', href: '#board' }],
          chips: ['חזור לשאלה אחרת']
        });
      }, 600);
    });
    return form;
  }

  /* ---------- VOICE INPUT ---------- */
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  let isRecording = false;
  if (Recognition) {
    recognizer = new Recognition();
    recognizer.lang = 'he-IL';
    recognizer.continuous = false;
    recognizer.interimResults = true;
    recognizer.onresult = (e) => {
      let txt = '';
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      input.value = txt;
      autoResize();
    };
    recognizer.onend = () => {
      isRecording = false;
      btnMic.setAttribute('data-active', 'false');
    };
    recognizer.onerror = () => {
      isRecording = false;
      btnMic.setAttribute('data-active', 'false');
    };
  } else {
    btnMic.style.display = 'none';
  }
  btnMic.addEventListener('click', () => {
    if (!recognizer) return;
    if (isRecording) {
      recognizer.stop();
    } else {
      try {
        recognizer.start();
        isRecording = true;
        btnMic.setAttribute('data-active', 'true');
      } catch (_) {}
    }
  });

  /* ---------- INPUT HANDLERS ---------- */
  function autoResize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  }
  input.addEventListener('input', autoResize);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput(input.value);
    }
  });
  btnSend.addEventListener('click', () => handleUserInput(input.value));

  /* ---------- INITIAL CONVERSATION ---------- */
  function startConversation() {
    let greeting;
    let chips;

    if (ctx.isPortal && ctx.customerName) {
      greeting = `שלום ${ctx.customerName}! 👋\nהרכב שלך בתהליך. רוצה בדיקת סטטוס?`;
      chips = ['איפה הרכב כרגע?', 'מתי הוא יגיע?', 'דבר עם הרכז שלי'];
    } else if (ctx.isPortal) {
      greeting = 'שלום! 👋 ברוך הבא לפורטל-הלקוח.\nאיך אוכל לעזור?';
      chips = ['מעקב Live', 'מסמכים', 'דבר עם הרכז שלי'];
    } else if (ctx.isVDP && ctx.carHint) {
      greeting = `שלום! 👋 ראיתי שאתה מסתכל על ${ctx.carHint}.\nרוצה לדעת מה החיסכון הצפוי?`;
      chips = ['כן, חישוב מהיר', 'איך זה עובד?', 'דבר עם נציג'];
    } else {
      greeting = 'שלום! אני העוזר החכם של AutoImports.\nשאלות נפוצות:';
      chips = ['כמה אחסוך על G63?', 'איך מתחיל התהליך?', 'מה ההבדל מיבואן רשמי?', 'כמה זמן עד שהרכב אצלי?'];
    }

    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addMessage('bot', greeting, { chips });
    }, 700);
  }

  /* ---------- AUTO-OPEN HINT (badge after 8s) ---------- */
  setTimeout(() => {
    if (!isOpen) {
      badge.setAttribute('data-show', 'true');
    }
  }, 8000);

  /* ---------- EXPOSE API ---------- */
  window.AutoImportsChat = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    ask: (q) => { setOpen(true); setTimeout(() => handleUserInput(q), 400); }
  };

})();
