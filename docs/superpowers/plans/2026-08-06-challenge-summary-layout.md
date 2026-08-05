# Challenge Homepage Summary Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage Challenge section as a concise participation hub with a direct Challenge title, prominent destinations, and a paired Evaluation Format / Challenge Timeline layout.

**Architecture:** Keep all mutable Challenge content in `src/data/workshop.ts`, but replace the old title and facts fields with structured title, introduction-segment, and participation-copy data. Refactor `ChallengeSection.tsx` so the title, introduction, destination module, and logistics grid are separate semantic units; preserve tasks, prizes, organizers, and the standalone `/challenge/` page. Update the existing CSS system rather than introducing a second visual theme.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, Testing Library, oxlint

---

## File Structure

- Modify `src/data/workshop.ts` — Challenge types and configuration content.
- Modify `src/components/ChallengeSection.tsx` — semantic title, emphasized introduction, participation module, and logistics grid.
- Modify `src/App.css` — Challenge title hierarchy, dark participation module, plain-text logistics columns, responsive behavior, and removal of obsolete facts/connector styles.
- Modify `src/App.test.tsx` — DOM, data, CSS ownership, responsive, accessibility, and regression assertions.
- Preserve `src/challenge/ChallengeComingSoon.tsx` and `challenge/index.html` — standalone Challenge page must remain unchanged.

## Task 1: Restructure Challenge Configuration

**Files:**
- Modify: `src/data/workshop.ts:31-90`
- Modify: `src/data/workshop.ts:149-215`
- Test: `src/App.test.tsx:100-125`

- [ ] **Step 1: Replace the existing data assertions with failing assertions for the new structure**

Update the Challenge configuration test to require the new title, introduction segments, participation copy, and Challenge Details resource. The old render-only compatibility fields are removed in Task 2 after the component switches to the new structure:

```tsx
expect(challenge.title).toEqual({
  lineOne: 'Real-World Household',
  lineTwo: 'Bimanual Manipulation',
  accent: 'Challenge',
})
expect(challenge.introductionSegments).toEqual([
  {
    text: 'This challenge focuses on real-world bimanual manipulation in household environments. Participants train on ',
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
expect(challenge.participation).toEqual({
  eyebrow: 'Get started',
  title: 'Participate in the Challenge',
  description:
    'The full rules, dataset documentation, submission instructions, and leaderboard will live on the challenge website.',
})
expect(challenge.resources[0]).toEqual({
  label: 'Explore Challenge Details',
  status: 'available',
  url: '/challenge/',
})
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because `challenge.title`, structured introduction, participation copy, and Challenge Details resource do not exist.

- [ ] **Step 3: Add the structured types while retaining the old fields for one compatible commit**

In `src/data/workshop.ts`, keep `ChallengeFact` temporarily and add:

```ts
export interface ChallengeTitle {
  lineOne: string
  lineTwo: string
  accent: 'Challenge'
}

export interface ChallengeIntroductionSegment {
  text: string
  emphasis: boolean
}

