const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const initSqlJs = require('sql.js');
const html = fs.readFileSync(path.join(__dirname, '..', 'belajar-mysql.html'), 'utf8');
const errors = [];
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/x.html',
  beforeParse(w) {
    w.initSqlJs = () => initSqlJs(); w.matchMedia = () => ({ matches: false });
    w.TextEncoder = TextEncoder; w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = function () {};
    w.CSS = { escape: s => String(s).replace(/([^\w-])/g, '\$1') };
    w.confirm = () => true; w.print = () => {};
    w.addEventListener('error', e => errors.push(e.message));
  } });
const w = dom.window, d = w.document;
w.console.error = (...a) => errors.push(a.join(' '));
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  for (let i = 0; i < 50 && d.getElementById('loading') && /Memuat/.test(d.getElementById('loading').textContent); i++) await wait(100);
  const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  let ok = 0, bad = [];
  const ids = [...d.querySelectorAll('nav.side > a')].map(a => a.getAttribute('href'));
  for (const h of ids) {
    w.location.hash = h; w.dispatchEvent(new w.HashChangeEvent('hashchange')); await wait(30);
    // jalankan semua contoh
    for (const b of d.querySelectorAll('#main [data-act="run"]')) { click(b); }
    // cek semua latihan pakai kunci
    for (const b of d.querySelectorAll('#main [data-act="ans"]')) {
      const id = b.dataset.id; click(d.querySelector(`[data-act="copyans"][data-id="${id}"]`) ? b : b);
      const cp = d.querySelector(`[data-act="copyans"][data-id="${id}"]`); if (cp) click(cp);
      click(d.querySelector(`[data-act="cek"][data-id="${id}"]`));
      const out = d.getElementById('o-' + id).textContent;
      if (/Benar!/.test(out)) ok++; else bad.push(id + ': ' + out.slice(0, 120));
    }
    for (const b of d.querySelectorAll('#main [data-act="hint"]')) { click(b); click(b); click(b); if (!b.disabled) bad.push('hint ' + b.dataset.id); break; }
    if (d.querySelectorAll('#main .data').length === 0 && !/quiz|cheat/.test(h) && h !== '#bab8') {}
  }
  // viz checks
  w.location.hash = '#bab4'; w.dispatchEvent(new w.HashChangeEvent('hashchange')); await wait(30);
  const jl = d.querySelectorAll('[data-viz="joinlist"] table').length;
  w.location.hash = '#bab5'; w.dispatchEvent(new w.HashChangeEvent('hashchange')); await wait(30);
  const corr = d.querySelector('[data-viz="corr"] [data-act="corr-next"]'); click(corr); click(corr);
  const stepMsg = d.querySelector('[data-viz="corr"] .step-msg').textContent.slice(0, 90);
  // playground
  click(d.querySelector('[data-act="pgrun"]')); const pg = d.getElementById('pgOut').textContent.slice(0, 60);
  // quiz
  w.location.hash = '#bab8'; w.dispatchEvent(new w.HashChangeEvent('hashchange')); await wait(30);
  click(d.querySelector('[data-act="quiz-start"]')); await wait(30);
  const r0 = d.querySelector('input[name="qz-0"][value="1"]'); r0.checked = true; r0.dispatchEvent(new w.Event('change', { bubbles: true }));
  const ta = d.querySelector('textarea[data-ed="qz-4"]'); ta.value = 'SELECT id, nim, kode_mk FROM krs WHERE nilai IS NULL;'; ta.dispatchEvent(new w.Event('input', { bubbles: true }));
  click(d.querySelector('[data-act="quiz-submit"]')); await wait(30);
  const score = d.querySelector('.score') && d.querySelector('.score').textContent;
  console.log({ latihanBenar: ok, gagal: bad, joinlistTables: jl, stepMsg, pg, quizScore: score, progress: d.getElementById('progTxt').textContent, errors });
  process.exit(0);
})();
