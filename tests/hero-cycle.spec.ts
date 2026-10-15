import { test, expect } from '@playwright/test';
test.setTimeout(60000);
for(const width of [1440,390,320])test(`wordmark scatters and reforms at ${width}px`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:900});await page.clock.install();await page.goto('/');
  const canvas=page.locator('#hero-particles');await expect(canvas).toHaveAttribute('data-ready','true');
  await page.clock.runFor(3100);
  expect(Number(await canvas.getAttribute('data-points'))).toBeLessThanOrEqual(3200);
  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect(page.getByText('Animation style',{exact:true})).toHaveCount(0);
    for(const word of ['DECODE','FORGE','BREAK','MASTER','PROBE']){
      await page.clock.fastForward(3100);await page.clock.runFor(4500);
      await expect(canvas).toHaveAttribute('data-word',word);await expect(canvas).toHaveAttribute('data-phase','hold');
      const bounds=await canvas.evaluate((el:HTMLCanvasElement)=>{const data=el.getContext('2d')!.getImageData(0,0,el.width,el.height).data;let minX=el.width,minY=el.height,maxX=0,maxY=0;for(let y=0;y<el.height;y++)for(let x=0;x<el.width;x++)if(data[(y*el.width+x)*4+3]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}return {minX,minY,maxX,maxY,w:el.width,h:el.height};});
      expect(bounds.minX).toBeGreaterThan(0);expect(bounds.minY).toBeGreaterThan(0);expect(bounds.maxX).toBeLessThan(bounds.w-1);expect(bounds.maxY).toBeLessThan(bounds.h-1);
      await canvas.screenshot({path:`.impeccable/review/hero-${width}-${word}.png`});

    }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`.impeccable/review/hero-cycle-${width}.png`});expect(errors).toEqual([]);
});
test('automatic cycle, uninterrupted hover, resize, suspension and reduced motion',async({page})=>{
  await page.clock.install();await page.goto('/');const canvas=page.locator('#hero-particles');await expect(canvas).toHaveAttribute('data-ready','true');await page.clock.runFor(3100);
  await page.clock.fastForward(3100);await page.clock.runFor(100);
  await page.clock.runFor(4500);
  await expect(page.locator('.hero-animation-controls')).toHaveCount(0);
  await page.setViewportSize({width:320,height:844});await page.clock.runFor(50);
  await canvas.hover();await page.clock.runFor(7400);
  await expect(canvas).toHaveAttribute('data-word','FORGE');await expect(canvas).toHaveAttribute('data-phase','hold');
  const rect=await canvas.boundingBox();
  for(let i=0;i<4;i++){await page.mouse.move(rect!.x+rect!.width*(.3+i*.1),rect!.y+rect!.height/2);await page.clock.runFor(500);}
  await page.mouse.move(0,0);await page.clock.runFor(1100);
  await expect(canvas).toHaveAttribute('data-phase','scatter');
  await page.clock.runFor(4400);await expect(canvas).toHaveAttribute('data-word','BREAK');
  await page.locator('#contact').scrollIntoViewIfNeeded();await page.clock.runFor(100);await expect(canvas).toHaveAttribute('data-running','false');
  const word=await canvas.getAttribute('data-word');await page.clock.fastForward(20000);await expect(canvas).toHaveAttribute('data-word',word);
  await canvas.scrollIntoViewIfNeeded();await page.clock.runFor(1500);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(canvas).toHaveAttribute('data-running','false');const frozen=await canvas.getAttribute('data-word');await page.clock.fastForward(20000);await expect(canvas).toHaveAttribute('data-word',frozen);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await page.clock.runFor(50);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(canvas).toHaveAttribute('data-word','PROBE');await expect(page.locator('.hero-animation-controls')).toBeHidden();await expect(canvas).toHaveAttribute('data-animating','false');
});
test('no JavaScript leaves the VUTHI fallback visible',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/');await expect(page.locator('.hero-pixel-fallback')).toBeVisible();await expect(page.locator('.hero-pixel-fallback')).toHaveText('VUTHI');await expect(page.locator('.hero-animation-controls')).toBeHidden();await context.close();
});

test('large PROBE retains every sampled grid cell without cap holes',async({page})=>{
  await page.setViewportSize({width:2048,height:1139});await page.clock.install();
  await page.addInitScript(()=>{
    const state=(window as any).__heroInk={masks:[],points:[]};const proto=CanvasRenderingContext2D.prototype;
    const read=proto.getImageData,clear=proto.clearRect,arc=proto.arc;
    proto.getImageData=function(...args:any[]){const result=read.apply(this,args as any);if(!this.canvas.id)state.masks.push({data:Array.from(result.data),width:result.width,height:result.height});return result;};
    proto.clearRect=function(...args:any[]){if(this.canvas.id==='hero-particles')state.points=[];return clear.apply(this,args as any);};
    proto.arc=function(...args:Parameters<CanvasRenderingContext2D['arc']>){const [x,y,radius]=args;if(this.canvas.id==='hero-particles')state.points.push({x,y,size:radius*2});return arc.apply(this,args);};
  });
  await page.goto('/');const canvas=page.locator('#hero-particles');await expect(canvas).toHaveAttribute('data-ready','true');
  await page.clock.runFor(3100);
  for(let i=0;i<2;i++){await page.clock.fastForward(3100);await page.clock.runFor(4500);}
  await expect(canvas).toHaveAttribute('data-word','FORGE');
  const missing=await page.evaluate(()=>{
    const {masks,points}=(window as any).__heroInk,mask=masks[masks.length-3],gap=Math.round(points[0].size/.68);
    const occupied=new Set(points.map((p:any)=>`${Math.round(p.x)},${Math.round(p.y)}`));let missing=0;
    for(let y=gap;y<mask.height-gap;y+=gap)for(let x=gap;x<mask.width-gap;x+=gap)
      if(mask.data[(y*mask.width+x)*4+3]>140&&!occupied.has(`${x},${y}`))missing++;
    return missing;
  });
  expect(missing).toBe(0);await canvas.screenshot({path:'.impeccable/review/hero-probe-complete-grid.png'});
});
