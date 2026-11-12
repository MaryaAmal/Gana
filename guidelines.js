/* GANA brand guidelines: a chaptered, scrolling reader with zoom and text view. */
(function () {
  'use strict';
  var data = window.GANA_GUIDELINES;
  if (!data) return;

  var pages = data.pages, total = pages.length;
  var chapters = data.sections.map(function (s, k) {
    var end = k + 1 < data.sections.length ? data.sections[k + 1].start - 1 : total;
    return { label: s.label, start: s.start, end: end };
  });
  var INFO = [
    ['00', 'Opening pages', 'The cover, the tagline and the contents of the guidebook.'],
    ['01', 'Brand Overview', 'Who GANA is: the manifesto, purpose, audience, positioning, personality, voice and the five strategic pillars.'],
    ['02', 'Visual Identity', 'The wordmark and how to use it: construction, arrangements, clear space, color, backgrounds, typography and what to avoid.'],
    ['03', 'Secondary Assets', 'Texture and pattern, drawn from the ridges of fresh sugarcane.'],
    ['04', 'Experiential Guidelines', 'How the brand shows up in the world: packaging, the storefront, the interior and the sensory experience.'],
    ['05', 'AI Prompt Guide', 'A seven-part prompt system for creating on-brand work with AI.']
  ];

  function $(id) { return document.getElementById(id); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function src(n) { return 'Images/guidelines/spread-' + pad(n + 1) + '.webp'; }
  function pp(p) { return p.pp.length === 2 ? 'Pages ' + p.pp[0] + '–' + p.pp[1] : (p.pp[0] === 1 ? 'Cover' : 'Page ' + p.pp[0]); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  var root = $('gl-chapters');
  var lb = $('gl-lb'), lbImg = $('gl-lb-img'), lbScroll = $('gl-lb-scroll'), lbTitle = $('gl-lb-title');
  var lbPrev = $('gl-lb-prev'), lbNext = $('gl-lb-next'), lbZoom = $('gl-lb-zoom'), lbClose = $('gl-lb-close');
  var cur = 0, lastFocus = null, spreadEls = [], chipEls = [], chapEls = [];

  /* ---- build chapters ---- */
  chapters.forEach(function (c, k) {
    var sec = el('section', 'gl-chapter');
    sec.id = 'ch-' + k;
    var head = el('header', 'gl-chapter-head reveal');
    head.appendChild(el('span', 'gl-numeral', INFO[k][0]));
    head.lastChild.setAttribute('aria-hidden', 'true');
    head.appendChild(el('h2', '', INFO[k][1]));
    head.appendChild(el('p', '', INFO[k][2]));
    sec.appendChild(head);

    for (var n = c.start - 1; n < c.end; n++) sec.appendChild(buildSpread(n));
    root.appendChild(sec);
    chapEls.push(sec);


  });

  function smooth() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }

  function buildSpread(n) {
    var p = pages[n];
    var art = el('article', 'gl-spread reveal');
    art.id = 'page-' + (n + 1);
    art.dataset.i = n;

    var frame = el('div', 'gl-frame' + (p.pp.length === 1 ? ' single' : ''));
    frame.tabIndex = 0;
    frame.setAttribute('role', 'button');
    frame.setAttribute('aria-label', 'Zoom in on ' + pp(p).toLowerCase() + ': ' + p.title);
    var halves = p.pp.length === 2 ? ['l', 'r'] : ['l'];
    halves.forEach(function (side, hi) {
      var h = el('div', 'gl-half ' + side);
      h.style.setProperty('--ar', (halves.length === 2 ? p.w / 2 : p.w) / p.h);
      var im = new Image();
      im.src = src(n);
      im.width = p.w; im.height = p.h;
      im.alt = hi === 0 ? p.alt : '';
      im.loading = n < 2 ? 'eager' : 'lazy';
      im.decoding = 'async';
      h.appendChild(im);
      frame.appendChild(h);
    });
    frame.addEventListener('click', function () { openLightbox(n); });
    frame.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(n); } });
    art.appendChild(frame);

    var cap = el('div', 'gl-cap');
    var meta = el('div');
    meta.appendChild(el('span', 'gl-pp', pp(p)));
    meta.appendChild(el('h3', '', p.title));
    cap.appendChild(meta);

    var act = el('div', 'gl-actions');
    var zb = el('button', 'btn btn-ghost btn-small', 'Zoom'); zb.type = 'button';
    zb.addEventListener('click', function () { openLightbox(n); });
    var tb = el('button', 'btn btn-ghost btn-small', 'Read as text'); tb.type = 'button';
    tb.setAttribute('aria-expanded', 'false');
    var cb = el('button', 'btn btn-ghost btn-small', 'Copy link'); cb.type = 'button';
    act.appendChild(zb); act.appendChild(tb); act.appendChild(cb);
    cap.appendChild(act);
    art.appendChild(cap);

    var txt = el('div', 'gl-text'); txt.hidden = true;
    var built = false;
    tb.addEventListener('click', function () {
      var open = txt.hidden;
      if (open && !built) { buildText(txt, p); built = true; }
      txt.hidden = !open;
      tb.setAttribute('aria-expanded', String(open));
      tb.textContent = open ? 'Hide text' : 'Read as text';
    });
    cb.addEventListener('click', function () {
      var url = location.href.split('#')[0] + '#page-' + (n + 1);
      var done = function () { cb.textContent = 'Link copied'; setTimeout(function () { cb.textContent = 'Copy link'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
      else window.prompt('Copy this link', url);
    });
    art.appendChild(txt);
    spreadEls.push(art);
    return art;
  }

  function buildText(box, p) {
    var any = false;
    p.text.forEach(function (t, k) {
      if (!t) return;
      any = true;
      var col = el('div');
      col.appendChild(el('h4', '', p.pp.length === 2 ? 'Page ' + p.pp[k] : 'Page text'));
      t.split('\n\n').forEach(function (para) { col.appendChild(el('p', '', para)); });
      box.appendChild(col);
    });
    if (!any) box.appendChild(el('p', '', 'This page is artwork only, so there is no text to read.'));
  }

  /* ---- reveal (script.js ran before these elements existed) ---- */
  var reveals = root.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
    }, { threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (r) { ro.observe(r); });
  } else {
    Array.prototype.forEach.call(reveals, function (r) { r.classList.add('visible'); });
  }

  /* ---- lightbox ---- */
  function syncLightbox() {
    var p = pages[cur];
    lbImg.src = src(cur);
    lbImg.alt = p.alt;
    lbTitle.textContent = pp(p) + ': ' + p.title;
    lbPrev.disabled = cur === 0;
    lbNext.disabled = cur === total - 1;
  }
  function setZoom(on, e) {
    var rx = 0.5, ry = 0.5;
    if (e && lbImg.clientWidth) {
      var r = lbImg.getBoundingClientRect();
      rx = (e.clientX - r.left) / r.width; ry = (e.clientY - r.top) / r.height;
    }
    lb.classList.toggle('is-zoomed', on);
    lbZoom.textContent = on ? 'Zoom out' : 'Zoom in';
    if (on) {
      lbScroll.scrollLeft = rx * lbImg.clientWidth - lbScroll.clientWidth / 2;
      lbScroll.scrollTop = ry * lbImg.clientHeight - lbScroll.clientHeight / 2;
    } else { lbScroll.scrollLeft = 0; lbScroll.scrollTop = 0; }
  }
  function openLightbox(n) {
    cur = n; lastFocus = document.activeElement;
    lb.hidden = false; document.body.style.overflow = 'hidden';
    setZoom(false); syncLightbox(); lbClose.focus();
  }
  function closeLightbox() {
    lb.hidden = true; document.body.style.overflow = '';
    if (spreadEls[cur]) spreadEls[cur].scrollIntoView({ block: 'center' });
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { if (cur > 0) { cur--; setZoom(false); syncLightbox(); } });
  lbNext.addEventListener('click', function () { if (cur < total - 1) { cur++; setZoom(false); syncLightbox(); } });
  lbZoom.addEventListener('click', function () { setZoom(!lb.classList.contains('is-zoomed')); });
  lbImg.addEventListener('click', function (e) { setZoom(!lb.classList.contains('is-zoomed'), e); });
  lb.addEventListener('click', function (e) { if (e.target === lbScroll) closeLightbox(); });
  

  document.addEventListener('keydown', function (e) {
    if (lb.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
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
  });

  /* ---- jump to #page-N from a shared link ---- */
  function jump() {
    var m = /^#page-(\d+)$/.exec(location.hash);
    if (!m) return;
    var t = $('page-' + m[1]);
    if (t) setTimeout(function () { t.scrollIntoView(); }, 250);
  }
  window.addEventListener('hashchange', jump);
  jump();
})();
