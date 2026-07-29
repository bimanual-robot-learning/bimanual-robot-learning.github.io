# Awards Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current compact Awards card with the approved full-width showcase, move it directly after the CFP topics, and merge Submission Format with Important Dates into one practical-information panel.

**Architecture:** Keep `src/data/workshop.ts` as the typed source of truth, but represent award recipient counts and prize clarifications explicitly so the UI never needs multiplication notation or string parsing. Restructure only the CFP portion of `src/App.tsx`, then replace the obsolete detail-card CSS with scoped Awards and practical-panel styles. Preserve existing links, dates, submission copy, and component boundaries elsewhere.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, Testing Library, CSS

---

## File Structure

- Modify `src/data/workshop.ts`: make award count and prize clarification explicit typed fields.
- Modify `src/App.tsx`: reorder the CFP children, render the Awards showcase, and group submission guidance with dates.
- Modify `src/App.css`: implement the approved navy Awards stage, equal award cards, sponsor treatment, merged practical panel, and responsive stacking.
- Modify `src/App.test.tsx`: test information order, award semantics, sponsor attribution, merged-panel structure, and key responsive CSS contracts.

### Task 1: Lock the Approved CFP Structure in Tests

**Files:**
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace the existing broad award assertions with focused structure tests**

Add these tests immediately after the existing CFP topic/submission test:

```tsx
it('places awards directly after the CFP topics and before practical information', () => {
  render(<App />)

  const topicCards = screen.getAllByTestId('topic-card')
  const topicGrid = topicCards[0].parentElement
  const awardsShowcase = screen.getByTestId('awards-showcase')
  const practicalPanel = screen.getByTestId('cfp-practical')

  expect(topicGrid).not.toBeNull()
  expect(topicGrid?.nextElementSibling).toBe(awardsShowcase)
  expect(awardsShowcase.nextElementSibling).toBe(practicalPanel)
  expect(within(practicalPanel).getByTestId('submission-panel')).toBeInTheDocument()
  expect(
    within(practicalPanel).getByRole('heading', { name: 'Important Dates' }),
  ).toBeInTheDocument()
})

it('presents award recipients and per-paper prizes without multiplication notation', () => {
  render(<App />)

  const awardsShowcase = screen.getByTestId('awards-showcase')
  const awardItems = within(awardsShowcase).getAllByTestId('award-item')

  expect(awardItems).toHaveLength(2)
  expect(
    within(awardItems[0]).getByRole('heading', {
      name: 'Best Workshop Paper Award',
    }),
  ).toBeInTheDocument()
  expect(within(awardItems[0]).getByText('1')).toBeInTheDocument()
  expect(within(awardItems[0]).getByText('Selected paper')).toBeInTheDocument()
  expect(within(awardItems[0]).getByText('USD 1,000')).toBeInTheDocument()
  expect(
    within(awardItems[0]).getByText('For the selected paper'),
  ).toBeInTheDocument()

  expect(
    within(awardItems[1]).getByRole('heading', {
      name: 'Outstanding Workshop Paper Award',
    }),
  ).toBeInTheDocument()
  expect(within(awardItems[1]).getByText('3')).toBeInTheDocument()
  expect(within(awardItems[1]).getByText('Selected papers')).toBeInTheDocument()
  expect(within(awardItems[1]).getByText('USD 500')).toBeInTheDocument()
  expect(within(awardItems[1]).getByText('For each paper')).toBeInTheDocument()

  expect(awardsShowcase).not.toHaveTextContent('×')
  expect(awardsShowcase).not.toHaveTextContent('X 3')
})

it('features PrimeBot below the Awards heading with a safe sponsor link', () => {
  render(<App />)

  const awardsShowcase = screen.getByTestId('awards-showcase')
  const awardsHeading = within(awardsShowcase).getByRole('heading', {
    name: 'Awards',
  })
  const sponsorLine = within(awardsShowcase).getByTestId('award-sponsor')
  const sponsorLink = within(sponsorLine).getByRole('link', { name: 'PrimeBot' })

  expect(awardsHeading.compareDocumentPosition(sponsorLine)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  )
  expect(sponsorLink).toHaveAttribute('href', 'https://www.primebot.cn/')
  expect(sponsorLink).toHaveAttribute('target', '_blank')
  expect(sponsorLink).toHaveAttribute('rel', 'noreferrer')
})
```

