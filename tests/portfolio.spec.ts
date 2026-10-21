import { test, expect } from '@playwright/test';

test('navigation, all records, resume and external link truth', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software');
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page.locator('.catalog-item')).toHaveCount(4);
  await expect(page.locator('.catalog-item h2')).toHaveText(['Agentic AI Assistant', 'Portfolio Website', 'Task Automation Bot', 'AI Models Finder']);
  await expect(page.locator('.catalog-item.has-study [data-catalog-schematic]')).toHaveCount(4);
  await page.getByRole('button', { name: 'View Portfolio Website details', exact: true }).click();
  await expect(page.locator('#detail-live')).toHaveAttribute('href', 'https://hoeurbvuthi.site/');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'View AI Models Finder details' }).click();
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
  await expect(page.locator('#project-count')).toHaveText('1 of 4 projects');
  await page.locator('#project-search').fill('No matching record xyz');
  await expect(page.locator('#empty-results')).toBeVisible();
  await page.getByRole('button', { name: 'Reset search & filters' }).click();
  await expect(page.locator('.catalog-item:visible')).toHaveCount(4);
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

test('chat configuration error, retry, decoded streaming contract and reset', async ({ page }) => {
  await page.route('**/api/chat', route => route.fulfill({ status: 503, json: { error: 'Chat service not configured — missing API key.' } }));
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


test('catalog keeps complete schematics fixed while scrolling and the drafting field active', async ({ page }) => {
  await page.goto('/projects');
  const figure = page.locator('[data-catalog-schematic]').first();
  const geometry = () => figure.locator('[data-assembly-node], [data-assembly-wire], [data-assembly-head]').evaluateAll(elements =>
    elements.map(element => [element.getAttribute('transform'), element.getAttribute('d'), getComputedStyle(element).opacity]));
  const complete = await geometry();
  await figure.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 240);
  await expect(figure).toHaveAttribute('data-assembly-flow', '');
  expect(await geometry()).toEqual(complete);
  await expect(page.locator('[data-diagram], [data-project-assembly]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(figure).not.toHaveAttribute('data-assembly-flow');
  expect(await geometry()).toEqual(complete);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const before = await page.locator<HTMLCanvasElement>('#drafting-canvas').evaluate(el => el.toDataURL());
  await page.locator('.catalog-item').nth(3).scrollIntoViewIfNeeded();
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  await expect.poll(() => page.locator<HTMLCanvasElement>('#drafting-canvas').evaluate(el => el.toDataURL())).not.toBe(before);
  expect(await page.locator('#drafting-canvas').evaluate(el => el.getBoundingClientRect().top)).toBe(0);
});

test('touch scrolling preserves complete catalog diagrams without assembly', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://localhost:4322/projects');
  const figure = page.locator('[data-catalog-schematic]').first();
  await figure.scrollIntoViewIfNeeded();
  const nodes = figure.locator('.assembly-mobile [data-assembly-node]');
  const transforms = await nodes.evaluateAll(elements => elements.map(element => element.getAttribute('transform')));
  const client = await context.newCDPSession(page);
  await client.send('Input.synthesizeScrollGesture', { x: 200, y: 600, yDistance: -180, speed: 600, gestureSourceType: 'touch' });
  expect(await nodes.evaluateAll(elements => elements.map(element => element.getAttribute('transform')))).toEqual(transforms);
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-running', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(figure).not.toHaveAttribute('data-assembly-flow');
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'false');
  await context.close();
});


test('hero particle wordmark disperses, reforms and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const canvas=page.locator<HTMLCanvasElement>('#hero-particles');
  await expect(canvas).toHaveAttribute('data-ready','true');
  expect(Number(await canvas.getAttribute('data-points'))).toBeGreaterThan(200);
  const before=await canvas.evaluate(el=>el.toDataURL());
  await canvas.click();
  await expect.poll(()=>canvas.evaluate(el=>el.toDataURL())).not.toBe(before);
  await expect(canvas).toHaveAttribute('data-phase','hold',{timeout:8000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(canvas).toHaveAttribute('data-running','false');
  await expect(page.locator('#scatter-particles')).toBeHidden();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-running','false');
});


test('assistant keeps page scrolling available in both themes and viewport sizes', async ({ browser }) => {
  for (const width of [1440, 390]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: {width, height: width === 390 ? 844 : 900}, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
      await page.goto('/');
      await page.locator('#assistant-open').click();
      await expect(page.locator('#chat-input')).toBeFocused();
      expect(await page.locator('#neko-chat').evaluate(el => el.matches(':modal'))).toBe(false);
      await page.mouse.move(4, 150);
      await page.mouse.wheel(0, 450);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
      await expect(page.locator('#neko-chat')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.route('**/api/chat', route => route.fulfill({ contentType: 'text/event-stream', body: 'A project note.\n'.repeat(80) }));
      await page.locator('#chat-input').fill('Tell me about your projects.');
      await page.locator('#chat-send').click();
      await expect(page.locator('#chat-status')).toHaveText('Response complete.');
      const pageScroll = await page.evaluate(() => scrollY);
      const chatScroll = await page.locator('#chat-log').evaluate(el => el.scrollTop);
      await page.locator('#chat-log').hover();
      await page.mouse.wheel(0, -150);
      await expect.poll(() => page.locator('#chat-log').evaluate(el => el.scrollTop)).toBeLessThan(chatScroll);
      expect(await page.evaluate(() => scrollY)).toBe(pageScroll);
      await page.screenshot({path: `/tmp/chat-scroll-${width}-${theme}.png`});
      await page.keyboard.press('Escape');
      await expect(page.locator('#neko-chat')).not.toBeVisible();
      await expect(page.locator('#assistant-open')).toBeFocused();
      expect(errors).toEqual([]);
      await context.close();
    }
  }
});
