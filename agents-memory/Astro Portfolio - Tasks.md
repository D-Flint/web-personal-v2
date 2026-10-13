# Astro Portfolio — Tasks

## Build Queue

- [x] **Mobile hamburger menu** — Implemented: glassmorphism slide-in drawer panel, backdrop overlay, close on X/backdrop/link click, body scroll lock
- [x] **Contact form backend** — Form submits to Web3Forms API (production-ready)
- [ ] **Live project URLs** — All `liveUrl` and `sourceUrl` links point to `https://github.com` as placeholders
- [x] **NekoWidget idle cycle messages** — Need more variety in the idle message pool
- [x] **SEO metadata** — Added `<meta name="description">` per route via BaseLayout `description` prop
- [x] **Accessibility audit** — Modal: `role="dialog"`, `aria-modal="true"`, focus trap. Cards: `role="button"`, `tabindex="0"`, Enter/Space. Filter bar: Enter/Space keyboard nav *(ArrowLeft/Right is commented-out dead code)*
- [x] **Performance optimization** — Astro `<Image />` with `loading="lazy"`/`"eager"`, CLS fixes (opacity-only reveal, SSR filter buttons, explicit navbar h-16)

## Polish

- [x] **Dark mode refinement** — Fixed: Tailwind v4 `@custom-variant dark` directive, all components (including modal) use consistent class-based dark mode
- [ ] **Sakura petal count** — Add preference setting for petal density (currently hardcoded to 35)
- [ ] **Project cards** — Add hover state for feature tags on the full catalog page (`/projects`)
- [ ] **Contact form validation messages** — Improve error styling and add field-level inline feedback
- [ ] **Build-size check** — Run `astro build` and audit `dist/` output for any large bundles

## Future Features

- [ ] **Blog section** — New `/blog` route with markdown/MDX content collection
- [ ] **i18n** — Khmer/English language toggle
- [ ] **View transition** — Astro 7 view transitions between `/` and `/projects`
- [ ] **Service worker** — Offline support via Workbox or Astro service worker integration
- [ ] **Analytics** — Plausible or Umami lightweight analytics snippet
- [ ] **Guestbook / comments** — Lightweight comment system on projects
