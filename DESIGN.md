---
name: Engineering Field Journal
description: A paper-and-ink portfolio with cobalt mechanical drawings.
colors:
  paper: "#f4f1e9"
  white: "#fcfaf5"
  ink: "#202c33"
  muted: "#53616a"
  blue: "#244dc8"
  line: "#c7cbc5"
  wash: "#e7ebe7"
  error: "#a32e29"
typography:
  display:
    fontFamily: "Journal, serif"
    fontSize: "clamp(3.4rem, 6.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Journal, serif"
    fontSize: "clamp(2.5rem, 4.2vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: "-.035em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: ".8rem"
    lineHeight: 1.5
  technical:
    fontFamily: "ui-monospace, monospace"
    fontSize: ".72rem"
    letterSpacing: ".025em"
rounded:
  tag: "2px"
  button: "3px"
  assistant: "4px"
spacing:
  tag-gap: "8px"
  control-gap: "12px"
  field-gap: "20px"
  group-gap: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "10px 22px"
    typography: "font-size: .85rem"
  button-primary-hover:
    backgroundColor: "{colors.blue}"
    textColor: "white"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "10px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
  input-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "12px"
    typography: "font-size: .87rem"
  tag:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.muted}"
    rounded: "{rounded.tag}"
    padding: "5px 9px"
  tag-journal:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
  navigation:
    textColor: "{colors.ink}"
    typography: "font-size: .8rem"
  navigation-current:
    textColor: "{colors.blue}"
  project-record:
    padding: "30px 0 34px"
  detail-dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "38px"
    width: "min(680px, calc(100% - 32px))"
---

# Design System: Engineering Field Journal

## Overview

**Creative North Star: "Engineering Field Journal"**

Warm paper and dark ink give engineering work the character of an open field journal. Cobalt marks connections, selected controls and purposeful actions; large serif headings sit beside restrained sans-serif explanations. Fine rules and generous margins organize dense technical information without enclosing every item in a card.

The recurring background combines an interactive cobalt particle field with small physical desk pieces, shared by home, the project journal and the missing-page surface. Keycaps, washers, paper clips and a pencil can be grabbed and tossed; they float, rotate and collide around writing. Each visit scatters the pieces into a fresh clearance-aware arrangement. Every piece floats and rotates continuously at a gentle pace while visible. Scroll velocity gives the pieces a brief bounded nudge, with a smaller depth shift tracking page progress. The home opens with a large serif wordmark rendered in square particles that disperse and reform. Project schematics open physically with scroll and keep their wires attached; reading content is visible from the start.

**Key Characteristics:**
- Warm paper, ink and a single cobalt accent.
- Self-hosted serif display with plain Inter body text.
- Ruled editorial layouts and numbered project records.
- Mechanical diagrams whose connections survive movement.
- Input-driven motion with a static reduced-motion presentation.

## Colors

A warm neutral ground supports dark writing and deliberate cobalt marks. Frontmatter values mirror the CSS custom properties in [global styles](src/styles/global.css); those primitives are normative.

### Primary

- **Drafting cobalt — blue:** Active navigation, selected filters, links, display emphasis, record numbers and schematic strokes. Cobalt outlines and paper fills give the desk pieces the same drawn character as the schematics.

### Neutral

- **Warm paper — paper:** The page and project-detail dialog ground.
- **Clean paper — white:** Inputs and assistant panel surfaces.
- **Writing ink — ink:** Primary text, dark buttons and strong rules.
- **Quiet ink — muted:** Descriptions, secondary annotations and metadata.
- **Pencil rule — line:** Dividers and restrained control outlines.
- **Technical wash — wash:** Tags, secondary hover states and user chat messages.

### Semantic

- **Correction red — error:** Validation borders, field messages and failed delivery/chat status.

**The Writing Clearance Rule.** Desk pieces occupy the surrounding paper; text, figures and control bounds are physical obstacles. Reading and interaction remain primary.

## Typography

**Display Font:** Self-hosted Fraunces regular and italic, exposed by CSS under the family alias `Journal`, with serif fallback.

**Body Font:** Self-hosted Inter regular, with sans-serif fallback. The stylesheet permits synthesized weight; no additional Inter weight files are declared.

**Technical Font:** System monospace, limited to small technical annotations and numeric metadata.

The pairing gives major headings a human, printed character while body copy and controls remain direct. Italic display words may take cobalt emphasis. The frontmatter records the desktop base roles; component and responsive overrides follow the source.

