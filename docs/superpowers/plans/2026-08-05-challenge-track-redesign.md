# Challenge Track Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing Challenge Track into a readable cool-white academic section with a full-width introduction, two-stage evaluation format, clarified tasks and prizes, and an independent compact Challenge Organizers section.

**Architecture:** Keep all mutable Challenge facts in `src/data/workshop.ts`, render the Challenge body through the existing focused `ChallengeSection` component, and keep page-level organizer ordering in `App.tsx`. Replace the current visual contracts in `App.css` without adding routes, dependencies, or new runtime state; extend the existing Vitest/Testing Library suite before each behavior change.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, Testing Library, GitHub Pages.

---

## File Structure

- `src/data/workshop.ts` — owns the approved Challenge copy, facts, two evaluation stages, Final Ranking data, task names, prize data, timeline, and people.
- `src/components/ChallengeSection.tsx` — renders the semantic Challenge header, introduction, facts, evaluation, tasks, prizes, timeline, and future resource links.
- `src/App.tsx` — renders Workshop Organizers and Challenge Organizers as separate top-level sections and controls person-card heading levels.
- `src/App.css` — owns the shared cool-white section treatment, Challenge module hierarchy, light Prize Pool, organizer grids, and 1440/768/390 responsive behavior.
- `src/App.test.tsx` — locks the approved copy, semantic hierarchy, section order, CSS contracts, responsive grid behavior, and external-link safety.

## Task 1: Update the Typed Challenge Content

**Files:**
- Modify: `src/data/workshop.ts`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing content-model assertions**

Replace the old Challenge expectations with assertions for the approved facts,
two evaluation stages, Final Ranking object, renamed task, and prize items
without recipient copy:

```tsx
expect(challenge).not.toHaveProperty('eyebrow')
expect(challenge.facts).toEqual([
  { value: 'Thousands of hours', label: 'Real-world demonstrations' },
  { value: 'Teleoperation + UMI', label: 'Complementary data sources' },
  { value: '4 household tasks', label: 'Real-robot evaluation' },
])
expect(challenge.stages).toEqual([
  {
    step: '01',
    title: 'Online Evaluation',
    description: 'Submit trained models through the online evaluation portal.',
  },
  {
    step: '02',
    title: 'Real-Robot Evaluation',
    description:
      'Up to five top-performing entries advance to household task evaluation.',
  },
])
expect(challenge.finalRanking).toEqual({
  label: 'Final Ranking',
  formula: 'Online evaluation score + final real-robot evaluation score',
  note: 'Detailed scoring protocols will be announced before online evaluation opens.',
})
expect(challenge.tasks[1]).toEqual({
  title: 'Put Clothing in the Washer',
  description: 'Put two pieces of clothing into the washing machine.',
})
expect(challenge.prizes).toEqual([
  { place: '1st Place', amount: 'USD 1,000', accent: 'primary' },
  { place: '2nd Place', amount: 'USD 500', accent: 'secondary' },
  { place: '3rd Place', amount: 'USD 500', accent: 'secondary' },
])
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- --run -t "stores the approved Challenge content"
```

Expected: FAIL because the current data still contains the eyebrow, three
stages, `scoringNote`, `Load the Washer`, finalists fact, and prize recipients.

- [ ] **Step 3: Introduce the Final Ranking type and update Challenge types**

Use these definitions in `src/data/workshop.ts`:

```ts
export interface ChallengeFinalRanking {
  label: 'Final Ranking'
  formula: string
  note: string
}

export interface ChallengePrize {
  place: string
  amount: string
  accent: 'primary' | 'secondary'
}

export interface ChallengeInfo {
  title: string
  sponsorLine: string
  introduction: string
  finalRanking: ChallengeFinalRanking
  facts: ChallengeFact[]
  stages: ChallengeStage[]
  tasks: ChallengeTask[]
  prizePoolTotal: string
  prizes: ChallengePrize[]
  timeline: ChallengeMilestone[]
  resources: ChallengeResource[]
}
```

Remove `eyebrow`, `scoringNote`, `prizePoolNote`, and prize `recipient` fields.
Update the Challenge object to exactly match the assertions from Step 1 while
leaving dates, resources, organizer identities, and sponsor URL unchanged.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2.

Expected: PASS with no TypeScript runtime transform errors.

