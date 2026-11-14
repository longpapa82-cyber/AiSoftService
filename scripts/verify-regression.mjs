import { chromium } from 'playwright';
const browser = await chromium.launch();
let pass = true;
const log = (ok, m) => { if (!ok) pass = false; console.log(`${ok?'✅':'❌'} ${m}`); };

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// 1) Hero parallax still works (--px set on hero after pointer move)
const hero = page.locator('section').first();
const hbox = await hero.evaluate(el => { const r = el.getBoundingClientRect(); return {x:r.left,y:Math.max(r.top,0),w:r.width,h:Math.min(r.height,window.innerHeight)}; });
await page.mouse.move(hbox.x + hbox.w*0.3, hbox.y + hbox.h*0.4);
await page.mouse.move(hbox.x + hbox.w*0.7, hbox.y + hbox.h*0.6, { steps: 15 });
await page.waitForTimeout(400);
const heroPx = await page.evaluate(() => {
  // hero is the usePointerParallax target — find element with --px set
  const els = [...document.querySelectorAll('section, header, footer')];
  const withPx = els.filter(e => e.style.getPropertyValue('--px'));
  return withPx.map(e => e.tagName + '=' + e.style.getPropertyValue('--px'));
});
log(heroPx.length > 0, `Hero parallax --px set after move (${heroPx.join(', ') || 'none'})`);

// 2) reveal: SectionHeader / About reveal elements get .is-visible when scrolled
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.4, behavior: 'instant' }));
await page.waitForTimeout(600);
const revealedCount = await page.evaluate(() => document.querySelectorAll('.is-visible').length);
log(revealedCount > 0, `reveal .is-visible applied on scroll (${revealedCount} elements)`);

await browser.close();
console.log(pass ? '\n✅ REGRESSION PASS' : '\n❌ REGRESSION FAIL');
process.exit(pass ? 0 : 1);
