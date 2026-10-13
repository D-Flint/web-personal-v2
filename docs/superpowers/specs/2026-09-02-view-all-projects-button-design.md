# View All Projects Button Design

## Goal

Give the homepage `View All Projects` CTA a more distinctive shrine identity while preserving its calm dark glass appearance. The button should feel refined at rest and become gently luminous when interacted with.

## Scope

- Modify the CTA in `src/components/ProjectGrid.astro`.
- Keep the existing `/projects` destination and link semantics.
- Do not change project cards, the archive page, or unrelated CTA styles.

## Visual design

Use a layered hybrid treatment:

- Preserve the rounded glass pill silhouette.
- Add a small sakura mark before the label as the shrine signature.
- Strengthen text contrast with a deeper translucent background and a fine pink-rose border.
- Add a translucent pink sheen that sweeps across the surface on hover.
- Brighten the sakura mark and arrow together, with the arrow traveling a little farther.
- Lift the button subtly and add a restrained sakura outer bloom on hover.

## Interaction and accessibility

- Retain the native anchor behavior and keyboard focus.
- Use a visible `:focus-visible` ring with sufficient contrast.
- Keep active-state feedback without excessive scale.
- Disable decorative sheen, lift, and motion under `prefers-reduced-motion: reduce` while retaining the visual contrast treatment.

## Verification

- Run `npm run build`.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- Check the button at rest, hover, keyboard focus, active press, and reduced-motion settings.

## Pending

- None after implementation and build verification.
