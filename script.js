// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal-on-scroll
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
} else {
  items.forEach((el) => el.classList.add('visible'));
}

// Hero: rising juice bubbles
(function () {
  const cv = document.getElementById('hero-bubbles');
  if (!cv || !cv.getContext || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1, running = false, visible = true, bubbles = [];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(46, Math.max(18, w / 34)));
    while (bubbles.length < n) bubbles.push(make(true));
    bubbles.length = n;
  }
  function make(anywhere) {
    const r = 2 + Math.random() * Math.random() * 16;
    return { x: Math.random() * w, y: anywhere ? Math.random() * h : h + r + Math.random() * 60, r: r,
      vy: 12 + (20 - r) * 2.2 + Math.random() * 14, ph: Math.random() * 6.28, sw: 8 + Math.random() * 22, sp: .5 + Math.random() * 1.1, a: .35 + Math.random() * .4 };
  }
  let last = 0;
  function frame(t) {
    if (!running) return;
    const dt = Math.min((t - last) / 1000, .05); last = t;
    ctx.clearRect(0, 0, w, h);
    for (const b of bubbles) {
      b.y -= b.vy * dt; b.ph += b.sp * dt;
      const x = b.x + Math.sin(b.ph) * b.sw;
      if (b.y < -b.r * 2) { Object.assign(b, make(false), { x: Math.random() * w }); continue; }
      const g = ctx.createRadialGradient(x - b.r * .35, b.y - b.r * .35, b.r * .1, x, b.y, b.r);
      g.addColorStop(0, 'rgba(255,255,255,' + (b.a * .9) + ')');
      g.addColorStop(.6, 'rgba(255,255,255,' + (b.a * .12) + ')');
      g.addColorStop(1, 'rgba(255,255,255,' + (b.a * .55) + ')');
      ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, 6.2832); ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,' + (b.a * .7) + ')'; ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  function update() {
    const should = visible && !document.hidden;
    if (should && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    else if (!should) running = false;
  }
  size();
  window.addEventListener('resize', size);
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); }).observe(cv);
  update();
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
