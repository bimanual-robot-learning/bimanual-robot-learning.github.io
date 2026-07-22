# Typography Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the readability of workshop metadata, section leads, schedule content, CFP details, affiliations, and footer information without changing content or layout structure.

**Architecture:** Keep the existing React markup and content data unchanged. Add two semantic secondary-text color tokens in `src/index.css`, then update the existing component selectors in `src/App.css`. Protect the approved typography scale with raw-CSS regression assertions in `src/App.test.tsx`, followed by responsive visual verification.

**Tech Stack:** Vite 8, React 19, TypeScript 6, CSS, Vitest, Testing Library

---

## File map

- Modify `src/index.css`: define readable light- and dark-section secondary-text tokens.
- Modify `src/App.css`: apply the approved font sizes, weights, colors, line heights, and responsive navigation minimums.
- Modify `src/App.test.tsx`: add CSS regression coverage and update the existing CFP topic-size assertion.
- Reference `docs/superpowers/specs/2026-07-22-typography-readability-design.md`: approved design values and acceptance criteria.

No React component, workshop data, image, or deployment workflow file should change.

### Task 1: Establish the readable text tokens and global hierarchy

**Files:**
- Modify: `src/index.css:1-19`
- Modify: `src/App.css:116-161`
- Modify: `src/App.css:355-402`
- Modify: `src/App.css:484-499`
- Modify: `src/App.css:1273-1280`
- Modify: `src/App.css:1340-1385`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Import the root stylesheet and add a failing foundation typography test**

Add the root stylesheet import beside the existing `App.css?raw` import:

```ts
import appStyles from './App.css?raw'
import indexStyles from './index.css?raw'
```

Add this test after the existing Hero branding CSS test:

```ts
it('uses the approved readable foundation typography scale', () => {
  const navRule = appStyles.match(/\.nav-links a\s*\{([^}]*)\}/)?.[1]
  const navCtaRule = appStyles.match(/\.nav-cta\s*\{([^}]*)\}/)?.[1]
  const buttonRule = appStyles.match(/\.button\s*\{([^}]*)\}/)?.[1]
  const heroMetaRule = appStyles.match(/\.hero__meta span\s*\{([^}]*)\}/)?.[1]
  const sectionDescriptionRule = appStyles.match(
    /\.section-description\s*\{([^}]*)\}/,
  )?.[1]
  const inverseDescriptionRule = appStyles.match(
    /\.section-heading--inverse \.section-description\s*\{([^}]*)\}/,
  )?.[1]
  const narrowDesktopMedia = appStyles.match(
    /@media \(max-width: 1120px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 920px\)/,
  )?.[1]
  const tabletMedia = appStyles.match(
    /@media \(max-width: 920px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 720px\)/,
  )?.[1]
  const narrowNavRule = narrowDesktopMedia?.match(
    /\.nav-links a\s*\{([^}]*)\}/,
  )?.[1]
  const tabletNavRule = tabletMedia?.match(/\.nav-links a\s*\{([^}]*)\}/)?.[1]

  expect(indexStyles).toContain('--slate-readable: #465b68;')
  expect(indexStyles).toContain('--slate-light-readable: #c3d0d6;')
  expect(navRule).toContain('color: rgba(229, 241, 243, 0.82);')
  expect(navRule).toContain('font-size: 0.8rem;')
  expect(navCtaRule).toContain('font-size: 0.75rem;')
  expect(buttonRule).toContain('font-size: 0.78rem;')
  expect(heroMetaRule).toContain('font-size: 0.9rem;')
  expect(heroMetaRule).toContain('font-weight: 500;')
  expect(heroMetaRule).toContain('line-height: 1.5;')
  expect(sectionDescriptionRule).toContain(
    'font-size: clamp(1.125rem, 1.35vw, 1.25rem);',
  )
  expect(sectionDescriptionRule).toContain('font-weight: 500;')
  expect(sectionDescriptionRule).toContain('line-height: 1.6;')
  expect(sectionDescriptionRule).toContain('color: var(--slate-readable);')
  expect(inverseDescriptionRule).toContain(
    'color: var(--slate-light-readable);',
  )
  expect(narrowNavRule).toContain('font-size: 0.78rem;')
  expect(tabletNavRule).toContain('font-size: 0.8rem;')
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --testNamePattern="approved readable foundation typography scale"
```

