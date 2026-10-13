# Change Log

Tracking every file change made during development.


## 2026-07-09 (Performance Optimization)

| File | Change | Why |
|------|--------|-----|
| `src/components/SakuraCanvas.astro` | Added Page Visibility API — pauses canvas when tab hidden | Save CPU/GPU on background tabs |
| `src/components/Background.astro` | Added Page Visibility API — removes pointermove on tab hide | Stop wasted rAF work |
| `src/layouts/BaseLayout.astro` | Added preconnect + dns-prefetch for api.deepseek.com and api.web3forms.com | Faster first API call |
| `src/styles/global.css` | Added content-visibility: auto for #projects, #about, #contact | Defer off-screen rendering |
| `src/pages/api/chat.ts` | Added .trim() to key, startup validation, runtime 503 guard for missing key | Clear errors instead of confusing 401 |
| `public/robots.txt` | Created | Tell crawlers to index all pages |
| `public/sitemap.xml` | Created | Help search engines discover pages |
| `improve.md` | Created | Full performance audit with prioritized recommendations |
| `docs/change.md` | Updated | This entry |
| `README.md` | Updated | Documented all changes |

## 2026-06-10

| File | Change | Why |
|------|--------|-----|
| `src/pages/projects.astro` | Created with 6 initial projects | Add project catalog page |
| `src/components/ProjectGrid.astro` | Added "View All Projects" button linking to /projects | Navigate to full catalog |
| `src/components/Navbar.astro` | Home link changed from /#home to / | Root-relative for cross-page navigation |
| `src/styles/global.css` | Added whiskers CSS, dark mode CSS vars, theme overrides, scroll reveal transition | Cat whiskers effect + dark mode support |
| `src/components/Navbar.astro` | Added dark mode toggle button with localStorage script | Dark mode persistence |
| `src/components/Navbar.astro` | Added sakura toggle button placeholder | Prepare petal toggle |
| `src/components/ProjectGrid.astro` | Added .whisker-group class to project cards | Cat whiskers on cards |
| `src/components/AboutMe.astro` | Added .whisker-group class to tech stack card | Cat whiskers on skills |
| `src/components/Contact.astro` | Added .whisker-group class to contact card | Cat whiskers on contact |
| `src/pages/index.astro` | Removed Whiskers import, updated scroll script to bidirectional | Whiskers now CSS-only |
| `src/pages/projects.astro` | Added .whisker-group class to filter buttons | Cat whiskers on filters |
| `src/components/Whiskers.astro` | Deleted | Replaced by CSS pseudo-elements |
| `docs/` | Created about.md, build-log.md, change.md, unchanged.md | Project documentation |

## 2026-06-14

