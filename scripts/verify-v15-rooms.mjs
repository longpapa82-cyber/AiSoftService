import { chromium } from 'playwright';
const BASE='http://localhost:4173/';
const browser=await chromium.launch();
let pass=true;
const log=(ok,m)=>{if(!ok)pass=false;console.log(`${ok?'✅':'❌'} ${m}`);};

// helper: scroll an element near viewport top, hover its center, return a probe
async function hoverProbe(page, selector, probeFn) {
  const el = page.locator(selector).first();
  await el.evaluate(n=>{const r=n.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top-80,behavior:'instant'});});
  await page.waitForTimeout(350);
  const vb = await el.evaluate(n=>{const r=n.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};});
  const cx=vb.x+vb.w*0.5, cy=Math.min(vb.y+Math.min(vb.h*0.4,80), 840);
  await page.mouse.move(cx-20,cy);
  await page.mouse.move(cx+20,cy+10,{steps:12});
  await page.waitForTimeout(300);
  return el.evaluate(probeFn);
}

const ctx=await browser.newContext({viewport:{width:1440,height:900}});
const page=await ctx.newPage();
await page.goto(BASE,{waitUntil:'networkidle'});

// 1) phone tilt — --tilt-x set on hover
const tiltX = await hoverProbe(page, '[class*="phone"]', el=>el.style.getPropertyValue('--tilt-x')||'(unset)');
log(tiltX && tiltX!=='(unset)' && tiltX!=='0deg', `phone hover sets --tilt-x (${tiltX})`);

// 2) highlight chip hover lift — li.highlight computed transform not 'none' (translateY -2px)
const chipTf = await hoverProbe(page, 'li[class*="highlight"]', el=>getComputedStyle(el).transform);
log(chipTf && chipTf!=='none', `highlight chip hover transform applied (${chipTf})`);

await ctx.close();

// 3) reduce-motion: phone + chip hover transform none
{
  const rctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const rpage=await rctx.newPage();
  await rpage.goto(BASE,{waitUntil:'networkidle'});
  const phoneTf = await hoverProbe(rpage, '[class*="phone"]', el=>el.style.getPropertyValue('--tilt-x')||'0deg');
  log(phoneTf==='0deg'||phoneTf==='(unset)'||phoneTf==='', `reduce-motion: phone --tilt-x unchanged (${phoneTf||'empty'})`);
  await rctx.close();
}

// 4) overflow 6 viewports
for(const w of [320,375,768,1024,1440,1920]){
  const vctx=await browser.newContext({viewport:{width:w,height:900}});
  const vp=await vctx.newPage();
  await vp.goto(BASE,{waitUntil:'networkidle'});
  const o=await vp.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
  log(o===0,`viewport ${w}px overflow=${o}px`);
  await vctx.close();
}

await browser.close();
console.log(pass?'\n✅ ALL PASS':'\n❌ FAIL');
process.exit(pass?0:1);
