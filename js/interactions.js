// ============================================================
// AutoImports — Advanced Interactions Layer (interactions.js)
// Modules: Hero 3D Parallax | Stock Board Flicker |
//          VDP 360° Gallery | Live Price Calculator
// Loads AFTER app-mb.js; reads window.openVDP, window.CARS, FX_USD_ILS
// ============================================================
(function () {
  'use strict';

  // ── Shared helpers ──────────────────────────────────────────
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const FX = (typeof FX_USD_ILS !== 'undefined') ? FX_USD_ILS : 2.93;
  const fmtILS = n => '₪' + Math.round(n).toLocaleString('en-US');
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  // ── VIDEOS pool (mirrors app-mb.js for deterministic slug → video) ──
  const VIDEOS = [
    './videos/hero-italy-road.mp4',
    './videos/neon-highway.mp4',
    './videos/smudge-highway.mp4',
    './videos/fast-sports-rural.mp4',
    './videos/sports-muscle-rural.mp4',
    './videos/rocky-terrain.mp4',
    './videos/drone-light-car-dark.mp4',
    './videos/windscreen-friends.mp4',
    './videos/ignition-button.mp4',
    './videos/garage-lift.mp4',
    './videos/auto-garage-up-lifting.mp4',
    './videos/happy-dealership.mp4',
    './videos/israel-mediterranean.mp4',
    './videos/container-dock-israel.mp4',
    './videos/drone-roro-shipping.mp4'
  ];

  // Deterministic hash (same as app-mb.js vidFor)
  const vidFor = (slug, offset) => {
    let h = 0;
    for (let k = 0; k < (slug || '').length; k++) h = (h * 31 + slug.charCodeAt(k)) >>> 0;
    return VIDEOS[(h + (offset || 0)) % VIDEOS.length];
  };

  // Pick 8 different video angles for a slug deterministically
  const anglesFor = (slug) => Array.from({ length: 8 }, (_, i) => vidFor(slug, i + 3));

  // ============================================================
  // MODULE 1: HERO 3D PARALLAX + SCROLL
  // ============================================================
  function initHeroParallax() {
    const hero = $('#hero');
    if (!hero) return;

    let heroInView = false;
    let raf = null;
    let scrollY = 0;
    let mouseX = 0, mouseY = 0;
    let tiltX = 0, tiltY = 0;
    let gyroX = 0, gyroY = 0;
    let hasGyro = false;
    let rafPending = false;

    // IntersectionObserver — only animate when hero is visible
    const obs = new IntersectionObserver(entries => {
      heroInView = entries[0].isIntersecting;
      if (heroInView) scheduleRaf();
    }, { threshold: 0 });
    obs.observe(hero);

    // Touch / gyro detection
    const isTouchDevice = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    if (isTouchDevice() && typeof DeviceOrientationEvent !== 'undefined') {
      const requestPerm = () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then(state => { if (state === 'granted') window.addEventListener('deviceorientation', onGyro); })
            .catch(() => {});
        } else {
          window.addEventListener('deviceorientation', onGyro);
        }
      };
      // Request on first interaction to avoid iOS blocked state
      document.addEventListener('touchstart', requestPerm, { once: true });
    }

    function onGyro(e) {
      hasGyro = true;
      // gamma = left/right tilt (-90 to 90), beta = front/back (-180 to 180)
      gyroX = clamp((e.beta  || 0) / 30, -1, 1);  // maps ±30deg → ±1
      gyroY = clamp((e.gamma || 0) / 30, -1, 1);
      scheduleRaf();
    }

    // Mouse move — only on non-touch
    if (!isTouchDevice()) {
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mouseX = (e.clientX - r.left) / r.width  * 2 - 1;  // -1 .. 1
        mouseY = (e.clientY - r.top)  / r.height * 2 - 1;
        scheduleRaf();
      });
      hero.addEventListener('mouseleave', () => {
        mouseX = 0; mouseY = 0;
        scheduleRaf();
      });
    }

    // Scroll listener
    const onScroll = () => {
      scrollY = window.scrollY;
      scheduleRaf();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    function scheduleRaf() {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(applyParallax);
      }
    }

    function applyParallax() {
      rafPending = false;
      if (!heroInView) return;

      // ── Parallax on scroll ──
      const videos = $$('.hero-video', hero);
      const content = $('#heroContent');

      // Video parallax: 0.4x scroll speed
      if (videos.length) {
        videos.forEach(v => {
          v.style.transform = `translateY(${scrollY * 0.4}px)`;
          v.style.willChange = 'transform';
        });
      }

      // Hero text: 0.15x + fade from 1→0.3 over first 300px scroll
      if (content) {
        const fadeProgress = clamp(scrollY / 300, 0, 1);
        const opacity = lerp(1, 0.3, fadeProgress);
        content.style.transform = `translateY(${scrollY * 0.15}px)`;
        content.style.opacity = opacity;
        content.style.willChange = 'transform, opacity';
      }

      // ── 3D tilt ──
      const MAX_TILT = 3; // degrees
      const targetTiltX = hasGyro ? gyroX * MAX_TILT : -mouseY * MAX_TILT;
      const targetTiltY = hasGyro ? gyroY * MAX_TILT :  mouseX * MAX_TILT;

      // Smooth lerp toward target
      tiltX = lerp(tiltX, targetTiltX, 0.08);
      tiltY = lerp(tiltY, targetTiltY, 0.08);

      const stage = $('#heroStage');
      if (stage) {
        stage.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        stage.style.willChange = 'transform';
      }

      // If tilt is still converging, keep animating
      const stillMoving =
        Math.abs(tiltX - targetTiltX) > 0.01 ||
        Math.abs(tiltY - targetTiltY) > 0.01;
      if (stillMoving && heroInView) scheduleRaf();
    }

    console.log('[GITA] Module 1: Hero 3D Parallax initialized');
  }

  // ============================================================
  // MODULE 2: STOCK BOARD LIVE FLICKER
  // ============================================================
  function initStockFlicker() {
    const board = $('#board');
    if (!board) return;

    // ── Inject LIVE status counter ──
    const liveTag = $('.live-tag', board);
    if (liveTag) {
      // Replace static text with a ticking counter
      liveTag.innerHTML = `<span class="dot"></span>שידור חי · <span id="liveCounter">עודכן 0:03 שניות</span>`;
      let secondsAgo = 3;
      setInterval(() => {
        secondsAgo = (secondsAgo + 1) % 60;
        const el = $('#liveCounter');
        if (el) el.textContent = `עודכן 0:${String(secondsAgo).padStart(2, '0')} שניות`;
      }, 1000);
    }

    // ── Ticker flicker ──
    function flickerTickerItem() {
      const items = $$('.tkr-item', board);
      if (!items.length) return;
      const item = items[Math.floor(Math.random() * items.length)];
      const delta = $('.tkr-delta', item);
      if (!delta) return;

      // Parse current pct from text like "▲ 78.5%"
      const text = delta.textContent || '';
      const match = text.match(/([\d.]+)%/);
      if (!match) return;
      const base = parseFloat(match[1]);
      const change = (Math.random() * 0.4 - 0.1); // ±0.1 to ±0.3%
      const newPct = Math.max(0.1, base + change);
      const isUp = Math.random() > 0.15; // 85% up ticks

      // Flash background
      item.style.transition = 'background 0.15s ease';
      item.style.background = isUp ? 'rgba(0,230,120,0.18)' : 'rgba(255,60,60,0.18)';
      delta.style.transition = 'color 0.15s ease';
      delta.classList.remove('up', 'down');
      delta.classList.add(isUp ? 'up' : 'down');
      delta.textContent = (isUp ? '▲ ' : '▼ ') + newPct.toFixed(1) + '%';

      setTimeout(() => {
        item.style.background = '';
        // restore original text
        delta.textContent = (isUp ? '▲ ' : '▼ ') + base.toFixed(1) + '%';
      }, 600);
    }

    // Schedule at random 2.5–4s intervals
    let flickerTimeout;
    function scheduleFlicker() {
      const delay = 2500 + Math.random() * 1500;
      flickerTimeout = setTimeout(() => {
        flickerTickerItem();
        scheduleFlicker();
      }, delay);
    }
    scheduleFlicker();

    // ── bcard-save pulse every 5 seconds ──
    function pulseSavings() {
      const saveEls = $$('.bcard-save b', board);
      if (!saveEls.length) return;
      const el = saveEls[Math.floor(Math.random() * saveEls.length)];
      el.style.transition = 'transform 0.15s ease, text-shadow 0.15s ease';
      el.style.transform = 'scale(1.04)';
      el.style.textShadow = '0 0 12px rgba(0,230,100,0.8)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.textShadow = '';
      }, 400);
    }
    setInterval(pulseSavings, 5000);

    // ── Board card highlight on random interval ──
    function flickerBoardCard() {
      const cards = $$('.bcard', board);
      if (!cards.length) return;
      const card = cards[Math.floor(Math.random() * cards.length)];
      const isUp = Math.random() > 0.15;
      card.style.transition = 'box-shadow 0.2s ease, outline 0.2s ease';
      card.style.outline = `2px solid ${isUp ? '#00e678' : '#ff3c3c'}`;
      card.style.boxShadow = `0 0 20px ${isUp ? 'rgba(0,230,120,0.3)' : 'rgba(255,60,60,0.25)'}`;
      setTimeout(() => {
        card.style.outline = '';
        card.style.boxShadow = '';
      }, 700);
    }
    setInterval(flickerBoardCard, 3800);

    console.log('[GITA] Module 2: Stock Board Flicker initialized');
  }

  // ============================================================
  // MODULE 3: VDP 360° GALLERY
  // ============================================================
  function initVDP360() {
    const originalOpenVDP = window.openVDP;
    if (typeof originalOpenVDP !== 'function') return;

    // Override global openVDP
    window.openVDP = function (slug) {
      // Call original first
      originalOpenVDP(slug);
      // Then inject gallery after a tiny tick so DOM is settled
      requestAnimationFrame(() => inject360Gallery(slug));
    };

    console.log('[GITA] Module 3: VDP 360° Gallery hooked');
  }

  function inject360Gallery(slug) {
    const vdpMain = $('.vdp-main');
    if (!vdpMain) return;

    // Remove any previously injected gallery
    const old = $('.vdp-360-gallery');
    if (old) old.remove();

    const angles = anglesFor(slug);  // 8 video "angles"

    // Build gallery HTML
    const gallery = document.createElement('section');
    gallery.className = 'vdp-360-gallery';
    gallery.innerHTML = `
      <div class="v360-header">
        <h3>360° — כל הזוויות <span class="v360-badge">8 זוויות</span></h3>
        <div class="v360-controls">
          <button class="v360-auto" id="v360Auto" title="סיבוב אוטומטי">⟳ אוטו</button>
          <button class="v360-fs" id="v360FS" title="מסך מלא">⛶ מסך מלא</button>
        </div>
      </div>
      <div class="v360-main" id="v360Main">
        <video
          class="v360-display"
          id="v360Display"
          muted autoplay loop playsinline webkit-playsinline
          preload="auto"
          src="${angles[0]}"
        ></video>
        <div class="v360-overlay-hint" id="v360Hint">← גרור לסיבוב →</div>
        <div class="v360-progress">
          <div class="v360-progress-bar" id="v360Bar"></div>
        </div>
      </div>
      <div class="v360-thumbs" id="v360Thumbs">
        ${angles.map((src, i) => `
          <button class="v360-thumb ${i === 0 ? 'active' : ''}" data-i="${i}" data-src="${src}">
            <video muted loop playsinline webkit-playsinline preload="metadata" src="${src}"></video>
            <span>${i + 1}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Inject at the TOP of vdp-main
    vdpMain.insertBefore(gallery, vdpMain.firstChild);

    // ── Bind interaction ──
    const display   = $('#v360Display');
    const thumbCont = $('#v360Thumbs');
    const bar       = $('#v360Bar');
    const hint      = $('#v360Hint');
    const autoBtn   = $('#v360Auto');
    const fsBtn     = $('#v360FS');
    const mainEl    = $('#v360Main');
    const thumbBtns = $$('.v360-thumb', gallery);

    let currentAngle = 0;
    let autoRotate = false;
    let autoTimer = null;
    let lastInteract = Date.now();
    const AUTO_DELAY = 8000;   // 8s no-interact → start auto
    const AUTO_INTERVAL = 4000; // rotate every 4s

    // Fade hint after 3s
    setTimeout(() => { if (hint) hint.style.opacity = '0'; }, 3000);

    function goTo(i) {
      if (i === currentAngle) return;
      currentAngle = ((i % angles.length) + angles.length) % angles.length;
      thumbBtns.forEach(b => b.classList.toggle('active', +b.dataset.i === currentAngle));
      if (display) {
        display.style.opacity = '0';
        display.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
          display.src = angles[currentAngle];
          display.play().catch(() => {});
          display.style.opacity = '1';
        }, 120);
      }
      if (bar) bar.style.width = ((currentAngle + 1) / angles.length * 100) + '%';
    }

    // Thumbnail clicks
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lastInteract = Date.now();
        stopAuto();
        goTo(+btn.dataset.i);
      });
    });

    // Drag / swipe on main display
    let dragStart = null;
    const onDragStart = (e) => {
      dragStart = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const onDragEnd = (e) => {
      if (dragStart === null) return;
      const end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = end - dragStart;
      dragStart = null;
      if (Math.abs(diff) > 30) {
        lastInteract = Date.now();
        stopAuto();
        // RTL-aware: dragging right → previous angle
        goTo(diff < 0 ? currentAngle + 1 : currentAngle - 1);
      }
    };
    mainEl.addEventListener('mousedown',  onDragStart);
    mainEl.addEventListener('touchstart', onDragStart, { passive: true });
    mainEl.addEventListener('mouseup',    onDragEnd);
    mainEl.addEventListener('touchend',   onDragEnd, { passive: true });

    // Auto-rotate
    function startAuto() {
      if (autoRotate) return;
      autoRotate = true;
      autoBtn.classList.add('active');
      autoTimer = setInterval(() => goTo(currentAngle + 1), AUTO_INTERVAL);
    }
    function stopAuto() {
      autoRotate = false;
      autoBtn.classList.remove('active');
      if (autoTimer) clearInterval(autoTimer);
    }

    // Start auto after 8s inactivity
    const idleCheck = setInterval(() => {
      if (!document.getElementById('v360Main')) { clearInterval(idleCheck); return; }
      if (Date.now() - lastInteract > AUTO_DELAY && !autoRotate) startAuto();
    }, 1000);

    autoBtn.addEventListener('click', () => {
      lastInteract = Date.now();
      if (autoRotate) stopAuto(); else startAuto();
    });

    // Fullscreen lightbox (pinch-zoom equivalent)
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        mainEl.requestFullscreen && mainEl.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });
    // Also dblclick for fullscreen
    mainEl.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) {
        mainEl.requestFullscreen && mainEl.requestFullscreen();
      }
    });

    // Pinch-zoom detection (scale up on pinch)
    let lastTouchDist = null;
    mainEl.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        lastInteract = Date.now();
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastTouchDist !== null && d - lastTouchDist > 20) {
          // Pinch out — go fullscreen
          mainEl.requestFullscreen && mainEl.requestFullscreen();
        }
        lastTouchDist = d;
      }
    }, { passive: true });
    mainEl.addEventListener('touchend', () => { lastTouchDist = null; });

    // Init bar
    if (bar) bar.style.width = (1 / angles.length * 100) + '%';

    // Play thumb videos on hover
    $$('.v360-thumb video', gallery).forEach(v => {
      v.closest('.v360-thumb').addEventListener('mouseenter', () => v.play().catch(() => {}));
      v.closest('.v360-thumb').addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
    });
  }

  // ============================================================
  // MODULE 4: LIVE PRICE CALCULATOR
  // ============================================================
  function initPriceCalculator() {
    const widget = $('#calcWidget');
    if (!widget) return;

    // ── Inject HTML ──
    widget.innerHTML = `
      <div class="calc-body">

        <!-- LEFT: Inputs -->
        <div class="calc-inputs">
          <div class="calc-field">
            <label class="calc-lbl" for="calcMsrp">מחיר MSRP (ארה"ב)</label>
            <div class="calc-slider-row">
              <output class="calc-slider-val" id="calcMsrpVal">$100,000</output>
            </div>
            <input
              type="range"
              id="calcMsrp"
              min="30000"
              max="300000"
              step="1000"
              value="100000"
              class="calc-range"
              inputmode="numeric"
              aria-label="MSRP slider"
            >
            <div class="calc-slider-labels">
              <span>$30K</span>
              <span>$300K</span>
            </div>
          </div>

          <div class="calc-field">
            <label class="calc-lbl">סוג דלק — משפיע על מס קנייה</label>
            <div class="calc-fuel-btns" id="calcFuelBtns">
              <button class="calc-fb active" data-fuel="gas">בנזין</button>
              <button class="calc-fb" data-fuel="ev">חשמלי</button>
              <button class="calc-fb" data-fuel="phev">PHEV היברידי</button>
            </div>
          </div>

          <div class="calc-field">
            <label class="calc-lbl">שיעור מס קנייה — <span id="calcTaxPctLabel">72%</span></label>
            <input
              type="range"
              id="calcTaxPct"
              min="43"
              max="101"
              step="1"
              value="72"
              class="calc-range"
              aria-label="Tax rate slider"
            >
            <div class="calc-slider-labels">
              <span id="calcTaxMin">43%</span>
              <span id="calcTaxMax">101%</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: Breakdown + savings -->
        <div class="calc-results">
          <div class="calc-breakdown" id="calcBreakdown">
            <div class="cbr-row"><span>בסיס (MSRP × ${FX})</span><b id="cbBase">₪0</b></div>
            <div class="cbr-row"><span>מס קנייה</span><b id="cbTax">₪0</b></div>
            <div class="cbr-row"><span>מע"מ 18%</span><b id="cbVat">₪0</b></div>
            <div class="cbr-row"><span>שילוח ($2,000)</span><b id="cbShip">₪0</b></div>
            <div class="cbr-row"><span>מכס ושחרור</span><b id="cbCustoms">₪0</b></div>
            <div class="cbr-row"><span>עמלת שירות 5%</span><b id="cbFee">₪0</b></div>
            <div class="cbr-row discount"><span>הנחה בלעדית GITA</span><b id="cbDiscount">−₪0</b></div>
            <div class="cbr-row total"><span>סה"כ מחיר סופי בישראל</span><b id="cbTotal">₪0</b></div>
          </div>

          <div class="calc-compare">
            <div class="calc-col gita">
              <div class="calc-col-lbl">מחיר AutoImports סופי</div>
              <div class="calc-col-price" id="ccGita">₪0</div>
            </div>
            <div class="calc-col vs">VS</div>
            <div class="calc-col importer">
              <div class="calc-col-lbl">יבואן רשמי (הערכה)</div>
              <div class="calc-col-price" id="ccImporter">₪0</div>
            </div>
          </div>

          <div class="calc-save-box">
            <div class="calc-save-lbl">החיסכון שלך</div>
            <div class="calc-save-num" id="calcSaveNum">₪0</div>
            <div class="calc-save-pct" id="calcSavePct">0%</div>
          </div>

          <button class="calc-cta" onclick="window.gitaOpenWA && window.gitaOpenWA('')">
            פתח תיק ₪500 — קבל הצעה אמיתית
          </button>
        </div>
      </div>
    `;

    // ── CountUp utility ──
    // Smoothly animates displayed integer value from current → target
    class CountUp {
      constructor(el, { prefix = '', suffix = '' } = {}) {
        this.el = el;
        this.prefix = prefix;
        this.suffix = suffix;
        this.current = 0;
        this.target = 0;
        this.raf = null;
      }
      set(target) {
        this.target = target;
        if (this.raf) cancelAnimationFrame(this.raf);
        this._tick();
      }
      _tick() {
        const diff = this.target - this.current;
        if (Math.abs(diff) < 1) {
          this.current = this.target;
          this._render();
          return;
        }
        this.current = this.current + diff * 0.14;
        this._render();
        this.raf = requestAnimationFrame(() => this._tick());
      }
      _render() {
        this.el.textContent = this.prefix + Math.round(this.current).toLocaleString('en-US') + this.suffix;
      }
    }

    // Create CountUp instances for each number field
    const counters = {
      base:      new CountUp($('#cbBase'),     { prefix: '₪' }),
      tax:       new CountUp($('#cbTax'),      { prefix: '₪' }),
      vat:       new CountUp($('#cbVat'),      { prefix: '₪' }),
      ship:      new CountUp($('#cbShip'),     { prefix: '₪' }),
      customs:   new CountUp($('#cbCustoms'),  { prefix: '₪' }),
      fee:       new CountUp($('#cbFee'),      { prefix: '₪' }),
      discount:  new CountUp($('#cbDiscount'), { prefix: '−₪' }),
      total:     new CountUp($('#cbTotal'),    { prefix: '₪' }),
      gita:      new CountUp($('#ccGita'),     { prefix: '₪' }),
      importer:  new CountUp($('#ccImporter'), { prefix: '₪' }),
      save:      new CountUp($('#calcSaveNum'),{ prefix: '₪' }),
    };

    // Fuel tax ranges
    const TAX_RANGES = {
      gas:  { min: 43, max: 101, default: 72 },
      ev:   { min: 35, max:  55, default: 45 },
      phev: { min: 35, max:  55, default: 45 }
    };

    let selectedFuel = 'gas';
    const msrpSlider  = $('#calcMsrp');
    const taxSlider   = $('#calcTaxPct');
    const msrpValEl   = $('#calcMsrpVal');
    const taxPctLabel = $('#calcTaxPctLabel');
    const taxMinLabel = $('#calcTaxMin');
    const taxMaxLabel = $('#calcTaxMax');

    // Excel Price breakdown constants (USD/ILS = 2.93)
    const SHIPPING_USD  = 2000;          // Excel B3 — corrected from $2,500
    const SHIPPING_ILS  = SHIPPING_USD * FX; // ~₪5,860
    const CUSTOMS_ILS   = 2000;          // Excel — מכס ושחרור
    const DISCOUNT_USD  = 3000;          // Excel B4 — exclusive AutoImports discount
    const DISCOUNT_ILS  = DISCOUNT_USD * FX; // ~₪8,790

    function recalc() {
      const msrp      = +msrpSlider.value;
      const taxPct    = +taxSlider.value / 100;

      const base      = msrp * FX;
      const taxAmt    = base * taxPct;
      const subtotal  = base + taxAmt;
      const vat       = subtotal * 0.18;
      const ship      = SHIPPING_ILS;
      const customs   = CUSTOMS_ILS;
      const preService= subtotal + vat + ship + customs;
      const fee       = preService * 0.05;
      const discount  = DISCOUNT_ILS;
      const total     = preService + fee - discount;
      const importer  = total * 1.78;
      const save      = importer - total;
      const savePct   = ((save / importer) * 100).toFixed(1);

      // Animate all numbers
      counters.base.set(base);
      counters.tax.set(taxAmt);
      counters.vat.set(vat);
      counters.ship.set(ship);
      counters.customs.set(customs);
      counters.fee.set(fee);
      counters.discount.set(discount);
      counters.total.set(total);
      counters.gita.set(total);
      counters.importer.set(importer);
      counters.save.set(save);

      const savePctEl = $('#calcSavePct');
      if (savePctEl) savePctEl.textContent = savePct + '%';

      // Pulse save box on big changes
      const saveBox = $('.calc-save-box');
      if (saveBox) {
        saveBox.style.transition = 'transform 0.1s ease, box-shadow 0.15s ease';
        saveBox.style.transform = 'scale(1.03)';
        saveBox.style.boxShadow = '0 0 24px rgba(0,230,100,0.4)';
        setTimeout(() => {
          saveBox.style.transform = 'scale(1)';
          saveBox.style.boxShadow = '';
        }, 200);
      }
    }

    function updateFuelUI(fuel) {
      selectedFuel = fuel;
      const range = TAX_RANGES[fuel];
      taxSlider.min = range.min;
      taxSlider.max = range.max;
      taxSlider.value = range.default;
      taxMinLabel.textContent = range.min + '%';
      taxMaxLabel.textContent = range.max + '%';
      taxPctLabel.textContent = range.default + '%';
      recalc();
    }

    // MSRP slider
    msrpSlider.addEventListener('input', () => {
      const v = +msrpSlider.value;
      if (msrpValEl) msrpValEl.textContent = '$' + Math.round(v).toLocaleString('en-US');
      recalc();
    });

    // Tax slider
    taxSlider.addEventListener('input', () => {
      if (taxPctLabel) taxPctLabel.textContent = taxSlider.value + '%';
      recalc();
    });

    // Fuel buttons
    $$('#calcFuelBtns .calc-fb').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#calcFuelBtns .calc-fb').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateFuelUI(btn.dataset.fuel);
      });
    });

    // Initial render
    updateFuelUI('gas');
    console.log('[GITA] Module 4: Live Price Calculator initialized');
  }

  // ============================================================
  // STYLES — Inject all required CSS for the new modules
  // ============================================================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
