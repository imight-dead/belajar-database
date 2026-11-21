const fs = require('fs'), path = require('path');
const S = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const JS_FILES = ['engine.js', 'c0.js', 'c2.js', 'c3.js', 'c4.js', 'c5.js', 'c7.js', 'c8.js', 'c9.js', 'ui.js'];
const js = JS_FILES.map(f => `/* ---- ${f} ---- */\n` + S(f)).join('\n');
if (/<\/script/i.test(js)) throw new Error('</script> di dalam JS');
let html = S('index.html').replace('/*CSS*/', () => S('style.css')).replace('/*JS*/', () => js);
fs.writeFileSync(path.join(__dirname, 'belajar-mysql.html'), html);
console.log('OK', (html.length / 1024).toFixed(0) + ' KB');
module.exports = { JS_FILES };
