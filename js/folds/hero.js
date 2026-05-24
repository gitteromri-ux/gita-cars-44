/* ════════════════════════════════════════════════════════════════
   FOLD 1 — HERO  (Awwwards SOTD level, cobalt midnight)
   IIFE. Exposes window.__GITA_HERO__()
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // ── Hot rotation pool (top-5 saveUSD) ──────────────────────────
  // Will read from window.CARS if defined; data.js declares `const CARS = [...]`
  // at file scope which is NOT on window — so we also probe the `CARS` global.
  function getCarPool(){
    var src = (typeof window!=='undefined' && window.CARS) ? window.CARS :
              (typeof CARS!=='undefined' ? CARS : null);
    var pool = [];
    if(Array.isArray(src) && src.length){
      pool = src.slice().sort(function(a,b){
        return (b.saveUSD||0) - (a.saveUSD||0);
      }).slice(0,5).map(function(c){
        return {
          slug: c.slug || 'mercedes-g63-amg',
          name: c.name || '',
          nameEn: c.nameEn || ''
        };
      });
    }
    if(!pool.length){
      pool = [
        { slug:'mercedes-g63-amg',  name:'מרצדס G63 AMG',         nameEn:'Mercedes-AMG G63' },
        { slug:'mercedes-gls-450d', name:'מרצדס GLS 450d',         nameEn:'Mercedes-Benz GLS 450d' },
        { slug:'mercedes-g580-eq',  name:'מרצדס G580 EQ',          nameEn:'Mercedes-Benz G580 EQ' },
        { slug:'lucid-air-pure',    name:'Lucid Air Pure',         nameEn:'Lucid Air Pure' },
        { slug:'mercedes-g500',     name:'מרצדס G500',             nameEn:'Mercedes-Benz G500' }
      ];
    }
    return pool;
  }

  // ── SVG film grain (data-url, no JPG) ─────────────────────────
  var GRAIN_SVG =
    "url(\"data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">'+
        '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>'+
        '<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/></filter>'+
        '<rect width="220" height="220" filter="url(#n)" opacity="0.9"/>'+
      '</svg>'
    ) + "\")";

  // ── Hebrew text helpers ────────────────────────────────────────
  // Split into spans per "user-perceived char" while preserving spaces.
  function splitChars(str, accentMap){
    // accentMap = { idx: 'class' } e.g. { 14: 'hl-period' }
    var arr = Array.from(str);
    var out = '';
    arr.forEach(function(ch, i){
      if(ch === ' '){
        out += '<span class="hl-space" aria-hidden="true"> </span>';
      } else {
        var cls = 'hl-char';
        if(accentMap && accentMap[i]) cls += ' ' + accentMap[i];
        out += '<span class="'+cls+'" style="animation-delay:'+(i*22)+'ms">'+escapeHtml(ch)+'</span>';
      }
    });
    return out;
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
    });
  }

  // ── Build the HTML ─────────────────────────────────────────────
  function buildHero(){
    var hero = document.getElementById('hero');
    if(!hero) return;

    // Strip existing extras inserted by app-mb.js (scrollhint, bigtype, livestrip)
    // We keep #heroStage, .hero-content (wraps #heroContent), #heroIndicators (required by task)
    // FIX (Audit P0): also preserve .hero-content parent so #heroContent survives.
    Array.from(hero.children).forEach(function(node){
      // Preserve any element that has #heroContent inside it (the wrapper)
      if(node.querySelector && node.querySelector('#heroContent')) return;
      if(!node.id) {
        node.remove();
        return;
      }
      if(['heroStage','heroContent','heroIndicators'].indexOf(node.id) === -1){
        node.remove();
      }
    });

    hero.setAttribute('data-fold','hero');
    hero.classList.add('h-root');

    var pool = getCarPool();
    hero.dataset.activeIdx = '0';

    // ── particle layer
    var particles = document.createElement('div');
    particles.className = 'h-particles';
    particles.setAttribute('aria-hidden','true');

    var fallback = document.createElement('div');
    fallback.className = 'h-particles-fallback';
    fallback.setAttribute('aria-hidden','true');

    // ── stage (cars)
    var stage = document.getElementById('heroStage');
    stage.className = 'h-stage';
    stage.innerHTML = '';
    var carWrap = document.createElement('div');
    carWrap.className = 'h-car-wrap';
    pool.forEach(function(c, i){
      var img = document.createElement('img');
      img.className = 'h-car' + (i===0 ? ' is-active' : '');
      img.src = 'images/car-' + c.slug + '.png';
      img.alt = c.nameEn || c.name || '';
      img.loading = i===0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.dataset.idx = i;
      carWrap.appendChild(img);
    });
    stage.appendChild(carWrap);

    // model meta strip (subtle)
    var meta = document.createElement('div');
    meta.className = 'h-stage-meta';
    meta.innerHTML =
      '<span class="sm-bar"></span>'+
      '<span class="sm-model" id="hStageModel">'+escapeHtml(pool[0].nameEn || pool[0].name)+'</span>'+
      '<span class="sm-rank">01 / 0'+pool.length+'</span>';
    stage.appendChild(meta);

    // ── content
    var content = document.getElementById('heroContent');
    content.className = 'h-content';
    content.innerHTML = buildContentHTML();

    // ── indicators (kept for a11y)
    var ind = document.getElementById('heroIndicators');
    ind.className = 'h-indicators';
    ind.innerHTML = '';
    pool.forEach(function(c, i){
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (c.nameEn || c.name) + ' slide');
      if(i===0) b.setAttribute('aria-current','true');
      b.dataset.idx = i;
      b.addEventListener('click', function(){ setActive(i, true); });
      ind.appendChild(b);
    });

    // ── overlays
    var vignette = document.createElement('div');
    vignette.className = 'h-vignette';
    vignette.setAttribute('aria-hidden','true');

    var grain = document.createElement('div');
    grain.className = 'h-grain';
    grain.setAttribute('aria-hidden','true');
    grain.style.setProperty('--h-grain-url', GRAIN_SVG);

    // assemble in z-order — particles first, then stage already present, then overlays
    hero.insertBefore(particles, hero.firstChild);
    hero.insertBefore(fallback, particles.nextSibling);
    hero.appendChild(vignette);
    hero.appendChild(grain);

    return { hero: hero, stage: stage, content: content, ind: ind, pool: pool, particles: particles };
  }

  function buildContentHTML(){
    // Headline lines — Hebrew, 3 lines, ride-up reveal char-by-char
    // Line 1: "כל רכב מארה״ב."
    // Line 2: "במחיר נמוך מבישראל."
    // Line 3: "72 שעות. עד הבית."
    var line1 = 'כל רכב מארה״ב.';
    var line2 = 'במחיר נמוך מבישראל.';
    var line3 = '72 שעות. עד הבית.';

    function lineHtml(text, baseDelay, accentCls){
      var arr = Array.from(text);
      var out = '';
      arr.forEach(function(ch, i){
        if(ch === ' '){
          out += '<span class="hl-space" aria-hidden="true"> </span>';
        } else {
          var cls = 'hl-char';
          if(ch === '.' && i === arr.length-1) cls += ' ' + accentCls;
          var delay = baseDelay + i*22;
          out += '<span class="'+cls+'" style="animation-delay:'+delay+'ms">'+escapeHtml(ch)+'</span>';
        }
      });
      return out;
    }

    // FIX #1: LCP optimization — show H1 immediately (no animation delay)
    var l1 = lineHtml(line1, 0,  'hl-accent');
    var l2 = lineHtml(line2, 0,  'hl-accent');
    var l3 = lineHtml(line3, 0,  'hl-period');

    return ''+
      '<div class="h-eyebrow" aria-label="יבוא אישי מארה״ב · מודל חדש · 100% שקוף">'+
        '<span>יבוא אישי מארה״ב</span>'+
        '<span class="he-dot" aria-hidden="true">·</span>'+
        '<span>מודל חדש</span>'+
        '<span class="he-dot" aria-hidden="true">·</span>'+
        '<span>100% שקוף</span>'+
      '</div>'+
      '<div class="h-rule" aria-hidden="true"></div>'+
      '<h1 class="h-headline" aria-label="כל רכב מארה״ב. במחיר נמוך מבישראל. 72 שעות. עד הבית.">'+
        '<span class="hl-line">'+l1+'</span>'+
        '<span class="hl-line">'+l2+'</span>'+
        '<span class="hl-line">'+l3+'</span>'+
      '</h1>'+
      '<p class="h-sub">'+
        'אנחנו סורקים את כל ארצות-הברית, מבצעים תחרות בין שותפי-רכב — ואתם משלמים רק את המחיר האמיתי, פלוס '+
        '<span class="hs-cobalt">5% עמלת שירות שקופה</span>.'+
      '</p>'+
      '<div class="h-stats" aria-label="מספרי-מפתח">'+
        '<div class="h-stat">'+
          '<span class="h-stat-num" data-target="78" data-suffix="%">0<span class="hsn-accent">%</span></span>'+
          '<span class="h-stat-lbl">חיסכון מקסימלי מול ישראל</span>'+
        '</div>'+
        '<div class="h-stat">'+
          '<span class="h-stat-num" data-target="348" data-prefix="₪" data-suffix="K"><span class="hsn-accent">₪</span>0<span class="hsn-suffix">K</span></span>'+
          '<span class="h-stat-lbl">חיסכון ממוצע ללקוח</span>'+
        '</div>'+
        '<div class="h-stat">'+
          '<span class="h-stat-num" data-target="72" data-suffix="h">0<span class="hsn-accent">h</span></span>'+
          '<span class="h-stat-lbl">מהפנייה להצעה מותאמת</span>'+
        '</div>'+
      '</div>'+
      '<div class="h-cta-wrap">'+
        '<div class="h-cta-primary">'+
          '<a href="#offer" class="h-cta" id="hCta">'+
            '<span class="h-cta-label">קבלו הצעה תוך 72 שעות</span>'+
            '<span class="h-cta-arrow" aria-hidden="true">'+
              '<svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">'+
                '<path d="M4 11h14M12 5l6 6-6 6" stroke-linecap="square"/>'+
              '</svg>'+
            '</span>'+
          '</a>'+
          '<span class="h-cta-sub">מקדמה 500₪ בלבד · ללא התחייבות</span>'+
        '</div>'+
        '<a href="#how" class="h-cta-secondary">'+
          '<span>איך זה עובד ב-6 שלבים</span>'+
          '<span class="h-cta2-arrow" aria-hidden="true">↓</span>'+
        '</a>'+
      '</div>'+
      '<div class="h-livestrip" aria-live="polite">'+
        '<span class="hl-dot" aria-hidden="true"></span>'+
        '<span class="hl-now">עכשיו:</span>'+
        '<span class="hl-item">12 הצעות פעילות</span>'+
        '<span class="hl-sep" aria-hidden="true">·</span>'+
        '<span class="hl-item">USD/ILS 2.93</span>'+
        '<span class="hl-sep" aria-hidden="true">·</span>'+
        '<span class="hl-item">מע״מ 18%</span>'+
        '<span class="hl-sep" aria-hidden="true">·</span>'+
        '<span class="hl-item">עמלה 5%</span>'+
      '</div>';
  }

  // ── Number count-up ────────────────────────────────────────────
  function easeOutExpo(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10*t); }
  function startCountUps(root){
    var nums = root.querySelectorAll('.h-stat-num[data-target]');
    nums.forEach(function(el){
      var target = parseFloat(el.dataset.target) || 0;
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var dur = 1400;
      var start = performance.now();
      function frame(now){
        var t = Math.min(1, (now - start)/dur);
        var v = Math.round(target * easeOutExpo(t));
        var html = '';
        if(prefix === '₪') html += '<span class="hsn-accent">₪</span>';
        html += v;
        if(suffix === 'K') html += '<span class="hsn-suffix">K</span>';
        else if(suffix === '%') html += '<span class="hsn-accent">%</span>';
        else if(suffix === 'h') html += '<span class="hsn-accent">h</span>';
        el.innerHTML = html;
        if(t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  // ── Three.js particle scene ────────────────────────────────────
  var THREE_STATE = null;
  function bootParticles(container){
    if(!window.THREE) return;
    if(!container) return;
    var isMobile = window.matchMedia('(max-width: 860px)').matches;
    if(isMobile) return; // mobile uses CSS fallback

    var w = container.clientWidth || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, w/h, 1, 3000);
    camera.position.z = 800;

    var renderer = new THREE.WebGLRenderer({ alpha:true, antialias:false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var count = 8000;
    var positions = new Float32Array(count * 3);
    var speeds = new Float32Array(count);
    var sizes = new Float32Array(count);
    for(var i=0; i<count; i++){
      positions[i*3+0] = (Math.random()-0.5) * 2400;
      positions[i*3+1] = (Math.random()-0.5) * 1500;
      positions[i*3+2] = (Math.random()-0.5) * 1800;
      speeds[i] = 0.2 + Math.random()*0.9;
      sizes[i] = Math.random()*2 + 0.6;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Texture: round soft glow drawn on canvas
    var c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    var ctx = c.getContext('2d');
    var grd = ctx.createRadialGradient(32,32,0,32,32,32);
    grd.addColorStop(0,   'rgba(180,210,255,1)');
    grd.addColorStop(0.4, 'rgba(74,143,255,0.6)');
    grd.addColorStop(1,   'rgba(30,95,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,64,64);
    var tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;

    var mat = new THREE.PointsMaterial({
      size: 4.5,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      color: 0x6ea4ff
    });

    var points = new THREE.Points(geo, mat);
    scene.add(points);

    var mouse = { x:0, y:0, tx:0, ty:0 };
    var scrollOffset = 0;

    function onMove(e){
      var t = e.touches ? e.touches[0] : e;
      mouse.tx = (t.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (t.clientY / window.innerHeight - 0.5) * 2;
    }
    function onScroll(){
      var y = window.scrollY || window.pageYOffset;
      scrollOffset = Math.min(1, y / window.innerHeight);
    }
    function onResize(){
      var nw = container.clientWidth || window.innerWidth;
      var nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw/nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    }
    window.addEventListener('mousemove', onMove, { passive:true });
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onResize);

    var raf;
    function loop(){
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // drift particles forward in z, wrap around
      var arr = geo.attributes.position.array;
      for(var i=0; i<count; i++){
        arr[i*3+2] += speeds[i] * (1 + scrollOffset*4);
        if(arr[i*3+2] > 900){
          arr[i*3+2] = -900;
          arr[i*3+0] = (Math.random()-0.5)*2400;
          arr[i*3+1] = (Math.random()-0.5)*1500;
        }
      }
      geo.attributes.position.needsUpdate = true;

      points.rotation.y = mouse.x * 0.15;
      points.rotation.x = mouse.y * 0.10;
      camera.position.z = 800 - scrollOffset*200;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    THREE_STATE = { renderer: renderer, raf: raf, destroy: function(){
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose(); mat.dispose(); tex.dispose();
      if(renderer.domElement && renderer.domElement.parentNode){
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }};
  }

  // ── Car tilt (mousemove desktop / deviceorientation mobile) ────
  function wireTilt(carWrap){
    if(!carWrap) return;
    var isMobile = window.matchMedia('(max-width: 860px)').matches;
    var maxYaw   = isMobile ? 5  : 15;
    var maxPitch = isMobile ? 3  : 8;
    var state = { tx:0, ty:0, x:0, y:0 };
    var lerp = 0.08;

    function update(){
      state.x += (state.tx - state.x) * lerp;
      state.y += (state.ty - state.y) * lerp;
      carWrap.style.transform =
        'perspective(1400px) rotateY('+ state.x.toFixed(2) +'deg) rotateX('+ (-state.y).toFixed(2) +'deg) translateZ(0)';
      requestAnimationFrame(update);
    }
    update();

    function onMouse(e){
      var nx = (e.clientX / window.innerWidth - 0.5) * 2;
      var ny = (e.clientY / window.innerHeight - 0.5) * 2;
      state.tx = nx * maxYaw;
      state.ty = ny * maxPitch;
    }
    window.addEventListener('mousemove', onMouse, { passive:true });

    // Mobile gyro — request permission on first tap (iOS 13+)
    if(isMobile && window.DeviceOrientationEvent){
      function onOrient(e){
        var g = e.gamma || 0; // -90..90 (left/right tilt)
        var b = e.beta  || 0; // -180..180 (front/back tilt)
        state.tx = Math.max(-maxYaw, Math.min(maxYaw, (g/45) * maxYaw));
        state.ty = Math.max(-maxPitch, Math.min(maxPitch, ((b-45)/45) * maxPitch));
      }
      if(typeof DeviceOrientationEvent.requestPermission === 'function'){
        var requested = false;
        document.addEventListener('touchend', function(){
          if(requested) return;
          requested = true;
          DeviceOrientationEvent.requestPermission().then(function(p){
            if(p === 'granted') window.addEventListener('deviceorientation', onOrient);
          }).catch(function(){});
        }, { once:true });
      } else {
        window.addEventListener('deviceorientation', onOrient);
      }
    }
  }

  // ── Magnetic CTA ───────────────────────────────────────────────
  function wireMagneticCTA(cta){
    if(!cta) return;
    var isMobile = window.matchMedia('(max-width: 860px)').matches;
    if(isMobile){
      // simple tap scale
      cta.addEventListener('touchstart', function(){ cta.style.transform = 'scale(1.02)'; }, { passive:true });
      cta.addEventListener('touchend',   function(){ cta.style.transform = 'scale(1)'; },    { passive:true });
      return;
    }
    var radius = 60;
    var maxTranslate = 12;
    var state = { tx:0, ty:0, x:0, y:0, inside:false };

    function update(){
      state.x += (state.tx - state.x) * 0.18;
      state.y += (state.ty - state.y) * 0.18;
      cta.style.transform = 'translate3d('+ state.x.toFixed(2) +'px,'+ state.y.toFixed(2) +'px,0)';
      requestAnimationFrame(update);
    }
    update();

    document.addEventListener('mousemove', function(e){
      var r = cta.getBoundingClientRect();
      var cx = r.left + r.width/2;
      var cy = r.top + r.height/2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.hypot(dx, dy);
      var field = Math.max(r.width, r.height)/2 + radius;
      if(dist < field){
        var pull = Math.min(1, (field - dist) / field);
        state.tx = (dx / field) * maxTranslate * pull * 1.6;
        state.ty = (dy / field) * maxTranslate * pull * 1.6;
      } else {
        state.tx = 0; state.ty = 0;
      }
    }, { passive:true });
  }

  // ── Auto-rotation ──────────────────────────────────────────────
  var ROT_TIMER = null;
  function setActive(idx, userInitiated){
    var hero = document.getElementById('hero');
    if(!hero) return;
    var cars = hero.querySelectorAll('.h-car');
    var btns = hero.querySelectorAll('.h-indicators button');
    var meta = document.getElementById('hStageModel');
    var rank = hero.querySelector('.h-stage-meta .sm-rank');
    if(!cars.length) return;
    idx = ((idx % cars.length) + cars.length) % cars.length;

    cars.forEach(function(c, i){ c.classList.toggle('is-active', i===idx); });
    btns.forEach(function(b, i){
      if(i===idx) b.setAttribute('aria-current','true');
      else b.removeAttribute('aria-current');
    });
    if(meta){
      var activeImg = cars[idx];
      meta.textContent = activeImg ? (activeImg.alt || '') : '';
    }
    if(rank){
      var n = (idx+1).toString().padStart(2,'0');
      var total = cars.length.toString().padStart(2,'0');
      rank.textContent = n + ' / ' + total;
    }
    hero.dataset.activeIdx = idx;

    if(userInitiated){
      // reset timer
      if(ROT_TIMER){ clearInterval(ROT_TIMER); startRotation(); }
    }
  }
  function startRotation(){
    var hero = document.getElementById('hero');
    if(!hero) return;
    ROT_TIMER = setInterval(function(){
      var idx = parseInt(hero.dataset.activeIdx || '0', 10);
      setActive(idx + 1, false);
    }, 6500);
  }

  // ── Main entry ─────────────────────────────────────────────────
  function go(){
    var built = buildHero();
    if(!built) return;

    var hero = built.hero;
    var carWrap = hero.querySelector('.h-car-wrap');
    var cta = hero.querySelector('#hCta');
    var particles = built.particles;

    // Three.js
    if(window.THREE){
      try { bootParticles(particles); } catch(e){ console.warn('hero particles failed', e); }
    } else {
      // wait briefly for three.js if it's still loading
      var waited = 0;
      var iv = setInterval(function(){
        waited += 100;
        if(window.THREE){
          clearInterval(iv);
          try { bootParticles(particles); } catch(e){}
        } else if(waited > 3000){
          clearInterval(iv);
        }
      }, 100);
    }

    wireTilt(carWrap);
    wireMagneticCTA(cta);

    // Count-up: trigger when hero enters viewport (it's at top, so fire on next frame too)
    var triggered = false;
    function trigger(){
      if(triggered) return;
      triggered = true;
      startCountUps(hero);
    }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){ trigger(); io.disconnect(); }
        });
      }, { threshold: 0.15 });
      io.observe(hero);
    }
    // fallback: trigger after small delay (headline reveal finishes ~1.7s)
    setTimeout(trigger, 800);

    // rotation
    startRotation();

    // Pause rotation when tab hidden
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){
        if(ROT_TIMER){ clearInterval(ROT_TIMER); ROT_TIMER = null; }
      } else if(!ROT_TIMER){
        startRotation();
      }
    });
  }

  window.__GITA_HERO__ = function(){
    // Guard: only run once
    if(window.__GITA_HERO_DONE__) return;
    window.__GITA_HERO_DONE__ = true;
    try { go(); } catch(e){ console.error('hero boot failed', e); }
  };

  if(document.readyState !== 'loading'){
    // Defer slightly so app-mb.js (which may rebuild hero) runs first and we win
    setTimeout(window.__GITA_HERO__, 0);
  } else {
    document.addEventListener('DOMContentLoaded', function(){
      setTimeout(window.__GITA_HERO__, 0);
    });
  }
})();
