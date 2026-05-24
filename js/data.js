// ============================================
// AutoImports CARS — Master Data (from Excel, 1:1)
// USD/ILS = 2.93
// ============================================

const FX_USD_ILS = 2.93;

const CARS = [
  { rank:1, slug:'mercedes-g63-amg', name:'מרצדס G63 AMG', nameEn:'Mercedes-AMG G63',
    type:'gas-off-road', body:'suv', drivetrain:'4MATIC AWD',
    msrp:184900, purchaseTax:153467, vat:60927, shipping:2000,
    landedUSD:401794, landedNIS:1181274, israelNIS:2100000, israelUSD:714286,
    saveUSD:312492, savePct:78, source:'Carzone',
    note:'החיסכון המוחלט הגבוה ביותר מבין כל הדגמים שמצאנו',
    engine:'V8 Bi-Turbo 4.0L', hp:577, torque:850, zero100:4.5, topSpeed:240,
    transmission:'9G-TRONIC אוטו׳ 9 הילוכים', seats:5, cargo:454, fuel:'בנזין', mpg:13,
    weight:2560, length:4873, width:1984, height:1969, year:2025,
    origin:'Graz, אוסטריה', warranty:'יבואן: ללא | אחריות יבוא אישי 24 חודש',
    colors:[
      {name:'Obsidian Black',code:'#0a0a0a',hex:'שחור אובסידיאן'},
      {name:'Polar White',code:'#f4f4f4',hex:'לבן ארקטי'},
      {name:'Selenite Grey',code:'#5a5a5a',hex:'אפור סלניט'},
      {name:'Hyper Blue',code:'#1c4e80',hex:'כחול היפר'},
      {name:'AMG Green Hell Magno',code:'#3d5b3d',hex:'ירוק AMG מאט'}
    ],
    trims:[
      {name:'G63 Standard', delta:0, items:['ספורט אגזוז', '21" גלגלי AMG', 'תאורת LED']},
      {name:'G63 Manufaktur', delta:18000, items:['עיצוב פנים פרסונלי', 'עור Nappa מורחב', 'תפר ידני']},
      {name:'G63 4×4²', delta:65000, items:['מרכב מוגבה', 'דיפרנציאל אחורי משופר', 'גלגלי 22"'] }
    ],
    packages:[
      {name:'AMG Night Package', price:2950, items:['גריל שחור','חישוקים שחורים','מראות שחור פיאנו']},
      {name:'Burmester High-End 3D Surround', price:4900, items:['ערוץ 27.5','עוצמה 1590W','כיסויי רמקול AMG']},
      {name:'Driver Assistance Plus', price:1950, items:['בקרת שיוט אדפטיבית','שמירת נתיב','חיישני אזעקה']}
    ],
    features:[
      'מערכת אזעקה ובלימה אדפטיביות','בקרת שיוט אדפטיבית','LCD גמיש 12.3" צג כפול',
      'אקלים 4-זונות','חימום מושבים קדמיים ואחוריים','מצלמה היקפית 360°',
      '64 צבעי תאורה אווירה','דלת אחורית חשמלית','מערכת מולטימדיה MBUX',
      'Apple CarPlay & Android Auto אלחוטי','HUD צבעוני','7 דיבוריות'
    ],
    safety:['9 כריות אוויר','ABS+EBD+BAS','ESP / ESC','ASR','בקרת יציבות פעילה','Pre-Safe Brake'],
    fuelTank:100, range:765, towing:3500
  },
  { rank:2, slug:'mercedes-gls-450d', name:'מרצדס GLS 450d', nameEn:'Mercedes-Benz GLS 450d',
    type:'gas-suv', body:'suv', drivetrain:'4MATIC AWD',
    msrp:89200, purchaseTax:74036, vat:29394, shipping:2000,
    landedUSD:195130, landedNIS:573682, israelNIS:1049900, israelUSD:357109,
    saveUSD:161979, savePct:83, source:'Cartube',
    note:'דגל 7-מושבים – הושק מחדש דצמבר 2024',
    engine:'Inline-6 Diesel 3.0L Mild-Hybrid', hp:367, torque:750, zero100:6.1, topSpeed:250,
    transmission:'9G-TRONIC', seats:7, cargo:355, fuel:'דיזל', mpg:24,
    weight:2540, length:5207, width:2030, height:1832, year:2025,
    origin:'Tuscaloosa, אלבמה, ארה״ב', warranty:'יבוא אישי 24 חודש מקיף',
    colors:[
      {name:'Obsidian Black',code:'#0a0a0a',hex:'שחור אובסידיאן'},
      {name:'Polar White',code:'#f4f4f4',hex:'לבן ארקטי'},
      {name:'Cavansite Blue',code:'#1c3257',hex:'כחול קוונסיט'},
      {name:'Emerald Green',code:'#1f3d2e',hex:'ירוק אמרלד'},
      {name:'Selenite Grey',code:'#5a5a5a',hex:'אפור סלניט'}
    ],
    trims:[
      {name:'GLS 450d',delta:0,items:['7 מושבים סטנדרט','גג חשמלי','MBUX 12.3"']},
      {name:'AMG Line',delta:7500,items:['ערכת AMG חיצונית','מושבי ספורט','גלגלי 21"']},
      {name:'GLS 450d Maybach',delta:55000,items:['פנימייה Maybach','מושבי ביזנס אחוריים','שולחנות מתקפלים']}
    ],
    packages:[
      {name:'Executive Rear Seat', price:6200, items:['מסכים אחוריים 11.6"','מקרר','שולחנות']},
      {name:'Driver Assistance', price:2300, items:['Active Distance Assist','כביש אוטונומי','בלימת חירום']},
      {name:'Burmester 3D', price:4500, items:['ערוץ 27','1590W','אקוסטיקה אקטיבית']}
    ],
    features:['7 מושבי עור Nappa','שמשות אטומות אקוסטית','אקלים 5-זונות','גג זכוכית פנורמי',
      'מערכת ניווט מבוסס ענן','בקרת שיוט אקטיבית','חיישני חניה היקפיים','דלת תא מטען חשמלית',
      'תאורת LED Multibeam','חימום מושב + הגה','מצלמה תלת-ממדית','מטען אלחוטי'],
    safety:['Pre-Safe Sound','Active Brake Assist','9 כריות','ESP+'],
    fuelTank:85, range:1300, towing:3500
  },
  { rank:3, slug:'mercedes-g580-eq', name:'מרצדס G580 EQ', nameEn:'Mercedes-Benz G580 with EQ Technology',
    type:'ev-off-road', body:'suv', drivetrain:'4×4 Electric',
    msrp:176450, purchaseTax:91754, vat:48271, shipping:2000,
    landedUSD:223025, landedNIS:655694, israelNIS:1700000, israelUSD:578231,
    saveUSD:355206, savePct:159, source:'Carzone',
    note:'G-Wagen חשמלי – החיסכון המוחלט הגבוה ביותר',
    engine:'4× מנועים חשמליים', hp:579, torque:1164, zero100:4.7, topSpeed:180,
    transmission:'1-מהלכי', seats:5, cargo:454, fuel:'חשמל', mpg:0,
    weight:3085, length:4873, width:1984, height:1986, year:2025,
    origin:'Graz, אוסטריה', warranty:'יבוא אישי 8 שנים על סוללה',
    colors:[
      {name:'MANUFAKTUR Solar Beam Yellow',code:'#f0c220',hex:'צהוב סולאר'},
      {name:'Obsidian Black',code:'#0a0a0a',hex:'שחור'},
      {name:'Polar White',code:'#f4f4f4',hex:'לבן'},
      {name:'Mojave Silver',code:'#a8a39a',hex:'כסף מוחאבי'}
    ],
    trims:[
      {name:'G580 EQ',delta:0,items:['G-Turn','G-Steering','116kWh סוללה']},
      {name:'Edition One',delta:25000,items:['קישוטים בלעדיים','MANUFAKTUR פנימייה','גלגלי 20" יחודיים']}
    ],
    packages:[
      {name:'Off-Road Plus', price:3200, items:['G-Steering','G-Turn','בקרת ירידה']},
      {name:'Burmester 3D', price:4900, items:['רמקולים 15','1590W','3D Surround']},
      {name:'Energizing Comfort', price:1700, items:['עיסוי 4 תוכניות','אווירה רב-צבעית','ניחוח']}
    ],
    features:['G-Turn סיבוב 360° במקום','G-Steering נסיעה אלכסונית','טווח 473 ק״מ WLTP',
      '200kW DC טעינה מהירה','אזעקה חכמה','MBUX היפר-מסך','מצלמה היקפית 360°',
      'מטען AC 11kW','One-Box Solution','OTA עדכוני תוכנה','חימום+קירור מושבים','7 מצבי נסיעה'],
    safety:['Pre-Safe','11 כריות','שלדה מבודדת סוללה','חיישני התנגשות'],
    battery:116, range:473, charging:200
  },
  { rank:4, slug:'lucid-air-pure', name:'Lucid Air Pure', nameEn:'Lucid Air Pure (Base)',
    type:'ev-sedan', body:'sedan', drivetrain:'RWD Electric',
    msrp:69900, purchaseTax:36348, vat:19123, shipping:2000,
    landedUSD:127871, landedNIS:375941, israelNIS:800000, israelUSD:272109,
    saveUSD:144238, savePct:113, source:'אין יבואן רשמי',
    note:'הערכה. אין יבואן בארץ – יבוא אישי הוא הדרך היחידה',
    engine:'מנוע חשמלי אחורי יחיד', hp:430, torque:550, zero100:4.5, topSpeed:225,
    transmission:'1-מהלכי', seats:5, cargo:609, fuel:'חשמל', mpg:0,
    weight:2280, length:4975, width:1939, height:1410, year:2025,
    origin:'Casa Grande, אריזונה, ארה״ב', warranty:'יבוא אישי 4 שנים מקיף + 8 שנים סוללה',
    colors:[
      {name:'Stellar White',code:'#f4f4f4',hex:'לבן Stellar'},
      {name:'Cosmos Silver',code:'#9aa0a8',hex:'כסף Cosmos'},
      {name:'Infinite Black',code:'#0a0a0a',hex:'שחור Infinite'},
      {name:'Cobalt Blue',code:'#1c4ea8',hex:'כחול Cobalt'},
      {name:'Quantum Grey',code:'#4a4d52',hex:'אפור Quantum'}
    ],
    trims:[
      {name:'Air Pure',delta:0,items:['גלגלי 19"','סוללה 88kWh','טווח 660 ק״מ']},
      {name:'Air Pure AWD',delta:8000,items:['הנעה כפולה','480 כ״ס','0-100 ב-3.8 ש״']},
      {name:'Air Touring',delta:18000,items:['620 כ״ס','גלגלי 20"','קרמיקה זכוכית']}
    ],
    packages:[
      {name:'DreamDrive Pro', price:9200, items:['נהיגה אוטונומית מתקדמת','חיישני LIDAR','5 מצלמות']},
      {name:'Surreal Sound Pro', price:4000, items:['רמקולים 21','אקוסטיקה Dolby Atmos','מערכת 5.1.4']},
      {name:'Stealth Look', price:6000, items:['ערכה שחורה מלאה','חישוקים 21" מאט','כרום שחור']}
    ],
    features:['גלאסקוקפיט 34" מסך','שטח פנים גדול ביותר בקטגוריה','טווח 660 ק״מ EPA',
      '900V ארכיטקטורה','טעינה DC 300kW','OTA עדכונים','בקרת אקלים מולטי-זונה',
      'מושבי עור צמחוני','גג זכוכית','חימום+קירור מושבים','מצלמת היקף 360°','HUD AR'],
    safety:['ADAS DreamDrive Pro','חיישני LIDAR','בקרת התנגשות','שמירת נתיב'],
    battery:88, range:660, charging:300
  },
  { rank:5, slug:'mercedes-g500', name:'מרצדס G500', nameEn:'Mercedes-Benz G500',
    type:'gas-off-road', body:'suv', drivetrain:'4MATIC AWD',
    msrp:156900, purchaseTax:130227, vat:51701, shipping:2000,
    landedUSD:341328, landedNIS:1003504, israelNIS:1450000, israelUSD:493197,
    saveUSD:151869, savePct:44, source:'Carzone',
    note:'G-Wagen בנזין אייקוני – חיסכון מאומת ענק',
    engine:'I6 Turbo + EQ Boost 3.0L', hp:443, torque:560, zero100:5.4, topSpeed:210,
    transmission:'9G-TRONIC', seats:5, cargo:454, fuel:'בנזין', mpg:18,
    weight:2453, length:4873, width:1931, height:1969, year:2025,
    origin:'Graz, אוסטריה', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Obsidian Black',code:'#0a0a0a',hex:'שחור אובסידיאן'},
      {name:'Polar White',code:'#f4f4f4',hex:'לבן ארקטי'},
      {name:'Olivine Green',code:'#3a4a37',hex:'ירוק זית'},
      {name:'Brilliant Blue',code:'#26568a',hex:'כחול בריליאנט'},
      {name:'Diamond White',code:'#e8e6e0',hex:'לבן יהלום מטאלי'}
    ],
    trims:[
      {name:'G500',delta:0,items:['גלגלי 19"','MBUX 12.3"','אקלים דו-זונתי']},
      {name:'AMG Line',delta:7000,items:['ערכת AMG','גלגלי 20"','מושבי ספורט']},
      {name:'Manufaktur',delta:22000,items:['צביעה ידנית','עור פרסונלי','קישוטי עץ']}
    ],
    packages:[
      {name:'Off-Road Pro', price:2500, items:['3 דיפרנציאלים נעולים','Low Range','חיישני שטח']},
      {name:'Burmester', price:4500, items:['רמקולים 15','590W','3D Surround']},
      {name:'Night Package', price:2200, items:['גריל שחור','כרום שחור','חישוקים שחורים']}
    ],
    features:['3 דיפרנציאלים נעולים','מצלמת היקף 360°','אקלים 2-זונות','חימום מושבים',
      'גלגלי 19" סטנדרט','MBUX 12.3"','Apple CarPlay אלחוטי','דיוויזורים פנורמיים',
      'מצב שטח','התקנת מוביילאי','חיישני חניה היקפיים','דלת אחורית עם גלגל חירום'],
    safety:['9 כריות','Pre-Safe','בלימה אקטיבית','ESP+'],
    fuelTank:100, range:600, towing:3500
  },
  { rank:6, slug:'chevy-tahoe-high-country', name:'שברולט טאהו High Country', nameEn:'Chevrolet Tahoe High Country',
    type:'gas-suv', body:'suv', drivetrain:'4WD',
    msrp:62595, purchaseTax:51953, vat:20621, shipping:2000,
    landedUSD:137669, landedNIS:404747, israelNIS:779990, israelUSD:265303,
    saveUSD:127634, savePct:93, source:'UMI רשמי',
    note:'הושק בארץ ביוני 2025 – שוק טרי',
    engine:'V8 5.3L EcoTec3', hp:355, torque:518, zero100:7.2, topSpeed:200,
    transmission:'10-מהלכים אוטו׳', seats:8, cargo:722, fuel:'בנזין', mpg:18,
    weight:2520, length:5352, width:2057, height:1925, year:2025,
    origin:'Arlington, טקסס, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Black',code:'#0a0a0a',hex:'שחור'},
      {name:'Iridescent Pearl Tricoat',code:'#e8e6e0',hex:'לבן פנינה'},
      {name:'Empire Beige Metallic',code:'#b9a98a',hex:'בז׳ אימפריה'},
      {name:'Lakeshore Blue',code:'#1a3a5a',hex:'כחול אגם'},
      {name:'Sterling Grey',code:'#7a7d82',hex:'אפור סטרלינג'}
    ],
    trims:[
      {name:'LS',delta:-15000,items:['בסיסי','גלגלי 18"','בד']},
      {name:'LT',delta:-8000,items:['עור','LED','MyLink 10.2"']},
      {name:'High Country',delta:0,items:['Magnetic Ride','גלגלי 22"','Bose 14','גג פנורמי']}
    ],
    packages:[
      {name:'Super Cruise', price:2200, items:['נהיגה ללא ידיים','מפות מיוחדות','שמירת נתיב מתקדמת']},
      {name:'Max Trailering', price:880, items:['גרירה 3,856 ק"ג','דיפרנציאל נעול','בלמי טריילר']},
      {name:'Off-Road Z71', price:2900, items:['בולמים Rancho','גלגלי שטח','להגנה תחתית']}
    ],
    features:['8 מושבים','Magnetic Ride Control אוטו׳','גג פנורמי','Bose 14 רמקולים',
      'MyLink HD 10.2"','3 צגי בידור אחוריים אופציה','HUD','חימום+קירור מושבים',
      'דלת אחורית חשמלית','גרירה 3,402 ק"ג','Air Ride Adaptive','גלגלי 22"'],
    safety:['10 כריות','Forward Collision Alert','Lane Keep Assist','Rear Pedestrian Alert'],
    fuelTank:91, range:760, towing:3402
  },
  { rank:7, slug:'bmw-x7-xdrive40i', name:'BMW X7 xDrive40i', nameEn:'BMW X7 xDrive40i',
    type:'gas-suv', body:'suv', drivetrain:'xDrive AWD',
    msrp:84300, purchaseTax:69969, vat:27783, shipping:2000,
    landedUSD:184552, landedNIS:542583, israelNIS:900000, israelUSD:306122,
    saveUSD:121570, savePct:66, source:'Cartube',
    note:'דגל 7 מושבים יוקרתי',
    engine:'I6 Turbo 3.0L Mild-Hybrid', hp:380, torque:540, zero100:5.8, topSpeed:240,
    transmission:'8-Speed Steptronic', seats:7, cargo:300, fuel:'בנזין', mpg:21,
    weight:2440, length:5181, width:2000, height:1805, year:2025,
    origin:'Spartanburg, דרום קרוליינה, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Black Sapphire',code:'#0a0a0a',hex:'שחור ספיר'},
      {name:'Alpine White',code:'#f4f4f4',hex:'לבן אלפיני'},
      {name:'Mineral White',code:'#dcdad4',hex:'לבן מינרל'},
      {name:'Tanzanite Blue II',code:'#1c3257',hex:'כחול טנזניט'},
      {name:'Brooklyn Grey',code:'#5a5d62',hex:'אפור ברוקלין'}
    ],
    trims:[
      {name:'xDrive40i',delta:0,items:['I6 הייבריד מתון','גלגלי 21"','iDrive 8.5']},
      {name:'M60i xDrive',delta:25000,items:['V8 4.4L','523 כ״ס','בלמים M-Sport']},
      {name:'Alpina XB7',delta:80000,items:['630 כ״ס','גלגלי 23"','ערכת Alpina']}
    ],
    packages:[
      {name:'M Sport', price:4500, items:['ערכת M','גלגלי 22"','בלמים גדולים']},
      {name:'Driving Assistance Pro', price:2400, items:['Highway Assistant','Lane Change','Park']},
      {name:'Bowers & Wilkins Diamond', price:3400, items:['20 רמקולים','1,500W','אלומיניום']}
    ],
    features:['7 מושבי עור','Live Cockpit Pro Curved 12.3+14.9"','גג פנורמי Sky Lounge LED',
      'אקלים 5-זונות','מפתח דיגיטלי','BMW IconicSounds','חימום+קירור מושבים',
      'הגה M Sport','דלת אחורית חשמלית','מצלמת היקף','Touch Command אחורי','OS 8.5'],
    safety:['9 כריות','Active Driving Assistant','Frontal Collision Warning','Park Distance'],
    fuelTank:83, range:980, towing:3400
  },
  { rank:8, slug:'tesla-model-x-lr', name:'טסלה Model X Long Range', nameEn:'Tesla Model X Long Range',
    type:'ev-suv', body:'suv', drivetrain:'AWD Dual Motor',
    msrp:79990, purchaseTax:41595, vat:21879, shipping:2000,
    landedUSD:145964, landedNIS:429134, israelNIS:729713, israelUSD:248201,
    saveUSD:102237, savePct:70, source:'Yad2',
    note:'יבוא EV המאומת הטוב ביותר',
    engine:'2× מנועים חשמליים', hp:670, torque:838, zero100:3.9, topSpeed:250,
    transmission:'1-מהלכי', seats:6, cargo:357, fuel:'חשמל', mpg:0,
    weight:2459, length:5057, width:2024, height:1684, year:2025,
    origin:'Fremont, קליפורניה, ארה״ב', warranty:'יבוא אישי 4/8 (רכב/סוללה)',
    colors:[
      {name:'Pearl White Multi-Coat',code:'#f4f4f4',hex:'לבן פנינה'},
      {name:'Solid Black',code:'#0a0a0a',hex:'שחור'},
      {name:'Midnight Silver',code:'#3e3e44',hex:'כסף לילה'},
      {name:'Deep Blue Metallic',code:'#1a2950',hex:'כחול עמוק'},
      {name:'Ultra Red',code:'#9e1e1e',hex:'אדום אולטרה'}
    ],
    trims:[
      {name:'Long Range',delta:0,items:['670 כ״ס','טווח 560 ק"מ','0-100 ב-3.9']},
      {name:'Plaid',delta:20000,items:['1,020 כ״ס','3 מנועים','0-100 ב-2.6']}
    ],
    packages:[
      {name:'Full Self-Driving', price:8000, items:['ניווט אוטומטי','שינוי נתיב','חניה אוטו']},
      {name:'Premium Connectivity', price:99, items:['ניווט בזמן אמת','מוסיקה זרימה','דפדפן']},
      {name:'Yoke Steering', price:1000, items:['הגה מלבני','חישוקים 22" Turbine']}
    ],
    features:['6/7 מושבים אופציונלי','דלתות פלקון בג Vertically','גג זכוכית פנורמי',
      'מסך 17" אחיד','HEPA Bioweapon Defense','Sentry Mode','Dog Mode','Camp Mode',
      'מטענים אלחוטיים','אקלים HEPA','שמע 22 רמקולים','OTA עדכונים'],
    safety:['Autopilot סטנדרט','שמירת נתיב','בלימה אוטו','התנגשות צד'],
    battery:100, range:560, charging:250
  },
  { rank:9, slug:'mercedes-s580e', name:'מרצדס S580e PHEV', nameEn:'Mercedes-Benz S580e Plug-in Hybrid',
    type:'phev-sedan', body:'sedan', drivetrain:'AWD',
    msrp:114800, purchaseTax:95284, vat:37827, shipping:2000,
    landedUSD:250411, landedNIS:736208, israelNIS:1050000, israelUSD:357143,
    saveUSD:106732, savePct:43, source:'auto.co.il',
    note:'סדאן הדגל של מרצדס',
    engine:'I6 Turbo 3.0L + מנוע חשמלי', hp:510, torque:750, zero100:5.0, topSpeed:250,
    transmission:'9G-TRONIC', seats:5, cargo:395, fuel:'בנזין+חשמל', mpg:28,
    weight:2295, length:5289, width:1921, height:1503, year:2025,
    origin:'Sindelfingen, גרמניה', warranty:'יבוא אישי 4 שנים',
    colors:[
      {name:'Obsidian Black',code:'#0a0a0a',hex:'שחור אובסידיאן'},
      {name:'Diamond White',code:'#e8e6e0',hex:'לבן יהלום'},
      {name:'Selenite Grey',code:'#5a5a5a',hex:'אפור סלניט'},
      {name:'Nautical Blue',code:'#1c3a6e',hex:'כחול נאוטי'},
      {name:'Emerald Green',code:'#1f3d2e',hex:'ירוק אמרלד'}
    ],
    trims:[
      {name:'S580e',delta:0,items:['MBUX היפר-מסך','בולמי אוויר','גלגלי 19"']},
      {name:'AMG Line',delta:8500,items:['ערכת AMG','גלגלי 20"','דוושות ספורט']},
      {name:'Maybach',delta:80000,items:['Maybach טיפול','שולחנות אחוריים','עיסוי אקטיבי']}
    ],
    packages:[
      {name:'Executive Rear', price:7800, items:['Air Balance','מסכים 11.6"','מקרר']},
      {name:'Driver Assistance Pro', price:2800, items:['Drive Pilot','Active Distance','Park']},
      {name:'Burmester 4D', price:6700, items:['רמקולים 31','1,750W','גולגלות עור']}
    ],
    features:['בולמי AIRMATIC','MBUX היפר-מסך 12.8+12.3"','גג זכוכית פנורמי','HUD AR צבעוני',
      'אקלים 4-זונות','עיסוי 10 תוכניות','חימום+קירור מושבים','שלוש שכבות זכוכית',
      'מערכת ניווט המוגדרת על מפות 3D','דלת חכמה','Burmester','מטענים אלחוטיים'],
    safety:['Pre-Safe Sound','Active Brake Assist','9 כריות','Active Steering Assist'],
    battery:28.6, range:120, fuelTank:65, evRange:120
  },
  { rank:10, slug:'ford-bronco-raptor', name:'Ford Bronco Raptor', nameEn:'Ford Bronco Raptor',
    type:'gas-off-road', body:'suv', drivetrain:'4WD',
    msrp:71995, purchaseTax:59756, vat:23720, shipping:2000,
    landedUSD:157971, landedNIS:464435, israelNIS:805000, israelUSD:273810,
    saveUSD:115839, savePct:73, source:'auto.co.il',
    note:'יבוא מקביל בלבד בגרסה זו',
    engine:'V6 EcoBoost 3.0L Twin-Turbo', hp:418, torque:597, zero100:5.7, topSpeed:177,
    transmission:'10-מהלכים אוטו׳', seats:5, cargo:632, fuel:'בנזין', mpg:15,
    weight:2510, length:4811, width:2189, height:1971, year:2025,
    origin:'Wayne, מישיגן, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Code Orange',code:'#e85d1f',hex:'כתום קוד'},
      {name:'Shadow Black',code:'#0a0a0a',hex:'שחור צל'},
      {name:'Eruption Green',code:'#3d6840',hex:'ירוק התפרצות'},
      {name:'Velocity Blue',code:'#1c4e9e',hex:'כחול מהירות'},
      {name:'Oxford White',code:'#f4f4f4',hex:'לבן אוקספורד'}
    ],
    trims:[
      {name:'Raptor',delta:0,items:['בולמי FOX 3.1','גלגלי 37"','HOSS 4.0']},
      {name:'Raptor R',delta:20000,items:['ערכה אדומה','דקור פנים מיוחד','גלגלי שטח']}
    ],
    packages:[
      {name:'Lux', price:5000, items:['B&O','HUD','עור מורחב']},
      {name:'Carbon Fiber', price:4900, items:['פנים סיב פחמן','גג סיב','מראות']},
      {name:'Bronco360', price:1295, items:['מצלמות 360°','מצלמת שטח קדמית','חיישנים']}
    ],
    features:['HOSS 4.0 בולמי FOX 3.1 לייב-וולב','7 מצבי שטח G.O.A.T.','גג נשלף',
      'דלתות נשלפות','חישוקי בידוד 17"','Trail Toolbox','SYNC 4 12"','B&O 10 רמקולים',
      'אקלים 2-זונות','חימום מושבים','דיפרנציאל נעול','TruClimb'],
    safety:['Co-Pilot360','Pre-Collision Brake','Blind Spot','Lane Keep'],
    fuelTank:87, range:580, towing:1814
  },
  { rank:11, slug:'ford-f150-raptor', name:'Ford F-150 Raptor', nameEn:'Ford F-150 Raptor',
    type:'gas-pickup', body:'pickup', drivetrain:'4WD',
    msrp:59985, purchaseTax:49788, vat:19761, shipping:2000,
    landedUSD:132034, landedNIS:388180, israelNIS:680000, israelUSD:231293,
    saveUSD:99259, savePct:75, source:'Carzone',
    note:'הטנדר האמריקאי האייקוני ביותר',
    engine:'V6 EcoBoost 3.5L Twin-Turbo', hp:450, torque:691, zero100:5.1, topSpeed:200,
    transmission:'10-Speed', seats:5, cargo:1486, fuel:'בנזין', mpg:15,
    weight:2640, length:5890, width:2200, height:2027, year:2025,
    origin:'Dearborn, מישיגן, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Avalanche Grey',code:'#7a7d82',hex:'אפור אבלנש'},
      {name:'Antimatter Blue',code:'#1c4e9e',hex:'כחול אנטי-חומר'},
      {name:'Code Orange',code:'#e85d1f',hex:'כתום קוד'},
      {name:'Agate Black',code:'#0a0a0a',hex:'שחור אגאט'},
      {name:'Oxford White',code:'#f4f4f4',hex:'לבן'}
    ],
    trims:[
      {name:'Raptor 37',delta:0,items:['FOX Live-Valve','37" גלגלים','BeadLock']},
      {name:'Raptor R',delta:35000,items:['V8 5.2L סופרצ׳ארג','720 כ״ס','אגזוז גרון']}
    ],
    packages:[
      {name:'801A Lux', price:9500, items:['Recaro מושבי ספורט','B&O Unleashed','גג פנורמי']},
      {name:'Tow Tech', price:1200, items:['Pro Trailer Backup','Tow/Haul','Hitch Assist']},
      {name:'Off-Road Camera', price:790, items:['מצלמה תחתית','360°','Trail View']}
    ],
    features:['FOX Live-Valve 3.1 בולמים','37" Goodyear Wrangler','SYNC 4 12"','B&O Unleashed 18 רמקולים',
      'מצלמות 360°','דיפרנציאל נעול 4WD','חימום+קירור מושבים','דוושות חשמליות',
      'גרירה 3,584 ק"ג','גג פנורמי','Off-Road Modes 7','Trail Turn Assist'],
    safety:['Co-Pilot360','Pre-Collision','BLIS','Lane Keep'],
    fuelTank:136, range:760, towing:3584
  },
  { rank:12, slug:'mercedes-gle-450d', name:'מרצדס GLE 450d', nameEn:'Mercedes-Benz GLE 450d',
    type:'gas-suv', body:'suv', drivetrain:'4MATIC AWD',
    msrp:72100, purchaseTax:59843, vat:23754, shipping:2000,
    landedUSD:158197, landedNIS:465099, israelNIS:784900, israelUSD:267007,
    saveUSD:108810, savePct:69, source:'cmotors.co.il',
    note:'SUV יוקרה בינוני',
    engine:'I6 Diesel 3.0L Mild-Hybrid', hp:367, torque:750, zero100:5.6, topSpeed:250,
    transmission:'9G-TRONIC', seats:5, cargo:630, fuel:'דיזל', mpg:28,
    weight:2245, length:4924, width:2018, height:1779, year:2025,
    origin:'Tuscaloosa, אלבמה, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Obsidian Black',code:'#0a0a0a',hex:'שחור'},
      {name:'Polar White',code:'#f4f4f4',hex:'לבן'},
      {name:'Selenite Grey',code:'#5a5a5a',hex:'אפור סלניט'},
      {name:'Cavansite Blue',code:'#1c3257',hex:'כחול קוונסיט'},
      {name:'Emerald Green',code:'#1f3d2e',hex:'ירוק אמרלד'}
    ],
    trims:[
      {name:'GLE 450d',delta:0,items:['MBUX','גלגלי 19"','בולמי אוויר אופציה']},
      {name:'AMG Line',delta:6500,items:['ערכת AMG','גלגלי 20"','דוושות ספורט']}
    ],
    packages:[
      {name:'Premium Plus', price:4800, items:['HUD','גג זכוכית','Burmester']},
      {name:'Off-Road Engineering', price:2700, items:['Air Suspension','בקרת ירידה','מצלמת שטח']},
      {name:'Driver Assistance', price:2200, items:['Active Distance','Lane Keep','Park Pilot']}
    ],
    features:['MBUX 12.3"','בולמי אוויר AIRMATIC','חימום+קירור מושבים','גג זכוכית',
      'מצלמת היקף 360°','אקלים 4-זונות','שלוש כניסות USB-C','שמע Burmester',
      'דלת אחורית חשמלית','גריל יהלום','5 מושבים','ESP+'],
    safety:['9 כריות','Pre-Safe','Active Brake','ESP'],
    fuelTank:85, range:1300, towing:3500
  },
  { rank:13, slug:'tesla-cybertruck-awd', name:'טסלה Cybertruck AWD', nameEn:'Tesla Cybertruck AWD',
    type:'ev-pickup', body:'pickup', drivetrain:'AWD Dual Motor',
    msrp:79990, purchaseTax:41595, vat:21879, shipping:2000,
    landedUSD:145964, landedNIS:429134, israelNIS:700000, israelUSD:238095,
    saveUSD:92131, savePct:63, source:'הגבלות יבוא משוריינת',
    note:'אין יבואן רשמי – ביקוש חזק',
    engine:'2× מנועים חשמליים', hp:600, torque:734, zero100:4.1, topSpeed:180,
    transmission:'1-מהלכי', seats:5, cargo:1903, fuel:'חשמל', mpg:0,
    weight:3104, length:5683, width:2030, height:1791, year:2025,
    origin:'Austin, טקסס, ארה״ב', warranty:'יבוא אישי 4 שנים + 8 שנים סוללה',
    colors:[
      {name:'Stainless Steel',code:'#a8aaad',hex:'פלדת אל-חלד'},
      {name:'Silver Wrap',code:'#9aa0a8',hex:'עטיפת כסף'},
      {name:'Black Wrap',code:'#0a0a0a',hex:'עטיפת שחור'},
      {name:'Beast Wrap',code:'#7a0e0e',hex:'עטיפת ביסט'}
    ],
    trims:[
      {name:'AWD',delta:0,items:['600 כ"ס','טווח 547 ק"מ','0-100 ב-4.1']},
      {name:'Cyberbeast',delta:20000,items:['845 כ"ס','3 מנועים','0-100 ב-2.6']}
    ],
    packages:[
      {name:'Full Self-Driving', price:8000, items:['ניווט אוטו','שינוי נתיב','חניה']},
      {name:'Powershare', price:1700, items:['V2L 11.5kW','V2H','חשמל לבית']},
      {name:'Performance', price:6500, items:['Locker','Off-Road Modes','בקרת ירידה']}
    ],
    features:['גוף פלדת אל-חלד 3mm','חלון Tesla Armor','מסך 18.5" אחיד','מצלמת היקף 360°',
      'Sentry Mode','Powershare V2L','חיישני קרבה','גג חשמלי נשלף','11.5kW V2L',
      'Bioweapon Defense','Glass Cockpit','אגזוז משוכלל'],
    safety:['Autopilot','שמירת נתיב','בלימה אוטו','Crumple Zones'],
    battery:123, range:547, charging:250, towing:5000
  },
  { rank:14, slug:'bmw-x5-xdrive40i', name:'BMW X5 xDrive40i', nameEn:'BMW X5 xDrive40i',
    type:'gas-suv', body:'suv', drivetrain:'xDrive AWD',
    msrp:67300, purchaseTax:55859, vat:22172, shipping:2000,
    landedUSD:147831, landedNIS:434623, israelNIS:685900, israelUSD:233299,
    saveUSD:85468, savePct:58, source:'cmotors.co.il',
    note:'חיסכון חזק מאומת',
    engine:'I6 Turbo 3.0L Mild-Hybrid', hp:375, torque:520, zero100:5.4, topSpeed:240,
    transmission:'8-Speed', seats:5, cargo:650, fuel:'בנזין', mpg:25,
    weight:2185, length:4922, width:2004, height:1745, year:2025,
    origin:'Spartanburg, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Black Sapphire',code:'#0a0a0a',hex:'שחור ספיר'},
      {name:'Alpine White',code:'#f4f4f4',hex:'לבן אלפיני'},
      {name:'M Carbon Black',code:'#1c1d22',hex:'שחור M Carbon'},
      {name:'Phytonic Blue',code:'#1c3257',hex:'כחול Phytonic'},
      {name:'Brooklyn Grey',code:'#5a5d62',hex:'אפור ברוקלין'}
    ],
    trims:[
      {name:'xDrive40i',delta:0,items:['I6 הייבריד','MBUX 12.3"','גלגלי 20"']},
      {name:'M60i xDrive',delta:22000,items:['V8 4.4L','523 כ"ס','M-Sport']},
      {name:'X5M',delta:50000,items:['617 כ"ס','בלמי M','גלגלי 22"']}
    ],
    packages:[
      {name:'M Sport', price:3800, items:['ערכת M','גלגלי 21"','בלמי M']},
      {name:'Premium', price:3200, items:['HUD','HK 16','גג זכוכית']},
      {name:'Driving Assistance Pro', price:1700, items:['Highway Assistant','שינוי נתיב','Park']}
    ],
    features:['Live Cockpit Curved 12.3+14.9"','iDrive 8.5','גג פנורמי','חימום+קירור מושבים',
      'אקלים 4-זונות','HK 16 רמקולים','מצלמת היקף','מפתח דיגיטלי','OS 8.5',
      'BMW IconicSounds','מטענים אלחוטיים','HUD'],
    safety:['Active Driving Assistant','Frontal Collision','BLIS','Park Distance'],
    fuelTank:83, range:1000, towing:3500
  },
  { rank:15, slug:'ford-bronco-big-bend', name:'Ford Bronco Big Bend', nameEn:'Ford Bronco Big Bend',
    type:'gas-off-road', body:'suv', drivetrain:'4WD',
    msrp:34465, purchaseTax:28606, vat:11357, shipping:2000,
    landedUSD:76928, landedNIS:226168, israelNIS:399900, israelUSD:136020,
    saveUSD:59092, savePct:77, source:'iCar',
    note:'החיסכון הגבוה ביותר בקטגוריה אחרי טאהו',
    engine:'I4 EcoBoost 2.3L Turbo', hp:300, torque:441, zero100:6.5, topSpeed:170,
    transmission:'7-Speed Manual / 10-Speed Auto', seats:5, cargo:601, fuel:'בנזין', mpg:20,
    weight:2150, length:4811, width:1928, height:1849, year:2025,
    origin:'Wayne, מישיגן, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Cactus Grey',code:'#8a8b80',hex:'אפור קקטוס'},
      {name:'Shadow Black',code:'#0a0a0a',hex:'שחור צל'},
      {name:'Azure Grey',code:'#3a5870',hex:'אפור אזוריטי'},
      {name:'Eruption Green',code:'#3d6840',hex:'ירוק התפרצות'},
      {name:'Race Red',code:'#a01818',hex:'אדום מירוץ'}
    ],
    trims:[
      {name:'Base',delta:-3000,items:['בסיסי','גלגלי 16"','בד']},
      {name:'Big Bend',delta:0,items:['חישוקי 17"','חזית כרום','SYNC 4 8"']},
      {name:'Wildtrak',delta:11000,items:['גלגלי 35"','HOSS 3.0','SYNC 4 12"']}
    ],
    packages:[
      {name:'Mid', price:2200, items:['SYNC 4','חימום מושבים','חניה']},
      {name:'Sasquatch', price:5495, items:['35" שטח','BeadLock','דיפ נעול']},
      {name:'Lux', price:5500, items:['B&O','עור','HUD']}
    ],
    features:['G.O.A.T 7 מצבי שטח','גג נשלף 4 חלקים','דלתות נשלפות','SYNC 4',
      'דיפרנציאל נעול אחורי','בולמי Bilstein','חלון אחורי נפתח','חישוקים 17" בסיס',
      'Trail Toolbox','OBD שטח','חימום מושבים','5 מושבים'],
    safety:['Co-Pilot360','Pre-Collision Brake','Blind Spot','Lane Keep'],
    fuelTank:80, range:680, towing:1587
  },
  { rank:16, slug:'mustang-gt-v8', name:'Ford Mustang GT V8', nameEn:'Ford Mustang GT (V8)',
    type:'gas-sport', body:'sport', drivetrain:'RWD',
    msrp:38395, purchaseTax:31868, vat:12648, shipping:2000,
    landedUSD:85411, landedNIS:251108, israelNIS:425000, israelUSD:144558,
    saveUSD:59147, savePct:69, source:'auto.co.il',
    note:'הושק רשמית בארץ ב-אפריל 2024 בלבד',
    engine:'V8 5.0L Coyote', hp:480, torque:563, zero100:4.4, topSpeed:250,
    transmission:'6-Speed Manual / 10-Speed Auto', seats:4, cargo:382, fuel:'בנזין', mpg:21,
    weight:1740, length:4811, width:1916, height:1402, year:2025,
    origin:'Flat Rock, מישיגן, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Race Red',code:'#a01818',hex:'אדום מירוץ'},
      {name:'Shadow Black',code:'#0a0a0a',hex:'שחור צל'},
      {name:'Iconic Silver',code:'#9aa0a8',hex:'כסף אייקוני'},
      {name:'Vapor Blue',code:'#5a7eab',hex:'כחול אדים'},
      {name:'Grabber Blue',code:'#1c4e9e',hex:'כחול Grabber'},
      {name:'Yellow Splash',code:'#f0c220',hex:'צהוב Splash'}
    ],
    trims:[
      {name:'GT',delta:0,items:['V8 480 כ"ס','בלמי Brembo','חישוקי 19"']},
      {name:'GT Premium',delta:5000,items:['B&O 12','עור','SYNC 4']},
      {name:'Dark Horse',delta:15000,items:['500 כ"ס','MagneRide','גלגלי 19" Track']}
    ],
    packages:[
      {name:'Performance', price:4995, items:['MagneRide','PP1 Suspension','חישוקי 19" Track']},
      {name:'Active Valve Exhaust', price:1225, items:['אגזוז מתכוון','מצבי Track','Sport']},
      {name:'Recaro Seats', price:1995, items:['מושבי Recaro','עור','חימום']}
    ],
    features:['Digital Cluster 12.4"','SYNC 4 13.2"','MagneRide DSC','בלמי Brembo',
      'אגזוז Active Valve','חישוקי 19"','חימום+קירור מושבים','גג חשמלי אופציה',
      'B&O Unleashed 12 רמקולים','Apple CarPlay אלחוטי','Drift Brake','Track Apps'],
    safety:['Co-Pilot360','Pre-Collision','BLIS','Lane Keep'],
    fuelTank:60, range:530, towing:0
  },
  { rank:17, slug:'kia-ev9-rwd', name:'Kia EV9 RWD', nameEn:'Kia EV9 RWD',
    type:'ev-suv', body:'suv', drivetrain:'RWD',
    msrp:54900, purchaseTax:28548, vat:15023, shipping:2000,
    landedUSD:100971, landedNIS:296855, israelNIS:429000, israelUSD:145918,
    saveUSD:44947, savePct:45, source:'Kia Israel',
    note:'EV משפחתי 7 מושבים – חיסכון מיינסטרים חזק',
    engine:'מנוע חשמלי אחורי', hp:201, torque:350, zero100:9.4, topSpeed:185,
    transmission:'1-מהלכי', seats:7, cargo:333, fuel:'חשמל', mpg:0,
    weight:2535, length:5010, width:1980, height:1755, year:2025,
    origin:'Gwangju, דרום קוריאה', warranty:'יבוא אישי 7 שנים + 7 שנים סוללה',
    colors:[
      {name:'Snow White Pearl',code:'#f4f4f4',hex:'לבן פנינה'},
      {name:'Ocean Blue Matte',code:'#1c3257',hex:'כחול אוקיינוס מאט'},
      {name:'Pebble Grey',code:'#7a7d82',hex:'אפור חלוק'},
      {name:'Iceberg Green',code:'#3a5b50',hex:'ירוק קרחון'},
      {name:'Aurora Black Pearl',code:'#0a0a0a',hex:'שחור Aurora'}
    ],
    trims:[
      {name:'Light RWD',delta:0,items:['76 kWh','230 כ"ס','גלגלי 19"']},
      {name:'Wind RWD',delta:8000,items:['99.8 kWh','RWD','SYNC קוריאה']},
      {name:'GT-Line AWD',delta:18000,items:['379 כ"ס','דואלי','גלגלי 21"']}
    ],
    packages:[
      {name:'Highway Driving Pilot', price:2500, items:['L3 אוטו','Hands-Free','שינוי נתיב']},
      {name:'Premium', price:3200, items:['Meridian','חימום אחורי','גג זכוכית']},
      {name:'7-Seat', price:1500, items:['שורה 3','VIP מושבים','מתקפלים']}
    ],
    features:['7 מושבים','מסך פנורמי 12.3+12.3"','V2L 1.9kW','Highway Driving Pilot',
      'Meridian Premium 14 רמקולים','גג זכוכית','חימום+קירור מושבים','מטעני אלחוט',
      'Smart Power Tailgate','אקלים 3-זונות','OTA','5 מצלמות'],
    safety:['HDA2','BCA','SCC','LKA','9 כריות'],
    battery:76, range:354, charging:230
  },
  { rank:18, slug:'rivian-r1s-dual', name:'Rivian R1S Dual', nameEn:'Rivian R1S Dual-Motor',
    type:'ev-suv', body:'suv', drivetrain:'AWD Dual',
    msrp:75900, purchaseTax:39468, vat:20764, shipping:2000,
    landedUSD:138632, landedNIS:407578, israelNIS:550000, israelUSD:187075,
    saveUSD:48443, savePct:35, source:'אין יבואן רשמי',
    note:'הערכה. אין סוכן בארץ = השירות שלנו הוא הדרך היחידה',
    engine:'2× מנועים חשמליים', hp:533, torque:813, zero100:4.5, topSpeed:201,
    transmission:'1-מהלכי', seats:7, cargo:478, fuel:'חשמל', mpg:0,
    weight:3127, length:5096, width:2015, height:1801, year:2025,
    origin:'Normal, אילינוי, ארה״ב', warranty:'יבוא אישי 5 שנים + 8 שנים סוללה',
    colors:[
      {name:'Glacier White',code:'#f4f4f4',hex:'לבן קרחון'},
      {name:'Limestone',code:'#9aa094',hex:'אבן גיר'},
      {name:'Storm Blue',code:'#1c3a5a',hex:'כחול סערה'},
      {name:'Forest Green',code:'#2a4a32',hex:'ירוק יער'},
      {name:'Compass Yellow',code:'#e8b820',hex:'צהוב מצפן'},
      {name:'LA Silver',code:'#9aa0a8',hex:'כסף LA'}
    ],
    trims:[
      {name:'Dual Standard',delta:0,items:['533 כ"ס','טווח 410 ק"מ','גלגלי 20"']},
      {name:'Dual Performance',delta:6000,items:['665 כ"ס','0-100 ב-3.5','חישוקי 22"']},
      {name:'Tri Performance',delta:15000,items:['850 כ"ס','3 מנועים','0-100 ב-2.9']}
    ],
    packages:[
      {name:'Adventure', price:0, items:['גג זכוכית','עור','22 רמקולים']},
      {name:'Performance Upgrade', price:6000, items:['665 כ"ס','0-100 ב-3.5','Sport']},
      {name:'Off-Road Sport', price:2500, items:['בקרת שטח','Tank Turn','Rock']}
    ],
    features:['Gear Tunnel','גלגלים אוויר Adventure','7 מושבים','מסך פנורמי 15.6+16.6"',
      'גג זכוכית קבוע','Meridian 22 רמקולים','Tank Turn','OTA','אקלים 3-זונות',
      'חימום+קירור מושבים','מצלמת היקף','בסיסים מודולריים'],
    safety:['Driver+','בלימה אוטו','Park','BLIS','חיישני LIDAR'],
    battery:135, range:410, charging:220, towing:3500
  },
  { rank:19, slug:'jeep-wrangler-sport', name:'Jeep Wrangler Unlimited Sport S', nameEn:'Jeep Wrangler Unlimited Sport S',
    type:'gas-off-road', body:'suv', drivetrain:'4WD',
    msrp:35995, purchaseTax:29876, vat:11858, shipping:2000,
    landedUSD:80229, landedNIS:235873, israelNIS:366300, israelUSD:124592,
    saveUSD:44363, savePct:55, source:'Yad2',
    note:'דגם השטח הנמכר ביותר ביבוא אישי',
    engine:'V6 Pentastar 3.6L', hp:285, torque:353, zero100:7.7, topSpeed:160,
    transmission:'6-Speed Manual / 8-Speed Auto', seats:5, cargo:898, fuel:'בנזין', mpg:18,
    weight:2050, length:4882, width:1894, height:1839, year:2025,
    origin:'Toledo, אוהיו, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Firecracker Red',code:'#a01818',hex:'אדום זיקוקים'},
      {name:'Bright White',code:'#f4f4f4',hex:'לבן בהיר'},
      {name:'Granite Crystal',code:'#5a5d62',hex:'אפור גרניט'},
      {name:'Hydro Blue Pearl',code:'#1c4e9e',hex:'כחול הידרו'},
      {name:'Sarge Green',code:'#3d4f3a',hex:'ירוק סארג׳'},
      {name:'Earl',code:'#7a7d82',hex:'אפור Earl'}
    ],
    trims:[
      {name:'Sport S',delta:0,items:['גלגלי 17"','אקלים','SOFT TOP']},
      {name:'Sahara',delta:7000,items:['חישוקי 18"','U-Connect 12.3"','חזית כרום']},
      {name:'Rubicon',delta:11000,items:['Rock-Trac','דיפ ננעלים','חיישני שטח']}
    ],
    packages:[
      {name:'LED Lighting', price:1300, items:['LED Headlamps','LED Fog','LED Tail']},
      {name:'Sun Rider Soft Top', price:1500, items:['גג בד','חלון אחורי','קל לקיפול']},
      {name:'Cold Weather', price:995, items:['חימום מושב','חימום הגה','אקלים שני']}
    ],
    features:['Trail Rated','גג נשלף','דלתות נשלפות','שמשה קדמית מתקפלת',
      'דיפרנציאל שטח','U-Connect 12.3"','גלגלי 17"','Apple CarPlay אלחוטי',
      'מצלמת היקף','בלמי דיסק 4','5 מושבים','נטילת זווית 44°'],
    safety:['4 כריות','Forward Collision','BLIS','Park Sense'],
    fuelTank:81, range:580, towing:1587
  },
  { rank:20, slug:'chevy-traverse-z71', name:'שברולט Traverse Z71', nameEn:'Chevrolet Traverse Z71',
    type:'gas-suv', body:'suv', drivetrain:'AWD',
    msrp:37495, purchaseTax:31121, vat:12352, shipping:2000,
    landedUSD:83468, landedNIS:245396, israelNIS:339990, israelUSD:115643,
    saveUSD:32175, savePct:39, source:'UMI',
    note:'יבואן ישראלי קיים – חיסכון סולידי מאומת',
    engine:'I4 Turbo 2.5L', hp:328, torque:447, zero100:6.4, topSpeed:200,
    transmission:'8-Speed', seats:7, cargo:651, fuel:'בנזין', mpg:22,
    weight:2200, length:5189, width:2049, height:1786, year:2025,
    origin:'Lansing, מישיגן, ארה״ב', warranty:'יבוא אישי 24 חודש',
    colors:[
      {name:'Sterling Grey Metallic',code:'#7a7d82',hex:'אפור סטרלינג'},
      {name:'Mosaic Black Metallic',code:'#0a0a0a',hex:'שחור פסיפס'},
      {name:'Iridescent Pearl Tricoat',code:'#e8e6e0',hex:'לבן פנינה'},
      {name:'Lakeshore Blue',code:'#1a3a5a',hex:'כחול אגם'},
      {name:'Cacti Green',code:'#3d5640',hex:'ירוק קקטוס'}
    ],
    trims:[
      {name:'LS',delta:-5000,items:['בסיסי','בד','17"']},
      {name:'LT',delta:-2000,items:['MyLink 10.2"','עור','18"']},
      {name:'Z71',delta:0,items:['Off-Road','גלגלי 18" שטח','להגנה תחתית']},
      {name:'RS',delta:2500,items:['ערכה ספורט','גלגלי 22"','גג שחור']}
    ],
    packages:[
      {name:'Bose Premium', price:1200, items:['Bose 12','HUD','גג זכוכית']},
      {name:'Safety II', price:1500, items:['HDA','ACC','שמירת נתיב']},
      {name:'Tow Package', price:980, items:['גרירה 2,267 ק"ג','בלמי טריילר','חיסכון']}
    ],
    features:['7 מושבים','MyLink HD 11"','אקלים 3-זונות','חימום מושבים',
      'גג זכוכית פנורמי אופציה','חיישני חניה','גלגלי 18" שטח','להגנה תחתית פלדה',
      'מצלמת היקף','דלת אחורית חשמלית','חניה אוטו','Bose אופציה'],
    safety:['10 כריות','Forward Collision','Lane Keep','BLIS','Teen Driver'],
    fuelTank:80, range:760, towing:2267
  }
];