- [ ] **Step 5: Commit the typed content change**

```bash
git add src/data/workshop.ts src/App.test.tsx
git commit -m "content: refine challenge track narrative"
```

## Task 2: Rebuild the Challenge Header and Evaluation Semantics

**Files:**
- Modify: `src/components/ChallengeSection.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing semantic rendering tests**

Add a test that renders `<App />` and verifies the new hierarchy:

```tsx
const challengeSection = screen.getByTestId('challenge-section')

expect(
  within(challengeSection).getByRole('heading', {
    level: 2,
    name: challenge.title,
  }),
).toBeInTheDocument()
expect(within(challengeSection).queryByText('Challenge Track · IROS 2026')).toBeNull()
expect(within(challengeSection).getByText(challenge.introduction)).toHaveClass(
  'challenge-introduction',
)

const stages = within(challengeSection).getAllByTestId('challenge-stage')
expect(stages).toHaveLength(2)
expect(within(challengeSection).queryByRole('heading', { name: 'Train' })).toBeNull()
expect(
  within(challengeSection).getByRole('heading', {
    level: 3,
    name: 'Evaluation Format',
  }),
).toBeInTheDocument()

const ranking = within(challengeSection).getByTestId('challenge-final-ranking')
expect(ranking).toHaveTextContent(challenge.finalRanking.label)
expect(ranking).toHaveTextContent(challenge.finalRanking.formula)
expect(ranking).toHaveTextContent(challenge.finalRanking.note)
```

Also change the decorative-sequence count from 12 to 11 because the evaluation
flow now contains two stages rather than three.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- --run -t "renders the redesigned Challenge introduction and evaluation"
```

Expected: FAIL because the old eyebrow, three-stage flow, and standalone scoring
note still render.

- [ ] **Step 3: Replace the Challenge header and evaluation markup**

In `ChallengeSection.tsx`, remove the decorative `.challenge-grid`, the inner
eyebrow, and the old `.challenge-block` evaluation structure. Render this shape:

```tsx
<header className="challenge-heading">
  <p className="section-index">05 / Challenge Track</p>
  <h2 id="challenge-title">{challenge.title}</h2>
  <p className="challenge-sponsor">
    {challenge.sponsorLine}{' '}
    <a href={sponsor.url} target="_blank" rel="noreferrer">
      {sponsor.name}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  </p>
</header>

<p className="challenge-introduction">{challenge.introduction}</p>

<dl className="challenge-facts" aria-label="Challenge at a glance">
  {/* retain semantic dt labels and dd values */}
</dl>

<section className="challenge-evaluation" aria-labelledby="evaluation-title">
  <p className="eyebrow">How it works</p>
  <h3 id="evaluation-title">Evaluation Format</h3>
  <ol className="challenge-flow">
    {/* render the two typed stages */}
  </ol>
  <div className="challenge-final-ranking" data-testid="challenge-final-ranking">
    <p className="eyebrow">{challenge.finalRanking.label}</p>
    <strong>{challenge.finalRanking.formula}</strong>
    <p>{challenge.finalRanking.note}</p>
  </div>
</section>
```

Keep sequence numerals `aria-hidden`. Use CSS pseudo-elements later for the
directional arrow so the ordered list contains only `<li>` children.

- [ ] **Step 4: Run focused and full component tests**

```bash
npm test -- --run -t "Challenge introduction and evaluation|decorative Challenge sequence"
```

Expected: both tests PASS.

- [ ] **Step 5: Commit the semantic restructure**

```bash
git add src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m "feat: simplify challenge evaluation structure"
```

## Task 3: Simplify Tasks and the Light Prize Pool

**Files:**
- Modify: `src/components/ChallengeSection.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing task and Prize Pool tests**

Update the Prize Pool test to require the new text and absence of recipient
copy, and assert the Tasks section does not use the generic outer panel class:

```tsx
const taskHeading = within(challengeSection).getByRole('heading', {
  level: 3,
  name: 'Household Manipulation Tasks',
})
expect(taskHeading.closest('section')).toHaveClass('challenge-tasks')
expect(taskHeading.closest('section')).not.toHaveClass('challenge-block')