- **Display:** Main hero title; a fluid ramp with tight tracking and compact leading.
- **Headline:** Section headings using the same serif and tracking.
- **Project titles:** Home project stories use serif (2.55rem, line-height 1.12); journal list titles use serif (1.9rem), and grid titles use serif (1.65rem).
- **Body:** Default reading text; paragraphs cap at 68ch. Introductory and record descriptions use smaller contextual sizes rather than a second body family.
- **Label:** Small Inter descriptions, controls and metadata. Keep these in normal sentence case.
- **Technical:** Monospace with tabular numerals; captions and stack notes rather than body paragraphs.

At widths up to 1000px the general main title is 4.2rem. At widths up to 700px it uses `clamp(3.1rem, 11vw, 4.4rem)`; the project-journal title has its own `clamp(2.8rem, 15vw, 3.7rem)` override. Do not flatten these distinct editorial contexts into one arbitrary size.

## Layout

The shared reading container caps at 1280px and subtracts 96px from the viewport. Its side allowance becomes 56px at 1000px and 40px at 700px. Desktop sections use generous vertical space (112px); narrow sections use 64px.

Home uses an asymmetric two-column hero (1.1fr / 1fr, 64px gap), followed by substantial project presentations (1.08fr / 1fr, 72px gap). Alternating stories reverse side on desktop, then return to natural single-column order at 700px. Biography and contact also collapse into one column at that breakpoint.

The project journal has a sticky browsing sidebar (230px) beside an open ledger, separated by a 70px gap. At 1100px the sidebar narrows to 200px and the gap to 40px. List mode pairs title/tag information with its description; grid mode lays out two open records per row. At 700px the sidebar becomes static, category controls wrap, records use one column, and list/grid retain their distinct numbered treatments. Search and view controls remain in a compact shared row.

The shared field is fixed to the viewport behind page content. Desktop has 80 particles and eight pieces; narrow screens have 36 particles and four pieces. Resolution caps at device-pixel-ratio 1.5. Cached text, figure and control bounds affect opacity only. A smooth 18px clearance feather and 85ms exponential fade protect reading without shifting objects. Geometry refreshes once per animation frame on scroll, layout changes and font loading. Pointer movement nudges only nearby pieces and points; desktop drag throws individual pieces and touch taps nudge. Scroll velocity adds a brief bounded physical impulse; a smaller per-piece depth offset follows normalized page progress and stays clamped to the viewport. Placement and drift vary on each visit, with continuous gentle movement while visible. Resizing clamps the existing scene while preserving its initial count.

The home’s particle hero uses a full-width pixel wordmark above a two-column headline/introduction layout. On narrow screens the introduction stacks below the artwork. The name is sampled from the self-hosted display face; particles are capped at 3200. A visible scatter control supports keyboard input. Reduced motion retains a complete static name and hides that optional control; without JavaScript the name remains readable as text.

## Elevation & Depth

This is primarily a flat paper system. Fine rules, pale schematic boards and open whitespace create hierarchy. Shadows distinguish floating interactive layers: project details use `0 18px 70px #202c332b`, the assistant uses `0 16px 70px #202c3326`, and its launcher uses `0 6px 20px #202c3320`. Native dialog backdrops use a translucent dark ink veil.

**The Flat Paper Rule.** Main-page surfaces use rules and tonal differences for structure. Reserve floating shadows for dialogs and the assistant launcher.

## Shapes

Controls have gently squared corners: tags and fields use the small radius, primary buttons and details the button radius, and the assistant panel the assistant radius. The launcher is circular (48px diameter). Open ledger records use straight divider rules rather than outer card containers.

Schematics combine thin cobalt outlines, small rectangular modules, circular hubs and attached orthogonal connectors. Desk pieces have recognizable keycap, hex-washer, wire-clip and pencil silhouettes. Their paper fills, cobalt outlines and small soft shadows suggest objects resting on the journal.

## Components

### Buttons and links

Primary actions use ink-filled controls with clean-paper text and a one-pixel outline. Hover changes the primary action to cobalt over 0.18s using ease. Secondary actions are transparent, becoming a technical wash on hover. Standard buttons have a minimum height of 46px. Text links use cobalt, an 18px inline arrow where present, and a 14px gap. Interactive elements share the visible cobalt focus outline (3px, offset 5px).

### Inputs and validation

Contact fields use clean paper with a muted one-pixel border, small squared corners and internal padding. Labels sit above fields. Textareas resize vertically; invalid fields use correction red and textual error messages. The project-journal search is a distinct borderless, transparent field inside the ruled toolbar. Do not make that toolbar field visually identical to a contact input.

### Navigation and filter controls

The masthead is a ruled row with a custom line monogram, name and small location note. Navigation uses plain Inter links; the current route is cobalt and underlined. At 700px links wrap into a second full-width row.

