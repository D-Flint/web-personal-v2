# Service — Theme Toggle

**File:** `src/components/Navbar.astro` (lines 59-100)  
**Links to:** [[architecture]] §6 (Theming Architecture), [[service - Sakura Canvas]], [[service - Tailwind Styling]]

---

## Purpose

Manages two independent visual toggles: **dark/light mode** and **sakura petal visibility**. Both persist to [[localStorage]] and restore on page load.

## Dark Mode Toggle

```js
// Reads system preference on first visit; stores explicit choice afterward
if (localStorage.getItem("theme") === "dark" || /* prefers-color-scheme */) {
  document.documentElement.classList.add("dark");
}

toggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark() ? "dark" : "light");
});
```

**Mechanism:** Toggles the `.dark` class on `<html>`. All component styles react via CSS custom property overrides in `global.css`. Tailwind's `dark:` utility variant is configured as class-based via `@custom-variant dark (&:where(.dark, .dark *));` so that all `dark:` prefixed classes (e.g., `dark:bg-slate-900`) respond to the `.dark` class rather than the OS `prefers-color-scheme` media query.

## Sakura Toggle

```js
function setSakura(active) {
  localStorage.setItem("sakura", active ? "on" : "off");
  document.documentElement.classList.toggle("sakura-paused", !active);
  document.dispatchEvent(new CustomEvent("sakura-toggle", { detail: { active } }));
}
```

**Mechanism:** CSS hides the canvas when `.sakura-paused` is present. JS also stops the `requestAnimationFrame` loop via the custom event.

## State Table

| State | `localStorage` Key | Values |
|-------|-------------------|--------|
| Theme | `theme` | `"dark"` \| `"light"` |
| Sakura | `sakura` | `"on"` \| `"off"` |

## Depends On

- [[service - Tailwind Styling]] — dark mode CSS variables

## Consumed By

- [[service - Sakura Canvas]] listens for `sakura-toggle` CustomEvent
- All components via `.dark` class on `<html>`
