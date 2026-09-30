/* =============================================================
   ODE TO SHELLY / prototype 1 / TORN PAGE
   1. roughen: seeded font and size jumps in [data-rough] text
   2. missing pages: 404 toast for Collection / About / Contact
   3. drift: caption fragments slide a few pixels on scroll
   4. inquiry form: validation and the "received" note
   Works from file:// with no external requests.
   ============================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     1. ROUGHEN
     Deterministic: the seed is a hash of the paragraph's own text,
     so every load gives the same result. Rules borrowed from the
     one-pager: short words jump to Helvetica regular, runs of
     2 to 4 words drop into Times (same size or a size smaller),
     long words go Times italic, digits go Courier, and paragraphs
     often end a size smaller ("of the studies."). Olive only where
     the paragraph asks for it (placeholder copy).
     ----------------------------------------------------------- */

  function hash(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var SHORT = /^(of|is|in|we|an|a|to|for|and|the|that|at|on|or|it|our|your|with|by|from|if|who|but)$/i;

  function bare(word) {
    return word.replace(/[^A-Za-zÀ-ſ0-9]/g, '');
  }

  function roughen(el) {
    if (el.hasAttribute('data-roughened')) return;
    var olive = el.getAttribute('data-rough') === 'olive';
    var seedSrc = el.getAttribute('data-rough-seed') || el.textContent;
    var rand = mulberry32(hash(seedSrc));

    // collect text nodes that are not already styled or interactive
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) {
      var n = walker.currentNode;
      if (!n.parentElement.closest('.r, a, button, [data-plain], .noise')) nodes.push(n);
    }

    // flat word list across nodes: { node, part }
    var words = [];
    var parts = nodes.map(function (node, ni) {
      var p = node.nodeValue.split(/(\s+)/);
      p.forEach(function (s, pi) {
        if (s && !/^\s+$/.test(s)) words.push({ ni: ni, pi: pi, text: s });
      });
      return p;
    });

    var W = words.length;
    if (!W) return;
    var plan = new Array(W);

    function mark(start, len, cls) {
      for (var k = 0; k < len && start + k < W; k++) {
        if (words[start + k].ni !== words[start].ni) break;
        plan[start + k] = { cls: cls, run: start };
      }
    }

    // walk the words: a jump, then a gap of plain words, then another jump
    var i = 1 + Math.floor(rand() * 2);
    while (i < W) {
      var w = bare(words[i].text);
      var len = 1;
      var cls;
      var x = rand();

      if (/\d/.test(w)) {
        cls = 'r-c';
      } else if (SHORT.test(w) && x < 0.55) {
        cls = 'r-a';
      } else if (olive && x < 0.34) {
        cls = 'r-t r-o';
        len = 1 + Math.floor(rand() * 3);
      } else if (x < 0.56) {
        cls = 'r-t';
        len = 2 + Math.floor(rand() * 3);
      } else if (x < 0.76) {
        cls = 'r-ts';
        len = 2 + Math.floor(rand() * 3);
      } else if (w.length > 5) {
        cls = 'r-ti';
      } else {
        cls = 'r-tl';
      }

      mark(i, len, cls);
      i += len + 2 + Math.floor(rand() * 4);
    }

    // short paragraphs: guarantee at least one jump
    if (!plan.some(Boolean)) {
      var longest = 1 % W;
      for (var j = 1; j < W; j++) {
        if (bare(words[j].text).length > bare(words[longest].text).length) longest = j;
      }
      mark(longest, 1, 'r-ti');
    }

    // longer paragraphs often end a size smaller
    if (W >= 9 && rand() < 0.6) {
      var tail = 2 + Math.floor(rand() * 2);
      for (var t = W - tail; t < W; t++) plan[t] = null;
      mark(W - tail, tail, 'r-ts');
    }

    // rebuild each text node
    var wi = 0;
    nodes.forEach(function (node, ni) {
      var p = parts[ni];
      var frag = document.createDocumentFragment();
      var span = null;
      var runId = null;

      p.forEach(function (s) {
        if (!s) return;
        var isWord = !/^\s+$/.test(s);
        var info = null;
        if (isWord) {
          info = plan[wi];
          wi++;
        }

        if (isWord && info) {
          if (!span || runId !== info.run) {
            span = document.createElement('span');
            span.className = 'r ' + info.cls;
            runId = info.run;
            frag.appendChild(span);
          }
          span.appendChild(document.createTextNode(s));
        } else if (isWord) {
          span = null;
          runId = null;
          frag.appendChild(document.createTextNode(s));
        } else {
          // whitespace: keep inside the run only if the run continues
          var next = plan[wi];
          if (span && next && next.run === runId && words[wi] && words[wi].ni === ni) {
            span.appendChild(document.createTextNode(s));
          } else {
            span = null;
            runId = null;
            frag.appendChild(document.createTextNode(s));
          }
        }
      });

      node.parentNode.replaceChild(frag, node);
    });

    el.setAttribute('data-roughened', '');
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-rough]'), roughen);

  /* -----------------------------------------------------------
     2. MISSING PAGES
     ----------------------------------------------------------- */

  var MISSING = '404_ this page has gone missing (not in the prototype)';
  var toast = document.createElement('p');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  var toastTimer = null;
  var clearTimer = null;

  function showMissing(link) {
    clearTimeout(toastTimer);
    clearTimeout(clearTimer);
    toast.classList.remove('is-on');
    toast.textContent = '';
    // reflow so the flicker can replay, then write the message
    void toast.offsetWidth;
    toast.classList.add('is-on');
    window.setTimeout(function () { toast.textContent = MISSING; }, 40);

    if (link) {
      link.classList.remove('is-missing');
      void link.offsetWidth;
      link.classList.add('is-missing');
      window.setTimeout(function () { link.classList.remove('is-missing'); }, 1400);
    }

    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-on');
      clearTimer = window.setTimeout(function () { toast.textContent = ''; }, 800);
    }, 3000);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-missing]');
    if (!link) return;
    e.preventDefault();
    showMissing(link);
  });

  /* -----------------------------------------------------------
     3. DRIFT
     Caption fragments move a few pixels sideways as they pass
     through the viewport. Off when reduced motion is requested.
     ----------------------------------------------------------- */

  var drifters = Array.prototype.slice.call(document.querySelectorAll('[data-drift]'));

  if (!reduceMotion && drifters.length) {
    var ticking = false;

    var update = function () {
      var vh = window.innerHeight || 1;
      drifters.forEach(function (el) {
        var amp = parseFloat(el.getAttribute('data-drift')) || 0;
        var r = el.getBoundingClientRect();
        var progress = ((r.top + r.height / 2) - vh / 2) / vh; // about -1 to 1
        progress = Math.max(-1, Math.min(1, progress));
        el.style.transform = 'translate3d(' + (progress * amp).toFixed(1) + 'px, 0, 0)';
      });
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* -----------------------------------------------------------
     4. INQUIRY FORM
     ----------------------------------------------------------- */

  var form = document.getElementById('inquiry-form');
  if (!form) return;

  form.noValidate = true;

  var status = document.getElementById('inquiry-status');
  var nameEl = form.elements.name;
  var emailEl = form.elements.email;
  var dateEl = form.elements.wedding_date;
  var unsetEl = form.elements.date_not_set;
  var msgEl = form.elements.message;
  var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="interest"]'));
  var attempted = false;

  var targets = {
    name: [nameEl],
    email: [emailEl],
    date: [dateEl],
    interest: radios,
    message: [msgEl]
  };

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var rules = {
    name: function () {
      return nameEl.value.trim() ? '' : 'missing_ please write your name';
    },
    email: function () {
      var v = emailEl.value.trim();
      if (!v) return 'missing_ please write your email';
      if (emailEl.validity.typeMismatch || !EMAIL.test(v)) {
        return 'misprint_ that email looks incomplete (like name@example.com)';
      }
      return '';
    },
    date: function () {
      if (unsetEl.checked) return '';
      return dateEl.value ? '' : 'missing_ pick a date, or tick "not set yet"';
    },
    interest: function () {
      return radios.some(function (r) { return r.checked; }) ? '' : 'missing_ choose one (not sure yet is fine)';
    },
    message: function () {
      return msgEl.value.trim() ? '' : 'missing_ tell us a little about your wedding';
    }
  };

  function setError(key, msg) {
    var err = document.getElementById('e-' + key);
    var field = err.closest('.field');
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
      field.classList.add('is-invalid');
      targets[key].forEach(function (el) { el.setAttribute('aria-invalid', 'true'); });
    } else {
      err.textContent = '';
      err.hidden = true;
      field.classList.remove('is-invalid');
      targets[key].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    }
  }

  function syncDate() {
    dateEl.disabled = unsetEl.checked;
    dateEl.required = !unsetEl.checked;
    if (attempted) setError('date', rules.date());
  }
  unsetEl.addEventListener('change', syncDate);
  syncDate();

  var keyFor = {
    name: 'name',
    email: 'email',
    wedding_date: 'date',
    date_not_set: 'date',
    interest: 'interest',
    message: 'message'
  };

  function recheck(e) {
    if (!attempted) return;
    var key = keyFor[e.target.name];
    if (key) setError(key, rules[key]());
  }
  form.addEventListener('input', recheck);
  form.addEventListener('change', recheck);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    attempted = true;

    var first = null;
    Object.keys(rules).forEach(function (key) {
      var msg = rules[key]();
      setError(key, msg);
      if (msg && !first) first = targets[key][0];
    });

    if (first) {
      first.focus();
      return;
    }

    // no backend: replace the form with the note
    form.hidden = true;
    var formNote = document.querySelector('.form-note');
    if (formNote) formNote.hidden = true;
    var note = document.createElement('p');
    note.className = 'received';
    note.tabIndex = -1;
    note.innerHTML = 'received. we\'ll write back<span class="blink" aria-hidden="true">_</span>';
    status.appendChild(note);
    note.focus();
  });
})();
