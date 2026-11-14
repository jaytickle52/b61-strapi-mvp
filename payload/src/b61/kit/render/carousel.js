/*
 * B61 carousel engine (1.68.0) -- shared by B61 Carousel and Card Grid's
 * carousel layout. Read from disk by each element for BOTH dependencies()
 * (front end) and actions() (builder), so the two cannot drift.
 *
 * WHAT THIS DOES NOT DO: lay anything out, or remember where the carousel is.
 * The track is a CSS scroll-snap row and its position is its own scrollLeft,
 * so a Breakdance re-render or class rewrite (the thing that kept breaking
 * B61 Tabs) cannot leave it half-built. Every function here re-derives state
 * from the DOM each time it runs.
 *
 * WHAT IT DOES: wires Previous / Next, the counter and the progress bar;
 * labels the region and slides for screen readers (none of that ARIA is in
 * the server markup, so nothing claims a behaviour a failed script cannot
 * deliver); and in the builder, scrolls the slide you select or add into view
 * and re-syncs when slides are added, moved or removed.
 *
 * Breakdance runs this file through twig (PHP on the page, twig.js in the
 * builder): it must never contain a twig opening delimiter.
 */
(function(){
  if (window.B61Carousel && window.B61Carousel.v >= 2) return;

  var inBuilder = false;
  try { inBuilder = window.parent !== window && !!window.parent.Breakdance; } catch (e) {}

  function reduced(){
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* Scope to THIS carousel: a carousel inside a slide of another is legal. */
  function mine(region, sel){
    return Array.prototype.filter.call(region.querySelectorAll(sel), function(n){
      return n.closest('.js-b61-car') === region;
    });
  }

  function slides(track){
    return Array.prototype.filter.call(track.children, function(n){
      return n.nodeType === 1 && n.offsetParent !== null && n.getBoundingClientRect().width > 0;
    });
  }

  /* Geometry, measured, never stored. step = one slide plus one gap. */
  function geo(track){
    var s = slides(track), n = s.length;
    if (!n) return { n: 0, per: 1, step: 1, adv: 1, pos: 1, cur: 0, s: s };
    var w = s[0].getBoundingClientRect().width;
    var step = n > 1 ? (s[1].offsetLeft - s[0].offsetLeft) : w;
    if (!(step > 0)) step = w || 1;
    var gap = Math.max(0, step - w);
    var per = Math.max(1, Math.floor((track.clientWidth + gap + 2) / step));
    var adv = track.getAttribute('data-b61-car-advance') === 'view' ? per : 1;
    var pos = n <= per ? 1 : Math.ceil((n - per) / adv) + 1;
    var max = track.scrollWidth - track.clientWidth;
    var cur = Math.round(track.scrollLeft / (step * adv));
    if (track.scrollLeft >= max - 2) cur = pos - 1;
    cur = Math.max(0, Math.min(pos - 1, cur));
    return { n: n, per: per, step: step, adv: adv, pos: pos, cur: cur, s: s, max: max };
  }

  function pad(i){ return (i < 10 ? '0' : '') + i; }

  function parts(region){
    return {
      track: mine(region, '.js-b61-car-track')[0] || null,
      controls: mine(region, '.js-b61-car-controls'),
      prev: mine(region, '.js-b61-car-prev'),
      next: mine(region, '.js-b61-car-next'),
      now: mine(region, '.js-b61-car-now'),
      total: mine(region, '.js-b61-car-total'),
      fill: mine(region, '.js-b61-car-progress'),
      status: mine(region, '.js-b61-car-status')[0] || null
    };
  }

  function update(region){
    var p = parts(region);
    if (!p.track) return;
    var g = geo(p.track);

    /* Region and slide semantics (APG carousel pattern), installed here. */
    region.setAttribute('aria-roledescription', 'carousel');
    if (!region.hasAttribute('aria-labelledby') && region.getAttribute('data-b61-car-name')) {
      region.setAttribute('aria-label', region.getAttribute('data-b61-car-name'));
    }
    if (!region.hasAttribute('aria-labelledby') && !region.getAttribute('role') && region.tagName !== 'SECTION') {
      region.setAttribute('role', 'region');
    }
    g.s.forEach(function(sl, i){
      /* The label is on the slide itself (a Card Grid card) or on the
         slide's content wrapper (a Carousel Slide). */
      var named = sl.hasAttribute('data-b61-slide-label') ? sl : sl.querySelector('[data-b61-slide-label]');
      var nm = named && named.closest('.js-b61-car-track') === p.track ? named.getAttribute('data-b61-slide-label') : '';
      sl.setAttribute('role', 'group');
      sl.setAttribute('aria-roledescription', 'slide');
      sl.setAttribute('aria-label', (i + 1) + ' of ' + g.n + (nm ? ': ' + nm : ''));
    });

    var single = g.pos <= 1;
    /* Nothing to scroll (no slides, or they all fit): no controls. They come
       back by themselves when a slide is added or the viewport narrows. */
    p.controls.forEach(function(c){ c.hidden = single; });
    p.prev.forEach(function(b){ b.setAttribute('aria-disabled', (single || g.cur <= 0) ? 'true' : 'false'); });
    p.next.forEach(function(b){ b.setAttribute('aria-disabled', (single || g.cur >= g.pos - 1) ? 'true' : 'false'); });
    p.now.forEach(function(x){ x.textContent = pad(g.cur + 1); });
    p.total.forEach(function(x){ x.textContent = pad(g.pos); });
    p.fill.forEach(function(x){ x.style.width = (100 * (g.cur + 1) / g.pos) + '%'; });
    p.track.setAttribute('data-b61-car-ready', '');
  }

  function go(region, dir, announce){
    var p = parts(region);
    if (!p.track) return;
    var g = geo(p.track);
    var to = Math.max(0, Math.min(g.pos - 1, g.cur + dir));
    if (to === g.cur) return;
    var left = Math.min(g.max, to * g.adv * g.step);
    /* Instant when motion is reduced or the page is not on screen (a smooth
       scroll does not advance in a hidden document). */
    var jump = reduced() || document.hidden;
    try { p.track.scrollTo({ left: left, behavior: jump ? 'instant' : 'smooth' }); }
    catch (e) { p.track.scrollLeft = left; }
    /* The scroll listener normally keeps the counter current, but scroll
       events only fire on rendered frames; this makes sure a press always
       ends with the right state (and covers browsers without scrollend). */
    setTimeout(function(){ update(region); }, jump ? 30 : 450);
    if (announce && p.status) {
      p.status.textContent = '';
      var noun = region.getAttribute('data-b61-car-noun') || 'Slide';
      setTimeout(function(){ p.status.textContent = noun + ' ' + (to * g.adv + 1) + ' of ' + g.n; }, 60);
    }
  }

  function bindTrack(region, track){
    if (track.__b61car) return;
    track.__b61car = true;
    var raf = 0;
    track.addEventListener('scroll', function(){
      if (raf) return;
      /* A short timeout, not rAF: rAF never fires in a background tab, and
         the counter must be right when the tab comes back. */
      raf = setTimeout(function(){ raf = 0; update(region); }, 40);
    }, { passive: true });
    track.addEventListener('scrollend', function(){ update(region); });
  }

  function init(sel){
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    var region = el.classList && el.classList.contains('js-b61-car') ? el : el.querySelector('.js-b61-car');
    if (!region) return;

    /* One delegated listener per region, so re-rendered buttons still work. */
    if (!region.__b61car) {
      region.__b61car = true;
      region.addEventListener('click', function(e){
        var b = e.target.closest && e.target.closest('.js-b61-car-prev, .js-b61-car-next');
        if (!b || b.closest('.js-b61-car') !== region) return;
        if (b.getAttribute('aria-disabled') === 'true') return;
        go(region, b.classList.contains('js-b61-car-next') ? 1 : -1, true);
      });
      if (window.ResizeObserver) {
        new ResizeObserver(function(){ update(region); }).observe(region);
      } else {
        window.addEventListener('resize', function(){ update(region); });
      }
    }

    var t = parts(region).track;
    if (t) bindTrack(region, t);
    update(region);

    /* Builder only: a slide added, moved or removed changes the child list
       without firing any Carousel action, so watch for it. The observer only
       ever calls update(), which re-derives everything, so it cannot loop on
       the attributes update() itself writes (childList only). */
    if (inBuilder && !region.__b61obs && window.MutationObserver) {
      var timer = 0;
      region.__b61obs = new MutationObserver(function(){
        if (timer) return;
        timer = setTimeout(function(){
          timer = 0;
          if (!region.isConnected) return;
          var tr = parts(region).track;
          if (tr) bindTrack(region, tr);
          update(region);
        }, 60);
      });
      region.__b61obs.observe(region, { childList: true, subtree: true });
    }
  }

  /* From anything inside a carousel (a slide hook) or from the element root
     itself (the region sits inside it). */
  function regionOf(sel){
    var el = document.querySelector(sel);
    if (!el) return null;
    return el.closest('.js-b61-car') || el.querySelector('.js-b61-car');
  }

  /* Scroll the slide holding `el` fully into view, inside its own track only
     (scrollIntoView would also scroll the page and every ancestor). */
  function show(el){
    var track = el && el.closest ? el.closest('.js-b61-car-track') : null;
    while (track) {
      var slide = el;
      while (slide && slide.parentElement !== track) slide = slide.parentElement;
      if (slide) {
        var l = slide.offsetLeft, r = l + slide.offsetWidth;
        if (l < track.scrollLeft || r > track.scrollLeft + track.clientWidth) {
          /* Instant, not smooth: the builder jumps straight to the slide
             being edited, and a smooth scroll stalls in a hidden document. */
          var x = Math.max(0, Math.min(l, track.scrollWidth - track.clientWidth));
          try { track.scrollTo({ left: x, behavior: 'instant' }); }
          catch (e) { track.scrollLeft = x; }
          var reg = track.closest('.js-b61-car');
          if (reg) update(reg);
        }
      }
      el = track;
      track = track.parentElement ? track.parentElement.closest('.js-b61-car-track') : null;
    }
  }

  window.B61Carousel = {
    v: 2,
    init: init,
    update: function(sel){ var r = regionOf(sel); if (r) update(r); },
    /* From a slide's builder hooks. Deferred, so a deleted slide has gone and
       a new one has been laid out. `reveal` also brings it into view. */
    refresh: function(sel, reveal){
      var r = regionOf(sel);
      if (!r) return;
      setTimeout(function(){
        if (!r.isConnected) return;
        init(r);
        if (reveal) { var el = document.querySelector(sel); if (el) show(el); }
      }, 40);
    },
    reveal: function(sel){
      var el = document.querySelector(sel);
      if (el) show(el);
    }
  };
})();