/* ── Module 1: Hero Parallax ── */
.hero-stage {
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
}
.hero-content {
  will-change: transform, opacity;
  transition: opacity 0.05s linear;
}
.hero-video {
  will-change: transform;
}

/* ── Module 2: Stock Board Flicker ── */
.tkr-item {
  transition: background 0.15s ease;
}
.tkr-delta.down { color: #ff4d4d !important; }
.tkr-delta.up   { color: #00e678 !important; }
#liveCounter {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

/* ── Module 3: VDP 360° Gallery ── */
.vdp-360-gallery {
  padding: 0 0 28px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 24px;
  user-select: none;
}
.v360-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.v360-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--mb-text, #fff);
  display: flex;
  align-items: center;
  gap: 8px;
}
.v360-badge {
  font-size: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 2px 7px;
  border-radius: 20px;
  color: var(--mb-text-muted, #aaa);
}
.v360-controls {
  display: flex;
  gap: 8px;
}
.v360-controls button {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--mb-text, #fff);
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.v360-controls button:hover,
.v360-controls button.active {
  background: var(--mb-accent, #fff);
  color: #000;
  border-color: var(--mb-accent, #fff);
}
.v360-main {
  position: relative;
  width: 100%;
  aspect-ratio: 16/7;
  border-radius: 12px;
  overflow: hidden;
  background: #0a0a0a;
  cursor: grab;
  touch-action: pan-y;
}
.v360-main:active { cursor: grabbing; }
.v360-main:fullscreen, .v360-main:-webkit-full-screen {
  aspect-ratio: unset;
  height: 100vh;
  border-radius: 0;
}
.v360-display {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.12s ease;
  pointer-events: none;
}
.v360-overlay-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.25);
  pointer-events: none;
  transition: opacity 1s ease;
}
.v360-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.1);
}
.v360-progress-bar {
  height: 100%;
  background: var(--mb-accent, #fff);
  transition: width 0.3s ease;
}
.v360-thumbs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.v360-thumbs::-webkit-scrollbar { display: none; }
.v360-thumb {
  flex: 0 0 calc(12.5% - 7px);
  min-width: 80px;
  aspect-ratio: 16/9;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.1);
  cursor: pointer;
  background: #111;
  transition: border-color 0.15s ease, transform 0.15s ease;
  position: relative;
}
.v360-thumb.active {
  border-color: var(--mb-accent, #fff);
  transform: translateY(-2px);
}
.v360-thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.v360-thumb span {
  position: absolute;
  bottom: 3px;
  right: 5px;
  font-size: 10px;
  color: rgba(255,255,255,0.7);
  font-weight: 600;
}

/* ── Module 4: Price Calculator ── */
.calc {
  background: var(--mb-bg, #0a0a0a);
  padding: 80px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.calc-w {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.calc .sec-head {
  text-align: center;
  margin-bottom: 48px;
}
.calc .sec-head h2 {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  color: var(--mb-text, #fff);
  margin: 8px 0 0;
}
.calc .sec-head .eyebrow {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mb-accent, #ddd);
}
.calc-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}
@media (max-width: 768px) {
  .calc-body { grid-template-columns: 1fr; gap: 32px; }
}
.calc-inputs {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.calc-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.calc-lbl {
  font-size: 13px;
  font-weight: 500;
  color: var(--mb-text-muted, #aaa);
  letter-spacing: 0.02em;
}
.calc-slider-row {
  display: flex;
  justify-content: flex-end;
}
.calc-slider-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--mb-text, #fff);
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
.calc-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  direction: ltr; /* sliders always ltr */
}
.calc-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--mb-accent, #fff);
  cursor: pointer;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.calc-range::-webkit-slider-thumb:active {
  transform: scale(1.2);
  box-shadow: 0 0 0 5px rgba(255,255,255,0.25);
}
.calc-range::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--mb-accent, #fff);
  cursor: pointer;
  border: none;
}
.calc-slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--mb-text-muted, #777);
}
.calc-fuel-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.calc-fb {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid rgba(255,255,255,0.12);
  background: transparent;
  color: var(--mb-text, #fff);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.calc-fb.active,
.calc-fb:hover {
  background: var(--mb-accent, #fff);
  border-color: var(--mb-accent, #fff);
  color: #000;
}
/* Results panel */
.calc-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.calc-breakdown {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cbr-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--mb-text-muted, #aaa);
}
.cbr-row b {
  color: var(--mb-text, #fff);
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
.cbr-row.total {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 10px;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 700;
  color: var(--mb-text, #fff);
}
.cbr-row.total b { font-size: 17px; }
/* Comparison columns */
.calc-compare {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  overflow: hidden;
}
.calc-col {
  flex: 1;
  padding: 18px;
  text-align: center;
}
.calc-col.vs {
  flex: 0 0 40px;
  font-weight: 800;
  font-size: 14px;
  color: var(--mb-text-muted, #777);
  border-left: 1px solid rgba(255,255,255,0.07);
  border-right: 1px solid rgba(255,255,255,0.07);
}
.calc-col-lbl {
  font-size: 11px;
  color: var(--mb-text-muted, #888);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}
.calc-col-price {
  font-size: 20px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
.calc-col.gita .calc-col-price { color: #00e678; }
.calc-col.importer .calc-col-price {
  color: var(--mb-text-muted, #888);
  text-decoration: line-through;
  text-decoration-color: rgba(255,80,80,0.5);
}
/* Savings box */
.calc-save-box {
  background: linear-gradient(135deg, rgba(0,230,120,0.08), rgba(0,180,100,0.05));
  border: 1px solid rgba(0,230,120,0.25);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  transition: transform 0.1s ease, box-shadow 0.15s ease;
}
.calc-save-lbl {
  font-size: 12px;
  color: rgba(0,230,120,0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.calc-save-num {
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 900;
  color: #00e678;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  line-height: 1;
}
.calc-save-pct {
  font-size: 16px;
  color: rgba(0,230,120,0.6);
  font-weight: 600;
  margin-top: 4px;
}
.calc-cta {
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background: var(--mb-accent, #fff);
  border: none;
  color: #000;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
  letter-spacing: 0.02em;
}
.calc-cta:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // INIT — Wire everything up on DOMContentLoaded
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS first
    try { injectStyles(); } catch (e) { console.error('[GITA] styles', e); }

    // Module 1: Hero Parallax
    try { initHeroParallax(); } catch (e) { console.error('[GITA] parallax', e); }

    // Module 2: Stock Board Flicker
    // Board may not be rendered yet — delay slightly so buildBoard() in app-mb.js runs first
    setTimeout(() => {
      try { initStockFlicker(); } catch (e) { console.error('[GITA] flicker', e); }
    }, 400);

    // Module 3: VDP 360° (hooks window.openVDP — must wait for app-mb.js to set it)
    try { initVDP360(); } catch (e) { console.error('[GITA] vdp360', e); }

    // Module 4: Price Calculator
    try { initPriceCalculator(); } catch (e) { console.error('[GITA] calculator', e); }

    console.log('[GITA] interactions.js fully initialized — 4 modules active');
  });

})();

// ============================================================
// AutoImports AWARD LAYER — Reveals, Counters, Hero Bigtype, Lenis,
// 30-Step Modal, Reviews, Advisors, Intake, Cursor, Mobile Nav,
// Magnetic Buttons, 3D Tilt — appended after main IIFE
// ============================================================
(function () {
  'use strict';

  const isTouch = matchMedia('(hover: none), (max-width: 920px)').matches;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Module A: Scroll reveal via IntersectionObserver ────────
  function initReveals() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  // ── Module B: Count-up animation for trust bar metrics ──────
  function initCounters() {
    const nums = document.querySelectorAll('.ti-num[data-count]');
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.count || '0');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const easeOut = t => 1 - Math.pow(1 - t, 3);

      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const val = Math.round(target * easeOut(p));
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animate);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }

  // ── Module C: Hero character-by-character display type ──────
  function initHeroBigType() {
    const lines = document.querySelectorAll('.hero-bigtype .bt-line[data-chars]');
    if (!lines.length) return;
    const hero = document.querySelector('.hero-mb');

    lines.forEach((line, lineIdx) => {
      const text = line.dataset.chars || line.textContent || '';
      line.textContent = '';
      const chars = Array.from(text);
      chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'bt-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.transitionDelay = (lineIdx * 320 + i * 38) + 'ms';
        line.appendChild(span);
      });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.hero-bigtype .bt-char').forEach(c => c.classList.add('in'));
        if (hero) hero.classList.add('bigtype-on');
      });
    });
  }

  // ── Module D: Hero live strip — vehicle ticker sync ─────────
  function initHeroLiveStrip() {
    const strip = document.getElementById('heroLiveStrip');
    if (!strip) return;
    const CARS = window.CARS || [];
    const FX = window.FX_USD_ILS || 2.93;
    if (!CARS.length) return;

    // Pick top 5 by savingsILS (or by rank)
    const picks = CARS.slice()
      .sort((a, b) => (b.savingsILS || 0) - (a.savingsILS || 0))
      .slice(0, 5);

    let idx = 0;
    const render = () => {
      const c = picks[idx];
      const priceIL = c.priceILS || Math.round((c.priceUSD || 0) * FX);
      const saveK = Math.round((c.savingsILS || 0) / 1000);
      strip.innerHTML = `
        <span class="ls-dot"></span>
        <span class="ls-name">${c.name}</span>
        <span class="ls-sep">·</span>
        <span class="ls-price">₪${priceIL.toLocaleString('he-IL')}</span>
        <span class="ls-sep">·</span>
        <span class="ls-save">חיסכון ₪${saveK}K</span>
      `;
      strip.classList.remove('in');
      void strip.offsetWidth;
      strip.classList.add('in');
    };
    render();
    setInterval(() => { idx = (idx + 1) % picks.length; render(); }, 4200);
  }

  // ── Module E: Lenis smooth scroll ───────────────────────────
  function initLenis() {
    if (prefersReduced) return;
    if (typeof window.Lenis === 'undefined') {
      // Retry once after a tick — defer-loaded
      setTimeout(() => {
        if (typeof window.Lenis !== 'undefined') initLenis();
      }, 600);
      return;
    }
    try {
      const lenis = new window.Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      window.__gitaLenis = lenis;
    } catch (e) { console.warn('[GITA] Lenis init failed', e); }
  }

  // ── Module F: 30-Step Regulatory Modal ──────────────────────
  const REG30 = [
    { t: 'בחירת רכב', d: 'הלקוח בוחר דגם וגרסה מתוך הקטלוג של AutoImports.' },
    { t: 'פתיחת תיק', d: 'תשלום מקדמה של ₪500 והתחלת תיק יבוא אישי.' },
    { t: 'איתור בארה״ב', d: 'צוות מקצועי מאתר את הרכב בסוכנויות מורשות בלבד.' },
    { t: 'תחרות מחיר', d: 'מכרז בין מספר סוכנויות להבטחת המחיר הטוב ביותר.' },
    { t: 'הצעה רשמית', d: 'הצעת מחיר סופית מאושרת בכתב, כולל כל העלויות.' },
    { t: 'תשלום מקדמה', d: 'תשלום מקדמת רכישה לפי תנאי החוזה.' },
    { t: 'אישור רכישה', d: 'חתימה על מסמכי הרכישה וקבלת אישור Bill of Sale.' },
    { t: 'Title Transfer', d: 'העברת בעלות רשמית על שם היבואן.' },
    { t: 'בדיקת מכון', d: 'בדיקה טכנית בארה״ב — 200 נקודות, דוח מלא ללקוח.' },
    { t: 'דוח Carfax', d: 'דוח היסטוריה מלא — תאונות, בעלים קודמים, ק״מ מאומת.' },
    { t: 'הטענה לאוניה', d: 'העברה לנמל בלוס אנג׳לס / ניו ג׳רזי, הטענה ל-RoRo או קונטיינר.' },
    { t: 'Bill of Lading', d: 'הנפקת שטר מטען ימי רשמי.' },
    { t: 'מעקב שיט', d: 'מעקב GPS חי דרך אפליקציית AutoImports — 24-35 ימי שיט.' },
    { t: 'הגעה לאשדוד', d: 'הרכב מגיע לנמל אשדוד או חיפה לפי המסלול.' },
    { t: 'טופס 21', d: 'הגשת טופס 21 לרשות המסים — הצהרת יבוא אישי.' },
    { t: 'תשלום מס קנייה', d: 'תשלום מס קנייה (43-101% דלק / 35-55% חשמלי).' },
    { t: 'תשלום מע״מ', d: 'תשלום מע״מ 18% על המחיר המלא כולל מסים.' },
    { t: 'שחרור מהמכס', d: 'שחרור הרכב מרשות המכס לאחר תשלום כל המסים.' },
    { t: 'התקנת מובילאיי', d: 'התקנת מערכת בטיחות מובילאיי בהתאם לתקן הישראלי.' },
    { t: 'בדיקת סטנדרטיזציה', d: 'בדיקת התאמה לתקנים הטכניים של משרד התחבורה.' },
    { t: 'התאמת פנסים', d: 'כיוון פנסים לתקן האירופי/ישראלי.' },
    { t: 'מד מהירות מטרי', d: 'המרת מד מהירות לק״מ ולוודא תקינות.' },
    { t: 'רישום משרד הרישוי', d: 'רישום הרכב במשרד הרישוי כיבוא אישי.' },
    { t: 'לוחית רישוי', d: 'הנפקה והרכבת לוחית רישוי ישראלית.' },
    { t: 'ביטוח חובה', d: 'הפקת פוליסת ביטוח חובה דרך יועץ ביטוח AutoImports.' },
    { t: 'ביטוח מקיף', d: 'הפקת פוליסת מקיף ייעודית לרכבי יוקרה מיובאים.' },
    { t: 'טסט שנתי', d: 'במידה ויש צורך (רכבים מעל 3 שנים) — מבחן רישוי.' },
    { t: 'בדיקת מסירה', d: 'בדיקה סופית של הרכב טרם המסירה ללקוח.' },
    { t: 'חתימה על מסמכים', d: 'חתימה על מסמכי בעלות, אחריות ומסירה.' },
    { t: 'מסירת מפתחות', d: 'מסירת מפתחות ולוחית ללקוח — הרכב שלכם.' }
  ];

  function init30StepModal() {
    const modal = document.getElementById('reg30Modal');
    const body = document.getElementById('reg30Body');
    const opener = document.getElementById('open30Steps');
    if (!modal || !body) return;

    body.innerHTML = REG30.map((s, i) => `
      <article class="reg30-item">
        <div class="reg30-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="reg30-content">
          <h4 class="reg30-title">${s.t}</h4>
          <p class="reg30-desc">${s.d}</p>
        </div>
      </article>
    `).join('');

    const open = () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.__gitaLenis) window.__gitaLenis.stop();
    };
    const close = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.__gitaLenis) window.__gitaLenis.start();
    };

    if (opener) opener.addEventListener('click', open);
    modal.querySelectorAll('[data-close="reg30"]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }

  // ── Module G: Reviews grid ──────────────────────────────────
  const REVIEWS = [
    { name: 'יוסי לוי', mono: 'יל', car: 'מרצדס G63 AMG', stars: 5,
      quote: 'חסכתי ₪915,000 לעומת היבואן הרשמי. השירות של AutoImports היה ברמה של פרייבט בנקינג. כל שלב מתועד, כל סכום שקוף.' },
    { name: 'דנה כהן', mono: 'דכ', car: 'פורד ברונקו ראפטור', stars: 5,
      quote: 'הזמנתי ברונקו ראפטור שלא קיים אצל היבואן. תוך 9 שבועות הרכב היה בחניה — עם לוחית ישראלית, ביטוח, הכל מסודר.' },
    { name: 'אבי בן-דוד', mono: 'אב', car: 'טסלה מודל S Plaid', stars: 5,
      quote: 'יבוא טסלה Plaid לישראל. צוות מקצועי, יושר ושקיפות מלאה. המחיר היה בדיוק כמו במחשבון — שום הפתעות.' },
    { name: 'מיכל רוזן', mono: 'מר', car: 'ג׳יפ רנגלר רוביקון', stars: 5,
      quote: 'חוויית רכישה אחרת לגמרי. אפליקציה למעקב על השיט, יועץ אישי, ובדיקת 200 נקודות לפני שילוח. שווה כל שקל.' },
    { name: 'רן אדלר', mono: 'רא', car: 'מרצדס GLS 450d', stars: 5,
      quote: 'GLS 450d במפרט Maybach — לא קיים בארץ דרך היבואן. AutoImports הביאו אותו תוך 11 שבועות, חסכון של מעל ₪400K.' },
    { name: 'תמר שגיא', mono: 'תש', car: 'טסלה Cybertruck', stars: 5,
      quote: 'הראשונים בישראל עם Cybertruck. AutoImports טיפלו במובילאיי, רגולציה, רישוי — הכל. עבודה מדויקת ומקצועית.' }
  ];

  function initReviews() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;
    const star = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7 7.3 14.4 1.7 9.5l7.4-.6z"/></svg>';
    grid.innerHTML = REVIEWS.map((r, i) => `
      <article class="review-card" data-tilt style="--rev-i:${i}">
        <div class="review-stars" aria-label="${r.stars} כוכבים">${star.repeat(r.stars)}</div>
        <blockquote class="review-quote">"${r.quote}"</blockquote>
        <div class="review-foot">
          <div class="review-mono" aria-hidden="true">${r.mono}</div>
          <div class="review-meta">
            <div class="review-name">${r.name}</div>
            <div class="review-car">${r.car}</div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // ── Module H: Advisory board ────────────────────────────────
  const ADVISORS = [
    { name: 'אבי משעצדקיה', role: 'יועץ מס בכיר', mono: 'אמ',
      bio: 'מומחה ביבוא אישי ובמיסוי רכב. 20+ שנות ניסיון מול רשות המסים ומשרד התחבורה.' },
    { name: 'Yael Amichai', role: 'דוברות וקשרי קהילה', mono: 'YA',
      bio: 'מובילה את ה־PR והקהילה של AutoImports. בוגרת אוניברסיטת ת״א, ניסיון בקבוצות יוקרה גלובליות.' },
    { name: 'Dr. Michael Green', role: 'בודק טכני ראשי', mono: 'MG',
      bio: 'מהנדס רכב עם 25 שנות ניסיון. אחראי לבדיקת ה־200 נקודות לפני כל שילוח.' },
    { name: 'Dr. Adam Cohen', role: 'מנהל שרשרת אספקה', mono: 'AC',
      bio: 'דוקטור ללוגיסטיקה בינלאומית. מנהל את כל מסלול השיט, מהסוכנות עד אשדוד.' },
    { name: 'רונן שטרן', role: 'יועץ ביטוח', mono: 'רש',
      bio: 'מומחה לביטוח רכבים מיובאים ויוקרתיים. שותף ל־3 חברות ביטוח מובילות.' },
    { name: 'נטע פרידמן', role: 'יועצת מימון בכירה', mono: 'נפ',
      bio: 'מובילה את חבילות המימון של AutoImports לרכבי יוקרה. ניסיון בבנקאות פרטית.' }
  ];

  function initAdvisors() {
    const grid = document.getElementById('advGrid');
    if (!grid) return;
    grid.innerHTML = ADVISORS.map((a, i) => `
      <article class="adv-card" data-tilt style="--adv-i:${i}">
        <div class="adv-mono" aria-hidden="true">${a.mono}</div>
        <h3 class="adv-name">${a.name}</h3>
        <div class="adv-role">${a.role}</div>
        <p class="adv-bio">${a.bio}</p>
      </article>
    `).join('');
  }

  // ── Module I: Intake form → WhatsApp ────────────────────────
  function initIntakeForm() {
    const form = document.getElementById('intakeForm');
    const status = document.getElementById('intakeStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const car = (data.get('car') || '').toString().trim();
      const budget = (data.get('budget') || '').toString().trim();
      const timing = (data.get('timing') || '').toString().trim();
      const notes = (data.get('notes') || '').toString().trim();

      if (!name || !phone) {
        if (status) {
          status.textContent = 'יש למלא שם ומספר טלפון.';
          status.className = 'if-status err';
        }
        return;
      }

      const lines = [
        '*בקשת ייעוץ GITA*',
        `שם: ${name}`,
        `טלפון: ${phone}`,
        car ? `רכב מעניין: ${car}` : '',
        budget ? `תקציב: ${budget}` : '',
        timing ? `לוח זמנים: ${timing}` : '',
        notes ? `הערות: ${notes}` : ''
      ].filter(Boolean);

      const msg = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/972500000000?text=${msg}`;

      if (status) {
        status.textContent = 'מעביר אותך ל־WhatsApp...';
        status.className = 'if-status ok';
      }
      setTimeout(() => { window.open(url, '_blank', 'noopener'); }, 280);
    });
  }

  // ── Module J: Cursor follower (desktop only) ────────────────
  function initCursor() {
    if (isTouch) return;
    const dot = document.getElementById('cursorDot');
    if (!dot) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const speed = 0.18;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!dot.classList.contains('active')) dot.classList.add('active');
    }, { passive: true });

    document.addEventListener('mouseleave', () => dot.classList.remove('active'));

    const largeSel = 'a, button, [data-tilt], input, select, textarea, .calc-cta, .btn-mb-primary, .btn-30steps, .mb-nav-cta';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(largeSel)) dot.classList.add('large');
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(largeSel)) dot.classList.remove('large');
    }, { passive: true });

    function loop() {
      x += (tx - x) * speed;
      y += (ty - y) * speed;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ── Module K: Mobile WhatsApp trigger ───────────────────────
  function initMobWA() {
    const trig = document.getElementById('mobWaTrig');
    if (!trig) return;
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.gitaOpenWA === 'function') {
        window.gitaOpenWA();
      } else {
        window.open('https://wa.me/972500000000', '_blank', 'noopener');
      }
    });
  }

  // ── Module L: Magnetic buttons (desktop only) ───────────────
  function initMagnetic() {
    if (isTouch || prefersReduced) return;
    const sel = '.btn-mb-primary, .if-submit, .btn-30steps, .mb-nav-cta, .calc-cta';
    document.querySelectorAll(sel).forEach(btn => {
      const strength = 12;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / r.width;
        const dy = (e.clientY - cy) / r.height;
        btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ── Module M: 3D tilt on cards ──────────────────────────────
  function initTilt() {
    if (isTouch || prefersReduced) return;
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
      const max = 6;
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.18s ease-out';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── INIT ────────────────────────────────────────────────────
  function bootAward() {
    try { initReveals(); } catch (e) { console.error('[GITA-A] reveals', e); }
    try { initCounters(); } catch (e) { console.error('[GITA-A] counters', e); }
    try { initHeroBigType(); } catch (e) { console.error('[GITA-A] bigtype', e); }
    try { initHeroLiveStrip(); } catch (e) { console.error('[GITA-A] livestrip', e); }
    try { initLenis(); } catch (e) { console.error('[GITA-A] lenis', e); }
    try { init30StepModal(); } catch (e) { console.error('[GITA-A] reg30', e); }
    try { initReviews(); } catch (e) { console.error('[GITA-A] reviews', e); }
    try { initAdvisors(); } catch (e) { console.error('[GITA-A] advisors', e); }
    try { initIntakeForm(); } catch (e) { console.error('[GITA-A] intake', e); }
    try { initCursor(); } catch (e) { console.error('[GITA-A] cursor', e); }
    try { initMobWA(); } catch (e) { console.error('[GITA-A] mobwa', e); }
    // Late-bind magnetic/tilt after app-mb.js renders catalog
    setTimeout(() => {
      try { initMagnetic(); } catch (e) { console.error('[GITA-A] magnetic', e); }
      try { initTilt(); } catch (e) { console.error('[GITA-A] tilt', e); }
    }, 600);
    console.log('[GITA AWARD] all award-layer modules initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAward);
  } else {
    bootAward();
  }
})();
