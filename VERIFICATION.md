# Verification record

## Scope

The runnable application is the new copy, reviewed through `http://localhost:4322`. The original portfolio and earlier mockup are preserved. Source hashes are recorded in [the source snapshot](source-snapshot.json).

## Current results

All five QC gates passed, including production build and the required `nodejs22.x` Vercel function patch. Five API fixture scenarios, seventeen Chromium browser scenarios and eight physics regressions pass after background stabilization. [The temporal review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md) includes desktop/touch recordings and continuous position/opacity measurements. The nine-route/viewport matrix (1440×900, 390×844, 320×844 across home, projects and 404) reports zero horizontal overflow and zero application errors; self-hosted display fonts loaded. Twenty-four screenshots include dialogs, recovery states, the alternate archive view, pointer motion, scroll-open diagrams, mobile scroll motion and background persistence through biography and archive.

Host HTTP verification returned home 200, projects 200 and custom missing-page 404. The actual review server is available at 127.0.0.1:4322; home and catalog returned HTTP 200 on 2026-10-13. The copy contains no Git metadata or actual environment file. All 79 baseline original-source hashes are unchanged; the untracked original ScrollAnimationManager is also preserved in the copy.

The local Node 26/Vercel adapter warning is followed by the verified postbuild runtime patch; public deployment has not been attempted. Browser checks use Chromium emulation; physical-device soft-keyboard and performance profiling remain unverified.

## Repeatable checks

[Browser scenarios](tests/portfolio.spec.ts) cover navigation, all records, actual PDF resume access, external link presence/absence, combined search/category/technology filters, empty recovery, persistence, keyboard shortcuts, dialog focus and restoration, contact validation/pending/failure/success recovery, chat configuration/provider/empty-response failures and retry, mobile panel bounds, 320px overflow, touch/reduced motion, sitewide workbench lifecycle, scroll-driven component geometry with attached path starts, touch-driven scrolling, and actual grab/toss/release/settle behavior.

[API fixtures](tests/chat-api.test.mjs) verify invalid requests, bounded provider payloads, fragmented Unicode stream decoding, final SSE line handling, provider refusal/interruption/network failures, per-IP minute limits and explicit missing-key responses. Fixtures use an invented non-secret test key and intercept provider fetches; they do not establish real provider availability.

[Capture script](scripts/capture-review.mjs) captures home, projects and 404 at 1440×900, 390×844 and 320×844. Screenshots and measurements are stored in [.impeccable/review](.impeccable/review). Native mobile soft keyboards are represented by visual-viewport handling in source and reduced viewport checks; physical-device testing remains outside this local Chromium run.

## External integrations and links

- The user will configure the new copy’s environment later. Real chat is blocked until a new-copy `DEEPSEEK_API_KEY` is configured. No original environment file was read or copied. Model availability is also unverified against a real account.
- Web3Forms success, HTTP failure, false-success and network recovery are mocked to avoid sending test messages to the owner. Actual inbox delivery is unverified.
- Existing portfolio, GitHub and LinkedIn URLs each returned HTTP 200 through host-network `curl -L` on 2026-10-12. Reachability does not independently establish ownership or all project claims. No new project/demo/repository links were fabricated.
- Memory recall failed because PostgreSQL was offline. Session-end vault indexing was attempted but automatic approval review rejected the full-vault scan/transmission because the configured PostgreSQL/pgvector destination was not established as trusted. Markdown remains unsynced; no workaround or alternate transmission was attempted.

## Design review

The manual detector produced one advisory for source-preserved Inter. It was retained intentionally as the body face, with self-hosted Fraunces for display. An independent Impeccable review requested clean recaptures, readable mobile schematics and removal of heading eyebrows. Mobile schematics now use readable HTML nodes instead of shrunken SVG labels; taxonomy follows project headings. User feedback also prompted the full archive composition and background replacement.

[Hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) · [Spec](../second-brain/01-projects/web-personal-redesign-v2/spec.md) · [Log](../second-brain/01-projects/web-personal-redesign-v2/log.md)