export interface ChallengeParticipation {
  eyebrow: string
  title: string
  description: string
}
```

Add the new fields to `ChallengeInfo` while temporarily retaining `titleLead`, `titleHighlight`, and `facts` so the current component continues to type-check:

```ts
export interface ChallengeInfo {
  title: ChallengeTitle
  titleLead: string
  titleHighlight: string
  sponsorLine: string
  introduction: string
  introductionSegments: ChallengeIntroductionSegment[]
  participation: ChallengeParticipation
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

- [ ] **Step 4: Add the new Challenge configuration alongside the compatibility fields**

Add `title`, `introductionSegments`, and `participation`. Leave the original `introduction` string, `titleLead`, `titleHighlight`, and `facts` in place until Task 2 removes their final render path:

```ts
title: {
  lineOne: 'Real-World Household',
  lineTwo: 'Bimanual Manipulation',
  accent: 'Challenge',
},
sponsorLine: 'Designed and sponsored by',
introductionSegments: [
  {
    text: 'This challenge focuses on real-world bimanual manipulation in household environments. Participants train on ',
    emphasis: false,
  },
  { text: 'thousands of hours', emphasis: true },
  { text: ' of real-robot ', emphasis: false },
  { text: 'teleoperation and UMI data', emphasis: true },
  {
    text: ' spanning diverse household tasks, with the freedom to design their own data mixtures and training strategies.',
    emphasis: false,
  },
],
participation: {
  eyebrow: 'Get started',
  title: 'Participate in the Challenge',
  description:
    'The full rules, dataset documentation, submission instructions, and leaderboard will live on the challenge website.',
},
```

Prepend the active details resource to `resources`:

```ts
resources: [
  {
    label: 'Explore Challenge Details',
    status: 'available',
    url: '/challenge/',
  },
  { label: 'Dataset', status: 'coming-soon' },
  { label: 'Evaluation Portal', status: 'coming-soon' },
],
```

- [ ] **Step 5: Run the focused test and type-check through the production build**

Run:

```bash
npm test -- --run src/App.test.tsx
npm run build
```

Expected: the new data assertions pass and the build exits 0 because the compatibility fields still support the current component.

- [ ] **Step 6: Commit the configuration change**

```bash
git add src/data/workshop.ts src/App.test.tsx
git commit -m "content: simplify challenge summary data"
```

## Task 2: Refactor the Challenge DOM Structure

**Files:**
- Modify: `src/components/ChallengeSection.tsx:1-140`
- Modify: `src/App.test.tsx:250-390`

- [ ] **Step 1: Write failing DOM and accessibility tests**

Replace the old title/facts/evaluation tests with assertions equivalent to:

```tsx
render(<App />)
const section = screen.getByTestId('challenge-section')
const heading = within(section).getByRole('heading', {
  name: 'Real-World Household Bimanual Manipulation Challenge',
  level: 2,
})

expect(heading.querySelector('.challenge-title__line-one')).toHaveTextContent(
  'Real-World Household',
)
expect(heading.querySelector('.challenge-title__line-two')).toHaveTextContent(
  'Bimanual Manipulation Challenge',
)
expect(heading.querySelector('.challenge-title__accent')).toHaveTextContent(
  'Challenge',
)
expect(within(section).queryByText('Towards Bimanual Intelligence:')).not.toBeInTheDocument()
expect(within(section).getByText('05 / Workshop Challenge')).toBeVisible()

const introduction = within(section).getByTestId('challenge-introduction')
expect(within(introduction).getByText('thousands of hours').tagName).toBe('STRONG')
expect(
  within(introduction).getByText('teleoperation and UMI data').tagName,
).toBe('STRONG')
expect(within(section).queryByTestId('challenge-fact')).not.toBeInTheDocument()
expect('titleLead' in challenge).toBe(false)
expect('titleHighlight' in challenge).toBe(false)
expect('facts' in challenge).toBe(false)
expect('introduction' in challenge).toBe(false)

const participation = within(section).getByRole('region', {
  name: 'Participate in the Challenge',
})
expect(within(participation).getByRole('link', {
  name: /Explore Challenge Details/,
})).toHaveAttribute('href', '/challenge/')
expect(within(participation).getByText('Dataset').closest('a')).toBeNull()
expect(within(participation).getByText('Evaluation Portal').closest('a')).toBeNull()

const logistics = within(section).getByTestId('challenge-logistics')
expect(within(logistics).getByRole('heading', { name: 'Evaluation Format' })).toBeVisible()
expect(within(logistics).getByRole('heading', { name: 'Challenge Timeline' })).toBeVisible()
expect(logistics.querySelector('.challenge-flow li + li')).not.toBeNull()
expect(within(logistics).queryByText('→')).not.toBeInTheDocument()
expect(within(logistics).queryByText('↓')).not.toBeInTheDocument()
```

Also assert source order:

```tsx
expect(
  introduction.compareDocumentPosition(participation),
).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
expect(
  participation.compareDocumentPosition(logistics),
).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL on the old title, missing introduction emphasis, missing participation region, existing facts, and separate logistics sections.

- [ ] **Step 3: Remove compatibility fields and render the equal-scale title and emphasized introduction**

Delete `ChallengeFact`, `titleLead`, `titleHighlight`, the compatibility `introduction` string, and `facts` from the interfaces and Challenge configuration in `src/data/workshop.ts`. Keep `introductionSegments` as the final structured field. No other module consumes the removed fields after this component refactor.

Replace the Challenge header title with:

```tsx
<p className="section-index">05 / Workshop Challenge</p>
<h2 id="challenge-title">
  <span className="challenge-title__line-one">{challenge.title.lineOne}</span>
  <span className="challenge-title__line-two">
    {challenge.title.lineTwo}{' '}
    <span className="challenge-title__accent">{challenge.title.accent}</span>
  </span>
</h2>
```

Render the introduction as:

```tsx
<p className="challenge-introduction" data-testid="challenge-introduction">
  {challenge.introductionSegments.map((segment, index) =>
    segment.emphasis ? (
      <strong key={`${segment.text}-${index}`}>{segment.text}</strong>
    ) : (
      <span key={`${segment.text}-${index}`}>{segment.text}</span>
    ),
  )}
</p>
```

- [ ] **Step 4: Add the participation module immediately after the introduction**

Render one semantic region with the existing configuration-driven resource status behavior:

```tsx
<section
  className="challenge-participation"
  aria-labelledby="challenge-participation-title"
>
  <header className="challenge-participation__header">
    <div>
      <p className="eyebrow">{challenge.participation.eyebrow}</p>
      <h3 id="challenge-participation-title">{challenge.participation.title}</h3>
    </div>
    <p>{challenge.participation.description}</p>
  </header>
  <div className="challenge-resources" aria-label="Challenge resources">
    {challenge.resources.map((resource, index) =>
      resource.status === 'available' ? (
        <a
          className={index === 0 ? 'challenge-resource--primary' : undefined}
          data-testid="challenge-resource"
          href={resource.url}
          key={resource.label}
          rel={resource.url.startsWith('http') ? 'noreferrer' : undefined}
          target={resource.url.startsWith('http') ? '_blank' : undefined}
        >
          <span>{resource.label}</span>
          <b>
            Open
            <ArrowUpRight size={14} aria-hidden="true" />
          </b>
        </a>
      ) : (
        <div data-testid="challenge-resource" key={resource.label}>
          <span>{resource.label}</span>
          <b>Coming Soon</b>
        </div>
      ),
    )}
  </div>
</section>
```

Remove the `challenge-facts` definition list entirely.

- [ ] **Step 5: Group Evaluation and Timeline into one logistics grid**

Wrap both independent semantic sections in:

```tsx
<div className="challenge-logistics" data-testid="challenge-logistics">
  <section className="challenge-evaluation" aria-labelledby="evaluation-title">
    {/* existing eyebrow, heading, stages, and final ranking */}
  </section>
  <section
    className="challenge-timeline"
    aria-labelledby="challenge-timeline-title"
  >
    {/* existing eyebrow, heading, and milestones */}
  </section>
</div>
```

Keep the evaluation stages as an ordered list, but do not render an arrow element. Remove the resources block from Challenge Timeline because it now lives in the participation module.

- [ ] **Step 6: Run focused tests and the production build**

Run:

```bash
npm test -- --run src/App.test.tsx
npm run build
```

Expected: DOM assertions pass and the build completes with no references to `titleLead`, `titleHighlight`, or `facts`.

- [ ] **Step 7: Commit the component refactor**

```bash
git add src/data/workshop.ts src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m "feat: reorganize challenge summary content"
```

## Task 3: Implement the Desktop Visual Hierarchy

**Files:**
- Modify: `src/App.css:1330-1790`
- Modify: `src/App.test.tsx:390-500`

- [ ] **Step 1: Write failing CSS ownership tests for the title and participation module**

Require the following properties with the existing CSS extraction helpers:

```tsx
expectOwnedCssProperties(appStyles, '.challenge-title__line-one', {
  display: 'block',
})
expectOwnedCssProperties(appStyles, '.challenge-title__line-two', {
  display: 'block',
})
expectOwnedCssProperties(appStyles, '.challenge-title__accent', {
  color: 'var(--orange-deep)',
})
expect(
  extractCssRule(appStyles, '.challenge-title__accent').declarations,
).not.toMatch(/font-size|font-weight|line-height/)
expectOwnedCssProperties(appStyles, '.challenge-introduction strong', {
  'font-weight': '750',
})
expectOwnedCssProperties(appStyles, '.challenge-participation', {
  background: 'var(--ink-950)',
})
expectOwnedCssProperties(appStyles, '.challenge-resources', {
  display: 'grid',
  'grid-template-columns': '1.35fr 1fr 1fr',
})
expectOwnedCssProperties(appStyles, '.challenge-logistics', {
  display: 'grid',
  'grid-template-columns': 'repeat(2, minmax(0, 1fr))',
})
```

Add negative assertions that `.challenge-facts` and connector pseudo-element rules are absent from the final stylesheet.

- [ ] **Step 2: Run the focused CSS tests and confirm they fail**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because the new selectors and logistics grid are not styled and obsolete selectors remain.

- [ ] **Step 3: Apply equal typography to both title lines**

Keep the shared typography on `.challenge-heading h2`. Add:

```css
.challenge-title__line-one,
.challenge-title__line-two {
  display: block;
}

.challenge-title__line-one,
.challenge-title__line-two {
  white-space: nowrap;
}

.challenge-title__accent {
  color: var(--orange-deep);
}
```

Do not assign a separate font size, weight, or line-height to the accent. Remove `.challenge-title__lead` and `.challenge-title__highlight` rules.

Add restrained introduction emphasis:

```css
.challenge-introduction strong {
  color: var(--ink-950);
  font-weight: 750;
}
```

- [ ] **Step 4: Style the participation module as a distinct action surface**

Add:

```css
.challenge-participation {
  padding: clamp(24px, 3vw, 30px);
  margin-bottom: 32px;
  color: white;
  background: var(--ink-950);
  border: 1px solid rgba(82, 216, 230, 0.16);
  border-radius: 8px;
}

.challenge-participation__header {
  display: grid;
  margin-bottom: 18px;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  align-items: end;
  gap: 28px;
}

.challenge-participation__header .eyebrow {
  margin: 0 0 6px;
  color: var(--cyan);
}

.challenge-participation__header h3 {
  margin: 0;
  color: white;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 2.4vw, 2rem);
  font-weight: 650;
  letter-spacing: -0.035em;
}