Expected: FAIL because the new color tokens and approved font-size declarations are not present.

- [ ] **Step 3: Add the semantic readable color tokens**

In `src/index.css`, add the two variables immediately after the existing slate variables:

```css
  --slate: #5d6d78;
  --slate-light: #9fb0bc;
  --slate-readable: #465b68;
  --slate-light-readable: #c3d0d6;
```

- [ ] **Step 4: Apply the approved header, button, Hero metadata, and section-lead styles**

Update the relevant declarations in `src/App.css` to the following values while preserving the other properties in each rule:

```css
.nav-links a {
  color: rgba(229, 241, 243, 0.82);
  font-size: 0.8rem;
}

.nav-cta {
  font-size: 0.75rem;
}

.hero__meta span {
  color: rgba(239, 247, 248, 0.92);
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
}

.button {
  font-size: 0.78rem;
}

.section-description {
  color: var(--slate-readable);
  font-size: clamp(1.125rem, 1.35vw, 1.25rem);
  font-weight: 500;
  line-height: 1.6;
}

.section-heading--inverse .section-description {
  color: var(--slate-light-readable);
}
```

Change the navigation overrides so readable navigation does not shrink back below the approved range:

```css
@media (max-width: 1120px) {
  .nav-links a {
    font-size: 0.78rem;
  }
}

@media (max-width: 920px) {
  .nav-links a {
    font-size: 0.8rem;
  }
}
```

- [ ] **Step 5: Run the focused test and the full suite**

Run:

```bash
npm test -- --testNamePattern="approved readable foundation typography scale"
npm test
```

Expected: the focused test and full suite PASS.

- [ ] **Step 6: Commit the foundation hierarchy**

```bash
git add src/index.css src/App.css src/App.test.tsx
git commit -m "style: strengthen foundational text hierarchy"
```

### Task 2: Make the schedule readable at a glance

**Files:**
- Modify: `src/App.css:602-727`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Add a failing schedule typography regression test**

Add this test after the foundation typography test:

```ts
it('uses readable schedule metadata, headers, times, titles, and statuses', () => {
  const scheduleMetaRule = appStyles.match(/\.schedule-meta\s*\{([^}]*)\}/)?.[1]
  const headerRule = appStyles.match(
    /\.schedule-table thead th\s*\{([^}]*)\}/,
  )?.[1]
  const timeRule = appStyles.match(/\.schedule-time\s*\{([^}]*)\}/)?.[1]
  const titleRule = appStyles.match(
    /\.schedule-title-cell\s*\{([^}]*)\}/,
  )?.[1]
  const statusRule = appStyles.match(/\.status-badge\s*\{([^}]*)\}/)?.[1]

  expect(scheduleMetaRule).toContain('color: var(--slate-light-readable);')
  expect(scheduleMetaRule).toContain('font-size: 0.78rem;')
  expect(scheduleMetaRule).toContain('font-weight: 500;')
  expect(headerRule).toContain('font-size: 0.78rem;')
  expect(headerRule).toContain('font-weight: 600;')
  expect(headerRule).toContain('letter-spacing: 0.07em;')
  expect(timeRule).toContain('font-size: 0.875rem;')
  expect(timeRule).toContain('font-weight: 500;')
  expect(titleRule).toContain('color: var(--slate-light-readable);')
  expect(titleRule).toContain('font-size: 1rem;')
  expect(titleRule).toContain('font-weight: 500;')
  expect(statusRule).toContain('font-size: 0.66rem;')
  expect(statusRule).toContain('font-weight: 500;')
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --testNamePattern="readable schedule metadata"
```

Expected: FAIL on the old 10.2–13.8px schedule declarations.

