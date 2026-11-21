/* ===== UI ===== */
const LS_KEY = 'belajarMySQL.v1';
function loadState(){ try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } }
function saveState(){ try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)); } catch (e) {} }
const STATE = loadState(); STATE.solved = STATE.solved || {};
const REG = {};
let PGDB = null, ENGINE_OK = false;
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

/* ---------- load sql.js ---------- */
const SQLJS_BASES = [
  'https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/',
  'https://unpkg.com/sql.js@1.14.1/dist/',
  'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.1/'
];
function loadScript(src){ return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
const READY = (async () => {
  for (const base of SQLJS_BASES) {
    try {
      if (typeof initSqlJs === 'undefined') await loadScript(base + 'sql-wasm.js');
      const SQL = await initSqlJs({ locateFile: f => base + f });
      buildSeed(SQL); PGDB = freshDB(); ENGINE_OK = true;
      return true;
    } catch (e) { console.warn('Gagal load sql.js dari', base, e); }
  }
  throw new Error('sql.js gagal dimuat');
})();
READY.then(() => { $('#loading').remove(); fillViz(); renderPGTables(); })
  .catch(() => { $('#loading').innerHTML = '⚠ Mesin SQL gagal dimuat. Pastikan kamu terhubung ke internet (sql.js diambil dari CDN), lalu refresh.'; });

/* ---------- komponen ---------- */
function codeBlock(code, lang){ return `<pre class="code">${highlight(code.trim(), lang)}</pre>`; }
function editor(id, code){ return `<div class="ed"><pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" data-ed="${id}">${esc(code || '')}</textarea></div>`; }
function syncEd(ta){ ta.previousElementSibling.innerHTML = highlight(ta.value) + '\n '; }
function fmtCell(v){
  if (v === null || v === undefined) return '<td class="null">NULL</td>';
  if (typeof v === 'number' && !Number.isInteger(v)) v = Math.round(v * 10000) / 10000;
  return `<td>${esc(v)}</td>`;
}
function tableHTML(res, opts){
  opts = opts || {};
  const max = 300; const rows = res.values.slice(0, max);
  let h = `<div class="tblwrap"><table class="data"><tr>${res.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr>`;
  for (const r of rows) {
    const cls = opts.hl === 'null' && r.some(v => v === null) ? ' class="hl"' : '';
    h += `<tr${cls}>${r.map(fmtCell).join('')}</tr>`;
  }
  h += '</table></div>';
  h += `<div class="cap">${res.values.length} baris${res.values.length > max ? ` (ditampilkan ${max})` : ''}${opts.hl === 'null' && res.values.some(r => r.some(v => v === null)) ? ' · <span style="background:var(--nullbg);padding:0 4px">baris kuning</span> = ada NULL (nggak punya pasangan / belum diisi)' : ''}</div>`;
  return h;
}
function runHTML(r, opts){
  let h = '';
  const steps = r.steps;
  const many = steps.length > 1;
  steps.forEach((s, i) => {
    if (s.kind === 'info') { h += `<div class="msg info">ℹ ${esc(s.text)}</div>`; return; }
    if (s.translated) h += `<div class="tr">ℹ Diterjemahkan ke SQLite: <code>${esc(s.translated.length > 160 ? s.translated.slice(0, 160) + '…' : s.translated)}</code></div>`;
    if (s.note) h += `<div class="msg info">ℹ ${esc(s.note)}</div>`;
    if (s.result) h += tableHTML(s.result, opts);
    else if (many || !r.error) {
      const verb = /^\s*(INSERT|REPLACE)/i.test(s.orig) ? 'ditambahkan' : /^\s*UPDATE/i.test(s.orig) ? 'diubah' : /^\s*(DELETE|TRUNCATE)/i.test(s.orig) ? 'dihapus' : null;
      h += `<div class="msg ok">✓ ${esc(s.orig.split(/\s+/).slice(0, 3).join(' '))}… berhasil${verb ? `, ${s.changes} baris ${verb}` : ''}.</div>`;
    }
  });
  if (r.error) h += `<div class="msg err">✗ Error: ${esc(r.error.msg)}${r.error.hint ? `<br>💡 ${esc(r.error.hint)}` : ''}</div>`;
  return h;
}
function needEngine(out){ if (ENGINE_OK) return true; out.innerHTML = '<div class="msg info">Mesin SQL masih dimuat, tunggu sebentar...</div>'; return false; }

/* ---------- visualisasi ---------- */
let vennN = 0;
function vennSVG(type, la, lb){
  const id = 'v' + (vennN++);
  la = la || 'A'; lb = lb || 'B';
  const A = '<circle cx="80" cy="70" r="52"/>', B = '<circle cx="140" cy="70" r="52"/>';
  const f = 'fill="var(--venn-fill)" fill-opacity=".55"';
  let fill = '';
  if (type === 'inner') fill = `<clipPath id="${id}"><circle cx="80" cy="70" r="52"/></clipPath><circle cx="140" cy="70" r="52" ${f} clip-path="url(#${id})"/>`;
  else if (type === 'left') fill = `<circle cx="80" cy="70" r="52" ${f}/>`;
  else if (type === 'right') fill = `<circle cx="140" cy="70" r="52" ${f}/>`;
  else if (type === 'full') fill = `<circle cx="80" cy="70" r="52" ${f}/><circle cx="140" cy="70" r="52" ${f}/>`;
  else if (type === 'leftonly') fill = `<clipPath id="${id}"><circle cx="80" cy="70" r="52"/></clipPath><circle cx="80" cy="70" r="52" ${f}/><circle cx="140" cy="70" r="52" fill="var(--card)" clip-path="url(#${id})"/>`;
  return `<svg width="220" height="150" viewBox="0 0 220 150" role="img" aria-label="Diagram Venn ${type}">${fill}
  <g fill="none" stroke-width="2"><circle cx="80" cy="70" r="52" stroke="var(--venn-a)"/><circle cx="140" cy="70" r="52" stroke="var(--venn-b)"/></g>
  <text x="48" y="74" font-size="12" fill="var(--fg)" text-anchor="middle">${esc(la)}</text><text x="172" y="74" font-size="12" fill="var(--fg)" text-anchor="middle">${esc(lb)}</text>
  <text x="110" y="144" font-size="11" fill="var(--mut)" text-anchor="middle">hijau = baris yang ikut di hasil</text></svg>`;
}
const VENN_TXT = {
  inner: 'Cuma bagian <b>irisan</b>: matkul yang punya dosen DAN dosen yang punya matkul.',
  left: 'Semua dari tabel <b>kiri</b> (matakuliah). Kalau nggak punya pasangan, kolom dosen diisi NULL.',
  right: 'Semua dari tabel <b>kanan</b> (dosen). Dosen yang nggak ngajar tetap muncul, kolom matkul NULL.',
  full: 'Semua dari <b>kedua</b> tabel. Yang nggak punya pasangan tetap muncul dengan NULL di sisi lain.',
  leftonly: 'Hanya baris kiri yang <b>nggak</b> punya pasangan (LEFT JOIN + WHERE kanan IS NULL).'
};
function vizHTML(v){
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(vizHTML).join('');
  if (v.type === 'venn') return `<div class="venn">${vennSVG(v.join, v.a || 'matakuliah', v.b || 'dosen')}<div style="flex:1;min-width:220px"><p>${VENN_TXT[v.join] || ''}</p></div></div>${v.list === false ? '' : `<div data-viz="joinlist" data-join="${v.join}"></div>`}`;
  if (v.type === 'erd') return `<div class="erd">${ERD_SVG[v.which]}</div>`;
  if (v.type === 'corr') return `<div data-viz="corr"></div>`;
  return '';
}
function fillViz(){
  if (!ENGINE_OK) return;
  $$('[data-viz="joinlist"]').forEach(el => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const db = freshDB();
    const L = db.exec('SELECT kode_mk, nama_mk, id_dosen FROM matakuliah')[0].values;
    const R = db.exec('SELECT id_dosen, nama FROM dosen')[0].values; db.close();
    const rIds = new Set(R.map(r => r[0])), lIds = new Set(L.map(r => r[2]));
    const t = el.dataset.join;
    const keepL = t === 'left' || t === 'full', keepR = t === 'right' || t === 'full';
    const cls = (matched, keep) => matched ? 'in' : (keep ? 'hl' : 'gone');
    const lt = `<table class="data"><tr><th>kode_mk</th><th>nama_mk</th><th>id_dosen</th></tr>${L.map(r => `<tr class="${t === 'leftonly' ? (rIds.has(r[2]) ? 'gone' : 'hl') : cls(rIds.has(r[2]), keepL)}">${r.map(fmtCell).join('')}</tr>`).join('')}</table>`;
    const rt = `<table class="data"><tr><th>id_dosen</th><th>nama</th></tr>${R.map(r => `<tr class="${t === 'leftonly' ? 'gone' : cls(lIds.has(r[0]), keepR)}">${r.map(fmtCell).join('')}</tr>`).join('')}</table>`;
    el.innerHTML = `<div class="legend"><span><i style="background:var(--okbg)"></i>ikut, punya pasangan</span><span><i style="background:var(--nullbg)"></i>ikut, pasangannya diisi NULL</span><span><i style="background:var(--badbg)"></i>hilang dari hasil</span></div>
      <div class="cols2"><div><b>Tabel kiri: matakuliah</b><div class="tblwrap">${lt}</div></div><div><b>Tabel kanan: dosen</b><div class="tblwrap">${rt}</div></div></div>`;
  });
  $$('[data-viz="corr"]').forEach(el => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const db = freshDB();
    const r = db.exec(`SELECT m.nama, m.jurusan, m.ipk, (SELECT ROUND(AVG(m2.ipk),2) FROM mahasiswa m2 WHERE m2.jurusan = m.jurusan) AS rata_jurusan FROM mahasiswa m`)[0];
    db.close();
    el._rows = r.values; el._i = -1;
    el.innerHTML = `<div class="step-ctrl"><button class="btn pri sm" data-act="corr-next">Langkah berikutnya ▶</button><button class="btn sm" data-act="corr-all">Tampilkan semua</button><button class="btn sm" data-act="corr-reset">Ulang</button></div><div class="step-msg">Klik "Langkah berikutnya". MySQL akan memproses tabel luar satu baris demi satu baris.</div><div class="tblwrap"></div>`;
    drawCorr(el);
  });
}
function drawCorr(el){
  const rows = el._rows, i = el._i;
  let h = '<table class="data"><tr><th>#</th><th>nama</th><th>jurusan</th><th>ipk</th><th>hasil query dalam (rata-rata jurusannya)</th><th>ipk &gt; rata?</th></tr>';
  rows.forEach((r, k) => {
    const pass = r[2] !== null && r[2] > r[3];
    const shown = k <= i;
    const cls = k === i ? ' style="outline:2px solid var(--acc)"' : '';
    const tr = shown ? (pass ? 'in' : 'gone') : '';
    h += `<tr class="${tr}"${cls}><td>${k + 1}</td>${fmtCell(r[0])}${fmtCell(r[1])}${fmtCell(r[2])}<td>${shown ? r[3] : '?'}</td><td>${shown ? (r[2] === null ? 'NULL (nggak diketahui) → nggak ikut' : pass ? 'YA → ikut' : 'TIDAK') : ''}</td></tr>`;
  });
  el.querySelector('.tblwrap').innerHTML = h + '</table>';
  if (i >= 0 && i < rows.length) {
    const r = rows[i];
    el.querySelector('.step-msg').innerHTML = `Baris ${i + 1}: <b>${esc(r[0])}</b>. Query dalam dijalankan ulang KHUSUS untuk jurusan <b>${esc(r[1])}</b>: <code>SELECT AVG(ipk) FROM mahasiswa WHERE jurusan = '${esc(r[1])}'</code> → <b>${r[3]}</b>. Lalu dicek: ${r[2] === null ? 'IPK-nya NULL, jadi perbandingan nggak bisa diputuskan, baris ini nggak ikut.' : `${r[2]} &gt; ${r[3]}? <b>${r[2] > r[3] ? 'Ya, ikut ke hasil' : 'Tidak, dibuang'}</b>.`}`;
  } else if (i >= rows.length) el.querySelector('.step-msg').innerHTML = `Selesai. Query dalam dijalankan <b>${rows.length} kali</b> (sekali per baris tabel luar). Baris hijau adalah hasil akhirnya.`;
}

