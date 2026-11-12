/* GANA scenes: dial, HUD and next button shared by every page */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  var dl = $('dial-list'), hn = $('hud-n'), hl = $('hud-l'), nb = $('next-btn'), cur = 0, dots = [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('hud-t').textContent = pad2(scenes.length);
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  scenes.forEach(function (s, i) {
    var li = el('li'), b = el('button', '', '<span class="d-label">' + s.dataset.label + '</span>');
    b.type = 'button'; b.setAttribute('aria-label', 'Go to scene ' + (i + 1) + ': ' + s.dataset.label.replace(/&rsquo;/g, '\u2019'));
    b.addEventListener('click', function () { s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    li.appendChild(b); dl.appendChild(li); dots.push(b);
  });
  function setScene(i) {
    cur = i;
    dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    hn.textContent = pad2(i + 1); hl.innerHTML = scenes[i].dataset.label;
    document.body.setAttribute('data-scene-tone', (scenes[i].className.match(/s-(\w+)/) || [0, 'photo'])[1]);
    nb.classList.toggle('last', i === scenes.length - 1);
    nb.setAttribute('aria-label', i === scenes.length - 1 ? 'Back to the first scene' : 'Next scene');
  }
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setScene(scenes.indexOf(e.target)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    scenes.forEach(function (s) { so.observe(s); });
  }
  nb.addEventListener('click', function () {
    var t = scenes[cur === scenes.length - 1 ? 0 : cur + 1];
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  setScene(0);
})();
