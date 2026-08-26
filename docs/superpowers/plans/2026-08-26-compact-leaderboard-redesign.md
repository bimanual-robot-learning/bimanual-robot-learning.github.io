# Compact Challenge Leaderboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the shared Challenge leaderboard as a centered compact table with short public team IDs and precisely aligned score headers and values.

**Architecture:** Keep canonical imported IDs and ranking data unchanged, and format team IDs only inside the shared React presentation component. Add explicit semantic column hooks and a shared fixed-column CSS layout so the Workshop homepage and Challenge subpage inherit identical behavior.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

---

## File Map

- `src/challenge/ChallengeLeaderboard.tsx`: public ID formatting, column markup, and shared score-alignment hooks.
- `src/challenge/ChallengeLeaderboard.css`: centered 800px viewport, 540px minimum table width, fixed column proportions, tighter rows, and score alignment.
- `src/challenge/ChallengeLeaderboard.test.tsx`: display-format, semantic-markup, and CSS regression coverage.
- `src/App.test.tsx`: Workshop homepage integration assertion for the shared compact leaderboard.
- `src/challenge/ChallengeHub.test.tsx`: Challenge subpage integration assertion for the shared compact leaderboard.

### Task 1: Short Public IDs and Explicit Score Alignment

**Files:**
- Modify: `src/challenge/ChallengeLeaderboard.test.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.tsx`

- [ ] **Step 1: Write the failing display-format test**

Update the populated-table test so its first entry is stored canonically as `T000015`, while the rendered accessible row name is short:

```tsx
const firstEntry = {
  rank: 1,
  teamId: 'T000015',
  teamName: 'npu-eai',
  totalScore: 73.89246498024903,
} as const

const entries: readonly ChallengeLeaderboardEntry[] = [
  firstEntry,
  { rank: 2, teamId: 'T000012', teamName: 'sota', totalScore: 61.8 },
  { rank: 3, teamId: 'T000010', teamName: 'Primotion', totalScore: 61 },
  { rank: 4, teamId: 'T000011', teamName: 'Horizon', totalScore: 45.316 },
]

expect(rows[0]).toHaveAccessibleName('1 T15 npu-eai 73.89')
expect(rows[1]).toHaveAccessibleName('2 T12 sota 61.80')
expect(rows[2]).toHaveAccessibleName('3 T10 Primotion 61.00')
expect(rows[3]).toHaveAccessibleName('4 T11 Horizon 45.32')
expect(firstEntry.teamId).toBe('T000015')
```

Add assertions proving the score header and score cell share one alignment class:

```tsx
expect(screen.getByRole('columnheader', { name: 'Total Score' })).toHaveClass(
  'challenge-leaderboard__score-align',
)
expect(rows[0].querySelector('.challenge-leaderboard__score')).toHaveClass(
  'challenge-leaderboard__score-align',
)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: FAIL because rows still expose `T000015` and the shared score-alignment class does not exist.

- [ ] **Step 3: Implement presentation-only ID formatting and column hooks**

Add this formatter above the component:

```tsx
function formatTeamId(teamId: string) {
  const finalDigits = teamId.match(/(\d{2})$/)?.[1]
  return finalDigits ? `T${finalDigits}` : teamId
}
```

Add a semantic `colgroup` inside the table:

```tsx
<colgroup>
  <col className="challenge-leaderboard__rank-column" />
  <col className="challenge-leaderboard__id-column" />
  <col className="challenge-leaderboard__name-column" />
  <col className="challenge-leaderboard__score-column" />
