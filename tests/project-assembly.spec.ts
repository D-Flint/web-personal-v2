import { test, expect, type Locator, type Page } from '@playwright/test';
import { nodeProgress, wireProgress, validatePreview } from '../src/utils/projectAssembly';
import { projectPreviews } from '../src/data/projectPreviews';

const articles = (page:Page) => page.locator('[data-project-assembly]');
async function ready(page:Page) {
  await page.goto('/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await expect(articles(page).first()).toHaveAttribute('data-assembly-progress');
}
async function seek(article:Locator,p:number) {
  await article.evaluate((el,p)=>{
    const stage=el.querySelector('[data-assembly-stage]')!;
    const inset=parseFloat(getComputedStyle(stage).top)||0;
    scrollTo({top:el.getBoundingClientRect().top+scrollY-inset+(el.getBoundingClientRect().height-stage.getBoundingClientRect().height)*p,behavior:'instant'});
  },p);
  await expect.poll(async()=>Math.abs(Number(await article.getAttribute('data-assembly-progress'))-p)).toBeLessThan(.003);
}
async function drawing(article:Locator) {
  return article.evaluate(el=>{
    const preview=JSON.parse(el.querySelector('[data-assembly-config]')!.textContent!);
    const svg=Array.from(el.querySelectorAll<SVGSVGElement>('[data-assembly-layout]')).find(s=>getComputedStyle(s).display!=='none')!;
    const kind=svg.dataset.assemblyLayout!;
    const p=Number((el as HTMLElement).dataset.assemblyProgress);
    const nodes=Array.from(svg.querySelectorAll<SVGGElement>('[data-assembly-node]')).map((node,i)=>{
      const m=node.transform.baseVal.consolidate()!.matrix;
      const n=preview.nodes[i][kind],width=kind==='desktop'?960:330,height=kind==='desktop'?400:365;
      const config={...n,dx:Math.max(8,Math.min(width-n.w-8,n.x+n.dx))-n.x,dy:Math.max(8,Math.min(height-n.h-8,n.y+n.dy))-n.y};
      const bounds=node.querySelector('rect')!.getBoundingClientRect();
      return {x:m.e,y:m.f,width:bounds.width,height:bounds.height,config,opacity:Number(getComputedStyle(node).opacity),group:preview.nodes[i].group};
    });
    const wires=Array.from(svg.querySelectorAll<SVGPathElement>('[data-assembly-wire]')).map((path,i)=>{
      const length=path.getTotalLength(),t=Number(path.dataset.assemblyWireProgress);
      const head=svg.querySelectorAll<SVGPathElement>('[data-assembly-head]')[i];
      const hm=head.transform.baseVal.consolidate()!.matrix;
      const point=path.getPointAtLength(length);
      const route=preview.edges[i][kind];
      const ctm=path.getScreenCTM()!;
      const edge=preview.edges[i];
      const fromNode=preview.nodes.find(n=>n.id===edge.from),toNode=preview.nodes.find(n=>n.id===edge.to);
      // Sources follow actual node transforms; destinations remain at final ports.
      const from=svg.querySelector<SVGGElement>(`[data-assembly-node="${edge.from}"]`)!;
      const source=new DOMPoint(route[0].x-fromNode[kind].x,route[0].y-fromNode[kind].y).matrixTransform(from.getScreenCTM()!);
      const final=new DOMPoint(route.at(-1).x,route.at(-1).y).matrixTransform(ctm);
      const dest={x:source.x+(final.x-source.x)*t,y:source.y+(final.y-source.y)*t};
      const targetAngle=Math.atan2(final.y-source.y,final.x-source.x)*180/Math.PI;
      const start=path.getPointAtLength(0).matrixTransform(ctm),end=path.getPointAtLength(length).matrixTransform(ctm);
      return {targetAngle,headX:hm.e,headY:hm.f,destinationGap:Math.hypot(hm.e-route.at(-1).x,hm.f-route.at(-1).y),route: path.getAttribute('d'),t,tipError:Math.hypot(point.x-hm.e,point.y-hm.f),visible:getComputedStyle(head).visibility,sourceIndex:preview.nodes.indexOf(fromNode),targetIndex:preview.nodes.indexOf(toNode),count:preview.nodes.length,
        portError:Math.max(Math.hypot(source.x-start.x,source.y-start.y),Math.hypot(dest.x-end.x,dest.y-end.y)),angle:Math.atan2(hm.b,hm.a)*180/Math.PI,
        endAngle:Math.atan2(route.at(-1).y-route.at(-2).y,route.at(-1).x-route.at(-2).x)*180/Math.PI};
    });
    const svgRect=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;
    const scale=Math.min(svgRect.width/vb.width,svgRect.height/vb.height);
    const labels=Array.from(svg.querySelectorAll<SVGTextElement>('.assembly-primary')).map(label=>parseFloat(getComputedStyle(label).fontSize)*scale);
    const outside=Array.from(svg.querySelectorAll<SVGGraphicsElement>('text,rect,[data-assembly-head]')).filter(e=>{
      const b=e.getBoundingClientRect();return b.left<svgRect.left-1||b.right>svgRect.right+1||b.top<svgRect.top-1||b.bottom>svgRect.bottom+1;
    }).length;
    return {p,nodes,wires,labels,outside,phase:(el as HTMLElement).dataset.assemblyPhase};
  });
}

test('preview data preserves directed topology and validates all group and port associations',()=>{
  for(const preview of Object.values(projectPreviews)) {
    validatePreview(preview);
    expect(()=>validatePreview({...preview,edges:[{...preview.edges[0],from:'missing'},...preview.edges.slice(1)]})).toThrow();
    expect(new Set(preview.nodes.map(n=>n.group)).size).toBe(4);
    expect(new Set(preview.edges.map(e=>e.group)).size).toBe(4);
  }
});
// Assert actual box transforms independently of the timing helper: shared groups
// must still land one at a time, and reverse scrolling must replay the same order.
for(const width of [1440,390])test(`boxes wait for the previous landing at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?900:844});await ready(page);
 for(let study=0;study<3;study++) {
  const article=articles(page).nth(study);
  const count=projectPreviews[String(study+1).padStart(2,'0')].nodes.length;
  for(const index of [...Array(count).keys(),...Array(count).keys()].map((n,i)=>i<count?n:count-1-n)) {
   await seek(article,.04+(index+.4)*.68/count);
   const {nodes}=await drawing(article);
   for(let i=0;i<count;i++) {
    const n=nodes[i];
    if(i<index) {expect(n.x).toBeCloseTo(n.config.x,2);expect(n.y).toBeCloseTo(n.config.y,2);expect(n.opacity).toBe(1);}
    else if(i>index) {expect(n.x).toBeCloseTo(n.config.x+n.config.dx,2);expect(n.y).toBeCloseTo(n.config.y+n.config.dy,2);expect(n.opacity).toBe(0);}
    else {
     const remaining=Math.hypot(n.x-n.config.x,n.y-n.config.y)/Math.hypot(n.config.dx,n.config.dy);
     expect(remaining).toBeGreaterThan(.45);expect(remaining).toBeLessThan(.55);
     expect(n.opacity).toBeGreaterThan(.45);expect(n.opacity).toBeLessThan(.55);
    }
   }
   // Leave a settled interval before the next block starts, in either direction.
   await seek(article,.04+(index+.9)*.68/count);
   const settled=await drawing(article);
   for(let i=0;i<count;i++) {
    const n=settled.nodes[i],landed=i<=index;
    expect(n.x).toBeCloseTo(n.config.x+(landed?0:n.config.dx),2);
    expect(n.y).toBeCloseTo(n.config.y+(landed?0:n.config.dy),2);
    expect(n.opacity).toBe(landed?1:0);
   }
  }
 }
});

for(const width of [1440,390])for(const theme of ['light','dark']) {
 test(`all three sequences: geometry, tip direction, complete graph and hold ${width} ${theme}`,async({page})=>{
  await page.setViewportSize({width,height:width===1440?900:844});
  await page.addInitScript(theme=>localStorage.setItem('theme',theme),theme);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await ready(page);
  await expect(articles(page)).toHaveCount(3);
  await expect(page.locator('#work [data-diagram], [data-assembly-note]')).toHaveCount(0);
  for(let i=0;i<3;i++) {
    const article=articles(page).nth(i);
    await expect(article).toHaveAttribute('data-assembly-enhanced','true');
    const geometry=await article.evaluate(el=>({h:el.getBoundingClientRect().height,s:el.querySelector('[data-assembly-stage]')!.getBoundingClientRect().height,v:innerHeight,m:Number(getComputedStyle(el).getPropertyValue('--assembly-screens'))}));
    expect(geometry.h).toBeCloseTo(geometry.v*geometry.m,0);expect(geometry.h-geometry.s).toBeGreaterThan(0);
    for(const p of [0,.04,.08,.155,.22,.27,.34,.385,.49,.605,.665,.72,.78,.805,.9,1]) {
      await seek(article,p);
      const state=await drawing(article);
      for(const n of state.nodes) {
        const t=nodeProgress(state.p,state.nodes.indexOf(n),state.nodes.length);
        expect(n.x).toBeCloseTo(n.config.x+n.config.dx*(1-t),2);
        expect(n.y).toBeCloseTo(n.config.y+n.config.dy*(1-t),2);
        expect(n.opacity).toBeCloseTo(t,3);
      }
      for(const w of state.wires) {
        expect(w.t).toBeCloseTo(wireProgress(state.p,w.sourceIndex,w.targetIndex,w.count),3);
        if(w.visible==='visible')expect(w.tipError).toBeLessThan(.15);
        else expect(Math.abs(w.t)).toBeLessThan(.00001);
        if(wireProgress(state.p,w.sourceIndex,w.targetIndex,w.count)>.00001)expect(w.visible).toBe('visible');
        expect(w.portError).toBeLessThan(1);
        const source=state.nodes[w.sourceIndex];
        if(w.visible==='visible') {
          expect(source.x).toBeCloseTo(source.config.x,4);
          expect(source.y).toBeCloseTo(source.config.y,4);
          expect(source.opacity).toBe(1);
        }
        if(source.opacity<1) {expect(w.t).toBe(0);expect(w.visible).toBe('hidden');}
        if(w.t>=1)expect(w.angle).toBeCloseTo(w.endAngle,1);
        else if(w.visible==='visible')expect(Math.abs(((w.angle-w.targetAngle+540)%360)-180)).toBeLessThan(.05);
      }
      if(p>=.805) {
        expect(state.phase).toBe('complete');expect(state.outside).toBe(0);
        expect(Math.min(...state.labels)).toBeGreaterThanOrEqual(12);
        await expect(article.locator('[data-assembly-cta]')).toBeVisible();
      }
    }
    const complete=await drawing(article);
    await seek(article,.625);const reverse=await drawing(article);
    await seek(article,0);await seek(article,.625);const forward=await drawing(article);
    expect(reverse).toEqual(forward);
    await seek(article,1);expect(await drawing(article)).toEqual(complete);
    await page.screenshot({path:`.impeccable/review/assembly-${width}-${theme}-${i+1}.png`});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}

for(const width of [1440,390])test(`arrowheads directly target final destination ports from live sources; box sizes remain fixed without clipping at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?900:844});await ready(page);
 for(let i=0;i<3;i++) {
  const article=articles(page).nth(i);
  await seek(article,.22);const early=await drawing(article);
  expect(early.wires.some(w=>w.t>0&&w.t<1&&w.visible==='visible'&&w.destinationGap>12)).toBe(true);
  expect(early.nodes.some(n=>Math.hypot(n.x-n.config.x,n.y-n.config.y)>20)).toBe(true);
  expect(early.outside).toBe(0);
  const opening=await article.locator(`.assembly-${width===390?'mobile':'desktop'}`).getAttribute('viewBox');
  await seek(article,.34);const moving=await drawing(article);
  expect(moving.wires.some(w=>w.t>0&&w.t<1)).toBe(true);
  expect(moving.wires.some((w,i)=>Math.hypot(w.headX-early.wires[i].headX,w.headY-early.wires[i].headY)>12)).toBe(true);
  expect(moving.outside).toBe(0);
  expect(moving.wires.map(w=>w.route)).not.toEqual(early.wires.map(w=>w.route));
  for(const w of moving.wires){expect(w.portError).toBeLessThan(1);if(w.visible==='visible')expect(w.tipError).toBeLessThan(.15);}
  await seek(article,.805);
  expect(await article.locator(`.assembly-${width===390?'mobile':'desktop'}`).getAttribute('viewBox')).toBe(opening);
  const final=await drawing(article);expect(final.outside).toBe(0);
  expect(final.wires.map(w=>w.route)).not.toEqual(early.wires.map(w=>w.route));
  for(let n=0;n<final.nodes.length;n++) {
   expect(moving.nodes[n].width).toBeCloseTo(early.nodes[n].width,2);
   expect(moving.nodes[n].height).toBeCloseTo(early.nodes[n].height,2);
   expect(final.nodes[n].width).toBeCloseTo(early.nodes[n].width,2);
   expect(final.nodes[n].height).toBeCloseTo(early.nodes[n].height,2);
  }
  await seek(article,.22);expect(await drawing(article)).toEqual(early);
 }
});

