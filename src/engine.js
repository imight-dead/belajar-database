/* ===== ENGINE: database contoh, penerjemah MySQL -> SQLite, runner, pengecek ===== */
const SEED_SQL = `
CREATE TABLE dosen (
  id_dosen INTEGER PRIMARY KEY,
  nama VARCHAR(60) NOT NULL,
  keahlian VARCHAR(60)
);
INSERT INTO dosen VALUES
(1,'Dr. Budi Santoso','Basis Data'),
(2,'Dr. Siti Rahmawati','Pemrograman Web'),
(3,'Ir. Ahmad Fauzi','Jaringan Komputer'),
(4,'Dewi Lestari, M.Kom','Kecerdasan Buatan'),
(5,'Rudi Hartono, M.T.','Sistem Operasi'),
(6,'Nur Aini, M.Kom','Statistika'),
(7,'Hendra Wijaya, M.Sc','Keamanan Siber'),
(8,'Maya Sari, M.Kom','Interaksi Manusia Komputer'),
(9,'Agus Pratama, M.Kom','Basis Data');

CREATE TABLE mahasiswa (
  nim VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(60) NOT NULL,
  jurusan VARCHAR(40) NOT NULL,
  angkatan INTEGER NOT NULL,
  kota VARCHAR(30),
  ipk DECIMAL(3,2)
);
INSERT INTO mahasiswa VALUES
('2101001','Andi Pratama','Teknik Informatika',2021,'Jakarta',3.45),
('2101002','Budi Setiawan','Teknik Informatika',2021,'Bandung',2.90),
('2101003','Citra Lestari','Sistem Informasi',2021,'Surabaya',3.78),
('2201004','Dian Permata','Sistem Informasi',2022,'Jakarta',3.12),
('2201005','Eko Saputra','Teknik Komputer',2022,'Yogyakarta',2.65),
('2201006','Fitri Handayani','Teknik Informatika',2022,'Medan',3.90),
('2201007','Gilang Ramadhan','Teknik Komputer',2022,'Bandung',3.05),
('2301008','Hana Safitri','Sistem Informasi',2023,'Semarang',3.55),
('2301009','Indra Kusuma','Teknik Informatika',2023,'Jakarta',2.40),
('2301010','Joko Susilo','Teknik Komputer',2023,'Surabaya',3.20),
('2301011','Kartika Sari','Teknik Informatika',2023,'Yogyakarta',3.65),
('2301014','Nanda Putri','Teknik Komputer',2023,'Jakarta',2.95),
('2401012','Lukman Hakim','Sistem Informasi',2024,'Medan',NULL),
('2401013','Mira Anggraini','Teknik Informatika',2024,'Bandung',NULL);

CREATE TABLE matakuliah (
  kode_mk VARCHAR(10) PRIMARY KEY,
  nama_mk VARCHAR(60) NOT NULL,
  sks INTEGER NOT NULL,
  id_dosen INTEGER REFERENCES dosen(id_dosen)
);
INSERT INTO matakuliah VALUES
('IF101','Basis Data',3,1),
('IF102','Algoritma dan Pemrograman',4,2),
('IF103','Pemrograman Web',3,2),
('IF201','Jaringan Komputer',3,3),
('IF202','Kecerdasan Buatan',3,4),
('IF203','Sistem Operasi',3,5),
('IF204','Statistika',2,6),
('IF301','Basis Data Lanjut',3,9),
('IF302','Etika Profesi',2,NULL),
('IF303','Kewirausahaan',2,NULL);

CREATE TABLE krs (
  id INTEGER PRIMARY KEY,
  nim VARCHAR(10) NOT NULL REFERENCES mahasiswa(nim),
  kode_mk VARCHAR(10) NOT NULL REFERENCES matakuliah(kode_mk),
  semester INTEGER NOT NULL,
  nilai INTEGER
);
INSERT INTO krs VALUES
(1,'2101001','IF101',3,85),
(2,'2101001','IF102',1,78),
(3,'2101001','IF201',3,90),
(4,'2101002','IF101',3,65),
(5,'2101002','IF102',1,55),
(6,'2101003','IF101',3,92),
(7,'2101003','IF204',3,88),
(8,'2201004','IF103',2,75),
(9,'2201005','IF201',2,60),
(10,'2201006','IF101',3,95),
(11,'2201006','IF202',3,NULL),
(12,'2201007','IF203',2,70),
(13,'2301008','IF102',1,82),
(14,'2301009','IF102',1,NULL),
(15,'2301010','IF103',1,72);

CREATE TABLE staf (
  id INTEGER PRIMARY KEY,
  nama VARCHAR(60) NOT NULL,
  jabatan VARCHAR(60),
  id_atasan INTEGER REFERENCES staf(id)
);
INSERT INTO staf VALUES
(1,'Prof. Rina Wulandari','Dekan',NULL),
(2,'Dr. Budi Santoso','Kaprodi Informatika',1),
(3,'Dr. Siti Rahmawati','Kaprodi Sistem Informasi',1),
(4,'Agus Pratama, M.Kom','Kepala Lab Basis Data',2),
(5,'Dewi Lestari, M.Kom','Kepala Lab AI',2),
(6,'Rizky Maulana','Asisten Lab Basis Data',4),
(7,'Putri Ayu','Asisten Lab Basis Data',4),
(8,'Fajar Nugroho','Asisten Lab AI',5),
(9,'Laras Wening','Staf Administrasi SI',3);

CREATE TABLE mdl_user (
  id INTEGER PRIMARY KEY, username VARCHAR(100), firstname VARCHAR(100), lastname VARCHAR(100),
  email VARCHAR(100), lastlogin INTEGER DEFAULT 0, deleted INTEGER DEFAULT 0, suspended INTEGER DEFAULT 0
);
INSERT INTO mdl_user VALUES
(1,'guest','Guest user',' ','root@localhost',0,0,0),
(2,'admin','Admin','Kampus','admin@kampus.ac.id',1794800000,0,0),
(3,'budi.dosen','Budi','Santoso','budi@kampus.ac.id',1794700000,0,0),
(4,'siti.dosen','Siti','Rahmawati','siti@kampus.ac.id',1794200000,0,0),
(5,'andi','Andi','Pratama','andi@student.kampus.ac.id',1794750000,0,0),
(6,'citra','Citra','Lestari','citra@student.kampus.ac.id',1794600000,0,0),
(7,'dian','Dian','Permata','dian@student.kampus.ac.id',1792300000,0,0),
(8,'eko','Eko','Saputra','eko@student.kampus.ac.id',1789300000,0,0),
(9,'fitri','Fitri','Handayani','fitri@student.kampus.ac.id',1794500000,0,0),
(10,'gilang','Gilang','Ramadhan','gilang@student.kampus.ac.id',1793300000,0,0),
(11,'hana','Hana','Safitri','hana@student.kampus.ac.id',0,0,0),
(12,'indra','Indra','Kusuma','indra@student.kampus.ac.id',0,0,0),
(13,'joko','Joko','Susilo','joko@student.kampus.ac.id',0,0,0),
(14,'kartika','Kartika','Sari','kartika@student.kampus.ac.id',1779300000,0,1);

CREATE TABLE mdl_course_categories (id INTEGER PRIMARY KEY, name VARCHAR(255), parent INTEGER DEFAULT 0);
INSERT INTO mdl_course_categories VALUES
(1,'Fakultas Teknik',0),(2,'Teknik Informatika',1),(3,'Sistem Informasi',1),(4,'Umum',0);

CREATE TABLE mdl_course (id INTEGER PRIMARY KEY, category INTEGER, fullname VARCHAR(254), shortname VARCHAR(255), visible INTEGER DEFAULT 1);
INSERT INTO mdl_course VALUES
(2,2,'Basis Data','BD101',1),
(3,2,'Pemrograman Web','PW102',1),
(4,3,'Analisis Sistem','AS201',1),
(5,4,'Bahasa Inggris','ENG01',1),
(6,2,'Kecerdasan Buatan','AI301',0);

CREATE TABLE mdl_enrol (id INTEGER PRIMARY KEY, enrol VARCHAR(20), courseid INTEGER, status INTEGER DEFAULT 0);
INSERT INTO mdl_enrol VALUES
(1,'manual',2,0),(2,'self',2,0),(3,'manual',3,0),(4,'manual',4,0),(5,'manual',5,0),(6,'manual',6,0);

CREATE TABLE mdl_user_enrolments (id INTEGER PRIMARY KEY, enrolid INTEGER, userid INTEGER, status INTEGER DEFAULT 0, timestart INTEGER);
INSERT INTO mdl_user_enrolments VALUES
(1,1,3,0,1788000000),(2,1,5,0,1788000000),(3,1,6,0,1788000000),(4,1,7,0,1788000000),
(5,1,8,0,1788000000),(6,1,9,0,1788000000),(7,2,10,0,1789000000),
(8,3,4,0,1788000000),(9,3,5,0,1788000000),(10,3,9,0,1788000000),(11,3,11,0,1788500000),
(12,4,3,0,1788000000),(13,4,6,0,1788000000),(14,4,7,0,1788000000),(15,4,12,0,1788500000),
(16,5,5,0,1788000000),(17,5,8,0,1788000000),(18,5,14,1,1788000000);

CREATE TABLE mdl_role (id INTEGER PRIMARY KEY, shortname VARCHAR(100), name VARCHAR(255));
INSERT INTO mdl_role VALUES
(1,'manager','Manager'),(2,'coursecreator','Course creator'),(3,'editingteacher','Teacher'),
(4,'teacher','Non-editing teacher'),(5,'student','Student'),(6,'guest','Guest'),(7,'user','Authenticated user');

CREATE TABLE mdl_context (id INTEGER PRIMARY KEY, contextlevel INTEGER, instanceid INTEGER);
INSERT INTO mdl_context VALUES
(1,10,0),(10,50,2),(11,50,3),(12,50,4),(13,50,5),(14,50,6);

CREATE TABLE mdl_role_assignments (id INTEGER PRIMARY KEY, roleid INTEGER, contextid INTEGER, userid INTEGER);
INSERT INTO mdl_role_assignments VALUES
(1,1,1,2),
(2,3,10,3),(3,5,10,5),(4,5,10,6),(5,5,10,7),(6,5,10,8),(7,5,10,9),(8,5,10,10),
(9,3,11,4),(10,5,11,5),(11,5,11,9),(12,5,11,11),
(13,3,12,3),(14,5,12,6),(15,5,12,7),(16,5,12,12),
(17,5,13,5),(18,5,13,8),(19,5,13,14);

CREATE TABLE mdl_grade_items (id INTEGER PRIMARY KEY, courseid INTEGER, itemname VARCHAR(255), itemtype VARCHAR(30));
INSERT INTO mdl_grade_items VALUES
(1,2,NULL,'course'),(2,2,'Kuis 1','mod'),(3,3,NULL,'course'),(4,4,NULL,'course');

CREATE TABLE mdl_grade_grades (id INTEGER PRIMARY KEY, itemid INTEGER, userid INTEGER, finalgrade DECIMAL(10,5));
INSERT INTO mdl_grade_grades VALUES
(1,1,5,85.5),(2,1,6,92),(3,1,7,74),(4,1,8,60),(5,1,9,NULL),(6,1,10,88),
(7,2,5,80),(8,2,6,95),(9,2,7,70),
(10,3,5,78),(11,3,9,90),(12,3,11,NULL),
(13,4,6,81),(14,4,7,69),(15,4,12,75);
`;

