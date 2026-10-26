// Kasus #1 (tutorial): Pencurian di Toko Jam.
// Kebenaran: Darmawan memalsukan pencurian jam De Zwaan miliknya sendiri untuk klaim asuransi
// sebelum polis berakhir 28 Oktober 1926, lalu menyembunyikan jam itu di bengkelnya untuk dijual ke "K.".
const CASE = {
  id: 'tokojam',
  title: 'Kasus #1 — Pencurian di Toko Jam',
  start: { scene: 'toko', items: ['lup', 'bedak'] },

  intro: [
    'Batavia, Rabu pagi, 27 Oktober 1926.',
    'Telegram dari Komisaris Wiradinata membawamu ke Pasar Baroe: jam antik "De Zwaan" hilang dari Toko Jam Waktoe Emas.',
    'Etalasenya tidak rusak. Tak ada pintu yang dibobol. Pemiliknya menunggu dengan cemas.',
    'Komisaris hanya menitip satu pesan: "Jangan tuduh siapa pun sebelum Tuan bisa membuktikannya."',
  ],

  // ---------- Barang, fakta, kesaksian, deduksi ----------
  defs: {
    // perlengkapan (bukan kartu deduksi)
    lup: { type: 'item', tool: true, name: 'Lup', desc: 'Kaca pembesar kuningan milikmu.' },
    bedak: { type: 'item', tool: true, name: 'Bedak sidik jari', desc: 'Serbuk aluminium halus dan kuas untuk menampakkan sidik jari.' },
    pensil: { type: 'item', tool: true, name: 'Pensil', desc: 'Pensil grafit lunak dari meja kasir.' },

    // barang bukti
    sampel_debu: { type: 'item', name: 'Sampel debu', desc: 'Debu kecokelatan dari lantai depan etalase, kubungkus kertas.' },
    serbuk_jati: { type: 'item', name: 'Serbuk kayu jati', desc: 'Di bawah lup: bukan debu jalanan, melainkan serbuk kayu halus cokelat keemasan, harum minyak. Serbuk jati yang baru digergaji.' },
    kunci_etalase: { type: 'item', name: 'Kunci etalase', desc: 'Kunci kuningan kecil dari kait di samping etalase.' },
    surat_bank: { type: 'item', name: 'Surat Bank Kredit', desc: 'Surat peringatan dari Bank Kredit Pasar Baroe untuk Darmawan.', doc: 'surat_bank' },
    surat_glodok: { type: 'item', name: 'Surat Penjara Glodok', desc: 'Surat keterangan bebas atas nama Slamet.', doc: 'surat_glodok' },
    struk_apotek: { type: 'item', name: 'Struk apotek', desc: 'Struk Apotek Sentosa, Meester Cornelis, milik Slamet.', doc: 'struk_apotek' },
    polis: { type: 'item', name: 'Polis asuransi', desc: 'Polis N.V. Java Waarborg atas jam De Zwaan.', doc: 'polis' },
    buku_kas: { type: 'item', name: 'Buku kas', desc: 'Buku kas Toko Waktoe Emas dari laci bengkel.', doc: 'buku_kas' },
    surat_gagak: { type: 'item', name: 'Surat bercap gagak', desc: 'Surat tanpa nama lengkap, hanya ditandatangani "K.", bercap lilin hitam.', doc: 'surat_gagak' },
    lembar_november: { type: 'item', name: 'Lembar kalender November', desc: 'Lembar kalender toko. Ada bekas tekanan pena samar di salah satu kotak kosong.' },
    gosokan_kalender: { type: 'item', name: 'Gosokan pensil', desc: 'Hasil gosokan pensil di lembar November, menampakkan tulisan dari lembar Oktober yang disobek.', doc: 'gosokan_kalender' },

    // fakta hasil pengamatan
    etalase_utuh: { type: 'fact', name: 'Etalase utuh', desc: 'Kaca, engsel, dan lubang kunci etalase tidak rusak sedikit pun.' },
    kunci_tergantung: { type: 'fact', name: 'Kunci di tempatnya', desc: 'Kunci etalase masih tergantung di kait sampingnya.' },
    kunci_bersih: { type: 'fact', name: 'Kunci tanpa sidik jari', desc: 'Bedak tidak menampakkan satu sidik jari pun di kunci etalase, bahkan milik pemiliknya. Seseorang mengelapnya.' },
    barang_lain_utuh: { type: 'fact', name: 'Hanya satu yang hilang', desc: 'Jam-jam saku lain di etalase tidak disentuh.' },
    jejak_pintu: { type: 'fact', name: 'Jejak ke pintu belakang', desc: 'Serbuk di lantai membentuk jejak samar dari etalase ke pintu belakang toko.' },
    kalender_28: { type: 'fact', name: 'Tanggal 28 dilingkari', desc: 'Di kalender toko, tanggal 28 Oktober dilingkari tinta merah dengan tulisan kecil "J.T.".' },
    lantai_disapu: { type: 'fact', name: 'Lantai disapu', desc: 'Debu di depan etalase lenyap. Lantai disapu setelah kunjungan pertamaku.' },
    kalender_disobek: { type: 'fact', name: 'Kalender disobek', desc: 'Lembar Oktober kalender toko disobek setelah kunjungan pertamaku.' },
    serbuk_bengkel_segar: { type: 'fact', name: 'Serbuk segar di bengkel', desc: 'Serbuk jati di bawah meja kerja bengkel masih segar dan harum, belum berdebu.' },
    lampu_bengkel: { type: 'fact', name: 'Lampu bengkel baru dipakai', desc: 'Sumbu lampu minyak bengkel hitam baru terbakar; minyaknya tinggal sedikit.' },
    peti_gembok_baru: { type: 'fact', name: 'Peti bergembok baru', desc: 'Peti kayu besar di bengkel ditutup terpal dan dikunci gembok yang masih mengilap.' },

    // kesaksian
    t_owner_tutup: { type: 'testi', name: 'Darmawan: tutup pukul 18.00', desc: 'Darmawan: "Saya mengunci toko pukul enam sore bersama Slamet, lalu pulang. Pukul tujuh pagi etalase sudah kosong."' },
    t_owner_tuduh: { type: 'testi', name: 'Darmawan menuduh Slamet', desc: 'Darmawan: "Yang tahu letak kunci etalase hanya saya dan Slamet."' },
    t_owner_bangkrut: { type: 'testi', name: 'Darmawan: hampir bangkrut', desc: 'Darmawan mengaku tokonya hampir bangkrut dan bank akan menyita awal November.' },
    t_owner_bengkel: { type: 'testi', name: 'Darmawan: ke bengkel semalam', desc: 'Darmawan akhirnya mengaku mampir ke bengkelnya semalam, "mengambil perkakas".' },
    t_slamet_pulang: { type: 'testi', name: 'Slamet: pulang ke Meester Cornelis', desc: 'Slamet: "Saya pulang pukul enam lewat, naik trem ke Meester Cornelis. Malamnya saya ke apotek untuk ibu."' },
    t_slamet_napi: { type: 'testi', name: 'Slamet: bekas narapidana', desc: 'Slamet mengaku pernah dua tahun di Penjara Glodok karena mencuri sepeda, enam tahun lalu.' },
    t_slamet_lantai: { type: 'testi', name: 'Slamet: lantai bersih sore itu', desc: 'Slamet: "Kemarin sore lantai depan etalase sudah bersih ketika kami mengunci toko."' },
    t_slamet_bengkel: { type: 'testi', name: 'Slamet: bengkel milik Darmawan', desc: 'Slamet: "Serbuk jati itu dari bengkel Pak Darmawan di Gang Kenari. Hanya beliau yang bekerja kayu; saya dilarang masuk."' },
    t_slamet_sapu: { type: 'testi', name: 'Slamet: disuruh menyapu', desc: 'Slamet: "Setelah Tuan pergi, Pak Darmawan menyuruh saya menyapu seluruh lantai."' },
    t_lim_lampu: { type: 'testi', name: 'Ny. Lim: lampu menyala 21.30', desc: 'Ny. Lim: pukul setengah sepuluh malam lampu toko menyala; seseorang bertubuh agak gemuk membawa bungkusan kain ke gang belakang, ke arah bengkel di Gang Kenari.' },
    t_lim_trem: { type: 'testi', name: 'Ny. Lim: Slamet naik trem', desc: 'Ny. Lim melihat Slamet naik trem ke arah Meester Cornelis sekitar pukul 18.15.' },
    t_lim_asuransi: { type: 'testi', name: 'Ny. Lim: polis habis akhir bulan', desc: 'Ny. Lim: bulan lalu agen asuransi menilai jam angsa itu; Darmawan bilang polisnya habis akhir bulan dan ia tak sanggup memperpanjang.' },

    // deduksi — dibentuk pemain di papan; tiap kesimpulan punya beberapa jalan
    d_orang_dalam: {
      type: 'ded', name: 'Pelaku memakai kunci', desc: 'Etalase dibuka dengan kuncinya sendiri, bukan dibobol. Pelaku tahu letak kunci.',
      recipes: [['etalase_utuh', 'kunci_tergantung'], ['etalase_utuh', 'kunci_bersih'], ['kunci_tergantung', 't_owner_tuduh']],
    },
    d_waktu: {
      type: 'ded', name: 'Terjadi sekitar 21.30', desc: 'Pelaku masuk ke toko malam hari, sekitar pukul 21.30, setelah toko dikunci.',
      recipes: [['t_lim_lampu', 't_owner_tutup'], ['t_lim_lampu', 't_slamet_lantai']],
    },
    d_slamet_bersih: {
      type: 'ded', name: 'Slamet punya alibi', desc: 'Pukul 21.40 Slamet ada di Meester Cornelis, hampir sejam perjalanan dari Pasar Baroe. Ia tak mungkin pelakunya.',
      recipes: [['struk_apotek', 'd_waktu'], ['struk_apotek', 't_lim_lampu'], ['struk_apotek', 't_lim_trem', 'd_waktu']],
    },
    d_dari_bengkel: {
      type: 'ded', name: 'Pelaku datang dari bengkel', desc: 'Serbuk di depan etalase berasal dari bengkel Darmawan. Pelaku baru saja dari bengkel itu.',
      recipes: [['serbuk_jati', 't_slamet_bengkel'], ['serbuk_jati', 'serbuk_bengkel_segar'], ['serbuk_jati', 't_owner_bengkel'], ['jejak_pintu', 'serbuk_jati']],
    },
    d_butuh_uang: {
      type: 'ded', name: 'Darmawan terdesak utang', desc: 'Darmawan hampir bangkrut dan harus melunasi bank sebelum 1 November.',
      recipes: [['surat_bank', 't_owner_bangkrut'], ['surat_bank', 'buku_kas'], ['buku_kas', 't_owner_bangkrut']],
    },
    d_asuransi: {
      type: 'ded', name: 'Tepat sebelum polis habis', desc: 'Jam hilang dua hari sebelum polis asuransi De Zwaan (f 4.000) berakhir pada 28 Oktober.',
      recipes: [['kalender_28', 'polis'], ['gosokan_kalender', 'polis'], ['kalender_28', 't_lim_asuransi'], ['gosokan_kalender', 't_lim_asuransi'], ['polis', 't_lim_asuransi']],
    },
    d_menutupi: {
      type: 'ded', name: 'Darmawan menghapus jejak', desc: 'Setelah aku datang, Darmawan menyuruh lantai disapu dan menyobek kalender Oktober.',
      recipes: [['lantai_disapu', 't_slamet_sapu'], ['kalender_disobek', 't_slamet_sapu'], ['lantai_disapu', 'kalender_disobek']],
    },
    d_disembunyikan: {
      type: 'ded', name: 'Jam disembunyikan di bengkel', desc: 'Bungkusan malam itu dibawa ke bengkel; peti bergembok baru di sana menunggu kurir "K." pada 30 Oktober.',
      recipes: [['surat_gagak', 'peti_gembok_baru'], ['t_lim_lampu', 'peti_gembok_baru'], ['surat_gagak', 't_lim_lampu']],
    },
    d_final: {
      type: 'ded', final: true, name: 'Pencurian palsu', desc: 'Darmawan memalsukan pencurian jamnya sendiri demi uang asuransi.',
      recipes: [['d_dari_bengkel', 'd_butuh_uang', 'd_asuransi']],
    },
  },

  // ---------- Dokumen yang bisa dibaca ----------
  docs: {
    buku_servis: {
      title: 'Boekoe Servis — Toko Jam Waktoe Emas',
      html: `<table class="ledger"><tr><th>Tgl</th><th>Nama</th><th>Barang</th><th>Alamat</th></tr>
        <tr><td>2 Okt</td><td>Tn. Van Dijk</td><td>jam beker</td><td>Rijswijk 3</td></tr>
        <tr><td>9 Okt</td><td>Ny. Lim Siok Lan</td><td>jam saku perak</td><td>Pecenongan 14</td></tr>
        <tr><td>12 Okt</td><td>Haji Oemar</td><td>jam dinding</td><td>Kwitang 21</td></tr>
        <tr><td>16 Okt</td><td>Ny. Lim Siok Lan</td><td>jam saku perak</td><td>Pecenongan 14</td></tr>
        <tr><td>19 Okt</td><td>Tn. Tan Boen Liong</td><td>jam kukuk</td><td>Glodok 88</td></tr>
        <tr><td>23 Okt</td><td>Ny. Lim Siok Lan</td><td>jam saku perak</td><td>Pecenongan 14</td></tr></table>
        <p class="hand">Ny. Lim — langganan, ambil tiap Sabtu. Rumahnya di jalan pulang dari gereja.</p>`,
      onOpen: (A) => {
        if (A.unlock('rumah_lim')) A.log('Buku servis: Ny. Lim Siok Lan, pelanggan tetap, tinggal di Pecenongan 14.');
      },
    },
    surat_bank: {
      title: 'Bank Kredit Pasar Baroe',
      html: `<p class="right">Batavia, 20 Oktober 1926</p><p>Kepada Yth.<br>Toean D. Soerjo<br>Toko Jam Waktoe Emas, Pasar Baroe</p>
        <h4>PERINGATAN TERAKHIR</h4>
        <p>Bersama ini kami beritahukan bahwa tunggakan pinjaman Toean sebesar <b>f 2.650,-</b> jatuh tempo pada <b>1 November 1926</b>.</p>
        <p>Apabila tidak dilunasi pada tanggal tersebut, bank terpaksa menyita toko beserta isinya sesuai perjanjian.</p>
        <p class="right">Hormat kami,<br><i>Directie</i></p>`,
    },
    surat_glodok: {
      title: 'Penjara Glodok — Surat Keterangan',
      html: `<p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p><p><b>Slamet bin Karto</b></p>
        <p>telah menjalani hukuman penjara selama 2 (dua) tahun atas perkara pencurian sebuah sepeda, dan dibebaskan pada tanggal <b>14 Maret 1920</b>.</p>
        <p>Selama menjalani hukuman, yang bersangkutan berkelakuan baik.</p><p class="right">Kepala Penjara Glodok</p>`,
    },
    struk_apotek: {
      title: 'Struk Apotek Sentosa',
      html: `<div class="receipt"><b>APOTEK SENTOSA</b><br>Meester Cornelis<br>————————<br>Tgl: 26-10-1926<br>Jam: 21.40<br>————————<br>Pil kina, 1 doos ..... f 0,35<br>————————<br>a.n. SLAMET<br><span class="stamp">LUNAS</span></div>`,
    },
    polis: {
      title: 'N.V. Java Waarborg — Polis No. 1187',
      html: `<p><b>Tertanggung:</b> Toean D. Soerjo, Pasar Baroe</p>
        <p><b>Benda:</b> jam meja antik "De Zwaan" (Amsterdam, 1789), berhias angsa perunggu</p>
        <p><b>Nilai pertanggungan:</b> f 4.000,- <span class="hand">(dinaikkan dari f 1.500,- pada 15 September 1926)</span></p>
        <p><b>Risiko:</b> kebakaran dan pencurian</p>
        <p><b>Berlaku sampai:</b> 28 Oktober 1926</p>
        <p class="hand">Catatan agen: tertanggung tidak mengajukan perpanjangan.</p>`,
    },
    buku_kas: {
      title: 'Buku Kas — Waktoe Emas',
      html: `<table class="ledger"><tr><th>Bulan</th><th>Masuk</th><th>Keluar</th><th>Sisa</th></tr>
        <tr><td>Juli</td><td>f 212</td><td>f 340</td><td class="red">− f 128</td></tr>
        <tr><td>Agustus</td><td>f 164</td><td>f 355</td><td class="red">− f 191</td></tr>
        <tr><td>September</td><td>f 98</td><td>f 402</td><td class="red">− f 304</td></tr>
        <tr><td>Oktober</td><td>f 37</td><td>f 410</td><td class="red">− f 373</td></tr></table>
        <p class="hand red">Bank — 1 Nov!! Tidak ada jalan lain.</p>`,
    },
    surat_gagak: {
      title: 'Surat tanpa alamat',
      html: `<p>Tuan D.,</p><p>Tawaran saya tetap: <b>f 1.200 tunai</b> untuk "Sang Angsa", tanpa pertanyaan.</p>
        <p>Kurir saya datang malam <b>30 Oktober</b>. Pastikan barang sudah terbungkus rapi.</p><p>Bakar surat ini.</p>
        <p class="right">— K.</p><div class="seal">🜲</div>`,
    },
    gosokan_kalender: {
      title: 'Gosokan pensil — lembar November',
      html: `<div class="rubbing"><div class="ring">28</div><div class="rub-text">J.T. polis</div></div><p class="hand">Bekas tekanan pena dari lembar Oktober, terbaca setelah kertas digosok pensil.</p>`,
    },
  },

  // ---------- Peta ----------
  locations: {
    toko: { name: 'Toko Jam Waktoe Emas', area: 'Pasar Baroe', scene: 'toko', pin: [560, 470] },
    bengkel: { name: 'Bengkel Darmawan', area: 'Gang Kenari 7', scene: 'bengkel', pin: [640, 540] },
    rumah_lim: { name: 'Rumah Ny. Lim', area: 'Pecenongan 14', scene: 'rumah_lim', pin: [470, 300] },
  },

  // ---------- Layar ----------
  scenes: {
    toko: {
      title: 'Toko Jam Waktoe Emas', loc: 'toko', art: ART.toko,
      hotspots: [
        { r: [34, 74, 272, 312], on: A => A.say('Jalan Pasar Baroe. Delman lewat pelan-pelan. Jendela terkunci dari dalam, kacanya utuh.') },
        { r: [352, 30, 96, 310], on: A => A.say('Jam dinding berbandul. Detaknya tenang dan tepat waktu.') },
        { r: [612, 66, 316, 238], on: A => A.say('Rak berisi jam beker, jam kukuk, dan jam meja. Beberapa diberi label kertas: "diservis".') },
        { r: [936, 44, 118, 120], on: A => A.say('Poster Pasar Gambir 1926. Sudutnya mulai menguning.') },
        { r: [476, 88, 104, 150], on: A => A.goto('kalender') },
        { r: [1112, 132, 146, 340], on: A => A.say(A.isUnlocked('bengkel') ? 'Pintu belakang menuju gang, ke arah Gang Kenari. Gerendelnya utuh.' : 'Pintu belakang ke gang. Gerendelnya dipasang dari dalam dan tidak rusak.') },
        { r: [228, 590, 64, 86], on: A => A.say('Tempat sampah: bungkus kertas minyak dan puntung kretek.') },
        { r: [310, 404, 70, 276], on: A => A.say(A.flag('tokoAfter') ? 'Sapu ijuk. Ujungnya sekarang berdebu kecokelatan.' : 'Sapu ijuk, bersih.') },
        { r: [366, 648, 86, 62], when: A => A.flag('tokoAfter'), on: A => {
          A.say('Pengki berisi sapuan lantai: serbuk halus kecokelatan.');
          if (!A.has('sampel_debu') && !A.has('serbuk_jati')) { A.give('sampel_debu'); }
        } },
        { r: [378, 326, 330, 236], on: A => A.goto('etalase') },
        { r: [702, 430, 38, 52], on: A => takeKey(A) },
        { r: [448, 582, 176, 40], on: A => floorDust(A) },
        { r: [628, 586, 470, 32], on: A => footprints(A) },
        { r: [1080, 486, 124, 104], on: A => footprints(A) },
        { r: [872, 372, 236, 190], on: A => A.goto('meja') },
        { r: [1026, 294, 82, 78], on: A => A.say('Mesin kasir kuningan. Mengilap, tapi jarang berbunyi akhir-akhir ini.') },
        { r: [895, 160, 125, 212], char: 'darmawan', on: A => A.talk('darmawan') },
        { r: [748, 232, 104, 410], char: 'slamet', on: A => A.talk('slamet') },
      ],
    },
    etalase: {
      title: 'Etalase', parent: 'toko', loc: 'toko', art: ART.etalase,
      hotspots: [
        { r: [170, 90, 940, 200], on: A => { A.say('Kacanya bersih, tanpa retak atau goresan.'); A.note('etalase_utuh'); } },
        { r: [170, 470, 440, 150], on: A => A.say('Laci bawah etalase berisi kain lap dan kotak-kotak jam yang kosong.') },
        { r: [670, 470, 440, 150], on: A => A.say('Laci bawah etalase: kertas pembungkus dan pita.') },
        { r: [240, 318, 200, 90], on: A => { A.say('Jam-jam saku lain masih tersusun rapi. Tak satu pun disentuh.'); A.note('barang_lain_utuh'); } },
        { r: [840, 318, 200, 90], on: A => { A.say('Jam-jam saku lain masih tersusun rapi. Tak satu pun disentuh.'); A.note('barang_lain_utuh'); } },
        { r: [516, 346, 248, 64], on: A => A.say('Bekas bulat di beludru, bersih dari debu. Di sinilah jam De Zwaan berdiri. Tak ada goresan di sekitarnya; jam itu diangkat dengan hati-hati.') },
        { r: [610, 268, 60, 56], on: A => { A.say('Lubang kunci pintu kaca bersih. Tidak ada bekas congkelan.'); A.note('etalase_utuh'); } },
        { r: [536, 434, 208, 42], on: A => A.say('Plakat kuningan: "DE ZWAAN · 1789", dengan ukiran seekor angsa kecil.') },
        { r: [1138, 440, 64, 120], on: A => takeKey(A) },
        { r: [260, 646, 500, 74], on: A => floorDust(A) },
      ],
    },
    kalender: {
      title: 'Kalender dinding', parent: 'toko', loc: 'toko', art: ART.kalender,
      hotspots: [
        { r: [400, 40, 480, 640], on: A => {
          if (!A.flag('tokoAfter')) { A.flag('seen_cal', 1); A.say('Kalender Oktober 1926.'); return; }
          if (A.flag('seen_cal')) { A.say('Tadi kalender ini masih menunjukkan Oktober. Sekarang lembar Oktober sudah disobek.'); A.note('kalender_disobek'); }
          else A.say('Kalender November 1926. Tepi atasnya bergerigi bekas sobekan.');
        } },
        { r: [430, 70, 420, 220], on: A => A.say('Gambar Gunung Gede di atas sawah. Hadiah dari Toko Obat "Panjang Oemoer".') },
        { r: [670, 552, 60, 48], on: A => {
          if (!A.flag('tokoAfter')) { A.flag('seen_cal', 1); A.say('Angka 28 dilingkari tinta merah. Di bawahnya ada tulisan kecil: "J.T."'); A.note('kalender_28'); return; }
          A.say('Di kotak kosong ini ada bekas tekanan pena yang samar.');
          if (A.give('lembar_november')) A.say('Kulepas lembar November untuk kuperiksa lebih lanjut.');
        } },
      ],
    },
    meja: {
      title: 'Meja kasir', parent: 'toko', loc: 'toko', art: ART.meja,
      hotspots: [
        { r: [820, 100, 320, 330], on: A => A.say('Mesin kasir. Laci uangnya hanya berisi beberapa sen.') },
        { r: [60, 280, 140, 160], on: A => A.say('Tumpukan nota servis. Sebagian besar sudah lunas berbulan-bulan lalu.') },
        { r: [590, 305, 100, 80], on: A => A.say('Ting! Bel meja berbunyi nyaring. Darmawan menoleh sebentar.') },
        { r: [195, 320, 290, 200], on: A => A.doc('buku_servis') },
        { r: [505, 448, 262, 48], on: A => { if (A.give('pensil')) A.say('Pensil grafit yang lunak. Kuambil.'); else A.say('Tidak ada apa-apa lagi di sini.'); } },
        { r: [300, 582, 680, 110], on: A => A.goto('laci_kasir') },
      ],
    },
    laci_kasir: {
      title: 'Laci meja kasir', parent: 'meja', loc: 'toko', art: ART.laciKasir,
      hotspots: [
        { r: [370, 235, 340, 220], when: A => !A.has('surat_bank'), on: A => { A.give('surat_bank'); A.doc('surat_bank'); } },
        { r: [800, 330, 110, 90], on: A => A.say('Beberapa keping sen dan satu ketip. Hanya itu uang di laci.') },
        { r: [170, 292, 84, 100], on: A => A.say('Stempel toko: "WAKTOE EMAS — PASAR BAROE".') },
        { r: [205, 440, 110, 56], on: A => A.say('Bantalan tinta biru, hampir kering.') },
        { r: [680, 500, 400, 50], on: A => A.say('Obeng kecil dan gulungan benang. Perkakas servis biasa.') },
      ],
    },
    bengkel: {
      title: 'Bengkel di Gang Kenari', loc: 'bengkel', art: ART.bengkel,
      hotspots: [
        { r: [70, 80, 220, 170], on: A => A.say('Jendela berjeruji menghadap gang. Tembok tetangga terlalu dekat untuk melihat apa pun.') },
        { r: [252, 166, 170, 450], on: A => A.say('Papan-papan kayu jati bersandar di dinding. Ujung salah satunya bekas dipotong.') },
        { r: [940, 40, 290, 182], on: A => A.say('Kotak-kotak jam dari kayu jati, setengah jadi. Pekerjaan yang halus.') },
        { r: [360, 312, 560, 146], on: A => A.say('Meja kerja: gergaji, ragum, serutan kayu. Mata gergaji masih berselaput serbuk.') },
        { r: [556, 392, 168, 54], on: A => A.goto('laci_bengkel') },
        { r: [426, 588, 280, 66], on: A => { A.say('Tumpukan serbuk jati cokelat keemasan di bawah meja. Harum minyak, belum berdebu sama sekali.'); A.note('serbuk_bengkel_segar'); } },
        { r: [948, 408, 274, 226], on: A => { A.say('Peti kayu besar, ditutup terpal. Gemboknya masih mengilap, baru dibeli. Aku tidak berwenang membongkarnya tanpa perintah komisaris.'); A.note('peti_gembok_baru'); } },
        { r: [1218, 358, 50, 304], on: A => { A.flag('linggis_seen', 1); A.say('Linggis berkarat. Debunya tebal; sudah lama tidak dipakai.'); } },
        { r: [612, 96, 56, 110], on: A => { A.say('Lampu minyak. Sumbunya hitam baru terbakar, dan minyaknya tinggal sedikit.'); A.note('lampu_bengkel'); } },
      ],
    },
    laci_bengkel: {
      title: 'Laci meja kerja', parent: 'bengkel', loc: 'bengkel', art: ART.laciBengkel,
      hotspots: [
        { r: [195, 190, 350, 285], when: A => !A.has('polis'), on: A => { A.give('polis'); A.doc('polis'); } },
        { r: [595, 205, 290, 250], when: A => !A.has('buku_kas'), on: A => { A.give('buku_kas'); A.doc('buku_kas'); } },
        { r: [925, 245, 210, 170], when: A => !A.has('surat_gagak'), on: A => { A.give('surat_gagak'); A.doc('surat_gagak'); } },
        { r: [195, 498, 210, 50], on: A => A.say('Obeng bergagang kayu.') },
        { r: [750, 512, 220, 76], on: A => A.say('Paku-paku kecil berserakan.') },
      ],
    },
    rumah_lim: {
      title: 'Teras rumah Ny. Lim', loc: 'rumah_lim', art: ART.rumahLim,
      hotspots: [
        { r: [60, 130, 320, 260], on: A => A.say('Jendela berdaun hijau, terbuka separuh. Tirai renda bergoyang pelan.') },
        { r: [900, 130, 320, 260], on: A => A.say('Jendela berdaun hijau. Di dalam terlihat rak buku yang penuh.') },
        { r: [334, 38, 92, 132], on: A => A.say('Burung perkutut di dalam sangkar. Kukurnya merdu.') },
        { r: [406, 166, 88, 108], on: A => A.say('Foto bersama murid-murid sekolah, tahun 1910.') },
        { r: [520, 108, 240, 392], on: A => A.say('Pintu rumah dari kayu jati, berpelitur gelap.') },
        { r: [40, 500, 160, 190], on: A => A.say('Pot palem yang terawat.') },
        { r: [1080, 500, 160, 190], on: A => A.say('Pot palem yang terawat.') },
        { r: [780, 460, 200, 190], on: A => A.say('Meja kecil dengan secangkir teh yang mengepul.') },
        { r: [890, 468, 42, 44], on: A => A.say('Jam saku perak Ny. Lim. Di tutupnya terukir: "Waktoe Emas — servis 23-10".') },
        { r: [570, 250, 140, 370], char: 'lim', on: A => A.talk('lim') },
      ],
    },
  },

  // ---------- Tokoh dan dialog ----------
  chars: {
    darmawan: {
      name: 'Tuan Darmawan Soerjo', role: 'Pemilik toko',
      reactDefault: 'Saya tidak tahu apa-apa soal itu, Tuan.',
      defensive: ['Apa maksud Tuan menunjukkan itu? Tidak ada hubungannya!', 'Tuan mau menuduh saya dengan barang yang tak berarti?'],
      closeLine: 'Cukup! Saya tidak mau membahas itu lagi sekarang.',
      react: {
        sampel_debu: [{ t: 'Debu. Slamet memang malas menyapu.' }],
        serbuk_jati: [{ t: 'Serbuk kayu? Toko jam memang banyak debu, Tuan.' }],
        polis: [{ t: 'Itu urusan pribadi saya! Semua pedagang mengasuransikan barangnya.' }],
        surat_gagak: [{ t: '(Wajahnya memucat.) Saya... tidak kenal siapa "K." itu. Surat iseng.' }],
        surat_bank: [{ t: 'Itu surat pribadi saya, Tuan!' }],
        buku_kas: [{ t: 'Dari mana Tuan dapat buku itu?' }],
        surat_glodok: [{ t: 'Nah, Tuan lihat sendiri. Bekas napi.' }],
        struk_apotek: [{ t: 'Struk apotek? Bisa saja ia menyuruh orang lain membelinya.' }],
        kunci_etalase: [{ t: 'Itu kunci etalase. Kenapa Tuan mengambilnya?' }],
        kunci_bersih: [{ t: 'Dilap? Saya... saya memang suka membersihkan barang.' }],
        gosokan_kalender: [{ t: '(Ia terdiam lama.) ...Saya tidak ingat pernah menulis itu.' }],
        lembar_november: [{ t: 'Itu cuma kalender, Tuan.' }],
        t_lim_lampu: [{ t: 'Nyonya Lim sudah tua. Matanya tidak seawas dulu.' }],
        peti_gembok_baru: [{ t: 'Peti itu berisi kayu. Kayu mahal, makanya saya gembok.' }],
      },
      topics: [
        { id: 'kejadian', label: 'Apa yang terjadi?', lines: () => [
          { t: 'Tuan Detektif, syukurlah Tuan datang! Jam De Zwaan, pusaka ayah saya, lenyap dari etalase.' },
          { t: 'Kemarin saya mengunci toko pukul enam sore bersama Slamet, lalu pulang. Pagi ini pukul tujuh, etalase sudah kosong.', fx: A => A.note('t_owner_tutup') },
          { t: 'Pintu dan jendela tidak dibobol. Pasti orang dalam, Tuan. Pasti!' },
        ] },
        { id: 'dezwaan', label: 'Seperti apa jam De Zwaan?', lines: () => [
          { t: 'Jam meja buatan Amsterdam, tahun 1789. Di puncaknya ada angsa perunggu kecil; karena itulah namanya.' },
          { t: 'Nilainya? Ah... tak ternilai bagi keluarga saya.' },
        ] },
        { id: 'kunci', label: 'Siapa yang tahu letak kunci etalase?', when: A => A.has('kunci_tergantung'), lines: () => [
          { t: 'Kunci itu memang saya gantung di samping etalase supaya mudah. Yang tahu hanya saya dan Slamet.', fx: A => A.note('t_owner_tuduh') },
          { t: 'Dan Tuan perlu tahu: anak itu bekas narapidana. Ini surat keterangannya dari Penjara Glodok. Saya simpan sejak ia melamar.', fx: A => A.give('surat_glodok') },
        ] },
        { id: 'usaha', label: 'Bagaimana keadaan usaha Tuan?', lines: A => {
          if (A.flag('owner_bangkrut')) return [{ t: 'Ya, ya, toko ini hampir bangkrut. Sudah saya akui. Tapi saya bukan pencuri, Tuan!' }];
          const contra = { ok: ['surat_bank', 'buku_kas'], success: [
            { t: '...Dari mana Tuan mendapat itu?!' },
            { t: 'Baiklah. Baiklah! Toko ini hampir bangkrut. Bank akan menyita semuanya awal November.', fx: A => { A.flag('owner_bangkrut', 1); A.note('t_owner_bangkrut'); } },
            { t: 'Tapi itu tidak menjadikan saya pencuri, Tuan. Saya korban di sini!' },
          ] };
          return [
            { t: 'Usaha saya? Lancar, Tuan. Pelanggan setia, servis ramai.', contra },
            { t: 'Jam itu tidak ada hubungannya dengan uang. Itu kenangan ayah saya.', contra },
          ];
        } },
        { id: 'bengkel', label: 'Tentang bengkel di Gang Kenari', when: A => A.isUnlocked('bengkel'), lines: A => {
          if (A.flag('owner_bengkel')) return [{ t: 'Sudah saya bilang, semalam saya hanya mengambil perkakas, lalu pulang.' }];
          return [
            { t: 'Bengkel? Di sana saya membuat kotak jam dari kayu jati.' },
            { t: 'Tapi sudah seminggu saya tidak ke sana. Pinggang saya sakit, Tuan.', contra: { ok: ['serbuk_bengkel_segar', 'lampu_bengkel', 't_lim_lampu'], success: [
              { t: '...' },
              { t: 'Baik, baik! Semalam saya memang mampir ke bengkel. Sebentar saja, mengambil perkakas.', fx: A => { A.flag('owner_bengkel', 1); A.note('t_owner_bengkel'); } },
              { t: 'Apa salahnya orang datang ke bengkelnya sendiri?' },
            ] } },
          ];
        } },
        { id: 'slamet', label: 'Tentang Slamet', lines: A => {
          if (!A.has('struk_apotek')) return [{ t: 'Anak itu rajin, saya akui. Tapi orang tidak berubah, Tuan. Sekali pencuri...' }];
          if (A.flag('owner_alibi')) return [{ t: 'Ya, ya, ia di Meester Cornelis. Tapi saya tetap tidak percaya bekas napi.' }];
          return [{ t: 'Slamet bilang ia di Meester Cornelis semalam? Bohong! Ia pasti kembali diam-diam dengan kunci duplikat.', contra: { ok: ['struk_apotek'], success: [
            { t: 'Pukul 21.40... di Meester Cornelis?' },
            { t: 'Hmph. Ya... dari sana ke Pasar Baroe naik trem hampir satu jam.', fx: A => A.flag('owner_alibi', 1) },
            { t: 'Tapi tetap saja, Tuan, saya tidak percaya bekas napi.' },
          ] } }];
        } },
        { id: 'rapi', label: 'Kenapa toko dirapikan?', when: A => A.flag('tokoAfter') && (A.has('lantai_disapu') || A.has('kalender_disobek') || A.has('t_slamet_sapu')), lines: () => [
          { t: 'Toko harus rapi, Tuan. Hari ini ada pembeli penting.' },
          { t: 'Kalender? Oktober sudah hampir habis. Apa anehnya?' },
        ] },
      ],
    },
    slamet: {
      name: 'Slamet', role: 'Pegawai baru',
      reactDefault: 'Maaf, Tuan, saya tidak tahu soal itu.',
      defensive: ['Saya... saya tidak paham maksud Tuan.', 'Kenapa Tuan menunjukkan itu pada saya?'],
      closeLine: 'Maaf, Tuan, saya harus kembali bekerja. (Ia menghindari tatapanmu.)',
      react: {
        serbuk_jati: [
          { t: '(Ia mencium serbuk itu.) Ini serbuk jati, Tuan. Baunya khas.' },
          { t: 'Pasti dari bengkel Pak Darmawan di Gang Kenari, persis di belakang toko. Hanya beliau yang bekerja kayu; saya dilarang masuk ke sana.', fx: A => { A.note('t_slamet_bengkel'); A.unlock('bengkel'); } },
        ],
        sampel_debu: [{ t: 'Debu? Aneh... kemarin sore saya sudah menyapu lantai itu.' }],
        struk_apotek: [{ t: 'Itu struk saya, Tuan. Apotek Sentosa, dekat rumah.' }],
        surat_glodok: [{ t: '(Ia menunduk.) Dari mana Tuan dapat itu...' }],
        surat_gagak: [{ t: '"K."? Saya tidak tahu, Tuan. Tapi minggu lalu ada tamu bertopi hitam yang lama bicara berdua dengan Pak Darmawan.' }],
        polis: [{ t: 'Saya tidak paham urusan asuransi, Tuan.' }],
        kunci_etalase: [{ t: 'Itu kunci etalase. Biasanya tergantung di kait.' }],
        t_owner_tuduh: [{ t: 'Pak Darmawan bilang begitu? (Matanya berkaca-kaca.) Saya tidak mencuri, Tuan.' }],
        peti_gembok_baru: [{ t: 'Peti di bengkel? Saya tidak pernah masuk ke sana, Tuan.' }],
      },
      topics: [
        { id: 'siapa', label: 'Siapa kamu?', lines: () => [
          { t: 'Saya Slamet, Tuan. Baru dua bulan kerja di sini: membersihkan toko dan mengantar jam pesanan.' },
        ] },
        { id: 'semalam', label: 'Di mana kamu semalam?', lines: () => [
          { t: 'Saya pulang pukul enam lewat sedikit, naik trem ke Meester Cornelis.', fx: A => A.note('t_slamet_pulang') },
          { t: 'Ibu saya demam tinggi. Malamnya saya ke apotek menebus pil kina.' },
          { t: 'Ini struknya, Tuan. Masih saya simpan.', fx: A => A.give('struk_apotek') },
        ] },
        { id: 'masa_lalu', label: 'Ceritakan masa lalumu.', lines: A => {
          if (A.flag('slamet_napi')) return [{ t: 'Ya, Tuan, saya pernah di Glodok. Tapi saya sudah berubah. Sungguh.' }];
          const contra = { ok: ['surat_glodok'], success: [
            { t: '...' },
            { t: 'Maaf, Tuan. Ya, saya pernah dua tahun di Glodok karena mencuri sepeda. Enam tahun lalu.', fx: A => { A.flag('slamet_napi', 1); A.note('t_slamet_napi'); } },
            { t: 'Pak Darmawan tahu. Ia menerima saya justru karena saya mau dibayar murah.' },
          ] };
          return [
            { t: 'Masa lalu saya? Saya orang baik-baik, Tuan.' },
            { t: 'Saya tidak pernah berurusan dengan polisi.', contra },
          ];
        } },
        { id: 'kunci', label: 'Tentang kunci etalase', when: A => A.has('kunci_tergantung'), lines: () => [
          { t: 'Kunci itu selalu tergantung di kait samping etalase. Pak Darmawan yang menaruhnya di situ.' },
          { t: 'Saya tidak pernah membawanya pulang, Tuan. Sumpah.' },
        ] },
        { id: 'lantai', label: 'Siapa yang membersihkan toko?', lines: A => {
          const l = [
            { t: 'Saya, Tuan. Setiap sore sebelum tutup saya menyapu.' },
            { t: 'Kemarin sore pun begitu. Lantai depan etalase sudah bersih ketika kami mengunci toko.', fx: A => A.note('t_slamet_lantai') },
          ];
          if (A.flag('tokoAfter')) l.push({ t: 'Tadi juga, setelah Tuan pergi, Pak Darmawan menyuruh saya menyapu seluruh lantai. Katanya ada pembeli penting.', fx: A => A.note('t_slamet_sapu') });
          return l;
        } },
      ],
    },
    lim: {
      name: 'Nyonya Lim Siok Lan', role: 'Pelanggan tetap',
      reactDefault: 'Maaf, Tuan, saya tidak tahu apa-apa tentang itu.',
      defensive: ['Saya tidak mengerti, Tuan.'],
      closeLine: 'Saya lelah, Tuan. Kita lanjutkan nanti saja.',
      react: {
        surat_gagak: [{ t: 'Tulisan tangannya rapi sekali, seperti juru tulis kantor. Saya tidak kenal.' }],
        struk_apotek: [{ t: 'Apotek Sentosa di Meester Cornelis? Jauh sekali dari sini.' }],
        serbuk_jati: [{ t: 'Baunya seperti bengkel Tuan Darmawan. Ia sering menggergaji sampai malam.' }],
        surat_glodok: [{ t: 'Masa lalu seseorang bukan masa depannya, Tuan.' }],
        polis: [{ t: 'Ya, agen asuransi itulah yang datang bulan lalu.' }],
      },
      topics: [
        { id: 'siapa', label: 'Perkenalan', lines: () => [
          { t: 'Saya Lim Siok Lan, pensiunan guru. Jam saku saya diservis di toko Tuan Darmawan setiap Sabtu.' },
          { t: 'Silakan duduk, Tuan Detektif. Teh?' },
        ] },
        { id: 'semalam', label: 'Apa Nyonya lewat toko jam semalam?', lines: () => [
          { t: 'Ya. Saya pulang dari kebaktian malam. Ketika saya lewat depan toko, lonceng gereja baru berdentang setengah sepuluh.' },
          { t: 'Lampu di dalam toko menyala. Aneh, biasanya gelap. Lalu saya lihat seseorang membawa bungkusan kain besar ke gang belakang.' },
          { t: 'Di sana cuma ada bengkel Tuan Darmawan, di Gang Kenari.', fx: A => { A.note('t_lim_lampu'); A.unlock('bengkel'); } },
          { t: 'Wajahnya? Terlalu gelap. Tapi badannya agak gemuk, jalannya pelan.' },
        ] },
        { id: 'slamet', label: 'Tentang Slamet', lines: () => [
          { t: 'Anak itu sopan sekali. Sore kemarin, kira-kira pukul enam lewat seperempat, saya lihat ia naik trem ke arah Meester Cornelis.', fx: A => A.note('t_lim_trem') },
        ] },
        { id: 'darmawan', label: 'Tentang Tuan Darmawan', lines: () => [
          { t: 'Kasihan beliau. Tokonya sepi sejak toko jam baru dibuka di Noordwijk.' },
          { t: 'Bulan lalu ada agen asuransi datang menilai jam angsanya. Tuan Darmawan bilang polisnya habis akhir bulan ini, dan ia tak sanggup memperpanjang.', fx: A => A.note('t_lim_asuransi') },
        ] },
      ],
    },
  },

  // ---------- Kombinasi barang ----------
  combos: [
    { a: 'lup', b: 'sampel_debu', fx: A => {
      A.take('sampel_debu'); A.give('serbuk_jati');
      A.say('Di bawah lup, "debu" itu ternyata bukan debu jalanan: serbuk kayu halus berwarna cokelat keemasan, harum minyak. Serbuk jati yang baru digergaji.');
    } },
    { a: 'bedak', b: 'kunci_etalase', fx: A => {
      A.say('Kutaburkan bedak tipis-tipis dan kusapu dengan kuas... Tak ada satu sidik jari pun. Bahkan milik pemiliknya. Kunci ini sengaja dilap.');
      A.note('kunci_bersih');
    } },
    { a: 'pensil', b: 'lembar_november', fx: A => {
      A.say('Kugosokkan pensil miring di atas bekas tekanan itu. Perlahan muncul lingkaran, angka, dan tulisan dari lembar yang disobek.');
      A.give('gosokan_kalender'); A.doc('gosokan_kalender');
    } },
    { a: 'lup', b: 'lembar_november', fx: A => A.say('Ada bekas tekanan pena berbentuk lingkaran, tapi terlalu samar untuk dibaca dengan mata.') },
    { a: 'lup', b: 'kunci_etalase', fx: A => A.say('Tak ada goresan baru di gerigi kunci. Sidik jari tak tampak dengan mata telanjang.') },
    { a: 'lup', b: 'struk_apotek', fx: A => A.say('Cap apotek dan jamnya dicetak mesin, bukan tulisan tangan. Sulit dipalsukan.') },
    { a: 'lup', b: 'surat_gagak', fx: A => A.say('Cap lilin hitam bergambar burung gagak. Kertasnya mahal, bukan kertas pasar.') },
    { a: 'lup', b: 'serbuk_jati', fx: A => A.say('Serbuk jati yang halus dan segar.') },
    { a: 'bedak', b: 'surat_gagak', fx: A => A.say('Kertas berserat seperti ini tak menahan sidik jari dengan jelas. Sia-sia.') },
  ],

  // ---------- Isian rumpang untuk rekonstruksi ----------
  words: [
    { w: 'Tuan Darmawan' }, { w: 'Slamet' }, { w: 'pencuri dari luar' },
    { w: 'Nyonya Lim', when: A => A.isUnlocked('rumah_lim') },
    { w: '18.00', when: A => A.has('t_owner_tutup') },
    { w: '07.00', when: A => A.has('t_owner_tutup') },
    { w: '21.30', when: A => A.has('t_lim_lampu') },
    { w: '21.40', when: A => A.has('struk_apotek') },
    { w: 'kunci etalase', when: A => A.has('kunci_tergantung') || A.has('kunci_etalase') },
    { w: 'kunci duplikat', when: A => A.has('t_owner_tuduh') },
    { w: 'linggis', when: A => A.flag('linggis_seen') },
    { w: 'bengkel di Gang Kenari', when: A => A.isUnlocked('bengkel') },
    { w: 'rumah di Meester Cornelis', when: A => A.has('t_slamet_pulang') },
    { w: 'Apotek Sentosa', when: A => A.has('struk_apotek') },
    { w: 'debu jalanan', when: A => A.has('sampel_debu') || A.has('serbuk_jati') },
    { w: 'kayu jati', when: A => A.has('serbuk_jati') },
    { w: 'terlilit utang', when: A => A.has('surat_bank') || A.has('buku_kas') || A.has('t_owner_bangkrut') },
    { w: 'dendam pada majikan', when: A => A.has('t_owner_tuduh') },
    { w: 'uang asuransi', when: A => A.has('polis') || A.has('t_lim_asuransi') },
    { w: 'bayaran dari "K."', when: A => A.has('surat_gagak') },
    { w: '26 Oktober' },
    { w: '28 Oktober', when: A => A.has('kalender_28') || A.has('gosokan_kalender') || A.has('polis') },
    { w: '30 Oktober', when: A => A.has('surat_gagak') },
    { w: '1 November', when: A => A.has('surat_bank') || A.has('buku_kas') },
  ],
  recon: [
    'Pada malam 26 Oktober 1926, sekitar pukul ', { b: 'waktu', a: '21.30' }, ', ',
    { b: 'pelaku', a: 'Tuan Darmawan' }, ' diam-diam kembali ke toko yang sudah dikunci. Ia membuka etalase dengan ',
    { b: 'alat', a: 'kunci etalase' }, ', lalu membawa jam De Zwaan ke ', { b: 'tempat', a: 'bengkel di Gang Kenari' },
    '. Serbuk ', { b: 'bukti', a: 'kayu jati' }, ' dari sepatunya tertinggal di depan etalase. Ia melakukannya karena ',
    { b: 'motif', a: 'terlilit utang' }, ', dan berharap mencairkan ', { b: 'tujuan', a: 'uang asuransi' },
    ' sebelum polisnya berakhir pada ', { b: 'tanggal', a: '28 Oktober' }, '.',
  ],

  // ---------- Hint berjenjang (samar → jelas) ----------
  hints: [
    { id: 'debu', done: A => A.has('serbuk_jati'), tiers: [
      'Lantai toko menyimpan sesuatu yang tidak sebersih seharusnya.',
      'Debu di depan etalase layak diambil dan diperiksa lebih dekat.',
      'Klik Lup di inventaris, pilih "Gabungkan", lalu klik Sampel debu.'] },
    { id: 'asal', done: A => A.isUnlocked('bengkel'), tiers: [
      'Serbuk itu pasti berasal dari suatu tempat. Siapa yang mungkin mengenalinya?',
      'Pegawai toko paling paham seluk-beluk tempat ini.',
      'Bicara dengan Slamet, lalu seret Serbuk kayu jati ke kotak dialog.'] },
    { id: 'bank', done: A => A.has('surat_bank'), tiers: [
      'Pemilik toko biasa menyimpan urusan pribadinya dekat uang.',
      'Meja kasir punya laci.',
      'Klik meja kasir, lalu laci di bawahnya, lalu amplop di dalamnya.'] },
    { id: 'bangkrut', done: A => A.has('t_owner_bangkrut'), tiers: [
      'Benarkah semua yang dikatakan pemilik tentang usahanya?',
      'Ketika ia bilang usahanya lancar, kamu memegang bukti sebaliknya.',
      'Tanya Darmawan "Bagaimana keadaan usaha Tuan?", lalu seret Surat Bank ke kotak dialog saat ia bilang usahanya lancar.'] },
    { id: 'saksi', done: A => A.isUnlocked('rumah_lim'), tiers: [
      'Mungkin ada orang lain yang melihat sesuatu malam itu.',
      'Toko ini mencatat pelanggan tetapnya.',
      'Baca buku servis di meja kasir.'] },
    { id: 'lampu', done: A => A.has('t_lim_lampu'), tiers: [
      'Ny. Lim pulang lewat depan toko malam itu.',
      'Kunjungi rumah Ny. Lim lewat Peta, lalu tanyakan apa yang ia lihat semalam.'] },
    { id: 'alibi', done: A => A.has('struk_apotek'), tiers: [
      'Pegawai baru dicurigai. Di mana ia semalam?',
      'Tanya Slamet "Di mana kamu semalam?".'] },
    { id: 'polis', done: A => A.has('polis'), tiers: [
      'Di bengkel, dokumen penting biasanya tersimpan di meja kerja.',
      'Buka laci meja kerja di bengkel.'] },
    { id: 'tanggal', done: A => A.has('kalender_28') || A.has('gosokan_kalender'), tiers: [
      'Ada tanggal penting yang ditandai di dinding toko.',
      'Periksa kalender toko dengan saksama.',
      'Jika kalendernya sudah dibalik: ambil lembar November, lalu gabungkan dengan Pensil.'] },
    { id: 'ded_bengkel', done: A => A.has('d_dari_bengkel'), tiers: [
      'Buka Papan Deduksi. Dari mana serbuk di depan etalase berasal?',
      'Hubungkan Serbuk kayu jati dengan kartu yang menjelaskan siapa pemakai bengkel itu.'] },
    { id: 'ded_uang', done: A => A.has('d_butuh_uang'), tiers: [
      'Di Papan Deduksi, apa yang membuat seseorang terdesak?',
      'Hubungkan Surat Bank dengan pengakuan Darmawan atau dengan Buku kas.'] },
    { id: 'ded_polis', done: A => A.has('d_asuransi'), tiers: [
      'Di Papan Deduksi, kenapa jam itu hilang tepat minggu ini?',
      'Hubungkan Polis asuransi dengan tanggal yang ditandai di kalender.'] },
    { id: 'final', done: A => A.has('d_final'), tiers: [
      'Kamu punya kesimpulan tentang tempat, kebutuhan, dan waktu. Apa artinya jika ketiganya digabung?',
      'Hubungkan tiga kesimpulan: Pelaku datang dari bengkel, Darmawan terdesak utang, dan Tepat sebelum polis habis.'] },
    { id: 'tutup', done: () => false, tiers: [
      'Buktimu sudah cukup. Klik "Tutup Kasus" dan susun rekonstruksi kejadiannya.'] },
  ],

  epilogue: [
    'Komisaris Wiradinata membaca rekonstruksimu dua kali, lalu mengangguk pelan.',
    'Siang itu juga polisi membongkar peti bergembok di bengkel Gang Kenari. Di dalamnya, terbungkus sarung batik, berdiri jam De Zwaan dengan angsa perunggunya yang berkilat.',
    'Darmawan tak lagi membantah. Utangnya menumpuk; polis asuransi yang nilainya ia naikkan akan habis pada 28 Oktober. Ia berharap mendapat uang asuransi, lalu menjual jam itu diam-diam kepada "K.".',
    'Slamet dibebaskan dari segala tuduhan. Catatan lamanya tak pernah ada hubungannya dengan malam itu.',
  ],
  teaser: 'Di dasar peti terselip sehelai kartu kecil bercap lilin hitam bergambar gagak. Di baliknya tertulis: "Waktu selalu berpihak pada yang sabar. — K."',
};

