# Paper Submission Deadline Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the previous paper submission deadline with a strikethrough and the extended August 27 deadline beneath it in the workshop homepage Important Dates panel.

**Architecture:** Keep both deadline values in the centralized `importantDates` data and render the optional previous value semantically with `<del>`. Use two scoped CSS classes to stack the old and current values without changing the typography of unrelated dates.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library

---

## File Map

- `src/data/workshop.ts`: stores the previous and current submission deadlines.
- `src/App.tsx`: renders an optional previous deadline and the active deadline.
- `src/App.css`: provides the stacked, subdued strikethrough treatment.
- `src/App.test.tsx`: verifies the semantic markup and unchanged neighboring dates.

### Task 1: Add the deadline-extension behavior

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/data/workshop.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write the failing homepage test**

Add this focused test near the existing Call for Papers tests in `src/App.test.tsx`:

```tsx
it('shows the extended submission deadline while retaining the previous deadline', () => {
  render(<App />)

  const datesPanel = screen.getByRole('complementary', {
    name: 'Important Dates',
  })
  const submissionRow = within(datesPanel)
    .getByText('Submission deadline')
    .closest('div')

  expect(submissionRow).not.toBeNull()

  const oldDeadline = within(submissionRow as HTMLElement).getByText(
    'August 24, 2026 · 11:59 PM AOE',
  )
  const newDeadline = within(submissionRow as HTMLElement).getByText(
    'August 27, 2026 · 11:59 PM AOE',
  )

  expect(oldDeadline.tagName).toBe('DEL')
  expect(oldDeadline).toHaveClass('important-dates__previous')
  expect(newDeadline).toHaveClass('important-dates__current')
  expect(datesPanel).toHaveTextContent(
    'September 6, 2026 · 11:59 PM AOE',
  )
  expect(datesPanel).toHaveTextContent(
    'September 20, 2026 · 11:59 PM AOE',
  )
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/App.test.tsx -t "shows the extended submission deadline"
```

Expected: FAIL because `August 27, 2026 · 11:59 PM AOE` is not rendered.

- [ ] **Step 3: Store the previous and current values in the shared data**

Replace the `importantDates` declaration in `src/data/workshop.ts` with:

```ts
export const importantDates = [
  {
    label: 'Submission deadline',
    previousValue: 'August 24, 2026 · 11:59 PM AOE',
    value: 'August 27, 2026 · 11:59 PM AOE',
  },
  {
    label: 'Acceptance notification',
    previousValue: undefined,
    value: 'September 6, 2026 · 11:59 PM AOE',
  },
  {
    label: 'Camera-ready deadline',
    previousValue: undefined,
    value: 'September 20, 2026 · 11:59 PM AOE',
  },
]
```

- [ ] **Step 4: Render semantic old and current deadline lines**

Replace the `<dd>{date.value}</dd>` inside the `importantDates.map` block in
`src/App.tsx` with:

```tsx
<dd>
  {date.previousValue && (
    <del className="important-dates__previous">
      {date.previousValue}
    </del>
  )}
  <span className="important-dates__current">{date.value}</span>
</dd>
```

- [ ] **Step 5: Add the scoped stacked-date styles**

Add the following immediately after the existing `.important-dates dd` rule in
`src/App.css`:

```css
.important-dates__previous,
.important-dates__current {
  display: block;
}

.important-dates__previous {
  margin-bottom: 3px;
  color: var(--slate-readable);
  text-decoration-thickness: 1px;
  text-decoration-color: currentColor;
}
```

The `<dd>` continues to supply the existing monospaced font, size, weight, and
line height to both lines.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```bash
npm test -- src/App.test.tsx -t "shows the extended submission deadline"
```

Expected: PASS.

- [ ] **Step 7: Run the full automated verification**

Run:

```bash
npm test && npm run lint && npm run build && git diff --check
```

Expected: 6 test files and all tests pass; lint and production build exit 0;
`git diff --check` produces no output.

- [ ] **Step 8: Verify the rendered layout**

Start the production preview:

```bash
npm run preview -- --host 127.0.0.1 --port 4198
```

Check the Call for Papers Important Dates panel at desktop and mobile widths:

- the old August 24 date is on the first line with a visible strikethrough;
- the August 27 date is on the second line with the existing active-date type;
- neither line overflows the panel at 390px;
- the acceptance and camera-ready dates are unchanged.

- [ ] **Step 9: Commit the implementation**

```bash
git add src/App.test.tsx src/data/workshop.ts src/App.tsx src/App.css
git commit -m "feat: extend paper submission deadline"
```