</colgroup>
```

Apply `challenge-leaderboard__score-align` to the `Total Score` header and score cells, and render `{formatTeamId(entry.teamId)}` instead of the canonical ID. Continue using `entry.teamId` as the React key.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: all tests in the file PASS.

- [ ] **Step 5: Commit the behavior change**

```bash
git add src/challenge/ChallengeLeaderboard.tsx src/challenge/ChallengeLeaderboard.test.tsx
git commit -m "feat: simplify public leaderboard IDs"
```

### Task 2: Centered Compact Table Layout

**Files:**
- Modify: `src/challenge/ChallengeLeaderboard.test.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.css`
- Modify: `src/App.test.tsx`
- Modify: `src/challenge/ChallengeHub.test.tsx`

- [ ] **Step 1: Write failing CSS and integration assertions**

In `ChallengeLeaderboard.test.tsx`, replace the old 620px assertion and add exact layout assertions:

```tsx
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__viewport\s*\{[^}]*width:\s*min\(100%,\s*800px\);[^}]*margin-inline:\s*auto;[^}]*overflow-x:\s*auto;/,
)
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table\s*\{[^}]*min-width:\s*540px;[^}]*table-layout:\s*fixed;/,
)
expect(leaderboardStyles).toMatch(/\.challenge-leaderboard__rank-column\s*\{[^}]*width:\s*12%;/)
expect(leaderboardStyles).toMatch(/\.challenge-leaderboard__id-column\s*\{[^}]*width:\s*17%;/)
expect(leaderboardStyles).toMatch(/\.challenge-leaderboard__name-column\s*\{[^}]*width:\s*46%;/)
expect(leaderboardStyles).toMatch(/\.challenge-leaderboard__score-column\s*\{[^}]*width:\s*25%;/)
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table \.challenge-leaderboard__score-align\s*\{[^}]*text-align:\s*left;/,
)
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table th,\s*\.challenge-leaderboard__table td\s*\{[^}]*padding:\s*15px 12px;/,
)
```

In `App.test.tsx` and `ChallengeHub.test.tsx`, replace the 620px integration expectation with `min-width: 540px` and assert the shared stylesheet includes `width: min(100%, 800px)`.

- [ ] **Step 2: Run the three focused test files and verify RED**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx src/App.test.tsx src/challenge/ChallengeHub.test.tsx
```

Expected: FAIL because the existing CSS is full-width, uses a 620px minimum, lacks fixed column widths, and uses 18px by 14px padding.

- [ ] **Step 3: Implement the compact shared stylesheet**

Update the viewport and table rules:

```css
.challenge-leaderboard__viewport {
  width: min(100%, 800px);
  max-width: 100%;
  margin-inline: auto;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  background: rgba(3, 20, 29, 0.58);
  border: 1px solid rgba(82, 216, 230, 0.22);
  border-radius: 7px;
  scrollbar-width: thin;
}

.challenge-leaderboard__table {
  width: 100%;
  min-width: 540px;
  table-layout: fixed;
  border-collapse: collapse;
  color: var(--paper);
}

.challenge-leaderboard__rank-column { width: 12%; }
.challenge-leaderboard__id-column { width: 17%; }
.challenge-leaderboard__name-column { width: 46%; }
.challenge-leaderboard__score-column { width: 25%; }

.challenge-leaderboard__table th,
.challenge-leaderboard__table td {
  padding: 15px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(183, 220, 230, 0.18);
}

.challenge-leaderboard__score-align {
  text-align: left;
}
```

Remove the implicit `thead th:last-child` alignment selector so header and values depend on the explicit shared class. Keep the score emphasis as:

```css
.challenge-leaderboard__score {
  color: var(--cyan);
  font-weight: 800;
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx src/App.test.tsx src/challenge/ChallengeHub.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 5: Run the complete verification gate**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: 0 test failures, lint exit 0, production build exit 0, and no whitespace errors.

- [ ] **Step 6: Verify layout in the browser**

Use the production preview at 1440px and 390px for both `/` and `/challenge/`. Verify:

- the table is centered and no wider than 800px;
- rendered IDs are `T15`, `T12`, `T10`, `T11`, `T13`, `T14`, `T16`, and `T17`;
- the left edge of the `Total Score` header matches every score value;
- the page itself has no horizontal overflow;
- any mobile horizontal movement remains inside the table viewport;
- keyboard focus remains visible.

- [ ] **Step 7: Commit the layout change**

```bash
git add src/challenge/ChallengeLeaderboard.css src/challenge/ChallengeLeaderboard.test.tsx src/App.test.tsx src/challenge/ChallengeHub.test.tsx
git commit -m "style: tighten challenge leaderboard layout"
```

### Task 3: Consistent Rank Centering and Top-Three Medals

**Files:**
- Modify: `src/challenge/ChallengeLeaderboard.test.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.css`

- [ ] **Step 1: Write failing markup and CSS assertions**

Extend the populated-table test with these assertions:

```tsx
expect(screen.getByRole('columnheader', { name: 'Rank' })).toHaveClass(
  'challenge-leaderboard__rank-align',
)

const rankCells = rows.map((row) =>
  row.querySelector('.challenge-leaderboard__rank'),
)
rankCells.forEach((rankCell) => {
  expect(rankCell).toHaveClass('challenge-leaderboard__rank-align')
})

