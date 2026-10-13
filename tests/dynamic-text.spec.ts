import { test, expect } from '@playwright/test';
test.setTimeout(90000);
for(const width of [1440,390,320])test(`dynamic text monochrome interaction and return at ${width}px`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:width===1440?900:844});await page.clock.install();await page.goto('/projects');
 const box=page.locator('.dynamic-particles'),canvas=box.locator('canvas');await expect(box).toHaveAttribute('data-ready','true');await expect(page.locator('[data-motion-option],.motion-review,.motion-stamp,.heading-particles')).toHaveCount(0);await expect(box).toHaveAttribute('data-word','documented.');await expect(box).toHaveAttribute('data-running','true');
 await expect(page.locator('.motion-documented')).toHaveCSS('color','rgba(0, 0, 0, 0)');await expect(box).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 await page.clock.runFor(100);const before=await canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL());
 const field=(await canvas.boundingBox())!,word=(await page.locator('.motion-documented').boundingBox())!;
 await page.mouse.move(word.x+word.width/2,word.y+word.height/2);await page.clock.runFor(500);
 expect(await canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL())).not.toBe(before);
 const wrongColor=await canvas.evaluate((c:HTMLCanvasElement)=>{const a=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=4)if(a[i+3]>200&&(a[i+2]<a[i]*2||a[i+2]<a[i+1]*1.8||a[i+1]<a[i]))n++;return n;});expect(wrongColor).toBe(0);
 await page.screenshot({path:`.impeccable/review/dynamic-${width}-interactive.png`});
 await page.mouse.move(0,0);await page.clock.runFor(3500);await page.screenshot({path:`.impeccable/review/dynamic-${width}-assembled.png`});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(Number(await box.getAttribute('data-points'))).toBeLessThanOrEqual(5000);expect(errors).toEqual([]);
});
test('automatic word cycle suspends with page lifecycle',async({page})=>{
 await page.clock.install();await page.goto('/projects');const box=page.locator('.dynamic-particles'),canvas=box.locator('canvas');await expect(box).toHaveAttribute('data-ready','true');
 await page.clock.runFor(12800);await expect(box).toHaveAttribute('data-word','explored.');
 await expect(page.locator('.motion-actions')).toHaveCount(0);
 await page.locator('.catalog-item').last().scrollIntoViewIfNeeded();await page.clock.runFor(50);await expect(box).toHaveAttribute('data-running','false');await page.clock.runFor(15000);await expect(box).toHaveAttribute('data-word','explored.');
 await box.scrollIntoViewIfNeeded();await page.clock.runFor(50);await expect(box).toHaveAttribute('data-running','true');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await expect(box).toHaveAttribute('data-running','false');await page.clock.runFor(15000);await expect(box).toHaveAttribute('data-word','explored.');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await page.clock.runFor(50);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(box).toHaveAttribute('data-word','documented.');await expect(box).toHaveAttribute('data-running','false');await expect(page.locator('.motion-actions')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(box).toHaveAttribute('data-running','true');
 await page.setViewportSize({width:390,height:844});await page.clock.runFor(100);await expect(box).toHaveAttribute('data-word','documented.');await expect(box).toHaveAttribute('data-running','true');

});
test('touch tap stirs particles without preventing page scrolling',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();await page.goto('/projects');const box=page.locator('.dynamic-particles'),canvas=box.locator('canvas');await expect(box).toHaveAttribute('data-ready','true');await box.scrollIntoViewIfNeeded();const before=await canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL());const word=(await page.locator('.motion-documented').boundingBox())!;await page.touchscreen.tap(word.x+word.width/2,word.y+word.height/2);await expect.poll(()=>canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL())).not.toBe(before);await expect(canvas).toHaveCSS('touch-action','pan-y');await context.close();
});

test('no JavaScript retains the semantic heading without dead animation controls',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/projects');await expect(page.getByRole('heading',{level:1})).toHaveText('Work,documented.');await expect(page.locator('.motion-documented')).toHaveCSS('color','rgb(36, 77, 200)');await expect(page.locator('.motion-actions')).toBeHidden();await expect(page.locator('.catalog-item')).toHaveCount(20);await context.close();
});

