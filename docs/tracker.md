# Conversation & Task Log

Detailed session-by-session record of development work.

## 2026-06-10

### Session 1 — Initial Exploration
- Navigated to project directory
- Read all source files to understand the codebase
- Created the docs/ folder with note.md, tracker.md, change.md, unchanged.md

### Session 2 — Projects Page & Nav Fix
- Created `src/pages/projects.astro` with 6 initial projects
- Added "View All Projects" button to `ProjectGrid.astro` linking to /projects
- Fixed Navbar Home link from #home to / (root-relative for cross-page nav)

### Session 3 — Cat Whiskers (3 attempts)
- **Attempt 1**: Created `Whiskers.astro` component using inline SVG — failed because SVG overflow was clipped
- **Attempt 2**: Switched to CSS `::before`/`::after` pseudo-elements — failed because selector was wrong
- **Attempt 3**: Fixed selector to `.whisker-group:hover::before` + `overflow: visible` fix — **SUCCESS**
- Deleted `Whiskers.astro` (replaced entirely by CSS)

### Session 4 — Dark Mode
- Added CSS custom properties on `:root` (light values) and `.dark` (dark values)
- Added dark mode toggle button in Navbar with sun/moon SVG icons
- Implemented localStorage persistence (theme key)
- Added system preference detection (prefers-color-scheme: dark) for first visit

### Session 5 — Scroll Reveal Fix
- Changed IntersectionObserver from one-directional (fade in only) to bidirectional (fade in on enter, fade out on leave)
- Applied .reveal class to sections with opacity-0 translate-y-8 initial state

## 2026-06-14

### Session 6 — Falling Sakura Petals
- Created `SakuraCanvas.astro` with HTML5 Canvas
- Implemented `SakuraSimulation` class: 35 petals, bezier curve shapes, 3 pink color variants
- Added wind drift, rotation, seamless off-screen recycling
- Added sakura toggle button in Navbar (🌸) with localStorage persistence
- Added custom event (sakura-toggle) for cross-component communication

### Session 7 — Tag Filtering
- Implemented FLIP (First-Last-Invert-Play) animation for smooth grid reflow
- Transition: 1.2s cubic-bezier(0.16, 1, 0.3, 1) — pop-out easing
- Expanded from 6 to 19 projects
- 28 unique tags auto-generated from project data
- Multi-select filter using Set: click to toggle, "All" clears all
- OR logic: cards matching ANY selected tag remain visible
- Filter buttons: pink glow shadow on hover via Tailwind arbitrary values
- Nav links made root-relative for cross-page anchor navigation

## 2026-06-15

### Session 8 — Neko Widget (v1)
- Created `NekoWidget.astro` — fixed bottom-right chatbot mascot
- Avatar: `/yae-mico-maid.png` (changed from original /mascot.png)
- Speech bubble with idle messages + contextual section detection via IntersectionObserver
- Expandalbe chat panel with message history (user right, bot left)
- Typing indicator (3 bouncing dots, 600ms delay)
- Q&A chips (Who are you / Skills / Cat joke / Hire me) + text input with keyword detection
- Hide button with localStorage persistence + restore paw button
- Breathing + wiggle CSS animations
- Imported NekoWidget on both index.astro and projects.astro pages

### Session 9 — Chat Scroll Fix & Layout Migration
- **Problem identified**: Chat panel wouldn't scroll because:
  1. Speech bubble had `overflow: hidden` clipping the chat
  2. Global CSS had `div { overflow: visible !important }` blocking internal scroll containers
  3. Chat layout used percentage heights without proper flex constraints
