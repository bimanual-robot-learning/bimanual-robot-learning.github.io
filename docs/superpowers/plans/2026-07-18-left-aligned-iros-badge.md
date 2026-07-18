# Left-Aligned IROS Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the official IROS 2026 badge into the left Hero identity flow directly above `WORKSHOP @ IROS 2026`, with smaller responsive card sizes and no teaser overlap.

**Architecture:** Keep the existing logo asset, link, and accessibility contract. Introduce one presentational `.hero__identity` wrapper inside `.hero__content`, then replace the badge's absolute overlay geometry with normal-flow CSS and breakpoint-scoped widths.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, Testing Library, GitHub Actions, GitHub Pages

---

## File Map

- `src/App.tsx`: place the badge and workshop eyebrow in a shared Hero identity group.
- `src/App.css`: define the vertical identity flow and responsive badge sizes.
- `src/App.test.tsx`: enforce DOM order, accessibility preservation, normal-flow positioning, and breakpoint-scoped widths.
- `docs/superpowers/specs/2026-07-18-left-aligned-iros-badge-design.md`: approved visual specification; read-only during implementation.

### Task 1: Move the Badge into the Hero Identity Flow

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace the old overlay-location test with a failing identity-flow test**

Replace `floats the conference badge outside the Hero title column` in `src/App.test.tsx` with:

```tsx
it('groups the conference badge above the workshop eyebrow', () => {
  render(<App />)

  const title = screen.getByRole('heading', {
    name: /Scaling vs\. Structure\?/i,
    level: 1,
  })
  const hero = title.closest('.hero')
  const heroContent = title.closest('.hero__content')
  const identity = heroContent?.querySelector('.hero__identity')
  const conferenceBadge = screen.getByRole('link', {
    name: 'Visit the official IROS 2026 website',
  })
  const workshopEyebrow = within(heroContent as HTMLElement).getByText(
    'Workshop @ IROS 2026',
  )

  expect(hero).not.toBeNull()
  expect(heroContent).not.toBeNull()
  expect(identity).not.toBeNull()
  expect(identity as HTMLElement).toContainElement(conferenceBadge)
  expect(identity as HTMLElement).toContainElement(workshopEyebrow)
  expect(Array.from((identity as HTMLElement).children)).toEqual([
    conferenceBadge,
    workshopEyebrow,
  ])
  expect(hero?.querySelector(':scope > .hero__conference-brand')).toBeNull()
})
```

