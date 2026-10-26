// Mekanik inti dari dokumen desain, diuji satu per satu lewat antarmuka game.
const test = require('node:test');
const assert = require('node:assert/strict');
const { Game, P } = require('./helpers');

function fresh(t, mode = 'normal') {
  const g = new Game();
  t.after(() => g.close());
  return g.newGame(mode);
}

test('hotspot tidak disorot, dan klik objek biasa tidak memberi barang', async t => {
  const g = fresh(t);
  assert.ok(g.$$('#hotspots .hs').length > 10);
  assert.ok(!g.$('#hotspots').classList.contains('reveal'));
  g.click(352 + 40, 100); // jam dinding: objek pengecoh
  const s = await g.saved();
  assert.deepEqual(s.items, ['lup', 'bedak']);
  assert.deepEqual(s.cards, []);
});

test('Sorot terbatas 3 kali di mode Normal, tanpa batas di mode Mudah', async t => {
  const g = fresh(t);
  for (let i = 0; i < 3; i++) g.$('#b-reveal').click();
  assert.equal(g.$('#reveal-n').textContent, '0');
  assert.equal(g.$('#b-reveal').disabled, true);

  const e = fresh(t, 'mudah');
  for (let i = 0; i < 5; i++) e.$('#b-reveal').click();
  assert.equal(e.$('#reveal-n').textContent, '∞');
});

test('inspeksi berlapis: meja kasir → laci → surat bank', t => {
  const g = fresh(t);
  g.click(...P.mejaKasir);
  assert.equal(g.loc(), 'Meja kasir');
  g.click(...P.laciKasir);
  assert.equal(g.loc(), 'Laci meja kasir');
  g.click(...P.amplopBank);
  assert.equal(g.docTitle(), 'Bank Kredit Pasar Baroe');
  g.closeDoc();
  assert.ok(g.invIds().includes('surat_bank'));
  assert.equal(g.hotspotAt(...P.amplopBank), undefined, 'amplop sudah diambil dari laci');
  g.back().back();
  assert.equal(g.loc(), 'Toko Jam Waktoe Emas');
});

test('kombinasi barang: hanya pasangan yang logis yang menghasilkan sesuatu', async t => {
  const g = fresh(t);
  g.click(...P.debu);
  assert.match(g.combine('bedak', 'sampel_debu'), /tidak ada hubungannya/);
  assert.match(g.combine('lup', 'sampel_debu'), /serbuk kayu/);
  const s = await g.saved();
  assert.ok(s.items.includes('serbuk_jati'));
  assert.ok(!s.items.includes('sampel_debu'));
});

test('dialog dengan bukti: bukti tepat mematahkan kebohongan', async t => {
  const g = fresh(t);
  g.talk(...P.darmawan);
  assert.ok(!g.topics().some(x => x.startsWith('Siapa yang tahu letak')), 'topik kunci baru muncul setelah kunci diperiksa');
  g.endTalk();
  g.click(...P.kunciToko);
  g.talk(...P.darmawan); g.ask('Siapa yang tahu letak'); g.endTalk();
  g.talk(...P.slamet);
  g.topic('Ceritakan masa lalumu'); g.next();
  assert.match(g.show('surat_glodok'), /\.\.\./);
  assert.match(g.run().join(' '), /dua tahun di Glodok/);
  assert.ok((await g.saved()).cards.includes('t_slamet_napi'));
});

test('dialog dengan bukti: bukti salah membuat saksi defensif lalu menutup topik sampai pindah lokasi', t => {
  const g = fresh(t);
  g.talk(...P.slamet);
  g.topic('Ceritakan masa lalumu'); g.next();
  assert.match(g.show('lup'), /Saya\.\.\. saya tidak paham|Kenapa Tuan/);
  g.next();
  assert.match(g.show('bedak'), /harus kembali bekerja/);
  g.next();
  const closed = g.topics().find(x => x.startsWith('Ceritakan masa lalumu'));
  assert.match(closed, /enggan membahasnya/);

  g.endTalk();
  g.click(...P.debu); g.combine('lup', 'sampel_debu');
  g.talk(...P.slamet); g.show('serbuk_jati'); g.run(); g.endTalk(); // membuka bengkel
  g.goTo('bengkel').goTo('toko');
  g.talk(...P.slamet);
  assert.equal(g.topics().find(x => x.startsWith('Ceritakan masa lalumu')), 'Ceritakan masa lalumu.');
});

