# Challenge Homepage Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the homepage Challenge title, introduction readability, Evaluation Format density, and Challenge Organizer information/layout without changing Challenge facts or the standalone `/challenge/` page.

**Architecture:** Make the Challenge title structurally explicit in the typed content configuration, render its two parts inside one semantic heading, and adjust only the Challenge-specific CSS contracts. Reuse the existing `PersonCard` institution rendering and responsive breakpoints instead of introducing new components.

**Tech Stack:** React 19, TypeScript, CSS, Vite 8, Vitest, Testing Library

---

## File Structure

- Modify `src/data/workshop.ts`: structured Challenge title and organizer institutions.
- Modify `src/components/ChallengeSection.tsx`: render two styled title spans in one `h2`.
- Modify `src/App.css`: title highlight, larger introduction, compact Evaluation Format, and two-column organizer layout.
- Modify `src/App.test.tsx`: content, semantic rendering, CSS, and responsive regression coverage.

### Task 1: Structure the Challenge Title and Organizer Data

**Files:**
- Modify: `src/data/workshop.ts`
- Modify: `src/components/ChallengeSection.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing content and rendering assertions**

Update the Challenge content test to require:

```tsx
expect(challenge.titleLead).toBe('Towards Bimanual Intelligence:')
expect(challenge.titleHighlight).toBe(
  'A Real-World Household Manipulation Challenge',
)
expect(challenge).not.toHaveProperty('title')

expect(challengeOrganizers.map(({ name, institution }) => ({ name, institution }))).toEqual([
  { name: 'Kai Li', institution: 'PrimeBot' },
  { name: 'Ran Cheng', institution: 'PrimeBot' },
  { name: 'Yan Shen', institution: 'Peking University' },
  { name: 'Hao Dong', institution: 'PrimeBot · Peking University' },
])
```

Update the rendered-section test to require one heading whose accessible name is the complete title and two spans:

```tsx
const challengeHeading = screen.getByRole('heading', {
  level: 2,
  name: 'Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge',
})

expect(challengeHeading.querySelector('.challenge-title__lead')).toHaveTextContent(
  'Towards Bimanual Intelligence:',
)
expect(
  challengeHeading.querySelector('.challenge-title__highlight'),
).toHaveTextContent('A Real-World Household Manipulation Challenge')
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx -t "stores the approved Challenge content|renders the workshop identity"
```

Expected: FAIL because the old `title` field remains, institutions are absent, and title spans do not exist.

- [ ] **Step 3: Update the typed Challenge data**

Change `ChallengeInfo`:

```ts
export interface ChallengeInfo {
  titleLead: string
  titleHighlight: string
  sponsorLine: string
  introduction: string
  // retain all existing fields unchanged
}
```

Replace the single title in `challenge`:

```ts
titleLead: 'Towards Bimanual Intelligence:',
titleHighlight: 'A Real-World Household Manipulation Challenge',
```

Add institutions to the existing organizer objects:

```ts
{ name: 'Kai Li', institution: 'PrimeBot', ... }
{ name: 'Ran Cheng', institution: 'PrimeBot', ... }
{ name: 'Yan Shen', institution: 'Peking University', ... }
{ name: 'Hao Dong', institution: 'PrimeBot · Peking University', ... }
```

- [ ] **Step 4: Render the two-part semantic title**

Replace the current heading in `ChallengeSection.tsx`:

```tsx
<h2 id="challenge-title">
  <span className="challenge-title__lead">{challenge.titleLead}</span>{' '}
  <span className="challenge-title__highlight">
    {challenge.titleHighlight}
  </span>
</h2>
```

- [ ] **Step 5: Run focused and full tests**

Run:

```bash
npm test -- --run src/App.test.tsx -t "stores the approved Challenge content|renders the workshop identity"
npm test -- --run
```

Expected: all tests pass after updating existing references from `challenge.title` to the complete accessible title string.

- [ ] **Step 6: Commit**

```bash
git add src/data/workshop.ts src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m "content: clarify challenge title and organizers"
```

### Task 2: Improve Title and Introduction Hierarchy

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing CSS contract assertions**

Add assertions that the title parts and introduction have the required hierarchy:

```tsx
const titleLead = extractCssRule(appStyles, '.challenge-title__lead').declarations
const titleHighlight = extractCssRule(
  appStyles,
  '.challenge-title__highlight',
).declarations
const challengeIntroduction = extractCssRule(
  appStyles,
  '.challenge-introduction',
).declarations

expect(titleLead).toContain('display: block;')
expect(titleHighlight).toContain('display: block;')
expect(titleHighlight).toContain('color: var(--orange-deep);')
expect(titleHighlight).toContain('font-size: 0.92em;')
expect(titleHighlight).toContain('font-weight: 650;')
expect(challengeIntroduction).toContain(
  'font-size: clamp(1.08rem, 1.4vw, 1.18rem);',
)
```

Preserve the compact heading rule and add a compact introduction font-size assertion:

```tsx
expect(
  extractCssRule(compactMedia, '.challenge-introduction').declarations,
).toContain('font-size: 1.06rem;')
```

- [ ] **Step 2: Run the focused CSS test and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx -t "uses the approved Challenge visual system|keeps the Challenge layout readable"
```

