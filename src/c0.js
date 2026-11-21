/* ===== BAB 0 & 1 ===== */
var CH = [];
const Q_ = "['\"`]?";

CH.push({
  id: 'bab0', title: 'Bab 0 · Pengenalan',
  lead: 'Mulai dari nol: apa itu database, tabel, kunci, dan relasi. Setelah bab ini kamu sudah bisa "mengintip" isi tabel.',
  intro: `
<div class="box"><b>Cara pakai website ini</b>
<ul>
<li>Setiap kotak kode bisa kamu <b>edit</b>, lalu klik <b>▶ Jalankan</b> (atau tekan Ctrl+Enter).</li>
<li>Latihan dicek dari <b>hasil</b> query kamu, bukan dari tulisannya. Jadi cara berbeda tetap benar asal hasilnya sama.</li>
<li>Playground di sini memakai <b>SQLite</b> (database mini di browser). Sebagian besar sintaks MySQL otomatis diterjemahkan. Kalau ada beda, muncul kotak <b>⚠ Di MySQL ditulis begini</b>. Yang dihafal untuk tes: <b>versi MySQL</b>.</li>
<li>Tombol <b>⌨ Playground</b> di atas = tempat coba-coba bebas. <b>↺ Reset database contoh</b> mengembalikan data ke awal.</li>
</ul></div>
<h3>Database contoh: "kampus"</h3>
<p>Semua contoh dan latihan memakai database ini. Kenali dulu bentuknya. 🔑 = primary key, ↗ = foreign key (menunjuk ke tabel lain), 1 dan N = jenis relasi.</p>
${'<div class="erd" data-erd="kampus"></div>'}
<table class="cmp"><tr><th>Tabel</th><th>Isinya</th><th>Data "nanggung" yang sengaja dibuat</th></tr>
<tr><td>mahasiswa (14 baris)</td><td>nim, nama, jurusan, angkatan, kota, ipk</td><td>Lukman &amp; Mira (angkatan 2024) IPK-nya NULL. Kartika, Lukman, Mira, Nanda belum punya KRS.</td></tr>
<tr><td>dosen (9 baris)</td><td>id_dosen, nama, keahlian</td><td>Hendra (7) dan Maya (8) nggak mengajar matkul apa pun.</td></tr>
<tr><td>matakuliah (10 baris)</td><td>kode_mk, nama_mk, sks, id_dosen</td><td>IF302 &amp; IF303 belum punya dosen (id_dosen NULL). IF301, IF302, IF303 belum diambil siapa pun.</td></tr>
<tr><td>krs (15 baris)</td><td>id, nim, kode_mk, semester, nilai</td><td>KRS id 11 dan 14 nilainya masih NULL.</td></tr>
<tr><td>staf (9 baris)</td><td>id, nama, jabatan, id_atasan</td><td>Tabel tambahan untuk hierarki atasan-bawahan (SELF JOIN &amp; recursive CTE).</td></tr>
<tr><td>mdl_... (Bab 7)</td><td>Versi mini tabel Moodle</td><td>Dipakai di bab Moodle.</td></tr></table>`,
  subs: [
  {
    id: '0.1', t: 'Database, DBMS, RDBMS, MySQL',
    konsep: `<p><b>Database</b> = kumpulan data yang disimpan rapi dan bisa dicari dengan cepat.</p>
<div class="analogi">🗄️ Bayangkan <b>lemari arsip</b> di bagian akademik kampus. Isinya map data mahasiswa, data dosen, data mata kuliah. Itulah database.</div>
<p><b>DBMS</b> (Database Management System) = software yang mengelola database. Kamu nggak buka lemarinya sendiri, kamu minta ke <b>petugas arsip</b>: "tolong ambilkan data mahasiswa Jakarta". Petugas itu = DBMS.</p>
<p><b>RDBMS</b> (Relational DBMS) = DBMS yang menyimpan data dalam bentuk <b>tabel-tabel yang saling berhubungan</b> (relasi). Contoh: tabel KRS berhubungan dengan tabel mahasiswa lewat NIM.</p>
<p><b>MySQL</b> = salah satu RDBMS paling populer. Gratis (open source), dipakai Moodle, WordPress, dan banyak web kampus. Saudaranya: <b>MariaDB</b> (pecahan MySQL, sintaksnya hampir sama). RDBMS lain: PostgreSQL, SQL Server, Oracle, SQLite.</p>`,
    sintaks: { code: 'SELECT * FROM nama_tabel;', ket: [
      ['SELECT', 'perintah "tampilkan / ambil data".'],
      ['*', 'artinya "semua kolom".'],
      ['FROM nama_tabel', 'dari tabel mana datanya diambil.'],
      [';', 'tanda akhir satu perintah. Di terminal MySQL wajib ada.'] ] },
    contoh: [
      { sql: 'SELECT * FROM mahasiswa;', ket: 'Muncul 14 baris, satu baris = satu mahasiswa. Perhatikan Lukman dan Mira: kolom ipk tertulis NULL artinya "belum ada isinya".' },
      { sql: 'SELECT * FROM dosen;', ket: 'Tabel dosen punya 3 kolom dan 9 baris. Ini "lembar" yang berbeda di lemari yang sama (database kampus).' }
    ],
    salah: ['Mengira MySQL itu bahasa. MySQL itu <b>software</b>; bahasanya SQL.', 'Salah eja nama tabel, misal <code>mahasiswas</code> atau <code>Mahasiswa </code> dengan spasi. Nama tabel harus persis.', 'Lupa titik koma di terminal MySQL, lalu bingung kenapa muncul <code>-&gt;</code> (MySQL menunggu kamu menyelesaikan perintah).'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan semua isi tabel <code>matakuliah</code>.', a: 'SELECT * FROM matakuliah;', h: ['Pakai pola SELECT * FROM ...', 'Nama tabelnya: matakuliah', 'SELECT * FROM matakuliah;'], ex: 'Bintang (*) mengambil semua kolom, FROM menunjuk tabelnya. Hasilnya 10 mata kuliah.' },
      { lv: 'sedang', q: 'Tampilkan semua isi tabel <code>krs</code>.', a: 'SELECT * FROM krs;', h: ['Sama polanya dengan soal sebelumnya.', 'Tabelnya krs (huruf kecil semua).', 'SELECT * FROM krs;'], ex: 'Tabel krs berisi 15 baris pengambilan mata kuliah. Ada 2 baris dengan nilai NULL (belum dinilai).' },
      { lv: 'sulit', q: 'Database kampus ini juga berisi tabel Moodle mini. Tampilkan semua isi tabel <code>mdl_course</code>.', a: 'SELECT * FROM mdl_course;', h: ['Nama tabel Moodle diawali mdl_', 'Tabel course Moodle: mdl_course', 'SELECT * FROM mdl_course;'], ex: 'Semua tabel Moodle diawali prefix mdl_. Kita bahas detailnya di Bab 7.' }
    ],
    ringkas: 'Database = lemari arsip, DBMS/MySQL = petugas arsipnya, dan SELECT * FROM tabel = "tolong tampilkan semua isi lembar ini".'
  },
  {
    id: '0.2', t: 'Tabel, baris, kolom, primary key, foreign key',
    konsep: `<div class="analogi">📊 <b>Tabel</b> = satu lembar Excel. <b>Kolom</b> = judul kolom di atas (nim, nama, kota). <b>Baris</b> = satu data lengkap (satu mahasiswa).</div>
<p>Istilah lain yang sering keluar di tes: kolom = <b>field / atribut</b>, baris = <b>record / tuple</b>.</p>
<p><b>Primary Key (PK)</b> = kolom yang nilainya <b>unik</b> dan <b>nggak boleh kosong</b>, jadi bisa menunjuk tepat satu baris. Seperti <b>NIM</b>: nggak ada dua mahasiswa dengan NIM sama.</p>
<p><b>Foreign Key (FK)</b> = kolom yang isinya "menunjuk" ke primary key tabel lain. Di lembar KRS ada kolom nim. Nim itu harus nim yang memang terdaftar di tabel mahasiswa. Jadi <code>krs.nim</code> adalah FK yang menunjuk <code>mahasiswa.nim</code>.</p>
<p>Untuk memilih kolom tertentu, sebut nama kolomnya. Untuk memilih baris tertentu, pakai <code>WHERE</code> (dibahas lengkap di Bab 3).</p>`,
    sintaks: { code: 'SELECT kolom1, kolom2\nFROM nama_tabel\nWHERE kolom = nilai;', ket: [
      ['kolom1, kolom2', 'kolom yang mau ditampilkan, dipisah koma.'],
      ['WHERE kolom = nilai', 'saring baris: hanya yang memenuhi syarat.'],
      ["'teks'", "teks diapit kutip satu. Angka tanpa kutip."] ] },
    contoh: [
      { sql: 'SELECT nim, nama FROM mahasiswa;', ket: 'Hanya 2 kolom yang tampil, tapi barisnya tetap 14. Memilih kolom nggak mengurangi baris.' },
      { sql: 'SELECT * FROM matakuliah WHERE id_dosen = 2;', ket: 'Kolom id_dosen di matakuliah adalah foreign key ke dosen. Nilai 2 menunjuk dosen dengan id_dosen 2 (Dr. Siti Rahmawati). Hasil: 2 matkul.' },
      { sql: "SELECT * FROM dosen WHERE id_dosen = 2;", ket: 'Ini "pemilik" angka 2 tadi. Karena id_dosen adalah primary key, hasilnya pasti tepat 1 baris.' }
    ],
    salah: ['Teks tanpa kutip: <code>WHERE nim = 2101001</code> masih jalan karena kebetulan angka, tapi <code>WHERE kota = Jakarta</code> error. Biasakan <code>\'Jakarta\'</code>.', 'Mengira primary key boleh kosong atau dobel. Nggak boleh, dua-duanya.', 'Menganggap foreign key harus unik. Nggak: satu nim bisa muncul berkali-kali di krs.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan kolom <code>kode_mk</code> dan <code>nama_mk</code> dari tabel matakuliah.', a: 'SELECT kode_mk, nama_mk FROM matakuliah;', h: ['Sebut nama kolom setelah SELECT.', 'Pisahkan dua kolom dengan koma.', 'SELECT kode_mk, nama_mk FROM matakuliah;'], ex: 'Kolom dipilih sesuai yang disebut, 10 baris tetap muncul semua.' },
      { lv: 'sedang', q: 'Tampilkan <code>nama</code> dan <code>keahlian</code> semua dosen.', a: 'SELECT nama, keahlian FROM dosen;', h: ['Tabelnya dosen.', 'Kolomnya nama dan keahlian.', 'SELECT nama, keahlian FROM dosen;'], ex: 'Sama seperti soal 1, hanya beda tabel.' },
      { lv: 'sulit', q: "Tampilkan <code>kode_mk</code> dan <code>nilai</code> dari KRS milik mahasiswa dengan nim <code>'2101001'</code>.", a: "SELECT kode_mk, nilai FROM krs WHERE nim = '2101001';", h: ['Datanya di tabel krs.', "Saring dengan WHERE nim = '2101001'.", "SELECT kode_mk, nilai FROM krs WHERE nim = '2101001';"], ex: "krs.nim adalah foreign key. Mahasiswa 2101001 (Andi) mengambil 3 matkul, jadi muncul 3 baris." }
    ],
    ringkas: 'Tabel = lembar Excel, primary key = NIM yang unik, foreign key = NIM yang ditulis di lembar lain untuk menunjuk pemiliknya.'
  },
  {
    id: '0.3', t: 'Relasi 1-1, 1-N, N-M',
    konsep: `<p>Relasi = cara dua tabel berhubungan. Ada 3 jenis:</p>
<table class="cmp"><tr><th>Jenis</th><th>Artinya</th><th>Contoh</th></tr>
<tr><td><b>1-1</b> (one to one)</td><td>Satu data di A pasangannya tepat satu di B.</td><td>Satu mahasiswa punya satu akun Moodle. Satu orang punya satu KTP.</td></tr>
<tr><td><b>1-N</b> (one to many)</td><td>Satu data di A bisa punya banyak pasangan di B.</td><td>Satu dosen mengajar banyak matkul (dosen → matakuliah).</td></tr>
<tr><td><b>N-M</b> (many to many)</td><td>Banyak di A berpasangan dengan banyak di B.</td><td>Banyak mahasiswa mengambil banyak matkul.</td></tr></table>
<div class="analogi">🧾 Relasi N-M nggak bisa disimpan langsung. Butuh <b>tabel penghubung</b>. Di kampus, itu lembar <b>KRS</b>: setiap baris mencatat "mahasiswa X ambil matkul Y". Jadi N-M dipecah jadi dua relasi 1-N: mahasiswa 1-N krs, dan matakuliah 1-N krs.</div>
<p>Caranya di MySQL: kolom FK selalu ditaruh di sisi <b>N</b> (banyak). Contoh: <code>id_dosen</code> ditaruh di matakuliah, bukan di dosen.</p>`,
    sintaks: { code: `CREATE TABLE matakuliah (
  kode_mk  VARCHAR(10) PRIMARY KEY,
  nama_mk  VARCHAR(60) NOT NULL,
  sks      INT NOT NULL,
  id_dosen INT,
  FOREIGN KEY (id_dosen) REFERENCES dosen(id_dosen)
);`, ket: [['FOREIGN KEY (id_dosen)', 'kolom di tabel ini yang jadi penunjuk.'], ['REFERENCES dosen(id_dosen)', 'menunjuk ke primary key tabel dosen. Ini yang membentuk relasi 1-N.']] },
    contoh: [
      { sql: 'SELECT * FROM matakuliah WHERE id_dosen = 2;', ket: '1-N: dosen nomor 2 mengajar 2 matkul (IF102 dan IF103). Satu dosen, banyak matkul.' },
      { sql: "SELECT * FROM krs WHERE kode_mk = 'IF101';", ket: 'Sisi matkul dari N-M: matkul IF101 diambil 4 mahasiswa berbeda.' },
      { sql: "SELECT * FROM krs WHERE nim = '2101001';", ket: 'Sisi mahasiswa dari N-M: mahasiswa 2101001 mengambil 3 matkul. Tabel krs yang menghubungkan keduanya.' }
    ],
    viz: { type: 'erd', which: 'kampus' },
    salah: ['Menaruh FK di sisi yang salah (misal kolom kode_mk di tabel dosen). FK selalu di sisi "banyak".', 'Mencoba menyimpan N-M tanpa tabel penghubung, misal kolom "matkul_diambil" berisi "IF101,IF102". Ini melanggar aturan desain database (normalisasi).'],
    latihan: [
      { lv: 'mudah', q: "Tampilkan semua KRS untuk matkul <code>'IF102'</code>.", a: "SELECT * FROM krs WHERE kode_mk = 'IF102';", h: ['Tabelnya krs.', "Saring kode_mk = 'IF102'.", "SELECT * FROM krs WHERE kode_mk = 'IF102';"], ex: 'Ada 4 mahasiswa yang mengambil IF102. Ini contoh sisi "banyak" dari relasi matakuliah 1-N krs.' },
      { lv: 'sedang', q: 'Tampilkan <code>kode_mk</code> dan <code>nama_mk</code> semua matkul yang diajar dosen dengan <code>id_dosen = 1</code>.', a: 'SELECT kode_mk, nama_mk FROM matakuliah WHERE id_dosen = 1;', h: ['FK id_dosen ada di tabel matakuliah.', 'WHERE id_dosen = 1', 'SELECT kode_mk, nama_mk FROM matakuliah WHERE id_dosen = 1;'], ex: 'Dosen 1 (Dr. Budi Santoso) hanya mengajar IF101.' },
      { lv: 'sulit', type: 'mc', q: 'Relasi antara tabel <b>mahasiswa</b> dan <b>matakuliah</b> adalah...', opsi: ['1-1', '1-N', 'N-M, dihubungkan lewat tabel krs', 'Nggak berhubungan'], benar: 2, h: ['Satu mahasiswa bisa ambil banyak matkul, satu matkul bisa diambil banyak mahasiswa.'], ex: 'Banyak ke banyak, makanya butuh tabel penghubung krs.' }
    ],
    ringkas: '1-1 = KTP, 1-N = dosen dan matkulnya, N-M = mahasiswa dan matkul yang dihubungkan tabel KRS.'
  },
  {
    id: '0.4', t: 'SQL vs MySQL, dan kategori perintah SQL',
    konsep: `<div class="analogi">🗣️ <b>SQL</b> (Structured Query Language) itu <b>bahasa</b>, seperti Bahasa Indonesia. <b>MySQL</b> itu <b>software</b> yang mengerti bahasa itu, seperti orang yang bicara. Tiap software punya "logat" (dialek) sedikit berbeda: MySQL, PostgreSQL, SQLite.</div>
<p>Perintah SQL dikelompokkan jadi 4 kategori. Ini <b>sering keluar di tes</b>:</p>
<table class="cmp"><tr><th>Kategori</th><th>Kepanjangan</th><th>Gunanya</th><th>Perintah</th><th>Analogi</th></tr>
<tr><td><b>DDL</b></td><td>Data Definition Language</td><td>Membuat/mengubah <b>struktur</b> (wadah)</td><td>CREATE, ALTER, DROP, TRUNCATE, RENAME</td><td>Bikin/renovasi lemari &amp; lembar kosong</td></tr>
<tr><td><b>DML</b></td><td>Data Manipulation Language</td><td>Mengolah <b>isi</b> data</td><td>SELECT, INSERT, UPDATE, DELETE</td><td>Menulis, mengubah, menghapus, membaca isi lembar</td></tr>
<tr><td><b>DCL</b></td><td>Data Control Language</td><td>Mengatur <b>hak akses</b></td><td>GRANT, REVOKE</td><td>Memberi/mencabut kunci lemari ke orang tertentu</td></tr>
<tr><td><b>TCL</b></td><td>Transaction Control Language</td><td>Mengatur <b>transaksi</b></td><td>START TRANSACTION, COMMIT, ROLLBACK, SAVEPOINT</td><td>"Simpan permanen" atau "batalkan semua"</td></tr></table>
<p>Catatan: beberapa buku memisahkan SELECT jadi kategori sendiri: <b>DQL</b> (Data Query Language). Kalau di soal ada pilihan DQL untuk SELECT, pilih itu. Kalau nggak ada, SELECT masuk DML.</p>`,
    sintaks: { code: `-- DDL
CREATE TABLE contoh (id INT PRIMARY KEY);
-- DML
INSERT INTO contoh VALUES (1);
SELECT * FROM contoh;
-- DCL
GRANT SELECT ON kampus.* TO 'asisten'@'localhost';
-- TCL
START TRANSACTION;
UPDATE contoh SET id = 2 WHERE id = 1;
ROLLBACK;`, ket: [['-- teks', 'komentar, nggak dijalankan. Di MySQL juga bisa pakai # atau /* ... */.'], ['ROLLBACK', 'membatalkan perubahan sejak START TRANSACTION. COMMIT = menyimpan permanen.']] },
    contoh: [
      { sql: "SELECT 'Halo MySQL' AS sapaan, 2 + 3 AS hasil;", ket: 'SELECT juga bisa menampilkan teks atau hitungan tanpa tabel. AS memberi nama kolom hasil.' },
      { sql: 'SHOW TABLES;', ket: 'Perintah khas MySQL untuk melihat daftar tabel di database yang sedang dipakai.' },
      { sql: `START TRANSACTION;
DELETE FROM krs;
SELECT COUNT(*) AS jumlah_krs_setelah_delete FROM krs;
ROLLBACK;
SELECT COUNT(*) AS jumlah_krs_setelah_rollback FROM krs;`, ket: 'TCL beraksi: semua KRS dihapus (jadi 0), lalu ROLLBACK membatalkannya sehingga kembali 15.' }
    ],
    salah: ['Menganggap TRUNCATE itu DML. TRUNCATE termasuk <b>DDL</b> (walau efeknya menghapus isi).', 'Menganggap GRANT itu DDL. GRANT/REVOKE itu <b>DCL</b>.', 'Lupa bahwa ROLLBACK hanya bisa membatalkan perintah DML di dalam transaksi. Perintah DDL (CREATE, DROP) di MySQL langsung permanen (auto-commit).'],
    latihan: [
      { lv: 'mudah', q: 'Jalankan perintah MySQL untuk melihat daftar tabel di database kampus.', a: 'SHOW TABLES;', h: ['Perintahnya diawali SHOW.', 'SHOW ... TABLES', 'SHOW TABLES;'], ex: 'SHOW TABLES menampilkan semua tabel di database aktif.' },
      { lv: 'mudah', type: 'mc', q: '<code>CREATE TABLE</code> termasuk kategori...', opsi: ['DML', 'DDL', 'DCL', 'TCL'], benar: 1, h: ['CREATE membuat struktur/wadah.'], ex: 'CREATE, ALTER, DROP, TRUNCATE = DDL karena mengurus struktur.' },
      { lv: 'sedang', type: 'mc', q: '<code>GRANT SELECT ON kampus.* TO \'asisten\'@\'localhost\'</code> termasuk kategori...', opsi: ['DDL', 'DML', 'DCL', 'TCL'], benar: 2, h: ['Perintah ini memberi hak akses.'], ex: 'GRANT dan REVOKE mengatur hak akses = DCL (Data Control Language).' },
      { lv: 'sulit', type: 'mc', q: 'Kamu tidak sengaja menjalankan <code>DELETE FROM krs;</code> di dalam transaksi yang belum di-COMMIT. Perintah apa yang menyelamatkan data?', opsi: ['COMMIT', 'ROLLBACK', 'TRUNCATE', 'REVOKE'], benar: 1, h: ['Kamu mau MEMBATALKAN perubahan.'], ex: 'ROLLBACK membatalkan semua perubahan sejak START TRANSACTION. COMMIT justru menyimpannya permanen.' }
    ],
    ringkas: 'SQL = bahasa, MySQL = software-nya; DDL urus struktur, DML urus isi, DCL urus hak akses, TCL urus transaksi.'
  }
  ]
});

