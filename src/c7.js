/* ===== BAB 7 MOODLE ===== */
const MOODLE_ARCH = `<div class="flow">
<div class="st"><b>Browser</b><small>mahasiswa, dosen, admin buka moodle.kampus.ac.id</small></div><div class="ar">⇄</div>
<div class="st"><b>Web server</b><small>Apache / Nginx menerima request</small></div><div class="ar">⇄</div>
<div class="st"><b>PHP</b><small>kode Moodle dijalankan, membaca config.php</small></div><div class="ar">⇄</div>
<div class="st"><b>Database MySQL / MariaDB</b><small>tabel mdl_user, mdl_course, nilai, log...</small></div></div>
<div class="flow"><div class="st" style="flex:1"><b>Folder moodledata</b><small>file upload tugas, gambar, cache, session. Di LUAR folder web supaya nggak bisa diunduh langsung lewat URL.</small></div></div>`;

CH.push({
  id: 'bab7', title: 'Bab 7 · Moodle & Database',
  lead: 'Moodle adalah LMS (e-learning) yang menyimpan semua datanya di MySQL/MariaDB. Calon asisten lab biasanya diminta bisa menyiapkan databasenya dan membaca datanya.',
  subs: [
  {
    id: '7.1', t: 'Apa itu Moodle dan arsitekturnya',
    konsep: `<p><b>LMS</b> (Learning Management System) = aplikasi untuk kelas online: course, materi, tugas, kuis, forum, nilai. <b>Moodle</b> adalah LMS open source yang paling banyak dipakai kampus (sering disebut "e-learning" atau "elearning.kampus.ac.id"). Ditulis dengan bahasa <b>PHP</b>.</p>
<div class="analogi">🏫 Moodle seperti <b>gedung sekolah online</b>. PHP = guru dan staf yang bekerja. Database = <b>buku induk</b> sekolah (siapa muridnya, kelas apa saja, nilai berapa). moodledata = <b>gudang</b> tempat menyimpan berkas tugas dan foto.</div>
<p>4 komponen yang wajib ada:</p>
<ol><li><b>Web server</b> (Apache atau Nginx) untuk melayani browser.</li><li><b>PHP</b> untuk menjalankan kode Moodle.</li><li><b>Database</b>: MySQL, MariaDB, atau PostgreSQL. Menyimpan data terstruktur.</li><li><b>moodledata</b>: folder untuk file, di luar folder web.</li></ol>`,
    sintaks: { lang: 'bash', code: `/var/www/html/moodle/      # kode Moodle (PHP), bisa diakses web
   config.php             # pengaturan koneksi database
/var/www/moodledata/       # file upload, cache, session (JANGAN di dalam folder web)
Database MySQL "moodle"    # ratusan tabel berawalan mdl_

# Versi XAMPP di Windows:
C:/xampp/htdocs/moodle/    # kode Moodle
C:/xampp/moodledata/       # data file`, ket: [['htdocs / html', 'folder yang bisa diakses lewat http://localhost/...'], ['moodledata', 'sengaja di luar htdocs.']] },
    contoh: [
      { sql: "SHOW TABLES LIKE 'mdl_%';", ket: 'Tabel-tabel Moodle mini di playground. Moodle asli punya lebih dari 400 tabel, semua berawalan mdl_.' },
      { sql: 'SELECT id, username, firstname, lastname, email FROM mdl_user;', ket: 'Semua akun Moodle. id 1 = guest dan id 2 = admin adalah akun bawaan Moodle.' },
      { sql: 'SELECT * FROM mdl_course;', ket: 'Daftar course. visible = 0 artinya course disembunyikan dari mahasiswa (AI301). Di Moodle asli, course id 1 adalah halaman depan situs, jadi course "beneran" mulai dari id 2.' }
    ],
    viz: MOODLE_ARCH,
    salah: ['Menaruh moodledata di dalam folder web (htdocs). Berbahaya: file bisa diunduh orang lewat URL.', 'Mengira file tugas disimpan di database. Isi filenya di moodledata; database hanya menyimpan info filenya (tabel mdl_files).', 'Mengira Moodle bisa jalan tanpa database. Wajib ada.'],
    latihan: [
      { lv: 'mudah', type: 'mc', q: 'Di mana Moodle menyimpan <b>file</b> tugas yang di-upload mahasiswa?', opsi: ['Di tabel mdl_user', 'Di folder moodledata', 'Di config.php', 'Di folder htdocs/moodle'], benar: 1, h: ['Database untuk data terstruktur, folder khusus untuk file.'], ex: 'File disimpan di moodledata. Database hanya menyimpan metadata-nya.' },
      { lv: 'sedang', type: 'mc', q: 'Moodle ditulis dalam bahasa pemrograman apa?', opsi: ['Java', 'Python', 'PHP', 'C#'], benar: 2, h: ['Sama dengan WordPress dan phpMyAdmin.'], ex: 'Moodle = PHP, makanya butuh web server + PHP.' },
      { lv: 'sulit', q: 'Tampilkan <code>fullname</code> dan <code>shortname</code> semua course yang <b>terlihat</b> oleh mahasiswa (visible = 1).', a: 'SELECT fullname, shortname FROM mdl_course WHERE visible = 1;', h: ['Tabelnya mdl_course.', 'Kolom visible: 1 tampil, 0 tersembunyi.', 'WHERE visible = 1'], ex: '4 course. Kecerdasan Buatan (AI301) disembunyikan.' }
    ],
    ringkas: 'Moodle = LMS berbahasa PHP yang butuh web server, database MySQL/MariaDB untuk data, dan folder moodledata untuk file.'
  },
  {
    id: '7.2', t: 'Menyiapkan database MySQL untuk Moodle',
    konsep: `<p>Sebelum instal Moodle, siapkan <b>database kosong</b> dan <b>user khusus</b> (jangan pakai root). Ini 4 perintah yang wajib hafal:</p>
<div class="analogi">🔐 CREATE DATABASE = bikin lemari baru. CREATE USER = bikin kartu akses untuk petugas bernama moodleuser. GRANT = memberi kartu itu izin membuka lemari moodle saja. FLUSH PRIVILEGES = menyuruh satpam memperbarui daftar izin.</div>
<p><b>Kenapa utf8mb4?</b> Supaya semua karakter Unicode bisa disimpan, termasuk <b>emoji</b> 😀 dan aksara non-Latin (Arab, Jepang, dll). Di MySQL, "utf8" lama (utf8mb3) hanya 3 byte per karakter, sehingga emoji (4 byte) ditolak/rusak. Moodle versi baru mewajibkan utf8mb4. <b>utf8mb4_unicode_ci</b> = aturan urutan/perbandingan berbasis Unicode, <b>ci</b> = case-insensitive (huruf besar = kecil saat dibandingkan).</p>`,
    sintaks: { code: `CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'PasswordKuat123!';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, CREATE TEMPORARY TABLES,
      DROP, INDEX, ALTER ON moodle.* TO 'moodleuser'@'localhost';
FLUSH PRIVILEGES;`, ket: [
      ['CREATE DATABASE moodle', 'buat database bernama moodle.'],
      ['DEFAULT CHARACTER SET utf8mb4', 'semua tabel di dalamnya default memakai utf8mb4.'],
      ['COLLATE utf8mb4_unicode_ci', 'aturan perbandingan dan pengurutan teks.'],
      ["'moodleuser'@'localhost'", 'user moodleuser yang hanya boleh login dari komputer yang sama (localhost). Pakai \'%\' untuk dari mana saja.'],
      ["IDENTIFIED BY '...'", 'password user tersebut.'],
      ['GRANT ... ON moodle.*', 'beri hak akses ke SEMUA tabel (*) di database moodle saja. Daftar hak ini sesuai dokumentasi resmi Moodle; bisa juga disingkat GRANT ALL PRIVILEGES ON moodle.* ...'],
      ['FLUSH PRIVILEGES', 'muat ulang tabel hak akses. Sebenarnya setelah GRANT/CREATE USER sudah otomatis berlaku, tapi baris ini lazim ditulis dan sering ditanyakan.'] ] },
    mysql: ['Perintah user dan hak akses (CREATE USER, GRANT, FLUSH) hanya ada di server MySQL. Playground cuma "mencatat" perintah ini tanpa menjalankannya. Latihan di bagian ini dicek dari tulisan perintahnya.', 'Di MySQL 8, cara lama <code>GRANT ... TO \'u\'@\'localhost\' IDENTIFIED BY \'pw\'</code> sudah dihapus. Buat user dulu dengan CREATE USER, baru GRANT.'],
    contoh: [
      { sql: "CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nCREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'PasswordKuat123!';\nGRANT ALL PRIVILEGES ON moodle.* TO 'moodleuser'@'localhost';\nFLUSH PRIVILEGES;", ket: 'Di MySQL asli, keempat perintah ini menyiapkan database dan user. Di playground muncul pesan simulasi.' },
      { sql: "SHOW GRANTS FOR 'moodleuser'@'localhost';\nREVOKE DROP ON moodle.* FROM 'moodleuser'@'localhost';", ket: 'SHOW GRANTS melihat hak akses user. REVOKE mencabut hak (DCL juga).' },
      { sql: "SELECT '😀 Halo dari utf8mb4' AS teks, LENGTH('😀') AS byte_emoji, CHAR_LENGTH('😀') AS jumlah_karakter;", ket: 'Satu emoji = 1 karakter tapi 4 byte. Inilah kenapa butuh utf8mb4 (maksimal 4 byte), bukan utf8mb3 (maksimal 3 byte).' }
    ],
    salah: ['Pakai <code>utf8</code> biasa (utf8mb3): emoji di forum/nama jadi error "Incorrect string value".', 'Lupa tanda kutip di <code>\'moodleuser\'@\'localhost\'</code>, atau menulis <code>\'moodleuser@localhost\'</code> (satu kutip untuk semua). Harus dua bagian terpisah.', 'Memberi GRANT ke <code>*.*</code> (semua database). Cukup <code>moodle.*</code>.', 'Pakai user root untuk Moodle. Kalau Moodle dibobol, seluruh server ikut terancam.'],
    latihan: [
      { lv: 'mudah', type: 'pattern', q: 'Tulis perintah untuk membuat database <code>moodle</code> dengan character set utf8mb4 dan collation utf8mb4_unicode_ci.', a: 'CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', pats: [['^CREATE DATABASE (IF NOT EXISTS )?' + Q_ + 'moodle' + Q_ + '( |;|$)', 'Diawali CREATE DATABASE moodle.'], ['(CHARACTER SET|CHARSET)\\s*=?\\s*utf8mb4\\b', 'Tambahkan CHARACTER SET utf8mb4.'], ['COLLATE\\s*=?\\s*utf8mb4_unicode_ci', 'Tambahkan COLLATE utf8mb4_unicode_ci.']], h: ['CREATE DATABASE moodle ...', 'DEFAULT CHARACTER SET utf8mb4', 'COLLATE utf8mb4_unicode_ci'], ex: 'Kata DEFAULT boleh ditulis, boleh nggak.' },
      { lv: 'sedang', type: 'pattern', q: "Tulis perintah untuk membuat user <code>moodleuser</code> yang login dari <code>localhost</code> dengan password <code>Rahasia123</code>.", a: "CREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'Rahasia123';", pats: [['^CREATE USER (IF NOT EXISTS )?' + Q_ + 'moodleuser' + Q_ + '@' + Q_ + 'localhost' + Q_, "Format: CREATE USER 'moodleuser'@'localhost'"], ["IDENTIFIED BY ['\"]Rahasia123['\"]", "Tambahkan IDENTIFIED BY 'Rahasia123'."]], h: ["User ditulis 'nama'@'host'.", 'Password lewat IDENTIFIED BY.', "CREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'Rahasia123';"], ex: 'Nama user dan host diberi kutip masing-masing, dipisah @.' },
      { lv: 'sulit', type: 'pattern', q: 'Beri user <code>moodleuser</code>@<code>localhost</code> semua hak akses di database moodle (semua tabelnya), lalu muat ulang hak akses. Dua perintah.', a: "GRANT ALL PRIVILEGES ON moodle.* TO 'moodleuser'@'localhost';\nFLUSH PRIVILEGES;", pats: [['^GRANT ', 'Perintah pertama diawali GRANT.'], ['^GRANT (ALL( PRIVILEGES)?|SELECT\\s*,.*\\bALTER\\b) ', 'Sebutkan hak aksesnya: ALL PRIVILEGES (atau daftar SELECT, INSERT, ..., ALTER).'], ['\\bON ' + Q_ + 'moodle' + Q_ + '\\.\\*', 'Target: ON moodle.* (semua tabel di database moodle).'], ['\\bTO ' + Q_ + 'moodleuser' + Q_ + '@' + Q_ + 'localhost' + Q_, "Penerima: TO 'moodleuser'@'localhost'."], ['FLUSH PRIVILEGES', 'Jangan lupa FLUSH PRIVILEGES.']], h: ['GRANT hak ON database.tabel TO user;', 'Semua tabel di database moodle = moodle.*', 'Perintah kedua: FLUSH PRIVILEGES;'], ex: 'moodle.* artinya semua tabel di database moodle. *.* artinya semua database (terlalu luas).' }
    ],
    ringkas: 'Siapkan Moodle dengan CREATE DATABASE utf8mb4, CREATE USER khusus, GRANT hak ke moodle.*, lalu FLUSH PRIVILEGES.'
  },
  {
    id: '7.3', t: 'Instalasi Moodle singkat, config.php, dan prefix mdl_',
    konsep: `<p><b>Alur instalasi dengan XAMPP (Windows)</b>:</p>
<ol>
<li>Install XAMPP (berisi Apache, MariaDB/MySQL, PHP). Start <b>Apache</b> dan <b>MySQL</b> di XAMPP Control Panel.</li>
<li>Buat database dan user (Bab 7.2) lewat phpMyAdmin (<code>http://localhost/phpmyadmin</code>) atau terminal.</li>
<li>Download Moodle dari moodle.org, ekstrak ke <code>C:/xampp/htdocs/moodle</code>.</li>
<li>Buat folder <code>C:/xampp/moodledata</code> (di luar htdocs).</li>
<li>Di <code>php.ini</code>: set <code>max_input_vars = 5000</code> dan aktifkan ekstensi yang diminta (mysqli, intl, zip, gd, mbstring, xml, curl, soap, sodium). Restart Apache.</li>
<li>Buka <code>http://localhost/moodle</code> → installer: pilih bahasa → cek path (wwwroot, dirroot, dataroot) → pilih driver database (<b>MariaDB</b> atau <b>MySQL improved / mysqli</b>) → isi host, nama database, user, password, <b>prefix mdl_</b>.</li>
<li>Installer membuat file <b>config.php</b>, lalu membuat ratusan tabel. Tunggu sampai selesai.</li>
<li>Buat akun admin dan atur nama situs. Terakhir, jadwalkan <b>cron</b> (admin/cli/cron.php) supaya tugas latar belakang berjalan.</li></ol>
<p><b>LAMP (Linux)</b>: install paket <code>apache2 mysql-server php libapache2-mod-php php-mysql php-intl php-zip php-gd php-mbstring php-xml php-curl</code>, taruh kode di <code>/var/www/html/moodle</code>, moodledata di <code>/var/moodledata</code> dengan pemilik user web server (www-data).</p>
<p><b>Prefix mdl_</b>: semua tabel Moodle diawali <code>mdl_</code> (mdl_user, mdl_course, ...). Gunanya: membedakan tabel Moodle dari tabel aplikasi lain, dan memungkinkan beberapa Moodle berbagi satu database dengan prefix berbeda. Prefix dipilih saat instalasi dan disimpan di config.php.</p>`,
    sintaks: { lang: 'php', code: `<?php  // config.php Moodle
unset($CFG);
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'mysqli';        // driver: 'mysqli' (MySQL) atau 'mariadb'
$CFG->dblibrary = 'native';
$CFG->dbhost    = 'localhost';     // alamat server database
$CFG->dbname    = 'moodle';        // nama database
$CFG->dbuser    = 'moodleuser';    // user database
$CFG->dbpass    = 'PasswordKuat123!';
$CFG->prefix    = 'mdl_';          // awalan nama tabel
$CFG->dboptions = array(
  'dbpersist'   => 0,
  'dbport'      => '',             // kosong = 3306
  'dbsocket'    => '',
  'dbcollation' => 'utf8mb4_unicode_ci',
);

$CFG->wwwroot   = 'http://localhost/moodle';   // alamat web
$CFG->dataroot  = 'C:/xampp/moodledata';       // folder moodledata
$CFG->admin     = 'admin';
$CFG->directorypermissions = 0777;

require_once(__DIR__ . '/lib/setup.php');`, ket: [['$CFG->dbtype', "jenis driver database: 'mysqli', 'mariadb', 'pgsql'."], ['$CFG->dbhost', "lokasi server MySQL, biasanya 'localhost'."], ['$CFG->dbname / dbuser / dbpass', 'harus sama persis dengan yang dibuat di Bab 7.2.'], ['$CFG->prefix', "awalan tabel, default 'mdl_'."], ['$CFG->wwwroot', 'URL Moodle.'], ['$CFG->dataroot', 'path folder moodledata.']] },
    contoh: [
      { sql: "SHOW TABLES LIKE 'mdl_%';", ket: 'Semua tabel dengan prefix mdl_. Kalau prefix di config.php salah (misal mdl2_), Moodle mencari tabel mdl2_user yang nggak ada.' },
      { sql: 'SELECT * FROM mdl_course_categories;', ket: 'Kategori course. Kolom parent menunjuk kategori induk (0 = paling atas): Teknik Informatika dan Sistem Informasi ada di bawah Fakultas Teknik.' }
    ],
    salah: ['dbpass di config.php beda dengan password user MySQL: "Database connection failed".', "dbtype salah (misal 'mysql' tanpa i). Pilihan yang benar 'mysqli' atau 'mariadb'.", 'Lupa membuat folder moodledata atau izin tulisnya kurang.', 'Mengganti prefix di config.php setelah instalasi tanpa me-rename tabel.'],
    latihan: [
      { lv: 'mudah', type: 'mc', q: 'Apa fungsi <code>$CFG->prefix = \'mdl_\'</code> di config.php?', opsi: ['Nama database Moodle', 'Awalan semua nama tabel Moodle', 'Password admin', 'Nama folder moodledata'], benar: 1, h: ['Lihat nama-nama tabel: mdl_user, mdl_course...'], ex: 'Prefix = awalan nama tabel. Nama database ada di $CFG->dbname.' },
      { lv: 'sedang', type: 'pattern', q: "Tulis baris config.php yang mengatur nama database menjadi <code>moodle_lab</code>.", a: "$CFG->dbname = 'moodle_lab';", pats: [['^\\$CFG->dbname\\s*=', 'Diawali $CFG->dbname ='], ["=\\s*['\"]moodle_lab['\"]", "Nilainya 'moodle_lab' dalam kutip."], [";\\s*$", 'Baris PHP diakhiri titik koma.']], h: ['Formatnya $CFG->nama_setting = nilai;', 'Setting nama database: dbname', "$CFG->dbname = 'moodle_lab';"], ex: 'Teks di PHP diapit kutip, dan setiap baris diakhiri titik koma.' },
      { lv: 'sulit', type: 'mc', q: 'Admin mengganti password user database <code>moodleuser</code> di MySQL. Besoknya Moodle error "Database connection failed". Apa yang harus diperbaiki?', opsi: ['Menghapus folder moodledata', 'Mengubah $CFG->dbpass di config.php sesuai password baru', 'Mengganti $CFG->prefix', 'Menjalankan TRUNCATE di semua tabel'], benar: 1, h: ['Moodle login ke MySQL memakai data di config.php.'], ex: 'Moodle memakai dbuser dan dbpass dari config.php. Kalau password di MySQL berubah, config.php harus ikut diubah.' }
    ],
    ringkas: 'Instal Moodle = siapkan web server + PHP + database, ekstrak kode, buat moodledata, jalankan installer yang menulis koneksi database ke config.php dengan prefix tabel mdl_.'
  },
  {
    id: '7.4', t: 'Tabel-tabel penting Moodle',
    konsep: `<table class="cmp"><tr><th>Tabel</th><th>Isinya</th><th>Kolom penting</th></tr>
<tr><td>mdl_user</td><td>semua akun</td><td>id, username, firstname, lastname, email, lastlogin, deleted, suspended</td></tr>
<tr><td>mdl_course_categories</td><td>kategori course (bisa bertingkat)</td><td>id, name, parent</td></tr>
<tr><td>mdl_course</td><td>course / mata kuliah online</td><td>id, category, fullname, shortname, visible</td></tr>
<tr><td>mdl_enrol</td><td><b>metode</b> pendaftaran per course (manual, self, guest, cohort)</td><td>id, enrol, courseid, status</td></tr>
<tr><td>mdl_user_enrolments</td><td>user mana terdaftar lewat metode mana</td><td>id, enrolid, userid, status, timestart</td></tr>
<tr><td>mdl_role</td><td>daftar peran</td><td>id, shortname (manager, editingteacher, teacher, student, guest)</td></tr>
<tr><td>mdl_context</td><td>"tempat" berlakunya peran</td><td>id, contextlevel (10 sistem, 40 kategori, 50 course, 70 modul), instanceid</td></tr>
<tr><td>mdl_role_assignments</td><td>user X punya peran Y di konteks Z</td><td>id, roleid, contextid, userid</td></tr>
<tr><td>mdl_grade_items</td><td>komponen nilai (kuis, tugas, total course)</td><td>id, courseid, itemname, itemtype ('course' = nilai akhir)</td></tr>
<tr><td>mdl_grade_grades</td><td>nilai tiap user per komponen</td><td>id, itemid, userid, finalgrade</td></tr></table>
<div class="analogi">🎟️ Pendaftaran Moodle itu dua langkah: <b>mdl_enrol</b> = "pintu masuk" course (pintu manual oleh admin, pintu self-enrol pakai kunci). <b>mdl_user_enrolments</b> = catatan "si A masuk lewat pintu nomor sekian". Jadi rantainya: user → user_enrolments → enrol → course.</div>
<p><b>Peran (role)</b> terpisah dari pendaftaran: <code>mdl_role_assignments</code> menyimpan "user 3 adalah editingteacher di context 10", dan <code>mdl_context</code> dengan contextlevel 50 dan instanceid 2 artinya "context 10 = course id 2".</p>
<p><b>Waktu</b> di Moodle disimpan sebagai <b>Unix timestamp</b> (jumlah detik sejak 1 Januari 1970). <code>lastlogin = 0</code> artinya <b>belum pernah login</b>. Ubah jadi tanggal dengan <code>FROM_UNIXTIME(lastlogin)</code>.</p>
<p class="tip">Catatan: tabel di playground adalah versi mini (kolom disederhanakan). Moodle asli punya kolom jauh lebih banyak, tapi nama tabel dan kolom kuncinya sama.</p>`,
    sintaks: { code: `-- rantai pendaftaran
FROM mdl_user u
JOIN mdl_user_enrolments ue ON ue.userid = u.id
JOIN mdl_enrol e            ON e.id = ue.enrolid
JOIN mdl_course c           ON c.id = e.courseid

-- rantai peran
FROM mdl_role_assignments ra
JOIN mdl_role r    ON r.id = ra.roleid
JOIN mdl_context x ON x.id = ra.contextid AND x.contextlevel = 50
JOIN mdl_course c  ON c.id = x.instanceid`, ket: [['ue.enrolid = e.id', 'user_enrolments terhubung ke enrol, BUKAN langsung ke course.'], ['contextlevel = 50', 'konteks tingkat course.']] },
    contoh: [
      { sql: 'SELECT id, username, lastlogin, FROM_UNIXTIME(lastlogin) AS terakhir_login\nFROM mdl_user\nWHERE lastlogin > 0;', ket: 'Hanya user yang pernah login. FROM_UNIXTIME mengubah angka detik jadi tanggal yang bisa dibaca (mengikuti zona waktu komputer kamu).' },
      { sql: 'SELECT x.id AS contextid, x.contextlevel, x.instanceid AS courseid, c.fullname\nFROM mdl_context x\nJOIN mdl_course c ON c.id = x.instanceid\nWHERE x.contextlevel = 50;', ket: 'Setiap course punya satu context berlevel 50. Context 10 = Basis Data, 11 = Pemrograman Web, dst.' },
      { sql: 'SELECT c.shortname, c.fullname, cc.name AS kategori\nFROM mdl_course c\nJOIN mdl_course_categories cc ON c.category = cc.id;', ket: 'Course beserta nama kategorinya.' }
    ],
    viz: { type: 'erd', which: 'moodle' },
    salah: ['JOIN mdl_user_enrolments langsung ke mdl_course (<code>ue.enrolid = c.id</code>). Salah! Harus lewat mdl_enrol.', 'Lupa filter contextlevel = 50, sehingga instanceid tercampur dengan id kategori/modul.', 'Membandingkan lastlogin dengan tanggal teks. lastlogin itu angka detik.', 'Mengira user yang dihapus benar-benar hilang. Moodle hanya menandai <code>deleted = 1</code>.'],
    latihan: [
      { lv: 'mudah', q: 'Tampilkan <code>username</code> user yang <b>belum pernah login</b>, kecuali user guest.', a: "SELECT username FROM mdl_user WHERE lastlogin = 0 AND username <> 'guest';", h: ['Belum pernah login = lastlogin = 0.', "Kecualikan username 'guest'.", "WHERE lastlogin = 0 AND username <> 'guest'"], ex: 'hana, indra, joko.' },
      { lv: 'sedang', q: 'Tampilkan <code>fullname</code> setiap course dan nama kategorinya (kolom <code>kategori</code>).', a: 'SELECT c.fullname, cc.name AS kategori\nFROM mdl_course c\nJOIN mdl_course_categories cc ON c.category = cc.id;', h: ['JOIN mdl_course dengan mdl_course_categories.', 'ON c.category = cc.id', 'Kolom nama kategori: cc.name'], ex: '5 course.' },
      { lv: 'sulit', q: 'Dari mdl_enrol, tampilkan setiap metode pendaftaran (<code>enrol</code>) dan berapa course yang memakainya (kolom <code>jumlah</code>).', a: 'SELECT enrol, COUNT(*) AS jumlah FROM mdl_enrol GROUP BY enrol;', h: ['Kelompokkan per kolom enrol.', 'COUNT(*)', 'SELECT enrol, COUNT(*) FROM mdl_enrol GROUP BY enrol;'], ex: 'manual 5, self 1. Hanya course Basis Data yang membuka self-enrol.' }
    ],
    ringkas: 'Pendaftaran Moodle = user → user_enrolments → enrol → course, peran = role_assignments + role + context (level 50 = course), dan nilai ada di grade_items + grade_grades.'
  },
  {
    id: '7.5', t: 'Latihan query nyata di database Moodle',
    konsep: `<p>Ini jenis pertanyaan yang biasa diminta dosen/admin ke asisten lab: "Siapa saja peserta course X?", "Berapa peserta tiap course?", "Siapa yang belum pernah login?", "Rata-rata nilai akhir per course?". Semua memakai JOIN, subquery, dan CTE dari bab sebelumnya.</p>`,
    sintaks: { code: `-- Peserta suatu course
SELECT u.username, u.firstname, u.lastname
FROM mdl_user u
JOIN mdl_user_enrolments ue ON ue.userid = u.id
JOIN mdl_enrol e ON e.id = ue.enrolid
JOIN mdl_course c ON c.id = e.courseid
WHERE c.shortname = 'BD101';`, ket: [['c.shortname', 'kode singkat course, unik.']] },
    contoh: [
      { sql: "SELECT u.username, CONCAT(u.firstname, ' ', u.lastname) AS nama_lengkap, e.enrol AS lewat\nFROM mdl_user u\nJOIN mdl_user_enrolments ue ON ue.userid = u.id\nJOIN mdl_enrol e ON e.id = ue.enrolid\nJOIN mdl_course c ON c.id = e.courseid\nWHERE c.shortname = 'BD101';", ket: '7 peserta Basis Data. gilang masuk lewat self-enrol, sisanya manual. Dosennya (budi.dosen) juga ter-enrol, karena di Moodle dosen pun harus terdaftar di course.' },
      { sql: 'SELECT c.fullname, COUNT(ue.id) AS jumlah_peserta\nFROM mdl_course c\nLEFT JOIN mdl_enrol e ON e.courseid = c.id\nLEFT JOIN mdl_user_enrolments ue ON ue.enrolid = e.id\nGROUP BY c.id, c.fullname\nORDER BY jumlah_peserta DESC;', ket: 'LEFT JOIN supaya course tanpa peserta (Kecerdasan Buatan) tetap muncul dengan 0. COUNT(ue.id), bukan COUNT(*).' },
      { sql: "SELECT c.shortname, u.username, r.shortname AS peran\nFROM mdl_role_assignments ra\nJOIN mdl_role r ON r.id = ra.roleid\nJOIN mdl_context x ON x.id = ra.contextid AND x.contextlevel = 50\nJOIN mdl_course c ON c.id = x.instanceid\nJOIN mdl_user u ON u.id = ra.userid\nWHERE r.shortname = 'editingteacher';", ket: 'Dosen (role editingteacher) di tiap course lewat rantai peran.' },
      { sql: "WITH nilai_akhir AS (\n  SELECT gi.courseid, gg.userid, gg.finalgrade\n  FROM mdl_grade_grades gg\n  JOIN mdl_grade_items gi ON gi.id = gg.itemid\n  WHERE gi.itemtype = 'course'\n)\nSELECT c.fullname, COUNT(na.finalgrade) AS sudah_dinilai, ROUND(AVG(na.finalgrade), 2) AS rata\nFROM nilai_akhir na JOIN mdl_course c ON c.id = na.courseid\nGROUP BY c.id, c.fullname;", ket: 'CTE mengambil nilai akhir course (itemtype = \'course\'), lalu dirata-rata. Nilai NULL (belum dinilai) nggak ikut dihitung.' }
    ],
    salah: ['Menghitung peserta pakai COUNT(*) dengan LEFT JOIN (course kosong jadi 1).', 'Lupa bahwa satu user bisa terdaftar lewat dua metode (manual dan self) di course yang sama sehingga terhitung dua kali. Pakai COUNT(DISTINCT ue.userid) kalau perlu.', 'Mencari dosen dari mdl_user_enrolments. Enrol nggak menyimpan peran; peran ada di mdl_role_assignments.'],
    latihan: [
      { lv: 'mudah', q: "Tampilkan <code>username</code> dan nama lengkap (kolom <code>nama</code>, gabungan firstname + spasi + lastname) semua peserta course dengan shortname <code>'PW102'</code>.", a: "SELECT u.username, CONCAT(u.firstname, ' ', u.lastname) AS nama\nFROM mdl_user u\nJOIN mdl_user_enrolments ue ON ue.userid = u.id\nJOIN mdl_enrol e ON e.id = ue.enrolid\nJOIN mdl_course c ON c.id = e.courseid\nWHERE c.shortname = 'PW102';", h: ['Rantai: user → user_enrolments → enrol → course.', "CONCAT(u.firstname, ' ', u.lastname)", "WHERE c.shortname = 'PW102'"], ex: 'siti.dosen, andi, fitri, hana.' },
      { lv: 'sedang', q: 'Tampilkan <code>fullname</code> setiap course dan jumlah pesertanya (kolom <code>jumlah</code>), <b>termasuk</b> course yang belum punya peserta.', a: 'SELECT c.fullname, COUNT(ue.id) AS jumlah\nFROM mdl_course c\nLEFT JOIN mdl_enrol e ON e.courseid = c.id\nLEFT JOIN mdl_user_enrolments ue ON ue.enrolid = e.id\nGROUP BY c.id, c.fullname;', h: ['Termasuk yang kosong = LEFT JOIN dari mdl_course.', 'Dua LEFT JOIN: ke enrol lalu ke user_enrolments.', 'COUNT(ue.id), bukan COUNT(*).'], ex: 'Basis Data 7, Pemrograman Web 4, Analisis Sistem 4, Bahasa Inggris 3, Kecerdasan Buatan 0.' },
      { lv: 'sedang', q: "Tampilkan <code>username</code> user yang <b>nggak terdaftar</b> di course mana pun, selain 'guest' dan 'admin'.", a: "SELECT username FROM mdl_user u\nWHERE NOT EXISTS (SELECT 1 FROM mdl_user_enrolments ue WHERE ue.userid = u.id)\n  AND username NOT IN ('guest', 'admin');", h: ['Nggak punya pasangan di mdl_user_enrolments.', 'NOT EXISTS atau LEFT JOIN ... IS NULL.', "AND username NOT IN ('guest','admin')"], ex: 'Hanya joko.' },
      { lv: 'sulit', q: "Tampilkan <code>username</code> dan <code>shortname</code> course untuk semua user ber-peran <b>student</b> yang <b>belum pernah login</b>.", a: "SELECT u.username, c.shortname\nFROM mdl_role_assignments ra\nJOIN mdl_role r ON r.id = ra.roleid\nJOIN mdl_context x ON x.id = ra.contextid AND x.contextlevel = 50\nJOIN mdl_course c ON c.id = x.instanceid\nJOIN mdl_user u ON u.id = ra.userid\nWHERE r.shortname = 'student' AND u.lastlogin = 0;", h: ['Peran ada di mdl_role_assignments + mdl_role.', 'Context level 50 menghubungkan ke course lewat instanceid.', "WHERE r.shortname = 'student' AND u.lastlogin = 0"], ex: 'hana (PW102) dan indra (AS201). Mereka sudah didaftarkan tapi belum pernah membuka Moodle.' },
      { lv: 'sulit', q: "Pakai CTE: hitung rata-rata nilai akhir course (grade item dengan itemtype 'course', abaikan NULL). Tampilkan <code>fullname</code> course dan rata-ratanya (kolom <code>rata</code>).", a: "WITH nilai_akhir AS (\n  SELECT gi.courseid, gg.finalgrade\n  FROM mdl_grade_grades gg\n  JOIN mdl_grade_items gi ON gi.id = gg.itemid\n  WHERE gi.itemtype = 'course'\n)\nSELECT c.fullname, AVG(na.finalgrade) AS rata\nFROM nilai_akhir na\nJOIN mdl_course c ON c.id = na.courseid\nGROUP BY c.id, c.fullname;", h: ["CTE: grade_grades JOIN grade_items WHERE itemtype = 'course'.", 'Query utama: JOIN ke mdl_course, GROUP BY course.', 'AVG otomatis mengabaikan NULL.'], ex: 'Basis Data 79.9, Pemrograman Web 84, Analisis Sistem 75.' },
      { lv: 'sulit', q: "Tampilkan <code>fullname</code> course dan <code>firstname</code> dosennya (role 'editingteacher').", a: "SELECT c.fullname, u.firstname\nFROM mdl_role_assignments ra\nJOIN mdl_role r ON r.id = ra.roleid\nJOIN mdl_context x ON x.id = ra.contextid AND x.contextlevel = 50\nJOIN mdl_course c ON c.id = x.instanceid\nJOIN mdl_user u ON u.id = ra.userid\nWHERE r.shortname = 'editingteacher';", h: ['Sama seperti contoh 3.', "Saring r.shortname = 'editingteacher'.", 'Ambil c.fullname dan u.firstname.'], ex: 'Basis Data: Budi, Pemrograman Web: Siti, Analisis Sistem: Budi.' }
    ],
    ringkas: 'Query Moodle sehari-hari = JOIN rantai enrol untuk peserta, rantai role_assignments + context untuk peran, dan grade_items + grade_grades untuk nilai.'
  },
  {
    id: '7.6', t: 'Masalah umum & backup/restore dengan mysqldump',
    konsep: `<table class="cmp"><tr><th>Gejala</th><th>Penyebab umum</th><th>Solusi</th></tr>
<tr><td>"Database connection failed" / Error reading from database</td><td>Service MySQL mati; dbhost/dbname/dbuser/dbpass di config.php salah; port bentrok</td><td>Start MySQL di XAMPP; cocokkan config.php; cek port 3306</td></tr>
<tr><td>"Access denied for user 'moodleuser'@'localhost'"</td><td>Password salah, user belum dibuat, atau host beda (localhost vs 127.0.0.1 vs %)</td><td>CREATE USER / ALTER USER ... IDENTIFIED BY, cek host user</td></tr>
<tr><td>"... command denied to user" (misal CREATE/ALTER denied saat upgrade)</td><td>Privilege kurang</td><td>GRANT hak yang kurang (CREATE, ALTER, INDEX, DROP) ON moodle.*</td></tr>
<tr><td>Peringatan charset / "Incorrect string value" saat ada emoji</td><td>Database/tabel masih utf8 (mb3) atau latin1</td><td>Ubah ke utf8mb4: <code>ALTER DATABASE moodle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;</code> lalu jalankan <code>php admin/cli/mysql_collation.php --collation=utf8mb4_unicode_ci</code></td></tr>
<tr><td>"Table 'moodle.mdl_config' doesn't exist"</td><td>Prefix salah atau database belum terinstal/terisi</td><td>Cek $CFG->prefix dan $CFG->dbname</td></tr>
<tr><td>Installer menolak "max_input_vars"</td><td>Setting PHP</td><td>Set max_input_vars = 5000 di php.ini, restart Apache</td></tr></table>
<p><b>Backup</b> Moodle = backup <b>database</b> + backup folder <b>moodledata</b> (+ config.php). Database dibackup dengan <b>mysqldump</b>, program terminal yang menulis seluruh isi database jadi file .sql berisi perintah CREATE TABLE dan INSERT.</p>
<div class="analogi">📸 mysqldump = <b>memfotokopi seluruh lemari arsip</b> jadi satu bundel. Restore = memasukkan kembali isi bundel itu ke lemari kosong.</div>`,
    sintaks: { lang: 'bash', code: `# Backup (dijalankan di terminal, BUKAN di dalam mysql>)
mysqldump -u root -p moodle > backup_moodle.sql
mysqldump -u root -p --single-transaction moodle > backup_moodle.sql   # aman untuk InnoDB tanpa mengunci tabel
mysqldump -u root -p --all-databases > semua.sql

# Restore: buat database kosong dulu, lalu
mysql -u root -p -e "CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mysql -u root -p moodle < backup_moodle.sql

# Atau dari dalam mysql>
# USE moodle;
# SOURCE backup_moodle.sql;

# Saran: aktifkan maintenance mode dulu supaya data nggak berubah saat backup
php admin/cli/maintenance.php --enable`, ket: [['>', 'arah output: tulis hasil ke file (backup).'], ['<', 'arah input: baca file ke mysql (restore).'], ['--single-transaction', 'snapshot konsisten tanpa mengunci tabel InnoDB.'], ['SOURCE file.sql', 'cara restore dari dalam prompt mysql>.']] },
    contoh: [
      { sql: "SELECT DATABASE() AS database_aktif, VERSION() AS versi;\nSHOW TABLES LIKE 'mdl_user%';", ket: 'Saat troubleshooting, cek dulu kamu sedang di database mana dan versi MySQL-nya (CTE butuh 8.0).' },
      { sql: "SHOW GRANTS FOR 'moodleuser'@'localhost';\nALTER USER 'moodleuser'@'localhost' IDENTIFIED BY 'PasswordBaru!';", ket: 'Cek dan perbaiki hak akses/password. Setelah ALTER USER, jangan lupa ubah $CFG->dbpass di config.php.' }
    ],
    salah: ['Menjalankan mysqldump di dalam prompt <code>mysql&gt;</code>. mysqldump adalah program terpisah, dijalankan di terminal biasa.', 'Tanda panah terbalik: <code>mysqldump ... &lt; file.sql</code>. Backup pakai &gt;, restore pakai &lt;.', 'Restore ke database yang belum dibuat (error "Unknown database").', 'Hanya backup database tanpa moodledata. File tugas dan gambar akan hilang.'],
    latihan: [
      { lv: 'mudah', type: 'pattern', q: 'Tulis perintah terminal untuk mem-backup database <code>moodle</code> ke file <code>backup.sql</code> memakai user root (diminta password).', a: 'mysqldump -u root -p moodle > backup.sql', pats: [['^mysqldump\\b', 'Programnya mysqldump.'], ['-u\\s*root\\b', 'User: -u root'], ['(^|\\s)-p(\\s|$)', 'Tambahkan -p supaya diminta password.'], ['\\bmoodle\\s*>\\s*backup\\.sql', 'Akhiri dengan: moodle > backup.sql']], h: ['Program backup MySQL: mysqldump.', 'Formatnya: mysqldump -u user -p nama_db > file.sql', 'mysqldump -u root -p moodle > backup.sql'], ex: 'Tanda > mengalirkan hasil dump ke file.' },
      { lv: 'sedang', type: 'pattern', q: 'Tulis perintah terminal untuk me-restore file <code>backup.sql</code> ke database <code>moodle</code> (sudah dibuat) memakai user root.', a: 'mysql -u root -p moodle < backup.sql', pats: [['^mysql\\b', 'Restore memakai program mysql (bukan mysqldump).'], ['-u\\s*root\\b', 'User: -u root'], ['(^|\\s)-p(\\s|$)', 'Tambahkan -p.'], ['\\bmoodle\\s*<\\s*backup\\.sql', 'Akhiri dengan: moodle < backup.sql']], h: ['Restore pakai program mysql.', 'Tanda panahnya kebalikan backup.', 'mysql -u root -p moodle < backup.sql'], ex: 'Tanda < memasukkan isi file sebagai input ke mysql.' },
      { lv: 'sulit', type: 'mc', q: "Moodle menampilkan error: <code>Access denied for user 'moodleuser'@'localhost' (using password: YES)</code>. Penyebab paling mungkin?", opsi: ['Folder moodledata penuh', 'Password di config.php salah, atau user moodleuser@localhost belum dibuat/diberi hak', 'Prefix tabel salah', 'Character set belum utf8mb4'], benar: 1, h: ['"Access denied" = MySQL menolak login.'], ex: 'MySQL menolak login user tersebut. Cek dbpass di config.php, keberadaan user, dan host-nya.' },
      { lv: 'sulit', type: 'mc', q: 'Kenapa database Moodle sebaiknya memakai <code>utf8mb4</code>, bukan <code>utf8</code>?', opsi: ['Supaya lebih cepat', 'Karena utf8 di MySQL hanya 3 byte per karakter sehingga emoji dan sebagian karakter nggak bisa disimpan', 'Karena utf8 nggak mendukung huruf Latin', 'Karena utf8mb4 lebih hemat tempat'], benar: 1, h: ['Emoji butuh 4 byte.'], ex: 'utf8 di MySQL = utf8mb3 (maks 3 byte). utf8mb4 mendukung semua karakter Unicode termasuk emoji.' }
    ],
    ringkas: 'Masalah Moodle-database biasanya soal koneksi (config.php), privilege, charset, atau prefix, dan backup/restore dilakukan dengan mysqldump > file.sql dan mysql < file.sql plus salinan moodledata.'
  }
  ]
});