- **Fix**:
  1. Moved mascot into a shared `BaseLayout.astro` so it persists across page navigation
  2. Reworked chat panel into fixed-height (560px) flex column
  3. Header and footer: `shrink-0` (don't shrink)
  4. Message area: `flex-1 min-h-0 overflow-y-auto` (grow but don't overflow flex)
  5. Added MutationObserver for auto-scroll to bottom on new messages
  6. Added Reset chat button to clear conversation in-place
  7. Removed global overflow override from global.css
  8. Added break-words / whitespace-pre-wrap on message bubbles

### Session 10 — Final Cleanup & Documentation
- Updated Footer email from placeholder to vuthihoeurb@gmail.com
- Removed unused files: w.py, neko_b64.txt, patch_neko.b64, patch_neko_gen.py, create_script.py, temp_content.txt, test_write.txt, writer.ps1
- Rewrote all docs/ files as comprehensive reference
- Rewrote README.md with full file paths, component descriptions, and architecture details

## 2026-06-26

### Session 11 — Click Feedback Effects
- Read `handoff.md`, `docs/about.md`, and section 4 of `new-feature.md`
- Created `src/components/ClickEffects.astro`
- Added a fixed, pointer-events-none overlay for decorative click particles
- On pointer click, spawns one translucent neko paw ripple and 4-6 sakura petals
- Uses CSS-variable keyframe animation, `DocumentFragment` batching, automatic `animationend` cleanup, and a 50-particle cap
- Respects `prefers-reduced-motion: reduce` and disables effects for coarse/touch pointers
- Mounted `ClickEffects` globally in `src/layouts/BaseLayout.astro`
- Verified with `npm.cmd run build`

## 2026-06-27

### Session 13 — Navbar Mobile Menu + Hover Effects
- Read handoff.md which outlined two possible next steps: mobile hamburger menu panel or contact form backend
- Implemented mobile hamburger menu panel in Navbar.astro with slide-in animation from right
- Glassmorphism drawer (bg-white/80 backdrop-blur-xl) with semi-transparent backdrop overlay (bg-black/20 backdrop-blur-sm)
- Close on backdrop click, X button click, or nav link click
- Body overflow-hidden while menu open, hidden after 300ms transition completes
- Added hover:scale-115 to hamburger button
- Changed all desktop nav links from hover:scale-105 to hover:scale-125
- Added hover:scale-125 to Contact button
- Added `display: inline-block` to `.nav-glow-link` CSS — fix for transform: scale() not working on inline `<a>` elements
- Added nav-glow-link class + hover:scale-125 to the name "Hoeurb Vuthi" for pink glow + scale on hover
- Build verified with npm run build (0 errors)
- Updated docs/change.md, docs/note.md, docs/build-log.md, docs/structure.md, docs/tracker.md, README.md
- Created root handoff.md for next agent

## 2026-06-29

### Session 14 — Navbar CLS Fix
- Added `h-16` to `<header>` in Navbar.astro to give the navbar an explicit height
- Fixes layout shift from `animate-drop-in` animation before JS loads

### Session 15 — SEO/Lighthouse Fixes
- Added `description` prop + `<meta name="description">` in BaseLayout.astro `<head>`
- Passed per-page `description` to BaseLayout from projects.astro
- Added `role="button"` + `tabindex="0"` + keyboard handler (Enter/Space) to all 13 project card divs in projects.astro
- Passed SSR `initialLiveUrl`/`initialSourceUrl` props to ProjectModal so `<a>` links have crawlable hrefs instead of `#`

### Session 16 — Image Migration
- Moved 4 images from `public/` to `src/assets/images/` (mascot.png, yae-mico-maid.png, yae-miko-chibi.jpg, yae-miko-tiny.png)
- Replaced all `<img>` tags with Astro `<Image />` in 4 components: AboutMe.astro, Contact.astro, index.astro, NekoWidget.astro
- Added `loading="eager"` to 2 above-the-fold images; `loading="lazy"` to 3 below-the-fold
- Cleaned up 6 temp/backup files
- Removed duplicate images from public/ (now only favicon.ico + favicon.svg remain)

### Session 17 — CLS Fixes
- Scroll-reveal: changed `.reveal` transition to opacity-only (removed translate-y) across 3 components + global.css
- Project page filter buttons: server-render all buttons instead of JS injection — eliminates grid reflow
- Reduced card transition properties to opacity + shadow only (removed transform/layout animations)
- Build verified with npm run build
- Build verified with npm run build

## 2026-07-01

### Session 18 — Dark Mode Sync Fix
- **Problem:** Project modal (and all `dark:` Tailwind classes) ignored the dark mode toggle button. They only responded to `prefers-color-scheme: dark` media query.
- **Root cause:** Tailwind CSS v4 defaults the `dark:` variant to `@media (prefers-color-scheme: dark)`, but the navbar toggle button adds/removes `.dark` class on `<html>`.
- **Fix:** Added `@custom-variant dark (&:where(.dark, .dark *));` to `src/styles/global.css` after `@import "tailwindcss";`. This switches Tailwind v4 to class-based dark mode, so `.dark` on `<html>` controls all `dark:` utility classes.
- Build verified with `npm run build`
- Updated README.md, agents-memory docs, and docs/

## 2026-07-07

### Session 21 — NekoGameModal Merge + Paw SVG
- Merged 3 new files from `src/New/` into existing codebase:
  - `BaseLayout.astro` → `src/layouts/BaseLayout.astro` (added NekoGameModal, removed TraceArt)
  - `NekoGameModal.astro` → `src/components/NekoGameModal.astro` (new file — Whack-a-Mole arcade game)
  - `NekoWidget.astro` → `src/components/NekoWidget.astro` (replaced inline Petal Catch with Whack-a-Mole chip)
- Fixed duplicate `<style>` tag bug in NekoWidget
- Replaced dark 🐾 paw emoji with bright-pink SVG paw (#f472b6, #f9a8d4, #ec4899) in game for visibility
- Updated all documentation: README.md, agents-memory/architecture.md (service #11, event channel C, z-110), docs/structure.md, docs/change.md, docs/tracker.md
- Cleaned up `src/New/` folder after merge
- Build verified: 0 errors, 2 pages

## 2026-07-06

### Session 19 — Codebase Cleanup & Docs Refresh
- Deleted 13 root junk files/dirs: `_apply_zoom.py`, `_build.py`, `_patch.mjs`, `_repair.py`, `handoff.md`, `handoff.txt`, `new-feature.md`, `run.txt`, `.env`, `Desktop/`, `.agents/`, `web-personal/`
- Updated agents-memory vault: fixed stale project counts, marked 6 completed tasks, updated scroll-reveal and architecture risk tables
- Updated docs: removed run.txt reference from structure.md, added deleted files to unchanged.md, updated build-log.md and tracker.md
- Build verified with `npm run build` (2 pages, 0 errors)

### Session 20 — Documentation Sync & Audit
- Read all docs and agents-memory files to audit for stale references
- `docs/unchanged.md`: Removed `run.txt` from untouched files (it was deleted); fixed project count from "6→14→13" to "6→19"; removed `handoff.md` from added files; added `@custom-variant dark` entry to global.css changes
- `agents-memory/Astro Portfolio - Architecture.md`: Removed stale public/ image paths (mascot.png, yae-mico-maid.png, yae-miko-chibi.jpg) from directory structure; updated project count from 14 to 19 in hierarchy and routes
- `agents-memory/Astro Portfolio - Tasks.md`: Marked NekoWidget idle cycle messages task as completed
- `docs/change.md`, `docs/tracker.md`: Added entries for this session
- `README.md`: Verified accuracy — no changes needed

## 2026-07-08

### Session 22 — Full Documentation Sync
- Read all source files in `src/` (12 components, 2 pages, 1 layout, 1 stylesheet, 4 images) and compared against docs
- Identified discrepancies: Background.astro completely rewritten (not kitsune tails), NekoWidget height wrong, scroll reveal policy inconsistent, TraceArt.astro undocumented, keyboard nav dead code, missing props documentation
- Updated `README.md`, `docs/about.md`, `docs/structure.md`, `docs/note.md`, `docs/unchanged.md`, `docs/build-log.md`, `docs/change.md`, `docs/tracker.md`
- Updated agents-memory/ vault files to match current source state
- All docs now accurately reflect source code as of 2026-07-08



## 2026-07-09

### Session 24 — Vercel nodejs24.x Runtime Fix
- **Problem:** Production deployment crashed because `@astrojs/vercel` auto-detected Node.js v24.14.0 and generated `nodejs24.x` runtime — Vercel serverless doesn't support it
- **Fix:** Changed `output` from `static` to `server` + `adapter: vercel()`; added postbuild patch to force `nodejs22.x` in `.vc-config.json`
- Added `@astrojs/vercel` and `@vercel/speed-insights` to package.json dependencies
- Created then removed vercel.json (schema error)
- Updated README.md, AGENTS.md, all docs/, and agents-memory/ vault
- Build verified
- **⚠ Paused — fix applied but not yet redeployed**

### Session 25 — Performance Optimization & SEO
- Added Page Visibility API to SakuraCanvas.astro and Background.astro — pauses animations on tab hide
- Added preconnect + dns-prefetch resource hints to BaseLayout.astro for api.deepseek.com and api.web3forms.com
- Added content-visibility: auto CSS rule in global.css for #projects, #about, #contact sections
- Added API key validation to chat.ts — .trim(), startup warnings, runtime 503 guard for missing keys
- Created public/robots.txt and public/sitemap.xml for SEO
- Created improve.md — full 13-point performance audit with recommendations
- Attempted CSS keyframe deduplication but reverted — LightningCSS rejects stray braces from line-by-line edits
- Updated README.md, docs/change.md, docs/note.md, docs/tracker.md

