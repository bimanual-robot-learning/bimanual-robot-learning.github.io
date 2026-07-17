# Square Speaker Portraits and Organizer Affiliation Design

## Goal

Correct the invited-speaker presentation so every portrait is square, the entire portrait is approximately 25% smaller than the earlier `930px` desktop-grid version, and the two speaker rows have substantially more vertical separation. Add PrimeBot to Hao Dong's organizer affiliation.

## Speaker layout

- Keep the desktop speaker grid at a maximum width of `720px` with the existing centered 3+2 placement.
- Keep the desktop column gap at `26px`.
- Set speaker media to `aspect-ratio: 1`, producing approximately `223 × 223px` portraits at the desktop maximum width.
- Set the desktop row gap to `72px`, matching the selected airy Option C.
- Preserve `object-fit: cover`, image focal behavior, typography, hover treatment, and all speaker content.
- Scope the square aspect ratio to speaker cards only. Organizer portraits retain their existing compact card-specific aspect ratio.

## Responsive behavior

- Preserve the existing 3+2 layout above `720px`, two columns at `720px` and below, and one column at `480px` and below.
- Keep speaker portraits square at every breakpoint.
- At `720px` and below, retain the existing `18px` column gap and use a `56px` row gap.
- At `480px` and below, use a `40px` row gap to avoid excessive single-column scrolling while remaining more spacious than the current layout.
- Do not alter organizer layout, portrait shape, or card sizing.

## Organizer content

- Change Hao Dong's institution from `Peking University` to `Peking University · PrimeBot` in the typed workshop data.
- Do not add a link or change any other organizer affiliation.

## Verification

- Add focused regression assertions for the square speaker-media rule, desktop `72px` row gap, and Hao Dong's complete institution text.
- Run the full Vitest suite, linter, and production build.
- Inspect the rendered speaker section at desktop and responsive widths to confirm square portraits, centered 3+2 placement, selected row spacing, loaded images, and no horizontal overflow.
