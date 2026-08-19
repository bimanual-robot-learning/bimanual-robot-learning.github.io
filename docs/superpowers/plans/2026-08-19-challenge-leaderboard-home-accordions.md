# Challenge Leaderboard and Homepage Accordions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Challenge Hub coming-soon card with a truthful, future-ready unified leaderboard and make the workshop homepage Evaluation Format and Challenge Timeline independently collapsible by default.

**Architecture:** Leaderboard data stays in the typed Challenge Hub configuration and flows into a focused semantic-table component with explicit empty and populated states. The homepage uses a reusable native `<details>/<summary>` wrapper around its existing evaluation and timeline bodies, while the Challenge Hub keeps those sections permanently expanded.

**Tech Stack:** Vite, React 19, TypeScript, Vitest, Testing Library, user-event, CSS.

---

### Task 1: Add typed leaderboard data and a semantic table component

**Files:**
- Modify: `src/data/challengeHub.ts`
- Modify: `src/data/challengeHub.test.ts`
- Create: `src/challenge/ChallengeLeaderboard.tsx`
- Create: `src/challenge/ChallengeLeaderboard.test.tsx`

- [ ] **Step 1: Write failing data-contract tests**

In `src/data/challengeHub.test.ts`, replace the old `#updates` and coming-soon
leaderboard expectations with:

```ts
expect(challengeHub.navigation).toContainEqual({
  label: 'Leaderboard',
  href: '#leaderboard',
})
expect(challengeHub.leaderboard).toEqual({
  status: 'Results pending',
  openingDate: 'August 25, 2026',
  entries: [],
})
```

Delete assertions for `title`, `description`, and `stages`; those fields will no
longer exist.

- [ ] **Step 2: Run the data test and verify RED**

Run:

```bash
npm test -- src/data/challengeHub.test.ts
```

Expected: FAIL because navigation still targets `#updates` and the leaderboard
still uses the old coming-soon content shape.

- [ ] **Step 3: Define the typed static leaderboard contract**

In `src/data/challengeHub.ts`, change the navigation href union to include
`'#leaderboard'` instead of `'#updates'`, then define:

```ts
export type ChallengeLeaderboardStatus =
  | 'Online Evaluation'
  | 'Finalist'
  | 'Final Result'

export interface ChallengeLeaderboardEntry {
  rank: number
  team: string
  onlineScore: number
  realRobotScore: number | null
  finalScore: number | null
  status: ChallengeLeaderboardStatus
}

export interface ChallengeHubLeaderboard {
  status: 'Results pending'
  openingDate: 'August 25, 2026'
  entries: readonly ChallengeLeaderboardEntry[]
}
```

Update the navigation item and configuration:

```ts
{ label: 'Leaderboard', href: '#leaderboard' }

leaderboard: {
  status: 'Results pending',
  openingDate: 'August 25, 2026',
  entries: [] satisfies ChallengeLeaderboardEntry[],
} satisfies ChallengeHubLeaderboard,
```

- [ ] **Step 4: Run the data test and verify GREEN**

Run:

```bash
npm test -- src/data/challengeHub.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write failing component tests for empty and populated states**

Create `src/challenge/ChallengeLeaderboard.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import ChallengeLeaderboard from './ChallengeLeaderboard'

const headers = [
  'Rank',
  'Team',
  'Online Score',
  'Real-Robot Score',
  'Final Score',
  'Status',
]

