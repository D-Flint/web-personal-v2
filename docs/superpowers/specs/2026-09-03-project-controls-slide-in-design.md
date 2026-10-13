# Project Controls Slide-In Design

## Diagnosis / Context

The project archive header in `src/pages/projects.astro` already enters with the `headerFadeSlide` animation, but the search and filter command suite below it appears immediately. This makes the first viewport transition feel unfinished and does not match the requested entrance shown by the catalogue header.

## Approved Design

Apply the existing `headerFadeSlide` motion to the project filter-controls `<section>` on initial page load. The section will begin slightly above its final position and transparent, then settle into place beneath the already animated archive header. A short delay will preserve the visual hierarchy: title first, controls second.

The change is intentionally limited to the filter-controls section. Search, filtering, view switching, project-card FLIP transitions, and server-rendered markup remain unchanged.

## Motion and Accessibility

- Reuse the existing `headerFadeSlide` keyframes and easing so the new motion belongs to the current design system.
- Use a short delay after the header animation rather than adding a new animation family.
- Add a reduced-motion override so users who request reduced motion see the section immediately without translation.
- Keep the section visible in no-JavaScript and static rendering contexts.

## Verification

- Run `npm run build` after the implementation.
- Confirm `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- Confirm the existing filter controls and project-card rendering remain present in the production build.

## Pending

None.
