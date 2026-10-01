/* =============================================================
   ABOUT v2: unravelling (borrowed from Broken Browser v1)
   1. section titles decrypt from glyphs when they scroll into view
   2. now and then one row of the typed lace unravels and re-knits,
      like a pulled thread, using only the lace's own characters
      (symbols where a symbol sits, emoticon characters elsewhere)
   Text stays real in the HTML; reduced motion turns all of it off.
   ============================================================= */

(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var TITLE_GLYPHS = '>/_#%*<[]01';     // the Broken Browser decrypt
  var LACE_GLYPHS = "<3xo:*;).'";       // threads only: shimmer, not error
  var LACE_SYMBOLS = '♡✿❀❁✾✧⋆☆°❦';       // the copy-paste symbols in the lace
  function glyph(set) { return set.charAt(Math.floor(Math.random() * set.length)); }

  // every text node under an element, with its original text and the
  // glyphs it may scramble into (`set` can pick per text node)
  function textNodes(el, set) {
    var out = [];
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walk.nextNode())) {
      out.push({ node: n, text: n.nodeValue, set: typeof set === 'function' ? set(n.nodeValue) : set });
    }
    return out;
  }

  // scramble, then resolve left to right over `ms`
  function unravel(el, ms, set, done) {
    if (el._busy) return;
    el._busy = true;
    var parts = textNodes(el, set);
    var total = 0;
    parts.forEach(function (p) { total += p.text.length; });
    var start = performance.now();

    function frame(now) {
      var t = Math.min(1, (now - start) / ms);
      var keep = Math.floor(t * total);
      var seen = 0;
      parts.forEach(function (p) {
        var s = '';
        for (var i = 0; i < p.text.length; i++) {
          var ch = p.text.charAt(i);
          s += (ch === ' ' || ch === '\n' || seen + i < keep) ? ch : glyph(p.set);
        }
        seen += p.text.length;
        p.node.nodeValue = s;
      });
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        parts.forEach(function (p) { p.node.nodeValue = p.text; });
        el._busy = false;
        if (done) done();
      }
    }
    requestAnimationFrame(frame);
  }

  /* 1. section titles */
  var labels = Array.prototype.slice.call(document.querySelectorAll('.sheet--about .label'));
  var labelIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      labelIO.unobserve(e.target);
      unravel(e.target, 650, TITLE_GLYPHS);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  labels.forEach(function (l) { labelIO.observe(l); });

  /* 2. the lace: one pulled thread at a time, here and there */
  var lace = document.querySelector('.lace-type');
  if (!lace) return;
  var rows = Array.prototype.slice.call(lace.querySelectorAll('.row'));
  if (!rows.length) return;

  var laceIO = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    laceIO.disconnect();
    setTimeout(function pull() {
      if (!document.hidden) {
        var row = rows[Math.floor(Math.random() * rows.length)];
        unravel(row, 1100, function (text) {
          return text.length === 1 ? LACE_SYMBOLS : LACE_GLYPHS; // a symbol sits alone
        });
      }
      setTimeout(pull, 2200 + Math.random() * 2600);
    }, 1200);
  }, { threshold: 0.15 });
  laceIO.observe(lace);
})();
