import { test, expect } from '@playwright/test';
import { installMotionProbe, scene, settled } from './motion-probe.mjs';
const positions=(frame:any)=>frame.bodies.map(({x,y,angle}:any)=>({x,y,angle}));

for(const touch of [false,true])test(`${touch?'touch':'desktop'} scroll nudges desk pieces while content clearance only fades`,async({browser})=>{
  const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1440,height:900},hasTouch:touch,isMobile:touch});
  await context.addInitScript(installMotionProbe);
  const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  for(const route of ['/','/projects']){
    await page.goto(`http://localhost:4322${route}`);await page.evaluate(()=>document.fonts.ready);await settled(page);
    const before=await scene(page);
    expect(before.bodies).toHaveLength(touch?4:8);expect(before.particles).toHaveLength(touch?36:80);
    const targets=route==='/'?['#work','#about','#contact','#about','#work']:['.catalog-item:nth-child(5)','.catalog-item:nth-child(15)','.catalog-item:nth-child(5)'];
    for(const selector of targets){
      await page.locator(selector).evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-130));
      await page.waitForTimeout(140);await settled(page);
      const after=await scene(page);
      expect(positions(after)).not.toEqual(positions(before));
      expect(after.particles.map(({x,y}:any)=>({x,y}))).toEqual(before.particles.map(({x,y}:any)=>({x,y})));
    }
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);await settled(page);
    expect(positions(await scene(page))).not.toEqual(positions(before));
  }
  expect(errors).toEqual([]);await context.close();
});

for(const width of [1440,390])test(`pieces float continuously without scrolling at ${width}px`,async({page})=>{
  await page.addInitScript(installMotionProbe);await page.setViewportSize({width,height:900});await page.goto('/');await settled(page);
  for(let sample=0;sample<3;sample++){
    const start=await scene(page);await page.waitForTimeout(700);const end=await scene(page);
    expect(end.scroll).toBe(start.scroll);
    await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating','true');
    for(let i=0;i<start.bodies.length;i++){
      const distance=Math.hypot(end.bodies[i].x-start.bodies[i].x,end.bodies[i].y-start.bodies[i].y);
      expect(distance).toBeGreaterThan(.1);expect(distance).toBeLessThan(20);
    }
  }
});

test('reduced motion keeps desk pieces fixed through repeated scrolling',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});await context.addInitScript(installMotionProbe);
  const page=await context.newPage();await page.goto('http://localhost:4322/');await settled(page);const before=positions(await scene(page));
  await page.locator('#contact').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY));await page.waitForTimeout(200);
  expect(positions(await scene(page))).toEqual(before);await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating','false');await context.close();
});

test('clearance fades continuously during drag, release, layout changes and restoration',async({page})=>{
  await page.addInitScript(installMotionProbe);await page.setViewportSize({width:1440,height:900});await page.goto('/');await settled(page);
  const initial=await scene(page),index=initial.bodies.findIndex((b:any)=>b.alpha>.6);
  expect(index).toBeGreaterThanOrEqual(0);const body=initial.bodies[index];
  await page.mouse.move(body.x,body.y);await page.mouse.down();
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-interaction','dragging');
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const heldPosition=(await scene(page)).bodies[index];
  // A protected figure appears around the held piece: it must fade in place.
  await page.evaluate(({x,y})=>{
    const guard=document.createElement('div');guard.id='clearance-fixture';guard.className='figure';
    guard.style.cssText=`position:fixed;left:${x-50}px;top:${y-50}px;width:100px;height:100px;pointer-events:none`;
    document.querySelector('main')!.append(guard);
  },body);
  await page.waitForTimeout(150);
  const partial=(await scene(page)).bodies[index];expect(partial.alpha).toBeGreaterThan(0);expect(partial.alpha).toBeLessThan(.6);
  expect({x:partial.x,y:partial.y}).toEqual({x:heldPosition.x,y:heldPosition.y});
  await page.waitForTimeout(500);expect((await scene(page)).bodies[index].alpha).toBe(0);
  await page.mouse.up();await settled(page);
  await page.locator('#clearance-fixture').evaluate(el=>el.remove());await page.waitForTimeout(150);
  expect((await scene(page)).bodies[index].alpha).toBeGreaterThan(0);
  await settled(page);expect((await scene(page)).bodies[index].alpha).toBeGreaterThan(.6);
});