.challenge-participation__header > p {
  margin: 0;
  color: rgba(231, 241, 244, 0.72);
  font-size: 0.86rem;
  line-height: 1.55;
}

.challenge-resources {
  display: grid;
  margin: 0;
  padding: 0;
  border: 0;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 12px;
}
```

Retain the current resource card semantics, but use solid dark borders for unavailable destinations and a cyan fill for `.challenge-resource--primary`. Preserve a visible `:focus-visible` outline.

- [ ] **Step 5: Convert Evaluation and Timeline to equal plain-text panels**

Add the shared wrapper:

```css
.challenge-logistics {
  display: grid;
  margin-bottom: 32px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
```

Give both panels matching padding, background, border, and zero bottom margin. Change `.challenge-flow` to one column with no gap. Remove the connector pseudo-element. Make each stage a two-column text row with a number column, a top divider after the first item, transparent background, no nested border, and no border radius.

Change `.challenge-timeline > ol` to one column. Render each milestone as a compact row:

```css
.challenge-timeline li {
  display: grid;
  padding: 12px 0;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  gap: 3px 18px;
  border-top: 1px solid rgba(27, 132, 153, 0.18);
}

.challenge-timeline li > span {
  display: none;
}

.challenge-timeline h4 {
  margin: 0;
}

.challenge-timeline li p {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  text-align: right;
}
```

Preserve every date and optional time in the rendered text.

- [ ] **Step 6: Remove obsolete facts and connector CSS**

Delete all `.challenge-facts` selectors, all `.challenge-flow li + li::before` selectors, the old five-column timeline rules, and timeline-owned resource spacing rules. Do not remove task, prize, or organizer styles.

- [ ] **Step 7: Run focused tests, lint, and build**

Run:

```bash
npm test -- --run src/App.test.tsx
npm run lint
npm run build
git diff --check
```

Expected: all commands exit 0; no obsolete facts or connector rules remain.

- [ ] **Step 8: Commit the desktop styling**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: clarify challenge participation hierarchy"
```

## Task 4: Implement Responsive Layout and Regression Coverage

**Files:**
- Modify: `src/App.css:2040-2520`
- Modify: `src/App.test.tsx:480-660`

- [ ] **Step 1: Replace obsolete responsive assertions with failing assertions for the new layout**

At the existing tablet and mobile CSS blocks, require:

```tsx
expectOwnedCssProperties(tabletMedia, '.challenge-title__line-one', {
  'white-space': 'normal',
})
expectOwnedCssProperties(tabletMedia, '.challenge-title__line-two', {
  'white-space': 'normal',
})
expectOwnedCssProperties(mobileMedia, '.challenge-resources', {
  'grid-template-columns': '1fr',
})
expectOwnedCssProperties(mobileMedia, '.challenge-logistics', {
  'grid-template-columns': '1fr',
})
expectOwnedCssProperties(mobileMedia, '.challenge-participation__header', {
  'grid-template-columns': '1fr',
})
```

Remove assertions for mobile facts, mobile flow arrows, five-column timeline breakpoints, and the old compact resource flex direction.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because the new responsive selectors and stacking rules do not yet exist.

- [ ] **Step 3: Allow title wrapping below the desktop composition width**

In the existing `@media (max-width: 920px)` block, add:

```css
.challenge-title__line-one,
.challenge-title__line-two {
  white-space: normal;
}
```

Do not change the title accent font size or weight at any breakpoint.

- [ ] **Step 4: Stack participation and logistics on mobile**

In `@media (max-width: 720px)`, add:

```css
.challenge-participation__header,
.challenge-resources,
.challenge-logistics {
  grid-template-columns: 1fr;
}

.challenge-participation__header {
  align-items: start;
  gap: 10px;
}
```

Let timeline dates fall below or beside their labels based on available width, but ensure the panel never creates horizontal overflow. Keep Evaluation first in source order.

- [ ] **Step 5: Preserve compact mobile spacing**

In `@media (max-width: 480px)`, include `.challenge-participation` in the existing compact panel padding rule and keep `.challenge-evaluation`, `.challenge-timeline`, and `.challenge-prize-pool` at `26px 22px`. Remove obsolete `.challenge-resources > div` column-direction overrides if the new base action layout no longer needs them.

- [ ] **Step 6: Run the full automated verification suite**

Run:

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected: 0 failed tests, lint exits 0, Vite production build exits 0, and diff check is clean.

- [ ] **Step 7: Commit responsive behavior**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: adapt challenge summary across viewports"
```

## Task 5: Browser Acceptance and Final Review

**Files:**
- Verify: homepage at `/` and `/#challenge`
- Verify: standalone page at `/challenge/`
- No source changes unless acceptance reveals a defect

- [ ] **Step 1: Build and launch the production preview**

Run:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4176
```

Expected: Vite reports `http://127.0.0.1:4176/` and both generated HTML entry points are present.

- [ ] **Step 2: Inspect the homepage at 1440 × 1000**

Verify:

- the title is exactly two equal-scale lines;
- only `Challenge` is orange;
- Introduction emphasis is visible but not link-like;
- the dark participation module is clearly actionable and distinct from information panels;
- Challenge Details opens `/challenge/`;
- Dataset and Evaluation Portal are visibly `Coming Soon` and not keyboard-focusable;
- Evaluation and Timeline are equal-width columns;
- tasks, prize pool, and organizers remain unchanged;
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

- [ ] **Step 3: Inspect the homepage at 768 × 1000**

Verify title wrapping remains balanced, participation destinations remain readable, both logistics panels remain legible, and there is no horizontal overflow.

- [ ] **Step 4: Inspect the homepage at 390 × 844**

Verify participation destinations and logistics panels stack in the confirmed order, all dates remain visible, title words share the same scale, focus indicators remain visible, and there is no horizontal overflow.

- [ ] **Step 5: Smoke-test the standalone Challenge page**

Open `http://127.0.0.1:4176/challenge/` and confirm:

- page title remains `Towards Bimanual Intelligence | IROS 2026 Challenge`;
- Coming Soon content renders;
- Back to Workshop links to `/`;
- no console warnings or errors appear.

- [ ] **Step 6: Run fresh final verification**

Run:

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
git status --short
```

Expected: all tests pass, lint and build exit 0, diff check is clean, and the worktree contains no uncommitted source changes. The visual-companion `.superpowers/` directory must not be staged or committed.

- [ ] **Step 7: Request final whole-feature review**

Review the complete implementation against:

- `docs/superpowers/specs/2026-08-06-challenge-summary-layout-design.md`
- this implementation plan
- the base commit immediately before Task 1
- the final implementation commit

Resolve every Critical or Important finding, re-run the full verification commands, and present the local preview for user acceptance. Do not push until the user explicitly approves the preview.
