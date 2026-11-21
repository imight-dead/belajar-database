/* ===== BAB 2 DDL ===== */
CH.push({
  id: 'bab2', title: 'Bab 2 · DDL',
  lead: 'DDL (Data Definition Language) = perintah untuk membuat dan mengubah STRUKTUR: database, tabel, kolom, constraint, index, view.',
  intro: `<div class="box"><b>Begini DDL MySQL asli database kampus</b> (bagus untuk dihafal polanya):
${'<pre class="code">' + highlight(`CREATE DATABASE kampus;
USE kampus;

CREATE TABLE dosen (
  id_dosen INT AUTO_INCREMENT PRIMARY KEY,
  nama     VARCHAR(60) NOT NULL,
  keahlian VARCHAR(60)
);

CREATE TABLE mahasiswa (
  nim      VARCHAR(10) PRIMARY KEY,
  nama     VARCHAR(60) NOT NULL,
  jurusan  VARCHAR(40) NOT NULL,
  angkatan INT NOT NULL,
  kota     VARCHAR(30),
  ipk      DECIMAL(3,2) CHECK (ipk BETWEEN 0 AND 4)
);

CREATE TABLE matakuliah (
  kode_mk  VARCHAR(10) PRIMARY KEY,
  nama_mk  VARCHAR(60) NOT NULL,
  sks      INT NOT NULL,
  id_dosen INT,
  FOREIGN KEY (id_dosen) REFERENCES dosen(id_dosen)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE krs (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nim      VARCHAR(10) NOT NULL,
  kode_mk  VARCHAR(10) NOT NULL,
  semester INT NOT NULL,
  nilai    INT,
  FOREIGN KEY (nim) REFERENCES mahasiswa(nim),
  FOREIGN KEY (kode_mk) REFERENCES matakuliah(kode_mk)
);`) + '</pre>'}</div>`,
  subs: [
  {
    id: '2.1', t: 'CREATE DATABASE & CREATE TABLE',
    konsep: `<div class="analogi">🏗️ <b>CREATE DATABASE</b> = beli lemari arsip baru yang masih kosong. <b>CREATE TABLE</b> = bikin lembar Excel baru di lemari itu, lengkap dengan judul kolom dan aturan isinya. Datanya belum ada, baru wadahnya.</div>
<p>Urutannya selalu: buat database → <code>USE</code> database → buat tabel. Tabel yang punya FOREIGN KEY harus dibuat <b>setelah</b> tabel yang ditunjuk (dosen dulu, baru matakuliah).</p>`,
    sintaks: { code: `CREATE DATABASE nama_db;
CREATE DATABASE IF NOT EXISTS nama_db;   -- nggak error kalau sudah ada
USE nama_db;

CREATE TABLE nama_tabel (
  kolom1 TIPE [constraint],
  kolom2 TIPE [constraint],
  ...
);
CREATE TABLE IF NOT EXISTS nama_tabel (...);`, ket: [['CREATE DATABASE', 'membuat database baru.'], ['IF NOT EXISTS', 'pengaman: kalau sudah ada, dilewati tanpa error.'], ['( ... )', 'daftar kolom dipisah koma. Kolom terakhir TANPA koma.'], ['[constraint]', 'aturan tambahan seperti PRIMARY KEY, NOT NULL (Bab 2.2).']] },
    mysql: ['Di playground, CREATE DATABASE hanya simulasi (SQLite cuma punya satu database per file). Di MySQL asli, database baru akan muncul di SHOW DATABASES dan bisa dipilih dengan USE.'],
    contoh: [
      { sql: 'CREATE DATABASE perpustakaan;\nCREATE DATABASE IF NOT EXISTS perpustakaan;', ket: 'Perintah pertama membuat database. Perintah kedua aman walau database sudah ada.' },
      { sql: `CREATE TABLE asisten (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nim  VARCHAR(10) NOT NULL,
  nama VARCHAR(60) NOT NULL,
  lab  VARCHAR(30)
);
DESCRIBE asisten;`, ket: 'Tabel asisten dibuat dengan 4 kolom. DESCRIBE memperlihatkan id adalah PRI (primary key), nim dan nama nggak boleh NULL.' },
      { sql: `CREATE TABLE asisten (id INT PRIMARY KEY, nama VARCHAR(60));
CREATE TABLE IF NOT EXISTS asisten (id INT PRIMARY KEY, nama VARCHAR(60));
CREATE TABLE asisten (id INT PRIMARY KEY, nama VARCHAR(60));`, ket: 'Perintah 1 berhasil, perintah 2 dilewati (karena IF NOT EXISTS), perintah 3 error "table already exists". Inilah gunanya IF NOT EXISTS.', err: true }
    ],
    salah: ['Koma di kolom terakhir: <code>lab VARCHAR(30),</code> lalu <code>);</code> = syntax error.', 'Lupa USE, sehingga tabel dibuat di database yang salah (atau error "No database selected").', 'Membuat tabel anak (punya FK) sebelum tabel induk.', 'Pakai spasi di nama tabel/kolom (<code>nama mahasiswa</code>). Pakai garis bawah: <code>nama_mahasiswa</code>.'],
    latihan: [
      { lv: 'mudah', q: 'Buat tabel <code>lab</code> dengan kolom <code>kode_lab</code> VARCHAR(10) primary key, <code>nama_lab</code> VARCHAR(50) NOT NULL, <code>lantai</code> INT.', a: 'CREATE TABLE lab (\n  kode_lab VARCHAR(10) PRIMARY KEY,\n  nama_lab VARCHAR(50) NOT NULL,\n  lantai INT\n);', check: "SELECT name AS kolom, pk, \"notnull\" FROM pragma_table_info('lab') ORDER BY cid", h: ['CREATE TABLE lab ( ... );', 'NOT NULL ditulis setelah tipe nama_lab.', 'CREATE TABLE lab (kode_lab VARCHAR(10) PRIMARY KEY, nama_lab VARCHAR(50) NOT NULL, lantai INT);'], ex: 'Pengecek melihat nama kolom, mana primary key, dan mana yang NOT NULL.' },
      { lv: 'sedang', q: 'Buat tabel <code>jadwal_praktikum</code>: <code>id</code> INT AUTO_INCREMENT primary key, <code>kode_mk</code> VARCHAR(10) NOT NULL, <code>hari</code> VARCHAR(10), <code>jam_mulai</code> TIME, <code>ruang</code> VARCHAR(20).', a: 'CREATE TABLE jadwal_praktikum (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  kode_mk VARCHAR(10) NOT NULL,\n  hari VARCHAR(10),\n  jam_mulai TIME,\n  ruang VARCHAR(20)\n);', check: "SELECT name AS kolom, pk, \"notnull\" FROM pragma_table_info('jadwal_praktikum') ORDER BY cid", h: ['TIME adalah tipe untuk jam, formatnya HH:MM:SS.', 'id INT AUTO_INCREMENT PRIMARY KEY', 'Lima kolom, dipisah koma, kolom terakhir tanpa koma.'], ex: 'TIME menyimpan jam (misal 13:00:00). AUTO_INCREMENT membuat id terisi otomatis.' },
      { lv: 'sulit', q: 'Buat <b>dua</b> tabel: <code>kelas</code> (<code>id_kelas</code> INT primary key, <code>nama_kelas</code> VARCHAR(20) NOT NULL) dan <code>anggota_kelas</code> (<code>id_kelas</code> INT, <code>nim</code> VARCHAR(10), dengan FOREIGN KEY id_kelas ke kelas dan nim ke mahasiswa). Pakai IF NOT EXISTS di keduanya.', a: 'CREATE TABLE IF NOT EXISTS kelas (\n  id_kelas INT PRIMARY KEY,\n  nama_kelas VARCHAR(20) NOT NULL\n);\nCREATE TABLE IF NOT EXISTS anggota_kelas (\n  id_kelas INT,\n  nim VARCHAR(10),\n  FOREIGN KEY (id_kelas) REFERENCES kelas(id_kelas),\n  FOREIGN KEY (nim) REFERENCES mahasiswa(nim)\n);', check: "SELECT m.name AS tabel, p.name AS kolom FROM sqlite_master m, pragma_table_info(m.name) p WHERE m.name IN ('kelas','anggota_kelas') UNION ALL SELECT 'FK: ' || f.\"from\", f.\"table\" FROM pragma_foreign_key_list('anggota_kelas') f", h: ['Buat tabel induk (kelas) dulu.', 'FOREIGN KEY (kolom) REFERENCES tabel_induk(kolom_pk) ditulis setelah daftar kolom.', 'Ada 2 FOREIGN KEY di anggota_kelas, dipisah koma.'], ex: 'Pengecek melihat kolom kedua tabel dan dua foreign key di anggota_kelas. Ini pola tabel penghubung N-M (seperti krs).' }
    ],
    ringkas: 'CREATE DATABASE membuat lemari, CREATE TABLE membuat lembar dengan kolom dan tipenya; tambah IF NOT EXISTS supaya aman dijalankan ulang.'
  },
  {
    id: '2.2', t: 'Constraint: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, DEFAULT, CHECK, AUTO_INCREMENT',
    konsep: `<p><b>Constraint</b> = aturan penjaga data. Seperti satpam yang menolak data aneh masuk.</p>
<table class="cmp"><tr><th>Constraint</th><th>Aturannya</th><th>Analogi</th></tr>
<tr><td>PRIMARY KEY</td><td>Unik + nggak boleh NULL. Satu tabel satu PK.</td><td>NIM</td></tr>
<tr><td>FOREIGN KEY</td><td>Nilainya harus ada di tabel induk.</td><td>NIM di KRS harus NIM yang terdaftar</td></tr>
<tr><td>ON DELETE CASCADE</td><td>Induk dihapus → baris anak ikut terhapus.</td><td>Mahasiswa keluar, semua KRS-nya ikut dibuang</td></tr>
<tr><td>ON UPDATE CASCADE</td><td>PK induk diubah → FK di anak ikut berubah.</td><td>NIM diganti, KRS ikut pakai NIM baru</td></tr>
<tr><td>UNIQUE</td><td>Nggak boleh dobel (tapi boleh NULL).</td><td>Email, nomor HP</td></tr>
<tr><td>NOT NULL</td><td>Wajib diisi.</td><td>Kolom bertanda * di formulir</td></tr>
<tr><td>DEFAULT</td><td>Nilai otomatis kalau nggak diisi.</td><td>Status "aktif" untuk mahasiswa baru</td></tr>
<tr><td>CHECK</td><td>Harus memenuhi syarat.</td><td>IPK antara 0 dan 4</td></tr>
<tr><td>AUTO_INCREMENT</td><td>Angka otomatis naik 1, 2, 3...</td><td>Nomor antrian</td></tr></table>
<p>Pilihan ON DELETE / ON UPDATE lain: <b>RESTRICT</b> / <b>NO ACTION</b> (default: tolak penghapusan kalau masih dipakai) dan <b>SET NULL</b> (FK di anak diubah jadi NULL).</p>`,
    sintaks: { code: `CREATE TABLE akun (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nim    VARCHAR(10) NOT NULL,
  email  VARCHAR(100) UNIQUE,
  status VARCHAR(10) DEFAULT 'aktif',
  poin   INT CHECK (poin >= 0),
  FOREIGN KEY (nim) REFERENCES mahasiswa(nim)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
-- Bentuk lain: constraint diberi nama
-- CONSTRAINT fk_akun_mhs FOREIGN KEY (nim) REFERENCES mahasiswa(nim)
-- PRIMARY KEY (kolom1, kolom2)   -- PK gabungan dua kolom`, ket: [['AUTO_INCREMENT', 'hanya untuk kolom angka yang jadi key. Satu tabel maksimal satu.'], ['UNIQUE', 'boleh lebih dari satu kolom UNIQUE di satu tabel.'], ["DEFAULT 'aktif'", 'dipakai kalau kolom status nggak disebut saat INSERT.'], ['CHECK (poin >= 0)', 'data dengan poin negatif ditolak.'], ['ON DELETE CASCADE', 'hapus mahasiswa → akun miliknya ikut hilang.']] },
    mysql: ['SQLite asli menulis auto increment sebagai <code>INTEGER PRIMARY KEY AUTOINCREMENT</code>. Di MySQL: <code>INT AUTO_INCREMENT PRIMARY KEY</code>. Playground menerjemahkan otomatis.', 'CHECK baru benar-benar <b>ditegakkan</b> di MySQL 8.0.16 ke atas. Di MySQL 5.7, CHECK ditulis boleh tapi diabaikan.', 'FOREIGN KEY hanya jalan di storage engine <b>InnoDB</b> (default MySQL sekarang). SQLite butuh <code>PRAGMA foreign_keys = ON</code>; di playground sudah dinyalakan.'],
    contoh: [
      { t: 'AUTO_INCREMENT & DEFAULT', sql: `CREATE TABLE akun (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(10) NOT NULL,
  email VARCHAR(100) UNIQUE,
  status VARCHAR(10) DEFAULT 'aktif',
  poin INT CHECK (poin >= 0),
  FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO akun (nim, email, poin) VALUES ('2101001', 'andi@kampus.ac.id', 10);
INSERT INTO akun (nim, email, poin) VALUES ('2401012', 'lukman@kampus.ac.id', 0);
SELECT * FROM akun;`, ket: 'Kita nggak mengisi id dan status. id terisi 1 dan 2 (AUTO_INCREMENT), status terisi "aktif" (DEFAULT).' },
      { t: 'UNIQUE menolak duplikat', sql: `CREATE TABLE akun (id INT AUTO_INCREMENT PRIMARY KEY, nim VARCHAR(10) NOT NULL, email VARCHAR(100) UNIQUE);
INSERT INTO akun (nim, email) VALUES ('2101001', 'andi@kampus.ac.id');
INSERT INTO akun (nim, email) VALUES ('2101002', 'andi@kampus.ac.id');`, ket: 'INSERT kedua ditolak karena email sudah dipakai. Di MySQL pesannya: Duplicate entry ... for key \'email\'.', err: true },
      { t: 'FOREIGN KEY menolak data "yatim"', sql: `CREATE TABLE akun (id INT AUTO_INCREMENT PRIMARY KEY, nim VARCHAR(10) NOT NULL,
  FOREIGN KEY (nim) REFERENCES mahasiswa(nim));
INSERT INTO akun (nim) VALUES ('9999999');`, ket: 'NIM 9999999 nggak ada di tabel mahasiswa, jadi ditolak. Di MySQL: Cannot add or update a child row: a foreign key constraint fails.', err: true },
      { t: 'ON DELETE CASCADE', sql: `CREATE TABLE akun (id INT AUTO_INCREMENT PRIMARY KEY, nim VARCHAR(10) NOT NULL,
  FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE);
INSERT INTO akun (nim) VALUES ('2401012'), ('2401012'), ('2101001');
SELECT COUNT(*) AS akun_lukman_sebelum FROM akun WHERE nim = '2401012';
DELETE FROM mahasiswa WHERE nim = '2401012';
SELECT COUNT(*) AS akun_lukman_sesudah FROM akun WHERE nim = '2401012';`, ket: 'Lukman punya 2 akun. Setelah Lukman dihapus dari mahasiswa, 2 akunnya ikut terhapus otomatis (CASCADE). Akun Andi tetap ada.' },
      { t: 'CHECK', sql: `CREATE TABLE akun (id INT AUTO_INCREMENT PRIMARY KEY, poin INT CHECK (poin >= 0));
INSERT INTO akun (poin) VALUES (5);
INSERT INTO akun (poin) VALUES (-3);`, ket: 'Poin -3 melanggar CHECK (poin >= 0) sehingga ditolak.', err: true }
    ],
    salah: ['Mengira UNIQUE sama dengan PRIMARY KEY. UNIQUE boleh NULL dan boleh lebih dari satu per tabel; PK cuma satu dan nggak boleh NULL.', 'Tipe FK beda dengan tipe PK induk (misal INT vs VARCHAR). Di MySQL ini bikin error saat membuat FK.', 'Menghapus data induk yang masih dipakai tanpa CASCADE, lalu bingung kenapa error "foreign key constraint fails".', 'Memakai AUTO_INCREMENT di kolom VARCHAR. Harus kolom angka.'],
    latihan: [
      { lv: 'mudah', q: "Buat tabel <code>kategori</code> (<code>id</code> INT AUTO_INCREMENT primary key, <code>nama</code> VARCHAR(50) NOT NULL UNIQUE). Lalu masukkan dua kategori: 'Praktikum' dan 'Teori' tanpa mengisi id.", a: "CREATE TABLE kategori (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nama VARCHAR(50) NOT NULL UNIQUE\n);\nINSERT INTO kategori (nama) VALUES ('Praktikum'), ('Teori');", check: 'SELECT id, nama FROM kategori', h: ['Constraint bisa ditumpuk: VARCHAR(50) NOT NULL UNIQUE.', 'INSERT hanya menyebut kolom nama.', "INSERT INTO kategori (nama) VALUES ('Praktikum'), ('Teori');"], ex: 'id otomatis 1 dan 2 karena AUTO_INCREMENT.' },
      { lv: 'sedang', q: "Buat tabel <code>nilai_praktikum</code>: <code>id</code> INT AUTO_INCREMENT PK, <code>nim</code> VARCHAR(10) NOT NULL (FK ke mahasiswa), <code>skor</code> INT dengan DEFAULT 0 dan CHECK skor antara 0 sampai 100. Lalu masukkan satu baris untuk nim '2101001' tanpa mengisi skor.", a: "CREATE TABLE nilai_praktikum (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nim VARCHAR(10) NOT NULL,\n  skor INT DEFAULT 0 CHECK (skor BETWEEN 0 AND 100),\n  FOREIGN KEY (nim) REFERENCES mahasiswa(nim)\n);\nINSERT INTO nilai_praktikum (nim) VALUES ('2101001');", check: "INSERT OR IGNORE INTO nilai_praktikum (nim, skor) VALUES ('2101002', 150);\nSELECT nim, skor FROM nilai_praktikum", h: ['DEFAULT dan CHECK boleh di kolom yang sama: skor INT DEFAULT 0 CHECK (...).', 'Syaratnya bisa ditulis skor BETWEEN 0 AND 100 atau skor >= 0 AND skor <= 100.', 'FOREIGN KEY (nim) REFERENCES mahasiswa(nim)'], ex: 'Pengecek mencoba memasukkan skor 150. Kalau CHECK kamu benar, data itu ditolak, sehingga hanya tersisa baris 2101001 dengan skor 0.' },
      { lv: 'sulit', q: "Buat tabel <code>presensi</code> (<code>id</code> INT AUTO_INCREMENT PK, <code>nim</code> VARCHAR(10) FK ke mahasiswa yang <b>ikut terhapus</b> kalau mahasiswanya dihapus, <code>tanggal</code> DATE). Masukkan presensi nim '2401013' tanggal '2024-09-02'. Lalu hapus mahasiswa '2401013' dari tabel mahasiswa.", a: "CREATE TABLE presensi (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nim VARCHAR(10),\n  tanggal DATE,\n  FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE\n);\nINSERT INTO presensi (nim, tanggal) VALUES ('2401013', '2024-09-02');\nDELETE FROM mahasiswa WHERE nim = '2401013';", check: "SELECT (SELECT COUNT(*) FROM presensi) AS sisa_presensi, (SELECT COUNT(*) FROM mahasiswa WHERE nim = '2401013') AS mira_masih_ada", h: ['"Ikut terhapus" = ON DELETE CASCADE.', 'Tulis ON DELETE CASCADE setelah REFERENCES mahasiswa(nim).', 'Tiga perintah: CREATE TABLE, INSERT, DELETE.'], ex: 'Tanpa CASCADE, DELETE akan ditolak karena presensi masih menunjuk Mira. Dengan CASCADE, presensinya ikut hilang: sisa 0.' }
    ],
    ringkas: 'Constraint adalah satpam data: PK unik dan wajib, FK wajib ada di induk, UNIQUE anti dobel, NOT NULL wajib isi, DEFAULT isi otomatis, CHECK syarat isi, AUTO_INCREMENT nomor otomatis.'
  },
  {
    id: '2.3', t: 'ALTER TABLE: ADD, MODIFY, CHANGE, DROP COLUMN, RENAME',
    konsep: `<div class="analogi">🔨 ALTER TABLE = <b>renovasi</b> lembar yang sudah ada tanpa membuang isinya: tambah kolom, ganti tipe, ganti nama, hapus kolom.</div>
<table class="cmp"><tr><th>Perintah</th><th>Gunanya</th></tr>
<tr><td>ADD</td><td>Tambah kolom baru</td></tr>
<tr><td>MODIFY</td><td>Ubah tipe/constraint kolom, <b>nama tetap</b></td></tr>
<tr><td>CHANGE</td><td>Ubah <b>nama</b> kolom (dan sekaligus tipenya). Tipe wajib ditulis ulang.</td></tr>
<tr><td>RENAME COLUMN</td><td>Ganti nama kolom saja (MySQL 8.0+)</td></tr>
<tr><td>DROP COLUMN</td><td>Hapus kolom beserta isinya</td></tr>
<tr><td>RENAME TO</td><td>Ganti nama tabel</td></tr></table>`,
    sintaks: { code: `ALTER TABLE dosen ADD email VARCHAR(100);
ALTER TABLE dosen ADD COLUMN no_hp VARCHAR(15) AFTER nama;  -- taruh setelah kolom nama
ALTER TABLE dosen MODIFY keahlian VARCHAR(100) NOT NULL;
ALTER TABLE dosen CHANGE keahlian bidang VARCHAR(100);       -- nama lama, nama baru, tipe
ALTER TABLE dosen RENAME COLUMN bidang TO keahlian;          -- MySQL 8.0+
ALTER TABLE dosen DROP COLUMN no_hp;
ALTER TABLE dosen RENAME TO pengajar;
RENAME TABLE pengajar TO dosen;                              -- cara lain ganti nama tabel`, ket: [['ADD [COLUMN]', 'kata COLUMN boleh ditulis, boleh nggak.'], ['AFTER kolom / FIRST', 'menentukan posisi kolom baru (khas MySQL).'], ['MODIFY kolom tipe', 'tulis definisi lengkap baru. Constraint yang nggak ditulis ulang akan hilang!'], ['CHANGE lama baru tipe', 'ganti nama + tipe sekaligus.']] },
    mysql: ['<b>MODIFY nggak ada di SQLite</b> (SQLite nggak bisa ubah tipe kolom). Di playground, MODIFY hanya ditampilkan pesan, nggak dijalankan. Di MySQL: <code>ALTER TABLE dosen MODIFY keahlian VARCHAR(100) NOT NULL;</code>', 'CHANGE nggak ada di SQLite. Playground menerjemahkannya jadi <code>RENAME COLUMN</code> (tipe barunya diabaikan).', 'AFTER/FIRST diabaikan di playground karena SQLite selalu menaruh kolom baru di paling akhir.'],
    contoh: [
      { sql: 'ALTER TABLE dosen ADD email VARCHAR(100);\nSELECT * FROM dosen;', ket: 'Kolom email muncul di paling kanan. Semua dosen lama isinya NULL di kolom baru itu.', hl: 'null' },
      { sql: 'ALTER TABLE dosen CHANGE keahlian bidang VARCHAR(100);\nDESCRIBE dosen;', ket: 'Kolom keahlian sekarang bernama bidang. Isinya tetap.' },
      { sql: 'ALTER TABLE mahasiswa DROP COLUMN kota;\nALTER TABLE staf RENAME TO pegawai;\nDESCRIBE mahasiswa;\nSHOW TABLES;', ket: 'Kolom kota hilang dari mahasiswa (beserta isinya). Tabel staf berganti nama jadi pegawai.' },
      { sql: 'ALTER TABLE dosen MODIFY keahlian VARCHAR(100) NOT NULL;', ket: 'Di MySQL ini mengubah tipe kolom. Di playground cuma muncul info karena SQLite nggak mendukung.' }
    ],
    salah: ['Pakai MODIFY untuk ganti nama kolom. MODIFY nggak bisa ganti nama; pakai CHANGE atau RENAME COLUMN.', 'Lupa menulis tipe saat CHANGE: <code>CHANGE keahlian bidang</code> saja = error. Harus ada tipenya.', 'MODIFY tanpa menulis ulang NOT NULL/DEFAULT, sehingga constraint lama hilang.', 'DROP COLUMN di tabel produksi tanpa backup. Datanya hilang permanen.'],
    latihan: [
      { lv: 'mudah', q: 'Tambahkan kolom <code>email</code> VARCHAR(100) ke tabel <code>dosen</code>.', a: 'ALTER TABLE dosen ADD email VARCHAR(100);', check: "SELECT name AS kolom FROM pragma_table_info('dosen') ORDER BY cid", h: ['ALTER TABLE nama_tabel ...', 'Kata kuncinya ADD.', 'ALTER TABLE dosen ADD email VARCHAR(100);'], ex: 'Kolom email jadi kolom ke-4 di dosen.' },
      { lv: 'sedang', q: 'Ganti nama kolom <code>kota</code> di tabel mahasiswa jadi <code>kota_asal</code> (tipe VARCHAR(30)).', a: 'ALTER TABLE mahasiswa CHANGE kota kota_asal VARCHAR(30);', check: "SELECT name AS kolom FROM pragma_table_info('mahasiswa') ORDER BY cid", h: ['Ganti nama kolom: CHANGE atau RENAME COLUMN.', 'CHANGE nama_lama nama_baru tipe', 'ALTER TABLE mahasiswa CHANGE kota kota_asal VARCHAR(30);'], ex: 'Bisa juga: ALTER TABLE mahasiswa RENAME COLUMN kota TO kota_asal; (MySQL 8).' },
      { lv: 'sulit', q: 'Lakukan 3 hal pada tabel dosen: tambah kolom <code>no_hp</code> VARCHAR(15), hapus kolom <code>keahlian</code>, lalu ganti nama tabelnya jadi <code>pengajar</code>.', a: 'ALTER TABLE dosen ADD no_hp VARCHAR(15);\nALTER TABLE dosen DROP COLUMN keahlian;\nALTER TABLE dosen RENAME TO pengajar;', check: "SELECT name AS kolom FROM pragma_table_info('pengajar') ORDER BY cid", h: ['Tiga perintah ALTER TABLE terpisah (atau satu ALTER dengan koma).', 'Ganti nama tabel paling akhir, karena setelah itu nama dosen sudah nggak ada.', 'ALTER TABLE dosen RENAME TO pengajar; atau RENAME TABLE dosen TO pengajar;'], ex: 'Urutan penting: kalau RENAME duluan, perintah berikutnya harus pakai nama pengajar.' },
      { lv: 'sulit', type: 'pattern', q: 'Tulis perintah MySQL untuk mengubah tipe kolom <code>nama_mk</code> di tabel matakuliah menjadi VARCHAR(100) NOT NULL (nama kolom tetap).', a: 'ALTER TABLE matakuliah MODIFY nama_mk VARCHAR(100) NOT NULL;', pats: [['^ALTER TABLE matakuliah\\b', 'Diawali ALTER TABLE matakuliah.'], ['\\bMODIFY( COLUMN)? nama_mk VARCHAR\\(100\\)', 'Pakai MODIFY nama_mk VARCHAR(100). (Bisa juga CHANGE nama_mk nama_mk ..., tapi di soal ini pakai MODIFY.)'], ['VARCHAR\\(100\\) NOT NULL', 'Jangan lupa NOT NULL.']], h: ['Nama tetap, tipe berubah = MODIFY.', 'ALTER TABLE matakuliah MODIFY ...', 'ALTER TABLE matakuliah MODIFY nama_mk VARCHAR(100) NOT NULL;'], ex: 'MODIFY menulis ulang definisi kolom. Karena nama nggak berubah, nggak perlu CHANGE.' }
    ],
    ringkas: 'ALTER TABLE = renovasi: ADD tambah kolom, MODIFY ubah tipe, CHANGE ubah nama+tipe, DROP COLUMN hapus kolom, RENAME TO ganti nama tabel.'
  },
  {
    id: '2.4', t: 'DROP vs TRUNCATE vs DELETE',
    konsep: `<div class="analogi">📄 Bayangkan satu lembar daftar hadir.<br><b>DELETE</b> = mencoret beberapa nama (atau semua) satu per satu.<br><b>TRUNCATE</b> = menyobek semua isi, tapi lembar dan judul kolomnya tetap, nomor urut mulai dari 1 lagi.<br><b>DROP</b> = membuang lembarnya ke tempat sampah.</div>
<table class="cmp"><tr><th></th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr>
<tr><td>Kategori</td><td>DML</td><td>DDL</td><td>DDL</td></tr>
<tr><td>Yang hilang</td><td>Baris tertentu / semua baris</td><td>Semua baris</td><td>Tabel + struktur + data</td></tr>
<tr><td>Bisa pakai WHERE?</td><td>Bisa</td><td>Nggak</td><td>Nggak</td></tr>
<tr><td>Struktur tabel</td><td>Tetap</td><td>Tetap</td><td>Hilang</td></tr>
<tr><td>AUTO_INCREMENT</td><td>Lanjut dari angka terakhir</td><td>Reset ke 1</td><td>Hilang bersama tabel</td></tr>
<tr><td>Bisa ROLLBACK?</td><td>Bisa (di dalam transaksi)</td><td>Nggak (auto-commit)</td><td>Nggak</td></tr>
<tr><td>Kecepatan</td><td>Lebih lambat (baris per baris)</td><td>Cepat</td><td>Cepat</td></tr></table>`,
    sintaks: { code: `DELETE FROM krs WHERE nilai IS NULL;  -- hapus sebagian
DELETE FROM krs;                      -- hapus semua baris (struktur tetap)
TRUNCATE TABLE krs;                   -- kosongkan + reset AUTO_INCREMENT
DROP TABLE krs;                       -- buang tabelnya
DROP TABLE IF EXISTS krs;             -- aman kalau tabel sudah nggak ada
DROP DATABASE kampus;                 -- buang seluruh database!`, ket: [['DELETE FROM ... WHERE', 'satu-satunya yang bisa memilih baris.'], ['TRUNCATE TABLE', 'kata TABLE boleh dihilangkan di MySQL.'], ['DROP TABLE IF EXISTS', 'pola umum di script instalasi.']] },
    mysql: ['SQLite nggak punya TRUNCATE. Playground menerjemahkan <code>TRUNCATE TABLE krs</code> jadi <code>DELETE FROM krs</code>. Bedanya: di MySQL, TRUNCATE juga me-reset AUTO_INCREMENT ke 1.'],
    contoh: [
      { sql: 'DELETE FROM krs WHERE nilai IS NULL;\nSELECT COUNT(*) AS sisa_krs FROM krs;', ket: 'Dua KRS bernilai NULL dihapus, sisa 13 baris.' },
      { sql: 'TRUNCATE TABLE krs;\nSELECT COUNT(*) AS sisa_krs FROM krs;\nDESCRIBE krs;', ket: 'Isinya kosong (0 baris), tapi DESCRIBE masih jalan karena struktur tabelnya masih ada.' },
      { sql: 'DROP TABLE krs;\nSHOW TABLES;', ket: 'krs hilang dari daftar tabel. Coba jalankan SELECT * FROM krs setelahnya, pasti error "doesn\'t exist".' }
    ],
    salah: ['Menjalankan <code>DELETE FROM tabel;</code> padahal maksudnya hapus satu baris (lupa WHERE).', 'Memakai DROP padahal cuma mau mengosongkan isi.', 'Mengira TRUNCATE bisa di-ROLLBACK seperti DELETE.', 'TRUNCATE tabel induk yang masih direferensikan FK: MySQL menolak.'],
    latihan: [
      { lv: 'mudah', q: 'Hapus semua KRS semester 1.', a: 'DELETE FROM krs WHERE semester = 1;', check: 'SELECT * FROM krs', h: ['Hapus sebagian = DELETE ... WHERE.', 'Syaratnya semester = 1.', 'DELETE FROM krs WHERE semester = 1;'], ex: 'Ada 5 KRS semester 1, jadi sisa 10 baris.' },
      { lv: 'sedang', q: 'Kosongkan seluruh isi tabel <code>krs</code>, tapi tabelnya jangan dihapus.', a: 'TRUNCATE TABLE krs;', check: 'SELECT COUNT(*) AS jumlah_baris FROM krs', h: ['Bukan DROP, karena tabel harus tetap ada.', 'Bisa DELETE tanpa WHERE, atau perintah DDL yang lebih cepat.', 'TRUNCATE TABLE krs;'], ex: 'TRUNCATE (atau DELETE FROM krs) membuat tabel kosong. Kalau kamu pakai DROP, pengecek error karena tabelnya hilang.' },
      { lv: 'sulit', q: 'Hapus tabel <code>staf</code> beserta strukturnya, dengan cara yang nggak error walaupun tabelnya ternyata sudah nggak ada.', a: 'DROP TABLE IF EXISTS staf;', check: "SELECT COUNT(*) AS tabel_staf_masih_ada FROM sqlite_master WHERE name = 'staf'", h: ['Hapus struktur = DROP.', 'Supaya nggak error kalau sudah hilang: IF EXISTS.', 'DROP TABLE IF EXISTS staf;'], ex: 'IF EXISTS membuat perintah aman dijalankan berkali-kali.' },
      { lv: 'sulit', type: 'mc', q: 'Tabel <code>log</code> punya id AUTO_INCREMENT terakhir 500. Kamu mau mengosongkannya dan id berikutnya mulai dari 1 lagi. Perintah yang tepat?', opsi: ['DELETE FROM log;', 'TRUNCATE TABLE log;', 'DROP TABLE log;', 'ALTER TABLE log DROP id;'], benar: 1, h: ['Yang me-reset AUTO_INCREMENT dan tetap mempertahankan tabel.'], ex: 'TRUNCATE mengosongkan dan me-reset AUTO_INCREMENT. DELETE melanjutkan dari 501. DROP membuang tabel.' }
    ],
    ringkas: 'DELETE hapus baris (bisa WHERE), TRUNCATE kosongkan semua dan reset nomor, DROP buang tabelnya.'
  },
  {
    id: '2.5', t: 'CREATE INDEX & CREATE VIEW',
    konsep: `<div class="analogi">📚 <b>Index</b> = halaman indeks di belakang buku. Mau cari kata "Normalisasi"? Lihat indeks, langsung ke halaman 120, nggak perlu baca dari halaman 1. Database juga begitu: kolom yang sering dicari (WHERE, JOIN) bisa diberi index supaya pencarian cepat.</div>
<p>Kekurangannya: index makan tempat dan sedikit memperlambat INSERT/UPDATE (karena indeks harus ikut diperbarui). Primary key dan UNIQUE otomatis punya index.</p>
<div class="analogi">🪟 <b>View</b> = "tabel virtual" = query SELECT yang disimpan dengan nama. Seperti <b>filter tersimpan</b> di Excel. View nggak menyimpan data sendiri; setiap dipanggil, query aslinya dijalankan ulang.</div>
<p>Gunanya view: menyederhanakan query panjang, dan membatasi akses (user cukup diberi akses ke view, bukan tabel asli).</p>`,
    sintaks: { code: `CREATE INDEX idx_jurusan ON mahasiswa(jurusan);
CREATE UNIQUE INDEX idx_email ON akun(email);
CREATE INDEX idx_jur_angk ON mahasiswa(jurusan, angkatan);  -- index gabungan
SHOW INDEX FROM mahasiswa;
DROP INDEX idx_jurusan ON mahasiswa;

CREATE VIEW v_mhs_ti AS
  SELECT nim, nama, ipk FROM mahasiswa WHERE jurusan = 'Teknik Informatika';
SELECT * FROM v_mhs_ti;            -- dipakai seperti tabel
CREATE OR REPLACE VIEW v_mhs_ti AS SELECT nim, nama FROM mahasiswa;
DROP VIEW v_mhs_ti;`, ket: [['CREATE INDEX nama ON tabel(kolom)', 'nama index bebas, biasanya diawali idx_.'], ['UNIQUE INDEX', 'index sekaligus larangan dobel.'], ['CREATE VIEW nama AS SELECT ...', 'simpan query dengan nama.'], ['CREATE OR REPLACE VIEW', 'ganti isi view yang sudah ada.']] },
    mysql: ['Di MySQL, DROP INDEX wajib menyebut tabelnya: <code>DROP INDEX idx ON tabel;</code>. Di SQLite cukup <code>DROP INDEX idx;</code>. Playground menerima versi MySQL.'],
    contoh: [
      { sql: 'CREATE INDEX idx_kota ON mahasiswa(kota);\nSHOW INDEX FROM mahasiswa;', ket: 'Index idx_kota untuk kolom kota muncul. Ada juga index otomatis dari primary key nim.' },
      { sql: "CREATE VIEW v_mhs_ti AS\n  SELECT nim, nama, ipk FROM mahasiswa WHERE jurusan = 'Teknik Informatika';\nSELECT * FROM v_mhs_ti;", ket: 'View berisi 6 mahasiswa TI. Dipanggil persis seperti tabel biasa.' },
      { sql: "CREATE VIEW v_matkul_dosen AS\n  SELECT m.kode_mk, m.nama_mk, d.nama AS dosen\n  FROM matakuliah m JOIN dosen d ON m.id_dosen = d.id_dosen;\nSELECT * FROM v_matkul_dosen WHERE dosen LIKE 'Dr.%';", ket: 'View bisa berisi JOIN (Bab 4). Setelah disimpan, query yang memakainya jadi pendek. Hasil: 3 matkul yang diajar dosen bergelar Dr.' }
    ],
    salah: ['Memberi index ke semua kolom. Bikin INSERT/UPDATE lambat dan boros tempat.', 'Mengira view menyimpan salinan data. View selalu mengambil data terbaru dari tabel asli.', 'Membuat view dengan nama yang sama dengan tabel.'],
    latihan: [
      { lv: 'mudah', q: 'Buat index bernama <code>idx_angkatan</code> pada kolom <code>angkatan</code> di tabel mahasiswa.', a: 'CREATE INDEX idx_angkatan ON mahasiswa(angkatan);', check: "SELECT ii.name AS kolom_terindeks FROM pragma_index_list('mahasiswa') il, pragma_index_info(il.name) ii WHERE il.origin = 'c'", h: ['CREATE INDEX nama_index ON tabel(kolom);', 'Nama index: idx_angkatan', 'CREATE INDEX idx_angkatan ON mahasiswa(angkatan);'], ex: 'Pengecek melihat apakah ada index buatanmu di kolom angkatan.' },
      { lv: 'sedang', q: 'Buat view <code>v_ipk_tinggi</code> berisi <code>nim</code>, <code>nama</code>, <code>ipk</code> mahasiswa dengan IPK minimal 3.5.', a: 'CREATE VIEW v_ipk_tinggi AS\n  SELECT nim, nama, ipk FROM mahasiswa WHERE ipk >= 3.5;', check: 'SELECT * FROM v_ipk_tinggi', h: ['CREATE VIEW nama AS SELECT ...', 'Minimal 3.5 = ipk >= 3.5', 'CREATE VIEW v_ipk_tinggi AS SELECT nim, nama, ipk FROM mahasiswa WHERE ipk >= 3.5;'], ex: 'View berisi 4 mahasiswa: Citra, Fitri, Hana, Kartika.' },
      { lv: 'sulit', q: 'Buat view <code>v_matkul_besar</code> berisi <code>kode_mk</code>, <code>nama_mk</code>, <code>sks</code> untuk matkul ber-SKS 3 atau lebih <b>dan</b> sudah punya dosen.', a: 'CREATE VIEW v_matkul_besar AS\n  SELECT kode_mk, nama_mk, sks FROM matakuliah\n  WHERE sks >= 3 AND id_dosen IS NOT NULL;', check: 'SELECT * FROM v_matkul_besar', h: ['Dua syarat digabung pakai AND.', 'Sudah punya dosen = id_dosen IS NOT NULL.', 'WHERE sks >= 3 AND id_dosen IS NOT NULL'], ex: 'Hasilnya 7 matkul. IF302 dan IF303 tersaring karena SKS-nya 2 (dan juga belum punya dosen).' }
    ],
    ringkas: 'Index = halaman indeks buku supaya pencarian cepat, view = query SELECT yang disimpan dengan nama dan dipakai seperti tabel.'
  }
  ]
});