expect(rankCells[0]?.querySelector('.challenge-leaderboard__rank-badge')).toHaveTextContent('1')
expect(rankCells[1]?.querySelector('.challenge-leaderboard__rank-badge')).toHaveTextContent('2')
expect(rankCells[2]?.querySelector('.challenge-leaderboard__rank-badge')).toHaveTextContent('3')
expect(rankCells[3]?.querySelector('.challenge-leaderboard__rank-badge')).toBeNull()
```

Replace the score-alignment CSS expectation and add medal/centering assertions:

```tsx
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table \.challenge-leaderboard__score-align\s*\{[^}]*text-align:\s*left;/,
)
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table \.challenge-leaderboard__rank-align\s*\{[^}]*text-align:\s*center;/,
)
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__rank-badge\s*\{[^}]*display:\s*inline-grid;[^}]*width:\s*28px;[^}]*height:\s*28px;[^}]*place-items:\s*center;[^}]*border-radius:\s*50%;/,
)
expect(leaderboardStyles).toContain('[data-rank-accent="gold"] .challenge-leaderboard__rank-badge')
expect(leaderboardStyles).toContain('[data-rank-accent="silver"] .challenge-leaderboard__rank-badge')
expect(leaderboardStyles).toContain('[data-rank-accent="bronze"] .challenge-leaderboard__rank-badge')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: FAIL because Rank cells are not explicitly centered, ranks 1–3 lack badge elements, and scores still align right.

- [ ] **Step 3: Implement consistent alignment and medal markup**

Apply `challenge-leaderboard__rank-align` to the Rank header and every rank cell. In the populated-row map, compute the existing accent once and use it both on the row and to conditionally wrap only ranks 1–3:

```tsx
{entries.map((entry) => {
  const rankAccent = getRankAccent(entry.rank)

  return (
    <tr
      data-rank-accent={rankAccent}
      data-testid="challenge-leaderboard-entry"
      key={entry.teamId}
    >
      <td className="challenge-leaderboard__rank challenge-leaderboard__rank-align">
        {rankAccent ? (
          <span className="challenge-leaderboard__rank-badge">
            {entry.rank}
          </span>
        ) : (
          entry.rank
        )}
      </td>
      <td className="challenge-leaderboard__team-id">
        {formatTeamId(entry.teamId)}
      </td>
      <th scope="row">{entry.teamName}</th>
      <td className="challenge-leaderboard__score challenge-leaderboard__score-align">
        {formatScore(entry.totalScore)}
      </td>
    </tr>
  )
})}
```

Use this explicit Rank header markup:

```tsx
<th scope="col" className="challenge-leaderboard__rank-align">
  Rank
</th>
```

Update the alignment and medal CSS:

```css
.challenge-leaderboard__table .challenge-leaderboard__rank-align {
  text-align: center;
}

.challenge-leaderboard__table .challenge-leaderboard__score-align {
  text-align: left;
}

.challenge-leaderboard__rank-badge {
  display: inline-grid;
  width: 28px;
  height: 28px;
  color: var(--ink-950);
  font-weight: 800;
  line-height: 1;
  border-radius: 50%;
  place-items: center;
}

.challenge-leaderboard__table tr[data-rank-accent="gold"] .challenge-leaderboard__rank-badge {
  background: #f1c75b;
  box-shadow: 0 0 0 3px rgba(241, 199, 91, 0.12);
}

.challenge-leaderboard__table tr[data-rank-accent="silver"] .challenge-leaderboard__rank-badge {
  background: #c7d2d9;
  box-shadow: 0 0 0 3px rgba(199, 210, 217, 0.1);
}

.challenge-leaderboard__table tr[data-rank-accent="bronze"] .challenge-leaderboard__rank-badge {
  background: #d99568;
  box-shadow: 0 0 0 3px rgba(217, 149, 104, 0.1);
}
```

Remove the old rules that color the entire rank cell for the top three. Keep `.challenge-leaderboard__score` cyan and bold for every row.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
npm test
npm run lint
npm run build
git diff --check
```

Expected: focused and full suites PASS, lint and build exit 0, and no whitespace errors.

- [ ] **Step 5: Verify both pages in the browser**

At 1440px and 390px on both `/` and `/challenge/`, verify:

- the Rank header and ranks 1–8 share one centered axis;
- only ranks 1–3 have circular fills;
- all score values retain the same cyan emphasis;
- the `Total Score` header and every score share one left edge;
- no page-level horizontal overflow is introduced.

- [ ] **Step 6: Commit**

```bash
git add src/challenge/ChallengeLeaderboard.tsx src/challenge/ChallengeLeaderboard.css src/challenge/ChallengeLeaderboard.test.tsx
git commit -m "style: add leaderboard rank medals"
```
