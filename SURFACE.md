# Portfolio surfaces

Mode: Experience on home; Operate on the project catalog.

## Direction contract

First viewport: a large cobalt pixel-particle HOEURB wordmark above an engineering headline, factual introduction and work/contact actions. Inspired by [Omarchy’s landing hero](https://omarchy.org/), its letters disperse around pointer input or a tap and reform; a keyboard-accessible scatter control offers the same interaction. The desktop opening uses the full viewport; mobile stacks the introduction beneath the particle artwork. The first architecture study now leads selected work below the hero.

Signature interaction: the fixed background combines interactive particles with the small engineering workbench. Desktop has 80 background points and eight desk pieces; mobile has 36 points and four pieces. Each visit scatters pieces in a fresh, clearance-aware arrangement. Pointer proximity displaces points and exposes short connections; taps produce radial impulses. Every piece floats and rotates continuously at a gentle pace while visible. Scroll velocity adds a brief bounded physical nudge, plus a smaller depth shift tied to page progress. Keycaps, washers, clips and pencil remain draggable/tossable. Text, figures and controls retain clear drawing areas through feathered opacity, including during dragging and release. Content bounds never reposition objects. A fixed-step collision solver retains mass-weighted piece contacts, viewport edge bounce and adaptive movement substeps. Pointer and scroll forces are bounded; interaction impulses settle into gentle ambient movement. Geometry refreshes at most once per frame on scroll, layout changes and font loading. Resizing preserves the existing scene and clamps only to new viewport bounds; its initial object count is retained. Hidden work and reduced-motion movement stop; both fields stay static for reduced motion. Hero particles pause offscreen and are capped at 3200.

Authored scroll moment: the home architecture studies expand into exploded component layouts as they approach the center of the viewport and reassemble as they leave. Wires are recomputed from moving component endpoints. Mobile uses readable labeled flow nodes and connected arrows. Content is visible by default; no fade-and-rise or repeated entrance reveal.

Projects: a desktop taxonomy sidebar and wide numbered editorial ledger replace the old card composition. A separate text-led grid is available. Retain every supplied record; combine search, one category and all selected technology tags; persist grid/list preference; give details protected keyboard focus through a native dialog.

Assistant: compact dialog with streaming text, explicit provider/configuration failures, retry and a 250-character input limit matching the existing API. Mobile uses the available visual viewport.

[Product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md) · [Design](../second-brain/01-projects/web-personal-redesign-v2/DESIGN.md) · [Hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) · [Log](../second-brain/01-projects/web-personal-redesign-v2/log.md)

## Hero wordmark cycle

[Hero particles](src/components/HeroParticles.astro) assemble scattered particles into VUTHI in three seconds after fonts load. Completed words hold for three seconds, then scatter for 1.4 seconds and reform over three seconds in sequence: VUTHI → D-FLINT → PROBE → FORGE → DECODE. Scatter and reform is the only animation; there is no style selector or direct word morph.

The controls beneath the wordmark offer keyboard-accessible manual scatter and Pause/Resume. Pause completes the active transition; manual scatter reforms the current word and restarts its readable hold. Pointer proximity delays cycling until three seconds after leaving. Hidden/offscreen timing suspends without skipping words. Resize preserves word, particle identities and progress. Reduced motion presents static VUTHI and hides controls; without JavaScript the serif VUTHI fallback remains visible.

Choose a shared grid spacing that fits all five words within the stable particle budget, capped at 3200. Preserve every sampled grid cell, repeating targets when needed, so strokes have no missing-dot holes. Square size follows grid spacing. Shared floating desk decorations retain their own behavior.