Final visual decisions and the focused motion verdict are recorded in [the independent review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/final-review.md).

The final motion review approves local preview. The sandbox wire clears its label; mobile arrowheads are visible after orthogonal connector routing. A focused served-page check confirms connector SVG overflow is visible.

## Physical-workbench replacement

The user rejected the mechanical-arm background and chose playful physical objects. The coordinator replaced it with eight desktop/four mobile desk pieces, rotation/collisions/friction, grab/toss, touch nudges and scroll inertia. Twelve browser scenarios and all five QC gates pass. The same desktop/mobile/320 screenshot matrix was recaptured, with zero overflow or application errors. The previous independent motion verdict concerns the retired linkage; this workbench change received coordinator visual and behavioral verification, not a new independent verdict. Live integrations remain unchanged and unverified as stated above.

A focused Chromium touch check located an exposed rendered workbench piece and confirmed that touchscreen.tap changed the canvas, with four mobile objects. An earlier fixed-margin hover probe found no piece; it was replaced with selection from actual rendered pixels. The preview returned HTTP 200 after the update.

## 2026-10-13 — Particle restoration and Omarchy-inspired hero

The current hero replaces the earlier two-column schematic opening with a large particle wordmark above the engineering headline, introduction and actions. Inspected [Omarchy](https://omarchy.org/) and its public HomePage/HeroShader/HeroPixelField assets: the reference uses a pixel field and bitmap wordmark. This implementation samples Hoeurb’s own self-hosted type and uses its own interaction/physics code; no reference logo, source code or brand assets were copied. The reference browser connector was unavailable, so reference evidence came from public HTML/JS, rather than a claimed visual browser comparison.

The shared background restores pointer-responsive particles, tap impulses and short local traces, while retaining playful desk pieces. Added [six collision regressions](tests/background-physics.test.mjs) for corner normals, embedded centers, coincident bodies, held-body separation, separating contacts, fast thin-wall throws and settling. Run with `npm run test:physics`. Thirteen browser scenarios cover existing task paths plus wordmark dispersal, keyboard control, reformation, reduced motion and offscreen pause. Final QC and screenshot confirmation are recorded below. The earlier independent review remains historical; this pass is coordinator verification. Live integration and memory-sync blockers are unchanged.

Final confirmation: all five QC gates pass, including production build/nodejs22.x runtime patch. Six physics regressions and thirteen browser scenarios pass. The nine-route/viewport matrix reports zero overflow/application errors; desktop scatter and mobile hero captures were inspected together. Actual host home/projects requests return HTTP 200; the new-copy preview remains running at port 4322. Memory indexing remains unsynced under the earlier automatic approval block; no retry was attempted without approval.

## 2026-10-13 — Stable local-input background

Removed scroll impulses and global pointer nudges. Content geometry now drives smooth opacity clearance instead of physical collision correction, including during drag/release. Bounds refresh is coalesced per frame; font-loading and layout events invalidate the cache. Resize preserves/clamps the existing scene. Fixed-step physics, velocity caps, pair/wall contacts, idle/hidden/reduced-motion behavior and the hero interaction remain. No dependencies or production public/debug APIs were added.

All 17 browser scenarios, 8 physics regressions, 5 API fixtures and 5 QC gates pass. Updated viewport captures report zero overflow/errors. [Desktop video](.impeccable/review/motion-desktop.webm) and [touch video](.impeccable/review/motion-touch.webm) were reviewed as temporal frame sequences, with continuous draw-call evidence: scroll-only piece displacement is exactly zero; recorded desktop release and touch tap settle in 1.29s and 2.29s. [The detailed review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md) records scope, measurements and reproducible commands. Memory sync remains pending; no retry was attempted.

## Diagonal particle rows removed — 2026-10-13

Independent seeded coordinate samples replace the modular stepping in [DraftingField](src/components/DraftingField.astro), with the approved minimum spacing and 64-candidate greatest-clearance fallback. [Placement and motion review](../second-brain/01-projects/web-personal-redesign-v2/.impeccable/review/background-motion-review.md) links eight desktop/mobile captures and [measurements](.impeccable/review/particle-placement-results.json). No diagonal bands were observed at hero/work, about, contact or catalog. Reloads reproduce positions, resize only clamps and scroll-only particle/piece displacement is zero. Refreshed recordings settle in 1.29s desktop / 1.79s touch. Eight physics tests, seventeen browser scenarios, five API fixtures and all five QC gates pass; the nine-route viewport matrix remains free of overflow/application errors. Memory sync remains pending under the existing approval issue.


## 2026-10-13 — Floating page decorations

This motion update supersedes the earlier scroll-invariance measurements above. Scroll velocity now gives desk pieces a small bounded impulse and page progress adds a smaller visual depth shift. Placement and low-energy idle drift vary on each visit; the frame loop rests between drift bursts. Clearance still only changes opacity, and reduced motion remains static.

All five QC gates pass. Nine physics regressions, five API fixtures and 19 Chromium scenarios pass. Desktop/mobile hero and contact checks at 1440×900 and 390×844 show zero horizontal overflow or browser console errors; the suite also retains the 320px check.

## 2026-10-13 — Continuous idle floating

Every unheld desk piece moves in three consecutive idle samples on desktop (1440px) and mobile (390px), with stationary scroll position and bounded displacement. Reduced motion remains fixed through scrolling; hidden pages stop drawing and resume; reduced-motion resize now refreshes geometry and clamps existing pieces. QC: five gates passed. Physics: 9 passed. API: 5 passed. Browser: all 20 scenarios passed across the main run and targeted reruns. No new console errors in the lifecycle/scroll checks. [Implementation details](../second-brain/01-projects/web-personal-redesign-v2/docs/build-log.md#session-2026-10-13--continuous-idle-floating-correction). Memory indexing remains pending under the existing database / approval issue.


## 2026-10-13 — Wordmark cycle verification

The final full Chromium run passed 25/25 scenarios in 2.7 minutes; physics fixtures passed 9/9 and API fixtures 5/5. QC passed all five gates. [Wordmark scenarios](tests/hero-cycle.spec.ts) exercise both full word sequences at 1440px, 390px and 320px, assert every word's painted bounds and the 3200 cap, and cover interrupted style changes, pause/keyboard scatter, pointer delay, resize, offscreen/simulated-hidden suspension, reduced motion and no-JavaScript fallback. [Hero captures](.impeccable/review) include full viewport layouts and each word at each width. All wordmark viewport checks report zero page errors and horizontal overflow; desktop/mobile layouts and longest narrow-screen words were visually inspected. Hidden state is simulated through document.hidden plus visibilitychange; physical-device profiling remains outside this Chromium run. The first run was invalidated by preview reloads during edits; the final full run had no failures.


## 2026-10-13 — Slower timing and missing-dot regression

Updated timing to 1400ms scatter and 3000ms assembly/morph; holds remain 3000ms. QC, physics 9/9 and API 5/5 passed. All 19 relevant wordmark/portfolio Chromium scenarios passed in 3.1 minutes. [The new mask-to-render regression](tests/hero-cycle.spec.ts) verifies large PROBE omits zero sampled grid cells; [capture](.impeccable/review/hero-probe-complete-grid.png). Both styles passed full cycles and ink-bound checks at 1440px, 390px and 320px. The previously run shared-background scenarios were not repeated; their physics implementation was unchanged.


## 2026-10-13 — Scatter-only wordmark

QC all five gates, physics 9/9 and API 5/5 passed. All six [wordmark browser scenarios](tests/hero-cycle.spec.ts) passed in 1.6 minutes after removal of Smooth morph and the style selector. Full Scatter and reform sequences passed at 1440px/390px/320px, with no style radios, overflow or page errors; remaining controls, resize, suspension, static fallbacks and complete PROBE sampling also passed. Inspected updated desktop and 320px [review captures](.impeccable/review). Unrelated portfolio/background browser scenarios were not repeated for this removal.