- [ ] **Step 3: Apply the approved schedule sizes and weights**

Update the relevant schedule rules in `src/App.css`:

```css
.schedule-meta {
  color: var(--slate-light-readable);
  font-size: 0.78rem;
  font-weight: 500;
}

.schedule-table thead {
  color: var(--slate-light-readable);
}

.schedule-table thead th {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.07em;
}

.schedule-time {
  font-size: 0.875rem;
  font-weight: 500;
}

.schedule-title-cell {
  color: var(--slate-light-readable);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.55;
}

.status-badge {
  font-size: 0.66rem;
  font-weight: 500;
}
```

Keep `.schedule-table tbody th` at `1rem` and weight `500`, and do not change the current table column widths or row padding.

- [ ] **Step 4: Run schedule and full tests**

Run:

```bash
npm test -- --testNamePattern="readable schedule metadata"
npm test
```

Expected: both commands PASS, including the existing 11-row schedule-content test.

- [ ] **Step 5: Commit the schedule improvements**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: improve workshop schedule readability"
```

### Task 3: Improve supporting content across Introduction, people, CFP, dates, and footer

**Files:**
- Modify: `src/App.css:548-581`
- Modify: `src/App.css:837-842`
- Modify: `src/App.css:958-965`
- Modify: `src/App.css:1021-1039`
- Modify: `src/App.css:1075-1168`
- Modify: `src/App.css:1220-1230`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Add a failing supporting-content typography test**

Add this test after the schedule typography test:

```ts
it('uses readable supporting copy for content, affiliations, dates, and footer', () => {
  const introBodyRule = appStyles.match(
    /\.intro-passage > p:last-child\s*\{([^}]*)\}/,
  )?.[1]
  const affiliationRule = appStyles.match(
    /\.person-card__copy p\s*\{([^}]*)\}/,
  )?.[1]
  const topicItemRule = appStyles.match(/\.topic-card li\s*\{([^}]*)\}/)?.[1]
  const submissionLabelRule = appStyles.match(
    /\.submission-panel__copy span\s*\{([^}]*)\}/,
  )?.[1]
  const submissionCopyRule = appStyles.match(
    /\.submission-panel__copy p\s*\{([^}]*)\}/,
  )?.[1]
  const detailCopyRule = appStyles.match(/\.detail-card > p\s*\{([^}]*)\}/)?.[1]
  const awardCountRule = appStyles.match(
    /\.detail-card--awards small\s*\{([^}]*)\}/,
  )?.[1]
  const dateLabelRule = appStyles.match(/\.detail-card dt\s*\{([^}]*)\}/)?.[1]
  const dateValueRule = appStyles.match(/\.detail-card dd\s*\{([^}]*)\}/)?.[1]
  const footerRule = appStyles.match(/\.site-footer__bottom\s*\{([^}]*)\}/)?.[1]

  expect(introBodyRule).toContain('color: var(--slate-readable);')
  expect(introBodyRule).toContain('font-size: 1rem;')
  expect(affiliationRule).toContain('color: var(--slate-readable);')
  expect(affiliationRule).toContain('font-size: 0.86rem;')
  expect(affiliationRule).toContain('font-weight: 500;')
  expect(topicItemRule).toContain('font-size: 0.95rem;')
  expect(submissionLabelRule).toContain('font-size: 0.69rem;')
  expect(submissionLabelRule).toContain('font-weight: 600;')
  expect(submissionCopyRule).toContain('font-size: 0.95rem;')
  expect(submissionCopyRule).toContain('line-height: 1.55;')
  expect(detailCopyRule).toContain('font-size: 0.9rem;')
  expect(awardCountRule).toContain('font-size: 0.78rem;')
  expect(dateLabelRule).toContain('font-size: 0.875rem;')
  expect(dateLabelRule).toContain('font-weight: 500;')
  expect(dateValueRule).toContain('font-size: 0.85rem;')
  expect(dateValueRule).toContain('font-weight: 500;')
  expect(footerRule).toContain('font-size: 0.72rem;')
  expect(footerRule).toContain('color: rgba(216, 233, 236, 0.68);')
})
```

- [ ] **Step 2: Update the existing CFP topic assertion and run the focused test**

In the existing test named `uses the approved left-aligned badge geometry and readable CFP topic text`, change:

```ts
expect(topicItemRule).toContain('font-size: 0.92rem;')
```

to:

```ts
expect(topicItemRule).toContain('font-size: 0.95rem;')
```

Then run:

```bash
npm test -- --testNamePattern="readable supporting copy"
```

Expected: FAIL because the approved supporting-content declarations have not been applied.

- [ ] **Step 3: Apply the approved light-section body and affiliation styles**

Update these rules in `src/App.css` while preserving their layout properties:

```css
.intro-passage > p:last-child {
  color: var(--slate-readable);
  font-size: 1rem;
  line-height: 1.75;
}

