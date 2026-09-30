/* ==========================================================================
   Ode to Shelly / prototype 3: BROKEN BROWSER
   1. decrypt / scramble   2. endless menu   3. countdown to 2027
   4. 404 toast            5. wordmark fitting   6. terminal inquiry form
   Vanilla JS, no dependencies, works from file://.
   ========================================================================== */

(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GLYPHS = '>/_#%*<[]01';
  const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  const scramble = (text) => text.replace(/\S/g, glyph);

  /* Animate a node's text from glyph noise into the real text, letter by
     letter. Always finishes within `duration` ms. */
  function resolve(target, text, duration, done) {
    if (reduceMotion) {
      target.textContent = text;
      if (done) done();
      return;
    }
    const chars = Array.from(text);
    const n = chars.length;
    const revealAt = chars.map((ch, i) =>
      duration * (0.1 + 0.75 * (n > 1 ? i / (n - 1) : 1)) + Math.random() * duration * 0.15
    );
    const start = performance.now();
    let last = -Infinity;

    const frame = (now) => {
      const t = now - start;
      if (t >= duration) {
        target.textContent = text;
        if (done) done();
        return;
      }
      if (now - last >= 40) {
        last = now;
        let out = '';
        for (let i = 0; i < n; i++) {
          const ch = chars[i];
          out += /\s/.test(ch) || t >= revealAt[i] ? ch : glyph();
        }
        target.textContent = out;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------------
     1. Decrypt: [data-decrypt] starts as glyphs and resolves on view.
     The real text stays in a visually hidden span for screen readers and
     is restored exactly when the animation ends.
     ------------------------------------------------------------------------ */

  function armDecrypt(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    el.dcText = text;
    el.dcHTML = el.innerHTML;

    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;

    const vis = document.createElement('span');
    vis.className = 'dc';
    vis.setAttribute('aria-hidden', 'true');
    vis.textContent = scramble(text);

    el.textContent = '';
    el.append(sr, vis);
    el.dataset.dc = 'armed';
  }

  function runDecrypt(el) {
    if (el.dataset.dc !== 'armed') return;
    el.dataset.dc = 'running';
    const vis = el.querySelector('.dc');
    const duration = Math.min(850, 280 + el.dcText.length * 20);
    resolve(vis, el.dcText, duration, () => {
      el.innerHTML = el.dcHTML;
      el.dataset.dc = 'done';
    });
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = Array.from(document.querySelectorAll('[data-decrypt]'));
    targets.forEach(armDecrypt);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            io.unobserve(entry.target);
            runDecrypt(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }
  root.classList.add('dc-armed');

  /* Noise layer: [data-glitch] fragments re-scramble now and then. */
  if (!reduceMotion) {
    const glitchEls = Array.from(document.querySelectorAll('[data-glitch]'));
    if (glitchEls.length) {
      setInterval(() => {
        if (document.hidden) return;
        const el = glitchEls[Math.floor(Math.random() * glitchEls.length)];
        if (el.dataset.busy) return;
        el.dataset.busy = '1';
        if (!el.dataset.glitchText) el.dataset.glitchText = el.textContent;
        resolve(el, el.dataset.glitchText, 520, () => {
          delete el.dataset.busy;
        });
      }, 2600);
    }
  }

  /* ------------------------------------------------------------------------
     5. Fit the giant wordmarks to the viewport
     Home: as wide as possible, but never taller than ~56% of the first
     screen (so the page stays mostly white). Bridal endmark: full width.
     ------------------------------------------------------------------------ */

  const wordmark = document.querySelector('.wordmark');
  const endmark = document.querySelector('.endmark');

  function fitType(box, inner, availWidth, maxHeight) {
    box.style.fontSize = '100px';
    const r = inner.getBoundingClientRect();
    if (!r.width || !r.height) return;
    let size = (100 * availWidth) / r.width;
    if (maxHeight) size = Math.min(size, (100 * maxHeight) / r.height);
    box.style.fontSize = size.toFixed(1) + 'px';
  }

  function fitAll() {
    const vw = root.clientWidth;
    if (wordmark) {
      const hero = wordmark.closest('.hero');
      const gutter = parseFloat(getComputedStyle(wordmark).left) || 16;
      const ratio = vw <= 800 ? 0.5 : 0.56;
      fitType(wordmark, wordmark.querySelector('a'), vw - gutter * 2, hero.clientHeight * ratio);
    }
    if (endmark) {
      const pad = parseFloat(getComputedStyle(endmark).paddingLeft) || 16;
      fitType(endmark, endmark.firstElementChild, vw - pad * 2);
    }
  }

  let fitFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(fitAll);
  });
  fitAll();

  /* ------------------------------------------------------------------------
     3. Countdown to 1 January 2027, 00:00 Copenhagen (CET = UTC+1)
     ------------------------------------------------------------------------ */

  const TARGET = Date.UTC(2026, 11, 31, 23, 0, 0);
  const countdowns = Array.from(document.querySelectorAll('[data-countdown]'));

  function tick() {
    const ms = TARGET - Date.now();
    let text;
    if (ms <= 0) {
      text = "it's 2027!";
    } else {
      const s = Math.floor(ms / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      text = `2027 in ${d}d ${h}h ${m}m ${sec}s!`;
    }
    countdowns.forEach((el) => {
      if (el.textContent !== text) el.textContent = text;
    });
  }

  function scheduleTick() {
    tick();
    setTimeout(scheduleTick, 1000 - (Date.now() % 1000) + 10);
  }
  if (countdowns.length) scheduleTick();

  /* ------------------------------------------------------------------------
     4. 404 toast for pages that are not in the prototype
     ------------------------------------------------------------------------ */

  const toast = document.querySelector('.toast');
  const announcer = document.getElementById('announcer');
  let toastTimer = 0;

  function showMissing(trigger) {
    const page = trigger.dataset.missing || 'this page';
    const msg = `404_ /${page} has gone missing (not in the prototype)`;

    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = msg;
      }, 60);
    }
    if (toast) {
      toast.classList.add('is-on');
      resolve(toast, msg, 420);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-on'), 3200);
    }
    if (!reduceMotion) {
      trigger.classList.remove('flicker');
      void trigger.offsetWidth; // restart the animation
      trigger.classList.add('flicker');
    }
  }

  let preselect = () => {};

  document.addEventListener('click', (e) => {
    const missing = e.target.closest('[data-missing]');
    if (missing) {
      e.preventDefault();
      showMissing(missing);
      return;
    }
    const pick = e.target.closest('[data-interest]');
    if (pick) preselect(pick.dataset.interest);
  });

  /* ------------------------------------------------------------------------
     2. Endless menu: full-screen white overlay, plain list that repeats
     forever as you scroll. Esc or "close" shuts it, focus returns.
     ------------------------------------------------------------------------ */

  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('menu');
  const header = document.querySelector('.corners');

  if (toggle && overlay && header) {
    const sets = overlay.querySelector('.menu-sets');
    const list = overlay.querySelector('.menu-list');
    const MAX_CLONES = 60;
    let open = false;
    let inerted = [];

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-controls', 'menu');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Menu');

    const makeClone = () => {
      const clone = list.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a').forEach((a) => {
        a.tabIndex = -1;
      });
      return clone;
    };

    const clearClones = () => {
      sets.querySelectorAll('.is-clone').forEach((c) => c.remove());
    };

    /* Append copies near the bottom; drop old copies near the top (and
       shift the scroll position by the same amount) so the DOM stays small. */
    const extend = () => {
      let guard = 0;
      while (
        overlay.scrollHeight - overlay.scrollTop - overlay.clientHeight < overlay.clientHeight * 1.5 &&
        guard < 40
      ) {
        sets.appendChild(makeClone());
        guard++;
      }
      const clones = sets.querySelectorAll('.is-clone');
      if (clones.length > MAX_CLONES) {
        let removed = 0;
        for (let i = 0; i < clones.length - MAX_CLONES; i++) {
          removed += clones[i].offsetHeight;
          clones[i].remove();
        }
        overlay.scrollTop -= removed;
      }
    };

    let ticking = false;
    overlay.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          if (open) extend();
        });
      },
      { passive: true }
    );

    const setInert = (on) => {
      if (on) {
        inerted = Array.from(document.body.children).filter(
          (el) =>
            el !== header &&
            el !== overlay &&
            el !== announcer &&
            el !== toast &&
            el.tagName !== 'SCRIPT'
        );
        inerted.forEach((el) => el.setAttribute('inert', ''));
      } else {
        inerted.forEach((el) => el.removeAttribute('inert'));
        inerted = [];
      }
    };

    const openMenu = () => {
      open = true;
      overlay.classList.add('is-open');
      root.classList.add('menu-open');
      toggle.textContent = 'close';
      toggle.setAttribute('aria-expanded', 'true');
      setInert(true);
      clearClones();
      overlay.scrollTop = 0;
      extend();
      const first = list.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    };

    const closeMenu = (restoreFocus) => {
      if (!open) return;
      open = false;
      overlay.classList.remove('is-open');
      root.classList.remove('menu-open');
      toggle.textContent = 'menu';
      toggle.setAttribute('aria-expanded', 'false');
      setInert(false);
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (open) closeMenu(true);
      else openMenu();
    });

    // it behaves as a button, so Space works too
    toggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle.click();
      }
    });

    // following a real link from the open menu closes it first
    const onNavClick = (e) => {
      if (!open) return;
      const a = e.target.closest('a');
      if (!a || a === toggle || a.hasAttribute('data-missing')) return;
      closeMenu(a.protocol === 'mailto:');
    };
    overlay.addEventListener('click', onNavClick);
    header.addEventListener('click', onNavClick);

    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      if (e.key !== 'Tab') return;
      // keep focus inside: corner links + the first (real) copy of the list
      const items = [
        ...header.querySelectorAll('a[href]'),
        ...list.querySelectorAll('a[href]'),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Terminal inquiry form: custom validation, then confirmation
     ------------------------------------------------------------------------ */

  const form = document.getElementById('inquiry-form');

  if (form) {
    form.noValidate = true; // native validation stays on when JS is off

    const $ = (id) => document.getElementById(id);
    const name = $('f-name');
    const email = $('f-email');
    const date = $('f-date');
    const unset = $('f-date-unset');
    const message = $('f-message');
    const radios = Array.from(form.querySelectorAll('input[name="interest"]'));
    const status = $('form-status');
    const done = $('inquiry-done');

    const fields = {
      name: { els: [name], err: $('err-name') },
      email: { els: [email], err: $('err-email') },
      date: { els: [date], err: $('err-date') },
      interest: { els: radios, err: $('err-interest') },
      message: { els: [message], err: $('err-message') },
    };

    const setError = (key, msg) => {
      const f = fields[key];
      f.err.textContent = msg;
      f.els.forEach((el) => {
        if (msg) el.setAttribute('aria-invalid', 'true');
        else el.removeAttribute('aria-invalid');
      });
    };

    const refreshStatus = () => {
      if (!status.textContent) return;
      const anyLeft = Object.values(fields).some((f) => f.err.textContent);
      if (!anyLeft) status.textContent = '';
    };

    preselect = (value) => {
      if (!form.isConnected) return;
      const radio = radios.find((r) => r.value === value);
      if (radio) {
        radio.checked = true;
        setError('interest', '');
        refreshStatus();
      }
    };

    const syncDate = () => {
      date.disabled = unset.checked;
      date.required = !unset.checked;
      if (unset.checked) setError('date', '');
      refreshStatus();
    };
    unset.addEventListener('change', syncDate);
    syncDate();

    const keyFor = (el) => {
      if (el === name) return 'name';
      if (el === email) return 'email';
      if (el === date) return 'date';
      if (el === message) return 'message';
      if (el.name === 'interest') return 'interest';
      return null;
    };

    const clearOnEdit = (e) => {
      const key = keyFor(e.target);
      if (key && fields[key].err.textContent) {
        setError(key, '');
        refreshStatus();
      }
    };
    form.addEventListener('input', clearOnEdit);
    form.addEventListener('change', clearOnEdit);

    const validate = () => {
      const invalid = [];
      const flag = (key, msg, focusEl) => {
        setError(key, msg);
        invalid.push(focusEl);
      };
      const val = (el) => el.value.trim();

      if (!val(name)) flag('name', 'we need a name to write back to', name);
      else setError('name', '');

      if (!val(email)) flag('email', 'email missing', email);
      else if (email.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val(email)))
        flag('email', "that email doesn't look right (e.g. name@mail.com)", email);
      else setError('email', '');

      if (!unset.checked && date.validity.badInput)
        flag('date', "that date doesn't read right, try again or tick 'not set yet'", date);
      else if (!unset.checked && !date.value)
        flag('date', "add a date, or tick 'not set yet'", date);
      else setError('date', '');

      if (!radios.some((r) => r.checked)) flag('interest', 'pick one option', radios[0]);
      else setError('interest', '');

      if (!val(message)) flag('message', 'tell us a little about your wedding', message);
      else setError('message', '');

      return invalid;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = validate();

      if (invalid.length) {
        const msg =
          invalid.length === 1 ? '1 field needs attention' : `${invalid.length} fields need attention`;
        status.textContent = '';
        setTimeout(() => {
          status.textContent = msg;
        }, 30);
        invalid[0].focus();
        return;
      }

      // no backend: swap the form for the confirmation
      form.remove();
      done.hidden = false;
      done.focus();
    });
  }
})();
