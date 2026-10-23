import { test, expect, type Page } from '@playwright/test';

// Chromium has no native soft keyboard. Model its visual viewport independently
// of the layout viewport, including Safari's possible vertical viewport pan.
async function setVisibleViewport(page: Page, height?: number, offsetTop = 0) {
  await page.evaluate(({ height, offsetTop }) => {
    const viewport = window.visualViewport!;
    if (height === undefined) {
      Reflect.deleteProperty(viewport, 'height');
      Reflect.deleteProperty(viewport, 'offsetTop');
    } else {
      Object.defineProperty(viewport, 'height', { configurable: true, value: height });
      Object.defineProperty(viewport, 'offsetTop', { configurable: true, value: offsetTop });
    }
    viewport.dispatchEvent(new Event('resize'));
    viewport.dispatchEvent(new Event('scroll'));
  }, { height, offsetTop });
}

async function expectPanelFits(page: Page) {
  const geometry = await page.evaluate(() => {
    const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
    const panel = rect('#neko-chat');
    const header = rect('.assistant-header');
    const content = rect('#assistant-content');
    const messages = rect('#chat-log');
    const prompts = rect('.chat-prompts');
    const form = rect('.chat-form');
    const reset = rect('#chat-reset');
    const viewport = window.visualViewport!;
    return {
      top: panel.top,
      bottom: panel.bottom,
      viewportTop: viewport.offsetTop,
      viewportBottom: viewport.offsetTop + viewport.height,
      contentHeight: content.height,
      headerOverlapsContent: header.bottom > content.top + 1,
      messagesOverlapPrompts: messages.bottom > prompts.top + 1,
      contentOverlapsForm: content.bottom > form.top + 1,
      formOverlapsReset: form.bottom > reset.top + 1,
      clippedMessages: document.querySelector('#chat-log')!.scrollHeight > messages.height + 1,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(geometry.top).toBeGreaterThanOrEqual(geometry.viewportTop + 11);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportBottom - 11);
  expect(geometry.contentHeight).toBeGreaterThan(60);
  expect(geometry.headerOverlapsContent).toBe(false);
  expect(geometry.messagesOverlapPrompts).toBe(false);
  expect(geometry.contentOverlapsForm).toBe(false);
  expect(geometry.formOverlapsReset).toBe(false);
  expect(geometry.clippedMessages).toBe(false);
  expect(geometry.overflow).toBe(false);
  await expect(page.locator('#chat-input')).toBeInViewport();
  await expect(page.locator('#chat-send')).toBeInViewport();
  await expect(page.locator('#assistant-close')).toBeInViewport();
}

for (const width of [1440, 390, 320]) {
  for (const theme of ['light', 'dark']) {
    test(`assistant keyboard layout and recovery at ${width}px in ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width, height: width === 1440 ? 900 : 844 },
        isMobile: width < 700,
        hasTouch: width < 700,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
      await page.goto('/');
      await page.locator('#assistant-open').click();
      await expect(page.locator('#chat-input')).toBeFocused();
      await expectPanelFits(page);
      if (width < 700) {
        expect(await page.locator('#chat-input').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
      }
      await page.screenshot({ path: `/tmp/assistant-${width}-${theme}.png` });

      for (const height of [380, 300]) {
        await setVisibleViewport(page, height, 40);
        await expectPanelFits(page);
      }
      await page.route('**/api/chat', route => route.fulfill({ status: 502, json: { error: 'Provider unavailable. Please retry your message.' } }));
      await page.locator('#chat-input').fill('Tell me about your projects.');
      await page.locator('#chat-send').click();
      await expect(page.locator('#chat-retry')).toBeVisible();
      await expect(page.locator('#chat-retry')).toBeInViewport();
      await expect(page.locator('#chat-input')).toHaveValue('Tell me about your projects.');
      await expectPanelFits(page);
      await page.screenshot({ path: `/tmp/assistant-keyboard-${width}-${theme}.png` });

      await page.unroute('**/api/chat');
      await page.route('**/api/chat', route => route.fulfill({ contentType: 'text/plain', body: 'An engineering project note.\n'.repeat(60) }));
      await page.locator('#chat-retry').click();
      await expect(page.locator('#chat-status')).toHaveText('Response complete.');
      await expect(page.locator('.chat-message.user')).toHaveCount(1);
      await expectPanelFits(page);
      const scrollRegion = page.locator('#assistant-content');
      expect(await scrollRegion.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
      await scrollRegion.evaluate(el => { el.scrollTop = 0; });
      await expect(page.locator('.chat-message').first()).toBeInViewport();
      await page.locator('#chat-reset').click();
      await expect(page.locator('#chat-log')).toContainText('Conversation cleared');
      await expectPanelFits(page);

      await setVisibleViewport(page);
      await expectPanelFits(page);
      await page.locator('#assistant-close').click();
      await expect(page.locator('#assistant-open')).toBeFocused();
      await page.locator('#assistant-open').click();
      await expectPanelFits(page);
      await page.keyboard.press('Escape');
      await expect(page.locator('#neko-chat')).not.toBeVisible();
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}
