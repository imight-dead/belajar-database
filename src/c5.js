/* ===== BAB 5 SUBQUERY & BAB 6 CTE ===== */
const SUB_FLOW = `<div class="flow">
<div class="st"><span class="n">1</span><b>Query dalam</b><small>SELECT AVG(ipk) FROM mahasiswa</small></div><div class="ar">→</div>
<div class="st"><span class="n">2</span><b>Hasilnya 1 angka</b><small>3.2167</small></div><div class="ar">→</div>
<div class="st"><span class="n">3</span><b>Ditempel ke query luar</b><small>WHERE ipk &gt; 3.2167</small></div><div class="ar">→</div>
<div class="st"><span class="n">4</span><b>Query luar jalan</b><small>5 mahasiswa</small></div></div>
<p>Query dalam (yang di dalam kurung) dijalankan <b>sekali</b> dulu. Hasilnya dipakai query luar seolah-olah kamu mengetik angkanya langsung.</p>`;

const REC_VIZ = `<div class="cols2"><div><b>Deret 1 sampai 5</b>
<table class="data"><tr><th>Putaran</th><th>Yang terjadi</th><th>Baris baru</th></tr>
<tr class="in"><td>Anchor</td><td>SELECT 1</td><td>1</td></tr>
<tr><td>1</td><td>ambil n=1, cek 1 &lt; 5 ✓, n+1</td><td>2</td></tr>
<tr><td>2</td><td>ambil n=2, cek 2 &lt; 5 ✓</td><td>3</td></tr>
<tr><td>3</td><td>ambil n=3, cek 3 &lt; 5 ✓</td><td>4</td></tr>
<tr><td>4</td><td>ambil n=4, cek 4 &lt; 5 ✓</td><td>5</td></tr>
<tr class="gone"><td>5</td><td>ambil n=5, cek 5 &lt; 5 ✗</td><td>(nggak ada) → berhenti</td></tr></table></div>
<div><b>Hierarki staf</b>
<table class="data"><tr><th>Putaran</th><th>Dicari</th><th>Ketemu</th></tr>
<tr class="in"><td>Anchor (level 1)</td><td>id_atasan IS NULL</td><td>Dekan</td></tr>
<tr><td>Level 2</td><td>bawahan Dekan</td><td>2 Kaprodi</td></tr>
<tr><td>Level 3</td><td>bawahan para Kaprodi</td><td>2 Kepala Lab, 1 Staf Adm</td></tr>
<tr><td>Level 4</td><td>bawahan Kepala Lab</td><td>3 Asisten Lab</td></tr>
<tr class="gone"><td>Level 5</td><td>bawahan Asisten</td><td>nggak ada → berhenti</td></tr></table></div></div>`;