.person-card__copy p {
  color: var(--slate-readable);
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.5;
}
```

- [ ] **Step 4: Apply the approved CFP and submission styles**

Update these rules in `src/App.css`:

```css
.topic-card li {
  font-size: 0.95rem;
  line-height: 1.55;
}

.submission-panel__copy span {
  font-size: 0.69rem;
  font-weight: 600;
}

.submission-panel__copy p {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.55;
}

.detail-card > p {
  color: var(--slate-light-readable);
  font-size: 0.9rem;
  line-height: 1.65;
}
```

- [ ] **Step 5: Apply the approved award, important-date, and footer styles**

Update these rules in `src/App.css`:

```css
.detail-card--awards small {
  font-size: 0.78rem;
}

.detail-card dt {
  color: var(--slate-light-readable);
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-card dd {
  font-size: 0.85rem;
  font-weight: 500;
}

.site-footer__bottom {
  color: rgba(216, 233, 236, 0.68);
  font-size: 0.72rem;
}
```

Do not change the two-column `.cfp-details` layout or the existing single-column mobile date layout.

- [ ] **Step 6: Run supporting-content and full tests**

Run:

```bash
npm test -- --testNamePattern="readable supporting copy"
npm test
```

Expected: both commands PASS, including existing content, people-count, award, and affiliation assertions.

- [ ] **Step 7: Commit the supporting-content improvements**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: improve supporting content readability"
```

### Task 4: Validate responsive layout, accessibility, and production build

**Files:**
- Verify: `src/index.css`
- Verify: `src/App.css`
- Verify: `src/App.test.tsx`

- [ ] **Step 1: Run all automated checks**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests PASS, lint reports no errors, TypeScript completes successfully, and Vite writes a production bundle to `dist/` without missing-asset warnings.

- [ ] **Step 2: Start a production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite reports a local preview URL, normally `http://127.0.0.1:4173/`.

- [ ] **Step 3: Inspect the 1440px desktop viewport**

Verify:

- Hero date, time, and location are readable without zooming.
- Section leads are clearly stronger than ordinary body text but subordinate to headings.
- Schedule headers, times, talk titles, and status pills remain within their cells.
- Awards and Important Dates remain equal-width cards.
- No new isolated one-word lines appear in the Hero or CFP section leads.

- [ ] **Step 4: Inspect the 768px tablet viewport**

Verify:

- Navigation menu text remains at least 12.5px.
- Schedule cards have readable time, speaker/session, title, and status text.
- Speaker and organizer affiliations do not collide with card boundaries.
- Submission-detail cards wrap without overflow.

- [ ] **Step 5: Inspect the 390px mobile viewport**

Verify:

- Hero metadata remains one item per row.
- Long schedule titles and Important Dates wrap naturally.
- Buttons remain fully visible and do not clip their labels.
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

- [ ] **Step 6: Verify repository scope and final diff**

Run:

```bash
git diff --check
git status --short
git diff -- src/index.css src/App.css src/App.test.tsx
```

Expected: no whitespace errors; only the approved typography files and prior design/plan documentation are present. Do not push or publish until the user completes visual approval.