test('distant pointer, nearby response, toss, resize and touch settling',async({browser})=>{
  const context=await browser.newContext({viewport:{width:1440,height:900}});await context.addInitScript(installMotionProbe);
  const page=await context.newPage();await page.goto('http://localhost:4322/');await settled(page);
  const before=await scene(page);
  await page.mouse.move(650,400);await page.mouse.move(750,420,{steps:6});await settled(page);
  for(const [i,b] of (await scene(page)).bodies.entries())expect(Math.hypot(b.x-before.bodies[i].x,b.y-before.bodies[i].y)).toBeLessThan(40);
  const body=before.bodies.find((b:any)=>b.alpha>.6);
  await page.mouse.move(body.x+40,body.y);await page.mouse.move(body.x+25,body.y,{steps:4});await settled(page);
  const near=await scene(page);expect(positions(near)).not.toEqual(positions(before));
  const pick=near.bodies.find((b:any)=>b.alpha>.6);
  await page.mouse.move(pick.x,pick.y);await page.mouse.down();await page.mouse.move(pick.x+120,pick.y+30,{steps:6});await page.mouse.up();await settled(page);
  const thrown=await scene(page);expect(positions(thrown)).not.toEqual(positions(near));
  await page.mouse.move(650,450);await settled(page);
  // Isolate resize preservation from ongoing ambient and pointer impulses.
  await page.emulateMedia({reducedMotion:'reduce'});await settled(page);const stable=await scene(page);
  await page.setViewportSize({width:1500,height:950});await page.waitForTimeout(100);await settled(page);
  const expanded=await scene(page);
  for(let i=0;i<8;i++)expect(Math.hypot(expanded.bodies[i].x-stable.bodies[i].x,expanded.bodies[i].y-stable.bodies[i].y)).toBeLessThan(32);
  await page.setViewportSize({width:1100,height:800});await page.waitForTimeout(100);await settled(page);
  const shrunk=await scene(page);expect(shrunk.bodies).toHaveLength(8);
  for(let i=0;i<8;i++){
    if(stable.bodies[i].x<1060&&stable.bodies[i].y<760)expect(Math.hypot(shrunk.bodies[i].x-stable.bodies[i].x,shrunk.bodies[i].y-stable.bodies[i].y)).toBeLessThan(32);
    expect(shrunk.bodies[i].x).toBeLessThanOrEqual(1100);expect(shrunk.bodies[i].y).toBeLessThanOrEqual(800);
  }
  await page.emulateMedia({reducedMotion:'no-preference'});await settled(page);
  // Hidden tabs suspend the canvas and resume without applying elapsed-time force.
  const background=await context.newPage();await background.goto('about:blank');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating','false');
  const hidden=positions(await scene(page));await page.waitForTimeout(250);
  expect(positions(await scene(page))).toEqual(hidden);
  await page.evaluate(()=>{delete (document as any).hidden;document.dispatchEvent(new Event('visibilitychange'));});await settled(page);
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating','true');await context.close();
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await touch.addInitScript(installMotionProbe);
  const mobile=await touch.newPage();await mobile.goto('http://localhost:4322/');await settled(mobile);
  const first=await scene(mobile),tap=first.bodies.find((b:any)=>b.alpha>.2&&b.y>160);
  await mobile.touchscreen.tap(tap.x,tap.y);await mobile.waitForTimeout(100);expect(positions(await scene(mobile))).not.toEqual(positions(first));
  await settled(mobile);await touch.close();
});
