/* FOLD 1 — HERO init shim. Runs after app-mb.js so we win. */
(function(){
  function run(){ if(typeof window.__GITA_HERO__ === 'function'){ window.__GITA_HERO_DONE__ = false; window.__GITA_HERO__(); } }
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(run, 0);
  } else {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(run, 0); });
  }
})();