const prizePool = screen.getByTestId('challenge-prize-pool')
expect(within(prizePool).getByText('USD 2,000 Total')).toBeVisible()
expect(prizePool).not.toHaveTextContent('One winning team')
expect(within(prizePool).getAllByTestId('challenge-prize')).toHaveLength(3)
```

- [ ] **Step 2: Run the focused tests and verify RED**

```bash
npm test -- --run -t "Household Manipulation Tasks|complete Challenge Prize Pool"
```

Expected: FAIL because the old task wrapper and recipient paragraphs remain.

- [ ] **Step 3: Replace task and Prize Pool markup**

Render the task section without `.challenge-block`:

```tsx
<section className="challenge-tasks" aria-labelledby="challenge-tasks-title">
  <p className="eyebrow">Real-Robot Evaluation Scope</p>
  <h3 id="challenge-tasks-title">Household Manipulation Tasks</h3>
  <div className="challenge-task-grid">{/* four task articles */}</div>
</section>
```

Render the Prize Pool as one shared surface with no decorative dark grid and no
recipient paragraphs:

```tsx
<section
  className="challenge-prize-pool"
  aria-labelledby="challenge-prize-title"
  data-testid="challenge-prize-pool"
>
  <header>
    <h3 id="challenge-prize-title">Challenge Prize Pool</h3>
    <p>{challenge.prizePoolTotal} <span>Total</span></p>
  </header>
  <div className="challenge-prize-grid">
    {challenge.prizes.map((prize) => (
      <article data-accent={prize.accent} data-testid="challenge-prize" key={prize.place}>
        <h4>{prize.place}</h4>
        <strong>{prize.amount}</strong>
      </article>
    ))}
  </div>
</section>
```

Use an accessible text construction whose rendered text is exactly
`USD 2,000 Total`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the command from Step 2.

Expected: PASS.

- [ ] **Step 5: Commit the simplified modules**

```bash
git add src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m "feat: clarify challenge tasks and prizes"
```

## Task 4: Split the Organizer Teams into Independent Sections

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing section-order and heading tests**

Add assertions for two independent labelled sections and Challenge organizer
name heading levels:

```tsx
const workshopTeam = screen.getByTestId('workshop-organizers')
const challengeTeam = screen.getByTestId('challenge-organizers')

expect(within(workshopTeam).getByText('06 / Workshop Team')).toBeVisible()
expect(within(challengeTeam).getByText('07 / Challenge Team')).toBeVisible()
expect(workshopTeam).not.toContainElement(challengeTeam)
expect(
  workshopTeam.compareDocumentPosition(challengeTeam) & Node.DOCUMENT_POSITION_FOLLOWING,
).toBeTruthy()

for (const organizer of challengeOrganizers) {
  expect(
    within(challengeTeam).getByRole('heading', {
      level: 3,
      name: organizer.name,
    }),
  ).toBeInTheDocument()
}
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
npm test -- --run -t "independent Workshop and Challenge organizer sections"
```

Expected: FAIL because Challenge Organizers are currently nested and use h4
names.

- [ ] **Step 3: Split the JSX sections**

Add `data-testid="workshop-organizers"` to the existing Workshop Organizers
section, change its index to `06 / Workshop Team`, and close that section after
the workshop grid. Add this sibling section before the footer:

```tsx
<section
  className="section section--challenge-organizers"
  id="challenge-organizers"
  aria-labelledby="challenge-organizers-title"
  data-testid="challenge-organizers"
>
  <div className="page-width">
    <div className="section-heading">
      <p className="section-index">07 / Challenge Team</p>
      <div>
        <h2 id="challenge-organizers-title">Challenge Organizers</h2>
        <p className="section-description">
          The team coordinating the challenge, data release, and real-world evaluation.
        </p>
      </div>
    </div>
    <div className="challenge-organizer-grid">
      {challengeOrganizers.map((organizer) => (
        <PersonCard key={organizer.name} person={organizer} kind="challenge-organizer" />
      ))}
    </div>
  </div>
</section>
```

Change `PersonCard` so Challenge organizer names use `h3`, matching cards in a
top-level h2-labelled section:

```tsx
const NameHeading = 'h3'
```

Keep the existing `data-testid` values, images, alt text, and absent
affiliations.

- [ ] **Step 4: Run organizer tests and verify GREEN**

```bash
npm test -- --run -t "independent Workshop and Challenge organizer sections|four Challenge Organizers"
```

Expected: PASS.

- [ ] **Step 5: Commit the section split**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: separate challenge organizer team"
```

