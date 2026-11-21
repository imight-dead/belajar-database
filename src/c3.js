/* ===== BAB 3 DML ===== */
const ORDER_FLOW = `<p><b>Urutan kamu MENULIS:</b></p>
<div class="flow"><div class="st"><b>SELECT</b></div><div class="ar">→</div><div class="st"><b>FROM</b></div><div class="ar">→</div><div class="st"><b>WHERE</b></div><div class="ar">→</div><div class="st"><b>GROUP BY</b></div><div class="ar">→</div><div class="st"><b>HAVING</b></div><div class="ar">→</div><div class="st"><b>ORDER BY</b></div><div class="ar">→</div><div class="st"><b>LIMIT</b></div></div>
<p><b>Urutan MySQL MENJALANKAN:</b></p>
<div class="flow">
<div class="st"><span class="n">1</span><b>FROM / JOIN</b><small>ambil tabel, gabungkan</small></div><div class="ar">→</div>
<div class="st"><span class="n">2</span><b>WHERE</b><small>saring baris satu-satu</small></div><div class="ar">→</div>
<div class="st"><span class="n">3</span><b>GROUP BY</b><small>kelompokkan</small></div><div class="ar">→</div>
<div class="st"><span class="n">4</span><b>HAVING</b><small>saring kelompok</small></div><div class="ar">→</div>
<div class="st"><span class="n">5</span><b>SELECT</b><small>pilih kolom, hitung, alias dibuat</small></div><div class="ar">→</div>
<div class="st"><span class="n">6</span><b>ORDER BY</b><small>urutkan</small></div><div class="ar">→</div>
<div class="st"><span class="n">7</span><b>LIMIT</b><small>potong jumlah baris</small></div></div>
<div class="tip">Konsekuensi penting: alias yang dibuat di SELECT (langkah 5) <b>belum ada</b> saat WHERE (langkah 2) dijalankan, jadi nggak bisa dipakai di WHERE. Tapi bisa dipakai di ORDER BY (langkah 6). Fungsi agregat juga belum ada di WHERE, makanya butuh HAVING.</div>`;

