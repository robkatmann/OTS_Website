/* ==========================================================================
   Ode to Shelly / prototype 3: BROKEN BROWSER, round 2
   1. decrypt / scramble   2. care label menu    3. countdown to 2027
   4. 404 toast            5. wordmark fitting   6. inquiry form
   7. found images resolve from blocks to sharp
   Vanilla JS, no dependencies, works from file://.
   ========================================================================== */

(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mostly hard glyphs, with a few softer ones sewn in
  const GLYPHS = '>/_#%*<[]01>/_#%°·~✧';
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
      // the thin Y overhangs its box a little, so leave it some air on phones
      const avail = (vw - gutter * 2) * (vw <= 800 ? 0.96 : 1);
      fitType(wordmark, wordmark.querySelector('a'), avail, hero.clientHeight * ratio);
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
     2. Menu: a woven care label that slides down from under the top edge.
     Not modal: it closes on "close", Escape, a click outside, or when
     keyboard focus leaves it. Focus goes to the first link on open and
     back to the toggle on Escape.
     ------------------------------------------------------------------------ */

  const toggle = document.getElementById('menu-toggle');
  const label = document.getElementById('menu');

  if (toggle && label) {
    let open = false;

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-controls', 'menu');
    toggle.setAttribute('aria-expanded', 'false');

    const openMenu = () => {
      open = true;
      label.classList.add('is-open');
      toggle.textContent = 'close';
      toggle.setAttribute('aria-expanded', 'true');
      const first = label.querySelector('.care-list a');
      if (first) first.focus({ preventScroll: true });
    };

    const closeMenu = (restoreFocus) => {
      if (!open) return;
      open = false;
      label.classList.remove('is-open');
      toggle.textContent = 'menu';
      toggle.setAttribute('aria-expanded', 'false');
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

    // click outside the label closes it
    document.addEventListener('click', (e) => {
      if (!open) return;
      if (label.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu(false);
    });

    // tabbing out of the label closes it
    document.addEventListener('focusin', (e) => {
      if (!open) return;
      if (label.contains(e.target) || e.target === toggle) return;
      closeMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (open && (e.key === 'Escape' || e.key === 'Esc')) {
        e.preventDefault();
        closeMenu(true);
      }
    });

    // following a real link from the label closes it first
    label.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || a.hasAttribute('data-missing')) return;
      closeMenu(a.protocol === 'mailto:');
    });
  }

  /* ------------------------------------------------------------------------
     7. Found images decrypt too: they resolve from a few coarse blocks to
     sharp as they come into view. Drawn on a canvas laid over the real
     <img> (which keeps the alt text); the canvas is removed at the end.
     Reduced motion, or anything failing, simply shows the image.
     ------------------------------------------------------------------------ */

  const founds = Array.from(document.querySelectorAll('.found'));

  if (founds.length && !reduceMotion && 'IntersectionObserver' in window) {
    const BLOCKS = [4, 7, 12, 20, 34, 60]; // blocks across, coarse to fine

    const arm = (fig) => {
      const frame = fig.querySelector('.found-frame');
      const img = frame && frame.querySelector('img');
      if (!img) return null;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext && canvas.getContext('2d');
      if (!ctx) return null;

      const cs = getComputedStyle(fig);
      const num = (prop, fallback) => parseFloat(cs.getPropertyValue(prop)) || fallback;
      const crop = { x: num('--cx', 0), y: num('--cy', 0), w: num('--cw', 1412), h: num('--ch', 2000) };
      const small = document.createElement('canvas');
      const sctx = small.getContext('2d');

      canvas.setAttribute('aria-hidden', 'true');
      frame.appendChild(canvas);
      fig.classList.add('px-armed');

      const state = { loaded: false, seen: false, started: false };

      const finish = () => {
        fig.classList.remove('px-armed');
        canvas.remove();
      };

      const draw = (cols) => {
        const w = frame.offsetWidth;
        const h = frame.offsetHeight;
        if (!w || !h) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const rows = Math.max(1, Math.round((cols * h) / w));
        small.width = cols;
        small.height = rows;
        const k = img.naturalWidth / 1412;
        sctx.imageSmoothingEnabled = true;
        sctx.imageSmoothingQuality = 'high';
        sctx.drawImage(img, crop.x * k, crop.y * k, crop.w * k, crop.h * k, 0, 0, cols, rows);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, 0, 0, cols, rows, 0, 0, canvas.width, canvas.height);
      };

      const start = () => {
        if (state.started || !state.loaded || !state.seen) return;
        state.started = true;
        let i = 1;
        const next = () => {
          if (i >= BLOCKS.length) {
            finish();
            return;
          }
          try {
            draw(BLOCKS[i++]);
          } catch (err) {
            finish();
            return;
          }
          setTimeout(next, 85);
        };
        setTimeout(next, 220); // hold the coarsest state a beat
      };

      const onLoad = () => {
        state.loaded = true;
        try {
          draw(BLOCKS[0]);
        } catch (err) {
          finish();
          return;
        }
        start();
      };

      if (img.complete && img.naturalWidth) onLoad();
      else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', finish, { once: true });
      }

      return {
        see() {
          state.seen = true;
          start();
        },
      };
    };

    const pxio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          pxio.unobserve(entry.target);
          if (entry.target.pxCtl) entry.target.pxCtl.see();
        });
      },
      { threshold: 0.35 }
    );

    founds.forEach((fig) => {
      const ctl = arm(fig);
      if (!ctl) return;
      fig.pxCtl = ctl;
      pxio.observe(fig);
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
