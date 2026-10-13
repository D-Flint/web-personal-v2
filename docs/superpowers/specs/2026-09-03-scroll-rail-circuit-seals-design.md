# Scroll Rail Circuit Seals Design

## Diagnosis / Context

The desktop scroll rail's `.passed` markers currently become softly pink-filled circles. They communicate state, but they are visually generic and too close to the active marker. The rail needs a more distinctive completed-state language without adding another sakura motif.

## Approved Design

Completed section markers become small angular circuit seals:

- A broken, rotated outer ring evokes a shrine talisman seal.
- A tiny diamond core indicates an activated checkpoint.
- Short horizontal circuit traces extend from the node and fade into the rail background.
- A muted violet-to-pink lacquer gradient and restrained glow distinguish completed nodes from inactive nodes.
- The active marker remains the existing larger circular white-pink orb, preserving clear current-position hierarchy.

The change is limited to `src/components/DesktopScrollRail.astro`. Navigation targets, scroll interpolation, the active state, tooltips, responsive visibility, and reduced-motion behavior remain unchanged.

## Accessibility and Motion

- Existing anchor labels and `aria-current` behavior remain intact.
- The new decorative layers are hidden from assistive technology.
- Existing hover transitions remain subtle and the current reduced-motion rule disables decorative animation and transitions.

## Verification

- Run `npm run build` after the implementation.
- Confirm `.vercel\\output\\functions\\_render.func\\.vc-config.json` contains `nodejs22.x`.
- Run `git diff --check` and inspect the rail state selectors for inactive, passed, and active markers.

## Pending

None.
