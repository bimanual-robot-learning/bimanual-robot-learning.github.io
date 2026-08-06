# Challenge Evaluation Information Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the Challenge prize pool, turn Final Ranking into Step 03, and move the four household tasks into a compact semantic scope list under Step 02.

**Architecture:** Preserve the existing `challenge` configuration as the source of truth. `ChallengeSection` will render two configured evaluation stages, a nested task list inside the second stage, and the configured final ranking as a third ordered-list item; no generalized workflow abstraction or new component is needed.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, Testing Library, CSS

---

## File Structure

- Modify `src/data/workshop.ts`: split the introduction emphasis, simplify task descriptions, rename Final Ranking, and remove its deleted note.
- Modify `src/components/ChallengeSection.tsx`: reorder Prize Pool, nest the task scope in Step 02, render Step 03, and remove the standalone task section.
- Modify `src/App.css`: replace standalone task-card rules with compact nested-scope rules and responsive behavior.
- Modify `src/App.test.tsx`: update content, semantics, order, responsive, and regression assertions.

No video, poster, organizer, navigation, standalone `/challenge/`, or deployment files change.

### Task 1: Update the typed Challenge content

**Files:**
- Modify: `src/data/workshop.ts`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Change the data assertions first**

In `stores the approved Challenge content`, replace the introduction, final-ranking, and task expectations with:

```tsx
expect(challenge.introductionSegments).toEqual([
  { text: 'This ', emphasis: false },
  { text: 'challenge', emphasis: true },
  {
    text: ' focuses on real-world bimanual manipulation in household environments. Participants train on ',
    emphasis: false,
  },
  { text: 'thousands of hours', emphasis: true },
  { text: ' of real-robot ', emphasis: false },
  { text: 'teleoperation and UMI data', emphasis: true },
  {
    text: ' spanning diverse household tasks, with the freedom to design their own data mixtures and training strategies.',
    emphasis: false,
  },
])

expect(challenge.finalRanking).toEqual({
  label: 'Final Ranking',
  formula: 'Online evaluation score + final real-robot evaluation score.',
})

expect(challenge.tasks).toEqual([
  {
    title: 'Open the Washer Door',
    description: 'Fully open the door with the gripper.',
  },
  {
    title: 'Put Clothing in the Washer',
    description: 'Put two pieces of clothing into the washer.',
  },
  {
    title: 'Close the Washer Door',
    description: 'Close the door securely with the gripper.',
  },
  {
    title: 'Fold Clothing',
    description: 'Unfold the clothing and fold it neatly.',
  },
])
```

Add:

```tsx
expect(challenge.finalRanking).not.toHaveProperty('note')
```

- [ ] **Step 2: Run the focused test and confirm RED**

```bash
npm test -- -t 'stores the approved Challenge content'
```

Expected: FAIL on the old introduction segmentation, label, note, and task descriptions.

- [ ] **Step 3: Update the type and configuration**

Change the interface in `src/data/workshop.ts` to:

```ts
export interface ChallengeFinalRanking {
  label: 'Final Ranking'
  formula: string
}
```

Update `challenge.introductionSegments`, `challenge.finalRanking`, and `challenge.tasks` to the exact values from Step 1. Remove the scoring-protocol sentence completely rather than retaining it in unused data.

- [ ] **Step 4: Run focused and full type verification**

```bash
npm test -- -t 'stores the approved Challenge content'
npm run build
```

Expected: focused test and build pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/workshop.ts src/App.test.tsx
git commit -m 'feat: refine challenge evaluation content'
```

### Task 2: Restructure the Challenge semantics and order

**Files:**
- Modify: `src/components/ChallengeSection.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing structure and order assertions**

Update the introduction test to require exactly three emphasized phrases:

```tsx
expect(introduction.querySelectorAll('strong')).toHaveLength(3)
expect(within(introduction).getByText('challenge', { exact: true })).toBeVisible()
expect(within(introduction).getByText('thousands of hours')).toBeVisible()
expect(within(introduction).getByText('teleoperation and UMI data')).toBeVisible()
```

