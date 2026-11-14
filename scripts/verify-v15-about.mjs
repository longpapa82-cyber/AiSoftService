import { chromium } from 'playwright';
const BASE = 'http://localhost:4173/';
const browser = await chromium.launch();
let pass = true;
const log = (ok,m)=>{if(!ok)pass=false;console.log(`${ok?'✅':'❌'} ${m}`);};

// 1) hover sets --tilt-x on a value card
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  await page.goto(BASE,{waitUntil:'networkidle'});
  const card = page.locator('[class*="valueCard"]').first();
  log(await card.count()>=1,'value cards render');
  // 카드를 뷰포트 상단 근처로 스크롤(카드가 커서 중앙이 뷰포트 밖일 수 있음).
  await card.evaluate(el=>{const r=el.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top-60,behavior:'instant'});});
  await page.waitForTimeout(400);
  const vbox = await card.evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};});
  const cx=vbox.x+vbox.w*0.5, cy=Math.min(vbox.y+60, 840);
  await page.mouse.move(cx-30, cy);
  await page.mouse.move(cx+30, cy+15,{steps:12});
  await page.waitForTimeout(300);
  const tiltX = await card.evaluate(el=>el.style.getPropertyValue('--tilt-x'));
  log(tiltX && tiltX!=='0deg', `hover sets --tilt-x (${tiltX||'unset'})`);
  await ctx.close();
}
// 2) reduce-motion: card hover transform none
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE,{waitUntil:'networkidle'});
  const card = page.locator('[class*="valueCard"]').first();
  await card.evaluate(el=>{const r=el.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top-60,behavior:'instant'});});
  await page.waitForTimeout(400);
  const vbox = await card.evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};});
  await page.mouse.move(vbox.x+vbox.w*0.5, Math.min(vbox.y+60,840));
  await page.waitForTimeout(200);
  const tf = await card.evaluate(el=>getComputedStyle(el).transform);
  log(tf==='none', `reduce-motion: card transform none on hover (${tf})`);
  await ctx.close();
}
// 3) overflow across viewports
for(const w of [320,375,768,1024,1440,1920]){
  const ctx=await browser.newContext({viewport:{width:w,height:900}});
  const page=await ctx.newPage();
  await page.goto(BASE,{waitUntil:'networkidle'});
  const o=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
  log(o===0,`viewport ${w}px overflow=${o}px`);
  await ctx.close();
}
await browser.close();
console.log(pass?'\n✅ ALL PASS':'\n❌ FAIL');
process.exit(pass?0:1);
