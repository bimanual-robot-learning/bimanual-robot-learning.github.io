# Square Speaker Portraits and Organizer Affiliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render every invited-speaker portrait as a square with the selected airy row spacing and add PrimeBot to Hao Dong's organizer affiliation.

**Architecture:** Keep the existing `PersonCard` component and 3+2 CSS Grid placement. Add a speaker-only media override and separate row/column gaps at each existing responsive breakpoint, while updating the typed organizer data for the affiliation. Extend the current raw-CSS and rendered-content tests so the visual contract and text correction regress independently.

**Tech Stack:** React 19, TypeScript, Vite 8, Vitest, Testing Library, CSS Grid

---

### Task 1: Add failing regression coverage

**Files:**
- Modify: `src/App.test.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace the desktop speaker-grid regression test**

Replace the existing `uses a compact, airy invited-speaker grid on desktop` test with:

```tsx
it('uses square, airy invited-speaker cards across breakpoints', () => {
  const speakerGridRule = appStyles.match(/\.speaker-grid\s*\{([^}]*)\}/)?.[1]
  const speakerMediaRule = appStyles.match(
    /\.person-card--speaker\s+\.person-card__media\s*\{([^}]*)\}/,
  )?.[1]

  expect(speakerGridRule).toContain('width: min(100%, 720px);')
  expect(speakerGridRule).toContain('column-gap: 26px;')
  expect(speakerGridRule).toContain('row-gap: 72px;')
  expect(speakerMediaRule).toContain('aspect-ratio: 1;')
  expect(appStyles).toContain('row-gap: 56px;')
  expect(appStyles).toContain('row-gap: 40px;')
})
```

- [ ] **Step 2: Add the Hao Dong affiliation regression test**

Add this test inside the existing page test suite:

```tsx
it('shows Hao Dong\'s complete organizer affiliation', () => {
  render(<App />)

  const heading = screen.getByRole('heading', { name: 'Hao Dong' })
  const card = heading.closest('[data-testid="organizer-card"]')

  expect(card).not.toBeNull()
  expect(within(card as HTMLElement).getByText('Peking University · PrimeBot')).toBeInTheDocument()
})
```

- [ ] **Step 3: Run the focused tests and confirm the RED state**

Run:

```bash
npm test -- --run -t "square, airy|complete organizer affiliation"
```

Expected: both tests FAIL because there is no speaker-only square media rule, the grid still uses the `gap` shorthand, responsive row gaps are absent, and Hao Dong's institution omits PrimeBot.

### Task 2: Implement the CSS and data corrections

**Files:**
- Modify: `src/App.css:689-695`
- Modify: `src/App.css:719-727`
- Modify: `src/App.css:1237-1240`
- Modify: `src/App.css:1492-1495`
- Modify: `src/App.css:1583-1585`
- Modify: `src/data/workshop.ts:235-240`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Separate the desktop grid gaps**

Update the base speaker-grid rule to:

```css
.speaker-grid {
  display: grid;
  width: min(100%, 720px);
  margin-inline: auto;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  column-gap: 26px;
  row-gap: 72px;
}
```

- [ ] **Step 2: Add the speaker-only square media override**

After the generic `.person-card__media` rule, add:

```css
.person-card--speaker .person-card__media {
  aspect-ratio: 1;
}
```

Do not change `.person-card--organizer .person-card__media`.

- [ ] **Step 3: Set explicit responsive row and column gaps**

In `@media (max-width: 1120px)`, replace the speaker `gap` declaration with:

```css
column-gap: 26px;
row-gap: 72px;
```

In `@media (max-width: 720px)`, replace `gap: 18px;` with:

```css
column-gap: 18px;
row-gap: 56px;
```

In `@media (max-width: 480px)`, add this declaration to the existing speaker-grid rule:

```css
row-gap: 40px;
```

- [ ] **Step 4: Update Hao Dong's typed affiliation**

Change the organizer entry to:

```ts
{
  name: 'Hao Dong',
  institution: 'Peking University · PrimeBot',
  image: '/images/organizers/hao-dong.jpg',
  imageAlt: 'Portrait of workshop organizer Hao Dong',
},
```

- [ ] **Step 5: Run the focused tests and confirm the GREEN state**

Run:

```bash
npm test -- --run -t "square, airy|complete organizer affiliation"
```

Expected: both tests PASS.

- [ ] **Step 6: Run all automated checks**

Run:

```bash
npm test -- --run
npm run lint
npm run build
```

Expected: 9 tests pass; lint and production build exit successfully.

### Task 3: Verify the rendered correction and commit

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`
- Modify: `src/data/workshop.ts`

- [ ] **Step 1: Start the isolated preview**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 5176
```

Expected: Vite serves the isolated worktree at `http://127.0.0.1:5176/`.

- [ ] **Step 2: Inspect desktop and responsive layouts**

At `1440px`, verify a `720px` grid, `26px` column gap, `72px` row gap, square `223 × 223px` media, centered 3+2 rows, loaded images, and no horizontal overflow.

At `720px`, verify two columns, an `18px` column gap, a `56px` row gap, square media, and no horizontal overflow. Confirm the CSS regression assertion preserves the `480px` single-column `40px` row gap that the in-app browser cannot emulate below its minimum viewport.

- [ ] **Step 3: Verify Hao Dong's organizer card**

Confirm the rendered card contains `Peking University · PrimeBot` and no other organizer text changed.

- [ ] **Step 4: Inspect the final diff**

Run:

```bash
git diff --check
git diff -- src/App.css src/App.test.tsx src/data/workshop.ts
```

Expected: only the approved square speaker styling, responsive gaps, focused tests, and Hao Dong affiliation are changed.

- [ ] **Step 5: Commit the implementation**

Run:

```bash
git add src/App.css src/App.test.tsx src/data/workshop.ts
git commit -m "correct speaker portraits and organizer affiliation"
```

Expected: one implementation commit on `feature/square-speaker-portraits`.

