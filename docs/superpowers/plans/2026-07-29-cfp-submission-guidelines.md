# CFP Submission Guidelines Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compact CFP submission summary with a clear, type-safe guidance card covering review, IEEE format, length, appendices, presentation, and the existing OpenReview action.

**Architecture:** Store all editable guidance copy and link metadata in `src/data/workshop.ts`. Render that data as one semantic guidance card in `src/App.tsx`, then apply the approved two-by-two desktop and single-column mobile treatment in `src/App.css`. Extend the existing Vitest and Testing Library suite to protect content, external-link safety, readability, and responsive layout.

**Tech Stack:** Vite 8, React 19, TypeScript 6, CSS, Vitest, Testing Library, oxlint

---

## File Structure

- Modify `src/data/workshop.ts`: define the submission guidance interfaces and the complete editable content model.
- Modify `src/App.tsx`: render the structured guidance card, four semantic rules, presentation band, and OpenReview action.
- Modify `src/App.css`: replace the old compact panel styles with the approved responsive card treatment.
- Modify `src/App.test.tsx`: verify content, destinations, external-link safety, visual hierarchy declarations, and desktop/mobile grid behavior.

No new component file is needed because the CFP section is already owned by `App.tsx`, and this feature adds one focused data-driven block rather than a reusable site-wide component.

### Task 1: Add the complete type-safe submission content and semantic markup

**Files:**
- Modify: `src/App.test.tsx:248-269`
- Modify: `src/data/workshop.ts:44-48,275-280`
- Modify: `src/App.tsx:361-388`

- [ ] **Step 1: Write the failing submission-content test**

Replace the current two-highlight assertion in the CFP test with the four-rule assertion:

```tsx
const submissionGuidelines = screen.getAllByTestId('submission-guideline')
expect(submissionGuidelines).toHaveLength(4)
expect(
  within(submissionGuidelines[0]).getByRole('heading', { name: 'Review' }),
).toBeInTheDocument()
expect(
  within(submissionGuidelines[1]).getByRole('heading', { name: 'Format' }),
).toBeInTheDocument()
expect(
  within(submissionGuidelines[2]).getByRole('heading', { name: 'Length' }),
).toBeInTheDocument()
expect(
  within(submissionGuidelines[3]).getByRole('heading', { name: 'Appendices' }),
).toBeInTheDocument()
```

Add this dedicated behavior test immediately after the CFP topics and awards test:

```tsx
it('presents complete submission guidance with safe IEEE and OpenReview links', () => {
  render(<App />)

  const panel = screen.getByTestId('submission-panel')
  expect(
    within(panel).getByRole('heading', {
      name: 'Short papers & extended abstracts',
    }),
  ).toBeInTheDocument()
  expect(
    within(panel).getByText(
      'We welcome short papers and extended abstracts describing ongoing or completed work.',
    ),
  ).toBeInTheDocument()

  const guidelines = within(panel).getAllByTestId('submission-guideline')
  expect(guidelines).toHaveLength(4)
  expect(guidelines[0]).toHaveTextContent(
    'Submissions will undergo double-blind review. Authors must anonymize their manuscripts.',
  )
  expect(guidelines[1]).toHaveTextContent(
    'Use the standard IEEE conference paper format.',
  )
  expect(guidelines[2]).toHaveTextContent(
    'Submissions must not exceed 4 pages, excluding references.',
  )
  expect(guidelines[3]).toHaveTextContent(
    'To keep submissions concise and consistent, we kindly ask authors not to include appendices.',
  )

  const ieeeLink = within(panel).getByRole('link', {
    name: 'standard IEEE conference paper format',
  })
  expect(ieeeLink).toHaveAttribute(
    'href',
    'https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/authoring-tools-and-templates/',
  )
  expect(ieeeLink).toHaveAttribute('target', '_blank')
  expect(ieeeLink).toHaveAttribute('rel', 'noreferrer')

  expect(
    within(panel).getByText(
      'Accepted submissions will be presented as posters, with a subset selected for spotlight talks.',
    ),
  ).toBeInTheDocument()

  const submitLink = within(panel).getByRole('link', { name: /submit your work/i })
  expect(submitLink).toHaveAttribute(
    'href',
    'https://openreview.net/group?id=IEEE.org%2FIROS%2F2026%2FWorkshop%2FBimanual_Manipulation',
  )
  expect(submitLink).toHaveAttribute('target', '_blank')
  expect(submitLink).toHaveAttribute('rel', 'noreferrer')
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "submission"
```