describe('ChallengeLeaderboard', () => {
  it('keeps the full header and renders a truthful empty state', () => {
    render(<ChallengeLeaderboard entries={[]} openingDate="August 25, 2026" />)

    expect(
      screen.getAllByRole('columnheader').map(({ textContent }) => textContent),
    ).toEqual(headers)
    expect(screen.getByText('No results yet')).toBeVisible()
    expect(screen.getByText(
      'Online evaluation begins August 25, 2026. Rankings will be published after results are verified.',
    )).toBeVisible()
    expect(screen.queryByTestId('challenge-leaderboard-entry')).toBeNull()
  })

  it('renders verified entries and uses em dashes for unavailable scores', () => {
    const entries: ChallengeLeaderboardEntry[] = [
      {
        rank: 1,
        team: 'Verified Robotics Team',
        onlineScore: 91.5,
        realRobotScore: null,
        finalScore: null,
        status: 'Finalist',
      },
    ]

    render(
      <ChallengeLeaderboard
        entries={entries}
        openingDate="August 25, 2026"
      />,
    )

    const row = screen.getByTestId('challenge-leaderboard-entry')
    expect(within(row).getByText('Verified Robotics Team')).toBeVisible()
    expect(within(row).getByText('91.5')).toBeVisible()
    expect(within(row).getAllByText('—')).toHaveLength(2)
    expect(within(row).getByText('Finalist')).toBeVisible()
  })
})
```

- [ ] **Step 6: Run the component test and verify RED**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: FAIL because `ChallengeLeaderboard.tsx` does not exist.

- [ ] **Step 7: Implement the semantic leaderboard table**

Create `src/challenge/ChallengeLeaderboard.tsx`:

```tsx
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'

interface ChallengeLeaderboardProps {
  entries: readonly ChallengeLeaderboardEntry[]
  openingDate: string
}

const formatScore = (score: number | null) =>
  score === null ? '—' : score.toLocaleString('en-US', { maximumFractionDigits: 2 })

