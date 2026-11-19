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
  var pb = $('pv-bottle'), pd = $('pv-detail');
  traits.forEach(function (t, i) {
    var b = el('button', 'pv-layer pv-l' + i, '<span class="pv-no">0' + (i + 1) + '</span><span class="pv-name">' + t[0] + '</span>');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'trait-' + i;
    b.addEventListener('click', function () { showTrait(i); });
    pb.appendChild(b);
  });
  function showTrait(i) {
    Array.prototype.forEach.call(pb.children, function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    pd.setAttribute('aria-labelledby', 'trait-' + i);
    pd.innerHTML = '<span class="pv-tag">Personality ' + (i + 1) + ' of 4</span><h4>' + traits[i][0] + '</h4><p>' + traits[i][1] + '</p><p class="sample">&ldquo;' + traits[i][2] + '&rdquo;</p>';
  }
  pb.addEventListener('keydown', function (e) {
    var i = Array.prototype.findIndex.call(pb.children, function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') i = (i + 1) % traits.length; else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') i = (i + traits.length - 1) % traits.length; else return;
    e.preventDefault(); showTrait(i); pb.children[i].focus();
  });
  showTrait(0);

  var voice = [
    ['Our premium artisanal beverage experience.', 'Fresh sugarcane juice, pressed for you.'],
    ['Utilize our sustainability-forward packaging solutions.', 'Our bottles are made to be reused or recycled.'],
    ['Revolutionary hydration technology.', 'Cane, pressed. Nothing else.']
  ];
  var vl = $('voice-list'), dial = $('voice-dial'), dl = $('voice-dial-label');
  voice.forEach(function (v) {
    vl.appendChild(el('li', '', '<div class="bub bub-bad">' + v[0] + '</div><div class="bub bub-good">' + v[1] + '</div>'));
  });
  function setVoice() {
    var on = dial.checked; vl.classList.toggle('is-gana', on);
    dl.textContent = on ? 'GANA voice: simple, warm, clear' : 'Stiff voice: what we avoid';
  }
  dial.addEventListener('change', setVoice); setVoice();

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
    { id: 'horizontal', label: 'Horizontal', mask: 'logo-horizontal', ar: '960/323', w: 'min(80vw, 1000px)', note: 'The complete wordmark reads across one line. Applications: storefront signage, website headers and wide layouts.' },
    { id: 'vertical', label: 'Vertical', mask: 'logo-vertical', ar: '327/957', w: '15vh', note: 'The approved vertical composition fits narrow, upright spaces. Applications: bottle packaging and vertical signage.' },
    { id: 'stack', label: 'Two-line stack', mask: 'logo-stack', ar: '478/693', w: '30vh', note: 'The wordmark divided into the approved GA / NA composition. Applications: square labels, stickers, and social media.' },
    { id: 'spatial', label: 'Spatial composition', mask: 'logo-spatial', ar: '787/747', w: '40vh', note: 'The letters occupy a more open arrangement within the grid. Applications: editorial layouts, campaigns, and motion.' }
  ];
  var BG = [
    { id: 'cream', label: 'Cream', c: CREAM },
    { id: 'light', label: 'Light cream', c: LIGHT },
    { id: 'green', label: 'Green', c: GREEN },
    { id: 'grey', label: 'Neutral', c: GREY }
  ];
  var LC = [
    { id: 'green', label: 'GANA Green', c: GREEN, note: 'GANA Green logo: cream or a light neutral background. The logo primarily appears in GANA green, with cream providing a warm supporting background.' },
    { id: 'cream', label: 'Cream', c: CREAM, note: 'Cream logo: a green background where the wordmark remains clearly visible.' },
    { id: 'ink', label: 'Single color', c: INK, note: 'Single-color reproduction: applications with printing or production limitations. Silver is used for the approved packaging expression and selected physical applications; a screen can only approximate it.' }
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
    { n: 'GANA Green', h: GREEN, d: 'Primary. Pantone 2300 C \u00b7 CMYK 19, 0, 68, 26.' },
    { n: 'Deep Green', h: '#547335', d: 'Primary. RGB 84, 115, 53 \u00b7 Pantone 364 C \u00b7 CMYK 27, 0, 54, 55.' },
    { n: 'Cream', h: CREAM, d: 'Primary. Pantone 7506 C \u00b7 CMYK 0, 5, 13, 5.' },
    { n: 'Light cream', h: LIGHT, d: 'A lighter cream where a quieter background is needed.' },
    { n: 'Black', h: '#000000', d: 'Secondary. Adds definition to typography and graphics. Pantone Black 3 C.' },
    { n: 'White', h: '#FFFFFF', d: 'Secondary. Creates space and lets the signature greens stand out. Pantone 11-0601.' },
    { n: 'Silver', h: null, d: 'Accent. A reflective finish for the wordmark and details through metallic foil, ink, or brushed metal.' }
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
  var W = [['Light', 300, 'product descriptions, brand information, and longer passages'], ['Regular', 400, 'main messages, campaign statements, and page titles'], ['Medium', 500, 'section headings, product names, and supporting emphasis']];
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
    ['Storefront', 'Images/gana-storefront-new.jpg', 'Architecture', 'The storefront extends the bottle’s design into architecture. Vertical forms, cane-inspired texture and the established palette create a visible connection between the product and the place.', 'Carry the texture through selected surfaces, including the façade, counter and door handles. Keep the approved silver logo clearly visible and proportionate to the entrance.'],
    ['Interior', 'Images/gana-store-interior.jpeg', 'Spaces', 'Interior spaces should feel fresh, welcoming and easy to navigate. Make ordering, preparation and pickup areas clear.', 'Where the layout allows, let customers see the pressing process. Balance textured surfaces with quieter areas so the space feels comfortable.'],
    ['Touch', 'Images/gana-door-handle.jpeg', 'Feel the Cane', '“Feel the Cane” is GANA’s main tactile expression. The texture helps people recognize the brand through physical contact as well as appearance.', 'The bottle is the primary point of contact. Counters, door handles, carriers and selected surfaces extend the idea. Test physical samples for grip, edges and durability.'],
    ['Sound', 'Images/gana-first-press.jpeg', 'First Press', '“First Press” connects the sound of preparation to the product, so the moment the cane is pressed becomes part of the brand.', 'Let customers see and hear the pressing where the layout allows, strengthening the connection between the ingredient and the drink.'],
    ['Scent', 'Images/gana-scent-diffuser.jpeg', 'Freshness', 'Scent supports the connection to the ingredient and the freshness of the store. The existing direction uses a floor-standing diffuser in GANA Green #99BC20, near the service area without interrupting circulation.', 'Keep any added scent subtle so it sits comfortably alongside the aroma of preparation and the drink itself.']
  ];
  var et = $('exp-tabs'), ep = $('exp-panel');
  if (et) EXP.forEach(function (x, i) {
    var b = el('button', '', x[0]); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'exp-t' + i;
    b.addEventListener('click', function () { showExp(i); }); et.appendChild(b);
  });
  function showExp(i) {
    var x = EXP[i];
    Array.prototype.forEach.call(et.children, function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    ep.setAttribute('aria-labelledby', 'exp-t' + i);
    ep.innerHTML = '<img src="' + x[1] + '" alt="" width="1200" height="900"><div><span class="tag">' + x[2] + '</span><h3>' + x[0] + '</h3><p>' + x[3] + '</p><p>' + x[4] + '</p></div>';
  }
  if (et) et.addEventListener('keydown', function (e) {
    var i = Array.prototype.findIndex.call(et.children, function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (e.key === 'ArrowRight') i = (i + 1) % EXP.length; else if (e.key === 'ArrowLeft') i = (i + EXP.length - 1) % EXP.length; else return;
    e.preventDefault(); showExp(i); et.children[i].focus();
  });
  if (et && ep) showExp(0);

  /* ---------- seven-part prompt ---------- */
  var PARTS = [
    { n: "01", t: "How We Work", k: "perm", d: "Defines the collaboration between the designer and AI.", lines: ["I lead the creative direction, and you help me bring the design to life.", "Before starting, read the project brief and the relevant pages of the brand guide. Look at the files listed in the brief.", "Use the original design files I provide, all the logos are in the brand guide PDF that I will attach. Keep the logo unchanged. Do not redraw it, stretch it, change its letter shapes, change its spacing, or create a new arrangement unless I specifically ask for logo exploration.", "If you cannot open a file, use the required font, keep an asset accurate, or create the requested file format, tell me before continuing. Do not replace anything without telling me.", "The brand guide explains the rules that stay the same. The project brief explains what we are creating this time, including the message, size, and required files.", "If the project brief conflicts with a brand rule, ask me before changing that rule.", "Ask if important information is missing, such as the artwork size, required wording, or a file needed to complete the design. Put your questions together in one message.", "You can make normal layout decisions within the brand rules. You do not need to ask about every small design choice."] },
    { n: "02", t: "Brand Strategy", k: "perm", d: "Explains the brand’s purpose, personality, voice and experience principles.", lines: ["GANA is a fresh sugarcane juice brand. I want the brand to feel refreshing, honest, and connected to sugarcane.", "The idea is to bring sugarcane into everyday life through the drink, bottle, and overall experience. The design should help people understand the connection between the product and its ingredient.", "GANA should feel premium but approachable. Show this through thoughtful design, clear layouts, believable materials, and attention to detail.", "The voice is simple, warm, and confident. Use natural language that is easy to understand.", "Only use product facts and claims that I have provided. Do not invent health benefits, farm locations, sourcing details, certifications, or sustainability claims."] },
    { n: "03", t: "Visual Principles", k: "perm", d: "Identifies the approved logos, typography, colors, textures and references.", lines: ["Logo:: Use the approved logo files shown in the brand guide. Use the main logo unless another approved arrangement fits the space better and remains easy to read. Keep the original letter shapes, proportions, and spacing. Follow the guide for the empty space around the logo and the smallest allowed size.", "Typography:: Use the fonts and weights listed in the brand guide. Make the reading order clear through text size, weight, spacing, and placement. The custom logo lettering is for the logo. Do not use it to invent new words or headlines. If the required font is unavailable, tell me and ask before using a different one.", "Color:: The main green is #99BC20. Deep green #517201 is the supporting color. Use the approved background colors and color combinations shown in the guide. Do not add new brand colors unless I approve them. Photographs can contain natural colors, but these should not become new brand colors. Use silver only where the guide or project brief asks for it. Follow the supplied reference to understand whether it should look like a flat color or a metallic finish. Keep the text and logo easy to see against the background.", "Texture:: The vertical ridges of sugarcane are an important part of GANA. Follow the supplied reference for the direction, spacing, and appearance of the ridges. On physical objects, the texture should look suitable for the material and comfortable to use. In a graphic design, the texture should support the layout. It should not make the logo or text difficult to read. When showing the approved bottle, keep its existing ridges and proportions unchanged.", "Approved bottle shape:: A sleek, tall, perfectly symmetrical cylinder inspired by a single segment (internode) of a sugarcane stalk. The body keeps a continuous, uniform diameter from top to base, with no tapering, curving, or waist contouring. Aspect ratio is approximately 1:3.5 or 1:4. The flat-topped, flush cap shares the exact same outer diameter as the body. The top rim and bottom base have crisp, slightly chamfered soft edges. The outer wall has a fine, repeating 3D vertical ridge pattern (360° around the circumference), a subtle fluted profile rather than a flat circular cross-section.", "Imagery:: Use sugarcane, fresh juice, the approved product, and people enjoying it when they are relevant to the project. Keep lighting, materials, people, and surroundings natural and believable. Follow the approved bottle reference for its shape, cap, proportions, texture, color, and branding. When an exact product image is needed, use the supplied image directly if the tool allows it. If you cannot keep the product accurate, tell me.", "Flavor graphics:: Flavor symbols and a flavor color system have not been developed yet. Do not invent ingredient symbols, flavor colors, or new product varieties. If the brief includes a flavor name, show that name in the approved font. Only explore new flavor graphics when I specifically ask for that task."] },
    { n: "04", t: "Generative Grammar", k: "perm", d: "Explains how those elements are arranged and what variation is allowed.", lines: ["What stays the same:: Keep the approved logo construction, color values, fonts, and existing product design consistent.", "What can change:: The layout, image crop, text size, spacing, and choice of approved logo arrangement can change to suit the project.", "Logo choice:: Use the main logo by default. Choose another approved arrangement when it works better in the available space. Do not create a new arrangement.", "Layout:: Use a clear grid, consistent margins, and enough empty space. Give the design one main focus. Arrange the other information so the viewer knows what to read next.", "Hierarchy:: Decide what should be noticed first based on the goal of the project. For a hoarding, this may be a short headline and the product. For a product information page, more details may be needed. Keep GANA recognizable and make it clear what the product is. Do not make every element equally large or important.", "Sensory experience:: Use sensory ideas only when they help the project. Touch can come from the sugarcane-inspired surface. Sound can relate to the pressing process. Scent should relate to the fresh ingredient when that experience is part of the brief. Do not add a sensory feature simply because it exists in the wider brand idea.", "Reason for variation:: Each variation should respond to the message, product, format, audience, or experience. The design can change to suit its purpose while still following GANA’s rules."] },
    { n: "05", t: "Project Brief", k: "proj", d: "Defines what is being created, who it is for and where it will appear. Example from the guide:", lines: ["A set of presentation visuals showing GANA’s packaging and how its design extends into a shop experience.", "The audience is people who enjoy fresh drinks and appreciate thoughtful design. The purpose is to make sugarcane juice feel fresh, approachable, and desirable, while showing a clear connection to the ingredient.", "Use the approved bottle as the starting point. Show how its sugarcane-inspired shape and vertical texture connect with the shop counter and door handles."] },
    { n: "06", t: "Visual Direction", k: "proj", d: "Describes the composition, emphasis, setting and mood for the project. Example from the guide:", lines: ["The design should feel fresh, calm, premium, and approachable. Keep the spaces clean and welcoming, with enough open space for the product and materials to stand out.", "Packaging:: Follow the approved bottle reference. Keep its shape, cap, proportions, ridges, color, and logo placement unchanged. Use the approved vertical logo on the packaging.", "Shop:: Use the approved horizontal logo on the signage. Carry the bottle’s vertical rhythm into the counter surface and door handles. Adapt the texture to suit each surface while keeping the connection to sugarcane clear.", "Color:: Use GANA green #99BC20 as the main brand color and deep green #517201 for support. Follow the approved references for silver branding and other materials.", "Keep lighting, materials, people, and proportions believable. Show the bottle clearly in the product view and naturally in someone’s hand in the shop scene."] },
    { n: "07", t: "Output and Delivery", k: "proj", d: "Specifies the format, dimensions and required deliverables. Example from the guide (“What I need from you”):", lines: ["What to create:: Create four images: a clear bottle view, a facade of the shop in a shopping mall, a shop scene showing someone holding the bottle near the counter, and a close-up of the entrance handle.", "Assets:: Use the attached GANA Brand Guide, approved logo files, approved bottle image, and texture reference. If an essential reference is missing or unclear, ask me before starting.", "Consistency:: Keep the approved bottle and logos unchanged across the images. Do not create new logo arrangements, flavor symbols, flavor colors, or product varieties.", "Product view:: Show the whole bottle against a simple background, with enough detail to judge its shape, texture, and branding.", "Shop scene:: Show the counter, horizontal shop signage, and a person holding the approved bottle. Keep the bottle large enough to recognize and the interaction natural.", "Handle detail:: Show how the sugarcane-inspired form and ridges work on a door handle. Include enough of the door to explain how the handle would be used.", "Checks:: Before delivery, check that the logos are accurate, the bottle stays consistent, and the texture feels connected across the applications. Check the scale of the bottle, hands, counter, and handle.", "Deliverables:: Provide the four images with a short explanation of the main design choices. Mention any assumptions or anything you could not reproduce accurately.", "Formats:: Provide each image separately as a 1920 × 1080 pixel PNG. Do not combine the images into one collage."] }
  ];
  var seven = $('seven'), sd = $('seven-detail');
  PARTS.forEach(function (p, i) {
    var li = el('li', p.k), b = el('button', '', '<span class="n">' + p.n + '</span><strong>' + p.t + '</strong><span class="kind">' + (p.k === 'perm' ? 'Permanent' : 'Per project') + '</span>');
    b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { showPart(i); }); li.appendChild(b); seven.appendChild(li);
  });
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function partText(p) {
    return p.n + ' — ' + p.t.toUpperCase() + '\n\n' + p.lines.map(function (l) { return l.replace('::', ':'); }).join('\n\n');
  }
  function showPart(i) {
    var p = PARTS[i];
    Array.prototype.forEach.call(seven.querySelectorAll('button'), function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    var html = '<h4>' + p.n + ' — ' + p.t + '</h4><p class="sd-d">' + p.d + '</p><div class="sd-body"><ul>' + p.lines.map(function (l) {
      var m = l.split('::');
      return '<li>' + (m.length > 1 ? '<strong>' + esc(m[0]) + ':</strong> ' + esc(m.slice(1).join('::').trim()) : esc(l)) + '</li>';
    }).join('') + '</ul></div><button type="button" class="btn btn-ghost btn-small sd-copy">Copy this part</button>';
    sd.innerHTML = html;
    var cb = sd.querySelector('.sd-copy');
    cb.addEventListener('click', function () { copy(partText(p), function (ok) { cb.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { cb.textContent = 'Copy this part'; }, 1600); }); });
  }
  showPart(0);

  /* ---------- pattern zoom ---------- */
  (function () {
    var v = $('pat-view'), im = $('pat-img'), z = $('pat-zoom'); if (!v || !im || !z) return;
    var s = 1, x = 0, y = 0, drag = null, TW = 476, TH = 1249;
    function apply() {
      var w = Math.max(TW * .9 * s, 30);
      im.style.backgroundSize = w + 'px ' + (w * TH / TW) + 'px';
      im.style.backgroundPosition = 'calc(50% + ' + x + 'px) calc(50% + ' + y + 'px)';
      z.value = Math.round(s * 100); $('pat-out-val').textContent = Math.round(s * 100) + '%';
    }
    function set(n) { s = Math.max(.2, Math.min(3, n)); apply(); }
    z.addEventListener('input', function () { set(z.value / 100); });
    $('pat-in').addEventListener('click', function () { set(s + (s < 1 ? .1 : .25)); });
    $('pat-out').addEventListener('click', function () { set(s - (s <= 1 ? .1 : .25)); });
    $('pat-reset').addEventListener('click', function () { x = 0; y = 0; set(1); });
    v.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.pat-ctrl')) return;
      drag = { px: e.clientX, py: e.clientY, x: x, y: y }; v.setPointerCapture(e.pointerId); v.classList.add('drag');
    });
    v.addEventListener('pointermove', function (e) { if (!drag) return; x = drag.x + e.clientX - drag.px; y = drag.y + e.clientY - drag.py; apply(); });
    function end() { drag = null; v.classList.remove('drag'); }
    v.addEventListener('pointerup', end); v.addEventListener('pointercancel', end);
    apply();
  })();

})();
