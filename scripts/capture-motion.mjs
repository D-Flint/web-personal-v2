import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { installMotionProbe, scene, settled } from '../tests/motion-probe.mjs';

const root='.impeccable/review';await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const results=[];
for(const touch of [false,true]){
  const name=touch?'touch':'desktop',viewport=touch?{width:390,height:844}:{width:1440,height:900};
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  await context.addInitScript(installMotionProbe);const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4322/');await page.evaluate(()=>document.fonts.ready);await settled(page);
  const temp=await fs.mkdtemp(`/tmp/portfolio-motion-${name}-`),frames=[],writes=[];
  const cdp=await context.newCDPSession(page);let recording=true;
  cdp.on('Page.screencastFrame',event=>{
    cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});
    if(!recording)return;
    const file=`${temp}/${String(frames.length).padStart(5,'0')}.jpg`;
    frames.push({file,time:event.metadata.timestamp});writes.push(fs.writeFile(file,Buffer.from(event.data,'base64')));
  });
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:85,maxWidth:viewport.width,maxHeight:viewport.height,everyNthFrame:1});
  const actions=[];const start=Date.now();
  async function mark(label){actions.push({label,seconds:(Date.now()-start)/1000,scene:await scene(page)});}
  async function scrollTo(top){
    await page.evaluate(async top=>{
      const from=scrollY,duration=650,start=performance.now();
      await new Promise(resolve=>{function step(now){const t=Math.min(1,(now-start)/duration),ease=t*t*(3-2*t);window.scrollTo({top:from+(top-from)*ease,behavior:'instant'});if(t<1)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});
    },top);await page.waitForTimeout(250);
  }
  for(const route of ['/','/projects']){
    if(route!=='/'){await page.goto(`http://localhost:4322${route}`);await page.evaluate(()=>document.fonts.ready);await settled(page);}
    const baseline=await scene(page);await mark(`${route} start`);
    const targets=route==='/'?['#work','#about','#contact','#about','#work']:['.catalog-item:nth-child(5)','.catalog-item:nth-child(15)','.catalog-item:nth-child(5)'];
    for(const selector of targets){
      const top=await page.locator(selector).evaluate(el=>el.getBoundingClientRect().top+scrollY-130);
      await scrollTo(top);await settled(page);await mark(`${route} ${selector}`);
      const now=await scene(page);
      if(now.bodies.some((b,i)=>Math.hypot(b.x-baseline.bodies[i].x,b.y-baseline.bodies[i].y)>.001))throw Error(`Scroll moved a body: ${name} ${selector}`);
    }
    await scrollTo(0);await settled(page);await mark(`${route} returned`);
    const snapshots=(await page.evaluate(()=>window.__deskFrames)).filter(frame=>frame.time>=baseline.time);
    results.push({name,route,frames:snapshots,errors});
    if(route==='/'){
      const before=await scene(page),index=before.bodies.findIndex(b=>b.alpha>.6&&b.y>160&&(touch||b.x<100));
      const piece=before.bodies[index];if(!piece)throw Error('No exposed piece');
      if(touch){await page.touchscreen.tap(piece.x,piece.y);await mark('nearby tap');}
      else{
        await page.mouse.move(piece.x+50,piece.y);await page.mouse.move(piece.x+25,piece.y,{steps:8});await page.waitForTimeout(250);await mark('nearby pointer');
        const current=(await scene(page)).bodies[index];
        await page.mouse.move(current.x,current.y);await page.mouse.down();
        for(let i=1;i<=20;i++){await page.mouse.move(current.x+i*4,current.y+i*2);await page.waitForTimeout(20);}
        await mark('drag');await page.mouse.up();await mark('release');
      }
      const release=performance.now();await settled(page);await mark(`settled in ${((performance.now()-release)/1000).toFixed(2)}s`);
      // Keep the hero's independent interaction in the recording.
      await page.locator('#scatter-particles').click();await page.waitForTimeout(100);await page.locator('#hero-particles[data-animating="false"]').waitFor({timeout:6000});await mark('hero reformed');
      results.push({name,route:'input',frames:(await page.evaluate(()=>window.__deskFrames)).filter(frame=>frame.time>=baseline.time),errors});
    }
  }
  await cdp.send('Page.stopScreencast');recording=false;await Promise.all(writes);
  const concat=frames.map((f,i)=>`file '${f.file}'\nduration ${Math.max(.016,Math.min(1,(frames[i+1]?.time??f.time+.2)-f.time)).toFixed(6)}`).join('\n');
  await fs.writeFile(`${temp}/frames.txt`,concat+'\n');
  const output=`${root}/motion-${name}.webm`;
  const encoded=spawnSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',`${temp}/frames.txt`,'-vf','fps=30','-c:v','libvpx-vp9','-crf','32','-b:v','0',output],{encoding:'utf8'});
  if(encoded.status!==0)throw Error(encoded.stderr);
  await fs.writeFile(`${root}/motion-${name}-actions.json`,JSON.stringify(actions,null,2)+'\n');
  console.log(JSON.stringify({name,recordedFrames:frames.length,video:output,errors,actions:actions.map(({label,seconds})=>({label,seconds}))}));
  await context.close();await fs.rm(temp,{recursive:true});
}
await fs.writeFile(`${root}/motion-samples.json`,JSON.stringify(results)+'\n');await browser.close();
