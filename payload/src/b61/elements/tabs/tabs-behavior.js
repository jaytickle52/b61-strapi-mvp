// @ts-nocheck
/* The plugin's Tabs engine (Tabs/behavior.js, 1.77.1), unchanged except that
 * TabsInit calls window.B61Tabs.init(root) instead of a %%SELECTOR%% line. */
/*
 * B61 Tabs behaviour (1.43.0). One file, read by BOTH dependencies() (front
 * end) and actions() (builder), so the two cannot drift.
 *
 * WHY A SHARED MANAGER. Up to 1.42 this was a one-shot script that ran when
 * the Tabs element mounted or one of ITS properties changed. In the builder,
 * adding content inside a B61 Tab re-renders the tree without firing either,
 * the classes the script had put on the DOM were wiped, and the element fell
 * back to its no-JS state: bar hidden, every panel showing. Editing a tab
 * label brought it back because that was a Tabs property change.
 *
 * So the logic lives once on window.B61Tabs and every entry point calls it:
 *   - Tabs:  onMountedElement / onPropertyChange  -> init(selector)
 *   - Tab:   created / moved / deleted / mounted / property change -> refresh
 *   - Tab:   onActivatedElement, runForAllChildren -> activateFrom(selector),
 *            so selecting anything inside tab 3 shows tab 3 (Breakdance's own
 *            Advanced Tabs does the same)
 *   - builder only: a MutationObserver re-syncs whenever the DOM stops
 *     matching what the last sync produced.
 * The selected tab is remembered per instance, so a re-sync keeps showing the
 * tab being edited instead of jumping back to the first.
 *
 * NOTHING here may contain twig delimiters: Breakdance runs this file through
 * twig (PHP on the front end, twig.js in the builder).
 */