test('peta bertahap: lokasi baru hanya muncul setelah petunjuknya ditemukan', t => {
  const g = fresh(t);
  assert.deepEqual(g.pins(), ['toko']);
  g.click(...P.mejaKasir); g.click(...P.bukuServis); g.closeDoc(); g.back();
  assert.deepEqual(g.pins(), ['toko', 'rumah_lim']);
  assert.throws(() => g.goTo('bengkel'), /belum terbuka/);
});

test('sebelum dan sesudah: toko berubah setelah pemain pergi, dan perubahan hanya disebut bila pernah dilihat', async t => {
  const g = fresh(t);
  g.click(...P.debu); // melihat debu
  g.click(...P.mejaKasir); g.click(...P.bukuServis); g.closeDoc(); g.back();
  g.click(...P.kalender);
  assert.equal(g.loc(), 'Kalender dinding');
  g.back();
  assert.match(g.$('#scene-art').innerHTML, /OKTOBER/);

  g.goTo('rumah_lim').goTo('toko');
  assert.match(g.$('#scene-art').innerHTML, /NOVEMBER/);
  assert.match(g.click(...P.debu), /sudah disapu bersih/);
  assert.ok((await g.saved()).cards.includes('lantai_disapu'));

  // Pemain lain yang tidak pernah melihat debu tidak diberi tahu ada perubahan.
  const h = fresh(t);
  h.click(...P.mejaKasir); h.click(...P.bukuServis); h.closeDoc(); h.back();
  h.goTo('rumah_lim').goTo('toko');
  assert.match(h.click(...P.debu), /^Lantai papan yang mengilap\. Bersih\.$/);
  // ...tetapi serbuknya masih bisa ditemukan di pengki.
  h.click(...P.pengki);
  assert.ok(h.invIds().includes('sampel_debu'));
});

test('papan deduksi: kombinasi salah tidak memberi petunjuk sebagian', t => {
  const g = fresh(t);
  g.click(...P.jejak); g.click(...P.kunciToko);
  const msg = g.link('jejak_pintu', 'kunci_tergantung');
  assert.equal(msg, 'Petunjuk-petunjuk ini belum membentuk kesimpulan.');
  assert.equal(g.$$('.card.c-ded').length, 0);
});

test('jurnal mencatat fakta dan kesaksian, bukan kesimpulan', async t => {
  const g = fresh(t);
  g.click(...P.debu); g.click(...P.jejak); g.click(...P.kunciToko);
  g.combine('lup', 'sampel_debu');
  g.talk(...P.slamet); g.show('serbuk_jati'); g.run(); g.endTalk();
  g.link('serbuk_jati', 't_slamet_bengkel');
  const s = await g.saved();
  assert.ok(s.deds.includes('d_dari_bengkel'));
  const kinds = new Set(s.journal.map(j => j.k));
  assert.ok(kinds.has('barang') && kinds.has('fakta') && kinds.has('kesaksian') && kinds.has('lokasi'));
  assert.ok(!s.journal.some(j => j.t.includes('Pelaku baru saja dari bengkel')));
});

test('hint berjenjang: tiap pemakaian naik satu tingkat dan mengurangi jatah', t => {
  const g = fresh(t);
  g.$('#b-hint').click();
  g.$('#modal [data-a="next"]').click();
  assert.equal(g.$$('#modal .hint-line').length, 1);
  g.$('#modal [data-a="next"]').click();
  assert.equal(g.$$('#modal .hint-line').length, 2);
  assert.equal(g.$('#hint-n').textContent, '1');
  g.$('#modal [data-a="next"]').click();
  assert.match(g.$('#modal').textContent, /Gabungkan/);
  assert.equal(g.$('#hint-n').textContent, '0');
});

test('progres tersimpan dan bisa dilanjutkan', async t => {
  const g = fresh(t);
  g.click(...P.debu);
  g.goTo('toko').click(...P.mejaKasir);
  await g.saved();
  const resumed = new Game({ storage: g.rawSave() });
  t.after(() => resumed.close());
  assert.ok(resumed.$('[data-a="cont"]'));
  resumed.continueGame();
  assert.equal(resumed.loc(), 'Meja kasir');
  assert.ok(resumed.invIds().includes('sampel_debu'));
});
