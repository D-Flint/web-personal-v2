import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const root = '.impeccable/review';
await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox'],headless:true});
const measurements=[];
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['user-320',320,844]]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',isMobile:width<700,hasTouch:width<700});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [route,suffix] of [['/',''],['/projects','-projects'],['/not-a-page','-404']]){
  await page.goto(`http://localhost:4322${route}`);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`${root}/${name}${suffix}.png`,fullPage:true});
  measurements.push({name,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),fonts:await page.evaluate(()=>document.fonts.check('16px Journal')),errors});
 }
 await context.close();
}
// Additional evidence for protected-focus surfaces and the new alternate view.
const evidence = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const ep = await evidence.newPage();
await ep.goto('http://localhost:4322/projects');
await ep.getByRole('button',{name:'View Agentic AI Assistant details'}).click();
await ep.screenshot({path:`${root}/desktop-details.png`});await ep.keyboard.press('Escape');
await ep.getByRole('button',{name:'Grid',exact:true}).click();
await ep.screenshot({path:`${root}/desktop-projects-grid.png`,fullPage:true});
for(const w of [390,320]){
 await ep.setViewportSize({width:w,height:844});await ep.goto('http://localhost:4322/');
 await ep.locator('#assistant-open').click();await ep.locator('[data-prompt]').first().click();
 await ep.locator('#chat-status[data-state="error"]').waitFor();
 await ep.screenshot({path:`${root}/${w===390?'mobile':'user-320'}-assistant.png`});await ep.keyboard.press('Escape');
}
await ep.setViewportSize({width:390,height:844});await ep.goto('http://localhost:4322/projects');
await ep.locator('#project-search').fill('No matching record xyz');
await ep.locator('#empty-results').scrollIntoViewIfNeeded();
await ep.screenshot({path:`${root}/mobile-projects-empty.png`});
await ep.goto('http://localhost:4322/#contact');await ep.locator('#contact-send').click();
await ep.screenshot({path:`${root}/mobile-contact-validation.png`});
await evidence.close();
const motion = await browser.newContext({viewport:{width:1440,height:900}});
const mp = await motion.newPage();await mp.goto('http://localhost:4322/');await mp.evaluate(()=>document.fonts.ready);
await mp.screenshot({path:`${root}/background-initial.png`});
await mp.locator('#scatter-particles').click();await mp.waitForTimeout(130);
await mp.screenshot({path:`${root}/hero-particles-scattered.png`});
await mp.locator('#hero-particles[data-animating="false"]').waitFor();
await mp.mouse.move(1120,650);await mp.waitForTimeout(400);
await mp.screenshot({path:`${root}/background-pointer.png`});
const study = mp.locator('[data-diagram]').nth(0);
await study.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight+30));
await mp.waitForTimeout(250);await mp.screenshot({path:`${root}/scroll-study-entry.png`});
await study.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-(innerHeight-el.clientHeight)/2));
await mp.waitForTimeout(500);await mp.screenshot({path:`${root}/scroll-study-open.png`});
await mp.locator('#about').scrollIntoViewIfNeeded();await mp.waitForTimeout(500);
await mp.screenshot({path:`${root}/background-about.png`});
await mp.goto('http://localhost:4322/projects');await mp.locator('.catalog-item').nth(8).scrollIntoViewIfNeeded();await mp.waitForTimeout(500);
await mp.screenshot({path:`${root}/background-archive.png`});
await mp.setViewportSize({width:390,height:844});await mp.goto('http://localhost:4322/');
await mp.screenshot({path:`${root}/mobile-hero.png`});
const mobileStudy=mp.locator('[data-diagram]').nth(0);
await mobileStudy.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-(innerHeight-el.clientHeight)/2));
await mp.waitForTimeout(500);await mp.screenshot({path:`${root}/mobile-scroll-study.png`});
await motion.close();
await fs.writeFile(`${root}/viewport-results.json`,JSON.stringify(measurements,null,2)+'\n');
console.log(JSON.stringify(measurements,null,2));
await browser.close();
