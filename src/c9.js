/* ===== BAB 8 & 9 (registrasi) ===== */
CH.push({
  id: 'bab8', title: 'Bab 8 · Simulasi Tes', special: 'quiz',
  lead: 'Ujian percobaan 60 menit, campuran semua bab. Kerjakan tanpa melihat materi, lalu lihat bab mana yang masih lemah.'
});

const CS = (judul, code, note) => `<div class="cs"><h4>${judul}</h4><pre>${highlight(code)}</pre>${note ? `<p>${note}</p>` : ''}</div>`;
CH.push({
  id: 'bab9', title: 'Bab 9 · Cheat Sheet', special: 'cheat',
  lead: 'Ringkasan semua sintaks MySQL penting. Baca 10 menit sebelum tes.',
  html: `<div class="runbar noprint"><button class="btn pri" data-act="print">🖨 Print / simpan PDF</button></div>
<div class="cheat">
${CS('Kategori perintah', `DDL : CREATE, ALTER, DROP, TRUNCATE, RENAME
DML : SELECT, INSERT, UPDATE, DELETE
DCL : GRANT, REVOKE
TCL : START TRANSACTION, COMMIT, ROLLBACK, SAVEPOINT`, 'SELECT kadang disebut DQL.')}
${CS('Login & navigasi', `mysql -u root -p          -- di terminal
SHOW DATABASES;
USE kampus;
SHOW TABLES;
DESCRIBE mahasiswa;       -- atau DESC / SHOW COLUMNS FROM
SHOW CREATE TABLE mahasiswa;
SELECT DATABASE(), VERSION();`)}
${CS('Tipe data', `INT, VARCHAR(n), CHAR(n), TEXT
DATE 'YYYY-MM-DD', DATETIME 'YYYY-MM-DD HH:MM:SS'
DECIMAL(p,s)  -- IPK: DECIMAL(3,2), uang: DECIMAL(12,2)
ENUM('a','b'), BOOLEAN (= TINYINT(1))`)}
${CS('CREATE DATABASE / TABLE', `CREATE DATABASE IF NOT EXISTS kampus;
CREATE TABLE krs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(10) NOT NULL,
  kode_mk VARCHAR(10) NOT NULL,
  nilai INT DEFAULT NULL CHECK (nilai BETWEEN 0 AND 100),
  email VARCHAR(100) UNIQUE,
  FOREIGN KEY (nim) REFERENCES mahasiswa(nim)
    ON DELETE CASCADE ON UPDATE CASCADE
);`, 'ON DELETE: CASCADE / SET NULL / RESTRICT / NO ACTION.')}
${CS('ALTER TABLE', `ALTER TABLE t ADD kolom VARCHAR(50) AFTER x;
ALTER TABLE t MODIFY kolom VARCHAR(100) NOT NULL; -- ubah tipe
ALTER TABLE t CHANGE lama baru VARCHAR(100);      -- ubah nama+tipe
ALTER TABLE t RENAME COLUMN lama TO baru;         -- MySQL 8
ALTER TABLE t DROP COLUMN kolom;
ALTER TABLE t RENAME TO t2;  /  RENAME TABLE t TO t2;`)}
${CS('DROP vs TRUNCATE vs DELETE', `DELETE FROM t WHERE ...;  -- DML, pilih baris, bisa rollback
TRUNCATE TABLE t;         -- DDL, kosongkan, reset AUTO_INCREMENT
DROP TABLE IF EXISTS t;   -- DDL, buang tabel + struktur`)}
${CS('INDEX & VIEW', `CREATE INDEX idx_kota ON mahasiswa(kota);
CREATE UNIQUE INDEX idx_email ON akun(email);
DROP INDEX idx_kota ON mahasiswa;
CREATE VIEW v AS SELECT ...;
CREATE OR REPLACE VIEW v AS SELECT ...;
DROP VIEW v;`)}
${CS('INSERT / UPDATE / DELETE', `INSERT INTO t (a, b) VALUES (1, 'x');
INSERT INTO t (a, b) VALUES (1,'x'), (2,'y');
INSERT INTO t2 (a, b) SELECT a, b FROM t WHERE ...;
UPDATE t SET a = 1, b = 'x' WHERE id = 5;   -- WAJIB WHERE
DELETE FROM t WHERE id = 5;                 -- WAJIB WHERE`)}
${CS('SELECT lengkap (urutan tulis)', `SELECT DISTINCT kolom, AGREGAT(x) AS alias
FROM t
JOIN t2 ON ...
WHERE syarat_baris
GROUP BY kolom
HAVING syarat_kelompok
ORDER BY alias DESC, kolom ASC
LIMIT 10 OFFSET 20;    -- atau LIMIT 20, 10`, '<b>Urutan jalan:</b> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Alias SELECT nggak bisa dipakai di WHERE.')}
${CS('Operator WHERE', `=  <>  !=  >  <  >=  <=   AND  OR  NOT  ( )
LIKE 'A%'  '%a'  '%an%'  '_i%'     -- % banyak, _ satu
IN ('a','b')   NOT IN (...)
BETWEEN 3.0 AND 3.5                 -- inklusif
IS NULL   IS NOT NULL               -- JANGAN = NULL`)}
${CS('Agregat', `COUNT(*)  COUNT(kolom)  COUNT(DISTINCT kolom)
SUM()  AVG()  MIN()  MAX()  ROUND(x, 2)`, 'Semua (kecuali COUNT(*)) mengabaikan NULL. WHERE vs HAVING: WHERE saring baris, HAVING saring kelompok (boleh agregat).')}
${CS('CASE & fungsi', `CASE WHEN ipk >= 3.5 THEN 'A'
     WHEN ipk >= 3.0 THEN 'B'
     ELSE 'C' END AS predikat
IF(syarat, a, b)   IFNULL(x, 0)   COALESCE(a, b)
CONCAT(a,' ',b) UPPER() LOWER() LENGTH() CHAR_LENGTH()
SUBSTRING(s,1,3) LEFT(s,2) RIGHT(s,3) TRIM() REPLACE()
NOW() CURDATE() YEAR(d) MONTH(d) DAY(d)
DATEDIFF(a,b) DATE_FORMAT(d,'%d-%m-%Y') FROM_UNIXTIME(n)`)}
${CS('JOIN', `FROM a INNER JOIN b ON a.k = b.k   -- yang berpasangan
FROM a LEFT JOIN b ON a.k = b.k    -- semua a
FROM a RIGHT JOIN b ON a.k = b.k   -- semua b
FROM a CROSS JOIN b                -- semua kombinasi
FROM staf s JOIN staf a ON s.id_atasan = a.id   -- SELF JOIN
-- yang nggak punya pasangan:
FROM a LEFT JOIN b ON a.k = b.k WHERE b.k IS NULL`, 'Syarat untuk tabel kanan LEFT JOIN taruh di ON, bukan WHERE. Dengan LEFT JOIN, pakai COUNT(b.kolom).')}
${CS('FULL OUTER JOIN di MySQL', `SELECT ... FROM a LEFT JOIN b ON a.k = b.k
UNION
SELECT ... FROM a RIGHT JOIN b ON a.k = b.k;`, 'MySQL nggak punya FULL OUTER JOIN. UNION buang dobel, UNION ALL nggak.')}
${CS('Subquery', `WHERE ipk > (SELECT AVG(ipk) FROM mahasiswa)      -- 1 nilai
WHERE nim IN (SELECT nim FROM krs)
WHERE id NOT IN (SELECT x FROM t WHERE x IS NOT NULL) -- awas NULL!
WHERE EXISTS (SELECT 1 FROM krs k WHERE k.nim = m.nim)
WHERE ipk > ALL (SELECT ...)   -- > MAX
WHERE ipk > ANY (SELECT ...)   -- > MIN
FROM (SELECT ... ) AS t        -- derived table WAJIB alias
SELECT (SELECT COUNT(*) FROM krs k WHERE k.nim = m.nim) AS jml`, 'Correlated = subquery menyebut kolom luar, dijalankan ulang per baris.')}
${CS('CTE (MySQL 8.0+)', `WITH a AS (SELECT ...),
     b AS (SELECT ... FROM a)
SELECT * FROM b;

WITH RECURSIVE deret AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM deret WHERE n < 10
)
SELECT * FROM deret;`, 'Hierarki: anchor WHERE id_atasan IS NULL, lalu JOIN cte ON t.id_atasan = cte.id.')}
${CS('Moodle: siapkan database', `CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
CREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'pw';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,CREATE TEMPORARY TABLES,
  DROP,INDEX,ALTER ON moodle.* TO 'moodleuser'@'localhost';
