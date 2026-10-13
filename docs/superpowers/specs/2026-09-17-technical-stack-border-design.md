# Technical Stack Card Border

## Goal

Make the Technical Stack card boundary visible in the Sakura glass layout while preserving its existing artwork, spacing, hover lift, and responsive behavior.

## Design

Use the card's existing 1px pink border token and increase resting opacity from `30` to `45`. Increase hover opacity from `60` to `70` so the border responds clearly without becoming a heavy frame.

## Scope

- Modify the Technical Stack card root in `src/components/AboutMe.astro`.
- Keep the existing rounded corners, background, shadow, artwork, and hover motion.
- Do not change technology pills or other cards.

## Verification

Run `npm run build`. Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.

## Pending

None after build and runtime configuration checks pass.