Rename the sequence test to `places participation, videos, prizes, and logistics in sequence`. Locate the prize pool and assert:

```tsx
const prizePool = within(challengeSection).getByTestId('challenge-prize-pool')

expect((participation as Node).compareDocumentPosition(gallery)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
expect(gallery.compareDocumentPosition(prizePool)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
expect(prizePool.compareDocumentPosition(logistics)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
```

Replace the evaluation assertions with:

```tsx
const evaluation = within(logistics).getByRole('region', {
  name: 'Evaluation Format',
})
const stages = within(evaluation).getAllByTestId('challenge-stage')

expect(stages).toHaveLength(3)
expect(
  stages.map((stage) => within(stage).getByRole('heading', { level: 4 }).textContent),
).toEqual(['Online Evaluation', 'Real-Robot Evaluation', 'Final Ranking'])

const scope = within(stages[1]).getByRole('list', {
  name: 'Real-Robot Evaluation Scope',
})
const tasks = within(scope).getAllByTestId('challenge-task')
expect(tasks).toHaveLength(challenge.tasks.length)

for (const [index, task] of challenge.tasks.entries()) {
  expect(tasks[index]).toHaveTextContent(task.title)
  expect(tasks[index]).toHaveTextContent(task.description)
}

const finalRanking = within(stages[2]).getByTestId('challenge-final-ranking')
expect(finalRanking).toHaveTextContent(challenge.finalRanking.formula)
expect(finalRanking).not.toHaveTextContent(
  'Detailed scoring protocols will be announced before online evaluation opens.',
)

expect(
  within(challengeSection).queryByRole('region', {
    name: 'Household Manipulation Tasks',
  }),
).not.toBeInTheDocument()
```

Update the decorative-sequence test so it expects three stage numerals plus five timeline numerals, while nested tasks have no direct decorative numeral:

```tsx
const sequenceCards = [
  ...screen.getAllByTestId('challenge-stage'),
  ...screen.getAllByTestId('challenge-milestone'),
]

expect(sequenceCards).toHaveLength(8)
for (const card of sequenceCards) {
  expect(card.querySelector(':scope > span')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
}
```

In `uses the redesigned Challenge visual system`, remove the rendered-element assertion `expectGridColumns('.challenge-task-grid', 2)`. The standalone grid will no longer exist in the DOM. Leave rule-level cleanup and replacement scope assertions for Task 3.

- [ ] **Step 2: Run affected tests and confirm RED**

```bash
npm test -- -t 'segmented introduction|places participation|decorative Challenge sequence|Household Manipulation Tasks'
```

Expected: FAIL because Prize Pool is still last, ranking is separate, and tasks remain a standalone region.

- [ ] **Step 3: Reorder Prize Pool before Logistics**

Move the existing `<section className="challenge-prize-pool" ...>` block, unchanged internally, so it appears immediately after `<ChallengeVideoGallery />` and immediately before `.challenge-logistics`.

- [ ] **Step 4: Render the nested task scope inside Step 02**

Replace the stage map with this structure:

```tsx
{challenge.stages.map((stage, index) => (
  <li data-testid="challenge-stage" key={stage.step}>
    <span aria-hidden="true">{stage.step}</span>
    <h4>{stage.title}</h4>
    <p>{stage.description}</p>
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
```

- [ ] **Step 5: Render Final Ranking as Step 03**

Append this direct child to `.challenge-flow` after the two configured stages:

```tsx
<li
  className="challenge-flow__ranking"
  data-testid="challenge-stage"
>
  <span aria-hidden="true">03</span>
  <h4>{challenge.finalRanking.label}</h4>
  <p
    className="challenge-ranking-formula"
    data-testid="challenge-final-ranking"
  >
    {challenge.finalRanking.formula}
  </p>
</li>
```

