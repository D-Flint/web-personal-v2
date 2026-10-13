# Service — Project Catalog

**Files:** `src/pages/projects.astro` (~346 lines) · `src/components/ProjectModal.astro` (~211 lines) · `src/components/ProjectGrid.astro` (~106 lines)  
**Links to:** [[architecture]] §2.2 (Page Components), [[service - Scroll Reveal]], [[service - Tailwind Styling]]

---

## Purpose

Renders two views of the project portfolio: a **featured grid** (3 cards on the homepage) and a **full catalog** (19 cards with tag filtering + detail modal on `/projects`). Uses inline data arrays (no CMS or external data source).

---

## Featured Grid (`ProjectGrid.astro`)

**Location:** `index.astro` homepage below the hero section.

- 3 hardcoded project objects (Sorting Visualizer, C++ Task Organizer, Portfolio Web App)
- Glassmorphism card with cat-ear SVGs on hover
- Tag pills (React, TypeScript, C++, Astro, etc.)
- "View All Projects" button linking to `/projects`
- Cat-ear wiggle animation on hover (shared keyframes in `global.css`)

---

## Full Catalog (`projects.astro`)

**Location:** `/projects` route.

### Data
- 19 inline project objects, each with: `title`, `description`, `tags` (array), `features` (array), `liveUrl`, `sourceUrl`
- Projects range from "Agentic AI Assistant" to "CLI Markdown Editor"

### Tag Filtering
- Filter bar with multi-select tag buttons (Algorithm, CLI, API, Python, React, TypeScript, C++, etc.)
- Clicking a tag toggles it; cards animate in/out with FLIP slide transitions (CSS `translate` + `opacity`)
- Active tags are highlighted with pink-500 background
- "Clear all" button when 1+ tags active

### Detail Modal (`ProjectModal.astro`)
- Single reusable modal shell always in the DOM (hidden by default)
- Runtime population: JS reads `data-*` attributes from the clicked card
- **ARIA:** `role="dialog"`, `aria-modal="true"`, focus trap, Escape key closes
- **Content:** Title, description, features list (SVG bullet points), tag pills, Live Demo + Source Code buttons
- **Scroll lock:** `document.body.style.overflow = 'hidden'` + compensates for scrollbar width
- **Styling:** Glassmorphism card with pink WebKit scrollbar, dark mode support

```js
// Modal population pattern
function openModal(card) {
  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.description;
  // ... populate features, tags, links
  modal.classList.add('is-open');       // CSS: opacity 1 + pointer-events auto
  modalCard.style.transform = 'scale(1) translateY(0)';
}
```

## Depends On

- [[service - Tailwind Styling]] — glassmorphism cards, keyframes, dark mode
- [[service - Scroll Reveal]] — featured grid on homepage uses `.reveal` class
