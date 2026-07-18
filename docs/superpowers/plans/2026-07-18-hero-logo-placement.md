# Hero Logo Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the complete IROS 2026 Pittsburgh logo from the Hero title column to an independent responsive badge in the teaser’s upper-right negative space.

**Architecture:** Keep the existing local logo asset, typed conference URL, external-link semantics, and visual treatment. Change only the logo anchor’s DOM parent and its CSS positioning: `.hero` becomes the badge’s positioning context while `.hero__content` returns to a simple eyebrow → title → subtitle flow.

**Tech Stack:** Vite 8, React 19, TypeScript, CSS, Vitest, Testing Library, GitHub Pages Actions

---

### Task 1: Separate the conference badge from the title column

**Files:**
- Modify: `src/App.tsx:120-151`
- Test: `src/App.test.tsx:154-174`

- [ ] **Step 1: Write the failing DOM-structure test**

Add this test after the existing official-logo test:

```tsx
it('floats the conference badge outside the Hero title column', () => {
  render(<App />)

  const title = screen.getByRole('heading', {
    name: /Scaling vs\. Structure\?/i,
    level: 1,
  })
  const hero = title.closest('.hero')
  const heroContent = title.closest('.hero__content')
  const conferenceBadge = screen.getByRole('link', {
    name: 'Visit the official IROS 2026 website',
  })

  expect(hero).not.toBeNull()
  expect(heroContent).not.toBeNull()
  expect(hero as HTMLElement).toContainElement(conferenceBadge)
  expect(heroContent as HTMLElement).not.toContainElement(conferenceBadge)
  expect(heroContent?.querySelector('.hero__brand-row')).toBeNull()
  expect(within(heroContent as HTMLElement).getByText('Workshop @ IROS 2026')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```bash
npm test -- --run src/App.test.tsx -t "outside the Hero title column"
```

Expected: FAIL because `.hero__conference-brand` is still contained by `.hero__content`.

- [ ] **Step 3: Move the existing badge anchor**

In `App.tsx`, place the unchanged anchor immediately after `.hero__media`:

```tsx
<div className="hero__media" aria-hidden="true">
  <img src="/images/workshop-hero.jpg" alt="" />
  <div className="hero__media-overlay" />
</div>

<a
  className="hero__conference-brand"
  href={workshopMeta.conferenceUrl}
  target="_blank"
  rel="noreferrer"
  aria-label="Visit the official IROS 2026 website"
>
  <img src="/images/iros-2026-logo.png" alt="IROS 2026 Pittsburgh" />
</a>

<div className="hero__content page-width">
  <div className="hero__eyebrow">
    <span className="live-dot" aria-hidden="true" />
    {workshopMeta.eyebrow}
  </div>
```

Remove the `.hero__brand-row` wrapper and do not change the heading, subtitle, metadata, or actions.

- [ ] **Step 4: Run the focused and full tests**

Run:

```bash
npm test -- --run src/App.test.tsx -t "outside the Hero title column"
npm test -- --run
```

Expected: the focused test and all twelve tests PASS.

- [ ] **Step 5: Commit the structural change**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "separate IROS badge from hero title"
```

### Task 2: Position the badge over the teaser negative space

**Files:**
- Modify: `src/App.css:242-310, 1330-1400, 1585-1620`
- Test: `src/App.test.tsx:55-79`

- [ ] **Step 1: Replace the old brand-row CSS assertions with failing badge-position assertions**

Update the existing “approved Hero brand scale” test:

