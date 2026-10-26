// Alat bantu tes: memuat game asli (index.html + js/) ke jsdom dan mengendalikannya seperti pemain.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SAVE_KEY = 'detektif-batavia-v1';

// Data kasus saja, tanpa DOM — untuk tes integritas data.
function loadCase() {
  const ctx = vm.createContext({});
  vm.runInContext(`${read('js/art.js')}\n${read('js/case1.js')}\n;globalThis.CASE = CASE;`, ctx);
  return ctx.CASE;
}

const wait = ms => new Promise(r => setTimeout(r, ms));

class Game {
  constructor({ storage } = {}) {
    // Skrip dan font eksternal dibuang; ketiga skrip dijalankan sebagai satu kesatuan
    // agar konstanta global (ART, CASE) terlihat oleh engine seperti di browser.
    const html = read('index.html').replace(/<script[^>]*><\/script>/g, '').replace(/<link[^>]*>/g, '');
    this.dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
    this.w = this.dom.window;
    this.d = this.w.document;
    if (storage) this.w.localStorage.setItem(SAVE_KEY, storage);
    this.w.eval(['js/art.js', 'js/case1.js', 'js/engine.js'].map(read).join('\n;\n') + '\n;window.__CASE = CASE;');
  }

  close() { this.w.close(); }
  $(q) { return this.d.querySelector(q); }
  $$(q) { return [...this.d.querySelectorAll(q)]; }

  // ---------- Layar judul ----------
  newGame(mode = 'normal') {
    this.$(`[data-a="${mode}"]`).click();
    while (!this.$('#screen').hidden) this.$('.intro button').click();
    return this;
  }
  continueGame() { this.$('[data-a="cont"]').click(); return this; }

  // ---------- Layar investigasi ----------
  loc() { return this.$('#loc-title').textContent; }
  hotspotAt(x, y) {
    const hit = this.$$('#hotspots .hs').filter(h => {
      const [l, t, w, hh] = ['left', 'top', 'width', 'height'].map(k => parseFloat(h.style[k]));
      return x >= l && x <= l + w && y >= t && y <= t + hh;
    });
    return hit.pop(); // hotspot terakhir berada paling atas
  }
  click(x, y) {
    const h = this.hotspotAt(x, y);
    if (!h) throw new Error(`Tidak ada hotspot di (${x}, ${y}) pada layar "${this.loc()}"`);
    h.click();
    return this.narr();
  }
  narr() { const n = this.$('#narration'); return n.hidden ? '' : n.querySelector('p').textContent; }
  back() { this.$('#btn-back').click(); return this; }
  goTo(loc) {
    this.$('#b-map').click();
    const pin = this.$(`.pin-btn[data-loc="${loc}"]`);
    if (!pin) throw new Error(`Lokasi "${loc}" belum terbuka di peta`);
    pin.click();
    return this;
  }
  pins() { this.$('#b-map').click(); const p = this.$$('.pin-btn').map(b => b.dataset.loc); this.$('#b-map').click(); return p; }

  // ---------- Inventaris ----------
  tab(t) { this.$(`.inv-tabs [data-tab="${t}"]`).click(); return this; }
  invIds() { return this.$$('.inv-item').map(i => i.dataset.id); }
  item(id) {
    let el = this.$(`.inv-item[data-id="${id}"]`);
    if (!el) { this.tab(this.tabOf(id)); el = this.$(`.inv-item[data-id="${id}"]`); }
    if (!el) throw new Error(`"${id}" tidak ada di inventaris`);
    const opt = { button: 0, bubbles: true, clientX: 0, clientY: 0 };
    el.dispatchEvent(new this.w.MouseEvent('pointerdown', opt));
    this.w.dispatchEvent(new this.w.MouseEvent('pointerup', opt));
    return this;
  }
  tabOf(id) { return this.w.__CASE.defs[id].type === 'item' ? 'barang' : 'catatan'; }
  pop(action) {
    const b = this.$(`#inv-pop [data-a="${action}"]`);
    if (!b || this.$('#inv-pop').hidden) throw new Error(`Aksi "${action}" tidak tersedia`);
    b.click();
    return this;
  }
  combine(a, b) { this.item(a).pop('combine').item(b); return this.narr(); }

  // ---------- Dialog ----------
  talk(x, y) { this.click(x, y); if (this.$('#dialog').hidden) throw new Error('Dialog tidak terbuka'); return this; }
  dlg() { return this.$('#dlg-text').textContent; }
  topics() { return this.$$('#dlg-actions .topic').map(b => b.textContent); }
  topic(label) {
    const b = this.$$('#dlg-actions .topic').find(b => b.textContent.startsWith(label));
    if (!b) throw new Error(`Topik "${label}" tidak ada. Tersedia: ${this.topics().join(' | ')}`);
    b.click();
    return this.dlg();
  }
  next() { this.$('#dlg-actions .btn').click(); return this.dlg(); }
  run() { const out = [this.dlg()]; while (this.$('#dlg-actions .btn')) out.push(this.next()); return out; }
  ask(label) { this.topic(label); return this.run(); }
  show(id) { this.item(id).pop('show'); return this.dlg(); }
  endTalk() { this.$$('#dlg-actions .topic').find(b => b.textContent === 'Selesai bicara').click(); return this; }

