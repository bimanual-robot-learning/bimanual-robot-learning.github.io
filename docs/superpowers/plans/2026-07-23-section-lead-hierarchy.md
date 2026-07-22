# Section Lead Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the five section lead sentences visually restrained while retaining comfortable readability on light and dark sections.

**Architecture:** Keep the existing shared `.section-description` abstraction so all five leads remain consistent. Change only its base typography and inverse color override, protect the approved values with the existing CSS regression test, then validate the unchanged responsive structure at three viewport widths.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite, oxlint

---

## File Map

- `src/App.css`: owns the shared section heading and lead typography.
- `src/App.test.tsx`: contains regression assertions for the approved typography declarations.
- `docs/superpowers/specs/2026-07-23-section-lead-hierarchy-design.md`: records the approved Option C visual direction.

### Task 1: Implement the restrained section lead typography

**Files:**
- Modify: `src/App.test.tsx:95-145`
- Modify: `src/App.css:486-502`

- [ ] **Step 1: Update the regression test first**

Replace the five section-description expectations inside `uses the approved readable foundation typography scale` with:

```ts
expect(sectionDescriptionRule).toContain(
  'font-size: clamp(1rem, 1.05vw, 1.0625rem);',
)
expect(sectionDescriptionRule).toContain('font-weight: 400;')
expect(sectionDescriptionRule).toContain('line-height: 1.64;')
expect(sectionDescriptionRule).toContain('color: var(--slate);')
expect(inverseDescriptionRule).toContain('color: var(--slate-light);')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL in `uses the approved readable foundation typography scale` because `src/App.css` still contains the previous `clamp(1.125rem, 1.35vw, 1.25rem)`, weight `500`, line height `1.6`, and readable color tokens.

- [ ] **Step 3: Make the minimal CSS change**

Change the two rules to the approved values while retaining existing width and margin declarations:

```css
.section-description {
  max-width: 760px;
  margin: 22px 0 0;
  color: var(--slate);
  font-size: clamp(1rem, 1.05vw, 1.0625rem);
  font-weight: 400;
  line-height: 1.64;
  text-wrap: pretty;
}

.section-heading--inverse .section-description {
  color: var(--slate-light);
}
```

Do not add section-specific selectors or change the existing mobile margin override.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: one test file passes and all tests in it pass.

- [ ] **Step 5: Run the complete automated verification**

Run:

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected: all tests pass; oxlint exits 0; TypeScript and Vite build successfully; `git diff --check` produces no output.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: restrain section lead hierarchy"
```

### Task 2: Validate visual hierarchy and responsive behavior

**Files:**
- Verify only: `src/App.css`
- Verify only: rendered website

- [ ] **Step 1: Start the production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite reports a local preview URL and serves the production build.

- [ ] **Step 2: Inspect the 1440px desktop layout**

Check all five `.section-description` elements at 1440px. Expected computed styles are `16px`, weight `400`, and line height approximately `26.24px`; light sections use `#5d6d78`, and inverse sections use `#9fb0bc`. Confirm each lead is subordinate to its `h2`, remains comfortably readable, and introduces no undesirable one-word final line.

- [ ] **Step 3: Inspect the 768px tablet layout**

Check the same five leads at 768px. Confirm the shared heading grid remains unchanged, lead copy does not overlap adjacent content, and `document.documentElement.scrollWidth` does not exceed `document.documentElement.clientWidth`.

- [ ] **Step 4: Inspect the 390px mobile layout**

Check the same five leads at 390px. Expected font size is `16px`; confirm natural multi-line wrapping, no clipped text, and no page-level horizontal overflow.

- [ ] **Step 5: Confirm unrelated accessibility behavior remains intact**

Confirm the existing `:focus-visible` styles and `@media (prefers-reduced-motion: reduce)` block remain present and unchanged in `src/App.css`.

- [ ] **Step 6: Stop the preview and report the evidence**

Stop the preview process. Report automated command results, viewport results, and any remaining visual caveat. Do not push or publish.