In the existing test named `gives CFP topics equal emphasis and highlights
submission and award details`, remove only the old `awardItems` assertions. Keep
the topic and submission-guideline assertions in that test.

- [ ] **Step 2: Run the new tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because `awards-showcase` and `cfp-practical` do not yet exist and
the current award markup lacks recipient-first labels.

- [ ] **Step 3: Commit the failing tests**

```bash
git add src/App.test.tsx
git commit -m "test: define awards showcase behavior"
```

### Task 2: Implement Typed Award Content and CFP Markup

**Files:**
- Modify: `src/data/workshop.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Make recipient counts and prize clarifications explicit**

Replace `AwardItem` with:

```ts
export interface AwardItem {
  name: string
  recipientCount: number
  prize: string
  prizeClarification: string
}
```

Replace the two award entries with:

```ts
export const awards: AwardItem[] = [
  {
    name: 'Best Workshop Paper Award',
    recipientCount: 1,
    prize: 'USD 1,000',
    prizeClarification: 'For the selected paper',
  },
  {
    name: 'Outstanding Workshop Paper Award',
    recipientCount: 3,
    prize: 'USD 500',
    prizeClarification: 'For each paper',
  },
]
```

- [ ] **Step 2: Replace the CFP markup with the approved information order**

In `src/App.tsx`, remove `Award` from the `lucide-react` imports. Keep
`CalendarDays` and `FileText`.

Immediately after `.topic-grid`, render this Awards showcase:

```tsx
<section
  className="awards-showcase"
  aria-labelledby="awards-title"
  data-testid="awards-showcase"
>
  <div className="awards-showcase__grid" aria-hidden="true" />
  <header className="awards-showcase__heading">
    <p className="eyebrow">Recognition — IROS 2026 Workshop</p>
    <h3 id="awards-title">Awards</h3>
    <p className="awards-showcase__sponsor" data-testid="award-sponsor">
      Sponsored by{' '}
      <a href={sponsor.url} target="_blank" rel="noreferrer">
        {sponsor.name}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </p>
  </header>

  <div className="award-grid">
    {awards.map((award) => {
      const isSingleRecipient = award.recipientCount === 1

      return (
        <article className="award-card" data-testid="award-item" key={award.name}>
          <h4>{award.name}</h4>
          <div className="award-card__breakdown">
            <div className="award-card__recipients">
              <strong>{award.recipientCount}</strong>
              <span>Selected {isSingleRecipient ? 'paper' : 'papers'}</span>
            </div>
            <div className="award-card__prize">
              <b>{award.prize}</b>
              <small>{award.prizeClarification}</small>
            </div>
          </div>
        </article>
      )
    })}
  </div>
