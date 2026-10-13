# Session log — web-personal redesign v2

[Hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) · [Spec](../second-brain/01-projects/web-personal-redesign-v2/spec.md) · [Product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md) · [Design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md) · [Surface](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md) · [Verification](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md) · [File map](../second-brain/01-projects/web-personal-redesign-v2/FILE-MAP.md)

## Session 2026-10-12

Copied the current external source, preserving its untracked ScrollAnimationManager. Excluded Git metadata, dependencies, build/deployment output and all environment files. Rebuilt home, projects, 404, project details, contact, assistant and shared layout in the approved paper/ink/cobalt identity. The current source contains 20 records; all remain. [Source snapshot](source-snapshot.json) records the baseline.

User rejected the first particle field and the inherited card-grid structure. Replaced the background with [an articulated drafting instrument](src/components/DraftingField.astro), and rebuilt [the archive](src/pages/projects.astro) around a sidebar and editorial ledger. The mobile diagram labels are readable HTML rather than reduced SVG text. Disabled the dev toolbar and added explicit keyboard Tab cycling to both dialogs.

QC and production build passed, including the nodejs22.x runtime patch. Five server/API fixture scenarios passed. Browser confirmation and clean screenshot review are in progress; see [verification](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md). Real provider chat and actual Web3Forms inbox delivery remain unverified.

**What worked:** Combining current-source record extraction with route-level browser checks preserved project facts while exposing a native-focus edge case and a development-only pointer overlay that a successful build missed.

### Linked implementation and inherited references