function ChallengeLeaderboard({
  entries,
  openingDate,
}: ChallengeLeaderboardProps) {
  return (
    <div
      aria-label="Challenge leaderboard table; scroll horizontally to view all columns"
      className="challenge-leaderboard__viewport"
      tabIndex={0}
    >
      <table className="challenge-leaderboard__table">
        <caption className="sr-only">
          Household Bimanual Manipulation Challenge rankings
        </caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Team</th>
            <th scope="col">Online Score</th>
            <th scope="col">Real-Robot Score</th>
            <th scope="col">Final Score</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr className="challenge-leaderboard__empty">
              <td colSpan={6}>
                <strong>No results yet</strong>
                <span>
                  Online evaluation begins {openingDate}. Rankings will be
                  published after results are verified.
                </span>
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr data-testid="challenge-leaderboard-entry" key={entry.team}>
                <td>{entry.rank}</td>
                <th scope="row">{entry.team}</th>
                <td>{formatScore(entry.onlineScore)}</td>
                <td>{formatScore(entry.realRobotScore)}</td>
                <td>{formatScore(entry.finalScore)}</td>
                <td>{entry.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ChallengeLeaderboard
```

- [ ] **Step 8: Verify component GREEN and commit**

Run:

```bash
npm test -- src/data/challengeHub.test.ts src/challenge/ChallengeLeaderboard.test.tsx
npm run lint
```

Expected: both test files pass and lint reports no diagnostics.

```bash
git add src/data/challengeHub.ts src/data/challengeHub.test.ts src/challenge/ChallengeLeaderboard.tsx src/challenge/ChallengeLeaderboard.test.tsx
git commit -m "feat: add typed challenge leaderboard"
```

### Task 2: Integrate and style the Challenge Hub leaderboard

**Files:**
- Modify: `src/challenge/ChallengeHub.tsx`
- Modify: `src/challenge/ChallengeHub.test.tsx`
- Modify: `src/challenge/ChallengeHub.css`
- Create: `src/challenge/ChallengeLeaderboard.css`

- [ ] **Step 1: Write failing integration assertions**

In the main render test in `src/challenge/ChallengeHub.test.tsx`, replace the
old coming-soon heading/stages assertions with:

```ts
const leaderboardLink = within(
  screen.getByRole('navigation', { name: 'Challenge navigation' }),
).getByRole('link', { name: 'Leaderboard' })
expect(leaderboardLink).toHaveAttribute('href', '#leaderboard')

const leaderboard = screen.getByRole('region', { name: 'Leaderboard' })
expect(leaderboard).toHaveAttribute('id', 'leaderboard')
expect(within(leaderboard).getByText('Results pending')).toBeVisible()
expect(within(leaderboard).getByRole('heading', {
  name: 'Leaderboard',
  level: 2,
})).toBeVisible()
expect(within(leaderboard).getByText(
  'Online evaluation begins August 25, 2026.',
)).toBeVisible()
expect(within(leaderboard).getAllByRole('columnheader')).toHaveLength(6)
expect(within(leaderboard).getByText('No results yet')).toBeVisible()
expect(within(leaderboard).queryByText('Coming soon')).toBeNull()
expect(within(leaderboard).queryByTestId('challenge-hub-leaderboard-stage')).toBeNull()
expect(within(leaderboard).queryByText('Team A')).toBeNull()
```

Import `leaderboardStyles` from `./ChallengeLeaderboard.css?raw` and add a
presentation test:

```ts
expect(leaderboardStyles).toContain('.challenge-leaderboard__viewport')
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__viewport\s*\{[^}]*overflow-x:\s*auto;/,
)
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table\s*\{[^}]*min-width:\s*760px;/,
)
expect(leaderboardStyles).toContain('.challenge-leaderboard__empty')
```

- [ ] **Step 2: Run the Hub tests and verify RED**

Run:

```bash
npm test -- src/challenge/ChallengeHub.test.tsx
```

Expected: FAIL because the page still renders the old card and the new
stylesheet does not exist.

- [ ] **Step 3: Replace the old card with the unified table**

Import the component and stylesheet in `src/challenge/ChallengeHub.tsx`:

```tsx
import ChallengeLeaderboard from './ChallengeLeaderboard'
import './ChallengeLeaderboard.css'
```

Replace the old `id="updates"` section with:

```tsx
<section
  aria-labelledby="challenge-hub-leaderboard-title"
  className="challenge-hub__leaderboard"
  id="leaderboard"
>
  <header className="challenge-hub__leaderboard-header">
    <div>
      <p className="challenge-hub__leaderboard-status">
        {challengeHub.leaderboard.status}
      </p>
      <h2 id="challenge-hub-leaderboard-title">Leaderboard</h2>
    </div>
    <p>
      Online evaluation begins {challengeHub.leaderboard.openingDate}.
    </p>
  </header>
  <ChallengeLeaderboard
    entries={challengeHub.leaderboard.entries}
    openingDate={challengeHub.leaderboard.openingDate}
  />
</section>
```

- [ ] **Step 4: Replace the old card styles with the editorial module shell**

In `src/challenge/ChallengeHub.css`:

1. Replace `.challenge-hub__leaderboard-card` with
   `.challenge-hub__leaderboard` in the shared width selectors and responsive
   width selectors.
2. Delete all obsolete card `ol`, `li`, stage-dot, and old paragraph-position
   rules.
3. Add this shell treatment:

```css
.challenge-hub__leaderboard {
  position: relative;
  width: min(1240px, calc(100% - 64px));
  padding: clamp(42px, 5vw, 68px);
  margin: clamp(72px, 9vw, 128px) auto 0;
  overflow: hidden;
  color: var(--paper);
  background: var(--ink-950);
  border: 1px solid rgba(183, 220, 230, 0.18);
  border-radius: 8px;
}

.challenge-hub__leaderboard::before {
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--orange), var(--cyan), transparent 72%);
  content: '';
}

.challenge-hub__leaderboard-header {
  display: grid;
  margin-bottom: clamp(28px, 4vw, 44px);
  align-items: end;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
}