- [ ] **Step 2: Run the focused test and verify the current overlay fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "groups the conference badge above the workshop eyebrow"
```

Expected: FAIL because `.hero__identity` does not exist and the badge is still a direct child of `.hero`.

- [ ] **Step 3: Move the unchanged badge link into a new identity wrapper**

In `src/App.tsx`, replace the direct Hero badge plus standalone eyebrow with:

```tsx
<div className="hero__content page-width">
  <div className="hero__identity">
    <a
      className="hero__conference-brand"
      href={workshopMeta.conferenceUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Visit the official IROS 2026 website"
    >
      <img src="/images/iros-2026-logo.png" alt="IROS 2026 Pittsburgh" />
    </a>

    <div className="hero__eyebrow">
      <span className="live-dot" aria-hidden="true" />
      {workshopMeta.eyebrow}
    </div>
  </div>

  <h1 id="hero-title">
```

Keep the remainder of the Hero unchanged.

- [ ] **Step 4: Run the focused test and full suite**

Run:

```bash
npm test -- --run src/App.test.tsx -t "groups the conference badge above the workshop eyebrow"
npm test -- --run
```

Expected: focused test PASS and all 12 tests PASS.

- [ ] **Step 5: Commit the structural change**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "group IROS badge with hero identity"
```

### Task 2: Replace Overlay Geometry with Responsive Flow Styling

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Rewrite the CSS contract test for normal-flow geometry**

In the existing `uses the approved floating badge geometry and readable CFP topic text` test:

1. Rename it to `uses the approved left-aligned badge geometry and readable CFP topic text`.
2. Add the base identity rule extraction:

```tsx
const heroIdentityRule = appStyles.match(/\.hero__identity\s*\{([^}]*)\}/)?.[1]
```

3. Replace the badge geometry assertions with:

```tsx
expect(heroIdentityRule).toContain('display: flex;')
expect(heroIdentityRule).toContain('align-items: flex-start;')
expect(heroIdentityRule).toContain('flex-direction: column;')
expect(heroIdentityRule).toContain('gap: 16px;')
expect(conferenceBrandRule).not.toContain('position: absolute;')
expect(conferenceBrandRule).not.toContain('top:')
expect(conferenceBrandRule).not.toContain('right:')
expect(conferenceBrandRule).toContain('width: 132px;')
expect(tabletConferenceBrandRule).toContain('width: 112px;')
expect(mobileConferenceBrandRule).toContain('width: 96px;')
expect(appStyles).not.toContain('max-width: calc(100% - 132px);')
```

Keep the existing typography and CFP topic assertions.

- [ ] **Step 2: Run the focused CSS test and verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "uses the approved left-aligned badge geometry and readable CFP topic text"
```

Expected: FAIL because the base badge remains absolutely positioned at 148px and the responsive widths remain 124px and 112px.

- [ ] **Step 3: Add the identity flow and update the base badge rule**

In `src/App.css`, add immediately before `.hero__eyebrow`:

```css
.hero__identity {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 16px;
}
```

Replace the opening geometry of `.hero__conference-brand` with:

```css
.hero__conference-brand {
  display: flex;
  width: 132px;
  padding: 8px 10px;
  background: rgba(248, 251, 252, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 8px;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, background 180ms ease;
}
```

Remove `position`, `z-index`, `top`, and `right`. Keep the existing hover, focus-visible, and image rules unchanged.

- [ ] **Step 4: Update tablet and mobile rules**

In `@media (max-width: 920px)`, replace the badge rule with:

```css
.hero__conference-brand {
  width: 112px;
}
```

In `@media (max-width: 480px)`, delete the `.hero__eyebrow` width reservation and replace the badge rule with:

```css
.hero__conference-brand {
  width: 96px;
}
```

- [ ] **Step 5: Run the focused test and full suite**

Run:

```bash
npm test -- --run src/App.test.tsx -t "uses the approved left-aligned badge geometry and readable CFP topic text"
npm test -- --run
```

Expected: focused test PASS and all 12 tests PASS.

- [ ] **Step 6: Commit the responsive styling change**

```bash
git add src/App.css src/App.test.tsx
git commit -m "align IROS badge above workshop label"
```

### Task 3: Verify the Production Result

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/App.css`
- Verify: `src/App.test.tsx`

- [ ] **Step 1: Run all automated quality gates**

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
git status --short --branch
```

Expected: 12 tests PASS, linter exits 0, Vite production build exits 0, no whitespace errors, and the feature worktree is clean.

- [ ] **Step 2: Start the production preview**

```bash
npm run preview -- --host 127.0.0.1 --port 4174
```

Expected: preview available at `http://127.0.0.1:4174/`.

- [ ] **Step 3: Inspect three responsive viewports**

Use the in-app browser at 1440×1000, 768×1024, and 390×844. At each viewport verify:

- the white IROS card is left-aligned with the eyebrow and title;
- the card appears directly above `WORKSHOP @ IROS 2026` with a 16px gap;
- the logo remains fully visible and legible;
- the teaser has no logo overlay;
- the badge does not overlap the title, subtitle, metadata, or navigation;
- `document.documentElement.scrollWidth === window.innerWidth`;
- browser warning and error logs are empty.

- [ ] **Step 4: Stop the preview and confirm the worktree is clean**

```bash
git status --short --branch
```

Expected: no modified or untracked implementation files.

### Task 4: Integrate and Publish

**Files:**
- Verify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Use `superpowers:finishing-a-development-branch`**

Present the required integration options after a fresh test run. The requested release path is a local fast-forward merge into `main`, followed by the separately authorized GitHub Pages push.

- [ ] **Step 2: Merge after the user selects local integration**

From the repository root:

```bash
git pull --ff-only
git merge --ff-only feature/left-aligned-iros-badge
git worktree remove .worktrees/left-aligned-iros-badge
git branch -d feature/left-aligned-iros-badge
npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected: fast-forward merge succeeds and all checks pass on `main`.

- [ ] **Step 3: Push and monitor GitHub Pages**

```bash
git push origin main
gh run list --workflow deploy.yml --branch main --limit 1 --json databaseId,status,conclusion,headSha,url
```

Expected: the workflow for the new `main` commit completes with `conclusion: success`.

- [ ] **Step 4: Verify the live website**

Open `https://bimanual-robot-learning.github.io/` and confirm the deployed CSS contains the 132px, 112px, and 96px badge widths, the official logo returns HTTP 200, and the Hero displays the badge above the workshop eyebrow without covering the teaser.
