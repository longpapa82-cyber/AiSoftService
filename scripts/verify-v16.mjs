import { chromium } from 'playwright';
const BASE='http://localhost:4173/';
const browser=await chromium.launch();
let pass=true;
const log=(ok,m)=>{if(!ok)pass=false;console.log(`${ok?'✅':'❌'} ${m}`);};

// overflow across viewports
for(const w of [320,375,768,1024,1440,1920]){
  const ctx=await browser.newContext({viewport:{width:w,height:900}});
  const page=await ctx.newPage();
  await page.goto(BASE,{waitUntil:'networkidle'});
  // scroll full page to trigger all reveals/animations
  await page.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<=h;y+=700){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,20));}});
  const o=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
  log(o===0,`viewport ${w}px overflow=${o}px`);
  await ctx.close();
}

// reduce-motion: reveal elements must NOT be stuck (opacity 1, no blur)
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  await page.goto(BASE,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<=h;y+=700){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,20));}window.scrollTo({top:0,behavior:'instant'});});
  await page.waitForTimeout(500);
  // count .reveal elements still hidden (opacity<0.5 or blurred)
  const stuck = await page.evaluate(()=>{
    let n=0;
    for(const el of document.querySelectorAll('.reveal, .reveal-stagger > *')){
      const s=getComputedStyle(el);
      if(parseFloat(s.opacity)<0.5 || (s.filter && s.filter.includes('blur') && s.filter!=='none')) n++;
    }
    return n;
  });
  log(stuck===0, `reduce-motion: reveal stuck/blurred = ${stuck} (must be 0)`);
  // also check hero cards float animation OFF in reduce-motion
  const heroAnim = await page.evaluate(()=>{
    const c=document.querySelector('[class*="previewCard"]');
    return c? getComputedStyle(c).animationName : 'none';
  });
  log(heroAnim==='none', `reduce-motion: hero card float off (${heroAnim})`);
  await ctx.close();
}

// normal motion: reveal settles to opacity 1 (not stuck)
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  await page.goto(BASE,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<=h;y+=700){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));}});
  await page.waitForTimeout(1500);
  const hidden = await page.evaluate(()=>{
    let n=0;
    for(const el of document.querySelectorAll('.reveal')){
      if(parseFloat(getComputedStyle(el).opacity)<0.5) n++;
    }
    return n;
  });
  log(hidden===0, `normal: all reveals settled visible (hidden=${hidden})`);
  await ctx.close();
}

await browser.close();
console.log(pass?'\n✅ ALL PASS':'\n❌ FAIL');
process.exit(pass?0:1);
