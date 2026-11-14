/* B61 Gallery behaviour: the plugin's behavior.js (1.77.1), unchanged except
 * that it receives its root instead of looking up %%SELECTOR%%. */
// @ts-nocheck
export function initGallery(root) {
    if (!root || root.__b61galInit) return;
  root.__b61galInit = true;
  var region = root.querySelector('.b61-gallery__region');
  var strip = root.querySelector('.js-b61-gal-strip');
  if (!region || !strip) return;

  /* Masonry runs before the arrow wiring, because a masonry grid has no arrows
     and would otherwise fall out at the `prev || next` guard below.

     Heights are measured, not derived: a figure's box is content-sized (the
     grid row span reserves tracks, it does not constrain the item), so one
     read gives the photo plus its caption. The image macro prints width and
     height on every img, so the browser reserves the right box before the file
     arrives and the first measurement is already correct. */
  if (strip.classList.contains('js-b61-gal-masonry')) {
    var relayout = function(){
      var items = strip.querySelectorAll('.b61-gallery__item');
      if (!items.length) return;
      strip.classList.add('is-masonry');
      /* Read AFTER the class is on, or these are the pre-masonry values.
         `row` and `rg` come from the resolved grid, not from the token, so a
         site that retunes either gets correct spans for free. */
      var cs = getComputedStyle(strip);
      var row = parseFloat(cs.gridAutoRows) || 1;
      var rg = parseFloat(cs.rowGap) || 0;
      /* The gap we WANT between stacked photos is the one already between the
         columns — reading columnGap keeps the two axes equal by construction. */
      var gap = parseFloat(cs.columnGap) || 20;
      /* An item spanning n rows is allotted n*row + (n-1)*rg. Solve for the
         smallest n whose allotment covers the item plus one trailing gap:
             n = ceil((h + gap + rg) / (row + rg))
         With rg = 0 and row = 1 this is ceil(h + gap) — exact to the pixel,
         which is the whole point of dropping the row gap. */
      for (var i = 0; i < items.length; i++) {
        var h = items[i].getBoundingClientRect().height;
        items[i].style.setProperty('--b61-span', String(Math.max(1, Math.ceil((h + gap + rg) / (row + rg)))));
      }
    };
    relayout();
    /* A late-arriving photo without printed dimensions changes the height. */
    var imgs = strip.querySelectorAll('img');
    for (var n = 0; n < imgs.length; n++) {
      if (!imgs[n].complete) imgs[n].addEventListener('load', relayout, { once: true });
    }
    if (window.ResizeObserver) { new ResizeObserver(relayout).observe(strip); }
    else { window.addEventListener('resize', relayout); }
    region.classList.add('is-ready');
    return;
  }

  var prev = root.querySelector('.js-b61-gal-prev');
  var next = root.querySelector('.js-b61-gal-next');
  if (!prev || !next) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function step(){
    var item = strip.querySelector('.b61-gallery__item');
    var w = item ? item.getBoundingClientRect().width + 20 : strip.clientWidth * 0.8;
    return Math.max(w, Math.min(strip.clientWidth, w * Math.floor(strip.clientWidth / w)));
  }
  function sync(){
    var max = strip.scrollWidth - strip.clientWidth;
    var x = strip.scrollLeft;
    prev.setAttribute('aria-disabled', x <= 1 ? 'true' : 'false');
    next.setAttribute('aria-disabled', x >= max - 1 ? 'true' : 'false');
    region.classList.toggle('has-overflow', max > 1);
  }
  /* Track the commanded target rather than scrolling relative to the live
     position. scrollBy() measures from wherever the smooth animation currently
     is, so three quick presses advance less than three pages. */
  var target = null;
  function go(dir){
    var max = strip.scrollWidth - strip.clientWidth;
    if (max <= 1) return;
    var base = (target === null) ? strip.scrollLeft : target;
    target = Math.max(0, Math.min(max, base + dir * step()));
    strip.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
  }
  /* The moment the reader takes over by hand, the commanded target is stale. */
  ['pointerdown', 'wheel', 'touchstart'].forEach(function(ev){
    strip.addEventListener(ev, function(){ target = null; }, { passive: true });
  });
  prev.addEventListener('click', function(){ if (prev.getAttribute('aria-disabled') !== 'true') go(-1); });
  next.addEventListener('click', function(){ if (next.getAttribute('aria-disabled') !== 'true') go(1); });
  strip.addEventListener('scroll', sync, { passive: true });
  if (window.ResizeObserver) { new ResizeObserver(sync).observe(strip); }
  else { window.addEventListener('resize', sync); }
  sync();
  region.classList.add('is-ready');
}