.challenge-hub__leaderboard-status {
  display: inline-flex;
  margin: 0 0 12px;
  align-items: center;
  color: var(--orange);
  font: 700 0.72rem/1 var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.challenge-hub__leaderboard-header h2 {
  margin: 0;
  color: var(--paper);
  font: 600 clamp(2.4rem, 5vw, 4.6rem)/0.95 var(--font-display);
  letter-spacing: -0.06em;
}

.challenge-hub__leaderboard-header > p {
  max-width: 280px;
  margin: 0;
  color: var(--cyan);
  font: 600 0.76rem/1.5 var(--font-mono);
  letter-spacing: 0.05em;
  text-align: right;
  text-transform: uppercase;
}
```

In the `max-width: 980px` rule, preserve the existing responsive width. In the
`max-width: 760px` rule, add:

```css
.challenge-hub__leaderboard {
  padding: 34px 22px;
}

.challenge-hub__leaderboard-header {
  grid-template-columns: 1fr;
  gap: 14px;
}

.challenge-hub__leaderboard-header > p {
  max-width: none;
  text-align: left;
}
```

- [ ] **Step 5: Create the focused table stylesheet**

Create `src/challenge/ChallengeLeaderboard.css`:

```css
.challenge-leaderboard__viewport {
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  border-top: 1px solid rgba(82, 216, 230, 0.55);
  scrollbar-color: var(--cyan) rgba(183, 220, 230, 0.12);
  scrollbar-width: thin;
}

.challenge-leaderboard__viewport:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 4px;
}

.challenge-leaderboard__table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  color: var(--paper);
}

.challenge-leaderboard__table th,
.challenge-leaderboard__table td {
  padding: 18px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(183, 220, 230, 0.18);
}

.challenge-leaderboard__table thead th {
  color: rgba(230, 241, 243, 0.78);
  font: 700 0.69rem/1.35 var(--font-mono);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
}

.challenge-leaderboard__table tbody th,
.challenge-leaderboard__table tbody td {
  font-size: 0.92rem;
}

.challenge-leaderboard__empty td {
  padding: clamp(42px, 6vw, 70px) 18px;
  text-align: center;
}

.challenge-leaderboard__empty strong,
.challenge-leaderboard__empty span {
  display: block;
}

.challenge-leaderboard__empty strong {
  margin-bottom: 10px;
  color: var(--paper);
  font: 600 clamp(1.25rem, 2vw, 1.65rem)/1.2 var(--font-display);
}

.challenge-leaderboard__empty span {
  color: var(--slate-light-readable);
  font-size: 0.92rem;
  line-height: 1.6;
}
```

- [ ] **Step 6: Verify integration GREEN and commit**

Run:

```bash
npm test -- src/data/challengeHub.test.ts src/challenge/ChallengeLeaderboard.test.tsx src/challenge/ChallengeHub.test.tsx
npm run lint
npm run build
```

Expected: all targeted tests, lint, and the two-entry production build pass.

```bash
git add src/challenge/ChallengeHub.tsx src/challenge/ChallengeHub.test.tsx src/challenge/ChallengeHub.css src/challenge/ChallengeLeaderboard.css
git commit -m "feat: publish empty challenge leaderboard"
```

### Task 3: Make homepage Challenge logistics independently collapsible

**Files:**
- Create: `src/components/ChallengeDisclosure.tsx`
- Modify: `src/components/ChallengeSection.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write failing homepage disclosure tests**

Add a test to `src/App.test.tsx`:

```tsx
it('keeps both homepage Challenge logistics disclosures closed by default', async () => {
  const user = userEvent.setup()
  render(<App />)

  const challengeSection = screen.getByTestId('challenge-section')
  const logistics = within(challengeSection).getByTestId('challenge-logistics')
  const disclosures = within(logistics).getAllByTestId('challenge-disclosure')

  expect(disclosures).toHaveLength(2)
  disclosures.forEach((disclosure) => {
    expect(disclosure.tagName).toBe('DETAILS')
    expect(disclosure).not.toHaveAttribute('open')
  })

  const evaluationSummary = within(disclosures[0]).getByText(
    'Evaluation Format',
  )
  await user.click(evaluationSummary)
  expect(disclosures[0]).toHaveAttribute('open')
  expect(disclosures[1]).not.toHaveAttribute('open')

  const timelineSummary = within(disclosures[1]).getByText('Challenge Timeline')
  await user.click(timelineSummary)
  expect(disclosures[0]).toHaveAttribute('open')
  expect(disclosures[1]).toHaveAttribute('open')
})
```

