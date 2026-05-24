# AutoImports CARS

אתר ייעוץ ויבוא אישי של רכבי יוקרה מארה״ב. עברית RTL, ערכת צבעים כחול+לבן בנוסח Mercedes USA.

## פריסה (Deploy) — קליק אחד

### Vercel (מומלץ - הכי מהיר):
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitteromri-ux/gita-cars)

או ידנית:
1. כנס ל-https://vercel.com/new
2. Import את `gitteromri-ux/gita-cars`
3. Deploy (הגדרות ברירת מחדל)

### Netlify:
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gitteromri-ux/gita-cars)

או:
1. https://app.netlify.com/start
2. בחר את הריפו
3. Deploy

### GitHub Pages:
Settings → Pages → Source: master → Save

## הרצה מקומית

```bash
# Python:
python3 -m http.server 8000

# Node:
npx serve .
```

פתח: http://localhost:8000

## מבנה הקבצים

- `index.html` — דף ראשי
- `css/` — main.css, premium.css, dark-luxe.css, process.css
- `js/` — data.js (קטלוג + FAQ), app.js, process.js
- `videos/` — 14 קליפי מושין (4K)
- `images/` — תמונות רכבים

## עריכת תוכן

- **קטלוג רכבים**: `js/data.js` → מערך `CARS`
- **FAQ**: `js/data.js` → מערך `FAQ`
- **15 שלבי תהליך**: `js/data.js` → מערך `PROCESS_STEPS`
- **טקסטים בעמוד**: `index.html`

## נתונים מהאקסל

- USD/ILS = 2.93
- עמלת שירות = 5%
- מקדמה = ₪500
- שילוח = $2,500
- מע״מ = 18%
- מס קנייה: 43%-101% (בנזין/דיזל), 35%-55% (חשמלי/PHEV)
- חיסכון ממוצע: ₪348,000
- שיא: G580 EQ — ₪1,041,000
