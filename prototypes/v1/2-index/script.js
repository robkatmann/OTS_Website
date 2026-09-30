/* Ode to Shelly / Prototype 2: INDEX
   Vanilla JS, no dependencies, works from file://.
   1. "Gone missing" message for pages not in the prototype
   2. Bridal index: active section, running head, mini page preview
   3. Inquiry form: validation and confirmation */

(function () {
  'use strict';

  var MISSING_MSG = '404_ this page has gone missing (not in the prototype)';

  /* ---------------------------------------------------------
     1. Pages that are not in the prototype
     --------------------------------------------------------- */
  var toast = document.querySelector('[data-toast]');
  var showTimer = null;
  var hideTimer = null;
  var clearTimer = null;

  function showMissing(trigger) {
    if (toast) {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
      toast.textContent = '';
      // set the text a moment later so screen readers announce repeats too
      showTimer = setTimeout(function () {
        toast.textContent = MISSING_MSG;
        toast.classList.add('is-visible');
      }, 60);
      hideTimer = setTimeout(function () {
        toast.classList.remove('is-visible');
        clearTimer = setTimeout(function () { toast.textContent = ''; }, 500);
      }, 2900);
    }

    if (trigger) {
      trigger.classList.remove('is-flicker');
      void trigger.offsetWidth; // restart the flicker
      trigger.classList.add('is-flicker');
    }
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-missing]');
    if (!trigger) return;
    event.preventDefault();
    showMissing(trigger);
  });

  document.addEventListener('animationend', function (event) {
    if (event.target.classList && event.target.classList.contains('is-flicker')) {
      event.target.classList.remove('is-flicker');
    }
  });

  /* ---------------------------------------------------------
     2. Bridal: editors' letter index
     --------------------------------------------------------- */
  var letterItems = Array.prototype.slice.call(document.querySelectorAll('.letter__item'));
  var runner = document.querySelector('[data-runner]');
  var runnerLinks = runner ? Array.prototype.slice.call(runner.querySelectorAll('[data-target]')) : [];
  var runnerFolio = document.querySelector('[data-runner-folio]');

  function setActive(id) {
    letterItems.forEach(function (item) {
      var on = item.getAttribute('data-target') === id;
      item.classList.toggle('is-active', on);
      if (on) {
        item.setAttribute('aria-current', 'location');
        if (runnerFolio) runnerFolio.textContent = item.getAttribute('data-folio');
      } else {
        item.removeAttribute('aria-current');
      }
    });
    runnerLinks.forEach(function (link) {
      var on = link.getAttribute('data-target') === id;
      link.parentNode.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if (letterItems.length) {
    setActive(letterItems[0].getAttribute('data-target'));
  }

  if (letterItems.length && 'IntersectionObserver' in window) {
    // the section crossing the middle band of the viewport is "in view"
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    letterItems.forEach(function (item) {
      var section = document.getElementById(item.getAttribute('data-target'));
      if (section) sectionObserver.observe(section);
    });

    // running head appears once the big index has scrolled out of view
    var letter = document.querySelector('.letter');
    if (runner && letter) {
      var runnerObserver = new IntersectionObserver(function (entries) {
        var entry = entries[entries.length - 1];
        var past = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        runner.classList.toggle('is-shown', past);
      }, { threshold: 0 });
      runnerObserver.observe(letter);
    }
  }

  /* Mini page preview near the cursor (decorative, pointer devices only) */
  var preview = document.querySelector('[data-minipage]');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (preview && letterItems.length) {
    var mpTitle = preview.querySelector('[data-mp-title]');
    var mpText = preview.querySelector('[data-mp-text]');
    var mpFolio = preview.querySelector('[data-mp-folio]');
    var mpNum = preview.querySelector('[data-mp-num]');
    var forecastEl = document.querySelector('.forecast');
    var filler = forecastEl ? forecastEl.textContent.replace(/\s+/g, ' ').trim() : '';
    var textCache = {};
    var pointer = { x: 0, y: 0 };
    var frame = null;
    var current = null;

    var sectionText = function (id) {
      if (textCache[id]) return textCache[id];
      var section = document.getElementById(id);
      var body = section ? section.querySelector('.folio__body') : null;
      var text = '';
      if (body) {
        var clone = body.cloneNode(true);
        Array.prototype.forEach.call(clone.querySelectorAll('[hidden], .sr-only, .optional'), function (el) {
          el.parentNode.removeChild(el);
        });
        // redactions stay redacted, even in miniature
        Array.prototype.forEach.call(clone.querySelectorAll('.redact'), function (el) {
          el.textContent = new Array(Math.max(3, el.textContent.length) + 1).join('█');
        });
        text = clone.textContent.replace(/\s+/g, ' ').trim();
      }
      var out = text;
      var pad = filler || text;
      while (pad && out.length < 900) out += ' ' + pad;
      textCache[id] = out.slice(0, 900);
      return textCache[id];
    };

    var place = function () {
      frame = null;
      var w = preview.offsetWidth;
      var h = preview.offsetHeight;
      var x = pointer.x + 22;
      var y = pointer.y - h * 0.55;
      if (x + w > window.innerWidth - 8) x = pointer.x - w - 22;
      y = Math.max(8, Math.min(y, window.innerHeight - h - 8));
      preview.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)';
    };

    var track = function (event) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(place);
    };

    var show = function (item, event) {
      if (!canHover.matches) return;
      var id = item.getAttribute('data-target');
      if (current !== id) {
        var folio = item.getAttribute('data-folio') || '';
        mpTitle.textContent = item.querySelector('.letter__name').textContent;
        mpFolio.textContent = folio;
        mpNum.textContent = String(parseInt(folio.replace(/\D/g, ''), 10) || '');
        mpText.textContent = sectionText(id);
        current = id;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      place();
      preview.classList.add('is-visible');
    };

    var hide = function () {
      preview.classList.remove('is-visible');
      current = null;
    };

    letterItems.forEach(function (item) {
      item.addEventListener('mouseenter', function (event) { show(item, event); });
      item.addEventListener('mousemove', function (event) {
        if (preview.classList.contains('is-visible')) track(event);
        else show(item, event);
      });
      item.addEventListener('mouseleave', hide);
      item.addEventListener('click', hide);
    });
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* ---------------------------------------------------------
     3. Inquiry form
     --------------------------------------------------------- */
  var form = document.querySelector('[data-inquiry]');

  if (form) {
    var el = {
      name: form.querySelector('#f-name'),
      email: form.querySelector('#f-email'),
      date: form.querySelector('#f-date'),
      unset: form.querySelector('#f-date-unset'),
      message: form.querySelector('#f-message')
    };
    var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="interest"]'));
    var summary = form.querySelector('#form-summary');
    var confirmation = document.getElementById('confirm');
    var attempted = false;

    // "not set yet" disables the date and lifts its requirement
    var syncDate = function () {
      el.date.disabled = el.unset.checked;
      el.date.required = !el.unset.checked;
    };
    syncDate();

    var rules = {
      name: function () {
        return el.name.value.trim() ? '' : 'Missing: your name, so we know who to write back to.';
      },
      email: function () {
        if (!el.email.value.trim()) return 'Missing: an email address to write back to.';
        if (el.email.validity.typeMismatch) return 'This email looks incomplete. Check the @ and the ending.';
        return '';
      },
      date: function () {
        if (el.unset.checked) return '';
        if (el.date.validity.badInput) return 'This date looks incomplete. Add day, month and year, or tick “not set yet”.';
        return el.date.value ? '' : 'Missing: a date, or tick “not set yet”.';
      },
      interest: function () {
        return radios.some(function (r) { return r.checked; }) ? '' : 'Missing: pick one. “Not sure yet” is a perfectly good answer.';
      },
      message: function () {
        return el.message.value.trim() ? '' : 'Missing: a few words about your wedding. A sentence is enough.';
      }
    };

    var controls = {
      name: [el.name],
      email: [el.email],
      date: [el.date],
      interest: radios,
      message: [el.message]
    };

    var check = function (key) {
      var message = rules[key]();
      var field = form.querySelector('[data-field="' + key + '"]');
      var error = field.querySelector('.field__error');
      error.textContent = message;
      field.classList.toggle('is-invalid', !!message);
      controls[key].forEach(function (control) {
        if (message) control.setAttribute('aria-invalid', 'true');
        else control.removeAttribute('aria-invalid');
      });
      return !message;
    };

    var updateSummary = function (count) {
      if (!count) {
        summary.hidden = true;
        summary.textContent = '';
        return;
      }
      summary.textContent = count === 1
        ? 'One field has gone missing. It is marked above.'
        : count + ' fields have gone missing. They are marked above.';
      summary.hidden = false;
    };

    var checkAll = function () {
      return Object.keys(rules).filter(function (key) { return !check(key); });
    };

    el.unset.addEventListener('change', function () {
      syncDate();
      if (attempted) updateSummary(checkAll().length);
    });

    var recheck = function (event) {
      if (!attempted) return;
      var field = event.target.closest('[data-field]');
      if (field && rules[field.getAttribute('data-field')]) {
        check(field.getAttribute('data-field'));
        updateSummary(form.querySelectorAll('.field.is-invalid').length);
      }
    };
    form.addEventListener('input', recheck);
    form.addEventListener('change', recheck);

    form.addEventListener('submit', function (event) {
      event.preventDefault(); // no backend in the prototype
      attempted = true;
      var invalid = checkAll();
      updateSummary(invalid.length);

      if (invalid.length) {
        var first = controls[invalid[0]][0];
        if (first) first.focus();
        return;
      }

      form.replaceWith(confirmation);
      confirmation.hidden = false;
      confirmation.focus();
    });
  }
})();
