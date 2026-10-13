import { test, expect } from '@playwright/test';

test('device default, orange theme, keyboard toggle and persistence', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dark-palette', 'violet'));
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass('dark');
  const toggle = page.getByRole('switch', { name: 'Dark mode' });
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#dark-palette')).toHaveCount(0);
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page.locator('#dark-palette')).toHaveCount(0);
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass('dark');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#080808');
});

test('system changes follow preference until manually overridden', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass('dark');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
  await page.getByRole('switch', { name: 'Dark mode' }).click();
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).not.toHaveClass('dark');
});

test('storage unavailable still allows theme changes', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
  await page.getByRole('switch', { name: 'Dark mode' }).click();
  await expect(page.locator('html')).not.toHaveClass('dark');
  expect(errors).toEqual([]);
});

test('reduced-motion canvases repaint immediately without changing words', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/', '/projects']) {
    await page.goto(route);
    const canvas = page.locator(route === '/' ? '#hero-particles' : '.dynamic-particles canvas');
    await expect(route === '/' ? canvas : page.locator('.dynamic-particles')).toHaveAttribute('data-ready', 'true');
    if (await page.locator('html').evaluate(el => el.classList.contains('dark'))) await page.getByRole('switch', { name: 'Dark mode' }).click();
    const wordHost = route === '/' ? canvas : page.locator('.dynamic-particles');
    const word = await wordHost.getAttribute('data-word');
    const before = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
    await page.getByRole('switch', { name: 'Dark mode' }).click();
    const after = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
    expect(after).not.toBe(before);
    await expect(wordHost).toHaveAttribute('data-word', word!);
  }
});

test('without JavaScript, journal is readable and theme controls are hidden', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.theme-controls')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});
