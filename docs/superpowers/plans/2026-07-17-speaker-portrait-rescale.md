# Invited Speaker Portrait Rescale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce invited-speaker portraits by approximately 25% on desktop and add breathing room while preserving the 3+2 composition and current mobile layouts.

**Architecture:** Keep the existing six-column speaker grid and person-card component unchanged. Express the visual adjustment entirely through the speaker-grid sizing rules in `src/App.css`, with a focused raw-CSS regression assertion in `src/App.test.tsx` and browser verification at desktop and tablet widths.

**Tech Stack:** React 19, TypeScript, Vite 8, Vitest, Testing Library, CSS Grid

---

### Task 1: Lock the compact speaker-grid dimensions with a failing test

**Files:**
- Modify: `src/App.test.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Import the application stylesheet as raw text**

Add this import with the existing imports:

```tsx
import appStyles from './App.css?raw'
```

- [ ] **Step 2: Add the focused regression test**

Add the following test inside the existing `describe('workshop landing page', ...)` block:

```tsx
it('uses a compact, airy invited-speaker grid on desktop', () => {
  const speakerGridRule = appStyles.match(/\.speaker-grid\s*\{([^}]*)\}/)?.[1]

  expect(speakerGridRule).toContain('width: min(100%, 720px);')
  expect(speakerGridRule).toContain('gap: 26px;')
})
```

- [ ] **Step 3: Run the focused test and confirm the RED state**

Run:

```bash
npm test -- --run -t "compact, airy invited-speaker grid"
```

Expected: FAIL because the current rule contains `width: min(100%, 930px);` and `gap: 22px;`.

### Task 2: Apply the approved desktop dimensions

**Files:**
- Modify: `src/App.css:689-695`
- Modify: `src/App.css:1237-1240`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Update the base speaker-grid rule**

Replace the current base rule with:

```css
.speaker-grid {
  display: grid;
  width: min(100%, 720px);
  margin-inline: auto;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 26px;
}
```

- [ ] **Step 2: Preserve the larger gap through the tablet-wide breakpoint**

Update the existing `@media (max-width: 1120px)` speaker rule to:

```css
.speaker-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 26px;
}
```

Do not change the existing `@media (max-width: 920px)` two-column rule or the smallest single-column rule.

- [ ] **Step 3: Run the focused test and confirm the GREEN state**

Run:

```bash
npm test -- --run -t "compact, airy invited-speaker grid"
```

Expected: PASS.

- [ ] **Step 4: Run all automated checks**

Run:

```bash
npm test -- --run
npm run lint
npm run build
```

Expected: 8 tests pass; lint and production build exit successfully.

### Task 3: Verify the rendered layout and commit

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Start the isolated preview server**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 5175
```

Expected: Vite serves the isolated worktree at `http://127.0.0.1:5175/`.

- [ ] **Step 2: Inspect desktop and tablet-wide viewports**

At `1440px` and `1024px` viewport widths, verify:

- the first row contains three speakers and the second row contains two centered speakers;
- the computed grid maximum width is `720px` and the gap is `26px`;
- portraits load successfully and retain their existing aspect ratio and crop;
- there is no horizontal overflow.

At `768px`, verify the existing two-column responsive layout remains readable.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff --check
git diff -- src/App.css src/App.test.tsx
```

Expected: only the approved speaker-grid values and focused regression test are changed.

- [ ] **Step 4: Commit the implementation**

Run:

```bash
git add src/App.css src/App.test.tsx
git commit -m "refine invited speaker spacing"
```

Expected: one implementation commit on `feature/rescale-speaker-portraits`.
