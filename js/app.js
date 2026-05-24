/* AutoImports CARS — App logic */
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const fmtUSD = n => '$'+Math.round(n).toLocaleString('en-US');
  const fmtNIS = n => '₪'+Math.round(n).toLocaleString('he-IL');

  /* ============ Helpers ============ */
  const heCat = t => {
    if(!t) return '—';
    if(t.includes('ev')) return 'חשמלי';
    if(t.includes('off-road')) return 'שטח';
    if(t.includes('pickup') || t==='pickup') return 'פיק-אפ';
    if(t.includes('sedan') || t.includes('coupe')) return 'סדאן/קופה';
    return 'SUV';
  };
  const matchFilter = (car, f) => {
    if(f==='all') return true;
    if(f==='suv') return car.body==='suv' && !car.type.includes('off-road');
    if(f==='off-road') return car.type.includes('off-road');
    if(f==='ev') return car.type.includes('ev');
    if(f==='gas') return !car.type.includes('ev');
    if(f==='pickup') return car.type==='pickup' || (car.body && car.body==='pickup');
    if(f==='sedan-coupe') return car.body==='sedan' || car.body==='coupe';
    return true;
  };

  /* ============ Render Cars Grid ============ */
  const carImg = car => (CAR_IMAGES[car.slug]||['data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22%3E%3Crect width=%22600%22 height=%22400%22 fill=%22%23eee%22/%3E%3C/svg%3E'])[0];

  function carCard(car){
    const isTop3 = car.rank<=3;
    const tagsHtml = [
      `<span class="car-tag">${heCat(car.type)}</span>`,
      `<span class="car-tag">${car.year}</span>`,
      `<span class="car-tag">${car.fuel}</span>`
    ].join('');
    return `
      <article class="car-card reveal" data-slug="${car.slug}" data-type="${car.type}" data-body="${car.body}">
        <div class="car-img-wrap">
          <img src="${carImg(car)}" alt="${car.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22%3E%3Crect width=%22600%22 height=%22400%22 fill=%22%23272a30%22/%3E%3Ctext x=%22300%22 y=%22210%22 fill=%22%23b8975a%22 text-anchor=%22middle%22 font-family=%22serif%22 font-size=%2230%22%3E${encodeURIComponent(car.nameEn||car.name)}%3C/text%3E%3C/svg%3E'">
          <div class="car-save-bar">
            <div>חיסכון<br><strong>${fmtNIS(car.saveUSD*FX_USD_ILS)}</strong></div>
            <div class="car-save-pct">${car.savePct}%</div>
          </div>
        </div>
        <div class="car-body">
          <div class="car-type-row">${tagsHtml}</div>
          <h3 class="car-name">${car.name}</h3>
          <div class="car-name-en">${car.nameEn}</div>
          <div class="car-specs">
            <div><strong>${car.hp}</strong> כ״ס</div>
            <div><strong>${car.zero100}s</strong> 0‑100</div>
            <div><strong>${car.transmission?car.transmission.split(' ')[0]:'-'}</strong></div>
            <div><strong>${car.drivetrain}</strong></div>
            <div><strong>${car.seats}</strong> מושבים</div>
            <div><strong>${car.fuel==='חשמל'? (car.range+'ק״מ'):(car.mpg+' MPG')}</strong></div>
          </div>
          <div class="car-prices">
            <div class="car-price-block">מחיר בישראל<span class="car-price-val strike">${fmtNIS(car.israelNIS)}</span></div>
            <div class="car-price-block">מחיר ביבוא אישי<span class="car-price-val" style="color:var(--gold)">${fmtNIS(car.landedNIS)}</span></div>
          </div>
          <div class="car-cta" onclick="openVDP('${car.slug}')">מפרט מלא והזמנה</div>
        </div>
      </article>
    `;
  }

  function renderCars(){
    const f = $('.f-chip.active')?.dataset.filter||'all';
    const sort = $('#sortSel').value;
    const q = ($('#searchInput').value||'').toLowerCase().trim();
    let list = CARS.filter(c=>matchFilter(c,f));
    if(q) list = list.filter(c => (c.name+c.nameEn+c.engine).toLowerCase().includes(q));
    list.sort((a,b)=>{
      if(sort==='rank') return a.rank-b.rank;
      if(sort==='save-pct') return b.savePct-a.savePct;
      if(sort==='save-usd') return b.saveUSD-a.saveUSD;
      if(sort==='price-low') return a.landedNIS-b.landedNIS;
      if(sort==='price-high') return b.landedNIS-a.landedNIS;
      if(sort==='hp') return b.hp-a.hp;
      return 0;
    });
    $('#carsGrid').innerHTML = list.map(carCard).join('') || '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--mut)">אין תוצאות לסינון זה.</div>';
    observeReveal();
  }

  /* ============ Filters / sort ============ */
  $$('.f-chip').forEach(el=>el.addEventListener('click',()=>{
    $$('.f-chip').forEach(c=>c.classList.remove('active'));
    el.classList.add('active'); renderCars();
  }));
  $('#sortSel').addEventListener('change',renderCars);
  $('#searchInput').addEventListener('input',renderCars);

  /* ============ VDP Modal ============ */
  window.openVDP = (slug) => {
    const car = CARS.find(c=>c.slug===slug); if(!car) return;
    const imgs = CAR_IMAGES[slug]||[];
    const colorsHTML = car.colors.map(c=>`
      <div class="color-chip">
        <div class="color-swatch" style="background:${c.code}"></div>
        <div class="color-name">${c.hex}</div>
      </div>
    `).join('');
    const trimsHTML = car.trims.map(t=>`
      <div class="trim-card">
        <div class="trim-head">
          <div class="trim-name">${t.name}</div>
          <div class="trim-delta">${t.delta? '+'+fmtUSD(t.delta):'בסיס'}</div>
        </div>
        <div class="trim-items">${t.items.join(' · ')}</div>
      </div>
    `).join('');
    const pkgsHTML = car.packages.map(p=>`
      <div class="pkg-card">
        <div class="pkg-head"><span>${p.name}</span><span style="color:var(--gold)">+${fmtUSD(p.price)}</span></div>
        <div class="pkg-items">${p.items.join(' · ')}</div>
      </div>
    `).join('');
    const featuresHTML = car.features.map(f=>`<li>${f}</li>`).join('');
    const safetyHTML = car.safety.map(s=>`<li>${s}</li>`).join('');

    const html = `
      <div class="vdp-hero">
        <img id="vdpHeroImg" src="${imgs[0]||''}" alt="${car.name}">
        <div class="vdp-hero-info">
          <div class="eyebrow">#${car.rank} AutoImports · ${car.year} · ${heCat(car.type)}</div>
          <h2>${car.name}</h2>
          <p>${car.nameEn} · ${car.engine}</p>
        </div>
      </div>
      <div class="vdp-thumbs">
        ${imgs.map((u,i)=>`<div class="vdp-thumb ${i===0?'active':''}" onclick="vdpSetImg(${i},this)"><img src="${u}" alt=""></div>`).join('')}
      </div>
      <div class="vdp-body">

        <div class="vdp-quickfacts">
          <div class="vdp-fact"><div class="vdp-fact-lbl">הספק</div><div class="vdp-fact-val">${car.hp}<small> כ״ס</small></div></div>
          <div class="vdp-fact"><div class="vdp-fact-lbl">0‑100</div><div class="vdp-fact-val">${car.zero100}<small>s</small></div></div>
          <div class="vdp-fact"><div class="vdp-fact-lbl">מומנט</div><div class="vdp-fact-val">${car.torque}<small> Nm</small></div></div>
          <div class="vdp-fact"><div class="vdp-fact-lbl">מהירות מקס׳</div><div class="vdp-fact-val">${car.topSpeed}<small> קמ״ש</small></div></div>
          <div class="vdp-fact"><div class="vdp-fact-lbl">${car.fuel==='חשמל'?'טווח':'מצרכ׳'}</div><div class="vdp-fact-val">${car.fuel==='חשמל'?car.range:car.mpg}<small> ${car.fuel==='חשמל'?'ק״מ':'MPG'}</small></div></div>
          <div class="vdp-fact"><div class="vdp-fact-lbl">משקל</div><div class="vdp-fact-val">${(car.weight/1000).toFixed(2)}<small> טון</small></div></div>
        </div>

        <div class="vdp-cols">
          <div class="vdp-main">

            <div class="vdp-section">
              <h3>למה הדגם הזה משתלם</h3>
              <p style="font-size:15px;line-height:1.75;color:var(--ink-2);margin:0">${car.note}</p>
            </div>

            <div class="vdp-section">
              <h3>מפרט מנוע ושילדה</h3>
              <div class="spec-grid">
                <div class="spec-row"><span>מנוע</span><span>${car.engine}</span></div>
                <div class="spec-row"><span>תיבת הילוכים</span><span>${car.transmission}</span></div>
                <div class="spec-row"><span>הינע</span><span>${car.drivetrain}</span></div>
                <div class="spec-row"><span>סוג דלק</span><span>${car.fuel}</span></div>
                ${car.fuelTank?`<div class="spec-row"><span>מיכל</span><span>${car.fuelTank} ${car.fuel==='חשמל'?'kWh':'ליטר'}</span></div>`:''}
                ${car.range?`<div class="spec-row"><span>טווח</span><span>${car.range} ק״מ</span></div>`:''}
                <div class="spec-row"><span>אורך</span><span>${car.length} מ״מ</span></div>
                <div class="spec-row"><span>רוחב</span><span>${car.width||'—'} מ״מ</span></div>
                <div class="spec-row"><span>גובה</span><span>${car.height||'—'} מ״מ</span></div>
                <div class="spec-row"><span>מושבים</span><span>${car.seats}</span></div>
                <div class="spec-row"><span>תא מטען</span><span>${car.cargo} ליטר</span></div>
                <div class="spec-row"><span>גרירה</span><span>${car.towing||'—'} ק״ג</span></div>
              </div>
            </div>

            <div class="vdp-section">
              <h3>צבעים זמינים</h3>
              <div class="colors-grid">${colorsHTML}</div>
            </div>

            <div class="vdp-section">
              <h3>רמות גימור (Trims)</h3>
              ${trimsHTML}
            </div>

            <div class="vdp-section">
              <h3>חבילות אופציונליות</h3>
              ${pkgsHTML}
            </div>

            <div class="vdp-section">
              <h3>מאפיינים ואבזור סטנדרטי</h3>
              <ul class="feature-list">${featuresHTML}</ul>
            </div>

            <div class="vdp-section">
              <h3>בטיחות</h3>
              <ul class="feature-list">${safetyHTML}</ul>
            </div>

            <div class="vdp-section">
              <h3>מקור ואחריות</h3>
              <div class="spec-grid">
                <div class="spec-row"><span>ייצור</span><span>${car.origin}</span></div>
                <div class="spec-row"><span>אחריות</span><span>${car.warranty}</span></div>
              </div>
            </div>

          </div>

          <aside class="vdp-side">

            <div class="price-card">
              <div class="lbl">מחיר נחיתה בארץ</div>
              <div class="val">${fmtNIS(car.landedNIS)}</div>
              <div class="strike">${fmtNIS(car.israelNIS)} ביבואן</div>
              <hr style="margin:18px 0;border:0;border-top:1px solid rgba(255,255,255,.15)">
              <div class="price-row"><span>MSRP בארה״ב</span><span>${fmtUSD(car.msrp)}</span></div>
              <div class="price-row"><span>מס קנייה</span><span>${fmtUSD(car.purchaseTax)}</span></div>
              <div class="price-row"><span>מע״מ 18%</span><span>${fmtUSD(car.vat)}</span></div>
              <div class="price-row"><span>שילוח</span><span>${fmtUSD(car.shipping)}</span></div>
              <div class="price-row"><span>סה״כ נחיתה</span><span>${fmtUSD(car.landedUSD)}</span></div>
              <div style="margin-top:18px;padding-top:18px;border-top:1px solid var(--gold-soft);display:flex;justify-content:space-between;align-items:end">
                <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-soft)">חיסכון</div>
                <div style="font-family:var(--serif);font-size:28px;font-weight:600;color:var(--gold);line-height:1">${car.savePct}%</div>
              </div>
            </div>

            <div class="cta-card">
              <div style="font-family:var(--serif);font-size:18px;font-weight:600;margin-bottom:4px">לקוח קיים?</div>
              <p>היכנס לפורטל כדי לעדכן את התיק שלך</p>
              <button class="btn btn-light btn-sm" style="width:100%">כניסה לפורטל</button>
            </div>

            <div class="cta-card">
              <div style="font-family:var(--serif);font-size:18px;font-weight:600;margin-bottom:4px">לקוח חדש?</div>
              <p>שלם מקדמה ₪500. נשלח לך בתוך 24 שעות פירוט נחיתה מלא לדגם הזה.</p>
              <button class="btn btn-primary btn-sm" style="width:100%">פתיחת תיק — ₪500</button>
            </div>

          </aside>
        </div>

      </div>
    `;
    $('#vdpContent').innerHTML = html;
    $('#vdpModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeVDP = () => { $('#vdpModal').classList.remove('open'); document.body.style.overflow = '' };
  window.vdpSetImg = (i,el) => {
    $$('.vdp-thumb').forEach(t=>t.classList.remove('active'));
    el.classList.add('active');
    const slug = $('#vdpContent .vdp-hero-info h2')?.textContent;
    const car = CARS.find(c=>c.name===slug);
    if(car) $('#vdpHeroImg').src = (CAR_IMAGES[car.slug]||[])[i] || $('#vdpHeroImg').src;
  };
  $('#vdpModal').addEventListener('click', (e)=>{ if(e.target.id==='vdpModal') closeVDP() });

  /* ============ Process Phase Tabs ============ */
  // Define actor mapping for each step (1=GITA, 0=client/both)
  // Based on Excel: 1-3 client (selects/orders), 4-15 AutoImports (we do it all)
  const STEP_ACTOR = {
    1:'CLIENT', 2:'BOTH', 3:'CLIENT',
    4:'AutoImports', 5:'AutoImports', 6:'BOTH', 7:'AutoImports',
    8:'AutoImports', 9:'AutoImports', 10:'AutoImports', 11:'BOTH',
    12:'AutoImports', 13:'AutoImports', 14:'AutoImports', 15:'CLIENT'
  };
  const ACTOR_LABEL = { GITA:'הצוות · אנחנו עושים', CLIENT:'הלקוח · אתה עושה', BOTH:'אנחנו + אתה' };
  const STEP_TIMES = {
    1:'יום 0', 2:'יום 0‑1', 3:'יום 1', 4:'ימים 1‑7', 5:'יום 3‑10',
    6:'יום 8‑10', 7:'יום 10', 8:'יום 10‑15', 9:'~38 ימי שיט',
    10:'יום 50‑55', 11:'יום 55‑60', 12:'יום 60‑65', 13:'יום 65‑70',
    14:'יום 70‑72', 15:'יום 72'
  };

  function stepNum(s){ return PROCESS_STEPS.indexOf(s)+1 }

  function renderProcess(){
    const tabsEl = $('#phaseTabs');
    if(!tabsEl) return; // Process is rendered by process.js v2
    tabsEl.innerHTML = PHASES.map((p,i)=>`
      <button class="phase-tab ${i===0?'active':''}" data-phase="${p.num}">
        <span class="pn">${String(p.num).padStart(2,'0')}</span>
        ${p.name}
        <small style="display:block;font-size:10px;letter-spacing:.06em;text-transform:none;opacity:.7;margin-top:4px">${p.range}</small>
      </button>
    `).join('');
    $$('.phase-tab').forEach(b=>b.addEventListener('click',()=>{
      $$('.phase-tab').forEach(t=>t.classList.remove('active'));
      b.classList.add('active');
      const ph = parseInt(b.dataset.phase);
      renderSteps(ph);
    }));
    renderSteps(1);
  }
  function renderSteps(phaseNum){
    const grid = $('#stepsGrid');
    if(!grid) return;
    const list = PROCESS_STEPS.filter(s=>s.phase===phaseNum);
    grid.innerHTML = list.map(s=>{
      const n = stepNum(s);
      const actor = STEP_ACTOR[n]||'AutoImports';
      return `
      <div class="step-card reveal">
        <div class="step-num">${String(n).padStart(2,'0')}</div>
        <div class="step-actor">${ACTOR_LABEL[actor]}</div>
        <h3 class="step-h">${s.title}</h3>
        <p class="step-p">${s.desc||''}</p>
        <div class="step-time">${STEP_TIMES[n]||''}</div>
      </div>
    `;}).join('');
    observeReveal();
  }

  /* ============ FAQ ============ */
  function renderFAQ(){
    $('#faqList').innerHTML = FAQ.map(f=>`
      <details class="faq-item">
        <summary><span class="faq-q">${f.q}</span></summary>
        <div class="faq-a">${f.a}</div>
      </details>
    `).join('');
  }

  /* ============ Tasks ============ */
  function renderTasks(){
    const head = `<div class="task-row head"><div>#</div><div>שלב</div><div>פירוט</div><div>פאזה</div><div>מי עושה</div></div>`;
    const rows = PROCESS_STEPS.map((s,idx)=>{
      const n = idx+1;
      const phase = PHASES.find(p=>p.num===s.phase);
      const a = STEP_ACTOR[n]||'AutoImports';
      const actor = a==='AutoImports'?'<span class="task-actor gita">הצוות</span>':
                    a==='CLIENT'?'<span class="task-actor client">לקוח</span>':
                    '<span class="task-actor gita">הצוות</span> <span class="task-actor client">+ לקוח</span>';
      return `<div class="task-row">
        <div style="font-family:var(--serif);font-size:20px;color:var(--gold)">${String(n).padStart(2,'0')}</div>
        <div><strong>${s.title}</strong></div>
        <div class="muted" style="font-size:13px">${s.desc||''}</div>
        <div style="font-size:12px;color:var(--mut)">${phase?phase.name:'—'}</div>
        <div>${actor}</div>
      </div>`;
    }).join('');
    $('#taskList').innerHTML = head + rows;
  }

  /* ============ Tab switching ============ */
  $$('.tab-btn').forEach(b => b.addEventListener('click', () => {
    $$('.tab-btn').forEach(t=>t.classList.remove('active'));
    b.classList.add('active');
    $$('.tab-pane').forEach(p=>p.classList.remove('active'));
    $('#pane-'+b.dataset.tab).classList.add('active');
  }));

  /* ============ Calculator ============ */
  function fillCalcOptions(){
    $('#calcCar').innerHTML = '<option value="">— בחר רכב —</option>' + CARS.map(c=>`<option value="${c.slug}">${c.name} · MSRP $${c.msrp.toLocaleString()}</option>`).join('');
  }
  function calcRun(){
    const slug = $('#calcCar').value;
    let msrp = parseFloat($('#calcMsrp').value)||0;
    let type = $('#calcType').value;
    if(slug){
      const car = CARS.find(c=>c.slug===slug);
      msrp = car.msrp;
      type = car.type.includes('ev')?'ev':(car.fuel==='דיזל'?'diesel':'gas');
      $('#calcMsrp').value = msrp;
      $('#calcType').value = type;
    }
    if(!msrp){
      ['r-msrp','r-tax','r-vat','r-ship','r-fee','r-total'].forEach(id=>$('#'+id).textContent='—');
      return;
    }
    const purchaseTaxRate = type==='ev'?0.45:0.70; // 35-55% ev, 43-101% gas avg
    const shipping = 2500;
    const vatRate = 0.18;
    const customs = 2000/FX_USD_ILS; // ~$683
    const feeRate = 0.05;

    const tax = msrp * purchaseTaxRate;
    const vat = (msrp+tax) * vatRate;
    const sub = msrp + tax + vat + shipping + customs;
    const fee = sub * feeRate;
    const totalUSD = sub + fee;
    const totalNIS = totalUSD * FX_USD_ILS;

    $('#r-msrp').textContent = fmtUSD(msrp);
    $('#r-tax').textContent = fmtUSD(tax);
    $('#r-vat').textContent = fmtUSD(vat);
    $('#r-ship').textContent = fmtUSD(shipping+customs);
    $('#r-fee').textContent = fmtUSD(fee);
    $('#r-total').textContent = fmtNIS(totalNIS);
  }
  ['change','input'].forEach(ev=>{
    $('#calcCar').addEventListener(ev,calcRun);
    $('#calcMsrp').addEventListener(ev,calcRun);
    $('#calcType').addEventListener(ev,calcRun);
  });

  /* ============ CTA Buttons (existing / new client) ============ */
  function existingCustomer(){
    alert('פורטל לקוחות קיימים — בקרוב.\nאם יש לכם תיק פעיל — שלחו אימייל ל‑info@autoimports.co.il או חייגו 050-000-0000.');
  }
  function newCustomer(){
    document.querySelector('#cars').scrollIntoView({behavior:'smooth'});
  }
  function payDeposit(){
    if(confirm('פתיחת תיק יבוא אישי — ₪500 מקדמה.\n\nתועברו לעמוד תשלום מאובטח. האם להמשיך?')){
      alert('עמוד תשלום — בקרוב.\nבינתיים: info@autoimports.co.il לפתיחת תיק ידנית.');
    }
  }
  ['loginExisting','ctaExisting'].forEach(id=>$('#'+id).addEventListener('click',existingCustomer));
  ['newClient','ctaNew'].forEach(id=>$('#'+id).addEventListener('click',newCustomer));
  $('#ctaPay').addEventListener('click',payDeposit);

  /* ============ Reveal ============ */
  let io;
  function observeReveal(){
    if(!io){
      io = new IntersectionObserver(entries=>{
        entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
      },{threshold:.1});
    }
    $$('.reveal').forEach(el=>io.observe(el));
  }

  /* ============ Boot ============ */
  fillCalcOptions();
  renderProcess();
  renderFAQ();
  renderTasks();
  renderCars();
  observeReveal();
})();