Remove the old `.challenge-final-ranking` `<div>` and the complete standalone `.challenge-tasks` section. The Prize Pool must not be duplicated.

- [ ] **Step 6: Run semantic and full tests**

```bash
npm test -- -t 'Challenge|challenge|Household Manipulation Tasks'
npm test
npm run lint
npm run build
```

Expected: all tests, lint, and build pass. Dead standalone-task CSS may remain temporarily, but no test may query a removed `.challenge-task-grid` element. Task 3 replaces and removes the obsolete rules under new failing CSS assertions.

- [ ] **Step 7: Commit**

```bash
git add src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m 'feat: integrate challenge evaluation scope'
```

### Task 3: Replace task cards with compact nested text styling

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace stale CSS assertions with failing scope assertions**

Replace the remaining rule-level and responsive assertions for `.challenge-task-grid`. Add:

```tsx
expectGridColumns('.challenge-evaluation-scope ul', 2)
expect(styleFor('.challenge-evaluation-scope').gridColumn).toBe('2')
expect(extractCssProperty(
  extractCssRule(appStyles, '.challenge-ranking-formula').declarations,
  'font-size',
)).toBe('clamp(1rem, 1.25vw, 1.15rem)')
expect(appStyles).not.toContain('.challenge-task-grid')
expect(appStyles).not.toContain('.challenge-tasks')
```

Add ownership assertions:

```tsx
expectOwnedCssProperties(appStyles, '.challenge-evaluation-scope', {
  'grid-column': '2',
  'margin-top': '18px',
})
expectOwnedCssProperties(appStyles, '.challenge-evaluation-scope ul', {
  display: 'grid',
  padding: '0',
  margin: '12px 0 0',
  'grid-template-columns': 'repeat(2, minmax(0, 1fr))',
  gap: '0 18px',
  'list-style': 'none',
})
expectOwnedCssProperties(appStyles, '.challenge-ranking-formula', {
  'font-size': 'clamp(1rem, 1.25vw, 1.15rem)',
  'white-space': 'normal',
})

expect(findCssRules(appStyles, '.challenge-flow li')).toHaveLength(0)
expect(findCssRules(appStyles, '.challenge-flow li + li')).toHaveLength(0)
```

In the 920 px responsive test add:

```tsx
expectOwnedCssProperties(tabletMedia, '.challenge-evaluation-scope ul', {
  'grid-template-columns': '1fr',
})
```

Do not add breakpoint-specific formula wrapping assertions; the base rule owns normal wrapping at every width.

- [ ] **Step 2: Run the visual-system tests and confirm RED**

```bash
npm test -- -t 'redesigned Challenge visual system|adapts the Challenge summary|matching logistics panels'
```

Expected: FAIL on missing nested-scope rules and stale standalone-card CSS.

- [ ] **Step 3: Scope existing flow selectors to top-level items**

Change flow selectors so nested task list items do not inherit main-step grid styling:

```css
.challenge-flow > li { /* retain the current main-step declarations */ }
.challenge-flow > li + li { /* retain the current separator */ }
.challenge-flow > li > span { /* retain numeral declarations */ }
.challenge-flow > li > h4,
.challenge-flow > li > p { grid-column: 2; }
```

Update any grouped selectors that currently include `.challenge-task-grid` or target all descendant `.challenge-flow li`, `h4`, or `p`. Preserve current typography for the direct Step 01/02/03 children.

- [ ] **Step 4: Add the compact scope rules**