Extend the existing logistics-content test to keep asserting all three stages,
four real-robot tasks, five milestones, and the exact August 25 date/time inside
the two disclosure bodies. Add a CSS regression test:

```ts
expect(appStyles).toContain('.challenge-disclosure')
expect(appStyles).toContain('.challenge-disclosure > summary')
expect(appStyles).toContain('.challenge-disclosure[open]')
expect(appStyles).toContain('@media (prefers-reduced-motion: reduce)')
```

- [ ] **Step 2: Run the homepage tests and verify RED**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the logistics modules are still plain expanded sections.

- [ ] **Step 3: Create a reusable native disclosure wrapper**

Create `src/components/ChallengeDisclosure.tsx`:

```tsx
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface ChallengeDisclosureProps {
  children: ReactNode
  className: 'challenge-evaluation' | 'challenge-timeline'
  eyebrow: string
  title: string
  titleId: string
}

function ChallengeDisclosure({
  children,
  className,
  eyebrow,
  title,
  titleId,
}: ChallengeDisclosureProps) {
  return (
    <details
      className={`challenge-disclosure ${className}`}
      data-testid="challenge-disclosure"
    >
      <summary>
        <span className="challenge-disclosure__copy">
          <span className="eyebrow">{eyebrow}</span>
          <span
            aria-level={3}
            className="challenge-disclosure__title"
            id={titleId}
            role="heading"
          >
            {title}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="challenge-disclosure__icon"
          size={24}
        />
      </summary>
      <div
        aria-labelledby={titleId}
        className="challenge-disclosure__body"
        role="region"
      >
        {children}
      </div>
    </details>
  )
}

export default ChallengeDisclosure
```

Omitting `open` is intentional: both disclosures must start closed.

- [ ] **Step 4: Wrap the existing evaluation and timeline bodies**

Import `ChallengeDisclosure` in `src/components/ChallengeSection.tsx`. Replace
the two plain sections while leaving every list item and existing content intact:

```tsx
<ChallengeDisclosure
  className="challenge-evaluation"
  eyebrow="How it works"
  title="Evaluation Format"
  titleId="evaluation-title"
>
  <ol className="challenge-flow">
    {challenge.stages.map((stage, index) => (
      <li data-testid="challenge-stage" key={stage.step}>
        <span aria-hidden="true">{stage.step}</span>
        <h4>{stage.title}</h4>
        <ChallengeStageDescription segments={stage.descriptionSegments} />
        {index === 1 && (
          <div className="challenge-evaluation-scope">
            <h5 id="real-robot-evaluation-scope">
              Real-Robot Evaluation Scope
            </h5>
            <ul aria-labelledby="real-robot-evaluation-scope">
              {challenge.tasks.map((task) => (
                <li data-testid="challenge-task" key={task.title}>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    ))}
    <li className="challenge-flow__ranking" data-testid="challenge-stage">
      <span aria-hidden="true">03</span>
      <h4>{challenge.finalRanking.label}</h4>
      <p
        className="challenge-ranking-formula"
        data-testid="challenge-final-ranking"
      >
        {challenge.finalRanking.formula}
      </p>
    </li>
  </ol>
</ChallengeDisclosure>

<ChallengeDisclosure
  className="challenge-timeline"
  eyebrow="Important dates"
  title="Challenge Timeline"
  titleId="challenge-timeline-title"
>
  <ol>
    {challenge.timeline.map((milestone, index) => (
      <li data-testid="challenge-milestone" key={milestone.label}>
        <span aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h4>{milestone.label}</h4>
        <p>
          {milestone.date}
          {milestone.time && <b>{` · ${milestone.time}`}</b>}
        </p>
      </li>
    ))}
  </ol>
</ChallengeDisclosure>
```

- [ ] **Step 5: Add the disclosure visual system and retarget old selectors**

