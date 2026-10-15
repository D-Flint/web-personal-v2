import { test, expect } from '@playwright/test';
for(const width of [1440,390,320])for(const theme of ['light','dark'])test(`scatter and reassembly inspection ${width}px ${theme}`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?900:844});
 await page.addInitScript(value=>localStorage.setItem('theme',value),theme);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install();await page.goto('/projects');
 const box=page.locator('.dynamic-particles');await expect(box).toHaveAttribute('data-ready','true');
 await page.clock.runFor(100);
 const initial=await page.locator('.journal-heading').boundingBox();
 const capture=async(name:string)=>page.screenshot({path:`.impeccable/review/letter-${width}-${theme}-${name}.png`});
 await capture('hold');await page.clock.runFor(5200);await expect(box).toHaveAttribute('data-phase','scatter');await capture('scatter');
 await page.clock.runFor(1300);await expect(box).toHaveAttribute('data-phase','assemble');await capture('gather');
 await page.clock.runFor(3000);await expect(box).toHaveAttribute('data-phase','hold');await expect(box).toHaveAttribute('data-word','explored.');await capture('settled');
 expect(await page.locator('.journal-heading').boundingBox()).toEqual(initial);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
test('resize and pointer input interrupt assembly without resetting the word or phase',async({page})=>{
 await page.clock.install();await page.goto('/projects');const box=page.locator('.dynamic-particles');await expect(box).toHaveAttribute('data-ready','true');
 await page.clock.runFor(6700);await expect(box).toHaveAttribute('data-phase','assemble');
 await page.setViewportSize({width:390,height:844});await page.clock.runFor(100);
 await expect(box).toHaveAttribute('data-phase','assemble');await expect(box).toHaveAttribute('data-word','explored.');
 const word=(await page.locator('.motion-documented').boundingBox())!;
 await page.mouse.move(word.x+word.width/2,word.y+word.height/2);await page.clock.runFor(200);await page.mouse.move(0,0);await page.clock.runFor(2500);
 await expect(box).toHaveAttribute('data-phase','hold');await expect(box).toHaveAttribute('data-word','explored.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