- [AGENTS.md](../second-brain/01-projects/web-personal-redesign-v2/AGENTS.md)
- [DESIGN.md](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md)
- [PRODUCT.md](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md)
- [README.md](../second-brain/01-projects/web-personal-redesign-v2/README.md)
- [SURFACE.md](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md)
- [VERIFICATION.md](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md)
- [agents-memory/Astro Portfolio - Architecture.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/Astro Portfolio - Architecture.md>)
- [agents-memory/Astro Portfolio - Setup.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/Astro Portfolio - Setup.md>)
- [agents-memory/Astro Portfolio - Tasks.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/Astro Portfolio - Tasks.md>)
- [agents-memory/Project MOC - Astro Portfolio.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/Project MOC - Astro Portfolio.md>)
- [agents-memory/Tailwind CSS.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/Tailwind CSS.md>)
- [agents-memory/architecture.md](../second-brain/01-projects/web-personal-redesign-v2/agents-memory/architecture.md)
- [agents-memory/service - Ambient Background.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Ambient Background.md>)
- [agents-memory/service - Astro Build Pipeline.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Astro Build Pipeline.md>)
- [agents-memory/service - Click Effects.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Click Effects.md>)
- [agents-memory/service - Contact Form.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Contact Form.md>)
- [agents-memory/service - Neko Chatbot.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Neko Chatbot.md>)
- [agents-memory/service - Project Catalog.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Project Catalog.md>)
- [agents-memory/service - Sakura Canvas.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Sakura Canvas.md>)
- [agents-memory/service - Scroll Reveal.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Scroll Reveal.md>)
- [agents-memory/service - Tailwind Styling.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Tailwind Styling.md>)
- [agents-memory/service - Theme Toggle.md](<../second-brain/01-projects/web-personal-redesign-v2/agents-memory/service - Theme Toggle.md>)
- [docs/about.md](../second-brain/01-projects/web-personal-redesign-v2/docs/about.md)
- [docs/build-log.md](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md)
- [docs/change.md](../second-brain/01-projects/web-personal-redesign-v2/docs/change.md)
- [docs/emoji-to-png-scope.md](../second-brain/01-projects/web-personal-redesign-v2/docs/emoji-to-png-scope.md)
- [docs/note.md](../second-brain/01-projects/web-personal-redesign-v2/docs/note.md)
- [docs/structure.md](../second-brain/01-projects/web-personal-redesign-v2/docs/structure.md)
- [docs/superpowers/specs/2026-08-23-sakura-petal-streaks-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-08-23-sakura-petal-streaks-design.md)
- [docs/superpowers/specs/2026-09-02-feature-drawer-scenic-background-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-02-feature-drawer-scenic-background-design.md)
- [docs/superpowers/specs/2026-09-02-mobile-project-list-default-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-02-mobile-project-list-default-design.md)
- [docs/superpowers/specs/2026-09-02-scroll-progress-orb-animation-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-02-scroll-progress-orb-animation-design.md)
- [docs/superpowers/specs/2026-09-02-shared-sakura-primary-button-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-02-shared-sakura-primary-button-design.md)
- [docs/superpowers/specs/2026-09-02-view-all-projects-button-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-02-view-all-projects-button-design.md)
- [docs/superpowers/specs/2026-09-03-contact-button-reference-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-03-contact-button-reference-design.md)
- [docs/superpowers/specs/2026-09-03-contact-dispatch-redesign-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-03-contact-dispatch-redesign-design.md)
- [docs/superpowers/specs/2026-09-03-navbar-mirrored-border-beam-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-03-navbar-mirrored-border-beam-design.md)
- [docs/superpowers/specs/2026-09-03-project-controls-slide-in-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-03-project-controls-slide-in-design.md)
- [docs/superpowers/specs/2026-09-03-scroll-rail-circuit-seals-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-03-scroll-rail-circuit-seals-design.md)
- [docs/superpowers/specs/2026-09-04-mobile-project-filter-fast-browsing-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-04-mobile-project-filter-fast-browsing-design.md)
- [docs/superpowers/specs/2026-09-04-project-link-integrity-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-04-project-link-integrity-design.md)
- [docs/superpowers/specs/2026-09-15-multi-customer-profile-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-15-multi-customer-profile-design.md)
- [docs/superpowers/specs/2026-09-17-about-highlights-corner-glow-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-17-about-highlights-corner-glow-design.md)
- [docs/superpowers/specs/2026-09-17-about-highlights-inner-depth-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-17-about-highlights-inner-depth-design.md)
- [docs/superpowers/specs/2026-09-17-about-highlights-liquid-glass-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-17-about-highlights-liquid-glass-design.md)
- [docs/superpowers/specs/2026-09-17-contact-focused-shrine-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-17-contact-focused-shrine-design.md)
- [docs/superpowers/specs/2026-09-17-desktop-scroll-rail-lag-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-17-desktop-scroll-rail-lag-design.md)
- [docs/superpowers/specs/2026-09-17-technical-stack-border-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-17-technical-stack-border-design.md)
- [docs/superpowers/specs/2026-09-18-contact-textbox-gradient-rim-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-18-contact-textbox-gradient-rim-design.md)
- [docs/superpowers/specs/2026-09-18-skeleton-loading-screen-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-18-skeleton-loading-screen-design.md)
- [docs/superpowers/specs/2026-09-19-mobile-background-crossfade-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-19-mobile-background-crossfade-design.md)
- [docs/superpowers/specs/2026-09-19-project-counter-pill-nowrap-design.md](../second-brain/01-projects/web-personal-redesign-v2/docs/superpowers/specs/2026-09-19-project-counter-pill-nowrap-design.md)
- [docs/tracker.md](../second-brain/01-projects/web-personal-redesign-v2/docs/tracker.md)
- [docs/unchanged.md](../second-brain/01-projects/web-personal-redesign-v2/docs/unchanged.md)
- [spec.md](../second-brain/01-projects/web-personal-redesign-v2/spec.md)


## Session 2026-10-12 — Motion and final local verification

Extended the [drafting field](src/components/DraftingField.astro) across all routes and scroll positions after user feedback. Added [scroll choreography](src/components/ScrollDrafting.astro), [component schematics](src/components/ProjectFigure.astro) and shared [wire geometry](src/utils/draftingGeometry.ts): scrolling opens exploded diagrams while wires track their moving endpoints. Mobile keeps labeled nodes and attached flow arrows; reduced motion is static. The archive is a sidebar-led editorial ledger, with a separate text grid. Removed lingering arcade wording from unused copied helpers.

