// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  output: 'server',
  redirects: {
    '/resume.pdf': { destination: '/resume', status: 302 },
  },
  devToolbar: { enabled: false },
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: true,
      cssMinify: true,
    },
  },
});