# Challenge Homepage Polish Design

## Goal

Improve the visual hierarchy and readability of the Challenge content on the Workshop homepage while preserving the current facts, page structure, and overall visual language.

## Scope

This change affects only the homepage Challenge section and Challenge Organizers section. It does not alter the standalone `/challenge/` Coming Soon page, Challenge rules, dates, prizes, task descriptions, resource status, or navigation.

## Challenge Title Hierarchy

The existing title remains one semantic level-two heading, but its two ideas become separately styled spans:

- Lead: `Towards Bimanual Intelligence:`
- Highlight: `A Real-World Household Manipulation Challenge`

The lead remains deep navy. The highlight starts on a new line and uses the site's warm orange accent, with nearly the same scale and weight as the lead. This makes the Challenge identity prominent without presenting it as a separate heading or an IROS-level official Challenge Track.

The title data becomes structurally explicit rather than splitting a sentence inside the component. The Challenge configuration stores `titleLead` and `titleHighlight`, while the component renders both inside the same `h2`. The complete accessible heading name remains `Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge`.

Desktop, tablet, and compact breakpoints use balanced typography so neither title line becomes excessively tall or fragmented.

## Introduction Readability

The Challenge introduction keeps its current cyan left rule and editorial block treatment. Its desktop font size increases from `1.08rem` to approximately `1.18rem`, with the existing medium weight and generous line height retained. Compact screens use a smaller responsive value so the paragraph remains readable without becoming visually dominant.

No wording changes are made.

## Compact Evaluation Format

The `How it works / Evaluation Format` module retains all content and its two-stage plus Final Ranking structure. It becomes vertically tighter through coordinated spacing changes:

- reduce the module's outer padding;
- reduce the heading bottom margin;
- reduce stage-card padding;
- reduce the stage-number bottom margin;
- slightly reduce the gap between stage cards;
- reduce the Final Ranking top margin and top padding.

Text sizes stay substantially unchanged. The module should feel more concise, not compressed or harder to scan. The desktop arrow between stages and the mobile downward flow remain intact.

## Challenge Organizer Institutions and Layout

The Challenge Organizer data includes these institutions:

- Kai Li — `PrimeBot`
- Ran Cheng — `PrimeBot`
- Yan Shen — `Peking University`
- Hao Dong — `PrimeBot · Peking University`

The organizer grid changes from four columns to two columns on desktop and tablet, visually matching the Workshop Organizer section's horizontal-card rhythm. Each row contains two organizers. Cards retain square portraits, show name and institution, and allow the longest institution to wrap naturally without reducing text below the site's readable body scale.

On compact mobile screens, the grid becomes one column. Portraits remain square and cards retain a horizontal image-and-copy structure where space permits.

## Accessibility and Semantics

- The Challenge title remains one `h2` with a complete accessible name.
- Decorative styling spans do not add redundant spoken content.
- Organizer institution text remains ordinary readable text associated with each person card.
- Existing image alternative text, section labels, stage ordering, and focus behavior remain unchanged.
- Color contrast for the orange title highlight must remain readable against the cool-white Challenge background.

## Validation

- Automated tests verify the structured title data, full rendered heading name, exact organizer institutions, two-column organizer grid, responsive one-column behavior, and compact Evaluation spacing contracts.
- Run the complete test suite, linter, TypeScript build, and production build.
- Check the homepage at 1440px, 768px, and 390px widths for:
  - clean title wrapping and highlight visibility;
  - readable introduction text;
  - compact but legible Evaluation Format layout;
  - two organizers per row on desktop/tablet and one per row on mobile;
  - natural wrapping of `PrimeBot · Peking University`;
  - no horizontal overflow or console errors.
- Confirm the standalone `/challenge/` page remains unchanged.

## Release

The completed change is previewed locally first. It is pushed to the public GitHub Pages site only after user approval.
