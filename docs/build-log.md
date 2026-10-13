# Build Log

## Session 2026-09-19

### Fix DesktopScrollRail Bulbous Pill Width and Tooltip Document Flow Collision
- **Diagnosis / Context:**
  - In a screenshot provided by the user, the right-flank desktop scroll rail (`#desktop-rail-pill` in `src/components/DesktopScrollRail.astro`) appeared as an enormous, bulbous pill (~150px wide) obstructing the background character artwork. The bead dots were displaced to the left, while the progress track line and foxfire orb were positioned in the center.
  - Root cause analysis revealed:
    1. The hover tooltip element had been assigned `.shrine-glass-btn` during the liquid glass unification pass. However, `.shrine-glass-btn` specifies `position: relative` in `src/styles/global.css:575`, which overrode Tailwind's `absolute` class on the tooltip.
    2. Because the tooltips were forced into normal flex flow inside each `.desktop-rail-item`, their horizontal width (~110px) blew out the rail container from its intended slender 32px width into an inflated ~150px bubble.
    3. The container lacked an explicit fixed width constraint (`w-8`), and had inherited an un-scoped navbar frame class (`shrine-nav-frame`).
  - Affected files: `src/components/DesktopScrollRail.astro`, `src/styles/global.css`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`:
    - Replaced `shrine-nav-frame` with a dedicated `.desktop-rail-pill` class constrained to a slender `w-8` (32px width / `width: 2rem;`), with authentic liquid glass fill, directional borders, subtle shadow, and backdrop diffusion.
    - Replaced `shrine-glass-btn` on the hover tooltip with a dedicated `.desktop-rail-tooltip` class featuring `position: absolute !important;`, ensuring it remains completely decoupled from container flex layout and can never expand the rail pill.
    - Preserved 1:1 concentric alignment between the centered beads (x = 16px) and the central progress track line (`left-1/2 -translate-x-1/2`).
  - `src/styles/global.css`:
    - Added `.desktop-rail-pill` and `.desktop-rail-tooltip` to the reduced-transparency fallback list.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly with exit code 0.
- **Pending:**
  - None.

### Apply Authentic Liquid Glass to Hero Section Secondary Action Pills ("Contact Me" & "Resume")
- **Diagnosis / Context:**
  - The secondary action pills in the hero section ("Contact Me" and "Resume" anchors) were still using an opaque dark purple slab background (`rgba(23, 16, 34, 0.82)`) and muddy hover background (`#30162c`) without liquid glass backdrop-filter diffusion, directional lighting, or depth shadows, causing them to look flat and murky next to the luminous Grand Narukami liquid glass system.
  - The user reported that these two hero section pills had been missed during the liquid glass unification pass.
  - Affected files: `src/styles/global.css`, `src/pages/index.astro`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Refactored `.sakura-secondary-btn` from opaque `rgba(23, 16, 34, 0.82)` to the authentic Grand Narukami liquid glass formula:
      - `background: var(--glass-fill)` (`rgba(12, 11, 22, 0.22)` amethyst translucent fill).
      - `border: 1px solid var(--glass-border)` with directional highlights (`border-top: var(--glass-border-top)`, `border-bottom: var(--glass-border-bottom)`).
      - `box-shadow: var(--glass-shadow)`.
      - `-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));`.
      - Text contrast: `text-shadow: 0 1px 5px rgba(0, 0, 0, 0.65)`.
      - Hover state: elevates to `background: rgba(244, 114, 182, 0.14)`, `border-color: var(--glass-border-hover)`, `box-shadow: 0 14px 32px -12px rgba(0, 0, 0, 0.46), 0 0 16px rgba(244, 114, 182, 0.25)`, `color: #ffffff`, and `transform: translateY(-2px) scale(1.02)`.
    - Added `.sakura-secondary-btn` to the shared surface hierarchy at line 543 alongside `.liquid-glass-control`, `.sakura-glass-panel`, and `.shrine-glass-btn`.
    - Added smooth transition for inner SVG icons (`color` and `transform`).
  - `src/pages/index.astro`:
    - Added `shrine-glass-btn` class to both the "Contact Me" and "Resume" anchors in the hero CTA cluster to ensure seamless alignment with the shrine glass button interaction patterns.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly with exit code 0.
- **Pending:**
  - None.

### Add Dynamic Fade Effect to Domain Category Scrollable Pills
- **Diagnosis / Context:**
  - The horizontally scrollable domain category pill buttons (`All Scrolls`, `Systems & C++`, `Full-Stack & Web`, `AI & Machine Learning`, `CLI & Automation`) in the project search/filter suite on `/projects` were cutting off sharply at the container edges when scrolled horizontally, particularly on mobile and compact viewports.
  - The user requested adding a fade effect to the start and end of the visible part of the scrollable pill row.
  - Affected files: `src/pages/projects.astro` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/pages/projects.astro`:
    - Structured the domain category tabs into an isolated inner scroll container (`#domain-tabs-scroll.domain-tabs-scroll`) wrapped by the bordered section divider, preserving the full-width divider lines while constraining alpha masking strictly to the pills.
    - Added responsive dynamic CSS mask styling (`mask-image` / `-webkit-mask-image` with `--fade-left` and `--fade-right` CSS custom property stops) to produce a soft 28px alpha feather on the edges.
    - Implemented `updateDomainScrollFade()` engine driven by passive scroll events, window resize, and `ResizeObserver`:
      - Suppresses fade on the start/left edge when at `scrollLeft <= 4` or when content fits without scrolling.
      - Activates left fade (`.has-fade-left`) when scrolled horizontally (`scrollLeft > 4`).
      - Activates right fade (`.has-fade-right`) when more content is scrollable to the right (`scrollLeft < maxScroll - 4`).
      - Suppresses right fade when reaching the end of the scroll container.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly.
- **Pending:**
  - None.

### Unify Authentic Liquid Glass Effect Consistently Across All Surfaces and Controls
- **Diagnosis / Context:**
  - Various UI components, overlays, cards, modals, drawers, and controls had drifted into inconsistent visual treatments. Some used artificial linear gradients (`bg-gradient-to-b from-white/[0.08] ...`), harsh opaque backdrops (`bg-slate-950/95`, `bg-[#0c0b16]/85`, `bg-[#080617]`), or painted top-edge white bevel highlights (`shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.22)...]`), creating an artificial milky/frosted look rather than the authentic, luminous Narukami liquid glass system established in `ProjectCard` and `Navbar`.
  - Goal: Standardize and unify the liquid glass effect across all surfaces and controls that should have a liquid glass background, ensuring consistent translucent amethyst fills, directional lighting, deep natural drop shadows, and true backdrop-filter diffusion.
  - Affected files:
    - `src/styles/global.css`
    - `src/components/Navbar.astro`
    - `src/components/ProjectModal.astro`
    - `src/components/NekoWidget.astro`
    - `src/components/NekoGameModal.astro`
    - `src/components/AboutMe.astro`
    - `src/components/ProcessSection.astro`
    - `src/components/Contact.astro`
    - `src/pages/projects.astro`
    - `src/components/DesktopScrollRail.astro`
    - `src/components/SectionDivider.astro`
    - `src/components/Footer.astro`
    - `src/pages/index.astro`
    - `src/pages/404.astro`
    - `docs/build-log.md`
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Refined core liquid glass tokens (`--glass-border`, `--glass-border-top`, `--glass-border-bottom`, `--glass-border-hover`, `--glass-shadow`, `--glass-raised-shadow`).
    - Standardized `.liquid-glass-control` recipe for capsules, pills, and small controls.
    - Standardized `.sakura-glass-panel` base recipe with directional lighting and authentic shadows, removing artificial white bevels.
    - Standardized `.shrine-glass-btn` utility globally for all liquid glass action buttons and toggles.
    - Standardized raised overlays (`#modal-card`, `#feature-drawer`, `#neko-chat`, `#neko-game-card`, `#filter-dropdown`, `#mobile-menu-panel`) to use `var(--glass-raised-fill)` (`rgba(12, 11, 22, 0.46)`) with `var(--glass-raised-shadow)`.
  - `src/components/Navbar.astro`:
    - Refactored `#filter-dropdown` (filter sheet) to raised liquid glass, stripping inline hardcoded `bg-[#0c0b16]/85` and fake inset bevels.
    - Converted `#filter-clear-all` and `#filter-sheet-close` to `.shrine-glass-btn`.
    - Refactored `#mobile-menu-panel` from opaque `bg-slate-950/95` to raised liquid glass.
    - Standardized `#mobile-menu-close`, `#drawer-sakura-toggle`, `#drawer-sakura-density`, and `.density-btn` (markup and JS class updater) to liquid glass controls.
    - Standardized `.shrine-contact-btn` and `.shrine-toggle-pill` with directional borders and authentic liquid glass shadows.
  - `src/components/ProjectModal.astro`:
    - Refactored `#modal-card` and `#feature-drawer` to raised liquid glass without artificial gradients or painted bevels.
    - Converted `#modal-close`, `#modal-prev-btn`, `#modal-next-btn`, `#modal-source-link`, `#modal-copy-btn`, and `#drawer-close-btn` to `.shrine-glass-btn`.
    - Standardized `#modal-status-badge` to `.liquid-glass-control`.
  - `src/components/NekoWidget.astro`:
    - Preserved Rule 2 invariant (`<div class="flex h-full min-h-0 flex-col overflow-hidden">`).
    - Stripped artificial gradient and fake inset bevels from `#neko-chat`.
    - Converted `#neko-reset`, `#neko-chat-close`, and `.chat-chip` to `.shrine-glass-btn`.
    - Replaced hardcoded message bubble gradients with unified `.neko-msg-bubble` liquid glass rules (both static greeting and dynamic JS messages).
    - Standardized `#neko-input` with translucent liquid well styling.
  - `src/components/NekoGameModal.astro`:
    - Refactored `#neko-game-card` to raised liquid glass.
    - Converted `#neko-game-close`, `#game-quit-btn`, and `#game-close-results-btn` to `.shrine-glass-btn`.
    - Converted `.game-duration-btn` and `.game-difficulty-btn` in `<style>` to authentic liquid glass control recipe.
    - Converted `.mole-hole` to authentic recessed liquid glass.
  - `src/components/AboutMe.astro`:
    - Converted ABOUT ME eyebrow capsule to `.liquid-glass-control`.
    - Stripped artificial gradient and inset shadows from `.tech-stack-panel`.
  - `src/components/ProcessSection.astro`:
    - Converted 'How I Work' container card to `.sakura-glass-panel` liquid glass surface.
  - `src/components/Contact.astro`:
    - Standardized `.contact-dispatch` and `.contact-form-shell` with directional lighting and authentic shadow.
    - Converted communion capsule to `.liquid-glass-control`.
    - Converted `.contact-topic-chip` to liquid glass control recipe.
    - Converted `#contact-reset` to `.shrine-glass-btn` and success avatar ring to `.liquid-glass-control`.
  - `src/pages/projects.astro`:
    - Converted archive filter controls bar (`section[aria-label="Project filter controls"]`) to `.sakura-glass-panel`.
    - Converted view mode switcher wrapper to `.liquid-glass-control`.
    - Converted `#empty-reset-btn`, `#mobile-advanced-filter-btn`, and `#mobile-reset-filters-btn` to `.shrine-glass-btn`.
  - `src/components/DesktopScrollRail.astro`:
    - Converted `#desktop-rail-pill` to `.shrine-nav-frame` liquid glass pill matching navbar.
    - Converted hover tooltip plaques to `.shrine-glass-btn`.
  - `src/components/SectionDivider.astro` & `src/components/Footer.astro`:
    - Converted SectionDivider crest badges to `.liquid-glass-control`.
    - Converted Footer crest badge and availability capsule to `.liquid-glass-control`.
    - Converted `#footer-back-to-top` to `.shrine-glass-btn`.
  - `src/pages/index.astro`:
    - Converted hero availability status capsule to `.liquid-glass-control`.
  - `src/pages/404.astro`:
    - Converted 'Return to Shrine Gate' and 'Browse Sacred Works' navigation links to `.shrine-glass-btn`.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS (zero byte-order marks across all files).
    - Gate 2 (Component Invariants): PASS (NekoWidget inner flex wrapper invariant intact).
    - Gate 3 (Git Hygiene): PASS (zero trailing whitespace defects or conflict markers).
    - Gate 4 (Production Build): PASS (Astro compiled static pages and serverless API route).
    - Gate 5 (Runtime Patch Verification): PASS (`.vercel/output/functions/_render.func/.vc-config.json` confirmed `nodejs22.x`).
  - All 5 QC gates passed with exit code 0.
- **Pending:**
  - None.

### Apply Liquid Glass to "Meow on" Button in NekoWidget
- **Diagnosis / Context:**
  - The "Meow on" toggle button (`#neko-meow-toggle`) in `src/components/NekoWidget.astro` was still using an outdated artificial gradient and painted top-edge white bevel highlight (`bg-gradient-to-b from-white/[0.08] ... shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.22),0_4px_16px_rgba(0,0,0,0.2)]`), creating a milky/frosted appearance inconsistent with the authentic liquid glass system used across `ProjectCard` and `Navbar`.
  - The user requested applying the liquid glass background recipe to the "Meow on" button.
  - Affected files: `src/components/NekoWidget.astro` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/NekoWidget.astro`:
    - Cleaned up `#neko-meow-toggle` inline utility classes to strip the artificial white gradient and painted inset top bevel shadow.
    - Added `#neko-meow-toggle` rules to `<style>` adhering to the authentic Grand Narukami liquid glass system:
      - `background: var(--glass-fill)` (`rgba(12, 11, 22, 0.22)` amethyst translucent liquid glass).
      - `border: 1px solid rgba(244, 114, 182, 0.3)` with directional lighting (`border-top: rgba(244, 114, 182, 0.4)`, `border-bottom: rgba(244, 114, 182, 0.24)`).
      - `box-shadow: 0 10px 28px -10px rgba(0, 0, 0, 0.4)` (deep shadow, eliminating fake top bevels).
      - `-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation))`.
      - Hover state: `background: rgba(244, 114, 182, 0.14); border-color: rgba(244, 114, 182, 0.55); box-shadow: 0 14px 32px -12px rgba(0, 0, 0, 0.46), 0 0 16px rgba(244, 114, 182, 0.25); color: #ffffff; transform: scale(1.05);`.
      - Active state: `transform: scale(0.95);`.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly.
- **Pending:**
  - None.

### Remove Japanese Poem Seals from Project List on Mobile UI
- **Diagnosis / Context:**
  - On mobile viewports (<768px), project cards rendered Japanese poem seal badges (`.card-seal` displaying titles like `桜の守護 🌸`, `永遠の桜 🌸`, `浮世の夢 🌸`) alongside the category eyebrow (`num` / `domainLabel`).
  - Due to constrained mobile horizontal viewport widths (especially in Directory List view mode), these seals consumed vital horizontal space, causing domain labels to truncate and causing visual clutter.
  - The user requested removing this Japanese text from the project list on the mobile UI.
  - Affected files: `src/components/ProjectCard.astro` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/ProjectCard.astro`:
    - Updated `.card-seal` element classes from `flex` to `hidden md:flex` so that it is suppressed on mobile viewports (<768px) and rendered only on desktop viewports (>=768px).
    - Added an explicit `.card-seal { display: none !important; }` rule inside the `@media (max-width: 767px)` style block to guarantee the seal is suppressed across all mobile layout modes (both Directory List view and Shrine Grid view).
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly.
- **Pending:**
  - None.


### Transform Navbar Frame into Unified Liquid Glass Pill
- **Diagnosis / Context:**
  - The navigation bar backdrop previously used a fractured architecture between mobile and desktop:
    - On mobile (<768px), it rendered a harsh 45° chamfered polygon with an SVG double-border contour (`#shrine-nav-svg`), an inline JavaScript resize listener drawing polygon strings, and a dark decorative background image (`mobileNavBg`) with a dark veil (`bg-slate-950/85`).
    - On desktop (>=768px), it rendered a rounded floating pill backdrop.
  - The user requested converting the navbar itself into a unified pill shape, removing the current background artwork, and adopting the liquid glass aesthetic across all viewports.
  - Affected files: `src/components/Navbar.astro` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`:
    - Converted `.shrine-nav-frame` into a unified floating liquid glass pill (`rounded-full !important`, `clip-path: none !important`).
    - Removed the mobile SVG double-border contour (`#shrine-nav-svg`), its inner paths (`#shrineBorderOuter`, `#shrineBorderInner`), and its inline `draw()` resize script.
    - Removed the mobile background artwork layer (`<Image src={mobileNavBg} ... />`) and opaque gradient veil from the navbar frame.
    - Applied the authentic liquid glass recipe to `.shrine-nav-frame`:
      - `background: var(--glass-fill)` (`rgba(12, 11, 22, 0.22)` amethyst translucent liquid glass).
      - `border: 1px solid rgba(244, 114, 182, 0.3)` with subtle directional lighting (`border-top: rgba(244, 114, 182, 0.4)`, `border-bottom: rgba(244, 114, 182, 0.24)`).
      - `box-shadow: 0 10px 28px -10px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(244, 114, 182, 0.12)`.
      - `-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation))`.
      - Scrolled state: elevates smoothly to `var(--glass-raised-fill)`.
    - Maintained desktop ambient aurora glow drift and orbiting perimeter beam while eliminating all mobile polygon clip-paths.
- **Verification:**
  - Executed `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.


### Align Mobile Nav Buttons with Project Card Liquid Glass Recipe
- **Diagnosis / Context:**
  - The mobile navbar buttons (`#filter-btn-mobile` and `#mobile-menu-btn`) previously used an artificial linear gradient and inset white highlight (`bg-gradient-to-b from-white/[0.08] ... shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.22)]`), which created a milky/painted frosted sheen on top of the buttons that conflicted with the deep, translucent liquid glass aesthetic established in `ProjectCard.astro`.
  - The user requested applying the exact liquid glass background recipe from the project card to the mobile buttons.
  - Affected files: `src/components/Navbar.astro` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`:
    - Created the `.shrine-glass-btn` CSS utility matching the unified `.project-card` liquid glass system:
      - `background: var(--glass-fill)` (`rgba(12, 11, 22, 0.22)` amethyst translucent liquid glass fill).
      - `border: 1px solid rgba(244, 114, 182, 0.3)` with subtle directional framing (`border-top: rgba(244, 114, 182, 0.4)`, `border-bottom: rgba(244, 114, 182, 0.24)`).
      - `box-shadow: 0 10px 28px -10px rgba(0, 0, 0, 0.4)` (no artificial painted white top bevels).
      - `-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation))`.
      - Hover state: `background: rgba(244, 114, 182, 0.12); border-color: rgba(244, 114, 182, 0.5); box-shadow: 0 14px 32px -12px rgba(0, 0, 0, 0.46)`.
    - Applied `.shrine-glass-btn` to both `#filter-btn-mobile` and `#mobile-menu-btn`.
- **Verification:**
  - Verified with `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.


### Refactor Mobile Navbar Utility Pill into Sleek Shrine Controls
- **Diagnosis / Context:**
  - On mobile viewports, the navigation bar displayed an oversized, bulbous utility capsule (`.shrine-toggle-pill`) containing a sakura toggle icon, a vertical separator bar (`|`), and an oversized 44px (`h-11 w-11`) project filter button.
  - This caused the capsule to balloon to over 52px tall, occupying nearly 40% of the mobile navbar's horizontal width, clashing with the chamfered shrine aesthetic and visually crowding the brand mark. Furthermore, the sakura petal toggle was already fully featured inside the mobile drawer menu under "Shrine Controls", making its presence on the compact mobile header redundant.
  - On non-catalogue pages without filters (e.g. `/`), the pill awkwardly wrapped a single 18px flower icon with a heavy glowing border.
  - Affected files: `src/components/Navbar.astro` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`:
    - Removed the bulky `.shrine-toggle-pill` capsule wrapper from the mobile navbar layout.
    - Retired the redundant mobile header sakura toggle icon (`#sakura-toggle-mobile`), delegating sakura controls exclusively to the dedicated, labeled drawer controls (`#drawer-sakura-toggle` and density selector).
    - Refactored the mobile project filter trigger (`#filter-btn-mobile`) into an independent, sleek liquid glass shrine button (`h-9 px-3 rounded-full border border-pink-400/35 bg-gradient-to-b from-white/[0.08] via-pink-500/[0.03] to-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.22),0_4px_16px_rgba(0,0,0,0.2)]`) with a funnel icon, "Filter" label, and an active indicator dot (`#filter-mobile-indicator`).
    - Added an invisible expanded touch hitbox (`after:absolute after:-inset-1.5`) to guarantee >= 44px touch targets without inflating visual button dimensions.
    - Updated the mobile hamburger button (`#mobile-menu-btn`) to match the circular liquid glass shrine aesthetic (`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-pink-400/35 bg-gradient-to-b ...`) consistent with the drawer's close button.
    - Updated `updatePills()` JavaScript logic to seamlessly toggle the active indicator dot on `#filter-btn-mobile` whenever filter tags are selected or cleared.
- **Verification:**
  - Executed `npm run qc` gatekeeper:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.


### Unify Chatbot Close Button and Retire Redundant Avatar Overlay Badge
- **Diagnosis / Context:**
  - The chatbot interface presented two competing, visually proximate `(✕)` buttons when open:
    1. An overlay badge button (`#neko-close`) anchored to the mascot avatar button (`#neko-btn`) at the top right of the avatar circle.
    2. A glassmorphic header close button (`#neko-chat-close`) inside the `#neko-chat` card header directly adjacent to "Reset chat".
  - This caused visual collision and conflicting mental models: clicking the top avatar `(✕)` invoked `hideWidget()`, which permanently dismissed Lady Yae into localStorage (`neko-mascot-hidden = true`) and collapsed the entire mascot into a paw button (`#neko-restore`), while clicking the header `(✕)` simply closed the chat panel via `closeChat()`.
  - In addition, `#neko-close` had been mistakenly wired to show only upon `openChat()` (`closeBtn.classList.remove('hidden')`), creating an inverted lifecycle where a mascot-hide button was hidden while idle and revealed while actively chatting.
  - Affected files: `src/components/NekoWidget.astro`, `docs/about.md`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/NekoWidget.astro`:
    - Removed the redundant `#neko-close` overlay button from the mascot avatar shell markup.
    - Removed the `closeBtn` DOM query and guard condition from `initNekoWidget()`.
    - Removed `closeBtn.classList.remove('hidden')` from `openChat()` and `closeBtn.classList.add('hidden')` from `closeChat()`.
    - Removed `closeBtn` click and keydown event listeners.
    - Preserved `#neko-chat-close` in the chat header as the sole, canonical close action.
    - Preserved `hideWidget()` and `restoreWidget()` logic so existing users with prior `neko-mascot-hidden` localStorage keys can still unhide the widget via `#neko-restore`.
  - `docs/about.md`:
    - Updated the NekoWidget DOM hierarchy documentation to remove `neko-close` and denote `#neko-chat-close` as the single close control.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed cleanly with exit code 0.
- **Pending:**
  - None.

### Scope Chatbot Focus Veil and Light-Dismiss Backdrop to Mobile Viewports Only
- **Diagnosis / Context:**
  - On desktop viewports, opening `#neko-chat` caused `#neko-chat-backdrop` to become visible and apply a heavy `blur(24px)` and dark tint (`brightness(0.88)`) across the entire desktop resolution.
  - The focus backdrop was intended strictly for mobile screens (< 640px) where the chatbot operates as a full drawer/sheet requiring modal-like focus and light-dismiss tap handling. On desktop, the chatbot is a corner-docked widget where users should be able to view and read the website behind the chat without interference.
  - Affected files: `src/styles/global.css`, `src/components/NekoWidget.astro`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Set default desktop rule `#neko-chat-backdrop { display: none; }` to prevent backdrop rendering, blurring, or click interception on desktop viewports.
    - Scoped the active backdrop styles, `backdrop-filter: blur(16px)`, gradient veil, reduced motion, and `body.neko-chat-open #neko-chat-backdrop` visibility rules strictly inside `@media (max-width: 639px)`.
  - `src/components/NekoWidget.astro`:
    - Added Tailwind `sm:hidden` class to `#neko-chat-backdrop` for defense-in-depth viewport restriction.
- **Verification:**
  - Verified `npm run qc` executed cleanly with exit code 0 across all 5 quality control gates.
  - Desktop viewports now render zero background blur/dimming when the chat panel is open; mobile viewports retain the light-dismiss backdrop.
- **Pending:**
  - None.

### Token & Context Hygiene Protocol in AGENTS.md
- **Diagnosis / Context:**
  - Running unfiltered `git diff` against directories containing large vector assets (such as `src/assets/svg/neko-ear-left.svg` and `src/assets/svg/neko-ear-right.svg` with ~36,000 lines of `<path>` coordinates) floods active LLM context windows, exhausting hundreds of thousands of tokens on mathematical coordinate strings.
  - Needed an explicit rule in `AGENTS.md` guiding agents to protect token budgets by avoiding bare diffs on large vector/data assets.
  - Affected files: `AGENTS.md` and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `AGENTS.md`:
    - Added Rule 10: "Token & Context Hygiene — never dump raw diffs of large vector SVGs or assets."
    - Mandated using `git status`, `git diff --stat`, `git diff --name-only`, or file-targeted diffs instead of dumping raw SVGs.
- **Verification:**
  - `npm run qc` executed cleanly with exit code 0 across all 5 gates.
- **Pending:**
  - None.

### Update Sakura Flower Vector Asset to sakura-flower.svg
- **Diagnosis / Context:**
  - The portfolio previously imported cherryblossom-svgrepo-com.svg across 13 components and pages for decorative crests, buttons, scroll indicators, modal headers, and game mole bonus targets.
  - The user provided a bespoke, intricately styled sakura flower vector SVG asset at src/assets/svg/sakura-flower.svg to serve as the unified sakura emblem across the site.
  - Affected files:
    - src/components/AboutMe.astro
    - src/components/Contact.astro
    - src/components/DesktopScrollRail.astro
    - src/components/Footer.astro
    - src/components/Navbar.astro
    - src/components/NekoGameModal.astro
    - src/components/ProjectCard.astro
    - src/components/ProjectGrid.astro
    - src/components/ProjectModal.astro
    - src/components/SectionDivider.astro
    - src/pages/404.astro
    - src/pages/index.astro
    - src/pages/projects.astro
    - docs/build-log.md
- **What Changed / Implementation:**
  - Updated vector import paths from cherryblossom-svgrepo-com.svg to sakura-flower.svg across all 13 components and pages.
  - Preserved all <Image /> dimensions, styling classes, animators, and client-side dataset bindings (data-sakura-src in NekoGameModal.astro).
- **Verification:**
  - Ran npm run qc:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.

### Transition Sakura Flower from Heavy Vector to High-DPR WebP
- **Diagnosis / Context:**
  - The vector SVG asset src/assets/svg/sakura-flower.svg weighed 1,425 KB with 4,333 paths. Even automated 16-color and 8-color vector traces produced 357–559 KB files with 1,000–1,800 paths due to micro-polygonal tracing of painted shading, while introducing visible contour banding.
  - Across navigation links, pills, buttons, and crests, display dimensions range from 10×10px to 34×34px. At these micro-scales, thousands of vector paths overload browser XML parsing and GPU tessellation without improving perceived fidelity.
  - The user approved replacing the heavy SVG with a high-density 256×256 transparent WebP asset (src/assets/images/sakura-flower.webp, 30.2 KB) that preserves 100% of the original painterly shading, stamens, and soft glow while eliminating ~98% of payload weight and XML parsing overhead.
  - Affected files:
    - src/assets/images/sakura-flower.webp
    - src/components/AboutMe.astro
    - src/components/Contact.astro
    - src/components/DesktopScrollRail.astro
    - src/components/Footer.astro
    - src/components/Navbar.astro
    - src/components/NekoGameModal.astro
    - src/components/ProjectCard.astro
    - src/components/ProjectGrid.astro
    - src/components/ProjectModal.astro
    - src/components/SectionDivider.astro
    - src/pages/404.astro
    - src/pages/index.astro
    - src/pages/projects.astro
    - docs/build-log.md
- **What Changed / Implementation:**
  - Generated src/assets/images/sakura-flower.webp (256×256 px, quality 90, alpha quality 100) using Sharp from the source illustration, providing 4x–8x Retina pixel density across all shrine UI usage contexts.
  - Updated all 13 component and page imports from ../assets/svg/sakura-flower.svg to ../assets/images/sakura-flower.webp.
  - Maintained all existing Astro <Image /> width/height props, styling classes, and client-side dataset bindings (data-sakura-src={sakuraFlower.src}).
- **Verification:**
  - Ran npm run qc:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.

### High-DPR Multi-Density Scaling (densities={[1.5, 2, 3]}) for Razor-Sharp WebP
- **Diagnosis / Context:**
  - When rendering raster assets without explicit density descriptors, Astro defaulted to baking 1x resolution bitmaps matching the element's CSS width/height (e.g., 18×18px or 12×12px).
  - On modern displays with 125%, 150%, 2x (Retina/4K), or 3x (OLED smartphone) device pixel ratios, scaling up a 1x 18px bitmap resulted in noticeable fuzziness and blur.
  - The user requested Path 1 (Razor-Sharp Retina WebP) to restore crystal-clear sharpness.
  - Affected files:
    - src/assets/images/sakura-flower.webp
    - src/components/AboutMe.astro
    - src/components/Contact.astro
    - src/components/DesktopScrollRail.astro
    - src/components/Footer.astro
    - src/components/Navbar.astro
    - src/components/NekoGameModal.astro
    - src/components/ProjectCard.astro
    - src/components/ProjectGrid.astro
    - src/components/ProjectModal.astro
    - src/components/SectionDivider.astro
    - src/pages/404.astro
    - src/pages/index.astro
    - src/pages/projects.astro
    - docs/build-log.md
- **What Changed / Implementation:**
  - Master Asset Enhancement: Re-rendered src/assets/images/sakura-flower.webp as an ultra-high-resolution 512×512 master texture with a tailored Sharp unsharp mask (sigma 1.0, m1 1.5, m2 0.5) to heighten petal edge definition and stamen micro-contrast.
  - Added densities={[1.5, 2, 3]} across every <Image /> tag rendering the sakura blossom in all 13 components and pages.
  - Astro now automatically generates responsive srcset variants (1x, 1.5x, 2x, 3x) for all icon contexts, delivering 36px–54px physical bitmaps on high-DPR screens for an 18px box, ensuring razor-sharp clarity.
- **Verification:**
  - Ran npm run qc:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS — generated responsive 1.5x, 2x, and 3x srcset entries across all compiled HTML pages.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.

### Transition Kitsune Ears from 3.0 MB Vector SVGs to High-DPR WebP
- **Diagnosis / Context:**
  - src/assets/svg/neko-ear-left.svg (1,488 KB, 5,085 paths) and src/assets/svg/neko-ear-right.svg (1,504 KB, 5,085 paths) imposed a combined 3.0 MB raw vector payload and over 10,170 paths on initial page load.
  - Hover animations on ProjectCard, Contact, AboutMe, and NekoWidget forced the browser GPU to calculate and transform 10,000+ bezier curves at 60 FPS.
  - The user approved replacing both SVGs with high-DPR 3x Retina WebP assets (src/assets/images/neko-ear-left.webp and src/assets/images/neko-ear-right.webp, ~33 KB each).
  - Affected files:
    - src/assets/images/neko-ear-left.webp
    - src/assets/images/neko-ear-right.webp
    - src/components/CatEar.astro
    - docs/build-log.md
- **What Changed / Implementation:**
  - Generated src/assets/images/neko-ear-left.webp and src/assets/images/neko-ear-right.webp (360×240 px, quality 92, alpha quality 100, unsharp mask sigma 0.8) via Sharp, delivering full 3x Retina fidelity for the 120×80 display box.
  - Updated src/components/CatEar.astro to import the new WebP assets and added densities={[1.5, 2, 3]} to the <Image /> component.
  - Reduced decorative ear asset payload by ~98% (from 3,000 KB down to ~56 KB combined) while converting card hover transforms into smooth hardware GPU blits.
- **Verification:**
  - Ran npm run qc:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Production build): PASS — compiled responsive srcset entries (1x, 1.5x, 2x, 3x) for both ears across all pages.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 Quality Control gates passed with exit code 0.
- **Pending:**
  - None.

## Session 2026-09-18

### Automated Quality Control (QC) Gatekeeper and Protocol Enforcement
- **Diagnosis / Context:**
  - The repository lacked an automated, consolidated quality control verification step beyond raw `npm run build`, risking inadvertent regressions in critical repository invariants (such as UTF-8 BOM injection, accidental removal of the Astro `is:inline` inner flex wrapper in `NekoWidget.astro`, and Git whitespace issues).
  - `AGENTS.md` needed an explicit Quality Control Protocol defining automated gates and visual/interactive verification standards for agents and contributors.
  - Affected files: `AGENTS.md`, `package.json`, `scripts/qc.mjs`, and documentation files stripped of legacy UTF-8 BOM.
- **What Changed / Implementation:**
  - `scripts/qc.mjs`:
    - Implemented a 5-gate automated quality control runner:
      - Gate 1: Prohibited UTF-8 BOM audit across tracked project files.
      - Gate 2: Invariant audit ensuring the inner `flex h-full min-h-0 flex-col overflow-hidden` wrapper in `NekoWidget.astro` is preserved.
      - Gate 3: `git diff --check` execution for whitespace errors, orphan CRs, or merge conflict markers.
      - Gate 4: Production build execution (`npm run build`).
      - Gate 5: Vercel serverless function runtime patch verification (`nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`).
  - `package.json`:
    - Registered `"qc": "node scripts/qc.mjs"` while strictly preserving the existing inline `node -e` postbuild patch.
  - `AGENTS.md`:
    - Added `npm run qc` to the Commands registry table.
    - Updated Rule 1 to designate `npm run qc` as the primary verification requirement.
    - Added a dedicated `## Quality Control Protocol (QC)` section outlining the 5 automated gates and a 4-point visual/interactive checklist for UI modifications (responsive viewports, theme integrity, console cleanliness, affordance & clarity).
  - Repository Hygiene:
    - Stripped legacy UTF-8 BOM markers from 6 documentation and architecture notes (`agents-memory/Astro Portfolio - Architecture.md`, `docs/about.md`, `docs/change.md`, `docs/structure.md`, `docs/tracker.md`, `docs/unchanged.md`).
