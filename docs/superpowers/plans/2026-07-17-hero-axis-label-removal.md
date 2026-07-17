# Hero Teaser Label Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the `01 Scaling` and `02 Structure` floating labels and their unused styles from the Hero teaser.

**Architecture:** Add one DOM-level regression assertion, delete the two decorative JSX nodes, and remove CSS selectors that serve only those nodes. Keep all Hero image, overlay, title, metadata, and action markup unchanged.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

---

### Task 1: Remove Hero teaser labels

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write the failing regression assertion**

Add this assertion to the existing workshop identity test in `src/App.test.tsx`:

```tsx
expect(document.querySelectorAll('.hero__axis')).toHaveLength(0)
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because two `.hero__axis` elements are still rendered.

- [ ] **Step 3: Delete the decorative JSX nodes**

Remove these nodes from the `.hero__media` container in `src/App.tsx`:

```tsx
<div className="hero__axis hero__axis--scale">
  <span>01</span>
  Scaling
</div>
<div className="hero__axis hero__axis--structure">
  <span>02</span>
  Structure
</div>
```

Leave the image and `.hero__media-overlay` elements in place.

- [ ] **Step 4: Delete label-only CSS**

Remove the complete rules for:

```css
.hero__axis
.hero__axis span
.hero__axis--scale
.hero__axis--structure
.hero__axis--structure span
```

Also remove the obsolete `.hero__axis { display: none; }` rule from the `max-width: 920px` media query.

- [ ] **Step 5: Run complete verification**

Run: `npm test -- --run`

Expected: 7 tests PASS.

Run: `npm run lint`

Expected: exit code 0 with no diagnostics.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [ ] **Step 6: Verify the desktop Hero and commit**

At 1440px, verify `.hero__axis` count is zero, the Hero title remains orange/blue, the teaser image is visible, there is no horizontal overflow, and the browser console contains no warnings or errors.

```bash
git add src/App.test.tsx src/App.tsx src/App.css
git commit -m "remove hero teaser labels"
```
