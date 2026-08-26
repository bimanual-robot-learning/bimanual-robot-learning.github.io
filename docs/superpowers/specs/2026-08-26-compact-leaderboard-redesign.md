# Compact Challenge Leaderboard Redesign

## Goal

Make the shared Challenge leaderboard easier to scan on both the Workshop homepage and the Challenge subpage while preserving the existing four-column semantic table and verified ranking data.

## Approved Direction

Use the centered compact-table design (visual option A).

The leaderboard remains a single table with these columns, in this order:

1. Rank
2. Team ID
3. Team Name
4. Total Score

## Display Rules

- Display each team ID as `T` followed by the final two digits of its canonical ID. Examples: `T000015` becomes `T15`, and `T000012` becomes `T12`.
- Keep the full canonical team ID in generated data and React keys. The shortening is presentation-only so recurring CSV imports do not lose source identity.
- Continue displaying total scores with exactly two decimal places.
- Apply one explicit shared right-alignment hook to both the `Total Score` header and every score cell so their right edges align exactly.
- Keep tabular numerals for ranks, team IDs, and scores.
- Retain restrained gold, silver, and bronze text accents on the top-three rank values only.

## Layout

- Center the shared leaderboard table within its section and cap its reading width at 800px instead of stretching it across the full available section width.
- Use a fixed column layout with 12% for Rank, 17% for Team ID, 46% for Team Name, and 25% for Total Score.
- Keep the Team Name column visually dominant and give the score column enough width for its header and values to align without crowding.
- Preserve the existing dark navy surface, subtle cyan border, quiet row dividers, and overall Workshop visual language.
- Use 15px vertical and 12px horizontal cell padding so rows remain readable while becoming slightly tighter than the current version.

## Responsive Behavior

- The component must not create page-level horizontal overflow.
- At narrow widths, contain any necessary horizontal movement inside the leaderboard viewport.
- Reduce the table's minimum width from 620px to 540px so mobile users need less horizontal movement, without shrinking essential text below the site's readable typography standard.
- Preserve the keyboard-focus outline and accessible horizontal-scroll label.

## Shared Rendering

- Implement the redesign in the shared `ChallengeLeaderboard` component and stylesheet.
- The Workshop homepage and `/challenge/` subpage must therefore render the same formatting and the same eight verified rows automatically.

## Testing and Validation

- Add a unit test that proves canonical IDs render in the required short form while canonical data remains unchanged.
- Add a unit/CSS regression test proving the score header and score cells share the same right-alignment hook.
- Add layout regression assertions for the centered maximum width, fixed column proportions, reduced minimum width, and internal overflow containment.
- Run the complete test suite, lint, TypeScript production build, and `git diff --check`.
- Visually verify the homepage and Challenge subpage at desktop and mobile widths, including the right edge of the `Total Score` header and score values.

## Out of Scope

- Changing ranks, team names, or scores.
- Changing the CSV schema or recurring import workflow.
- Adding podium cards, filters, sorting, search, pagination, or animations.
- Publishing or pushing before the user approves the revised local preview.
