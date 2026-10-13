# Focused Shrine Contact Design

## Goal

Make sending a message the unmistakable primary task while preserving the contact section's Sakura shrine identity and memorable ofuda submit control.

## Chosen Direction

Use a focused-shrine composition. Keep the torii eyebrow, section heading, glass altar, topic chips, ofuda submit control, and neko success state. Remove decorative or operational claims that do not help visitors complete the form.

## Information Architecture

The reading order will be:

1. Torii eyebrow and `Get In Touch` heading.
2. One concise introduction with a visible direct-email fallback.
3. The contact form.
4. A quiet alternative-contact row containing GitHub and LinkedIn.

The unavailable X card, separate availability badge, duplicate transmission indicator, Markdown claim, and encryption claim will be removed. GitHub and LinkedIn will no longer claim live availability.

## Form and Copy

- Preserve Name, Email, Subject, topic chips, and Message fields.
- Mark required fields visibly and state the 10-character message minimum before failure.
- Keep Subject required because the topic chips make it inexpensive and it helps route messages.
- Add `maxlength="2000"` to the message field and retain the existing counter.
- Replace ceremonial operational language with factual, plain-language guidance while retaining restrained shrine flavor in headings and the CTA.
- Use the existing public email address from the footer as the fallback; do not introduce new contact data.

## Accessibility and Error Recovery

- Associate every field with its error text using `aria-describedby`.
- Toggle `aria-invalid` with validation state.
- Do not show required-field errors merely because an untouched empty field loses focus. Validate empty values on submit; validate entered values on blur.
- Add a focusable form-level live status near the submit control for sending, service failure, and network failure.
- On invalid submission, focus the first invalid field.
- On async failure, preserve all input and focus the status message.
- On success, announce and focus the success heading.
- When resetting after success, clear validation state and return focus to the name field.

## Visual Treatment

- Keep the current glass shell, Sakura palette, field layout, and ofuda CTA.
- Remove the duplicated altar-header status treatment but retain the compact form title.
- Render alternative-contact links as a low-emphasis footer row rather than pre-form cards.
- Use spacing, not additional containers, to separate the form from alternative channels.
- Preserve reduced-motion and reduced-transparency behavior.

### Composed Writing Panel

- Keep the message field visually subordinate to the primary submit action instead of letting it dominate the form as a full-height black slab.
- Use a stable writing area: 240px minimum on small screens and 300px minimum on desktop, without the browser's native resize grip.
- Give the writing surface restrained violet depth, an inset top highlight, and an offset shadow that matches the shrine glass system.
- Integrate the character counter into the utility footer beside the minimum-length guidance, leaving the field label clean.
- Preserve `maxlength`, counter updates, error styling, keyboard focus, selection color, caret color, and assistive-text associations.

### Etched Shrine Rim

- Use a subdued plum outer edge at rest so the message panel does not appear permanently focused.
- Add a fine inset Sakura-rose line to create an engraved double-rim effect.
- Mark the four corners with restrained one-pixel gold brackets that echo the ofuda CTA without copying its full frame.
- On hover and focus, increase rim and corner clarity rather than adding a broad neon halo.
- On validation errors, keep the semantic rose-red border dominant and suppress the decorative gold accents.

## Verification

- Run the Impeccable layout detector before and after implementation.
- Run `npm run build` and verify `.vercel/output/functions/_render.func/.vc-config.json` contains `nodejs22.x`.
- Inspect desktop and mobile layouts when a browser surface is available.
- Verify keyboard order, first-invalid focus, live error status, preserved input after failure, `maxlength`, reset focus, and no horizontal overflow.

## Out of Scope

- Replacing Web3Forms or changing backend delivery.
- Redesigning the broader homepage or footer.
- Adding new social profiles, analytics, draft persistence, or dependencies.