  // ---------- Dokumen & panel ----------
  docTitle() { const d = this.$('#doc'); return d.hidden ? null : d.querySelector('h3').textContent; }
  closeDoc() { const d = this.$('#doc'); if (!d.hidden) d.querySelector('button').click(); return this; }
  openBoard() { if (!this.$('.board')) this.$('#b-board').click(); return this; }
  link(...ids) {
    this.openBoard();
    const clear = this.$('[data-a="clear"]');
    if (!clear.disabled) clear.click();
    for (const id of ids) {
      const c = this.$(`.card[data-id="${id}"]`);
      if (!c) throw new Error(`Kartu "${id}" tidak ada di papan`);
      c.click();
    }
    this.$('[data-a="link"]').click();
    return this.$('.board-foot .msg').textContent;
  }
  recon(answers) {
    if (!this.$('.recon')) this.$('#b-close').click();
    for (const s of this.$$('.recon select')) s.value = answers[s.dataset.b] ?? '';
    this.$('[data-a="send"]').click();
    return this.$('#screen').hidden ? this.$('.board-foot .msg').textContent : this.$('#screen h1').textContent;
  }
  reconWords() { if (!this.$('.recon')) this.$('#b-close').click(); return [...this.$('.recon select').options].slice(1).map(o => o.value); }

  // ---------- State tersimpan ----------
  async saved() { await wait(250); return JSON.parse(this.w.localStorage.getItem(SAVE_KEY)); }
  rawSave() { return this.w.localStorage.getItem(SAVE_KEY); }
}

const ANSWERS = {
  waktu: '21.30', pelaku: 'Tuan Darmawan', alat: 'kunci etalase', tempat: 'bengkel di Gang Kenari',
  bukti: 'kayu jati', motif: 'terlilit utang', tujuan: 'uang asuransi', tanggal: '28 Oktober',
};

// Titik klik (koordinat layar 1280×720) untuk objek-objek yang dipakai tes.
const P = {
  debu: [530, 600], jejak: [680, 604], kunciToko: [720, 455], kalender: [528, 165], mejaKasir: [990, 500],
  slamet: [800, 400], darmawan: [960, 260], pengki: [400, 680],
  kal28: [700, 576], bukuServis: [330, 420], laciKasir: [640, 640], amplopBank: [540, 340],
  serbukBengkel: [560, 620], lampu: [640, 160], peti: [1080, 560], laciBengkel: [640, 418],
  polis: [370, 330], bukuKas: [740, 330], suratGagak: [1030, 330], lim: [640, 420],
};

// Jalur penyelesaian lengkap Kasus #1, seperti yang akan dilakukan pemain teliti.
function playToSolution(g) {
  g.click(...P.debu); g.click(...P.jejak); g.click(...P.kunciToko);
  g.combine('lup', 'sampel_debu');
  g.combine('bedak', 'kunci_etalase');

  g.talk(...P.slamet); g.show('serbuk_jati'); g.run(); g.ask('Di mana kamu semalam'); g.endTalk();
  g.talk(...P.darmawan); g.ask('Apa yang terjadi'); g.ask('Siapa yang tahu letak'); g.endTalk();

  g.click(...P.mejaKasir); g.click(...P.bukuServis); g.closeDoc();
  g.click(...P.laciKasir); g.click(...P.amplopBank); g.closeDoc(); g.back().back();
  g.talk(...P.darmawan); g.topic('Bagaimana keadaan usaha'); g.show('surat_bank'); g.run(); g.endTalk();
  g.click(...P.kalender); g.click(...P.kal28); g.back();

  g.goTo('bengkel');
  g.click(...P.serbukBengkel); g.click(...P.lampu); g.click(...P.peti);
  g.click(...P.laciBengkel);
  for (const p of [P.polis, P.bukuKas, P.suratGagak]) { g.click(...p); g.closeDoc(); }
  g.back();

  g.goTo('rumah_lim'); g.talk(...P.lim);
  for (const t of ['Perkenalan', 'Apa Nyonya lewat', 'Tentang Slamet', 'Tentang Tuan Darmawan']) g.ask(t);
  g.endTalk();

  g.goTo('toko');
  g.link('serbuk_jati', 't_slamet_bengkel');
  g.link('surat_bank', 't_owner_bangkrut');
  g.link('kalender_28', 'polis');
  return g.link('d_dari_bengkel', 'd_butuh_uang', 'd_asuransi');
}

module.exports = { Game, loadCase, wait, ANSWERS, P, playToSolution, SAVE_KEY };