## Task 5: Implement the Desktop Visual System

**Files:**
- Modify: `src/App.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace failing CSS contract assertions**

Require the shared background, full-width facts, two-stage grid, light Prize
Pool, shared prize columns, and four-column Challenge team:

```tsx
expect(styleFor('.section--challenge').background).toBe('var(--paper)')
expect(styleFor('.section--challenge-organizers').background).toBe('var(--paper)')
expect(styleFor('.challenge-facts').marginLeft).toBe('0')
expectGridColumns('.challenge-flow', 2)
expectGridColumns('.challenge-task-grid', 2)
expectGridColumns('.challenge-prize-grid', 3)
expectGridColumns('.challenge-organizer-grid', 4)
expect(styleFor('.challenge-prize-pool').background).not.toBe('var(--ink-950)')
expect(styleFor('.challenge-prize-grid').gap).toBe('0')
```

Add a raw-CSS assertion that `.challenge-final-ranking` has no border-top or
border-bottom declaration.

- [ ] **Step 2: Run the CSS contract test and verify RED**

```bash
npm test -- --run -t "uses the redesigned Challenge visual system"
```

Expected: FAIL against the current pale-blue field, dark Prize Pool, three-stage
grid, and two-column organizer grid.

- [ ] **Step 3: Replace obsolete Challenge CSS with the new desktop rules**

Implement these core declarations, preserving the existing design tokens:

```css
.section--challenge,
.section--challenge-organizers {
  background: var(--paper);
}

.challenge-heading {
  margin-bottom: 42px;
}

.challenge-heading h2 {
  max-width: 1160px;
  margin: 18px 0 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.98;
  text-wrap: balance;
}

.challenge-introduction {
  max-width: 1060px;
  padding: 4px 0 4px 26px;
  margin: 0 0 34px;
  color: var(--ink-800);
  border-left: 3px solid var(--cyan-deep);
  font-size: 1.08rem;
  font-weight: 500;
  line-height: 1.72;
}

.challenge-facts {
  margin: 0 0 32px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.challenge-evaluation {
  padding: clamp(30px, 4vw, 44px);
  margin-bottom: 54px;
  background: rgba(82, 216, 230, 0.055);
  border: 1px solid var(--line-light);
  border-radius: 7px;
}

.challenge-flow {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.challenge-flow li + li::before {
  position: absolute;
  top: 50%;
  left: -25px;
  color: var(--orange-deep);
  content: '→';
  transform: translateY(-50%);
}

.challenge-final-ranking {
  margin-top: 26px;
}

.challenge-final-ranking strong {
  display: block;
  margin: 8px 0;
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: 1.25rem;
}

.challenge-tasks {
  margin-bottom: 32px;
}

.challenge-prize-pool {
  padding: clamp(32px, 4vw, 46px);
  color: var(--ink-950);
  background: rgba(255, 125, 79, 0.075);
  border: 1px solid rgba(200, 88, 53, 0.25);
  border-top: 3px solid var(--orange-deep);
}

.challenge-prize-pool > header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
}

.challenge-prize-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid rgba(200, 88, 53, 0.22);
}

.challenge-prize-grid article {
  min-height: 150px;
  padding: 28px;
  background: transparent;
  border: 0;
  border-radius: 0;
}

.challenge-prize-grid article + article {
  border-left: 1px solid rgba(200, 88, 53, 0.22);
}

.challenge-prize-grid h4 {
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: 1.35rem;
  text-transform: none;
}

.challenge-organizer-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.person-card--challenge-organizer {
  grid-template-columns: 92px minmax(0, 1fr);
}

.person-card--challenge-organizer .person-card__media {
  aspect-ratio: 1;
}
```

Remove obsolete `.challenge-grid`, old section-heading Challenge overrides,
three-stage flow styling, dark Prize Pool grid, recipient paragraph styling,
and the nested `.challenge-organizers` subsection rules. Preserve timeline and
resource styles unless selectors must be renamed.

- [ ] **Step 4: Run CSS tests, lint, and build**

```bash
npm test -- --run -t "redesigned Challenge visual system"
npm run lint
npm run build
```

Expected: all commands PASS.

- [ ] **Step 5: Commit the desktop visual system**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: redesign challenge track hierarchy"
```