Expected: FAIL because title-part rules and updated introduction sizing are missing.

- [ ] **Step 3: Add title and introduction styles**

After `.challenge-heading h2`, add:

```css
.challenge-title__lead,
.challenge-title__highlight {
  display: block;
}

.challenge-title__highlight {
  margin-top: 0.08em;
  color: var(--orange-deep);
  font-size: 0.92em;
  font-weight: 650;
}
```

Change the introduction declaration to:

```css
font-size: clamp(1.08rem, 1.4vw, 1.18rem);
```

At `max-width: 480px`, retain the current padding and add:

```css
font-size: 1.06rem;
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx -t "uses the approved Challenge visual system|keeps the Challenge layout readable"
```

Expected: focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: emphasize challenge identity"
```

### Task 3: Compact the Evaluation Format Module

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing spacing assertions**

Add a focused test that extracts the owning rules and requires:

```tsx
expect(extractCssRule(appStyles, '.challenge-evaluation').declarations).toContain(
  'padding: clamp(24px, 3vw, 34px);',
)
expect(extractCssRule(appStyles, '.challenge-evaluation > h3').declarations).toContain(
  'margin: 0 0 20px;',
)
expect(extractCssRule(appStyles, '.challenge-flow').declarations).toContain('gap: 14px;')
expect(extractCssRule(appStyles, '.challenge-flow li').declarations).toContain('padding: 20px;')
expect(extractCssRule(appStyles, '.challenge-flow li > span').declarations).toContain(
  'margin-bottom: 14px;',
)
const finalRanking = extractCssRule(appStyles, '.challenge-final-ranking').declarations
expect(finalRanking).toContain('padding: 20px 0 0;')
expect(finalRanking).toContain('margin: 20px 0 0;')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx -t "keeps the Challenge layout readable"
```

Expected: FAIL on the previous larger spacing values.

- [ ] **Step 3: Apply compact spacing without changing text sizes**

Separate `.challenge-evaluation` from the shared timeline padding rule where necessary and apply:

```css
.challenge-evaluation {
  padding: clamp(24px, 3vw, 34px);
}
```

Update the heading margin, flow gap, stage padding, number margin, and Final Ranking padding/margin to the exact tested values. Preserve the stage arrow rules and all typography declarations.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
npm test -- --run src/App.test.tsx -t "keeps the Challenge layout readable"
npm test -- --run
```

Expected: focused and full suites pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: compact challenge evaluation format"
```

### Task 4: Match the Two-Column Organizer Rhythm

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing organizer layout assertions**

Change the default grid expectation from four columns to two and require a wider image column:

```tsx
expectGridColumns('.challenge-organizer-grid', 2)
expect(
  extractCssRule(appStyles, '.person-card--challenge-organizer').declarations,
).toContain('grid-template-columns: 104px minmax(0, 1fr);')
```

Keep the tablet expectation at two columns and the mobile expectation at one column. Add an assertion that the longest institution renders visibly:

```tsx
const haoCard = screen.getAllByTestId('challenge-organizer-card').find((card) =>
  card.textContent?.includes('Hao Dong'),
)
expect(haoCard).toHaveTextContent('PrimeBot · Peking University')
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx -t "uses the approved Challenge visual system|keeps the Challenge layout readable|renders the workshop identity"
```

Expected: FAIL because the default grid still uses four columns and the card image column is 92px.

- [ ] **Step 3: Implement the two-column layout**

Update the base rules:

```css
.challenge-organizer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.person-card--challenge-organizer {
  grid-template-columns: 104px minmax(0, 1fr);
}
```

Keep the existing `max-width: 920px` two-column rule and `max-width: 720px` one-column rule. Preserve square portraits and the existing mobile `112px` image column. Do not reduce institution font size.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npm test -- --run src/App.test.tsx
npm run lint
npm run build
git diff --check
```

Expected: all checks pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: expand challenge organizer cards"
```

### Task 5: Browser Acceptance and Final Regression

**Files:**
- Verify only; modify prior files only after reproducing a defect and adding a regression test.

- [ ] **Step 1: Run fresh full verification**

Run:

```bash
npm test -- --run && npm run lint && npm run build && git diff --check
```

Expected: all tests, lint, TypeScript/Vite build, and diff check pass.

- [ ] **Step 2: Start a production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4174
```

- [ ] **Step 3: Inspect the homepage at 1440×1000, 768×1000, and 390×844**

Verify:

- orange Challenge title line is prominent and wraps cleanly;
- the complete title remains one accessible `h2`;
- introduction is larger but not title-like;
- Evaluation Format is visibly tighter with no text clipping;
- Challenge Organizer grid is 2/2/1 columns at desktop/tablet/mobile;
- `PrimeBot · Peking University` wraps naturally;
- no horizontal overflow or browser console errors.

- [ ] **Step 4: Smoke-test the standalone Challenge page**

Open `/challenge/` and confirm its title, sponsor treatment, layout, and console remain unchanged.

- [ ] **Step 5: Commit validation corrections only if needed**

If visual QA finds a defect, add a failing regression test, make the smallest fix, rerun full verification, and commit with a focused message. Do not create an empty commit when no defect is found.
