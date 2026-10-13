import {test,expect} from '@playwright/test';
for(const width of [1440,390,320])test(`contact cycle stays stable at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?900:844});await page.clock.install();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.locator('#contact').scrollIntoViewIfNeeded();await page.clock.runFor(100);
 const word=page.locator('.contact-typed'),heading=page.locator('#contact-title');const box=await heading.boundingBox();
 await expect(heading).toHaveAccessibleName('Let’s build something useful.');
 for(const ending of ['unexpected.','delightful.','bold.','worth sharing.','useful.']){
  await page.clock.runFor(2500);await page.clock.runFor(1800);await expect(word).toHaveText(ending);expect(await heading.boundingBox()).toEqual(box);
 }
 await page.locator('#contact-name').focus();await page.clock.runFor(10000);await expect(word).toHaveText('useful.');
 await page.locator('#contact-name').blur();await heading.scrollIntoViewIfNeeded();await page.clock.runFor(100);await page.clock.runFor(4000);await expect(word).toHaveText('unexpected.');
 for(const dark of [false,true]){await page.evaluate(d=>{document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.palette='orange';},dark);await page.screenshot({path:`.impeccable/review/contact-${width}-${dark?'dark':'light'}.png`});}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(word).toHaveText('useful.');await expect(page.locator('.contact-motion')).toHaveCount(0);
});
test('static contact without JavaScript',async({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://localhost:4322/');await expect(page.locator('#contact-title')).toHaveAccessibleName('Let’s build something useful.');await expect(page.locator('.contact-typed')).toHaveText('useful.');await expect(page.locator('.contact-motion')).toHaveCount(0);await context.close();});
