import { chromium } from 'playwright';
const browser=await chromium.launch();
let pass=true;
const log=(ok,m)=>{if(!ok)pass=false;console.log(`${ok?'✅':'❌'} ${m}`);};
for(const w of [320,375,400,768,800,1024,1440,1920]){
  const ctx=await browser.newContext({viewport:{width:w,height:1000}});
  const page=await ctx.newPage();
  await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
  await page.waitForTimeout(300);
  const r = await page.evaluate(()=>{
    const grid=document.querySelector('[class*="previewGrid"]');
    const overflow=Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth);
    if(!grid) return {overflow, err:'no grid'};
    // check all non-wide cards in same grid have equal height per column pair
    const items=[...grid.children].map(li=>Math.round(li.getBoundingClientRect().height));
    const uniq=[...new Set(items)];
    return {overflow, heights:uniq};
  });
  const overflowOk = r.overflow===0;
  // all cards should be one of at most 1-2 heights (wide cards may differ slightly)
  const heightOk = r.heights && r.heights.length<=2;
  log(overflowOk && heightOk, `vw ${w}px: overflow=${r.overflow} heights=${JSON.stringify(r.heights)}`);
  await ctx.close();
}
await browser.close();
console.log(pass?'\n✅ ALL PASS':'\n❌ FAIL');
process.exit(pass?0:1);
