# Hero Branding and CFP Legibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the complete official IROS 2026 Pittsburgh logo to the Hero and improve the Hero and CFP typography without changing workshop content or the established visual system.

**Architecture:** Extend the existing typed `WorkshopMeta` configuration with the official conference URL, add one semantic Hero brand-row component directly in `App.tsx`, and keep all presentation changes in the existing responsive stylesheet. Store the official logo in `public/images` so GitHub Pages has no runtime dependency on the conference website.

**Tech Stack:** Vite 8, React 19, TypeScript, CSS, Vitest, Testing Library, GitHub Pages Actions

---

### Task 1: Add the official conference identity to the Hero

**Files:**
- Create: `public/images/iros-2026-logo.png`
- Modify: `src/data/workshop.ts:3-11, 48-62`
- Modify: `src/App.tsx:126-131`
- Test: `src/App.test.tsx:7-27, 111-137`

- [ ] **Step 1: Write the failing semantic test**

Refine the portrait selector so the new non-portrait image does not enter the portrait assertions:

```tsx
const portraits = screen.getAllByRole('img', { name: /Portrait of/ })
expect(portraits).toHaveLength(12)
```

Add a focused test before the navigation test:

```tsx
it('links a locally stored official IROS 2026 logo from the Hero', () => {
  render(<App />)

  const conferenceLink = screen.getByRole('link', {
    name: 'Visit the official IROS 2026 website',
  })
  expect(conferenceLink).toHaveAttribute('href', 'https://2026.ieee-iros.org/')
  expect(conferenceLink).toHaveAttribute('target', '_blank')
  expect(conferenceLink).toHaveAttribute('rel', 'noreferrer')

  const logo = screen.getByRole('img', { name: 'IROS 2026 Pittsburgh' })
  expect(logo).toHaveAttribute('src', '/images/iros-2026-logo.png')
})
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run:

```bash
npm test -- --run src/App.test.tsx -t "official IROS 2026 logo"
```

Expected: FAIL because no link named “Visit the official IROS 2026 website” exists.

- [ ] **Step 3: Add the typed official conference URL**

Add the field to `WorkshopMeta` and its data object:

```ts
export interface WorkshopMeta {
  eyebrow: string
  title: string
  subtitle: string
  date: string
  time: string
  location: string
  conferenceUrl: string
  openReviewUrl: string
  repositoryUrl: string
}

export const workshopMeta: WorkshopMeta = {
  // existing fields
  conferenceUrl: 'https://2026.ieee-iros.org/',
  // existing links
}
```

- [ ] **Step 4: Download the official logo locally**

Run:

```bash
curl -L --fail --silent --show-error \
  -o public/images/iros-2026-logo.png \
  https://2026.ieee-iros.org/wp-content/uploads/sites/804/unnamed-scaled.png
```

Verify:

```bash
file public/images/iros-2026-logo.png
sips -g hasAlpha public/images/iros-2026-logo.png
```

Expected: a valid 2560 × 1662 PNG image and `hasAlpha: yes`.

- [ ] **Step 5: Add the semantic Hero brand row**

Replace the standalone `hero__eyebrow` block with:

```tsx
<div className="hero__brand-row">
  <div className="hero__eyebrow">
    <span className="live-dot" aria-hidden="true" />
    {workshopMeta.eyebrow}
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
</div>
```

- [ ] **Step 6: Run the focused and full tests**

Run:

```bash
npm test -- --run src/App.test.tsx -t "official IROS 2026 logo"
npm test -- --run
```

Expected: the focused test and all ten tests PASS.

- [ ] **Step 7: Commit the semantic and asset change**

```bash
git add public/images/iros-2026-logo.png src/data/workshop.ts src/App.tsx src/App.test.tsx
git commit -m "add official IROS branding to hero"
```

### Task 2: Increase Hero and CFP readability

**Files:**
- Modify: `src/App.css:242-310, 872-920, 1262-1371, 1535-1580`
- Test: `src/App.test.tsx:40-61, 87-110`

- [ ] **Step 1: Write the failing typography test**

Add a new test after the speaker-grid test:

```tsx
it('uses the approved Hero brand scale and readable CFP topic text', () => {
  const brandRowRule = appStyles.match(/\.hero__brand-row\s*\{([^}]*)\}/)?.[1]
  const conferenceBrandRule = appStyles.match(
    /\.hero__conference-brand\s*\{([^}]*)\}/,
  )?.[1]
  const heroEyebrowRule = appStyles.match(/\.hero__eyebrow\s*\{([^}]*)\}/)?.[1]
  const heroSubtitleRule = appStyles.match(/\.hero__subtitle\s*\{([^}]*)\}/)?.[1]
  const topicItemRule = appStyles.match(/\.topic-card li\s*\{([^}]*)\}/)?.[1]

  expect(brandRowRule).toContain('max-width: 760px;')
  expect(conferenceBrandRule).toContain('width: 148px;')
  expect(heroEyebrowRule).toContain('font-size: 0.82rem;')
  expect(heroEyebrowRule).toContain('letter-spacing: 0.1em;')
  expect(heroSubtitleRule).toContain('font-size: clamp(1.3rem, 2.1vw, 1.75rem);')
  expect(topicItemRule).toContain('font-size: 0.92rem;')
  expect(topicItemRule).toContain('line-height: 1.55;')
  expect(appStyles).toContain('width: 138px;')
  expect(appStyles).toContain('width: 128px;')
})
```

Extend the existing CFP test to preserve the content count:

```tsx
const topicItems = topicCards.flatMap((card) => within(card).getAllByRole('listitem'))
expect(topicItems).toHaveLength(9)
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run:

