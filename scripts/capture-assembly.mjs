// Reproducible bounded animation review: real wheel/touch input plus frame samples.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out=process.env.ASSEMBLY_REVIEW_DIR || '.impeccable/review/assembly';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const measurements=[];
const durations=process.env.ASSEMBLY_REVIEW_SCREENS ? process.env.ASSEMBLY_REVIEW_SCREENS.split(',').map(Number) : [2,4];
for(const width of [1440,390])for(const screens of durations) {
 const context=await browser.newContext({viewport:{width,height:width===1440?900:844},isMobile:width===390,hasTouch:width===390,recordVideo:{dir:out,size:{width,height:width===1440?900:844}}});
 const page=await context.newPage();const errors=[],warnings=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning'||m.type()==='error')warnings.push(m.text());});
 await page.goto('http://127.0.0.1:4322/');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(screens=>{for(const el of document.querySelectorAll('[data-project-assembly]'))el.style.setProperty('--assembly-screens',String(screens));window.dispatchEvent(new Event('pageshow'));},screens);
 const article=page.locator('[data-project-assembly]').first();
 await article.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-180,behavior:'instant'}));await page.waitForTimeout(200);
 await page.evaluate(()=>{
  window.reviewFrames=[];window.reviewLongFrames=[];window.reviewRunning=true;
  let last=performance.now();const sample=now=>{window.reviewFrames.push(now-last);last=now;if(window.reviewRunning)requestAnimationFrame(sample);};requestAnimationFrame(sample);
  try{new PerformanceObserver(list=>window.reviewLongFrames.push(...list.getEntries().map(e=>({duration:e.duration,blocking:e.blockingDuration,forcedLayout:e.scripts?.reduce((n,s)=>n+s.forcedStyleAndLayoutDuration,0)})))).observe({type:'long-animation-frame',buffered:false});}catch{}
 });
 const cdp=width===390?await context.newCDPSession(page):null;
 const states=[];
 for(let step=0;step<(screens===2?8:22);step++) {
  if(cdp) {
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:630}]});
   for(let y=610;y>=470;y-=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});await page.waitForTimeout(20);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  } else {await page.mouse.move(700,450);await page.mouse.wheel(0,180);}
  await page.waitForTimeout(250);
  states.push(await article.getAttribute('data-assembly-progress'));
  if(step===2||step===5||step===9)await page.screenshot({path:`${out}/pacing-${width}-${screens}-${step}.png`});
 }
 await page.waitForTimeout(150);
 const performanceData=await page.evaluate(()=>{window.reviewRunning=false;const a=window.reviewFrames.slice(2).sort((a,b)=>a-b);return {frames:a.length,p95:a[Math.floor(a.length*.95)],max:a.at(-1),overBudget:a.filter(n=>n>16.7).length,longFrames:window.reviewLongFrames};});
 const geometry=await article.evaluate(el=>({article:el.getBoundingClientRect().height,stage:el.querySelector('[data-assembly-stage]').getBoundingClientRect().height}));
 const video=page.video();await context.close();await video.saveAs(`${out}/pacing-${width}-${screens}.webm`);
 measurements.push({width,screens,geometry,states,performance:performanceData,errors,warnings});
}
await writeFile(`${out}/pacing-results.json`,JSON.stringify(measurements,null,2)+'\n');await browser.close();
console.log(JSON.stringify(measurements.map(({width,screens,states,performance,errors,warnings})=>({width,screens,states,performance,errors,warnings})),null,2));
