# Introduction and Speaker Scale Refinement

## Goal

Refine the Introduction so that it reads like a concise academic workshop statement rather than a set of peer topic cards, and reduce the visual dominance of invited-speaker portraits while preserving the existing 3+2 arrangement.

## Introduction Layout

The Introduction will use a single-column, editorial layout inspired by an academic paper and the balance of the original Google Site.

The content order remains unchanged:

1. Research context and the central scaling-versus-structure question.
2. The scaling view.
3. The structure view.
4. The workshop objective and concluding statement.

All four passages will sit within one centered text column rather than separate cards. The column will be wide enough for comfortable desktop reading but narrower than the full page to avoid long line lengths. The first passage will use the same body-text scale as the two viewpoints, so it does not visually overpower them.

The scaling and structure passages will use small inline labels and restrained color accents—orange for Scaling and blue for Structure—without changing their font size, width, or spacing. This preserves their equal status. The concluding statement will remain clearly identifiable through a subtle rule or lightly tinted background, but it will not resemble a fourth topic card.

On tablet and mobile viewports, the same single-column reading order will be retained. No horizontal layout transformation is needed.

## Invited Speakers

The existing desktop arrangement remains three speakers in the first row and two centered speakers in the second row.

The speaker grid will be constrained to approximately 75% of its current desktop width and centered within the page. Each portrait card will therefore be about 25% smaller, while names and institutions remain readable and retain their current typographic hierarchy.

At narrower breakpoints, the grid will continue to adapt responsively. The 25% reduction applies to the desktop presentation; mobile cards will continue to use the available column width rather than becoming unnecessarily small.

## Content and Behavior Constraints

- No workshop facts, names, institutions, links, or Introduction meanings will change.
- The existing Kaifeng Zhang portrait remains in use.
- Speaker cards remain non-clickable and contain no personal homepage links.
- Existing keyboard navigation, focus styling, reduced-motion behavior, and image alternative text remain intact.

## Validation

- Update automated tests to reflect the new Introduction semantics without testing incidental CSS details.
- Run the full test suite, lint, and production build.
- Verify the Introduction and speaker grid at 1440px, 768px, and 390px.
- Confirm no horizontal overflow and no browser console errors.
- Confirm the desktop speaker rows remain 3+2 and the grid is approximately 25% narrower than the previous version.
