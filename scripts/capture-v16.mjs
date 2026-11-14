import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});

// capture reveal mid-animation: scroll About into view, snap immediately
await page.evaluate(()=>{
  const a=document.getElementById('about');
  a.scrollIntoView({block:'center',behavior:'instant'});
});
// capture at ~150ms (mid blur-in) and at settled
await page.waitForTimeout(150);
await page.screenshot({path:'/tmp/v16-shots/reveal-mid.png'});
await page.waitForTimeout(1200);
await page.screenshot({path:'/tmp/v16-shots/reveal-settled.png'});
console.log('✅ reveal mid + settled');

// About card hover (stronger tilt+lift)
const card = page.locator('li[class*="valueCard"]').first();
await card.evaluate(n=>{const r=n.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top-100,behavior:'instant'});});
await page.waitForTimeout(500);
await page.mouse.move(10,10); await page.waitForTimeout(300);
const vb=await card.evaluate(n=>{const r=n.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};});
await page.mouse.move(vb.x+vb.w*0.85, Math.min(vb.y+45,840));
await page.waitForTimeout(500);
await card.screenshot({path:'/tmp/v16-shots/about-hover-strong.png'});
console.log('✅ about hover strong');

await browser.close();