Category browsing uses ruled text rows in the desktop sidebar. Selected rows turn cobalt and increase weight. On narrow screens these become wrapping outlined controls, with selected categories filled cobalt. Technology filters and list/grid buttons communicate selection through `aria-pressed`; the selected view control uses ink fill. Tags are passive labels: home uses technical-wash fill, journal records use transparent fill and a fine outline.

### Project records and details

Journal records use a large cobalt serif number, serif title with an inline arrow action, cobalt domain, muted description and small technology tags. They remain open ledger entries in both view modes. Details open in a native paper dialog with a close control, large serif title and ruled link region. Respect its viewport-relative width and maximum height, keep focus within the dialog, and return focus to the opener on close.

### Architecture studies

Home illustrations are framed, pale technical boards with explicit captions identifying them as schematics. On desktop, node groups move outward during scroll; connecting paths are recalculated from the same moving anchors. At 700px, desktop drawings become labeled stacked nodes with arrows. Alternating nodes move by at most 6px horizontally and their arrow endpoints follow. Reduced motion leaves all diagrams in their closed, static state. There are no fade or reveal entrances.

**The Attached Wire Rule.** When schematic nodes move, their connecting paths move with them. Motion explains a system rather than introducing the text.

### Workbench and assistant

The shared canvas depicts interactive points and physical desk pieces with rotation, collision, edge bounce and friction. Particle proximity produces short traces, while pointer/tap input adds bounded local impulses. Particles, traces and desk pieces fade smoothly around protected content, including while held and after release. Desk collisions run at a fixed 60 Hz with adaptive substeps and repeated contact correction. Optional grabbing/tossing uses a grab cursor and touch taps nudge nearby pieces. Scroll velocity gives loose pieces a brief bounded impulse and the viewport a smaller progress-based depth shift; drawings remain clamped and content clearance follows their projected positions. Gentle per-piece currents provide continuous idle drift and rotation. Linear speed caps at 14 CSS pixels per nominal frame, spin at .18 radians. The animation frame loop runs while visible and stops while the document is hidden; reduced motion keeps the workbench static and removes the interaction hint. Canvas ignores pointer events; document handlers respond only to piece hits outside interactive controls.

The assistant is a compact native dialog with a fixed header/composer and a scrolling transcript. It uses clean paper, ink text and washed user messages; status/errors remain explicit. On narrow screens it spans the viewport with 12px side margins and respects available viewport height. Keep the small circular launcher visually separate from primary page actions.

## Do's and Don'ts

### Do:
- **Do** use the existing paper, ink and cobalt primitives for new surfaces.
- **Do** pair expressive serif headings with readable sans-serif explanations.
- **Do** keep project records open and ruled, with substantial schematics where appropriate.
- **Do** retain visible keyboard focus, native dialog semantics and narrow-screen reading order.
- **Do** make mechanical motion respond to input, stop when idle or hidden, and become static for reduced motion.
- **Do** label architecture illustrations as schematics rather than screenshots.

### Don't:
- **Don't** reintroduce generic mesh backgrounds, mechanical arms or arcade elements.
- **Don't** animate text entrances with fades or reveals.
- **Don't** place drifting background marks over writing or controls.
- **Don't** turn the project journal into repeated thumbnail cards.
- **Don't** invent screenshots, project links or accomplishments.


[Product](../second-brain/01-projects/web-personal-redesign-v2/PRODUCT.md) · [Surface brief](../second-brain/01-projects/web-personal-redesign-v2/SURFACE.md) · [Project hub](../second-brain/01-projects/web-personal-redesign-v2/README.md) · [Log](../second-brain/01-projects/web-personal-redesign-v2/log.md)

## Hero wordmark cycle

[Hero particles](src/components/HeroParticles.astro) assemble scattered particles into VUTHI in three seconds after fonts load. Completed words hold for three seconds, then scatter for 1.4 seconds and reform over three seconds in sequence: VUTHI → D-FLINT → PROBE → FORGE → DECODE. Scatter and reform is the only animation; there is no style selector or direct word morph.

The controls beneath the wordmark offer keyboard-accessible manual scatter and Pause/Resume. Pause completes the active transition; manual scatter reforms the current word and restarts its readable hold. Pointer proximity delays cycling until three seconds after leaving. Hidden/offscreen timing suspends without skipping words. Resize preserves word, particle identities and progress. Reduced motion presents static VUTHI and hides controls; without JavaScript the serif VUTHI fallback remains visible.

Choose a shared grid spacing that fits all five words within the stable particle budget, capped at 3200. Preserve every sampled grid cell, repeating targets when needed, so strokes have no missing-dot holes. Square size follows grid spacing. Shared floating desk decorations retain their own behavior.


## Textbox focus

Selected text inputs and textareas use a cobalt change on their existing border, without an offset outer ring. Invalid fields retain their red validation border. Other interactive controls retain visible keyboard focus outlines.
