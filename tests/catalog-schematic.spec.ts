import { test, expect } from '@playwright/test';
import { projectPreviews } from '../src/data/projectPreviews';
import { routePath } from '../src/utils/projectAssembly';

for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
  test(`catalog complete graphs and idle flow at ${width} in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(request.url()));
    await page.goto('/projects');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('[data-diagram], [data-assembly-enhanced]')).toHaveCount(0);
    for (const id of ['01', '02', '03', '04']) {
      const figure = page.locator(`[data-catalog-schematic="${id}"]`);
      await figure.scrollIntoViewIfNeeded();
      const svg = figure.locator('.assembly-svg:visible');
      const kind = await svg.getAttribute('data-assembly-layout') as 'desktop' | 'mobile';
      const preview = projectPreviews[id];
      await expect(svg.locator('[data-assembly-node]')).toHaveCount(preview.nodes.length);
      for (const node of preview.nodes) {
        const placement = node[kind];
        await expect(svg.locator(`[data-assembly-node="${node.id}"]`)).toHaveAttribute('transform', `translate(${placement.x} ${placement.y})`);
      }
      for (const edge of preview.edges) {
        await expect(svg.locator(`[data-assembly-wire="${edge.id}"]`)).toHaveAttribute('d', routePath(edge[kind]));
        await expect(svg.locator(`[data-assembly-head="${edge.id}"]`)).toBeVisible();
      }
      await expect.poll(() => svg.locator('[data-assembly-packet]').evaluateAll(paths => paths.every(path => path.getAnimations()[0]?.playState === 'running'))).toBe(true);
      const moved = await svg.locator('[data-assembly-packet]').first().evaluate(async path => {
        const animation = path.getAnimations()[0];
        const before = Number(animation.currentTime);
        await new Promise(resolve => setTimeout(resolve, 100));
        return Number(animation.currentTime) > before;
      });
      expect(moved).toBe(true);
      await figure.screenshot({ path: `.impeccable/review/catalog-idle/${width}-${theme}-${id}.png` });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('catalog flow suspends offscreen, when filtered, in list view, hidden and reduced motion', async ({ page }) => {
  await page.goto('/projects');
  const figure = page.locator('[data-catalog-schematic="01"]');
  const packets = figure.locator('.assembly-svg:visible [data-assembly-packet]');
  const running = () => packets.evaluateAll(paths => paths.length > 0 && paths.every(path => path.getAnimations()[0]?.playState === 'running'));
  const stopped = () => figure.locator('[data-assembly-packet]').evaluateAll(paths => paths.every(path => path.getAnimations().every(animation => animation.playState === 'paused')));
  await figure.scrollIntoViewIfNeeded();
  await expect.poll(running).toBe(true);
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await expect.poll(stopped).toBe(true);
  await figure.scrollIntoViewIfNeeded();
  await expect.poll(running).toBe(true);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(stopped).toBe(true);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(running).toBe(true);
  await page.locator('[data-category="tools"]').click();
  await expect.poll(stopped).toBe(true);
  await page.locator('[data-category="all"]').click();
  await figure.scrollIntoViewIfNeeded();
  await expect.poll(running).toBe(true);
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await expect.poll(stopped).toBe(true);
  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  await figure.scrollIntoViewIfNeeded();
  await expect.poll(running).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await figure.scrollIntoViewIfNeeded();
  await expect.poll(running).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(stopped).toBe(true);
  await expect(figure).not.toHaveAttribute('data-assembly-flow');
  await expect(figure.locator('.assembly-mobile [data-assembly-node]')).toHaveCount(7);
});

test('catalog has complete diagrams without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/projects');
  for (const id of ['01', '02', '03', '04']) {
    const figure = page.locator(`[data-catalog-schematic="${id}"]`);
    await expect(figure.locator('.assembly-mobile [data-assembly-node]')).toHaveCount(projectPreviews[id].nodes.length);
    await expect(figure.locator('.assembly-mobile [data-assembly-head]')).toHaveCount(projectPreviews[id].edges.length);
    expect(await figure.locator('[data-assembly-node]').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === '1'))).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
