/* ============================================================
   FOLD: CATALOG  (#catalog)
   Curated 20-car grid with filter rail, chips, sort.
   Each card uses ./images/car-${slug}.png  (NO videos, NO mixups)
   ============================================================ */
(function () {
  'use strict';

  // ── Helpers ──────────────────────────────────────────────
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmtNIS = n => '₪' + Math.round(n).toLocaleString('en-US');

  const makeOf = c => (c.nameEn || c.name).split(' ')[0];
  const fuelOf = c => {
    const t = (c.type || '').toLowerCase();
    if (t.includes('ev'))     return 'ev';
    if (t.includes('phev') || t.includes('hybrid')) return 'hybrid';
    if ((c.fuel || '').includes('דיזל'))            return 'diesel';
    return 'gas';
  };
  const fuelLabel = f => ({ ev:'חשמלי', hybrid:'היברידי', diesel:'דיזל', gas:'בנזין' }[f] || 'בנזין');
  const bodyLabel = b => ({ suv:'SUV', pickup:'פיק-אפ', sedan:'סדאן', coupe:'קופה', sport:'ספורט' }[b] || (b||''));
  const catOf = (c) => {
    const t = (c.type || '').toLowerCase();
    const o = [c.body || ''];
    if (t.includes('ev') || t.includes('phev')) o.push('ev');
    if (t.includes('off-road')) o.push('off-road');
    if (t.includes('sport') || t.includes('coupe')) o.push('sport');
    return o;
  };

  // ── State ────────────────────────────────────────────────
  const state = {
    cond:   'all',                  // all / new / used
    cat:    'all',
    makes:  new Set(),
    bodies: new Set(),
    fuels:  new Set(),
    years:  new Set(),
    pMin:   null,
    pMax:   null,
    sort:   'saving'
  };

  // ── Build filter rail ───────────────────────────────────
  function buildFilters() {
    const CARS = window.CARS || [];
    const makes  = [...new Set(CARS.map(makeOf))].sort();
    const bodies = [...new Set(CARS.map(c => c.body).filter(Boolean))].sort();
    const fuels  = [...new Set(CARS.map(fuelOf))];
    const years  = [...new Set(CARS.map(c => c.year).filter(Boolean))].sort((a,b)=>b-a);

    const fM = $('#filterMakes');
    const fB = $('#filterBody');
    const fF = $('#filterFuel');
    const fY = $('#filterYear');
    if (!fM || !fB || !fF || !fY) return;

    fM.innerHTML = makes.map(m  => `<li><label><input type="checkbox" data-f="make" value="${m}"><span>${m}</span></label></li>`).join('');
    fB.innerHTML = bodies.map(b => `<li><label><input type="checkbox" data-f="body" value="${b}"><span>${bodyLabel(b)}</span></label></li>`).join('');
    fF.innerHTML = fuels.map(f  => `<li><label><input type="checkbox" data-f="fuel" value="${f}"><span>${fuelLabel(f)}</span></label></li>`).join('');
    fY.innerHTML = years.map(y  => `<li><label><input type="checkbox" data-f="year" value="${y}"><span>${y}</span></label></li>`).join('');

    $$('.filter-rail input[type="checkbox"]').forEach(cb => {
      // remove any prior listeners by cloning isn't needed (fresh innerHTML); attach new
      cb.addEventListener('change', e => {
        const f = e.target.dataset.f, v = e.target.value;
        const set = f === 'make' ? state.makes :
                    f === 'body' ? state.bodies :
                    f === 'fuel' ? state.fuels  : state.years;
        const val = f === 'year' ? +v : v;
        if (e.target.checked) set.add(val); else set.delete(val);
        render();
      });
    });
  }

  // ── Apply / sort ────────────────────────────────────────
  function apply() {
    const CARS = window.CARS || [];
    return CARS.filter(c => {
      if (state.cat !== 'all'  && !catOf(c).includes(state.cat)) return false;
      if (state.makes.size  && !state.makes.has(makeOf(c)))  return false;
      if (state.bodies.size && !state.bodies.has(c.body))    return false;
      if (state.fuels.size  && !state.fuels.has(fuelOf(c)))  return false;
      if (state.years.size  && !state.years.has(c.year))     return false;
      if (state.pMin && c.landedNIS < state.pMin) return false;
      if (state.pMax && c.landedNIS > state.pMax) return false;
      return true;
    });
  }
  function sortCars(arr) {
    const a = [...arr];
    if (state.sort === 'saving')      a.sort((x,y) => y.saveUSD - x.saveUSD);
    else if (state.sort === 'price-asc')  a.sort((x,y) => x.landedNIS - y.landedNIS);
    else if (state.sort === 'price-desc') a.sort((x,y) => y.landedNIS - x.landedNIS);
    else if (state.sort === 'newest')     a.sort((x,y) => (y.year || 0) - (x.year || 0));
    return a;
  }

  // ── Card markup ─────────────────────────────────────────
  function cardHTML(c) {
    return `
    <article class="vcard" data-slug="${c.slug}">
      <div class="vcard-media">
        <img class="vcard-img"
             src="./images/car-${c.slug}.png"
             alt="${c.name}"
             loading="lazy"
             onerror="this.style.opacity=0.2"/>
        <span class="vcard-badge">−${c.savePct}%</span>
      </div>
      <div class="vcard-body">
        <div class="vcard-meta">
          <span>${c.year || ''}</span>
          <span>${bodyLabel(c.body)}</span>
          <span>${fuelLabel(fuelOf(c))}</span>
        </div>
        <h3>${c.name}</h3>
        <div class="vcard-prices">
          <div class="vcard-landed-row">
            <span class="vcard-landed-lbl">סופי</span>
            <span class="vcard-landed">${fmtNIS(c.landedNIS)}</span>
          </div>
          <div class="vcard-israel-row">
            <span class="vcard-israel-lbl">ישראל</span>
            <span class="vcard-strike">${fmtNIS(c.israelNIS)}</span>
          </div>
        </div>
        <span class="vcard-enter">
          פתח פרטים
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </span>
      </div>
    </article>`;
  }

  // ── Render ──────────────────────────────────────────────
  function render() {
    const grid = $('#catGrid');
    if (!grid) return;

    const filtered = sortCars(apply());
    const count = $('#resultsCount');
    if (count) count.textContent = filtered.length;

    if (!filtered.length) {
      grid.innerHTML = `<div class="cat-empty">
        לא נמצאו רכבים בפילטרים שנבחרו.
        <br><button type="button" id="catEmptyClear">נקה פילטרים</button>
      </div>`;
      $('#catEmptyClear')?.addEventListener('click', clearAll);
      return;
    }

    grid.innerHTML = filtered.map(cardHTML).join('');

    // wire card clicks
    grid.querySelectorAll('.vcard').forEach(el => {
      el.addEventListener('click', () => {
        const slug = el.dataset.slug;
        if (typeof window.openVDP === 'function') window.openVDP(slug);
      });
    });
  }

  function clearAll() {
    state.makes.clear(); state.bodies.clear(); state.fuels.clear(); state.years.clear();
    state.pMin = null; state.pMax = null;
    state.cat = 'all';
    state.cond = 'all';
    $$('.filter-rail input[type="checkbox"]').forEach(cb => cb.checked = false);
    const pmn = $('#priceMin'), pmx = $('#priceMax');
    if (pmn) pmn.value = ''; if (pmx) pmx.value = '';
    $$('#catChips .cat-chip').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    $$('#condToggle .cat-cond').forEach(b => b.classList.toggle('active', b.dataset.cond === 'all'));
    render();
  }

  // ── Wiring ──────────────────────────────────────────────
  function wire() {
    // Chips
    $$('#catChips .cat-chip').forEach(b => {
      b.addEventListener('click', () => {
        $$('#catChips .cat-chip').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        state.cat = b.dataset.cat;
        render();
      });
    });

    // Condition toggle — add the cobalt-glow attention class to the "used" button
    const cond = $('#condToggle');
    if (cond) {
      const buttons = cond.querySelectorAll('.cat-cond');
      buttons.forEach(b => {
        if (b.dataset.cond === 'used') b.classList.add('attn');
        b.addEventListener('click', () => {
          buttons.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          state.cond = b.dataset.cond;
          // condition is a visual emphasis — doesn't yet filter the 20 (all are 0 km)
          render();
        });
      });
    }

    // Price range
    $('#priceMin')?.addEventListener('input', e => { state.pMin = +e.target.value || null; render(); });
    $('#priceMax')?.addEventListener('input', e => { state.pMax = +e.target.value || null; render(); });

    // Sort
    $('#catSort')?.addEventListener('change', e => { state.sort = e.target.value; render(); });

    // Clear
    $('#filterClear')?.addEventListener('click', clearAll);

    // Mobile filter open
    const mb   = $('#filterBtnMobile');
    const rail = $('#filterRail');
    if (mb && rail) {
      mb.addEventListener('click', () => rail.classList.toggle('open'));
    }
  }

  // ── Public API ──────────────────────────────────────────
  // Filter the catalog programmatically from the calc CTA
  window.gitaCatalogFilter = function ({ body, fuel } = {}) {
    state.makes.clear(); state.bodies.clear(); state.fuels.clear(); state.years.clear();
    state.cat = 'all';
    if (body) state.bodies.add(body);
    if (fuel) state.fuels.add(fuel);

    // sync checkboxes
    $$('.filter-rail input[type="checkbox"]').forEach(cb => {
      cb.checked = (cb.dataset.f === 'body' && cb.value === body) ||
                   (cb.dataset.f === 'fuel' && cb.value === fuel);
    });
    $$('#catChips .cat-chip').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    render();
  };
  window.gitaClearFilters = clearAll;

  // Expose CARS globally if data.js declared it as top-level const (script scope)
  try { if (typeof CARS !== 'undefined' && !window.CARS) window.CARS = CARS; } catch (_) {}

  // ── Mount ────────────────────────────────────────────────
  let _tries = 0;
  function mount() {
    try { if (typeof CARS !== 'undefined' && !window.CARS) window.CARS = CARS; } catch (_) {}
    if (!window.CARS || !Array.isArray(window.CARS)) {
      if (_tries++ < 40) { setTimeout(mount, 50); return; }
      return;
    }
    buildFilters();
    wire();
    render();
  }

  window.__GITA_CATALOG__ = mount;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(mount, 30), { once: true });
  } else {
    setTimeout(mount, 30);
  }
})();