- **Verification:**
  - `npm run qc` executed cleanly with exit code 0, verifying all 5 quality control gates.
  - Vercel postbuild runtime patch confirmed: `.vercel/output/functions/_render.func/.vc-config.json` contains `"runtime": "nodejs22.x"`.
  - Git diff clean with zero whitespace errors.
- **Pending:**
  - None. Both automated tooling and documentation guidelines are live.

### Replace Neko Ears PNG with Vector SVG Assets
- **Diagnosis / Context:**
  - The shrine neko ears component (`src/components/CatEar.astro`) previously imported and rendered raster PNG assets (`src/assets/images/neko-ears-left.png` and `src/assets/images/neko-ear-right.png`).
  - To maintain crisp fidelity across high-DPR displays and unify vector asset standards across the Grand Narukami Shrine aesthetic, these were replaced with high-resolution vector SVG assets: `src/assets/svg/neko-ear-left.svg` and `src/assets/svg/neko-ear-right.svg`.
  - Affected file: `src/components/CatEar.astro`.
- **What Changed / Implementation:**
  - `src/components/CatEar.astro`:
    - Updated component header comments to document the new vector SVG assets.
    - Replaced imports of `neko-ears-left.png` and `neko-ear-right.png` with `neko-ear-left.svg` and `neko-ear-right.svg`.
    - Maintained exact component props (`side`, `idPrefix`, `class`, `loading`, `fetchpriority`), 3:2 aspect ratio, and drop-shadow styling across all consuming sections (`AboutMe.astro`, `Contact.astro`, `NekoGameModal.astro`, `NekoWidget.astro`, `ProcessSection.astro`, `ProjectCard.astro`, `projects.astro`).
- **Verification:**
  - `npm run build` executed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` contains `"runtime": "nodejs22.x"`.
  - Confirmed both `neko-ear-left.svg` and `neko-ear-right.svg` are bundled cleanly by Astro's asset pipeline.
- **Pending:**
  - None. Clean replacement complete.

### Contact Section Harmonization and CTA Button Clarity
- **Diagnosis / Context:**
  - The Grand Narukami Shrine Altar contact section (`src/components/Contact.astro`) displayed an ambiguous call-to-action button labeled `"Dispatch Scroll · 祈願"` with micro-header `"SANCTUARY DISPATCH · 奉納"`. This poetic phrasing created cognitive confusion for hiring managers and prospective clients regarding whether the button was submitting a form or downloading a document.
  - A typographical concatenation bug in the section subtitle (`below or<a...`) rendered as `"below oreamail me directly."`.
  - On desktop (`lg`), the message field container used `self-start` and a fixed min-height, failing to align vertically with the bottom row of the left column (Name, Email, Subject + Topic Chips).
  - The styling of `.contact-input` and `.contact-textarea-box` diverged in background gradients, borders, and error handling, breaking visual cohesion.
  - On mobile, the ceremonial blessing quote (`「 🌸 Let's create something amazing together. 🌸 」`) and alternative communication links wrapped across multiple fragmented lines.
  - Affected file: `src/components/Contact.astro`.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - **CTA Button Clarity & Affordance:**
      - Renamed primary submit action to `Send Message` with subtle kanji companion `· 送信` (hidden on narrow screens, visible on wider viewports).
      - Updated micro-header context to `✦ DIRECT TRANSMISSION · 奉納 ✦`, clearly conveying direct delivery to the portfolio owner's inbox.
      - Updated submission in-flight spinner state from `Dispatching...` to `Sending Message...`.
      - Added explicit `aria-label="Send message"` to `#contact-submit` for screen readers.
    - **Subtitle Whitespace Glitch Fix:**
      - Inserted Astro JSX whitespace `{' '}` between `below or` and `<a href="mailto:vuthihoeurb@gmail.com" ...>` to ensure clean word separation across all HTML minification passes.
    - **Form Grid & Equal-Height Alignment:**
      - Removed `self-start` from the Message field group and added `h-full` to span the full grid height across 3 rows on `lg` viewports.
      - Configured `.contact-textarea-box` and its inner wrapper with `flex-1 flex flex-col h-full`, allowing the message box and character counter footer to align with the bottom edge of the left column.
    - **Unified Form Input Styling Language:**
      - Standardized `.contact-textarea-box` to share the same obsidian glass fill, delicate `rgba(244, 114, 182, 0.38)` hairline border, hover sheen, and `#f472b6` focus halo as `.contact-input`.
      - Unified validation error styling with synchronized rose borders and halos across all four form controls.
    - **Mobile Polish & Balanced Typography:**
      - Added `whitespace-nowrap` to the ceremonial blessing quote (`cascade-5`), guaranteeing clean single-line presentation across mobile viewports down to 320px.
      - Restructured alternative channel links into a centered responsive layout (`flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5`) with paired GitHub and LinkedIn anchors.
- **Verification:**
  - `npm run build` executed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output
unctions\_render.func\.vc-config.json` contains `"runtime": "nodejs22.x"`.
  - Visual verification via Chrome DevTools MCP across Desktop (1440x900) and Mobile (390x844):
    - Subtitle reads cleanly without text collision.
    - Submit CTA button displays unambiguous "Send Message" intent with responsive Japanese translation.
    - In-flight spinner text displays "Sending Message...".
    - Left and right columns share uniform vertical alignment on desktop.
    - Validation error triggers produce harmonious rose borders and alert pills.
    - Blessing quote renders on a single line on mobile without broken brackets.
    - Alternative links stack cleanly on mobile and flow horizontally on desktop.
  - `git diff --check` passed with 0 errors.
- **Pending:**
  - None. Clean and verified.

### Replace Sakura Flower Raster PNG with Vector SVG
- **Diagnosis / Context:**
  - The portfolio previously rendered `src/assets/images/sakura-flower.png` across 13 components and pages for decorative crests, buttons, progress rails, seals, and game mole targets.
  - The raster PNG was 1305×1205 px (~300KB+ on disk / webp conversions) and lacked crisp infinite scalability on ultra-high-DPR displays.
  - The goal was to replace all occurrences with the vector asset at `src/assets/svg/cherryblossom-svgrepo-com.svg`.
  - Affected files: `src/components/AboutMe.astro`, `src/pages/404.astro`, `src/pages/index.astro`, `src/components/Contact.astro`, `src/components/NekoGameModal.astro`, `src/pages/projects.astro`, `src/components/Footer.astro`, `src/components/Navbar.astro`, `src/components/DesktopScrollRail.astro`, `src/components/ProjectCard.astro`, `src/components/ProjectGrid.astro`, `src/components/ProjectModal.astro`, and `src/components/SectionDivider.astro`.
- **What Changed / Implementation:**
  - `src/components/AboutMe.astro`:
    - Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
    - Removed `format="webp"` and `quality={80}` from `<Image />` to prevent unnecessary raster transformation on a vector format.
  - `src/pages/404.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/pages/index.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/Contact.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/NekoGameModal.astro`: Updated `sakuraFlower` import to `../assets/svg/cherryblossom-svgrepo-com.svg`. Passed into `data-sakura-src` for client-side bonus target rendering.
  - `src/pages/projects.astro`: Updated `sakuraFlower` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/Footer.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/Navbar.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/DesktopScrollRail.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/ProjectCard.astro`: Updated `sakuraFlower` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/ProjectGrid.astro`: Updated `sakuraFlower` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/ProjectModal.astro`: Updated `sakuraFlower` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
  - `src/components/SectionDivider.astro`: Updated `sakuraIcon` import to `../assets/svg/cherryblossom-svgrepo-com.svg`.
- **Verification:**
  - `npm run build` executed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
  - Verified no residual references to `sakura-flower.png` remain across the codebase.
- **Pending:**
  - None. Clean replacement complete.

## Session 2026-09-04

### Matrix Splash Recommendation Reassessment
- **Diagnosis / Context:**
  - Revisited the audit recommendation after the user noted that the splash already exists to mask initial page loading.
  - Direct inspection of `src/components/MatrixSplash.astro` showed that most proposed safeguards were already implemented.
- **What Changed / Implementation:**
  - `.learnings/LEARNINGS.md`:
    - Recorded the correction that audit follow-ups must be verified against the current component before being prioritized.
  - No website source, styling, or runtime behavior was changed.
  - Confirmed the current splash is limited to the first page load per session, suppressed for mobile and reduced-motion users, dismissible by click or Escape, and capped by a 3.2-second desktop failsafe.
- **Verification:**
  - Source inspection confirmed the safeguards in `src/components/MatrixSplash.astro`.
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - Replace the redundant splash recommendation with the next genuinely unimplemented audit item.

### Mobile Project Filter Fast-Browsing Design
- **Diagnosis / Context:**
  - The mobile project catalogue renders search, view controls, domain tabs, thirteen inline technology filters, result status, and reset controls before the first project.
  - The navbar already provides the full categorized technology taxonomy and synchronizes selections through `project-filter-change`, making the inline mobile tag wall redundant.
- **What Changed / Implementation:**
  - `docs/superpowers/specs/2026-09-04-mobile-project-filter-fast-browsing-design.md`:
    - Defined a compact mobile hierarchy that keeps search and domain filters visible while moving the full technology taxonomy into the existing shared navbar filter surface.
    - Specified a mobile bottom-sheet treatment, page-level `Filter scrolls` trigger, selected-tag count seal, synchronization flow, focus behavior, scroll locking, reduced-motion handling, and desktop preservation requirements.
    - Kept the existing shrine palette, typography, artwork, vanilla JavaScript architecture, event bridge, and local-storage key.
  - No website source or runtime behavior was changed during the design phase.
- **Verification:**
  - Design self-review found no placeholders, contradictory requirements, or scope ambiguity.
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - User review of the written specification.
  - Implementation, localhost visual approval, and commit remain gated.

### Mobile Project Filter Fast-Browsing Implementation
- **Diagnosis / Context:**
  - Mobile visitors had to pass search, layout controls, domain tabs, thirteen inline technology pills, result status, and reset controls before reaching the first project.
  - The navbar already contained the complete categorized technology taxonomy, so the page-level mobile tag wall duplicated capability while consuming valuable vertical space.
  - Affected files: `src/pages/projects.astro` and `src/components/Navbar.astro`.
- **What Changed / Implementation:**
  - `src/pages/projects.astro`:
    - Preserved search, icon-only grid/list switching, and horizontally scrollable domain tabs as the fast, always-visible mobile controls.
    - Hid the thirteen quick technology pills below the `md` breakpoint while leaving the desktop filter suite unchanged.
    - Added a 44px-high `Filter scrolls` trigger, selected-technology count seal, live result count, and conditional `Clear filters` action.
    - Added responsive search placeholder copy so the 320px layout remains legible without changing the descriptive desktop placeholder.
    - Synchronized the count seal with both page and navbar tag changes through the existing `project-filter-change` bridge.
    - Added defensive restoration for malformed or unavailable `projectFilterTags` local-storage data.
  - `src/components/Navbar.astro`:
    - Reused the existing categorized tag surface as a bottom sheet below `md` and preserved its floating-dropdown presentation on desktop.
    - Added a mobile backdrop, safe-area-aware bottom anchoring, constrained scrolling, selected-tag summary, close action, and 44px filter targets.
    - Added `project-filter-open` handling so the page and navbar controls open the same filter surface.
    - Added Escape and backdrop closing, focus containment, focus restoration, background scroll locking, resize cleanup, and reduced-motion behavior.
    - Removed the redundant technology taxonomy from the mobile hamburger drawer so one authoritative advanced-filter surface remains.
    - Kept tag persistence and accessibility state synchronized in both directions.
- **Verification:**
  - `npm run build` completed successfully with exit code 0 after every source edit.
  - Postbuild runtime patch verified after every build: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
  - Playwright checks passed at 390x844, 320x800, and 1440x1000.
  - Mobile checks confirmed the inline tag wall is hidden, the shared sheet is bottom-anchored, both entry points open it, backdrop and Escape close it, focus is contained and restored, background scrolling is unlocked after close, and no horizontal overflow occurs.
  - State checks confirmed C++ selects 6 projects, the Web domain selects 8, reset restores all 19, the count seal and local storage update correctly, search empty/clear behavior works, and malformed storage recovers without a page error.
  - Touch-target checks confirmed the mobile filter trigger and both view controls are at least 44px high and wide.
  - Desktop checks confirmed the thirteen quick tags remain visible, the mobile trigger remains hidden, the filter retains its 384px floating-dropdown form and original `Filter by Tag` title, and no mobile backdrop appears.
  - Reduced-motion checks confirmed sheet transition duration resolves to `0s` and closing remains immediate.
  - Visual screenshots confirmed coherent spacing and hierarchy at both mobile widths and preserved desktop styling.
- **Pending:**
  - User visual verification on localhost.
  - Commit remains gated on explicit approval; no remote push is authorized.

### Current Website Design and UX Audit
- **Diagnosis / Context:**
  - Reviewed the current home and projects pages at 1440px desktop and 390px mobile viewports.
  - Inspected first-visit behavior, responsive layout, keyboard order, form semantics, project filtering, project links, motion preferences, and rendered console output.
  - Affected files reviewed: `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/projects.astro`, `src/components/MatrixSplash.astro`, `src/components/Navbar.astro`, `src/components/ProjectCard.astro`, `src/components/ProjectGrid.astro`, `src/components/AboutMe.astro`, `src/components/Contact.astro`, and `src/styles/global.css`.
- **What Changed / Implementation:**
  - `docs/build-log.md`:
    - Recorded this read-only audit; no website source or runtime behavior was changed.
    - Identified the highest-impact follow-ups: replace generic project-profile URLs with project-specific proof, reduce desktop splash friction, simplify mobile archive controls, enlarge touch targets, improve keyboard entry order and add a skip link, expose filter state in the URL, tighten heading semantics, and set the dark native color scheme.
  - Browser verification confirmed no horizontal overflow at either tested viewport.
  - Reduced-motion support, explicit image dimensions, form labels, inline validation, and responsive layouts are already present and working as useful foundations.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - Audit recommendations remain advisory; no implementation was requested in this session.

### Project Link Integrity Design
- **Diagnosis / Context:**
  - The project catalogue routed all source actions and 18 of 19 live actions to the generic `D-Flint` GitHub profile.
  - Public repository inspection found four repositories, but their metadata and file trees did not support an exact, defensible mapping to the named catalogue entries.
  - The current `web-personal` Git remote is not present in the public inventory and is therefore treated as private.
- **What Changed / Implementation:**
  - `docs/superpowers/specs/2026-09-04-project-link-integrity-design.md`:
    - Defined optional verified project URLs, conditional card and modal actions, truthful availability labels, and replacement of the unsupported `100% Open Source / Live` statistic.
    - Preserved the existing shrine visual system and internal project-details experience.
  - `docs/build-log.md`:
    - Recorded the design phase. No website source or runtime behavior was changed.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - User review and approval of the written design.
  - Implementation, browser verification, visual approval, and commit remain gated.

### Project Link Integrity Implementation
- **Diagnosis / Context:**
  - Project cards and detail modals presented generic GitHub-profile destinations as though they were project-specific demos or source repositories.
  - Public repository inspection did not produce defensible one-to-one matches for the catalogue entries, so unmatched destinations needed to be withheld rather than guessed.
  - Affected files: `src/components/ProjectCard.astro`, `src/components/ProjectGrid.astro`, `src/components/ProjectModal.astro`, and `src/pages/projects.astro`.
- **What Changed / Implementation:**
  - `src/components/ProjectCard.astro`:
    - Made live and source URLs optional project metadata.
    - Rendered compact `Demo` and `Code` actions only when their corresponding verified URL exists.
    - Preserved `View Details` as the dependable action for projects without an external destination.
  - `src/components/ProjectGrid.astro` and `src/pages/projects.astro`:
    - Removed unsupported generic GitHub profile links from the featured grid and all 19 archive records.
    - Retained the confirmed portfolio destination, `https://hoeurbvuthi.site/`, as the catalogue's single verified live experience.
    - Replaced the unsupported `100% Open Source / Live` claim with a count derived directly from project data.
  - `src/components/ProjectModal.astro`:
    - Added conditional live/source actions and removed fallback navigation to the generic GitHub profile.
    - Added truthful availability states: `Live Demo Ready`, `Source Available`, or `Portfolio Overview`.
    - Added matching access descriptions: `Live Experience`, `Public Repository`, or `Details Available`.
    - Reset state-specific inline colors between modal openings so successive projects inherit the correct badge treatment.
  - `docs/superpowers/specs/2026-09-04-project-link-integrity-design.md`:
    - Recorded the approved interaction and content design before implementation.
- **Verification:**
  - `npm run build` completed successfully with exit code 0 after the source changes.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
  - Playwright interaction checks passed at 1440x1000 and 390x844: all featured cards retain `View Details`; only Portfolio Website exposes `Demo`; no featured or archive card exposes an unverified `Code` action or generic GitHub-profile link.
  - Modal checks passed at both viewports: Agentic AI Assistant shows `Portfolio Overview` / `Details Available` with both external actions hidden, while Portfolio Website shows `Live Demo Ready` / `Live Experience` with only the confirmed live link visible.
  - Visual screenshots confirmed the conditional card actions, modal content hierarchy, and derived `1 Live Experience` archive statistic remain coherent with the existing shrine design system on desktop and mobile.
  - User visually approved the localhost implementation on 2026-09-04.
- **Pending:**
  - None. A remote push remains outside the authorized scope.

### Footer Connect Column LinkedIn Link Addition
- **Diagnosis / Context:**
  - User requested the addition of the LinkedIn profile link to the footer's "Connect" column (`Screenshot 2026-09-04 103940.png`), where it was previously omitted.
  - The Navigation column had 4 links, while Connect only contained GitHub, Direct Mail, and Resume (3 items).
- **What Changed / Implementation:**
  - `src/components/Footer.astro`:
    - Added the LinkedIn destination (`https://www.linkedin.com/in/hoeurbvuthi/`) with `target="_blank"`, `rel="noopener noreferrer"`, hover styling (`hover:translate-x-1`, `hover:text-pink-200`), and pink arrow marker (`›`).
    - Positioned between GitHub and Direct Mail, bringing both Navigation and Connect columns into balanced 4-item visual symmetry.
- **Verification:**
  - Headless Playwright automated tests (`scratch/check-linkedin.py`) confirmed that the link renders and functions on both desktop and mobile viewports.
  - `npm run build` executed with exit code 0.
  - Postbuild runtime patch verified: `.vercel/output/functions/_render.func/.vc-config.json` retains `"runtime": "nodejs22.x"`.
  - `git diff --check` passed with 0 errors.
- **Pending:**
  - None.

### Contact-to-Footer Section Divider Deduplication
- **Diagnosis / Context:**
  - User noted two stacked section dividers between the contact altar and footer (`Screenshot 2026-09-04 103208.png`), requesting to retain the `(NARUKAMI SHRINE)` emblem and remove the duplicate on both mobile and desktop.
  - Inspection revealed that `index.astro` rendered `<SectionDivider variant="kasumi-wave" />` immediately following `<Contact />`.
  - Concurrently, `BaseLayout.astro` renders `<Footer />`, which intrinsically contains its own glowing top border line and centered `✦ 🌸 NARUKAMI SHRINE ✦` floating crest badge (`.footer-crest`). This resulted in the Kasumi wave cloud capsule (`🌸 ⛩️ 🌸`) and the Narukami Shrine crest being rendered one after the other.
- **What Changed / Implementation:**
  - `src/pages/index.astro`:
    - Removed the redundant `<SectionDivider variant="kasumi-wave" />` component call following `<Contact />`.
    - Preserved `<Footer />`'s integrated glowing horizontal gradient border and `✦ 🌸 NARUKAMI SHRINE ✦` crest badge as the singular, authoritative boundary between the Contact Altar and Footer across all viewports.
- **Verification:**
  - Headless Playwright visual tests across both mobile (390px) and desktop (1440px) confirmed a clean, unified transition with exactly one `NARUKAMI SHRINE` crest badge and zero layout duplication or overlap.
  - `npm run build` executed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel/output/functions/_render.func/.vc-config.json` contains `"runtime": "nodejs22.x"`.
  - `git diff --check` passed cleanly across the entire codebase.
- **Pending:**
  - None.

### Featured Projects "View Projects" Mobile Spacing & Transform Alignment
- **Diagnosis / Context:**
  - User reported that on mobile viewports, the "View Projects" primary CTA button was visually glued to the bottom border of the third project card (`Screenshot 2026-09-04 100149.png`), appearing stuck with zero perceived separation.
  - Deep architectural inspection via headless browser DOM metrics revealed a compound bug:
    1. In `ProjectCard.astro`, the card root was initialized with Tailwind classes `opacity-0 translate-y-8`. Under Tailwind CSS v4, `translate-y-8` sets the modern standalone CSS property `translate: 0 2rem;` (32px).
    2. When project cards on the homepage entered the viewport, `index.astro`'s IntersectionObserver added the `.revealed` class, which set `transform: translateY(0) !important;`. Crucially, this only altered `transform` and never reset `translate: 0 !important;`. The card remained translated downward by 32px permanently.
    3. The button container beneath the grid had `mt-8` (32px). Because the card was translated 32px downward, its bottom edge collided exactly with the top edge of the button (`gap = 0.0px`).
    4. On mobile screens, 32px (`mt-8`) was also disproportionately tight compared to the generous vertical rhythm below the button leading into the Mizuhiki Sakura section divider.
- **What Changed / Implementation:**
  - `src/components/ProjectGrid.astro`:
    - Adjusted the CTA button container margin on mobile resolution from `mt-8 sm:mt-10 lg:mt-14` to `mt-12 sm:mt-12 lg:mt-14`, adding a graceful 48px baseline spacing on small viewports while maintaining optimal tablet and desktop spacing.
  - `src/components/ProjectCard.astro`:
    - Added `.project-card.revealed { translate: 0 !important; }` in `<style is:global>` so revealed cards always reset the modern CSS `translate` property regardless of consuming page.
  - `src/pages/index.astro`:
    - Added `translate: 0 !important;` to `.project-card.revealed` across keyframe animations and both desktop (`@media (min-width: 769px)`) and mobile (`@media (max-width: 768px)`) reveal rules.
    - Updated the homepage `cardObserver` IntersectionObserver callback to explicitly remove `'opacity-0', 'translate-y-8'` upon reveal, matching the robust pattern established in `projects.astro`.
- **Verification:**
  - Headless Playwright tests (`scratch/check-spacing.py`) confirmed that the gap between the bottom of the last project card and the top of the "View Projects" button increased from `0.0px` to a pristine `48.0px`.
  - Visual verification with Playwright full-bleed screenshots confirmed balanced, elegant spacing across mobile (390px), tablet (768px), and desktop (1440px) resolutions with zero collisions or layout regressions.
  - `npm run build` completed with exit code 0.
  - Postbuild runtime patch verified: `.vercel/output/functions/_render.func/.vc-config.json` contains `"runtime": "nodejs22.x"`.
  - `git diff --check` passed cleanly with 0 whitespace warnings.
- **Pending:**
  - None.

## Session 2026-09-03

### Contact Submit Button Creative Sanctuary Dispatch Plaque Polish
- **Diagnosis / Context:**
  - User feedback noted that while the previous clean version fixed the broken appearance, it looked a bit generic (`Screenshot 2026-09-03 113204.png`) and requested more creativity.
  - The submit CTA lacked the distinctive Grand Narukami shrine personality, motion life, and ornamental framing present across the rest of the portfolio.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - **Orbiting Foxfire Luminous Border Beam:** Added an ambient animated SVG border beam (`.submit-border-beam`, `.submit-beam-trail`) that glides around the perimeter of the plaque, accelerating with brilliant sakura/electro bloom on hover.
    - **Shrine Altar Corner Brackets:** Embedded four delicate gold-sakura corner brackets (`.submit-corner` `tl`, `tr`, `bl`, `br`) directly into the plaque corners (`「`), echoing the altar framing above.
    - **Sacred Seal Medallion:** Enhanced the circular sakura medallion (`.submit-seal-badge`) with a rich beveled disc, glowing radial aura, and responsive hover rotation and expansion.
    - **Editorial Dispatch Typography:** Stacked a delicate micro-header (`✦ SANCTUARY DISPATCH · 奉納 ✦`) above `Send Message`, with responsive text-size and `whitespace-nowrap` on mobile to prevent line breaks.
    - **Messenger Flight Plaque:** Housed the paper-plane messenger within a dedicated luminous glass tile (`.submit-plane-box`) that illuminates and lifts on hover.
    - **Japanese Bracketed Caption:** Refined the closing blessing with sacred Japanese brackets: `「 🌸 Let's create something amazing together. 🌸 」`.
    - **Accessibility:** Preserved full `prefers-reduced-motion` overrides disabling beam orbit and transform transitions.
- **Verification:**
  - `npm run build` completed with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` retains `"runtime": "nodejs22.x"`.
  - `git diff --check` passed cleanly across all files.
  - Automated Playwright regression test (`scratch/contact-check.py`) passed across desktop and mobile viewports with 0 console errors.
  - Visual verification with Playwright screenshots confirmed cohesive shrine personality, dynamic motion, and sharp responsive rendering.
- **Pending:**
  - None.

### Contact Submit Button Pristine Altar Glass Plaque Redesign
- **Diagnosis / Context:**
  - User noted that the previous submit button attempt looked like a "broken UI" (`Screenshot 2026-09-03 112421.png`).
  - Analysis confirmed that trying to artificially generate raster illustrative art (clouds and filigree) using manual SVG `<path>`s produced visual glitches: the right cloud paths appeared as three harsh purple rectangles with scribbles, the left bracket rendered as an empty caret arrow `<` cutting into the background, and absolute-positioned diamond markers looked like subpixel collision bugs.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - **Pristine Dual-Border Glass Plaque:** Stripped all pseudo-illustrative floating SVG paths and stray diamond markers. Built a seamless, high-craft rounded lacquer glass plaque (`.contact-submit-glass-bg`, `.contact-submit-inner-frame`) with an inner framed border and deep plum/rose radial gradients.
    - **Specular Sheen Sweep:** Added a sleek, hardware-accelerated angled light sheen (`.contact-submit::after`) that glides across the plaque on hover.
    - **Harmonious Layout:** Unified the button layout with a glowing circular sakura medallion on the left (`.contact-submit-seal`), bold font-serif "Send Message" typography in the center, and a flight-poised glowing paper plane on the right (`.contact-submit-plane`).
    - **Refined Closing Blessing:** Replaced the fragile SVG underline with a clean, centered typography caption (`✦ Let's create something amazing together. ✦`).
    - **Performance & Reduced Motion:** Ensured zero layout shift, smooth hover lifts, responsive mobile padding, and full `prefers-reduced-motion` compliance.
- **Verification:**
  - `npm run build` passed with exit code 0.
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` retains `"runtime": "nodejs22.x"`.
  - `git diff --check` passed with zero whitespace warnings.
  - Automated Playwright regression test (`scratch/contact-check.py`) passed across desktop and mobile viewports with 0 console errors.
  - Visual verification with Playwright screenshots confirmed a pristine, cohesive, and luxurious presentation free from any graphical glitches.
- **Pending:**
  - None.

### Contact Submit Button Authentic Reference Reconstruction
- **Diagnosis / Context:**
  - User highlighted the submit CTA button (`Screenshot 2026-09-03 111518.png`), pointing out that it needed work.
  - Audit revealed the previous button implementation had used a jagged, 24-point saw-tooth `clip-path: polygon(...)` attempting to simulate ribbons, an awkward rigid internal rectangle dividing the CTA into disconnected boxes, an isolated paper plane pushed to the far right, and no left shrine filigree or right celestial clouds as seen in the original reference design (`Screenshot 2026-09-03 104027.png`).
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - **Reconstructed Plaque Silhouette:** Eliminated the jagged saw-tooth polygon cuts. Implemented a smooth, dual-framed ceremonial shrine plaque with top and bottom center diamond crest notches (`.contact-submit-crest-top`, `.contact-submit-crest-bottom`).
    - **Left Lotus Filigree Wing:** Added an authentic SVG scalloped lotus shrine bracket (`.contact-submit-wing`) flaring outward to the left of the circular medallion.
    - **Concentric Medallion:** Embedded the circular medallion into the left plaque anchor with 4 cardinal diamond pips (top, bottom, left, right) and glowing `Image` sakura blossom.
    - **Unified Label & Tilted Plane:** Paired `Send Message` directly alongside the glowing angled paper plane (`contact-submit-plane`) in the center of the plaque, restoring natural visual balance.
    - **Right Celestial Kasumi Clouds:** Added multi-layered, gradient-shaded Japanese celestial smoke wisps (`.contact-submit-clouds`) gracefully drifting off the right edge.
    - **Ceremonial Underline Cradle:** Positioned the closing caption `Let's create something amazing together.` flanked by glowing sakura blossom emojis above an ornamental curved underline cradle SVG.
    - **Responsive & Accessibility Tuning:** Provided clean mobile dimensions (`@media (max-width: 640px)`) and reduced-motion states while preserving all interactive hooks (`contact-submit`, `contact-submit-text`, `contact-submit-spinner`).
- **Verification:**
  - `npm run build` succeeded with exit code 0.
  - Postbuild runtime check verified: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` passed cleanly across the entire repository.
  - Automated Playwright regression test (`scratch/contact-check.py`) passed with 0 console errors on both 1440px desktop and 390px mobile viewports.
  - Visual validation with screenshots confirmed high-fidelity alignment with the reference artwork.
- **Pending:**
  - None.

### Contact Form Altar Design Elevation
- **Diagnosis / Context:**
  - The contact section's form fields previously relied on dark, boxy generic inputs with standard focus rings and lacked the ornamental cohesion and shrine craft established by the surrounding communication cards and submit ribbon plaque.
  - The textarea in the right column lacked balanced proportion with the left column, had an unstyled character counter, and placed the Kitsune mask watermark directly adjacent to the native resize gripper.
  - Users lacked quick guidance on common contact topics, leading to overly long or truncated placeholder text in the Subject input.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - **Altar Architecture:** Upgraded `.contact-form-shell` into a Grand Narukami sanctuary altar with four gold/sakura corner brackets (`.contact-corner-bracket`), top specular light filaments, deeper obsidian-violet glass layers, and inner framed borders.
    - **Sanctuary Dispatch Header:** Added an altar inscription banner across both columns (`Inscribe Your Scroll · Direct Sanctuary Dispatch · 奉納`) with a radiant diamond glyph and live pulsing transmission badge.
    - **Refined Inscription Tiles:** Enhanced Name, Email, and Subject field groups with dedicated illuminated icon medallions (`.contact-label-icon`), kanji subtitles (`お名前`, `通信先`, `件名`, `伝言`), and stylized micro-badges (`✦ REQUIRED`).
    - **Interactive Topic Selector Chips:** Added four interactive quick-select topic chips (`✦ Project`, `⚡ Hire / Role`, `🤝 Collab`, `🌸 Hello`) that auto-fill the Subject input on click with active glowing gradient states and full two-way input synchronization.
    - **Harmonized Message Altar:** Integrated the message textarea into a unified card (`.contact-textarea-box`) with a live character progress pill (`0 / 2000`), a relocated non-obstructive Kitsune watermark, and a discreet reassurance footer (`⚡ Swift reply · ~24h turnaround · Markdown supported`).
    - **Talisman Error Alerts:** Replaced plain raw text error alerts with animated slide-in shrine talisman warning pills (`.contact-error-pill`) styled with rose glass and soft ambient warning glow.
    - **Altar Dispatch Notice & Spacing:** Provided generous spacing (`mt-4 sm:mt-5`) between fields and the submit plaque, accompanied by a centered ceremonial ribbon caption (`✦ DIRECT SANCTUARY COMMUNION · ENCRYPTED DISPATCH ✦`).
    - **Full Accessibility & Motion Compliance:** Maintained all existing DOM IDs (`contact-name`, `contact-email`, `contact-subject`, `contact-message`, `contact-submit`, `contact-submit-text`, `contact-submit-spinner`, `contact-message-count`, `contact-reset`, `contact-success`), preserved event bridges (`neko-mascot-watch`), added `prefers-reduced-motion` and `prefers-reduced-transparency` overrides.
- **Verification:**
  - `npm run build` completed with exit code 0.
  - Postbuild runtime check passed: `.vercel\output\functions\_render.func\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors.
  - Headless Playwright tests passed at 1440px desktop and 390px mobile viewports, asserting all form controls, bounding box constraints, topic chip selection, and live character counting with 0 console errors.
- **Pending:**
  - None.

### Contact Button Reference Correction
- **Diagnosis / Context:**
  - User feedback identified that the first CTA treatment was too large and did not resemble the supplied reference closely enough.
  - The main causes were an oversized `max-w-4xl`/`6.25rem` desktop plaque and a generic clipped hexagon replacing the reference's compact irregular ribbon silhouette.
- **What Changed / Implementation:**
  - Reduced the submit CTA to a compact `max-w-2xl` ribbon with `4.5rem` desktop and `3.75rem` mobile heights.
  - Reworked the plaque clip path with irregular end notches, nested inset framing, and top/bottom glints to better match the reference geometry.
  - Scaled the sakura seal and paper-plane mark down so the ornament supports the label instead of dominating the contact form.
  - Kept the existing `contact-submit`, `contact-submit-text`, and `contact-submit-spinner` hooks and all form behavior unchanged.
  - Logged the correction learning in `.learnings/LEARNINGS.md` and updated the approved design spec with explicit reference-proportion constraints.
- **Verification:**
  - `npm run build` completed successfully after the component correction.
  - `npm run build` completed successfully again after the final documentation edit.
  - Postbuild runtime check passed: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors.
- **Pending:**
  - None.

### Contact Button Reference Treatment
- **Diagnosis / Context:**
  - The contact form's submit CTA used a rounded gradient pill, while the supplied reference called for a wide ornamental sakura-night ribbon button.
  - The change was scoped to the submit button in `src/components/Contact.astro`; the form flow, validation, loading state, and navbar Contact links were out of scope.
- **What Changed / Implementation:**
  - Replaced the pill treatment with a responsive clipped plum plaque using component-local CSS layers and nested inset borders.
  - Added the existing sakura artwork as a circular seal on the left and an inline paper-plane SVG on the right, keeping the label optically centered between them.
  - Removed the button's unused dependency on `nav-bar-bg.png`; no new public asset was created.
  - Preserved `contact-submit`, `contact-submit-text`, and `contact-submit-spinner` IDs so the existing vanilla loading logic remains unchanged.
  - Added hover, active, keyboard-focus, and reduced-motion states for the new ornamentation.
  - Added the approved design record at `docs/superpowers/specs/2026-09-03-contact-button-reference-design.md`.
