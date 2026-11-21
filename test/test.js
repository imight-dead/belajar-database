const fs = require('fs'), path = require('path'), vm = require('vm');
const initSqlJs = require('sql.js');
const SRC = path.join(__dirname, '..', 'src');
const files = ['engine.js', 'c0.js', 'c2.js', 'c3.js', 'c4.js', 'c5.js', 'c7.js', 'c8.js', 'c9.js'];
const ctx = { console, TextEncoder, module: undefined };
vm.createContext(ctx);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
const { CH, QUIZ } = vm.runInContext('({CH, QUIZ})', ctx);
const E = vm.runInContext('({buildSeed, freshDB, runSQL, lastResult, evaluate, compareResults})', ctx);
const fmt = r => r ? `[${r.columns.join(',')}] ${r.values.length} baris: ` + r.values.slice(0, 20).map(v => v.join('|')).join(' ; ') : '(tidak ada tabel)';
initSqlJs().then(SQL => {
  E.buildSeed(SQL);
  let fails = 0, nEx = 0, nLat = 0, out = [];
  const bad = m => { fails++; console.log('FAIL', m); };
  const emDash = JSON.stringify({ CH, QUIZ }).includes('—'); if (emDash) bad('em dash ditemukan');
  for (const c of CH) for (const s of (c.subs || [])) {
    (s.contoh || []).forEach((e, i) => {
      nEx++;
      const db = E.freshDB(); const r = E.runSQL(db, e.sql); db.close();
      if (r.error && !e.err) bad(`contoh ${s.id}#${i + 1}: ${r.error.msg}`);
      if (!r.error && e.err) bad(`contoh ${s.id}#${i + 1} diharapkan error tapi sukses`);
      const lr = E.lastResult(r);
      out.push(`C ${s.id}#${i + 1}${r.error ? ' ERR ' + r.error.msg : ''} ${fmt(lr)}`);
      if (!r.error && lr && lr.values.length === 0 && !/= NULL|NOT IN \(SELECT id_dosen FROM matakuliah\);/.test(e.sql)) bad(`contoh ${s.id}#${i + 1}: hasil kosong`);
    });
    (s.latihan || []).forEach((l, i) => {
      nLat++;
      const id = `${s.id}-${i}`;
      if (!l.lv || !l.q) bad(`latihan ${id} tanpa lv/q`);
      if (l.type === 'mc') { if (!(l.benar >= 0 && l.benar < l.opsi.length)) bad(`mc ${id}`); return; }
      if (!l.h || l.h.length < 3) bad(`latihan ${id} petunjuk < 3`);
      const r = E.evaluate(l, l.a);
      if (!r.ok) { bad(`latihan ${id}: kunci gagal: ${r.msg}`); return; }
      if (l.type === 'pattern') { if (E.evaluate(l, 'SELECT 1').ok) bad(`pattern ${id} menerima jawaban salah`); return; }
      const got = r.checked || E.lastResult(r.run);
      out.push(`L ${id} ${fmt(got)}`);
      if (!got || !got.values.length) bad(`latihan ${id}: hasil kunci kosong`);
      if (E.evaluate(l, 'SELECT 1 AS x').ok) bad(`latihan ${id}: pengecek menerima SELECT 1`);
    });
  }
  QUIZ.forEach((q, i) => {
    if (q.type === 'mc') { if (!(q.benar >= 0 && q.benar < q.opsi.length)) bad('quiz mc ' + i); return; }
    const r = E.evaluate(q, q.a); if (!r.ok) bad(`quiz ${i + 1}: ${r.msg}`);
    const got = r.checked || (r.run && E.lastResult(r.run)); out.push(`Q ${i + 1} ${fmt(got)}`);
    if (!got || !got.values.length) bad(`quiz ${i + 1} kosong`);
    if (E.evaluate(q, 'SELECT 1').ok) bad(`quiz ${i + 1} menerima SELECT 1`);
  });
  // uji pembanding
  const T = (a, b, ord) => E.compareResults({ columns: a[0], values: a[1] }, { columns: b[0], values: b[1] }, ord).ok;
  if (!T([['a', 'b'], [[1, 'x'], [2, 'y']]], [['b', 'a'], [['y', 2], ['x', 1]]], false)) bad('compare kolom tertukar');
  if (T([['a'], [[1], [2]]], [['a'], [[2], [1]]], true)) bad('compare order');
  if (!T([['a'], [[3.2599999]]], [['a'], [[3.26]]], false)) bad('compare float');
  fs.writeFileSync(path.join(__dirname, 'hasil.txt'), out.join('\n'));
  console.log(`contoh: ${nEx}, latihan: ${nLat}, quiz: ${QUIZ.length}, gagal: ${fails}`);
  process.exit(fails ? 1 : 0);
});
