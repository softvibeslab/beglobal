/* Mapa neural de la ruta 0 → 100 · Be Global Pro
   Motor sin dependencias: SVG + JS. Datos en window.BEGLOBAL_RUTA.
   Gamificación: puntaje 0-100 por hitos aprobados, XP, nivel Fibonacci (Áureo), racha, insignias.
   Estado persistente en localStorage (bg-ruta-neural-v1). */
(function () {
  'use strict';
  const RUTA = window.BEGLOBAL_RUTA;
  if (!RUTA) { document.body.innerHTML = '<p style="padding:40px">No se encontró ruta-dropshipping-0-100.js</p>'; return; }
  const STORE = 'bg-ruta-neural-v1';
  const XP_POR_TALLA = 50, XP_ENTREGA = 10, XP_PASO = 5;
  const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- estado ---------- */
  const defaults = () => ({ mode: 'member', ms: {}, steps: {}, xp: 0, streak: { last: null, count: 0 }, badges: [], expanded: ['S_E0'], log: [] });
  let state = load();
  function load() { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { return defaults(); } }
  function save() { localStorage.setItem(STORE, JSON.stringify(state)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  function touchStreak() {
    const t = today(), s = state.streak;
    if (s.last === t) return;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    s.count = s.last === y ? s.count + 1 : 1; s.last = t;
  }

  /* ---------- modelo ---------- */
  const stages = RUTA.stages;
  const RUTA_STEPS = {}; stages.forEach(s => { RUTA_STEPS[s.key] = s.steps || []; });
  const gatesBefore = {}; // stageKey -> gate
  RUTA.critical_paths.forEach(rc => { const last = rc.stages[rc.stages.length - 1]; const idx = stages.findIndex(s => s.key === last); const next = stages[idx + 1]; if (next) gatesBefore[next.key] = rc; });
  // Ajuste: RC1 protege la apertura de tienda (antes de E3), RC2 la inversión en ads (antes de E5), RC3 la escala (antes de E7)
  Object.keys(gatesBefore).forEach(k => delete gatesBefore[k]);
  gatesBefore.E3 = RUTA.critical_paths[0]; gatesBefore.E5 = RUTA.critical_paths[1]; gatesBefore.E7 = RUTA.critical_paths[2];

  const msState = id => (state.ms[id] && state.ms[id].status) || 'pending';
  const stageDone = s => s.milestones.every(m => msState(m.id) === 'approved');
  const stageIdx = key => stages.findIndex(s => s.key === key);
  const stageAvailable = s => { const i = stageIdx(s.key); return i === 0 || stageDone(stages[i - 1]); };
  const gateOpen = key => { const i = stageIdx(key); return stageDone(stages[i - 1]); };
  const stageStatus = s => stageDone(s) ? 'complete' : stageAvailable(s) ? 'available' : 'locked';
  const msStatus = (s, m) => { const st = msState(m.id); if (st === 'approved') return 'approved'; if (st === 'submitted') return 'submitted'; return stageAvailable(s) ? 'available' : 'locked'; };
  function activeMission() { for (const s of stages) { if (!stageAvailable(s)) break; for (const m of s.milestones) if (msState(m.id) !== 'approved') return { s, m }; } return null; }
  function score() { let t = 0; for (const s of stages) { const band = s.score[1] - s.score[0], tot = s.milestones.reduce((a, m) => a + m.size, 0); for (const m of s.milestones) if (msState(m.id) === 'approved') t += band * m.size / tot; } return Math.round(t); }
  function level() { let lvl = 1, acc = 0; for (let i = 0; i < FIB.length; i++) { acc += 500 * FIB[i]; if (state.xp >= acc) lvl = i + 2; else break; } return lvl; }
  const BADGES = [
    ['primer', '🚀', 'Primer hito aprobado', () => Object.values(state.ms).some(x => x.status === 'approved')],
    ['venta', '💸', 'Primera venta (E2-M3)', () => msState('E2-M3') === 'approved'],
    ['tienda', '🛍️', 'Tienda viva (E3-M3)', () => msState('E3-M3') === 'approved'],
    ['rc1', '🔓', 'Compuerta RC1 abierta', () => gateOpen('E3')],
    ['rc2', '📡', 'Compuerta RC2 abierta', () => gateOpen('E5')],
    ['rc3', '📈', 'Compuerta RC3 abierta', () => gateOpen('E7')],
    ['mitad', '⛰️', 'Mitad del camino (50)', () => score() >= 50],
    ['racha7', '🔥', 'Racha de 7 días', () => state.streak.count >= 7],
    ['master', '👑', 'Master Be Global (100)', () => score() >= 100],
  ];

  /* ---------- layout ---------- */
  const W = 3000, H = 1200;
  const path = []; // posiciones de A, E0..E7, B
  const N = stages.length + 2;
  for (let i = 0; i < N; i++) { const t = i / (N - 1); path.push({ x: 180 + t * (W - 360), y: H / 2 + Math.sin(t * Math.PI * 2.4) * 240 }); }
  const nodes = {}; // id -> {id,type,x,y,r,label,sub,parent,data,status}
  function build() {
    for (const k in nodes) delete nodes[k];
    const A = path[0], B = path[N - 1];
    nodes.A = { id: 'A', type: 'point', x: A.x, y: A.y, r: 46, label: 'Punto A', sub: 'Hoy · 0 puntos' };
    nodes.B = { id: 'B', type: 'point', x: B.x, y: B.y, r: 52, label: 'Punto B', sub: 'Master · 100 puntos' };
    stages.forEach((s, i) => {
      const p = path[i + 1], id = 'S_' + s.key, st = stageStatus(s);
      nodes[id] = { id, type: 'stage', x: p.x, y: p.y, r: 54, label: s.key, sub: s.name, data: s, status: st, expanded: state.expanded.includes(id) };
      if (gatesBefore[s.key]) { const q = path[i], g = gatesBefore[s.key]; const gid = 'G_' + g.id; nodes[gid] = { id: gid, type: 'gate', x: (q.x + p.x) / 2, y: (q.y + p.y) / 2 - 90, r: 30, label: g.id, sub: 'compuerta', data: g, status: gateOpen(s.key) ? 'open' : 'locked', stageKey: s.key }; }
      if (!nodes[id].expanded) return;
      const dir = i % 2 === 0 ? -1 : 1; // abanico arriba o abajo alternado
      const kids = [...s.milestones.map(m => ({ kind: 'ms', m })), { kind: 'cluster', which: 'steps' }, { kind: 'cluster', which: 'materials' }];
      const R = 185, span = Math.PI * 0.95, start = -Math.PI / 2 * dir - span / 2;
      kids.forEach((k, j) => {
        const a = start + span * (kids.length === 1 ? .5 : j / (kids.length - 1));
        const x = p.x + Math.cos(a) * R, y = p.y + Math.sin(a) * R * (dir);
        if (k.kind === 'ms') { const m = k.m, mid = 'M_' + m.id; nodes[mid] = { id: mid, type: 'ms', x, y, r: 26 + m.size * 2, label: m.id.split('-')[1], sub: m.title, data: m, stage: s, status: msStatus(s, m), parent: id }; }
        else { const cid = 'C_' + s.key + '_' + k.which; nodes[cid] = { id: cid, type: 'cluster', x, y, r: 24, label: k.which === 'steps' ? '1…' + (RUTA_STEPS[s.key] || []).length : '📚', sub: k.which === 'steps' ? 'paso a paso' : 'materiales', data: s, which: k.which, parent: id, expanded: state.expanded.includes(cid) }; 
          if (k.which === 'steps' && nodes[cid].expanded) { const steps = RUTA_STEPS[s.key] || []; steps.forEach((txt, si) => { const sid = 'P_' + s.key + '_' + si; const ang = a + (si - (steps.length - 1) / 2) * 0.16; const rr = R + 150 + (si % 2) * 46; nodes[sid] = { id: sid, type: 'step', x: p.x + Math.cos(ang) * rr, y: p.y + Math.sin(ang) * rr * dir, r: 16, label: String(si + 1), sub: '', data: txt, stage: s, parent: cid, status: state.steps[sid] ? 'done' : 'todo' }; }); }
        }
      });
    });
    const am = activeMission(); if (am) { const n = nodes['M_' + am.m.id]; if (n) n.active = true; }
  }

  /* ---------- render ---------- */
  const svg = document.getElementById('map');
  const layerBg = mk('g', { id: 'bg' }), layerE = mk('g', { id: 'edges' }), layerN = mk('g', { id: 'nodes' });
  const defs = mk('defs'); defs.innerHTML = '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="glowG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.append(defs, layerBg, layerE, layerN);
  function mk(tag, attrs) { const el = document.createElementNS(NS, tag); if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]); return el; }
  // fondo neuronal
  (function bg() { const pts = []; for (let i = 0; i < 140; i++) { pts.push({ x: Math.random() * W, y: Math.random() * H }); } pts.forEach((p, i) => { const c = mk('circle', { class: 'bgdot', cx: p.x, cy: p.y, r: 1.5 + Math.random() * 2.5 }); c.style.animationDelay = (Math.random() * 6) + 's'; layerBg.append(c); if (i % 3 === 0) { const q = pts[(i * 7) % pts.length]; if (Math.hypot(p.x - q.x, p.y - q.y) < 420) layerBg.append(mk('line', { class: 'bgline', x1: p.x, y1: p.y, x2: q.x, y2: q.y })); } }); })();

  const els = {}; // id -> g
  let selected = null;
  function curve(a, b) { const dx = (b.x - a.x) * 0.45; return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`; }
  function render() {
    build();
    // edges
    layerE.innerHTML = '';
    const edge = (a, b, cls) => layerE.append(mk('path', { d: curve(a, b), class: 'edge ' + cls }));
    let prev = nodes.A;
    stages.forEach((s, i) => { const n = nodes['S_' + s.key]; const st = n.status; const g = gatesBefore[s.key] ? nodes['G_' + gatesBefore[s.key].id] : null;
      if (g) { edge(prev, g, 'gate ' + (g.status === 'open' ? 'done' : 'locked')); edge(g, n, 'gate ' + (g.status === 'open' ? (st === 'complete' ? 'done' : 'active pulse') : 'locked')); }
      else edge(prev, n, st === 'complete' ? 'done' : st === 'available' ? 'active pulse' : 'locked');
      prev = n; });
    edge(prev, nodes.B, stageDone(stages[stages.length - 1]) ? 'done pulse' : 'locked');
    for (const id in nodes) { const n = nodes[id]; if (!n.parent) continue; const p = nodes[n.parent]; const cls = n.status === 'approved' || n.status === 'done' ? 'done' : n.active ? 'active pulse' : n.status === 'locked' ? 'locked' : ''; edge(p, n, cls); }
    // nodes keyed
    const seen = new Set();
    for (const id in nodes) { const n = nodes[id]; seen.add(id); let g = els[id]; const isNew = !g;
      if (isNew) { g = mk('g', { class: 'node new' }); g.dataset.id = id; g.addEventListener('click', ev => { ev.stopPropagation(); onClick(id); }); layerN.append(g); els[id] = g; const p = n.parent ? nodes[n.parent] : n; g.setAttribute('transform', `translate(${p.x},${p.y})`); }
      g.innerHTML = nodeInner(n);
      g.setAttribute('class', `node ${n.type} ${n.status || ''} ${n.expanded ? 'expanded' : ''} ${n.active ? 'activeMission' : ''} ${selected === id ? 'selected' : ''} ${isNew ? 'new' : ''}`);
      requestAnimationFrame(() => requestAnimationFrame(() => { g.setAttribute('transform', `translate(${n.x},${n.y})`); g.classList.remove('new'); }));
    }
    for (const id in els) if (!seen.has(id)) { const g = els[id]; g.classList.add('new'); setTimeout(() => g.remove(), 450); delete els[id]; }
    // orden z: stages/points al frente
    [...layerN.children].sort((a, b) => (a.classList.contains('stage') || a.classList.contains('point') ? 1 : 0) - (b.classList.contains('stage') || b.classList.contains('point') ? 1 : 0)).forEach(c => layerN.append(c));
    renderHud();
  }
  function nodeInner(n) {
    const r = n.r; let s = '';
    if (n.type === 'stage' || n.type === 'point') s += `<circle class="halo" r="${r + 10}" stroke="${n.status === 'complete' ? '#45B114' : n.status === 'locked' ? '#3a5470' : '#FDB12B'}"/>`;
    if (n.active) s += `<circle class="halo" r="${r + 12}" stroke="#FDB12B" style="animation-duration:1.6s"/>`;
    s += `<circle class="core" r="${r}" filter="url(#glow)"/>`;
    if (n.type === 'stage') { const done = n.data.milestones.filter(m => msState(m.id) === 'approved').length, tot = n.data.milestones.length, C = 2 * Math.PI * (r + 4); s += `<circle class="ring" r="${r + 4}"/><circle class="ringfg" r="${r + 4}" transform="rotate(-90)" stroke-dasharray="${C * done / tot} ${C}"/>`;
      s += `<text class="lbl" y="-2" text-anchor="middle">${n.label}</text><text class="badge" y="14" text-anchor="middle">${n.data.score[0]}→${n.data.score[1]}</text><text class="sub" y="${r + 24}" text-anchor="middle">${esc(n.sub)}</text><text class="badge" y="${r + 40}" text-anchor="middle" fill="#B4E5FC">${done}/${tot} hitos · ${n.data.weeks} sem</text>`; }
    else if (n.type === 'point') s += `<text class="lbl" y="-2" text-anchor="middle">${n.label}</text><text class="badge" y="14" text-anchor="middle" fill="#062F55">${n.id === 'A' ? 'HOY' : 'MASTER'}</text><text class="sub" y="${r + 22}" text-anchor="middle">${esc(n.sub)}</text>`;
    else if (n.type === 'gate') { s = `<polygon class="core" points="${[0, -r, r, 0, 0, r, -r, 0].join(' ')}" filter="url(#glow)"/><text class="lbl" y="5" text-anchor="middle" style="font-size:12px">${n.status === 'open' ? '🔓' : '🔒'}</text><text class="sub" y="${r + 18}" text-anchor="middle" fill="#FDB12B">${n.label} · ${n.status === 'open' ? 'abierta' : 'bloqueada'}</text>`; }
    else if (n.type === 'ms') s += `<text class="lbl" y="5" text-anchor="middle" style="font-size:13px">${n.status === 'approved' ? '✓' : n.label}</text><text class="sub" y="${r + 16}" text-anchor="middle">${esc(trunc(n.sub, 26))}</text><text class="badge" y="${r + 30}" text-anchor="middle" fill="#B4E5FC">talla ${n.data.size} · ${n.data.size * XP_POR_TALLA} XP</text>`;
    else if (n.type === 'cluster') s += `<text class="lbl" y="5" text-anchor="middle" style="font-size:12px">${n.label}</text><text class="sub" y="${r + 16}" text-anchor="middle">${n.sub}</text>`;
    else if (n.type === 'step') s += `<text class="lbl" y="4" text-anchor="middle" style="font-size:11px">${n.status === 'done' ? '✓' : n.label}</text>`;
    return s;
  }
  const esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const trunc = (t, n) => t.length > n ? t.slice(0, n - 1) + '…' : t;

  /* ---------- interacción ---------- */
  function onClick(id) {
    const n = nodes[id]; selected = id;
    if (n.type === 'stage' || n.type === 'cluster') { if (n.type === 'cluster' && n.which === 'materials') { /* solo panel */ } else toggleExpand(id); }
    render(); openPanel(id);
  }
  function toggleExpand(id) { const i = state.expanded.indexOf(id); if (i >= 0) { state.expanded.splice(i, 1); state.expanded = state.expanded.filter(x => !x.startsWith('C_' + id.slice(2))); } else state.expanded.push(id); save(); }
  svg.addEventListener('click', () => { selected = null; closePanel(); render(); });

  /* ---------- panel ---------- */
  const panel = document.getElementById('panel'), body = document.getElementById('panelBody');
  function closePanel() { panel.classList.remove('open'); document.body.classList.remove('panel-open'); }
  function openPanel(id) {
    const n = nodes[id]; if (!n) return; let h = '';
    const head = (eyebrow, title) => `<div class="head"><div><span class="eyebrow">${eyebrow}</span><h2>${esc(title)}</h2></div><button class="close" id="pClose">×</button></div>`;
    if (n.type === 'point') { h = head(n.id === 'A' ? 'Punto A' : 'Punto B', n.id === 'A' ? 'Hoy: tu punto de partida' : 'Master Be Global'); h += n.id === 'A' ? `<p>La ruta arranca con un diagnóstico de 5 preguntas. Cada neurona es una etapa; ábrela para ver sus hitos, el paso a paso y los materiales. Solo avanzas aprobando hitos con evidencia.</p><p>Ritmo: sesiones de 13 minutos, 8 de misión y 5 de lección. Ritmo intensivo 21 semanas; estándar 40.</p>` : `<p>Llegas a 100 con el hito E7-M6: 90 días de ventas con utilidad y un miembro nuevo acompañado hasta su primera venta. Master es sistema, criterio y capacidad de enseñar.</p>`; }
    else if (n.type === 'stage') { const s = n.data; const done = s.milestones.filter(m => msState(m.id) === 'approved').length;
      h = head(`Etapa ${s.key} · ${s.score[0]} → ${s.score[1]} puntos`, s.name) + `<p>${esc(s.goal)}</p><div><span class="chip">${s.weeks} semana${s.weeks > 1 ? 's' : ''}</span><span class="chip">${s.lesson_count} lecciones</span><span class="chip">${s.hours_video} h video</span><span class="chip">talla ${s.size}</span><span class="state ${n.status}">${{ complete: 'completa', available: 'disponible', locked: 'bloqueada' }[n.status]}</span></div>`;
      h += `<h4>Hitos (${done}/${s.milestones.length})</h4><ul>` + s.milestones.map(m => `<li><a href="#" data-go="M_${m.id}"><b>${m.id}</b> ${esc(m.title)}</a> <span class="state ${msStatus(s, m)}">${labelMs(msStatus(s, m))}</span></li>`).join('') + '</ul>';
      h += `<h4>Materiales de la Academia</h4><ul>` + s.courses.map(c => `<li><a href="${c.url}" target="_blank" rel="noopener">${esc(c.title)}</a><br><small>${esc(c.scope)} · ${c.lesson_count} lecciones · ${c.hours} h</small></li>`).join('') + '</ul>';
      h += `<h4>Videos</h4><ul>` + s.videos.map(v => `<li>${v.transcript ? '✓ ' : ''}<a href="${v.url}" target="_blank" rel="noopener">${esc(v.title)}</a></li>`).join('') + '</ul>';
      h += `<div class="actions"><button class="btn primary" data-toggle="${id}">${n.expanded ? 'Colapsar neurona' : 'Expandir neurona'}</button><button class="btn" data-go="C_${s.key}_steps">Ver paso a paso</button></div>`; }
    else if (n.type === 'ms') { const m = n.data, s = n.stage, st = n.status, rec = state.ms[m.id] || {};
      h = head(`Hito ${m.id} · etapa ${s.key}`, m.title) + `<div><span class="chip">talla ${m.size}</span><span class="chip">${m.size * XP_POR_TALLA} XP</span><span class="state ${st}">${labelMs(st)}</span>${n.active ? '<span class="chip" style="background:#FFF3D6;border-color:#FFD98A">🎯 misión activa</span>' : ''}</div><h4>Entregable (evidencia)</h4><p>${esc(m.deliverable)}</p>`;
      if (rec.note) h += `<h4>Evidencia entregada</h4><p>${esc(rec.note)}<br><small>${rec.submittedAt || ''}</small></p>`;
      if (st === 'locked') h += `<div class="note">Bloqueado: primero completa los hitos de la etapa anterior.</div>`;
      else if (state.mode === 'member') { if (st === 'available') h += `<h4>Entregar evidencia</h4><textarea id="evNote" placeholder="Link, captura o descripción breve de tu entregable"></textarea><div class="actions"><button class="btn gold" data-submit="${m.id}">📤 Entregar evidencia (+${XP_ENTREGA} XP)</button></div>`; else if (st === 'submitted') h += `<div class="note">Evidencia entregada. Team la revisará y aprobará el hito. Mientras tanto puedes avanzar con el paso a paso.</div>`; else h += `<div class="note">Hito aprobado. ¡Sigue con la misión activa!</div>`; }
      else { if (st === 'submitted' || st === 'available') h += `<div class="actions"><button class="btn green" data-approve="${m.id}">✅ Aprobar (+${m.size * XP_POR_TALLA} XP)</button>${st === 'submitted' ? `<button class="btn danger" data-return="${m.id}">↩ Devolver</button>` : ''}</div>`; else h += `<div class="actions"><button class="btn danger" data-return="${m.id}">Reabrir hito</button></div>`; } }
    else if (n.type === 'gate') { const g = n.data, prevStage = stages[stageIdx(n.stageKey) - 1];
      h = head(`Ruta crítica ${g.id}`, g.name) + `<p><b>Compuerta:</b> ${esc(g.gate)}</p><div><span class="state ${n.status}">${n.status === 'open' ? 'abierta' : 'bloqueada'}</span></div><h4>Se abre al completar ${prevStage.key} · ${esc(prevStage.name)}</h4><ul>` + prevStage.milestones.map(m => `<li>${msState(m.id) === 'approved' ? '✅' : '⬜'} <a href="#" data-go="M_${m.id}">${m.id} ${esc(m.title)}</a></li>`).join('') + `</ul><div class="note">Las compuertas las verifica Team con la evidencia. Saltarlas es la causa más común de fracaso: invertir en ads sin tienda lista o escalar sin conocer el margen.</div>`; }
    else if (n.type === 'cluster') { const s = n.data;
      if (n.which === 'steps') { const steps = RUTA_STEPS[s.key] || []; h = head(`Paso a paso · ${s.key}`, s.name) + '<ol style="padding-left:20px;font-size:13px;line-height:1.5">' + steps.map((t, i) => { const sid = `P_${s.key}_${i}`; return `<li style="margin-bottom:8px">${state.steps[sid] ? '<b style="color:#1f6d12">✓</b> ' : ''}${esc(t)} <button class="btn small" data-step="${sid}">${state.steps[sid] ? 'deshacer' : 'hecho'}</button></li>`; }).join('') + '</ol>' + `<div class="actions"><button class="btn primary" data-toggle="${id}">${n.expanded ? 'Colapsar pasos' : 'Expandir pasos en el mapa'}</button></div>`; }
      else { h = head(`Materiales · ${s.key}`, s.name) + `<h4>Cursos (${s.lesson_count} lecciones · ${s.hours_video} h)</h4><ul>` + s.courses.map(c => `<li><a href="${c.url}" target="_blank" rel="noopener">${esc(c.title)}</a><br><small>${esc(c.scope)}</small></li>`).join('') + `</ul><h4>Videos de YouTube</h4><ul>` + s.videos.map(v => `<li>${v.transcript ? '✓ ' : ''}<a href="${v.url}" target="_blank" rel="noopener">${esc(v.title)}</a></li>`).join('') + '</ul><p><small>✓ = con transcripción disponible para los agentes.</small></p>'; } }
    else if (n.type === 'step') { const sid = n.id; h = head(`Paso ${n.label} · ${n.stage.key}`, trunc(n.data, 60)) + `<p>${esc(n.data)}</p><div class="actions"><button class="btn ${state.steps[sid] ? '' : 'green'}" data-step="${sid}">${state.steps[sid] ? 'Deshacer' : `✓ Marcar hecho (+${XP_PASO} XP)`}</button></div>`; }
    body.innerHTML = h; panel.classList.add('open'); document.body.classList.add('panel-open');
    body.querySelector('#pClose').onclick = () => { selected = null; closePanel(); render(); };
    body.querySelectorAll('[data-go]').forEach(a => a.onclick = ev => { ev.preventDefault(); goTo(a.dataset.go); });
    body.querySelectorAll('[data-toggle]').forEach(b => b.onclick = () => { toggleExpand(b.dataset.toggle); render(); openPanel(b.dataset.toggle); });
    body.querySelectorAll('[data-submit]').forEach(b => b.onclick = () => submit(b.dataset.submit, (body.querySelector('#evNote') || {}).value || ''));
    body.querySelectorAll('[data-approve]').forEach(b => b.onclick = () => approve(b.dataset.approve));
    body.querySelectorAll('[data-return]').forEach(b => b.onclick = () => returnMs(b.dataset.return));
    body.querySelectorAll('[data-step]').forEach(b => b.onclick = () => toggleStep(b.dataset.step, id));
  }
  const labelMs = st => ({ locked: 'bloqueado', available: 'disponible', submitted: 'evidencia entregada', approved: 'aprobado' }[st]);

  /* ---------- acciones ---------- */
  function submit(id, note) { state.ms[id] = { status: 'submitted', note, submittedAt: today() }; state.xp += XP_ENTREGA; touchStreak(); logEv('entrega', id); save(); toast('📤 Evidencia entregada · +' + XP_ENTREGA + ' XP'); render(); openPanel('M_' + id); }
  function approve(id) { const m = findMs(id); const before = badgesOn(), sBefore = score(); state.ms[id] = Object.assign({}, state.ms[id], { status: 'approved', approvedAt: today() }); state.xp += m.size * XP_POR_TALLA; touchStreak(); logEv('aprobado', id); save(); confetti(); toast(`✅ ${id} aprobado · +${m.size * XP_POR_TALLA} XP · ${sBefore} → ${score()} puntos`); render(); const after = badgesOn(); after.filter(b => !before.includes(b)).forEach(b => setTimeout(() => toast('🏅 Insignia: ' + BADGES.find(x => x[0] === b)[2]), 900)); 
    // expandir automáticamente la siguiente etapa disponible
    const am = activeMission(); if (am && !state.expanded.includes('S_' + am.s.key)) { state.expanded.push('S_' + am.s.key); save(); render(); } openPanel('M_' + id); }
  function returnMs(id) { state.ms[id] = { status: 'pending' }; logEv('devuelto', id); save(); toast('↩ Hito devuelto'); render(); openPanel('M_' + id); }
  function toggleStep(sid, panelId) { if (state.steps[sid]) delete state.steps[sid]; else { state.steps[sid] = today(); state.xp += XP_PASO; touchStreak(); } save(); render(); openPanel(panelId); }
  function findMs(id) { for (const s of stages) for (const m of s.milestones) if (m.id === id) return m; }
  function logEv(t, id) { state.log.push({ t, id, at: new Date().toISOString(), mode: state.mode }); if (state.log.length > 500) state.log.shift(); }
  function badgesOn() { return BADGES.filter(b => b[3]()).map(b => b[0]); }

  /* ---------- HUD ---------- */
  function renderHud() {
    const sc = score(), C = 2 * Math.PI * 33; document.getElementById('scoreRing').setAttribute('stroke-dasharray', `${C * sc / 100} ${C}`); document.getElementById('scoreTxt').textContent = sc; document.getElementById('scoreBig').innerHTML = sc + '<span style="font-size:14px">/100</span>';
    document.getElementById('kXp').textContent = state.xp; document.getElementById('kLvl').textContent = level(); document.getElementById('kStreak').textContent = state.streak.count;
    const am = activeMission(); document.getElementById('missionBox').innerHTML = '<b>Misión activa</b>' + (am ? `<span><b style="display:inline;color:#062F55;text-transform:none;letter-spacing:0;font-size:12px">${am.m.id}</b> ${esc(am.m.title)}<br><small>${esc(am.s.name)} · talla ${am.m.size}</small></span>` : '<span>🎉 Ruta completa. Eres master.</span>');
    const on = badgesOn(); document.getElementById('badges').innerHTML = BADGES.map(b => `<div class="bdg ${on.includes(b[0]) ? 'on' : ''}" title="${b[2]}">${b[1]}</div>`).join('');
    document.getElementById('abFill').style.width = sc + '%';
    document.getElementById('abLeft').textContent = am ? `Etapa ${am.s.key}` : 'Master'; 
  }

  /* ---------- cámara ---------- */
  const stageEl = document.getElementById('stage'); let vb = { x: 0, y: 0, w: W, h: H };
  function applyVB() { svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }
  function fit() { const r = stageEl.getBoundingClientRect(), ar = r.width / r.height; vb = ar > W / H ? { w: H * ar, h: H, x: (W - H * ar) / 2, y: 0 } : { w: W, h: W / ar, x: 0, y: (H - W / ar) / 2 }; vb.x -= 60; vb.y -= 60; vb.w += 120; vb.h += 120; applyVB(); }
  function centerOn(x, y, scale) { const r = stageEl.getBoundingClientRect(); const w = (scale ? W / scale : vb.w), h = w * r.height / r.width; animateVB({ x: x - w / 2, y: y - h / 2, w, h }); }
  function animateVB(to) { const from = Object.assign({}, vb), t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - k, 3); vb = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e }; applyVB(); if (k < 1) requestAnimationFrame(f); })(t0); }
  let drag = null;
  stageEl.addEventListener('pointerdown', e => { if (e.target.closest('.node')) return; drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y }; stageEl.classList.add('dragging'); stageEl.setPointerCapture(e.pointerId); });
  stageEl.addEventListener('pointermove', e => { if (!drag) return; const r = stageEl.getBoundingClientRect(); vb.x = drag.vx - (e.clientX - drag.x) * vb.w / r.width; vb.y = drag.vy - (e.clientY - drag.y) * vb.h / r.height; applyVB(); });
  stageEl.addEventListener('pointerup', () => { drag = null; stageEl.classList.remove('dragging'); });
  stageEl.addEventListener('wheel', e => { e.preventDefault(); const r = stageEl.getBoundingClientRect(); const k = e.deltaY > 0 ? 1.12 : 0.89; const mx = vb.x + (e.clientX - r.left) / r.width * vb.w, my = vb.y + (e.clientY - r.top) / r.height * vb.h; const nw = Math.min(W * 1.6, Math.max(400, vb.w * k)); const nh = nw * r.height / r.width; vb = { x: mx - (mx - vb.x) * nw / vb.w, y: my - (my - vb.y) * nh / vb.h, w: nw, h: nh }; applyVB(); }, { passive: false });
  // pinch
  let pinch = null; stageEl.addEventListener('touchstart', e => { if (e.touches.length === 2) pinch = { d: dist(e.touches), w: vb.w }; }, { passive: true }); stageEl.addEventListener('touchmove', e => { if (pinch && e.touches.length === 2) { const r = stageEl.getBoundingClientRect(); const k = pinch.d / dist(e.touches); const nw = Math.min(W * 1.6, Math.max(400, pinch.w * k)), nh = nw * r.height / r.width; vb = { x: vb.x + (vb.w - nw) / 2, y: vb.y + (vb.h - nh) / 2, w: nw, h: nh }; applyVB(); } }, { passive: true }); stageEl.addEventListener('touchend', () => { pinch = null; });
  const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  window.addEventListener('resize', () => { const r = stageEl.getBoundingClientRect(); vb.h = vb.w * r.height / r.width; applyVB(); });

  function goTo(id) { // expandir lo necesario y centrar
    if (id.startsWith('M_') || id.startsWith('C_')) { const key = id.split('_')[1].replace(/-M\d+$/, ''); const sk = id.startsWith('M_') ? id.slice(2).split('-')[0] : key; const sid = 'S_' + sk; if (!state.expanded.includes(sid)) state.expanded.push(sid); if (id.startsWith('C_') && id.endsWith('_steps') && !state.expanded.includes(id)) state.expanded.push(id); save(); }
    selected = id; render(); const n = nodes[id]; if (n) { centerOn(n.x, n.y, 2.2); openPanel(id); }
  }

  /* ---------- controles ---------- */
  document.getElementById('btnMission').onclick = () => { const am = activeMission(); if (!am) { toast('🎉 No hay misiones pendientes'); return; } goTo('M_' + am.m.id); };
  document.getElementById('btnFit').onclick = () => { fit(); };
  document.getElementById('btnCollapse').onclick = () => { state.expanded = []; save(); selected = null; closePanel(); render(); fit(); };
  document.getElementById('btnReset').onclick = () => { if (confirm('¿Reiniciar todo el progreso de este navegador? Esta acción no se puede deshacer.')) { state = defaults(); save(); selected = null; closePanel(); render(); fit(); toast('Progreso reiniciado'); } };
  document.querySelectorAll('#modeSeg button').forEach(b => b.onclick = () => { state.mode = b.dataset.mode; save(); document.querySelectorAll('#modeSeg button').forEach(x => x.classList.toggle('on', x === b)); toast(state.mode === 'team' ? '👥 Modo Team: puedes aprobar hitos' : '🙋 Modo Miembro: entrega evidencia'); if (selected) openPanel(selected); });
  document.querySelector(`#modeSeg button[data-mode="${state.mode}"]`).classList.add('on'); if (state.mode !== 'member') document.querySelector('#modeSeg button[data-mode="member"]').classList.remove('on');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { selected = null; closePanel(); render(); } });

  /* ---------- efectos ---------- */
  let toastT; function toast(t) { const el = document.getElementById('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }
  function confetti() { const c = document.getElementById('confetti'), ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const P = []; const cols = ['#FDB12B', '#63ABE6', '#45B114', '#062F55', '#fff']; for (let i = 0; i < 140; i++) P.push({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 16, vy: -Math.random() * 14 - 4, s: 5 + Math.random() * 6, c: cols[i % cols.length], r: Math.random() * 6 }); const t0 = performance.now(); (function f(t) { ctx.clearRect(0, 0, c.width, c.height); P.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); }); if (t - t0 < 1800) requestAnimationFrame(f); else ctx.clearRect(0, 0, c.width, c.height); })(t0); }

  /* ---------- arranque ---------- */
  render(); fit();
  // Enlace directo: ruta-neural.html#M_E1-M1 · #S_E3 · #G_RC1 · #C_E2_steps
  const deep = decodeURIComponent(location.hash.slice(1));
  if (deep && (nodes[deep] || deep.startsWith('M_') || deep.startsWith('C_'))) setTimeout(() => goTo(deep), 350);
  else { const am = activeMission(); if (am) setTimeout(() => { const n = nodes['M_' + am.m.id] || nodes['S_' + am.s.key]; if (n) centerOn(n.x, n.y, 1.6); }, 400); }
  window.addEventListener('hashchange', () => { const h = decodeURIComponent(location.hash.slice(1)); if (h) goTo(h); });
})();
