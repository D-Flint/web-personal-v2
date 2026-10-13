# Shared Sakura Primary Button Design

## Goal

Make the homepage `View All Projects` CTA visually identical to the hero's primary `View Projects` CTA by giving both links one shared source of truth for styling and motion.

## Scope

- Add a shared `.sakura-primary-btn` style in `src/styles/global.css`.
- Apply the shared class to the hero `View Projects` link in `src/pages/index.astro`.
- Apply the shared class to the homepage `View All Projects` link in `src/components/ProjectGrid.astro`.
- Preserve each link's current destination and visible label behavior, except that the project CTA label will match the hero as `View Projects`.
- Remove the project CTA-specific visual treatment that would conflict with the shared style.

## Visual and motion design

The shared style uses the hero recipe: a pink-to-rose gradient, white sakura icon, subtle border highlight, soft pink bloom, specular light sweep, scale-based hover and active feedback, and a small arrow nudge. The project CTA keeps its section placement but uses the same compact button proportions and typography.

## Accessibility

- Preserve native anchor semantics and keyboard navigation.
- Add a shared visible `:focus-visible` ring.
- Keep decorative motion short and disable the sheen and transform motion under `prefers-reduced-motion: reduce`.

## Verification

- Run `npm run build`.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- Check both CTAs at rest, hover, focus, active press, and reduced-motion settings.

## Pending

- None after implementation and build verification.