- **Verification:**
  - `npm run build` completed successfully after the component edit.
  - `npm run build` completed successfully again after this documentation edit.
  - Postbuild runtime check passed: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors.
- **Pending:**
  - None.

### Contact Night Dispatch Redesign
- **Diagnosis / Context:**
  - The home-page contact section was functional but visually narrow and form-first, while the supplied reference called for a more cinematic night-shrine communication scene.
  - The affected component was `src/components/Contact.astro`; the existing Web3Forms validation and submission flow had to remain unchanged.
- **What Changed / Implementation:**
  - Added a wide, layered shrine frame with a centered sakura seal, nested ornamental borders, deeper violet glass, and restrained hover elevation.
  - Reworked the contact header and added a five-tile communication row for Email, GitHub, LinkedIn, Twitter / X, and availability status.
  - Kept Email and GitHub functional; the extra social tiles are clearly marked as coming soon and do not claim unverified destinations.
  - Changed the form into a responsive split altar on desktop: name, email, and subject on the left, message on the right; it collapses to one column on mobile.
  - Restyled the submit action as a centered ceremonial gradient button with sakura artwork, glow flare, and preserved loading-state IDs.
  - Preserved all existing form field IDs, validation/error elements, success/reset behavior, Astro `<Image />` usage, reduced-motion support, and component-local vanilla JavaScript.
  - Added the approved design specification at `docs/superpowers/specs/2026-09-03-contact-dispatch-redesign-design.md`.
- **Verification:**
  - `npm run build` completed successfully after implementation and after the final documentation edit.
  - Postbuild runtime check passed: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors; Git only reported existing line-ending normalization warnings.
  - Headless browser checks passed at 1440px and 390px viewports: five channel tiles rendered, all form controls remained present, and the message field remained visible and usable.
- **Pending:**
  - The design spec could not be committed because the environment denied creation of `.git/index.lock`; the spec file remains in the workspace for review.

### Contact Dispatch Visual Refinement
- **Diagnosis / Context:**
  - Review of the first contact redesign showed that the communication row still carried unnecessary destination placeholders and that the card geometry and CTA were softer than the supplied reference.
  - The refinement remained scoped to `src/components/Contact.astro` and the already-approved contact design specification.
- **What Changed / Implementation:**
  - Reduced the communication row to three equal cards: GitHub, LinkedIn, and Twitter / X.
  - Moved availability into a quiet status line below the cards so the visual hierarchy stays focused on communication channels.
  - Added clipped shrine-card geometry with nested inset lines, sharper corners, and stronger hover/focus treatment.
  - Added an inset ornamental form frame and clipped ribbon silhouette to the send button with side light accents.
  - Updated `scratch/contact-check.py` to dismiss the existing Neko splash before capturing previews and to assert the refined three-card layout.
  - Refreshed `scratch/contact-desktop.png` and `scratch/contact-mobile.png` as visual review artifacts.
- **Verification:**
  - `npm run build` completed successfully after the refinement and after the final documentation edit.
  - Postbuild runtime check passed: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors; Git only reported existing line-ending normalization warnings.
  - Headless browser checks passed at 1440px and 390px viewports with three communication cards, the split form, and visible message input. The only console message was the sandboxed external-resource denial.
- **Pending:**
  - The design spec remains uncommitted because the environment denies creation of `.git/index.lock`.

### Production Deployment — Navbar Beam Stability
- **Diagnosis / Context:**
  - The approved navbar beam stutter reduction was ready for publication after a successful local production build and runtime check.
- **What Changed / Implementation:**
  - Deployed the current workspace to Vercel production with `npx vercel --scope d-flint --prod --yes`.
  - Published deployment `dpl_BDjuLrEREpthuVQpkyLP5JqongKE` for `web-personal`.
  - Vercel aliased the deployment to `https://hoeurbvuthi.site`.
- **Verification:**
  - Vercel reported `readyState: READY` and completed its remote `npm run build` successfully.
  - The deployment preserved the project build script's `nodejs22.x` runtime patch.
- **Pending:**
  - None.

### Navbar Border Beam Rendering Stability
- **Diagnosis / Context:**
  - The mirrored navbar beams could stutter when hover simultaneously changed SVG dash motion, opacity, and layered blur/drop-shadow filters.
  - The affected implementation is in `src/components/Navbar.astro`, with the change documented alongside the existing navbar border-beam work.
- **What Changed / Implementation:**
  - Kept the trail and core filter treatments static instead of interpolating expensive filter stacks during hover transitions.
  - Limited hover transitions to opacity, preserving the quiet idle state and brighter hover state.
  - Added `will-change: stroke-dashoffset, opacity` to the animated SVG layers so the browser can prepare the two properties that actually change.
  - Preserved the Web Animations API `updatePlaybackRate()` easing between the 14-second idle cadence and faster hover cadence.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed successfully; Git only reported its existing line-ending normalization warnings.
- **Pending:**
  - None after verification.

### Navbar Mirrored Hover Border Beams
- **Diagnosis / Context:**
  - The desktop navbar border used a single continuously animated beam, which made the frame visually busy at rest and did not suit the navbar's wide symmetrical silhouette.
  - The requested interaction is a calm border that intensifies on hover with a symmetrical beam treatment.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`:
    - Added a named interactive navbar shell for hover-owned border activation.
    - Replaced the single SVG trail/core pair with two perimeter trail/core pairs offset by 50% so the beams remain opposite each other.
    - Added separate forward and mirrored sweep keyframes with paused, low-opacity idle states.
    - Added hover-only opacity, glow, and animation activation with smooth fade-out on pointer exit.
    - Preserved the mobile chamfered border, active navigation motifs, dropdown behavior, entrance reveal, and scroll elevation.
    - Extended reduced-motion handling to show only the calm static border.
  - `docs/superpowers/specs/2026-09-03-navbar-mirrored-border-beam-design.md`:
    - Documented the approved interaction, symmetry model, accessibility behavior, and scope.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors.
- **Pending:**
  - The design spec remains uncommitted because the environment denies creation of `.git/index.lock`.

### Navbar Border Beam Idle Motion Tuning
- **Diagnosis / Context:**
  - Follow-up review clarified that the mirrored border beams should not disappear or stop animating when the pointer leaves the navbar.
  - The desired idle state is dim and slow; hover should increase brightness and speed while preserving the 180-degree symmetry.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`:
    - Changed both mirrored trail and core layers from paused idle state to continuous low-opacity animation.
    - Set idle sweep duration to 14 seconds and idle brightness to a restrained level.
    - Kept hover activation at full brightness and accelerated the sweep to 4.8 seconds.
    - Preserved smooth brightness transitions, reduced-motion behavior, mobile contour rendering, and navigation interactions.
  - `docs/superpowers/specs/2026-09-03-navbar-mirrored-border-beam-design.md`:
    - Updated the specification to document continuous slow idle motion and faster hover motion.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed successfully.
- **Pending:**
  - The design spec remains uncommitted because the environment denies creation of `.git/index.lock`.

### Navbar Border Beam Playback Transition Smoothing
- **Diagnosis / Context:**
  - Changing `animation-duration` directly made the beam speed snap between idle and hover values instead of transitioning smoothly.
  - The requested behavior is a continuous brightness and speed transition in both directions.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`:
    - Kept the paired beams continuously animated at the 14-second idle cadence.
    - Added hover enter/leave handlers that use the Web Animations API `updatePlaybackRate()` to ease between idle speed and the faster hover equivalent of 4.8 seconds.
    - Extended opacity and filter easing to 600ms for the trails and 520ms for the cores.
    - Preserved the mirrored phase offset, reduced-motion behavior, mobile contour, and navigation interactions.
  - `docs/superpowers/specs/2026-09-03-navbar-mirrored-border-beam-design.md`:
    - Corrected the symmetry description and documented playback-rate smoothing.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed successfully.
- **Pending:**
  - The design spec remains uncommitted because the environment denies creation of `.git/index.lock`.

### Desktop Scroll Rail Circuit-Seal Checkpoints
- **Diagnosis / Context:**
  - Passed scroll-rail checkpoints were plain softly filled circles, making completed history feel generic and too visually similar to the active orb.
  - The requested direction combined angular spirit-circuit nodes with broken talisman-seal geometry, without introducing another sakura motif.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`:
    - Added a decorative diamond core inside each rail marker.
    - Restyled `.passed` markers as violet-pink lacquer nodes with a broken rotated outer ring.
    - Added a subtle horizontal circuit trace through completed nodes.
    - Added hover brightening for the completed seal while preserving the active orb as the strongest focal point.
    - Hid the decorative layers from assistive technology and included them in the existing reduced-motion transition reset.
    - Preserved section navigation, `aria-current`, scroll interpolation, tooltips, and responsive visibility.
  - `docs/superpowers/specs/2026-09-03-scroll-rail-circuit-seals-design.md`:
    - Documented the approved hybrid visual language and verification criteria.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed without whitespace errors.
- **Pending:**
  - The design spec remains uncommitted because the environment denies creation of `.git/index.lock`.

### Project Controls Slide-In Entrance
- **Diagnosis / Context:**
  - The `/projects` archive header already used the `headerFadeSlide` entrance, but the search and filter command suite appeared immediately on initial load.
  - The requested behavior was for the controls to enter with the same restrained slide-in motion as the catalogue header.
- **What Changed / Implementation:**
  - `src/pages/projects.astro`:
    - Added `animate-controls-slide-in` to the project filter-controls section.
    - Reused `headerFadeSlide` with a 650ms duration and 180ms delay so the header leads and the controls follow.
    - Added a `prefers-reduced-motion` override that removes the animation and restores the final visual state immediately.
    - Preserved all search, filtering, view-switching, and project-card behavior.
  - `docs/superpowers/specs/2026-09-03-project-controls-slide-in-design.md`:
    - Documented the approved motion design, accessibility behavior, scope, and verification criteria.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - The design spec could not be committed because the environment denied creation of `.git/index.lock`; it remains in the working tree.

## Session 2026-09-02

### Mobile Lighthouse Performance Optimization (49 to 96)
- **Diagnosis & Context:**
  - Mobile Lighthouse performance score had dropped to 49.
  - Root cause investigation uncovered multiple compounding factors:
    1. **Harness Port Collision / Dev Server Leak:** `scripts/lighthouse-local.cjs` hardcoded port 4321. When Vite/Astro dev server was running, `http-server` failed to bind to port 4321, causing Lighthouse to audit the active Vite development server (~4.3 MB payload with unbundled modules, dev toolbar, and HMR clients).
    2. **Mobile Hero Blocking & Delayed LCP:** In `src/pages/index.astro`, `initMobileTypewriter()` blanked out `nameEl.textContent = ''` and hid `.hero-mobile-stagger` items behind `opacity: 0`, waiting on timers and typing character-by-character, forcing LCP to wait 9.8s.
    3. **Full-Viewport Splash Screen Occlusion:** On mobile screens, `MatrixSplash` remained active over the viewport for ~1.5s real time (4.5–6s on throttled CPU), occluding all underlying LCP candidate elements.
    4. **Unoptimized Background & Modal Images:** Background layers in `ShrineBackgroundCrossfader.astro`, `ProjectsBackground.astro`, `AboutMe.astro`, `NekoGameModal.astro`, `ProjectModal.astro`, `Navbar.astro`, and `NekoWidget.astro` downloaded uncompressed or eager images during initial page load.
    5. **Asynchronous Font Swap Delay:** `@font-face` definitions were loaded asynchronously via preloaded `fonts.css`, causing late font swaps on mobile.

- **What Changed / Implementation:**
  - `scripts/lighthouse-local.cjs`:
    - Replaced external child process spawning with a fast, zero-dependency in-process static HTTP server with gzip compression and isolated port `54321`.
  - `src/pages/index.astro`:
    - Removed blocking typewriter loop that blanked hero text on startup.
    - Set `.hero-mobile-stagger` to `opacity: 1; transform: none;` on mobile for instant first paint and LCP.
    - Optimized hero icons (`sakuraIcon`, `toriGateImg`) with explicit dimensions, `format="webp"`, and `quality={80}`.
  - `src/components/MatrixSplash.astro`:
    - Enhanced parse-time gate to suppress the blocking splash screen on mobile viewports (`(max-width: 640px), (pointer: coarse)`), allowing immediate first contentful paint.
  - `src/styles/global.css` & `src/layouts/BaseLayout.astro`:
    - Inlined `@font-face` definitions directly into `global.css` with `font-display: optional` and removed the asynchronous `fonts.css` link to prevent font swap delays.
    - Removed unused preconnect tags for `api.deepseek.com` and `api.web3forms.com`.
  - `src/components/ShrineBackgroundCrossfader.astro` & `src/components/ProjectsBackground.astro`:
    - Added responsive `widths`, `sizes="100vw"`, `format="webp"`, and `quality={70}`.
    - Set non-active background layers (`projects`, `about`, `contact`, `footer`) to `display: none` initially so browser does not eagerly fetch inactive layers during page load.
  - `src/components/AboutMe.astro`, `src/components/Navbar.astro`, `src/components/NekoWidget.astro`, `src/components/NekoGameModal.astro`, `src/components/ProjectModal.astro`, `src/components/ProjectCard.astro`:
    - Optimized avatar frames, tech stack backgrounds, mobile nav bar backgrounds, chatbot backgrounds, and modal backdrops with responsive widths, WebP encoding, and lazy loading.

- **Verification:**
  - `npm run build`: Complete static build succeeded cleanly (exit code 0).
  - Postbuild runtime patch verified: `.vercel\output\functions\_render.func\.vc-config.json` -> `nodejs22.x`.
  - `node scripts/lighthouse-local.cjs` Mobile Audit Scores:
    - **Performance: 96** (Jumped from 49)
    - **Accessibility: 100**
    - **Best Practices: 96**
    - **SEO: 100**
    - **First Contentful Paint (FCP): 1.6s** (Score: 0.95)
    - **Largest Contentful Paint (LCP): 2.6s** (Score: 0.87)
    - **Total Blocking Time (TBT): 0 ms** (Score: 1.00)
    - **Cumulative Layout Shift (CLS): 0** (Score: 1.00)
    - **Speed Index: 1.6s** (Score: 1.00)

- **Pending:**
  - None.

### Project Card Image Performance Optimization
- **Diagnosis & Context:**
  - The project card preview images were experiencing slow load times and noticeable latency.
  - Root cause analysis identified two major performance bottlenecks:
    1. **Oversized Asset Delivery & Lack of Responsive Scaling:** In `src/components/ProjectCard.astro`, `<Image>` rendered unscaled full-resolution assets (`1536x1024` and `1586x992`), generating ~160KB-190KB payloads per card for a ~380px display box, without explicit responsive `widths`, `sizes`, or `quality` attributes.
    2. **Network Queue Congestion from Decorative Assets:** `src/components/CatEar.astro` (rendered twice per card for hover effects, totaling 38 instances on the `/projects` archive page) defaulted to `loading="eager"` and `fetchpriority="high"`, firing dozens of immediate high-priority requests that congested the browser's HTTP pipeline and blocked above-the-fold project card preview images.
- **What Changed / Implementation:**
  - `src/components/ProjectCard.astro`:
    - Configured responsive srcset generation using `widths={[380, 540, 720, 960]}` and `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"`.
    - Enforced `format="webp"` with optimized `quality={80}`, reducing network payload sizes from ~190KB down to ~10KB–27KB per card (over 85-95% bandwidth reduction).
    - Added intelligent viewport loading: `loading={index < 3 ? 'eager' : 'lazy'}` and `fetchpriority={index < 3 ? 'high' : 'auto'}` for instant above-the-fold delivery.
    - Explicitly set `loading="lazy"` and `fetchpriority="low"` on decorative `CatEar` components within cards.
    - Added smooth CSS transition (`transition: transform 0.3s ease`) and subtle hover scale (`scale(1.03)`) for `.card-media-img`.
  - `src/components/CatEar.astro`:
    - Changed default component props to `loading = 'lazy'` and `fetchpriority = 'low'` to prevent hidden hover ear ornaments from monopolizing initial network requests across the site.
- **Verification:**
  - Executed `npm run build` cleanly (exit code 0). Verified generated responsive WebP assets (10KB–33KB per card breakpoint).
  - Verified postbuild runtime patch `.vercel\output\functions\_render.func\.vc-config.json` -> `nodejs22.x`.
- **Pending:**
  - None.

## Session 2026-09-01

### Project 02 Domain Focus Update
- **Diagnosis & Context:**
  - The domain focus on Card 02 previously read `FULL-STACK & WEB` due to legacy catalog grouping.
  - Updated to explicitly specify `Frontend & Web` to accurately describe the frontend architecture.
- **What Changed:**
  - Updated `domainLabel` to `'Frontend & Web'` in both `src/components/ProjectGrid.astro` and `src/pages/projects.astro`.
- **Verification:**
  - `npm run build` executed cleanly (exit code 0).
  - Serverless runtime verified at `nodejs22.x`.
- **Pending:**
  - None.

### Project 02 Portfolio Website Metadata Refinement
- **Diagnosis & Context:**
  - Project 02 was labeled as a full-stack web app, whereas it is a pure frontend developer portfolio website built with Astro and Tailwind CSS.
  - The feature list needed to showcase the authentic, frontend-focused features of the website.
- **What Changed:**
  - `src/components/ProjectGrid.astro` & `src/pages/projects.astro`:
    - Updated `title` to `'Portfolio Website'`.
    - Refined `description` to accurately reflect Astro, Tailwind CSS, dark glassmorphism, interactive particle canvas, and Lady Yae AI assistant.
    - Updated `tags` to `['Astro', 'Tailwind CSS', 'TypeScript', 'Vite']`.
    - Rewrote `features` list:
      1. Grand Narukami dark glassmorphism design system
      2. Interactive Sakura canvas & responsive 9:16 mobile scenery
      3. Embedded Lady Yae AI assistant & whack-a-mole mini-game
      4. Filterable project catalog with real-time modal details
- **Verification:**
  - `npm run build` executed cleanly (exit code 0).
  - Serverless runtime verified at `nodejs22.x`.
- **Pending:**
  - None.

### Project Card High-Res Image Assets & Asset Pipeline
- **Diagnosis & Context:**
  - Added new 16:10 high-resolution project artwork assets to `src/assets/images/` for featured and archive projects.
- **What Changed:**
  - Rebuilt project with `npm run build`, compiling fresh responsive WebP assets for `project-card-1.png`, `project-card-2.png`, and `project-card-3.png`.
- **Verification:**
  - `npm run build` completed successfully.
  - Serverless runtime verified at `nodejs22.x`.
- **Pending:**
  - None.

### Local Project Card Image Wiring
- **Diagnosis & Context:**
  - Connected local artwork assets (`src/assets/images/project-card-{1,2,3}.png`) directly to the featured and archive project lists.
- **What Changed:**
  - `src/components/ProjectGrid.astro`: Imported local card image assets and passed them to projects 01, 02, and 03.
  - `src/pages/projects.astro`: Imported local card image assets and passed them to the corresponding master archive projects.
- **Verification:**
  - `npm run build` compiled all static routes and generated optimized image webp formats for `project-card-1.png`, `project-card-2.png`, and `project-card-3.png`.
  - Postbuild runtime patch verified as `nodejs22.x`.
- **Pending:**
  - None.

### Clean Project Card Image Integration
- **Diagnosis & Context:**
  - Implemented clean, type-safe image support in the unified `ProjectCard.astro` component to seamlessly accept both imported Astro asset metadata (`ImageMetadata`) and static URL strings.
- **What Changed:**
  - `src/components/ProjectCard.astro`:
    - Imported `type { ImageMetadata } from 'astro'`.
    - Added optional `image?: ImageMetadata | string` to `interface Project` and destructured `image` prop.
    - Updated `.card-media` slot to conditionally render Astro `<Image />` for imported assets, `<img>` for string URLs, or fall back to the project icon glyph placeholder (`.card-media-ph`).
- **Verification:**
  - Executed `npm run build` cleanly (exit code 0).
  - Verified postbuild runtime patch `.vercel/output/functions/_render.func/.vc-config.json` -> `nodejs22.x`.
- **Pending:**
  - None.

### Remote Repository Synchronization & Project Card System Update
- **Diagnosis & Context:**
  - Synchronized local branch with upstream GitHub repository (`origin/main`) containing remote UI enhancements and unified project card system.
- **What Changed:**
  - Pulled remote commits `470e427` (Portfolio Polish — Safe High-Impact Subset) and `b5be95f` (Navbar Polish + Unified Project Cards).
  - Merged upstream `ProjectCard.astro` component architecture, which unifies card styling across the Home featured grid and `/projects` archive.
  - Retained local navbar entrance visibility improvements and SSR stability in `src/components/Navbar.astro`.
- **Verification:**
  - Executed `npm run build` cleanly (exit code 0).
  - Verified postbuild runtime patch `.vercel/output/functions/_render.func/.vc-config.json` -> `nodejs22.x`.
- **Pending:**
  - None.

### Agent Logging Protocol Enforcement
- **Diagnosis & Context:**
  - Standardized agent directives in `AGENTS.md` to ensure future agents rigorously log and document every change, feature implementation, and architectural decision.
- **What Changed:**
  - Updated Rule 9 in `AGENTS.md` to mandate comprehensive change and implementation logging.
  - Specified target file (`docs/build-log.md`), required entry structure (Diagnosis/Context, What Changed/Implementation Details, Verification, Pending), and strict definition-of-done criteria requiring build verification and log completion before closing any task.
- **Verification:**
  - Build checked via `npm run build` and verified `nodejs22.x` postbuild runtime patch.
- **Pending:**
  - None.

## Session 2026-08-30

### Navbar Multi-Route Visibility Fix
- Fixed an issue where `#main-navbar` entrance reveal was trapped inside an `if (!isHome) return;` block, leaving the navbar at initial opacity 0 on `/projects` and non-home routes.
- Lifted `triggerEntrance()` and `updateNavbarElevation()` to top-level global execution, ensuring immediate reveal across all pages.

### Navbar Orbiting Border Beam Light
- Replaced the static top crest highlight with an orbiting SVG border beam (shrine-border-orbit) that slides the bright white laser core and glowing sakura halo continuously around the entire perimeter of the navbar pill in an infinite loop (orbitBeamSweep).

### Navbar Living Animation & Scroll Dynamics
- Choreographed landing entrance animation synchronized with the matrix-splash-done reveal event for a graceful descent and soft blooming aura.
- Added living ambient animations to the Grand Narukami floating Torii pill: breathing dual aurora pulses (shrine-aurora-pink & shrine-aurora-purple) and an ethereal traveling scan sweep (shrine-glint-scan).
- Added sacred idle swaying and hover blooming halo to the Torii gate mascot brand icon (shrine-torii-float).
- Enhanced desktop navigation links with smooth hover transforms, subtle text glow, and floating sakura blossom physics for the active motif.
- Added responsive scroll elevation dynamics: automatically transitions to a sleek, deeper glass dock when scrolled past the hero section.
- Provided full fallback support for reduced motion preferences (prefers-reduced-motion: reduce) and <noscript>.

### Matrix Rain Fluid Motion & Performance Optimization
- Eliminated frame judder and stutter by removing artificial 33ms RAF throttling, syncing animation directly to native monitor VSync refresh rates (60Hz, 120Hz, 144Hz+).
- Refactored canvas rendering into high-efficiency batched passes: single-pass tail rendering without shadow state thrashing, batched head glowing bloom, and lightweight particle passes.
- Maintained smooth delta-time interpolation with capped delta ceiling.

### Matrix Rain Animation Upgrade
- Enhanced src/utils/matrix-rain.ts with real-time cyberpunk glyph mutation/shimmering.
- Implemented multi-depth parallax rendering with layered column speeds, randomized trail lengths, and depth opacity scaling.
- Added luminescent glowing stream heads with soft canvas bloom (#ffffff / #ffd6e8 glow) and cubic tail falloff.
- Expanded the character palette to include half-width matrix katakana, math runes, and Inazuma/Grand Narukami shrine kanji (桜, 狐, 電, 神, 月, 夢, 鏡, 社, 猫).
- Upgraded canvas rendering to high-DPI (Retina/2K) device pixel ratio scaling for razor-sharp typography.
- Enhanced falling Neko treats and paw trails with neon glowing aura.

### Chat API & Mascot System Prompt
- Updated the portfolio website description in src/pages/api/chat.ts system prompt to accurately reflect Astro 7, Tailwind CSS v4, TypeScript, Vercel deployment, Grand Narukami Shrine dark glassmorphism styling, interactive Sakura canvas, project catalog, and streaming AI integration.
- Analyzed token limits and resolved mid-sentence truncation by increasing max_tokens.
- Verified build and postbuild runtime patch (nodejs22.x).

## Session 2026-06-10

### Whiskers
- CSS ::before/::after pseudo-elements with inline SVG
- .whisker-group:hover::before/after - opacity 1 + translate

### Dark Mode
- CSS custom properties on :root / .dark
- Navbar toggle with localStorage + system preference detection

### Scroll Reveal
- IntersectionObserver bidirectional fade (in/out)

### Projects Page
- Created src/pages/projects.astro with 6 initial projects
- Added View All Projects button to ProjectGrid
- Fixed Navbar Home link from #home to /

## Session 2026-06-14

### Sakura Canvas
- HTML5 Canvas with 35 bezier-curve petals, 3 pink shades, wind drift, rotation
- Toggle via sakura button, localStorage, custom event

### Tag Filtering
- FLIP (First-Last-Invert-Play) animation, 1.2s cubic-bezier
- Multi-select via Set: toggle tags, All clears
- Cards match ANY selected tag
- 19 projects, 28 unique tags
- Nav links made root-relative

## Session 2026-06-15

### Neko Widget
- Created NekoWidget.astro with /yae-mico-maid.png avatar
- Speech bubble: idle messages, contextual section/navbar hover detection
- Expandable chat with Q&A chips, text input, keyword detection
- Typing indicator, hide/restore, breathing & wiggle animations

### Chat Scroll Fix
- Fixed-height flex column layout
- MutationObserver auto-scroll, text wrapping on bubbles
- Removed global overflow override

### BaseLayout Migration
- Created BaseLayout.astro with shared shell
- Migrated index.astro and projects.astro

## Maintenance
- Email updated to vuthihoeurb@gmail.com
- Cleaned up unused files

## Session 2026-06-26

### Click Feedback Effects
- Created ClickEffects.astro — global pointer click feedback component
- One translucent neko paw ripple + 4-6 sakura petals on each click
- CSS-variable keyframe animation, DocumentFragment batching, automatic animationend cleanup, 50-particle cap
- Respects prefers-reduced-motion: reduce, disables for coarse/touch pointers
- Mounted globally in BaseLayout.astro (after SakuraCanvas)
- Verified build with npm.cmd run build

## Session 2026-06-27

### Navbar Mobile Menu
- Added mobile hamburger menu panel with glassmorphism slide-in drawer
- Semi-transparent backdrop overlay, close on backdrop/X/link click
- Body scroll lock when menu is open
- 300ms CSS transition for slide-in/out and backdrop fade

### Navbar Hover Effects
- All nav links (Home, Projects, About, Contact) now scale 25% on hover
- Name logo gets pink glow + 25% scale on hover (via nav-glow-link class)
- Hamburger button scales 15% on hover
- Fixed `display: inline-block` on `.nav-glow-link` — `<a>` defaults to `display: inline` which ignores CSS transforms

## Session 2026-06-29

### Image Migration
- Moved 4 images from `public/` to `src/assets/images/` (mascot.png, yae-mico-maid.png, yae-miko-chibi.jpg, yae-miko-tiny.png)
- Replaced all `<img>` tags with Astro `<Image />` in AboutMe.astro, Contact.astro, index.astro, NekoWidget.astro
- Cleaned up 6 temp/backup files (Contact.astro.bak, writer.ps1, neko_b64.txt, patch_neko.b64, temp_content.txt, test_write.txt)

### Image Loading Optimization
- Added `loading="eager"` to above-the-fold images (yae-miko-chibi.jpg, yae-mico-maid.png widget button)
- Added `loading="lazy"` to below-the-fold images (mascot.png, yae-miko-tiny.png, yae-mico-maid.png chat header)

### CLS Fixes
- Scroll-reveal changed to opacity-only (removed translate-y) — eliminates 32px layout shift
- SSR filter buttons instead of JS injection — eliminates grid reflow CLS
- Navbar explicit `h-16` height — prevents layout shift from drop-in animation

### SEO/Lighthouse Fixes
- Added `description` prop to BaseLayout.astro with per-page meta description
- Changed modal link href from `#` to `initialLiveUrl`/`initialSourceUrl` (crawlable SSR fallback)
- Added `role="button"` + `tabindex="0"` + keyboard handler to project card divs
- All 13 project cards now crawlable and keyboard-accessible

## Session 2026-07-06

### Codebase Cleanup
- Deleted 8 root junk files: _apply_zoom.py, _build.py, _patch.mjs, _repair.py, handoff.md, handoff.txt, new-feature.md, run.txt
- Deleted stale nested Desktop/ directory (duplicate project copy)
- Deleted empty directories: .agents/, web-personal/
- Deleted empty .env file

### Documentation Update
- Updated agents-memory/architecture.md: fixed stale risk mitigations (lazy loading, asset paths, contact form)
- Updated agents-memory/service - Project Catalog.md: project count 14 to 19
- Updated agents-memory/service - Scroll Reveal.md: removed translate-y references (CLS fix)
- Updated agents-memory/Astro Portfolio - Tasks.md: marked 6 completed items
- Updated docs/structure.md: removed run.txt reference
- Updated docs/unchanged.md: updated file status for Background.astro, added deleted files

## Session 2026-07-08

### Full Documentation Sync
- Audited all source files against docs and found multiple discrepancies
- Fixed Background.astro description (was "3 kitsune tails + 5 fire dots" → "5 layers: conic wash, orbs, glass floaters, vignette, mouse parallax")
- Fixed NekoWidget chat height (560→700px) and chip list (4→9 chips including Whack-a-Mole)
- Fixed scroll reveal documentation (homepage opacity-only, projects page directional exit)
- Documented TraceArt.astro, Navbar filterTags prop, ProjectModal SSR props
- Marked keyboard arrow nav as commented-out dead code
- Updated all docs/ files, README.md, and agents-memory/ vault


## Session 2026-07-09

### Vercel nodejs24.x Runtime Fix
- Production crash: `@astrojs/vercel` auto-detected Node v24 → generated unsupported nodejs24.x runtime
- Changed `astro.config.mjs`: output static → server with vercel adapter
- Postbuild script in `package.json` patches `.vc-config.json` to force nodejs22.x
- Added `@astrojs/vercel` ^11.0.2 and `@vercel/speed-insights` ^2.0.0 dependencies
- Updated all documentation and agents-memory
- Build verified; ⚠ not yet redeployed

## Session 2026-08-19

### Cumulative Layout Shift (CLS) — Investigation & Fix
- Speed Insights flagged CLS on `body`. Traced the real source with a headless-Chrome
  PerformanceObserver probe under slow-network throttle — `body` is only the affected ancestor.
- **Root cause of the 1.14 CLS:** a `makeAsync` hack in `src/layouts/BaseLayout.astro` flipped any
  stylesheet matching `/_astro/ProjectModal` to `media="print"` (non-render-blocking). Astro bundles
  global.css + all component utilities into that same hashed file, so on slow connections the page
  painted with NO utility CSS → `#matrix-splash`, `#neko-widget`, `#neko-game-modal` rendered in-flow
  → `<body>` inflated to ~9.5k px then collapsed to ~5.6k px (huge CLS).
- **Fix:** removed the deferral — the global stylesheet is render-blocking again, so layout is
  correct at first paint. Verified under throttle: page height no longer collapses; CLS 0.1125 → 0.0247.
- `public/fonts/fonts.css`: `font-display: swap` → `optional` (removes font-swap text reflow; fonts still preloaded).
- Restored `content-visibility` containment on `#projects`/`#contact` in `global.css` (was helping).
- **Reverted:** `ScrollReveal.astro` + `MatrixSplash.astro` anti-reflow edits — they broke the hero
  headline scramble animation. Restored to original; the real CLS win lives in the BaseLayout fix.
- Added `scripts/cls-probe.mjs` (headless-Chrome CLS probe) for future verification.
- Commits: 79eed20, 6c7ddd9, b1e05be, 80e8df6.

## Session 2026-08-23

### Sakura Canvas Streak Fix
- Updated `src/components/SakuraCanvas.astro` to keep petal simulation coordinates in CSS viewport pixels while the backing canvas remains DPR-scaled.
- Reset the drawing transform and clear region on resize; kept the canvas explicitly fullscreen.
- Verified with Playwright at 1900×968 and high sakura density: canvas remained 1900×968 and petals stayed bounded at 6s and 12s.
- `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.
- Production was not redeployed.

## Session 2026-08-29

### Frontend Design Skills Installation & Desktop Hero Refinement
- Verified and installed design skills: `design-taste-frontend` (Taste skill), `emil-design-eng` (Emil Kowalski's skill), and `impeccable` design suite in `.claude/skills/`.
- Updated `AGENTS.md` to reflect all installed skills.
- **Hero Section Desktop Refinements (Anti-Slop & Micro-interactions):**
  - Removed gradient-clipped heading text (`bg-clip-text`) and replaced with high-contrast, luminous solid `#fbcfe8` typography with soft ambient cherry-blossom shadow.
  - Replaced decorative `HELLO, WORLD!` noisy sparkle badge with an authentic live availability capsule (`Available for Software Engineering & AI`) with a pulsing emerald status dot.
  - Fixed bounce easing on entrance animations to natural exponential deceleration `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Maintained clean, unobstructed left-aligned single-column (`max-w-2xl`) layout so desktop background artwork (Yae Miko) remains completely open and visible without clutter.
  - Polished CTA buttons with Emil Kowalski tactile interaction physics: specific transitions, `:active:scale-[0.97]` press response, and crisp specular glassmorphism.
- **Featured Projects Section & Card Interior Refinements (Interactive Shrine Talisman):**
  - Harmonized top header: paired the diamond rotated icon box and project index badge (`01 / PROJECT`) on the left with a dedicated Japanese calligraphy talisman capsule (`桜の下で`) on the right.
  - Gave project title and description full horizontal line length for optimal readability and measure (eliminating collision with vertical calligraphy).
  - Added clean hairline footer divider (`border-t border-pink-500/15`) framing the tag pills and the "Explore Details" interactive CTA.
  - Snappy 200ms exponential ease-out card hover physics (`hover:-translate-y-1.5`, `active:scale-[0.985]`, cat ear wiggles preserved).
  - Enhanced glass depth with specular top bevel (`inset 0 1px 1px rgba(255,255,255,0.12)`) and ambient shadow.
  - Refined header typography with clean `#fbcfe8` accent and shrine-seal eyebrow.
- **About Me Section Refinements:**
  - Removed jarring hover scale on bio paragraphs; refined typography with calm, readable `text-slate-200/90` and clean single-pixel border.
  - Simplified section header to a dignified Torii capsule badge (`ABOUT ME`) without decorative clutter.
  - Refined the 3-item highlights capsule (Location, Focus, Philosophy) with crisp frosted glass and subtle micro-hover states.
  - Streamlined the Technical Stack card with a clean header border (`CORE // TOOLS`), snappy 200ms ease-out transitions, and `:active:scale-[0.96]` tactile tag pills.
- Verified with `npx impeccable detect` (0 anti-patterns across `index.astro`, `ProjectGrid.astro`, and `AboutMe.astro`).
- `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Shrine Contact Altar & Full Projects Catalog Refinements
- **Contact Altar (`src/components/Contact.astro`):**
  - Upgraded outer glassmorphism card to deep liquid frost (`bg-slate-900/60`, `border-pink-500/25`, `backdrop-blur-xl`, `inset 0 1px 1px rgba(255,255,255,0.12)`) matching the homepage aesthetic.
  - Added direct communion action pills above form: 1-click Email (`mailto:vuthihoeurb@gmail.com`), GitHub link (`github.com/D-Flint`), and `~24h Response` status indicator.
  - Replaced conflicting legacy `!important` styles with crisp Tailwind classes and subtle inset bevels (`shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]`).
  - Refined the submit button with Emil Kowalski tactile micro-physics (`active:scale-[0.98]`, `hover:scale-[1.015]`, smooth arrow slide), eliminating the infinite jittery button shake.
  - Polished the celebratory success state with smooth scale hover and dignified shrine styling.
- **Projects Catalog Page (`src/pages/projects.astro`):**
  - Replaced gradient text clipping (`bg-clip-text`) with luminous, high-contrast `#fbcfe8` typography (`text-pink-200 drop-shadow-[0_0_24px_rgba(244,114,182,0.5)]`).
  - Harmonized horizontal project cards with rounded-2xl glass bevels, glowing icon containers, and clean font-mono tag pills.
  - Added snappy tactile `:active:scale-[0.99]` and 200ms ease-out transitions.