```tsx
it('uses the approved floating badge geometry and readable CFP topic text', () => {
  const conferenceBrandRule = appStyles.match(
    /\.hero__conference-brand\s*\{([^}]*)\}/,
  )?.[1]
  const heroEyebrowRule = appStyles.match(/\.hero__eyebrow\s*\{([^}]*)\}/)?.[1]
  const heroSubtitleRule = appStyles.match(/\.hero__subtitle\s*\{([^}]*)\}/)?.[1]
  const topicItemRule = appStyles.match(/\.topic-card li\s*\{([^}]*)\}/)?.[1]

  expect(appStyles).not.toContain('.hero__brand-row')
  expect(conferenceBrandRule).toContain('position: absolute;')
  expect(conferenceBrandRule).toContain('z-index: 3;')
  expect(conferenceBrandRule).toContain('top: 118px;')
  expect(conferenceBrandRule).toContain('right: clamp(32px, 5vw, 88px);')
  expect(conferenceBrandRule).toContain('width: 148px;')
  expect(heroEyebrowRule).toContain('font-size: 0.82rem;')
  expect(heroSubtitleRule).toContain('font-size: clamp(1.3rem, 2.1vw, 1.75rem);')
  expect(topicItemRule).toContain('font-size: 0.92rem;')
  expect(appStyles).toContain('top: 104px;')
  expect(appStyles).toContain('right: 22px;')
  expect(appStyles).toContain('width: 124px;')
  expect(appStyles).toContain('top: 96px;')
  expect(appStyles).toContain('right: 16px;')
  expect(appStyles).toContain('width: 112px;')
  expect(appStyles).toContain('max-width: calc(100% - 132px);')
})
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```bash
npm test -- --run src/App.test.tsx -t "approved floating badge geometry"
```

Expected: FAIL because `.hero__brand-row` still exists and the badge is not absolutely positioned.

- [ ] **Step 3: Implement the desktop geometry**

Delete the `.hero__brand-row` rule and update the start of `.hero__conference-brand` while retaining its padding, background, border, radius, shadow, transition, hover, focus, and image rules:

```css
.hero__conference-brand {
  position: absolute;
  z-index: 3;
  top: 118px;
  right: clamp(32px, 5vw, 88px);
  display: flex;
  width: 148px;
  padding: 10px 12px;
  background: rgba(248, 251, 252, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 8px;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, background 180ms ease;
}
```

- [ ] **Step 4: Implement tablet and mobile geometry**

Inside `@media (max-width: 920px)`, replace the current badge override with:

```css
.hero__conference-brand {
  top: 104px;
  right: 22px;
  width: 124px;
}
```

Inside `@media (max-width: 480px)`, remove `.hero__brand-row` and replace the badge override with:

```css
.hero__eyebrow {
  max-width: calc(100% - 132px);
}

.hero__conference-brand {
  top: 96px;
  right: 16px;
  width: 112px;
}
```

- [ ] **Step 5: Run the focused and full tests**

Run:

```bash
npm test -- --run src/App.test.tsx -t "approved floating badge geometry"
npm test -- --run
```

Expected: the focused test and all twelve tests PASS.

- [ ] **Step 6: Commit the position change**

```bash
git add src/App.css src/App.test.tsx
git commit -m "position IROS badge over teaser"
```

### Task 3: Verify responsive layout and production output

**Files:**
- Modify only after a failing regression test if visual inspection reveals a collision: `src/App.css`, `src/App.test.tsx`

- [ ] **Step 1: Run automated verification**

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected: twelve tests PASS, lint and build exit 0, and no whitespace errors appear.

- [ ] **Step 2: Start the production preview**

```bash
npm run preview -- --host 127.0.0.1 --port 4174
```

Expected: the site is available at `http://127.0.0.1:4174/`.

- [ ] **Step 3: Inspect `1440 × 1000`, `768 × 1024`, and `390 × 844`**

At each viewport verify:

- no horizontal overflow;
- badge does not collide with navigation, eyebrow, title, subtitle, or key robot subjects;
- complete logo remains legible;
- title column follows eyebrow → title → subtitle without an inserted logo;
- keyboard focus and reduced-motion behavior remain available;
- browser console contains no warning or error.

- [ ] **Step 4: Confirm the branch is clean**

```bash
git status --short --branch
git log -4 --oneline
```

Expected: no uncommitted files and both implementation commits appear above the plan and design commits.

### Task 4: Integrate and publish

**Files:**
- No additional source changes expected.

- [ ] **Step 1: Merge the feature branch into `main`**

From the primary worktree:

```bash
git switch main
git pull --ff-only
git merge --ff-only feature/hero-logo-placement
```

Expected: `main` advances to the verified feature commit.

- [ ] **Step 2: Remove the merged worktree before main-branch tests**

```bash
git worktree remove .worktrees/hero-logo-placement
git branch -d feature/hero-logo-placement
```

Expected: only the primary `main` worktree remains, preventing Vitest from discovering duplicate test files.

- [ ] **Step 3: Verify and push `main`**

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
git status --short --branch
git push origin main
```

Expected: twelve tests PASS, lint/build succeed, the worktree is clean, and `main` pushes successfully.

- [ ] **Step 4: Watch GitHub Pages and verify production**

```bash
gh run watch "$(gh run list --repo bimanual-robot-learning/bimanual-robot-learning.github.io --limit 1 --json databaseId --jq '.[0].databaseId')" --repo bimanual-robot-learning/bimanual-robot-learning.github.io --exit-status
```

Expected: “Deploy workshop website” completes successfully. Confirm `https://bimanual-robot-learning.github.io/`, its logo asset, and the deployed CSS return HTTP 200 and contain the new position values.
