# Detektif Batavia

Game detektif *point-and-click* 2D berlatar Batavia tahun 1926. Pemain memecahkan kasus dengan mengamati, membantah saksi dengan bukti, dan menarik kesimpulan sendiri. Game tidak menebak untuk pemain dan tidak memberi sorotan pada petunjuk penting.

**Kasus #1 — Pencurian di Toko Jam** (tutorial, ±15 menit): jam antik *De Zwaan* hilang dari etalase Toko Jam Waktoe Emas di Pasar Baroe. Etalasenya tidak rusak dan tidak ada pintu yang dibobol.

## Cara memainkan

Buka `index.html` di browser. Game ini hanya berisi HTML, CSS, dan JavaScript biasa, jadi tidak perlu instalasi, *build*, atau server.

Bila ingin menjalankannya lewat server lokal:

```bash
python3 -m http.server 8765
```

Lalu buka `http://localhost:8765`. Game paling nyaman dimainkan di PC dengan mouse.

Progres tersimpan otomatis di browser (`localStorage`). Pilih **Lanjutkan penyelidikan** di layar judul untuk melanjutkan.

## Kontrol

| Aksi | Cara |
| --- | --- |
| Memeriksa objek | Klik objek di layar |
| Berbicara | Klik tokoh, lalu pilih topik |
| Menunjukkan atau membantah dengan bukti | Seret barang atau catatan ke kotak dialog (atau klik barang → **Tunjukkan**) |
| Menggabungkan barang | Seret satu barang ke barang lain (atau klik barang → **Gabungkan…**) |
| Membaca dokumen | Klik barang → **Baca** |
| Kembali dari tampilan dekat | Tombol **‹ Kembali** atau `Esc` |
| Melanjutkan dialog | **Lanjut**, `Spasi`, atau `Enter` |

Bilah atas berisi **Peta**, **Jurnal**, **Papan Deduksi**, **Hint**, **Sorot**, dan **Tutup Kasus**.

## Mode

| | Normal | Mudah |
| --- | --- | --- |
| Hint | 3 | 6 |
| Sorot (tampilkan sejenak semua area yang bisa diklik) | 3 kali | Tanpa batas |

## Mekanik

- **Layar investigasi tanpa sorotan:** banyak objek bisa diklik, tetapi tidak semuanya penting.
- **Inspeksi berlapis:** objek dapat diperbesar beberapa tingkat, misalnya meja → laci → surat.
- **Sebelum dan sesudah:** lokasi bisa berubah ketika pemain kembali. Game hanya menyebut perubahan yang benar-benar pernah dilihat pemain sebelumnya.
- **Dialog dengan bukti:** bukti yang tepat mematahkan kebohongan saksi. Bukti yang salah membuat saksi defensif, dan setelah dua kali ia menolak membahas topik itu sampai pemain pindah lokasi.
- **Papan deduksi:** hubungkan 2–3 kartu petunjuk untuk membentuk kesimpulan. Kesimpulan bisa dihubungkan lagi menjadi kesimpulan bertingkat. Papan tidak memberi tahu kombinasi yang "hampir benar".
- **Kombinasi barang:** hanya kombinasi yang logis, misalnya lup + sampel debu.
- **Peta bertahap:** lokasi baru muncul setelah pemain menemukan alamat atau petunjuk arah.
- **Rekonstruksi penutup:** isi kalimat rumpang dengan kata-kata yang sudah ditemukan. Laporan hanya diterima bila semuanya benar, tanpa keterangan bagian mana yang salah.
- **Jurnal otomatis:** mencatat apa yang ditemukan, di mana, dan siapa berkata apa. Jurnal tidak mencatat kesimpulan.
- **Hint berjenjang:** setiap hint naik satu tingkat dari samar ke jelas.

## Struktur proyek

```
index.html      Kerangka halaman dan elemen antarmuka
css/style.css   Tampilan
js/art.js       Semua ilustrasi layar, potret, dan ikon (SVG yang digambar dengan kode)
js/case1.js     Isi Kasus #1: barang, fakta, kesaksian, deduksi, layar, dialog, hint, epilog
js/engine.js    Mesin game: state, hotspot, inventaris, dialog, papan deduksi, peta, simpan otomatis
```

Urutan pemuatan skrip penting: `art.js` → `case1.js` → `engine.js`.

```
package.json            Skrip npm dan dependensi tes (jsdom)
test/helpers.js         Memuat game ke jsdom dan mengendalikannya seperti pemain
test/data.test.js       Tes integritas data kasus
test/mechanics.test.js  Tes tiap mekanik inti
test/playthrough.test.js Tes main kasus dari layar judul sampai epilog
```

## Tes otomatis