/* ---------- utilitas ---------- */
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ---------- syntax highlight ---------- */
const SQL_KW = new Set(('SELECT FROM WHERE AND OR NOT IN IS NULL LIKE BETWEEN ORDER BY GROUP HAVING LIMIT OFFSET AS DISTINCT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DATABASE SCHEMA DROP ALTER ADD COLUMN MODIFY CHANGE RENAME TO TRUNCATE INDEX VIEW ON PRIMARY KEY FOREIGN REFERENCES UNIQUE DEFAULT CHECK AUTO_INCREMENT AUTOINCREMENT CASCADE JOIN INNER LEFT RIGHT FULL OUTER CROSS NATURAL USING UNION ALL ANY SOME EXISTS CASE WHEN THEN ELSE END WITH RECURSIVE ASC DESC SHOW TABLES DATABASES COLUMNS DESCRIBE USE GRANT REVOKE PRIVILEGES FLUSH USER IDENTIFIED CHARACTER COLLATE IF INT INTEGER BIGINT SMALLINT TINYINT VARCHAR CHAR TEXT DATE DATETIME TIMESTAMP DECIMAL FLOAT DOUBLE ENUM BOOLEAN BOOL UNSIGNED BEGIN COMMIT ROLLBACK TRANSACTION START RESTRICT NO ACTION CONSTRAINT REPLACE TRUE FALSE SEPARATOR AFTER FIRST ENGINE CHARSET EXCEPT INTERSECT OR IGNORE CURRENT_TIMESTAMP OPTION FOR').split(' '));
function highlight(code, lang){
  lang = lang || 'sql';
  const re = /(--[^\n]*|\/\*[\s\S]*?\*\/|(?<![\w$])#[^\n]*)|('(?:[^'\\\n]|\\.|'')*'?|"(?:[^"\\\n]|\\.)*"?|`[^`\n]*`?)|(\$[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;
  let out = '', m;
  while ((m = re.exec(code))) {
    if (m[1] !== undefined) {
      if (lang === 'sql' && m[1][0] === '#') { out += esc(m[1]); continue; }
      out += '<span class="t-cm">' + esc(m[1]) + '</span>';
    }
    else if (m[2] !== undefined) out += '<span class="t-str">' + esc(m[2]) + '</span>';
    else if (m[3] !== undefined) out += '<span class="t-var">' + esc(m[3]) + '</span>';
    else if (m[4] !== undefined) out += '<span class="t-num">' + m[4] + '</span>';
    else if (m[5] !== undefined) {
      const w = m[5];
      if (lang === 'sql' && SQL_KW.has(w.toUpperCase())) out += '<span class="t-kw">' + w + '</span>';
      else if (/^\s*\(/.test(code.slice(re.lastIndex))) out += '<span class="t-fn">' + w + '</span>';
      else if (lang !== 'sql' && /^(mysql|mysqldump|sudo|cd|php|apt|systemctl|define|require_once|unset|global|new|stdClass|function|return)$/.test(w)) out += '<span class="t-kw">' + w + '</span>';
      else out += w;
    } else out += esc(m[6]);
  }
  return out;
}

/* ---------- pecah query jadi per-statement ---------- */
function splitSQL(code){
  const out = []; let cur = '', i = 0, q = null;
  while (i < code.length) {
    const c = code[i], n = code[i+1];
    if (q) {
      cur += c;
      if (c === '\\' && q !== '`') { cur += n || ''; i += 2; continue; }
      if (c === q) { if (n === q) { cur += n; i += 2; continue; } q = null; }
      i++; continue;
    }
    if (c === '-' && n === '-') { const e = code.indexOf('\n', i); const end = e < 0 ? code.length : e; i = end; continue; }
    if (c === '#') { const e = code.indexOf('\n', i); i = e < 0 ? code.length : e; continue; }
    if (c === '/' && n === '*') { const e = code.indexOf('*/', i + 2); i = e < 0 ? code.length : e + 2; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; cur += c; i++; continue; }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/* ---------- MySQL -> SQLite ---------- */
const ADMIN_INFO = 'Ini perintah administrasi server MySQL. Playground (SQLite) nggak punya sistem user/hak akses, jadi perintah ini cuma dicatat, nggak dijalankan. Untuk tes, hafalkan sintaksnya.';
function fixTypes(t){
  t = t.replace(/\bENUM\s*\((?:[^()']|'[^']*')*\)/gi, 'TEXT');
  t = t.replace(/\bSET\s*\((?:[^()']|'[^']*')*\)/gi, 'TEXT');
  t = t.replace(/\b(?:BIG|SMALL|MEDIUM|TINY)?INT(?:EGER)?(?:\s*\(\d+\))?((?:\s+UNSIGNED)?(?:\s+NOT\s+NULL)?(?:\s+PRIMARY\s+KEY)?)\s+AUTO_INCREMENT\b/gi, 'INTEGER$1');
  t = t.replace(/\s+AUTO_INCREMENT\b(?!\s*=)/gi, '');
  t = t.replace(/\s+UNSIGNED\b/gi, '');
  t = t.replace(/\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP(\(\))?/gi, '');
  t = t.replace(/\s+(?:CHARACTER\s+SET|CHARSET)\s*=?\s*\w+/gi, '');
  t = t.replace(/\s+COLLATE\s*=?\s*(?!NOCASE\b|BINARY\b|RTRIM\b)\w+/gi, '');
  t = t.replace(/\s+COMMENT\s+'(?:[^']|'')*'/gi, '');
  return t;
}
function translate(stmt){
  let t = stmt.trim().replace(/;\s*$/, '');
  const orig = t;
  const U = t.toUpperCase().replace(/\s+/g, ' ').trim();
  let m;
  const R = (sql, extra) => Object.assign({ sqls: Array.isArray(sql) ? sql : [sql], changed: true, orig }, extra || {});
  if ((m = U.match(/^USE (\S+)$/))) return { info: 'Database changed. (Di playground cuma ada satu database, yaitu kampus. Jadi USE di sini cuma simulasi.)', orig };
  if (/^SHOW (DATABASES|SCHEMAS)$/.test(U)) return R("SELECT 'information_schema' AS `Database` UNION ALL SELECT 'kampus' UNION ALL SELECT 'mysql' UNION ALL SELECT 'performance_schema' UNION ALL SELECT 'sys'");
  if (/^SHOW (FULL )?TABLES$/.test(U)) return R("SELECT name AS Tables_in_kampus FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name");
  if ((m = t.match(/^SHOW\s+(?:FULL\s+)?TABLES\s+LIKE\s+('(?:[^']|'')*')$/i))) return R(`SELECT name AS "Tables_in_kampus (${m[1].replace(/'/g, '').replace(/"/g, '')})" FROM sqlite_master WHERE type IN ('table','view') AND name LIKE ${m[1]} ORDER BY name`);
  if ((m = t.match(/^(?:DESCRIBE|DESC|EXPLAIN|SHOW\s+(?:FULL\s+)?(?:COLUMNS|FIELDS)\s+FROM)\s+`?(\w+)`?$/i)))
    return R(`SELECT name AS Field, type AS Type, CASE WHEN "notnull"=1 OR pk>0 THEN 'NO' ELSE 'YES' END AS "Null", CASE WHEN pk>0 THEN 'PRI' ELSE '' END AS "Key", dflt_value AS "Default" FROM pragma_table_info('${m[1]}')`, { needTable: m[1] });
  if ((m = t.match(/^SHOW\s+CREATE\s+TABLE\s+`?(\w+)`?$/i))) return R(`SELECT name AS "Table", sql AS "Create Table" FROM sqlite_master WHERE name='${m[1]}'`, { needTable: m[1] });
  if ((m = t.match(/^SHOW\s+(?:INDEX|INDEXES|KEYS)\s+FROM\s+`?(\w+)`?$/i))) return R(`SELECT '${m[1]}' AS "Table", il.name AS Key_name, ii.name AS Column_name, CASE WHEN il."unique"=1 THEN 0 ELSE 1 END AS Non_unique FROM pragma_index_list('${m[1]}') il, pragma_index_info(il.name) ii`);
  if ((m = t.match(/^CREATE\s+(?:DATABASE|SCHEMA)\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i))) return { info: `Query OK, database "${m[1]}" dibuat (simulasi). Di MySQL beneran, database baru ini akan muncul di SHOW DATABASES.`, orig };
  if ((m = t.match(/^DROP\s+(?:DATABASE|SCHEMA)\s+(?:IF\s+EXISTS\s+)?`?(\w+)`?/i))) return { info: `Query OK, database "${m[1]}" dihapus (simulasi). Hati-hati, di MySQL beneran ini menghapus SEMUA tabel di dalamnya.`, orig };
  if (/^(CREATE USER|DROP USER|ALTER USER|GRANT |REVOKE |FLUSH |SET PASSWORD|SHOW GRANTS|RENAME USER)/.test(U)) return { info: ADMIN_INFO, orig };
  if (/^START TRANSACTION$/.test(U)) return R('BEGIN');
  if ((m = t.match(/^TRUNCATE\s+(?:TABLE\s+)?`?(\w+)`?$/i))) return R(`DELETE FROM ${m[1]}`, { note: 'SQLite nggak punya TRUNCATE, jadi diganti DELETE FROM tanpa WHERE (hasil akhirnya sama: tabel kosong).' });
  if ((m = t.match(/^RENAME\s+TABLE\s+`?(\w+)`?\s+TO\s+`?(\w+)`?$/i))) return R(`ALTER TABLE ${m[1]} RENAME TO ${m[2]}`);
  if ((m = t.match(/^DROP\s+INDEX\s+`?(\w+)`?\s+ON\s+`?\w+`?$/i))) return R(`DROP INDEX ${m[1]}`);
  if ((m = t.match(/^CREATE\s+OR\s+REPLACE\s+VIEW\s+`?(\w+)`?\s+AS\s+([\s\S]+)$/i))) return R([`DROP VIEW IF EXISTS ${m[1]}`, `CREATE VIEW ${m[1]} AS ${tGlobal(m[2])}`]);
  if ((m = t.match(/^ALTER\s+TABLE\s+`?(\w+)`?\s+([\s\S]+)$/i))) {
    const tb = m[1];
    const parts = m[2].split(/,\s*(?=(?:ADD|DROP|MODIFY|CHANGE|RENAME|ALTER)\b)/i);
    const sqls = []; const infos = [];
    for (let p of parts) {
      p = p.trim(); let k;
      if (/^MODIFY\b/i.test(p)) { infos.push('MODIFY (ubah tipe/constraint kolom) nggak didukung SQLite, jadi di playground nggak dijalankan. Di MySQL perintah ini valid dan akan mengubah definisi kolom.'); continue; }
      if ((k = p.match(/^CHANGE\s+(?:COLUMN\s+)?`?(\w+)`?\s+`?(\w+)`?/i))) {
        if (k[1].toLowerCase() === k[2].toLowerCase()) { infos.push('CHANGE dengan nama sama = ubah tipe saja. SQLite nggak bisa ubah tipe, jadi di playground dilewati.'); continue; }
        sqls.push(`ALTER TABLE ${tb} RENAME COLUMN ${k[1]} TO ${k[2]}`);
        infos.push('CHANGE diterjemahkan jadi RENAME COLUMN. Tipe data barunya diabaikan karena SQLite nggak bisa ubah tipe kolom.'); continue;
      }
      if ((k = p.match(/^RENAME\s+(?:TO|AS)\s+`?(\w+)`?$/i)) || (k = p.match(/^RENAME\s+`?(\w+)`?$/i))) { sqls.push(`ALTER TABLE ${tb} RENAME TO ${k[1]}`); continue; }
      if ((k = p.match(/^RENAME\s+COLUMN\s+`?(\w+)`?\s+TO\s+`?(\w+)`?$/i))) { sqls.push(`ALTER TABLE ${tb} RENAME COLUMN ${k[1]} TO ${k[2]}`); continue; }
      if (/^DROP\s+(PRIMARY|FOREIGN|INDEX|KEY|CONSTRAINT|CHECK)\b/i.test(p)) { infos.push('Menghapus constraint lewat ALTER TABLE nggak didukung SQLite. Di MySQL perintah ini valid.'); continue; }
      if ((k = p.match(/^DROP\s+(?:COLUMN\s+)?`?(\w+)`?$/i))) { sqls.push(`ALTER TABLE ${tb} DROP COLUMN ${k[1]}`); continue; }
      if (/^ADD\s+(CONSTRAINT|FOREIGN|PRIMARY|CHECK)\b/i.test(p)) { infos.push('Menambah constraint lewat ALTER TABLE nggak didukung SQLite. Di MySQL perintah ini valid.'); continue; }
      if ((k = p.match(/^ADD\s+(UNIQUE\s+)?(?:INDEX|KEY)\s+`?(\w+)`?\s*\(([^)]*)\)$/i))) { sqls.push(`CREATE ${k[1] ? 'UNIQUE ' : ''}INDEX ${k[2]} ON ${tb}(${k[3]})`); continue; }
      if (/^ADD\b/i.test(p)) {
        let d = p.replace(/^ADD\s+(?:COLUMN\s+)?/i, '').replace(/\s+(AFTER\s+`?\w+`?|FIRST)\s*$/i, '');
        sqls.push(`ALTER TABLE ${tb} ADD COLUMN ${fixTypes(d)}`); continue;
      }
      sqls.push(`ALTER TABLE ${tb} ${p}`);
    }
    if (!sqls.length) return { info: infos.join(' '), orig };
    const joined = sqls.join('; ');
    return { sqls, changed: joined !== orig, orig, note: infos.join(' ') || null };
  }
  if (/^CREATE\s+(TEMPORARY\s+)?TABLE\b/i.test(t)) {
    t = fixTypes(t);
    t = t.replace(/,\s*UNIQUE\s+(?:KEY|INDEX)\s+`?\w+`?\s*\(/gi, ', UNIQUE (');
    t = t.replace(/,\s*(?:KEY|INDEX)\s+`?\w+`?\s*\([^)]*\)/gi, '');
    t = t.replace(/\)\s*((?:ENGINE|DEFAULT\s*$|DEFAULT\s+CHARSET|DEFAULT\s+CHARACTER|DEFAULT\s+COLLATE|CHARSET|CHARACTER\s+SET|COLLATE|AUTO_INCREMENT\s*=|ROW_FORMAT|COMMENT\s*=)[^(),]*)$/i, ')');
  }
  t = tGlobal(t);
  if (t === orig) return { sqls: [t], changed: false, orig };
  return { sqls: [t], changed: true, orig };
}
function tGlobal(t){
  t = t.replace(/^INSERT\s+IGNORE\b/i, 'INSERT OR IGNORE');
  t = t.replace(/GROUP_CONCAT\s*\(([^()]*?)\s+SEPARATOR\s+('(?:[^']|'')*')\s*\)/gi, 'GROUP_CONCAT($1, $2)');
  t = t.replace(/(>=|<=|<>|!=|=|>|<)\s*(ANY|SOME|ALL)\s*\(\s*SELECT\s+(DISTINCT\s+)?([\w.]+)\s+FROM\b/gi, (all, op, q, d, col) => {
    q = q.toUpperCase(); if (q === 'SOME') q = 'ANY';
    if (op === '=' && q === 'ANY') return `IN (SELECT ${col} FROM`;
    if ((op === '<>' || op === '!=') && q === 'ALL') return `NOT IN (SELECT ${col} FROM`;
    const big = (op[0] === '>');
    let agg;
    if (q === 'ANY') agg = big ? 'MIN' : 'MAX'; else agg = big ? 'MAX' : 'MIN';
    if (op === '=' || op === '<>' || op === '!=') return all;
    return `${op} (SELECT ${agg}(${col}) FROM`;
  });
  return t;
}

/* ---------- fungsi MySQL tambahan ---------- */
const pad = n => String(n).padStart(2, '0');
function fmtDT(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
function toDate(s){ if (s == null) return null; s = String(s); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/); if (!m) return null; return new Date(+m[1], m[2]-1, +m[3], +(m[4]||0), +(m[5]||0), +(m[6]||0)); }
const BULAN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function regFns(db){
  const F = (n, f) => db.create_function(n, f);
  F('NOW', () => fmtDT(new Date()));
  F('SYSDATE', () => fmtDT(new Date()));
  F('CURDATE', () => fmtDT(new Date()).slice(0, 10));
  F('CURTIME', () => fmtDT(new Date()).slice(11));
  F('YEAR', s => { const d = toDate(s); return d ? d.getFullYear() : null; });
  F('MONTH', s => { const d = toDate(s); return d ? d.getMonth() + 1 : null; });
  F('DAY', s => { const d = toDate(s); return d ? d.getDate() : null; });
  F('DAYOFMONTH', s => { const d = toDate(s); return d ? d.getDate() : null; });
  F('HOUR', s => { const d = toDate(s); return d ? d.getHours() : null; });
  F('MONTHNAME', s => { const d = toDate(s); return d ? BULAN[d.getMonth()] : null; });
  F('DATEDIFF', (a, b) => { const x = toDate(a), y = toDate(b); if (!x || !y) return null; const ux = Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()), uy = Date.UTC(y.getFullYear(), y.getMonth(), y.getDate()); return Math.round((ux - uy) / 86400000); });
  F('FROM_UNIXTIME', n => n == null ? null : fmtDT(new Date(n * 1000)));
  F('UNIX_TIMESTAMP', function(s){ if (arguments.length === 0 || s === undefined) return Math.floor(Date.now() / 1000); const d = toDate(s); return d ? Math.floor(d.getTime() / 1000) : null; });
  F('DATE_FORMAT', (s, f) => { const d = toDate(s); if (!d || f == null) return null; return String(f).replace(/%([YymdeHisMbjl%])/g, (_, c) => ({Y: d.getFullYear(), y: String(d.getFullYear()).slice(2), m: pad(d.getMonth()+1), d: pad(d.getDate()), e: d.getDate(), H: pad(d.getHours()), i: pad(d.getMinutes()), s: pad(d.getSeconds()), M: BULAN[d.getMonth()], b: BULAN[d.getMonth()].slice(0,3), j: d.getDate(), l: '', '%': '%'}[c])); });
  F('IF', (c, a, b) => (c && c !== '0') ? a : b);
  F('LEFT', (s, n) => s == null ? null : String(s).slice(0, Math.max(0, n)));
  F('RIGHT', (s, n) => s == null ? null : (n <= 0 ? '' : String(s).slice(-n)));
  F('UCASE', s => s == null ? null : String(s).toUpperCase());
  F('LCASE', s => s == null ? null : String(s).toLowerCase());
  F('LENGTH', s => s == null ? null : (typeof s === 'string' ? new TextEncoder().encode(s).length : String(s).length));
  F('CHAR_LENGTH', s => s == null ? null : Array.from(String(s)).length);
  F('LOCATE', (sub, s) => (s == null || sub == null) ? null : String(s).indexOf(sub) + 1);
  F('DATABASE', () => 'kampus');
  F('VERSION', () => '8.0 (simulasi, aslinya SQLite)');
}

/* ---------- runner ---------- */
let SQLlib = null, SEED_BYTES = null;
function buildSeed(SQL){
  SQLlib = SQL;
  const db = new SQL.Database(); db.run(SEED_SQL); SEED_BYTES = db.export(); db.close();
}
function freshDB(){
  const db = new SQLlib.Database(SEED_BYTES);
  regFns(db); db.run('PRAGMA foreign_keys = ON');
  return db;
}
const ERR_HINTS = [
  [/no such table: (\S+)/i, (m) => `Tabel "${m[1]}" nggak ada. Cek ejaan nama tabel, atau jalankan SHOW TABLES untuk lihat daftar tabel.`],
  [/no such column: (\S+)/i, (m) => `Kolom "${m[1]}" nggak ada. Cek ejaan, atau cek pakai DESCRIBE nama_tabel. Kalau maksudnya teks, apit pakai kutip satu: 'teks'.`],
  [/ambiguous column name: (\S+)/i, (m) => `Kolom "${m[1]}" ada di lebih dari satu tabel. Tulis lengkap pakai nama tabel/alias, misal m.${m[1].split('.').pop()}.`],
  [/near "([^"]*)": syntax error/i, (m) => `Ada salah tulis (syntax error) di dekat "${m[1]}". Cek koma, kurung, kutip, atau urutan klausa (SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT).`],
  [/incomplete input/i, () => 'Query-nya belum selesai. Mungkin ada kurung atau kutip yang belum ditutup.'],
  [/UNIQUE constraint failed: (\S+)/i, (m) => `Data duplikat! Kolom ${m[1]} harus unik (PRIMARY KEY/UNIQUE), dan nilai itu sudah ada.`],
  [/NOT NULL constraint failed: (\S+)/i, (m) => `Kolom ${m[1]} wajib diisi (NOT NULL), tapi kamu kosongkan.`],
  [/FOREIGN KEY constraint failed/i, () => 'Melanggar FOREIGN KEY: nilai yang kamu isi nggak ada di tabel induk, atau data ini masih dipakai tabel lain.'],
  [/CHECK constraint failed: (.*)/i, (m) => `Melanggar CHECK: data nggak memenuhi syarat ${m[1]}.`],
  [/misuse of aggregate/i, () => 'Fungsi agregat (COUNT/SUM/AVG/...) nggak boleh di WHERE. Pakai HAVING setelah GROUP BY.'],
  [/HAVING clause on a non-aggregate query|a GROUP BY clause is required before HAVING/i, () => 'HAVING dipakai bareng GROUP BY (atau fungsi agregat).'],
  [/SELECTs to the left and right of UNION do not have the same number/i, () => 'Jumlah kolom di kiri dan kanan UNION harus sama.'],
  [/table (\S+) already exists/i, (m) => `Tabel ${m[1]} sudah ada. Pakai nama lain, atau DROP TABLE dulu, atau CREATE TABLE IF NOT EXISTS.`],
  [/sub-select returns (\d+) columns/i, () => 'Subquery yang dibandingkan pakai =, IN, dll harus mengembalikan 1 kolom saja.'],
  [/no such function: (\S+)/i, (m) => `Fungsi ${m[1]} nggak dikenal di playground ini.`],
  [/has no column named (\S+)/i, (m) => `Tabel nggak punya kolom bernama ${m[1]}.`],
  [/(\d+) values for (\d+) columns/i, (m) => `Jumlah nilai (${m[1]}) nggak sama dengan jumlah kolom (${m[2]}).`],
  [/view (\S+) already exists/i, (m) => `View ${m[1]} sudah ada. Pakai CREATE OR REPLACE VIEW atau DROP VIEW dulu.`],
];
function friendly(msg){
  for (const [re, f] of ERR_HINTS) { const m = msg.match(re); if (m) return f(m); }
  return null;
}
/* Jalankan kode (bisa banyak statement). Hasil: {steps:[...], error} */
function runSQL(db, code){
  const stmts = splitSQL(code); const steps = [];
  if (!stmts.length) return { steps, error: { msg: 'Query-nya masih kosong.', hint: null } };
  for (const s of stmts) {
    const tr = translate(s);
    if (tr.info) { steps.push({ kind: 'info', text: tr.info, orig: s }); continue; }
    if (tr.needTable) {
      const ok = db.exec(`SELECT 1 FROM sqlite_master WHERE name='${tr.needTable}'`);
      if (!ok.length) return { steps, error: { msg: `Table 'kampus.${tr.needTable}' doesn't exist`, hint: `Tabel "${tr.needTable}" nggak ada. Jalankan SHOW TABLES untuk lihat daftar tabel.`, stmt: s } };
    }
    const step = { kind: 'ok', orig: s, translated: tr.changed ? tr.sqls.join(';\n') : null, note: tr.note || null, result: null, changes: 0 };
    try {
      for (const q of tr.sqls) {
        const st = db.prepare(q);
        const cols = st.getColumnNames();
        if (cols.length) {
          const rows = []; while (st.step()) rows.push(st.get());
          st.free(); step.result = { columns: cols, values: rows };
        } else {
          st.step(); st.free(); step.changes += db.getRowsModified();
        }
      }
    } catch (e) {
      const msg = String(e.message || e);
      return { steps, error: { msg, hint: friendly(msg), stmt: s, translated: step.translated } };
    }
    steps.push(step);
  }
  return { steps, error: null };
}
function lastResult(r){ for (let i = r.steps.length - 1; i >= 0; i--) if (r.steps[i].result) return r.steps[i].result; return null; }

/* ---------- pembanding hasil ---------- */
function normVal(v){
  if (v === null || v === undefined) return '∅NULL';
  if (typeof v === 'number') return String(Math.round(v * 100) / 100);
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return String(Math.round(parseFloat(s) * 100) / 100);
  return s;
}
function rowsKey(rows){ return rows.map(r => r.join('\u0001')); }
function sameRows(E, G, ordered){
  if (E.length !== G.length) return false;
  const a = rowsKey(E), b = rowsKey(G);
  if (!ordered) { a.sort(); b.sort(); }
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function compareResults(exp, got, ordered){
  if (!got) return { ok: false, msg: 'Query kamu nggak menghasilkan tabel hasil. Pastikan ada SELECT (atau query yang menampilkan data).' };
  if (!exp) return { ok: false, msg: 'Kunci jawaban nggak menghasilkan tabel (bug di soal).' };
  const E = exp.values.map(r => r.map(normVal)), G = got.values.map(r => r.map(normVal));
  const ec = exp.columns.length, gc = got.columns.length;
  if (ec !== gc) return { ok: false, msg: `Jumlah kolom belum pas: hasil kamu ${gc} kolom, seharusnya ${ec} kolom.` };
  if (sameRows(E, G, ordered)) return { ok: true };
  // coba kolom dengan urutan lain
  const sig = (M, j) => M.map(r => r[j]).sort().join('\u0002');
  const used = new Set(), map = [];
  for (let j = 0; j < ec; j++) {
    const s = sig(E, j); let f = -1;
    for (let k = 0; k < gc; k++) if (!used.has(k) && sig(G, k) === s) { f = k; break; }
    if (f < 0) break; used.add(f); map.push(f);
  }
  if (map.length === ec) {
    const G2 = G.map(r => map.map(k => r[k]));
    if (sameRows(E, G2, ordered)) return { ok: true, note: 'Urutan kolom kamu beda dengan kunci, tapi isinya sama. Tetap dihitung benar.' };
    if (ordered && sameRows(E, G2, false)) return { ok: false, msg: 'Isinya sudah benar, tapi urutan barisnya belum sesuai. Cek ORDER BY (ASC/DESC dan kolomnya).' };
  }
  if (E.length !== G.length) return { ok: false, msg: `Jumlah baris belum pas: hasil kamu ${G.length} baris, seharusnya ${E.length} baris. Cek kondisi WHERE/JOIN/HAVING kamu.` };
  if (ordered && sameRows(E, G, false)) return { ok: false, msg: 'Isinya sudah benar, tapi urutan barisnya belum sesuai. Cek ORDER BY (ASC/DESC dan kolomnya).' };
  return { ok: false, msg: 'Jumlah baris dan kolom sudah pas, tapi ada nilai yang beda. Cek lagi kondisi, kolom yang dipilih, atau perhitungannya.' };
}
/* cek satu latihan. ex: {a, check, setup, order, type, pats} */
function evalQuery(ex, code){
  const dbU = freshDB();
  try {
    if (ex.setup) runSQL(dbU, ex.setup);
    const rU = runSQL(dbU, code);
    if (rU.error) return { ok: false, run: rU, msg: 'Query kamu error: ' + (rU.error.hint || rU.error.msg) };
    let got = lastResult(rU);
    if (ex.check) { const rc = runSQL(dbU, ex.check); if (rc.error) return { ok: false, run: rU, msg: 'Query kamu jalan, tapi struktur/isi tabel setelahnya belum sesuai soal (' + (rc.error.hint || rc.error.msg) + ').' }; got = lastResult(rc); }
    const dbA = freshDB();
    try {
      if (ex.setup) runSQL(dbA, ex.setup);
      const rA = runSQL(dbA, ex.a);
      let exp = lastResult(rA);
      if (ex.check) exp = lastResult(runSQL(dbA, ex.check));
      const c = compareResults(exp, got, !!ex.order);
      c.run = rU; c.checked = ex.check ? got : null;
      return c;
    } finally { dbA.close(); }
  } finally { dbU.close(); }
}
function evalPattern(ex, code){
  const norm = code.replace(/--[^\n]*/g, ' ').replace(/\s+/g, ' ').trim();
  if (!norm) return { ok: false, msg: 'Jawabannya masih kosong.' };
  for (const [re, pesan] of ex.pats) {
    if (!new RegExp(re, 'i').test(norm)) return { ok: false, msg: pesan };
  }
  return { ok: true };
}
function evaluate(ex, code){
  if (ex.type === 'pattern') return evalPattern(ex, code);
  return evalQuery(ex, code);
}

if (typeof module !== 'undefined') module.exports = { SEED_SQL, highlight, splitSQL, translate, runSQL, lastResult, compareResults, evaluate, buildSeed, freshDB };
