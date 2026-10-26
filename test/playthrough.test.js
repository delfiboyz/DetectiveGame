// Memainkan Kasus #1 dari layar judul sampai epilog, memakai antarmuka game yang sebenarnya.
const test = require('node:test');
const assert = require('node:assert/strict');
const { Game, ANSWERS, playToSolution } = require('./helpers');

test('kasus bisa diselesaikan dari awal sampai "Kasus Ditutup"', async t => {
  const g = new Game();
  t.after(() => g.close());
  g.newGame('normal');
  assert.equal(g.loc(), 'Toko Jam Waktoe Emas');

  const final = playToSolution(g);
  assert.match(final, /Kesimpulan baru — Pencurian palsu/);

  const s = await g.saved();
  assert.deepEqual(s.unlocked.sort(), ['bengkel', 'rumah_lim', 'toko']);
  for (const d of ['d_dari_bengkel', 'd_butuh_uang', 'd_asuransi', 'd_final']) assert.ok(s.deds.includes(d), d);

  const words = g.reconWords();
  for (const w of Object.values(ANSWERS)) assert.ok(words.includes(w), `kata "${w}" belum tersedia`);

  // Laporan dengan satu kesalahan ditolak tanpa menyebut bagian yang salah.
  const rejected = g.recon({ ...ANSWERS, pelaku: 'Slamet' });
  assert.match(rejected, /belum meyakinkan/);
  assert.doesNotMatch(rejected, /pelaku|Slamet/);

  assert.equal(g.recon(ANSWERS), 'Kasus Ditutup');
  const end = await g.saved();
  assert.equal(end.solved, true);
  assert.equal(end.wrong, 1);
  assert.match(g.$('#screen').textContent, /K\./); // benang merah ke kasus berikutnya
});

test('rekonstruksi tidak bisa dikirim dengan bagian kosong', t => {
  const g = new Game();
  t.after(() => g.close());
  g.newGame();
  const msg = g.recon({ pelaku: 'Tuan Darmawan' });
  assert.match(msg, /Isi semua bagian/);
});

test('kata jawaban muncul hanya setelah petunjuknya ditemukan', t => {
  const g = new Game();
  t.after(() => g.close());
  g.newGame();
  const words = g.reconWords();
  assert.ok(words.includes('Tuan Darmawan'));
  for (const w of ['21.30', 'kayu jati', 'uang asuransi', '28 Oktober', 'bengkel di Gang Kenari']) {
    assert.ok(!words.includes(w), `"${w}" seharusnya belum tersedia di awal`);
  }
});