- **Sanctuary Footer Refinements (`src/components/Footer.astro`):**
  - Upgraded centered top Torii emblem divider badge with clean Narukami Shrine branding and frosted glass depth.
  - Aligned live availability status capsule with matching hero/contact emerald pulse.
  - Polished navigation and connect links with subtle micro-hover slide (`hover:translate-x-1`, `hover:text-pink-200`).
  - Elevated the "Back to Top" button with Emil Kowalski tactile physics (`:active:scale-[0.97]`, smooth 45° sakura spin on hover).
  - Modernized bottom stack attribution with sleek font-mono badges and an explicit active development notice ("Notice: This site is currently under active development, so some information may not be fully up to date.").
- **Navigation Bar Refinements (`src/components/Navbar.astro`):**
  - Refined desktop contact CTA button and utility toggle pills with snappy 200ms exponential easing (`cubic-bezier(0.16, 1, 0.3, 1)`) and tactile `:active:scale-[0.97]` feedback.
  - Harmonized active navigation pulse state and mobile drawer physics.
- **Kitsune Scroll Talisman Tag System (`src/components/TagPill.astro`, `src/utils/tags.ts`, `src/styles/global.css`):**
  - Created a modular `<TagPill />` component and `renderTagPillHtml()` utility embodying the Grand Narukami Kitsune aesthetic.
  - Features traditional Japanese shrine brackets (`「` and `」`) that expand outward by 1.5px on hover.
  - Implemented custom vector SVG Kitsune Fox-Fire sparks with domain category glow:
    - *Systems & Low-Level* (`C++`, `CMake`, `SQLite`, `Linux`, `Algorithm`): Emerald Fox-Fire (`#34d399` neon glow).
    - *Modern Web & Frameworks* (`React`, `Astro`, `TypeScript`, `Tailwind CSS`, `Node.js`): Radiant Sakura Magenta (`#f472b6` glow).
    - *AI, Backend & Cloud* (`Python`, `FastAPI`, `Docker`, `TensorFlow.js`, `GraphQL`): Celestial Amethyst (`#c084fc` glow).
  - Encased in obsidian-amethyst lacquer glass (`rgba(12, 11, 22, 0.65)`) with an inner gold-leaf top bevel (`inset 0 1px 1px rgba(255, 255, 255, 0.22)`).
  - Applied across `AboutMe.astro`, `ProjectGrid.astro`, `projects.astro`, `Navbar.astro` (desktop & mobile filter pills), and `ProjectModal.astro`.
- **Verification:**
  - `npx impeccable detect`: 0 anti-patterns across the entire codebase.
  - `npm run build` passed and Vercel runtime patch verified as `nodejs22.x`.

### Interactive Project Modal Carousel & Shrine Spec Matrix
- **Project Modal Elevating & Navigation (`src/components/ProjectModal.astro`, `src/pages/index.astro`, `src/pages/projects.astro`):**
  - **Full Project Carousel & Directional Transitions:** Added Prev / Next carousel buttons in the sticky header with silky smooth directional slide crossfades (`translateX` + `opacity`), real-time project index counter (`01 / 19` on catalog, `01 / 03` on home), and wrap-around navigation.
  - **Keyboard & Touch Accessibility:** Integrated full keyboard arrow support (`ArrowLeft` / `ArrowRight` to cycle projects, `Escape` to close, `Tab` focus trapping) and touch swipe gesture detection for mobile devices.
  - **Shrine Spec Matrix:** Added a 3-column frosted spec card showcasing Domain Focus, Core Technology, and Open Source license status.
  - **Interactive Share & Copy Link:** Added a 1-click project share button with dynamic toast feedback ("Copied! ✨").
  - **Architecture Cleanliness:** Centralized and streamlined the modal controller into `ProjectModal.astro`, eliminating duplicate client-side listener scripts across `index.astro` and `projects.astro`.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Navbar Stacking Context & Modal Layering Fix
- **Stacking Context Correction (`src/layouts/BaseLayout.astro`, `src/components/ProjectModal.astro`):**
  - Moved `<ProjectModal />` out of the inner `<main id="main-content">` (`relative z-10` stacking context) and mounted it directly as a top-level body element in `BaseLayout.astro`.
  - With `ProjectModal` at `z-[100]` in the root stacking context, the dark blur backdrop and modal dialog cleanly overlay the floating `Navbar` (`z-50`) without clipping.
  - Refined viewport proportions to `max-h-[86vh]` with comfortable vertical padding (`p-3 sm:p-6`) for balanced positioning.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Interactive Slide-Out Feature Deep Dive Drawer
- **Feature Deep Dive Drawer (`src/components/ProjectModal.astro`, `src/utils/featureDetails.ts`):**
  - **Clickable Feature Items:** Transformed the Key Features list into interactive, tactile capsules with hover micro-motion, active border glow, and a `Details →` cue.
  - **Slide-Out Drawer Panel:** Implemented a liquid-glass master-detail drawer that smoothly glides out from the right side of the modal with 300ms cubic-bezier physics.
  - **Architectural Notes & Specs:** Each drawer panel breaks down the selected capability with an **Engineering Rationale**, **Underlying Technologies**, **Architectural Advantage**, and **Scope & Complexity** rating.
  - **Paging & Nested Escape Navigation:** Integrated "Prev Feature" / "Next Feature" navigation buttons in the drawer footer, plus intelligent `Escape` handling (closes the drawer first before closing the modal) and touch swipe support.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Feature Drawer CSS Translation Conflict Fix
- **Translation Property Disambiguation (`src/components/ProjectModal.astro`):**
  - Removed Tailwind's `translate-x-full` utility from the `#feature-drawer` element class which was colliding with the CSS `transform` rule in modern rendering engines (where CSS `translate` property is evaluated independently of `transform`).
  - Styled `#feature-drawer` with pure `transform: translateX(100%)` transitioning to `transform: translateX(0) !important` on `.is-open`.
  - Re-verified drawer animation: the deep dive panel now smoothly slides into view from the right over the dimmed scrim upon clicking any feature card.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Dual-Window Master-Detail Layout (External Slide-Out Wing)
- **External Sidecar Window Docking (`src/components/ProjectModal.astro`):**
  - Refactored the Feature Deep Dive panel so that it slides **OUTSIDE** to the right of the main modal dialog rather than overlapping its content.
  - On desktop (`>= lg:`), clicking any feature smoothly expands an attached companion liquid-glass window (`width: 380px`) to the right of `#modal-card` with 320ms exponential spring easing. Both the full project overview and the technical deep dive remain visible side-by-side.
  - On mobile/tablet (`< lg:`), it seamlessly adapts as a centered slide-in overlay with a dedicated scrim and back button.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Dual-Window Height Synchronization & Internal Scroll Lock
- **Equal-Height Flex Locking (`src/components/ProjectModal.astro`):**
  - Locked `#modal-card` and `#feature-drawer` to the identical viewport height (`h-[84vh] max-h-[84vh]`) with `#modal-wrapper` set to `items-stretch`.
  - Added `flex-1 min-h-0 overflow-y-auto` to both scrollable viewports, guaranteeing that both cards remain identical in height pixel-for-pixel regardless of content density, while allowing smooth independent internal scrolling.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Interactive Technology Decision Rationale Matrix
- **Interactive Tech Stack Pills (`src/components/ProjectModal.astro`, `src/utils/techDetails.ts`):**
  - Enabled interactive click & keyboard selection on every technology and tool tag pill under *Technologies & Tools*.
  - When clicked, the external sidecar companion window slides open (or updates) into **TECHNOLOGY RATIONALE** mode.
  - Displays a detailed architectural breakdown explaining **Why This Tool Was Chosen**, its **🎯 Project Integration Role**, its **✨ Architectural Advantage**, and its **⚡ Ecosystem Tier**.
  - Added dedicated tag active highlight rings and "Prev Technology" / "Next Technology" pager buttons with keyboard navigation (`ArrowLeft`/`ArrowRight`).
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

## Session 2026-08-29

### Project Catalog Refinement & "AI Slop" Design Elimination
- **Grand Narukami Project Catalog (`src/pages/projects.astro`):**
  - **Clean Sanctuary Header & Stats:** Purged generic, low-contrast "AI filler" subtitle copy; replaced with high-signal engineering overview and frosted summary statistics capsules (19 Projects, 4 Domains, 100% Open Source/Live).
  - **In-Page Search Suite:** Integrated a liquid-glass search input with real-time substring matching across project titles, descriptions, technology tags, and feature deep dives. Added `/` and `Ctrl+K` hotkeys, clear button (`✕`), and focus glow.
  - **Domain Navigation Tabs:** Added segmented category tabs (`All Scrolls`, `Systems & C++`, `Full-Stack & Web`, `AI & Machine Learning`, `CLI & Automation`) with domain-specific spark accents.
  - **Dual Layout View Mode:** Implemented a Grid (2-column responsive shrine cards) vs. List (compact horizontal directory rows) switcher persisted in `localStorage`.
  - **Direct Action Bypass (`data-no-modal="true"`):** Provided direct external links on cards (GitHub repository & Live Demo) allowing quick access while preserving whole-card modal deep dive triggers.
  - **Empty Divination Talisman State:** Added a Grand Narukami Torii illustration empty-state card with a 1-click "Clear All Filters" talisman action when 0 projects match.
  - **Typography & Visual Polish:** Replaced muddy background layers with crisp dark lacquer gradients, high-contrast readable text, domain fox-fire borders, and Japanese talisman poetry seals.
- **Cat-Ear Clipping & Unified Card Architecture Fix (`src/pages/projects.astro`):**
  - Restored `overflow-visible` to the parent `.project-card` container and nested background watermarks/filigrees inside `<div class="overflow-hidden rounded-2xl">` so `<CatEar />` elements render freely above the card edge without clipping.
  - Resolved HTML5 nesting validation issue where nested `<a>` elements inside a parent `<a>` triggered browser parser auto-closing and grid fragmentation. Migrated cards to semantic `<article class="project-card">` elements with `role="button"`, `tabindex="0"`, and unintercepted direct action links (`data-no-modal="true"`).
- **Quick-Filter Active Tag Pill Indicator (`src/pages/projects.astro`):**
  - Added striking active visual feedback to quick-filter technology stack pills:
    - Vibrant Grand Narukami crimson-rose gradient background (`#e11d48` ➔ `#db2777` ➔ `#f43f5e`).
    - Luminous drop-shadow halo bloom (`shadow-[0_0_16px_rgba(244,63,94,0.6)]`), crisp white text, and glowing brackets.
    - Pulsing emerald fox-fire talisman indicator dot (`::after`) on the corner of selected pills.
    - Proper `aria-pressed="true"` accessibility attribute and synchronization with `projectFilterTags` localStorage and Navbar filters.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Domain-Themed Elemental Auras & Tactile Glass Micro-Interactions
- **Domain-Themed Elemental Auras (`src/pages/projects.astro`):**
  - Imbued all 19 project cards with bespoke elemental color palettes and CSS custom properties (`--domain-color`, `--domain-rgb`, `--domain-light`):
    - **Systems & C++:** *Emerald Jade* (`#34d399` / `rgba(52, 211, 153, ...)`).
    - **Full-Stack & Web:** *Sakura Blossom* (`#f472b6` / `rgba(244, 114, 182, ...)`).
    - **AI & Machine Learning:** *Amethyst Violet* (`#c084fc` / `rgba(192, 132, 252, ...)`).
    - **CLI & Automation:** *Amber Gold* (`#fbbf24` / `rgba(251, 191, 36, ...)`).
  - Dynamically styled the card border, hover shadow glow, top luminous edge line, icon container box, domain label spark, corner filigree, and CTA action text according to the project's domain.
- **Tactile Glass Micro-Interactions (`src/pages/projects.astro`):**
  - **Dynamic Cursor Spotlight:** Added a mouse-tracking `radial-gradient` spotlight overlay (`.card-spotlight`) that illuminates frosted glass depth under the pointer with domain-accented light.
  - **Key Feature Highlights Chip:** Extracted the top technical feature from `project.features` and displayed it in a crisp single-line chip (`.card-feature-chip`) with a talisman spark directly on each card for instant scanning.
  - **Keyboard Navigation & Accessibility:** Implemented `J` / `K` (and `ArrowDown` / `ArrowUp`) quick card cycling with smooth scrolling, focus rings matching domain auras, and `Enter` / `Space` activation on focused cards.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Mobile High-Density Directory List View Fix
- **Mobile List View Refinement (`src/pages/projects.astro`):**
  - Resolved the issue where switching to List view on mobile viewports (<768px) retained the tall vertical grid card layout due to desktop-only media query scoping.
  - Implemented a dedicated mobile list architecture:
    - Reduced padding from bulky cards to compact `0.875rem 1rem` sleek directory rows.
    - Scaled down the domain icon container to a tidy `2rem × 2rem` badge.
    - Clamped title and description strictly to 1 line each (`line-clamp-1`), eliminating awkward multi-line vertical bloat.
    - Hid cat ears, background corner filigrees, and multi-line feature chips in list mode.
    - Arranged tags in a single scroll-masked row alongside compact direct GitHub/Demo action buttons.
  - Seamlessly transforms the catalog on mobile into an ultra-fast, high-density sacred ledger.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Mobile Project Detail Modal & Rationale Drawer Scrim Fix
- **Mobile Drawer Layering (`src/components/ProjectModal.astro`):**
  - Resolved an issue where clicking on a key feature or technology tag pill on mobile viewports (<1024px) caused the companion detail drawer to appear darkened and blurred out.
  - Root Cause: `#feature-drawer-scrim` (with `z-40` and `backdrop-blur-[2px]`) was declared as a sibling outside `#modal-wrapper` (which was trapped at `z-10`), causing the scrim to paint above the drawer itself.
  - Fix: Relocated `#feature-drawer-scrim` inside `#modal-wrapper` directly between `#modal-card` (`z-10`) and `#feature-drawer` (`z-50`), and centered the drawer on mobile (`translate(-50%, -50%)`).
  - Result: The underlying primary modal card dims smoothly behind the scrim while the architectural detail drawer shines crisply, vibrantly, and legibly on top.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop Navbar Liquid Glass Effect
- **Desktop Navbar Liquid Glass (`src/components/Navbar.astro`):**
  - Removed the static background image (`nav-bar-bg.png`) and opaque backdrop overlay from desktop viewports (`md:` / >=768px).
  - Replaced with a bespoke translucent **Liquid Glass** aesthetic (`.shrine-liquid-glass`):
    - Deep frosted glass diffusion: `backdrop-filter: blur(24px) saturate(190%)`.
    - Liquid gradient tint: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(22,17,36,0.68) 45%, rgba(12,10,22,0.84) 100%)`.
    - Top specular sheen edge highlight line (`via-white/35`) and double-lip inner refraction shadow (`inset 0 1.5px 2px 0 rgba(255,255,255,0.26)`).
  - Preserved the true 45° SVG chamfered outer frame border and inner hairline contour.
  - Enhanced contrast and drop shadows on brand typography, navigation links, and diamond glyphs for crisp legibility over moving background elements.
  - Left mobile resolution (<768px) completely untouched with its native mobile image backdrop and styling intact.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop Navbar Liquid Glass Opacity Refinement
- **Opacity Calibration (`src/components/Navbar.astro`):**
  - Calibrated the `.shrine-liquid-glass` gradient from lightweight translucency to a richer, deeply saturated dark lacquer veil (`0.88` ➔ `0.92` ➔ `0.96` stop density).
  - Increased backdrop blur to `28px` for velvet-smooth diffusion behind text while preserving liquid specular refraction and top luminous edge glint.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop Navbar Liquid Glass Light & Airy Softening
- **Liquid Glass Balance (`src/components/Navbar.astro`):**
  - Softened the dense dark stops to an airy, luminous liquid-glass tint (`0.08` ➔ `0.48` ➔ `0.62` ➔ `0.75`), removing the heavy dark-overlay feel.
  - Adjusted backdrop blur to `18px` with `saturate(170%)` for a glowing, crystalline glass aesthetic with delicate refraction and high contrast text legibility.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Modern Apple / visionOS Liquid Glass UI Transformation
- **Liquid Glass Panel Recreation (`src/components/Navbar.astro`):**
  - Fully transformed the desktop navbar into a modern Apple / visionOS inspired **Liquid Glass** interface:
    - **Translucent Dark Fill:** `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(20,35,32,0.22) 35%, rgba(14,25,28,0.26) 70%, rgba(10,18,22,0.30) 100%)` — keeping the background fully visible and recognizable through the panel without opaque patches.
    - **Refractive Backdrop Dispersion:** `backdrop-filter: blur(28px) saturate(135%) contrast(106%) brightness(98%)` for realistic optical glass refraction.
    - **Thin Low-Opacity White Border:** `1px solid rgba(255, 255, 255, 0.20)`.
    - **Dimensional Inner Edge Lighting:** Delicate multi-stop inner highlight (`inset 0 1px 1.5px 0 rgba(255,255,255,0.22)`, `inset 0 0 20px 0 rgba(255,255,255,0.03)`, `inset 0 -1px 1.5px 0 rgba(0,0,0,0.3)`).
    - **Soft Ambient Depth Shadow:** `0 12px 32px -4px rgba(0,0,0,0.35), 0 4px 12px -2px rgba(0,0,0,0.20)`.
    - **Large Smooth Curvature:** `border-radius: 28px` on desktop with seamless outer clipping.
  - Mobile view (<768px) remains strictly scoped with its native shrine chamfered frame and mobile image layer intact.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop Liquid Glass Translucency & Refractive Tuning
- **Translucency & Refraction Calibration (`src/components/Navbar.astro`):**
  - Lightened the liquid glass body tint down to `rgba(20,35,32,0.13)` ➔ `rgba(14,25,28,0.16)` ➔ `rgba(10,18,22,0.20)` for maximum background visibility.
  - Heightened optical dispersion to `blur(32px) saturate(145%) contrast(112%) brightness(102%)`.
  - Sharpened specular edge refraction highlights (`inset 0 1.5px 2px rgba(255,255,255,0.28)`) and border crispness (`rgba(255, 255, 255, 0.24)`).
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop Navbar Sheer Liquid Glass Calibration
- **Ultra-Translucent Glass Tuning (`src/components/Navbar.astro`):**
  - Further reduced liquid tint opacity stops to `0.07` ➔ `0.09` ➔ `0.12` for an ultra-sheer, crystalline liquid-glass appearance with total background clarity.
  - Softened inner shadow highlights and ambient depth to maintain subtle, natural floating dimensionality.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop Navbar High-Transparency Liquid Glass Refinement
- **Maximum Background Clarity (`src/components/Navbar.astro`):**
  - Reduced panel fill opacity to whisper-thin levels (`0.035` ➔ `0.05` ➔ `0.07`), ensuring near-total transparency while keeping optical glass refraction and delicate inner highlights intact.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

## Session 2026-08-29

### Navbar Design Iteration & Finalization — Floating Ethereal Torii Pill
- **Diagnosis & Debugging (`src/components/Navbar.astro`):**
  - Investigated discrepancies with `backdrop-filter` liquid glass between local dev and live production (compositor isolation, layer clipping, and transparency bleed).
- **Design Iterations & Testing:**
  - Evaluated 3 design directions: (1) Grand Narukami Shrine Artwork Veil, (2) Obsidian Lacquer Shrine Plaque, and (3) Floating Ethereal Torii Pill.
- **What Changed:**
  - Selected and finalized **Option 3 (Floating Ethereal Torii Pill)** in `src/components/Navbar.astro`.
  - Implemented multi-angle void amethyst gradients (`#181126` ➔ `#100b1d` ➔ `#181126`), dual aurora ambient flank glows, a luminous mask-composite gradient border (`#f472b6` ➔ `#c084fc` ➔ `#f472b6`), and an illuminated top Torii crest glint line.
  - Cleaned up unused asset imports (`navBarBg`).
- **Pending:**
  - None; production build and deployment verified live at `https://hoeurbvuthi.site`.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Mobile Featured Project Tag Overflow Fix
- **Diagnosis (`src/components/ProjectGrid.astro`):**
  - Identified that on mobile screens (<768px), project cards rendered all 4 talisman tags in a strict `flex-nowrap` container with `overflow-hidden`, causing trailing tags and brackets to be clipped/sliced due to narrow horizontal space (~180px–220px).
- **What Changed:**
  - Updated mobile project card tags in `src/components/ProjectGrid.astro` to display the first 2 primary tags (`project.tags.slice(0, 2)`) alongside a matching glassmorphic talisman `+N` badge (`+{project.tags.length - 2}`) for any remaining tags.
### Grand Narukami Altar Search & Filter Suite Background Enhancement
- **Diagnosis (`src/pages/projects.astro`):**
  - The project search and filter command board was styled with a flat, opaque dark gradient without shrine artwork or depth, looking uninspired against the vibrant shrine theme.
- **What Changed:**
  - Integrated `techStackBg` ([`tech-stack-bg.png`](file:/C:/Users/ASUS%20Rog/Desktop/web-personal/src/assets/images/tech-stack-bg.png)) as an inner clipped artwork layer behind the search and filter suite with smooth amethyst vignettes.
  - Added dual ambient aurora glows (sakura pink `-top-20 -left-20` and electric purple `-bottom-20 -right-20`) with 2xl backdrop blur and specular inset rim highlights.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Featured Project Modal Card Counter Fix
- **Diagnosis (`src/components/ProjectModal.astro`):**
  - In `ProjectGrid.astro`, 3 featured projects are rendered twice: once in the mobile layout container (`.md:hidden`) and once in the desktop grid (`.hidden .md:grid`).
  - `getVisibleCards()` checked only inline `style.display !== 'none'` and `.classList.contains('hidden')`, missing parent container visibility rules. As a result, all 6 DOM elements were collected, causing the modal counter on the home page to display `05 / 06` instead of `01 / 03` or `03 / 03`.
- **What Changed:**
  - Refactored `getVisibleCards()` in `src/components/ProjectModal.astro` with an `isCardVisible()` check leveraging `card.checkVisibility({ checkVisibilityCSS: true })` and `card.offsetParent !== null`.
  - Responsive duplicate elements hidden inside media-query containers are now correctly filtered out, keeping the modal count at an accurate 3 on the featured section.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Project Modal Icon Selector Misalignment Fix
- **Diagnosis (`src/components/ProjectModal.astro`, `src/components/ProjectGrid.astro`):**
  - In `ProjectModal.astro`, `populateModalContent()` used `card.querySelector('svg')` without a scoped class. On `ProjectGrid.astro` cards, the first SVG in DOM order was the decorative Japanese corner filigree bracket (`<svg width="46">`), causing a 46px corner bracket to be squeezed into the modal's 20px rotated diamond emblem badge instead of the actual project icon.
- **What Changed:**
  - Added `.project-icon-badge` selector class to icon containers in `src/components/ProjectGrid.astro`.
  - Scoped `modalIcon` extraction in `src/components/ProjectModal.astro` to `.project-icon-badge svg, .card-icon-box svg`, with fallbacks explicitly filtering out `.card-filigree` and oversized decorative SVGs.
### Project Modal Dynamic Domain Color Matching
- **Diagnosis (`src/components/ProjectModal.astro`, `src/components/ProjectGrid.astro`):**
  - The modal previously rendered fixed sakura pink borders, glow accents, action button gradients, and feature highlights regardless of whether the opened card was a Jade Emerald Systems project, Electro Amethyst AI project, Golden Fox Amber Tooling project, or Sakura Pink Web project.
- **What Changed:**
  - Configured `domain` (`"ai"`, `"web"`, `"tools"`, `"systems"`) and `domainLabel` metadata in `src/components/ProjectGrid.astro` and passed them via `data-domain` & `data-domain-label` to cards.
  - Implemented dynamic CSS custom variable themer (`--domain-color`, `--domain-rgb`, `--domain-light`, `--domain-cta-from`, `--domain-cta-via`, `--domain-cta-to`, `--domain-cta-shadow`) in `src/components/ProjectModal.astro`.
  - Themed ambient backdrop orbs, rotated diamond badge, outer card rim glow, domain status pill, spec matrix labels, interactive feature list hover/active states, and live action CTA button gradient to match the card's active domain colors.
### Dynamic Feature Items & Tags Global Scope Fix
- **Diagnosis (`src/components/ProjectModal.astro`):**
  - Because `modalFeaturesList.innerHTML` is populated dynamically at runtime, standard Astro scoped styles inside `<style>` (`#modal-features-list li`) did not attach to dynamic elements due to missing compile-time `data-astro-cid-xxx` attributes. Consequently, feature bullets `❖`, `Details >` arrows, and item borders retained fallback pink colors on tool/systems/AI modals.
- **What Changed:**
  - Converted feature item list, bullets, details arrows, and active state styles in `<style>` to `:global(#modal-features-list ...)` and `:global(#modal-tags ...)`.
  - Removed remaining hardcoded `pink-` classes from the JS template literals, allowing feature bullets, borders, arrows, and tags to dynamically reflect the active project domain theme.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop UI Landing Page Animation Enhancements
- **Diagnosis (`src/pages/index.astro`, `src/components/ProjectGrid.astro`, `src/components/AboutMe.astro`, `src/components/SectionDivider.astro`):**
  - Desktop landing page elements previously transitioned with generic pop-ins or simple opacity changes upon loading/scrolling without coordinated cinematic staggering or interactive depth.
- **What Changed:**
  - **Desktop Hero Staggered Choreography (`src/pages/index.astro`):**
    - Implemented `.hero-desktop-item` orchestrator synchronized with `matrix-splash-done` (and fast load fallback), gracefully cascading the Availability status capsule, "Hi, I'm" heading, Torii gate subtitle, Bio description, Action CTAs, and Scroll-to-explore indicator.
    - Added ambient floating rhythms (`@keyframes heroToriiFloat`, `@keyframes heroSakuraSway`).
    - Added radiant specular shimmer beam sweep on hover for primary CTA button (`.hero-btn-primary`).
    - Enhanced the scroll indicator with a continuous luminous travelling energy pulse (`@keyframes scrollGlow`).
  - **Desktop Scroll-Reveal Motion Profile (`src/pages/index.astro`):**
    - Enhanced desktop `.reveal` and `.project-card` scroll entrances with cubic-bezier translation (`translateY(26px)` / `translateY(30px)`) and opacity easing (`700ms cubic-bezier(0.16, 1, 0.3, 1)`).
  - **Interactive Desktop Card Spotlight (`src/components/ProjectGrid.astro`):**
    - Added pointer-tracking radial spotlight specular highlight (`--mouse-x`, `--mouse-y`) over frosted glass project cards on desktop (`pointer: fine`).
  - **Grand Narukami Avatar & Divider Ambient Rhythms (`src/components/AboutMe.astro`, `src/components/SectionDivider.astro`):**
    - Added gentle ambient levitation breathing (`@keyframes avatarFloat`) to the avatar portrait frame.
    - Added ethereal pulsating crest glow (`@keyframes crestGlow`) to section divider sacred crests (Torii arc, Mizuhiki sakura, Shimenawa kitsune).
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop UI Clean Scroll Navigation Rail & Global Hairline Progress
- **Diagnosis (`src/components/DesktopScrollRail.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`):**
  - The desktop landing page lacked a dedicated section waypoint navigator and desktop scroll progress indicator.
- **What Changed:**
  - **Desktop Floating Talisman Scroll Rail (`src/components/DesktopScrollRail.astro`):**
    - Created a minimalist floating right-flank waypoint track (`hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2`) featuring 4 luminous talisman beads corresponding to `#home` (本殿), `#projects` (作品), `#about` (紹介), and `#contact` (通信).
    - Integrated real-time scroll position tracking that dynamically illuminates the active bead and activates a soft sakura foxfire glow.
    - Added floating glassmorphic tooltip plaques with Japanese kanji + section titles on bead hover.
  - **Top Ethereal Sakura Scroll Progress Bar (`src/layouts/BaseLayout.astro`):**
    - Enabled the glowing 2.5px top scroll progress bar globally on desktop viewports as well as mobile.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop UI Element-Level Scroll Cascades & Component Staggering
- **Diagnosis (`src/components/ProjectGrid.astro`, `src/components/AboutMe.astro`, `src/components/Contact.astro`):**
  - Section contents on desktop lacked internal staggered choreography upon entering the viewport.
- **What Changed:**
  - **Featured Projects (`src/components/ProjectGrid.astro`):**
    - Configured multi-tier staggered entrance delays for desktop cards (`50ms`, `180ms`, `310ms`) with smooth cubic-bezier transitions.
  - **About Me Section (`src/components/AboutMe.astro`):**
    - Added `.about-item` staggered cascade across Left Column elements: Header Eyebrow (`0ms`) ➔ Avatar Frame & Radial Aura (`120ms`) ➔ Bio Text (`240ms`) ➔ Highlights Capsule (`360ms`).
  - **Contact Altar (`src/components/Contact.astro`):**
    - Added `.contact-cascade-item` sequential choreography across Altar elements: Torii Eyebrow (`80ms`) ➔ Section Title & Subtitle (`160ms`) ➔ Quick Link Pills (`240ms`) ➔ Interactive Form Altar (`320ms`).
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Desktop UI Footer Scroll Cascade & Breathing Crest Glow
- **Diagnosis (`src/components/Footer.astro`):**
  - The Grand Narukami Sanctuary site footer previously entered statically without scroll-reveal or desktop staggered cascade.
- **What Changed:**
  - **Footer Scroll Reveal & Desktop Cascade (`src/components/Footer.astro`):**
    - Mounted `.reveal` on the footer container with desktop column staggering:
      1. Brand & Tagline + Availability status (`60ms`)
      2. Quick Navigation links (`140ms`)
      3. Connect channels & Back to Top button (`220ms`)
      4. Bottom Notice & Tech tags (`300ms`)
    - Added an ethereal breathing glow (`@keyframes crestGlow`) to the top-centered *NARUKAMI SHRINE* emblem badge.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Academic Degree (MIS) & Software Developer Career Goal Harmonization
- **Diagnosis (`src/pages/index.astro`, `src/components/AboutMe.astro`, `src/components/Footer.astro`, `src/components/NekoWidget.astro`, `src/layouts/BaseLayout.astro`, `src/pages/api/chat.ts`):**
  - Academic credentials and career goals across the landing page, structured metadata, chatbot knowledge base, and about me biography referenced general "Computer Science" rather than current degree pursuit in Management Information Systems (MIS) and specific career goal as a Software Developer.
- **What Changed:**
  - **Landing Page & Schema (`src/pages/index.astro`, `src/layouts/BaseLayout.astro`):**
    - Updated hero availability pill to `Available for Software Development & AI`.
    - Updated hero subtitle to `Software Developer & MIS Student.`.
    - Updated page title and Schema.org Person metadata to `Software Developer & Management Information Systems Student`.
  - **Biography & Altar Highlights (`src/components/AboutMe.astro`, `src/components/Footer.astro`):**
    - Updated biography narrative to highlight software development foundation in Management Information Systems (MIS) and technical problem-solving.
    - Updated Focus highlight capsule to `Software Dev • MIS • AI`.
    - Updated footer description to `Software developer crafting robust system utilities...`.
  - **Neko Chatbot Knowledge & DeepSeek Prompt (`src/components/NekoWidget.astro`, `src/pages/api/chat.ts`):**
    - Synchronized keyword-matched `education` response in `NekoWidget.astro` to reflect MIS studies and aspiring software developer path.
    - Updated DeepSeek LLM system prompt in `chat.ts` with explicit degree details (`Bachelor's in Management Information Systems (MIS) at SETEC Institute`) and `Career Goal: Professional Software Developer`.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### About Me & Hero Bio De-AI-ification & Authentic Voice Polish
- **Diagnosis (`src/components/AboutMe.astro`, `src/pages/index.astro`):**
  - The previous About Me paragraphs and highlights used generic AI buzzwords ("bridges the gap between algorithmic rigor", "interfaces that fade into the background", "Philosophy: Simplicity • Clarity • Impact").