test('handoff, rapid destination jumps, keyboard completion and matching catalog anchors in both views',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await ready(page);
 const first=articles(page).first(),last=articles(page).last();
 await seek(first,.2);await seek(last,.9);
 await expect(first).toHaveAttribute('data-assembly-progress','1.000000');
 const firstBox=await first.locator('[data-assembly-stage]').boundingBox();expect(firstBox!.y+firstBox!.height).toBeLessThan(0);
 await seek(first,.2);
 await expect(first.locator('[data-assembly-cta]')).toHaveAttribute('tabindex','-1');
 await first.locator('.assembly-completion-link').focus();await page.keyboard.press('Enter');
 await expect(first.locator('.assembly-end')).toBeFocused();await expect(first).toHaveAttribute('data-assembly-phase','complete');
 await page.keyboard.press('Tab');
 await expect(first.locator('[data-assembly-cta]')).toBeFocused();
 const stage=await first.locator('[data-assembly-stage]').boundingBox();expect(stage!.y).toBeGreaterThanOrEqual(0);expect(stage!.y+stage!.height).toBeLessThanOrEqual(900);
 for(const view of ['grid','list'])for(const id of ['01','02','03']) {
   await page.goto('/');
   await page.evaluate(view=>localStorage.setItem('journal-project-view',view),view);
   await page.goto(`/projects#project-${id}`);
   await expect(page.locator('#project-catalog')).toHaveAttribute('data-view',view);
   await expect(page.locator(`#project-${id}`)).toBeInViewport();
 }
});

