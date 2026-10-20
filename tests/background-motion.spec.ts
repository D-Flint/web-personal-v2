import { test, expect } from '@playwright/test';
import { installMotionProbe, scene, settled } from './motion-probe.mjs';

for (const mobile of [false, true]) {
  for (const theme of ['light', 'dark']) {
    test(`particle background without desk objects: ${mobile ? 'mobile' : 'desktop'} ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        isMobile: mobile, hasTouch: mobile,
      });
      await context.addInitScript(installMotionProbe);
      await context.addInitScript(value => localStorage.setItem('theme', value), theme);
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        // Existing hero text sampling emits this Chromium performance advisory.
        if (message.type() === 'warning' && message.text().startsWith('Canvas2D: Multiple readback operations')) return;
        if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
      });
      page.on('requestfailed', request => errors.push(request.url()));
      for (const route of ['/', '/projects']) {
        await page.goto(`http://localhost:4322${route}`);
        await page.evaluate(() => document.fonts.ready);
        await settled(page);
        const before = await scene(page);
        expect(before.bodies).toHaveLength(0);
        expect(before.particles).toHaveLength(mobile ? 36 : 80);
        await expect(page.locator('[data-background="particles"]')).toBeVisible();
        await page.screenshot({ path: `.impeccable/review/no-desk-${mobile ? 'mobile' : 'desktop'}-${theme}-${route === '/' ? 'home' : 'projects'}.png` });
        await page.evaluate(() => scrollTo(0, 600));
        await settled(page);
        const scrolled = await scene(page);
        expect(scrolled.bodies).toHaveLength(0);
        expect(scrolled.particles.map(({ x, y }) => ({ x, y })))
          .toEqual(before.particles.map(({ x, y }) => ({ x, y })));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await expect(page.locator('body')).not.toHaveAttribute('data-desk-hover');
        await expect(page.locator('body')).not.toHaveAttribute('data-desk-dragging');
      }
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}

test('remaining particles respond locally and respect reduced motion and visibility', async ({ page }) => {
  await page.addInitScript(installMotionProbe);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await settled(page);
  const before = await scene(page);
  await page.mouse.move(500, 800);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(150);
  const after = await scene(page);
  expect(after.bodies).toHaveLength(0);
  expect(after.particles.map(({ x, y }) => ({ x, y })))
    .not.toEqual(before.particles.map(({ x, y }) => ({ x, y })));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await settled(page);
  const fixed = (await scene(page)).particles;
  await page.mouse.move(600, 800);
  await page.evaluate(() => scrollTo(0, 600));
  await page.waitForTimeout(200);
  expect((await scene(page)).particles.map(({ x, y }) => ({ x, y })))
    .toEqual(fixed.map(({ x, y }) => ({ x, y })));
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'false');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'false');
  await page.evaluate(() => {
    delete (document as any).hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('#drafting-canvas')).toHaveAttribute('data-animating', 'true');
});