Expected: FAIL because `submission-panel`, the four `submission-guideline` items, and the new copy do not yet exist in the required structure.

- [ ] **Step 3: Add the submission content interfaces and data**

Add these interfaces after `AwardItem` in `src/data/workshop.ts`:

```ts
export type SubmissionGuidelineLabel =
  | 'Review'
  | 'Format'
  | 'Length'
  | 'Appendices'

export interface SubmissionGuideline {
  label: SubmissionGuidelineLabel
  prefix: string
  link?: {
    label: string
    href: string
  }
  suffix: string
}

export interface SubmissionInfo {
  eyebrow: string
  title: string
  introduction: string
  guidelines: SubmissionGuideline[]
  presentation: string
}
```

Replace the existing `submission` constant with:

```ts
export const submission: SubmissionInfo = {
  eyebrow: 'Submission format',
  title: 'Short papers & extended abstracts',
  introduction:
    'We welcome short papers and extended abstracts describing ongoing or completed work.',
  guidelines: [
    {
      label: 'Review',
      prefix:
        'Submissions will undergo double-blind review. Authors must anonymize their manuscripts.',
      suffix: '',
    },
    {
      label: 'Format',
      prefix: 'Use the ',
      link: {
        label: 'standard IEEE conference paper format',
        href: 'https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/authoring-tools-and-templates/',
      },
      suffix: '.',
    },
    {
      label: 'Length',
      prefix: 'Submissions must not exceed 4 pages, excluding references.',
      suffix: '',
    },
    {
      label: 'Appendices',
      prefix:
        'To keep submissions concise and consistent, we kindly ask authors not to include appendices.',
      suffix: '',
    },
  ],
  presentation:
    'Accepted submissions will be presented as posters, with a subset selected for spotlight talks.',
}
```

- [ ] **Step 4: Replace the old panel with semantic data-driven markup**

Replace `src/App.tsx:361-388` with:

```tsx
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
            <a href={guideline.link.href} target="_blank" rel="noreferrer">
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
```

- [ ] **Step 5: Run the focused test and confirm it passes**

Run:

```bash
npm test -- --run src/App.test.tsx -t "submission"
```

Expected: PASS for both submission-related tests.

- [ ] **Step 6: Run the complete test file**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: all tests in `src/App.test.tsx` PASS. If the old supporting-copy CSS assertions fail because their selectors were removed from the DOM contract, leave those assertions for Task 2 and continue only after confirming every non-CSS assertion passes.

- [ ] **Step 7: Commit the content and semantic structure**

```bash
git add src/App.test.tsx src/data/workshop.ts src/App.tsx
git commit -m "feat: add CFP submission guidelines"
```

### Task 2: Apply the approved responsive guidance-card treatment

**Files:**
- Modify: `src/App.test.tsx:170-217`
- Modify: `src/App.css:986-1059,1289-1296,1400-1408,1605-1621`

- [ ] **Step 1: Update the CSS regression assertions**

In the readable supporting-copy test, replace the old `submission-panel__copy` selector variables and assertions with:

```tsx
const submissionIntroRule = appStyles.match(
  /\.submission-panel__intro\s*\{([^}]*)\}/,
)?.[1]
const submissionLabelRule = appStyles.match(
  /\.submission-guideline h4\s*\{([^}]*)\}/,
)?.[1]
const submissionCopyRule = appStyles.match(
  /\.submission-guideline p\s*\{([^}]*)\}/,
)?.[1]
const presentationCopyRule = appStyles.match(
  /\.submission-presentation p\s*\{([^}]*)\}/,
)?.[1]
```

Use these assertions:

