# Service — Contact Form

**File:** `src/components/Contact.astro` (~422 lines of HTML + inline `<script>`)  
**Links to:** [[architecture]] §4.2 (Neko-Contact Bridge), [[service - Neko Chatbot]], [[service - Tailwind Styling]]

---

## Purpose

Provides a 4-field contact form (Name, Email, Subject, Message) with client-side validation, simulated submission, and a custom event bridge to the Neko mascot. Currently has no real backend — submission shows a success animation using sample data.

## Form Fields

| Field | ID | Validation |
|-------|----|------------|
| Name | `contact-name` | Required, non-empty |
| Email | `contact-email` | Required, regex pattern |
| Subject | `contact-subject` | Required, non-empty |
| Message | `contact-message` | Required, non-empty, 10-1000 chars |

## Validation & UX

- **Inline errors:** Each field has a hidden `<p role="alert">` that shows error messages
- **Paw-print icons:** Each field has a pink paw-print SVG ornament in the corner
- **Cat whiskers:** The parent card has `.whisker-group` + cat-ear SVGs on hover
- **Scroll reveal:** Section uses `.reveal` class for fade-in

## Submission Flow

```
Submit click
  → validate all fields
    → if invalid: show first error field
    → if valid:
      → disable submit button
      → dispatch "neko-form-event" { field: "submit", action: "sending" }
      → hide form, show success state (mascot image at 1.5x scale bouncing)
      → dispatch "neko-form-event" { field: "submit", action: "success" }
```

**Note:** The form action is `https://formspree.io/f/xwppwzjw` (commented/inactive). The success state uses hardcoded sample data — no actual HTTP request is made.

## Custom Event Bridge

Dispatches `CustomEvent("neko-form-event", { detail: { field, action } })` on:
- `blur` / `done` — hide bubble
- `focus` on each field — contextual message
- `sending` / `success` / `error` — submission state

These are consumed by [[service - Neko Chatbot]].

## Depends On

- [[service - Neko Chatbot]] — dispatches events to it; no reverse dependency
- [[service - Tailwind Styling]] — glassmorphism card, dark mode overrides (~80 lines of dark mode CSS)

## Technical Debt

- No real backend integration — Formspree endpoint is present in HTML but submission is simulated via JavaScript
- No server-side validation or spam protection
