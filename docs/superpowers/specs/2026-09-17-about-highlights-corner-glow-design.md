# About Highlights Corner Glow Removal

## Diagnosis

The Location, Studies, and Interests pill in `src/components/AboutMe.astro` uses the shared `.about-highlights-panel` styling in `src/styles/global.css`. Its decorative `::before` layer begins with a white gradient stop, producing an unwanted white flare at the pill corner.

## Approved Design

Remove only the white highlight from the decorative pseudo-element. Keep the existing Sakura pink and violet glass gradient, border, shadow, blur, item tiles, hover states, responsive layout, and reduced-transparency fallback unchanged.

## Implementation

Change the first color stop in `.sakura-glass-panel.about-highlights-panel::before` from translucent white to transparent. Do not alter markup, content, assets, JavaScript, or shared glass tokens.

## Verification

Run `npm run build`. Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.

## Pending

None.