(function(){
  if (!window.B61Tabs || window.B61Tabs.v < 3) {
    window.B61Tabs = (function(){
      var chosen = {};
      var inBuilder = false;
      try { inBuilder = window.parent !== window && !!window.parent.Breakdance; } catch (e) {}

      /* Scope every lookup to THIS instance. A B61 Tabs nested inside a B61
         Tab is legal; without this the outer set adopts the inner one's bar
         and panes. */
      function mine(root, sel){
        return Array.prototype.filter.call(root.querySelectorAll(sel), function(n){ return n.closest('.b61-tabs') === root; });
      }

      function parts(root){
        var list = mine(root, '.js-b61-tabs-list')[0] || null;
        var panels = mine(root, '.js-b61-tabs-panels')[0] || null;
        return {
          list: list,
          id: panels ? (panels.getAttribute('data-b61-tabs-id') || '') : '',
          tabs: list ? mine(root, '.js-b61-tabs-tab') : [],
          panes: panels ? mine(root, '.b61-pane') : []
        };
      }

      function label(p){
        var lab = p.querySelector('.js-b61-pane-label');
        return lab && lab.closest('.b61-pane') === p ? lab : null;
      }

      /* Put a pane back to the state the server shipped it in. */
      function plain(p){
        p.classList.remove('is-open');
        ['role', 'aria-labelledby', 'aria-hidden', 'inert', 'tabindex'].forEach(function(a){ p.removeAttribute(a); });
        var lab = label(p);
        if (lab) lab.hidden = false;
      }

      /* A cheap fingerprint of everything the sync is responsible for. The
         builder observer compares it with the one the last sync left behind;
         hover classes and the like never change it, so there is no loop. */
      function sig(root){
        var p = parts(root), open = -1, roles = 0, labs = 0;
        p.panes.forEach(function(x, i){
          if (x.classList.contains('is-open')) open = i;
          if (x.getAttribute('role') === 'tabpanel') roles++;
          var l = label(x);
          if (l && !l.hidden) labs++;
        });
        p.tabs.forEach(function(t){ if (t.getAttribute('role') === 'tab') roles++; });
        return [p.tabs.length, p.panes.length, root.classList.contains('is-ready'), open, roles, labs].join(':');
      }

      function activate(root, p, i, focus){
        p.tabs.forEach(function(t, j){
          var on = j === i;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
          t.classList.toggle('is-active', on);
          var pane = p.panes[j];
          pane.classList.toggle('is-open', on);
          if (on) { pane.removeAttribute('inert'); pane.setAttribute('aria-hidden', 'false'); }
          else { pane.setAttribute('inert', ''); pane.setAttribute('aria-hidden', 'true'); }
        });
        chosen[p.id] = i;
        if (focus) p.tabs[i].focus();
      }

      /* Pair labels with panes BY ORDER and install the widget. Labels come
         from a repeater on the parent and panes are child nodes, so the counts
         can drift while someone is building. The remainder is made harmless in
         the direction that keeps content readable: a label with no pane leaves
         the bar, a pane with no label stays open. Returns the paired sets. */
      function pair(root){
        var p = parts(root);
        var n = Math.min(p.tabs.length, p.panes.length);
        p.tabs.forEach(function(t, i){ t.hidden = i >= n; });
        p.panes.forEach(function(x, i){
          x.classList.toggle('b61-pane--unpaired', i >= n);
          if (i >= n) plain(x);
        });
        p.tabs = p.tabs.slice(0, n);
        p.panes = p.panes.slice(0, n);
        return p;
      }

      function sync(root){
        var p = pair(root);

        /* NOTHING TO PAIR. Leave every pane as the server sent it. Labels but
           no panels is the half-built builder state: show the bar anyway, or
           the editor is typing into something invisible. */
        if (!p.tabs.length) {
          root.classList.toggle('is-ready', !!(p.list && mine(root, '.js-b61-tabs-tab').length));
          root.__b61sig = sig(root);
          return;
        }

        /* INSTALL THE WIDGET. The server ships buttons and titled blocks;
           everything that says "this is a tab set" is added here, so the
           markup never claims a behaviour that is not present. */
        p.list.setAttribute('role', 'tablist');
        p.list.setAttribute('aria-orientation', p.list.getAttribute('data-b61-orientation') || 'horizontal');
        if (p.list.getAttribute('data-b61-label')) p.list.setAttribute('aria-label', p.list.getAttribute('data-b61-label'));
        p.tabs.forEach(function(t, i){
          t.setAttribute('role', 'tab');
          t.setAttribute('aria-controls', 'b61-tabs-' + p.id + '-panel-' + (i + 1));
        });
        p.panes.forEach(function(x, i){
          x.id = 'b61-tabs-' + p.id + '-panel-' + (i + 1);
          x.setAttribute('role', 'tabpanel');
          x.setAttribute('aria-labelledby', p.tabs[i].id);
          /* WAI's tabs pattern: the panel takes the tab sequence itself, in
             case nothing inside it is focusable. */
          x.setAttribute('tabindex', '0');
          /* The button now carries this text; leaving the heading would
             announce every title twice. */
          var lab = label(x);
          if (lab) lab.hidden = true;
        });

        /* Keep the tab that was showing (a re-sync mid-edit must not jump back
           to the first); otherwise whichever tab the server shipped selected;
           otherwise the first. */
        var sel = chosen[p.id];
        if (!(sel >= 0 && sel < p.tabs.length)) {
          sel = 0;
          p.tabs.forEach(function(t, i){ if (t.getAttribute('data-b61-selected') === 'true') sel = i; });
        }
        activate(root, p, sel, false);

        /* is-ready reveals the bar (display:none until the panes are really
           under its control). rAF first, timeout behind it: rAF never fires in
           a throttled tab. */
        /* In the builder the root's class list belongs to Breakdance, which
           rewrites it when anything in the set is selected and strips
           is-ready - so any sync after the first restores it at once. The
           fingerprint is recorded ONLY here, after the state is whole: 1.43.0
           recorded it inside activate(), and a selection that landed mid-wipe
           blessed the broken state, so the observer never repaired it. */
        var done = false;
        function ready(){ if (done) return; done = true; root.classList.add('is-ready'); root.__b61synced = true; root.__b61sig = sig(root); }
        if (root.__b61synced || root.classList.contains('is-ready')) ready();
        else { root.__b61sig = sig(root); if (window.requestAnimationFrame) window.requestAnimationFrame(ready); setTimeout(ready, 100); }
      }

      function onKey(root, e){
        var t = e.target.closest && e.target.closest('.js-b61-tabs-tab');
        if (!t || t.closest('.b61-tabs') !== root) return;
        var p = pair(root), i = p.tabs.indexOf(t), n = p.tabs.length, k = e.key, to = null;
        if (i < 0) return;
        if (e.type === 'click') to = i;
        /* Both arrow pairs whatever the orientation: refusing one helps nobody. */
        else if (k === 'ArrowDown' || k === 'Down' || k === 'ArrowRight' || k === 'Right') to = (i + 1) % n;
        else if (k === 'ArrowUp' || k === 'Up' || k === 'ArrowLeft' || k === 'Left') to = (i - 1 + n) % n;
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = n - 1;
        else if (k === 'Enter' || k === ' ' || k === 'Spacebar') to = i;
        if (to === null) return;
        if (e.type !== 'click') e.preventDefault();
        root.classList.add('is-switched');
        activate(root, p, to, e.type !== 'click');
        sync(root);
      }

      function init(sel){
        var root = typeof sel === 'string' ? document.querySelector(sel) : sel;
        if (!root) return;
        /* One delegated listener per root: buttons are re-rendered whenever a
           label changes, and a handler bound to the old buttons would drive a
           stale set of panes. */
        if (!root.__b61bound) {
          root.__b61bound = true;
          root.addEventListener('click', function(e){ onKey(root, e); });
          root.addEventListener('keydown', function(e){ onKey(root, e); });
        }
        sync(root);
        if (inBuilder && !root.__b61obs && window.MutationObserver) {
          var timer = 0;
          root.__b61obs = new MutationObserver(function(){
            if (timer) return;
            timer = setTimeout(function(){
              timer = 0;
              if (root.isConnected && sig(root) !== root.__b61sig) sync(root);
            }, 60);
          });
          root.__b61obs.observe(root, { attributes: true, attributeFilter: ['class', 'hidden', 'role'], childList: true, subtree: true });
        }
      }

      function rootOf(sel){
        var el = document.querySelector(sel);
        return el ? el.closest('.b61-tabs') : null;
      }

      return {
        v: 3,
        init: init,
        /* From a B61 Tab hook. Deferred so a pane being deleted has gone. */
        refresh: function(sel){
          var root = rootOf(sel);
          if (root) setTimeout(function(){ if (root.isConnected) init(root); }, 30);
        },
        /* Show the pane holding whatever was just selected in the builder, and
           every pane around it when tab sets are nested. */
        activateFrom: function(sel){
          var el = document.querySelector(sel);
          var pane = el ? el.closest('.b61-pane') : null;
          while (pane) {
            var root = pane.closest('.b61-tabs');
            if (!root) break;
            var p = pair(root), i = p.panes.indexOf(pane);
            if (i >= 0) { chosen[p.id] = i; sync(root); }
            pane = root.parentElement ? root.parentElement.closest('.b61-pane') : null;
          }
        }
      };
    })();
  }
})();

export {}