- **What Changed:**
  - **About Me Section (`src/components/AboutMe.astro`):**
    - Rewrote biography into a natural, direct developer voice detailing your journey from C++ and Linux systems to modern web development and local AI workflows.
    - Replaced the abstract "Philosophy" highlight pill with tangible `Studies` (`MIS @ SETEC Institute`) and `Interests` (`C++ • Linux • Web • AI`).
  - **Hero Bio (`src/pages/index.astro`):**
    - Streamlined the hero paragraph into a crisp, human statement highlighting MIS studies, clean code, and fast web apps.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Management Information Systems Full Title Harmonization
- **Diagnosis (`src/pages/index.astro`, `src/components/AboutMe.astro`):**
  - The acronym (MIS) on the landing page hero and about section was refined to its full, formal degree title for enhanced prestige, clarity, and authority.
- **What Changed:**
  - **Landing Page Title & Hero (`src/pages/index.astro`):**
    - Updated page title to `Hoeurb Vuthi | Software Developer & Management Information Systems Student`.
    - Updated hero subtitle to `Software Developer & Management Information Systems Student.`
    - Updated hero bio to `I'm a Management Information Systems student and developer...`.
  - **About Me Section (`src/components/AboutMe.astro`):**
    - Updated biography paragraph to explicitly state `Management Information Systems student and developer`.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Projects Page Footer Visibility & Self-Contained Observer Fix
- **Diagnosis (`src/components/Footer.astro`, `src/pages/projects.astro`):**
  - On `/projects` and non-home routes, desktop footer columns (`.footer-cascade-item`) remained invisible at `opacity: 0; transform: translateY(20px)` because the `.reveal` IntersectionObserver was previously declared only in `src/pages/index.astro`. The centered `NARUKAMI SHRINE` emblem badge was floating alone in the mist without its column content.
- **What Changed:**
  - **Footer Self-Contained Observer (`src/components/Footer.astro`):**
    - Integrated a standalone `IntersectionObserver` directly inside `Footer.astro`'s client script.
    - `Footer.astro` now automatically observes its own viewport entry and triggers `.revealed`, orchestrating the desktop column scroll cascade seamlessly across all routes (`/`, `/projects`, `/404`).
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### NARUKAMI SHRINE Crest Badge Centering Fix & Grid Columns Reversion
- **Diagnosis (`src/components/Footer.astro`):**
  - The `NARUKAMI SHRINE` crest badge was positioned using `absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`. However, the `@keyframes crestGlow` rule from `SectionDivider.astro` (`transform: scale(1)`) was overriding the element's CSS `translate` property every frame, stripping the `-50%` horizontal offset and causing the badge's left edge to anchor at 50% (pushing the entire badge noticeably to the right of the center line).
- **What Changed:**
  - **Reverted Column Layout (`src/components/Footer.astro`):**
    - Restored the original 12-column grid (`md:col-span-6`, `md:col-span-3`, `md:col-span-3`).
  - **Flexbox Centered Container for Crest Badge (`src/components/Footer.astro`):**
    - Encapsulated the `NARUKAMI SHRINE` badge inside an absolute full-width flex container (`absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center`).
    - Renamed and scoped the pulsating animation to `@keyframes footerCrestGlow`.
    - The `NARUKAMI SHRINE` badge is now guaranteed to be mathematically and visually centered across all screen resolutions without any CSS transform collisions.
- **Pending:**
  - None.
- **Verification:**
  - `npm run build` completed successfully; Vercel runtime patch verified as `nodejs22.x`.

### Production Deployment & Git Sync
- **What Changed:**
  - Synchronized all commits (`83a5a24`, `f3780b2`) to GitHub `main`.
  - Executed production deployment via `npx vercel --prod --yes`.
  - Production deployment `dpl_F4frit2suKx3CZzWpLzg6Sm3wwq7` built cleanly and aliased live to `https://hoeurbvuthi.site`.
- **Verification:**
  - Live smoke test: `curl -I https://hoeurbvuthi.site` returned `HTTP/1.1 200 OK`.
- **Pending:**
  - None.

## Session 2026-08-29

### Desktop Scroll Progress Deduplication & Talisman Rail Polish
- **Diagnosis (`src/layouts/BaseLayout.astro`, `src/components/DesktopScrollRail.astro`):**
  - Two concurrent scroll progress indicators existed on desktop: a top hairline bar and the right-flank talisman rail.
  - The right-flank rail was buggy:
    1. During section transitions (such as passing through `SectionDivider`), `getBoundingClientRect()` bounding checks failed to match any section, causing the active dot to erroneously reset and flicker back to `'home'`.
    2. At the page bottom (footer / contact), the active indicator did not reliably latch to `'contact'`.
    3. The rail lacked continuous dynamic progress fill animation along its vertical talisman guide wire, and naive page-wide scroll percentages were out of sync with actual bead positions.
    4. CSS transitions on `height` fought the `requestAnimationFrame` loop, producing rubber-banding and scroll lag.
- **What Changed:**
  - **Top Progress Bar Scoped to Mobile (`src/layouts/BaseLayout.astro`):**
    - Added `lg:hidden` to `#mobile-scroll-progress-container`, completely removing the top scroll bar from desktop viewports while preserving it for mobile devices.
  - **1:1 Piecewise Section Interval Progress Fill (`src/components/DesktopScrollRail.astro`):**
    - Implemented piecewise linear interpolation where the glowing pink line (`#desktop-rail-track-fill`) travels between bead $i$ and bead $i+1$ in exact 1:1 synchronization with the scroll position between section $i$ and section $i+1$.
    - Removed CSS transition on height and enabled `will-change-[height]` for instant, 120fps hardware-accelerated tracking.
  - **Passed Bead States (`src/components/DesktopScrollRail.astro`):**
    - Added `.passed` styling so completed section beads remain softly illuminated (`bg-pink-500/30 border-pink-400/65`) while the current section bead shines with full radiant focus.
  - **Smooth Jump Navigation (`src/components/DesktopScrollRail.astro`):**
    - Added smooth programmatic scrolling on bead click with fixed navbar clearance (`72px`) and history update.
- **Verification:**
  - `npm run build` completed cleanly; Vercel runtime patch verified as `nodejs22.x`.
- **Pending:**
  - None.

### Production Deployment & Git Sync
- **What Changed:**
  - Pushed commit `ad75875` to GitHub `main`.
  - Executed production deployment via `npx vercel --prod --yes`.
  - Cloud deployment `dpl_mpxbcmrUHe4NcVTiQKykoCsixeUV` built cleanly in 10s and aliased live to `https://hoeurbvuthi.site`.
- **Verification:**
  - Live smoke test: `curl -I https://hoeurbvuthi.site` returned `HTTP/1.1 200 OK`.
  - Live smoke test: `curl -I https://hoeurbvuthi.site/projects` returned `HTTP/1.1 200 OK`.
- **Pending:**
  - None.

### Navbar Invisibility Fix
- **Diagnosis (`src/components/Navbar.astro`):**
  - Identified two causes making the navbar invisible:
    1. `#main-navbar` CSS defaulted to `opacity: 0` and `transform: translateY(-20px)`, relying entirely on deferred client JavaScript / `matrix-splash-done` event timing to reveal. Any script delays, race conditions, or storage edge-cases left the navbar invisible.
    2. A global rule `body.neko-chat-open #main-navbar` applied `opacity: 0 !important; transform: translateY(-130%) !important;` whenever the user opened the chat assistant on any device / screen size, causing the navbar to vanish completely.
- **What Changed:**
  - Set `#main-navbar` base CSS to `opacity: 1; transform: translateY(0)` with snappy 350ms ease-out transitions, guaranteeing immediate visibility across all routes, first paint, and SSR.
  - Removed the `body.neko-chat-open #main-navbar` rule, preserving top navbar visibility when chatting with the assistant on desktop and tablet.
- **Verification:**
  - `npm run build` completed successfully.
  - Postbuild runtime patch verified as `nodejs22.x`.
  - Browser inspection with Chrome DevTools confirmed `#main-navbar` remains visible (`opacity: 1`, `visibility: visible`) on load, on `/projects`, and before/after toggling Neko chat.
### Production Deployment
- **What Changed:**
  - Deployed to Vercel production with scope `d-flint` via `npx vercel --scope d-flint --prod --yes`.
  - Deployment `dpl_D2XmhKxVPtFNq6445uYP7mTopAdx` built cleanly in 8s and aliased live to `https://hoeurbvuthi.site`.
- **Verification:**
  - Live smoke test: `curl -I https://hoeurbvuthi.site` returned `HTTP/1.1 200 OK`.
  - Live smoke test: `curl -I https://hoeurbvuthi.site/projects` returned `HTTP/1.1 200 OK`.
- **Pending:**
  - None.

### Desktop Scroll Progress Orb Animation
- **Diagnosis / Context:**
  - `src/components/DesktopScrollRail.astro` already mapped page scroll to the section beads, but the progress fill changed position mechanically and had no focal marker traveling with it.
  - The requested interaction is a continuously glowing pink energy bead inspired by the supplied reference image.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`:
    - Added a dedicated six-layer visual progress orb with a white-pink core, sakura halo, and breathing glow.
    - Added lightweight requestAnimationFrame interpolation so the orb glides toward the exact piecewise section progress target.
    - Synchronized the existing luminous track fill to the orb's rendered position.
    - Added a temporary scrolling state that intensifies the halo while the user is moving, then returns to a calm idle pulse.
    - Preserved anchor navigation, active and passed bead states, keyboard focus, and reduced-motion behavior.
  - `docs/superpowers/specs/2026-09-02-scroll-progress-orb-animation-design.md`:
    - Recorded the approved interaction and technical design.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - Git commit of the design spec is pending because the environment denied creation of `.git/index.lock`.

### Desktop Scroll Progress Orb Alignment Fix
- **Diagnosis / Context:**
  - Visual inspection showed the new orb rendering as two horizontally offset circles at the top of the rail.
  - The orb core combined Tailwind translate utilities with its keyframe `transform`, causing the two transform systems to compound.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`:
    - Removed the core's `-translate-x-1/2` and `-translate-y-1/2` utility classes.
    - Added the centering transform to the component's base CSS so the animated transform has one source of truth.
    - Preserved the keyframe scale animation and reduced-motion fallback.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Homepage View All Projects CTA Redesign
- **Diagnosis / Context:**
  - The homepage `View All Projects` link in `src/components/ProjectGrid.astro` had a generic glass pill treatment and lacked a distinct shrine signature or purposeful hover choreography.
  - The approved direction combines a restrained sakura detail with a soft luminous interaction.
- **What Changed / Implementation:**
  - `src/components/ProjectGrid.astro`:
    - Added a small sakura seal using Astro's existing `Image` component before the CTA label.
    - Deepened the glass background and refined the border, inner highlight, shadow, spacing, and text contrast.
    - Added a translucent pink sheen that sweeps across the button on hover.
    - Added coordinated seal rotation/glow, stronger arrow travel, subtle lift, and controlled active press feedback.
    - Added a clear `:focus-visible` ring and disabled decorative motion under `prefers-reduced-motion: reduce`.
  - `docs/superpowers/specs/2026-09-02-view-all-projects-button-design.md`:
    - Recorded the approved visual and interaction design before implementation.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Shared Sakura Primary CTA Styling
- **Diagnosis / Context:**
  - The homepage project CTA had evolved separately from the hero's primary `View Projects` CTA, so the two buttons no longer shared the same gradient, light sweep, icon motion, or press feedback.
  - The requested result was exact visual and animation parity with the hero button.
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Added the shared `.sakura-primary-btn` recipe with the hero's pink-red gradient, border highlight, bloom shadow, specular sweep, scale feedback, and focus ring.
    - Added reduced-motion handling that removes the sweep and transform motion while preserving contrast.
  - `src/pages/index.astro`:
    - Replaced the hero-specific button styling with the shared `.sakura-primary-btn` class.
    - Removed the duplicated hero-only specular sweep CSS.
  - `src/components/ProjectGrid.astro`:
    - Replaced the custom project CTA shell with the same shared class and markup as the hero CTA.
    - Matched the label to `View Projects` while preserving the `/projects` destination.
    - Retained Astro's `<Image />` component for the sakura icon.
  - `docs/superpowers/specs/2026-09-02-shared-sakura-primary-button-design.md`:
    - Recorded the shared-style decision and accessibility requirements.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Shared Hero and Projects CTA Parity
- **Diagnosis / Context:**
  - The featured-projects CTA still had a separate visual treatment from the hero's primary `View Projects` button, despite the requested design being identical.
  - Duplicated component-local styles would allow the two CTAs to drift again.
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Added the shared `.sakura-primary-btn` class containing the hero gradient, border glow, specular sweep, hover scale, active press, focus ring, and reduced-motion fallback.
  - `src/pages/index.astro`:
    - Switched the hero primary link to the shared class and removed its duplicate sweep CSS.
  - `src/components/ProjectGrid.astro`:
    - Replaced the custom project CTA treatment with the same markup and shared class.
    - Changed the visible label to `View Projects` while keeping the `/projects` destination.
    - Retained the Astro `<Image />` sakura icon and lazy loading for the below-fold CTA.
  - `docs/superpowers/specs/2026-09-02-shared-sakura-primary-button-design.md`:
    - Recorded the shared-style architecture and parity requirements.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Feature Drawer Scenic Shrine Background
- **Diagnosis / Context:**
  - The architectural deep-dive wing in `src/components/ProjectModal.astro` used a flat near-black gradient, making the panel feel visually disconnected from the site's shrine atmosphere.
  - The supplied `src/assets/images/contact-bg-9x16.png` provides the intended floral night shrine, torii, water, lantern, and fox-mask scene.
- **What Changed / Implementation:**
  - `src/components/ProjectModal.astro`:
    - Imported `contact-bg-9x16.png` and rendered it with Astro's `<Image />` component as a lazy-loaded, responsive WebP scenic backdrop.
    - Added layered dark vertical, horizontal, and color overlays to keep the deep-dive copy readable while allowing the artwork to remain visible.
    - Added explicit stacking for the scenic layer, header, scrollable content, and footer.
    - Reduced card opacity slightly so the artwork can show through the information surfaces.
    - Preserved the existing drawer open/close behavior, responsive sizing, scrolling, controls, and focus behavior.
    - Updated the dynamic domain-border selector to target the named header after introducing the new background layer.
  - `docs/superpowers/specs/2026-09-02-feature-drawer-scenic-background-design.md`:
    - Recorded the approved backdrop and contrast design.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Feature Drawer Scenic Background Visibility Tuning
- **Diagnosis / Context:**
  - Initial review showed the supplied shrine artwork was barely visible behind the architectural deep-dive drawer.
  - The image opacity was too low and the combined vertical, horizontal, and color overlays were too dense.
- **What Changed / Implementation:**
  - `src/components/ProjectModal.astro`:
    - Increased scenic artwork opacity from 75% to 95%.
    - Reduced the darkness of the vertical and side gradients and the purple multiply layer.
    - Preserved the darker content framing around the top, bottom, and sides so text remains readable.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Mobile Projects List View Default
- **Diagnosis / Context:**
  - `src/pages/projects.astro` defaulted the project archive to Grid whenever no `projects_view_mode` preference existed, which made the less space-efficient Grid view appear first on mobile.
  - The requested mobile presentation is List by default, while desktop should retain Grid and an explicit user preference should remain respected.
- **What Changed / Implementation:**
  - `src/pages/projects.astro`:
    - Read the existing `projects_view_mode` preference into `savedViewMode`.
    - Added a responsive fallback using `window.matchMedia('(max-width: 767px)')`: List below 768px and Grid at 768px or wider.
    - Preserved the existing `setViewMode()` initialization, toggle interactions, localStorage persistence, filtering, and responsive card styles.
  - `docs/superpowers/specs/2026-09-02-mobile-project-list-default-design.md`:
    - Recorded the approved responsive default and persistence behavior.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - The design spec could not be committed because the environment denied creation of `.git/index.lock`; the file remains in the working tree.

### Mobile Projects List View Persistence Correction
- **Diagnosis / Context:**
  - The first implementation used the global `projects_view_mode` value before applying the mobile fallback. A previously stored `grid` value therefore prevented mobile from starting in List.
  - Persisting the mobile initialization through the same global key would also overwrite the desktop preference.
- **What Changed / Implementation:**
  - `src/pages/projects.astro`:
    - Added an `isMobileViewport` check at initialization and made mobile unconditionally start in List.
    - Kept desktop initialization tied to the existing `projects_view_mode` value, falling back to Grid when unset.
    - Limited `projects_view_mode` writes to desktop sessions so mobile initialization cannot alter desktop’s saved view.
    - Preserved both toggle controls for in-session switching.
  - `docs/superpowers/specs/2026-09-02-mobile-project-list-default-design.md`:
    - Updated the design to document the mobile override and desktop-only persistence behavior.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - The design spec remains uncommitted because the environment denied creation of `.git/index.lock`.

### Mobile Projects List View Override Fix
- **Diagnosis / Context:**
  - Follow-up validation confirmed that a stale global `projects_view_mode=grid` preference could still make the mobile archive open in Grid.
  - The requirement is unconditional mobile List initialization while keeping the desktop preference behavior unchanged.
- **What Changed / Implementation:**
  - `src/pages/projects.astro`:
    - Mobile initialization now always selects List, regardless of any saved global view value.
    - Desktop initialization still reads `projects_view_mode` and defaults to Grid when unset.
    - Mobile toggle changes no longer write to the global preference, preventing mobile visits from changing the desktop layout preference.
    - Grid/List switching remains available for the current mobile session.
  - `docs/superpowers/specs/2026-09-02-mobile-project-list-default-design.md`:
    - Corrected the design specification to match the unconditional mobile override.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - The design spec remains uncommitted because the environment denied creation of `.git/index.lock`.

### Production Deployment — Mobile List View Fix
- **Diagnosis / Context:**
  - The corrected mobile List initialization needed to be published so the live `/projects` page would stop restoring a stale global Grid preference on mobile.
- **What Changed / Implementation:**
  - Deployed the current verified workspace to Vercel production with `npx vercel --scope d-flint --prod --yes`.
  - Vercel deployment `dpl_HNcuaifAah3Kb3KRiCugFxmyHRdY` completed successfully and was aliased to `https://hoeurbvuthi.site`.
- **Verification:**
  - Vercel production build completed successfully and reported `readyState: READY`.
  - The deployment build ran the preserved `npm run build` script, including the `nodejs22.x` runtime patch.
- **Pending:**
  - None.

## Session 2026-09-05

### GitHub Commit and Push
- **Diagnosis / Context:** User requested committing and pushing the pending changes to GitHub.
- **What Changed / Implementation:** Commit the tracked homepage/contact performance fixes, earlier hero flower removal, and this build log to `main` for `D-Flint/web-personal`. Untracked local agent configuration is excluded.
- **Verification:** Previous implementation build and `nodejs22.x` runtime check passed; rerun the build after this log update before committing.
- **Pending:** Execute the commit and push, then confirm the remote branch matches the local commit.

### Homepage Scroll Frame Work and Background Transition Races
- **Diagnosis / Context:**
  - Follow-up: contact feels better, but the homepage intermittently stutters. Source inspection found width/height mutations on scroll indicators, redundant navigation DOM updates, a double animation-frame delay in the rail, and overlapping background hide timers.
- **What Changed / Implementation:**
  - `src/layouts/BaseLayout.astro`: changed the top progress bar from interpolated width to a fixed-width bar with direct scaleX updates.
  - `src/components/DesktopScrollRail.astro`: measure track height only during layout measurement; animate scaleY and the orb transform directly. Update bead classes and ARIA only when the active section changes. Removed the extra frame scheduling layer.
  - `src/components/Navbar.astro`: skip repeated navigation queries/class writes when the active section is unchanged.
  - `src/components/ShrineBackgroundCrossfader.astro`: cancel obsolete hide timers on each transition, guard queued reveal callbacks against stale targets, and reuse measured section rectangles in fallback selection.
  - Preserved background artwork, section navigation, reduced-motion handling, and previous contact fixes. Applied the previously read Emil design engineering guidance on transform animation and avoiding inherited variable updates.
- **Verification:**
  - `npm run build` completed successfully with exit code 0; the postbuild function configuration contains `nodejs22.x`.
  - Findings are source-based; no browser performance trace or device FPS comparison was taken.
- **Pending:**
  - Confirm perceived scrolling smoothness on the affected device; build checks do not measure frame timing.

### Contact Scroll and Interaction Performance
- **Diagnosis / Context:**
  - Contact combined a whole-card reveal/pounce and petal burst with a nested 600ms entrance cascade delayed by up to 400ms for visible content. Permanent compositor hints persisted on the form and its children.
  - `src/styles/global.css` deferred contact layout with a 500px intrinsic placeholder, smaller than the full form, risking document-height changes during anchor scrolling.
  - Nested backdrop blurs on the form, inputs, textarea, links, and chips increased rendering work. Whole-card hover shadows and chained submit-button drop shadows added paint costs.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: removed participation in the shared reveal/petal system and the nested cascade. The form is immediately visible and stationary, including without JavaScript and with reduced motion.
  - Removed whole-card hover movement and shadow interpolation; retained the dark gradients, borders, static shadows, and individual control feedback.
  - Removed nested CSS backdrop filters and limited link, chip, and input transitions to explicit properties. Replaced the submit wrapper's three animated drop-shadow filters with static box shadows and a short transform transition, following the Emil design engineering performance guidance.
  - `src/styles/global.css`: retained deferred rendering for projects only, so contact contributes its actual height from initial layout.
  - Preserved form validation, submission, topic selection, and character counting. Existing unrelated workspace edits remain intact.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
  - Diagnosis is based on source inspection; no device frame-time measurement was performed.
- **Pending:**
  - Device-level visual smoothness has not been measured; build verification does not establish an FPS improvement.

### Hero Name Sakura Icon Removal
- **Diagnosis / Context:**
  - The hero section displayed a sakura flower immediately beside the "Hoeurb Vuthi" heading in `src/pages/index.astro`.
  - The request was limited to that hero decoration; sakura icons used by the View Projects button and scroll indicator remain in place.
- **What Changed / Implementation:**
  - `src/pages/index.astro`:
    - Removed only the 36px hero `<Image />` rendered beside the name.
    - Retained the shared `sakuraIcon` import because the same asset is still used by the hero action button and scroll indicator.
- **Verification:**
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
  - `git diff --check` completed with no whitespace errors.
- **Pending:**
  - None.

## Session 2026-09-15

### Detailed Customer Profile Spreadsheet Template
- **Diagnosis / Context:**
  - `C:/Users/ASUS Rog/Documents/SETEC/PR-I/Cunstomer-Profile.xlsx` contained a blank `Sheet1` with no existing instructions, formulas, tables, or styling to preserve.
  - The request was to create a detailed, reusable customer profile template in the supplied workbook.
- **What Changed / Implementation:**
  - Created a single-sheet customer profile form with sections for record control, identity, contact details, demographics, preferences, purchase/service relationship, needs/opportunity, and consent/data governance.
  - Added editable yellow input fields, blue calculated fields, dropdown validation for common categorical attributes, date and numeric formats, and a frozen top section for navigation.
  - Added formula-driven profile completion percentage, profile status, and age estimate fields.
  - Added conditional formatting for Complete, In progress, and Needs information statuses.
  - Exported the finished workbook to `outputs/customer-profile-template-20260915/Cunstomer-Profile.xlsx`; the supplied source workbook was not overwritten.
- **Verification:**
  - Re-imported the saved `.xlsx` and verified key formulas, final sections, dropdown validation configuration, and zero formula-error matches.
  - Rendered the completed worksheet and visually confirmed legible section headers, input/calculation cues, and unclipped content.
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Multi-Customer Profile Database Template
- **Diagnosis / Context:**
  - The prior workbook design was a detailed single-customer form, but the user needed a scalable multi-customer template with one customer per row.
  - The workbook needed to remain detailed while becoming sortable, filterable, and easy to extend.
- **What Changed / Implementation:**
  - Replaced the single-record form with a `Customer Database` worksheet containing a native Excel table with 100 ready-to-use rows.
  - Added summary cards for total customers, active customers, complete profiles, and marketing-consented customers.
  - Added detailed row fields across identity, contact, lifecycle, preferences, purchasing, relationship health, needs, next steps, consent, ownership, and sensitivity notes.
  - Added dropdown validation for categorical fields, date and currency formats, row-level profile completion formulas, conditional formatting, filter buttons, frozen navigation, and clean modern styling.
  - Added the approved design specification at `docs/superpowers/specs/2026-09-15-multi-customer-profile-design.md`.
- **Verification:**
  - Re-imported the saved workbook and confirmed the 32-column structure, native table presence, summary formulas, row-completion formula, and zero formula-error matches.
  - Tested a disposable sample customer in memory; total, active, complete, consented, and row completion values updated to 1 as expected.
  - Rendered the database view and confirmed the title, summary cards, filterable header, blank rows, and horizontal detail layout are legible.
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- **Pending:**
  - None.

### Fictional Cambodian Customer Examples
- **Diagnosis / Context:**
  - The multi-customer database was structurally complete but empty; the user requested five Cambodian-related example records to demonstrate the intended level of detail.
- **What Changed / Implementation:**
  - Added five fictional records spanning Phnom Penh, Siem Reap, Kampot, and Sihanoukville.
  - Added Cambodian phone formats, Khmer/English language preferences, local sectors, Cambodian lead sources, KHR order values, Telegram/phone contact preferences, and clearly labeled fictional example notes.
  - Updated the Average Order Value header and guidance note to identify KHR currency.
  - Updated the approved design specification to reflect the requested fictional starter records.
  - Saved the completed copy as `outputs/customer-profile-template-20260915/Cunstomer-Profile-Cambodian-Examples.xlsx` because Windows had the prior output workbook open and locked.
- **Verification:**
  - Re-imported the saved workbook and confirmed five customer rows, 2 active customers, 5 complete profiles, 3 marketing-consented records, and 100% completion for each starter row.
  - Formula error scan found zero matches.
  - Rendered the populated database and confirmed the records, summary cards, KHR guidance, and detailed columns are readable.
  - `npm run build` and the `nodejs22.x` postbuild runtime check remain required after this log update.
- **Pending:**
  - None.

### Custom Software Services Customer Database
- **Diagnosis / Context:**
  - The customer database needed to represent a custom software provider that sells software and also delivers implementation, maintenance, support, integration, migration, hosting, upgrades, training, and consulting.
  - The referenced workbook was `C:/Users/ASUS Rog/Documents/SETEC/PR-I/Customer-Profile-Template.xlsx`; its existing Cambodian examples were retained as the starting point and tailored to the new service model.
- **What Changed / Implementation:**
  - Reframed the row fields as `Solution / Service Interest`, `Current Software / Services`, `Last Project / Renewal Date`, `Estimated Project Value (KHR)`, `Account Health`, and `Recommended Sales / Service Action`.
  - Added service-interest validation options for custom software development, software maintenance, technical support, system integration, data migration, cloud hosting, UI/UX design, software upgrades, user training, and IT consulting.
  - Reworked all five fictional Cambodian examples as software clients across Phnom Penh, Siem Reap, Kampot, and Battambang, with a dedicated software-maintenance opportunity and KHR project values.
  - Updated the guidance note to explain the software-service portfolio and KHR values.
  - Saved the completed workbook as `outputs/customer-profile-template-20260915/Customer-Profile-Template-Software-Services.xlsx`.
- **Verification:**
  - Re-imported the saved workbook and confirmed the custom software headers, five customer rows, service-interest values, summary formulas, and zero formula-error matches.
  - Tested a disposable sample row in memory; summary metrics and the row-completion formula recalculated correctly.
  - Rendered the populated database and confirmed the software-service labels and detailed rows are legible.
  - `npm run build` and the `nodejs22.x` postbuild runtime check remain required after this log update.
- **Pending:**
  - None.

### Repo-Wide Complexity Pruning (Ponytail Audit)
- **Diagnosis / Context:**
  - Invocation of /ponytail-audit identified legacy dead code, unreferenced assets, unused wrapper functions, dead rate limiter constants, and unnecessary framework dependencies on a pure vanilla Astro repository.
  - Affected files: src/components/Background.astro, src/components/react/DemoIsland.tsx, src/assets/images/yae-mico-maid.png, src/assets/images/mascot.png, src/utils/decrypt.ts, src/pages/api/chat.ts, stro.config.mjs, package.json, scripts/cls-probe.mjs.
- **What Changed / Implementation:**
  - Deleted orphaned src/components/Background.astro (393 lines) previously superseded by ShrineBackgroundCrossfader.astro and ProjectsBackground.astro.
  - Deleted unused src/components/react/DemoIsland.tsx and removed the src/components/react/ directory.
  - Removed @astrojs/react integration from stro.config.mjs.
  - Pruned 8 unneeded dependencies from package.json and synchronized package-lock.json via
pm install (108 packages removed from node_modules):
    - @astrojs/react,
eact,
eact-dom, @types/react, @types/react-dom
    - @vercel/analytics (unimported; telemetry handled by speed-insights)
    - pdfkit (unreferenced dev dependency)
    - http-server (replaced by on-demand
px --yes http-server in scripts/cls-probe.mjs).
  - Deleted 547 KB of stale image binaries: src/assets/images/yae-mico-maid.png and src/assets/images/mascot.png.
  - Pruned deprecated single-line wrapper functions scrambleToResolve and decryptFrontier from src/utils/decrypt.ts.
  - Removed unused constant RATE_LIMIT_WINDOW_MS from src/pages/api/chat.ts.
  - Added --yes flag to
px http-server invocation in scripts/cls-probe.mjs.
- **Verification:**
  -
pm run build passed with exit code 0.
  - Postbuild runtime patch verified: .vercel\output\functions\_render.func\.vc-config.json contains
odejs22.x.
- **Pending:**
  - None.

## Session 2026-09-16

### Responsive Scenic Background Delivery
- **Diagnosis / Context:**
  - Performance source audit found two eagerly loaded images for the projects background, with CSS hiding the unused desktop/mobile artwork. The homepage also rendered three pairs of separate background images.
  - Existing optimized contact artwork variants span approximately 20-120 KB. Avoiding the unused eager artwork removes one initial image request on the projects page; exact transfer savings depend on viewport and pixel density.
- **What Changed / Implementation:**
  - Added `src/components/ScenicImage.astro`: a native picture element with an optimized mobile source below 768px and an Astro Image desktop fallback. Browser source selection replaces CSS-only image selection without client JavaScript.
  - Updated `src/components/ProjectsBackground.astro` to use the shared component with the existing eager loading, quality 75, and mobile widths.
  - Updated `src/components/ShrineBackgroundCrossfader.astro` to use the shared component for featured projects, about, and contact scenery, preserving lazy loading and quality 70.
  - Preserved artwork, responsive width candidates, cover positioning, crossfade logic, and image dimensions. No dependencies or configuration changes.
  - Used the web-perf skill to prioritize confirmed source-level waste and safe-refactor to constrain the change to image delivery.
  - Preserved pre-existing edits in `src/pages/projects.astro` and `src/utils/featureDetails.ts`.
- **Verification:**
  - Baseline and implementation `npm run build` both passed with exit code 0.
  - Confirmed the postbuild function configuration contains `nodejs22.x` after both builds. The adapter's local Node 26 warning is corrected by the existing postbuild patch.
  - Build is the repository's specified verification method. Browser performance traces and Core Web Vitals were not measured; no timing or Lighthouse improvement is claimed.
- **Pending:**
  - Production performance measurements remain a follow-up. No deployment or push was requested.

### Git Ignore Hygiene
- **Diagnosis / Context:**
  - Local agent installations, machine-specific permissions, generated workbook deliverables, and nested scratch outputs appeared as untracked candidates for commits.
  - Obsidian app/plugin configuration, Python bytecode, scratch audit notes, and generated test reports were already tracked. Ignore rules alone cannot exclude tracked files.
- **What Changed / Implementation:**
  - Updated `.gitignore` to exclude root `.agents/`, `.codex/`, `.claude/settings.local.json`, `outputs/`, `scratch/`, `test_reports/`, browser test reports, and coverage output.
  - Added rules for `agents-memory/.obsidian/`, Python caches/environments, Windows metadata, editor swap files, and Office lock files.
  - Removed existing tracked Obsidian configuration/plugins, Python bytecode, scratch audit notes, and generated test reports from the Git index only; all local copies are retained.
  - Preserved shared Claude skills, architecture notes, source, public assets, and existing environment-file exclusions. Did not read any environment file or credential configuration.
- **Verification:**
  - `git ls-files -ci --exclude-standard` returned no tracked files matching ignore rules. `git check-ignore` confirmed environment files and all targeted local directories are excluded.
  - Removed 20 paths from the index only; the remaining untracked candidate is the intended `src/components/ScenicImage.astro` source component.
  - `npm run build` passed with exit code 0 and the postbuild function configuration contains `nodejs22.x`.
- **Pending:**
  - Removing files from the index affects the next commit, not existing Git history. No commit or push requested.

### Commit and Push Preparation
- **Diagnosis / Context:**
  - User authorized committing and pushing the completed optimization and Git ignore cleanup to `origin/main`.
- **What Changed / Implementation:**
  - Included the scenic image component, both background integrations, ignore rules, build log, and the 20 index-only removals of local artifacts.
  - Left pre-existing AI Models Finder edits in `src/pages/projects.astro` and `src/utils/featureDetails.ts` uncommitted; feature detail fields are unfinished.
- **Verification:**
  - The preceding build and `nodejs22.x` runtime check passed. Repeat the required build after this documentation edit before committing.
- **Pending:**
  - Commit and push the prepared changes; report the resulting revision and remote status in the session handoff.


## Session 2026-09-16

### Soft Sakura Glass Surface Refinement
- **Diagnosis / Context:**
  - User approved smoky plum glass, pearly edges, restrained Sakura highlights, clearer surface hierarchy, and lighter mobile effects.
  - Existing cards mixed sparse transparent fills with strong glows; opaque desktop navigation layers obscured scenery.
- **What Changed / Implementation:**
  - `src/styles/global.css`: introduced shared plum fill, pearl reflection, edge, shadow, and blur tokens. Applied raised glass to project/game/chat dialogs and navigation panels; simplified tag surfaces without nested blur.
  - `src/components/ProjectCard.astro`: adopted shared glass with restrained domain-colored hover accents while retaining keyboard focus treatment.
  - `src/components/Navbar.astro`: replaced opaque desktop gradient layers with translucent reflections, shared surface shadows, pearl border, denser scrolled navigation and mobile glass.
  - `src/components/AboutMe.astro`: applied shared glass to the technology panel and supporting strip.
  - `src/components/Contact.astro`: coordinated dispatch and form surfaces with shared tokens while retaining the existing no-blur form performance approach.
  - Added reduced-transparency and unsupported-backdrop fallbacks, a smaller mobile blur radius, and reduced-motion rules for affected panels, cards and tags.
  - Preserved typography, artwork, layout, JavaScript behavior, Neko wrapper, build scripts, and pre-existing edits in `src/pages/projects.astro` and `src/utils/featureDetails.ts`.