test('wheel, PageDown, End and real CDP touch gestures drive assembly without interception',async({browser,page})=>{
 await page.setViewportSize({width:1440,height:900});await ready(page);const first=articles(page).first();await seek(first,.1);
 await page.mouse.move(700,450);await page.mouse.wheel(0,250);
 await expect.poll(async()=>Number(await first.getAttribute('data-assembly-progress'))).toBeGreaterThan(.15);
 const p=Number(await first.getAttribute('data-assembly-progress'));await page.keyboard.press('PageDown');
 await expect.poll(async()=>Number(await first.getAttribute('data-assembly-progress'))).toBeGreaterThan(p);
 await page.keyboard.press('End');await expect(page.locator('#contact')).toBeInViewport();
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await context.newPage();await ready(phone);const a=articles(phone).first();await seek(a,.1);
 const cdp=await context.newCDPSession(phone);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:650}]});
 for(let y=620;y>=250;y-=30){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});await phone.waitForTimeout(16);}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(async()=>Number(await a.getAttribute('data-assembly-progress'))).toBeGreaterThan(.2);
 await expect(a).toHaveAttribute('data-assembly-enhanced','true');await context.close();
});

test('restored scroll, direct work load, Back/Forward, pageshow, fonts, theme and visibility',async({page})=>{
 await ready(page);const a=articles(page).nth(1);await seek(a,.625);
 const before=await drawing(a);await page.reload();await expect.poll(async()=>Number(await a.getAttribute('data-assembly-progress'))).toBeCloseTo(before.p,2);
 await page.goto('/projects');await page.goBack();await expect.poll(async()=>Number(await a.getAttribute('data-assembly-progress'))).toBeCloseTo(before.p,2);
 await page.goForward();await expect(page).toHaveURL(/\/projects/);await page.goBack();
 await expect.poll(async()=>Number(await a.getAttribute('data-assembly-progress'))).toBeCloseTo(before.p,2);
 await seek(a,.625);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await a.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY+200,behavior:'instant'}));
 const hidden=await a.getAttribute('data-assembly-progress');await page.waitForTimeout(100);expect(await a.getAttribute('data-assembly-progress')).toBe(hidden);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));document.fonts.dispatchEvent(new Event('loadingdone'));});
 await expect.poll(()=>a.getAttribute('data-assembly-progress')).not.toBe(hidden);
 await seek(a,.625);const stable=await drawing(a);
 await page.evaluate(()=>document.querySelector<HTMLButtonElement>('[role="switch"]')!.click());await expect.poll(async()=>Number(await a.getAttribute('data-assembly-progress'))).toBeCloseTo(stable.p,2);
 await page.goto('/#work');await expect(page.locator('#work-title')).toBeInViewport();
});