CH.push({
  id: 'bab5', title: 'Bab 5 · Subquery',
  lead: 'Subquery = query di dalam query. Dipakai saat jawaban butuh "pertanyaan kecil" dulu sebelum pertanyaan besar.',
  subs: [
  {
    id: '5.1', t: 'Subquery di WHERE: satu nilai (single value)',
    konsep: `<div class="analogi">❓ "Siapa saja yang IPK-nya di atas rata-rata?" Untuk menjawab, kamu harus tahu dulu <b>berapa rata-ratanya</b> (pertanyaan kecil). Setelah tahu (3.22), baru cari siapa yang di atasnya (pertanyaan besar). Subquery = pertanyaan kecil yang ditulis di dalam kurung.</div>
<p>Subquery yang menghasilkan <b>tepat satu nilai</b> (satu baris, satu kolom) bisa dibandingkan pakai =, &gt;, &lt;, dan sebagainya.</p>`,
    sintaks: { code: `SELECT kolom FROM tabel
WHERE kolom > (SELECT AGREGAT(kolom) FROM tabel WHERE ...);`, ket: [['( SELECT ... )', 'subquery wajib di dalam kurung.'], ['hasil 1 nilai', 'biasanya pakai AVG, MAX, MIN, COUNT, atau WHERE pada primary key.']] },
    mysql: ['Kalau subquery dengan = ternyata menghasilkan <b>lebih dari 1 baris</b>, MySQL error "Subquery returns more than 1 row". SQLite diam-diam memakai baris pertama saja. Jadi di playground kesalahan ini nggak ketahuan, tapi di MySQL error.'],
    contoh: [
      { sql: 'SELECT nama, ipk FROM mahasiswa\nWHERE ipk > (SELECT AVG(ipk) FROM mahasiswa);', ket: 'Rata-rata IPK 3.2167. Lima mahasiswa di atasnya: Andi, Citra, Fitri, Hana, Kartika.' },
      { sql: 'SELECT nama, ipk FROM mahasiswa\nWHERE ipk = (SELECT MAX(ipk) FROM mahasiswa);', ket: 'Mahasiswa dengan IPK tertinggi: Fitri (3.90). Kenapa nggak cukup ORDER BY ... LIMIT 1? Kalau ada dua orang sama-sama 3.90, cara subquery menampilkan keduanya.' },
      { sql: "SELECT kode_mk, nama_mk, sks FROM matakuliah\nWHERE sks = (SELECT sks FROM matakuliah WHERE nama_mk = 'Basis Data');", ket: "Subquery mencari SKS 'Basis Data' (3), lalu query luar menampilkan semua matkul 3 SKS." }
    ],
    viz: SUB_FLOW,
    salah: ['Lupa kurung di subquery.', 'Subquery menghasilkan banyak baris tapi dibandingkan pakai = (di MySQL error). Pakai IN.', '<code>WHERE ipk > AVG(ipk)</code> tanpa subquery: error, karena agregat nggak boleh di WHERE.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan nama dan ipk mahasiswa dengan IPK <b>terendah</b>.', a: 'SELECT nama, ipk FROM mahasiswa\nWHERE ipk = (SELECT MIN(ipk) FROM mahasiswa);', h: ['Pertanyaan kecil: berapa IPK terendah?', 'SELECT MIN(ipk) FROM mahasiswa', 'WHERE ipk = (SELECT MIN(ipk) FROM mahasiswa)'], ex: 'Indra Kusuma, 2.40.' },
      { lv: 'sedang', q: 'Tampilkan <code>id</code>, <code>nim</code>, <code>nilai</code> dari KRS yang nilainya di atas rata-rata seluruh nilai KRS.', a: 'SELECT id, nim, nilai FROM krs\nWHERE nilai > (SELECT AVG(nilai) FROM krs);', h: ['Rata-rata seluruh nilai: SELECT AVG(nilai) FROM krs', 'Bandingkan pakai >', 'WHERE nilai > (SELECT AVG(nilai) FROM krs)'], ex: 'Rata-rata 77.46. Ada 7 KRS di atasnya.' },
      { lv: 'sulit', q: "Tampilkan nama mahasiswa yang angkatannya <b>sama dengan</b> angkatan 'Hana Safitri', tapi bukan Hana sendiri.", a: "SELECT nama FROM mahasiswa\nWHERE angkatan = (SELECT angkatan FROM mahasiswa WHERE nama = 'Hana Safitri')\n  AND nama <> 'Hana Safitri';", h: ['Pertanyaan kecil: Hana angkatan berapa?', "(SELECT angkatan FROM mahasiswa WHERE nama = 'Hana Safitri')", "Tambah AND nama <> 'Hana Safitri'"], ex: 'Hana angkatan 2023, jadi hasilnya Indra, Joko, Kartika, Nanda.' }
    ],
    ringkas: 'Subquery satu nilai menjawab "pertanyaan kecil" dulu di dalam kurung, lalu hasilnya dipakai untuk membandingkan di WHERE.'
  },
  {
    id: '5.2', t: 'Subquery dengan IN dan NOT IN',
    konsep: `<p>Kalau subquery menghasilkan <b>banyak nilai</b> (satu kolom, banyak baris), pakai <b>IN</b>: "apakah nilai ini ada di daftar hasil subquery?".</p>
<div class="analogi">📜 Satpam memegang <b>daftar undangan</b> (hasil subquery). IN = boleh masuk kalau namanya ada di daftar. NOT IN = yang namanya nggak ada di daftar.</div>
<div class="warn"><b>⚠ Jebakan NULL di NOT IN:</b> kalau daftar hasil subquery mengandung <b>NULL</b>, NOT IN selalu menghasilkan <b>kosong</b>. Alasannya: "x bukan NULL?" jawabannya "nggak diketahui". Solusi: tambah <code>WHERE kolom IS NOT NULL</code> di subquery, atau pakai NOT EXISTS.</div>`,
    sintaks: { code: `SELECT kolom FROM tabel
WHERE kolom IN (SELECT kolom FROM tabel_lain WHERE ...);

SELECT kolom FROM tabel
WHERE kolom NOT IN (SELECT kolom FROM tabel_lain WHERE kolom IS NOT NULL);`, ket: [['IN (subquery)', 'subquery harus menghasilkan 1 kolom.'], ['NOT IN', 'hati-hati NULL.']] },
    contoh: [
      { sql: "SELECT nim, nama FROM mahasiswa\nWHERE nim IN (SELECT nim FROM krs WHERE kode_mk = 'IF101');", ket: 'Subquery menghasilkan daftar 4 NIM yang mengambil IF101. Query luar menampilkan nama mereka.' },
      { sql: 'SELECT nim, nama FROM mahasiswa\nWHERE nim NOT IN (SELECT nim FROM krs);', ket: '4 mahasiswa yang belum KRS. Aman karena krs.nim nggak pernah NULL.' },
      { t: 'jebakan NULL', sql: 'SELECT nama FROM dosen\nWHERE id_dosen NOT IN (SELECT id_dosen FROM matakuliah);', ket: 'Hasilnya KOSONG, padahal Hendra dan Maya nggak mengajar! Penyebabnya: daftar id_dosen di matakuliah mengandung NULL (IF302, IF303).' },
      { t: 'perbaikannya', sql: 'SELECT nama FROM dosen\nWHERE id_dosen NOT IN (SELECT id_dosen FROM matakuliah WHERE id_dosen IS NOT NULL);', ket: 'Setelah NULL dibuang dari daftar, hasilnya benar: Hendra dan Maya.' }
    ],
    salah: ['NOT IN dengan subquery yang bisa berisi NULL.', 'Subquery IN memilih lebih dari 1 kolom: <code>IN (SELECT nim, nilai FROM krs)</code> = error "Operand should contain 1 column".', 'Pakai = padahal hasil subquery bisa banyak baris.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>nama_mk</code> dari matkul yang <b>pernah</b> diambil mahasiswa (pakai IN).', a: 'SELECT nama_mk FROM matakuliah\nWHERE kode_mk IN (SELECT kode_mk FROM krs);', h: ['Daftar kode_mk yang ada di krs.', 'WHERE kode_mk IN (SELECT kode_mk FROM krs)', 'Duplikat di daftar IN nggak masalah.'], ex: '7 matkul.' },
      { lv: 'sedang', q: 'Pakai NOT IN, tampilkan <code>nama</code> dosen yang nggak mengajar matkul apa pun. Awas jebakan NULL!', a: 'SELECT nama FROM dosen\nWHERE id_dosen NOT IN (SELECT id_dosen FROM matakuliah WHERE id_dosen IS NOT NULL);', h: ['NOT IN (SELECT id_dosen FROM matakuliah ...)', 'Kolom id_dosen di matakuliah ada yang NULL.', 'Tambah WHERE id_dosen IS NOT NULL di subquery.'], ex: 'Hendra dan Maya. Tanpa IS NOT NULL, hasilnya kosong.' },
      { lv: 'sulit', q: "Tampilkan nama mahasiswa <b>Teknik Informatika</b> yang pernah mengambil matkul yang diajar dosen berkeahlian 'Pemrograman Web'. Gunakan IN bertingkat (subquery di dalam subquery).", a: "SELECT nama FROM mahasiswa\nWHERE jurusan = 'Teknik Informatika'\n  AND nim IN (\n    SELECT nim FROM krs WHERE kode_mk IN (\n      SELECT kode_mk FROM matakuliah WHERE id_dosen IN (\n        SELECT id_dosen FROM dosen WHERE keahlian = 'Pemrograman Web'\n      )\n    )\n  );", h: ['Mulai dari dalam: dosen ahli Pemrograman Web → id_dosen.', 'Lalu matkul mereka → kode_mk. Lalu krs → nim.', 'Terakhir saring jurusan di query paling luar.'], ex: 'Dosennya Siti (IF102, IF103). Yang mengambil: Andi, Budi, Hana, Indra, Dian, Joko. Yang TI: Andi, Budi, Indra.' }
    ],
    ringkas: 'IN mengecek apakah nilai ada di daftar hasil subquery; NOT IN kebalikannya, tapi rusak kalau daftarnya mengandung NULL.'
  },
  {
    id: '5.3', t: 'EXISTS dan NOT EXISTS',
    konsep: `<p><b>EXISTS (subquery)</b> bernilai TRUE kalau subquery menghasilkan <b>minimal satu baris</b>. Isinya nggak penting, makanya sering ditulis <code>SELECT 1</code>.</p>
<div class="analogi">🎫 Satpam bertanya: "Kamu <b>punya</b> tiket nggak?" Dia nggak peduli tiketnya berapa lembar atau warna apa. Ada = boleh masuk.</div>
<p>EXISTS hampir selalu <b>correlated</b>: subquery-nya menyebut kolom dari query luar (misal <code>k.nim = m.nim</code>), jadi dicek ulang untuk setiap baris luar. <b>NOT EXISTS</b> aman dari jebakan NULL, sehingga lebih disarankan daripada NOT IN.</p>`,
    sintaks: { code: `SELECT kolom FROM tabel_luar t
WHERE EXISTS (SELECT 1 FROM tabel_lain x WHERE x.kunci = t.kunci);

SELECT kolom FROM tabel_luar t
WHERE NOT EXISTS (SELECT 1 FROM tabel_lain x WHERE x.kunci = t.kunci);`, ket: [['SELECT 1', 'isi apa saja boleh, yang dicek cuma ada/nggaknya baris.'], ['x.kunci = t.kunci', 'menghubungkan subquery dengan baris luar.']] },
    contoh: [
      { sql: 'SELECT m.nim, m.nama FROM mahasiswa m\nWHERE EXISTS (SELECT 1 FROM krs k WHERE k.nim = m.nim);', ket: '10 mahasiswa yang punya minimal 1 KRS. Andi muncul sekali saja walau punya 3 KRS (beda dengan JOIN).' },
      { sql: 'SELECT m.nim, m.nama FROM mahasiswa m\nWHERE NOT EXISTS (SELECT 1 FROM krs k WHERE k.nim = m.nim);', ket: '4 mahasiswa tanpa KRS.' },
      { sql: 'SELECT d.nama FROM dosen d\nWHERE NOT EXISTS (SELECT 1 FROM matakuliah mk WHERE mk.id_dosen = d.id_dosen);', ket: 'Dosen yang nggak mengajar: Hendra dan Maya. Nggak kena jebakan NULL seperti NOT IN.' },
      { sql: 'SELECT d.nama FROM dosen d\nWHERE EXISTS (SELECT 1 FROM matakuliah mk WHERE mk.id_dosen = d.id_dosen AND mk.sks = 4);', ket: 'Dosen yang mengajar matkul 4 SKS: hanya Siti (Algoritma).' }
    ],
    salah: ['Lupa menghubungkan subquery ke query luar (<code>WHERE k.nim = m.nim</code>). Akibatnya EXISTS selalu TRUE untuk semua baris.', 'Mengira EXISTS membandingkan nilai. EXISTS hanya cek ada atau nggak.'],
    latihan: [
      { lv: 'mudah', q: 'Pakai EXISTS, tampilkan <code>nama_mk</code> matkul yang pernah diambil mahasiswa.', a: 'SELECT mk.nama_mk FROM matakuliah mk\nWHERE EXISTS (SELECT 1 FROM krs k WHERE k.kode_mk = mk.kode_mk);', h: ['WHERE EXISTS (SELECT 1 FROM krs k WHERE ...)', 'Hubungkan k.kode_mk = mk.kode_mk', 'Jangan lupa alias di tabel luar.'], ex: '7 matkul.' },
      { lv: 'sedang', q: 'Pakai NOT EXISTS, tampilkan <code>nama</code> dan <code>keahlian</code> dosen yang nggak mengajar matkul apa pun.', a: 'SELECT d.nama, d.keahlian FROM dosen d\nWHERE NOT EXISTS (SELECT 1 FROM matakuliah mk WHERE mk.id_dosen = d.id_dosen);', h: ['NOT EXISTS (SELECT 1 FROM matakuliah ...)', 'mk.id_dosen = d.id_dosen', 'Nggak perlu repot soal NULL.'], ex: 'Hendra dan Maya.' },
      { lv: 'sulit', q: 'Tampilkan <code>nim</code> dan <code>nama</code> mahasiswa yang punya <b>minimal satu</b> KRS yang belum dinilai (nilai NULL).', a: 'SELECT m.nim, m.nama FROM mahasiswa m\nWHERE EXISTS (SELECT 1 FROM krs k WHERE k.nim = m.nim AND k.nilai IS NULL);', h: ['EXISTS dengan dua syarat di subquery.', 'k.nim = m.nim AND k.nilai IS NULL', 'Minimal satu = EXISTS.'], ex: 'Fitri (IF202) dan Indra (IF102).' }
    ],
    ringkas: 'EXISTS bernilai benar kalau subquery menghasilkan minimal satu baris, dan NOT EXISTS adalah cara paling aman mencari "yang nggak punya pasangan".'
  },
  {
    id: '5.4', t: 'ANY dan ALL',
    konsep: `<p>ANY dan ALL membandingkan satu nilai dengan <b>daftar</b> hasil subquery.</p>
<table class="cmp"><tr><th>Bentuk</th><th>Arti</th><th>Sama dengan</th></tr>
<tr><td>&gt; ALL (subquery)</td><td>lebih besar dari <b>semua</b></td><td>&gt; MAX(...)</td></tr>
<tr><td>&lt; ALL (subquery)</td><td>lebih kecil dari semua</td><td>&lt; MIN(...)</td></tr>
<tr><td>&gt; ANY (subquery)</td><td>lebih besar dari <b>minimal satu</b></td><td>&gt; MIN(...)</td></tr>
<tr><td>&lt; ANY (subquery)</td><td>lebih kecil dari minimal satu</td><td>&lt; MAX(...)</td></tr>
<tr><td>= ANY (subquery)</td><td>sama dengan salah satu</td><td>IN (...)</td></tr></table>
<div class="analogi">🏃 "Lari lebih cepat dari <b>SEMUA</b> peserta" = harus mengalahkan yang tercepat. "Lebih cepat dari <b>SALAH SATU</b> peserta" = cukup mengalahkan yang paling lambat. SOME = sinonim ANY.</div>`,
    sintaks: { code: `SELECT kolom FROM tabel
WHERE kolom > ALL (SELECT kolom FROM tabel WHERE ...);
SELECT kolom FROM tabel
WHERE kolom > ANY (SELECT kolom FROM tabel WHERE ...);`, ket: [['ALL', 'harus benar untuk semua nilai di daftar.'], ['ANY / SOME', 'cukup benar untuk satu nilai.']] },
    mysql: ['SQLite <b>nggak punya</b> ANY/ALL. Playground menerjemahkan otomatis: <code>&gt; ALL (SELECT x ...)</code> jadi <code>&gt; (SELECT MAX(x) ...)</code>, <code>&gt; ANY</code> jadi <code>&gt; (SELECT MIN(x) ...)</code>, dan seterusnya. Di MySQL, tulis versi ANY/ALL aslinya.'],
    contoh: [
      { sql: "SELECT nama, ipk FROM mahasiswa\nWHERE jurusan = 'Teknik Informatika'\n  AND ipk > ALL (SELECT ipk FROM mahasiswa WHERE jurusan = 'Teknik Komputer');", ket: 'IPK TK: 2.65, 3.05, 3.20, 2.95. Harus lebih besar dari SEMUANYA (jadi > 3.20). Mahasiswa TI yang lolos: Andi, Fitri, Kartika.' },
      { sql: "SELECT nama, ipk FROM mahasiswa\nWHERE jurusan = 'Teknik Informatika'\n  AND ipk > ANY (SELECT ipk FROM mahasiswa WHERE jurusan = 'Teknik Komputer');", ket: 'Cukup lebih besar dari SALAH SATU (yang terkecil 2.65). Budi (2.90) ikut lolos. Indra (2.40) nggak.' },
      { sql: "SELECT nama, ipk FROM mahasiswa\nWHERE jurusan = 'Teknik Informatika'\n  AND ipk > (SELECT MAX(ipk) FROM mahasiswa WHERE jurusan = 'Teknik Komputer');", ket: 'Versi MAX dari contoh 1. Hasilnya sama persis.' }
    ],
    salah: ['Tertukar ANY dan ALL.', 'Jebakan NULL di ALL: kalau daftar subquery berisi NULL, di MySQL <code>&gt; ALL</code> menghasilkan kosong. Contoh: IPK jurusan SI ada yang NULL (Lukman). Tambahkan <code>WHERE ipk IS NOT NULL</code> di subquery. (Di playground efek ini nggak terlihat karena diterjemahkan ke MAX yang mengabaikan NULL.)', 'Subquery ALL/ANY menghasilkan lebih dari 1 kolom.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>kode_mk</code> dan <code>sks</code> matakuliah yang SKS-nya lebih besar dari SKS <b>semua</b> matkul yang belum punya dosen. Pakai ALL.', a: 'SELECT kode_mk, sks FROM matakuliah\nWHERE sks > ALL (SELECT sks FROM matakuliah WHERE id_dosen IS NULL);', h: ['Daftar: SKS matkul tanpa dosen (id_dosen IS NULL).', '> ALL (subquery)', 'Matkul tanpa dosen SKS-nya 2 dan 2.'], ex: 'Semua matkul yang SKS-nya > 2: 7 matkul.' },
      { lv: 'sedang', q: 'Tampilkan <code>id</code> dan <code>nilai</code> KRS yang nilainya lebih tinggi dari <b>semua</b> nilai KRS semester 2.', a: 'SELECT id, nilai FROM krs\nWHERE nilai > ALL (SELECT nilai FROM krs WHERE semester = 2);', h: ['Nilai semester 2: 75, 60, 70.', '> ALL berarti harus > 75.', 'WHERE nilai > ALL (SELECT nilai FROM krs WHERE semester = 2)'], ex: '7 KRS: nilai 78, 82, 85, 88, 90, 92, 95.' },
      { lv: 'sulit', q: "Tampilkan nama dan ipk mahasiswa <b>Sistem Informasi</b> yang IPK-nya lebih rendah dari <b>salah satu</b> mahasiswa Teknik Informatika angkatan 2021. Pakai ANY.", a: "SELECT nama, ipk FROM mahasiswa\nWHERE jurusan = 'Sistem Informasi'\n  AND ipk < ANY (SELECT ipk FROM mahasiswa WHERE jurusan = 'Teknik Informatika' AND angkatan = 2021);", h: ['Daftar: IPK TI angkatan 2021 = 3.45 dan 2.90.', '< ANY berarti cukup lebih kecil dari yang terbesar (3.45).', "WHERE jurusan = 'Sistem Informasi' AND ipk < ANY (...)"], ex: 'Hanya Dian (3.12). Citra 3.78 dan Hana 3.55 lebih besar dari 3.45; Lukman NULL.' }
    ],
    ringkas: '> ALL artinya lebih besar dari semuanya (setara > MAX), > ANY artinya lebih besar dari salah satu (setara > MIN).'
  },
  {
    id: '5.5', t: 'Subquery di FROM (derived table)',
    konsep: `<p>Hasil sebuah SELECT bisa dipakai <b>sebagai tabel sementara</b> di FROM. Namanya <b>derived table</b>.</p>
<div class="analogi">🧾 Kamu bikin <b>rekap</b> dulu (misal rata-rata IPK per jurusan) di kertas coretan, lalu kertas rekap itu kamu olah lagi seolah-olah tabel baru.</div>
<p>Gunanya: mengolah hasil agregat lagi (misal "rata-rata dari jumlah", "maksimum dari rata-rata"), yang nggak bisa dilakukan dengan satu GROUP BY.</p>`,
    sintaks: { code: `SELECT t.kolom
FROM (
  SELECT kolom, AGREGAT(...) AS hasil
  FROM tabel
  GROUP BY kolom
) AS t
WHERE t.hasil > ...;`, ket: [['( SELECT ... ) AS t', 'derived table WAJIB diberi alias di MySQL.'], ['t.hasil', 'kolom alias dari dalam bisa dipakai di luar.']] },
    mysql: ['Di MySQL, derived table tanpa alias error: "Every derived table must have its own alias". SQLite membolehkan tanpa alias, jadi biasakan selalu menulis <code>AS t</code>.'],
    contoh: [
      { sql: 'SELECT t.jurusan, ROUND(t.rata, 2) AS rata\nFROM (SELECT jurusan, AVG(ipk) AS rata FROM mahasiswa GROUP BY jurusan) AS t\nWHERE t.rata > 3.0;', ket: 'Rekap rata per jurusan dibuat dulu, lalu disaring. Hasilnya sama dengan memakai HAVING, tapi kadang cara ini lebih mudah dibaca.' },
      { sql: 'SELECT AVG(jml) AS rata_matkul_per_mahasiswa\nFROM (SELECT nim, COUNT(*) AS jml FROM krs GROUP BY nim) AS x;', ket: 'Rata-rata dari hitungan: 15 KRS dibagi 10 mahasiswa = 1.5. Ini nggak bisa dengan satu GROUP BY biasa.' },
      { sql: 'SELECT m.nama, ROUND(t.rata_nilai, 2) AS rata_nilai\nFROM mahasiswa m\nJOIN (SELECT nim, AVG(nilai) AS rata_nilai FROM krs GROUP BY nim) AS t ON m.nim = t.nim\nWHERE t.rata_nilai >= 80;', ket: 'Derived table bisa di-JOIN. Rata nilai per mahasiswa ≥ 80: Andi 84.33, Citra 90, Fitri 95, Hana 82.' }
    ],
    salah: ['Lupa alias untuk derived table (error di MySQL).', 'Memakai kolom yang nggak dipilih di dalam derived table.', 'Lupa memberi alias pada kolom agregat di dalam (<code>COUNT(*)</code> tanpa AS), sehingga susah dipanggil di luar.'],
    latihan: [
      { lv: 'mudah', q: 'Pakai derived table yang berisi jumlah mahasiswa per kota. Tampilkan <code>kota</code> dan <code>jumlah</code> untuk kota yang jumlahnya minimal 3.', a: 'SELECT t.kota, t.jumlah\nFROM (SELECT kota, COUNT(*) AS jumlah FROM mahasiswa GROUP BY kota) AS t\nWHERE t.jumlah >= 3;', h: ['Dalam: SELECT kota, COUNT(*) AS jumlah FROM mahasiswa GROUP BY kota', 'Beri alias AS t.', 'WHERE t.jumlah >= 3'], ex: 'Jakarta 4 dan Bandung 3.' },
      { lv: 'sedang', q: 'Berapa rata-rata nilai <b>tertinggi</b> di antara semua matkul? (Hitung rata-rata nilai per kode_mk dulu, lalu ambil maksimumnya.) Satu angka.', a: 'SELECT MAX(rata) AS rata_tertinggi\nFROM (SELECT kode_mk, AVG(nilai) AS rata FROM krs GROUP BY kode_mk) AS t;', h: ['Dalam: AVG(nilai) per kode_mk.', 'Luar: MAX dari kolom rata.', 'Agregat di atas agregat butuh derived table.'], ex: '88 (IF204 Statistika, satu-satunya nilai 88).' },
      { lv: 'sulit', q: 'Tampilkan nama mahasiswa dan total SKS-nya (kolom <code>total_sks</code>), hanya yang total SKS-nya <b>di atas rata-rata</b> total SKS semua mahasiswa yang punya KRS.', a: 'SELECT m.nama, t.total_sks\nFROM mahasiswa m\nJOIN (SELECT k.nim, SUM(mk.sks) AS total_sks\n      FROM krs k JOIN matakuliah mk ON k.kode_mk = mk.kode_mk\n      GROUP BY k.nim) AS t ON m.nim = t.nim\nWHERE t.total_sks > (\n  SELECT AVG(total_sks) FROM (\n    SELECT k.nim, SUM(mk.sks) AS total_sks\n    FROM krs k JOIN matakuliah mk ON k.kode_mk = mk.kode_mk\n    GROUP BY k.nim) AS t2\n);', h: ['Derived table t: total SKS per nim (krs JOIN matakuliah).', 'Rata-rata dari total itu juga butuh derived table lagi di dalam subquery.', 'Rata-ratanya 4.8. (Di Bab 6, soal ini jadi jauh lebih rapi pakai CTE.)'], ex: 'Andi 10, Budi 7, Fitri 6, Citra 5. Perhatikan query yang sama ditulis dua kali; inilah alasan CTE diciptakan.' }
    ],
    ringkas: 'Derived table = hasil SELECT yang dipakai sebagai tabel sementara di FROM, wajib diberi alias, berguna untuk mengolah hasil agregat lagi.'
  },
  {
    id: '5.6', t: 'Subquery di SELECT (scalar subquery)',
    konsep: `<p>Subquery yang menghasilkan <b>satu nilai</b> bisa ditaruh sebagai <b>kolom</b> di SELECT. Namanya scalar subquery.</p>
<div class="analogi">📌 Seperti menempel <b>catatan kecil</b> di setiap baris: "rata-rata kampus: 3.22" di samping IPK tiap mahasiswa, atau "jumlah matkul: 2" di samping nama tiap dosen.</div>
<p>Kalau subquery-nya menyebut kolom dari baris luar (correlated), nilainya bisa berbeda di setiap baris.</p>`,
    sintaks: { code: `SELECT kolom,
       (SELECT AGREGAT(x) FROM tabel_lain t2 WHERE t2.kunci = t1.kunci) AS nama_kolom
FROM tabel t1;`, ket: [['subquery di SELECT', 'harus menghasilkan maksimal 1 baris 1 kolom.'], ['AS', 'beri nama kolomnya.']] },
    contoh: [
      { sql: 'SELECT nama, ipk,\n  (SELECT ROUND(AVG(ipk), 2) FROM mahasiswa) AS rata_kampus,\n  ROUND(ipk - (SELECT AVG(ipk) FROM mahasiswa), 2) AS selisih\nFROM mahasiswa;', ket: 'Setiap baris mendapat nilai rata_kampus yang sama (3.22). Selisih positif = di atas rata-rata.' },
      { sql: 'SELECT d.nama,\n  (SELECT COUNT(*) FROM matakuliah m WHERE m.id_dosen = d.id_dosen) AS jml_matkul\nFROM dosen d;', ket: 'Correlated: untuk setiap dosen, dihitung matkulnya. Hendra dan Maya otomatis 0 (nggak perlu LEFT JOIN).' },
      { sql: 'SELECT mk.kode_mk, mk.nama_mk,\n  (SELECT COUNT(*) FROM krs k WHERE k.kode_mk = mk.kode_mk) AS peserta,\n  (SELECT MAX(nilai) FROM krs k WHERE k.kode_mk = mk.kode_mk) AS nilai_tertinggi\nFROM matakuliah mk;', ket: 'Dua scalar subquery sekaligus. Matkul tanpa peserta: peserta 0, nilai_tertinggi NULL.', hl: 'null' }
    ],
    salah: ['Scalar subquery menghasilkan banyak baris: MySQL error "Subquery returns more than 1 row".', 'Lupa menghubungkan ke baris luar, sehingga semua baris dapat angka yang sama.', 'Memakai banyak scalar subquery untuk tabel besar: bisa lambat. JOIN + GROUP BY biasanya lebih cepat.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>nama_mk</code>, <code>sks</code>, dan kolom <code>total_semua</code> berisi total SKS semua matkul (angka yang sama di setiap baris).', a: 'SELECT nama_mk, sks, (SELECT SUM(sks) FROM matakuliah) AS total_semua\nFROM matakuliah;', h: ['Subquery: SELECT SUM(sks) FROM matakuliah', 'Taruh di SELECT sebagai kolom.', 'Beri alias AS total_semua.'], ex: '10 baris, total_semua = 28 di semua baris.' },
      { lv: 'sedang', q: 'Untuk setiap mahasiswa, tampilkan <code>nama</code> dan jumlah KRS-nya (kolom <code>jml_krs</code>, 0 kalau belum ada). Pakai subquery di SELECT.', a: 'SELECT m.nama,\n  (SELECT COUNT(*) FROM krs k WHERE k.nim = m.nim) AS jml_krs\nFROM mahasiswa m;', h: ['Correlated: hubungkan k.nim = m.nim.', 'COUNT(*) di subquery otomatis 0 kalau nggak ada baris.', '(SELECT COUNT(*) FROM krs k WHERE k.nim = m.nim) AS jml_krs'], ex: '14 baris. Kartika, Lukman, Mira, Nanda = 0.' },
      { lv: 'sulit', q: 'Untuk setiap matkul tampilkan <code>nama_mk</code>, nilai tertinggi di matkul itu (kolom <code>tertinggi</code>), dan nama dosennya (kolom <code>dosen</code>). Keduanya pakai scalar subquery (NULL kalau nggak ada).', a: 'SELECT mk.nama_mk,\n  (SELECT MAX(k.nilai) FROM krs k WHERE k.kode_mk = mk.kode_mk) AS tertinggi,\n  (SELECT d.nama FROM dosen d WHERE d.id_dosen = mk.id_dosen) AS dosen\nFROM matakuliah mk;', h: ['Dua subquery di SELECT.', 'Yang pertama ke krs (MAX nilai), yang kedua ke dosen (nama).', 'Dihubungkan lewat kode_mk dan id_dosen.'], ex: '10 baris. IF302/IF303: tertinggi NULL, dosen NULL. IF301: tertinggi NULL, dosen Agus.' }
    ],
    ringkas: 'Scalar subquery di SELECT menempelkan satu nilai hasil hitungan di setiap baris, dan bisa dikaitkan ke baris luar.'
  },
  {
    id: '5.7', t: 'Correlated subquery (simulasi baris per baris)',
    konsep: `<p>Subquery biasa dijalankan <b>sekali</b>. <b>Correlated subquery</b> menyebut kolom dari query luar, sehingga dijalankan <b>ulang untuk setiap baris</b> query luar.</p>
<div class="analogi">👩‍🏫 Guru mengecek murid satu per satu: "Nilaimu di atas rata-rata <b>kelasmu sendiri</b> nggak?" Untuk Andi (TI), guru menghitung rata-rata TI. Untuk Citra (SI), guru menghitung ulang rata-rata SI. Setiap murid, hitung ulang.</div>
<p>Ciri-cirinya: di dalam subquery ada sesuatu seperti <code>m2.jurusan = m.jurusan</code>, di mana <code>m</code> adalah alias tabel luar.</p>`,
    sintaks: { code: `SELECT m.nama, m.jurusan, m.ipk
FROM mahasiswa m                          -- tabel luar, alias m
WHERE m.ipk > (
  SELECT AVG(m2.ipk) FROM mahasiswa m2    -- tabel dalam, alias m2
  WHERE m2.jurusan = m.jurusan            -- "nyontek" baris luar
);`, ket: [['m dan m2', 'tabel yang sama butuh dua alias berbeda.'], ['m2.jurusan = m.jurusan', 'inilah yang membuatnya correlated.']] },
    contoh: [
      { sql: 'SELECT m.nama, m.jurusan, m.ipk\nFROM mahasiswa m\nWHERE m.ipk > (SELECT AVG(m2.ipk) FROM mahasiswa m2 WHERE m2.jurusan = m.jurusan);', ket: 'Rata-rata TI 3.26, SI 3.48, TK 2.96. Yang di atas rata-rata jurusannya: Andi, Fitri, Kartika (TI), Citra, Hana (SI), Gilang, Joko (TK). Jalankan simulasi di bawah untuk lihat prosesnya.' },
      { sql: 'SELECT k.kode_mk, k.nim, k.nilai\nFROM krs k\nWHERE k.nilai = (SELECT MAX(k2.nilai) FROM krs k2 WHERE k2.kode_mk = k.kode_mk);', ket: 'Nilai tertinggi di setiap matkul (pemegang "juara" per matkul). IF202 nggak muncul karena satu-satunya nilainya NULL.' },
      { sql: 'SELECT m.nama, m.kota, m.ipk\nFROM mahasiswa m\nWHERE m.ipk = (SELECT MAX(m2.ipk) FROM mahasiswa m2 WHERE m2.kota = m.kota);', ket: 'Mahasiswa ber-IPK tertinggi di kotanya masing-masing.' }
    ],
    viz: { type: 'corr' },
    salah: ['Alias dalam dan luar sama, sehingga MySQL memakai kolom tabel dalam semua (hubungannya hilang).', 'Mengira correlated subquery dijalankan sekali. Dia dijalankan sekali per baris luar, jadi bisa lambat di tabel besar.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>nama</code>, <code>jurusan</code>, <code>ipk</code> mahasiswa yang IPK-nya <b>tertinggi di jurusannya</b>.', a: 'SELECT m.nama, m.jurusan, m.ipk\nFROM mahasiswa m\nWHERE m.ipk = (SELECT MAX(m2.ipk) FROM mahasiswa m2 WHERE m2.jurusan = m.jurusan);', h: ['Mirip contoh 3, tapi per jurusan.', 'MAX(m2.ipk) ... WHERE m2.jurusan = m.jurusan', 'Bandingkan dengan =.'], ex: 'Fitri (TI), Citra (SI), Joko (TK).' },
      { lv: 'sedang', q: 'Tampilkan <code>id</code>, <code>kode_mk</code>, <code>nilai</code> dari KRS yang nilainya <b>di bawah rata-rata matkulnya sendiri</b>.', a: 'SELECT k.id, k.kode_mk, k.nilai\nFROM krs k\nWHERE k.nilai < (SELECT AVG(k2.nilai) FROM krs k2 WHERE k2.kode_mk = k.kode_mk);', h: ['Tabel luar krs k, tabel dalam krs k2.', 'AVG(k2.nilai) ... WHERE k2.kode_mk = k.kode_mk', 'Bandingkan pakai <'], ex: '4 KRS: Budi di IF101 (65 < 84.25) dan IF102 (55 < 71.67), Joko di IF103 (72 < 73.5), Eko di IF201 (60 < 75).' },
      { lv: 'sulit', q: 'Tampilkan <code>nama</code>, <code>angkatan</code>, <code>ipk</code> mahasiswa yang IPK-nya di atas rata-rata <b>angkatannya sendiri</b>.', a: 'SELECT m.nama, m.angkatan, m.ipk\nFROM mahasiswa m\nWHERE m.ipk > (SELECT AVG(m2.ipk) FROM mahasiswa m2 WHERE m2.angkatan = m.angkatan);', h: ['Polanya sama, hubungkan lewat angkatan.', 'm2.angkatan = m.angkatan', 'Angkatan 2024 semuanya NULL, jadi rata-ratanya NULL dan nggak ada yang lolos.'], ex: '6 mahasiswa: Andi, Citra (2021), Fitri (2022), Hana, Joko, Kartika (2023).' }
    ],
    ringkas: 'Correlated subquery menyebut kolom tabel luar sehingga dijalankan ulang untuk setiap baris, cocok untuk perbandingan "dengan kelompoknya sendiri".'
  },
  {
    id: '5.8', t: 'Subquery vs JOIN (soal sama, dua cara)',
    konsep: `<p>Banyak soal bisa diselesaikan dengan subquery <b>atau</b> JOIN. Di tes, kadang diminta salah satu secara spesifik.</p>
<table class="cmp"><tr><th></th><th>Subquery (IN / EXISTS)</th><th>JOIN</th></tr>
<tr><td>Cocok untuk</td><td>menyaring: "yang punya / nggak punya ..."</td><td>menampilkan kolom dari dua tabel sekaligus</td></tr>
<tr><td>Duplikat</td><td>nggak dobel (Andi muncul sekali)</td><td>bisa dobel kalau pasangannya banyak (perlu DISTINCT)</td></tr>
<tr><td>Kolom tabel lain di hasil?</td><td>nggak bisa (kecuali scalar subquery)</td><td>bisa</td></tr>
<tr><td>Keterbacaan</td><td>mirip bahasa sehari-hari</td><td>lebih ringkas untuk banyak tabel</td></tr>
<tr><td>Performa di MySQL 8</td><td colspan="2">biasanya mirip, karena optimizer sering mengubah IN/EXISTS jadi semi-join</td></tr></table>`,
    sintaks: { code: `-- Subquery
SELECT nama FROM mahasiswa
WHERE nim IN (SELECT nim FROM krs WHERE kode_mk = 'IF101');

-- JOIN
SELECT m.nama FROM mahasiswa m
JOIN krs k ON m.nim = k.nim
WHERE k.kode_mk = 'IF101';`, ket: [['Hasil keduanya', 'sama: Andi, Budi, Citra, Fitri.']] },
    contoh: [
      { t: 'subquery', sql: "SELECT nama FROM mahasiswa\nWHERE nim IN (SELECT nim FROM krs WHERE kode_mk = 'IF101');", ket: '4 nama.' },
      { t: 'JOIN', sql: "SELECT m.nama FROM mahasiswa m\nJOIN krs k ON m.nim = k.nim\nWHERE k.kode_mk = 'IF101';", ket: '4 nama yang sama. Satu mahasiswa hanya punya satu KRS IF101, jadi nggak ada dobel.' },
      { t: 'awas dobel', sql: "SELECT m.nama FROM mahasiswa m JOIN krs k ON m.nim = k.nim WHERE k.semester = 3;\nSELECT DISTINCT m.nama FROM mahasiswa m JOIN krs k ON m.nim = k.nim WHERE k.semester = 3;\nSELECT nama FROM mahasiswa WHERE nim IN (SELECT nim FROM krs WHERE semester = 3);", ket: 'Query 1 (JOIN) memberi 7 baris: Andi, Citra, Fitri dobel. Query 2 pakai DISTINCT jadi 4. Query 3 (subquery) langsung 4 tanpa dobel.' },
      { t: 'mencari yang nggak punya pasangan', sql: 'SELECT m.nama FROM mahasiswa m\nWHERE NOT EXISTS (SELECT 1 FROM krs k WHERE k.nim = m.nim);\n\nSELECT m.nama FROM mahasiswa m\nLEFT JOIN krs k ON m.nim = k.nim\nWHERE k.id IS NULL;', ket: 'Dua cara klasik, hasil sama: 4 mahasiswa tanpa KRS.' }
    ],
    salah: ['Pakai JOIN untuk menyaring lalu lupa DISTINCT, sehingga hasil dobel.', 'Pakai subquery IN padahal butuh kolom dari tabel lain di hasil.'],
    latihan: [
      { lv: 'mudah', q: "Pakai JOIN: tampilkan nama dosen yang mengajar matkul yang pernah diambil 'Andi Pratama'.", a: "SELECT d.nama\nFROM mahasiswa m\nJOIN krs k ON m.nim = k.nim\nJOIN matakuliah mk ON k.kode_mk = mk.kode_mk\nJOIN dosen d ON mk.id_dosen = d.id_dosen\nWHERE m.nama = 'Andi Pratama';", h: ['Rantai: mahasiswa → krs → matakuliah → dosen.', 'Saring nama mahasiswa di WHERE.', 'Tampilkan d.nama.'], ex: 'Dr. Budi Santoso, Dr. Siti Rahmawati, Ir. Ahmad Fauzi.' },
      { lv: 'sedang', q: 'Pakai subquery (IN bertingkat): tampilkan <code>nama_mk</code> yang diambil mahasiswa dari kota Bandung.', a: "SELECT nama_mk FROM matakuliah\nWHERE kode_mk IN (\n  SELECT kode_mk FROM krs WHERE nim IN (\n    SELECT nim FROM mahasiswa WHERE kota = 'Bandung'\n  )\n);", h: ['Paling dalam: nim mahasiswa Bandung.', 'Tengah: kode_mk dari krs milik nim tersebut.', 'Luar: nama_mk dari kode_mk tersebut.'], ex: 'Budi (IF101, IF102) dan Gilang (IF203): Basis Data, Algoritma dan Pemrograman, Sistem Operasi.' },
      { lv: 'sulit', q: 'Tampilkan nama mahasiswa (tanpa dobel) yang pernah mendapat nilai 85 ke atas. Bebas pakai cara apa saja.', a: 'SELECT nama FROM mahasiswa\nWHERE nim IN (SELECT nim FROM krs WHERE nilai >= 85);', h: ['Kalau pakai JOIN, jangan lupa DISTINCT.', 'Kalau pakai subquery, IN sudah otomatis nggak dobel.', 'WHERE nim IN (SELECT nim FROM krs WHERE nilai >= 85)'], ex: 'Andi, Citra, Fitri. Versi JOIN tanpa DISTINCT akan memunculkan Andi dan Citra dua kali.' }
    ],
    ringkas: 'Subquery cocok untuk menyaring tanpa dobel, JOIN cocok untuk menampilkan kolom dari banyak tabel; keduanya sering bisa saling menggantikan.'
  }
  ]
});