FLUSH PRIVILEGES;`, 'utf8mb4 = 4 byte, mendukung emoji. utf8 (mb3) cuma 3 byte.')}
${CS('Moodle: config.php', `$CFG->dbtype = 'mysqli';   // atau 'mariadb'
$CFG->dbhost = 'localhost';
$CFG->dbname = 'moodle';
$CFG->dbuser = 'moodleuser';
$CFG->dbpass = 'pw';
$CFG->prefix = 'mdl_';
$CFG->wwwroot  = 'http://localhost/moodle';
$CFG->dataroot = '/var/moodledata';  // di luar folder web`)}
${CS('Moodle: tabel & JOIN', `mdl_user u
 JOIN mdl_user_enrolments ue ON ue.userid = u.id
 JOIN mdl_enrol e            ON e.id = ue.enrolid
 JOIN mdl_course c           ON c.id = e.courseid
mdl_role_assignments ra
 JOIN mdl_role r    ON r.id = ra.roleid      -- student, editingteacher
 JOIN mdl_context x ON x.id = ra.contextid AND x.contextlevel = 50
 JOIN mdl_course c  ON c.id = x.instanceid
mdl_grade_items gi JOIN mdl_grade_grades gg ON gg.itemid = gi.id`, 'lastlogin = 0 → belum pernah login. Waktu = Unix timestamp → FROM_UNIXTIME().')}
${CS('Backup & restore', `mysqldump -u root -p moodle > backup.sql
mysqldump -u root -p --single-transaction moodle > backup.sql
mysql -u root -p moodle < backup.sql
mysql> SOURCE backup.sql;`, 'Backup juga folder moodledata dan config.php.')}
${CS('Error yang sering muncul', `No database selected        → lupa USE
Unknown column 'x'          → salah eja / alias di WHERE
Column 'x' is ambiguous     → tulis tabel.kolom
Duplicate entry             → PK/UNIQUE dobel
foreign key constraint fails→ data induk nggak ada / masih dipakai
Subquery returns more than 1 row → pakai IN
Every derived table must have its own alias
Access denied for user      → password/privilege/host`)}
</div>`
});
