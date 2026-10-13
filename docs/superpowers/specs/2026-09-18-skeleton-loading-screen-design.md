# Readiness-Aware Sakura Skeleton Screen

## Goal

Keep the existing Matrix splash visually and behaviorally unchanged, then use a lightweight Sakura-glass skeleton only when the initial viewport is still waiting for critical imagery or fonts. The completed page must reveal without layout shift, premature entrance animations, or a permanent loading trap.

## Visual Direction

The skeleton is a fixed overlay rather than replacement page markup. Near-black glass shapes, quiet rose-violet rims, and muted scenic glows echo the existing Grand Narukami Shrine interface without competing with it. One restrained 1.8-second shimmer supplies the only new motion and is disabled when reduced motion is requested.

The route controls the composition:

- `/` uses a navigation shell, hero typography, supporting copy, actions, and a subdued desktop scenic silhouette.
- `/projects` uses the archive eyebrow and heading, statistics, search/filter controls, and an initial card row.
- Other routes use a compact centered seal, title, line, and action shell.

Mobile variants preserve the same hierarchy with fewer visible shapes and no horizontal overflow. The loading surface follows the resolved root theme while keeping enough tonal continuity to hand off cleanly from the Matrix splash.

## Architecture

`PageSkeleton.astro` is rendered by `BaseLayout.astro` immediately after `MatrixSplash.astro` and before a shared `#page-content-root`. The layout derives the `home`, `projects`, or `fallback` variant from `Astro.url.pathname`.

Critical image candidates carry `data-loading-critical`. The candidate set includes the active scenic background, visible navbar artwork, hero imagery, and the first three project-card media items. At runtime, only marked images intersecting the initial viewport are awaited, so hidden responsive artwork and below-the-fold lazy content never delay release.

Readiness waits concurrently for visible critical images and `document.fonts.ready`. Both successful and failed image loads count as settled. The overlay releases only after asset readiness and `matrix-splash-done`; if the splash was removed before the coordinator initialized, the missing splash element is treated as an already-completed handoff.

Once the Matrix handoff occurs, a six-second safety timer guarantees release even when a font or resource remains permanently stalled. Release is guarded so it runs exactly once.

## Interaction and Accessibility

While loading, the document is scroll locked and `#page-content-root` is inert. The coordinator records the prior inert state, scroll position, and focused element, then restores them during cleanup. The skeleton exposes a polite loading status and all decorative geometry is hidden from assistive technology.

The skeleton fades out without participating in document layout and is removed after the fade. A `<noscript>` fallback hides the skeleton and restores normal overflow, leaving server-rendered content fully available when JavaScript is disabled.

## Event Contract

The Matrix splash continues to dispatch `matrix-splash-done` on natural completion, click skip, Escape skip, and existing bypass paths. The skeleton coordinator consumes that handoff and dispatches `page-content-ready` exactly once when the page is safe to reveal.

Navbar entrance, desktop hero stagger, and `ScrollReveal` instances with `trigger="load"` listen for `page-content-ready`. Late-initializing listeners use the `page-is-ready` root class as the settled-state fallback.

## Failure Handling

- Image errors resolve their individual readiness promises.
- Unsupported Font Loading API environments treat fonts as ready.
- The post-splash six-second timeout releases stalled resources.
- Once-only guards prevent duplicate event dispatch and cleanup.
- Independent entrance fallbacks sit beyond the readiness cap so a coordinator failure cannot leave important content hidden.

## Verification

Test first and repeat desktop visits, mobile splash bypass, natural splash completion, click skip, Escape skip, cached assets, failed images, throttled resources, delayed fonts, and permanently stalled readiness. Confirm the readiness event fires once and the six-second post-splash cap releases the page.

Inspect Home, Projects, and 404 at 1440x900 and 390x844 in dark and light theme states. Check reduced motion, no JavaScript, keyboard isolation, focus and scroll restoration, loading announcements, overflow, entrance timing, console output, and required network requests. Finish with the repository's mandatory `npm run qc` gate.

## Refinement: Route Fidelity and Release Hygiene

The loading surface remains subordinate to the Matrix splash and keeps the original readiness contract intact. Its route variants now mirror the final layouts more closely without becoming a second interface: Home uses the hero's actual two-line title rhythm, responsive action wrapping, and an unframed scenic silhouette; Projects uses the archive header and filter proportions plus cards with media, metadata, title, copy, and tag geometry; fallback routes reproduce the centered torii, large error-code area, supporting copy, divider, and paired actions.

Visual weight is reduced through quieter rims, lower surface opacity, and a single composition-wide 1.8-second sweep instead of independently animated shapes. The sweep and fade are suppressed for reduced motion. A light root theme receives a corresponding pale sakura treatment while retaining the same geometry.

The Matrix event remains the release handoff. When assets have already settled, the skeleton's 400ms fade runs beneath the existing Matrix fade so the page appears directly instead of briefly exposing a separate loading state. The six-second post-splash cap remains unchanged. During readiness, `#page-content-root` receives both inertness and `aria-busy="true"`; release restores the exact prior values, scroll position, focus, and overflow state. Release also unregisters Matrix, DOM-ready, and image-settlement listeners before dispatching `page-content-ready`, preserving the exactly-once guarantee even when the cap wins a stalled asset race.

Project-card loading intent is explicit through the internal `critical` prop. The first three archive cards (the desktop first row) are eager, high-priority, and readiness-marked; runtime viewport filtering limits which marked assets delay reveal. Home featured cards omit the prop and remain lazy because they begin below the hero viewport. Image errors continue to count as settled.