for(const width of [1440,390,320])test(`all four words cycle and fit at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?900:844});await page.clock.install();await page.goto('/projects');const box=page.locator('.dynamic-particles'),canvas=box.locator('canvas');await expect(box).toHaveAttribute('data-ready','true');
 const initial=await page.locator('.journal-heading').boundingBox();
 for(const word of ['explored.','built.','refined.','documented.']){
  await page.clock.runFor(12800);await expect(box).toHaveAttribute('data-word',word);
  // Pause the cycle while allowing its spring transition to finish.
  const heading=(await box.boundingBox())!;await page.mouse.move(heading.x+3,heading.y+3);await page.clock.runFor(3000);
  await page.screenshot({path:`.impeccable/review/dynamic-cycle-${width}-${word}.png`});
  const ink=await canvas.evaluate((c:HTMLCanvasElement)=>{const a=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;let minX=c.width,minY=c.height,maxX=0,maxY=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(a[(y*c.width+x)*4+3]>128){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}return{minX,minY,maxX,maxY,w:c.width,h:c.height};});
  expect(ink.maxX-ink.minX).toBeGreaterThan(30);expect(ink.minX).toBeGreaterThanOrEqual(0);expect(ink.minY).toBeGreaterThan(0);expect(ink.maxX).toBeLessThan(ink.w-1);expect(ink.maxY).toBeLessThan(ink.h-1);
  expect(await page.locator('.journal-heading').boundingBox()).toEqual(initial);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.mouse.move(0,0);
 }
});

for(const width of [1440,390])test(`scroll nudges the lettering and springs back at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?900:844});await page.clock.install();await page.goto('/projects');const box=page.locator('.dynamic-particles'),canvas=box.locator('canvas');await expect(box).toHaveAttribute('data-ready','true');await page.clock.runFor(100);
 const sample=()=>canvas.evaluate((c:HTMLCanvasElement)=>{const a=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;let y=0,n=0;for(let row=0;row<c.height;row++)for(let x=0;x<c.width;x++){const alpha=a[(row*c.width+x)*4+3]/255;y+=row*alpha;n+=alpha;}return y/n/(c.width/c.getBoundingClientRect().width)+window.scrollY;});
 const initial=await canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL()),base=await sample();
 await page.evaluate(()=>window.scrollTo({top:70,behavior:'instant'}));await page.clock.runFor(100);expect(await canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL())).not.toBe(initial);expect(await sample()).toBeGreaterThan(base+.3);
 await page.screenshot({path:`.impeccable/review/dynamic-scroll-${width}.png`});await page.clock.runFor(3200);expect(Math.abs(await sample()-base)).toBeLessThan(1);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.clock.runFor(100);expect(await sample()).toBeLessThan(base-.3);await page.clock.runFor(3200);
 await page.emulateMedia({reducedMotion:'reduce'});await page.clock.runFor(100);const reduced=await sample();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.clock.runFor(1000);expect(Math.abs(await sample()-reduced)).toBeLessThan(1);await expect(box).toHaveAttribute('data-word','documented.');
});

test('automatic word changes scatter before assigning the next word',async({page})=>{
 await page.clock.install();await page.goto('/projects');const box=page.locator('.dynamic-particles');await expect(box).toHaveAttribute('data-ready','true');
 await page.clock.runFor(10100);await expect(box).toHaveAttribute('data-phase','scatter');await expect(box).toHaveAttribute('data-word','documented.');
 await page.clock.runFor(400);
 const extent=await box.locator('canvas').evaluate((c:HTMLCanvasElement)=>{const d=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data,r=c.getBoundingClientRect(),word=document.querySelector('.motion-documented')!.getBoundingClientRect();let outside=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>128){const px=x*r.width/c.width+r.left,py=y*r.height/c.height+r.top;if(px<word.left-word.width-2||px>word.right+word.width+2||py<word.top-word.height-2||py>word.bottom+word.height+2)outside++;}return outside;});expect(extent).toBe(0);
 await page.clock.runFor(550);await expect(box).toHaveAttribute('data-phase','assemble');await expect(box).toHaveAttribute('data-word','explored.');
 await page.clock.runFor(1800);await expect(box).toHaveAttribute('data-phase','hold');
});
