import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.ts', workers: 1, retries: 0,
  use: { baseURL: 'http://localhost:4322', headless: true, launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } },
  reporter: [['list'], ['json', { outputFile: '.impeccable/review/browser-results.json' }]],
});