// ============================================
// PROCESS — 15 STEPS (from תהליך מוצע tab)
// ============================================
const PROCESS_STEPS = [
  { phase:1, label:'בחירה', title:'בוחרים את הרכב באתר', desc:'נכנסים לאתר ובוחרים דגם, גרסה, צבע פנימי וחיצוני ותוספות. מקבלים הערכת מחיר ראשונית מלאה הכוללת מכס, מע״מ, שילוח, ביטוח, עמלות וזמן אספקה.', icon:'select', side:'right'},
  { phase:1, label:'התייעצות', title:'שיחה עם מומחה ייבוא אישי', desc:'בכל שלב ניתן ליצור קשר עם מוקד השירות. נציג מקצועי ילווה אתכם – ויענה על שאלות על דגמים, יבוא, ומיסוי.', icon:'consult', side:'left'},
  { phase:1, label:'הזמנה', title:'הזמנה ומקדמת ₪500', desc:'מבצעים הזמנה רשמית עם מקדמה מינימלית של ₪500 ושולחים רישיון נהיגה ותעודת זהות. הסכום נזקף לרכישה.', icon:'order', side:'right'},
  { phase:2, label:'איתור', title:'סריקת ארה״ב לרכב המושלם', desc:'הצוות שלנו מתחיל לעבוד עבורכם. סורקים את כל ארה״ב למציאת הרכב לפי הקריטריונים שלכם, ויוצרים תחרות בין מספר שותפי רכב לקבלת המחיר הטוב ביותר.', icon:'search', side:'left'},
  { phase:2, label:'הצעה', title:'תוך ~72 שעות – הצעה דרך הפורטל', desc:'מציגים לכם את הרכב והמחיר המלא בפורטל אישי מאובטח. כולל כל העמלות, חישוב סופי, ציר זמן ומסמכי הרכב. הזדרזו – הרכבים הטובים נחטפים מהר.', icon:'offer', side:'right'},
  { phase:2, label:'תשלום', title:'תשלום במזומן או הלוואה מיידית', desc:'אישור רכישה. תשלום מלא במזומן (מחיר רכב + שילוח, ללא מכס בשלב זה) או הלוואה דרך שותף המימון שלנו – אישור מיידי באתר.', icon:'pay', side:'left'},
  { phase:2, label:'אישור', title:'אישור רכישה רשמי בידיכם', desc:'אתם מקבלים את אישור רכישת הרכב. שמכם רשום על הטייטל. הרכב הוא שלכם.', icon:'confirmed', side:'right'},
  { phase:3, label:'איסוף', title:'הנציג שלנו אוסף ובודק', desc:'נציגינו בארה״ב אוסף את הרכב. ברכב משומש – מבצע בדיקה במכון מורשה, מצרף דו״ח CARFAX והוכחות העדר תאונות.', icon:'pickup', side:'left'},
  { phase:3, label:'שילוח', title:'הטענה לאוניית משא וטרנזיט', desc:'הרכב מועלה לאוניית משא לישראל. מקבלים מועד מדויק להגעה (בממוצע 38 יום), שטר מטען (Bill of Lading) ופוליסת ביטוח מלאה.', icon:'ship', side:'right'},
  { phase:4, label:'מסמכים', title:'הגשת מסמכים למכס וטופס 21', desc:'נציגינו מגישים בשמכם את כל הטפסים: טופס 21, אישור מיבואן הרכב שייתן שירות, רישיון יבוא אישי, ועוד.', icon:'docs', side:'left'},
  { phase:4, label:'שחרור', title:'תשלום מיסים ושחרור מהמכס', desc:'המכס שולח דרישת תשלום של מיסים, מע״מ ועמלות. נציגינו מעבירים לכם – אתם משלמים, והרכב משוחרר. כולל התקנת מוביילאי במידת הצורך.', icon:'customs', side:'right'},
  { phase:5, label:'סטנדרטיזציה', title:'בדיקת משרד התחבורה', desc:'מקבלים הזמנה לבדיקת סטנדרטיזציה. הרכב נבדק לפי תקני ישראל (ESP, מד מהירות מטרי, פנסים, רישוי) ומאושר לשימוש.', icon:'standard', side:'left'},
  { phase:5, label:'רישוי', title:'רישום במשרד הרישוי', desc:'הזמנה רשמית לרישום הרכב במשרד הרישוי. הוצאת רישיון רכב ישראלי. רכישת ביטוח חובה ומקיף ראשון דרך שותפינו (הצעה תחרותית).', icon:'license', side:'right'},
  { phase:5, label:'בדיקה', title:'בדיקת כשירות ראשונית', desc:'במידה והרכב מעל גיל 3 – ביצוע טסט ראשון. רכב חדש פטור מטסט ל-3 שנים.', icon:'inspect', side:'left'},
  { phase:5, label:'מסירה', title:'מסירת המפתחות – האוטו שלך!', desc:'תתחדשו! קיבלתם רכב בהנחה משמעותית, בלי מתווכים, בלי כפל עמלות. מקבלים הצעת ביטוח תחרותית מהשותפים שלנו. נסיעה טובה.', icon:'delivered', side:'right'}
];

