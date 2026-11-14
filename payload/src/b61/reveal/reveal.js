/*
 * B61 ENTRANCE REVEAL (1.40.0) - one player for every band element
 *
 * Elements with Entrance animation ON mark their parts [data-b61-reveal-item],
 * in the order they should arrive. This plays each part once, on a timer, as it
 * scrolls into view. Parts that arrive in the same moment are staggered in
 * document order, so a band reads heading -> intro -> cards -> buttons.
 *
 * The CSS (utilities.css, ENTRANCE REVEAL) hides nothing until this script has
 * put .b61-reveal-ready on <html>, so every early return below leaves the page
 * exactly as it would be with no animation at all.
 *
 * Section veto: [data-b61-reveal="off"] on ANY ancestor turns its contents off.
 * A B61 Section set to On also reveals its direct children that are not B61
 * elements (a native heading, an image), one unit each.
 */
/*
 * Payload port: the plugin's reveal.js, unchanged in behaviour, wrapped in a
 * function so the site can run it again after each client-side page change
 * (a WordPress page load runs it once; a Next.js navigation does not reload).
 * Only items not already shown are picked up, and stop() removes listeners.
 * Still never runs inside an iframe, so the live preview never hides content.
 */
export function runReveal() {
  
  var doc = document;
  var ac = new AbortController();
  function noop() {}
  var root = doc.documentElement;

  // The builder canvas is an iframe of the front end. An editor must never be
  // looking at invisible content, so the canvas never reveals.
  try { if (window.self !== window.top) return noop; } catch (e) { return noop; }
  if (!('IntersectionObserver' in window)) return noop;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;

  var cs = getComputedStyle(root);
  if (cs.getPropertyValue('--b61-rise-enabled').trim() === '0') return noop;

  // Times arrive as "70ms" or "0.07s".
  function ms(name, fallback) {
    var raw = cs.getPropertyValue(name).trim();
    var v = parseFloat(raw);
    if (!(v >= 0)) return fallback;
    return /ms$/.test(raw) ? v : (/s$/.test(raw) ? v * 1000 : v);
  }
  var step = ms('--b61-rise-stagger', 70);
  var countMs = ms('--b61-motion-count', 1400);
  var maxSteps = parseInt(cs.getPropertyValue('--b61-rise-stagger-max'), 10);
  if (!(maxSteps >= 0)) maxSteps = 6;

  // A B61 Section's plain children become one item each.
  var inners = doc.querySelectorAll('[data-b61-reveal="on"] > .b61-section__inner');
  for (var i = 0; i < inners.length; i++) {
    var kids = inners[i].children;
    for (var k = 0; k < kids.length; k++) {
      var kid = kids[k];
      if (kid.matches('[data-b61-reveal], [data-b61-reveal-item]')) continue;
      if (kid.querySelector('[data-b61-reveal], [data-b61-reveal-item]')) continue;
      kid.setAttribute('data-b61-reveal-item', '');
    }
  }

  // A part inside an Off section is shown at once. It still carries the item
  // attribute (its own element is On), so it must be marked in, or the CSS
  // would hide it for good.
  var all = doc.querySelectorAll('[data-b61-reveal-item]:not(.b61-in)');
  var items = [];
  for (var j = 0; j < all.length; j++) {
    if (all[j].closest('[data-b61-reveal="off"]')) all[j].classList.add('b61-in');
    else items.push(all[j]);
  }
  if (!items.length) { root.classList.add('b61-reveal-ready'); return noop; }

  // Anything on screen right now is shown, not animated. Measured BEFORE the
  // ready class exists, in the same task, so nothing on screen can blink.
  var vh = window.innerHeight || root.clientHeight;
  var pending = [];
  for (var n = 0; n < items.length; n++) {
    var r = items[n].getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) items[n].classList.add('b61-in');
    else pending.push(items[n]);
  }
  root.classList.add('b61-reveal-ready');

  /*
   * COUNT-UP (Stats Band). A figure marked [data-b61-count] counts from zero
   * when its stat reveals. Only a figure with exactly one number counts:
   * "412", "98%", "$2.5M", "1,200+" do; "1:12", "K-8" and a year ("1952")
   * do not, they just reveal. The page's HTML always holds the real figure,
   * and the count always ends on the exact text the editor typed.
   */
  var FIG = /^([^0-9]*?)([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)(\.[0-9]+)?([^0-9]*)$/;
  function countIn(item, delay) {
    var figs = item.querySelectorAll('[data-b61-count]');
    for (var f = 0; f < figs.length; f++) startCount(figs[f], delay);
  }
  function startCount(el, delay) {
    if (el.children.length) return; // markup inside (a <sup>): leave it be
    var text = el.textContent;
    var m = FIG.exec(text.trim());
    if (!m) return;
    // A range or a label, not a quantity: "K-8", "PK-12", "3/4".
    if (/[-\u2013\/:]\s*$/.test(m[1]) || /^\s*[-\u2013\/:]/.test(m[4])) return;
    var whole = m[2], frac = m[3] || '';
    var commas = whole.indexOf(',') >= 0;
    var target = parseFloat((whole + frac).replace(/,/g, ''));
    if (!commas && !frac && whole.length === 4 && target >= 1800 && target <= 2100) return;
    var places = frac ? frac.length - 1 : 0;
    function fmt(n) {
      var str = n.toFixed(places);
      if (commas) {
        var parts = str.split('.');
        parts[0] = parts[0].replace(/\B(?=([0-9]{3})+(?![0-9]))/g, ',');
        str = parts.join('.');
      }
      return m[1] + str + m[4];
    }
    // Hold the finished width so the stat does not jostle as digits appear.
    var w = el.getBoundingClientRect().width;
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    el.style.minWidth = w + 'px';
    el.textContent = fmt(0);
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      el.textContent = text;
      el.style.removeProperty('min-width');
      el.style.removeProperty('display');
    }
    // Frames can stall (a background tab pauses them), so the real figure is
    // restored on a timer too. A stat must never be left reading 0.
    setTimeout(finish, delay + countMs + 150);
    setTimeout(function () {
      var t0 = null;
      function tick(now) {
        if (finished) return;
        if (t0 === null) t0 = now;
        var k = Math.min((now - t0) / countMs, 1);
        if (k < 1) {
          el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)));
          window.requestAnimationFrame(tick);
        } else {
          finish();
        }
      }
      window.requestAnimationFrame(tick);
    }, delay);
  }

  function done(e) {
    if (e.target === this) {
      this.classList.remove('b61-in--anim');
      this.style.removeProperty('--b61-reveal-delay');
      this.removeEventListener('animationend', done);
    }
  }

  var io = new IntersectionObserver(function (entries) {
    var hits = [];
    for (var a = 0; a < entries.length; a++) {
      // Enough of it is showing: 15% of the item, or a quarter of the screen
      // for an item too tall to ever be 15% visible. No negative margin, which
      // could leave a short item at the very foot of a page never qualifying.
      var en = entries[a];
      if (en.isIntersecting && (en.intersectionRatio >= 0.15 || en.intersectionRect.height >= vh * 0.25)) hits.push(en.target);
    }
    hits.sort(function (x, y) {
      return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    for (var b = 0; b < hits.length; b++) {
      var el = hits[b];
      io.unobserve(el);
      var delay = Math.min(b, maxSteps) * step;
      el.style.setProperty('--b61-reveal-delay', delay + 'ms');
      countIn(el, delay);
      el.addEventListener('animationend', done);
      el.classList.add('b61-in--anim', 'b61-in');
    }
  }, { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5] });

  for (var p = 0; p < pending.length; p++) io.observe(pending[p]);

  // Scrolled straight past a part (a fast flick, an anchor jump, a restored
  // scroll position)? An observer never reports it, because it went from
  // not-visible to not-visible. Show it, so scrolling back up never finds
  // content still waiting to appear.
  var ticking = false;
  function sweep() {
    ticking = false;
    var still = [];
    for (var q = 0; q < pending.length; q++) {
      var el = pending[q];
      if (el.classList.contains('b61-in')) continue;
      if (el.getBoundingClientRect().bottom <= 0) {
        io.unobserve(el);
        el.classList.add('b61-in');
      } else {
        still.push(el);
      }
    }
    pending = still;
    if (!pending.length) window.removeEventListener('scroll', onScroll);
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(sweep); }
  }
  window.addEventListener('scroll', onScroll, { passive: true, signal: ac.signal });

  // Keyboard focus lands on a part that has not arrived yet (a link at the
  // very edge of the screen, under 15% visible): show it now, so focus is
  // never on something invisible (1.44.0).
  doc.addEventListener('focusin', function (e) {
    if (ac.signal.aborted) return;
    var item = e.target && e.target.closest && e.target.closest('[data-b61-reveal-item]');
    if (!item || item.classList.contains('b61-in')) return;
    io.unobserve(item);
    item.classList.add('b61-in');
  });

  return function stop() { ac.abort(); io.disconnect(); };
}
