import { chromium } from 'playwright';

const BASE = 'http://localhost:4173/';
const VIEWPORTS = [320, 375, 768, 1024, 1440, 1920];

const browser = await chromium.launch();
let pass = true;
const log = (ok, msg) => {
  if (!ok) pass = false;
  console.log(`${ok ? '✅' : '❌'} ${msg}`);
};

// 1) Footer renders + spotlight exists + pointer sets --px/--py
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // 즉시 스크롤로 footer를 뷰포트에 올림(scrollIntoView smooth는 완료 전 측정됨).
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await page.waitForTimeout(400);

  const footer = page.locator('footer');
  log(await footer.count() === 1, 'footer renders');

  const spotlight = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const sp = f?.querySelector('[class*="spotlight"]');
    return sp ? getComputedStyle(sp).position : null;
  });
  log(spotlight === 'absolute', `spotlight layer present (position=${spotlight})`);

  // simulate pointer move over footer → --px/--py should move off 0.
  const vbox = await footer.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: Math.max(r.top, 0), w: r.width, h: Math.min(r.height, window.innerHeight) };
  });
  const cx = vbox.x + vbox.w * 0.5;
  const cy = vbox.y + vbox.h * 0.5;
  await page.mouse.move(cx - 200, cy);
  await page.mouse.move(cx + 200, cy, { steps: 15 });
  await page.waitForTimeout(400);
  const vars = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const s = f.style;
    return { px: s.getPropertyValue('--px'), py: s.getPropertyValue('--py') };
  });
  const pxNum = parseFloat(vars.px || '0');
  log(Math.abs(pxNum) > 0.01, `pointer sets --px (got --px=${vars.px || 'unset'})`);

  // service link brand var present
  const svc = await page.evaluate(() => {
    const a = document.querySelector('footer a[class*="serviceLink"]');
    return a?.style.getPropertyValue('--svc') || null;
  });
  log(!!svc && svc.startsWith('#'), `service link --svc brand color set (${svc})`);

  await ctx.close();
}

// 2) reduce-motion: spotlight transform must be none (static)
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await page.waitForTimeout(400);
  const transform = await page.evaluate(() => {
    const sp = document.querySelector('footer [class*="spotlight"]');
    return sp ? getComputedStyle(sp).transform : null;
  });
  log(transform === 'none', `reduce-motion: spotlight transform none (got ${transform})`);
  await ctx.close();
}

// 3) overflow 0 across 6 viewports
for (const w of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return Math.max(0, d.scrollWidth - d.clientWidth);
  });
  log(overflow === 0, `viewport ${w}px overflow=${overflow}px`);
  await ctx.close();
}

await browser.close();
console.log(pass ? '\n✅ ALL PASS' : '\n❌ FAIL');
process.exit(pass ? 0 : 1);