CH.push({
  id: 'bab3', title: 'Bab 3 · DML',
  lead: 'DML (Data Manipulation Language) = mengolah ISI data: INSERT, UPDATE, DELETE, dan SELECT lengkap. Ini bagian yang paling banyak keluar di tes.',
  subs: [
  {
    id: '3.1', t: 'INSERT: satu baris, banyak baris, INSERT ... SELECT',
    konsep: `<div class="analogi">✍️ INSERT = <b>menulis baris baru</b> di lembar. Kamu sebut kolom mana saja yang diisi, lalu nilainya dengan urutan yang sama.</div>
<p>Kolom yang nggak disebut akan terisi DEFAULT, NULL, atau nomor AUTO_INCREMENT.</p>`,
    sintaks: { code: `-- 1 baris
INSERT INTO tabel (kolom1, kolom2) VALUES (nilai1, nilai2);
-- banyak baris sekaligus
INSERT INTO tabel (kolom1, kolom2) VALUES
  (nilai1, nilai2),
  (nilai1, nilai2);
-- tanpa daftar kolom: nilai HARUS lengkap sesuai urutan kolom tabel
INSERT INTO tabel VALUES (n1, n2, n3);
-- salin dari hasil query
INSERT INTO tabel_tujuan (kolom1, kolom2)
SELECT kolomA, kolomB FROM tabel_asal WHERE kondisi;`, ket: [['INSERT INTO tabel (kolom...)', 'kolom yang mau diisi.'], ['VALUES (...)', 'nilainya, urutannya sama dengan daftar kolom.'], ['(...), (...)', 'banyak baris dipisah koma, lebih cepat daripada banyak INSERT.'], ['INSERT ... SELECT', 'nggak pakai VALUES; barisnya diambil dari hasil SELECT.']] },
    contoh: [
      { sql: "INSERT INTO dosen (id_dosen, nama, keahlian) VALUES (10, 'Rina Kartika, M.Kom', 'Data Science');\nSELECT * FROM dosen;", ket: 'Baris ke-10 muncul di dosen.' },
      { sql: "INSERT INTO krs (nim, kode_mk, semester, nilai) VALUES\n  ('2301011', 'IF101', 1, NULL),\n  ('2301011', 'IF102', 1, NULL);\nSELECT * FROM krs WHERE nim = '2301011';", ket: 'Dua baris masuk sekaligus untuk Kartika. Kolom id nggak disebut, jadi terisi otomatis 16 dan 17.' },
      { sql: "CREATE TABLE calon_wisuda (nim VARCHAR(10), nama VARCHAR(60), ipk DECIMAL(3,2));\nINSERT INTO calon_wisuda (nim, nama, ipk)\nSELECT nim, nama, ipk FROM mahasiswa WHERE angkatan = 2021;\nSELECT * FROM calon_wisuda;", ket: 'INSERT ... SELECT menyalin 3 mahasiswa angkatan 2021 ke tabel baru. Nggak perlu ketik datanya satu-satu.' }
    ],
    salah: ['Jumlah nilai nggak sama dengan jumlah kolom: error "Column count doesn\'t match value count".', 'Lupa kutip untuk teks/tanggal.', 'Mengisi PK yang sudah ada: error "Duplicate entry".', 'Menulis <code>INSERT INTO tabel VALUES</code> tanpa daftar kolom, lalu urutan nilainya beda dengan urutan kolom.'],
    latihan: [
      { lv: 'mudah', q: "Tambahkan mahasiswa baru: nim '2401015', nama 'Oki Wijaya', jurusan 'Sistem Informasi', angkatan 2024, kota 'Malang', IPK kosong.", a: "INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, kota, ipk)\nVALUES ('2401015', 'Oki Wijaya', 'Sistem Informasi', 2024, 'Malang', NULL);", check: "SELECT * FROM mahasiswa WHERE nim = '2401015'", h: ['INSERT INTO mahasiswa (kolom...) VALUES (...)', 'IPK kosong = NULL (tanpa kutip), atau jangan sebut kolom ipk.', "VALUES ('2401015', 'Oki Wijaya', 'Sistem Informasi', 2024, 'Malang', NULL)"], ex: 'Angka 2024 tanpa kutip, teks pakai kutip, NULL tanpa kutip.' },
      { lv: 'sedang', q: "Daftarkan Kartika (nim '2301011') ke matkul IF103 dan IF204 di semester 1 dalam <b>satu</b> perintah INSERT. Nilai masih kosong.", a: "INSERT INTO krs (nim, kode_mk, semester) VALUES\n  ('2301011', 'IF103', 1),\n  ('2301011', 'IF204', 1);", check: "SELECT nim, kode_mk, semester, nilai FROM krs WHERE nim = '2301011'", h: ['Satu INSERT, dua kelompok VALUES dipisah koma.', 'Kolom id nggak perlu diisi (otomatis).', "VALUES ('2301011', 'IF103', 1), ('2301011', 'IF204', 1)"], ex: 'Kolom nilai yang nggak disebut otomatis NULL.' },
      { lv: 'sulit', q: 'Buat tabel <code>calon_asisten</code> (nim VARCHAR(10), nama VARCHAR(60), ipk DECIMAL(3,2)), lalu isi dengan semua mahasiswa yang IPK-nya minimal 3.5 memakai INSERT ... SELECT.', a: 'CREATE TABLE calon_asisten (nim VARCHAR(10), nama VARCHAR(60), ipk DECIMAL(3,2));\nINSERT INTO calon_asisten (nim, nama, ipk)\nSELECT nim, nama, ipk FROM mahasiswa WHERE ipk >= 3.5;', check: 'SELECT * FROM calon_asisten', h: ['Dua perintah: CREATE TABLE lalu INSERT ... SELECT.', 'INSERT ... SELECT nggak pakai kata VALUES.', 'INSERT INTO calon_asisten (nim, nama, ipk) SELECT nim, nama, ipk FROM mahasiswa WHERE ipk >= 3.5;'], ex: '4 mahasiswa tersalin: Citra, Fitri, Hana, Kartika.' }
    ],
    ringkas: 'INSERT INTO tabel (kolom) VALUES (nilai) menambah baris; banyak baris pakai koma, dan INSERT ... SELECT menyalin dari hasil query.'
  },
  {
    id: '3.2', t: 'UPDATE (dan bahaya UPDATE tanpa WHERE)',
    konsep: `<div class="analogi">✏️ UPDATE = <b>menghapus pakai tipe-x lalu menulis ulang</b> isi sel tertentu. WHERE menentukan baris mana yang diubah.</div>
<div class="warn"><b>⚠ Bahaya:</b> UPDATE <b>tanpa WHERE</b> mengubah <b>SEMUA baris</b>. Satu salah ketik, ribuan data rusak. Biasakan: tulis WHERE dulu, cek dengan SELECT pakai WHERE yang sama, baru jalankan UPDATE.</div>`,
    sintaks: { code: `UPDATE tabel
SET kolom1 = nilai1, kolom2 = nilai2
WHERE kondisi;

-- Pengaman di MySQL Workbench / sesi kamu:
SET SQL_SAFE_UPDATES = 1;  -- menolak UPDATE/DELETE tanpa WHERE pakai key`, ket: [['UPDATE tabel', 'tabel yang diubah.'], ['SET kolom = nilai', 'kolom dan nilai barunya. Banyak kolom dipisah koma (bukan AND!).'], ['WHERE', 'baris mana. Tanpa WHERE = semua baris.'], ['kolom = kolom + 5', 'nilai baru bisa dihitung dari nilai lama.']] },
    contoh: [
      { sql: 'UPDATE krs SET nilai = 88 WHERE id = 11;\nSELECT * FROM krs WHERE id = 11;', ket: 'KRS id 11 (Fitri, IF202) yang tadinya NULL sekarang bernilai 88. Hanya 1 baris diubah.' },
      { sql: "UPDATE mahasiswa SET kota = 'Depok', ipk = 3.10 WHERE nim = '2101002';\nSELECT * FROM mahasiswa WHERE nim = '2101002';", ket: 'Dua kolom diubah sekaligus, dipisah koma.' },
      { t: 'BAHAYA', sql: "UPDATE mahasiswa SET kota = 'Jakarta';\nSELECT nama, kota FROM mahasiswa;", ket: 'Tanpa WHERE, 14 mahasiswa semuanya jadi "Jakarta". Data kota asli hilang. (Tenang, di sini cuma salinan.)' },
      { sql: "UPDATE krs SET nilai = nilai + 5 WHERE kode_mk = 'IF102' AND nilai IS NOT NULL;\nSELECT * FROM krs WHERE kode_mk = 'IF102';", ket: 'Nilai IF102 naik 5 poin (bonus). Baris Indra yang NULL nggak berubah karena difilter, dan NULL + 5 tetap NULL.', hl: 'null' }
    ],
    salah: ['Lupa WHERE. Semua baris berubah.', 'Memisahkan kolom di SET pakai AND: <code>SET kota = \'Depok\' AND ipk = 3.1</code>. Ini bukan error, tapi hasilnya salah total (kota diisi hasil perbandingan 0/1). Pakai koma.', 'WHERE terlalu longgar, misal <code>WHERE nama LIKE \'%a%\'</code>, sehingga banyak baris ikut berubah.', 'Mengubah primary key yang dipakai tabel lain tanpa ON UPDATE CASCADE: ditolak.'],
    latihan: [
      { lv: 'mudah', q: "Ubah keahlian dosen dengan id_dosen 7 menjadi 'Keamanan Jaringan'.", a: "UPDATE dosen SET keahlian = 'Keamanan Jaringan' WHERE id_dosen = 7;", check: 'SELECT * FROM dosen', h: ['UPDATE dosen SET ...', 'Jangan lupa WHERE id_dosen = 7.', "UPDATE dosen SET keahlian = 'Keamanan Jaringan' WHERE id_dosen = 7;"], ex: 'Hanya baris Hendra yang berubah. Tanpa WHERE, semua dosen jadi ahli Keamanan Jaringan.' },
      { lv: 'sedang', q: 'Semua KRS yang nilainya masih kosong, isi dengan nilai 60.', a: 'UPDATE krs SET nilai = 60 WHERE nilai IS NULL;', check: 'SELECT id, nilai FROM krs', h: ['Kosong = NULL.', 'WHERE nilai IS NULL (bukan = NULL).', 'UPDATE krs SET nilai = 60 WHERE nilai IS NULL;'], ex: 'Dua baris (id 11 dan 14) berubah. Kalau ditulis WHERE nilai = NULL, nggak ada yang berubah.' },
      { lv: 'sulit', q: "Untuk semua matkul yang <b>belum punya dosen</b>: ubah sks jadi 3 dan tambahkan teks ' (Umum)' di belakang nama_mk. Contoh: 'Etika Profesi' jadi 'Etika Profesi (Umum)'.", a: "UPDATE matakuliah\nSET sks = 3, nama_mk = CONCAT(nama_mk, ' (Umum)')\nWHERE id_dosen IS NULL;", check: 'SELECT * FROM matakuliah', h: ['Dua kolom di SET, dipisah koma.', "Gabung teks pakai CONCAT(nama_mk, ' (Umum)').", 'WHERE id_dosen IS NULL'], ex: 'CONCAT menyambung teks lama dengan teks baru. Dua matkul berubah: IF302 dan IF303.' }
    ],
    ringkas: 'UPDATE tabel SET kolom = nilai WHERE kondisi mengubah isi; tanpa WHERE semua baris ikut berubah.'
  },
  {
    id: '3.3', t: 'DELETE',
    konsep: `<div class="analogi">🗑️ DELETE = <b>mencoret baris</b> dari lembar. Sama seperti UPDATE, WHERE menentukan baris mana. Tanpa WHERE, semua baris hilang (tapi tabelnya tetap).</div>
<p>Kalau baris itu masih dipakai tabel lain lewat FOREIGN KEY, DELETE ditolak (kecuali FK-nya ON DELETE CASCADE / SET NULL). Jadi hapus anaknya dulu, baru induknya.</p>`,
    sintaks: { code: `DELETE FROM tabel WHERE kondisi;
DELETE FROM tabel;                    -- semua baris (hati-hati!)
DELETE FROM tabel WHERE ... LIMIT 1;  -- MySQL: maksimal 1 baris`, ket: [['DELETE FROM tabel', 'nggak ada nama kolom, karena yang dihapus satu baris utuh.'], ['WHERE', 'baris yang dihapus.']] },
    contoh: [
      { sql: 'DELETE FROM krs WHERE id = 14;\nSELECT * FROM krs;', ket: 'KRS id 14 hilang, sisa 14 baris.' },
      { sql: "DELETE FROM mahasiswa WHERE nim = '2101001';", ket: 'Ditolak! Andi masih punya 3 KRS. FK krs.nim melindungi data supaya nggak ada KRS "yatim".', err: true },
      { sql: "DELETE FROM krs WHERE nim = '2101001';\nDELETE FROM mahasiswa WHERE nim = '2101001';\nSELECT COUNT(*) AS jumlah_mahasiswa FROM mahasiswa;", ket: 'Urutan yang benar: hapus anak (KRS Andi) dulu, baru induk (Andi). Sisa 13 mahasiswa.' }
    ],
    salah: ['<code>DELETE * FROM krs</code>. Di MySQL nggak pakai bintang.', '<code>DELETE nilai FROM krs</code> untuk mengosongkan satu kolom. Itu tugas UPDATE: <code>UPDATE krs SET nilai = NULL</code>.', 'Lupa WHERE.', 'Menghapus induk sebelum anak.'],
    latihan: [
      { lv: 'mudah', q: 'Hapus dosen dengan id_dosen 8.', a: 'DELETE FROM dosen WHERE id_dosen = 8;', check: 'SELECT * FROM dosen', h: ['DELETE FROM dosen ...', 'WHERE id_dosen = 8', 'DELETE FROM dosen WHERE id_dosen = 8;'], ex: 'Maya Sari nggak mengajar matkul apa pun, jadi aman dihapus.' },
      { lv: 'sedang', q: 'Hapus semua KRS semester 2.', a: 'DELETE FROM krs WHERE semester = 2;', check: 'SELECT * FROM krs', h: ['Tabelnya krs.', 'WHERE semester = 2', 'DELETE FROM krs WHERE semester = 2;'], ex: '3 KRS semester 2 terhapus, sisa 12.' },
      { lv: 'sulit', q: "Hapus mahasiswa Budi Setiawan (nim '2101002') dari database. Ingat, dia masih punya KRS.", a: "DELETE FROM krs WHERE nim = '2101002';\nDELETE FROM mahasiswa WHERE nim = '2101002';", check: "SELECT (SELECT COUNT(*) FROM mahasiswa WHERE nim = '2101002') AS budi_di_mahasiswa, (SELECT COUNT(*) FROM krs WHERE nim = '2101002') AS budi_di_krs, (SELECT COUNT(*) FROM krs) AS total_krs", h: ['Kalau langsung hapus dari mahasiswa, ditolak FOREIGN KEY.', 'Hapus KRS Budi dulu.', 'Dua perintah DELETE: krs dulu, lalu mahasiswa.'], ex: 'Hasil cek: Budi 0 di mahasiswa, 0 di krs, dan total KRS tinggal 13 (KRS orang lain aman).' }
    ],
    ringkas: 'DELETE FROM tabel WHERE kondisi menghapus baris; hapus data anak dulu sebelum data induk.'
  },
  {
    id: '3.4', t: 'SELECT dasar: pilih kolom, alias (AS), DISTINCT',
    konsep: `<p>SELECT = <b>membaca</b> data. Kamu pilih kolom apa yang mau dilihat.</p>
<div class="analogi">🏷️ <b>Alias (AS)</b> = memberi <b>nama panggilan</b> ke kolom atau tabel di hasil. <b>DISTINCT</b> = buang baris hasil yang <b>kembar</b>, seperti menghapus nama yang tertulis dua kali di daftar.</div>`,
    sintaks: { code: `SELECT kolom1, kolom2 FROM tabel;
SELECT kolom AS nama_baru FROM tabel;
SELECT kolom nama_baru FROM tabel;          -- AS boleh dihilangkan
SELECT kolom * 2 AS hasil FROM tabel;       -- kolom hitungan
SELECT DISTINCT kolom FROM tabel;
SELECT DISTINCT kolom1, kolom2 FROM tabel;  -- unik untuk KOMBINASI kedua kolom`, ket: [['AS', 'alias. Kalau ada spasi, apit kutip: AS \'Nama Lengkap\'.'], ['DISTINCT', 'ditulis langsung setelah SELECT, berlaku untuk semua kolom yang dipilih.']] },
    contoh: [
      { sql: 'SELECT nama, jurusan FROM mahasiswa;', ket: '14 baris, hanya 2 kolom.' },
      { sql: "SELECT nama AS nama_mahasiswa, ipk, ipk * 25 AS 'IPK skala 100' FROM mahasiswa;", ket: 'Judul kolom hasil berubah sesuai alias. Kolom ketiga hasil hitungan.' },
      { sql: 'SELECT DISTINCT jurusan FROM mahasiswa;', ket: 'Ada 14 mahasiswa tapi hanya 3 jurusan berbeda. DISTINCT membuang yang kembar.' },
      { sql: 'SELECT DISTINCT jurusan, angkatan FROM mahasiswa ORDER BY jurusan, angkatan;', ket: 'Unik berdasarkan kombinasi jurusan + angkatan: 10 kombinasi.' }
    ],
    salah: ['<code>SELECT DISTINCT(jurusan), nama</code> lalu berharap jurusan saja yang unik. DISTINCT berlaku untuk seluruh kombinasi kolom.', 'Alias dengan spasi tanpa kutip: <code>AS nama lengkap</code> = error.', 'Kebanyakan <code>SELECT *</code> di aplikasi nyata. Ambil kolom yang perlu saja.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>nama_mk</code> dan <code>sks</code> dari semua matakuliah.', a: 'SELECT nama_mk, sks FROM matakuliah;', h: ['SELECT kolom, kolom FROM tabel', 'Tabelnya matakuliah.', 'SELECT nama_mk, sks FROM matakuliah;'], ex: '10 baris, 2 kolom.' },
      { lv: 'sedang', q: 'Tampilkan daftar kota asal mahasiswa <b>tanpa duplikat</b>.', a: 'SELECT DISTINCT kota FROM mahasiswa;', h: ['Tanpa duplikat = DISTINCT.', 'SELECT DISTINCT kolom FROM ...', 'SELECT DISTINCT kota FROM mahasiswa;'], ex: 'Ada 6 kota berbeda.' },
      { lv: 'sulit', q: 'Tampilkan <code>kode_mk</code>, <code>nama_mk</code>, dan kolom baru bernama <code>jam_per_semester</code> = sks × 16 (anggap 1 SKS = 1 jam per minggu, 16 minggu).', a: 'SELECT kode_mk, nama_mk, sks * 16 AS jam_per_semester FROM matakuliah;', h: ['Kolom hitungan: sks * 16', 'Beri nama pakai AS.', 'SELECT kode_mk, nama_mk, sks * 16 AS jam_per_semester FROM matakuliah;'], ex: 'Matkul 3 SKS = 48 jam, 4 SKS = 64 jam, 2 SKS = 32 jam.' }
    ],
    ringkas: 'SELECT memilih kolom, AS memberi nama panggilan, DISTINCT membuang baris hasil yang kembar.'
  },
  {
    id: '3.5', t: 'WHERE dan operator (=, <>, >, AND, OR, NOT)',
    konsep: `<div class="analogi">🔎 WHERE = <b>saringan</b>. Setiap baris dicek: memenuhi syarat? Ikut. Nggak? Dibuang.</div>
<table class="cmp"><tr><th>Operator</th><th>Arti</th><th>Contoh</th></tr>
<tr><td>=</td><td>sama dengan</td><td>angkatan = 2022</td></tr>
<tr><td>&lt;&gt; atau !=</td><td>tidak sama dengan</td><td>kota &lt;&gt; 'Jakarta'</td></tr>
<tr><td>&gt; &lt; &gt;= &lt;=</td><td>lebih besar/kecil (atau sama)</td><td>ipk &gt;= 3.5</td></tr>
<tr><td>AND</td><td>dua-duanya harus benar</td><td>jurusan = 'Sistem Informasi' AND ipk &gt; 3.5</td></tr>
<tr><td>OR</td><td>salah satu benar sudah cukup</td><td>kota = 'Medan' OR kota = 'Semarang'</td></tr>
<tr><td>NOT</td><td>kebalikan</td><td>NOT jurusan = 'Teknik Informatika'</td></tr></table>
<p><b>AND dikerjakan lebih dulu dari OR</b> (seperti kali sebelum tambah). Kalau campur AND dan OR, pakai kurung supaya jelas.</p>`,
    sintaks: { code: `SELECT kolom FROM tabel
WHERE syarat1 AND (syarat2 OR syarat3);`, ket: [["'teks'", 'teks pakai kutip satu.'], ['( )', 'kurung menentukan mana yang dikerjakan dulu.']] },
    mysql: ["Perbandingan teks di MySQL (collation default _ci) <b>tidak membedakan huruf besar/kecil</b>: <code>WHERE kota = 'jakarta'</code> tetap menemukan 'Jakarta'. Di SQLite, <code>=</code> membedakan huruf besar/kecil. Jadi di playground, tulis teks persis sama dengan datanya."],
    contoh: [
      { sql: "SELECT * FROM mahasiswa WHERE jurusan = 'Sistem Informasi';", ket: '4 mahasiswa SI.' },
      { sql: 'SELECT nama, angkatan, ipk FROM mahasiswa WHERE ipk > 3.5 AND angkatan = 2022;', ket: 'Hanya Fitri (3.90) yang memenuhi KEDUA syarat. Dian angkatan 2022 tapi IPK-nya 3.12.' },
      { sql: "SELECT nama, kota, jurusan FROM mahasiswa\nWHERE (kota = 'Jakarta' OR kota = 'Bandung') AND jurusan <> 'Teknik Informatika';", ket: 'Dari Jakarta/Bandung, yang bukan TI: Dian, Gilang, Nanda. Coba hapus kurungnya: hasilnya beda, karena AND dikerjakan duluan sehingga semua mahasiswa Jakarta ikut.' },
      { sql: "SELECT nama, jurusan FROM mahasiswa WHERE NOT jurusan = 'Teknik Informatika';", ket: 'NOT membalik syarat: semua yang bukan TI (8 orang).' }
    ],
    salah: ["Lupa kurung saat campur AND/OR.", "<code>WHERE kota = 'Jakarta' OR 'Bandung'</code>. Harus diulang: <code>kota = 'Jakarta' OR kota = 'Bandung'</code> (atau pakai IN).", 'Pakai kutip ganda untuk teks. Di MySQL masih jalan, tapi di standar SQL kutip ganda untuk nama kolom. Biasakan kutip satu.', 'Membandingkan angka dalam kutip: <code>ipk > \'3.5\'</code> kadang jalan, tapi bisa memberi hasil aneh. Angka tanpa kutip.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan semua matakuliah ber-SKS 3.', a: 'SELECT * FROM matakuliah WHERE sks = 3;', h: ['WHERE kolom = nilai', 'sks = 3', 'SELECT * FROM matakuliah WHERE sks = 3;'], ex: 'Ada 6 matkul 3 SKS.' },
      { lv: 'sedang', q: "Tampilkan nama dan ipk mahasiswa Teknik Informatika yang IPK-nya minimal 3.0.", a: "SELECT nama, ipk FROM mahasiswa WHERE jurusan = 'Teknik Informatika' AND ipk >= 3.0;", h: ['Dua syarat, dua-duanya wajib = AND.', 'Minimal = >=', "WHERE jurusan = 'Teknik Informatika' AND ipk >= 3.0"], ex: 'Andi, Fitri, Kartika. Mira tersaring karena IPK-nya NULL.' },
      { lv: 'sulit', q: "Tampilkan nama, kota, angkatan mahasiswa yang berasal dari Jakarta <b>atau</b> Surabaya, dan angkatannya <b>bukan</b> 2023.", a: "SELECT nama, kota, angkatan FROM mahasiswa\nWHERE (kota = 'Jakarta' OR kota = 'Surabaya') AND angkatan <> 2023;", h: ['Ada OR dan AND sekaligus. Pakai kurung!', 'Bukan = <> atau !=', "WHERE (kota = 'Jakarta' OR kota = 'Surabaya') AND angkatan <> 2023"], ex: 'Hasil: Andi, Citra, Dian. Tanpa kurung, semua mahasiswa Jakarta ikut (termasuk angkatan 2023).' }
    ],
    ringkas: 'WHERE menyaring baris dengan operator perbandingan, digabung AND/OR/NOT, dan kurung menentukan urutan.'
  },
  {
    id: '3.6', t: 'LIKE + wildcard, IN, BETWEEN, IS NULL',
    konsep: `<p>Operator tambahan supaya WHERE lebih praktis:</p>
<table class="cmp"><tr><th>Operator</th><th>Arti</th><th>Analogi</th></tr>
<tr><td>LIKE 'A%'</td><td><b>%</b> = nol atau banyak karakter apa saja. 'A%' = diawali A.</td><td>Cari kontak di HP: ketik "An" muncul Andi, Anton...</td></tr>
<tr><td>LIKE '_i%'</td><td><b>_</b> = tepat satu karakter apa saja.</td><td>Teka-teki silang: kotak kosong satu huruf</td></tr>
<tr><td>IN ('a','b')</td><td>salah satu dari daftar (pengganti OR berulang)</td><td>Daftar tamu undangan</td></tr>
<tr><td>BETWEEN a AND b</td><td>di antara a dan b, <b>termasuk</b> a dan b</td><td>Umur 17 sampai 25 tahun</td></tr>
<tr><td>IS NULL / IS NOT NULL</td><td>kosong / terisi</td><td>Kolom formulir yang belum diisi</td></tr></table>`,
    sintaks: { code: `WHERE nama LIKE 'A%'          -- diawali A
WHERE nama LIKE '%a'          -- diakhiri a
WHERE nama LIKE '%an%'        -- mengandung "an"
WHERE nama LIKE '_i%'         -- huruf kedua i
WHERE kota IN ('Medan', 'Semarang')
WHERE kota NOT IN ('Jakarta')
WHERE ipk BETWEEN 3.0 AND 3.5    -- sama dengan ipk >= 3.0 AND ipk <= 3.5
WHERE ipk IS NULL`, ket: [['%', 'banyak karakter (boleh nol).'], ['_', 'tepat satu karakter.'], ['NOT LIKE / NOT IN / NOT BETWEEN', 'kebalikannya.']] },
    contoh: [
      { sql: "SELECT nama FROM mahasiswa WHERE nama LIKE '%a';", ket: 'Nama yang diakhiri huruf a: Andi Pratama, Dian Permata, Eko Saputra, Indra Kusuma.' },
      { sql: "SELECT nama FROM mahasiswa WHERE nama LIKE '_i%';", ket: 'Huruf KEDUA adalah i: Citra, Dian, Fitri, Gilang, Mira.' },
      { sql: "SELECT nama, kota FROM mahasiswa WHERE kota IN ('Medan', 'Semarang');", ket: "Sama dengan kota = 'Medan' OR kota = 'Semarang', tapi lebih ringkas. Hasil 3 orang." },
      { sql: 'SELECT nama, ipk FROM mahasiswa WHERE ipk BETWEEN 3.0 AND 3.5;', ket: 'IPK 3.05, 3.12, 3.20, 3.45 masuk. Batas 3.0 dan 3.5 juga akan ikut kalau ada (BETWEEN inklusif).' }
    ],
    salah: ["<code>LIKE 'A*'</code>. Wildcard SQL itu % bukan *.", "Pakai <code>=</code> dengan wildcard: <code>nama = 'A%'</code> mencari nama yang persis 'A%'.", 'BETWEEN dengan angka terbalik: <code>BETWEEN 3.5 AND 3.0</code> hasilnya kosong. Angka kecil dulu.', 'NOT IN dengan daftar yang mengandung NULL: hasilnya selalu kosong (dibahas lagi di Bab 5).'],
    latihan: [
      { lv: 'mudah', q: "Tampilkan nama dosen yang namanya diawali 'Dr.'.", a: "SELECT nama FROM dosen WHERE nama LIKE 'Dr.%';", h: ['Diawali = teks lalu %.', "LIKE 'Dr.%'", "SELECT nama FROM dosen WHERE nama LIKE 'Dr.%';"], ex: 'Dua dosen: Dr. Budi Santoso dan Dr. Siti Rahmawati.' },
      { lv: 'sedang', q: "Tampilkan semua KRS untuk matkul IF101 atau IF201 yang nilainya 80 sampai 100.", a: "SELECT * FROM krs WHERE kode_mk IN ('IF101', 'IF201') AND nilai BETWEEN 80 AND 100;", h: ['Dua kode: pakai IN.', 'Rentang nilai: BETWEEN 80 AND 100.', "WHERE kode_mk IN ('IF101','IF201') AND nilai BETWEEN 80 AND 100"], ex: '4 baris: nilai 85, 90, 92, 95.' },
      { lv: 'sulit', q: "Tampilkan nama, kota, ipk mahasiswa yang namanya <b>mengandung</b> 'an', <b>bukan</b> dari Jakarta, dan IPK-nya <b>sudah terisi</b>.", a: "SELECT nama, kota, ipk FROM mahasiswa\nWHERE nama LIKE '%an%' AND kota <> 'Jakarta' AND ipk IS NOT NULL;", h: ["Mengandung = % di depan dan belakang: '%an%'.", 'Tiga syarat digabung AND.', 'Sudah terisi = IS NOT NULL.'], ex: "Budi, Fitri, Gilang, Hana. LIKE nggak membedakan besar/kecil, jadi 'An' di Andi dan Anggraini juga cocok, tapi Andi dari Jakarta dan IPK Mira NULL." }
    ],
    ringkas: 'LIKE cari pola (% banyak karakter, _ satu karakter), IN cocok dengan daftar, BETWEEN rentang inklusif, IS NULL cek kosong.'
  },
  {
    id: '3.7', t: 'ORDER BY dan LIMIT / OFFSET',
    konsep: `<div class="analogi">🏆 ORDER BY = <b>menyusun ranking</b>. ASC = kecil ke besar (A-Z, default). DESC = besar ke kecil. LIMIT = ambil <b>n teratas</b> saja, seperti "3 besar juara kelas". OFFSET = lewati sekian baris dulu, seperti pindah ke <b>halaman 2</b> hasil Google.</div>`,
    sintaks: { code: `SELECT ... FROM ...
ORDER BY kolom1 DESC, kolom2 ASC   -- urutkan kolom1 dulu, kalau sama baru kolom2
LIMIT 3;                           -- ambil 3 baris
-- halaman ke-2 kalau 1 halaman = 3 baris:
LIMIT 3 OFFSET 3;
LIMIT 3, 3;                        -- versi singkat MySQL: LIMIT offset, jumlah`, ket: [['ASC', 'naik (default kalau nggak ditulis).'], ['DESC', 'turun.'], ['LIMIT n', 'maksimal n baris.'], ['OFFSET m', 'lewati m baris pertama.'], ['LIMIT m, n', 'awas urutannya: offset dulu, baru jumlah.']] },
    contoh: [
      { sql: 'SELECT nama, ipk FROM mahasiswa ORDER BY ipk DESC;', ket: 'IPK tertinggi di atas. NULL di MySQL dianggap paling kecil, jadi muncul paling bawah saat DESC (dan paling atas saat ASC).', hl: 'null' },
      { sql: 'SELECT nama, jurusan, ipk FROM mahasiswa ORDER BY jurusan ASC, ipk DESC;', ket: 'Dikelompokkan per jurusan (A-Z), lalu di dalam tiap jurusan IPK tertinggi dulu.' },
      { sql: 'SELECT nama, ipk FROM mahasiswa ORDER BY ipk DESC LIMIT 3;', ket: '3 besar: Fitri 3.90, Citra 3.78, Kartika 3.65.' },
      { sql: 'SELECT nama, ipk FROM mahasiswa ORDER BY ipk DESC LIMIT 3 OFFSET 3;', ket: 'Peringkat 4-6: Hana 3.55, Andi 3.45, Joko 3.20.' }
    ],
    salah: ['LIMIT tanpa ORDER BY. Hasilnya "3 baris acak", bukan 3 teratas.', 'Menaruh ORDER BY sebelum WHERE. Urutan tulis: WHERE dulu, ORDER BY, lalu LIMIT.', 'Tertukar <code>LIMIT 3, 10</code>: artinya lewati 3, ambil 10. Bukan baris 3 sampai 10.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>kode_mk</code>, <code>nama_mk</code>, <code>sks</code>, urutkan dari SKS terbesar. Kalau SKS sama, urutkan nama_mk A-Z.', a: 'SELECT kode_mk, nama_mk, sks FROM matakuliah ORDER BY sks DESC, nama_mk ASC;', order: true, h: ['Terbesar dulu = DESC.', 'Dua kolom urutan dipisah koma.', 'ORDER BY sks DESC, nama_mk ASC'], ex: 'Algoritma (4 SKS) di paling atas. Lalu 6 matkul 3 SKS berurutan alfabetis.' },
      { lv: 'sedang', q: 'Tampilkan nama dan ipk 5 mahasiswa dengan IPK <b>terendah</b> (yang IPK-nya sudah ada).', a: 'SELECT nama, ipk FROM mahasiswa\nWHERE ipk IS NOT NULL\nORDER BY ipk ASC\nLIMIT 5;', order: true, h: ['Terendah = urutkan ASC.', 'Buang yang NULL, karena NULL muncul paling atas saat ASC.', 'WHERE ipk IS NOT NULL ORDER BY ipk ASC LIMIT 5'], ex: 'Indra 2.40, Eko 2.65, Budi 2.90, Nanda 2.95, Gilang 3.05. Tanpa WHERE, Lukman dan Mira (NULL) ikut di atas.' },
      { lv: 'sulit', q: 'Daftar mahasiswa diurutkan nama A-Z, 3 orang per halaman. Tampilkan <code>nim</code> dan <code>nama</code> untuk <b>halaman ke-2</b>.', a: 'SELECT nim, nama FROM mahasiswa ORDER BY nama ASC LIMIT 3 OFFSET 3;', order: true, h: ['Halaman 2 = lewati 3 baris pertama.', 'LIMIT 3 OFFSET 3', 'Atau LIMIT 3, 3'], ex: 'Halaman 1: Andi, Budi, Citra. Halaman 2: Dian, Eko, Fitri. Rumus OFFSET = (halaman - 1) × jumlah per halaman.' }
    ],
    ringkas: 'ORDER BY menyusun hasil (ASC naik, DESC turun), LIMIT memotong jumlah baris, OFFSET melompati baris untuk halaman berikutnya.'
  },
  {
    id: '3.8', t: 'Fungsi agregat: COUNT, SUM, AVG, MIN, MAX',
    konsep: `<div class="analogi">🧮 Fungsi agregat = <b>kalkulator untuk satu kolom</b>. Banyak baris masuk, keluar <b>satu angka</b>. Seperti rumus =SUM(), =AVERAGE() di Excel.</div>
<table class="cmp"><tr><th>Fungsi</th><th>Hasil</th><th>Soal NULL</th></tr>
<tr><td>COUNT(*)</td><td>jumlah baris</td><td>NULL tetap dihitung</td></tr>
<tr><td>COUNT(kolom)</td><td>jumlah baris yang kolomnya terisi</td><td>NULL <b>nggak</b> dihitung</td></tr>
<tr><td>COUNT(DISTINCT kolom)</td><td>jumlah nilai berbeda</td><td>NULL nggak dihitung</td></tr>
<tr><td>SUM(kolom)</td><td>total</td><td>NULL diabaikan</td></tr>
<tr><td>AVG(kolom)</td><td>rata-rata</td><td>NULL diabaikan (bukan dianggap 0!)</td></tr>
<tr><td>MIN / MAX</td><td>terkecil / terbesar</td><td>NULL diabaikan</td></tr></table>`,
    sintaks: { code: `SELECT COUNT(*), COUNT(kolom), SUM(kolom), AVG(kolom), MIN(kolom), MAX(kolom)
FROM tabel
WHERE kondisi;
SELECT ROUND(AVG(ipk), 2) AS rata FROM mahasiswa;  -- bulatkan 2 desimal`, ket: [['ROUND(x, 2)', 'membulatkan 2 angka di belakang koma.'], ['WHERE', 'menyaring baris SEBELUM dihitung.']] },
    mysql: ['Hati-hati pembagian: di MySQL <code>7 / 2 = 3.5000</code>, tapi di SQLite <code>7 / 2 = 3</code> (bilangan bulat dibagi bulat hasilnya bulat). Di playground, kalau perlu desimal tulis <code>7.0 / 2</code>. Untuk tes, ingat versi MySQL.'],
    contoh: [
      { sql: 'SELECT COUNT(*) AS jumlah_baris, COUNT(ipk) AS yang_punya_ipk FROM mahasiswa;', ket: '14 mahasiswa, tapi hanya 12 yang punya IPK. COUNT(ipk) melewati 2 NULL.' },
      { sql: 'SELECT AVG(ipk) AS rata, MAX(ipk) AS tertinggi, MIN(ipk) AS terendah FROM mahasiswa;', ket: 'Rata-rata dihitung dari 12 IPK yang ada (bukan 14). Tertinggi 3.90, terendah 2.40.' },
      { sql: "SELECT SUM(sks) AS total_sks FROM matakuliah;\nSELECT ROUND(AVG(nilai), 2) AS rata_nilai, COUNT(nilai) AS sudah_dinilai FROM krs;", ket: 'Total SKS seluruh matkul 28. Rata-rata nilai KRS 77.46 dari 13 nilai yang ada.' }
    ],
    salah: ['Mengira AVG menghitung NULL sebagai 0.', 'Mencampur kolom biasa dengan agregat tanpa GROUP BY: <code>SELECT nama, AVG(ipk) FROM mahasiswa</code>. Di MySQL (ONLY_FULL_GROUP_BY) ini error.', 'Agregat di WHERE: <code>WHERE AVG(ipk) > 3</code> = error. Pakai HAVING atau subquery.'],
    latihan: [
      { lv: 'mudah', q: 'Ada berapa dosen di tabel dosen?', a: 'SELECT COUNT(*) AS jumlah_dosen FROM dosen;', h: ['Hitung baris = COUNT(*).', 'FROM dosen', 'SELECT COUNT(*) FROM dosen;'], ex: '9 dosen.' },
      { lv: 'sedang', q: 'Berapa rata-rata IPK mahasiswa Teknik Informatika? Bulatkan 2 desimal.', a: "SELECT ROUND(AVG(ipk), 2) AS rata_ipk_ti FROM mahasiswa WHERE jurusan = 'Teknik Informatika';", h: ['AVG(ipk) dibungkus ROUND(..., 2).', 'Saring dulu jurusannya pakai WHERE.', "SELECT ROUND(AVG(ipk), 2) FROM mahasiswa WHERE jurusan = 'Teknik Informatika';"], ex: '3.26, dari 5 mahasiswa TI yang punya IPK (Mira NULL nggak dihitung).' },
      { lv: 'sulit', q: 'Dalam <b>satu</b> query dari tabel krs, tampilkan 4 kolom: jumlah semua baris, jumlah yang sudah dinilai, nilai tertinggi, nilai terendah.', a: 'SELECT COUNT(*) AS total, COUNT(nilai) AS sudah_dinilai, MAX(nilai) AS tertinggi, MIN(nilai) AS terendah FROM krs;', h: ['Empat fungsi agregat dipisah koma.', 'Bedanya COUNT(*) dan COUNT(nilai).', 'SELECT COUNT(*), COUNT(nilai), MAX(nilai), MIN(nilai) FROM krs;'], ex: '15, 13, 95, 55. Selisih 15 dan 13 adalah 2 KRS bernilai NULL.' }
    ],
    ringkas: 'COUNT, SUM, AVG, MIN, MAX meringkas banyak baris jadi satu angka, dan semuanya (kecuali COUNT(*)) mengabaikan NULL.'
  },
  {
    id: '3.9', t: 'GROUP BY dan HAVING (beda WHERE vs HAVING)',
    konsep: `<div class="analogi">🧺 GROUP BY = <b>memasukkan baris ke keranjang-keranjang</b> berdasarkan kolom tertentu (misal per jurusan), lalu fungsi agregat dihitung <b>per keranjang</b>. HAVING = <b>menyaring keranjang</b>, misal "hanya keranjang yang isinya lebih dari 4".</div>
<table class="cmp"><tr><th></th><th>WHERE</th><th>HAVING</th></tr>
<tr><td>Menyaring</td><td>baris (sebelum dikelompokkan)</td><td>kelompok (setelah GROUP BY)</td></tr>
<tr><td>Boleh pakai COUNT/AVG/...?</td><td>Nggak</td><td>Boleh</td></tr>
<tr><td>Posisi</td><td>sebelum GROUP BY</td><td>setelah GROUP BY</td></tr>
<tr><td>Contoh</td><td>WHERE angkatan &gt;= 2022</td><td>HAVING COUNT(*) &gt;= 2</td></tr></table>
<p>Aturan GROUP BY: kolom di SELECT harus (a) ada di GROUP BY, atau (b) dibungkus fungsi agregat.</p>`,
    sintaks: { code: `SELECT kolom_kelompok, AGREGAT(kolom)
FROM tabel
WHERE syarat_baris
GROUP BY kolom_kelompok
HAVING syarat_kelompok;`, ket: [['GROUP BY jurusan', 'satu baris hasil per jurusan.'], ['HAVING COUNT(*) > 4', 'hanya kelompok yang anggotanya lebih dari 4.']] },
    contoh: [
      { sql: 'SELECT jurusan, COUNT(*) AS jumlah FROM mahasiswa GROUP BY jurusan;', ket: '3 keranjang: Teknik Informatika 6, Sistem Informasi 4, Teknik Komputer 4.' },
      { sql: 'SELECT jurusan, ROUND(AVG(ipk), 2) AS rata FROM mahasiswa\nGROUP BY jurusan\nHAVING AVG(ipk) > 3.0;', ket: 'Rata-rata TK 2.96, jadi keranjang TK dibuang HAVING. Tersisa SI (3.48) dan TI (3.26).' },
      { sql: 'SELECT kota, COUNT(*) AS jumlah FROM mahasiswa\nWHERE angkatan >= 2022\nGROUP BY kota\nHAVING COUNT(*) >= 2;', ket: 'WHERE dulu membuang angkatan 2021. Lalu dikelompokkan per kota. HAVING membuang kota yang anggotanya cuma 1. Hasil: Bandung, Jakarta, Medan, Yogyakarta.' },
      { sql: 'SELECT nim, COUNT(*) AS jml_matkul, SUM(nilai) AS total_nilai FROM krs GROUP BY nim;', ket: 'Satu baris per nim di krs. Andi ambil 3 matkul. Indra punya 1 KRS tapi nilainya NULL, jadi total_nilai NULL.', hl: 'null' }
    ],
    viz: `<div class="box"><b>Bagaimana GROUP BY jurusan bekerja</b>
<div class="cols2" style="margin-top:6px"><div><table class="data"><tr><th>nama</th><th>jurusan</th></tr>
<tr class="in"><td>Andi</td><td>Teknik Informatika</td></tr><tr class="hl"><td>Citra</td><td>Sistem Informasi</td></tr><tr><td>Eko</td><td>Teknik Komputer</td></tr><tr class="in"><td>Budi</td><td>Teknik Informatika</td></tr><tr class="hl"><td>Dian</td><td>Sistem Informasi</td></tr><tr><td>...</td><td>...</td></tr></table></div>
<div><p>⬇ dimasukkan ke keranjang</p><table class="data"><tr><th>jurusan</th><th>COUNT(*)</th></tr><tr class="in"><td>Teknik Informatika</td><td>6</td></tr><tr class="hl"><td>Sistem Informasi</td><td>4</td></tr><tr><td>Teknik Komputer</td><td>4</td></tr></table></div></div></div>`,
    salah: ['Menulis HAVING tanpa GROUP BY untuk menyaring baris biasa. Pakai WHERE.', 'Agregat di WHERE.', 'Kolom di SELECT yang nggak ada di GROUP BY dan bukan agregat: <code>SELECT jurusan, nama, COUNT(*) ... GROUP BY jurusan</code>. MySQL 5.7+ menolak (ONLY_FULL_GROUP_BY).', 'Urutan salah: HAVING sebelum GROUP BY.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan jumlah mahasiswa per angkatan.', a: 'SELECT angkatan, COUNT(*) AS jumlah FROM mahasiswa GROUP BY angkatan;', h: ['Per angkatan = GROUP BY angkatan.', 'Hitung pakai COUNT(*).', 'SELECT angkatan, COUNT(*) FROM mahasiswa GROUP BY angkatan;'], ex: '2021: 3, 2022: 4, 2023: 5, 2024: 2.' },
      { lv: 'sedang', q: 'Dari tabel krs, tampilkan <code>kode_mk</code> dan jumlah pengambilnya, hanya untuk matkul yang diambil minimal 2 orang.', a: 'SELECT kode_mk, COUNT(*) AS jumlah FROM krs\nGROUP BY kode_mk\nHAVING COUNT(*) >= 2;', h: ['Kelompokkan per kode_mk.', 'Syarat jumlah = syarat kelompok = HAVING.', 'HAVING COUNT(*) >= 2'], ex: 'IF101 (4), IF102 (4), IF103 (2), IF201 (2).' },
      { lv: 'sulit', q: 'Per <code>semester</code> di tabel krs, tampilkan: jumlah KRS, jumlah yang sudah dinilai, dan rata-rata nilai (bulatkan 2 desimal). Tampilkan hanya semester yang rata-rata nilainya di atas 70.', a: 'SELECT semester, COUNT(*) AS jumlah_krs, COUNT(nilai) AS sudah_dinilai, ROUND(AVG(nilai), 2) AS rata\nFROM krs\nGROUP BY semester\nHAVING AVG(nilai) > 70;', h: ['GROUP BY semester.', 'COUNT(*) vs COUNT(nilai).', 'HAVING AVG(nilai) > 70'], ex: 'Semester 1 (5 KRS, 4 dinilai, rata 71.75) dan semester 3 (7 KRS, 6 dinilai, rata 85.83). Semester 2 rata-ratanya 68.33, jadi dibuang.' }
    ],
    ringkas: 'GROUP BY memasukkan baris ke keranjang lalu agregat dihitung per keranjang; WHERE menyaring baris sebelum dikelompokkan, HAVING menyaring keranjangnya.'
  },
  {
    id: '3.10', t: 'CASE WHEN',
    konsep: `<div class="analogi">🔀 CASE WHEN = <b>IF di Excel</b> versi SQL. "Kalau IPK ≥ 3.5 tulis Cumlaude, kalau ≥ 3.0 tulis Sangat Memuaskan, selain itu Memuaskan." Dicek dari atas ke bawah, berhenti di syarat pertama yang benar.</div>`,
    sintaks: { code: `CASE
  WHEN syarat1 THEN hasil1
  WHEN syarat2 THEN hasil2
  ELSE hasil_lain
END AS nama_kolom

-- bentuk singkat (membandingkan satu kolom):
CASE jurusan WHEN 'Teknik Informatika' THEN 'TI' WHEN 'Sistem Informasi' THEN 'SI' ELSE 'TK' END

-- fungsi khas MySQL untuk 2 pilihan:
IF(syarat, hasil_kalau_benar, hasil_kalau_salah)`, ket: [['WHEN ... THEN', 'syarat dan hasilnya. Urutan penting.'], ['ELSE', 'kalau nggak ada yang cocok. Tanpa ELSE, hasilnya NULL.'], ['END', 'wajib, penutup CASE.']] },
    contoh: [
      { sql: "SELECT nama, ipk,\n  CASE\n    WHEN ipk IS NULL THEN 'Belum ada'\n    WHEN ipk >= 3.5 THEN 'Cumlaude'\n    WHEN ipk >= 3.0 THEN 'Sangat Memuaskan'\n    ELSE 'Memuaskan'\n  END AS predikat\nFROM mahasiswa;", ket: 'IPK 3.78 kena syarat kedua dan berhenti di situ, nggak lanjut ke syarat ketiga. NULL dicek paling awal.' },
      { sql: "SELECT id, nim, nilai,\n  CASE WHEN nilai >= 85 THEN 'A'\n       WHEN nilai >= 70 THEN 'B'\n       WHEN nilai >= 55 THEN 'C'\n       WHEN nilai IS NULL THEN 'Belum dinilai'\n       ELSE 'D' END AS huruf\nFROM krs;", ket: 'Mengubah angka jadi nilai huruf. Nilai 65 masuk C, nilai 55 juga C (batas >= 55).' },
      { sql: "SELECT jurusan,\n  SUM(CASE WHEN ipk >= 3.5 THEN 1 ELSE 0 END) AS jumlah_cumlaude,\n  COUNT(*) AS total\nFROM mahasiswa GROUP BY jurusan;", ket: 'Trik populer: CASE di dalam SUM untuk menghitung "berapa yang memenuhi syarat" per kelompok. TI 2, SI 2, TK 0.' }
    ],
    salah: ['Lupa END.', 'Urutan WHEN terbalik: <code>WHEN ipk >= 3.0</code> ditaruh sebelum <code>WHEN ipk >= 3.5</code>, sehingga nggak ada yang jadi Cumlaude.', 'Menulis <code>WHEN ipk = NULL</code>. Harus <code>WHEN ipk IS NULL</code>.'],
    latihan: [
      { lv: 'mudah', q: "Tampilkan <code>kode_mk</code>, <code>nama_mk</code>, dan kolom <code>bobot</code> berisi 'Berat' kalau SKS ≥ 3, selain itu 'Ringan'.", a: "SELECT kode_mk, nama_mk,\n  CASE WHEN sks >= 3 THEN 'Berat' ELSE 'Ringan' END AS bobot\nFROM matakuliah;", h: ['CASE WHEN syarat THEN ... ELSE ... END', "WHEN sks >= 3 THEN 'Berat'", "Bisa juga IF(sks >= 3, 'Berat', 'Ringan')"], ex: '7 matkul Berat, 3 Ringan.' },
      { lv: 'sedang', q: "Tampilkan <code>id</code>, <code>nim</code>, <code>nilai</code>, dan <code>status</code>: 'Belum dinilai' kalau nilai kosong, 'Lulus' kalau nilai ≥ 60, selain itu 'Tidak Lulus'.", a: "SELECT id, nim, nilai,\n  CASE WHEN nilai IS NULL THEN 'Belum dinilai'\n       WHEN nilai >= 60 THEN 'Lulus'\n       ELSE 'Tidak Lulus' END AS status\nFROM krs;", h: ['Tiga kemungkinan = dua WHEN + ELSE.', 'Cek NULL pakai IS NULL.', 'Kalau NULL nggak dicek, ia jatuh ke ELSE jadi Tidak Lulus.'], ex: 'Hanya Budi IF102 (55) yang Tidak Lulus. Dua baris Belum dinilai.' },
      { lv: 'sulit', q: "Per jurusan, hitung berapa mahasiswa 'aman' (IPK ≥ 3.00) dan berapa 'rawan' (IPK &lt; 3.00). Mahasiswa yang IPK-nya NULL nggak dihitung di keduanya. Kolom: jurusan, aman, rawan.", a: "SELECT jurusan,\n  SUM(CASE WHEN ipk >= 3.00 THEN 1 ELSE 0 END) AS aman,\n  SUM(CASE WHEN ipk < 3.00 THEN 1 ELSE 0 END) AS rawan\nFROM mahasiswa\nGROUP BY jurusan;", h: ['GROUP BY jurusan.', 'SUM(CASE WHEN ... THEN 1 ELSE 0 END) menghitung yang memenuhi syarat.', 'NULL >= 3 dan NULL < 3 sama-sama nggak benar, jadi otomatis masuk ELSE 0.'], ex: 'TI: aman 3, rawan 2. SI: aman 3, rawan 0. TK: aman 2, rawan 2.' }
    ],
    ringkas: 'CASE WHEN ... THEN ... ELSE ... END adalah IF-nya SQL, dicek dari atas dan berhenti di syarat pertama yang benar.'
  },
  {
    id: '3.11', t: 'Fungsi string & tanggal (CONCAT, UPPER, LENGTH, NOW, YEAR, dll)',
    konsep: `<p>Fungsi bawaan untuk mengolah teks dan tanggal. Yang paling sering keluar:</p>
<table class="cmp"><tr><th>Fungsi</th><th>Hasil</th><th>Contoh → hasil</th></tr>
<tr><td>CONCAT(a, b, ...)</td><td>sambung teks</td><td>CONCAT('Andi', ' - ', 'TI') → 'Andi - TI'</td></tr>
<tr><td>UPPER(s) / LOWER(s)</td><td>huruf besar / kecil</td><td>UPPER('andi') → 'ANDI'</td></tr>
<tr><td>LENGTH(s) / CHAR_LENGTH(s)</td><td>panjang (byte / karakter)</td><td>CHAR_LENGTH('Andi') → 4</td></tr>
<tr><td>SUBSTRING(s, mulai, panjang)</td><td>potong teks</td><td>SUBSTRING('2101001', 1, 2) → '21'</td></tr>
<tr><td>LEFT(s, n) / RIGHT(s, n)</td><td>n karakter dari kiri / kanan</td><td>RIGHT('2101001', 3) → '001'</td></tr>
<tr><td>TRIM(s), REPLACE(s, a, b)</td><td>buang spasi tepi, ganti teks</td><td>REPLACE('Dr. Budi', 'Dr. ', '') → 'Budi'</td></tr>
<tr><td>NOW() / CURDATE()</td><td>waktu sekarang / tanggal hari ini</td><td>'2026-11-21 10:00:00' / '2026-11-21'</td></tr>
<tr><td>YEAR(d), MONTH(d), DAY(d)</td><td>ambil tahun/bulan/hari</td><td>YEAR('2024-08-17') → 2024</td></tr>
<tr><td>DATEDIFF(a, b)</td><td>selisih hari a - b</td><td>DATEDIFF('2024-08-20','2024-08-17') → 3</td></tr>
<tr><td>DATE_FORMAT(d, format)</td><td>format tanggal</td><td>DATE_FORMAT('2024-08-17','%d-%m-%Y') → '17-08-2024'</td></tr>
<tr><td>ROUND(x, n)</td><td>bulatkan</td><td>ROUND(3.456, 1) → 3.5</td></tr></table>`,
    sintaks: { code: `SELECT CONCAT(nama, ' (', jurusan, ')') AS label,
       UPPER(kota), LENGTH(nama),
       YEAR(CURDATE()) - angkatan AS lama_kuliah
FROM mahasiswa;`, ket: [['CONCAT', 'bisa banyak argumen.'], ['CURDATE()', 'tanggal hari ini; NOW() tanggal + jam.']] },
    mysql: ['SQLite asli nggak punya NOW(), CURDATE(), YEAR(), MONTH(), DATEDIFF(), DATE_FORMAT(). Di SQLite ditulis <code>datetime(\'now\')</code> dan <code>strftime(\'%Y\', tgl)</code>. Playground sudah menambahkan fungsi versi MySQL, jadi kamu bisa latihan dengan nama MySQL.', 'Beda kecil: di MySQL <code>CONCAT(\'a\', NULL)</code> hasilnya <b>NULL</b>. Di playground (SQLite) hasilnya \'a\'. Kalau mau aman di MySQL pakai <code>CONCAT_WS</code> atau <code>IFNULL</code>.', 'Di MySQL, LENGTH menghitung <b>byte</b> (huruf é = 2 byte), CHAR_LENGTH menghitung karakter. Untuk huruf biasa hasilnya sama.'],
    contoh: [
      { sql: "SELECT CONCAT(nama, ' (', jurusan, ')') AS label, UPPER(kota) AS kota_besar, LOWER(nama) AS nama_kecil, LENGTH(nama) AS panjang\nFROM mahasiswa;", ket: 'Satu baris data diolah jadi beberapa bentuk teks.' },
      { sql: 'SELECT NOW() AS sekarang, CURDATE() AS hari_ini, YEAR(CURDATE()) AS tahun_ini;\nSELECT nama, angkatan, YEAR(CURDATE()) - angkatan AS sudah_kuliah_tahun FROM mahasiswa;', ket: 'NOW dan CURDATE mengikuti jam komputer kamu. Lama kuliah = tahun ini dikurangi angkatan.' },
      { sql: "SELECT nim, LEFT(nim, 2) AS kode_tahun, RIGHT(nim, 3) AS no_urut, SUBSTRING(nim, 3, 2) AS kode_prodi FROM mahasiswa;", ket: 'NIM dipotong-potong: 2 digit awal = tahun masuk, 3 digit akhir = nomor urut.' },
      { sql: "SELECT YEAR('2024-08-17') AS th, MONTH('2024-08-17') AS bln, DATEDIFF('2024-12-31', '2024-08-17') AS hari_menuju_akhir_tahun, DATE_FORMAT('2024-08-17', '%d-%m-%Y') AS format_indonesia;", ket: 'Fungsi tanggal bekerja pada teks berformat YYYY-MM-DD. Dari 17 Agustus ke 31 Desember ada 136 hari.' }
    ],
    salah: ['Menyambung teks pakai + seperti di bahasa lain: <code>nama + \' \' + kota</code>. Di MySQL hasilnya 0. Pakai CONCAT.', 'Lupa kutip di tanggal: <code>YEAR(2024-08-17)</code> dihitung sebagai pengurangan angka.', 'DATEDIFF urutan terbalik, hasilnya negatif.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan nama semua dosen dalam huruf kapital semua.', a: 'SELECT UPPER(nama) AS nama FROM dosen;', h: ['Huruf kapital = UPPER.', 'UPPER(nama)', 'SELECT UPPER(nama) FROM dosen;'], ex: "'Dr. Budi Santoso' jadi 'DR. BUDI SANTOSO'." },
      { lv: 'sedang', q: "Tampilkan <code>nim</code> dan kolom <code>info</code> berbentuk 'nama - kota' (contoh: 'Andi Pratama - Jakarta') untuk mahasiswa angkatan 2021.", a: "SELECT nim, CONCAT(nama, ' - ', kota) AS info FROM mahasiswa WHERE angkatan = 2021;", h: ["CONCAT(nama, ' - ', kota)", 'Ada 3 bagian: nama, pemisah, kota.', 'WHERE angkatan = 2021'], ex: "Pemisah ' - ' juga teks, jadi ditulis dalam kutip." },
      { lv: 'sulit', q: 'Tampilkan nama mahasiswa dan panjang namanya (kolom <code>panjang</code>), hanya yang panjang namanya lebih dari 12 karakter. Urutkan dari terpanjang; kalau sama, nama A-Z.', a: 'SELECT nama, LENGTH(nama) AS panjang FROM mahasiswa\nWHERE LENGTH(nama) > 12\nORDER BY panjang DESC, nama ASC;', order: true, h: ['LENGTH(nama) atau CHAR_LENGTH(nama).', 'Fungsi bisa dipakai di WHERE juga.', 'ORDER BY panjang DESC, nama ASC (alias boleh di ORDER BY).'], ex: 'Fitri Handayani & Gilang Ramadhan (15), Mira Anggraini (14), Budi Setiawan & Citra Lestari (13). Spasi ikut dihitung.' }
    ],
    ringkas: 'CONCAT menyambung, UPPER/LOWER mengubah huruf, LENGTH menghitung panjang, NOW/CURDATE/YEAR mengolah waktu.'
  },
  {
    id: '3.12', t: 'Urutan eksekusi query',
    konsep: `<p>Kita <b>menulis</b> query mulai dari SELECT, tapi MySQL <b>menjalankannya</b> mulai dari FROM. Memahami ini menjawab banyak pertanyaan "kenapa error?".</p>
<div class="analogi">🍳 Seperti <b>masak</b>: (1) FROM = ambil bahan dari kulkas, (2) WHERE = buang bahan yang busuk, (3) GROUP BY = kelompokkan per jenis, (4) HAVING = pilih kelompok yang cukup banyak, (5) SELECT = racik dan sajikan, (6) ORDER BY = susun di piring, (7) LIMIT = ambil secukupnya.</div>`,
    sintaks: { code: `SELECT jurusan, COUNT(*) AS jml   -- 5
FROM mahasiswa                    -- 1
WHERE angkatan <= 2023            -- 2
GROUP BY jurusan                  -- 3
HAVING COUNT(*) >= 3              -- 4
ORDER BY jml DESC                 -- 6
LIMIT 2;                          -- 7`, ket: [['Angka di kanan', 'urutan MySQL menjalankan klausa.']] },
    mysql: ["Di MySQL, alias SELECT <b>nggak bisa</b> dipakai di WHERE: <code>SELECT ipk*25 AS skor ... WHERE skor > 80</code> error \"Unknown column 'skor' in 'where clause'\". Anehnya SQLite mengizinkan, jadi di playground query itu jalan. Untuk tes, ingat: di MySQL itu error. Ulangi rumusnya di WHERE: <code>WHERE ipk*25 > 80</code>."],
    contoh: [
      { sql: 'SELECT jurusan, COUNT(*) AS jml, ROUND(AVG(ipk), 2) AS rata\nFROM mahasiswa\nWHERE angkatan <= 2023\nGROUP BY jurusan\nHAVING COUNT(*) >= 3\nORDER BY rata DESC\nLIMIT 2;', ket: '(1) ambil mahasiswa, (2) buang angkatan 2024 (Lukman, Mira), (3) kelompokkan 3 jurusan, (4) semua punya ≥3 anggota, (5) hitung jml dan rata, (6) urutkan rata: SI 3.48, TI 3.26, TK 2.96, (7) ambil 2: SI dan TI.' },
      { sql: 'SELECT nama, ipk * 25 AS skor FROM mahasiswa WHERE ipk * 25 > 85 ORDER BY skor DESC;', ket: 'Versi yang benar di MySQL: rumus diulang di WHERE, alias dipakai di ORDER BY (boleh, karena ORDER BY jalan setelah SELECT).' }
    ],
    viz: ORDER_FLOW,
    salah: ['Memakai alias SELECT di WHERE (error di MySQL).', 'Memakai agregat di WHERE.', 'Menulis klausa dengan urutan salah, misal ORDER BY sebelum GROUP BY.'],
    latihan: [
      { lv: 'mudah', type: 'mc', q: 'Urutan MySQL <b>menjalankan</b> klausa yang benar adalah...', opsi: ['SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT', 'FROM → SELECT → WHERE → GROUP BY → ORDER BY → HAVING → LIMIT', 'WHERE → FROM → SELECT → GROUP BY → HAVING → LIMIT → ORDER BY'], benar: 1, h: ['Bahan diambil dulu sebelum disaring.'], ex: 'FROM dulu, SELECT baru di langkah ke-5.' },
      { lv: 'sedang', type: 'mc', q: "Kenapa <code>SELECT nama, ipk*25 AS skor FROM mahasiswa WHERE skor &gt; 80</code> error di MySQL?", opsi: ['Karena ipk*25 nggak boleh di SELECT', 'Karena WHERE dijalankan sebelum SELECT, jadi alias skor belum ada', 'Karena kurang GROUP BY', 'Karena skor harus pakai kutip'], benar: 1, h: ['Ingat urutan eksekusi: WHERE langkah 2, SELECT langkah 5.'], ex: 'Alias baru lahir di langkah SELECT. WHERE belum kenal.' },
      { lv: 'sulit', q: 'Per <code>kota</code>, hitung jumlah mahasiswa yang IPK-nya terisi (kolom <code>jumlah</code>). Tampilkan hanya kota dengan minimal 2 orang, urutkan jumlah terbanyak lalu nama kota A-Z, dan ambil 3 teratas.', a: 'SELECT kota, COUNT(*) AS jumlah\nFROM mahasiswa\nWHERE ipk IS NOT NULL\nGROUP BY kota\nHAVING COUNT(*) >= 2\nORDER BY jumlah DESC, kota ASC\nLIMIT 3;', order: true, h: ['WHERE ipk IS NOT NULL membuang baris sebelum dikelompokkan.', 'HAVING COUNT(*) >= 2', 'ORDER BY jumlah DESC, kota ASC LIMIT 3'], ex: 'Jakarta 4, lalu tiga kota dengan 2 orang (Bandung, Surabaya, Yogyakarta) diurutkan A-Z, diambil sampai Surabaya. Bisa juga COUNT(ipk) tanpa WHERE.' }
    ],
    ringkas: 'MySQL menjalankan FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT, makanya alias dan agregat nggak bisa dipakai di WHERE.'
  }
  ]
});
