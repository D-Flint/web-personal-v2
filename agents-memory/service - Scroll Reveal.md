# Service — Scroll Reveal

**File:** `src/pages/index.astro` (JS), `src/pages/projects.astro` (JS)  
**Links to:** [[architecture]] §2.2 (Page Components), [[service - Neko Chatbot]]

---

## Purpose

Fades in content sections as they enter the viewport. Uses a single [[IntersectionObserver]] instance that removes `opacity-0` when a section reaches 15% visibility. On the homepage, the transition is opacity-only (no translateY to eliminate Cumulative Layout Shift). On the projects page, cards additionally slide out directionally when scrolling away.

---

## Implementation

### Homepage (`index.astro`)
```js
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.remove('opacity-0');
      entry.target.classList.add('opacity-100');
    }
  }
}, { threshold: 0.15 });

for (const el of document.querySelectorAll('.reveal')) {
  observer.observe(el);
}
```
- Unidirectional: fades in on enter, does NOT fade out on leave
- Opacity-only to avoid CLS

### Projects Page (`projects.astro`)
```js
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      card.classList.remove('opacity-0', 'translate-y-16', '-translate-y-16', 'translate-y-8');
      card.classList.add('opacity-100', 'translate-y-0');
    } else {
      card.classList.remove('opacity-100', 'translate-y-8', 'translate-y-16', '-translate-y-16');
      card.classList.add('opacity-0');
      // Directional exit: top-half cards slide up, bottom-half slide down
      if (index < midPoint) {
        card.classList.add('-translate-y-16');
      } else {
        card.classList.add('translate-y-16');
      }
    }
  }
});
```
- Bidirectional: fades in on enter, fades out on leave with directional slide
- 800ms cubic-bezier transition on cards

---

## `.reveal` Class

Defined in [[service - Tailwind Styling]] (`global.css`):
```css
.reveal {
  transition: opacity 1s ease-out !important;
}
```

Initial state: `opacity-0`

---

## Sections Animated

**Homepage:**
- `section#projects` (ProjectGrid)
- `section#about` (AboutMe)
- `section#contact` (Contact)

**Projects page:**
- All 19 project cards with incremental staggered reveal

---

## Depends On

- [[service - Tailwind Styling]] — `.reveal` CSS transitions

## Consumed By

- [[service - Neko Chatbot]] also uses IntersectionObserver for contextual idle messages on the same sections