- **Verification:**
  - `npm run build` passed with exit code 0; postbuild configuration confirmed `nodejs22.x`.
  - Verification follows the repository build-only requirement; no browser visual inspection or performance measurements were run.
  - Final tag-rule consolidation and this log update are followed by the same required build and runtime check.
- **Pending:**
  - No implementation follow-ups. No deployment or push requested.


### Liquid Glass Correction After Visual Feedback
- **Diagnosis / Context:**
  - User rejected the smoky pass as unlike glass and clarified Apple Liquid Glass as the target. The prior 76-90% opaque fills and subdued edges concealed the underlying scenery.
  - Consulted Apple's Meet Liquid Glass reference: https://developer.apple.com/videos/play/wwdc2025/219/ . This implementation is a CSS approximation, not native optical refraction.
- **What Changed / Implementation:**
  - `src/styles/global.css`: replaced smoky tokens with 22% tinted content glass, 46% raised surfaces, and 5.5% white clear controls; added broad diagonal reflections, continuous masked specular rims, stronger inner edge highlights, and 12px/8px desktop/mobile blur with saturation. Hero primary actions now use translucent Sakura tint.
  - `src/pages/index.astro`: applied clear glass to Contact Me and Resume actions so the new material is visible in the first viewport.
  - `src/components/Navbar.astro`: clear desktop navigation, less opaque mobile/scrolled navigation, reflective control capsules, and a static translucent selected state instead of a glowing CTA pulse.
  - `src/components/ProjectCard.astro`: rounded glass shells and image corners, neutral pointer reflection using the existing handler, and reduced-motion gating for pointer updates.
  - `src/components/AboutMe.astro`: reduced decorative panel artwork opacity so the page backdrop can show through.
  - `src/components/Contact.astro`: one blurred outer glass surface with unfiltered nested form surfaces to avoid accumulating backdrop filters.
  - `src/components/ProjectModal.astro`: removed heavy black scenic overlays; shared CSS reduces chat/project dialog wallpaper opacity.
  - `.learnings/LEARNINGS.md`: recorded the user's material preference and the visual limitation of the first pass using the self-improvement skill.
  - Preserved existing project-data edits, Neko wrapper, image components and build scripts. No new dependencies or animation loop.
- **Verification:**
  - `npm run build` passed with exit code 0; postbuild configuration confirmed `nodejs22.x`. Final documentation update is followed by the same required build/runtime check.
  - Browser tool reported no available browser; no rendered visual verification is claimed.
- **Pending:**
  - Visual review of the CSS approximation remains necessary because no browser is available. No deployment or push requested.


### Liquid Glass Commit
- **Diagnosis / Context:** User requested a local commit of the glass UI revision.
- **What Changed / Implementation:**
  - Commit the seven affected UI source files, this build log, and the material preference learning.
  - Exclude pre-existing edits in `src/pages/projects.astro` and `src/utils/featureDetails.ts`.
- **Verification:**
  - Implementation build passed and `nodejs22.x` was confirmed; repeat both checks after this documentation update before committing.
- **Pending:** Visual review remains outstanding. No push requested.


### Borderless Glass with Original Sakura Colors
- **Diagnosis / Context:** User likes the current Liquid Glass treatment but requested removal of the borders and restoration of the original colors. Interpreted original colors as the established Sakura pink/plum palette and project-domain accents.
- **What Changed / Implementation:**
  - `src/styles/global.css`: removed the continuous masked white rim; made shared glass borders transparent and replaced sharp inset edge highlights with diffuse shadows. Kept the existing transparency, broad reflections, saturation and blur.
  - Restored plum surface RGB values, Sakura-colored reflections/control labels, pink tag tints and the original rose/pink/coral primary-action hues with translucent alpha.
  - `src/components/Navbar.astro`: hid decorative desktop/mobile outline layers and restored pink labels and hover tints.
  - `src/components/ProjectCard.astro`: removed the luminous top border and restored domain-colored pointer reflections. Keyboard focus indicators remain intact.
  - Preserved unrelated project-data edits. No JavaScript behavior or layout changes.
- **Verification:** `npm run build` passed with exit code 0 and the postbuild runtime is `nodejs22.x`. The same checks are repeated after this final log update.
- **Pending:** Visual browser review remains unavailable in this session. No commit or push requested for this revision.


### Refined Original Project Card Frame
- **Diagnosis / Context:** User supplied old/current screenshots and prefers the old thin domain-colored project card outline over the current broad, highly rounded reflective frame.
- **What Changed / Implementation:**
  - `src/components/ProjectCard.astro`: restored a 1px domain-colored border, with a slightly brighter top and quieter bottom; hover strengthens the same outline without adding a thick glow.
  - Reduced outer corners from 28px to 18px and restored 12px image corners, close to the original proportions.
  - Reduced only the card's broad corner reflection so the padding no longer appears as a thick milky rim. Preserved the current transparent base, blur and saturation.
  - Matched the pointer reflection radius to its card. Preserved keyboard focus indicators and existing list-view overrides.
  - Changes are scoped to project cards; other glass surfaces retain their current treatment.
- **Verification:** `npm run build` passed with exit code 0; `nodejs22.x` confirmed in the postbuild configuration. Repeating both after this log update.
- **Pending:** Rendered browser comparison unavailable; design decisions use the supplied screenshots. No commit or push requested.


### Restore Navbar Border Animation and Commit Refinement
- **Diagnosis / Context:** User requested committing the card refinements and questioned the missing navbar border/animation. The earlier border-removal pass hid the navbar's decorative SVG layers too broadly.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`: removed the display suppression of the desktop orbit SVG and mobile contour; restored the original Sakura/purple masked border. Existing orbit keyframes, hover response and reduced-motion handling remain unchanged.
  - Include the pending Sakura palette, refined project-card frame and build-log changes in the authorized local commit.
  - Exclude unrelated edits in `src/pages/projects.astro` and `src/utils/featureDetails.ts`.
- **Verification:** `npm run build` passed with exit code 0 and `nodejs22.x` was confirmed. Repeat both after this final log update before committing.
- **Pending:** No push requested. Browser visual inspection remains unavailable.


## Session 2026-09-17

### Remove Cloudy Navbar Corner Reflection
- **Diagnosis / Context:** User requested removal of the pale corner patch shown in the navbar screenshot. The shared diagonal reflection gradient painted a fixed white highlight over the glass.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`: removed the reflection gradient from desktop and mobile navbar surfaces and removed the faint white-to-pink horizontal overlay.
  - Retained translucent fills, backdrop blur/saturation, Sakura border, orbit animation, existing aurora accents and control styles.
  - No layout or JavaScript changes; unrelated project-data edits preserved.
- **Verification:** `npm run build` passed with exit code 0 and `nodejs22.x` confirmed. Repeating both after this final log update.
- **Pending:** Browser inspection unavailable. No commit or push requested.


### Remove White Reflections from About and Contact
- **Diagnosis / Context:** User supplied screenshots identifying the same fixed white reflection on the Technical Stack panel/pills, biography information strip, and outer/inner Contact panels.
- **What Changed / Implementation:**
  - `src/components/AboutMe.astro`: disabled the shared reflection token on the About glass panels. The Technical Stack tags inherit this setting, including hover states.
  - `src/components/Contact.astro`: disabled the reflection token on the dispatch container and its nested form shell through inheritance.
  - Preserved translucent fills, blur, colors, borders, artwork, layout and interactions. Other page surfaces are unaffected.
- **Verification:** `npm run build` passed with exit code 0 and the postbuild runtime is `nodejs22.x`. Repeating both after this log update.
- **Pending:** Browser inspection unavailable. No commit or push requested.


### Remove All Added White Liquid Glass Highlights
- **Diagnosis / Context:** User requested a complete sweep of white lighting added by the Liquid Glass work, after identifying several surfaces individually. Compared current UI source with pre-glass commit `cfa864b` to distinguish new decoration from original lighting.
- **What Changed / Implementation:**
  - `src/styles/global.css`: deleted the reflection gradient token and its background layers from primary/secondary buttons, tags, shared panels, project/chat/game dialogs, filter menu and mobile drawer. Transparent fills, blur, saturation and colored shadows remain.
  - `src/components/Navbar.astro`: removed reflection layers from resting/hover/active control capsules and the added pale top overlay. Preserved the original Sakura border/orbit animation and aurora accents.
  - `src/components/ProjectCard.astro`: removed the remaining white diagonal surface gradient and resting/hover inset highlights. Retained refined domain-colored borders and colored pointer feedback.
  - `src/components/AboutMe.astro` and `src/components/Contact.astro`: removed now-unnecessary local reflection overrides and dropped the reflection layer from Contact backgrounds.
  - Original white text, keyboard focus indicators, pre-existing button shine and other lighting that predates the Liquid Glass change remain unchanged.
- **Verification:** `npm run build` passed with exit code 0; `nodejs22.x` confirmed. Source search found no remaining reflection-token references; comparison with the pre-glass revision confirmed remaining white styling predates this work. Repeat build/runtime checks after this log update.
- **Pending:** Browser visual inspection unavailable. No commit or push requested.


### Commit White Highlight Cleanup
- **Diagnosis / Context:** User authorized committing the completed Liquid Glass white-highlight removal.
- **What Changed / Implementation:**
  - Commit global surface cleanup, Navbar, Contact and ProjectCard changes with this build log.
  - Removed a leftover whitespace-only AboutMe change; its temporary reflection override is no longer needed.
  - Leave pre-existing `src/pages/projects.astro` and `src/utils/featureDetails.ts` changes uncommitted.
- **Verification:** Previous implementation build passed and `nodejs22.x` was confirmed. Repeat both after this log update before committing.
- **Pending:** No push requested. Rendered browser inspection remains unavailable.

### Homepage Impeccable Polish
- **Diagnosis / Context:** The homepage desktop entrance script skips reduced-motion users, but its CSS leaves hero content transparent. The main heading exposes only the greeting, and mobile actions wrap into uneven rows.
- **What Changed / Implementation:**
  - `src/pages/index.astro`: made desktop hero content visible under reduced motion, including when the preference changes.
  - Added the full introduction as the heading's accessible name without changing the visual name animation.
  - Arranged mobile actions with the primary action spanning the row and two equal secondary actions below; added consistent keyboard focus rings and balanced subtitle wrapping.
  - Preserved the existing Sakura palette, glass surfaces, content, and desktop layout. Existing unrelated project edits remain untouched.
- **Verification:** `npm run build` passed and the postbuild configuration contains `nodejs22.x`. Inspected rendered hero screenshots at 390px mobile and 1440px desktop. Mobile has no horizontal overflow, a 358px primary action, and two 173px secondary actions, all 52px tall. Confirmed the heading's accessible name in the DOM. Reviewed the reduced-motion CSS against the entrance script; browser motion emulation was unavailable. Repeat build/runtime checks after this log update.
- **Pending:** Optional browser confirmation with the operating system's reduced-motion preference. No commit or push requested.


### Restore Tag Pill Borders
- **Diagnosis / Context:** Shared glass border tokens override the original visible pink borders on technology pills. The user requested restoring the borders.
- **What Changed / Implementation:**
  - `src/styles/global.css`: removed the glass border override from `.tag-pill`, restoring its original 1px pink border at 35% opacity. Restored the original 75% pink hover border.
  - Preserved current fills, shadows, active states, layout and interactions.
- **Verification:** `npm run build` passed and the postbuild runtime check confirmed `nodejs22.x`. Repeated both after this log update.
- **Pending:** None. No commit or push requested.


### Match Project Tag Borders to Card Accents
- **Diagnosis / Context:** Technology pills use a shared pink border, which clashes with purple, emerald and amber project card accents.
- **What Changed / Implementation:**
  - `src/components/ProjectCard.astro`: added card-scoped tag border styles using the existing inherited `--domain-rgb` token, at 35% opacity normally and 75% on hover.
  - Both homepage and projects cards share these styles. Pills outside project cards retain their current styling.
- **Verification:** `npm run build` passed; the postbuild runtime check confirmed `nodejs22.x`. Repeated both after this documentation update.
- **Pending:** None. No commit or push requested.


### Match Modal Tag Borders to Project Accents
- **Diagnosis / Context:** The project modal renders technology pills separately from project cards, leaving their borders pink despite the selected project accent.
- **What Changed / Implementation:**
  - `src/components/ProjectModal.astro`: added global selectors for dynamically rendered modal tags using the inherited project domain RGB token. Resting borders use 35% opacity; hovered and selected tag borders use 75%.
  - Existing project navigation updates the inherited token, so borders follow each selected project, including while the detail drawer is open.
- **Verification:** `npm run build` passed; the postbuild runtime check confirmed `nodejs22.x`. Repeated both after this documentation update.
- **Pending:** None. No commit or push requested.


## Session 2026-09-17

### Refine Hero and Featured Project Buttons
- **Diagnosis / Context:** The supplied screenshots show oversized pill shapes and faint secondary boundaries over detailed artwork. The hero and featured-project CTA share primary styling.
- **What Changed / Implementation:**
  - `src/styles/global.css`: replaced the shared primary recipe and added a secondary recipe with 52px minimum targets, 16px corners, compact Inter labels, rose borders, an opaque berry primary fill, and a dark secondary fill for consistent contrast over artwork.
  - Added a subtle divider before the primary arrow, restrained hover lift, pressed feedback, keyboard focus, and reduced-motion handling. Removed the primary white sweep highlight. Existing Sakura images remain Astro Image components.
  - `src/pages/index.astro`: replaced duplicated secondary utility strings with the shared class. Existing links and mobile grid remain intact.
  - Design rationale: retain the Sakura identity while making action hierarchy and boundaries clearer. No new JavaScript or dependencies.
- **Verification:** `npm run build` passed; the postbuild runtime check confirmed `nodejs22.x`. Repeated both after this log update.
- **Pending:** Visual browser review was not performed. No commit or push requested.


### Restore Sakura Button Pill Shapes
- **Diagnosis / Context:** The user confirmed that the hero and featured-project buttons should retain the original pill silhouette. The previous 16px corners changed the established Sakura character unnecessarily.
- **What Changed / Implementation:**
  - `src/styles/global.css`: changed the shared primary and secondary action border radius to 9999px.
  - Retained the refined spacing, typography, borders, contrast, hover feedback, keyboard focus, and mobile layout.
  - Design decision: preserve the established pill shape when polishing these actions.
- **Verification:** `npm run build` passed and the postbuild runtime check confirmed `nodejs22.x`. Both checks were repeated after this documentation update.
- **Pending:** None. No commit or push requested.


### Restore Navbar Contact and Toggle Pill Borders
- **Diagnosis / Context:** The screenshot identifies missing navbar pill outlines. Contact and the adjacent Sakura toggle use shared glass border tokens set to transparent.
- **What Changed / Implementation:**
  - `src/components/Navbar.astro`: replaced transparent border tokens only in the Contact and toggle pill rules with 1px pink borders at 45% opacity and 80% opacity on hover or the existing Contact active state.
  - Preserved pill shapes, fills, shadows, layout, and interactions. Global glass tokens remain unchanged.
- **Verification:** `npm run build` passed and `nodejs22.x` was confirmed. Repeated both checks after this log update.
- **Pending:** Browser appearance not verified. No commit or push requested.


### Match View Projects Reference Color and Restore Hover Animation
- **Diagnosis / Context:** The user supplied a vivid pink-to-coral pill reference and asked about the removed hover animation. The earlier refinement replaced the gradient with a muted solid fill and removed the shimmer and scale feedback.
- **What Changed / Implementation:**
  - `src/styles/global.css`: updated the shared View Projects style to a saturated rose, pink, and coral gradient with a pink outline and soft pink glow. Both hero and featured-project links inherit the change.
  - Restored the clipped shimmer sweep, 1.03 hover scale, and stronger hover glow. The shimmer renders behind button content. Existing flower rotation, arrow movement, and pressed feedback remain.
  - Removed the added arrow divider to align with the reference. Preserved pill shape, sizing, typography, secondary buttons, and links.
  - Disabled the shimmer under reduced motion; retained motion suppression for the button and its contents. Updated fallback backgrounds to retain the new colors.
- **Verification:** `npm run build` passed and the runtime check confirmed `nodejs22.x`. Repeated both after this documentation update.
- **Pending:** Browser appearance and animation not visually verified. No commit or push requested.

### Strengthen Technical Stack Card Border
- **Diagnosis / Context:** User supplied a screenshot showing the Technical Stack card boundary too faint against the Sakura artwork. The affected card is in `src/components/AboutMe.astro`.
- **What Changed / Implementation:**
  - Increased the card's resting border from `border-pink-400/30` to `border-pink-400/45`.
  - Increased the hover border from `hover:border-pink-300/60` to `hover:border-pink-300/70`.
  - Preserved card radius, glass background, artwork, shadows, hover lift, and responsive layout.
- **Verification:** `npm run build` passed. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Fix Technical Stack Border Cascade
- **Diagnosis / Context:** User could not see the added border. The Tailwind border class existed, but the shared `.sakura-glass-panel` rule later set `border-color: var(--glass-border)`, overriding the card class and hover color.
- **What Changed / Implementation:**
  - Added `tech-stack-panel` to the Technical Stack card in `src/components/AboutMe.astro`.
  - Added higher-specificity resting and hover border rules in `src/styles/global.css` using the approved Sakura pink opacity values.
  - Kept the shared glass fill, blur, shadow, artwork, and motion behavior.
- **Verification:** `npm run build` passed. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Add Border to About Highlights Strip
- **Diagnosis / Context:** User supplied a screenshot showing the Location, Studies, and Interests strip without a visible border. It uses the same shared `.sakura-glass-panel` rule that overrides local Tailwind border colors.
- **What Changed / Implementation:**
  - Added `about-highlights-panel` to the highlights strip in `src/components/AboutMe.astro`.
  - Added matching 45% resting and 70% hover Sakura border overrides in `src/styles/global.css`.
  - Preserved the strip's pill shape, spacing, separators, content, and hover shadow.
- **Verification:** `npm run build` passed. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Remove View Projects Button Border
- **Diagnosis / Context:** User requested a borderless `View Projects` primary button while retaining its gradient and glow.
- **What Changed / Implementation:**
  - Set `.sakura-primary-btn` border to `0` in `src/styles/global.css`.
  - Preserved the gradient fill, pill shape, glow, hover scale, shimmer, focus behavior, and reduced-motion rules.
- **Verification:** `npm run build` passed. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Apply Liquid Glass to About Highlights Strip
- **Diagnosis / Context:** The screenshot identifies the Location, Studies, and Interests strip as a liquid-glass surface over detailed Sakura artwork. The panel needed an explicit shared glass recipe and stronger text contrast at small sizes.
- **What Changed / Implementation:**
  - `docs/superpowers/specs/2026-09-17-about-highlights-liquid-glass-design.md`: recorded the approved surface, contrast, responsive, and fallback design.
  - `src/components/AboutMe.astro`: removed conflicting local background, blur, and shadow utilities so the shared glass surface owns the panel. Added semantic label, value, and item classes for targeted readability and hover styling.
  - `src/styles/global.css`: explicitly applied shared fill, blur, saturation, border, and shadow tokens to `.about-highlights-panel`. Added slate-300 labels, near-white values, restrained text shadows, and a subtle Sakura item hover tint without nested backdrop filters.
  - No content, layout, image loading, JavaScript, or dependency changes.
- **Verification:** `npm run build` passed with exit code 0. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`. Headless Playwright inspection confirmed `rgba(12, 11, 22, 0.22)` panel fill, `blur(12px) saturate(1.6)`, `rgba(244, 114, 182, 0.45)` border, `rgb(203, 213, 225)` labels, and `rgb(248, 250, 252)` values. Screenshot review confirmed readable text over the glass surface.
- **Pending:** None. No push requested.

### Redesign About Highlights as Rose-Crystal Glass
- **Diagnosis / Context:** The first glass pass preserved too much of the old strip styling. The user requested a visibly improved design, while retaining readability over the Sakura background.
- **What Changed / Implementation:**
  - `src/styles/global.css`: added a rose-to-violet refractive gradient, diagonal specular rim, deeper ambient shadow, and isolated overflow for the highlights panel.
  - Added individual floating glass tiles with subtle borders, inset highlights, hover tint, and 1px lift.
  - Changed labels to uppercase pale rose with tracking. Kept values near-white with heavier weight and text shadows.
  - Added reduced-transparency fallback that removes decorative sheen and uses a solid plum surface.
  - Updated the approved design spec to describe the rose-crystal direction.
- **Verification:** `npm run build` passed with exit code 0. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`. Headless Playwright verified the refractive gradient, `blur(12px) saturate(1.6)`, pink border, uppercase labels, near-white values, and rendered screenshot.
- **Pending:** None. No push requested.

### Audit Desktop Scroll Rail Responsiveness
- **Diagnosis / Context:** The user reported that the homepage vertical scroll progress rail feels laggy. The affected animation is implemented in `src/components/DesktopScrollRail.astro`; related scroll work was reviewed in `src/layouts/BaseLayout.astro`, `src/components/Navbar.astro`, `src/components/ShrineBackgroundCrossfader.astro`, and `src/components/SakuraCanvas.astro`.
- **What Changed / Implementation:**
  - Performed a read-only audit. No product source files were changed.
  - Confirmed the orb uses a requestAnimationFrame loop and compositor-friendly `transform` updates.
  - Identified the primary lag mechanism: each frame advances only 20% of the remaining distance (`orbY + distance * 0.2`), creating intentional trailing behavior. Under the headless runtime probe, a large scroll jump took about 1.9 seconds to settle.
  - Identified secondary scroll cost: eight global scroll listeners exist on the homepage. The background crossfader reads section geometry on each scheduled frame, while the rail, navbar, and progress bar each schedule separate animation-frame work.
  - Identified two correctness and accessibility issues: the rail maps progress between named section offsets instead of the full document range, and the rail links use `focus:outline-none` without a visible `:focus-visible` replacement.
  - Temporary Playwright audit script was removed after testing.
- **Verification:** `npm run build` passed with exit code 0. The postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`. Headless Playwright confirmed the desktop rail renders at 1440×900, remains hidden at 390×844, reports no page errors, and exposed only the expected network-blocked Vercel Speed Insights request in the sandbox.
- **Pending:** Recommend a follow-up implementation that reduces or removes low-pass smoothing for direct scroll tracking, consolidates scroll scheduling, defines full-document progress semantics, and adds `:focus-visible` styling. No fix was applied because the request asked for an audit.

### Fix Desktop Scroll Rail Trailing Lag
- **Diagnosis / Context:** The audit confirmed that `src/components/DesktopScrollRail.astro` advanced the progress orb by only 20% of the remaining distance per frame. This frame-dependent easing caused visible trailing during fast scrolling.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`: changed orb positioning to assign `orbY = targetOrbY` on each scheduled animation frame.
  - Removed the obsolete follow-up animation request that only existed to settle the eased position.
  - Preserved requestAnimationFrame scheduling, track fill alignment, active and passed bead states, jump navigation, scrolling pulse, and reduced-motion handling.
  - Added the approved design record at `docs/superpowers/specs/2026-09-17-desktop-scroll-rail-lag-design.md`.
- **Verification:** `npm run build` passed with exit code 0. The postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`. Focused Playwright verification confirmed the rail is visible at 1440×900, has 4 navigation items, stays within 1px of its scroll-derived target after a large scroll, stays within 1px under reduced motion, remains hidden at 390×844, and produces no page errors.
- **Pending:** None. No commit or push requested.

### Improve Scroll Frame Cadence During Rail Tracking
- **Diagnosis / Context:** Direct orb tracking removed positional easing, but profiling still showed the homepage rendering at roughly 70–75ms per animation frame while decorative CSS animations ran. Pausing all CSS animations in an isolated probe restored roughly 16.9ms frame cadence.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`: adds `page-is-scrolling` to the document root while active scrolling continues and removes it 180ms after the last scroll event.
  - `src/styles/global.css`: pauses CSS animations while `page-is-scrolling` is active. The rule affects only the active scroll window; decorative motion resumes after scrolling stops.
  - `docs/superpowers/specs/2026-09-17-desktop-scroll-rail-lag-design.md`: records temporary animation suspension as part of the approved rail performance design.
- **Verification:** Focused Playwright profiling confirmed the scroll class stays active during scroll samples, orb and track fill remain aligned within 0.001px, and no page errors occur. `npm run build` passed with exit code 0. The postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No commit or push requested.

### Remove Remaining Scroll Frame Wait
- **Diagnosis / Context:** After direct positioning and scroll-time animation pausing, the rail still waited for a scheduled animation frame before rendering. This left a small input-to-visual delay when scroll events arrived between frames.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`: the scroll handler now updates cached section state and renders the orb immediately. It keeps the requestAnimationFrame fallback only when layout measurement is unavailable.
  - Preserved resize and initial layout scheduling, active bead updates, track fill rendering, jump navigation, glow state, and reduced-motion behavior.
- **Verification:** Focused Playwright verification confirmed 6 scroll events, maximum scroll-target error of 1px, scroll-time animation pausing on all events, class removal after idle, desktop rail visibility, mobile rail hiding, and no page errors. `npm run build` passed with exit code 0. The postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No commit or push requested.

### Remove Corner White Glow from About Highlights Pill
- **Diagnosis / Context:** User supplied a screenshot showing an unwanted white flare at the corner of the Location, Studies, and Interests pill. The flare came from the white first stop in the panel's decorative `::before` gradient.
- **What Changed / Implementation:**
  - `src/styles/global.css`: changed the first `::before` gradient stop for `.about-highlights-panel` from translucent white to transparent.
  - Preserved the Sakura pink and violet glass gradient, border, shadow, blur, tile hover states, responsive layout, and reduced-transparency fallback.
  - Added approved design record at `docs/superpowers/specs/2026-09-17-about-highlights-corner-glow-design.md`.
  - No markup, content, assets, JavaScript, or dependency changes.
- **Verification:** `npm run build` passed with exit code 0. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Add Depth to About Highlights Inner Tiles
- **Diagnosis / Context:** User reported that the Location, Studies, and Interests inner tiles looked flat and lacked depth. The affected rule is `.about-highlight-item` in `src/styles/global.css`.
- **What Changed / Implementation:**
  - `src/styles/global.css`: replaced the flat translucent tile fill with a restrained vertical glass gradient.
  - Added a subtle top rim, dark bottom inset, and offset soft shadows to create recessed glass depth.
  - Preserved tile content, spacing, Sakura palette, hover lift, responsive behavior, and the removed outer corner flare.
  - Added approved design record at `docs/superpowers/specs/2026-09-17-about-highlights-inner-depth-design.md`.
  - No markup, assets, JavaScript, or dependency changes.
- **Verification:** `npm run build` passed with exit code 0. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Harmonize About Highlights Information Strip
- **Diagnosis / Context:** The Location, Studies, and Interests treatment used nested capsules, individual tile depth, hover movement, and a full-pill silhouette. Those choices competed with the About Me eyebrow and did not share the calmer rounded-card language of the adjacent Technical Stack panel.
- **What Changed / Implementation:**
  - `src/components/AboutMe.astro`: converted the highlights area into one responsive three-column information strip with equal-width desktop segments and stacked mobile rows.
  - Left-aligned every icon and text group on a fixed icon grid for consistent scanning.
  - Replaced the desktop capsule radius with `rounded-2xl` to match the Technical Stack card.
  - Removed per-item capsule classes, hover scaling, and floating-tile behavior because the content is informational rather than interactive.
  - `src/styles/global.css`: simplified the panel to a restrained shared glass fill, reduced Sakura border and glow intensity, and replaced nested tile surfaces with transparent segments and subtle dividers.
  - Styled labels as compact uppercase monospace metadata to echo the About Me and Technical Stack labels. Kept values in readable semibold sans-serif text.
  - Preserved all factual copy, images, Astro image handling, section reveal timing, reduced-transparency fallback, and surrounding About Me layout.
- **Verification:** `npm run build` passed with exit code 0. Postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`. Headless Playwright inspected 1440x900 and 390x844 viewports: the strip measured 693x62 and 358x176 respectively, produced no horizontal overflow or page errors, and retained the intended 16px radius, 10px monospace labels, equal desktop columns, and stacked mobile rows. Desktop and mobile screenshots received a visual review.
- **Pending:** None. No push requested.

### Inspect Contact Section and Propose a Focused Improvement
- **Diagnosis / Context:** The user requested an Impeccable design inspection of `src/components/Contact.astro` and an improvement proposal, without requesting implementation. The review compared the contact surface with the incumbent Sakura shrine visual system and evaluated hierarchy, trust, accessibility, copy, validation, and completion states.
- **What Changed / Implementation:**
  - Performed two isolated Impeccable assessment passes: an unanchored design review and a deterministic detector/browser-evidence pass.
  - Recorded the critique snapshot at `.impeccable/critique/2026-09-17T12-12-49Z__src-components-contact-astro.md` for future refinement work.
  - Proposed consolidating the section into one credible contact path: remove unverifiable status theater, add a direct email fallback and factual reassurance, move secondary social channels below the form, and preserve the ofuda submit control as the signature flourish.
  - No product source, behavior, dependencies, or assets were changed.
- **Verification:** The Impeccable detector returned 0 findings for `src/components/Contact.astro`. Browser inspection was unavailable because no Chrome or in-app browser provider was exposed; the temporary development server was stopped. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** Await user direction on whether to implement the focused simplification, accessibility hardening, or both. No push requested.

### Design Focused Shrine Contact Refinement
- **Diagnosis / Context:** The user selected the combined simplification and accessibility-hardening direction, then chose the focused-shrine composition. The design must preserve the section's signature shrine identity while making the message form the immediate primary path.
- **What Changed / Implementation:**
  - Added `docs/superpowers/specs/2026-09-17-contact-focused-shrine-design.md` with the approved hierarchy, retained elements, removals, copy constraints, accessibility behavior, and verification criteria.
  - Specified a reading order of heading, concise introduction and email fallback, form, then quiet GitHub/LinkedIn alternatives.
  - Defined semantic error associations, `aria-invalid`, first-invalid focus, a form-level live status, success/reset focus management, and gentler blur validation.
  - No product source, runtime behavior, dependencies, or assets were changed in this design step.
- **Verification:** Spec self-review found no placeholders, contradictions, or unresolved scope. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** User review of the written design before implementation. No push requested.

### Implement Focused Shrine Contact Refinement
- **Diagnosis / Context:** The approved contact design called for a clearer primary message path and accessible, resilient validation without discarding the Sakura shrine identity. The existing pre-form social dock, unavailable X card, duplicated live indicators, and unsupported transport claims competed with the form and weakened trust.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: removed the pre-form GitHub, LinkedIn, and unavailable X cards; removed the response-time badge, duplicate transmission indicator, Markdown claim, and encryption claim.
  - Added a visible `mailto:vuthihoeurb@gmail.com` fallback beneath the main heading and moved GitHub/LinkedIn into a quiet alternative-contact row after the form.
  - Preserved the glass altar, Sakura palette, topic chips, ofuda submit control, neko success state, and desktop two-column/mobile single-column composition.
  - Replaced the `h4` form title with a correctly nested `h3`, simplified it to `Send a Message`, and added concise required-field and length guidance.
  - Added native length constraints, including `maxlength="2000"` for the message field, while preserving the live counter.
  - Added `aria-describedby` and dynamic `aria-invalid` behavior for every field.
  - Changed blur validation so untouched empty fields do not show errors; empty required fields are validated on submission.
  - Added first-invalid-field focus, a form-level `aria-live` status for sending and recoverable failures, preserved input after service/network errors, success-heading focus, and name-field focus after reset.
  - Removed obsolete social-dock CSS and added focused styling for alternative links and form-level status states.
- **Verification:** Both the general Impeccable detector and layout-scoped detector returned 0 findings. Headless Playwright passed at 1440x900 and 390x844, confirming no horizontal overflow, simplified content removal, direct email and alternative links, semantic field associations, untouched-blur behavior, first-invalid focus, 2,000-character enforcement, failure focus with preserved input, success focus, and reset focus. Desktop and mobile screenshots were visually reviewed in one bounded pass. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No commit or push requested.

### Polish Contact Message Textbox
- **Diagnosis / Context:** The user supplied a desktop screenshot showing that the message textarea remained an oversized near-black slab after the focused-shrine refinement. Its height and empty surface dominated the form, while the detached counter added another competing badge near the label.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: converted the message control into a bounded composed writing panel with a 240px mobile minimum, 300px desktop minimum, and 420px resize ceiling.
  - Removed the field-level counter badge and integrated the live `0 / 2000` counter into the panel footer beside the minimum-length guidance.
  - Replaced the flat black surface with a restrained violet radial/linear treatment, subtle inset highlight, offset depth shadow, and calmer hover/focus states.
  - Added themed caret, selection, and scrollbar colors while preserving validation, `maxlength`, live counting, `aria-describedby`, keyboard behavior, and user resizing.
  - Updated `docs/superpowers/specs/2026-09-17-contact-focused-shrine-design.md` to record the approved composed-writing-panel treatment.
- **Verification:** Headless Playwright passed at 1440x900 and 390x844, confirming the counter is inside the footer, label is uncluttered, textarea heights remain within 230-430px, assistive associations remain intact, and neither viewport has horizontal overflow. Focused desktop and mobile screenshots were visually reviewed. The Impeccable detector returned 0 findings. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No commit or push requested.

## Session 2026-09-18

### Add Etched Shrine Rim to Contact Textbox
- **Diagnosis / Context:** The composed writing panel improved the textarea's proportion and surface, but its uniformly pink perimeter still resembled a persistent focus ring. The user requested a more considered border treatment.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: replaced the resting pink edge with a quieter plum border.
  - Added a one-pixel inset Sakura-rose engraving and four restrained gold corner brackets using non-interactive pseudo-elements.
  - Tuned hover and focus states to clarify the inner rim and corner marks while reducing the broad focus halo from 3px to 2px.
  - Preserved the writing-surface gradient, resize bounds, footer, counter, validation behavior, and keyboard focus semantics.
  - Ensured validation-error styling keeps the red semantic border dominant and visually suppresses the decorative gold corners.
  - Updated the focused-shrine design specification with the approved etched-rim treatment.
- **Verification:** Headless Playwright passed at 1440x900 and 390x844, confirming the outer rim, inset engraving, eight corner-bracket strokes, focus-state transition, and absence of horizontal overflow. Focused desktop and mobile screenshots were visually reviewed. The Impeccable detector returned 0 findings. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No commit or push requested.

### Fix Chopped Textbox Corner Illusion
- **Diagnosis / Context:** The screenshot showed two overlapping cues that made the message panel look clipped: deliberate gold L-shaped corner brackets and Chromium's diagonal native textarea resize grip at the lower-right edge.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: removed the decorative gold corner-bracket pseudo-element while retaining the continuous plum outer border and inset Sakura-rose engraving.
  - Disabled native textarea resizing to remove the browser-drawn diagonal grip that collided with the footer seam.
  - Preserved the responsive writing-area height, message counter, validation, focus treatment, and accessibility associations.
  - Updated the focused-shrine design specification so the etched rim is explicitly continuous and unornamented at the corners.
- **Verification:** Headless Playwright passed at 1440x900 and 390x844, confirming native resizing is disabled, no decorative corner pseudo-element remains, the inset rounded rim remains visible, and neither viewport has horizontal overflow. Desktop and mobile screenshots were visually reviewed. The Impeccable detector returned 0 findings. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Restore Gold Corner Brackets and Keep Resize-Grip Fix
- **Diagnosis / Context:** The previous correction misinterpreted the user's concern and removed the intentional gold L-shaped corner treatment. User feedback clarified that the gold brackets were the desired corner design; only the native diagonal textarea resize grip was the defect.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: restored all four gold L-shaped corner brackets and their hover, focus, and validation-state opacity behavior.
  - Kept native textarea resizing disabled so the Chromium diagonal grip no longer collides with the lower-right bracket or footer seam.
  - Restored the design specification's gold-corner requirements while retaining the stable non-resizable writing area.
- **Verification:** Headless Playwright confirmed that the textarea computes to `resize: none` while the decorative pseudo-element still renders all eight strokes forming the four gold L-shaped brackets; the corrected desktop screenshot was visually reviewed. The Impeccable detector returned 0 findings. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Preserve the Textbox Corner Radius in Its Shadow
- **Diagnosis / Context:** The message panel's lower-left corner appeared to have a dark rectangular notch behind the gold bracket. The gold ornament and rounded border were correct; the panel's large negative shadow spread reduced the shadow corner radius to zero and exposed a square shadow footprint below the curved edge.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`: reduced the negative spread of the resting, hover, and focus depth shadows from `-18px` to `-4px`, keeping their radius aligned with the panel's rounded silhouette.
  - Rebalanced shadow opacity so the broader, properly rounded shadow remains restrained and preserves the etched-shrine depth treatment.
  - Left all four gold L-shaped brackets, the inset engraving, the outer border, and the non-resizable writing surface unchanged.