</section>
```

Replace the current standalone `.submission-panel` and `.cfp-details` blocks
with one practical-information wrapper:

```tsx
<section className="cfp-practical" data-testid="cfp-practical">
  <section
    className="submission-panel"
    aria-labelledby="submission-title"
    data-testid="submission-panel"
  >
    <header className="submission-panel__header">
      <div className="submission-panel__icon" aria-hidden="true">
        <FileText />
      </div>
      <div>
        <p className="eyebrow">{submission.eyebrow}</p>
        <h3 id="submission-title">{submission.title}</h3>
        <p className="submission-panel__intro">{submission.introduction}</p>
      </div>
      <a
        className="button button--orange"
        href={workshopMeta.openReviewUrl}
        target="_blank"
        rel="noreferrer"
      >
        Submit your work
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </header>

    <ul className="submission-guidelines" aria-label="Submission requirements">
      {submission.guidelines.map((guideline) => (
        <li
          className="submission-guideline"
          data-testid="submission-guideline"
          key={guideline.label}
        >
          <h4>{guideline.label}</h4>
          <p>
            {guideline.prefix}
            {guideline.link && (
              <a
                href={guideline.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {guideline.link.label}
              </a>
            )}
            {guideline.suffix}
          </p>
        </li>
      ))}
    </ul>

    <div className="submission-presentation">
      <span>At the workshop</span>
      <p>{submission.presentation}</p>
    </div>
  </section>

  <aside className="important-dates" aria-labelledby="dates-title">
    <div className="important-dates__heading">
      <CalendarDays aria-hidden="true" />
      <div>
        <p className="eyebrow">Mark your calendar</p>
        <h3 id="dates-title">Important Dates</h3>
      </div>
    </div>
    <dl>
      {importantDates.map((date) => (
        <div key={date.label}>
          <dt>{date.label}</dt>
          <dd>{date.value}</dd>
        </div>
      ))}
    </dl>
  </aside>
</section>
```

- [ ] **Step 3: Run the focused test and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: the new structure/content tests pass. Style-contract tests may still
fail until Task 3 only if they were deliberately updated there.

- [ ] **Step 4: Commit the typed content and markup**

```bash
git add src/data/workshop.ts src/App.tsx
git commit -m "feat: add prominent awards showcase"
```

### Task 3: Define the Visual and Responsive Contracts

**Files:**
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace obsolete detail-card typography assertions**

In `uses readable supporting copy for content, affiliations, dates, and footer`,
remove the selectors and assertions for `.detail-card > p`,
`.detail-card--awards small`, `.detail-card dt`, and `.detail-card dd`.
Replace them with:

```tsx
const sponsorRule = appStyles.match(
  /\.awards-showcase__sponsor a\s*\{([^}]*)\}/,
)?.[1]
const awardNameRule = appStyles.match(/\.award-card h4\s*\{([^}]*)\}/)?.[1]
const awardCountRule = appStyles.match(
  /\.award-card__recipients strong\s*\{([^}]*)\}/,
)?.[1]
const awardPrizeRule = appStyles.match(
  /\.award-card__prize b\s*\{([^}]*)\}/,
)?.[1]
const dateLabelRule = appStyles.match(/\.important-dates dt\s*\{([^}]*)\}/)?.[1]
const dateValueRule = appStyles.match(/\.important-dates dd\s*\{([^}]*)\}/)?.[1]
```

Add these assertions in the same test:

```tsx
expect(sponsorRule).toContain('color: var(--orange);')
expect(sponsorRule).toContain('font-size: clamp(1.25rem, 2.2vw, 1.7rem);')
expect(awardNameRule).toContain('font-size: clamp(1.15rem, 1.8vw, 1.45rem);')
expect(awardCountRule).toContain('color: var(--cyan);')
expect(awardCountRule).toContain('font-size: clamp(3.1rem, 5vw, 4.25rem);')
expect(awardPrizeRule).toContain('color: var(--orange-soft);')
expect(awardPrizeRule).toContain('font-size: clamp(2.15rem, 3.8vw, 3.25rem);')
expect(dateLabelRule).toContain('color: var(--slate-readable);')
expect(dateValueRule).toContain('color: var(--ink-950);')
```

- [ ] **Step 2: Add a dedicated layout contract test**

```tsx
it('uses equal award columns and responsive practical-information layouts', () => {
  const awardGridRule = appStyles.match(/\.award-grid\s*\{([^}]*)\}/)?.[1]
  const awardBreakdownRule = appStyles.match(
    /\.award-card__breakdown\s*\{([^}]*)\}/,
  )?.[1]
  const practicalRule = appStyles.match(/\.cfp-practical\s*\{([^}]*)\}/)?.[1]
  const tabletStart = appStyles.indexOf('@media (max-width: 920px)')
  const mobileStart = appStyles.indexOf('@media (max-width: 720px)')
  const compactStart = appStyles.indexOf('@media (max-width: 480px)', mobileStart)
  const tabletMedia = appStyles.slice(tabletStart, mobileStart)
  const mobileMedia = appStyles.slice(mobileStart, compactStart)
  const tabletPracticalRule = tabletMedia.match(
    /\.cfp-practical\s*\{([^}]*)\}/,
  )?.[1]
  const mobileAwardGridRule = mobileMedia.match(
    /\.award-grid\s*\{([^}]*)\}/,
  )?.[1]

  expect(awardGridRule).toContain(
    'grid-template-columns: repeat(2, minmax(0, 1fr));',
  )
  expect(awardBreakdownRule).toContain(
    'grid-template-columns: minmax(76px, 0.62fr) minmax(0, 1.38fr);',
  )
  expect(practicalRule).toContain(
    'grid-template-columns: minmax(0, 1.5fr) minmax(270px, 0.5fr);',
  )
  expect(tabletPracticalRule).toContain('grid-template-columns: 1fr;')
  expect(mobileAwardGridRule).toContain('grid-template-columns: 1fr;')
})
```

- [ ] **Step 3: Run the tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because the new Awards and practical-panel CSS selectors do not
exist yet.

- [ ] **Step 4: Commit the failing CSS contract tests**

```bash
git add src/App.test.tsx
git commit -m "test: define awards visual contracts"
```

### Task 4: Implement Awards and Practical-Panel Styling

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Replace obsolete detail-card styles**

Remove `.cfp-details`, `.detail-card`, `.detail-card__heading`, and their
Awards/date descendant rules. Add the following scoped styling after the topic
card rules and before the submission guideline rules:

```css
.awards-showcase {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(34px, 5vw, 54px);
  margin-bottom: 28px;
  background:
    radial-gradient(circle at 86% 12%, rgba(255, 125, 79, 0.18), transparent 31%),
    linear-gradient(132deg, var(--ink-950), #102a3e);
  border: 1px solid rgba(82, 216, 230, 0.2);
  border-radius: 7px;
}

.awards-showcase__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.18;
  background-image:
    linear-gradient(rgba(82, 216, 230, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(82, 216, 230, 0.2) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(90deg, #000, transparent 78%);
}

.awards-showcase__heading {
  margin-bottom: 30px;
}

.awards-showcase__heading > .eyebrow {
  color: var(--cyan);
}

.awards-showcase__heading h3 {
  margin: 7px 0 11px;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 1;
}

.awards-showcase__sponsor {
  display: inline-flex;
  margin: 0;
  align-items: baseline;
  gap: 7px;
  color: var(--slate-light-readable);
  font-size: 0.95rem;
  font-weight: 600;
}

.awards-showcase__sponsor a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--orange);
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.2vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  text-decoration: none;
}

.award-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.award-card {
  display: flex;
  min-height: 236px;
  padding: clamp(23px, 3vw, 31px);
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.17);
  border-radius: 7px;
}

