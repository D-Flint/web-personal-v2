import { test, expect } from '@playwright/test';
import { installMotionProbe, scene } from './motion-probe.mjs';

test('navigation, all records, resume and external link truth', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software');
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page.locator('.catalog-item')).toHaveCount(20);
  await page.getByRole('button', { name: 'View Portfolio Website details', exact: true }).click();
  await expect(page.locator('#detail-live')).toHaveAttribute('href', 'https://hoeurbvuthi.site/');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'View C++ Task Organizer details' }).click();
  await expect(page.locator('#detail-live')).toBeHidden();
  await expect(page.locator('#detail-unpublished')).toBeVisible();
  const pdf = await request.get('/resume.pdf');
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

test('combined search/category/all-tags, empty recovery and persisted list', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('[data-category="tools"]').click();
  await page.locator('.tech-filter summary').click();
  await page.locator('[data-tag="Python"]').click();
  await page.locator('[data-tag="SQLite"]').click();
  await expect(page.locator('.catalog-item:visible')).toHaveCount(1);
  await expect(page.locator('#project-count')).toHaveText('1 of 20 projects');
  await page.locator('#project-search').fill('No matching record xyz');
  await expect(page.locator('#empty-results')).toBeVisible();
  await page.getByRole('button', { name: 'Reset search & filters' }).click();
  await expect(page.locator('.catalog-item:visible')).toHaveCount(20);
  await expect(page.locator('#project-search')).toBeFocused();
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await page.reload();
  await expect(page.locator('#project-catalog')).toHaveAttribute('data-view', 'list');
  await expect(page.getByRole('button', { name: 'List', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  await expect(page.locator('#project-search')).toBeFocused();
});

test('project dialog traps focus, closes on Escape and restores opener', async ({ page }) => {
  await page.goto('/projects');
  const opener = page.getByRole('button', { name: 'View Agentic AI Assistant details' });
  await opener.click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#project-dialog'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await expect(page.locator('#project-dialog')).not.toBeVisible();
});

test('contact validation, pending, failure preservation and success recovery', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#contact-name').fill('Preview Test');
  await page.locator('#contact-email').fill('bad-email');
  await page.locator('#contact-subject').fill('Integration check');
  await page.locator('#contact-message').fill('A repeatable local delivery check.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('#email-error')).toHaveText('Enter a valid email address.');
  await page.locator('#contact-email').fill('preview@example.com');
  await page.route('https://api.web3forms.com/submit', async route => {
    const data = route.request().postDataJSON();
    expect(data.access_key).toBeTruthy();
    expect(data.email).toBe('preview@example.com');
    await new Promise(resolve => setTimeout(resolve, 200));
    await route.fulfill({ status: 500, json: { success: false } });
  });
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('#contact-send')).toBeDisabled();
  await expect(page.locator('#contact-status')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#contact-message')).toHaveValue('A repeatable local delivery check.');
  await page.unroute('https://api.web3forms.com/submit');
  await page.route('https://api.web3forms.com/submit', route => route.fulfill({ json: { success: true } }));
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('#contact-status')).toHaveAttribute('data-state', 'success');
  await expect(page.locator('#contact-message')).toHaveValue('');
});

test('contact network and truthful false-success handling', async ({ page }) => {
  await page.goto('/#contact');
  for (const [id,value] of Object.entries({ name: 'Preview', email: 'preview@example.com', subject: 'Test', message: 'More than ten characters.' })) await page.locator(`#contact-${id}`).fill(value);
  await page.route('https://api.web3forms.com/submit', route => route.abort('failed'));
  await page.locator('#contact-send').click();
  await expect(page.locator('#contact-status')).toHaveAttribute('data-state', 'error');
  await page.unroute('https://api.web3forms.com/submit');
  await page.route('https://api.web3forms.com/submit', route => route.fulfill({ json: { success: false } }));
  await page.locator('#contact-send').click();
  await expect(page.locator('#contact-status')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#contact-message')).toHaveValue('More than ten characters.');
});

test('chat configuration error, retry, decoded streaming contract and reset', async ({ page, request }) => {
  const actual = await request.post('/api/chat', { data: { messages: [{ role: 'user', content: 'Hello' }] } });
  expect(actual.status()).toBe(503);
  await page.goto('/');
  await page.locator('#assistant-open').click();
  await expect(page.locator('#chat-input')).toBeFocused();
  await page.locator('#chat-input').fill('Tell me about your projects.');
  await page.locator('#chat-send').click();
  await expect(page.locator('#chat-status')).toContainText('server API key');
  await expect(page.locator('#chat-retry')).toBeVisible();
  await page.route('**/api/chat', async route => {
    expect(route.request().postDataJSON().messages.at(-1).content).toBe('Tell me about your projects.');
    await route.fulfill({ contentType: 'text/event-stream', body: 'Hoeurb builds web applications and local AI experiments.' });
  });
  await page.locator('#chat-retry').click();
  await expect(page.locator('#chat-status')).toHaveText('Response complete.');
  await expect(page.locator('#chat-log')).toContainText('local AI experiments');
  await expect(page.locator('.chat-message.user')).toHaveCount(1);
  await page.locator('#chat-reset').click();
  await expect(page.locator('#chat-log')).toContainText('Conversation cleared');
  await expect(page.locator('.chat-message.user')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#assistant-open')).toBeFocused();
});

test('chat provider failure and empty-response retry states', async ({ page }) => {
  await page.goto('/'); await page.locator('#assistant-open').click();
  await page.route('**/api/chat', route => route.fulfill({ status: 502, json: { error: 'Provider unavailable. Please retry.' } }));
  await page.locator('#chat-input').fill('What are your skills?'); await page.locator('#chat-send').click();
  await expect(page.locator('#chat-status')).toContainText('Provider unavailable');
  await page.unroute('**/api/chat');
  await page.route('**/api/chat', route => route.fulfill({ contentType: 'text/event-stream', body: '' }));
  await page.locator('#chat-retry').click();
  await expect(page.locator('#chat-status')).toContainText('empty response');
  await expect(page.locator('#chat-send')).toBeEnabled();
});

test('mobile and 320px overflow, touch and reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/projects', '/missing-page']) {
      await page.goto(`http://localhost:4322${route}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'false');
      await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'false');
      await page.locator('#assistant-open').click();
      const box = await page.locator('#neko-chat').boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press('Escape');
    }
  }
  await context.close();
});

test('workbench lifecycle and no unhandled application errors', async ({ page }) => {
  const errors:string[]=[];page.on('pageerror', error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  await page.evaluate(() => document.fonts.ready);
  const before = await page.locator<HTMLCanvasElement>('#drafting-canvas').evaluate(canvas=>canvas.toDataURL());
  await page.mouse.move(1000, 400);
  await expect.poll(() => page.locator<HTMLCanvasElement>('#drafting-canvas').evaluate(canvas=>canvas.toDataURL())).not.toBe(before);
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'true', { timeout: 6000 });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  expect(await page.locator('#drafting-canvas').evaluate(el => el.getBoundingClientRect().top)).toBe(0);
  await page.evaluate(()=>scrollTo(0,0));
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'false');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  expect(errors).toEqual([]);
});


test('scroll opens schematics with attached wires and keeps the drafting field across routes', async ({ page }) => {
  await page.goto('/');
  const figure = page.locator('[data-diagram]').nth(0);
  await figure.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight + 30));
  const assembled = await figure.locator('[data-node="guard"]').getAttribute('transform');
  await figure.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - (innerHeight - el.clientHeight) / 2));
  await expect.poll(() => figure.getAttribute('data-opening')).toBe('1.000');
  expect(await figure.locator('[data-node="guard"]').getAttribute('transform')).not.toBe(assembled);
  const geometry = await figure.evaluate(el => {
    const nodes = JSON.parse((el as HTMLElement).dataset.nodes!);
    const edges = JSON.parse((el as HTMLElement).dataset.edges!);
    const opening = Number((el as HTMLElement).dataset.opening);
    return edges.map((edge: any, i: number) => {
      const from = nodes.find((node: any) => node.id === edge.from);
      const path = el.querySelectorAll<SVGPathElement>('[data-wire]')[i];
      const start = path.getPointAtLength(0);
      return Math.hypot(start.x - (from.x + from.dx * opening + edge.fx), start.y - (from.y + from.dy * opening + edge.fy));
    });
  });
  expect(Math.max(...geometry)).toBeLessThan(.1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(figure).toHaveAttribute('data-opening', '0.000');
  await expect(figure.locator('.diagram-view')).toHaveText('Component study');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const before = await page.locator<HTMLCanvasElement>('#drafting-canvas').evaluate(el => el.toDataURL());
  await page.locator('.catalog-item').nth(10).scrollIntoViewIfNeeded();
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  await expect.poll(() => page.locator<HTMLCanvasElement>('#drafting-canvas').evaluate(el => el.toDataURL())).not.toBe(before);
  expect(await page.locator('#drafting-canvas').evaluate(el => el.getBoundingClientRect().top)).toBe(0);
});


test('touch scrolling drives diagrams and the carriage without pointer input', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://localhost:4322/');
  const figure = page.locator('[data-diagram]').nth(0);
  await figure.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - (innerHeight - el.clientHeight) / 2));
  await expect.poll(() => figure.getAttribute('data-opening')).toBe('1.000');
  expect(await figure.locator('[data-mobile-part]').first().evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(figure).toHaveAttribute('data-opening', '0.000');
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'false');
  await context.close();
});


test('workbench pieces can be grabbed, tossed and settle', async ({ page }) => {
  await page.addInitScript(installMotionProbe);await page.setViewportSize({width:1440,height:900});await page.goto('/');
  await expect(page.locator('[data-background="particles-workbench"]')).toBeVisible();
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-objects','8');
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating','true',{timeout:6000});
  const visible=(await scene(page)).bodies.filter((body:any)=>body.alpha>.6);
  expect(visible.length).toBeGreaterThan(0);
  const piece=visible[0];await page.mouse.move(piece.x,piece.y);
  await expect(page.locator('body')).toHaveAttribute('data-desk-hover','true');
  await page.mouse.down();await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-interaction','dragging');
  await page.mouse.move(piece.x+90,piece.y+40,{steps:5});await page.mouse.up();
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-interaction','idle');
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating','true',{timeout:6000});
});


test('hero particle wordmark disperses, reforms and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const canvas=page.locator<HTMLCanvasElement>('#hero-particles');
  await expect(canvas).toHaveAttribute('data-ready','true');
  expect(Number(await canvas.getAttribute('data-points'))).toBeGreaterThan(200);
  const before=await canvas.evaluate(el=>el.toDataURL());
  await page.getByRole('button',{name:'Scatter the particles'}).focus();
  await page.keyboard.press('Enter');
  await expect.poll(()=>canvas.evaluate(el=>el.toDataURL())).not.toBe(before);
  await expect(canvas).toHaveAttribute('data-phase','hold',{timeout:8000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(canvas).toHaveAttribute('data-running','false');
  await expect(page.locator('#scatter-particles')).toBeHidden();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-running','false');
});
