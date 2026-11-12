/* GANA brand guidelines viewer: turns the guidebook pages into an interactive flip-through. */
(function () {
  'use strict';

  var data = window.GANA_GUIDELINES;
  if (!data) return;

  var pages = data.pages;
  var total = pages.length;
  var spreadAspect = pages[1].w / pages[1].h;
  var halfQuery = window.matchMedia('(max-width: 700px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) { return document.getElementById(id); }
  var img = $('gl-img'), pageBox = $('gl-page'), prevBtn = $('gl-prev'), nextBtn = $('gl-next');
  var countEl = $('gl-count'), titleEl = $('gl-title'), range = $('gl-range');
  var chipsEl = $('gl-chips'), thumbsEl = $('gl-thumbs'), textEl = $('gl-text');
  var textBtn = $('gl-textbtn'), zoomBtn = $('gl-zoom'), shareBtn = $('gl-share'), stage = $('gl-stage');
  var lb = $('gl-lb'), lbImg = $('gl-lb-img'), lbScroll = $('gl-lb-scroll'), lbTitle = $('gl-lb-title');
  var lbPrev = $('gl-lb-prev'), lbNext = $('gl-lb-next'), lbZoom = $('gl-lb-zoom'), lbClose = $('gl-lb-close');

  var i = 0;      // current spread (0-based)
  var side = 0;   // 0 = left page, 1 = right page (phone view shows one page at a time)
  var lastFocus = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function src(n) { return 'Images/guidelines/spread-' + pad(n + 1) + '.webp'; }
  function thumb(n) { return 'Images/guidelines/thumb-' + pad(n + 1) + '.webp'; }
  function pp(p) { return p.pp.length === 2 ? 'Pages ' + p.pp[0] + '–' + p.pp[1] : (p.pp[0] === 1 ? 'Cover' : 'Page ' + p.pp[0]); }
  function isHalf() { return halfQuery.matches && pages[i].pp.length === 2; }
  function sectionIndex(n) {
    var idx = 0;
    data.sections.forEach(function (s, k) { if (n + 1 >= s.start) idx = k; });
    return idx;
  }

  /* ---- build section chips and thumbnails ---- */
  data.sections.forEach(function (s, k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gl-chip';
    b.textContent = s.label;
    b.addEventListener('click', function () { go(s.start); });
    chipsEl.appendChild(b);
  });

  pages.forEach(function (p, n) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gl-thumb';
    b.setAttribute('aria-label', 'Go to ' + pp(p).toLowerCase() + ': ' + p.title);
    var im = document.createElement('img');
    im.src = thumb(n);
    im.alt = '';
    im.loading = 'lazy';
    im.height = 68;
    im.width = Math.round(68 * p.w / p.h);
    var num = document.createElement('span');
    num.className = 'gl-num';
    num.textContent = n + 1;
    b.appendChild(im);
    b.appendChild(num);
    b.addEventListener('click', function () { go(n + 1); });
    li.appendChild(b);
    thumbsEl.appendChild(li);
  });

  /* ---- render ---- */
  function renderText() {
    textEl.textContent = '';
    var p = pages[i];
    var any = false;
    p.text.forEach(function (t, k) {
      if (!t) return;
      any = true;
      var col = document.createElement('div');
      var h = document.createElement('h3');
      h.textContent = p.pp.length === 2 ? 'Page ' + p.pp[k] : 'Page text';
      col.appendChild(h);
      t.split('\n\n').forEach(function (para) {
        var el = document.createElement('p');
        el.textContent = para;
        col.appendChild(el);
      });
      textEl.appendChild(col);
    });
    if (!any) {
      var el = document.createElement('p');
      el.textContent = 'This page is artwork only, so there is no text to read.';
      textEl.appendChild(el);
    }
  }

  function render() {
    var p = pages[i];
    var half = isHalf();
    if (!half) side = 0;

    pageBox.className = 'gl-page' + (half ? ' half ' + (side ? 'right' : 'left') : '') + (p.pp.length === 1 ? ' cover' : '');
    pageBox.style.setProperty('--gl-aspect', half ? spreadAspect / 2 : spreadAspect);

    var next = src(i);
    var alt = p.alt + (half ? (side ? ' (right-hand page)' : ' (left-hand page)') : '');
    if (img.getAttribute('src') !== next) {
      img.classList.add('is-loading');
      img.onload = img.onerror = function () { img.classList.remove('is-loading'); };
      img.src = next;
    }
    img.alt = alt;
    img.width = p.w;
    img.height = p.h;

    var label = half ? 'Page ' + p.pp[side] : pp(p);
    countEl.textContent = label + ' · ' + (i + 1) + ' of ' + total;
    titleEl.textContent = p.title;
    range.value = i + 1;
    range.setAttribute('aria-valuetext', label + ': ' + p.title);

    var atStart = i === 0;
    var atEnd = i === total - 1 && (!half || side === 1);
    prevBtn.disabled = atStart && side === 0;
    nextBtn.disabled = atEnd;

    var sec = sectionIndex(i);
    Array.prototype.forEach.call(chipsEl.children, function (c, k) {
      if (k === sec) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(thumbsEl.querySelectorAll('.gl-thumb'), function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    var active = thumbsEl.querySelectorAll('.gl-thumb')[i];
    if (active) {
      thumbsEl.scrollTo({
        left: active.offsetLeft - (thumbsEl.clientWidth - active.clientWidth) / 2,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }

    if (!textEl.hidden) renderText();

    if (history.replaceState) {
      try { history.replaceState(null, '', '#page-' + (i + 1)); } catch (e) { /* ignore */ }
    }
    [i - 1, i + 1].forEach(function (n) {
      if (n >= 0 && n < total) { var pre = new Image(); pre.src = src(n); }
    });

    if (!lb.hidden) syncLightbox();
  }

  /* ---- navigation ---- */
  function go(n) {
    n = Math.max(1, Math.min(total, n));
    i = n - 1;
    side = 0;
    render();
  }

  function step(dir) {
    if (isHalf()) {
      var two = pages[i].pp.length === 2;
      if (dir > 0) {
        if (two && side === 0) side = 1;
        else if (i < total - 1) { i++; side = 0; }
        else return;
      } else {
        if (two && side === 1) side = 0;
        else if (i > 0) { i--; side = pages[i].pp.length === 2 ? 1 : 0; }
        else return;
      }
    } else {
      var ni = i + dir;
      if (ni < 0 || ni >= total) return;
      i = ni;
      side = 0;
    }
    render();
  }

  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });
  range.addEventListener('input', function () { go(parseInt(range.value, 10)); });
  halfQuery.addEventListener && halfQuery.addEventListener('change', render);

  /* swipe on touch screens */
  var tx = 0, ty = 0, tracking = false;
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    tracking = true; tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---- actions ---- */
  textBtn.addEventListener('click', function () {
    var open = textEl.hidden;
    textEl.hidden = !open;
    textBtn.setAttribute('aria-expanded', String(open));
    textBtn.textContent = open ? 'Hide text' : 'Read as text';
    if (open) renderText();
  });

  shareBtn.addEventListener('click', function () {
    var url = location.href.split('#')[0] + '#page-' + (i + 1);
    function done() {
      shareBtn.textContent = 'Link copied';
      setTimeout(function () { shareBtn.textContent = 'Copy link'; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
    } else {
      window.prompt('Copy this link', url);
    }
  });

  /* ---- lightbox (zoom) ---- */
  function syncLightbox() {
    var p = pages[i];
    lbImg.src = src(i);
    lbImg.alt = p.alt;
    lbTitle.textContent = pp(p) + ': ' + p.title;
    lbPrev.disabled = i === 0;
    lbNext.disabled = i === total - 1;
  }

  function setZoom(on, e) {
    var rx = 0.5, ry = 0.5;
    if (e && lbImg.clientWidth) {
      var r = lbImg.getBoundingClientRect();
      rx = (e.clientX - r.left) / r.width;
      ry = (e.clientY - r.top) / r.height;
    }
    lb.classList.toggle('is-zoomed', on);
    lbZoom.textContent = on ? 'Zoom out' : 'Zoom in';
    if (on) {
      lbScroll.scrollLeft = rx * lbImg.clientWidth - lbScroll.clientWidth / 2;
      lbScroll.scrollTop = ry * lbImg.clientHeight - lbScroll.clientHeight / 2;
    } else {
      lbScroll.scrollLeft = 0; lbScroll.scrollTop = 0;
    }
  }

  function openLightbox() {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    setZoom(false);
    syncLightbox();
    lbClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  img.addEventListener('click', openLightbox);
  zoomBtn.addEventListener('click', openLightbox);
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { if (i > 0) { i--; side = 0; setZoom(false); render(); } });
  lbNext.addEventListener('click', function () { if (i < total - 1) { i++; side = 0; setZoom(false); render(); } });
  lbZoom.addEventListener('click', function () { setZoom(!lb.classList.contains('is-zoomed')); });
  lbImg.addEventListener('click', function (e) { setZoom(!lb.classList.contains('is-zoomed'), e); });
  lb.addEventListener('click', function (e) { if (e.target === lbScroll) closeLightbox(); });

  /* ---- keyboard ---- */
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    if (!lb.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); lbNext.click(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); lbPrev.click(); }
      else if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return !b.disabled; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }

    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Home') { e.preventDefault(); go(1); }
    else if (e.key === 'End') { e.preventDefault(); go(total); }
  });

  /* ---- start page from the link (#page-5) ---- */
  function fromHash() {
    var m = /^#page-(\d+)$/.exec(location.hash);
    return m ? parseInt(m[1], 10) : 1;
  }
  window.addEventListener('hashchange', function () {
    var n = fromHash();
    if (n - 1 !== i) go(n);
  });

  go(fromHash());
})();
