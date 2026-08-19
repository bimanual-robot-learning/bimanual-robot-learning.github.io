# Challenge Evaluation Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the Online and Real-Robot Evaluation instructions with safe inline links, expose the open Google Form as a primary homepage resource, and distinguish submission availability from the August 25 evaluation start.

**Architecture:** Evaluation copy remains in the typed workshop configuration, represented as text/link segments rather than JSX. A small shared `ChallengeStageDescription` component renders those segments identically on the workshop homepage and Challenge Hub, while each page stylesheet owns the link treatment appropriate to its background.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS.

---

### Task 1: Model the approved evaluation content and resource state

**Files:**
- Modify: `src/data/workshop.ts`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing typed-content assertions**

Update the expected `challenge.stages`, the August 25 milestone, and the third resource in `src/App.test.tsx` so they require:

```ts
const googleFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdrc5k91kazH9BLEjY17xCQ1KqAPVjmwPp5y21TT0GXQgpyKw/viewform?usp=publish-editor'
const datasetUrl =
  'https://huggingface.co/datasets/challenge-2026/challenge_data'

expect(challenge.stages[0]).toEqual({
  step: '01',
  title: 'Online Evaluation',
  descriptionSegments: [
    { text: 'Submit action predictions for the validation set through the ' },
    { text: 'Google Form', url: googleFormUrl },
    {
      text: '. Based on the online evaluation results, up to five top-performing teams will advance to the real-robot evaluation.',
    },
  ],
})

expect(challenge.stages[1]).toEqual({
  step: '02',
  title: 'Real-Robot Evaluation',
  descriptionSegments: [
    {
      text: 'Shortlisted teams will submit a Docker image containing their trained model. The image must be built from the base Docker image available in the ',
    },
    { text: 'Challenge Dataset repository', url: datasetUrl },
    {
      text: '. PrimeBot will deploy and evaluate the submitted models on real robots across the designated household manipulation tasks.',
    },
  ],
})

expect(challenge.timeline[2].label).toBe('Online Evaluation Begins')
expect(challenge.resources[2]).toEqual({
  label: 'Submit Predictions',
  status: 'available',
  url: googleFormUrl,
  external: true,
})
```

- [ ] **Step 2: Run the data test and verify RED**

Run: `npm test -- src/App.test.tsx`

Expected: failures show that stage descriptions are still strings, the milestone says `Opens`, and the Evaluation Portal is still coming soon.

- [ ] **Step 3: Implement the typed configuration**

Add:

```ts
export interface ChallengeDescriptionSegment {
  text: string
  url?: `https://${string}`
}

export interface ChallengeStage {
  step: string
  title: string
  descriptionSegments: ChallengeDescriptionSegment[]
}
```

Replace both stage descriptions with the exact arrays from Step 1. Change only the August 25 milestone label to `Online Evaluation Begins`. Replace the third resource with the exact `Submit Predictions` external resource from Step 1.

- [ ] **Step 4: Confirm the structured content is correct while the page tests remain RED**

Run: `npm test -- src/App.test.tsx`

Expected: the new content assertions pass, while the existing page-rendering assertions remain RED because the components still read the removed `description` property. Do not commit this intentionally incomplete state; continue directly to Task 2.

### Task 2: Render linked evaluation copy on both pages

**Files:**
- Create: `src/components/ChallengeStageDescription.tsx`
- Modify: `src/components/ChallengeSection.tsx`
- Modify: `src/challenge/ChallengeHub.tsx`
- Modify: `src/App.css`
- Modify: `src/challenge/ChallengeHub.css`
- Modify: `src/App.test.tsx`
- Modify: `src/challenge/ChallengeHub.test.tsx`

- [ ] **Step 1: Write failing page behavior tests**

On the homepage, scope to the first and second `challenge-stage` items and require the exact links:

```ts
const onlineLink = within(stages[0]).getByRole('link', { name: 'Google Form' })
expect(onlineLink).toHaveAttribute('href', googleFormUrl)
expect(onlineLink).toHaveAttribute('target', '_blank')
expect(onlineLink).toHaveAttribute('rel', 'noreferrer')