.award-card:first-child {
  box-shadow: inset 0 3px 0 var(--orange);
}

.award-card:last-child {
  box-shadow: inset 0 3px 0 var(--cyan);
}

.award-card h4 {
  max-width: 440px;
  margin: 0;
  color: var(--white);
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 1.8vw, 1.45rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
  text-wrap: balance;
}

.award-card__breakdown {
  display: grid;
  margin-top: 32px;
  align-items: end;
  grid-template-columns: minmax(76px, 0.62fr) minmax(0, 1.38fr);
  gap: clamp(16px, 2.2vw, 24px);
}

.award-card__recipients strong {
  display: block;
  color: var(--cyan);
  font-family: var(--font-display);
  font-size: clamp(3.1rem, 5vw, 4.25rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.78;
}

.award-card__recipients span,
.award-card__prize small {
  display: block;
  margin-top: 10px;
  color: var(--slate-light-readable);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.35;
  text-transform: uppercase;
}

.award-card__prize {
  min-width: 0;
  padding-left: clamp(16px, 2.2vw, 24px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.award-card__prize b {
  display: block;
  color: var(--orange-soft);
  font-family: var(--font-display);
  font-size: clamp(2.15rem, 3.8vw, 3.25rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 0.95;
  white-space: nowrap;
}

.cfp-practical {
  display: grid;
  overflow: hidden;
  color: var(--ink-950);
  background: var(--paper);
  border-radius: 7px;
  grid-template-columns: minmax(0, 1.5fr) minmax(270px, 0.5fr);
}

.submission-panel {
  margin: 0;
  overflow: visible;
  color: var(--ink-950);
  background: transparent;
  border-radius: 0;
}

.important-dates {
  padding: 30px;
  background: rgba(7, 16, 29, 0.035);
  border-left: 1px solid rgba(8, 25, 43, 0.1);
}

.important-dates__heading {
  display: flex;
  margin-bottom: 24px;
  align-items: center;
  gap: 14px;
}

.important-dates__heading > svg {
  color: var(--orange);
}

.important-dates__heading .eyebrow {
  color: var(--slate-readable);
}

.important-dates h3 {
  margin: 3px 0 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: -0.025em;
}

.important-dates dl {
  margin: 0;
}

.important-dates dl > div {
  padding: 15px 0;
  border-top: 1px solid rgba(8, 25, 43, 0.11);
}

.important-dates dt {
  color: var(--slate-readable);
  font-size: 0.875rem;
  font-weight: 600;
}

.important-dates dd {
  margin: 6px 0 0;
  color: var(--ink-950);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.5;
}
```

- [ ] **Step 2: Add tablet and mobile behavior**

Inside `@media (max-width: 920px)`, replace the old `.cfp-details` rule with:

```css
.cfp-practical {
  grid-template-columns: 1fr;
}

.important-dates {
  border-top: 1px solid rgba(8, 25, 43, 0.1);
  border-left: 0;
}
```

Inside `@media (max-width: 720px)`, add:

```css
.award-grid {
  grid-template-columns: 1fr;
}

.award-card {
  min-height: 220px;
}
```

Inside `@media (max-width: 480px)`, remove the obsolete `.detail-card` date
rules and add:

```css
.awards-showcase {
  padding: 26px 22px;
}

.awards-showcase__sponsor {
  align-items: flex-start;
  flex-direction: column;
  gap: 3px;
}

.award-card {
  min-height: 210px;
  padding: 22px;
}

.award-card__breakdown {
  grid-template-columns: minmax(68px, 0.55fr) minmax(0, 1.45fr);
  gap: 15px;
}

.award-card__prize {
  padding-left: 15px;
}

.important-dates {
  padding: 24px 22px;
}
```

- [ ] **Step 3: Run the focused tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS, 20 tests total.

- [ ] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS with no errors or warnings.

- [ ] **Step 5: Commit the styling**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: feature awards and sponsor"
```

### Task 5: Build and Perform Responsive Visual Verification

**Files:**
- Modify only if verification exposes a defect: `src/App.css`, `src/App.tsx`, or `src/App.test.tsx`

- [ ] **Step 1: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS, 20 tests total.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite complete successfully and produce `dist/`.

- [ ] **Step 3: Start the production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite prints a local preview URL.

- [ ] **Step 4: Inspect desktop, tablet, and mobile layouts**

At viewport widths 1440, 768, and 390 pixels, verify:

- Awards follows the topics and precedes the practical panel.
- Both award cards are equal width at 1440 and 768.
- Award cards stack at 390.
- PrimeBot appears below the Awards heading in orange.
- Recipient counts and amounts remain readable without collision.
- Submission Format and Important Dates share one outer panel and stack at 768
  and 390.
- `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
  is true at all three viewport widths.

- [ ] **Step 5: Run keyboard and reduced-motion checks**

Verify that:

- The PrimeBot and OpenReview links receive visible focus.
- Heading order remains logical.
- Enabling `prefers-reduced-motion: reduce` introduces no new animation.

- [ ] **Step 6: Commit any verification fixes**

If no fixes were required, skip this commit. Otherwise:

```bash
git add src/App.css src/App.tsx src/App.test.tsx
git commit -m "fix: refine responsive awards layout"
```

- [ ] **Step 7: Record final evidence**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: no tracked changes remain, and the task commits are visible on
`feat/awards-redesign`.
