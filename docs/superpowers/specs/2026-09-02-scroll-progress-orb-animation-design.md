# Scroll Progress Orb Animation Design

## Goal

Make the desktop section scroll rail feel like a living, luminous progress indicator. The active pink marker should glide along the existing rail in direct response to page scrolling, with a soft sakura-colored glow and no loss of accessibility or responsiveness.

## Scope

- Modify `src/components/DesktopScrollRail.astro` only for the desktop rail animation.
- Preserve the existing section anchor navigation, active/passed bead states, and piecewise section progress mapping.
- Leave the mobile top progress bar unchanged.

## Interaction design

The rail gains a dedicated progress orb centered on the vertical track. Scroll progress produces a target position between the measured section beads. A requestAnimationFrame loop eases the orb toward that target using a lightweight interpolation, keeping motion smooth without the lag or rubber-banding caused by CSS height transitions.

The orb has a bright white-pink core, a pink halo, and a subtle trailing glow. The existing progress fill remains beneath it and ends at the orb's current position. During active scrolling, the orb's halo briefly intensifies; when scrolling stops, it settles into a restrained breathing glow. Passed beads stay softly illuminated and the active bead retains its stronger aura.

## Technical design

- Add a dedicated orb element inside `#desktop-rail-pill`.
- Position the orb using a measured top coordinate and a GPU-friendly `transform: translate3d(...)` update.
- Keep the existing fill line height synchronized with the rendered orb position.
- Use a single rAF scheduler for scroll updates and animation settling.
- Avoid layout-affecting animation properties.
- Disable interpolation and ambient motion under `prefers-reduced-motion: reduce`.
- Preserve anchor link semantics, `aria-current`, keyboard focus, and smooth jump navigation.

## Verification

- Run `npm run build`.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- Visually inspect the rail at the top, between each section, during a fast scroll, after scrolling stops, and at the page bottom.

## Pending

- None after implementation and build verification.
