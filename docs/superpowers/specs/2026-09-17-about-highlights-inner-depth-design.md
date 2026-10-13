# About Highlights Inner Tile Depth

## Diagnosis

The three inner tiles in the Location, Studies, and Interests strip use a nearly flat translucent fill with a minimal shadow. The tile surfaces need clearer glass depth without changing the strip layout or visual identity.

## Approved Design

Keep the three existing tiles and add depth through a restrained vertical glass gradient, a subtle top rim, a dark bottom inset, and soft offset shadows. Keep the existing Sakura palette, content, hover lift, responsive behavior, and corner-glow removal.

## Implementation

Update the existing `.about-highlight-item` rule in `src/styles/global.css`. Change only its surface background and shadow recipe. Do not add markup, assets, JavaScript, dependencies, or new interaction states.

## Verification

Run `npm run build`. Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.

## Pending

None.