## Task 6: Implement Responsive Layouts and Final Verification

**Files:**
- Modify: `src/App.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing responsive CSS assertions**

Lock the intended 768 px and 390 px cascades:

```tsx
expect(extractCssRule(tabletMedia, '.challenge-organizer-grid').declarations).toContain(
  'grid-template-columns: repeat(2, minmax(0, 1fr));',
)
expect(
  extractCssRule(mobileMedia, '.challenge-flow').selectors,
).toEqual(expect.arrayContaining(['.challenge-flow', '.challenge-facts']))
expect(extractCssRule(mobileMedia, '.challenge-flow').declarations).toContain(
  'grid-template-columns: 1fr;',
)
expect(extractCssRule(mobileMedia, '.challenge-organizer-grid').declarations).toContain(
  'grid-template-columns: 1fr;',
)
expect(
  extractCssRule(mobileMedia, '.challenge-prize-grid article + article').declarations,
).toContain('border-top: 1px solid rgba(200, 88, 53, 0.22);')
expect(
  extractCssRule(mobileMedia, '.challenge-prize-grid article + article').declarations,
).toContain('border-left: 0;')
```

- [ ] **Step 2: Run the responsive test and verify RED**

```bash
npm test -- --run -t "adapts the redesigned Challenge at tablet and mobile widths"
```

Expected: FAIL because the current rules stack the Challenge team too early and
still target the obsolete three-stage/panel selectors.

- [ ] **Step 3: Implement tablet and mobile rules**

At `max-width: 920px`, keep facts, evaluation stages, tasks, and prizes in their
desktop column counts, retain the existing timeline three-plus-two layout, and
set:

```css
.challenge-organizer-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

At `max-width: 720px`, set:

```css
.challenge-facts,
.challenge-flow,
.challenge-task-grid,
.challenge-prize-grid,
.challenge-timeline > ol,
.challenge-resources,
.challenge-organizer-grid {
  grid-template-columns: 1fr;
}

.challenge-flow li + li::before {
  top: -24px;
  left: 50%;
  content: '↓';
  transform: translateX(-50%);
}

.challenge-prize-pool > header {
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
}

.challenge-prize-grid article + article {
  border-top: 1px solid rgba(200, 88, 53, 0.22);
  border-left: 0;
}

.person-card--challenge-organizer {
  grid-template-columns: 112px minmax(0, 1fr);
}
```

At `max-width: 480px`, reduce module padding consistently and keep the sponsor
line, resource controls, and Prize Pool header vertically stacked. Ensure no
text size drops below the existing readable site standards.

- [ ] **Step 4: Run responsive tests and verify GREEN**

Run the command from Step 2.

Expected: PASS.

- [ ] **Step 5: Run the full automated verification suite**

```bash
npm test
npm run lint
npm run build
git diff --check
git status -sb
```

Expected: all tests PASS, lint emits no findings, Vite produces `dist/`, diff
check emits no output, and only intentional files are modified.

- [ ] **Step 6: Perform browser verification at three widths**

Start or reuse the production preview and inspect the Challenge, Prize Pool,
Timeline, Workshop Organizers, and Challenge Organizers at:

- 1440 × 1000
- 768 × 1000
- 390 × 844

At each width verify:

- no horizontal overflow;
- Challenge background matches Introduction and Invited Speakers;
- title wraps to approximately 2/3/natural mobile lines;
- introduction reads as primary content;
- facts occupy the full content width;
- evaluation shows only two stages and no visual divider before Final Ranking;
- task and Prize Pool columns follow the approved responsive order;
- Challenge organizers render 4/2/1 columns with square, loaded portraits;
- console contains no warnings or errors;
- keyboard focus and reduced-motion behavior remain intact.

- [ ] **Step 7: Commit the responsive and verification contracts**

```bash
git add src/App.css src/App.test.tsx
git commit -m "test: verify challenge redesign responsiveness"
```

- [ ] **Step 8: Request final whole-feature review**

Review the complete diff from commit `a51d45e` to the final redesign head against
`docs/superpowers/specs/2026-08-05-challenge-track-redesign-design.md`. Resolve
all actionable findings, rerun Step 5, and retain the local preview for user
acceptance. Do not merge or push before the user approves the redesigned page.
