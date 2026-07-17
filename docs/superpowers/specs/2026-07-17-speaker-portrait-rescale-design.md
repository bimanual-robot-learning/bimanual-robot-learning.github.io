# Invited Speaker Portrait Rescale Design

## Goal

Reduce the invited-speaker portraits by approximately 25% from their current desktop size while preserving the established three-card first row, centered two-card second row, and the visual hierarchy of the surrounding section.

## Desktop layout

- Reduce the speaker grid maximum width from `930px` to `720px`.
- Increase the grid gap from `22px` to `26px` so the smaller portraits retain deliberate whitespace rather than appearing tightly packed.
- Keep the existing six-column placement rules. The first three cards continue to span two columns each; cards four and five remain centered in columns 2–3 and 4–5.
- Keep portrait aspect ratio, cropping, typography, hover treatment, and speaker content unchanged.

At the current desktop geometry, this changes each portrait from approximately `295px` wide to approximately `223px`, a reduction of about 25%.

## Responsive behavior

- Apply the compact `720px` grid and `26px` gap above the existing `920px` layout breakpoint.
- Preserve the current two-column layout at `920px` and below and the single-column layout at the smallest breakpoint. Those layouts already use viewport-limited widths, so further shrinking would reduce readability.
- Do not change organizer cards or any other section.

## Verification

- Add a focused style regression assertion for the speaker grid width and gap.
- Run the full Vitest suite, linter, and production build.
- Inspect the section at a desktop viewport to confirm the 3+2 composition, added whitespace, image loading, and lack of horizontal overflow.