```bash
npm test -- --run src/App.test.tsx -t "approved Hero brand scale"
```

Expected: FAIL because `hero__brand-row` and the approved typography values do not exist.

- [ ] **Step 3: Add the desktop brand-row and logo-card styles**

Split the shared eyebrow/footer rule so only the Hero eyebrow grows, then add:

```css
.hero__brand-row {
  display: flex;
  max-width: 760px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero__conference-brand {
  display: flex;
  width: 148px;
  padding: 10px 12px;
  flex: 0 0 auto;
  background: rgba(248, 251, 252, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 8px;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, background 180ms ease;
}

.hero__conference-brand:hover {
  background: var(--white);
  transform: translateY(-2px);
}

.hero__conference-brand:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 4px;
}

.hero__conference-brand img {
  display: block;
  width: 100%;
  height: auto;
}
```

- [ ] **Step 4: Apply the approved typography values**

Update the existing rules:

```css
.hero__subtitle {
  /* retain existing layout, color, family, weight, and line height */
  font-size: clamp(1.3rem, 2.1vw, 1.75rem);
}

.topic-card {
  min-height: 380px;
}

.topic-card li {
  /* retain existing position, padding, and border */
  color: rgba(220, 234, 236, 0.86);
  font-size: 0.92rem;
  line-height: 1.55;
}
```

- [ ] **Step 5: Add responsive logo rules**

Inside `@media (max-width: 920px)` add:

```css
.hero__conference-brand {
  width: 138px;
}
```

Inside `@media (max-width: 480px)` add:

```css
.hero__brand-row {
  align-items: flex-start;
  flex-direction: column;
  gap: 18px;
}

.hero__conference-brand {
  width: 128px;
}
```

- [ ] **Step 6: Run the focused and full tests**

Run:

```bash
npm test -- --run src/App.test.tsx -t "approved Hero brand scale"
npm test -- --run
```

Expected: the focused test and all eleven tests PASS.

- [ ] **Step 7: Commit the typography change**

```bash
git add src/App.css src/App.test.tsx
git commit -m "improve hero and CFP typography"
```

### Task 3: Verify responsive quality and production output

**Files:**
- Modify only if a verified issue requires a focused follow-up: `src/App.css`, `src/App.test.tsx`

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected: eleven tests PASS; lint exits 0; Vite produces `dist/`; no whitespace errors.

- [ ] **Step 2: Start a production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4173
```

Expected: Vite serves the production build at `http://127.0.0.1:4173/`.

- [ ] **Step 3: Inspect the Hero and CFP at three widths**

Check `1440 × 1000`, `768 × 1024`, and `390 × 844`:

- Complete logo is legible and does not cover the teaser.
- Eyebrow and subtitle are visibly larger but do not collide with the main title or metadata.
- At 390px, the logo stacks below the eyebrow and there is no horizontal overflow.
- The nine CFP bullets are readable, retain equal card emphasis, and do not leave isolated trailing words where avoidable.
- Keyboard focus is visible on the logo link; reduced-motion behavior remains unchanged.

- [ ] **Step 4: Confirm the branch is clean and ready for integration**

Run:

```bash
git status --short --branch
git log -3 --oneline
```

Expected: no uncommitted files; the two implementation commits appear above the design and plan commits.

### Task 4: Integrate and publish the approved update

**Files:**
- No additional source changes expected.

- [ ] **Step 1: Merge the feature branch into `main`**

From the primary worktree:

```bash
git switch main
git merge --ff-only feature/hero-branding
```

Expected: `main` advances to the verified feature commit without a merge commit.

- [ ] **Step 2: Re-run release verification on `main`**

```bash
npm test -- --run
npm run lint
npm run build
git status --short --branch
```

Expected: eleven tests PASS, lint/build succeed, and `main` is ahead of `origin/main` only by the intended commits.

- [ ] **Step 3: Push and watch GitHub Pages**

```bash
git push origin main
gh run list --repo bimanual-robot-learning/bimanual-robot-learning.github.io --limit 1
gh run watch "$(gh run list --repo bimanual-robot-learning/bimanual-robot-learning.github.io --limit 1 --json databaseId --jq '.[0].databaseId')" --repo bimanual-robot-learning/bimanual-robot-learning.github.io --exit-status
```

Expected: the “Deploy workshop website” workflow completes successfully.

- [ ] **Step 4: Verify production**

Check `https://bimanual-robot-learning.github.io/` and its deployed logo asset. Expected: HTTP 200, the complete IROS mark appears in the Hero, and the production CSS contains the approved typography values.