/* ---------- ERD ---------- */
function erd(tables, links, W, H){
  const RH = 19, HH = 26, BW = 168;
  const pos = {};
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Diagram relasi tabel">`;
  for (const t of tables) {
    const h = HH + t.cols.length * RH + 6;
    pos[t.name] = { x: t.x, y: t.y, h, cols: t.cols.map(c => c.replace(/[*#]/g, '')) };
    s += `<g><rect x="${t.x}" y="${t.y}" width="${BW}" height="${h}" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="1.5"/>
      <rect x="${t.x}" y="${t.y}" width="${BW}" height="${HH}" rx="8" fill="var(--acc2)"/><rect x="${t.x}" y="${t.y + HH - 8}" width="${BW}" height="8" fill="var(--acc2)"/>
      <text x="${t.x + 10}" y="${t.y + 18}" font-size="13.5" font-weight="700" fill="var(--fg)">${t.name}</text>`;
    t.cols.forEach((c, i) => {
      const pk = c.includes('*'), fk = c.includes('#'); const name = c.replace(/[*#]/g, '');
      s += `<text x="${t.x + 10}" y="${t.y + HH + 15 + i * RH}" font-size="12.5" fill="${pk ? 'var(--t-num)' : fk ? 'var(--t-fn)' : 'var(--fg)'}" font-weight="${pk ? 700 : 400}">${pk ? '🔑 ' : fk ? '↗ ' : ''}${name}</text>`;
    });
    s += '</g>';
  }
  for (const [a, b, la, lb] of links) {
    const [ta, ca] = a.split('.'), [tb, cb] = b.split('.');
    const A = pos[ta], B = pos[tb];
    const ya = A.y + HH + 11 + A.cols.indexOf(ca) * RH, yb = B.y + HH + 11 + B.cols.indexOf(cb) * RH;
    let xa, xb;
    if (A.x + BW < B.x) { xa = A.x + BW; xb = B.x; } else if (B.x + BW < A.x) { xa = A.x; xb = B.x + BW; } else { xa = A.x + BW; xb = B.x + BW; }
    const mx = (xa === A.x + BW && xb === B.x + BW) ? Math.max(xa, xb) + 30 : (xa + xb) / 2;
    s += `<path d="M${xa} ${ya} H${mx} V${yb} H${xb}" fill="none" stroke="var(--mut)" stroke-width="1.5"/>`;
    const da = xa < mx ? 1 : -1, db = xb < mx ? 1 : -1;
    s += `<text x="${xa + da * 10}" y="${ya - 4}" font-size="12" font-weight="700" fill="var(--acc)" text-anchor="middle">${la}</text><text x="${xb + db * 10}" y="${yb - 4}" font-size="12" font-weight="700" fill="var(--acc)" text-anchor="middle">${lb}</text>`;
  }
  return s + '</svg>';
}
const ERD_SVG = {
  kampus: erd([
    { name: 'mahasiswa', x: 10, y: 10, cols: ['*nim', 'nama', 'jurusan', 'angkatan', 'kota', 'ipk'] },
    { name: 'krs', x: 250, y: 30, cols: ['*id', '#nim', '#kode_mk', 'semester', 'nilai'] },
    { name: 'matakuliah', x: 490, y: 10, cols: ['*kode_mk', 'nama_mk', 'sks', '#id_dosen'] },
    { name: 'dosen', x: 490, y: 160, cols: ['*id_dosen', 'nama', 'keahlian'] },
    { name: 'staf', x: 250, y: 190, cols: ['*id', 'nama', 'jabatan', '#id_atasan'] },
  ], [['mahasiswa.nim', 'krs.nim', '1', 'N'], ['matakuliah.kode_mk', 'krs.kode_mk', '1', 'N'], ['dosen.id_dosen', 'matakuliah.id_dosen', '1', 'N'], ['staf.id', 'staf.id_atasan', '1', 'N']], 700, 300),
  moodle: erd([
    { name: 'mdl_user', x: 10, y: 10, cols: ['*id', 'username', 'firstname', 'lastname', 'email', 'lastlogin', 'deleted', 'suspended'] },
    { name: 'mdl_user_enrolments', x: 230, y: 10, cols: ['*id', '#enrolid', '#userid', 'status', 'timestart'] },
    { name: 'mdl_enrol', x: 450, y: 10, cols: ['*id', 'enrol', '#courseid', 'status'] },
    { name: 'mdl_course', x: 670, y: 10, cols: ['*id', '#category', 'fullname', 'shortname', 'visible'] },
    { name: 'mdl_course_categories', x: 670, y: 170, cols: ['*id', 'name', 'parent'] },
    { name: 'mdl_role_assignments', x: 230, y: 190, cols: ['*id', '#roleid', '#contextid', '#userid'] },
    { name: 'mdl_role', x: 10, y: 230, cols: ['*id', 'shortname', 'name'] },
    { name: 'mdl_context', x: 450, y: 190, cols: ['*id', 'contextlevel', '#instanceid'] },
    { name: 'mdl_grade_items', x: 450, y: 320, cols: ['*id', '#courseid', 'itemname', 'itemtype'] },
    { name: 'mdl_grade_grades', x: 230, y: 330, cols: ['*id', '#itemid', '#userid', 'finalgrade'] },
  ], [['mdl_user.id', 'mdl_user_enrolments.userid', '1', 'N'], ['mdl_enrol.id', 'mdl_user_enrolments.enrolid', '1', 'N'], ['mdl_course.id', 'mdl_enrol.courseid', '1', 'N'], ['mdl_course_categories.id', 'mdl_course.category', '1', 'N'],
      ['mdl_role.id', 'mdl_role_assignments.roleid', '1', 'N'], ['mdl_context.id', 'mdl_role_assignments.contextid', '1', 'N'], ['mdl_grade_items.id', 'mdl_grade_grades.itemid', '1', 'N']], 850, 450),
};

/* ---------- render bab ---------- */
let CUR = null;
function totalLat(ch){ return (ch.subs || []).reduce((a, s) => a + (s.latihan || []).length, 0); }
function solvedLat(ch){ return (ch.subs || []).reduce((a, s) => a + (s.latihan || []).filter((l, i) => STATE.solved[`${s.id}-${i}`]).length, 0); }
function updateProgress(){
  let t = 0, d = 0; CH.forEach(c => { t += totalLat(c); d += solvedLat(c); });
  $('#progBar').style.width = (t ? d / t * 100 : 0) + '%';
  $('#progTxt').textContent = `${d}/${t} latihan benar`;
}
function renderSide(){
  let h = '';
  CH.forEach(c => {
    const t = totalLat(c), d = solvedLat(c);
    h += `<a href="#${c.id}" class="${CUR === c ? 'cur' : ''}"><span>${esc(c.title)}</span>${t ? `<span class="cnt ${d === t ? 'done' : ''}">${d}/${t}</span>` : ''}</a>`;
    if (CUR === c && c.subs) {
      h += '<div class="subs">' + c.subs.map(s => {
        const all = (s.latihan || []).length && (s.latihan || []).every((l, i) => STATE.solved[`${s.id}-${i}`]);
        return `<a href="#${c.id}/${s.id}" class="${all ? 'solved' : ''}"><span>${esc(s.id + ' ' + s.t)}</span></a>`;
      }).join('') + '</div>';
    }
  });
  $('#side').innerHTML = h; updateProgress();
}
function subHTML(c, s){
  let h = `<section id="s-${s.id}"><h2>${esc(s.id)} · ${esc(s.t)}</h2>`;
  h += `<h3>1 · Konsepnya apa?</h3>${s.konsep}`;
  if (s.sintaks) {
    h += `<h3>2 · Sintaks MySQL</h3>${codeBlock(s.sintaks.code, s.sintaks.lang)}`;
    if (s.sintaks.ket) h += `<table class="ket">${s.sintaks.ket.map(([k, d]) => `<tr><td><code>${esc(k)}</code></td><td>${d}</td></tr>`).join('')}</table>`;
  }
  (s.mysql || []).forEach(w => { h += `<div class="warn"><b>⚠ Di MySQL ditulis begini:</b> ${w}</div>`; });
  if (s.contoh && s.contoh.length) {
    h += `<h3>3 · Contoh (bisa diedit, lalu klik Jalankan)</h3>`;
    s.contoh.forEach((e, i) => {
      const id = `c-${s.id}-${i}`; REG[id] = { kind: 'ex', sql: e.sql.trim(), hl: e.hl };
      h += `<div class="contoh"><div class="lbl">Contoh ${i + 1}${e.t ? ' · ' + esc(e.t) : ''}</div>${editor(id, e.sql.trim())}
        <div class="runbar"><button class="btn pri" data-act="run" data-id="${id}">▶ Jalankan</button><button class="btn sm" data-act="restore" data-id="${id}">Kembalikan kode</button><span class="hint hide-m">Ctrl+Enter = jalankan</span></div>
        <div class="out" id="o-${id}"></div><div class="why">💬 ${e.ket}</div></div>`;
    });
  }
  if (s.viz) h += `<h3>4 · Visualisasi</h3>${vizHTML(s.viz)}`;
  if (s.salah && s.salah.length) h += `<h3>5 · Kesalahan umum pemula</h3><ul class="salah">${s.salah.map(x => `<li>${x}</li>`).join('')}</ul>`;
  if (s.latihan && s.latihan.length) {
    h += `<h3>6 · Latihan</h3>`;
    s.latihan.forEach((l, i) => { h += latHTML(`${s.id}-${i}`, l, i); });
  }
  if (s.ringkas) h += `<div class="ringkas">📌 Ringkasan: ${s.ringkas}</div>`;
  return h + '</section>';
}
function latHTML(id, l, i){
  REG[id] = Object.assign({ kind: 'lat', shown: 0 }, l);
  const done = STATE.solved[id];
  let h = `<div class="lat ${done ? 'done' : ''}" id="l-${id}"><div class="head"><b>Latihan ${i + 1}</b><span class="lvl ${l.lv}">${l.lv}</span><span class="badge">${done ? '✓ sudah benar' : ''}</span></div><div class="q">${l.q}</div>`;
  if (l.type === 'mc') {
    h += `<div class="mc">${l.opsi.map((o, k) => `<label><input type="radio" name="mc-${id}" value="${k}"> ${o}</label>`).join('')}</div>
      <div class="runbar"><button class="btn ok" data-act="mc" data-id="${id}">✔ Cek Jawaban</button></div><div class="out" id="o-${id}"></div><div class="ans" id="a-${id}" hidden></div></div>`;
    return h;
  }
  h += editor(id, l.start || '');
  h += `<div class="runbar">${l.type === 'pattern' ? '' : `<button class="btn" data-act="run" data-id="${id}">▶ Jalankan</button>`}<button class="btn ok" data-act="cek" data-id="${id}">✔ Cek Jawaban</button>
    <button class="btn" data-act="hint" data-id="${id}">💡 Petunjuk (0/${l.h.length})</button><button class="btn" data-act="ans" data-id="${id}">👀 Lihat Jawaban + Penjelasan</button></div>
    ${l.type === 'pattern' ? '<div class="hint" style="font-size:12.5px;color:var(--mut)">Soal ini perintah khusus server MySQL, jadi dicek dari tulisan perintahnya (bukan hasil tabel).</div>' : ''}
    <div class="out" id="o-${id}"></div><div class="hints" id="h-${id}"></div><div class="ans" id="a-${id}" hidden></div></div>`;
  return h;
}
function render(){
  const [cid, sid] = location.hash.replace('#', '').split('/');
  const c = CH.find(x => x.id === cid) || CH[0];
  if (CUR !== c) {
    CUR = c;
    let h = `<h1>${esc(c.title)}</h1>${c.lead ? `<p class="lead">${c.lead}</p>` : ''}${c.intro || ''}`;
    if (c.special === 'quiz') h += quizHTML();
    else if (c.special === 'cheat') h += c.html;
    else (c.subs || []).forEach(s => { h += subHTML(c, s); });
    const idx = CH.indexOf(c);
    h += `<div class="navbtm">${idx > 0 ? `<a class="btn" href="#${CH[idx - 1].id}">◀ ${esc(CH[idx - 1].title)}</a>` : '<span></span>'}${idx < CH.length - 1 ? `<a class="btn pri" href="#${CH[idx + 1].id}">${esc(CH[idx + 1].title)} ▶</a>` : ''}</div>`;
    $('#main').innerHTML = h;
    $$('#main textarea[data-ed]').forEach(syncEd);
    $$('#main [data-erd]').forEach(el => { el.innerHTML = ERD_SVG[el.dataset.erd]; });
    if (c.special === 'quiz') quizAfterRender();
    fillViz();
    if (!sid) window.scrollTo(0, 0);
  }
  renderSide();
  if (sid) { const el = document.getElementById('s-' + sid); if (el) el.scrollIntoView(); }
  $('#side').classList.remove('open');
}

/* ---------- aksi ---------- */
function getCode(id){ const ta = document.querySelector(`textarea[data-ed="${CSS.escape(id)}"]`); return ta ? ta.value : ''; }
function setCode(id, v){ const ta = document.querySelector(`textarea[data-ed="${CSS.escape(id)}"]`); if (ta) { ta.value = v; syncEd(ta); } }
function markSolved(id){
  if (STATE.solved[id]) return;
  STATE.solved[id] = 1; saveState();
  const el = document.getElementById('l-' + id);
  if (el) { el.classList.add('done'); el.querySelector('.badge').textContent = '✓ sudah benar'; }
  renderSide();
}
function doRun(id){
  const out = document.getElementById('o-' + id); if (!needEngine(out)) return;
  const r = REG[id]; const db = freshDB();
  try { if (r && r.setup) runSQL(db, r.setup); out.innerHTML = runHTML(runSQL(db, getCode(id)), { hl: r && r.hl }); } finally { db.close(); }
}
function doCek(id){
  const out = document.getElementById('o-' + id); const l = REG[id];
  if (l.type !== 'pattern' && !needEngine(out)) return;
  const code = getCode(id);
  const res = evaluate(l, code);
  let h = '';
  if (res.run && l.type !== 'pattern') h += runHTML(res.run.error ? res.run : { steps: res.run.steps, error: null });
  if (res.checked) h += `<div class="cap">Hasil pengecekan struktur/isi tabel setelah query kamu:</div>` + tableHTML(res.checked);
  h += res.ok ? `<div class="msg ok">🎉 Benar! ${res.note ? esc(res.note) : 'Hasil query kamu sama dengan kunci jawaban.'}</div>` : `<div class="msg err">✗ Belum tepat. ${esc(res.msg)}</div>`;
  out.innerHTML = h;
  if (res.ok) markSolved(id);
}
function doHint(id, btn){
  const l = REG[id]; if (l.shown >= l.h.length) return;
  l.shown++;
  document.getElementById('h-' + id).innerHTML = l.h.slice(0, l.shown).map((x, k) => `<div class="h"><b>Petunjuk ${k + 1}:</b> ${x}</div>`).join('');
  btn.textContent = `💡 Petunjuk (${l.shown}/${l.h.length})`;
  if (l.shown >= l.h.length) btn.disabled = true;
}
function doAns(id){
  const l = REG[id]; const box = document.getElementById('a-' + id);
  if (!box.hidden) { box.hidden = true; return; }
  let h = `<b>Kunci jawaban:</b>${codeBlock(l.a)}`;
  if (l.type !== 'pattern' && ENGINE_OK) {
    const db = freshDB();
    try { if (l.setup) runSQL(db, l.setup); const r = runSQL(db, l.a); h += runHTML(r); if (l.check) { const c = runSQL(db, l.check); h += '<div class="cap">Cek struktur/isi setelahnya:</div>' + runHTML(c); } } finally { db.close(); }
  }
  h += `<p>💬 ${l.ex}</p><div class="runbar"><button class="btn sm" data-act="copyans" data-id="${id}">Salin ke editor</button></div>`;
  box.innerHTML = h; box.hidden = false;
}
function doMC(id){
  const l = REG[id]; const sel = document.querySelector(`input[name="mc-${CSS.escape(id)}"]:checked`);
  const out = document.getElementById('o-' + id);
  if (!sel) { out.innerHTML = '<div class="msg info">Pilih salah satu jawaban dulu.</div>'; return; }
  const k = +sel.value;
  $$(`input[name="mc-${CSS.escape(id)}"]`).forEach(inp => { const lab = inp.parentElement; lab.classList.remove('right', 'wrong'); if (+inp.value === l.benar && k === l.benar) lab.classList.add('right'); });
  if (k === l.benar) { out.innerHTML = `<div class="msg ok">🎉 Benar! ${l.ex}</div>`; markSolved(id); }
  else { sel.parentElement.classList.add('wrong'); out.innerHTML = `<div class="msg err">✗ Belum tepat. Coba lagi ya.${l.h && l.h[0] ? ' Petunjuk: ' + l.h[0] : ''}</div>`; }
}

/* ---------- playground ---------- */
function renderPGTables(){
  if (!PGDB) return;
  const r = PGDB.exec("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name LIKE 'mdl_%', name");
  const names = r.length ? r[0].values.map(x => x[0]) : [];
  $('#pgTables').innerHTML = names.map(n => `<button class="btn sm" data-act="pgtbl" data-t="${esc(n)}">${esc(n)}</button>`).join('');
}
function pgRun(){
  const out = $('#pgOut'); if (!needEngine(out)) return;
  out.innerHTML = runHTML(runSQL(PGDB, getCode('pg')), {});
  renderPGTables();
}
function resetDB(){
  if (!ENGINE_OK) return;
  if (PGDB) PGDB.close(); PGDB = freshDB(); renderPGTables();
  $('#pgOut').innerHTML = '<div class="msg ok">✓ Database contoh dikembalikan ke kondisi awal.</div>';
  toast('Database contoh di-reset ke kondisi awal.');
}
function toast(t){ const d = document.createElement('div'); d.id = 'loading'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2200); }

/* ---------- quiz ---------- */
const QZ_KEY = 'belajarMySQL.quiz';
let QS = (() => { try { return JSON.parse(localStorage.getItem(QZ_KEY)) || {}; } catch (e) { return {}; } })();
function saveQS(){ try { localStorage.setItem(QZ_KEY, JSON.stringify(QS)); } catch (e) {} }
let quizTimer = null;
function quizHTML(){
  if (!QS.start) return `<div class="box"><p><b>${QUIZ.length} soal</b> campuran semua bab: pilihan ganda konsep + menulis query (dicek otomatis dari hasilnya). Waktu <b>60 menit</b>.</p>
    <p>Query tetap bisa kamu jalankan untuk lihat hasilnya, tapi benar/salahnya baru ketahuan setelah klik "Selesai & Nilai".</p>
    ${QS.last ? `<p>Skor terakhir kamu: <b>${QS.last}</b></p>` : ''}<button class="btn pri" data-act="quiz-start">Mulai simulasi tes ▶</button></div>`;
  let h = `<div class="quizbar"><span>⏱ <span class="timer" id="qTimer">60:00</span></span>${QS.done ? '' : '<button class="btn ok" data-act="quiz-submit">Selesai & Nilai</button>'}<button class="btn sm" data-act="quiz-reset">Ulangi dari awal</button></div>`;
  if (QS.done) h += quizResultHTML();
  QUIZ.forEach((q, i) => {
    const id = 'qz-' + i; REG[id] = Object.assign({ kind: 'quiz' }, q);
    const res = QS.done ? QS.res[i] : null;
    h += `<div class="qz ${res ? (res.ok ? 'right' : 'wrong') : ''}" id="qq-${i}"><div class="tag">Soal ${i + 1} · ${esc(q.bab)} · ${q.type === 'mc' ? 'pilihan ganda' : 'tulis query'}${res ? (res.ok ? ' · <b style="color:var(--ok)">✓ benar</b>' : ' · <b style="color:var(--bad)">✗ salah</b>') : ''}</div><div class="q">${q.q}</div>`;
    const ans = (QS.ans || {})[i];
    if (q.type === 'mc') {
      h += `<div class="mc">${q.opsi.map((o, k) => `<label class="${QS.done ? (k === q.benar ? 'right' : (+ans === k ? 'wrong' : '')) : ''}"><input type="radio" name="qz-${i}" value="${k}" ${+ans === k && ans !== undefined && ans !== null ? 'checked' : ''} ${QS.done ? 'disabled' : ''}> ${o}</label>`).join('')}</div>`;
    } else {
      h += editor(id, ans || '') + `<div class="runbar"><button class="btn sm" data-act="run" data-id="${id}">▶ Jalankan</button></div><div class="out" id="o-${id}"></div>`;
      if (QS.done) h += `<div class="ans"><b>Kunci:</b>${codeBlock(q.a)}${res && res.msg && !res.ok ? `<div class="msg err">${esc(res.msg)}</div>` : ''}</div>`;
    }
    if (QS.done) h += `<p>💬 ${q.ex}</p>`;
    h += '</div>';
  });
  return h;
}
function quizResultHTML(){
  const res = QS.res; const per = {};
  QUIZ.forEach((q, i) => { per[q.bab] = per[q.bab] || [0, 0]; per[q.bab][1]++; if (res[i].ok) per[q.bab][0]++; });
  const benar = res.filter(r => r.ok).length; const nilai = Math.round(benar / QUIZ.length * 100);
  const lemah = Object.entries(per).filter(([b, [d, t]]) => d / t < 0.7);
  return `<div class="box"><div class="score">${nilai}</div><p>${benar} dari ${QUIZ.length} soal benar.</p>
    <table class="cmp"><tr><th>Bab</th><th>Benar</th></tr>${Object.entries(per).map(([b, [d, t]]) => `<tr><td>${esc(b)}</td><td>${d}/${t} ${d / t < 0.7 ? '⚠' : '✓'}</td></tr>`).join('')}</table>
    ${lemah.length ? `<p><b>Bab yang masih lemah (di bawah 70%):</b> ${lemah.map(([b]) => esc(b)).join(', ')}. Ulangi materi dan latihannya, lalu coba tes lagi.</p>` : '<p><b>Mantap, semua bab sudah di atas 70%.</b> Baca Cheat Sheet sekali lagi sebelum tes.</p>'}</div>`;
}
function quizAfterRender(){
  clearInterval(quizTimer);
  if (!QS.start) return;
  const tick = () => {
    const el = $('#qTimer'); if (!el) { clearInterval(quizTimer); return; }
    const end = QS.done ? QS.doneAt : Date.now();
    let left = Math.max(0, QS.start + 60 * 60000 - end);
    const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
    el.textContent = `${pad(m)}:${pad(s)}`; el.classList.toggle('low', left < 5 * 60000);
    if (!QS.done && left <= 0) { clearInterval(quizTimer); quizSubmit(true); }
  };
  tick(); if (!QS.done) quizTimer = setInterval(tick, 1000);
}
function quizCollect(){
  QS.ans = QS.ans || {};
  QUIZ.forEach((q, i) => {
    if (q.type === 'mc') { const s = document.querySelector(`input[name="qz-${i}"]:checked`); if (s) QS.ans[i] = +s.value; }
    else QS.ans[i] = getCode('qz-' + i);
  });
  saveQS();
}
function quizSubmit(auto){
  if (!ENGINE_OK) { toast('Mesin SQL belum siap.'); return; }
  quizCollect();
  if (!auto && !confirm('Yakin selesai dan lihat nilai?')) return;
  QS.res = QUIZ.map((q, i) => {
    const a = QS.ans[i];
    if (q.type === 'mc') return { ok: a === q.benar };
    if (!a || !a.trim()) return { ok: false, msg: 'Belum dijawab.' };
    const r = evaluate(q, a); return { ok: r.ok, msg: r.msg || '' };
  });
  QS.done = true; QS.doneAt = Date.now();
  const benar = QS.res.filter(r => r.ok).length; QS.last = `${Math.round(benar / QUIZ.length * 100)} (${benar}/${QUIZ.length})`;
  saveQS(); CUR = null; render(); window.scrollTo(0, 0);
  if (auto) toast('Waktu habis! Jawaban otomatis dinilai.');
}

/* ---------- event ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const id = b.dataset.id, act = b.dataset.act;
  if (act === 'run') doRun(id);
  else if (act === 'restore') setCode(id, REG[id].sql);
  else if (act === 'cek') doCek(id);
  else if (act === 'hint') doHint(id, b);
  else if (act === 'ans') doAns(id);
  else if (act === 'copyans') setCode(id, REG[id].a);
  else if (act === 'mc') doMC(id);
  else if (act === 'pg') { $('#pg').classList.toggle('open'); }
  else if (act === 'pgclose') $('#pg').classList.remove('open');
  else if (act === 'pgrun') pgRun();
  else if (act === 'pgtbl') { setCode('pg', `SELECT * FROM ${b.dataset.t};`); pgRun(); }
  else if (act === 'reset') { resetDB(); }
  else if (act === 'theme') { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('belajarMySQL.theme', t); } catch (er) {} }
  else if (act === 'menu') $('#side').classList.toggle('open');
  else if (act === 'print') window.print();
  else if (act === 'quiz-start') { QS = { start: Date.now(), ans: {} }; saveQS(); CUR = null; render(); }
  else if (act === 'quiz-submit') quizSubmit(false);
  else if (act === 'quiz-reset') { if (confirm('Mulai ulang simulasi tes? Jawaban sekarang akan dihapus.')) { const last = QS.last; QS = { last }; saveQS(); clearInterval(quizTimer); CUR = null; render(); } }
  else if (act === 'corr-next' || act === 'corr-all' || act === 'corr-reset') {
    const el = b.closest('[data-viz="corr"]');
    el._i = act === 'corr-reset' ? -1 : act === 'corr-all' ? el._rows.length : Math.min(el._i + 1, el._rows.length);
    drawCorr(el);
  }
});
document.addEventListener('input', e => {
  const ta = e.target; if (ta.matches('textarea[data-ed]')) { syncEd(ta); if (ta.dataset.ed.startsWith('qz-') && QS.start && !QS.done) { QS.ans = QS.ans || {}; QS.ans[+ta.dataset.ed.slice(3)] = ta.value; saveQS(); } }
  if (ta.matches('input[type=radio][name^="qz-"]') && QS.start && !QS.done) { QS.ans = QS.ans || {}; QS.ans[+ta.name.slice(3)] = +ta.value; saveQS(); }
});
document.addEventListener('change', e => { const ta = e.target; if (ta.matches('input[type=radio][name^="qz-"]') && QS.start && !QS.done) { QS.ans = QS.ans || {}; QS.ans[+ta.name.slice(3)] = +ta.value; saveQS(); } });
document.addEventListener('keydown', e => {
  const ta = e.target; if (!ta.matches || !ta.matches('textarea[data-ed]')) return;
  if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); syncEd(ta); }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault(); const id = ta.dataset.ed;
    if (id === 'pg') pgRun(); else if (REG[id] && REG[id].type === 'pattern') doCek(id); else doRun(id);
  }
});
window.addEventListener('hashchange', render);
(function init(){
  let t = null; try { t = localStorage.getItem('belajarMySQL.theme'); } catch (e) {}
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  $('#pgEd').innerHTML = editor('pg', 'SHOW TABLES;\n\nSELECT * FROM mahasiswa;');
  syncEd($('#pgEd textarea'));
  render();
})();
