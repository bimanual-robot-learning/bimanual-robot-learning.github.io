# Challenge Leaderboard and Homepage Accordions Design

## Goal

Add a publication-ready leaderboard to the Challenge Hub and make the workshop
homepage Challenge logistics more compact without hiding its primary actions.
The leaderboard must be truthful before results exist, straightforward to
populate later, and consistent with the established workshop visual language.

This change has two bounded surfaces:

1. Replace the Challenge Hub's current leaderboard coming-soon card with a
   structured unified leaderboard.
2. Make `Evaluation Format` and `Challenge Timeline` independently collapsible
   on the workshop homepage only.

The dedicated `/challenge/` page keeps its Evaluation Format and Challenge
Timeline fully expanded.

## Reference and Direction

The LeHome Challenge demonstrates that a challenge website benefits from a
clearly labeled results table with phase-specific scores. This workshop uses a
different progression: online evaluation selects up to five teams for
real-robot evaluation, and the final ranking combines both results. Therefore,
one unified table communicates the relationship between stages better than two
independent leaderboards.

The selected visual direction is the restrained `Editorial Table` option:
deep navy surface, clear ruled rows, cyan structural accents, an orange result
status, and no podium treatment before verified results exist.

## Challenge Hub Leaderboard

### Placement and Navigation

The leaderboard remains in its existing position after the prize section and
before Challenge Organizers. The Challenge Hub navigation item continues to be
named `Leaderboard`, but its target changes from the legacy `#updates` anchor to
`#leaderboard`. The section ID changes accordingly.

The leaderboard appears only on `/challenge/`. It is not duplicated on the
workshop homepage.

### Header

The module header contains:

- Status label: `Results pending`
- Visible section heading: `Leaderboard`
- Context line: `Online evaluation begins August 25, 2026.`

The former `Leaderboard opens with online evaluation.` title and explanatory
coming-soon paragraphs are removed. The table itself is the primary content.

### Table Schema

The semantic table always renders these six columns:

1. `Rank`
2. `Team`
3. `Online Score`
4. `Real-Robot Score`
5. `Final Score`
6. `Status`

The table has a visually hidden caption that explains it contains the Household
Bimanual Manipulation Challenge rankings. Column headings use `<th scope="col">`.

### Empty State

No fictitious teams, scores, ranks, or test names appear on the public page.
When the entry array is empty, the table header remains visible and a single
body row spans all six columns:

> **No results yet**  
> Online evaluation begins August 25, 2026. Rankings will be published after
> results are verified.

This replaces generic placeholder characters with a meaningful public status.

### Future Entries

Leaderboard content lives in typed static configuration. A leaderboard entry
uses this shape:

```ts
interface ChallengeLeaderboardEntry {
  rank: number
  team: string
  onlineScore: number
  realRobotScore: number | null
  finalScore: number | null
  status: 'Online Evaluation' | 'Finalist' | 'Final Result'
}
```

Missing scores render as an em dash rather than zero. Zero can therefore remain
a legitimate evaluated score. Initial status values are constrained to:

- `Online Evaluation`
- `Finalist`
- `Final Result`

The initial release uses an empty array. Adding real results later requires only
editing data, not rebuilding the component structure.

### Component Boundary

Create a focused `ChallengeLeaderboard` component. It receives entries and the
opening date as props and owns:

- the semantic table;
- empty-state rendering;
- score fallback formatting;
- accessible labels and caption;
- the table's horizontally scrollable viewport.

`ChallengeHub` remains responsible for section ordering and the surrounding
page header. This boundary allows empty and populated states to be tested
without mutating global configuration.

### Responsive Behavior

Desktop shows the complete table inside the existing content width. On narrow
screens, the table receives a practical minimum width and scrolls inside its
own viewport. The page itself must not overflow horizontally. The viewport uses
`overflow-x: auto`, an accessible label, and `tabindex="0"` so keyboard users can
reach and scroll the full table.

The full table header remains present at every viewport; mobile does not replace
the table with cards.

## Workshop Homepage Accordions

### Scope

Only the workshop homepage Challenge logistics pair changes. `Submit
Predictions`, `View Dataset`, and `Explore Challenge Details` remain outside the
folding interface and visible at all times.

The two existing modules become separate native `<details>` elements:

- `Evaluation Format`
- `Challenge Timeline`

Both are closed by default on desktop and mobile.

### Summary Treatment

Each `<summary>` is a full-width control containing:

- its existing eyebrow (`How it works` or `Important dates`);
- its existing section title;
- a plus or downward-chevron affordance on the right.

The entire summary header is clickable. The affordance changes orientation or
form when open. Summary controls use visible hover and keyboard-focus states.
Native disclosure semantics provide keyboard interaction and expose expanded
state to assistive technology without custom JavaScript state.

### Expanded Content

Opening a disclosure reveals all existing content unchanged:

- Online Evaluation, Real-Robot Evaluation, task scope, and Final Ranking;
- every Challenge Timeline milestone and its current date/time.

The two disclosures remain equal-width columns on desktop. If one is open and
the other is closed, they align at the top rather than stretching the closed
panel. On mobile, they stack vertically.

The Challenge Hub continues to render both sections as permanently expanded
content and does not reuse the homepage disclosure wrapper.

## Data and State Flow

- Existing challenge evaluation and timeline data remain the single source of
  truth for both pages.
- New leaderboard entries live in the Challenge Hub configuration as an empty,
  typed array.
- The Challenge Hub passes this array into `ChallengeLeaderboard`.
- Homepage disclosure state is browser-local native `<details>` state. It is
  not persisted, synchronized, or stored in React.
- No backend, remote leaderboard API, database, authentication, or polling is
  introduced.

## Accessibility

- Use a semantic `<table>`, caption, scoped headers, and a real body row for the
  empty state.
- The horizontal scroll viewport uses `tabindex="0"` and an accessible label.
- Native `<details>/<summary>` preserves disclosure semantics and keyboard
  operation.
- Summary controls meet the existing minimum touch target and focus treatment.
- Status is communicated in text, not by color alone.
- Empty scores use an em dash with an accessible column header providing
  context.

## Testing and Verification

Automated tests cover:

- all six leaderboard headers in order;
- the empty-state heading and explanatory date text;
- absence of fictitious team rows;
- the `#leaderboard` navigation target and section ID;
- a populated component fixture, including em-dash fallbacks for missing
  scores;
- both homepage disclosure summaries and their default closed state;
- all existing Evaluation Format and Challenge Timeline content remaining in
  the disclosure bodies;
- the Challenge Hub Evaluation Format and Timeline remaining fully expanded;
- responsive CSS that contains table overflow within its viewport;
- reduced-motion behavior for disclosure affordances;
- the existing full test suite, lint, TypeScript production build, and
  `git diff --check`.

Visual verification covers desktop and 390 px layouts. The homepage must not
gain horizontal overflow, the table header must remain readable through its
scroll viewport, and an open disclosure must not stretch its closed neighbor.

## Out of Scope

- Live or automatic score ingestion.
- A separate leaderboard route.
- Filters, sorting, pagination, search, or team detail pages.
- Fake example teams or scores on the public page.
- Changes to challenge rules, scoring formula, dates, prizes, organizers,
  evaluation copy, submission links, or Challenge Hub disclosure behavior.
