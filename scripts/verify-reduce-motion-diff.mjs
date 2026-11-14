import { chromium } from 'playwright';
const browser = await chromium.launch();

// collect identity of "stuck invisible" elements under reduce-motion:
// elements with computed opacity ~0 (or transform hiding them) that are NOT hover-only tooltips
async function collect(url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  // scroll through whole page to trigger all reveals
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,30)); }
    window.scrollTo({top:0,behavior:'instant'});
  });
  await page.waitForTimeout(800);
  const items = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      const op = parseFloat(s.opacity);
      if (op < 0.05) {
        // identity: tag + semantic class name.
        // CSS-module 해시(_xxxxx_)는 빌드마다 달라지므로 제거해 의미 기반으로 비교
        // (예: _soundRing_c46ul_1983 → soundRing). 해시가 포함되면 모든 변경이 거짓 양성.
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || '';
        const first = String(cls).trim().split(/\s+/)[0] || '(none)';
        const semantic = first.replace(/^_?([a-zA-Z][a-zA-Z0-9]*)_[a-z0-9]{5,6}_\d+$/, '$1');
        out.push(`${el.tagName.toLowerCase()}.${semantic}`);
      }
    }
    return out;
  });
  await ctx.close();
  // tally by identity
  const tally = {};
  for (const k of items) tally[k] = (tally[k]||0)+1;
  return tally;
}

const base = await collect('http://localhost:4174/');
const cur = await collect('http://localhost:4173/');

const keys = [...new Set([...Object.keys(base), ...Object.keys(cur)])].sort();
console.log('identity'.padEnd(42), 'base', 'cur', 'delta');
let newStuck = [];
for (const k of keys) {
  const b = base[k]||0, c = cur[k]||0;
  if (b !== c) {
    console.log(k.padEnd(42), String(b).padStart(4), String(c).padStart(4), (c-b>0?'+':'')+(c-b));
    if (c > b) newStuck.push(`${k} (+${c-b})`);
  }
}
const baseTotal = Object.values(base).reduce((a,b)=>a+b,0);
const curTotal = Object.values(cur).reduce((a,b)=>a+b,0);
console.log(`\nbaseTotal=${baseTotal} curTotal=${curTotal} delta=${curTotal-baseTotal}`);
console.log(newStuck.length ? `\n⚠️ NEW stuck identities: ${newStuck.join(', ')}` : '\n✅ No new stuck-invisible identities vs baseline');
await browser.close();