// ============================================
// PHASES
// ============================================
const PHASES = [
  { num:1, name:'זכאות וייעוץ', desc:'התחלה, אישור היתכנות', range:'שלבים 1-3' },
  { num:2, name:'איתור ורכישה', desc:'סריקת השוק האמריקאי + סגירה', range:'שלבים 4-7' },
  { num:3, name:'שילוח', desc:'איסוף בארה״ב ושיט', range:'שלבים 8-9' },
  { num:4, name:'מכס וסטנדרטיזציה', desc:'שחרור הרכב במכס הישראלי', range:'שלבים 10-12' },
  { num:5, name:'רישוי ומסירה', desc:'רישום הרכב והמפתחות אצלכם', range:'שלבים 13-15' }
];

// ============================================
// FAQ — 14 questions (Hebrew, expanded)
// ============================================
const FAQ = [
  { q:'איך מתחילים? מה השלב הראשון?', a:'בוחרים רכב מהקטלוג באתר ומקבלים אומדן ראשוני מיידי. לאחר מכן פותחים תיק עם מקדמה סמלית של ₪500 ושולחים צילום ת.ז ורישיון נהיגה. תוך 72 שעות הצוות סורק את כל שותפי הרכב בארה״ב, מבצע תחרות ביניהם ומחזיר הצעת מחיר מלאה דרך פורטל הלקוחות.' },
  { q:'כמה אני באמת חוסך? איך זה ייתכן?', a:'בישראל קיים "כפל מס": יבואן רשמי מוסיף 30-50% עמלת רווח על מחיר היצרן, ומעליו מס קנייה (43%-101% בנזין, 35%-55% חשמלי) ומע״מ 18%. ביבוא אישי משלמים מסים על מחיר ה-MSRP האמיתי בארה״ב — ללא רווחי יבואן. ממוצע החיסכון אצל לקוחותינו: ₪348,000. בדגמי G-Class — עד ₪1,041,000.' },
  { q:'מהי עמלת השירות ומה היא כוללת?', a:'5% מערך הרכב — עמלה מלאה וסופית. כוללת: ייעוץ ובחירת דגם, איתור ותחרות בין שותפים בארה״ב, ניהול תהליך הרכישה, ליווי שטר המטען, טיפול בכל המסמכים מול מכס, סטנדרטיזציה ורישוי, וזימון לאיסוף. ללא תשלומים נסתרים — כל הסעיפים שקופים במחשבון באתר.' },
  { q:'כמה זמן לוקח כל התהליך?', a:'בממוצע 60-90 יום מההזמנה ועד מסירת המפתחות. הפירוט: 1-3 ימים לבחירה והזמנה, עד 72 שעות להצעה סופית, 7-14 ימי איסוף ובדיקה בארה״ב, 38 ימי שיט עד אשדוד, 14-21 יום מכס + סטנדרטיזציה + רישוי. כל לוח הזמנים נעקב בפורטל הלקוחות.' },
  { q:'איך אני משלם? אפשר לקחת הלוואה?', a:'שתי אפשרויות: תשלום במזומן/העברה בנקאית, או הלוואה דרך שותף המימון שלנו עם אישור מיידי באונליין דרך הפורטל. הלוואות עד 90% מערך הרכב, ריביות תחרותיות, החזר 5-7 שנים. את הבחירה מבצעים בשלב 6 לאחר קבלת ההצעה המלאה.' },
  { q:'מה כולל מחיר הרכב הסופי?', a:'מחיר MSRP בארה״ב + מס קנייה ישראלי (43%-101% לבנזין/דיזל, 35%-55% לחשמלי/PHEV) + מע״מ 18% + שילוח ים $2,500 + אגרות מכס ~₪2,000 + עמלת השירות שלנו 5%. הכל מפורק במחשבון באתר לפני שאתה מזמין — אין הפתעות.' },
  { q:'מה קורה אחרי שאני מאשר הזמנה?', a:'הצוות שלנו ביצע כבר תחרות בין השותפים בארה״ב. לאחר אישורך — מוציאים אישור רכישה. נציגינו בארה״ב אוספים את הרכב, בודקים אותו במכון מורשה (אם משומש) וטוענים אותו על אונייה. תקבל שטר מטען (Bill of Lading) ועדכון על מועד הגעה משוער לאשדוד.' },
  { q:'מה קורה אחרי שהרכב מגיע לישראל?', a:'אחרי 38 ימי שיט הרכב נוחת באשדוד. אנחנו מטפלים בכל המסמכים — טופס 21, מכתב שירות ויבואן ועוד. המכס שולח לך חיוב מסים ומע״מ דרך נציגינו. במקביל תקבל זימון לבדיקת סטנדרטיזציה ולמשרד הרישוי — שני המועדים היחידים שבהם אתה צריך להגיע בעצמך.' },
  { q:'מה אם הרכב לא יעבור סטנדרטיזציה?', a:'לא יקרה בדגמים שלנו. כל דגם בקטלוג נבדק מראש לתקני FMVSS, ESP/ESC, מד מהירות מטרי, מערכת מוביילאי ופנסים אירופאיים. אם משהו דורש התאמה לפני סטנדרטיזציה — אנחנו לוקחים את זה על עצמנו. עד היום: 100% הצלחה.' },
  { q:'מה לגבי אחריות, ביטוח וטיפולים?', a:'בשלב 15 שותפי הביטוח שלנו מציעים הצעה תחרותית. כל מוסך פרטי בישראל מטפל ברכב יבוא אישי (תקנת רשות הכבישים). יצרני ארה״ב (Ford, Chevy, Jeep) מעניקים אחריות עולמית. במרצדס/BMW — אנחנו מציעים אחריות יבוא אישי של 24 חודש דרך מוסכים מורשים.' },
  { q:'אפשר להזמין דגם שלא נמצא בקטלוג?', a:'בהחלט. 20 הדגמים בקטלוג הם המבוקשים ביותר עם חיסכון מוכח, אבל אנחנו מטפלים בכל דגם שעומד בתקני ישראל — Porsche Macan, Audi Q8 e-tron, Range Rover Sport, Cadillac Escalade IQ, GMC Hummer EV ועוד. צור קשר עם הדגם הספציפי ונחזיר תוך 24 שעות עם אומדן.' },
  { q:'מה ההבדל ביני לבין יבואן רשמי?', a:'יבואן רשמי קונה מהיצרן, מוסיף 30-50% רווח, מטפל בכל המסים — ואז מוכר לך. אנחנו לא יבואנים ולא מוכרים — אנחנו צוות ייעוץ שמתווך בינך לבין השוק האמריקאי ומערכת המסים בישראל. אתה הקונה הישיר; אנחנו מקבלים 5% עמלת שירות בלבד.' },
  { q:'אפשר לבטל באמצע התהליך?', a:'ניתן לבטל בכל שלב עד שלב 7 (אישור רכישה) — תוחזר המקדמה בניכוי עלויות איתור. לאחר אישור הרכישה הרכב כבר נקנה עבורך והוא שלך; ניתן להעבירו לרישוי או למוכרו בארה״ב. במקרים חריגים — נעבוד אתך בהוגנות מלאה.' },
  { q:'אילו דגמים מובילים בחיסכון?', a:'הדגמים עם הפער הגדול ביותר: מרצדס G63 AMG (חיסכון ₪915,000), מרצדס G580 EQ חשמלי (₪1,041,000), מרצדס G500 (₪445,000), מרצדס GLS 450d (₪476,000), Ford F-150 Raptor (₪292,000). G-Class הוא הדגם המבוקש ביותר. הקטלוג כולל 20 דגמים — כל אחד עם תחשיב מלא.' }
];

