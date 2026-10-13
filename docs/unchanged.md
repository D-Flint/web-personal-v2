# Unchanged Log

Tracking which files have been modified, added, or removed since project creation.

## Untouched Files (never modified, exactly as created)

| File | Notes |
|------|-------|
| `src/components/Background.astro` | Rewritten — 5-layer ethereal drift with conic wash, orbs, glass floaters, vignette + mouse parallax |
| `tsconfig.json` | Basic Astro TS config, never modified |
| `.gitignore` | Never modified |
| `.clinerules` | Never modified — Light Sakura Neko design rules |

## Files Modified (changes applied after creation)

| File | What changed |
|------|--------------|
| `src/components/Navbar.astro` | Home link /#home → / |
| `src/components/Navbar.astro` | Added dark mode toggle button + script |
| `src/components/Navbar.astro` | Added sakura toggle button + script |
| `src/styles/global.css` | Added whiskers CSS, dark mode variables, theme overrides, scroll reveal transitions, sakura-paused rule |
| `src/styles/global.css` | Removed global div overflow:visible override |
| `src/styles/global.css` | Added @custom-variant dark directive for Tailwind v4 class-based dark mode |
| `src/components/ProjectGrid.astro` | Added View All Projects button |
| `src/components/NekoWidget.astro` | Multiple iterations: created, then reworked chat layout, then is:inline script |
| `src/pages/index.astro` | Added Import for SakuraCanvas, NekoWidget; removed Whiskers import; migrated to BaseLayout |
| `src/pages/projects.astro` | Created from scratch; expanded from 6→19 projects; added tag filtering + FLIP; migrated to BaseLayout |
| `src/layouts/BaseLayout.astro` | Imported and mounted ClickEffects component |
| `README.md` | Updated multiple times with accurate info |
| `docs/*.md` | All rewritten as comprehensive references |
| `src/components/Footer.astro` | Email value changed to vuthihoeurb@gmail.com |
| `src/components/AboutMe.astro` | Migrated from `<img>` to Astro `<Image />` with `loading="lazy"` |
| `src/components/Contact.astro` | Migrated to Astro `<Image />`, success mascot changed to `yae-miko-tiny.png` |
| `src/components/Navbar.astro` | Added mobile hamburger menu, 25% hover scale, nav-glow-link fix |
| `src/pages/index.astro` | Hero section fixed + CLS scroll-reveal opacity-only fix |
| `src/pages/projects.astro` | SSR filter buttons, crawlable card links, keyboard accessibility |
| `src/layouts/BaseLayout.astro` | Added `description` prop + meta, mounted ClickEffects |
| `astro.config.mjs` | Changed output to `'server'`, added `@astrojs/vercel` adapter |
| `package.json` | Added `@astrojs/vercel`, `@vercel/speed-insights`; build script patches runtime to nodejs22.x |

## Files Added (created during development)

| File | Purpose |
|------|---------|
| `src/pages/projects.astro` | Full project catalog page with tag filtering |
| `src/components/ClickEffects.astro` | Global pointer click feedback with paw ripple + sakura petal burst |
| `src/components/SakuraCanvas.astro` | Falling sakura petals canvas animation |
| `src/components/NekoWidget.astro` | Fixed bottom-right chatbot mascot |
| `src/components/TraceArt.astro` | Decorative SVG cat silhouettes + contour lines + paper grain (present but unused) |
| `src/components/NekoGameModal.astro` | Whack-a-Mole arcade game modal (3 screens, 3×3 grid, event bridge) |
| `src/layouts/BaseLayout.astro` | Shared page layout wrapper |
| `src/assets/images/` | Optimized images directory (mascot, chibi, maid, tiny) |
| `docs/about.md` | Complete project reference |
| `docs/build-log.md` | Development session history |
| `docs/change.md` | Per-file change log |
| `docs/note.md` | Condensed feature overview |
| `docs/structure.md` | Annotated directory tree |
| `docs/tracker.md` | Session-by-session task log |
| `docs/unchanged.md` | This file — file state tracking |
| `.astro/` | Astro dev cache (auto-generated) |
| `dist/` | Build output (auto-generated) |

## Files Removed (deleted during cleanup)

| File | Reason |
|------|--------|
| `src/components/Whiskers.astro` | Replaced by CSS ::before/::after pseudo-elements |
| `run.txt` | Deleted (unnecessary — commands are in README) |
| `_apply_zoom.py` | Corrupted build script — deleted |
| `_build.py` | Incomplete build script — deleted |
| `_patch.mjs` | Debugging artifact — deleted |
| `_repair.py` | Corrupted one-liner — deleted |
| `handoff.md` | Session handoff notes — deleted |
| `handoff.txt` | Handoff template — deleted |
| `new-feature.md` | Planning document — deleted |
| `Desktop/` | Stale duplicate project copy — deleted |
| `.agents/` | Empty directory — deleted |
| `web-personal/` | Empty nested directory — deleted |
| `.env` | Empty file — deleted |
| `neko_b64.txt` | Unused base64 asset |
| `patch_neko.b64` | Unused patch file |
| `patch_neko_gen.py` | Unused patch generator |
| `create_script.py` | Unused creation script |
| `temp_content.txt` | Temporary file |
| `test_write.txt` | Test file |
| `src/components/writer.ps1` | Unused PowerShell script |