```tsx
expect(submissionIntroRule).toContain('color: var(--slate-readable);')
expect(submissionIntroRule).toContain('font-size: 1rem;')
expect(submissionIntroRule).toContain('font-weight: 500;')
expect(submissionIntroRule).toContain('line-height: 1.65;')
expect(submissionLabelRule).toContain('font-size: 0.75rem;')
expect(submissionLabelRule).toContain('font-weight: 700;')
expect(submissionCopyRule).toContain('font-size: 0.96rem;')
expect(submissionCopyRule).toContain('font-weight: 500;')
expect(submissionCopyRule).toContain('line-height: 1.65;')
expect(presentationCopyRule).toContain('font-size: 1rem;')
expect(presentationCopyRule).toContain('font-weight: 600;')
expect(presentationCopyRule).toContain('line-height: 1.55;')
```

Add a responsive-layout test:

```tsx
it('uses a two-column submission grid that stacks on mobile', () => {
  const desktopGridRule = appStyles.match(
    /\.submission-guidelines\s*\{([^}]*)\}/,
  )?.[1]
  const mobileMedia = appStyles.match(
    /@media \(max-width: 720px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 480px\)/,
  )?.[1]
  const mobileGridRule = mobileMedia?.match(
    /\.submission-guidelines\s*\{([^}]*)\}/,
  )?.[1]

  expect(desktopGridRule).toContain(
    'grid-template-columns: repeat(2, minmax(0, 1fr));',
  )
  expect(mobileGridRule).toContain('grid-template-columns: 1fr;')
})
```

- [ ] **Step 2: Run the CSS-focused tests to verify they fail**

Run:

```bash
npm test -- --run src/App.test.tsx -t "supporting copy|submission grid"
```

Expected: FAIL because the new selectors and mobile grid rule are not yet defined.

- [ ] **Step 3: Replace the old submission panel styles**

Replace the current `.submission-panel` through `.submission-panel__copy p` block in `src/App.css` with:

```css
.submission-panel {
  margin: 14px 0 28px;
  overflow: hidden;
  color: var(--ink-950);
  background: var(--paper);
  border-radius: 7px;
}

.submission-panel__header {
  display: grid;
  padding: 30px;
  align-items: center;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 22px;
}

.submission-panel__icon {
  display: flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  color: var(--cyan-deep);
  background: rgba(82, 216, 230, 0.16);
  border-radius: 50%;
}

.submission-panel h3 {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 1.45rem;
  letter-spacing: -0.025em;
}

.submission-panel__intro {
  max-width: 680px;
  margin: 9px 0 0;
  color: var(--slate-readable);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.65;
  text-wrap: pretty;
}

.submission-guidelines {
  display: grid;
  padding: 0 30px 30px;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  list-style: none;
}

.submission-guideline {
  padding: 20px;
  background: rgba(7, 16, 29, 0.045);
  border: 1px solid rgba(8, 25, 43, 0.09);
  border-radius: 5px;
}

.submission-guideline h4 {
  margin: 0 0 10px;
  color: var(--cyan-deep);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.submission-guideline p {
  margin: 0;
  color: var(--ink-800);
  font-size: 0.96rem;
  font-weight: 500;
  line-height: 1.65;
  text-wrap: pretty;
}

.submission-guideline a {
  color: var(--ink-950);
  font-weight: 700;
  text-decoration-color: var(--cyan-deep);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.submission-presentation {
  display: grid;
  margin: 0 30px 30px;
  padding: 18px 20px;
  align-items: start;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  background: rgba(82, 216, 230, 0.13);
  border-left: 3px solid var(--cyan-deep);
  border-radius: 5px;
}

.submission-presentation span {
  padding-top: 3px;
  color: var(--cyan-deep);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.submission-presentation p {
  margin: 0;
  color: var(--ink-900);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.55;
  text-wrap: pretty;
}
```

- [ ] **Step 4: Update the 1120px and 920px header behavior**

Replace the old `.submission-panel` rules in the 1120px media query with:

```css
.submission-panel__header {
  grid-template-columns: auto minmax(0, 1fr);
}

.submission-panel__header .button {
  grid-column: 2;
  justify-self: start;
}
```

Remove the old submission panel rules from the 920px media query. The 1120px treatment remains appropriate through tablet widths.

