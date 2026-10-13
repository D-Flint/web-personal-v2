# Mobile Background Crossfade Design

## Context

The fixed scenic background can visibly stutter or shift on mobile while moving between page sections. Inactive Home layers are initially `display: none` and lazy-loaded, so an image may begin loading, decoding, and entering the compositor at the same moment its opacity transition starts. The background stage also follows the browser's changing visual viewport, which can alter `object-cover` cropping as mobile browser chrome expands or collapses.

## Design

Mobile and coarse-pointer devices use a scroll-linked crossfade while desktop retains its existing discrete 700ms section transition.

- All mobile scenery layers are mounted before the first section boundary and their selected responsive images are requested and decoded ahead of use.
- Adjacent layers blend across a bounded region around each section boundary. Opacity is the only per-frame write, scheduled through one `requestAnimationFrame` callback.
- A smoothstep curve softens the beginning and end of each blend without making the artwork trail behind the user's gesture.
- The fixed background stage uses `100lvh` on mobile, with `100vh` as fallback, so address-bar expansion and collapse do not repeatedly reframe `object-cover` artwork.
- Reduced-motion users receive an immediate midpoint switch rather than a continuous fade.
- The Projects archive uses the same readiness and stable-viewport strategy for its Projects-to-Footer transition.
- Initializers are idempotent and remove listeners during Astro navigation.

## Boundaries

This change does not alter artwork, section layout, desktop transition timing, content animation, Sakura rendering, navigation, storage, or public component APIs.

## Verification

- Inspect Home and Projects at 390x844 in dark and light themes.
- Scroll down and up through every background boundary and confirm opacity changes are monotonic, adjacent, and free of display toggles.
- Confirm the mobile stage height stays stable while viewport height changes.
- Confirm reduced-motion switches without continuous interpolation.
- Confirm desktop retains timed section fades.
- Check browser console and failed requests.
- Run `npm run qc`.