CH.push({
  id: 'bab6', title: 'Bab 6 · CTE (Common Table Expression)',
  lead: 'CTE = memberi nama pada subquery di awal query memakai WITH, supaya query panjang jadi rapi seperti langkah-langkah resep.',
  intro: `<div class="warn"><b>⚠ Di MySQL ditulis begini:</b> CTE (<code>WITH ... AS</code>) baru ada di <b>MySQL 8.0</b> ke atas (MariaDB 10.2+). Di MySQL 5.7 akan syntax error. Cek versi dengan <code>SELECT VERSION();</code>.</div>`,
  subs: [
  {
    id: '6.1', t: 'WITH ... AS (CTE dasar)',
    konsep: `<div class="analogi">📝 CTE = <b>coret-coretan bernama</b> di pinggir kertas ujian. "Misalkan <b>rata</b> = rata-rata IPK." Setelah itu, di jawaban utama kamu tinggal menyebut <b>rata</b>.</div>
<p>CTE mirip derived table (Bab 5.5), bedanya ditulis <b>di depan</b> dengan nama, sehingga query utama lebih bersih. CTE hanya hidup selama satu query itu.</p>`,
    sintaks: { code: `WITH nama_cte AS (
  SELECT ...
)
SELECT ... FROM nama_cte ...;

-- dengan nama kolom eksplisit
WITH nama_cte (kolom1, kolom2) AS (
  SELECT a, b FROM ...
)
SELECT * FROM nama_cte;`, ket: [['WITH nama AS ( ... )', 'definisikan CTE.'], ['SELECT ... FROM nama', 'pakai seperti tabel biasa.'], ['(kolom1, kolom2)', 'opsional: memberi nama kolom hasil CTE.']] },
    contoh: [
      { sql: 'WITH rata AS (\n  SELECT AVG(ipk) AS r FROM mahasiswa\n)\nSELECT m.nama, m.ipk\nFROM mahasiswa m, rata\nWHERE m.ipk > rata.r;', ket: 'CTE "rata" berisi satu angka (3.2167). Query utama tinggal membandingkan. Hasil 5 mahasiswa, sama dengan Bab 5.1.' },
      { sql: 'WITH krs_lengkap AS (\n  SELECT k.nim, mk.nama_mk, mk.sks, k.nilai\n  FROM krs k JOIN matakuliah mk ON k.kode_mk = mk.kode_mk\n)\nSELECT nim, SUM(sks) AS total_sks, COUNT(*) AS jml_mk\nFROM krs_lengkap\nGROUP BY nim;', ket: 'CTE menyiapkan "tabel gabungan" dulu, lalu query utama cukup GROUP BY. 10 baris.' },
      { sql: 'WITH jml (jurusan, total) AS (\n  SELECT jurusan, COUNT(*) FROM mahasiswa GROUP BY jurusan\n)\nSELECT * FROM jml WHERE total > 4;', ket: 'Nama kolom ditentukan di WITH jml (jurusan, total). Hanya TI (6 orang) yang lebih dari 4.' }
    ],
    salah: ['Menaruh titik koma setelah kurung CTE: <code>WITH x AS (...); SELECT ...</code>. CTE dan SELECT utamanya satu perintah, jangan dipisah.', 'Memakai CTE di query lain setelahnya. CTE cuma berlaku untuk satu query.', 'Lupa AS: <code>WITH x (SELECT ...)</code>.'],
    latihan: [
      { lv: 'mudah', q: "Buat CTE <code>mhs_ti</code> berisi <code>nim</code>, <code>nama</code>, <code>ipk</code> mahasiswa Teknik Informatika. Lalu dari CTE itu tampilkan yang IPK-nya minimal 3.5.", a: "WITH mhs_ti AS (\n  SELECT nim, nama, ipk FROM mahasiswa WHERE jurusan = 'Teknik Informatika'\n)\nSELECT * FROM mhs_ti WHERE ipk >= 3.5;", h: ['WITH mhs_ti AS ( SELECT ... )', "WHERE jurusan = 'Teknik Informatika' di dalam CTE.", 'SELECT * FROM mhs_ti WHERE ipk >= 3.5'], ex: 'Fitri dan Kartika.' },
      { lv: 'sedang', q: 'Buat CTE berisi jumlah KRS per nim. Lalu tampilkan <code>nama</code> mahasiswa yang punya minimal 2 KRS (JOIN CTE dengan mahasiswa).', a: 'WITH jml_krs AS (\n  SELECT nim, COUNT(*) AS jml FROM krs GROUP BY nim\n)\nSELECT m.nama\nFROM mahasiswa m\nJOIN jml_krs j ON m.nim = j.nim\nWHERE j.jml >= 2;', h: ['CTE: SELECT nim, COUNT(*) AS jml FROM krs GROUP BY nim', 'JOIN CTE ke mahasiswa lewat nim.', 'WHERE j.jml >= 2'], ex: 'Andi, Budi, Citra, Fitri.' },
      { lv: 'sulit', q: 'Buat CTE rata-rata nilai per <code>kode_mk</code>. Lalu tampilkan <code>nama_mk</code> dan rata-ratanya (kolom <code>rata</code>) untuk matkul yang rata-ratanya di atas 75.', a: 'WITH rata_mk AS (\n  SELECT kode_mk, AVG(nilai) AS rata FROM krs GROUP BY kode_mk\n)\nSELECT mk.nama_mk, r.rata\nFROM rata_mk r\nJOIN matakuliah mk ON r.kode_mk = mk.kode_mk\nWHERE r.rata > 75;', h: ['CTE: AVG(nilai) per kode_mk.', 'JOIN ke matakuliah untuk nama_mk.', 'WHERE r.rata > 75 (75 pas nggak termasuk).'], ex: 'Basis Data (84.25) dan Statistika (88). Jaringan Komputer tepat 75, jadi nggak ikut.' }
    ],
    ringkas: 'WITH nama AS (SELECT ...) memberi nama pada hasil query sementara, lalu query utama memakainya seperti tabel.'
  },
  {
    id: '6.2', t: 'Multiple CTE',
    konsep: `<p>Satu WITH bisa berisi <b>beberapa CTE</b>, dipisah koma. CTE yang belakangan boleh memakai CTE sebelumnya.</p>
<div class="analogi">🍲 Seperti resep: "Langkah 1: rebus air. Langkah 2: masukkan mi ke air <b>dari langkah 1</b>. Langkah 3: sajikan." Setiap CTE satu langkah.</div>`,
    sintaks: { code: `WITH
  langkah1 AS (SELECT ...),
  langkah2 AS (SELECT ... FROM langkah1 ...),
  langkah3 AS (SELECT ... FROM langkah2 ...)
SELECT * FROM langkah3;`, ket: [['koma', 'pemisah antar-CTE. Kata WITH cukup sekali di depan.'], ['urutan', 'CTE hanya bisa memakai CTE yang ditulis sebelumnya.']] },
    contoh: [
      { sql: 'WITH\n  total_per_mhs AS (\n    SELECT k.nim, SUM(mk.sks) AS total_sks\n    FROM krs k JOIN matakuliah mk ON k.kode_mk = mk.kode_mk\n    GROUP BY k.nim\n  ),\n  rata AS (\n    SELECT AVG(total_sks) AS r FROM total_per_mhs\n  )\nSELECT m.nama, t.total_sks\nFROM total_per_mhs t\nJOIN mahasiswa m ON m.nim = t.nim, rata\nWHERE t.total_sks > rata.r;', ket: 'Soal sulit Bab 5.5 versi CTE. Langkah 1 menghitung total SKS, langkah 2 rata-ratanya (4.8), query utama menyaring. Jauh lebih mudah dibaca daripada subquery dobel.' },
      { sql: 'WITH\n  mk_dosen AS (\n    SELECT mk.kode_mk, d.nama AS dosen\n    FROM matakuliah mk JOIN dosen d ON mk.id_dosen = d.id_dosen\n  ),\n  peserta AS (\n    SELECT kode_mk, COUNT(*) AS jml FROM krs GROUP BY kode_mk\n  )\nSELECT md.dosen, SUM(IFNULL(p.jml, 0)) AS total_peserta\nFROM mk_dosen md\nLEFT JOIN peserta p ON md.kode_mk = p.kode_mk\nGROUP BY md.dosen\nORDER BY total_peserta DESC;', ket: 'Total mahasiswa yang diajar tiap dosen. Siti paling banyak (4 + 2 = 6). Agus 0 karena IF301 belum diambil.' }
    ],
    salah: ['Menulis WITH berkali-kali: <code>WITH a AS (...) WITH b AS (...)</code>. Yang benar: <code>WITH a AS (...), b AS (...)</code>.', 'Memakai CTE yang ditulis setelahnya.'],
    latihan: [
      { lv: 'mudah', q: "Buat dua CTE: <code>ti</code> (mahasiswa Teknik Informatika) dan <code>si</code> (mahasiswa Sistem Informasi). Tampilkan satu baris dengan dua kolom: <code>jml_ti</code> dan <code>jml_si</code>.", a: "WITH\n  ti AS (SELECT * FROM mahasiswa WHERE jurusan = 'Teknik Informatika'),\n  si AS (SELECT * FROM mahasiswa WHERE jurusan = 'Sistem Informasi')\nSELECT (SELECT COUNT(*) FROM ti) AS jml_ti, (SELECT COUNT(*) FROM si) AS jml_si;", h: ['WITH ti AS (...), si AS (...)', 'Query utama: SELECT (SELECT COUNT(*) FROM ti) AS jml_ti, ...', 'Dua scalar subquery dalam satu SELECT.'], ex: '6 dan 4.' },
      { lv: 'sedang', q: 'CTE pertama: rata-rata IPK per jurusan. CTE kedua: rata-rata tertinggi dari CTE pertama. Tampilkan <code>jurusan</code> yang rata-ratanya tertinggi.', a: 'WITH\n  rata_jur AS (SELECT jurusan, AVG(ipk) AS r FROM mahasiswa GROUP BY jurusan),\n  tertinggi AS (SELECT MAX(r) AS mx FROM rata_jur)\nSELECT rj.jurusan\nFROM rata_jur rj, tertinggi t\nWHERE rj.r = t.mx;', h: ['CTE 1: GROUP BY jurusan.', 'CTE 2: SELECT MAX(r) FROM rata_jur', 'Query utama: cari jurusan yang r-nya sama dengan MAX.'], ex: 'Sistem Informasi (3.48).' },
      { lv: 'sulit', q: 'CTE pertama: total SKS per mahasiswa yang punya KRS. CTE kedua: rata-rata total itu. Tampilkan <code>nama</code> dan <code>total_sks</code> mahasiswa yang total SKS-nya <b>di bawah</b> rata-rata.', a: 'WITH\n  total AS (\n    SELECT k.nim, SUM(mk.sks) AS total_sks\n    FROM krs k JOIN matakuliah mk ON k.kode_mk = mk.kode_mk\n    GROUP BY k.nim\n  ),\n  rata AS (SELECT AVG(total_sks) AS r FROM total)\nSELECT m.nama, t.total_sks\nFROM total t\nJOIN mahasiswa m ON m.nim = t.nim, rata\nWHERE t.total_sks < rata.r;', h: ['Polanya sama dengan contoh 1, ganti > jadi <.', 'Rata-ratanya 4.8.', 'JOIN total ke mahasiswa untuk nama.'], ex: '6 mahasiswa: Dian, Eko, Gilang, Joko (3 SKS), Hana, Indra (4 SKS).' }
    ],
    ringkas: 'Multiple CTE ditulis WITH a AS (...), b AS (...), dan setiap CTE boleh memakai CTE sebelumnya seperti langkah-langkah resep.'
  },
  {
    id: '6.3', t: 'CTE vs subquery: kapan pakai yang mana?',
    konsep: `<table class="cmp"><tr><th></th><th>Subquery / derived table</th><th>CTE</th></tr>
<tr><td>Letak</td><td>di tengah query (bersarang)</td><td>di depan, diberi nama</td></tr>
<tr><td>Dibaca</td><td>dari dalam ke luar</td><td>dari atas ke bawah, seperti langkah</td></tr>
<tr><td>Dipakai berkali-kali</td><td>harus ditulis ulang</td><td>cukup sebut namanya</td></tr>
<tr><td>Rekursif</td><td>nggak bisa</td><td>bisa (WITH RECURSIVE)</td></tr>
<tr><td>Versi MySQL</td><td>semua versi</td><td>8.0+</td></tr>
<tr><td>Cocok untuk</td><td>saringan singkat (IN, EXISTS, satu nilai)</td><td>logika panjang bertahap, hasil yang dipakai ulang</td></tr></table>
<div class="analogi">📦 Subquery seperti <b>kotak di dalam kotak di dalam kotak</b>. CTE seperti <b>rak berlabel</b>: setiap barang ditaruh di rak bernama, gampang dicari.</div>`,
    sintaks: { code: `-- Subquery bersarang
SELECT ... FROM (SELECT ... FROM (SELECT ...) AS a) AS b;

-- CTE
WITH a AS (SELECT ...),
     b AS (SELECT ... FROM a)
SELECT ... FROM b;`, ket: [['aturan praktis', 'kalau subquery sudah 2 tingkat atau dipakai 2 kali, ubah jadi CTE.']] },
    contoh: [
      { t: 'versi subquery', sql: 'SELECT jurusan, rata FROM (\n  SELECT jurusan, AVG(ipk) AS rata FROM mahasiswa GROUP BY jurusan\n) AS t\nWHERE rata = (SELECT MAX(rata) FROM (\n  SELECT AVG(ipk) AS rata FROM mahasiswa GROUP BY jurusan\n) AS t2);', ket: 'Jurusan dengan rata-rata tertinggi. Query rata per jurusan ditulis DUA kali.' },
      { t: 'versi CTE', sql: 'WITH t AS (\n  SELECT jurusan, AVG(ipk) AS rata FROM mahasiswa GROUP BY jurusan\n)\nSELECT jurusan, rata FROM t\nWHERE rata = (SELECT MAX(rata) FROM t);', ket: 'Hasil sama (Sistem Informasi), tapi CTE t ditulis sekali dan dipakai dua kali.' },
      { t: 'CTE dipakai dua kali dalam JOIN', sql: 'WITH s AS (\n  SELECT jurusan, ROUND(AVG(ipk), 2) AS r FROM mahasiswa GROUP BY jurusan\n)\nSELECT a.jurusan AS lebih_tinggi, b.jurusan AS lebih_rendah\nFROM s a JOIN s b ON a.r > b.r;', ket: 'CTE yang sama di-JOIN dengan dirinya sendiri untuk membandingkan tiap pasangan jurusan. 3 pasangan.' }
    ],
    salah: ['Memakai CTE di server MySQL 5.7 (error).', 'Mengira CTE otomatis lebih cepat. Bedanya terutama di keterbacaan.'],
    latihan: [
      { lv: 'mudah', type: 'mc', q: 'Kapan CTE paling tepat dipakai dibanding subquery?', opsi: ['Saat cuma butuh satu angka untuk WHERE', 'Saat hasil sementara dipakai lebih dari sekali atau logikanya bertahap panjang', 'Saat server pakai MySQL 5.7', 'Saat ingin menghapus data'], benar: 1, h: ['Kelebihan utama CTE: diberi nama, bisa dipanggil ulang.'], ex: 'CTE bersinar saat query bertahap atau hasil sementara dipakai berulang.' },
      { lv: 'sedang', q: 'Tulis ulang query ini memakai CTE (hasil harus sama): <code>SELECT nama FROM mahasiswa WHERE nim IN (SELECT nim FROM krs WHERE nilai &gt;= 90);</code>', a: 'WITH pintar AS (\n  SELECT nim FROM krs WHERE nilai >= 90\n)\nSELECT nama FROM mahasiswa WHERE nim IN (SELECT nim FROM pintar);', h: ['Subquery di dalam IN dijadikan CTE.', 'WITH pintar AS (SELECT nim FROM krs WHERE nilai >= 90)', 'WHERE nim IN (SELECT nim FROM pintar)'], ex: 'Andi (90), Citra (92), Fitri (95). Bisa juga JOIN mahasiswa dengan CTE.' },
      { lv: 'sulit', q: 'Pakai CTE: untuk setiap jurusan, tampilkan <code>jurusan</code>, <code>nama</code>, dan <code>ipk</code> mahasiswa ber-IPK tertinggi di jurusan itu. (CTE berisi MAX ipk per jurusan, lalu JOIN dengan mahasiswa.)', a: 'WITH maks AS (\n  SELECT jurusan, MAX(ipk) AS ipk_max FROM mahasiswa GROUP BY jurusan\n)\nSELECT m.jurusan, m.nama, m.ipk\nFROM mahasiswa m\nJOIN maks x ON m.jurusan = x.jurusan AND m.ipk = x.ipk_max;', h: ['CTE: SELECT jurusan, MAX(ipk) ... GROUP BY jurusan', 'JOIN dengan dua syarat: jurusan sama DAN ipk sama dengan max.', 'ON m.jurusan = x.jurusan AND m.ipk = x.ipk_max'], ex: 'Sama dengan latihan correlated subquery 5.7, tapi lewat CTE: Fitri, Citra, Joko.' }
    ],
    ringkas: 'Subquery cocok untuk saringan singkat, CTE cocok untuk logika bertahap dan hasil yang dipakai berulang karena lebih mudah dibaca.'
  },
  {
    id: '6.4', t: 'Recursive CTE (deret angka & hierarki atasan-bawahan)',
    konsep: `<p><b>Recursive CTE</b> = CTE yang <b>memanggil dirinya sendiri</b> berulang-ulang sampai syarat berhenti terpenuhi.</p>
<div class="analogi">🪜 Seperti <b>naik tangga</b>: mulai di anak tangga 1 (anchor), lalu "dari anak tangga sekarang, naik satu" (langkah rekursif), terus sampai anak tangga ke-10 (syarat berhenti). Atau rantai komando: mulai dari Dekan, cari bawahannya, lalu bawahan dari bawahannya, dan seterusnya.</div>
<p>Bagiannya ada 3: <b>anchor</b> (titik awal), <b>UNION ALL</b>, dan <b>bagian rekursif</b> (yang menyebut nama CTE itu sendiri + syarat berhenti).</p>`,
    sintaks: { code: `WITH RECURSIVE nama_cte AS (
  SELECT ...                          -- 1. anchor: baris awal
  UNION ALL
  SELECT ... FROM nama_cte WHERE ...  -- 2. rekursif: pakai hasil sebelumnya + syarat berhenti
)
SELECT * FROM nama_cte;`, ket: [['WITH RECURSIVE', 'kata RECURSIVE wajib di MySQL.'], ['anchor', 'dijalankan sekali di awal.'], ['bagian rekursif', 'dijalankan berulang memakai baris hasil putaran sebelumnya.'], ['WHERE n &lt; 10', 'syarat berhenti. Tanpa ini, berputar terus.']] },
    mysql: ['Di MySQL, tipe kolom recursive CTE ditentukan oleh <b>anchor</b>. Kalau anchor-nya teks pendek lalu bagian rekursif menyambung teks makin panjang, bisa error "Data too long". Solusinya: <code>CAST(nama AS CHAR(500))</code> di anchor (lihat contoh 3).', 'MySQL membatasi kedalaman rekursi dengan <code>cte_max_recursion_depth</code> (default 1000). Lebih dari itu error.'],
    contoh: [
      { sql: 'WITH RECURSIVE deret AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1 FROM deret WHERE n < 10\n)\nSELECT n FROM deret;', ket: 'Anchor: 1. Setiap putaran menambah 1 selama n masih kurang dari 10. Hasil 1 sampai 10.' },
      { sql: 'WITH RECURSIVE hierarki AS (\n  SELECT id, nama, jabatan, 1 AS level\n  FROM staf WHERE id_atasan IS NULL\n  UNION ALL\n  SELECT s.id, s.nama, s.jabatan, h.level + 1\n  FROM staf s\n  JOIN hierarki h ON s.id_atasan = h.id\n)\nSELECT * FROM hierarki ORDER BY level, id;', ket: 'Anchor: Dekan (level 1). Putaran berikut mencari staf yang atasannya ada di hasil sebelumnya. Berhenti sendiri saat nggak ada bawahan lagi (level 4: asisten lab).' },
      { sql: "WITH RECURSIVE jalur AS (\n  SELECT id, nama, CAST(nama AS CHAR(500)) AS rantai\n  FROM staf WHERE id_atasan IS NULL\n  UNION ALL\n  SELECT s.id, s.nama, CONCAT(j.rantai, ' > ', s.nama)\n  FROM staf s JOIN jalur j ON s.id_atasan = j.id\n)\nSELECT nama, rantai FROM jalur;", ket: 'Rantai komando lengkap tiap staf, misal "Prof. Rina Wulandari > Dr. Budi Santoso > Agus Pratama, M.Kom > Rizky Maulana". CAST di anchor supaya kolom cukup panjang di MySQL.' }
    ],
    viz: REC_VIZ,
    salah: ['Lupa kata RECURSIVE di MySQL.', 'Lupa syarat berhenti (deret) sehingga error kedalaman rekursi.', 'Memakai UNION (bukan UNION ALL). Boleh di MySQL, tapi lebih lambat dan bisa menghentikan rekursi lebih awal kalau ada baris sama.', 'Tipe/panjang kolom anchor terlalu kecil (lihat CAST).'],
    latihan: [
      { lv: 'mudah', q: 'Pakai recursive CTE, tampilkan deret angka 1 sampai 5 (kolom <code>n</code>).', a: 'WITH RECURSIVE deret AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1 FROM deret WHERE n < 5\n)\nSELECT n FROM deret;', h: ['Contoh 1, ganti batasnya.', 'Anchor SELECT 1 AS n.', 'WHERE n < 5'], ex: '5 baris: 1, 2, 3, 4, 5.' },
      { lv: 'sedang', q: 'Tampilkan deret bilangan genap 2, 4, 6, ..., 20 (kolom <code>n</code>).', a: 'WITH RECURSIVE genap AS (\n  SELECT 2 AS n\n  UNION ALL\n  SELECT n + 2 FROM genap WHERE n < 20\n)\nSELECT n FROM genap;', h: ['Anchor mulai dari 2.', 'Langkahnya + 2.', 'Berhenti saat n sudah 20: WHERE n < 20.'], ex: '10 baris. (Cara lain: deret 1-10 lalu SELECT n * 2.)' },
      { lv: 'sulit', q: "Tampilkan <code>nama</code> semua bawahan (langsung <b>maupun tidak langsung</b>) dari 'Dr. Budi Santoso' di tabel staf. Budi sendiri jangan ikut.", a: "WITH RECURSIVE bawahan AS (\n  SELECT id, nama FROM staf WHERE id_atasan = (SELECT id FROM staf WHERE nama = 'Dr. Budi Santoso')\n  UNION ALL\n  SELECT s.id, s.nama FROM staf s JOIN bawahan b ON s.id_atasan = b.id\n)\nSELECT nama FROM bawahan;", h: ['Anchor: bawahan langsung Budi (id_atasan = id Budi).', 'Rekursif: staf yang atasannya ada di CTE bawahan.', 'JOIN bawahan b ON s.id_atasan = b.id'], ex: 'Agus, Dewi (langsung), lalu Rizky, Putri, Fajar (bawahan Agus dan Dewi). Total 5.' }
    ],
    ringkas: 'Recursive CTE = anchor + UNION ALL + bagian yang memanggil dirinya sendiri dengan syarat berhenti, dipakai untuk deret dan hierarki.'
  }
  ]
});