// ============================================
// VIDEOS — All 14 videos from the Drive
// ============================================
const VIDEOS = {
  heroItaly:'./videos/hero-italy-road.mp4',
  droneLight:'./videos/drone-light-car-dark.mp4',
  sportsRural:'./videos/sports-muscle-rural.mp4',
  fastRural:'./videos/fast-sports-rural.mp4',
  neonHighway:'./videos/neon-highway.mp4',
  smudgeHighway:'./videos/smudge-highway.mp4',
  ignition:'./videos/ignition-button.mp4',
  shipping:'./videos/drone-roro-shipping.mp4',
  dock:'./videos/container-dock-israel.mp4',
  garageLift:'./videos/garage-lift.mp4',
  dealership:'./videos/happy-dealership.mp4',
  windscreen:'./videos/windscreen-friends.mp4',
  mediterranean:'./videos/israel-mediterranean.mp4',
  rocky:'./videos/rocky-terrain.mp4',
  autoGarage:'./videos/auto-garage-up-lifting.mp4'
};

// ============================================
// CAR IMAGES — Unsplash (royalty-free, real photos)
// ============================================
const CAR_IMAGES = {
  'mercedes-g63-amg':['https://www.drivingemotions.com/galleria_images/864/864_main_l.jpg','https://www.motorcarspalmbeach.com/imagetag/2073/main/l/Used-2025-Mercedes-Benz-G-Class-G-63-AMG%C2%AE-1750788252.jpg','https://www.momentummotorcars.com/imagetag/3475/main/l/Used-2025-Mercedes-Benz-G-Class-AMG-G-63-1736350612.jpg','https://www.primemotorz.com/imagetag/2110/main/l/Used-2025-Mercedes-Benz-G-Class-AMG-G63-AWD-AMG-G-63-1750358937.jpg','https://assets.dyler.com/uploads/cars/432187/9394276/medium_561a6fe1-6b08-4ceb-bae2-856188ff93b8.jpeg'],
  'mercedes-gls-450d':['https://images.carexpert.com.au/resize/960/-/cms/v1/media/2025-06-2025-mercedes-benz-gls450d240830mercedes-benz-gls-450d-4maticstill-32.jpg','https://img.sm360.ca/images/newcar/ca/2025/mercedes-benz/gls/450-4matic/suv/main/2025_Mercedes-Benz_GLS_1-450-4MATIC_EXT_001_main.png','https://www.abzmotors.com/imagetag/3687/main/l/Used-2025-Mercedes-Benz-GLS-GLS-450-1736384757.jpg','https://images.dealer.com/ddc/vehicles/2025/Mercedes-Benz/GLS%20450/SUV/color/Black-040-10,10,12-640-en_US.jpg','https://images.carexpert.com.au/resize/960/-/cms/v1/media/2025-06-2025-mercedes-benz-gls450d240830mercedes-benz-gls-450d-4maticstill-32.jpg'],
  'mercedes-g580-eq':['https://images.dealer.com/ddc/vehicles/2025/Mercedes-Benz/G-Class/SUV/color/MANUFAKTUR%20Moonlight%20White%20Metallic-885-232,232,237-640-en_US.jpg','https://www.ryanfriedmanmotorcars.com/imagetag/2711/2/l/Used-2025-Mercedes-Benz-G-Class-G-550-Stronger-Than-the-1980s-Edition-1754020604.jpg','https://cdn-ds.com/stock/2025-Mercedes-Benz-G-Class-Mansory-Miami-FL/seo/VAMP91988-W1NWH5AB1SX029980/sz_64456/o_13714/ov_12/25d34c5cf188329c5a79d44ba70d734b.jpg','https://www.drivingemotions.com/galleria_images/864/864_p83_l.jpg','https://www.ryanfriedmanmotorcars.com/imagetag/2711/2/l/Used-2025-Mercedes-Benz-G-Class-G-550-Stronger-Than-the-1980s-Edition-1754020604.jpg'],
  'lucid-air-pure':['https://s37629.pcdn.co/wp-content/uploads/2024/07/2025-Lucis-Air-Pure-1400.jpg','https://imageio.forbes.com/specials-images/imageserve/6695ea9d2fda8909536c6d0b/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds','https://www.edmunds.com/assets/m/cs/blt7ccd7ecb65ed56b8/678580d70a69c808ccc2c9f1/2025-Lucid-Air-02-r34-11042024_1600.jpg','https://hips.hearstapps.com/mtg-prod/67eebe7faf98e400084a3e75/001-2025-lucid-air-pure-front-three-quarter-static-lead.jpg','https://techcrunch.com/wp-content/uploads/2024/12/lucid-air-pure.jpg'],
  'mercedes-g500':['https://images.dealer.com/ddc/vehicles/2025/Mercedes-Benz/G-Class/SUV/color/MANUFAKTUR%20Moonlight%20White%20Metallic-885-232,232,237-640-en_US.jpg','https://www.ryanfriedmanmotorcars.com/imagetag/2711/2/l/Used-2025-Mercedes-Benz-G-Class-G-550-Stronger-Than-the-1980s-Edition-1754020604.jpg','https://cdn-ds.com/stock/2025-Mercedes-Benz-G-Class-Mansory-Miami-FL/seo/VAMP91988-W1NWH5AB1SX029980/sz_64456/o_13714/ov_12/25d34c5cf188329c5a79d44ba70d734b.jpg','https://www.drivingemotions.com/galleria_images/864/864_main_l.jpg','https://www.ryanfriedmanmotorcars.com/imagetag/2711/2/l/Used-2025-Mercedes-Benz-G-Class-G-550-Stronger-Than-the-1980s-Edition-1754020604.jpg'],
  'chevy-tahoe-high-country':['https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/vehicles/2025/suvs/tahoe/design/2025-tahoe-mov-design-03-v2.png?imwidth=1200','https://hips.hearstapps.com/mtg-prod/67b7c6786d56bd0008f84591/014-2025-chevrolet-tahoe-high-country-front-view.jpg','https://driveccv.com/cdn/shop/files/KernersvilleHighCountry-3.jpg?v=1755791383','https://www.edmunds.com/assets/m/cs/blt41ad657229a8fa8f/65667869f415045f231264cf/2025_Chevrolet_Tahoe_studio_1_717.jpg','https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-tahoe-high-country-124-6708101810b8f.jpg'],
  'bmw-x7-xdrive40i':['https://hips.hearstapps.com/hmg-prod/images/2025-bmw-x7-101-65d51e47938f4.jpg','https://media.ed.edmunds-media.com/bmw/x7/2025/oem/2025_bmw_x7_4dr-suv_m60i_fq_oem_1_1600.jpg','https://www.jonathanmotorcars.com/imagetag/1915/main/l/Used-2025-BMW-X7-xDrive40i-1747944360.jpg','https://file.kelleybluebookimages.com/kbb/base/evox/CP/52824/2025-BMW-X7-front_52824_032_1838x859_C36_cropped.png','https://hips.hearstapps.com/hmg-prod/images/2025-bmw-x7-102-65d51e46ec4f2.jpg'],
  'tesla-model-x-lr':['https://file.kelleybluebookimages.com/kbb/base/evox/CP/50199/2024-Tesla-Model%20X-front_50199_032_1819x795_PPSW_cropped.png','https://hips.hearstapps.com/hmg-prod/images/2020-tesla-model-x-107-656e381e755b3.jpg','https://file.kelleybluebookimages.com/kbb/base/evox/StJ/50199/2024-Tesla-Model%20X-side_50199_037_640x480.jpg','https://platform.cstatic-images.com/large/in/v2/f7a485b4-09af-5821-b0bc-33b246882a30/48955e12-d7dd-4840-8b81-923b47998905/61u6gz52hUTfgj0l0sT8YMQKbZg.jpg','https://hips.hearstapps.com/hmg-prod/images/2020-tesla-model-x-107-656e381e755b3.jpg'],
  'mercedes-s580e':['https://2684054.fs1.hubspotusercontent-na1.net/hubfs/2684054/2025-mercedes-benz-s560e-hero-carpro.jpg','https://images.cars.com/cldstatic/wp-content/uploads/mercedes-benz-s-580-phev-2025-01-exterior-front-angle.jpg','https://images.cars.com/cldstatic/wp-content/uploads/mercedes-benz-s-580-phev-2025-07-exterior-profile.jpg','https://media.ed.edmunds-media.com/mercedes-benz/s-class/2025/oem/2025_mercedes-benz_s-class_sedan_s-580e-4matic_fq_oem_1_1600.jpg','https://media.ed.edmunds-media.com/mercedes-benz/s-class/2025/oem/2025_mercedes-benz_s-class_sedan_s-580e-4matic_fq_oem_3_1600.jpg'],
  'ford-bronco-raptor':['https://storage.googleapis.com/www.savvydealer.com/new/Ford/Bronco/Raptor/2024/Features/2024-Ford-Bronco-Raptor-Exterior.jpg','https://fordauthority.com/wp-content/uploads/2024/09/2025-Ford-Bronco-Raptor-Marsh-Gray-Raptor-Rally-Exterior-001-Front-Three-Quarters.jpg','https://media.ed.edmunds-media.com/ford/bronco/2025/oem/2025_ford_bronco_convertible-suv_raptor_fq_oem_1_1600.jpg','https://hips.hearstapps.com/hmg-prod/images/2022-ford-bronco-raptor-125-1660609091.jpg','https://autogroupinternational.com/wp-content/uploads/2025/04/2025-Ford-Bronco-Raptor-SUV-in-right-hand-drive-front.jpg'],
  'ford-f150-raptor':['https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-raptor-r-212-67092b83c7bb6.jpg','https://media.ed.edmunds-media.com/ford/f-150/2025/oem/2025_ford_f-150_crew-cab-pickup_raptor_fq_oem_1_1280.jpg','https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-raptor-r-296-67092b83c578d.jpg','https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/f-150/2025/jellybeans/F150_compare_Raptor.png','https://static.overfuel.com/photos/12/863796/image-1.webp'],
  'mercedes-gle-450d':['https://media.ed.edmunds-media.com/mercedes-benz/gle-class/2025/oem/2025_mercedes-benz_gle-class_4dr-suv_gle-450-4matic_fq_oem_2_1600.jpg','https://www.edmunds.com/assets/m/cs/cms/21cc3d89-b430-4c1a-8957-ef3c31975189/2025-mercedes-benz-gle-450.jpg','https://hips.hearstapps.com/hmg-prod/images/2025-mercedes-benz-gle450-coupe-677d60ec63987.jpg','https://www.topgear.com/sites/default/files/2025/03/Medium-48689-mercedes-gle-53-0084.jpg','https://media.ed.edmunds-media.com/mercedes-benz/gle-class/2025/oem/2025_mercedes-benz_gle-class_4dr-suv_gle-450e_fq_oem_1_1600.jpg'],
  'tesla-cybertruck-awd':['https://hips.hearstapps.com/hmg-prod/images/2025-tesla-cybertruck-3-672e75cce7814.jpg','https://media.ed.edmunds-media.com/tesla/cybertruck/2025/oem/2025_tesla_cybertruck_crew-cab-pickup_cyberbeast_fq_oem_1_1280.jpg','https://cdn.prod.website-files.com/5ec85520c4dfff034b036be2/67007a4b0d6f760e873704d3_cybertruck-road-test_main.webp','https://cdn.prod.website-files.com/5ec85520c4dfff034b036be2/67007abd4831f41c04f998d6_67007a7bbc892130619bec0f_cybertruck-road-test_rear2.webp','https://hips.hearstapps.com/hmg-prod/images/2025-tesla-cybertruck-rwd-126-68e3e680d457a.jpg'],
  'bmw-x5-xdrive40i':['https://media.ed.edmunds-media.com/bmw/x5/2025/oem/2025_bmw_x5_4dr-suv_xdrive40i_fq_oem_1_1600.jpg','https://hips.hearstapps.com/hmg-prod/images/2025-bmw-x5-xdrive40i-103-6824bd4510093.jpg','https://hips.hearstapps.com/hmg-prod/images/2025-bmw-x5-xdrive40i-119-6824bd515c0cc.jpg','https://simemotors.com.au/wp-content/uploads/BMW-X5-xDrive40i-MY24-Stills-13-scaled.jpg','https://www.marshallgoldman.com/imagetag/4250/5/l/Used-2025-BMW-X5-xDrive40i-M-Sport-1744396355.jpg'],
  'ford-bronco-big-bend':['https://www.sarasotaford.com/blogs/3372/wp-content/uploads/2024/12/23_FRD_BRO_49005-1024x683.jpg','https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/bronco/2025/jellybeans/25_frd_bro_bigb_4d_sblk_ps34.png','https://hips.hearstapps.com/hmg-prod/images/ford-bronco-matte-clear-film-06-672bd09545843.jpg','https://www.sarasotaford.com/blogs/3372/wp-content/uploads/2024/12/cq5dam.web_.2160.2160-1024x439.jpg','https://storage.googleapis.com/www.savvydealer.com/new/Ford/Bronco/Raptor/2024/Features/2024-Ford-Bronco-Raptor-Exterior.jpg'],
  'mustang-gt-v8':['https://media.ed.edmunds-media.com/ford/mustang/2025/oem/2025_ford_mustang_coupe_dark-horse_fq_oem_1_1600.jpg','https://hips.hearstapps.com/hmg-prod/images/2025-ford-mustang-60th-anniversary-exterior-66227932bb88e.jpg','https://www.metrofordofokc.com/blogs/3675/wp-content/uploads/2024/11/2025-Ford-Mustang.jpg','https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/CUT_2025_Mustang_DarkHorse_OxfordWhite_A04.png','https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/Ford_Mustang_2025_300A_PG1_88D_89W_13R_COU_64T_99F_44X_GT_DEFAULT_EXT_4.png'],
  'kia-ev9-rwd':['https://hips.hearstapps.com/hmg-prod/images/2024-kia-ev9-101-653fd5dcf38bd.jpg','https://hips.hearstapps.com/hmg-prod/images/2024-kia-ev9-125-653fd5e96de4f.jpg','https://hips.hearstapps.com/hmg-prod/images/2024-kia-ev9-102-653fd5de44a53.jpg','https://img.sm360.ca/images/newcar/ca/2025/kia/ev9/light-rwd/suv/main/2025_Kia_EV9_1-Light-RWD_MAIN.png','https://www.kia.com/content/dam/kia/us/en/vehicles/ev9/2026/trims/light-rwd/exterior/585858/360/36.png'],
  'rivian-r1s-dual':['https://hips.hearstapps.com/hmg-prod/images/2025-rivian-r1s-tri-motor-3064-680145c6b12b5.jpg','https://www.edmunds.com/assets/m/cs/blt932b0137a911c2c6/66609c723bba5e78aa414608/r1s_1600.jpg','https://cdn.motor1.com/images/mgl/xqKbwP/s1/2025-rivian-r1s-first-drive.jpg','https://hips.hearstapps.com/hmg-prod/images/2025-rivian-r1s-tri-motor-3247-680145c7b996f.jpg','https://cimg2.ibsrv.net/ibimg/hgm/1920x1080-1/100/932/rivian_100932114.jpg'],
  'jeep-wrangler-sport':['https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2025/wrangler/gallery/desktop/my25-jeep-wrangler-gallery-01-exterior-desktop.jpg','https://file.kelleybluebookimages.com/kbb/base/evox/CP/55760/2025-Jeep-Wrangler%202%20Door-front_55760_032_2400x1800_PRC_nologo.png','https://www.orangeparkdodgeflorida.com/static/dealer-17140/darcars-cdjr-orange-park_update-2025-jeep-wrangler-configurations-ls1_2X.jpg','https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2025/wrangler/gallery/desktop/my25-jeep-wrangler-gallery-01-exterior-desktop.jpg','https://file.kelleybluebookimages.com/kbb/base/evox/CP/55760/2025-Jeep-Wrangler%202%20Door-front_55760_032_2400x1800_PRC_nologo.png'],
  'chevy-traverse-z71':['https://hips.hearstapps.com/hmg-prod/images/2024-chevrolet-traverse-750-66f5b9575b087.jpg','https://media.edealer.ca/w_1920,h_1440,q_75,c_l,v1/inventory/KNYCPYMAAJEWJNKCN74KM7RH5Y.webp','https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/vehicles/2025/suvs/traverse/01-images/mov/masthead/2025-traverse-masthead-01.png?imwidth=1200','https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/vehicles/2025/suvs/traverse/01-images/mov/capability/2025-traverse-capability-posterframe-02.png?imwidth=1200','https://cgi.chevrolet.com/mmgprod-us/dynres/prove/image.gen?i=2025/1LC56/1LC56__2Z7/GXD_LK0_MF8_PXW_GXD_HQCgmds10.jpg&v=deg01&std=true&country=US&BYO=true&background=&transparentBackgroundPng=true'],
};