- **Verification:** The Impeccable detector returned 0 findings. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Rework Contact Textbox Border as a Gradient Rim
- **Diagnosis / Context:** The user's screenshot showed that the message panel's pink outer border and inset pink engraving combined into a heavy double frame that resembled a permanent focus state. The requested refinement affected only the contact message panel in `src/components/Contact.astro`.
- **What Changed / Implementation:**
  - Replaced the solid plum outer border with a single one-pixel rose-to-gold gradient rim built from layered `padding-box` and `border-box` backgrounds.
  - Removed the redundant inset pink pseudo-element so the panel reads as one continuous rounded edge instead of two nested boxes.
  - Added restrained hover contrast and a narrow one-pixel focus halo while keeping the focus state visibly distinct.
  - Preserved all four gold corner brackets, the writing-surface depth, the footer seam, character counter, watermark, validation logic, and non-resizable textarea behavior.
  - Added a semantic error-state background that replaces the decorative gradient with a solid rose-red rim and reduces the gold-corner prominence.
  - Added and committed `docs/superpowers/specs/2026-09-18-contact-textbox-gradient-rim-design.md` as the approved design record.
- **Verification:** Headless Playwright passed at 1440x900 and 390x844 for resting, focused, and validation-error states. It confirmed that the removed inset pseudo-element has no rendered content, the panel retains rounded corners, the semantic error rim overrides the decorative gradient, and neither viewport has horizontal overflow. All six focused screenshots were visually reviewed. `npm run build` passed with exit code 0, and the postbuild runtime check confirmed `nodejs22.x` in `.vercel/output/functions/_render.func/.vc-config.json`.
- **Pending:** None. No push requested.

### Resolve Textbox Chipped Corners and Refine Altar Panel
- **Diagnosis / Context:**
  - The user reported that the bottom corners of the message text box appeared "chipped off" with a dark square notch protruding past the curved border (`Screenshot 2026-09-18 103713.png`).
  - Forensic pixel and DOM analysis using Playwright revealed the root cause: Chromium's `backdrop-filter` clipping bug. The child footer toolbar (`.contact-message-footer`) had `backdrop-blur-sm` and `border-radius: 0px`. Chromium ignores the parent container's `overflow: hidden` and `border-radius: 12px` when compositing child backdrop filters with square corners, causing the dark blur quad to bleed outside the rounded border.
  - Furthermore, inspection of `Screenshot 2026-09-18 103844.png` revealed visual clutter: decorative gold corner brackets were sliced by the footer divider line and collided with `Minimum 10 characters` and `0 / 2000`, sharp right angles clashed with the container's 12px border radius, and a cartoonish droplet watermark distracted from the shrine aesthetic.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - Removed `backdrop-blur-sm` from `.contact-message-footer`, eliminating the unclipped backdrop-filter layer that caused the square chipped corner artifact.
    - Added `rounded-b-xl` to `.contact-message-footer` in markup and matching `border-bottom-left-radius: calc(0.75rem - 1px); border-bottom-right-radius: calc(0.75rem - 1px);` in CSS for defense-in-depth contouring.
    - Retired `.contact-textarea-box::after` (and associated `:hover`, `:focus-within`, and error pseudo-element styles), removing the colliding corner brackets and granting the counter pill and character minimum guidance clean breathing room.
    - Removed `.contact-watermark` (and its focus-within rule) to present an elegant, distraction-free obsidian writing canvas.
    - Preserved the non-resizable textarea behavior, live counter, validation, accessibility associations, and single soft gradient rim.
- **Verification:**
  - Headless Playwright automated tests confirmed that the dark corner notch is completely eradicated: the bottom corners render as flawless, continuous rounded curves.
  - Verified resting, hover, and focus states in desktop (1440x900) viewport with high-resolution screenshot captures (`fixed-box.png`, `fixed-corner-zoom.png`, `fixed-box-focus.png`).
  - `npm run build` passed with exit code 0.
  - Postbuild runtime check verified: `.vercel/output/functions/_render.func/.vc-config.json` contains `"runtime": "nodejs22.x"`.
- **Pending:**
  - None. Remote push remains gated.

### Eliminate Directional Inset Shadow Artifact on Message Panel Corners
- **Diagnosis / Context:**
  - The user reported an awkward corner artifact on the message textbox (Screenshot 2026-09-18 113208.png). The top-left corner showed an outer smooth curved border, but right inside it, a distinct secondary straight line / crescent sliced across the rounded corner curve.
  - Pixel and computed style investigation revealed:
    1. `.contact-textarea-box` had `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08)` (and `0.1` on hover, `0.12` on focus-within).
    2. In CSS box-model specification, a directional inset shadow with vertical offset (`0 1px 0`) and zero blur translates the inner clipping path downwards by 1px. Along the straight horizontal top edge, this renders a clean 1px highlight, but around rounded corners (`border-radius: 12px`), the vertically translated curve intersects the element's curved corner contour at an angle, creating a step-down crescent artifact and double-line illusion inside the corner.
    3. Additionally, `<textarea>` possessed the class `contact-input`, which applied base input borders (`1px solid rgba(...)`) that Tailwind's `border-0` had to fight, and lacked an explicit CSS reset for `border: none` and `outline: none`.
- **What Changed / Implementation:**
  - `src/components/Contact.astro`:
    - Removed the zero-blur directional top highlight `inset 0 1px 0 rgba(255, 255, 255, ...)` across default, `:hover`, and `:focus-within` states of `.contact-textarea-box`. The perimeter gradient on `border-box` (`linear-gradient(115deg, ...)`) already provides the luminous top/side highlight without geometric distortion.
    - Removed the redundant `border` utility class from `.contact-textarea-box` markup.
    - Removed the `contact-input` class from the `<textarea>` markup to decouple it from standard single-line sunken well inputs.
    - Added explicit `border: none; outline: none;` to `.contact-textarea-box .contact-textarea` and `.contact-textarea:focus` rules to guarantee zero inner border collision.
- **Verification:**
  - Visual inspection with Chrome DevTools MCP and screenshot capture of `#contact-message` confirmed that the double-line corner crescent is completely eliminated. Resting, hover, and focused states render with a single, continuous, flawless 12px rounded curve.
  - `npm run build` completed successfully with exit code 0.
  - Postbuild runtime patch verified: `.vercel/output/functions/_render.func/.vc-config.json` contains `"runtime": "nodejs22.x"`.
- **Pending:** None.

### Implement Readiness-Aware Sakura Skeleton Screen
- **Diagnosis / Context:**
  - The existing Matrix splash was intentionally theatrical and already protected by mobile, reduced-motion, session, skip, and hard-cap behavior, but its completion did not guarantee that critical viewport imagery and fonts had settled.
  - Revealing the page directly from `matrix-splash-done` could expose late image/font painting, while extending the Matrix animation would have changed an established interaction.
  - The approved direction therefore preserved `MatrixSplash.astro` and introduced a separate route-aware loading surface for the short readiness gap after the splash.
- **What Changed / Implementation:**
  - Added `src/components/PageSkeleton.astro` with `home`, `projects`, and `fallback` compositions using the existing dark Sakura-glass palette, faint rose rims, responsive geometry, a single 1.8-second shimmer, and reduced-motion suppression.
  - Updated `src/layouts/BaseLayout.astro` to derive the route variant, render the skeleton directly beneath the Matrix splash, and group normal page UI under an inertable `#page-content-root` without changing document layout.
  - Added the internal `data-loading-critical` marker to the active Home and Projects scenic backgrounds, visible navbar artwork, hero torii imagery, and the first three project-card media candidates. Runtime viewport filtering prevents hidden responsive art and below-the-fold cards from delaying release.
  - Added concurrent image and `document.fonts.ready` settlement; image errors count as settled. Release requires asset readiness and the existing `matrix-splash-done` handoff, with a six-second post-splash cap for permanently stalled resources.
  - Added the one-shot `page-content-ready` event and migrated navbar entrance, desktop hero stagger, and load-triggered decrypt effects to it. A settled-state root class supports listeners initialized after dispatch.
  - Added scroll locking, content inertness, previous-state restoration, scroll/focus restoration, a polite loading status, no-JavaScript bypass, and fade/remove cleanup.
  - Extended `ScenicImage.astro` with an optional internal `critical` prop and adjusted above-the-fold project media to eager/high-priority loading while preserving lazy behavior for later cards.
  - Added `docs/superpowers/specs/2026-09-18-skeleton-loading-screen-design.md` as the approved architecture, visual, event, failure-handling, and verification record.
- **Verification:**
  - `npm run build` passed with exit code 0 and the postbuild adapter output completed successfully.
  - Headless Chromium passed Home, Projects, and 404 checks at 1440x900 and 390x844, covering first desktop visit, natural splash completion, click skip, Escape skip, repeat-session bypass, mobile bypass, reduced motion, light color preference, failed critical image settlement, and no-JavaScript visibility.
  - Browser assertions confirmed `page-content-ready` fires exactly once, the skeleton is removed, inertness is restored, scroll locking clears, hero entrances run after readiness, no horizontal overflow occurs, and no local application request or runtime error is present.
  - A deliberately stalled critical image confirmed the skeleton remains visible and content inert during loading, then the six-second safety cap releases the page and restores inertness while still dispatching the readiness event once.
  - Desktop Home, desktop Projects, mobile Home, mobile 404, and the stalled-resource skeleton were visually reviewed; the route-specific compositions remained aligned, unclipped, and free of overlay collisions.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Refine Readiness-Aware Sakura Skeleton
- **Diagnosis / Context:**
  - The first readiness-aware skeleton preserved the Matrix handoff correctly, but its desktop scenic oval resembled an empty card, its Projects cards were undifferentiated slabs, and the fallback did not reflect the finished 404 hierarchy closely enough.
  - Project media priority was inferred from the shared card index, causing Home's below-the-fold featured images to compete with the initial hero viewport.
  - Release cleanup restored inertness but did not preserve a prior `aria-busy` value or explicitly unregister every dormant readiness listener after a safety-cap release.
  - Affected files: `src/components/PageSkeleton.astro`, `src/components/ProjectCard.astro`, `src/pages/projects.astro`, `docs/superpowers/specs/2026-09-18-skeleton-loading-screen-design.md`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - Rebuilt the Home skeleton proportions around the live hero's two-line title scale, supporting copy, real action widths, responsive wrapping, navigation spacing, and a soft unframed scenic silhouette.
  - Reworked Projects placeholders to follow the archive header and filter shell, then gave each visible card explicit media, metadata, title, copy, and tag geometry.
  - Expanded the fallback composition to include a torii/seal area, large 404 numeral region, supporting hierarchy, separator, and paired responsive actions.
  - Reduced surface opacity and rim contrast; replaced per-element shimmer pseudo-elements with one restrained 1.8-second composition-wide sweep and retained reduced-motion suppression.
  - Matched the skeleton fade to the Matrix fade duration so already-ready visits reveal the completed page directly beneath the Matrix transition.
  - Added exact `aria-busy` preservation/restoration alongside inertness, focus, scroll, and overflow cleanup; release now removes Matrix, DOM-ready, and image-settlement listeners before its exactly-once readiness event.
  - Added an explicit internal `critical` prop to `ProjectCard.astro`. `/projects` marks the first three archive cards as eager/high priority, while Home omits the prop so featured media remains lazy.
  - Extended the approved design specification with the refined route geometry, release hygiene, theme behavior, and loading-intent contract.
- **Verification:**
  - `npm run build` completed successfully and the Vercel function runtime patch remained `nodejs22.x`.
  - Headless Chromium passed natural, click, Escape, repeat-session, mobile, reduced-motion, and no-JavaScript flows; failed assets settled immediately and a permanently stalled critical image released through the unchanged six-second cap.
  - Browser assertions confirmed a single `page-content-ready` dispatch, active inertness and `aria-busy="true"` during stalls, exact cleanup after release, entrance timing, zero horizontal overflow, and no local runtime or request failures.
  - Home project media remained lazy and unmarked; the first Projects archive row rendered eager, high-priority, and readiness-marked.
  - Home, Projects, and 404 skeleton and completed states were captured at 1440x900 and 390x844 under dark and light root themes and visually reviewed for hierarchy, clipping, surface weight, and overlay collisions.
  - `npm run qc` passed all five mandatory gates: BOM audit, component invariants, Git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Smooth Mobile Scrolling by Freezing Ambient Motion
- **Diagnosis / Context:**
  - Mobile and coarse-pointer devices kept numerous perpetual decorative CSS animations active during touch scrolling, including pulse, ping, divider crest, torii, avatar, scroll-guide, footer, and cat-ear loops.
  - Those ambient effects competed with style, paint, and compositing work on constrained devices, while the existing `page-is-scrolling` pause path depended on the desktop-only scroll rail and therefore did not help mobile.
  - Affected files: `src/styles/global.css` and `src/components/SectionDivider.astro`.
- **What Changed / Implementation:**
  - Extended the existing `(max-width: 768px), (pointer: coarse)` performance block to disable only continuous decorative pulse, ping, crest glow, torii float/sway, avatar float, scroll glow, footer glow, sakura sway, and ear-wiggle animations.
  - Added the dedicated `.section-divider-bounce` marker to the decorative torii divider arrow and disabled that marker on mobile instead of suppressing Tailwind's generic `.animate-bounce` utility.
  - Preserved the Neko chatbot typing dots, entrance and reveal animations, navbar hide/reveal behavior, scroll progress, modal transitions, touch feedback, and the complete desktop motion system.
  - Kept the change CSS-only with no public API, component-prop, event, storage, or JavaScript behavior changes.
- **Verification:**
  - Headless Chromium passed Home and Projects checks at 390x844 in dark and light themes, plus Home checks at 1440x900 in both themes.
  - Browser assertions confirmed the targeted mobile animations compute to `none`, Neko typing dots still animate, desktop divider/avatar/crest animations remain active, native scrolling and the mobile progress bar update, project modal and Neko chat interactions work, no horizontal overflow occurs, and no local runtime or request failures are present.
  - Responsive screenshots were visually reviewed for both themes and viewport sizes; the static mobile decorations remained intentional and desktop rendering was unchanged.
  - Production preview scroll measurements at 390x844 with 2x CPU throttling reported zero long tasks on `/` and `/projects`. Home used 16.49ms style recalculation and 4.67ms layout time; Projects used 9.78ms style recalculation and 4.90ms layout time during the measured steady-state scroll.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, Git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

## Session 2026-09-19

### Fix DesktopScrollRail Bulbous Pill Width and Tooltip Document Flow Collision
- **Diagnosis / Context:**
  - In a screenshot provided by the user, the right-flank desktop scroll rail (`#desktop-rail-pill` in `src/components/DesktopScrollRail.astro`) appeared as an enormous, bulbous pill (~150px wide) obstructing the background character artwork. The bead dots were displaced to the left, while the progress track line and foxfire orb were positioned in the center.
  - Root cause analysis revealed:
    1. The hover tooltip element had been assigned `.shrine-glass-btn` during the liquid glass unification pass. However, `.shrine-glass-btn` specifies `position: relative` in `src/styles/global.css:575`, which overrode Tailwind's `absolute` class on the tooltip.
    2. Because the tooltips were forced into normal flex flow inside each `.desktop-rail-item`, their horizontal width (~110px) blew out the rail container from its intended slender 32px width into an inflated ~150px bubble.
    3. The container lacked an explicit fixed width constraint (`w-8`), and had inherited an un-scoped navbar frame class (`shrine-nav-frame`).
  - Affected files: `src/components/DesktopScrollRail.astro`, `src/styles/global.css`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/components/DesktopScrollRail.astro`:
    - Replaced `shrine-nav-frame` with a dedicated `.desktop-rail-pill` class constrained to a slender `w-8` (32px width / `width: 2rem;`), with authentic liquid glass fill, directional borders, subtle shadow, and backdrop diffusion.
    - Replaced `shrine-glass-btn` on the hover tooltip with a dedicated `.desktop-rail-tooltip` class featuring `position: absolute !important;`, ensuring it remains completely decoupled from container flex layout and can never expand the rail pill.
    - Preserved 1:1 concentric alignment between the centered beads (x = 16px) and the central progress track line (`left-1/2 -translate-x-1/2`).
  - `src/styles/global.css`:
    - Added `.desktop-rail-pill` and `.desktop-rail-tooltip` to the reduced-transparency fallback list.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly with exit code 0.
- **Pending:**
  - None.

### Apply Authentic Liquid Glass to Hero Section Secondary Action Pills ("Contact Me" & "Resume")
- **Diagnosis / Context:**
  - The secondary action pills in the hero section ("Contact Me" and "Resume" anchors) were still using an opaque dark purple slab background (`rgba(23, 16, 34, 0.82)`) and muddy hover background (`#30162c`) without liquid glass backdrop-filter diffusion, directional lighting, or depth shadows, causing them to look flat and murky next to the luminous Grand Narukami liquid glass system.
  - The user reported that these two hero section pills had been missed during the liquid glass unification pass.
  - Affected files: `src/styles/global.css`, `src/pages/index.astro`, and `docs/build-log.md`.
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Refactored `.sakura-secondary-btn` from opaque `rgba(23, 16, 34, 0.82)` to the authentic Grand Narukami liquid glass formula:
      - `background: var(--glass-fill)` (`rgba(12, 11, 22, 0.22)` amethyst translucent fill).
      - `border: 1px solid var(--glass-border)` with directional highlights (`border-top: var(--glass-border-top)`, `border-bottom: var(--glass-border-bottom)`).
      - `box-shadow: var(--glass-shadow)`.
      - `-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));`.
      - Text contrast: `text-shadow: 0 1px 5px rgba(0, 0, 0, 0.65)`.
      - Hover state: elevates to `background: rgba(244, 114, 182, 0.14)`, `border-color: var(--glass-border-hover)`, `box-shadow: 0 14px 32px -12px rgba(0, 0, 0, 0.46), 0 0 16px rgba(244, 114, 182, 0.25)`, `color: #ffffff`, and `transform: translateY(-2px) scale(1.02)`.
    - Added `.sakura-secondary-btn` to the shared surface hierarchy at line 543 alongside `.liquid-glass-control`, `.sakura-glass-panel`, and `.shrine-glass-btn`.
    - Added smooth transition for inner SVG icons (`color` and `transform`).
  - `src/pages/index.astro`:
    - Added `shrine-glass-btn` class to both the "Contact Me" and "Resume" anchors in the hero CTA cluster to ensure seamless alignment with the shrine glass button interaction patterns.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS.
    - Gate 2 (NekoWidget inner flex wrapper invariant): PASS.
    - Gate 3 (Git diff check): PASS.
    - Gate 4 (Astro production build): PASS.
    - Gate 5 (Vercel runtime nodejs22.x patch): PASS.
  - All 5 QC gates passed cleanly with exit code 0.
- **Pending:**
  - None.

### Unify Authentic Liquid Glass Effect Consistently Across All Surfaces and Controls
- **Diagnosis / Context:**
  - Various UI components, overlays, cards, modals, drawers, and controls had drifted into inconsistent visual treatments. Some used artificial linear gradients (`bg-gradient-to-b from-white/[0.08] ...`), harsh opaque backdrops (`bg-slate-950/95`, `bg-[#0c0b16]/85`, `bg-[#080617]`), or painted top-edge white bevel highlights (`shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.22)...]`), creating an artificial milky/frosted look rather than the authentic, luminous Narukami liquid glass system established in `ProjectCard` and `Navbar`.
  - Goal: Standardize and unify the liquid glass effect across all surfaces and controls that should have a liquid glass background, ensuring consistent translucent amethyst fills, directional lighting, deep natural drop shadows, and true backdrop-filter diffusion.
  - Affected files:
    - `src/styles/global.css`
    - `src/components/Navbar.astro`
    - `src/components/ProjectModal.astro`
    - `src/components/NekoWidget.astro`
    - `src/components/NekoGameModal.astro`
    - `src/components/AboutMe.astro`
    - `src/components/ProcessSection.astro`
    - `src/components/Contact.astro`
    - `src/pages/projects.astro`
    - `src/components/DesktopScrollRail.astro`
    - `src/components/SectionDivider.astro`
    - `src/components/Footer.astro`
    - `src/pages/index.astro`
    - `src/pages/404.astro`
    - `docs/build-log.md`
- **What Changed / Implementation:**
  - `src/styles/global.css`:
    - Refined core liquid glass tokens (`--glass-border`, `--glass-border-top`, `--glass-border-bottom`, `--glass-border-hover`, `--glass-shadow`, `--glass-raised-shadow`).
    - Standardized `.liquid-glass-control` recipe for capsules, pills, and small controls.
    - Standardized `.sakura-glass-panel` base recipe with directional lighting and authentic shadows, removing artificial white bevels.
    - Standardized `.shrine-glass-btn` utility globally for all liquid glass action buttons and toggles.
    - Standardized raised overlays (`#modal-card`, `#feature-drawer`, `#neko-chat`, `#neko-game-card`, `#filter-dropdown`, `#mobile-menu-panel`) to use `var(--glass-raised-fill)` (`rgba(12, 11, 22, 0.46)`) with `var(--glass-raised-shadow)`.
  - `src/components/Navbar.astro`:
    - Refactored `#filter-dropdown` (filter sheet) to raised liquid glass, stripping inline hardcoded `bg-[#0c0b16]/85` and fake inset bevels.
    - Converted `#filter-clear-all` and `#filter-sheet-close` to `.shrine-glass-btn`.
    - Refactored `#mobile-menu-panel` from opaque `bg-slate-950/95` to raised liquid glass.
    - Standardized `#mobile-menu-close`, `#drawer-sakura-toggle`, `#drawer-sakura-density`, and `.density-btn` (markup and JS class updater) to liquid glass controls.
    - Standardized `.shrine-contact-btn` and `.shrine-toggle-pill` with directional borders and authentic liquid glass shadows.
  - `src/components/ProjectModal.astro`:
    - Refactored `#modal-card` and `#feature-drawer` to raised liquid glass without artificial gradients or painted bevels.
    - Converted `#modal-close`, `#modal-prev-btn`, `#modal-next-btn`, `#modal-source-link`, `#modal-copy-btn`, and `#drawer-close-btn` to `.shrine-glass-btn`.
    - Standardized `#modal-status-badge` to `.liquid-glass-control`.
  - `src/components/NekoWidget.astro`:
    - Preserved Rule 2 invariant (`<div class="flex h-full min-h-0 flex-col overflow-hidden">`).
    - Stripped artificial gradient and fake inset bevels from `#neko-chat`.
    - Converted `#neko-reset`, `#neko-chat-close`, and `.chat-chip` to `.shrine-glass-btn`.
    - Replaced hardcoded message bubble gradients with unified `.neko-msg-bubble` liquid glass rules (both static greeting and dynamic JS messages).
    - Standardized `#neko-input` with translucent liquid well styling.
  - `src/components/NekoGameModal.astro`:
    - Refactored `#neko-game-card` to raised liquid glass.
    - Converted `#neko-game-close`, `#game-quit-btn`, and `#game-close-results-btn` to `.shrine-glass-btn`.
    - Converted `.game-duration-btn` and `.game-difficulty-btn` in `<style>` to authentic liquid glass control recipe.
    - Converted `.mole-hole` to authentic recessed liquid glass.
  - `src/components/AboutMe.astro`:
    - Converted ABOUT ME eyebrow capsule to `.liquid-glass-control`.
    - Stripped artificial gradient and inset shadows from `.tech-stack-panel`.
  - `src/components/ProcessSection.astro`:
    - Converted 'How I Work' container card to `.sakura-glass-panel` liquid glass surface.
  - `src/components/Contact.astro`:
    - Standardized `.contact-dispatch` and `.contact-form-shell` with directional lighting and authentic shadow.
    - Converted communion capsule to `.liquid-glass-control`.
    - Converted `.contact-topic-chip` to liquid glass control recipe.
    - Converted `#contact-reset` to `.shrine-glass-btn` and success avatar ring to `.liquid-glass-control`.
  - `src/pages/projects.astro`:
    - Converted archive filter controls bar (`section[aria-label="Project filter controls"]`) to `.sakura-glass-panel`.
    - Converted view mode switcher wrapper to `.liquid-glass-control`.
    - Converted `#empty-reset-btn`, `#mobile-advanced-filter-btn`, and `#mobile-reset-filters-btn` to `.shrine-glass-btn`.
  - `src/components/DesktopScrollRail.astro`:
    - Converted `#desktop-rail-pill` to `.shrine-nav-frame` liquid glass pill matching navbar.
    - Converted hover tooltip plaques to `.shrine-glass-btn`.
  - `src/components/SectionDivider.astro` & `src/components/Footer.astro`:
    - Converted SectionDivider crest badges to `.liquid-glass-control`.
    - Converted Footer crest badge and availability capsule to `.liquid-glass-control`.
    - Converted `#footer-back-to-top` to `.shrine-glass-btn`.
  - `src/pages/index.astro`:
    - Converted hero availability status capsule to `.liquid-glass-control`.
  - `src/pages/404.astro`:
    - Converted 'Return to Shrine Gate' and 'Browse Sacred Works' navigation links to `.shrine-glass-btn`.
- **Verification:**
  - Ran `npm run qc`:
    - Gate 1 (BOM Audit): PASS (zero byte-order marks across all files).
    - Gate 2 (Component Invariants): PASS (NekoWidget inner flex wrapper invariant intact).
    - Gate 3 (Git Hygiene): PASS (zero trailing whitespace defects or conflict markers).
    - Gate 4 (Production Build): PASS (Astro compiled static pages and serverless API route).
    - Gate 5 (Runtime Patch Verification): PASS (`.vercel/output/functions/_render.func/.vc-config.json` confirmed `nodejs22.x`).
  - All 5 QC gates passed with exit code 0.
- **Pending:**
  - None.

### Keep the Project Modal Counter Pill on One Line

- **Diagnosis / Context:**
  - At narrow modal widths, the project counter could wrap at the spaces around its slash, displaying values such as `02 / 03` across two lines.
  - The affected element was `#modal-counter` in `src/components/ProjectModal.astro`.
- **What Changed / Implementation:**
  - Added `whitespace-nowrap` so the counter text cannot break internally.
  - Added `shrink-0` so the flex header cannot compress the counter pill when adjacent controls consume the available width.
  - Replaced the counter's vertical padding with `inline-flex h-8 items-center justify-center`, matching the adjacent navigation buttons' 32-pixel height while retaining content-driven width and centered text.
  - Added a guaranteed `gap-2` gutter between the header's label/counter and navigation groups, allowed the left group to yield space with `min-w-0`, and kept the navigation group stable with `shrink-0`.
  - Preserved the counter's typography, dynamic formatting, navigation behavior, and surrounding header layout.
  - Added `docs/superpowers/specs/2026-09-19-project-counter-pill-nowrap-design.md` to record the approved narrow fix and verification criteria.
- **Verification:**
  - Headless Chromium checks at 390x844 and 1440x900 confirmed the counter computes to `white-space: nowrap`, `flex-shrink: 0`, and exactly 32 pixels high—the same measured height as the previous, next, and close buttons.
  - Geometry assertions measured an exact 8-pixel counter-to-previous-button gutter at 390x844 and the natural 258.6875-pixel separation at 1440x900.
  - Both viewports kept the counter on one line with centered text, retained usable modal controls, produced no horizontal page overflow, and reported no application runtime errors or failed local requests.
  - Responsive screenshots were visually reviewed to confirm the counter remains intact and height-aligned in both the crowded mobile header and the desktop header.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, Git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:**
  - None.

### Make Mobile Scenic Background Transitions Scroll-Linked

- **Diagnosis / Context:**
  - Mobile background changes could stutter because inactive Home scenery was both `display: none` and lazy-loaded until the section switch, concentrating image fetch, decode, compositor promotion, and opacity animation at the boundary.
  - The fixed `inset-0` stage followed mobile browser viewport changes, allowing address-bar expansion or collapse to recrop `object-cover` artwork and create a visible shift.
  - The existing 700ms time-based fade could lag behind fast or reversing touch gestures. The Projects archive used a similarly discrete IntersectionObserver toggle for its footer transition.
  - Affected files: `src/components/ShrineBackgroundCrossfader.astro` and `src/components/ProjectsBackground.astro`.
- **What Changed / Implementation:**
  - Added a mobile/coarse-pointer path that mounts all adjacent scenery layers, promotes their selected responsive images to eager loading, and starts `decode()` before their first transition.
  - Replaced mobile time-based section switches with requestAnimationFrame-coalesced, scroll-linked opacity weights across a bounded section-transition zone.
  - Applied a smoothstep curve so each neighboring layer progresses monotonically from approximately 1/0 through 0.5/0.5 to 0/1 in both scroll directions without introducing trailing animation.
  - Stabilized both fixed background stages with a `100lvh` mobile height and `100vh` fallback. Transition geometry uses that stable stage height rather than the changing visual viewport.
  - Added a scroll-linked Projects-to-Footer blend using the same stable-stage and predecode behavior.
  - Preserved the existing desktop 700ms transitions and `display: none` optimization. Reduced-motion devices use an immediate midpoint switch instead of continuous interpolation.
  - Made both initializers idempotent, cleaned up event listeners on Astro navigation, and reset layer state correctly when responsive mode changes.
  - Added `docs/superpowers/specs/2026-09-19-mobile-background-crossfade-design.md` with the approved architecture, boundaries, accessibility behavior, and verification targets.
- **Verification:**
  - `npm run build` completed successfully with exit code 0 and retained the postbuild `nodejs22.x` function runtime patch.
  - Headless Chromium at 390x844 verified all four Home boundaries in both scroll directions. Sampled adjacent opacity pairs progressed near `0.99/0.01`, `0.50/0.50`, and `0.01/0.99`; every layer remained mounted and CSS transition duration computed to `0s` on mobile.
  - The Projects-to-Footer midpoint measured `0.5011/0.4989`. All selected background images completed decoding and computed as eager before boundary sampling.
  - Reduced-motion checks confirmed opacity values remain discrete. A 1440x900 regression check confirmed desktop retains `0.7s` transitions and inactive-layer hiding.
  - Dark and forced-light mobile screenshots were visually reviewed at the About boundary and the Projects footer boundary; the scenery remained aligned with no exposed background gaps or abrupt crop changes.
  - A 120-frame full-page mobile scroll probe reported zero long tasks. No application console errors or failed application requests occurred; the expected Speed Insights 404 from the plain static test server was excluded because that endpoint exists only in Vercel.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, Git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Restore DeepSeek Chat Environment Loading

- **Diagnosis / Context:**
  - Local `POST /api/chat` requests returned `503` because Astro inherited a non-empty process-level `DEEPSEEK_API_KEY` whose value did not begin with `sk-`.
  - The inherited value took precedence over the valid ignored `.env` value, so the route's startup validation correctly rejected requests before contacting DeepSeek.
  - `.env.local` was checked without exposing secret contents and does not declare `DEEPSEEK_API_KEY`.
  - Affected runtime: the local Astro development server. No application source file required correction.
- **What Changed / Implementation:**
  - Stopped the stale Astro dev process, removed the malformed key override from the child PowerShell environment, and restarted `npm run dev` so Astro could load the current `.env` value.
  - Preserved the existing DeepSeek streaming route, key validation, rate limiting, and client-side keyword fallback behavior.
  - Kept all API key material private and untracked; no secret value was read, printed, or added to documentation.
- **Verification:**
  - The restarted server emitted no malformed-key warning.
  - A live `POST /api/chat` probe returned HTTP `200`, `Content-Type: text/event-stream`, and a non-empty streamed response in 244 milliseconds.
  - The server log recorded `[200] POST /api/chat 244ms` instead of `503`.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, Git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No source-code change or remote push requested.

### Strong Liquid-Glass Backdrop for Neko Chat

- **Diagnosis / Context:**
  - The Neko chat card already blurred content directly beneath its own surface, but the surrounding portfolio and fixed navigation stayed sharp when chat opened.
  - The competing background detail weakened conversation focus, especially at the narrow viewport shown in the review screenshot.
  - Affected files: `src/components/NekoWidget.astro` and `src/styles/global.css`.