| File | Change | Why |
|------|--------|-----|
| `src/components/SakuraCanvas.astro` | Created — 35-bezier-petal canvas animation | Falling sakura petals feature |
| `src/components/Navbar.astro` | Added sakura toggle button with localStorage + custom event | Toggle petals on/off |
| `src/styles/global.css` | Added .sakura-paused rule | Hide canvas when toggled off |
| `src/pages/index.astro` | Imported SakuraCanvas | Display on homepage |
| `src/pages/projects.astro` | Imported SakuraCanvas + added tag filtering with FLIP animation | Display + filter on projects page |
| `src/pages/projects.astro` | Expanded from 6 to 19 projects | Richer catalog |
| `src/pages/projects.astro` | Implemented FLIP slide animation (1.2s cubic-bezier) | Smooth filter transitions |
| `src/pages/projects.astro` | Added hover scale effect on cards | Visual feedback |
| `src/pages/projects.astro` | Multi-select tag filtering with Set (OR logic) | Flexible filtering |
| `src/components/Navbar.astro` | Nav links changed to root-relative (/#about, /#contact) | Cross-page anchor navigation |

## 2026-06-15 (Session 8 — Neko Widget)

| File | Change | Why |
|------|--------|-----|
| `src/components/NekoWidget.astro` | Created — fixed bottom-right chatbot mascot with Q&A, speech bubble, hide/restore | Interactive mascot |
| `public/yae-mico-maid.png` | Added (465 KB) — maid outfit mascot image | Higher-detail avatar |
| `src/pages/index.astro` | Imported NekoWidget | Show on homepage |
| `src/pages/projects.astro` | Imported NekoWidget | Show on projects page |

## 2026-06-15 (Session 9 — Chat Scroll Fix + Layout Migration)

| File | Change | Why |
|------|--------|-----|
| `src/components/NekoWidget.astro` | Reworked chat to fixed-height flex column with flex-1 min-h-0 overflow-y-auto | Fix scrolling |
| `src/styles/global.css` | Removed global `div { overflow: visible !important; }` rule | Was blocking internal scroll |
| `src/layouts/BaseLayout.astro` | Created — shared layout with Background, SakuraCanvas, Navbar, NekoWidget, Footer | Cross-page persistence |
| `src/pages/index.astro` | Moved page content into BaseLayout | Use shared layout |
| `src/pages/projects.astro` | Moved page content into BaseLayout | Use shared layout |
| `src/components/NekoWidget.astro` | Updated script to is:inline (runs immediately) | Ensure widget works on all pages |

## 2026-06-15 (Session 10 — Cleanup)

| File | Change | Why |
|------|--------|-----|
| `src/components/Footer.astro` | Email changed to vuthihoeurb@gmail.com | Correct contact |
| `w.py` | Deleted | Unused script |
| `neko_b64.txt` | Deleted | Unused asset |
| `patch_neko.b64` | Deleted | Unused patch |
| `patch_neko_gen.py` | Deleted | Unused script |
| `create_script.py` | Deleted | Unused script |
| `temp_content.txt` | Deleted | Temp file |
| `test_write.txt` | Deleted | Temp file |
| `src/components/writer.ps1` | Deleted | Unused script |
| `docs/about.md` | Rewritten as complete reference | Better documentation |
| `docs/build-log.md` | Updated with all sessions | Keep history current |
| `docs/structure.md` | Updated tree + descriptions | Accurate structure |
| `docs/note.md` | Updated feature list | Accurate overview |
| `docs/tracker.md` | Updated with all sessions | Keep history current |
| `docs/unchanged.md` | Updated with removed files | Accurate file state |
| `README.md` | Rewritten with full paths + detailed sections | Better project readme |

## 2026-06-26 (Session 11 — Click Feedback Effects)

| File | Change | Why |
|------|--------|-----|
| `src/components/ClickEffects.astro` | Created global pointer click feedback component with neko paw ripple and sakura petal burst | Add section 4 interactive micro-feedback feature |
| `src/layouts/BaseLayout.astro` | Imported and mounted `ClickEffects` globally after `SakuraCanvas` | Make click effects available on every page |
| `docs/about.md` | Updated complete reference with click effects component details | Keep project reference current |
| `docs/structure.md` | Added `ClickEffects.astro` to tree and rendering model | Keep structure docs current |
| `docs/note.md` | Added click effects to quick reference and feature list | Keep overview current |
| `docs/tracker.md` | Added session log for click effects work | Keep session history current |

## 2026-06-26 (Session 12 — Contact Form Success Mascot Update)

| File | Change | Why |
|------|--------|-----|
| `src/components/Contact.astro` | Changed success state mascot from `/mascot.png` to `/yae-mico-maid.png`; scaled to 1.5x with `scale-150 object-center`; added `animate-bounce` | Use primary maid mascot for better visual consistency and animated success feedback |
| `README.md` | Updated Contact.astro description to reflect full form with success state | Keep readme accurate |
| `docs/about.md` | Updated Contact.astro section with success state details and mascot path | Keep reference current |
| `docs/unchanged.md` | Marked Contact.astro as modified | Track file state |
| `docs/structure.md` | Updated Contact.astro description | Keep structure docs current |

## 2026-06-29 (Session 14 — Navbar CLS Fix)

| File | Change | Why |
|------|--------|-----|
| `src/components/Navbar.astro` | Added `h-16` to `<header>` class | Explicit navbar height prevents CLS from `animate-drop-in` animation |

## 2026-06-29 (Session 15 — SEO/Lighthouse Fixes)

| File | Change | Why |
|------|--------|-----|
| `src/layouts/BaseLayout.astro` | Added `description` prop + `<meta name="description" content={description} />` in `<head>` | Lighthouse critical: missing meta description |
| `src/pages/projects.astro` | Passed `description` to BaseLayout | Descriptive per-page meta tag |
| `src/pages/projects.astro` | Added `role="button"` + `tabindex="0"` to project card divs | Lighthouse: links must be crawlable |
| `src/pages/projects.astro` | Added `keydown` (Enter/Space) handler on project cards | Keyboard accessibility for card modal trigger |
| `src/pages/projects.astro` | Passed `initialLiveUrl`/`initialSourceUrl` to ProjectModal | Crawlable href instead of `#` |
| `src/components/ProjectModal.astro` | Added `initialLiveUrl`/`initialSourceUrl` props; SSR uses them in `href` instead of `#` | Lighthouse: links crawlable + descriptive |
| `src/pages/index.astro` | (inherits default description from BaseLayout) | Consistent meta description on homepage |

## 2026-06-27 (Session 13 — Navbar Mobile Menu + Hover Effects)

| File | Change | Why |
|------|--------|-----|
| `src/components/Navbar.astro` | Added mobile hamburger menu panel with slide-in animation, glassmorphism drawer, backdrop overlay, close on backdrop/X/link click, body scroll lock | Mobile responsive navigation |
| `src/components/Navbar.astro` | Added `hover:scale-115` to hamburger button | 15% scale hover feedback |
| `src/components/Navbar.astro` | Changed all nav links to `hover:scale-125` (was 105) | 25% scale on hover |
| `src/components/Navbar.astro` | Added `display: inline-block` to `.nav-glow-link` CSS | Fix transform: scale() on inline `<a>` elements |
| `src/components/Navbar.astro` | Added `nav-glow-link` class + `hover:scale-125` to name logo | Pink glow + 25% scale on hover |
| `handoff.md` | Written with current state, completed work, blockers, next steps | Agent handoff |

## 2026-06-29 (Session 14 — Navbar CLS Fix)

| File | Change | Why |
|------|--------|-----|
| `src/components/Navbar.astro` | Added `h-16` to `<header>` class | Explicit navbar height prevents CLS from `animate-drop-in` animation |

## 2026-06-29 (Session 15 — SEO/Lighthouse Fixes)

| File | Change | Why |
|------|--------|-----|
| `src/layouts/BaseLayout.astro` | Added `description` prop + `<meta name="description" content={description} />` in `<head>` | Lighthouse critical: missing meta description |
| `src/pages/projects.astro` | Passed `description` to BaseLayout | Descriptive per-page meta tag |
| `src/pages/projects.astro` | Added `role="button"` + `tabindex="0"` to project card divs | Lighthouse: links must be crawlable |
| `src/pages/projects.astro` | Added `keydown` (Enter/Space) handler on project cards | Keyboard accessibility for card modal trigger |
| `src/pages/projects.astro` | Passed `initialLiveUrl`/`initialSourceUrl` to ProjectModal | Crawlable href instead of `#` |
| `src/components/ProjectModal.astro` | Added `initialLiveUrl`/`initialSourceUrl` props; SSR uses them in `href` instead of `#` | Lighthouse: links crawlable + descriptive |
| `src/pages/index.astro` | (inherits default description from BaseLayout) | Consistent meta description on homepage |

## 2026-06-29 (Session 16 — Image Migration)

| File | Change | Why |
|------|--------|-----|
| `src/assets/images/` | Created with 4 optimized images (mascot.png, yae-mico-maid.png, yae-miko-chibi.jpg, yae-miko-tiny.png) | Move images for Astro `<Image />` optimization |
| `src/components/AboutMe.astro` | Migrated from `<img>` to Astro `<Image />` import | Auto WebP conversion + responsive sizing |
| `src/components/Contact.astro` | Migrated to `<Image />`; success state now uses `yae-miko-tiny.png` | Optimization + correct mascot path |
| `src/components/NekoWidget.astro` | Migrated to `<Image />` with loading="eager"/"lazy" | Above/below-fold image optimization |
| `src/pages/index.astro` | Migrated hero chibi to `<Image />` with loading="eager" | Above-the-fold optimization |
| `public/` | Removed mascot.png, yae-mico-maid.png, yae-miko-chibi.jpg (duplicates) | Images now served from src/assets/images/ |

## 2026-07-07 (Session 21 — NekoGameModal Merge + Paw SVG)

| File | Change | Why |
|------|--------|-----|
| `src/components/NekoGameModal.astro` | Created — 3-screen Whack-a-Mole arcade game modal (setup, play, results), 3×3 mole grid, bright-pink SVG paws (+1 pt), golden sakura bonuses (+3 pts), bombs (−3 pts), per-duration high scores, CustomEvent bridge (`neko-open-game` / `neko-game-result`), focus trap, Escape/backdrop close | New interactive game feature replacing inline Petal Catch mini-game |
| `src/components/NekoWidget.astro` | Replaced inline Petal Catch mini-game with "🎮 Whack-a-Mole" chip dispatching `neko-open-game`; added GitHub, Design, Neko chips; added `neko-game-result` listener for post-game reactions; fixed duplicate `<style>` tag bug | Delegate game to standalone modal, richer chip set |
| `src/layouts/BaseLayout.astro` | Added NekoGameModal import + component; removed TraceArt import and trace-art-wrapper div | Mount new game modal globally, clean up unused decoration |
| `src/components/NekoGameModal.astro` | Replaced 🐾 text emoji with bright-pink SVG paw (#f472b6, #f9a8d4, #ec4899) | Dark emoji was hard to see; SVG is vivid and legible |
| `README.md` | Added NekoGameModal section, updated NekoWidget chip list, project structure, layout, note count | Documentation sync |
| `agents-memory/architecture.md` | Added service #11 (Neko Game Modal), dependency edges, event channel C, z-index (110), game high score localStorage key | Documentation sync |
| `docs/structure.md` | Added NekoGameModal.astro to tree, updated component count 10→11 | Documentation sync |
| `docs/change.md` | Added this session entry | Keep change log current |
| `docs/tracker.md` | Added this session entry | Keep tracker current |

## 2026-06-29 (Session 17 — CLS Fixes)

| File | Change | Why |
|------|--------|-----|
| `src/pages/projects.astro` | Server-render all filter buttons via `{allTags.map(...)}`; removed 20 lines JS button creation | Eliminates grid reflow CLS from JS injection |
| `src/pages/projects.astro` | Changed card transition from `transition-all duration-500` to `transition-opacity transition-shadow duration-300` | Reduce jank on filter |
| `src/components/ProjectGrid.astro` | Removed `translate-y-8` from `.reveal` class | Eliminates 32px CLS on scroll-reveal |
| `src/components/AboutMe.astro` | Removed `translate-y-8` from `.reveal` class | Eliminates 32px CLS on scroll-reveal |
| `src/components/Contact.astro` | Removed `translate-y-8` from `.reveal` class | Eliminates 32px CLS on scroll-reveal |
| `src/pages/index.astro` | JS now only toggles `opacity-0`/`opacity-100` (no translate-y toggle) | CLS fix for scroll-reveal |
| `src/styles/global.css` | `.reveal` transition now opacity only | CLS fix for scroll-reveal |

## 2026-07-01 (Session 18 — Dark Mode Sync Fix)

| File | Change | Why |
|------|--------|-----|
| `src/styles/global.css` | Added `@custom-variant dark (&:where(.dark, .dark *));` after `@import "tailwindcss";` | Tailwind v4 defaults `dark:` variant to `@media (prefers-color-scheme: dark)`. This directive switches to class-based `.dark` on `<html>`, so the navbar toggle button controls all `dark:` utility classes (e.g., `dark:bg-slate-900/90`, `dark:text-pink-50`) across every component including the project modal. Without this, the modal and all other components ignored the toggle button and only responded to the OS dark mode setting. |


## 2026-07-06 (Session 19 — Codebase Cleanup & Docs Refresh)

| File | Change | Why |
|------|--------|-----|
| `src/` (root) | Deleted 8 root junk files: `_apply_zoom.py`, `_build.py`, `_patch.mjs`, `_repair.py`, `handoff.md`, `handoff.txt`, `new-feature.md`, `run.txt` | Clean up workspace |
| `Desktop/` | Deleted stale nested duplicate project copy | Clean up workspace |
| `.agents/`, `web-personal/` | Deleted empty directories | Clean up workspace |
| `.env` | Deleted empty file | Clean up workspace |
| `agents-memory/architecture.md` | Fixed stale risk mitigations (lazy loading, asset paths, contact form) | Keep docs in sync |
| `agents-memory/service - Project Catalog.md` | Project count 14 to 19 | Keep docs in sync |
| `agents-memory/service - Scroll Reveal.md` | Removed translate-y references (CLS fix) | Keep docs in sync |
| `agents-memory/Astro Portfolio - Tasks.md` | Marked 6 completed items | Keep docs in sync |
| `docs/structure.md` | Removed run.txt reference | Keep docs in sync |
| `docs/unchanged.md` | Updated file status for Background.astro, added deleted files | Keep docs in sync |

## 2026-07-06 (Session 20 — Documentation Sync)

| File | Change | Why |
|------|--------|-----|
| `docs/unchanged.md` | Removed `run.txt` from untouched files; fixed project count (6→19); removed handoff.md from added files; added @custom-variant dark to global.css changes | Stale references cleanup |
| `agents-memory/Astro Portfolio - Architecture.md` | Removed stale public/ image paths (mascot.png, yae-mico-maid.png, yae-miko-chibi.jpg); updated project count 14→19 in hierarchy and routes | Images migrated to src/assets/images/ |
| `agents-memory/Astro Portfolio - Tasks.md` | Marked NekoWidget idle cycle messages as completed | Task status sync |
| `README.md` | Verified accuracy — no changes needed | Documentation audit |
| `docs/change.md` | Added this session entry | Keep change log current |
| `docs/tracker.md` | Added this session entry | Keep tracker current |

## 2026-07-08 (Session 22 — Full Documentation Sync)

| File | Change | Why |
|------|--------|-----|
| `README.md` | Fixed Background.astro description (5 layers), NekoWidget chat height (560→700px), scroll reveal (added directional exit), TraceArt.astro entry, Navbar filterTags prop, ProjectModal SSR props, keyboard nav status, project tree, note count (16→17) | Match actual source code |
| `docs/about.md` | Same Background, NekoWidget, scroll reveal, keyboard nav fixes; added TraceArt.astro, Navbar filterTags, ProjectModal SSR props, Whack-a-Mole game details | Match actual source code |
| `docs/structure.md` | Background desc fix, added TraceArt.astro to tree, component count 11→12 | Match actual source code |
| `docs/note.md` | Background, NekoWidget, keyboard nav, added TraceArt, NekoGameModal, note count 15→17 | Match actual source code |
| `docs/unchanged.md` | Background.astro now marked modified, added TraceArt.astro and NekoGameModal.astro to added files | Match actual file state |
| `docs/build-log.md` | Added this session entry | Keep history current |
| `docs/tracker.md` | Added this session entry | Keep history current |
| `docs/change.md` | Added this session entry | Keep change log current |
| `agents-memory/*` | Updated to match source code — fixed Background, scroll reveal, project stats | Keep agents-memory in sync |


## 2026-07-09 (Session 24 — Vercel nodejs24.x Runtime Fix)

| File | Change | Why |
|------|--------|-----|
| `astro.config.mjs` | Changed `output: 'static'` to `'server'`, added `adapter: vercel()` | Astro 7 static output dropped the server entry point for API routes |
| `package.json` | Build script patched to force `nodejs24.x` → `nodejs22.x`; added `@astrojs/vercel` and `@vercel/speed-insights` deps | Vercel serverless doesn't support nodejs24.x yet |
| `vercel.json` | Created then removed (schema error) | Attempted alternative fix — `nodeVersion` is not a valid key |
| All docs + agents-memory | Updated for hybrid output, Vercel adapter, new deps, postbuild patch | Documentation sync |