Final [QC](scripts/qc.mjs), production build/runtime patch, five [API scenarios](tests/chat-api.test.mjs) and eleven [browser scenarios](tests/portfolio.spec.ts) passed. The [capture matrix](scripts/capture-review.mjs) covers desktop, mobile and 320px with zero overflow or application errors. [Independent review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/final-review.md) caught a wire crossing a sandbox label; side routing resolves it. Actual HTTP checks confirm home/projects/404 and the live preview at [localhost:4322](http://localhost:4322). All original source hashes and the untracked component are preserved.

The user will configure chat credentials later. Live provider chat, actual inbox delivery, physical mobile keyboard behavior and public deployment remain unverified. Configuration, commands and limitations are in the [hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) and [verification report](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md). The implemented design is recorded in [DESIGN](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md) and [its sidecar](.impeccable/design.json); see the [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md) and [complete file map](../second-brain/01-projects/web-personal-redesign-v2/FILE-MAP.md).

**What worked:** Test the actual scroll geometry and canvas lifecycle, rather than merely checking that animation classes exist. Use document client width for mobile overflow checks: a content-expanded innerWidth can hide the very overflow being tested.

Final independent motion verdict: approve local preview, both wire/connector findings resolved. Session-end memory indexing was rejected by automatic approval review because the full-vault destination was not verified as trusted; local Markdown changes remain unsynced. No indexing workaround was attempted.


## Session 2026-10-12 — Playful physical workbench

User rejected the mechanical-arm background and selected “Playful interactions with physical objects.” Replaced [the shared canvas](src/components/DraftingField.astro) with keycaps, hex washers, paper clips and a pencil: desktop grabbing/tossing, touch nudges, rotational motion, collisions, edge bounce, friction and scroll inertia. Eight desktop/four mobile pieces use text/figure/control obstacles; idle, hidden and reduced-motion behavior remain. Added a short grab/tap hint to [home](src/pages/index.astro) and corresponding [styles](src/styles/global.css). The authored scroll diagrams remain intact.

[Browser checks](tests/portfolio.spec.ts) now include actual pick-up, drag, release and settling; all twelve pass. QC and production/runtime verification pass. The [capture matrix](scripts/capture-review.mjs) was refreshed with zero viewport overflow/application errors. Updated [design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [sidecar](.impeccable/design.json), [surface](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [spec](../second-brain/01-projects/web-personal-redesign-v2/spec.md), [hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) and [verification](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md) to the actual implemented interaction. Original source and integrations were untouched. Memory remains unsynced under the earlier automatic-review block; no retry or workaround attempted.

**What worked:** Ask for the desired feeling after a rejected animation, then test that visitors can actually manipulate the chosen physical objects rather than only watching decoration.

Focused touch confirmation located an actual rendered piece and verified a tap changes its position. A fixed-margin coordinate probe was unsuitable for moving objects; targeting the rendered scene resolved the verification issue. Preview HTTP 200 confirmed.


## Session 2026-10-13 — Restored particles, reference-led hero and collision repair

User requested particle interaction back, an [Omarchy-like landing hero](https://omarchy.org/), and better collisions. Restored particles in [the shared background](src/components/DraftingField.astro); added [the hero wordmark](src/components/HeroParticles.astro) and rebuilt [the opening composition](src/pages/index.astro) in the existing paper/ink/cobalt identity. Pointer, tap and keyboard scatter disperse/reform the name; ambient points react throughout the site. [Styles](src/styles/global.css) handle desktop/mobile composition and readable fallback.

Extracted [collision geometry and stepping](src/utils/backgroundPhysics.mjs): fixed 60 Hz, radial corner normals, embedded-center exits, mass-weighted correction, held-body handling, adaptive movement substeps and repeated obstacle resolution after pair contacts. [Six meaningful regression cases](tests/background-physics.test.mjs) pass; [browser coverage](tests/portfolio.spec.ts) now includes the hero. Updated [captures](scripts/capture-review.mjs), [commands](package.json), [verification](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md), [canonical design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [sidecar](.impeccable/design.json), [surface](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [spec](../second-brain/01-projects/web-personal-redesign-v2/spec.md), [hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) and [file map](../second-brain/01-projects/web-personal-redesign-v2/FILE-MAP.md).

Roadmap grounding: Phase 1 remains active; October schedules OOP/RAII, TypeScript generics and typed forms, without a separate weekly milestone. This work stays in the isolated portfolio copy. Original source, contact/chat contracts and earlier mockup are preserved.

**What worked:** Inspect the reference’s actual public implementation before interpreting “like this,” and test collision geometry/energy separately from the visual interaction. The old side-based correction mishandled corners; single-pass pair resolution could push bodies back into text.

Final confirmation: five QC gates/build/runtime pass, six collision regressions pass, thirteen browser scenarios pass, and the nine-route/viewport matrix has zero overflow/application errors. Reviewed [desktop scatter](.impeccable/review/hero-particles-scattered.png) and [mobile hero](.impeccable/review/mobile-hero.png) together. Actual home/projects HTTP 200 and running port 4322 confirmed. Memory remains unsynced under the prior automatic approval block, with no retry attempted.


## Session 2026-10-13 — Restart local dev server

Port 4322 had no listener. Started the existing [review command](package.json) from the isolated copy; verified the Node listener on 127.0.0.1:4322 and HTTP 200 at [the local preview](http://localhost:4322/). All five QC gates passed. Startup dependency scanning reported unresolved gsap, gsap/ScrollTrigger and @studio-freight/lenis imports in [ScrollAnimationManager](src/components/ScrollAnimationManager.astro); no source or dependency changes were made. See [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md).

Roadmap grounding: Phase 1 is active; October covers OOP/RAII, TypeScript generics and typed forms, with no separately scheduled weekly milestone. Memory retrieval was unavailable because PostgreSQL was offline; local Markdown remains unsynced.

**What worked:** Check the actual port listener and HTTP response after starting the documented foreground review command.

## Session 2026-10-13 — Stable local-input background

Implemented the approved stabilization in [the shared field](src/components/DraftingField.astro) and [internal physics](src/utils/backgroundPhysics.mjs). Scroll applies no force; pointer input has local support. Content clearance now fades pieces, particles and traces instead of relocating them, including while dragging/released. Geometry refresh is coalesced per frame; resize preserves/clamps the scene. Counts, artwork, hero interaction, fixed steps, speed limits and idle/hidden/reduced-motion support remain.

Eight [physics regressions](tests/background-physics.test.mjs), seventeen browser scenarios including [four motion checks](tests/background-motion.spec.ts), five API fixtures and all five QC gates pass. The [test-only probe](tests/motion-probe.mjs) captures actual canvas draws without a production API; the [recording script](scripts/capture-motion.mjs) produces temporal evidence. The [review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md), [desktop video](.impeccable/review/motion-desktop.webm), [touch video](.impeccable/review/motion-touch.webm), [desktop timeline](.impeccable/review/motion-desktop-actions.json), [touch timeline](.impeccable/review/motion-touch-actions.json), [continuous samples](.impeccable/review/motion-samples.json) and [summary](.impeccable/review/motion-summary.json) show zero scroll-only piece displacement; release/tap settle in 1.29s/2.29s. Video frame sequences show no shaking, jumps or clearance popping. Refreshed viewport matrix: zero overflow/errors. Home/catalog HTTP 200. [Build details](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md) and [verification](../second-brain/01-projects/web-personal-redesign-v2/VERIFICATION.md) record scope and warnings.

Memory sync remains pending under the earlier destination/approval block; no retry attempted. Physical hardware and live delivery remain unverified.

**What worked:** Treat moving reading geometry as a read-only opacity mask, then verify continuous rendered positions and fades through scroll, drag and release instead of relying on screenshots.

## Session 2026-10-13 — Remove diagonal particle rows

Replaced evenly stepped coordinates in [the shared field](src/components/DraftingField.astro) with independent seeded X/Y samples, the requested 0.45 × √(area/count) spacing and 64-candidate greatest-clearance fallback. Placement runs only at initialization; no dependencies or public APIs were added. Existing resize clamping, local forces, fading, counts and hero behavior remain.

Eight physics regressions, seventeen browser scenarios, five API fixtures and all five QC gates pass. [Placement measurements](.impeccable/review/particle-placement-results.json) verify reproducible reloads and viewport-only clamping at 1440, 390 and 320px. The nine-route matrix has zero overflow/errors. [Visual and motion review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md) finds no repeating diagonal bands in the eight captures below. Refreshed [desktop](.impeccable/review/motion-desktop.webm) and [touch](.impeccable/review/motion-touch.webm) recordings plus [continuous summary](.impeccable/review/motion-summary.json) show zero scroll-only particle/piece movement; release/tap settles in 1.29s/1.79s. See [build details](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md).

| Viewport | Boundary | About | Contact | Catalog |
| --- | --- | --- | --- | --- |
| Desktop | [Boundary](.impeccable/review/scatter-desktop-boundary.png) | [About](.impeccable/review/scatter-desktop-about.png) | [Contact](.impeccable/review/scatter-desktop-contact.png) | [Catalog](.impeccable/review/scatter-desktop-catalog.png) |
| Mobile | [Boundary](.impeccable/review/scatter-mobile-boundary.png) | [About](.impeccable/review/scatter-mobile-about.png) | [Contact](.impeccable/review/scatter-mobile-contact.png) | [Catalog](.impeccable/review/scatter-mobile-catalog.png) |

Roadmap grounding: Phase 1 remains active; October covers OOP/RAII, TypeScript generics and typed forms, without a separate current weekly milestone. Memory sync remains pending under the existing destination/approval issue; no retry attempted. Physical-device checks and live integration delivery remain unverified.

**What worked:** Sample each coordinate independently, then verify real rendered distances and reproducibility separately from content-clearance opacity. Keep resize assertions faithful to the existing two-pixel clamp.


## Session 2026-10-13 — Floating page decorations

Updated the shared [drafting field](src/components/DraftingField.astro) and its [physics helpers](src/utils/backgroundPhysics.mjs): every visit gets a fresh clearance-aware arrangement, idle drift/rotation arrives in small pulses, scroll velocity adds a bounded nudge, and page progress adds a smaller clamped depth shift. Text/control fading, responsive counts, hidden-page suspension and reduced-motion static behavior remain. Updated the [design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md), [product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md), [specification](../second-brain/01-projects/web-personal-redesign-v2/spec.md) and [Impeccable sidecar](.impeccable/design.json). Detailed implementation and evidence: [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md).

`npm run qc` passed all five gates, nine physics tests and five API fixtures passed, and all 19 Chromium scenarios passed. Desktop/mobile hero and contact captures had no overflow or console errors. Memory search remains unsynced because PostgreSQL is offline; existing indexing approval block remains in place.

Roadmap grounding: Phase 1 is active; October covers OOP/RAII, TypeScript generics and typed forms, without a separately scheduled weekly milestone.

**What worked:** When positions become random per visit, target the visible rendered object in browser checks rather than assuming a specific margin coordinate.

## Session 2026-10-13 — Continuous floating while idle

Corrected the previous sparse pulses in the [drafting field](src/components/DraftingField.astro): every unheld piece now gently translates and rotates continuously while visible, without scrolling. Hidden-page suspension, static reduced motion, scroll response, edge constraints and opacity clearance remain. Updated guidance and browser checks; details in the [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md#session-2026-10-13--continuous-idle-floating-correction).

Roadmap grounding: Phase 1 remains active; October covers OOP/RAII, TypeScript generics and typed forms, with no separately scheduled weekly milestone. Memory indexing remains unsynced under the existing offline database / approval issue.

**What worked:** Verify idle animation with several consecutive stationary-scroll samples of every piece; a single eventual change can incorrectly validate sparse pulses.

Verification: QC passed all five gates; physics 9/9 and API 5/5 passed. All 20 browser scenarios passed across the initial run and targeted reruns after assertion updates and the reduced-motion resize fix.


## Session 2026-10-13 — Particle wordmark entrance and idle cycle

Implemented the approved VUTHI → D-FLINT → PROBE → FORGE → DECODE cycle in [HeroParticles](src/components/HeroParticles.astro), with 900ms entrances/morphs, three-second holds, the optional 350ms scatter stage, native style selection, Pause/Resume and keyboard scatter. Resize preserves the scene; hidden/offscreen timing suspends; reduced motion and no JavaScript retain VUTHI. Updated [styles](src/styles/global.css), [design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md) and [surface guidance](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md). Added [cycle browser coverage](tests/hero-cycle.spec.ts) and updated the [existing hero regression](tests/portfolio.spec.ts). Details and capture references: [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md#session-2026-10-13--particle-wordmark-entrance-and-idle-cycle).

Verification: QC passed all five gates; physics 9/9, API 5/5, and final Chromium browser scenarios 25/25. Both complete cycles and every word's ink bounds passed at 1440px, 390px and 320px. Desktop/mobile captures were inspected. Two initial desk failures coincided with development-server reloads during edits; the clean full rerun passed. Physical-device performance remains unverified.

Roadmap grounding: Phase 1 remains active; October covers OOP/RAII, TypeScript generics and typed forms, with no separate weekly milestone scheduled. Memory remains unsynced because PostgreSQL is offline and the previously recorded indexing approval block remains in place.

**What worked:** Use browser-clock control for cycle timing and actual canvas ink bounds for clipping; stop editing preview files while measuring continuous scene state.


## Session 2026-10-13 — Slower scatter and repaired wordmark holes

Updated [HeroParticles](src/components/HeroParticles.astro): dispersal is now 1.4 seconds and reform/morph three seconds, with the existing three-second readable hold. Missing dots came from dropping sampled cells to meet the cap; sampling now selects a complete coarser grid that fits the budget and preserves every occupied cell. Updated [design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface guidance](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md) and [browser checks](tests/hero-cycle.spec.ts). Details: [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md#session-2026-10-13--slower-wordmark-and-complete-particle-strokes). [PROBE evidence](.impeccable/review/hero-probe-complete-grid.png).

Verification: QC all five gates; physics 9/9; API 5/5; relevant Chromium suite 19/19. Both complete cycles passed at desktop/390px/320px, plus a large-PROBE mask-to-render check proving no omitted sampled dots. Memory remains unsynced under the existing offline database/indexing approval block.

**What worked:** Fit a complete lattice to the particle budget before mapping particle identities; count-only checks cannot detect missing stroke cells.


## Session 2026-10-13 — Remove morph and animation selection

Removed Smooth morph, its selector, state/listeners and obsolete control styles. [HeroParticles](src/components/HeroParticles.astro) now always uses the slower Scatter and reform cycle; manual Scatter and Pause/Resume remain. Updated [design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md), [surface guidance](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md) and [wordmark scenarios](tests/hero-cycle.spec.ts). Details: [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md#session-2026-10-13--scatter-and-reform-only).

QC passed all five gates; physics 9/9, API 5/5 and wordmark browser checks 6/6 passed. Desktop/390px/320px full cycles, selector absence, controls, static fallbacks and complete grid sampling passed; desktop/320px captures were inspected. Memory remains unsynced under the existing offline database/indexing approval block.

**What worked:** Delete the obsolete behavior along with its selector, then assert both selector absence and the complete remaining cycle.


## Session 2026-10-13 — Remove textbox outer focus border

Updated [global styles](src/styles/global.css): selected textboxes use their existing cobalt border without the detached outer outline; invalid fields retain red. Other controls keep their keyboard focus indicators. Details: [build log](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md#session-2026-10-13--textbox-focus-without-an-outer-ring).

QC all five gates, physics 9/9 and API 5/5 passed. Chromium runtime checks passed for contact, project search and chat fields at desktop/390px; mobile focused-contact capture inspected. Memory remains unsynced under the existing offline database/indexing approval block.

**What worked:** Reuse the field border as the focus indicator while preserving the error state.


2026-10-13: Removed orphaned `src/components/ScrollAnimationManager.astro`, which had undeclared GSAP/Lenis imports and caused the known Vite dependency-scan failure. All QC gates and five API fixtures pass. The browser suite could not launch Chromium in this sandbox, and the execution runner exited `npm run dev` before Astro reported startup; verify dev startup in a normal local shell. Details: [build log](docs/build-log.md).
