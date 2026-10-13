import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const out='.impeccable/review/themes';fs.mkdirSync(out,{recursive:true});
const results=[];
for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844],['narrow',320,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',colorScheme:'light'});
 const errors=[],expected404=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()!=='error')return;if(m.location().url.endsWith('/missing-theme-preview')&&m.text().includes('404'))expected404.push(m.text());else errors.push(m.text());});
 for(const palette of ['light','orange'])for(const [name,route] of [['home','/'],['projects','/projects'],['404','/missing-theme-preview']]){
  await page.goto(`http://localhost:4322${route}`);await page.evaluate(()=>document.fonts.ready);
  if(palette==='light'){if(await page.locator('html').evaluate(el=>el.classList.contains('dark')))await page.getByRole('switch',{name:'Dark mode'}).click();}
  else if(!await page.locator('html').evaluate(el=>el.classList.contains('dark')))await page.getByRole('switch',{name:'Dark mode'}).click();
  await page.waitForTimeout(150);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const colors=await page.evaluate(()=>{const c=getComputedStyle(document.documentElement);return Object.fromEntries(['paper','white','ink','muted','blue','technical','placeholder','on-action'].map(k=>[k,c.getPropertyValue(`--${k}`).trim()]));});
  results.push({device,palette,route,overflow,colors});
  if(device!=='narrow')await page.screenshot({path:`${out}/${device}-${palette}-${name}.png`,fullPage:true});
  if(name==='projects'&&palette!=='light'&&device!=='narrow'){
   await page.getByRole('button',{name:'View Agentic AI Assistant details'}).click();await page.screenshot({path:`${out}/${device}-${palette}-detail.png`});await page.keyboard.press('Escape');
  }
  if(name==='home'&&palette!=='light'&&device!=='narrow'){
   await page.locator('.assistant-launcher').click();await page.screenshot({path:`${out}/${device}-${palette}-assistant.png`});await page.keyboard.press('Escape');
   await page.locator('#contact').scrollIntoViewIfNeeded();await page.locator('button[type=submit]').first().click();await page.screenshot({path:`${out}/${device}-${palette}-contact.png`});
  }
 }
 results.push({device,errors,expected404});await page.close();
}
fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({checks:results.filter(r=>r.route).length,overflow:results.filter(r=>r.overflow),errors:results.filter(r=>r.errors?.length)}));
await browser.close();