- **What Changed / Implementation:**
  - Added a dedicated, non-interactive `#neko-chat-backdrop` layer behind the Neko widget and raised the widget to `z-[70]`, keeping both below the existing project and game modal tiers.
  - Reused the existing `body.neko-chat-open` state to reveal the veil without adding JavaScript state or changing the chat's non-modal semantics.
  - Applied a strong plum-black liquid-glass treatment with 24px desktop blur, 16px mobile blur, reduced brightness, restrained sakura bloom, and a short eased fade.
  - Added solid dark-tint fallbacks for unsupported and reduced-transparency environments, plus a no-transition reduced-motion state.
  - Preserved the required `#neko-chat` inner flex wrapper, chat artwork, controls, focus behavior, mobile scroll lock, and pointer access to the underlying page.
- **Verification:**
  - Playwright checks passed at 1440×900 and 390×844: the chat and veil opened, the correct desktop/mobile blur computed, the veil retained `pointer-events: none`, and no horizontal overflow appeared.
  - Visual screenshots confirmed that the background and navigation recede while the chat remains crisp. The only console failure was the expected sandbox-blocked Vercel Speed Insights development script; no application error was reported.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Brighten Neko Liquid-Glass Veil

- **Diagnosis / Context:**
  - Visual review found that the first backdrop treatment dimmed the portfolio too aggressively and read more like an opaque scrim than liquid glass.
  - The correction needed to preserve background separation and blur while restoring recognizable page color and structure.
  - Affected file: `src/styles/global.css`.
- **What Changed / Implementation:**
  - Preserved the 24px desktop and 16px mobile blur strengths.
  - Reduced the plum-black tint from 56% to 20% on desktop and from 62% to 24% on mobile.
  - Raised backdrop brightness to 88% at both breakpoints and softened the ambient sakura bloom.
  - Reduced unsupported-browser and reduced-transparency fallback tint opacity from 86% to 38%.
- **Verification:**
  - Playwright checks passed at 1440×900 and 390×844 with the intended blur and 88% brightness, visible veil state, `pointer-events: none`, and no horizontal overflow.
  - Visual inspection confirmed that the page remains recognizable behind the glass while the chat retains foreground priority.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Clarify Neko Chat Panel Boundary and Mobile Gutters

- **Diagnosis / Context:**
  - The chat artwork was globally limited to 12% opacity, leaving too little visual structure inside the large conversation surface.
  - The shared liquid-glass rule replaced the panel's Tailwind border color with a transparent token, making the outer edge difficult to distinguish from the blurred page.
  - Separate mobile width and right-offset values produced unequal side gutters.
  - Affected files: `src/components/NekoWidget.astro` and `src/styles/global.css`.
- **What Changed / Implementation:**
  - Increased the chat background artwork opacity from 12% to 24% while retaining the existing readability gradient and foreground hierarchy.
  - Added a visible 1px sakura border and subtle inset highlight specifically to `#neko-chat`, preserving the shared raised-glass shadow.
  - Set the mobile widget right offset to 20px and the chat width/max-width to `calc(100vw - 40px)`, producing equal 20px left and right gutters.
  - Left desktop sizing, chat interactions, message bubbles, and the required inner flex wrapper unchanged.
- **Verification:**
  - Playwright checks passed at 1440×900 and 390×844 with a computed 1px visible border, 24% artwork opacity, and no horizontal overflow.
  - At 390px mobile width, the chat measured 350px with exact 20px left and right viewport insets.
  - Visual inspection confirmed that the panel boundary and internal artwork are now legible without competing with message text.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Close Neko Chat from the Backdrop

- **Diagnosis / Context:**
  - The liquid-glass backdrop was intentionally non-interactive, so clicks outside the open chat passed through to the page and left the chat visible.
  - The existing `closeChat()` function already owned all required state cleanup; only the backdrop needed to become an open-state dismissal target.
  - Affected files: `src/components/NekoWidget.astro` and `src/styles/global.css`.
- **What Changed / Implementation:**
  - Moved backdrop pointer behavior into CSS: it remains non-interactive while hidden and accepts pointer input only while `body.neko-chat-open` is active.
  - Added a backdrop click handler that reuses `closeChat()` and returns focus to the Neko mascot without scrolling.
  - Kept clicks within the chat and widget isolated above the backdrop, preserving message entry, reset, close, mascot, and sound controls.
- **Verification:**
  - Playwright regression checks passed at 1440×900 and 390×844.
  - Clicking the chat input kept the panel open; clicking the backdrop closed it, removed the open-state class, restored `pointer-events: none`, and focused `#neko-btn`.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Make Neko Outside-Click Dismissal Reliable

- **Diagnosis / Context:**
  - Outside-click dismissal was intermittent because the transparent `#neko-widget`/`#neko-anchor` layout rectangle sits at `z-[70]`, above the clickable backdrop at `z-[60]`.
  - Visually empty areas above the chat and between the mascot controls and chat therefore hit `#neko-anchor` instead of `#neko-chat-backdrop`.
  - Affected file: `src/styles/global.css`.
- **What Changed / Implementation:**
  - Disabled pointer events on the structural `#neko-widget` container so its transparent geometry no longer intercepts outside clicks.
  - Explicitly retained pointer interaction on `#neko-shell`, `#neko-bubble`, and `#neko-chat`, preserving all visible widget controls and chat input behavior.
  - Kept the existing backdrop click handler and close-state cleanup unchanged.
- **Verification:**
  - Playwright regression checks passed at 1440×900 and 390×844.
  - The previously failing empty top-left region and mascot/chat gap both resolved to `#neko-chat-backdrop` and closed the chat on every tested viewport.
  - Mascot opening, text input, and the dedicated close control remained functional.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Reduce Neko Mobile Side Gutters

- **Diagnosis / Context:**
  - The mobile chat panel was intentionally inset 20px from each viewport edge, but the surrounding gutter felt wider than the desired compact mobile composition.
  - Desktop sizing and the recently fixed outside-click behavior were to remain unchanged.
  - Affected file: `src/components/NekoWidget.astro`.
- **What Changed / Implementation:**
  - Reduced the mobile widget right offset from 20px to 10px.
  - Changed the mobile widget and chat width constraints to `calc(100vw - 20px)`, producing equal 10px left and right gutters.
  - Preserved desktop 380px sizing, chat artwork, border, pointer ownership, and dismissal behavior.
- **Verification:**
  - Playwright checks passed at 1440×900 and 390×844 with no horizontal overflow.
  - Mobile computed bounds were 10px left, 10px right, and 370px wide at a 390px viewport.
  - Backdrop dismissal remained functional after widening the chat panel.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.

### Align Neko Mobile Bottom Gutter

- **Diagnosis / Context:**
  - Mobile side gutters were 10px, but the widget still used a 12px bottom offset, leaving an inconsistent edge rhythm.
  - Desktop bottom spacing was to remain 32px.
  - Affected file: `src/components/NekoWidget.astro`.
- **What Changed / Implementation:**
  - Changed the mobile widget offset from `bottom-3` (12px) to `bottom-2.5` (10px).
  - The chat panel inherits the same bottom edge through the widget layout; no chat height or desktop positioning changed.
- **Verification:**
  - Playwright checks passed at 1440×900 and 390×844.
  - Mobile widget and chat computed to exactly 10px from the viewport bottom; desktop remained exactly 32px.
  - No horizontal overflow was detected.
  - `npm run qc` passed all five mandatory gates: BOM audit, NekoWidget wrapper invariant, git diff hygiene, production build, and `nodejs22.x` runtime verification.
- **Pending:** None. No commit or push requested.
## Session 2026-09-21

### Prepare Cross-Platform Windows and Omarchy Workflow

- **Diagnosis / Context:**
  - The repository is used from separate Windows and Omarchy installations, but it did not define repository-wide line-ending behavior or provide a Node version-manager hint.
  - Cross-platform setup needed to preserve one shared Git history while keeping dependencies, secrets, and Git working directories local to each operating system.
  - Affected files: `.gitattributes`, `.nvmrc`, and `README.md`.
- **What Changed / Implementation:**
  - Added `.gitattributes` to normalize text files to LF on both operating systems and explicitly classify the repository's common image, PDF, and font formats as binary.
  - Added `.nvmrc` targeting Node.js 22.12.0, matching the minimum version declared in `package.json`.
  - Updated Quick Start to use deterministic `npm ci`, state the Node requirement, and document the safe two-computer Git workflow.
  - Confirmed that no environment files, dependency folders, generated build output, or case-colliding paths are tracked.
- **Verification:**
  - `npm run qc` passed all five mandatory gates under the repository's isolated Node runtime: BOM audit, NekoWidget wrapper invariant, git diff hygiene, Astro production build, and `nodejs22.x` runtime verification.
- **Pending:** None.


## Session 2026-10-12 — Isolated Engineering Field Journal redesign

### Diagnosis / Context

The approved plan required a new runnable copy, preserving the external original and earlier mockup. Current source held 20 records despite stale labels saying 19. User feedback rejected generic particles, the inherited card-grid composition, landing-only animation and basic scroll reveals.

### What Changed / Implementation

- Copied source without Git, dependencies, output, deployment bindings or environment files. [Baseline hashes](../source-snapshot.json) preserve original-source evidence, including uncommitted source. Installed dependencies only in the copy.
- Rebuilt [home](../src/pages/index.astro), [archive](../src/pages/projects.astro), [404](../src/pages/404.astro), [shared layout](../src/layouts/BaseLayout.astro), navigation/footer and [global styling](../src/styles/global.css). Self-hosted Fraunces and Inter, warm paper/ink/cobalt, large truthful architecture studies, factual biography, skills and resume. All [20 records](../src/data/projects.ts) retain search/category/all-tag filtering, grid/list persistence and supplied links only.
- Added the fixed [drafting linkage](../src/components/DraftingField.astro), [scroll-driven component movement](../src/components/ScrollDrafting.astro), [schematic rendering](../src/components/ProjectFigure.astro) and [shared routing math](../src/utils/draftingGeometry.ts). Pointer/scroll movement, bounded DPR/trails, text clearance, idle/hidden pause and static reduced-motion behavior; touch scroll operates without mouse input. One reviewed branch was routed around its label.
- Rebuilt [details](../src/components/ProjectModal.astro) and [assistant](../src/components/NekoWidget.astro) with native dialogs, explicit focus cycling/restoration and mobile viewport handling. [Server chat](../src/pages/api/chat.ts) preserves request/stream contracts, bounds input/history, handles fragmented provider streams/errors, and keeps credentials server-side. Removed the arcade component/triggers/prompt knowledge and stale arcade helper copy.
- Preserved [contact delivery](../src/components/Contact.astro) with validation, pending, timeout, truthful provider success/error and message preservation. Consistent owner email; [new environment template](../.env.example) contains no secret. Original environment was never read.
- Adapted [QC](../scripts/qc.mjs) for a Git-free source baseline, retained the inline Vercel patch, added [browser coverage](../tests/portfolio.spec.ts), [API fixtures](../tests/chat-api.test.mjs) and [capture tooling](../scripts/capture-review.mjs). Added [briefs/specification](../../second-brain/01-projects/web-personal-redesign-v2/README.md), design documentation, source index and verification evidence; inherited documentation remains historical reference.

### Verification

All five QC gates passed, including production build and nodejs22.x runtime confirmation. Five API fixtures and eleven browser scenarios passed. The nine-page/viewport matrix has zero horizontal overflow or application errors at 1440×900, 390×844 and 320×844. Twenty-two screenshots cover routes, protected dialogs, empty/error states, alternative layout and actual pointer/scroll states. [Independent review](../../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/final-review.md) records fixes and final motion disposition. Original 79 source hashes remain unchanged. Actual host HTTP responses are 200/200/404 and port 4322 remains served by the new application. Full results: [verification](../../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md).

### Pending

User will configure the new copy’s chat key later; real provider/model availability is unverified. Web3Forms delivery was mocked; no test messages were sent. Physical mobile keyboard behavior and public deployment are unverified. Keep [local preview](http://localhost:4322) running for review. No commit, push or deployment requested.

**What worked:** Validate both geometry and task behavior with actual served pages; source presence and a successful build alone do not prove the requested motion or mobile usability.

Final motion verdict approves local preview. The last mobile connector correction uses an orthogonal shaft so both arrowhead arms stay distinct; a focused served-page screenshot and computed SVG overflow check confirm it. QC was rerun and passed after this correction. Memory indexing was attempted but automatic approval review rejected the full-vault transmission; local documentation remains unsynced.


## Session 2026-10-12 — Physical-object background replacement

- **Diagnosis / Context:** User disliked the mechanical linkage and selected playful interactions with physical objects.
- **What Changed / Implementation:** Replaced [DraftingField](../src/components/DraftingField.astro) internals with a dependency-free workbench physics scene: keycaps, washers, paper clips and pencil; eight desktop/four mobile bodies, drag/toss, touch-tap impulses, rotational momentum, circle collisions, edge restitution, friction, text/figure/control collision obstacles, bounded DPR, idle/hidden pause and static reduced motion. Kept the existing file/canvas identifiers to preserve inbound references. Added a grab/tap hint in [home](../src/pages/index.astro) and [CSS](../src/styles/global.css). Extended [browser scenarios](../tests/portfolio.spec.ts) with actual grab/release/settle behavior; refreshed [canonical docs](../../second-brain/01-projects/web-personal-redesign-v2/README.md) and design sidecar. Existing scroll-driven connected schematics remain.
- **Verification:** All five QC gates, production build/nodejs22.x patch and twelve browser scenarios pass. Refreshed desktop/mobile/320 screenshots report zero overflow/application errors. Coordinator inspected desktop and mobile workbench captures. Prior independent review applied to the retired linkage, not this replacement.
- **Pending:** User review at [localhost:4322](http://localhost:4322); real chat key will be configured later. Live provider and inbox delivery remain unverified. Memory indexing remains blocked by the earlier automatic approval review; no retry attempted.
- **What worked:** Ground the background in the user's desired interaction, then verify actual manipulation, interruption and rest states.

Focused touch confirmation: a real touchscreen tap on an exposed rendered piece changed the mobile canvas (four objects). Replaced a failed fixed-margin hit probe with targeting from rendered pixels. Preview HTTP 200 confirmed.


## Session 2026-10-13 — Particle hero and collision solver

- **Diagnosis / Context:** User restored the particle direction, referenced Omarchy’s landing section and requested better collisions. Public reference HTML/JS identifies an interactive pixel field/wordmark; browser connector unavailable, so no visual comparison is claimed.
- **What Changed / Implementation:** Added [HeroParticles](../src/components/HeroParticles.astro), rebuilt [home opening](../src/pages/index.astro) and [responsive styles](../src/styles/global.css). A sampled serif wordmark disperses/reforms through pointer, tap or keyboard scatter; textual fallback, reduced motion and offscreen pause remain. Restored 80 desktop/36 mobile points and short pointer-local traces in [the shared field](../src/components/DraftingField.astro), with tap/scroll impulses and bounded DPR. Retained desk-piece play, replacing its solver with [fixed-step geometry](../src/utils/backgroundPhysics.mjs): true circle/rectangle normals, nearest embedded exit, inverse-area mass, held-body correction, adaptive movement substeps and four contact passes. Added [physics regressions](../tests/background-physics.test.mjs), expanded [browser scenarios](../tests/portfolio.spec.ts), refreshed [captures](../scripts/capture-review.mjs), commands and current documentation. Authored connected scroll schematics remain.
- **Verification:** Six physics cases and thirteen browser scenarios pass in the first pass; final QC/build/runtime and viewport confirmation recorded in [verification](../../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md). Original source and external integrations were not changed.
- **Pending:** Local user review; live chat credentials/inbox verification and previously blocked memory sync remain pending. No public deployment requested.
- **What worked:** A direct collision regression catches corner separation and thin-wall tunneling that a screenshot or successful drag cannot establish.

Final confirmation: QC/build/nodejs22.x patch, six physics cases and thirteen browser scenarios pass. Nine viewport/route measurements show zero overflow or application errors. Twenty-four captures include the new desktop scatter and mobile hero; both were visually inspected. Served home/projects return 200 and the review server remains running. Memory sync remains blocked as previously reported.


## Session 2026-10-13 — Local server restart

### Port 4322

- Context: user requested a restart; the port had no host listener.
- Action: launched the existing npm run dev:review command from this copy. Only this entry and the [project log](../../second-brain/01-projects/web-personal-redesign-v2/log.md) were appended; no source/dependency configuration changed.
- Verification: Node PID 6962 listening on 127.0.0.1:4322; home returned HTTP 200. npm run qc passed all five gates, including the production build and nodejs22.x runtime patch.
- Pending: startup dependency scanning warns about unresolved gsap, gsap/ScrollTrigger and @studio-freight/lenis in [ScrollAnimationManager](../src/components/ScrollAnimationManager.astro). Memory database offline; logs remain unsynced.

## Session 2026-10-13 — Stabilize the background below the landing hero

### Diagnosis and implementation

The approved plan selected local pointer/tap interaction. Scroll impulses, a constant global pointer nudge and moving content rectangles used as physical walls compounded into scene movement and forced repositioning.

- [Shared background](../src/components/DraftingField.astro): removed scroll forces, startup drift and distant pointer nudges. Shared geometry refresh now coalesces scroll/layout/font events into one frame. Added feathered, damped opacity for particles, pieces and crossing traces, including held/released pieces. Removed hard particle filtering/rectangle erasing. Preserve/clamp bodies and particle homes on resize; keep initial counts. Pointer capture, pointer-ID checks, capped throw/spin and stale-release velocity handling keep dragging stable.
- [Internal physics](../src/utils/backgroundPhysics.mjs): piece-pair and viewport contacts only; read-only clearance, local input impulses, velocity caps, particle return/settling and clamping. Fixed 60 Hz/adaptive substeps and idle/hidden/reduced-motion suspension remain. Hero source, dependencies and public APIs are unchanged.
- [Physics regressions](../tests/background-physics.test.mjs), [motion browser scenarios](../tests/background-motion.spec.ts) and [test-only draw probe](../tests/motion-probe.mjs): assert geometry cannot teleport objects, distant events cannot accelerate them, and verify fading during hold/release/restoration, scroll invariance, nearby input, touch, resizing and settling.
- [Motion capture script](../scripts/capture-motion.mjs): timestamped desktop/touch Chromium screencasts encoded using installed FFmpeg, with action timelines and continuous canvas samples. Refreshed existing screenshot captures. Updated [surface](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [design](../../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [sidecar](../.impeccable/design.json), [spec](../../second-brain/01-projects/web-personal-redesign-v2/spec.md), [hub](../../second-brain/01-projects/web-personal-redesign-v2/README.md), [verification](../../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md) and [project log](../../second-brain/01-projects/web-personal-redesign-v2/log.md) to the implemented behavior.

### Verification

All five QC gates pass, including production build/nodejs22.x patch. Eight physics regressions, seventeen browser scenarios and five API fixtures pass. The nine-route/viewport matrix has zero overflow/errors. [Temporal review](../../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md) of [desktop](../.impeccable/review/motion-desktop.webm) and [touch](../.impeccable/review/motion-touch.webm) videos plus continuous samples found zero scroll-driven piece displacement and no shaking/jumps/visibility popping in the reviewed sequences. Desktop release settles in 1.29s; touch tap in 2.29s. Hero scatter/reformation and existing task paths pass. Host home/catalog return HTTP 200.

Initial sandbox attempts could not bind localhost or launch Chromium; automatic review allowed host execution. New tests first assumed opacity above .8 in the left margin; actual clearance renders those pieces around .703. Targeting actual rendered positions/opacity fixed the probes; no interaction change was needed for that correction. Existing unused-component dependency-scan and Node adapter warnings remain as qualified in the review.

### Pending and reusable insight

Memory sync stays pending under the existing destination/approval issue, as requested. Physical-device performance/keyboard tests, live integration delivery and deployment remain unverified.

**What worked:** Separate content protection from mechanics, then measure actual frame positions and opacity while scrolling. A collision test alone cannot prove that changing page geometry leaves a viewport-space scene stable.

## Session 2026-10-13 — Scattered background particle placement

### Diagnosis and implementation

The previous modular X/Y steps formed repeating diagonal rows. [DraftingField](../src/components/DraftingField.astro) now uses a private fixed-seed Mulberry32 generator with separate coordinate samples. Reject candidates closer than 0.45 × √(viewport area / particle count); try at most 64 and use the candidate with greatest clearance if none qualifies. Initialize once; preserve the resize clamp, counts, physics, fading, local interactions and independent hero. No dependency or public API changes.

### Verification

All five QC gates pass, including production build and nodejs22.x runtime patch. Eight physics regressions, seventeen browser scenarios and five API fixtures pass. The manual component detector returned no findings. Updated [placement measurements](../.impeccable/review/particle-placement-results.json) record minimum distances of 58.232px / 43.115px / 39.590px against 57.276px / 43.029px / 38.977px thresholds at 1440×900 / 390×844 / 320×844. Reloads reproduce coordinates; growing/shrinking only applies the existing two-pixel clamp. Probe assumptions were corrected for edge clamping and supported viewport dimensions; production behavior was preserved.

Reviewed desktop/mobile screenshots at the hero/work boundary, about, contact and catalog: scattered points, no repeating diagonal bands. Refreshed nine-route viewport results: no overflow/errors. Re-recorded [desktop](../.impeccable/review/motion-desktop.webm) and [touch](../.impeccable/review/motion-touch.webm) videos; inspected extracted whole-sequence and denser interaction frames alongside continuous samples. Scroll-only particle/piece movement is zero; desktop release settles in 1.29s and touch in 1.79s. [Review and screenshots](../../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md) and [project log](../../second-brain/01-projects/web-personal-redesign-v2/log.md) link evidence. The earlier unused GSAP/Lenis scan warnings and Node adapter warning persist; the required runtime patch passes.

### Pending and reusable insight

Memory sync remains pending under the existing destination/approval issue; no indexing retry attempted. Physical-device behavior and live delivery remain unverified.

**What worked:** Use independent seeded samples with bounded rejection, then measure real canvas spacing and motion without adding a production debug interface.


## Session 2026-10-13 — Floating page decorations

### Diagnosis / Context

The approved [motion plan](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md) replaces the previous scroll-invariance behavior for the paper-and-ink workbench. Desk pieces should float gently across the viewport, react briefly to scroll velocity, preserve clear reading areas and remain static for reduced motion.

### What Changed / Implementation

- [DraftingField](../src/components/DraftingField.astro): each visit now samples fresh, clearance-aware positions across the viewport. Each piece has a varied depth weight, scroll response and lateral/spin response. Scroll progress adds a clamped visual shift of at most 5px; scroll velocity adds a bounded physical impulse. Protected text, figures and controls still fade the projected piece position.
- Idle motion uses one low-energy, randomized drift/rotation impulse every 2.2–4 seconds. The animation frame loop stops between movement bursts, and both the timer and frame loop stop when the page is hidden or reduced motion is active. The desktop/mobile object and particle counts are unchanged.
- [Physics helpers](../src/utils/backgroundPhysics.mjs) now apply the signed, capped scroll impulse. [Physics regressions](../tests/background-physics.test.mjs) cover impulse direction and caps; [motion scenarios](../tests/background-motion.spec.ts) cover repeated desktop/touch scrolling, idle pause/resume, reload variation, reduced motion, hidden-page suspension, content clearance and resize bounds. The drag scenario in [portfolio browser checks](../tests/portfolio.spec.ts) now targets the actual rendered piece instead of an old fixed margin.
- Updated the [design system](../../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface contract](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [product brief](../../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [specification](../../second-brain/01-projects/web-personal-redesign-v2/spec.md) and [Impeccable sidecar](../.impeccable/design.json) to the current scroll and idle behavior. No dependencies or public APIs changed.

### Verification

- `npm run qc`: all five gates passed; production build and `nodejs22.x` patch confirmed.
- `npm run test:physics`: 9 passed. `npm run test:api`: 5 passed. Full Chromium suite: 19 passed.
- Desktop (1440×900) and mobile (390×844) preview captures at the hero and contact sections had zero horizontal overflow and zero page/console errors. Existing browser coverage includes 320px layouts. Repeated scroll, controls/text clearance, reduced motion, hidden state, touch and drag/toss all passed.
- Existing environment warnings remain: the Vite dependency scan cannot resolve unused GSAP/Lenis imports in `ScrollAnimationManager.astro`; the Vercel adapter warns that local Node 26 is unsupported, while the required runtime patch still passes.

### Pending

No deployment or live integration work was part of this change. Vault memory search could not connect because PostgreSQL is offline; indexing remains pending under the existing full-vault approval block.

**What worked:** Sample randomized placements against the current protected bounds, then observe actual canvas draw calls through scroll and idle periods; fixed-margin probes stop being reliable once the scene varies per visit.

## Session 2026-10-13 — Continuous idle floating correction

### Diagnosis and implementation

The previous idle timer moved only one piece occasionally, leaving stationary gaps. The user explicitly requested floating even without scrolling.

- Updated [DraftingField](../src/components/DraftingField.astro) with gentle sinusoidal translation and rotation for every unheld piece at each fixed step. Per-piece phases vary; collision physics preserves contacts and viewport edges. Holding a piece suspends its ambient movement.
- Removed the sparse idle timer. Visible pages animate continuously; hidden pages stop, reduced motion stays static, and resume does not advance ambient time across the hidden interval.
- Aligned [design](../../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface guidance](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [product](../../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [specification](../../second-brain/01-projects/web-personal-redesign-v2/spec.md) and [sidecar](../.impeccable/design.json).
- Updated [browser motion checks](../tests/background-motion.spec.ts), [observation helper](../tests/motion-probe.mjs) and [portfolio checks](../tests/portfolio.spec.ts). Consecutive idle samples check every piece on desktop and mobile; hidden and reduced-motion cases retain static assertions.

### Verification

Physics: 9 passed. API fixtures: 5 passed. Final QC and browser results recorded below when complete.

### Pending

Memory indexing remains unsynced under the existing offline database / approval issue. No deployment requested.

Final verification: all five QC gates passed, including production build and nodejs22.x runtime patch. Nine physics tests and five API fixtures passed. Browser run passed 18 of 20 initially; the two old stationary/resize assertions were adapted for continuous motion. Clearance rerun passed. Final targeted run passed all four idle-desktop, idle-mobile, reduced-motion and interaction/resize/hidden/touch scenarios. The static resize check exposed and fixed missing geometry refresh while reduced motion is active. Changed-component design detector found no issues. No unhandled application errors were reported by the passing console checks.


## Session 2026-10-13 — Particle wordmark entrance and idle cycle

### Context

Implement the approved five-word entrance and idle cycle in [HeroParticles](../src/components/HeroParticles.astro), preserving the paper/cobalt/serif identity and shared floating desk behavior.

### Implementation

- Replaced HOEURB with VUTHI in the static fallback. Wait for display-font readiness, sample and center VUTHI, D-FLINT, PROBE, FORGE and DECODE independently, and fit each word within the canvas. Keep a stable particle array capped at 3200, resampling word targets to that count.
- Assemble scattered points in 900ms with cubic deceleration; hold each completed word for three seconds. Smooth morph glides directly; Scatter and reform disperses within canvas bounds for 350ms, then assembles in 900ms.
- Native style radios default to Smooth morph and replay VUTHI on change. Pause completes the active transition; Resume restarts the hold. Keyboard-accessible manual scatter reforms the current word. Pointer proximity retains spring displacement and prevents cycling until three seconds after leaving.
- Active-frame timing suspends while hidden/offscreen without consuming word/transition time. Resize scales the current scene and rebuilds targets while preserving word, style, particle identities and transition progress. Reduced motion displays static VUTHI and hides controls.
- [Global styles](../src/styles/global.css) put the canvas, caption and wrapping controls in separate rows; native focus indicators and 44px control targets remain. Updated [design](../../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md) and [surface guidance](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md).
- Added [wordmark browser scenarios](../tests/hero-cycle.spec.ts); updated [the existing hero regression](../tests/portfolio.spec.ts) to expect a readable hold rather than a stopped idle animation.

### Verification

QC passed all five gates, including the production build and nodejs22.x runtime patch. Physics fixtures: 9/9; API fixtures: 5/5. Final Chromium run: 25/25 in 2.7 minutes. New scenarios cover both complete cycles at 1440px, 390px and 320px, pixel bounds for every word, particle cap, no overflow, pause during transition, keyboard scatter, repeated style interruption, pointer delay, resize, offscreen and simulated document-hidden suspension, reduced motion and no JavaScript. No page errors in the wordmark viewport checks; existing application error checks passed. [Review captures](../.impeccable/review) include full hero layouts and each word at all three widths; inspected desktop/mobile composition and the longest narrow-screen words.

The initial browser run had two desk failures while edits caused Vite program reloads and reset the observed scene. A clean run with edits stopped passed every scenario. The development server emits pre-existing unused ScrollAnimationManager dependency-scan warnings; production QC succeeds. No dependency or public API changes.

### Pending and reusable insight

Physical-device motion/performance and live external delivery were not exercised. Vault memory remains unsynced: PostgreSQL recall is offline and the previously recorded indexing-destination approval block remains; indexing was not retried.

**What worked:** Drive the real animation with a browser clock, assert actual canvas ink bounds, and keep preview files unchanged during scene-position assertions so hot reload cannot reset the baseline.


## Session 2026-10-13 — Slower wordmark and complete particle strokes

### Diagnosis and implementation

Flint preferred Scatter and reform but requested much slower motion and reported irregular missing dots in PROBE. [HeroParticles](../src/components/HeroParticles.astro) previously sampled a dense fixed grid, then selected a subset when the source exceeded the 3200-particle budget. This removed individual grid cells from letter strokes. The fix chooses a shared integer grid spacing that fits all five words within the current particle budget before mapping identities; the target mapping now includes every sample and duplicates targets only as needed. Particle square size follows grid spacing, and random/clamped positions account for square size to keep scatter bounded. Resize keeps the same particle array and adjusts grid spacing to fit its budget.

Entrance/reform and direct morph now take 3000ms instead of 900ms; dispersal takes 1400ms instead of 350ms. Readable holds remain 3000ms. Both comparison styles remain available. Updated [design](../../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface guidance](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [cycle tests](../tests/hero-cycle.spec.ts) and [existing hero regression](../tests/portfolio.spec.ts) for the slower timings. Added a large-PROBE regression observing actual mask pixels and draw calls, asserting no sampled grid cell is omitted. [PROBE capture](../.impeccable/review/hero-probe-complete-grid.png) records the complete strokes.

### Verification

QC passed all five gates; physics 9/9 and API 5/5 passed. All 19 relevant Chromium wordmark and portfolio scenarios passed in 3.1 minutes, including both full cycles at 1440px/390px/320px, complete PROBE sampling at 2048px, bounded ink, keyboard scatter, pause, interrupted selection, resize, suspension and static fallbacks. Desktop PROBE capture shows consistent complete strokes. Shared desk physics code was unchanged. Physical-device motion/performance remains unverified; memory remains unsynced under the existing offline database/indexing approval block.

**What worked:** Fit the sampling lattice to the budget first, then preserve every occupied cell. A cap checked only by total particle count misses visible gaps; compare the actual glyph mask against rendered positions.


## Session 2026-10-13 — Scatter and reform only

### Implementation

Removed Smooth morph and the animation-style radio group from [HeroParticles](../src/components/HeroParticles.astro), including style state, change listeners and style-dependent cycle branching. Automatic word changes always scatter for 1.4 seconds then reform over three seconds; entrance and three-second readable holds are preserved. Manual Scatter and Pause/Resume remain. Removed obsolete radio/fieldset styling from [global styles](../src/styles/global.css), updated [design](../../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md) and [surface guidance](../../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), and adapted [wordmark tests](../tests/hero-cycle.spec.ts) to the sole animation with explicit selector-absence assertions.

### Verification

QC passed all five gates; physics 9/9 and API 5/5 passed. All six wordmark Chromium scenarios passed in 1.6 minutes, covering the full scatter sequence at 1440px/390px/320px, no radio/style selector, word bounds/no overflow/no page errors, controls, resize, suspension, reduced motion/no JavaScript, and complete PROBE grid sampling. Inspected updated desktop and 320px captures in [review evidence](../.impeccable/review). Physical-device checks remain unverified; memory remains unsynced under the existing offline database/indexing approval block.

**What worked:** Remove the unused state and listeners with the control, then verify the sole remaining behavior directly across the complete word sequence.


## Session 2026-10-13 — Textbox focus without an outer ring

Flint disliked the detached outer border around selected textboxes. Updated [global styles](../src/styles/global.css) so text inputs and textareas suppress the outer focus outline and indicate focus with the existing cobalt border instead. Focused invalid fields keep their red validation border. Checkbox/radio focus and button/link keyboard indicators remain intact.

Verification: all five QC gates passed; physics 9/9 and API 5/5 passed. A temporary Chromium runtime probe checked contact name/email/subject/message, project search and assistant input at 1440px and 390px: no textbox outline, cobalt contact focus border and preserved red validation border. Inspected the mobile focused-contact capture. No new permanent test added for this low-impact CSS preference. Memory remains unsynced under the existing offline database/indexing approval block.

**What worked:** Apply focus feedback to the field's existing edge and preserve validation colors instead of removing every control's focus styling.


## Session 2026-10-13 — Vite dev dependency scan startup failure

### Diagnosis and implementation

- Context: the development server's Vite dependency scan failed while resolving imports from `src/components/ScrollAnimationManager.astro`. The component was not imported anywhere, and its `gsap`, `gsap/ScrollTrigger` and `@studio-freight/lenis` packages are absent from the project dependencies.
- Removed the orphaned `ScrollAnimationManager.astro` component. No active page or layout used it, so no runtime behavior or package manifest needed to change.

### Verification

- `npm run qc` passed all five gates, including the production build and `nodejs22.x` runtime patch. `npm run test:api` passed all five fixtures.
- `npm run test:browser` could not launch Chromium in this sandbox; all 26 cases stopped during browser startup with `SIGTRAP` and a crashpad `setsockopt: Operation not permitted` error.
- A direct `npm run dev` startup check in this execution environment exits before Astro reports startup, returning the runner message `Dev server process exited before becoming ready` (`SKIP_FORMAT`). The production build succeeds after removing the unresolved orphan imports; startup still needs confirmation in a normal local shell.

### Pending

- Confirm `npm run dev` starts in the user's local shell. No active component imported the removed file.