const dockerLink = within(stages[1]).getByRole('link', {
  name: 'Challenge Dataset repository',
})
expect(dockerLink).toHaveAttribute('href', datasetUrl)
expect(dockerLink).toHaveAttribute('target', '_blank')
expect(dockerLink).toHaveAttribute('rel', 'noreferrer')
```

Require the homepage resource link named `Submit Predictions` to use `googleFormUrl`, carry safe external attributes, have `challenge-resource--primary`, and show `Open`. Require no `Evaluation Portal` or resource-level `Coming Soon` text.

Add the equivalent inline-link assertions within the first two `challenge-hub-stage` elements in `ChallengeHub.test.tsx`.

- [ ] **Step 2: Run both component tests and verify RED**

Run:

```bash
npm test -- src/App.test.tsx src/challenge/ChallengeHub.test.tsx
```

Expected: rendering fails because both pages still read `stage.description` and no inline anchors exist.

- [ ] **Step 3: Create the shared segment renderer**

Create `src/components/ChallengeStageDescription.tsx`:

```tsx
import type { ChallengeDescriptionSegment } from '../data/workshop'

interface ChallengeStageDescriptionProps {
  segments: ChallengeDescriptionSegment[]
}

function ChallengeStageDescription({ segments }: ChallengeStageDescriptionProps) {
  return (
    <p className="challenge-stage-description">
      {segments.map((segment, index) =>
        segment.url ? (
          <a
            href={segment.url}
            key={`${segment.text}-${index}`}
            rel="noreferrer"
            target="_blank"
          >
            {segment.text}
          </a>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </p>
  )
}

export default ChallengeStageDescription
```

- [ ] **Step 4: Replace both plain description paragraphs**

Import the shared component in `ChallengeSection.tsx` and `ChallengeHub.tsx`, then replace `<p>{stage.description}</p>` with:

```tsx
<ChallengeStageDescription segments={stage.descriptionSegments} />
```

- [ ] **Step 5: Add visible inline-link affordances**

In `src/App.css`, add a homepage-dark-panel treatment:

```css
.challenge-evaluation .challenge-stage-description a {
  color: var(--cyan);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

In `src/challenge/ChallengeHub.css`, add a light-panel treatment:

```css
.challenge-hub__stages .challenge-stage-description a {
  color: var(--cyan-deep);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

Do not alter layout, task scope, or stage numbering.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
npm test -- src/App.test.tsx src/challenge/ChallengeHub.test.tsx
npm run lint
```

Expected: both page suites pass; link text is accessible and safe external attributes are present.

```bash
git add src/data/workshop.ts src/components/ChallengeStageDescription.tsx src/components/ChallengeSection.tsx src/challenge/ChallengeHub.tsx src/App.css src/challenge/ChallengeHub.css src/App.test.tsx src/challenge/ChallengeHub.test.tsx
git commit -m "feat: publish challenge evaluation submission flow"
```

### Task 3: Full verification and local preview

**Files:**
- Verify all changed source and test files.

- [ ] **Step 1: Run complete automated checks**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: all tests pass, lint has no diagnostics, and production build emits both site entry points.

- [ ] **Step 2: Inspect desktop and 390px layouts**

Run `npm run dev -- --host 127.0.0.1 --port 4180` and inspect `/` plus `/challenge/`.

Verify:

- Complete Online and Real-Robot text is readable without awkward overflow.
- Both inline links are visibly underlined and keyboard-focusable.
- Homepage `Submit Predictions` is cyan and displays `Open`.
- Timeline reads `Online Evaluation Begins` with the unchanged August 25 date/time.
- Challenge Hub leaderboard remains `Coming soon` and no other dates or rules change.

- [ ] **Step 3: Confirm final branch scope**

Run `git status -sb`, `git log --oneline origin/main..HEAD`, and `git diff --stat origin/main...HEAD`.

Expected: only the design, plan, evaluation data, shared renderer, scoped styles, and tests are ahead of `origin/main`; no preview artifacts are staged.
