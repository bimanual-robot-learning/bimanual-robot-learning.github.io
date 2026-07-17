# Hero Teaser Label Removal

## Goal

Remove the `01 Scaling` and `02 Structure` floating labels from the teaser image so the visual reads more cleanly.

## Design

- Delete both decorative label elements from the Hero media markup.
- Delete all CSS rules used only by those labels, including their responsive hiding rule.
- Keep the teaser image, overlay gradients, Hero title colors, subtitle, workshop metadata, buttons, and spacing unchanged.
- Add a regression assertion that the obsolete `.hero__axis` elements are not rendered.

## Validation

- Run the complete test suite, lint, and production build.
- Verify the labels are absent at a desktop viewport where they were previously visible.
- Confirm the Hero image and title remain unchanged and there is no horizontal overflow or browser console error.
