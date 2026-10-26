// Mesin game: state, layar investigasi, inventaris, dialog dengan bukti, papan deduksi,
// peta, jurnal, hint, rekonstruksi, dan simpan otomatis.
(() => {
  const SAVE_KEY = 'detektif-batavia-v1';
  const $ = (q, root = document) => root.querySelector(q);
  const def = id => CASE.defs[id];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let S = null;          // state yang disimpan
  let D = null;          // dialog yang sedang terbuka
  let narr = [];         // antrean narasi
  let combineFrom = null;
  let invTab = 'barang';
  let boardSel = [];
  let panel = null;      // panel yang sedang terbuka: 'board' | 'journal' | 'map' | 'recon'
  let playing = false;

  // ---------- Simpan ----------
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch { return null; } },
    save() { try { if (S) localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch { /* penyimpanan tidak tersedia */ } },
  };
  let saveTimer = 0;
  const save = () => { clearTimeout(saveTimer); saveTimer = setTimeout(store.save, 150); };

  function newState(mode) {
    return {
      v: 1, mode, scene: CASE.start.scene, items: [...CASE.start.items], cards: [], deds: [], journal: [],
      flags: {}, unlocked: ['toko'], hintsLeft: mode === 'mudah' ? 6 : 3, revealsLeft: mode === 'mudah' ? -1 : 3,
      hintLevel: {}, hintsUsed: 0, wrong: 0, closed: {}, patience: {}, seen: {}, tips: {}, played: 0, solved: false,
    };
  }

  const curScene = () => CASE.scenes[S.scene];
  const locName = () => CASE.locations[curScene().loc].name;

  // ---------- API untuk data kasus ----------
  const A = {
    has: id => S.items.includes(id) || S.cards.includes(id) || S.deds.includes(id),
    flag(k, v) { if (v === undefined) return S.flags[k]; S.flags[k] = v; save(); },
    isUnlocked: loc => S.unlocked.includes(loc),
    say: (...lines) => narrate(lines),
    give(id) {
      if (S.items.includes(id)) return false;
      S.items.push(id);
      journal('barang', `${def(id).name}, ditemukan di ${locName()}.`);
      toast(`Barang baru: ${def(id).name}`);
      renderInv(); save();
      if (!def(id).tool) tip('item', 'Barang masuk ke inventaris di bawah. Klik barang untuk memeriksa, membaca, atau menggabungkannya dengan barang lain. Seret barang ke kotak dialog untuk menunjukkannya kepada seseorang.');
      return true;
    },
    take(id) { S.items = S.items.filter(x => x !== id); renderInv(); save(); },
    note(id) {
      if (S.cards.includes(id)) return false;
      const d = def(id);
      S.cards.push(id);
      journal(d.type === 'testi' ? 'kesaksian' : 'fakta', d.desc);
      toast(d.type === 'testi' ? `Kesaksian dicatat: ${d.name}` : `Fakta dicatat: ${d.name}`);
      renderInv(); save();
      tip('note', 'Fakta dan kesaksian tersimpan di tab "Catatan" dan di Jurnal. Catatan juga bisa diseret ke kotak dialog. Hubungkan petunjuk di Papan Deduksi untuk menarik kesimpulan.');
      return true;
    },
    unlock(loc) {
      if (S.unlocked.includes(loc)) return false;
      S.unlocked.push(loc);
      const L = CASE.locations[loc];
      journal('lokasi', `${L.name} (${L.area}) kini ada di peta.`);
      toast(`Lokasi baru di peta: ${L.name}`);
      save();
      tip('map', 'Lokasi baru muncul di Peta setelah kamu menemukan alamat atau petunjuk arah. Buka Peta di bagian atas untuk berpindah tempat.');
      return true;
    },
    goto: id => goScene(id),
    doc: id => openDoc(id),
    talk: c => openDialog(c),
    log: t => journal('catatan', t),
  };

  function journal(kind, text) {
    S.journal.push({ k: kind, t: text, at: locName() });
  }

  // ---------- Notifikasi ----------
  function toast(msg) {
    const box = $('#toasts');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  }

  function tip(key, text) {
    if (S.tips[key]) return;
    S.tips[key] = 1; save();
    const el = $('#tip');
    el.innerHTML = `<b>Panduan</b><p>${esc(text)}</p><button class="btn small">Mengerti</button>`;
    el.hidden = false;
    $('button', el).onclick = () => (el.hidden = true);
  }

  // ---------- Narasi ----------
  function narrate(lines) {
    narr = narr.concat(lines);
    showNarr();
  }
  function showNarr() {
    const el = $('#narration');
    if (!narr.length) { el.hidden = true; return; }
    $('p', el).textContent = narr[0];
    $('.more', el).textContent = narr.length > 1 ? '▸' : '×';
    el.hidden = false;
  }
  function advanceNarr() { narr.shift(); showNarr(); }
  function hideNarr() { narr = []; showNarr(); }

  // ---------- Layar ----------
  function renderScene() {
    const sc = curScene(), sceneId = S.scene;
    $('#scene-art').innerHTML = sc.art(S);
    const hs = $('#hotspots');
    hs.innerHTML = '';
    sc.hotspots.forEach(h => {
      if (h.when && !h.when(A)) return;
      const d = document.createElement('div');
      d.className = 'hs';
      Object.assign(d.style, { left: h.r[0] + 'px', top: h.r[1] + 'px', width: h.r[2] + 'px', height: h.r[3] + 'px' });
      if (h.char) d.dataset.char = h.char;
      d.addEventListener('click', e => {
        e.stopPropagation();
        if (combineFrom) cancelCombine();
        hideNarr();
        h.on(A);
        if (S.scene === sceneId) renderScene();
      });
      hs.appendChild(d);
    });
    const L = CASE.locations[sc.loc];
    $('#loc-title').textContent = sc.title;
    $('#loc-area').textContent = sc.parent ? `${L.name} · ${L.area}` : L.area;
    $('#btn-back').hidden = !sc.parent;
    renderTop();
  }

  function goScene(id) {
    const sc = CASE.scenes[id];
    const from = S.scene && curScene().loc;
    if (from !== sc.loc) onLocationChange(sc.loc);
    S.scene = id;
    hideNarr();
    const art = $('#scene-art');
    art.classList.remove('fade'); void art.offsetWidth; art.classList.add('fade');
    renderScene();
    save();
  }

  function onLocationChange(to) {
    S.closed = {}; // saksi yang menolak bicara mau membahasnya lagi setelah kamu pergi
    if (to !== 'toko') S.flags.visitedOther = 1;
    // Darmawan merapikan toko selama detektif pergi: kunjungan berikutnya menunjukkan "sesudah"
    if (to === 'toko' && S.flags.visitedOther) S.flags.tokoAfter = 1;
  }

  function ripple(e) {
    const r = $('#scene').getBoundingClientRect();
    const s = r.width / 1280;
    const d = document.createElement('div');
    d.className = 'ripple';
    d.style.left = (e.clientX - r.left) / s + 'px';
    d.style.top = (e.clientY - r.top) / s + 'px';
    $('#hotspots').appendChild(d);
    setTimeout(() => d.remove(), 500);
  }

  function renderTop() {
    $('#hint-n').textContent = S.hintsLeft;
    $('#reveal-n').textContent = S.revealsLeft < 0 ? '∞' : S.revealsLeft;
    $('#b-reveal').disabled = S.revealsLeft === 0;
  }

  function reveal() {
    if (S.revealsLeft === 0) return;
    if (S.revealsLeft > 0) S.revealsLeft--;
    renderTop(); save();
    const hs = $('#hotspots');
    hs.classList.add('reveal');
    setTimeout(() => hs.classList.remove('reveal'), 2200);
  }

  // ---------- Inventaris ----------
  const iconOf = id => ART.ICONS[id] || (def(id).type === 'testi' ? ART.ICONS.note_kesaksian : ART.ICONS.note_fakta);

  function renderInv() {
    const box = $('#inv-items');
    const list = invTab === 'barang' ? S.items : S.cards;
    document.querySelectorAll('.inv-tabs button').forEach(b => {
      b.classList.toggle('on', b.dataset.tab === invTab);
      const n = b.dataset.tab === 'barang' ? S.items.length : S.cards.length;
      $('i', b).textContent = n;
    });
    box.innerHTML = list.length ? '' : `<div class="inv-empty">${invTab === 'barang' ? 'Belum ada barang.' : 'Belum ada catatan. Fakta dan kesaksian akan muncul di sini.'}</div>`;
    for (const id of list) {
      const d = document.createElement('div');
      d.className = 'inv-item' + (def(id).type === 'testi' ? ' testi' : def(id).type === 'fact' ? ' fact' : '');
      if (combineFrom === id) d.classList.add('sel');
      d.dataset.id = id;
      d.innerHTML = `<div class="ic">${iconOf(id)}</div><span>${esc(def(id).name)}</span>`;
      d.addEventListener('pointerdown', e => startDrag(e, id));
      box.appendChild(d);
    }
    $('#invbar').classList.toggle('combining', !!combineFrom);
    $('#inv-help').textContent = combineFrom ? `Pilih barang kedua untuk digabung dengan ${def(combineFrom).name}. (Esc untuk batal)` : '';
  }

  function startDrag(e, id) {
    if (e.button !== 0) return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    let ghost = null, hover = null;
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
        ghost = document.createElement('div');
        ghost.className = 'ghost';
        ghost.innerHTML = iconOf(id);
        document.body.appendChild(ghost);
        document.body.classList.add('dragging');
        closePop();
      }
      if (!ghost) return;
      ghost.style.left = ev.clientX + 'px';
      ghost.style.top = ev.clientY + 'px';
      const t = dropTarget(document.elementFromPoint(ev.clientX, ev.clientY), id);
      if (t !== hover) { hover?.classList.remove('drop-hover'); hover = t; hover?.classList.add('drop-hover'); }
    };
    const up = ev => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (!ghost) { itemClick(id); return; }
      ghost.remove();
      document.body.classList.remove('dragging');
      hover?.classList.remove('drop-hover');
      const t = dropTarget(document.elementFromPoint(ev.clientX, ev.clientY), id);
      if (t) handleDrop(id, t);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function dropTarget(el, id) {
    if (!el) return null;
    const dlg = el.closest('#dialog');
    if (dlg && D) return $('.dlg-box', dlg);
    const inv = el.closest('.inv-item');
    if (inv && inv.dataset.id !== id) return inv;
    const hs = el.closest('.hs[data-char]');
    if (hs && !D && !panel) return hs;
    return null;
  }

  function handleDrop(id, t) {
    if (t.classList.contains('dlg-box')) return dropOnDialog(id);
    if (t.classList.contains('inv-item')) return combine(id, t.dataset.id);
    if (t.dataset.char) { openDialog(t.dataset.char); dropOnDialog(id); }
  }

  function itemClick(id) {
    if (combineFrom) {
      const a = combineFrom;
      cancelCombine();
      if (a !== id) combine(a, id);
      return;
    }
    const d = def(id);
    const pop = $('#inv-pop');
    const isItem = d.type === 'item';
    pop.innerHTML = `<div class="pop-ic">${iconOf(id)}</div><div class="pop-body"><b>${esc(d.name)}</b>
      <span class="tag">${{ item: d.tool ? 'Perlengkapan' : 'Barang bukti', fact: 'Fakta', testi: 'Kesaksian' }[d.type]}</span><p>${esc(d.desc)}</p>
      <div class="pop-actions">${d.doc ? '<button class="btn small" data-a="read">Baca</button>' : ''}
      ${isItem ? '<button class="btn small" data-a="combine">Gabungkan…</button>' : ''}
      ${D ? '<button class="btn small" data-a="show">Tunjukkan</button>' : ''}
      <button class="btn small ghost-btn" data-a="close">Tutup</button></div></div>`;
    pop.hidden = false;
    pop.onclick = e => {
      const a = e.target.dataset.a;
      if (!a) return;
      closePop();
      if (a === 'read') openDoc(d.doc);
      if (a === 'combine') { combineFrom = id; renderInv(); }
      if (a === 'show') dropOnDialog(id);
    };
  }
  const closePop = () => ($('#inv-pop').hidden = true);
  function cancelCombine() { combineFrom = null; renderInv(); }

  function combine(a, b) {
    hideNarr();
    if (def(a).type !== 'item' || def(b).type !== 'item') {
      narrate(['Catatan tidak bisa digabung seperti barang. Hubungkan petunjuk di Papan Deduksi.']);
      return;
    }
    const c = CASE.combos.find(c => (c.a === a && c.b === b) || (c.a === b && c.b === a));
    if (c) c.fx(A); else narrate(['Kedua benda itu tidak ada hubungannya satu sama lain.']);
    renderInv(); save();
  }

  // ---------- Dialog ----------
  function openDialog(cid) {
    hideNarr();
    D = { c: cid, topic: null, lines: null, i: 0, temp: null, ti: 0, note: null, closeAfter: false };
    const ch = CASE.chars[cid];
    $('#dlg-portrait').innerHTML = ART.portrait(cid);
    $('#dlg-name').textContent = ch.name;
    $('#dlg-role').textContent = ch.role;
    tip('talk', 'Pilih topik untuk bertanya. Selama tokoh berbicara, seret barang atau catatan ke kotak dialog untuk menunjukkan atau membantah ucapannya. Bukti yang tidak tepat membuat saksi defensif, dan ia bisa menolak membahas topik itu sampai kamu kembali lagi nanti.');
    renderDialog();
  }

  function closeDialog() { D = null; renderDialog(); }

  function chooseTopic(t) {
    S.seen[D.c + ':' + t.id] = 1;
    D.topic = t.id; D.lines = t.lines(A); D.i = 0; D.note = null;
    runFx(D.lines[0]);
    renderDialog(); save();
  }

  const runFx = l => l && l.fx && l.fx(A);

  function nextLine() {
    if (D.temp) {
      D.ti++;
      if (D.ti < D.temp.length) { runFx(D.temp[D.ti]); renderDialog(); return; }
      D.temp = null;
      if (D.closeAfter) { D.closeAfter = false; D.topic = null; D.lines = null; D.note = '(Ia memalingkan muka.)'; }
      renderDialog(); return;
    }
    D.i++;
    if (D.i >= D.lines.length) { D.topic = null; D.lines = null; D.note = null; }
    else runFx(D.lines[D.i]);
    renderDialog(); save();
  }

  function showTemp(lines) { D.temp = lines; D.ti = 0; runFx(lines[0]); renderDialog(); save(); }

  function dropOnDialog(id) {
    if (!D) return;
    const ch = CASE.chars[D.c];
    const line = !D.temp && D.lines ? D.lines[D.i] : null;
    if (line && line.contra) {
      const key = D.c + ':' + D.topic;
      if (line.contra.ok.includes(id)) {
        D.lines = line.contra.success; D.i = 0;
        runFx(D.lines[0]); renderDialog(); save();
        return;
      }
      S.patience[key] = (S.patience[key] ?? 2) - 1;
      if (S.patience[key] <= 0) {
        S.closed[key] = 1; S.patience[key] = 2;
        D.closeAfter = true;
        showTemp([{ t: ch.closeLine }]);
      } else {
        showTemp([{ t: ch.defensive[S.patience[key] % ch.defensive.length] }]);
      }
      return;
    }
    const r = ch.react[id];
    showTemp(r ? r : [{ t: ch.reactDefault }]);
  }

  function renderDialog() {
    const ov = $('#dialog');
    if (!D) { ov.hidden = true; return; }
    ov.hidden = false;
    const ch = CASE.chars[D.c];
    const text = $('#dlg-text'), acts = $('#dlg-actions');
    acts.innerHTML = '';
    const line = D.temp ? D.temp[D.ti] : D.lines ? D.lines[D.i] : null;
    if (line) {
      text.innerHTML = `<span class="who">${esc(line.me ? 'Kamu' : ch.name)}:</span> ${esc(line.t)}`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'Lanjut ▸';
      b.onclick = nextLine;
      acts.appendChild(b);
      return;
    }
    text.innerHTML = `<span class="muted">${esc(D.note || 'Apa yang ingin kamu tanyakan?')}</span>`;
    for (const t of ch.topics) {
      if (t.when && !t.when(A)) continue;
      const key = D.c + ':' + t.id;
      const b = document.createElement('button');
      b.className = 'topic' + (S.seen[key] ? ' seen' : '');
      b.textContent = t.label + (S.closed[key] ? '  — enggan membahasnya' : '');
      b.disabled = !!S.closed[key];
      b.onclick = () => chooseTopic(t);
      acts.appendChild(b);
    }
    const end = document.createElement('button');
    end.className = 'topic end';
    end.textContent = 'Selesai bicara';
    end.onclick = closeDialog;
    acts.appendChild(end);
  }

  // ---------- Dokumen ----------
  function openDoc(id) {
    const d = CASE.docs[id];
    const el = $('#doc');
    el.innerHTML = `<div class="paper"><h3>${esc(d.title)}</h3><div class="doc-body">${d.html}</div><button class="btn small">Tutup</button></div>`;
    el.hidden = false;
    $('button', el).onclick = () => (el.hidden = true);
    if (d.onOpen) d.onOpen(A);
    save();
  }

  // ---------- Panel: papan deduksi, jurnal, peta, rekonstruksi ----------
  function openPanel(kind) {
    if (panel === kind) return closePanel();
    panel = kind;
    closePop(); hideNarr();
    if (kind === 'board') boardSel = [];
    renderPanel();
    document.querySelectorAll('#topbar nav button').forEach(b => b.classList.toggle('on', b.dataset.panel === kind));
  }
  function closePanel() {
    panel = null;
    $('#panel').hidden = true;
    document.querySelectorAll('#topbar nav button').forEach(b => b.classList.remove('on'));
  }

  function renderPanel() {
    const el = $('#panel');
    el.hidden = false;
    ({ board: renderBoard, journal: renderJournal, map: renderMap, recon: renderRecon })[panel](el);
  }

  function card(id) {
    const d = def(id);
    const cls = { item: 'c-item', fact: 'c-fact', testi: 'c-testi', ded: d.final ? 'c-ded final' : 'c-ded' }[d.type];
    const n = boardSel.indexOf(id);
    return `<button class="card ${cls}${n >= 0 ? ' sel' : ''}" data-id="${id}">${n >= 0 ? `<i class="pin">${n + 1}</i>` : ''}<b>${esc(d.name)}</b><span>${esc(d.desc)}</span></button>`;
  }

  function renderBoard(el, msg = '') {
    const ev = S.items.filter(id => !def(id).tool);
    const facts = S.cards.filter(id => def(id).type === 'fact');
    const testi = S.cards.filter(id => def(id).type === 'testi');
    const sec = (title, ids, empty) => `<section><h4>${title}</h4><div class="cards">${ids.length ? ids.map(card).join('') : `<p class="muted">${empty}</p>`}</div></section>`;
    el.innerHTML = `<div class="panel-head"><h2>Papan Deduksi</h2><p>Pilih 2–3 kartu yang menurutmu saling berkaitan, lalu hubungkan. Papan tidak akan memberi tahu kartu mana yang hampir benar.</p><button class="btn small ghost-btn x">Tutup ✕</button></div>
      <div class="board">
        ${sec('Kesimpulan', S.deds, 'Belum ada kesimpulan.')}
        ${sec('Barang bukti', ev, 'Belum ada barang bukti.')}
        ${sec('Fakta', facts, 'Belum ada fakta.')}
        ${sec('Kesaksian', testi, 'Belum ada kesaksian.')}
      </div>
      <div class="board-foot"><div class="msg">${msg}</div>
        <button class="btn ghost-btn" data-a="clear" ${boardSel.length ? '' : 'disabled'}>Kosongkan</button>
        <button class="btn primary" data-a="link" ${boardSel.length >= 2 ? '' : 'disabled'}>Hubungkan (${boardSel.length}/3)</button></div>`;
    $('.x', el).onclick = closePanel;
    el.querySelectorAll('.card').forEach(c => (c.onclick = () => {
      const id = c.dataset.id;
      const i = boardSel.indexOf(id);
      if (i >= 0) boardSel.splice(i, 1);
      else if (boardSel.length < 3) boardSel.push(id);
      const sc = $('.board', el).scrollTop;
      renderBoard(el);
      $('.board', el).scrollTop = sc;
    }));
    $('[data-a="clear"]', el).onclick = () => { boardSel = []; renderBoard(el); };
    $('[data-a="link"]', el).onclick = () => linkCards(el);
  }

  function linkCards(el) {
    const key = [...boardSel].sort().join('|');
    const match = Object.entries(CASE.defs).find(([, d]) => d.type === 'ded' && d.recipes.some(r => [...r].sort().join('|') === key));
    const sc = $('.board', el).scrollTop;
    if (!match) { renderBoard(el, 'Petunjuk-petunjuk ini belum membentuk kesimpulan.'); $('.board', el).scrollTop = sc; return; }
    const [id, d] = match;
    if (S.deds.includes(id)) { renderBoard(el, `Kesimpulan "${esc(d.name)}" sudah ada di papan.`); return; }
    S.deds.push(id);
    boardSel = [];
    toast(`Kesimpulan baru: ${d.name}`);
    save();
    renderBoard(el, `<b>Kesimpulan baru — ${esc(d.name)}:</b> ${esc(d.desc)}${d.final ? ' Saatnya menutup kasus.' : ''}`);
  }

  function renderJournal(el) {
    const label = { barang: 'Barang', fakta: 'Fakta', kesaksian: 'Kesaksian', lokasi: 'Lokasi', catatan: 'Catatan' };
    el.innerHTML = `<div class="panel-head"><h2>Jurnal</h2><p>Dicatat otomatis: apa yang ditemukan, di mana, dan siapa berkata apa. Kesimpulan adalah tugasmu.</p><button class="btn small ghost-btn x">Tutup ✕</button></div>
      <div class="journal">${S.journal.length ? S.journal.map(j => `<div class="j j-${j.k}"><span class="jk">${label[j.k]}</span><span class="jt">${esc(j.t)}</span><span class="ja">${esc(j.at)}</span></div>`).join('') : '<p class="muted">Jurnal masih kosong.</p>'}</div>`;
    $('.x', el).onclick = closePanel;
    const j = $('.journal', el); j.scrollTop = j.scrollHeight;
  }

  function renderMap(el) {
    const here = curScene().loc;
    el.innerHTML = `<div class="map">${ART.peta()}${S.unlocked.map(id => {
      const L = CASE.locations[id];
      return `<button class="pin-btn${id === here ? ' here' : ''}" data-loc="${id}" style="left:${L.pin[0]}px;top:${L.pin[1]}px"><span class="dot"></span><b>${esc(L.name)}</b><small>${esc(L.area)}${id === here ? ' · kamu di sini' : ''}</small></button>`;
    }).join('')}<button class="btn small ghost-btn x map-x">Tutup ✕</button></div>`;
    $('.x', el).onclick = closePanel;
    el.querySelectorAll('.pin-btn').forEach(b => (b.onclick = () => {
      const L = CASE.locations[b.dataset.loc];
      closePanel(); closeDialog();
      goScene(L.scene);
    }));
  }

  function words() {
    return CASE.words.filter(w => !w.when || w.when(A)).map(w => w.w);
  }

  function renderRecon(el, msg = '') {
    const ws = words();
    const prev = {};
    el.querySelectorAll('select[data-b]').forEach(s => (prev[s.dataset.b] = s.value));
    el.innerHTML = `<div class="panel-head"><h2>Tutup Kasus — Rekonstruksi</h2><p>Lengkapi laporan untuk Komisaris dengan kata-kata yang sudah kamu temukan. Komisaris hanya menerima laporan yang seluruhnya benar dan tidak akan menunjukkan bagian mana yang keliru.</p><button class="btn small ghost-btn x">Tutup ✕</button></div>
      <div class="recon"><p class="recon-text">${CASE.recon.map(p => typeof p === 'string' ? esc(p) :
        `<select data-b="${p.b}"><option value="">— ${p.b} —</option>${ws.map(w => `<option${prev[p.b] === w ? ' selected' : ''}>${esc(w)}</option>`).join('')}</select>`).join('')}</p>
        <p class="muted">Kata yang tersedia: ${ws.length}. Kata baru muncul seiring petunjuk yang kamu temukan.</p></div>
      <div class="board-foot"><div class="msg">${msg}</div><button class="btn primary" data-a="send">Serahkan ke Komisaris</button></div>`;
    $('.x', el).onclick = closePanel;
    $('[data-a="send"]', el).onclick = () => {
      const picks = {};
      el.querySelectorAll('select[data-b]').forEach(s => (picks[s.dataset.b] = s.value));
      if (Object.values(picks).some(v => !v)) return renderRecon(el, 'Isi semua bagian yang kosong terlebih dahulu.');
      const ok = CASE.recon.filter(p => typeof p !== 'string').every(p => picks[p.b] === p.a);
      if (ok) { S.solved = true; save(); closePanel(); showEpilogue(); return; }
      S.wrong++; save();
      renderRecon(el, `Komisaris mengerutkan dahi: "Laporan ini belum meyakinkan, Tuan. Periksa lagi buktinya." (Percobaan ditolak: ${S.wrong})`);
    };
  }

  // ---------- Hint ----------
  function openHint() {
    const h = CASE.hints.find(h => !h.done(A));
    const lvl = S.hintLevel[h.id] || 0;
    const shown = h.tiers.slice(0, lvl);
    const more = lvl < h.tiers.length;
    modal(`<h3>Petunjuk</h3>
      ${shown.length ? shown.map((t, i) => `<p class="hint-line"><span>${i + 1}</span>${esc(t)}</p>`).join('') : '<p class="muted">Petunjuk bertingkat: dari samar ke jelas. Gunakan hanya bila benar-benar buntu.</p>'}
      <p class="muted">Sisa hint untuk kasus ini: <b>${S.hintsLeft}</b></p>
      <div class="pop-actions">${more ? `<button class="btn" data-a="next" ${S.hintsLeft ? '' : 'disabled'}>${lvl ? 'Petunjuk lebih jelas' : 'Minta petunjuk'} (−1)</button>` : ''}<button class="btn ghost-btn" data-a="close">Tutup</button></div>`,
    a => {
      if (a !== 'next' || !S.hintsLeft) return true;
      S.hintsLeft--; S.hintsUsed++;
      S.hintLevel[h.id] = lvl + 1;
      save(); renderTop();
      openHint();
      return false;
    });
  }

  function modal(html, onAction) {
    const el = $('#modal');
    el.innerHTML = `<div class="paper modal-box">${html}</div>`;
    el.hidden = false;
    el.onclick = e => {
      const a = e.target.dataset.a;
      if (!a) return;
      if (a === 'close' || (onAction && onAction(a) !== false)) el.hidden = true;
    };
  }

  // ---------- Layar judul, intro, epilog ----------
  function screen(html) {
    const el = $('#screen');
    el.innerHTML = html;
    el.hidden = false;
    return el;
  }

  function showTitle() {
    playing = false;
    closePanel(); D = null; renderDialogSafe();
    const saved = store.load();
    const canContinue = saved && saved.v === 1 && !saved.solved;
    const el = screen(`<div class="title">
      <div class="title-clock">${titleClock()}</div>
      <h1>Detektif Batavia</h1><h2>${esc(CASE.title)}</h2>
      <p class="lead">Amati dengan teliti. Bantah dengan bukti. Simpulkan sendiri.</p>
      <div class="title-actions">
        ${canContinue ? '<button class="btn primary big" data-a="cont">Lanjutkan penyelidikan</button>' : ''}
        <button class="btn big" data-a="normal">Kasus baru: Normal</button>
        <button class="btn big ghost-btn" data-a="mudah">Kasus baru: Mudah</button>
      </div>
      <p class="modes"><b>Normal</b>: 3 hint, tombol Sorot 3 kali. <b>Mudah</b>: 6 hint, Sorot tanpa batas.</p>
      <p class="credit">Point-and-click 2D · ±15 menit · Mainkan dengan mouse</p></div>`);
    el.onclick = e => {
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (!a) return;
      if (a === 'cont') { S = saved; begin(); }
      else { S = newState(a); save(); showIntro(); }
    };
  }
  const renderDialogSafe = () => { if ($('#dialog')) renderDialog(); };

  function titleClock() {
    return `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#2a1a10" stroke="#c9a24a" stroke-width="6"/><circle cx="100" cy="100" r="80" fill="#efe6cc"/>
      ${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<line x1="${100 + Math.sin(a) * 66}" y1="${100 - Math.cos(a) * 66}" x2="${100 + Math.sin(a) * 76}" y2="${100 - Math.cos(a) * 76}" stroke="#3a2a1a" stroke-width="${i % 3 ? 2 : 5}"/>`; }).join('')}
      <line x1="100" y1="100" x2="100" y2="48" stroke="#2a1a10" stroke-width="5" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="60s" repeatCount="indefinite"/></line>
      <line x1="100" y1="100" x2="136" y2="100" stroke="#2a1a10" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#c9a24a"/>
      <path d="M86 128 q6 -14 14 -8 q-2 -8 6 -8 q-2 8 -8 10 q6 3 8 6 q-12 3 -20 0z" fill="#8a6a2a"/></svg>`;
  }

  function showIntro() {
    let i = 0;
    const el = screen(`<div class="intro"><p class="intro-text"></p><button class="btn primary">Lanjut ▸</button></div>`);
    const p = $('.intro-text', el), b = $('button', el);
    const step = () => {
      p.textContent = CASE.intro[i];
      p.classList.remove('fade'); void p.offsetWidth; p.classList.add('fade');
      b.textContent = i === CASE.intro.length - 1 ? 'Mulai penyelidikan' : 'Lanjut ▸';
    };
    el.onclick = e => {
      if (e.target !== b) return;
      i++;
      if (i >= CASE.intro.length) begin(); else step();
    };
    step();
  }

  function begin() {
    $('#screen').hidden = true;
    playing = true;
    D = null; narr = []; combineFrom = null; invTab = 'barang';
    renderDialog(); closePanel();
    renderScene(); renderInv();
    tip('start', 'Klik apa saja di layar yang menurutmu menarik. Tidak ada sorotan otomatis, dan tidak semua yang bisa diklik itu penting. Klik seseorang untuk mengajaknya bicara.');
  }

  function showEpilogue() {
    playing = false;
    D = null; renderDialog();
    const found = S.deds.length, total = Object.values(CASE.defs).filter(d => d.type === 'ded').length;
    const m = Math.floor(S.played / 60), s = S.played % 60;
    screen(`<div class="epilogue paper"><h1>Kasus Ditutup</h1>
      ${CASE.epilogue.map(p => `<p>${esc(p)}</p>`).join('')}
      <div class="stats"><div><b>${m}m ${String(s).padStart(2, '0')}d</b><span>waktu</span></div><div><b>${found}/${total}</b><span>kesimpulan</span></div><div><b>${S.hintsUsed}</b><span>hint dipakai</span></div><div><b>${S.wrong}</b><span>laporan ditolak</span></div></div>
      <p class="teaser">${esc(CASE.teaser)}</p><p class="next">Kasus #2 — segera hadir.</p>
      <button class="btn primary" data-a="title">Kembali ke judul</button></div>`).onclick = e => {
      if (e.target.dataset.a === 'title') showTitle();
    };
  }

  // ---------- Kerangka ----------
  function fit() {
    const s = Math.min(window.innerWidth / 1280, window.innerHeight / 860);
    $('#stage').style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  function wire() {
    $('#narration').onclick = advanceNarr;
    $('#scene-art').addEventListener('click', e => { hideNarr(); if (combineFrom) cancelCombine(); ripple(e); });
    $('#hotspots').addEventListener('click', e => { if (e.target.id === 'hotspots') { hideNarr(); ripple(e); } });
    $('#btn-back').onclick = () => goScene(curScene().parent);
    document.querySelectorAll('.inv-tabs button').forEach(b => (b.onclick = () => { invTab = b.dataset.tab; closePop(); cancelCombine(); }));
    $('#b-map').onclick = () => openPanel('map');
    $('#b-journal').onclick = () => openPanel('journal');
    $('#b-board').onclick = () => openPanel('board');
    $('#b-close').onclick = () => { tip('recon', 'Tutup kasus dengan melengkapi laporan rekonstruksi. Kamu boleh mencoba lagi bila ditolak, tetapi Komisaris tidak akan menunjukkan bagian yang salah.'); openPanel('recon'); };
    $('#b-hint').onclick = openHint;
    $('#b-reveal').onclick = reveal;
    $('#b-menu').onclick = () => modal(`<h3>Menu</h3><p>Permainan tersimpan otomatis di peramban ini.</p>
      <div class="pop-actions"><button class="btn" data-a="title">Ke layar judul</button><button class="btn ghost-btn" data-a="close">Kembali bermain</button></div>`,
      a => { if (a === 'title') { store.save(); showTitle(); } return true; });
    window.addEventListener('keydown', e => {
      if (!playing) return;
      if (e.key === 'Escape') {
        if (!$('#doc').hidden) $('#doc').hidden = true;
        else if (!$('#modal').hidden) $('#modal').hidden = true;
        else if (combineFrom) cancelCombine();
        else if (!$('#inv-pop').hidden) closePop();
        else if (panel) closePanel();
        else if (D && !D.lines && !D.temp) closeDialog();
        else if (!narr.length && curScene().parent) goScene(curScene().parent);
        else hideNarr();
      }
      if ((e.key === ' ' || e.key === 'Enter') && D && (D.lines || D.temp) && $('#doc').hidden) { e.preventDefault(); nextLine(); }
    });
    window.addEventListener('resize', fit);
    setInterval(() => {
      if (playing && !document.hidden) { S.played++; if (S.played % 10 === 0) save(); }
    }, 1000);
  }

  wire();
  fit();
  showTitle();
})();
