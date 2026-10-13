# Mobile Project Filter Fast-Browsing Design

## Goal

Bring the first project materially closer to the top of the mobile catalogue while preserving access to every search, domain, technology, reset, and view control.

The mobile page should prioritize browsing in this order:

1. Search by intent.
2. Narrow by project domain.
3. Browse results.
4. Open advanced technology filters only when needed.

Desktop behavior and layout remain unchanged.

## Current Context

The project catalogue currently exposes search, two view controls, five horizontally scrolling domain tabs, thirteen popular technology pills, a result count, and reset controls before the first project. The navbar separately contains the complete categorized technology-filter interface. Both tag interfaces already synchronize through the `project-filter-change` custom event and persist selected tags under `projectFilterTags`.

The mobile problem is therefore duplication and vertical density, not missing filtering capability.

## Chosen Approach

Reuse the navbar's complete categorized filter interface as the single advanced-filter surface. On mobile, present that interface as a bottom sheet. Both the navbar filter icon and a new page-level `Filter scrolls` button open the same sheet.

This approach avoids a second filter component, preserves the existing event bridge, and keeps tag behavior consistent across entry points.

## Mobile Layout

The primary filter panel will contain three compact layers:

```text
[ Search projects...             ] [Grid/List]

[All] [Systems] [Web] [AI] [CLI]  -> horizontal

[ Filter scrolls  2 ]             Showing 6 of 19
                                   [Clear]
```

- Search and the icon-only grid/list switcher remain in the first row.
- Domain tabs remain directly visible in a horizontally scrollable row.
- The thirteen inline technology pills are hidden below the `md` breakpoint.
- A compact mobile summary row replaces them.
- `Filter scrolls` opens the shared advanced-filter sheet.
- A small count seal appears only when technology tags are selected. The number represents selected technology tags, not the search query or domain selection.
- Result count remains visible at all times.
- `Clear` appears only while any search, domain, or technology filter is active.

The count seal is the single new signature detail: a restrained sakura-pink lacquer seal nested into the filter trigger. No new palette, typography, artwork, or decorative motif is introduced.

## Advanced Filter Sheet

At viewport widths below `md`, the existing navbar filter dropdown becomes a bottom sheet:

- Anchored to the bottom edge with safe-area padding.
- Rounded only across its top edge and constrained to the available viewport height.
- Uses the existing filter artwork, dark lacquer glass, pink border, and categorized tag groups.
- Includes a clear title, selected-tag count, `Clear all`, and close button.
- Uses an obscured backdrop so the relationship between sheet and catalogue is unmistakable.
- Opens from either the navbar filter icon or the page-level trigger.
- Closes through its close button, backdrop click, or Escape.
- Moves focus into the sheet when opened and restores focus to the control that opened it when closed.
- Prevents background scrolling while open.

At `md` and wider, the navbar filter remains the current floating dropdown. Its placement and desktop catalogue controls do not change.

Swipe-to-dismiss is intentionally excluded; explicit controls are clearer and avoid introducing a gesture-only behavior.

## Component and Event Responsibilities

### `src/pages/projects.astro`

- Keep the current search, domain, view, filter engine, result count, and reset behavior.
- Hide the popular technology-pill row on mobile while retaining it unchanged on desktop.
- Add the compact mobile summary row and `Filter scrolls` trigger.
- Dispatch a `project-filter-open` custom event rather than reaching into navbar markup directly.
- Update the mobile count seal whenever `activeTags` changes locally or through `project-filter-change`.
- Preserve the existing local-storage key and project filtering semantics.

### `src/components/Navbar.astro`

- Continue to own the complete categorized technology filter UI.
- Listen for `project-filter-open` and open the same filter surface used by the navbar controls.
- Apply bottom-sheet presentation and modal interaction behavior only below `md`.
- Maintain the existing `project-filter-change` event and tag persistence behavior.
- Keep all existing desktop dropdown behavior intact.

No framework or new dependency is introduced. All interaction remains vanilla JavaScript.

## State and Data Flow

1. The catalogue restores technology tags from `projectFilterTags`.
2. Search and domain inputs remain page-local state.
3. The page trigger dispatches `project-filter-open`.
4. Navbar opens the shared advanced-filter surface and records the triggering element.
5. Selecting a technology tag updates local storage and dispatches `project-filter-change`.
6. The page receives the event, updates `activeTags`, filters cards, refreshes the result count, and updates the mobile count seal.
7. Closing the sheet restores focus to the original trigger.

Malformed or unavailable local storage must fall back to an empty tag selection without preventing the catalogue from loading.

## Accessibility and Interaction Requirements

- All mobile tap targets are at least 44 by 44 CSS pixels.
- The page trigger exposes `aria-expanded` and references the filter surface with `aria-controls`.
- The mobile sheet uses dialog semantics and an accessible label.
- Escape closes the sheet before affecting page-level search behavior.
- Focus remains within the mobile sheet while it is open.
- Selected tag buttons retain accurate `aria-pressed` state.
- The active technology count is conveyed in the trigger's accessible name, not only visually.
- Reduced-motion users receive immediate state changes without sheet entrance or exit animation.

## Visual Behavior

- Reuse the established pink, purple, and deep-violet design tokens already present in the navbar and catalogue.
- Keep the search panel visually subordinate to the catalogue header.
- Use one short upward sheet transition and a quiet backdrop fade.
- Avoid adding more sakura icons, animated glows, or ornamental separators; the count seal supplies sufficient identity.
- Ensure the first project enters the initial mobile browsing flow sooner than in the current layout.

## Verification

### Build

- Run `npm run build` after each edit.
- Confirm `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x` after each build.

### Browser Checks

- Verify at 390x844 and a narrower 320px viewport.
- Confirm the inline technology-pill wall is absent on mobile and unchanged on desktop.
- Confirm search, domains, result count, clear, grid/list switching, and empty state still work.
- Open the advanced filter sheet from both the page trigger and navbar icon.
- Select and clear tags from the sheet; confirm cards, result count, count seal, navbar pills, and local storage stay synchronized.
- Verify backdrop click, close button, Escape, focus restoration, focus containment, and scroll locking.
- Verify reduced-motion behavior.
- Confirm no horizontal overflow and compare the first-project vertical position before and after.

## Acceptance Criteria

1. Mobile users see search, domains, and results before the full technology taxonomy.
2. Every technology filter remains available through one shared bottom sheet.
3. Navbar and page entry points open the same synchronized filter surface.
4. Active technology count, result count, reset behavior, and persistence remain accurate.
5. Desktop layout and dropdown behavior remain unchanged.
6. Keyboard, screen-reader, reduced-motion, and touch interactions meet the requirements above.
7. The user approves the implementation visually on localhost before any commit is created.