- [ ] **Step 5: Add the 720px mobile stacking behavior**

Inside the existing `@media (max-width: 720px)` block, after `.cfp-intro`, add:

```css
.submission-panel__header {
  grid-template-columns: auto minmax(0, 1fr);
}

.submission-panel__header .button {
  grid-column: 1 / -1;
}

.submission-guidelines {
  grid-template-columns: 1fr;
}

.submission-presentation {
  grid-template-columns: 1fr;
  gap: 6px;
}
```

- [ ] **Step 6: Replace the old 480px submission rules**

Replace the old `.submission-panel`, `.submission-panel__copy`, and submission button rules in the 480px media query with:

```css
.submission-panel__header {
  padding: 22px;
  grid-template-columns: 1fr;
}

.submission-panel__header .button {
  grid-column: 1;
}

.submission-guidelines {
  padding: 0 22px 22px;
}

.submission-presentation {
  margin: 0 22px 22px;
}
```

The existing global 480px `.button { width: 100%; }` rule makes the OpenReview action full width without a CFP-specific duplicate.

- [ ] **Step 7: Run the CSS-focused tests and confirm they pass**

Run:

```bash
npm test -- --run src/App.test.tsx -t "supporting copy|submission grid"
```

Expected: PASS for both CSS-focused tests.

- [ ] **Step 8: Run the complete test suite**

Run:

```bash
npm test -- --run
```

Expected: all test files and tests PASS.

- [ ] **Step 9: Commit the responsive visual treatment**

```bash
git add src/App.test.tsx src/App.css
git commit -m "style: clarify CFP submission guidance"
```

### Task 3: Verify production behavior and visual quality

**Files:**
- Verify: `src/data/workshop.ts`
- Verify: `src/App.tsx`
- Verify: `src/App.css`
- Verify: `src/App.test.tsx`

- [ ] **Step 1: Run static and production verification**

Run:

```bash
npm test -- --run
npm run lint
npm run build
git diff --check main...HEAD
```

Expected:

- all Vitest tests PASS;
- oxlint reports no errors;
- TypeScript and Vite complete the production build successfully;
- `git diff --check` prints no whitespace errors.

- [ ] **Step 2: Start the production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite reports a local preview URL and serves the production build.

- [ ] **Step 3: Inspect the CFP section at 1440px**

Open the preview at `#call-for-papers` with a 1440px-wide viewport and verify:

- the light submission card appears between the topic cards and Awards/Important Dates;
- the header, introduction, and orange OpenReview button have a clear hierarchy;
- Review, Format, Length, and Appendices form a balanced two-by-two grid;
- the presentation statement reads as one prominent cyan-accented band;
- the IEEE link is visibly recognizable and receives a visible keyboard focus state;
- no content clips or overflows horizontally.

- [ ] **Step 4: Inspect the CFP section at 768px**

Use a 768px-wide viewport and verify:

- the rule tiles remain balanced and readable;
- the header and OpenReview button wrap without crowding;
- the IEEE link and all four requirements remain easy to scan;
- Awards and Important Dates retain their existing layout behavior;
- no page-level horizontal overflow appears.

- [ ] **Step 5: Inspect the CFP section at 390px**

Use a 390px-wide viewport and verify:

- the card header is a single column;
- the OpenReview button spans the available width;
- the four rule tiles form one column in the required order;
- the presentation band stacks its label above its sentence;
- no isolated one-word line, clipped focus ring, or horizontal overflow appears.

- [ ] **Step 6: Check keyboard and external-link behavior**

Starting before the CFP section, use the keyboard to tab through the OpenReview portal link, IEEE format link, submission button, PrimeBot link, and following controls. Verify each focus indicator is visible. Activate the IEEE and OpenReview links and confirm they target the configured external destinations in new tabs.

- [ ] **Step 7: Confirm the branch is ready for user review**

Run:

```bash
git status --short --branch
git log --oneline main..HEAD
```

Expected: the worktree is clean, the branch is `feature/cfp-submission-guidelines`, and the log contains the design commit plus the content and style commits. Do not push, merge, or publish during this task.
