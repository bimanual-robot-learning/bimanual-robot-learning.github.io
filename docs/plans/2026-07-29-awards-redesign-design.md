# Awards Redesign — Approved Design

## Goal

Make the workshop awards and their sponsor substantially more visible within the
Call for Papers section while preserving the site's academic tone, existing
visual language, and all award facts.

## Information Order

The Call for Papers section will use this order:

1. CFP topic cards
2. Awards showcase
3. A combined Submission Format and Important Dates panel

This moves Awards into the first major highlight after the research topics.
Submission requirements and dates remain easy to find, but become one practical
information block below the Awards showcase.

## Awards Showcase

The showcase is a full-width, deep-navy panel using the site's restrained
precision-grid treatment and cyan/orange accent colors.

The heading stack is left aligned:

- `Recognition — IROS 2026 Workshop`
- `Awards`
- `Sponsored by PrimeBot`

`PrimeBot` appears in a prominent warm-orange color and larger type than
`Sponsored by`. The sponsor line sits immediately below the Awards heading. It
does not use a leading decorative line and is not positioned in the upper-right
corner.

## Award Cards

The two award cards have equal width in a strict 1:1 desktop grid. Neither card
is visually demoted. Both use the same internal grammar:

- Award name at the top
- Large selected-paper count on the lower left
- Large prize amount on the lower right
- A short clarification below the amount

### Best Workshop Paper Award

- Count: `1`
- Count label: `Selected paper`
- Amount: `USD 1,000`
- Clarification: `For the selected paper`

### Outstanding Workshop Paper Award

- Count: `3`
- Count label: `Selected papers`
- Amount: `USD 500`
- Clarification: `For each paper`

The design does not use `× 1`, `× 3`, or another multiplication-style
expression. Separating recipient count from amount avoids making the awards look
like product pricing and prevents the USD 500 award from being mistaken for a
USD 1,500 total.

## Submission Format and Important Dates

The existing Submission Format and Important Dates content will be consolidated
into one full-width panel directly below Awards:

- Submission Format uses the wider left column.
- Important Dates uses the right column.
- Existing submission requirements, dates, and external links remain unchanged.
- The panel provides a quieter visual transition after the dark Awards stage.

## Responsive Behavior

- Desktop and tablet: award cards remain a 1:1 two-column grid when space allows.
- Mobile: award cards stack vertically at full width.
- The internal count/amount structure remains readable without horizontal
  scrolling.
- Submission Format and Important Dates stack on narrow screens.

## Accessibility and Motion

- Text and accent colors must retain WCAG-readable contrast against the navy
  panel.
- Award names, counts, amounts, and clarifications remain text rather than
  decorative images.
- The section follows the page's existing reduced-motion behavior.
- Content order remains meaningful without CSS.

## Implementation Scope

- Reorder and regroup the existing CFP JSX in `src/App.tsx`.
- Add or revise scoped Awards and CFP-detail styles in `src/App.css`.
- Continue using the typed award, submission, and date data from
  `src/data/workshop.ts`.
- Do not add new dependencies, sponsor logos, or external assets.
- Update tests to verify the two award names, prize amounts, recipient counts,
  sponsor attribution, and the merged practical-information panel.

## Acceptance Criteria

- Awards appear immediately after the CFP topic cards.
- Both award cards are equal width on desktop.
- PrimeBot is clearly visible below the Awards heading.
- Prize amounts and recipient counts cannot reasonably be confused.
- Submission Format and Important Dates share one panel below Awards.
- Desktop and mobile layouts have no horizontal overflow.
- Existing CFP facts, dates, links, and award values are preserved.
