import { test, expect } from '@playwright/test';

test('agent discovery provides working page links and truthful resume status', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  const content = await response.text();
  expect(content).toMatch(/^# Hoeurb Vuthi/m);
  expect(content).toContain('The resume is temporarily unavailable.');
  expect(content).not.toContain('/resume.pdf');
  const links = [...content.matchAll(/\[([^\]]+)\]\((https:\/\/hoeurbvuthi\.site\/[^)]*)\)/g)];
  expect(links.map(link => link[1])).toEqual(['Home', 'Projects', 'Contact', 'Resume']);
  for (const [, , href] of links) {
    const url = new URL(href);
    // Check the current local build; never send forms or invoke the chat provider.
    expect((await request.get(url.pathname)).status()).toBe(200);
  }
});

for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
  test(`catalog remains a region through view changes at ${width} in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto('/projects');
    expect(response?.status()).toBe(200);
    const catalog = page.getByRole('region', { name: 'Projects', exact: true });
    await expect(catalog).toBeVisible();

    for (const [label, view] of [['List', 'list'], ['Gallery', 'grid']]) {
      const button = page.getByRole('button', { name: label, exact: true });
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.view-controls [aria-pressed="true"]')).toHaveCount(1);
      await expect(catalog).toHaveAttribute('data-view', view);
      await expect(catalog).not.toHaveAttribute('aria-pressed');
      await page.reload();
      await expect(catalog).toHaveAttribute('data-view', view);
      await expect(catalog).not.toHaveAttribute('aria-pressed');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }

    await page.locator('#project-search').fill('SQLite');
    await expect(page.locator('.catalog-item:visible')).toHaveCount(1);
    await expect(page.locator('#project-count')).toHaveText('1 of 4 projects');
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await expect(page.locator('.catalog-item:visible')).toHaveCount(4);
    await expect(catalog).not.toHaveAttribute('aria-pressed');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `.impeccable/review/agentic/catalog-${width}-${theme}.png` });
  });
}