CH.push({
  id: 'bab1', title: 'Bab 1 · MySQL Dasar',
  lead: 'Tipe data, NULL, cara login ke MySQL, dan perintah wajib: SHOW DATABASES, USE, SHOW TABLES, DESCRIBE.',
  subs: [
  {
    id: '1.1', t: 'Tipe data penting',
    konsep: `<p>Setiap kolom harus punya <b>tipe data</b>: jenis isi yang boleh masuk. Seperti formulir: kolom "tanggal lahir" harus tanggal, kolom "umur" harus angka.</p>
<table class="cmp"><tr><th>Tipe</th><th>Untuk apa</th><th>Contoh nilai</th></tr>
<tr><td><b>INT</b></td><td>Bilangan bulat</td><td>2021, 3, -5</td></tr>
<tr><td><b>VARCHAR(n)</b></td><td>Teks panjangnya berubah-ubah, maksimal n karakter</td><td>'Andi Pratama' di VARCHAR(60)</td></tr>
<tr><td><b>CHAR(n)</b></td><td>Teks panjangnya <b>tetap</b> n (kalau kurang, ditambah spasi)</td><td>Kode prodi 'TI', NIM 7 digit di CHAR(7)</td></tr>
<tr><td><b>TEXT</b></td><td>Teks panjang (paragraf)</td><td>Deskripsi course, isi pengumuman</td></tr>
<tr><td><b>DATE</b></td><td>Tanggal, format 'YYYY-MM-DD'</td><td>'2024-08-17'</td></tr>
<tr><td><b>DATETIME</b></td><td>Tanggal + jam 'YYYY-MM-DD HH:MM:SS'</td><td>'2024-08-17 09:30:00'</td></tr>
<tr><td><b>DECIMAL(p,s)</b></td><td>Angka desimal <b>pasti</b> (uang, IPK). p = total digit, s = digit di belakang koma</td><td>DECIMAL(3,2) bisa 3.45; DECIMAL(10,2) bisa 85000.50</td></tr>
<tr><td><b>ENUM('a','b')</b></td><td>Hanya boleh salah satu dari daftar pilihan</td><td>ENUM('L','P'), ENUM('aktif','cuti','lulus')</td></tr>
<tr><td><b>BOOLEAN</b></td><td>Benar/salah. Di MySQL sebenarnya TINYINT(1): TRUE = 1, FALSE = 0</td><td>TRUE, FALSE, 1, 0</td></tr></table>
<div class="analogi">📏 VARCHAR seperti <b>tas yang bisa mengembang</b> sesuai isi. CHAR seperti <b>kotak ukuran tetap</b>, isi sedikit pun tetap makan tempat penuh.</div>
<p>Kenapa IPK pakai DECIMAL, bukan FLOAT? Karena FLOAT bisa nggak presisi (3.45 tersimpan 3.4499999). DECIMAL menyimpan angka persis.</p>`,
    sintaks: { code: `CREATE TABLE peminjaman_lab (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nim         CHAR(7) NOT NULL,
  nama_alat   VARCHAR(50) NOT NULL,
  catatan     TEXT,
  tgl_pinjam  DATE,
  waktu_input DATETIME DEFAULT CURRENT_TIMESTAMP,
  denda       DECIMAL(10,2) DEFAULT 0,
  kondisi     ENUM('baik','rusak','hilang') DEFAULT 'baik',
  sudah_kembali BOOLEAN DEFAULT FALSE
);`, ket: [['INT AUTO_INCREMENT', 'angka otomatis naik 1, 2, 3... (dibahas di Bab 2).'], ['CHAR(7)', 'NIM selalu 7 karakter.'], ['DATETIME DEFAULT CURRENT_TIMESTAMP', 'kalau nggak diisi, otomatis waktu sekarang.'], ["ENUM('baik','rusak','hilang')", 'hanya boleh salah satu dari 3 pilihan itu.'], ['BOOLEAN DEFAULT FALSE', 'disimpan sebagai 0.']] },
    mysql: ['Tipe <b>ENUM</b> nggak ada di SQLite. Playground menerjemahkan ENUM jadi TEXT, jadi di sini nilai di luar daftar tetap masuk. Di MySQL asli, nilai di luar daftar ditolak (atau jadi string kosong kalau strict mode mati).', 'SQLite nggak membatasi panjang VARCHAR(n). Di MySQL, teks yang lebih panjang dari n akan <b>ditolak</b> (error "Data too long") di strict mode.', 'Di SQLite asli, AUTO_INCREMENT ditulis <code>INTEGER PRIMARY KEY AUTOINCREMENT</code>. Di MySQL: <code>INT AUTO_INCREMENT PRIMARY KEY</code>. Playground menerjemahkannya otomatis.'],
    contoh: [
      { sql: `CREATE TABLE peminjaman_lab (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nim         CHAR(7) NOT NULL,
  nama_alat   VARCHAR(50) NOT NULL,
  tgl_pinjam  DATE,
  denda       DECIMAL(10,2) DEFAULT 0,
  kondisi     ENUM('baik','rusak','hilang') DEFAULT 'baik',
  sudah_kembali BOOLEAN DEFAULT FALSE
);
DESCRIBE peminjaman_lab;`, ket: 'Tabel dibuat, lalu DESCRIBE menampilkan strukturnya: nama kolom, tipe, boleh NULL atau nggak, kunci, dan default.' },
      { sql: `CREATE TABLE peminjaman_lab (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim CHAR(7) NOT NULL,
  nama_alat VARCHAR(50) NOT NULL,
  tgl_pinjam DATE,
  denda DECIMAL(10,2) DEFAULT 0,
  kondisi ENUM('baik','rusak','hilang') DEFAULT 'baik',
  sudah_kembali BOOLEAN DEFAULT FALSE
);
INSERT INTO peminjaman_lab (nim, nama_alat, tgl_pinjam) VALUES ('2101001', 'Proyektor', '2024-09-02');
INSERT INTO peminjaman_lab (nim, nama_alat, tgl_pinjam, denda, kondisi, sudah_kembali)
VALUES ('2201006', 'Laptop Lab 05', '2024-09-03', 15000.50, 'rusak', TRUE);
SELECT * FROM peminjaman_lab;`, ket: 'Baris pertama hanya mengisi 3 kolom, sisanya terisi DEFAULT (denda 0, kondisi baik, sudah_kembali 0). id terisi otomatis 1 dan 2. TRUE tersimpan sebagai 1.' },
      { sql: 'SELECT nama, ipk, ipk * 25 AS ipk_skala_100 FROM mahasiswa;', ket: 'Kolom DECIMAL bisa langsung dihitung. IPK 3.45 × 25 = 86.25. IPK NULL kalau dihitung hasilnya tetap NULL.' }
    ],
    salah: ['Menyimpan NIM atau nomor HP sebagai INT. Nol di depan hilang (0812... jadi 812...) dan angkanya bisa kepanjangan. Pakai VARCHAR/CHAR.', 'Pakai FLOAT untuk uang/IPK. Pakai DECIMAL.', "Menulis tanggal format Indonesia '17-08-2024'. MySQL mau 'YYYY-MM-DD': '2024-08-17'.", 'Lupa memberi panjang di VARCHAR: <code>VARCHAR</code> saja error di MySQL, harus <code>VARCHAR(50)</code>.'],
    latihan: [
      { lv: 'mudah', q: 'Buat tabel <code>ruang</code> dengan kolom: <code>kode</code> CHAR(5) sebagai primary key, <code>nama</code> VARCHAR(50), <code>kapasitas</code> INT.', a: 'CREATE TABLE ruang (\n  kode CHAR(5) PRIMARY KEY,\n  nama VARCHAR(50),\n  kapasitas INT\n);', check: "SELECT name AS kolom, pk FROM pragma_table_info('ruang') ORDER BY cid", h: ['Pola: CREATE TABLE nama (kolom tipe, kolom tipe, ...);', 'Tulis PRIMARY KEY setelah tipe kolom kode.', 'CREATE TABLE ruang (kode CHAR(5) PRIMARY KEY, nama VARCHAR(50), kapasitas INT);'], ex: 'Pengecek melihat apakah tabel ruang punya kolom kode (primary key), nama, kapasitas dengan urutan itu.' },
      { lv: 'sedang', q: "Buat tabel <code>buku</code> (<code>id</code> INT primary key, <code>judul</code> VARCHAR(100) NOT NULL, <code>harga</code> DECIMAL(10,2), <code>tgl_terbit</code> DATE). Lalu isi 1 baris: id 1, judul 'Belajar SQL', harga 85000.50, tanggal terbit 1 Maret 2024.", a: "CREATE TABLE buku (\n  id INT PRIMARY KEY,\n  judul VARCHAR(100) NOT NULL,\n  harga DECIMAL(10,2),\n  tgl_terbit DATE\n);\nINSERT INTO buku VALUES (1, 'Belajar SQL', 85000.50, '2024-03-01');", check: 'SELECT * FROM buku', h: ['Dua perintah: CREATE TABLE lalu INSERT INTO.', "Format tanggal MySQL: 'YYYY-MM-DD', jadi '2024-03-01'.", "INSERT INTO buku VALUES (1, 'Belajar SQL', 85000.50, '2024-03-01');"], ex: 'Perhatikan format tanggal. Kalau ditulis 01-03-2024, hasil pengecekan beda.' },
      { lv: 'sulit', q: "Buat tabel <code>pendaftar_asisten</code>: <code>id</code> INT AUTO_INCREMENT primary key, <code>nama</code> VARCHAR(60) NOT NULL, <code>status</code> ENUM('daftar','lulus','gagal') dengan default 'daftar', <code>aktif</code> BOOLEAN default TRUE. Lalu tambahkan pendaftar bernama 'Rizky' dengan hanya mengisi nama.", a: "CREATE TABLE pendaftar_asisten (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nama VARCHAR(60) NOT NULL,\n  status ENUM('daftar','lulus','gagal') DEFAULT 'daftar',\n  aktif BOOLEAN DEFAULT TRUE\n);\nINSERT INTO pendaftar_asisten (nama) VALUES ('Rizky');", check: 'SELECT id, nama, status, aktif FROM pendaftar_asisten', h: ["Default ditulis setelah tipe: ENUM(...) DEFAULT 'daftar'.", 'Saat INSERT, sebut kolomnya saja: INSERT INTO pendaftar_asisten (nama) VALUES (...)', 'Kolom yang nggak diisi otomatis pakai DEFAULT; id otomatis 1.'], ex: 'Hasil cek: id 1, nama Rizky, status daftar, aktif 1. Semua kolom selain nama terisi otomatis.' }
    ],
    ringkas: 'Pilih tipe sesuai isi: INT untuk bilangan bulat, VARCHAR untuk teks, DATE/DATETIME untuk waktu, DECIMAL untuk angka pasti seperti IPK dan uang.'
  },
  {
    id: '1.2', t: 'NULL vs NOT NULL',
    konsep: `<p><b>NULL</b> artinya <b>kosong / belum diketahui</b>. Bukan nol, bukan teks kosong.</p>
<div class="analogi">📝 Di lembar KRS, kolom nilai yang <b>belum diisi dosen</b> itu NULL. Beda dengan nilai 0 (dosen sudah memberi nilai nol). Beda juga dengan '' (teks kosong).</div>
<p><b>NOT NULL</b> = kolom wajib diisi, seperti kolom bertanda bintang (*) di formulir pendaftaran.</p>
<p>Aturan emas: <b>cek NULL pakai IS NULL atau IS NOT NULL</b>, jangan pakai <code>= NULL</code>. Apa pun yang dibandingkan dengan NULL hasilnya "nggak diketahui", jadi barisnya nggak ikut.</p>`,
    sintaks: { code: `SELECT * FROM tabel WHERE kolom IS NULL;
SELECT * FROM tabel WHERE kolom IS NOT NULL;
SELECT IFNULL(kolom, pengganti) FROM tabel;   -- ganti NULL dengan nilai lain
SELECT COALESCE(kolom1, kolom2, 'x') FROM tabel; -- ambil nilai pertama yang bukan NULL`, ket: [['IS NULL', 'baris yang kolomnya kosong.'], ['IS NOT NULL', 'baris yang kolomnya sudah ada isinya.'], ['IFNULL(a, b)', 'kalau a NULL, tampilkan b. Khas MySQL.'], ['COALESCE(a, b, ...)', 'standar SQL, versi IFNULL yang bisa banyak argumen.']] },
    contoh: [
      { sql: 'SELECT * FROM krs WHERE nilai IS NULL;', ket: 'Ada 2 KRS yang belum dinilai: id 11 (Fitri, IF202) dan id 14 (Indra, IF102).', hl: 'null' },
      { sql: 'SELECT * FROM krs WHERE nilai = NULL;', ket: 'Hasilnya 0 baris! Karena "nilai = NULL" hasilnya selalu "nggak diketahui", bukan TRUE. Ini jebakan klasik.' },
      { sql: "SELECT nama, ipk, IFNULL(ipk, 0) AS ipk_atau_nol, COALESCE(ipk, 'belum ada') AS keterangan FROM mahasiswa WHERE angkatan = 2024;", ket: 'Lukman dan Mira IPK-nya NULL. IFNULL menggantinya dengan 0, COALESCE dengan teks "belum ada".' },
      { sql: "INSERT INTO mahasiswa (nim, jurusan, angkatan) VALUES ('2401099', 'Sistem Informasi', 2024);", ket: 'Error! Kolom nama dibuat NOT NULL, jadi wajib diisi. Database menolak data yang nggak lengkap.', err: true }
    ],
    salah: ['Menulis <code>WHERE nilai = NULL</code> atau <code>WHERE nilai != NULL</code>. Harus <code>IS NULL</code> / <code>IS NOT NULL</code>.', "Mengira NULL sama dengan 0 atau ''.", 'Lupa bahwa hitungan dengan NULL hasilnya NULL: <code>NULL + 5 = NULL</code>.', 'Lupa bahwa COUNT(kolom), AVG, SUM mengabaikan NULL (dibahas di Bab 3).'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan semua mahasiswa yang IPK-nya masih kosong.', a: 'SELECT * FROM mahasiswa WHERE ipk IS NULL;', h: ['Kosong = NULL.', 'Pakai IS NULL, bukan = NULL.', 'SELECT * FROM mahasiswa WHERE ipk IS NULL;'], ex: 'Lukman dan Mira (angkatan 2024) belum punya IPK.' },
      { lv: 'sedang', q: 'Tampilkan <code>kode_mk</code> dan <code>nama_mk</code> matakuliah yang belum punya dosen pengajar.', a: 'SELECT kode_mk, nama_mk FROM matakuliah WHERE id_dosen IS NULL;', h: ['Dosen pengajar disimpan di kolom id_dosen.', 'Belum punya = id_dosen IS NULL.', 'SELECT kode_mk, nama_mk FROM matakuliah WHERE id_dosen IS NULL;'], ex: 'IF302 Etika Profesi dan IF303 Kewirausahaan belum punya dosen.' },
      { lv: 'sulit', q: 'Tampilkan <code>id</code>, <code>nim</code>, dan <code>nilai</code> dari KRS yang <b>sudah</b> dinilai, dan untuk mahasiswa angkatan berapa pun. Lalu pikirkan: berapa barisnya?', a: 'SELECT id, nim, nilai FROM krs WHERE nilai IS NOT NULL;', h: ['Sudah dinilai = nilainya bukan NULL.', 'IS NOT NULL', 'SELECT id, nim, nilai FROM krs WHERE nilai IS NOT NULL;'], ex: 'Dari 15 KRS, 2 belum dinilai, jadi hasilnya 13 baris.' }
    ],
    ringkas: 'NULL = belum diketahui (bukan 0), NOT NULL = wajib diisi, dan cek NULL selalu pakai IS NULL / IS NOT NULL.'
  },
  {
    id: '1.3', t: 'Login MySQL, SHOW DATABASES, USE, SHOW TABLES, DESCRIBE',
    konsep: `<p>Ada 2 cara umum masuk ke MySQL:</p>
<p><b>1. Lewat terminal (command line).</b> Buka CMD/terminal. Kalau pakai XAMPP di Windows, masuk dulu ke folder <code>C:\\xampp\\mysql\\bin</code> atau klik tombol "Shell" di XAMPP Control Panel.</p>
${'<pre class="code">' + highlight(`mysql -u root -p
Enter password: ****
mysql>`, 'bash') + '</pre>'}
<p><code>-u root</code> = login sebagai user root. <code>-p</code> = minta password (diketik setelah Enter, nggak kelihatan). Kalau server ada di komputer lain tambahkan <code>-h alamat_host</code>, dan <code>-P 3306</code> untuk port. Di XAMPP bawaan, root biasanya tanpa password (langsung Enter).</p>
<p><b>2. Lewat phpMyAdmin</b> (tampilan web). Di XAMPP: Start <b>Apache</b> dan <b>MySQL</b>, lalu buka <code>http://localhost/phpmyadmin</code>. Ada tab SQL untuk mengetik query.</p>
<div class="analogi">🏢 Server MySQL = gedung arsip. <b>SHOW DATABASES</b> = lihat daftar lemari. <b>USE</b> = pilih satu lemari untuk dibuka. <b>SHOW TABLES</b> = lihat daftar lembar di lemari itu. <b>DESCRIBE</b> = lihat judul-judul kolom satu lembar.</div>`,
    sintaks: { code: `SHOW DATABASES;          -- daftar semua database di server
USE kampus;              -- pilih database yang mau dipakai
SELECT DATABASE();       -- cek sedang di database mana
SHOW TABLES;             -- daftar tabel di database aktif
DESCRIBE mahasiswa;      -- struktur tabel (bisa juga: DESC mahasiswa;)
SHOW COLUMNS FROM mahasiswa;  -- sama dengan DESCRIBE
SHOW CREATE TABLE mahasiswa;  -- lihat perintah CREATE TABLE-nya
EXIT;                    -- keluar (atau QUIT; atau \\q)`, ket: [['SHOW DATABASES', 'database bawaan MySQL: information_schema, mysql, performance_schema, sys. Jangan dihapus.'], ['USE nama_db', 'tanpa USE, query ke tabel akan error "No database selected".'], ['DESCRIBE', 'kolom hasilnya: Field, Type, Null, Key (PRI = primary key), Default, Extra (misal auto_increment).']] },
    mysql: ['SQLite nggak punya SHOW DATABASES, USE, SHOW TABLES, DESCRIBE. Di SQLite asli ditulis <code>SELECT name FROM sqlite_master WHERE type=\'table\'</code> dan <code>PRAGMA table_info(mahasiswa)</code>. Playground ini menerjemahkan otomatis, jadi kamu tetap latihan dengan sintaks MySQL.'],
    contoh: [
      { sql: 'SHOW DATABASES;', ket: 'Daftar database di server. Di playground isinya simulasi, tapi bentuknya sama seperti MySQL asli.' },
      { sql: 'USE kampus;\nSHOW TABLES;', ket: 'Setelah USE kampus, SHOW TABLES menampilkan semua tabel di database kampus, termasuk tabel mdl_ untuk Bab 7.' },
      { sql: 'DESCRIBE krs;', ket: 'Struktur tabel krs: 5 kolom, id adalah primary key (PRI), nilai boleh NULL (YES), sedangkan nim wajib diisi (NO).' }
    ],
    salah: ['Lupa <code>USE nama_db</code>, lalu dapat error "No database selected".', 'Menulis <code>mysql -u root -p password</code> dengan spasi. Kalau mau langsung, harus nempel: <code>-ppassword</code> (nggak disarankan, password kelihatan).', 'Menghapus database bawaan (mysql, information_schema). Jangan!', 'Lupa titik koma, lalu prompt berubah jadi <code>-&gt;</code>. Ketik <code>;</code> lalu Enter.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan daftar semua tabel di database kampus.', a: 'SHOW TABLES;', h: ['Perintah MySQL diawali SHOW.', 'Yang dilihat: TABLES.', 'SHOW TABLES;'], ex: 'SHOW TABLES = daftar tabel di database aktif.' },
      { lv: 'sedang', q: 'Tampilkan struktur tabel <code>dosen</code> (nama kolom, tipe, dll).', a: 'DESCRIBE dosen;', h: ['Perintahnya DESCRIBE (atau DESC).', 'Diikuti nama tabel.', 'DESCRIBE dosen;'], ex: 'Bisa juga ditulis DESC dosen; atau SHOW COLUMNS FROM dosen; hasilnya sama.' },
      { lv: 'sulit', type: 'pattern', q: 'Tulis perintah di <b>terminal</b> untuk login ke MySQL sebagai user <code>asisten</code> dan diminta mengetik password.', a: 'mysql -u asisten -p', pats: [['^mysql\\b', 'Perintahnya diawali kata mysql.'], ['-u\\s*asisten\\b', 'Tentukan user dengan -u asisten.'], ['(^|\\s)-p(\\s|$)', 'Tambahkan -p (terpisah) supaya diminta password.']], h: ['Program klien MySQL namanya mysql.', '-u untuk user, -p untuk password.', 'mysql -u asisten -p'], ex: 'mysql -u asisten -p lalu Enter, kemudian ketik password. Tambahkan -h host kalau server-nya di komputer lain.' }
    ],
    ringkas: 'Login dengan mysql -u user -p, lalu SHOW DATABASES → USE db → SHOW TABLES → DESCRIBE tabel untuk menjelajah isi server.'
  }
  ]
});
