# Introduction and Speaker Scale Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Introduction card grid with a balanced single-column academic reading flow and reduce desktop invited-speaker portraits by approximately 25% while retaining the 3+2 layout.

**Architecture:** Keep all workshop copy in the existing typed `introduction` configuration and change only its React presentation and responsive CSS. Preserve the existing `PersonCard` component and control speaker scale at the grid-container level so image behavior, accessibility, and mobile layouts remain unchanged.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

---

### Task 1: Replace Introduction cards with an editorial reading flow

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write the failing semantic test**

Replace the existing test named `presents the workshop premise as three equally weighted ideas` with:

```tsx
it('presents the workshop premise as a single academic reading flow', () => {
  render(<App />)

  const introductionSection = screen.getByTestId('intro-editorial')
  const passages = within(introductionSection).getAllByTestId('intro-passage')

  expect(passages).toHaveLength(3)
  expect(within(passages[0]).getByRole('heading', { name: 'Context' })).toBeInTheDocument()
  expect(
    within(passages[1]).getByRole('heading', { name: 'Scaling view' }),
  ).toBeInTheDocument()
  expect(
    within(passages[2]).getByRole('heading', { name: 'Structure view' }),
  ).toBeInTheDocument()
  expect(within(introductionSection).getByTestId('intro-conclusion')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because `intro-editorial`, `intro-passage`, and `intro-conclusion` are not yet rendered.

- [ ] **Step 3: Implement the single-column JSX structure**

Replace the `intro-points` grid and its following conclusion in `src/App.tsx` with:

```tsx
<div className="intro-editorial" data-testid="intro-editorial">
  {introduction.points.map((point) => (
    <article
      className={`intro-passage intro-passage--${point.tone}`}
      data-testid="intro-passage"
      key={point.title}
    >
      <p className="intro-passage__label">{point.label}</p>
      <h3>{point.title}</h3>
      <p>{point.description}</p>
    </article>
  ))}

  <p className="intro-conclusion" data-testid="intro-conclusion">
    {introduction.conclusion}
  </p>
</div>
```

- [ ] **Step 4: Replace card-grid styling with editorial styling**

In `src/App.css`, remove the `.intro-points` and `.intro-point*` rules and add a centered column with consistent passage typography:

```css
.intro-editorial {
  width: min(100%, 920px);
  margin-inline: auto;
}

.intro-passage {
  display: grid;
  padding: 30px 0;
  grid-template-columns: 150px minmax(0, 1fr);
  column-gap: 30px;
  border-top: 1px solid var(--line-light);
}

.intro-passage__label {
  grid-row: 1 / span 2;
  margin: 5px 0 0;
  color: var(--cyan-deep);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.intro-passage--scale .intro-passage__label {
  color: var(--orange-deep);
}

.intro-passage--structure .intro-passage__label {
  color: var(--cyan-deep);
}

.intro-passage h3 {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: 1.18rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.intro-passage > p:last-child {
  margin: 0;
  color: var(--slate);
  font-size: 0.96rem;
  line-height: 1.8;
  text-wrap: pretty;
}

.intro-conclusion {
  max-width: none;
  margin: 8px 0 0 180px;
  padding: 22px 24px;
  color: var(--ink-800);
  background: rgba(82, 216, 230, 0.08);
  border-left: 3px solid var(--cyan);
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.65;
  text-wrap: pretty;
}
```

At the `max-width: 720px` breakpoint, add:

```css
.intro-passage {
  grid-template-columns: 1fr;
  row-gap: 10px;
}

.intro-passage__label {
  grid-row: auto;
}

.intro-conclusion {
  margin-left: 0;
}
```

Remove the obsolete responsive `.intro-points` rule.

- [ ] **Step 5: Run the focused test and verify it passes**

Run: `npm test -- --run src/App.test.tsx`

Expected: all tests in `src/App.test.tsx` PASS.

- [ ] **Step 6: Commit the Introduction refinement**

```bash
git add src/App.test.tsx src/App.tsx src/App.css
git commit -m "refine introduction editorial flow"
```

### Task 2: Reduce desktop speaker portraits by approximately 25%

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Constrain and center the desktop speaker grid**

Add width and centering to the existing `.speaker-grid` rule:

```css
.speaker-grid {
  display: grid;
  width: min(100%, 930px);
  margin-inline: auto;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 22px;
}
```

This changes desktop cards from approximately 399px wide to approximately 298px wide, a reduction of about 25%, while the existing column spans preserve the 3+2 row arrangement.

- [ ] **Step 2: Preserve available mobile width**

At the existing `max-width: 720px` breakpoint, keep the two-column layout and allow the constrained grid to fill the available page width. At `max-width: 480px`, keep the existing one-column layout. No additional portrait-size override is needed.

- [ ] **Step 3: Run automated verification**

Run: `npm test -- --run`

Expected: 7 tests PASS.

Run: `npm run lint`

Expected: exit code 0 with no lint diagnostics.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [ ] **Step 4: Perform responsive visual verification**

At 1440px, verify the speaker grid is about 930px wide, speakers remain arranged 3+2, and the second row is centered. At 768px and 390px, verify responsive wrapping, readable names and institutions, and `document.documentElement.scrollWidth === window.innerWidth`.

Verify the Introduction is a single reading column at all three widths, Scaling is orange, Structure is blue, and the browser console contains no warnings or errors.

- [ ] **Step 5: Commit the speaker scale refinement**

```bash
git add src/App.css
git commit -m "reduce invited speaker portrait scale"
```
