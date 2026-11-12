/* GANA brand guidelines: interactive sections */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function copy(text, done) {
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(true); } catch (e) { done(false); }
      document.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  }
  function lum(hex) {
    var n = parseInt(hex.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function grade(r) { return r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large text only' : 'Fails'; }

  var GREEN = '#99BC20', CREAM = '#F2E8D5', LIGHT = '#FAF6EC', INK = '#1B1B1B', GREY = '#D9D4D0';

  /* ---------- personality + voice ---------- */
  var traits = [
    ['Fresh', 'Our colors, imagery, and experiences reflect the freshness of sugarcane.', 'Pressed this morning. Poured for you.'],
    ['Grounded', 'Our identity stays connected to the ingredient, its natural qualities, and where it comes from.', 'Grown on a named farm. Pressed in front of you.'],
    ['Welcoming', 'Our spaces and communication feel friendly, comfortable, and easy to understand.', 'Come in, take a look, try a taste.'],
    ['Thoughtful', 'We consider how each design decision affects the experience, from holding the bottle to understanding its packaging.', 'A bottle that feels like cane in your hand.']
  ];
  var tt = $('trait-tabs'), tp = $('trait-panel');
  traits.forEach(function (t, i) {
    var b = el('button', '', t[0]); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'trait-' + i;
    b.addEventListener('click', function () { showTrait(i); });
    tt.appendChild(b);
  });
  function showTrait(i) {
    Array.prototype.forEach.call(tt.children, function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    tp.setAttribute('aria-labelledby', 'trait-' + i);
    tp.innerHTML = '';
    tp.appendChild(el('h4', '', traits[i][0]));
    tp.appendChild(el('p', '', traits[i][1]));
    tp.appendChild(el('p', 'sample', '&ldquo;' + traits[i][2] + '&rdquo;'));
  }
  tt.addEventListener('keydown', function (e) {
    var i = Array.prototype.findIndex.call(tt.children, function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (e.key === 'ArrowRight') { i = (i + 1) % traits.length; } else if (e.key === 'ArrowLeft') { i = (i + traits.length - 1) % traits.length; } else return;
    e.preventDefault(); showTrait(i); tt.children[i].focus();
  });
  showTrait(0);

  var voice = [
    ['Our premium artisanal beverage experience.', 'Fresh sugarcane juice, pressed for you.'],
    ['Utilize our sustainability-forward packaging solutions.', 'Our bottles are made to be reused or recycled.'],
    ['Revolutionary hydration technology.', 'Cane, pressed. Nothing else.']
  ];
  var vl = $('voice-list');
  voice.forEach(function (v) {
    var li = el('li'), b = el('button', '', '<span class="hint">Tap to rewrite</span><span class="bad">' + v[0] + '</span><span class="good">' + v[1] + '</span>');
    b.type = 'button'; b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!on));
      b.querySelector('.hint').textContent = on ? 'Tap to rewrite' : 'In GANA’s voice';
    });
    li.appendChild(b); vl.appendChild(li);
  });

  /* ---------- pillars ---------- */
  var pillars = [
    ['01', 'Freshness and Wellness', 'Fresh sugarcane juice is at the center of GANA.', 'Support a thoughtful approach to everyday refreshment, with clear information about the product and its ingredients.'],
    ['02', 'Connection to the Source', 'The farm story connects the finished drink to where it begins.', 'Use named farm sourcing and stories about the ingredient to make this connection specific and understandable.'],
    ['03', 'Sustainability in Practice', 'Sustainability guides choices across sourcing, packaging, and disposal.', 'Focus on practical material choices, reduce unnecessary packaging, and consider what happens after the drink is finished.'],
    ['04', 'Sensory Connection', 'Sugarcane shapes how people experience GANA.', 'Bring \u201cFeel the Cane\u201d into packaging and spaces, \u201cFirst Press\u201d into the sound of preparation, and scent and taste into the store.'],
    ['05', 'A Flexible, Recognizable Identity', 'GANA remains recognizable through its logo, core typography, core colors, and graphic language.', 'Let these elements support variation across flavors, locations, seasons, and applications while keeping the brand connected.']
  ];
  var pl = $('pillars'), pIdx = 0, stalkEls = [];
  pillars.forEach(function (p, i) {
    var s = el('div', 'stalk'); s.setAttribute('role', 'listitem');
    var b = el('button', 'stalk-btn', '<span class="s-num">' + p[0] + '</span><span class="s-title">' + p[1] + '</span>');
    b.type = 'button'; b.id = 'stalk-b' + i; b.setAttribute('aria-controls', 'stalk-c' + i);
    var c = el('div', 'stalk-body', '<div class="g-tag">The idea</div><p>' + p[2] + '</p><div class="g-tag">In practice</div><p>' + p[3] + '</p>');
    c.id = 'stalk-c' + i; c.setAttribute('role', 'region'); c.setAttribute('aria-labelledby', b.id);
    b.addEventListener('click', function () { showPillar(i); });
    b.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (!d) return; e.preventDefault(); showPillar(pIdx + d); stalkEls[pIdx].querySelector('button').focus();
    });
    s.appendChild(b); s.appendChild(c); pl.appendChild(s); stalkEls.push(s);
  });
  function showPillar(i) {
    pIdx = (i + pillars.length) % pillars.length;
    stalkEls.forEach(function (s, k) {
      var on = k === pIdx; s.classList.toggle('open', on);
      s.querySelector('button').setAttribute('aria-expanded', String(on));
    });
  }
  showPillar(0);

  /* ---------- logo studio ---------- */
  var ARR = [
    { id: 'horizontal', label: 'Horizontal', mask: 'logo-horizontal', ar: '960/323', w: 'min(100%, 560px)', note: 'The complete wordmark reads across one line. Use for storefront signage, website headers and wide layouts.' },
    { id: 'vertical', label: 'Vertical', mask: 'logo-vertical', ar: '327/957', w: '110px', note: 'The approved vertical composition fits narrow, upright spaces. Use for bottle packaging and vertical signage.' },
    { id: 'stack', label: 'Two-line stack', mask: 'logo-stack', ar: '478/693', w: '230px', note: 'The wordmark divided into the approved GA / NA composition. Use for square labels, stickers and social media.' },
    { id: 'spatial', label: 'Spatial composition', mask: 'logo-spatial', ar: '787/747', w: '300px', note: 'The letters occupy a more open arrangement within the grid. Use for editorial layouts, campaigns and motion.' }
  ];
  var BG = [
    { id: 'cream', label: 'Cream', c: CREAM },
    { id: 'light', label: 'Light cream', c: LIGHT },
    { id: 'green', label: 'Green', c: GREEN },
    { id: 'grey', label: 'Neutral', c: GREY }
  ];
  var LC = [
    { id: 'green', label: 'GANA Green', c: GREEN, note: 'Primary: on cream or a light neutral background.' },
    { id: 'cream', label: 'Cream', c: CREAM, note: 'On a green background where the wordmark stays clearly visible.' },
    { id: 'ink', label: 'Single color', c: INK, note: 'For printing or production limits. Silver is a physical finish for approved packaging; a screen can only approximate it.' }
  ];
  var st = { arr: 0, bg: 0, lc: 0 };
  var stage = $('studio-stage'), art = $('studio-logo'), warn = $('studio-warn');
  var at = $('arr-tabs'), bgr = $('bg-row'), lcr = $('lc-row');
  ARR.forEach(function (a, i) {
    var b = el('button', '', a.label); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { st.arr = i; studio(); }); at.appendChild(b);
  });
  BG.forEach(function (g, i) {
    var b = el('button', '', '<i style="--c:' + g.c + '"></i>' + g.label); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      st.bg = i;
      var cur = LC[st.lc];     // switch to an approved pairing automatically
      if (cur.id !== 'ink' && ratio(cur.c, g.c) < 1.5) st.lc = (g.id === 'green') ? 1 : 0;
      studio();
    }); bgr.appendChild(b);
  });
  LC.forEach(function (l, i) {
    var b = el('button', '', '<i style="--c:' + l.c + '"></i>' + l.label); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { st.lc = i; studio(); }); lcr.appendChild(b);
  });
  function studio() {
    var a = ARR[st.arr], g = BG[st.bg], l = LC[st.lc];
    art.style.setProperty('--mask', 'url(Images/brand/' + a.mask + '.png)');
    art.style.setProperty('--ar', a.ar); art.style.setProperty('--w', a.w); art.style.setProperty('--lc', l.c);
    stage.style.setProperty('--bgc', g.c);
    art.setAttribute('aria-label', 'GANA logo, ' + a.label.toLowerCase() + ', ' + l.label + ' on ' + g.label);
    Array.prototype.forEach.call(at.children, function (b, k) { b.setAttribute('aria-pressed', String(k === st.arr)); });
    Array.prototype.forEach.call(bgr.children, function (b, k) { b.setAttribute('aria-pressed', String(k === st.bg)); });
    Array.prototype.forEach.call(lcr.children, function (b, k) { b.setAttribute('aria-pressed', String(k === st.lc)); });
    $('arr-note').textContent = a.note; $('lc-note').textContent = l.note;
    var msg = '';
    { var r = ratio(l.c, g.c); if (r < 1.5) msg = 'Not approved: the logo disappears into this background. Choose a pairing where the wordmark stays clearly visible.'; }
    warn.hidden = !msg; warn.textContent = msg;
  }
  studio();

  var cBtn = $('constr-btn'), constr = $('constr');
  cBtn.addEventListener('click', function () {
    var on = !constr.classList.contains('on'); constr.classList.toggle('on', on);
    cBtn.setAttribute('aria-pressed', String(on)); cBtn.textContent = on ? 'Hide construction' : 'Show construction';
  });
  var clBox = $('clear-box'), clBtn = $('clear-btn'), clSize = $('clear-size');
  clBox.classList.add('show');
  clBtn.addEventListener('click', function () {
    var on = !clBox.classList.contains('show'); clBox.classList.toggle('show', on);
    clBtn.setAttribute('aria-pressed', String(on)); clBtn.textContent = on ? 'Hide clear space' : 'Show clear space';
  });
  clSize.addEventListener('input', function () { clBox.style.setProperty('--w', clSize.value + 'px'); });

  var MIS = [
    ['Stretched', 'transform:scaleX(1.4)'], ['Rotated', 'transform:rotate(-14deg)'], ['Skewed', 'transform:skewX(-24deg)'],
    ['Unapproved color', '--lc:#E0662B'], ['Shadow and outline', 'filter:drop-shadow(5px 6px 0 #1B1B1B)'],
    ['Busy background', '--lc:#99BC20', 'busy'], ['Cropped', '', 'crop'], ['Retyped in a typeface', '', 'typed']
  ];
  var mis = $('misuse');
  MIS.forEach(function (m) {
    var d = el('div', 'mis' + (m[2] ? ' ' + m[2] : ''));
    var inner = m[2] === 'typed' ? '<span class="typed" aria-hidden="true">GANA</span>'
      : '<div class="logo-art" style="--ar:960/323;--mask:url(Images/brand/logo-horizontal.png);' + m[1] + '" role="img" aria-label="Incorrect: ' + m[0] + '"></div>';
    if (m[2] === 'typed') d.setAttribute('role', 'img'), d.setAttribute('aria-label', 'Incorrect: ' + m[0]);
    d.innerHTML = inner + '<span class="x" aria-hidden="true">×</span><span class="cap">' + m[0] + '</span>';
    mis.appendChild(d);
  });

  /* ---------- color ---------- */
  var SW = [
    { n: 'GANA Green', h: GREEN, d: 'The core brand color: sugarcane. Main pattern and logo color.' },
    { n: 'Cream', h: CREAM, d: 'Warm supporting background and the second core pattern color.' },
    { n: 'Light cream', h: LIGHT, d: 'A lighter cream where a quieter background is needed.' },
    { n: 'Silver', h: null, d: 'A material finish for approved packaging. A flat screen color is only an approximation.' }
  ];
  var sw = $('swatches');
  SW.forEach(function (s) {
    var b = el('button', 'swatch'); b.type = 'button';
    b.innerHTML = '<span class="chip' + (s.h ? '' : ' silver') + '" style="--c:' + (s.h || '#ccc') + '"></span><span class="meta"><strong>' + s.n + '</strong><span class="hex">' + (s.h || 'Physical finish') + '</span><small>' + s.d + '</small></span><span class="copied">Copied</span>';
    b.setAttribute('aria-label', s.h ? 'Copy ' + s.n + ' ' + s.h : s.n + ': a physical finish, no HEX value');
    if (s.h) b.addEventListener('click', function () {
      copy(s.h, function (ok) { var c = b.querySelector('.copied'); c.textContent = ok ? 'Copied ' + s.h : 'Press Ctrl+C'; b.classList.add('did'); setTimeout(function () { b.classList.remove('did'); }, 1500); });
    }); else b.style.cursor = 'default';
    sw.appendChild(b);
  });

  /* ---------- type tester ---------- */
  var W = [['Light', 300, 'Body text'], ['Regular', 400, 'Headlines'], ['Medium', 500, 'Subheadings and flavor names']];
  var wt = $('weight-tabs'), ts = $('type-sample'), tz = $('type-size'), tzo = $('type-size-out');
  W.forEach(function (w, i) {
    var b = el('button', '', w[0]); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { setW(i); }); wt.appendChild(b);
  });
  function setW(i) {
    ts.style.fontWeight = W[i][1];
    Array.prototype.forEach.call(wt.children, function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    $('type-note').textContent = 'Gotham ' + W[i][0] + ': ' + W[i][2] + '.';
  }
  setW(1);
  tz.addEventListener('input', function () { ts.style.fontSize = tz.value + 'px'; tzo.textContent = tz.value + ' px'; });
  ts.addEventListener('paste', function (e) { e.preventDefault(); var t = (e.clipboardData || window.clipboardData).getData('text'); document.execCommand('insertText', false, t); });

  /* ---------- texture lab ---------- */
  var stg = $('tex-stage'), tsz = $('tex-size'), tsh = $('tex-share'), tn = $('tex-note');
  function tex() {
    stg.style.setProperty('--rep', tsz.value + 'px'); stg.style.setProperty('--sh', tsh.value / 100);
    $('tex-size-out').textContent = tsz.value + ' px'; $('tex-share-out').textContent = tsh.value + '%';
    var ok = Number(tsh.value) === 60;
    tn.className = 'g-note ' + (ok ? 'ok' : 'bad');
    tn.textContent = ok ? 'On brand: 60% raised ridge, 40% recessed groove.' : 'Off brand: the ridge must take 60% of one repeat. Scale the repeat, never the proportion.';
  }
  tsz.addEventListener('input', tex); tsh.addEventListener('input', tex);
  $('tex-reset').addEventListener('click', function () { tsh.value = 60; tex(); });
  tex();

  /* ---------- experience ---------- */
  var EXP = [
    ['Packaging', 'Images/gana-bottle-studio.jpeg', 'Feel the Cane', 'Packaging brings “Feel the Cane” directly into people’s hands. The tall cylindrical bottle and its raised texture translate the form and surface of sugarcane into an everyday object.', 'Preserve the established bottle: a uniform diameter, a flush cap of the same diameter, and softly chamfered edges. Use the approved silver logo treatment and keep product information clear.'],
    ['Storefront', 'Images/gana-storefront.jpeg', 'Architecture', 'The storefront extends the bottle’s design into architecture. Vertical forms, cane-inspired texture and the established palette create a visible connection between the product and the place.', 'Carry the texture through selected surfaces, including the façade, counter and door handles. Keep the approved silver logo clearly visible and proportionate to the entrance.'],
    ['Interior', 'Images/gana-store-interior.jpeg', 'Spaces', 'Interior spaces should feel fresh, welcoming and easy to navigate. Make ordering, preparation and pickup areas clear.', 'Where the layout allows, let customers see the pressing process. Balance textured surfaces with quieter areas so the space feels comfortable.'],
    ['Touch', 'Images/gana-door-handle.jpeg', 'Feel the Cane', '“Feel the Cane” is GANA’s main tactile expression. The texture helps people recognize the brand through physical contact as well as appearance.', 'The bottle is the primary point of contact. Counters, door handles, carriers and selected surfaces extend the idea. Test physical samples for grip, edges and durability.'],
    ['Sound', 'Images/gana-first-press.jpeg', 'First Press', '“First Press” connects the sound of preparation to the product, so the moment the cane is pressed becomes part of the brand.', 'Let customers see and hear the pressing where the layout allows, strengthening the connection between the ingredient and the drink.'],
    ['Scent', 'Images/gana-scent-diffuser.jpeg', 'Freshness', 'Scent supports the connection to the ingredient and the freshness of the store. The existing direction uses a floor-standing diffuser in GANA Green #99BC20, near the service area without interrupting circulation.', 'Keep any added scent subtle so it sits comfortably alongside the aroma of preparation and the drink itself.']
  ];
  var et = $('exp-tabs'), ep = $('exp-panel');
  EXP.forEach(function (x, i) {
    var b = el('button', '', x[0]); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'exp-t' + i;
    b.addEventListener('click', function () { showExp(i); }); et.appendChild(b);
  });
  function showExp(i) {
    var x = EXP[i];
    Array.prototype.forEach.call(et.children, function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    ep.setAttribute('aria-labelledby', 'exp-t' + i);
    ep.innerHTML = '<img src="' + x[1] + '" alt="" width="1200" height="900"><div><span class="tag">' + x[2] + '</span><h3>' + x[0] + '</h3><p>' + x[3] + '</p><p>' + x[4] + '</p></div>';
  }
  et.addEventListener('keydown', function (e) {
    var i = Array.prototype.findIndex.call(et.children, function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (e.key === 'ArrowRight') i = (i + 1) % EXP.length; else if (e.key === 'ArrowLeft') i = (i + EXP.length - 1) % EXP.length; else return;
    e.preventDefault(); showExp(i); et.children[i].focus();
  });
  showExp(0);

  /* ---------- seven-part prompt ---------- */
  var PARTS = [
    { n: '01', t: 'How We Work', k: 'perm', d: 'Defines the collaboration between the designer and AI.', body: 'The designer sets the direction and makes the final decisions. AI follows the brief and uses the supplied assets. If essential information is missing or instructions conflict, ask before making a change that affects the identity.' },
    { n: '02', t: 'Brand Strategy', k: 'perm', d: 'Explains the brand’s purpose, personality, voice and experience principles.', body: 'GANA is a fresh sugarcane juice brand built around freshness, wellness, sustainability, and connection to the source.\nKeep communication warm, clear, and approachable. Connect sensory experiences to the ingredient through “Feel the Cane” and “First Press.”' },
    { n: '03', t: 'Visual Principles', k: 'perm', d: 'Identifies the approved logos, typography, colors, textures and references.', body: 'Use the supplied logo artwork and approved arrangements.\nUse Gotham for supporting typography.\nMaintain GANA Green #99BC20 and Cream #F2E8D5 as the core colors.\nFollow the approved silver logo treatment where specified.\nPreserve the existing texture construction and bottle proportions.\nUse the supplied application references to guide new work.' },
    { n: '04', t: 'Generative Grammar', k: 'perm', d: 'Explains how those elements are arranged and what variation is allowed.', body: 'Use the established grid to organize content. Keep a clear hierarchy, consistent alignment, and enough open space around the logo and main message.\nChoose an approved logo arrangement that suits the format. Keep letterforms intact when using them in patterns.\nVariation should respond to a clear input, such as flavor, location, season, or interaction. Change the composition or context while preserving the core identity.' },
    { n: '05', t: 'Project Brief', k: 'proj', d: 'Defines what is being created, who it is for and where it will appear.' },
    { n: '06', t: 'Visual Direction', k: 'proj', d: 'Describes the composition, emphasis, setting and mood for the project.' },
    { n: '07', t: 'Output and Delivery', k: 'proj', d: 'Specifies the format, dimensions and required deliverables.' }
  ];
  var seven = $('seven'), sd = $('seven-detail');
  PARTS.forEach(function (p, i) {
    var li = el('li', p.k), b = el('button', '', '<span class="n">' + p.n + '</span><strong>' + p.t + '</strong><span class="kind">' + (p.k === 'perm' ? 'Permanent' : 'Per project') + '</span>');
    b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { showPart(i); }); li.appendChild(b); seven.appendChild(li);
  });
  function showPart(i) {
    var p = PARTS[i];
    Array.prototype.forEach.call(seven.querySelectorAll('button'), function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    var html = '<h4>' + p.n + ' — ' + p.t + '</h4><p>' + p.d + '</p>';
    if (p.body) html += '<ul>' + p.body.split('\n').map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>';
    else html += '<p>You write this part fresh for every project.</p>';
    sd.innerHTML = html;
  }
  showPart(0);

})();
