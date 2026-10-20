// Bounded review of every home schematic: visual beats plus real wheel/touch input.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { createAssemblyTimeline } from '../src/utils/projectAssembly.ts';
const out='.impeccable/review/eye-flow';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const results=[];
try {
async function seek(article,p) {
 await article.evaluate((el,p)=>{
  const stage=el.querySelector('[data-assembly-stage]');
  scrollTo({top:el.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(stage).top)+(el.getBoundingClientRect().height-stage.getBoundingClientRect().height)*p,behavior:'instant'});
 },p);
 await article.page().waitForTimeout(60);
}
for(const width of [1440,390])for(const theme of ['light','dark']) {
 const height=width===1440?900:844;
 const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390});
 await context.addInitScript(theme=>localStorage.setItem('theme',theme),theme);
 const page=await context.newPage(),errors=[],warnings=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(['warning','error'].includes(m.type()))warnings.push(m.text());});
 page.on('requestfailed',r=>failures.push(r.url()));
 await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 for(const article of await page.locator('[data-project-assembly]').all()) {
  const preview=JSON.parse(await article.locator('[data-assembly-config]').textContent());
  const timeline=createAssemblyTimeline(preview),frames=[];
  const samples=timeline.nodes.map((node,index)=>{
   const incoming=preview.edges.findIndex(edge=>edge.to===preview.nodes[index].id);
   return incoming>=0?(timeline.wires[incoming].start+timeline.wires[incoming].end)/2:(node.start+node.end)/2;
  });
  for(const p of [...samples,.9]) {
   await seek(article,p);
   const buffer=await article.locator(`.assembly-${width===390?'mobile':'desktop'}`).screenshot();
   frames.push(await sharp(buffer).resize(480,360,{fit:'contain',background:theme==='light'?'#f4f1e9':'#080808'}).png().toBuffer());
  }
  const columns=4,rows=Math.ceil(frames.length/columns);
  await sharp({create:{width:columns*480,height:rows*360,channels:3,background:theme==='light'?'#f4f1e9':'#080808'}})
   .composite(frames.map((input,i)=>({input,left:(i%columns)*480,top:Math.floor(i/columns)*360})))
   .png().toFile(`${out}/beats-${width}-${theme}-${preview.id}.png`);
  await page.screenshot({path:`${out}/complete-${width}-${theme}-${preview.id}.png`});
 }
 results.push({width,theme,errors,warnings,failures,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});
 await context.close();
}
await writeFile(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');
// Continuous temporal evidence, all three studies. No seek occurs within a run.
for(const width of [1440,390]) {
 const height=width===1440?900:844;
 const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390,recordVideo:{dir:out,size:{width,height}}});
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const cdp=width===390?await context.newCDPSession(page):null;
 const runs=[];
 for(const article of await page.locator('[data-project-assembly]').all()) {
  await seek(article,0);
  const targetProgress=.94;
  const distance=await article.evaluate(el=>el.getBoundingClientRect().height-el.querySelector('[data-assembly-stage]').getBoundingClientRect().height);
  if(await article.getAttribute('data-assembly-enhanced')!=='true'||!Number.isFinite(distance)||distance<=0)throw Error('Recording requires an enhanced assembly with positive scroll travel');
  // Touch slop and input timing can reduce travel; keep a measured, bounded margin.
  const inputDistance=cdp?100:90;
  const maxSteps=Math.ceil(distance*targetProgress/inputDistance*1.5)+2;
  const states=[];
  for(let step=0;step<maxSteps;step++) {
   if(cdp) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:620}]});
    for(let y=600;y>=500;y-=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});await page.waitForTimeout(20);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   } else {await page.mouse.move(700,450);await page.mouse.wheel(0,90);}
   await page.waitForTimeout(90);
   const progress=Number(await article.getAttribute('data-assembly-progress'));
   if(!Number.isFinite(progress))throw Error('Recording lost assembly progress');
   states.push(progress);
   if(progress>=targetProgress)break;
  }
  const id=await article.getAttribute('data-project-assembly');
  const reachedTarget=states.at(-1)>=targetProgress;
  runs.push({id,distance,targetProgress,maxSteps,reachedTarget,states});
  if(!reachedTarget) {
   results.push({width,runs});
   await writeFile(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');
   await context.close();
   throw Error(`Assembly ${id} at ${width}px reached ${states.at(-1)}, expected at least ${targetProgress} after ${maxSteps} inputs`);
  }
  // Keep the completed view onscreen for one full directed-packet cycle.
  const cycleDuration=await article.locator(`.assembly-${width===390?'mobile':'desktop'} [data-assembly-packet]`).evaluateAll(paths=>Math.max(0,...paths.flatMap(path=>path.getAnimations().filter(animation=>animation.playState==='running').map(animation=>Number(animation.effect.getTiming().duration)))));
  if(!Number.isFinite(cycleDuration)||cycleDuration<=0)throw Error(`Assembly ${id} has no running completed-state loop`);
  await page.waitForTimeout(cycleDuration);
 }
 const video=page.video();await context.close();await video.saveAs(`${out}/scroll-${width}.webm`);
 results.push({width,runs});
}
} finally {
 await browser.close();
}
await writeFile(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
