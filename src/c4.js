/* ===== BAB 4 JOIN ===== */
const CROSS_VIZ = `<div class="venn"><svg width="230" height="150" viewBox="0 0 230 150" role="img" aria-label="Diagram CROSS JOIN">
<g font-size="11" fill="var(--fg)"><text x="10" y="30">Nasi</text><text x="10" y="75">Lontong</text><text x="10" y="120">Ketupat</text>
<text x="160" y="20">Ayam</text><text x="160" y="57">Telur</text><text x="160" y="94">Tempe</text><text x="160" y="131">Ikan</text></g>
<g stroke="var(--venn-fill)" stroke-width="1.2" opacity=".8">
${[26, 71, 116].map(y => [16, 53, 90, 127].map(y2 => `<line x1="60" y1="${y}" x2="155" y2="${y2}"/>`).join('')).join('')}</g></svg>
<div style="flex:1;min-width:220px"><p>CROSS JOIN nggak cocok digambar sebagai Venn, karena <b>nggak ada pencocokan</b>. Setiap baris kiri dipasangkan dengan <b>setiap</b> baris kanan: 3 × 4 = 12 garis = 12 baris hasil.</p></div></div>`;

CH.push({
  id: 'bab4', title: 'Bab 4 · JOIN',
  lead: 'JOIN = menggabungkan dua tabel atau lebih berdasarkan kolom yang nyambung (biasanya foreign key ke primary key).',
  intro: `<div class="analogi">📋📋 Bayangkan kamu pegang <b>dua daftar absen</b>: daftar mata kuliah (ada kolom id_dosen) dan daftar dosen. JOIN = mencocokkan baris dua daftar itu lewat kolom yang sama (id_dosen), lalu ditulis berdampingan dalam satu baris.</div>
<p>Di bab ini contoh Venn selalu memakai <b>matakuliah</b> (kiri) dan <b>dosen</b> (kanan). Ingat datanya: IF302 &amp; IF303 nggak punya dosen, sedangkan Hendra (7) &amp; Maya (8) nggak mengajar apa pun.</p>
<table class="cmp"><tr><th>JOIN</th><th>Yang diambil</th><th>Jumlah baris (matakuliah vs dosen)</th></tr>
<tr><td>INNER JOIN</td><td>hanya yang punya pasangan</td><td>8</td></tr>
<tr><td>LEFT JOIN</td><td>semua kiri + pasangannya</td><td>10</td></tr>
<tr><td>RIGHT JOIN</td><td>semua kanan + pasangannya</td><td>10</td></tr>
<tr><td>FULL OUTER JOIN</td><td>semua dari dua sisi</td><td>12</td></tr>
<tr><td>CROSS JOIN</td><td>semua kombinasi</td><td>10 × 9 = 90</td></tr></table>`,
  subs: [
  {
    id: '4.1', t: 'INNER JOIN',
    konsep: `<p>INNER JOIN mengambil baris yang <b>punya pasangan di kedua tabel</b>. Yang nggak punya pasangan dibuang dari dua sisi.</p>
<div class="analogi">💑 Acara pasangan dansa: hanya yang datang <b>berpasangan</b> yang boleh masuk. Yang datang sendirian (matkul tanpa dosen, dosen tanpa matkul) nggak ikut.</div>
<p><b>Alias tabel</b>: <code>FROM matakuliah m</code> artinya tabel matakuliah dipanggil "m". Lalu <code>m.nama_mk</code> = kolom nama_mk milik tabel m. Ini wajib kalau dua tabel punya kolom bernama sama (misal kolom <code>nama</code> ada di mahasiswa dan dosen).</p>`,
    sintaks: { code: `SELECT a.kolom, b.kolom
FROM tabel_a a
INNER JOIN tabel_b b ON a.kolom_kunci = b.kolom_kunci;
-- INNER boleh dihilangkan: JOIN = INNER JOIN`, ket: [['tabel_a a', 'a adalah alias (nama pendek).'], ['INNER JOIN tabel_b b', 'tabel kedua yang digabung.'], ['ON a.x = b.x', 'aturan pencocokan: biasanya FK = PK.']] },
    contoh: [
      { sql: 'SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM matakuliah m\nINNER JOIN dosen d ON m.id_dosen = d.id_dosen;', ket: '8 baris. IF302 dan IF303 hilang (id_dosen NULL, nggak ada pasangan). Hendra dan Maya juga nggak muncul (nggak ada matkul yang menunjuk mereka).' },
      { sql: 'SELECT mhs.nama, k.kode_mk, k.nilai\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim;', ket: '15 baris, sama dengan jumlah KRS. Andi muncul 3 kali karena punya 3 KRS. Kartika, Lukman, Mira, Nanda hilang karena belum KRS.' },
      { sql: 'SELECT mhs.nama, k.kode_mk, k.nilai\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nWHERE k.nilai >= 85\nORDER BY k.nilai DESC;', ket: 'JOIN bisa diikuti WHERE dan ORDER BY seperti biasa. 5 KRS bernilai 85 ke atas.' }
    ],
    viz: { type: 'venn', join: 'inner' },
    salah: ['Lupa ON. Di MySQL, <code>JOIN</code> tanpa ON = CROSS JOIN (semua kombinasi), hasilnya meledak.', 'Error "Column \'nama\' in field list is ambiguous": kolom nama ada di dua tabel. Tulis <code>m.nama</code> atau <code>d.nama</code>.', 'Mencocokkan kolom yang salah: <code>ON m.id_dosen = d.nama</code>.', 'Sudah pakai alias, tapi masih menulis nama tabel asli: <code>FROM dosen d ... WHERE dosen.nama</code>. Setelah diberi alias, pakai aliasnya.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>nama_mk</code> dan nama dosen pengajarnya (hanya matkul yang punya dosen).', a: 'SELECT m.nama_mk, d.nama\nFROM matakuliah m\nJOIN dosen d ON m.id_dosen = d.id_dosen;', h: ['Hanya yang punya pasangan = INNER JOIN.', 'Kolom penyambung: id_dosen.', 'FROM matakuliah m JOIN dosen d ON m.id_dosen = d.id_dosen'], ex: '8 baris.' },
      { lv: 'sedang', q: 'Tampilkan <code>nim</code>, <code>nama</code> mahasiswa, dan <code>kode_mk</code> dari semua KRS semester 3.', a: 'SELECT mhs.nim, mhs.nama, k.kode_mk\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nWHERE k.semester = 3;', h: ['JOIN mahasiswa dan krs lewat nim.', 'Tambahkan WHERE k.semester = 3.', 'Kolom nim ada di dua tabel, pilih salah satu: mhs.nim.'], ex: '7 KRS semester 3: Andi 2×, Budi, Citra 2×, Fitri 2×.' },
      { lv: 'sulit', q: "Tampilkan <code>kode_mk</code>, <code>nama_mk</code>, dan <code>nilai</code> dari semua KRS milik mahasiswa bernim '2101001', urutkan nilai tertinggi dulu.", a: "SELECT k.kode_mk, m.nama_mk, k.nilai\nFROM krs k\nJOIN matakuliah m ON k.kode_mk = m.kode_mk\nWHERE k.nim = '2101001'\nORDER BY k.nilai DESC;", order: true, h: ['nama_mk ada di tabel matakuliah, nilai di krs.', 'JOIN lewat kode_mk.', "WHERE k.nim = '2101001' ORDER BY k.nilai DESC"], ex: 'Jaringan Komputer 90, Basis Data 85, Algoritma 78.' }
    ],
    ringkas: 'INNER JOIN menggabungkan dua tabel lewat ON dan hanya menyisakan baris yang punya pasangan di kedua sisi.'
  },
  {
    id: '4.2', t: 'LEFT JOIN',
    konsep: `<p>LEFT JOIN mengambil <b>semua baris tabel kiri</b> (yang ditulis setelah FROM). Kalau punya pasangan di kanan, ditempel. Kalau nggak, kolom-kolom kanan diisi <b>NULL</b>.</p>
<div class="analogi">📢 Guru memanggil <b>semua murid</b> di daftar kelas (kiri) dan mencatat tugas yang dikumpulkan (kanan). Murid yang belum mengumpulkan tetap dipanggil, kolom tugasnya kosong.</div>
<p>Trik paling penting: <b>LEFT JOIN + WHERE kanan IS NULL</b> = mencari baris kiri yang <b>nggak punya pasangan</b> (mahasiswa yang belum KRS, matkul yang belum diambil).</p>`,
    sintaks: { code: `SELECT a.kolom, b.kolom
FROM tabel_kiri a
LEFT JOIN tabel_kanan b ON a.kunci = b.kunci;

-- cari yang nggak punya pasangan
SELECT a.kolom
FROM tabel_kiri a
LEFT JOIN tabel_kanan b ON a.kunci = b.kunci
WHERE b.kunci IS NULL;`, ket: [['LEFT JOIN', 'sama dengan LEFT OUTER JOIN.'], ['tabel kiri', 'yang ditulis duluan (setelah FROM). Urutan menentukan hasil!']] },
    contoh: [
      { sql: 'SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM matakuliah m\nLEFT JOIN dosen d ON m.id_dosen = d.id_dosen;', ket: '10 baris (semua matkul). IF302 dan IF303 tetap muncul dengan dosen NULL (baris kuning).', hl: 'null' },
      { sql: 'SELECT mhs.nim, mhs.nama, k.kode_mk, k.nilai\nFROM mahasiswa mhs\nLEFT JOIN krs k ON mhs.nim = k.nim;', ket: '19 baris = 15 KRS + 4 mahasiswa tanpa KRS (Kartika, Nanda, Lukman, Mira) yang kode_mk-nya NULL. Perhatikan juga Fitri dan Indra: kode_mk ada tapi nilai NULL, itu karena belum dinilai, bukan karena nggak punya pasangan.', hl: 'null' },
      { sql: 'SELECT mhs.nim, mhs.nama\nFROM mahasiswa mhs\nLEFT JOIN krs k ON mhs.nim = k.nim\nWHERE k.id IS NULL;', ket: 'Hanya baris tanpa pasangan: 4 mahasiswa yang belum KRS. Ini pola yang sangat sering keluar di tes.' }
    ],
    viz: [{ type: 'venn', join: 'left' }, '<p style="margin-top:14px"><b>Variasi: LEFT JOIN + WHERE kanan IS NULL</b></p>', { type: 'venn', join: 'leftonly' }],
    salah: ['Menaruh syarat tabel kanan di WHERE: <code>LEFT JOIN krs k ON ... WHERE k.semester = 1</code>. Baris NULL (yang nggak punya KRS) ikut terbuang, jadi hasilnya sama seperti INNER JOIN. Kalau mau tetap menampilkan semua, taruh syaratnya di <b>ON</b>: <code>ON mhs.nim = k.nim AND k.semester = 1</code>.', 'Tertukar kiri-kanan. <code>FROM krs LEFT JOIN mahasiswa</code> beda hasil dengan <code>FROM mahasiswa LEFT JOIN krs</code>.', 'Cek "nggak punya pasangan" pakai kolom yang memang bisa NULL (misal k.nilai). Pakai kolom kunci tabel kanan (k.id atau k.nim).'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan semua dosen (<code>nama</code>) beserta <code>kode_mk</code> yang mereka ajar. Dosen yang nggak mengajar tetap muncul.', a: 'SELECT d.nama, m.kode_mk\nFROM dosen d\nLEFT JOIN matakuliah m ON d.id_dosen = m.id_dosen;', h: ['Semua dosen = dosen di kiri.', 'FROM dosen d LEFT JOIN matakuliah m', 'ON d.id_dosen = m.id_dosen'], ex: '10 baris: Siti muncul 2×, Hendra dan Maya dengan kode_mk NULL.' },
      { lv: 'sedang', q: 'Tampilkan <code>kode_mk</code> dan <code>nama_mk</code> mata kuliah yang <b>belum pernah diambil</b> mahasiswa mana pun.', a: 'SELECT m.kode_mk, m.nama_mk\nFROM matakuliah m\nLEFT JOIN krs k ON m.kode_mk = k.kode_mk\nWHERE k.id IS NULL;', h: ['Belum pernah diambil = nggak punya pasangan di krs.', 'matakuliah di kiri, krs di kanan.', 'WHERE k.id IS NULL'], ex: 'IF301, IF302, IF303.' },
      { lv: 'sulit', q: 'Tampilkan semua mahasiswa angkatan 2023 (<code>nama</code>) beserta <code>kode_mk</code> KRS <b>semester 1</b> mereka. Mahasiswa yang nggak punya KRS semester 1 <b>tetap muncul</b> dengan kode_mk NULL.', a: 'SELECT mhs.nama, k.kode_mk\nFROM mahasiswa mhs\nLEFT JOIN krs k ON mhs.nim = k.nim AND k.semester = 1\nWHERE mhs.angkatan = 2023;', h: ['Syarat angkatan (tabel kiri) boleh di WHERE.', 'Syarat semester (tabel kanan) harus di ON, bukan WHERE.', 'LEFT JOIN krs k ON mhs.nim = k.nim AND k.semester = 1'], ex: 'Hana, Indra, Joko punya KRS semester 1. Kartika dan Nanda muncul dengan NULL. Kalau syarat semester ditaruh di WHERE, Kartika dan Nanda hilang.' }
    ],
    ringkas: 'LEFT JOIN mempertahankan semua baris tabel kiri dan mengisi NULL kalau pasangannya nggak ada; tambah WHERE kanan IS NULL untuk mencari yang nggak punya pasangan.'
  },
  {
    id: '4.3', t: 'RIGHT JOIN',
    konsep: `<p>RIGHT JOIN = kebalikan LEFT JOIN: <b>semua baris tabel kanan</b> diambil, pasangan dari kiri ditempel, yang nggak ada diisi NULL.</p>
<div class="analogi">🔁 <code>A RIGHT JOIN B</code> hasilnya sama dengan <code>B LEFT JOIN A</code> (hanya urutan kolomnya beda). Karena itu di praktik orang lebih sering menulis LEFT JOIN dan menukar posisi tabel.</div>`,
    sintaks: { code: `SELECT a.kolom, b.kolom
FROM tabel_kiri a
RIGHT JOIN tabel_kanan b ON a.kunci = b.kunci;`, ket: [['RIGHT JOIN', 'sama dengan RIGHT OUTER JOIN.']] },
    mysql: ['MySQL mendukung RIGHT JOIN dari dulu. SQLite baru mendukung RIGHT JOIN sejak versi 3.39 (2022). Playground ini memakai SQLite baru, jadi RIGHT JOIN bisa dijalankan.'],
    contoh: [
      { sql: 'SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM matakuliah m\nRIGHT JOIN dosen d ON m.id_dosen = d.id_dosen;', ket: '10 baris: semua 9 dosen muncul (Siti 2×). Hendra dan Maya punya kode_mk NULL. IF302/IF303 hilang karena nggak punya pasangan di dosen.', hl: 'null' },
      { sql: 'SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM dosen d\nLEFT JOIN matakuliah m ON m.id_dosen = d.id_dosen;', ket: 'Hasilnya sama persis dengan contoh 1, hanya ditulis sebagai LEFT JOIN dengan tabel ditukar.', hl: 'null' },
      { sql: 'SELECT d.nama\nFROM matakuliah m\nRIGHT JOIN dosen d ON m.id_dosen = d.id_dosen\nWHERE m.kode_mk IS NULL;', ket: 'Pola "nggak punya pasangan" versi RIGHT: dosen yang nggak mengajar.' }
    ],
    viz: { type: 'venn', join: 'right' },
    salah: ['Mengira RIGHT JOIN mengambil "yang kanan saja". Yang diambil: semua kanan + pasangannya dari kiri.', 'Mencampur LEFT dan RIGHT dalam satu query panjang sampai bingung sendiri. Pilih satu gaya (LEFT) lebih aman.'],
    latihan: [
      { lv: 'mudah', q: 'Pakai RIGHT JOIN: tampilkan semua dosen (<code>nama</code>) beserta <code>nama_mk</code> yang mereka ajar. Tabel matakuliah ditulis di kiri.', a: 'SELECT d.nama, m.nama_mk\nFROM matakuliah m\nRIGHT JOIN dosen d ON m.id_dosen = d.id_dosen;', h: ['FROM matakuliah m RIGHT JOIN dosen d', 'ON m.id_dosen = d.id_dosen', 'Pilih d.nama dan m.nama_mk.'], ex: '10 baris, Hendra dan Maya dengan nama_mk NULL.' },
      { lv: 'sedang', q: 'Pakai RIGHT JOIN, tampilkan <code>nama</code> dan <code>keahlian</code> dosen yang <b>nggak</b> mengajar mata kuliah apa pun.', a: 'SELECT d.nama, d.keahlian\nFROM matakuliah m\nRIGHT JOIN dosen d ON m.id_dosen = d.id_dosen\nWHERE m.kode_mk IS NULL;', h: ['Semua dosen di kanan.', 'Yang nggak punya pasangan: kolom kunci kiri IS NULL.', 'WHERE m.kode_mk IS NULL'], ex: 'Hendra Wijaya (Keamanan Siber) dan Maya Sari (Interaksi Manusia Komputer).' },
      { lv: 'sulit', q: 'Query ini memakai RIGHT JOIN: <code>SELECT k.id, m.nama_mk FROM krs k RIGHT JOIN matakuliah m ON k.kode_mk = m.kode_mk;</code> Tulis ulang memakai <b>LEFT JOIN</b> dengan hasil yang sama.', a: 'SELECT k.id, m.nama_mk\nFROM matakuliah m\nLEFT JOIN krs k ON k.kode_mk = m.kode_mk;', h: ['A RIGHT JOIN B = B LEFT JOIN A.', 'Tukar posisi: matakuliah jadi kiri.', 'FROM matakuliah m LEFT JOIN krs k ON ...'], ex: '18 baris = 15 KRS + 3 matkul tanpa KRS (id NULL).' }
    ],
    ringkas: 'RIGHT JOIN mempertahankan semua baris tabel kanan, dan A RIGHT JOIN B sama dengan B LEFT JOIN A.'
  },
  {
    id: '4.4', t: 'FULL OUTER JOIN (dan simulasinya dengan UNION)',
    konsep: `<p>FULL OUTER JOIN = <b>semua baris dari kedua tabel</b>. Yang punya pasangan digabung; yang nggak punya tetap muncul dengan NULL di sisi lainnya.</p>
<div class="warn"><b>⚠ Di MySQL ditulis begini:</b> MySQL <b>nggak punya</b> FULL OUTER JOIN! Ini sering keluar di tes. Caranya: gabungkan hasil LEFT JOIN dan RIGHT JOIN dengan <b>UNION</b>.</div>
<p><b>UNION</b> = menumpuk hasil dua SELECT jadi satu, sekaligus membuang baris kembar. <b>UNION ALL</b> = menumpuk tanpa membuang yang kembar. Syarat: jumlah kolom dan urutan tipenya harus sama.</p>
<div class="analogi">🧷 Seperti menggabungkan <b>dua daftar tamu</b> jadi satu: UNION mencoret nama yang tertulis dua kali, UNION ALL membiarkan dobel.</div>`,
    sintaks: { code: `-- Simulasi FULL OUTER JOIN di MySQL
SELECT a.kolom, b.kolom
FROM a LEFT JOIN b ON a.kunci = b.kunci
UNION
SELECT a.kolom, b.kolom
FROM a RIGHT JOIN b ON a.kunci = b.kunci;`, ket: [['LEFT JOIN', 'semua kiri (+ pasangan).'], ['RIGHT JOIN', 'semua kanan (+ pasangan).'], ['UNION', 'gabungkan dan buang duplikat (baris yang punya pasangan muncul di dua hasil, jadi perlu dibuang dobelnya).']] },
    mysql: ['SQLite (3.39+) justru punya <code>FULL OUTER JOIN</code>. Jadi di playground kamu bisa menjalankan keduanya, tapi <b>di MySQL hanya versi UNION yang jalan</b>.'],
    contoh: [
      { t: 'versi MySQL', sql: 'SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM matakuliah m LEFT JOIN dosen d ON m.id_dosen = d.id_dosen\nUNION\nSELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM matakuliah m RIGHT JOIN dosen d ON m.id_dosen = d.id_dosen;', ket: '12 baris: 8 pasangan + 2 matkul tanpa dosen + 2 dosen tanpa matkul.', hl: 'null' },
      { t: 'hanya untuk perbandingan (nggak jalan di MySQL)', sql: 'SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\nFROM matakuliah m\nFULL OUTER JOIN dosen d ON m.id_dosen = d.id_dosen;', ket: 'Hasilnya sama 12 baris. Tapi ingat, di MySQL perintah ini error.', hl: 'null' },
      { t: 'UNION vs UNION ALL', sql: 'SELECT m.kode_mk, d.nama FROM matakuliah m LEFT JOIN dosen d ON m.id_dosen = d.id_dosen\nUNION ALL\nSELECT m.kode_mk, d.nama FROM matakuliah m RIGHT JOIN dosen d ON m.id_dosen = d.id_dosen;', ket: 'Dengan UNION ALL hasilnya 20 baris, karena 8 pasangan muncul dua kali. Makanya simulasi FULL JOIN pakai UNION.', hl: 'null' }
    ],
    viz: { type: 'venn', join: 'full' },
    salah: ['Menulis FULL OUTER JOIN di MySQL. Error.', 'Pakai UNION ALL untuk simulasi, sehingga baris berpasangan dobel.', 'Jumlah kolom SELECT pertama dan kedua beda: error "The used SELECT statements have a different number of columns".'],
    latihan: [
      { lv: 'mudah', q: 'Dengan cara MySQL (LEFT JOIN + UNION + RIGHT JOIN), tampilkan <code>kode_mk</code> dan nama dosen untuk semua matkul dan semua dosen.', a: 'SELECT m.kode_mk, d.nama\nFROM matakuliah m LEFT JOIN dosen d ON m.id_dosen = d.id_dosen\nUNION\nSELECT m.kode_mk, d.nama\nFROM matakuliah m RIGHT JOIN dosen d ON m.id_dosen = d.id_dosen;', h: ['Tulis LEFT JOIN dulu.', 'Lalu UNION, lalu RIGHT JOIN dengan kolom yang sama.', 'Kolom di kedua SELECT harus sama: m.kode_mk, d.nama.'], ex: '12 baris.' },
      { lv: 'sedang', q: 'Tampilkan hanya baris yang <b>nggak punya pasangan</b> dari kedua sisi: matkul tanpa dosen dan dosen tanpa matkul. Kolom: <code>kode_mk</code>, nama dosen.', a: 'SELECT m.kode_mk, d.nama\nFROM matakuliah m LEFT JOIN dosen d ON m.id_dosen = d.id_dosen\nWHERE d.id_dosen IS NULL\nUNION\nSELECT m.kode_mk, d.nama\nFROM matakuliah m RIGHT JOIN dosen d ON m.id_dosen = d.id_dosen\nWHERE m.kode_mk IS NULL;', h: ['Masing-masing bagian diberi WHERE ... IS NULL.', 'Bagian LEFT: d.id_dosen IS NULL. Bagian RIGHT: m.kode_mk IS NULL.', 'Gabung pakai UNION.'], ex: '4 baris: IF302, IF303, Hendra, Maya.' },
      { lv: 'sulit', q: 'Gabungkan daftar <code>nama</code> dari tabel dosen dan tabel staf jadi satu kolom, <b>tanpa nama dobel</b> (ada orang yang terdaftar di keduanya).', a: 'SELECT nama FROM dosen\nUNION\nSELECT nama FROM staf;', h: ['Menumpuk dua hasil = UNION.', 'Tanpa dobel = UNION (bukan UNION ALL).', 'SELECT nama FROM dosen UNION SELECT nama FROM staf;'], ex: '9 + 9 = 18 nama, tapi 4 orang ada di kedua tabel (Budi Santoso, Siti, Agus, Dewi), jadi hasilnya 14.' }
    ],
    ringkas: 'FULL OUTER JOIN = semua baris dua sisi, dan karena MySQL nggak punya, disimulasikan dengan LEFT JOIN UNION RIGHT JOIN.'
  },
  {
    id: '4.5', t: 'CROSS JOIN',
    konsep: `<p>CROSS JOIN = <b>semua kombinasi</b> baris kiri × baris kanan. Nggak pakai ON.</p>
<div class="analogi">🍱 Warung punya 3 jenis karbo (nasi, lontong, ketupat) dan 4 lauk. Semua kemungkinan paket = 3 × 4 = 12. Itulah CROSS JOIN.</div>
<p>Jarang dipakai untuk data besar (bisa jutaan baris), tapi berguna untuk membuat kombinasi, misal jadwal semua lab × semua hari.</p>`,
    sintaks: { code: `SELECT a.kolom, b.kolom
FROM tabel_a a
CROSS JOIN tabel_b b;
-- bentuk lama yang sama:
SELECT a.kolom, b.kolom FROM tabel_a a, tabel_b b;`, ket: [['CROSS JOIN', 'tanpa ON.'], ['FROM a, b', 'koma di FROM juga menghasilkan cross join (kalau nggak ada WHERE pencocok).']] },
    contoh: [
      { sql: "SELECT d.nama, m.nama_mk\nFROM dosen d\nCROSS JOIN matakuliah m\nWHERE d.keahlian = 'Basis Data' AND m.sks = 2;", ket: '2 dosen ahli Basis Data × 3 matkul 2 SKS = 6 kombinasi.' },
      { sql: 'SELECT COUNT(*) AS jumlah_kombinasi FROM mahasiswa CROSS JOIN matakuliah;', ket: '14 × 10 = 140 baris. Bayangkan kalau tabelnya ribuan baris.' },
      { sql: "SELECT h.hari, l.lab\nFROM (SELECT 'Senin' AS hari UNION ALL SELECT 'Selasa' UNION ALL SELECT 'Rabu') h\nCROSS JOIN (SELECT 'Lab A' AS lab UNION ALL SELECT 'Lab B') l;", ket: 'Contoh praktis: membuat semua slot jadwal 3 hari × 2 lab = 6 baris. (Tabel sementara di FROM dibahas di Bab 5.5.)' }
    ],
    viz: CROSS_VIZ,
    salah: ['Lupa ON pada JOIN biasa sehingga nggak sengaja jadi CROSS JOIN.', 'Menjalankan CROSS JOIN tabel besar di server produksi. Bisa bikin server lemot.'],
    latihan: [
      { lv: 'mudah', q: 'Berapa banyak kombinasi dosen × matakuliah? Tampilkan dalam satu angka.', a: 'SELECT COUNT(*) AS jumlah FROM dosen CROSS JOIN matakuliah;', h: ['CROSS JOIN lalu hitung.', 'COUNT(*)', 'SELECT COUNT(*) FROM dosen CROSS JOIN matakuliah;'], ex: '9 × 10 = 90.' },
      { lv: 'sedang', q: 'Tampilkan semua kombinasi <code>nama</code> mahasiswa angkatan 2024 dengan <code>nama_mk</code> matakuliah ber-SKS 2.', a: 'SELECT mhs.nama, m.nama_mk\nFROM mahasiswa mhs\nCROSS JOIN matakuliah m\nWHERE mhs.angkatan = 2024 AND m.sks = 2;', h: ['CROSS JOIN mahasiswa dan matakuliah.', 'Saring pakai WHERE untuk kedua tabel.', 'WHERE mhs.angkatan = 2024 AND m.sks = 2'], ex: '2 mahasiswa × 3 matkul = 6 baris.' },
      { lv: 'sulit', q: "Buat jadwal semua kombinasi dosen yang keahliannya 'Basis Data' dengan hari 'Senin' dan 'Kamis'. Kolom: <code>nama</code>, <code>hari</code>. Tabel hari buat sendiri dengan SELECT ... UNION ALL.", a: "SELECT d.nama, h.hari\nFROM dosen d\nCROSS JOIN (SELECT 'Senin' AS hari UNION ALL SELECT 'Kamis') h\nWHERE d.keahlian = 'Basis Data';", h: ["(SELECT 'Senin' AS hari UNION ALL SELECT 'Kamis') h", 'CROSS JOIN tabel sementara itu dengan dosen.', "WHERE d.keahlian = 'Basis Data'"], ex: '2 dosen × 2 hari = 4 baris.' }
    ],
    ringkas: 'CROSS JOIN memasangkan setiap baris kiri dengan setiap baris kanan tanpa ON, hasilnya jumlah kiri × jumlah kanan.'
  },
  {
    id: '4.6', t: 'SELF JOIN',
    konsep: `<p>SELF JOIN = tabel di-JOIN dengan <b>dirinya sendiri</b>. Wajib pakai dua alias berbeda, seolah-olah ada dua salinan tabel.</p>
<div class="analogi">👔 Tabel staf punya kolom id_atasan yang berisi id staf lain di <b>tabel yang sama</b>. Untuk menampilkan "nama staf + nama atasannya", kita fotokopi daftar staf: salinan s = sebagai bawahan, salinan a = sebagai atasan. Lalu cocokkan <code>s.id_atasan = a.id</code>.</div>`,
    sintaks: { code: `SELECT s.nama AS staf, a.nama AS atasan
FROM staf s
JOIN staf a ON s.id_atasan = a.id;`, ket: [['staf s / staf a', 'tabel sama, alias beda.'], ['s.id_atasan = a.id', 'kolom atasan milik bawahan = id milik atasan.']] },
    contoh: [
      { sql: 'SELECT s.nama AS staf, s.jabatan, a.nama AS atasan\nFROM staf s\nJOIN staf a ON s.id_atasan = a.id;', ket: '8 baris. Dekan nggak muncul karena id_atasan-nya NULL (nggak punya atasan), jadi INNER JOIN membuangnya.' },
      { sql: 'SELECT s.nama AS staf, a.nama AS atasan\nFROM staf s\nLEFT JOIN staf a ON s.id_atasan = a.id;', ket: 'Dengan LEFT JOIN, Dekan ikut muncul dengan atasan NULL. 9 baris.', hl: 'null' },
      { sql: 'SELECT a.nama AS mhs1, b.nama AS mhs2, a.kota\nFROM mahasiswa a\nJOIN mahasiswa b ON a.kota = b.kota AND a.nim < b.nim;', ket: 'Pasangan mahasiswa yang sekota. a.nim < b.nim mencegah pasangan dengan diri sendiri (Andi-Andi) dan pasangan dobel (Andi-Dian dan Dian-Andi). Hasil 12 pasangan.' }
    ],
    salah: ['Lupa alias: <code>FROM staf JOIN staf</code> = error "Not unique table/alias".', 'Kebalik arah ON (<code>s.id = a.id_atasan</code>), sehingga yang tampil "staf + bawahannya", bukan atasannya.', 'Pakai <code>a.nim &lt;&gt; b.nim</code> untuk pasangan, sehingga tiap pasangan muncul dua kali.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan nama staf (kolom <code>staf</code>) dan nama atasannya (kolom <code>atasan</code>), hanya untuk yang punya atasan.', a: 'SELECT s.nama AS staf, a.nama AS atasan\nFROM staf s\nJOIN staf a ON s.id_atasan = a.id;', h: ['Tabel staf dua kali, alias s dan a.', 'ON s.id_atasan = a.id', 'INNER JOIN otomatis membuang yang nggak punya atasan.'], ex: '8 baris.' },
      { lv: 'sedang', q: "Tampilkan nama semua bawahan <b>langsung</b> dari 'Agus Pratama, M.Kom'.", a: "SELECT s.nama\nFROM staf s\nJOIN staf a ON s.id_atasan = a.id\nWHERE a.nama = 'Agus Pratama, M.Kom';", h: ['Self join seperti soal 1.', 'Saring berdasarkan nama atasan.', "WHERE a.nama = 'Agus Pratama, M.Kom'"], ex: 'Rizky Maulana dan Putri Ayu.' },
      { lv: 'sulit', q: 'Tampilkan pasangan mahasiswa yang <b>satu jurusan dan satu angkatan</b> (kolom: nama pertama, nama kedua), tanpa pasangan dobel dan tanpa berpasangan dengan diri sendiri.', a: 'SELECT a.nama, b.nama\nFROM mahasiswa a\nJOIN mahasiswa b ON a.jurusan = b.jurusan AND a.angkatan = b.angkatan AND a.nim < b.nim;', h: ['Self join mahasiswa a dan b.', 'Dua syarat kecocokan + satu syarat anti-dobel.', 'ON a.jurusan = b.jurusan AND a.angkatan = b.angkatan AND a.nim < b.nim'], ex: '4 pasangan: Andi-Budi, Eko-Gilang, Indra-Kartika, Joko-Nanda.' }
    ],
    ringkas: 'SELF JOIN menggabungkan tabel dengan dirinya sendiri memakai dua alias, cocok untuk hierarki atasan-bawahan atau mencari pasangan dalam satu tabel.'
  },
  {
    id: '4.7', t: 'JOIN lebih dari 2 tabel',
    konsep: `<p>JOIN bisa disambung terus seperti <b>rantai</b>. Setiap JOIN baru butuh ON sendiri yang menyambung ke tabel yang sudah ada sebelumnya.</p>
<div class="analogi">🔗 mahasiswa ←nim→ krs ←kode_mk→ matakuliah ←id_dosen→ dosen. Untuk tahu "mahasiswa X diajar dosen siapa", kamu jalan menyusuri rantai ini.</div>`,
    sintaks: { code: `SELECT mhs.nama, mk.nama_mk, d.nama AS dosen, k.nilai
FROM mahasiswa mhs
JOIN krs k         ON mhs.nim = k.nim
JOIN matakuliah mk ON k.kode_mk = mk.kode_mk
JOIN dosen d       ON mk.id_dosen = d.id_dosen;`, ket: [['JOIN ... ON', 'satu pasang JOIN-ON per tabel tambahan.'], ['urutan', 'tabel di ON harus sudah disebut sebelumnya.']] },
    contoh: [
      { sql: 'SELECT mhs.nama, mk.nama_mk, k.nilai\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk;', ket: '15 baris. Sekarang kita lihat nama matkul, bukan cuma kodenya.' },
      { sql: 'SELECT mhs.nama, mk.nama_mk, d.nama AS dosen, k.nilai\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk\nJOIN dosen d ON mk.id_dosen = d.id_dosen\nORDER BY mhs.nama;', ket: 'Empat tabel sekaligus. Semua KRS tetap 15 karena semua matkul yang diambil punya dosen.' },
      { sql: 'SELECT mk.kode_mk, mk.nama_mk, d.nama AS dosen, k.nim\nFROM matakuliah mk\nLEFT JOIN dosen d ON mk.id_dosen = d.id_dosen\nLEFT JOIN krs k ON mk.kode_mk = k.kode_mk;', ket: 'Rantai LEFT JOIN: semua matkul tetap muncul walau nggak punya dosen atau belum diambil. IF302/IF303 dosen dan nim NULL; IF301 nim NULL.', hl: 'null' }
    ],
    salah: ['ON menyebut tabel yang belum di-JOIN.', 'Campur INNER dan LEFT tanpa sadar: <code>LEFT JOIN krs ... JOIN matakuliah</code>, INNER yang kedua bisa membuang baris NULL hasil LEFT.', 'Lupa satu ON sehingga sebagian jadi CROSS JOIN, barisnya membengkak.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan nama mahasiswa, <code>nama_mk</code>, dan <code>nilai</code> untuk semua KRS.', a: 'SELECT mhs.nama, mk.nama_mk, k.nilai\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk;', h: ['Tiga tabel: mahasiswa, krs, matakuliah.', 'mahasiswa-krs lewat nim, krs-matakuliah lewat kode_mk.', 'Dua JOIN, dua ON.'], ex: '15 baris.' },
      { lv: 'sedang', q: "Tampilkan nama mahasiswa dan <code>nama_mk</code> untuk semua mahasiswa yang mengambil matkul ajaran 'Dr. Siti Rahmawati'.", a: "SELECT mhs.nama, mk.nama_mk\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk\nJOIN dosen d ON mk.id_dosen = d.id_dosen\nWHERE d.nama = 'Dr. Siti Rahmawati';", h: ['Butuh 4 tabel sampai ke dosen.', 'JOIN dosen d ON mk.id_dosen = d.id_dosen', "WHERE d.nama = 'Dr. Siti Rahmawati'"], ex: '6 baris: 4 di Algoritma, 2 di Pemrograman Web.' },
      { lv: 'sulit', q: 'Tampilkan nama mahasiswa (kolom <code>mahasiswa</code>), <code>nama_mk</code>, nama dosen (kolom <code>dosen</code>), dan <code>nilai</code> untuk KRS yang nilainya di bawah 70.', a: 'SELECT mhs.nama AS mahasiswa, mk.nama_mk, d.nama AS dosen, k.nilai\nFROM krs k\nJOIN mahasiswa mhs ON k.nim = mhs.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk\nJOIN dosen d ON mk.id_dosen = d.id_dosen\nWHERE k.nilai < 70;', h: ['Empat tabel.', 'Dua kolom bernama nama: beri alias berbeda.', 'WHERE k.nilai < 70'], ex: '3 baris: Budi di Basis Data (65) dan Algoritma (55), Eko di Jaringan Komputer (60).' }
    ],
    ringkas: 'JOIN banyak tabel = menyusuri rantai relasi, satu JOIN dan satu ON untuk setiap tabel tambahan.'
  },
  {
    id: '4.8', t: 'JOIN + GROUP BY',
    konsep: `<p>Gabungkan dulu tabelnya, lalu kelompokkan dan hitung. Ini pola untuk pertanyaan seperti "berapa matkul tiap dosen?" atau "berapa SKS tiap mahasiswa?".</p>
<div class="tip">💡 Jebakan penting: dengan LEFT JOIN, gunakan <b>COUNT(kolom_tabel_kanan)</b>, bukan COUNT(*). COUNT(*) menghitung baris NULL sebagai 1, sehingga dosen yang nggak mengajar terhitung punya 1 matkul.</div>`,
    sintaks: { code: `SELECT a.kolom, COUNT(b.kolom) AS jumlah
FROM tabel_a a
LEFT JOIN tabel_b b ON a.kunci = b.kunci
GROUP BY a.kunci, a.kolom;`, ket: [['GROUP BY a.kunci, a.kolom', 'kelompokkan per baris tabel induk. Sertakan semua kolom non-agregat yang ada di SELECT.'], ['COUNT(b.kolom)', 'NULL nggak dihitung, jadi yang nggak punya pasangan bernilai 0.']] },
    contoh: [
      { sql: 'SELECT d.nama, COUNT(*) AS jml_matkul\nFROM dosen d\nJOIN matakuliah m ON d.id_dosen = m.id_dosen\nGROUP BY d.id_dosen, d.nama;', ket: '7 dosen yang mengajar. Siti 2 matkul, sisanya 1. Hendra dan Maya nggak muncul karena INNER JOIN.' },
      { sql: 'SELECT d.nama, COUNT(m.kode_mk) AS jml_matkul, COUNT(*) AS salah_hitung\nFROM dosen d\nLEFT JOIN matakuliah m ON d.id_dosen = m.id_dosen\nGROUP BY d.id_dosen, d.nama;', ket: 'Semua 9 dosen. Lihat Hendra dan Maya: COUNT(m.kode_mk) = 0 (benar), COUNT(*) = 1 (salah, karena baris NULL tetap dihitung).' },
      { sql: 'SELECT mhs.nama, SUM(mk.sks) AS total_sks\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk\nGROUP BY mhs.nim, mhs.nama\nORDER BY total_sks DESC;', ket: 'Total SKS per mahasiswa. Andi paling banyak: 3 + 4 + 3 = 10 SKS.' }
    ],
    salah: ['COUNT(*) bersama LEFT JOIN (lihat contoh 2).', 'GROUP BY hanya nama padahal nama bisa sama untuk orang berbeda. Lebih aman GROUP BY kunci + nama.', 'Lupa GROUP BY sehingga semua jadi satu baris (atau error ONLY_FULL_GROUP_BY).'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>nama_mk</code> dan jumlah mahasiswa yang mengambilnya (kolom <code>jumlah</code>), hanya untuk matkul yang pernah diambil.', a: 'SELECT mk.nama_mk, COUNT(*) AS jumlah\nFROM matakuliah mk\nJOIN krs k ON mk.kode_mk = k.kode_mk\nGROUP BY mk.kode_mk, mk.nama_mk;', h: ['INNER JOIN matakuliah dan krs.', 'GROUP BY kode_mk (dan nama_mk).', 'COUNT(*)'], ex: '7 matkul: Basis Data 4, Algoritma 4, Pemrograman Web 2, Jaringan 2, sisanya 1.' },
      { lv: 'sedang', q: 'Tampilkan nama mahasiswa dan total SKS yang diambilnya (kolom <code>total_sks</code>), hanya mahasiswa yang punya KRS.', a: 'SELECT mhs.nama, SUM(mk.sks) AS total_sks\nFROM mahasiswa mhs\nJOIN krs k ON mhs.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk\nGROUP BY mhs.nim, mhs.nama;', h: ['SKS ada di matakuliah, jadi butuh 3 tabel.', 'SUM(mk.sks)', 'GROUP BY mhs.nim, mhs.nama'], ex: '10 mahasiswa. Andi 10, Budi 7, Fitri 6, Citra 5, dst.' },
      { lv: 'sulit', q: 'Tampilkan <b>semua</b> mahasiswa (termasuk yang belum KRS) dengan jumlah matkul yang diambil (kolom <code>jumlah</code>, 0 kalau belum ada). Urutkan jumlah terbanyak, lalu nama A-Z.', a: 'SELECT mhs.nama, COUNT(k.id) AS jumlah\nFROM mahasiswa mhs\nLEFT JOIN krs k ON mhs.nim = k.nim\nGROUP BY mhs.nim, mhs.nama\nORDER BY jumlah DESC, mhs.nama ASC;', order: true, h: ['Semua mahasiswa = LEFT JOIN.', 'Pakai COUNT(k.id), bukan COUNT(*).', 'ORDER BY jumlah DESC, mhs.nama ASC'], ex: 'Andi 3, lalu Budi, Citra, Fitri (2), ..., dan 4 mahasiswa dengan 0. Kalau pakai COUNT(*), yang belum KRS salah terhitung 1.' }
    ],
    ringkas: 'JOIN dulu baru GROUP BY; dengan LEFT JOIN pakai COUNT(kolom_kanan) supaya yang nggak punya pasangan terhitung 0.'
  }
  ]
});