// Pengamatan yang dipakai di lebih dari satu layar.
function takeKey(A) {
  if (A.has('kunci_etalase')) { A.say('Kaitnya kosong. Kunci etalase sedang kubawa untuk diperiksa.'); return; }
  A.say('Kunci kecil kuningan masih tergantung di kait samping etalase. Kuambil untuk diperiksa.');
  A.note('kunci_tergantung');
  A.give('kunci_etalase');
}

function floorDust(A) {
  if (A.flag('tokoAfter')) {
    if (A.flag('seen_dust')) { A.say('Tadi di sini ada debu kecokelatan. Sekarang lantainya sudah disapu bersih.'); A.note('lantai_disapu'); }
    else A.say('Lantai papan yang mengilap. Bersih.');
    return;
  }
  A.flag('seen_dust', 1);
  if (A.has('sampel_debu') || A.has('serbuk_jati')) { A.say('Debu kecokelatan di depan etalase. Sampelnya sudah kuambil.'); return; }
  A.say('Ada debu kecokelatan di lantai depan etalase, lebih halus dari debu jalanan. Kuambil sedikit dengan kertas.');
  A.give('sampel_debu');
}

function footprints(A) {
  if (A.flag('tokoAfter')) { A.say('Lantai papan yang mengilap. Bersih.'); return; }
  A.say('Serbuk tipis berceceran membentuk jejak samar, dari etalase ke arah pintu belakang.');
  A.note('jejak_pintu');
}