Butuh Node.js 20 atau lebih baru. Game sendiri tetap tidak butuh Node; Node hanya dipakai untuk tes.

```bash
npm install
```

```bash
npm test
```

Tes memakai *test runner* bawaan Node (`node:test`) dan [jsdom](https://github.com/jsdom/jsdom). Game yang diuji adalah `index.html` dan `js/` yang asli, dikendalikan lewat tombol, hotspot, dan dialog seperti pemain.

| File | Yang diperiksa |
| --- | --- |
| `data.test.js` | Semua id yang dirujuk ada; resep deduksi 2–3 kartu tanpa duplikat; setiap kesimpulan antara punya minimal 2 jalur; setiap jawaban rekonstruksi ada di bank kata; hotspot berada di dalam layar |
| `mechanics.test.js` | Tanpa sorotan, batas Sorot, inspeksi berlapis, kombinasi barang, bantahan dengan bukti benar dan salah (termasuk topik yang ditutup), peta bertahap, sebelum/sesudah, papan deduksi, jurnal, hint berjenjang, simpan dan lanjutkan |
| `playthrough.test.js` | Kasus bisa diselesaikan sampai "Kasus Ditutup"; laporan salah ditolak tanpa menyebut bagian yang salah; kata jawaban hanya muncul setelah petunjuknya ditemukan |

Jalankan `npm test` setiap kali mengubah data kasus. Bila sebuah petunjuk, resep, atau jawaban rusak, tes main kasus atau tes data akan gagal dan menyebut bagiannya. Jalur penyelesaian yang dipakai tes ada di `playToSolution()` dalam `test/helpers.js`; perbarui fungsi itu bila alur kasus sengaja diubah.

## Menulis kasus baru

Semua isi kasus berada dalam satu objek `CASE` di `js/case1.js`. Mesin game tidak perlu diubah untuk kasus baru dengan mekanik yang sama.

| Bagian | Isi |
| --- | --- |
| `defs` | Barang (`item`), fakta (`fact`), kesaksian (`testi`), dan deduksi (`ded`). Deduksi berisi daftar `recipes`, yaitu kombinasi kartu yang menghasilkannya. |
| `docs` | Dokumen yang bisa dibaca (HTML), opsional dengan `onOpen`. |
| `locations` | Lokasi di peta beserta posisi pin. |
| `scenes` | Layar beserta `hotspots`: `r: [x, y, lebar, tinggi]` dalam koordinat 1280×720, `on(A)` saat diklik, `when(A)` untuk kondisi tampil, dan `parent` untuk tampilan dekat. |
| `chars` | Tokoh: `topics`, reaksi terhadap barang (`react`), dan kalimat defensif. Baris dialog yang bisa dibantah memakai `contra: { ok: [...], success: [...] }`. |
| `combos` | Kombinasi barang. |
| `words`, `recon` | Bank kata dan kalimat rumpang untuk rekonstruksi. |
| `hints` | Hint berjenjang, diurutkan sesuai alur kasus. |

Fungsi di data kasus menerima objek `A` dengan antarmuka: `say`, `give`, `take`, `note`, `has`, `flag`, `unlock`, `isUnlocked`, `goto`, `doc`, `talk`, dan `log`.

Aturan menulis kasus dari dokumen desain:

1. Tulis kebenaran lengkap lebih dulu: siapa, bagaimana, kenapa, dan kapan.
2. Setiap kesimpulan penting punya 2–3 jalur petunjuk, supaya pemain yang melewatkan satu petunjuk tidak buntu.
3. Sertakan 1–2 *red herring* yang masuk akal, tetapi bisa dipatahkan dengan bukti.
4. Uji dengan *playtester*: orang yang teliti harus bisa menyelesaikan kasus tanpa menebak.

## Status

- Kasus #1 bisa dimainkan dari awal sampai kasus ditutup.
- Benang merah antarkasus (sosok "K." bercap gagak) baru diperkenalkan; Kasus #2 belum dibuat.
- Belum diuji oleh pemain sungguhan untuk durasi dan tingkat kesulitan.

<details>
<summary>Solusi Kasus #1 (spoiler)</summary>

Pemilik toko, Tuan Darmawan, memalsukan pencurian. Ia terlilit utang bank yang jatuh tempo 1 November, dan polis asuransi jam De Zwaan (f 4.000) berakhir 28 Oktober. Sekitar pukul 21.30 tanggal 26 Oktober ia kembali ke toko, membuka etalase dengan kuncinya, lalu membawa jam itu ke bengkelnya di Gang Kenari. Serbuk kayu jati dari bengkel tertinggal di depan etalase.

Slamet, pegawai baru yang punya catatan kriminal, tidak bersalah: struk apotek membuktikan ia berada di Meester Cornelis pukul 21.40.

</details>