test('resize mid-sequence recomputes from position and idle produces no assembly DOM writes',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await ready(page);const a=articles(page).first();await seek(a,.625);
 await page.setViewportSize({width:390,height:844});await expect(a).toHaveAttribute('data-assembly-enhanced','true');
 await seek(a,.625);expect(Math.max(...(await drawing(a)).wires.filter(w=>w.t>0).map(w=>w.tipError))).toBeLessThan(.15);
 const mutations=await a.evaluate(async el=>{let n=0;const o=new MutationObserver(m=>n+=m.length);o.observe(el,{attributes:true,subtree:true});await new Promise(r=>setTimeout(r,250));o.disconnect();return n;});expect(mutations).toBe(0);
 await page.setViewportSize({width:844,height:390});await expect(a).toHaveAttribute('data-assembly-fallback','fit');
});

for(const mode of ['no-js','reduce','failure'])test(`static complete graph and immediate CTA with ${mode}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference'});const page=await context.newPage();
 if(mode==='failure')await page.route('**/',async route=>{const response=await route.fetch();const html=await response.text();await route.fulfill({response,body:html.replace('"from":"request"','"from":"invalid-node"')});});
 await page.goto('/');const a=articles(page).first();
 if(mode==='failure')await expect(a).toHaveAttribute('data-assembly-fallback','initialization');
 else if(mode==='reduce')await expect(a).toHaveAttribute('data-assembly-fallback','reduced-motion');
 await expect(a).not.toHaveAttribute('data-assembly-enhanced','true');
 const h=await a.evaluate(el=>el.getBoundingClientRect().height);expect(h).toBeLessThan(844);
 await a.locator('[data-assembly-cta]').scrollIntoViewIfNeeded();await expect(a.locator('[data-assembly-cta]')).toBeVisible();
 expect(await a.locator('.assembly-mobile [data-assembly-node]').count()).toBe(5);
 expect(await a.locator('.assembly-mobile [data-assembly-head]').count()).toBe(4);
 for(const transform of await a.locator('.assembly-mobile [data-assembly-node]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('transform'))))expect(transform).not.toContain('NaN');
 for(const opacity of await a.locator('.assembly-mobile [data-assembly-node]').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).opacity)))expect(opacity).toBe('1');
 await a.locator('[data-assembly-cta]').click();await expect(page).toHaveURL(/\/projects#project-01/);await context.close();
});

test('runtime reduced motion, narrow/short/landscape and enlarged text fit fallbacks retain all content',async({page})=>{
 await ready(page);const a=articles(page).first();await seek(a,.5);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(a).toHaveAttribute('data-assembly-fallback','reduced-motion');await expect(a.locator('[data-assembly-cta]')).not.toHaveAttribute('tabindex','-1');
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(a).toHaveAttribute('data-assembly-enhanced','true');
 for(const viewport of [{width:320,height:844},{width:1440,height:450},{width:844,height:390},{width:720,height:450}]) {
  await page.setViewportSize(viewport);await page.evaluate(()=>window.dispatchEvent(new Event('orientationchange')));await page.waitForTimeout(80);
  if(!await a.getAttribute('data-assembly-enhanced'))await expect(a).toHaveAttribute('data-assembly-fallback','fit');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(a.locator('.assembly-introduction p')).toHaveText(/24\/7/);
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 await expect(a).toHaveAttribute('data-assembly-fallback','fit');await expect(a.locator('[data-assembly-cta]')).not.toHaveAttribute('aria-hidden','true');
});