In `src/App.css`, keep `.challenge-logistics` as the two-column grid and add
`align-items: start`. Replace the current panel padding and direct heading
selectors with:

```css
.challenge-evaluation,
.challenge-timeline {
  padding: 0;
  margin: 0;
  overflow: clip;
  background: rgba(82, 216, 230, 0.08);
  border: 1px solid rgba(27, 132, 153, 0.2);
  border-radius: 7px;
}

.challenge-disclosure > summary {
  display: flex;
  min-height: 96px;
  padding: clamp(22px, 3vw, 28px);
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
  list-style: none;
}

.challenge-disclosure > summary::-webkit-details-marker {
  display: none;
}

.challenge-disclosure__copy {
  display: grid;
  gap: 7px;
}

.challenge-disclosure__copy .eyebrow {
  margin: 0;
}

.challenge-disclosure__title {
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 2.8vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.08;
}

.challenge-disclosure__icon {
  flex: 0 0 auto;
  color: var(--cyan-deep);
  transition: transform 180ms ease;
}

.challenge-disclosure[open] .challenge-disclosure__icon {
  transform: rotate(180deg);
}

.challenge-disclosure > summary:hover {
  background: rgba(82, 216, 230, 0.08);
}

.challenge-disclosure > summary:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: -3px;
}

.challenge-disclosure__body {
  padding: 0 clamp(22px, 3vw, 28px) clamp(22px, 3vw, 28px);
}
```

Retarget `.challenge-timeline > ol` to
`.challenge-timeline .challenge-disclosure__body > ol`. Delete obsolete
`.challenge-evaluation > .eyebrow`, `.challenge-timeline > .eyebrow`,
`.challenge-evaluation > h3`, and `.challenge-timeline > h3` rules. Preserve all
stage, task, ranking, milestone, and mobile list styles.

Inside the existing `@media (prefers-reduced-motion: reduce)` block, add:

```css
.challenge-disclosure__icon {
  transition: none;
}
```

- [ ] **Step 6: Verify homepage GREEN and commit**

Run:

```bash
npm test -- src/App.test.tsx src/challenge/ChallengeHub.test.tsx
npm run lint
npm run build
```

Expected: homepage disclosures pass their closed/open tests, all existing
content checks pass, the Hub sections remain expanded, lint is clean, and the
production build succeeds.

```bash
git add src/components/ChallengeDisclosure.tsx src/components/ChallengeSection.tsx src/App.test.tsx src/App.css
git commit -m "feat: collapse homepage challenge logistics"
```

### Task 4: Full verification and visual QA

**Files:**
- Verify all changed source, test, CSS, and documentation files.

- [ ] **Step 1: Run complete automated verification**

Run:

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected: all test files pass, lint has no diagnostics, production build emits
both `dist/index.html` and `dist/challenge/index.html`, and the diff check is
clean.

- [ ] **Step 2: Inspect both pages at desktop and mobile widths**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4186
```

Inspect `/` and `/challenge/` at 1440 px and 390 px. Verify:

- the homepage shows two equal-width closed disclosures on desktop and stacked
  closed disclosures on mobile;
- opening one disclosure does not stretch its closed neighbor;
- all evaluation stages, task scope, and dates remain readable after opening;
- `Submit Predictions`, `View Dataset`, and `Explore Challenge Details` remain
  visible above the disclosures;
- the Challenge Hub Evaluation Format and Timeline remain expanded;
- the Leaderboard shows its six-column header and truthful empty state;
- only the leaderboard viewport scrolls horizontally at 390 px;
- keyboard focus is visible on summaries and the table viewport;
- reduced-motion mode removes the chevron transition.

- [ ] **Step 3: Confirm branch scope**

Run:

```bash
git status -sb
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
```

Expected: the branch contains the approved evaluation-submission work, the two
new design/plan documents, the leaderboard component/data/styles/tests, and the
homepage disclosure component/styles/tests; no preview artifacts or unrelated
files are staged.
