import { chromium } from 'playwright';
const browser=await chromium.launch();
let pass=true;
const log=(ok,m)=>{if(!ok)pass=false;console.log(`${ok?'✅':'❌'} ${m}`);};
for(const w of [390, 430, 600, 820]){
  const ctx=await browser.newContext({viewport:{width:w,height:1600},deviceScaleFactor:1});
  const page=await ctx.newPage();
  await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
  await page.waitForTimeout(800); // wait past any reveal delay
  // sample twice 1.5s apart to prove NO movement (no float)
  const snap=async()=>page.evaluate(()=>{
    const grid=document.querySelector('[class*="previewGrid"]');
    const gt=grid.getBoundingClientRect().top;
    return [...grid.children].map(li=>Math.round(li.getBoundingClientRect().top-gt));
  });
  const t1=await snap(); await page.waitForTimeout(1500); const t2=await snap();
  const stable = JSON.stringify(t1)===JSON.stringify(t2);
  // check left/right pairs aligned: items 1&2, 3&4, ... (excluding wide 0 and last)
  const rows=await page.evaluate(()=>{
    const grid=document.querySelector('[class*="previewGrid"]');
    const gt=grid.getBoundingClientRect().top;
    const tops=[...grid.children].map(li=>Math.round(li.getBoundingClientRect().top-gt));
    // pairs: (1,2),(3,4),(5,6),(7,8),(9,10)
    let maxDiff=0;
    for(let i=1;i+1<tops.length-1;i+=2) maxDiff=Math.max(maxDiff, Math.abs(tops[i]-tops[i+1]));
    return maxDiff;
  });
  log(stable && rows===0, `vw ${w}px: 좌우 정렬 어긋남=${rows}px, 부유 없음(안정)=${stable}`);
  await ctx.close();
}
await browser.close();
console.log(pass?'\n✅ ALL PASS — 카드 완전 정렬·부유 없음':'\n❌ FAIL');
process.exit(pass?0:1);
