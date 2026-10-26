// Integritas data kasus: semua rujukan valid dan kasus memenuhi aturan desain (2–3 jalur per kesimpulan).
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCase } = require('./helpers');

const C = loadCase();
const ids = new Set(Object.keys(C.defs));
const known = id => assert.ok(ids.has(id), `id tidak dikenal: "${id}"`);

test('barang awal, kombinasi, dan reaksi tokoh merujuk id yang ada', () => {
  C.start.items.forEach(known);
  for (const c of C.combos) { known(c.a); known(c.b); }
  for (const ch of Object.values(C.chars)) Object.keys(ch.react).forEach(known);
});

test('setiap barang dengan dokumen punya isi dokumen', () => {
  for (const [id, d] of Object.entries(C.defs)) {
    if (d.doc) assert.ok(C.docs[d.doc], `${id} merujuk dokumen "${d.doc}" yang tidak ada`);
  }
});

test('layar, induk layar, dan lokasi peta saling cocok', () => {
  for (const [id, s] of Object.entries(C.scenes)) {
    if (s.parent) assert.ok(C.scenes[s.parent], `induk "${s.parent}" dari layar ${id} tidak ada`);
    assert.ok(C.locations[s.loc], `lokasi "${s.loc}" dari layar ${id} tidak ada`);
    for (const h of s.hotspots) {
      const [x, y, w, hh] = h.r;
      assert.ok(x >= 0 && y >= 0 && w > 0 && hh > 0 && x + w <= 1280 + 1 && y + hh <= 720 + 1, `hotspot di luar layar ${id}: ${h.r}`);
    }
  }
  for (const [id, L] of Object.entries(C.locations)) assert.ok(C.scenes[L.scene], `layar lokasi ${id} tidak ada`);
});

test('resep deduksi merujuk kartu yang ada dan tidak ada resep kembar', () => {
  const seen = new Map();
  for (const [id, d] of Object.entries(C.defs)) {
    if (d.type !== 'ded') continue;
    for (const r of d.recipes) {
      r.forEach(known);
      assert.ok(r.length >= 2 && r.length <= 3, `${id}: resep harus 2–3 kartu`);
      assert.ok(!r.some(x => C.defs[x].tool), `${id}: perlengkapan tidak boleh jadi kartu`);
      const key = [...r].sort().join('|');
      assert.ok(!seen.has(key), `resep ${key} dipakai oleh ${seen.get(key)} dan ${id}`);
      seen.set(key, id);
    }
  }
});

test('setiap kesimpulan antara punya minimal 2 jalur petunjuk', () => {
  for (const [id, d] of Object.entries(C.defs)) {
    if (d.type === 'ded' && !d.final) assert.ok(d.recipes.length >= 2, `${id} hanya punya ${d.recipes.length} jalur`);
  }
});

test('setiap jawaban rekonstruksi tersedia di bank kata, tanpa kata ganda', () => {
  const words = C.words.map(w => w.w);
  assert.equal(new Set(words).size, words.length, 'ada kata ganda di bank kata');
  const blanks = C.recon.filter(p => typeof p !== 'string');
  assert.equal(new Set(blanks.map(b => b.b)).size, blanks.length, 'nama rumpang ganda');
  for (const b of blanks) assert.ok(words.includes(b.a), `jawaban "${b.a}" untuk ${b.b} tidak ada di bank kata`);
});

test('id hint unik dan hint terakhir selalu tersedia', () => {
  const hid = C.hints.map(h => h.id);
  assert.equal(new Set(hid).size, hid.length);
  assert.equal(C.hints.at(-1).done(), false);
});