```css
.challenge-evaluation-scope {
  margin-top: 18px;
  grid-column: 2;
}

.challenge-evaluation-scope h5 {
  margin: 0;
  color: var(--cyan-deep);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

.challenge-evaluation-scope ul {
  display: grid;
  padding: 0;
  margin: 12px 0 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
  list-style: none;
}

.challenge-evaluation-scope li {
  min-width: 0;
  padding: 12px 0;
  border-top: 1px solid rgba(27, 132, 153, 0.18);
}

.challenge-evaluation-scope strong {
  display: block;
  margin-bottom: 5px;
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 650;
  letter-spacing: -0.015em;
  line-height: 1.3;
}

.challenge-evaluation-scope li p {
  margin: 0;
  color: var(--slate-readable);
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.5;
}

.challenge-ranking-formula {
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: clamp(1rem, 1.25vw, 1.15rem);
  font-weight: 650;
  letter-spacing: -0.03em;
  white-space: normal;
}
```

Delete `.challenge-final-ranking`, `.challenge-tasks`, and `.challenge-task-grid` rules that no longer have markup. Remove those obsolete selectors from grouped rules.

- [ ] **Step 5: Add the responsive task-scope rule**

Inside `@media (max-width: 920px)` add:

```css
.challenge-evaluation-scope ul {
  grid-template-columns: 1fr;
}
```

Keep formula wrapping in the base rule; do not add an intermediate formula media query or redundant tablet override. At 720 px and below, keep the existing Logistics one-column behavior. Do not add a new breakpoint or change Timeline styling.

- [ ] **Step 6: Run focused and complete verification**

```bash
npm test -- -t 'Challenge|challenge'
npm test
npm run lint
npm run build
git diff --check
```

Expected: all tests, lint, build, and diff check pass; no dead standalone-task selector remains.

- [ ] **Step 7: Commit**

```bash
git add src/App.css src/App.test.tsx
git commit -m 'style: simplify challenge evaluation scope'
```

### Task 4: Production and browser acceptance

**Files:**
- Modify only if a scoped defect is found: `src/data/workshop.ts`, `src/components/ChallengeSection.tsx`, `src/App.css`, `src/App.test.tsx`

- [ ] **Step 1: Run fresh release gates**

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: 46 or more tests pass, lint has zero diagnostics, build emits both HTML entrypoints, and diff check is clean.

- [ ] **Step 2: Start a fresh production preview**

```bash
npm run preview -- --host 127.0.0.1 --port 4182
```

Keep the preview alive for user review.

- [ ] **Step 3: Verify 1440 × 1000, 1200 × 1000, and 1000 × 1000**

Confirm:

- first `challenge` is visibly emphasized;
- order is Participation → Gallery → Prize Pool → Logistics;
- Prize Pool appearance and all three amounts are unchanged;
- Evaluation has exactly three main numbered steps;
- Step 02 contains the four task items in a 2 × 2 text list;
- no standalone Household Manipulation Tasks section remains;
- Step 03 formula is one visual line at 1440 because it fits naturally, and wraps as needed without overlap or horizontal overflow at 1200 and 1000;
- Evaluation and Timeline columns remain equal width and visually balanced;
- no horizontal overflow, console error, or media regression.

- [ ] **Step 4: Verify 768 × 1000 and 390 × 844**

Confirm:

- task scope is one column at 768 and remains readable;
- Evaluation and Timeline stack at the existing mobile breakpoint;
- three steps and four nested tasks read in correct semantic order;
- video gallery, prizes, timeline, and organizers remain unchanged and unclipped;
- no horizontal overflow.

- [ ] **Step 5: Verify standalone Challenge page and repository state**

Confirm `/challenge/` still shows its Coming Soon page with no homepage gallery or evaluation summary. Run `git status --short`; only the pre-existing untracked `.superpowers/` may remain.

- [ ] **Step 6: Fix only verified defects**

For any scoped defect, first add a regression assertion where feasible, implement the smallest fix, rerun all gates, and commit:

```bash
git add src/data/workshop.ts src/components/ChallengeSection.tsx src/App.css src/App.test.tsx
git commit -m 'fix: polish challenge evaluation hierarchy'
```

If no defect exists, create no empty commit.

- [ ] **Step 7: Report preview for user approval**

Provide the final preview URL and wait for explicit visual approval before merging, pushing, or publishing.
