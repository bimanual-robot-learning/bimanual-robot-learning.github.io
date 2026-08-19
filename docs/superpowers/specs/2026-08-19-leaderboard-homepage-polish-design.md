# Leaderboard Homepage Polish Design

## Goal

Polish the public empty state of the challenge leaderboard, keep its opening date on one line on desktop, and surface the same leaderboard on the workshop homepage without creating a second source of truth.

## Shared content

The workshop homepage and Challenge Hub use the existing `ChallengeLeaderboard` component and the existing typed leaderboard data in `src/data/challengeHub.ts`.

The empty state reads:

> **Leaderboard opens August 25, 2026**
>
> Verified online evaluation results will be published here as submissions are evaluated.

The component continues to render the six public table headers:

- Rank
- Team
- Online Score
- Real-Robot Score
- Final Score
- Status

No fictitious teams or scores are displayed before verified results exist.

## Challenge Hub presentation

The Challenge Hub retains its existing Leaderboard section and deep-navy editorial-table treatment. The header date `Online evaluation begins August 25, 2026.` is marked as a single unbroken phrase on desktop. Narrow screens may overflow or wrap only when required to preserve page width and accessibility.

The revised empty state uses the existing display font, readable supporting-text color, cyan dividers, and orange focus treatment. It does not introduce a new badge, card style, or accent color.

## Workshop homepage presentation

The homepage adds a full, always-expanded Leaderboard immediately after the Challenge Prize Pool and before the two collapsible logistics panels.

The homepage section includes:

- a small challenge-style eyebrow;
- a visible `Leaderboard` heading;
- the opening-date status phrase;
- the complete shared six-column table and empty state.

The section uses the same deep-navy table surface as the Challenge Hub so it reads as a results area, while its outer spacing, corner treatment, and heading scale follow the homepage Challenge section. It remains visually distinct from the prize panel and from the Evaluation Format / Challenge Timeline disclosures.

On mobile, the outer section fits the viewport and the table retains its existing accessible horizontal-scrolling behavior. The empty-state message remains visible in the initial viewport.

## Accessibility

- Both sections are labelled regions with unique heading IDs.
- Table semantics, caption, column headers, keyboard-scroll focus, and focus-visible treatment remain intact.
- The shared component receives no duplicated prose from page-specific markup.
- The desktop non-wrapping date rule must not create page-level horizontal overflow on mobile.

## Verification

Automated tests verify:

1. the revised empty-state copy;
2. the non-wrapping date styling hook;
3. the six headers on both pages;
4. homepage placement after prizes and before logistics;
5. the absence of fictitious leaderboard entries;
6. preserved keyboard and horizontal-scroll behavior.

Production build, lint, diff checks, and desktop/mobile visual inspection complete the verification.
