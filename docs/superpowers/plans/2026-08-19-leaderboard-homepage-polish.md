# Leaderboard Homepage Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a polished shared leaderboard on both the workshop homepage and Challenge Hub, with a non-wrapping desktop opening date and intentional public empty state.

**Architecture:** Keep leaderboard entries and opening date in `challengeHub.leaderboard`, and reuse the existing `ChallengeLeaderboard` component on both pages. The shared component owns its stylesheet and empty-state copy; each page owns only its surrounding heading and spacing so the table stays consistent while matching each page's visual hierarchy.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Vitest, Testing Library

---

## File structure

- Modify `src/challenge/ChallengeLeaderboard.tsx`: render the approved public empty-state copy and own the component stylesheet.
- Modify `src/challenge/ChallengeLeaderboard.css`: preserve the shared table treatment and add a reusable desktop-only no-wrap opening-date utility.
- Modify `src/challenge/ChallengeLeaderboard.test.tsx`: lock the approved empty-state copy and shared no-wrap/mobile behavior.
- Modify `src/challenge/ChallengeHub.tsx`: use the shared opening-date class and remove page-level ownership of the shared CSS import.
- Modify `src/challenge/ChallengeHub.test.tsx`: update Hub copy assertions and verify the desktop date hook.
- Modify `src/components/ChallengeSection.tsx`: add the full shared leaderboard between prizes and logistics.
- Modify `src/App.css`: style the homepage leaderboard with the existing Challenge visual system.
- Modify `src/App.test.tsx`: verify homepage semantics, ordering, headers, public empty state, and absence of fake entries.

### Task 1: Polish the shared leaderboard empty state

**Files:**
- Modify: `src/challenge/ChallengeLeaderboard.test.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.css`

- [ ] **Step 1: Write the failing empty-state and responsive-style tests**

Replace the old `No results yet` assertions with the approved copy and add a style assertion for the opening-date utility:

```tsx
expect(
  screen.getByText('Leaderboard opens August 25, 2026'),
).toBeVisible()
expect(
  screen.getByText(
    'Verified online evaluation results will be published here as submissions are evaluated.',
  ),
).toBeVisible()
expect(screen.queryByText('No results yet')).not.toBeInTheDocument()

expect(leaderboardStyles).toMatch(
  /@media \(min-width: 761px\) \{[\s\S]*?\.challenge-leaderboard__opening-date\s*\{[^}]*white-space:\s*nowrap;/,
)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx vitest run src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: FAIL because the component still renders `No results yet` and the opening-date style does not exist.

- [ ] **Step 3: Implement the approved shared copy and stylesheet ownership**

In `ChallengeLeaderboard.tsx`, import its CSS and replace the empty-state markup:

```tsx
import './ChallengeLeaderboard.css'

<div className="challenge-leaderboard__empty-content">
  <strong>Leaderboard opens {openingDate}</strong>
  <span>
    Verified online evaluation results will be published here as submissions
    are evaluated.
  </span>
</div>
```

In `ChallengeLeaderboard.css`, add:

```css
@media (min-width: 761px) {
  .challenge-leaderboard__opening-date {
    white-space: nowrap;
  }
}
```

The minimum-width media query ensures the phrase stays intact on computers without forcing page-level overflow on narrow phones.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npx vitest run src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: all `ChallengeLeaderboard` tests PASS.

- [ ] **Step 5: Commit the shared component change**

```bash
git add src/challenge/ChallengeLeaderboard.tsx src/challenge/ChallengeLeaderboard.css src/challenge/ChallengeLeaderboard.test.tsx
git commit -m "style: polish challenge leaderboard empty state"
```

### Task 2: Apply the no-wrap status to the Challenge Hub

**Files:**
- Modify: `src/challenge/ChallengeHub.test.tsx`
- Modify: `src/challenge/ChallengeHub.tsx`

- [ ] **Step 1: Write the failing Hub assertions**

Update the leaderboard assertions and require the header date to use the shared utility:

```tsx
const openingDate = within(leaderboard).getByText(
  'Online evaluation begins August 25, 2026.',
)
expect(openingDate).toBeVisible()
expect(openingDate).toHaveClass('challenge-leaderboard__opening-date')
expect(
  within(leaderboard).getByText('Leaderboard opens August 25, 2026'),
).toBeVisible()
expect(within(leaderboard).queryByText('No results yet')).not.toBeInTheDocument()
```

- [ ] **Step 2: Run the focused Hub test and verify RED**

Run:

```bash
npx vitest run src/challenge/ChallengeHub.test.tsx
```

Expected: FAIL because the Hub opening-date paragraph lacks the shared class and the old component copy is no longer expected.

- [ ] **Step 3: Apply the shared date class and remove duplicate CSS ownership**

Remove `import './ChallengeLeaderboard.css'` from `ChallengeHub.tsx`, because the shared component now owns that import. Update the header paragraph:

```tsx
<p className="challenge-leaderboard__opening-date">
  Online evaluation begins {challengeHub.leaderboard.openingDate}.
</p>
```

- [ ] **Step 4: Run the focused Hub test and verify GREEN**

Run:

```bash
npx vitest run src/challenge/ChallengeHub.test.tsx
```

Expected: all Challenge Hub tests PASS.

- [ ] **Step 5: Commit the Hub integration**

```bash
git add src/challenge/ChallengeHub.tsx src/challenge/ChallengeHub.test.tsx
git commit -m "style: keep leaderboard opening date intact"
```

### Task 3: Add the full leaderboard to the workshop homepage

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/components/ChallengeSection.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write the failing homepage semantics and placement test**

Extend the Challenge sequence test to require a labelled leaderboard between prizes and logistics:

```tsx
const homepageLeaderboard = within(challengeSection).getByRole('region', {
  name: 'Challenge Leaderboard',
})

expect(prizePool.compareDocumentPosition(homepageLeaderboard)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
expect(homepageLeaderboard.compareDocumentPosition(logistics)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
expect(within(homepageLeaderboard).getAllByRole('columnheader')).toHaveLength(6)
expect(
  within(homepageLeaderboard).getByText(
    'Leaderboard opens August 25, 2026',
  ),
).toBeVisible()
expect(within(homepageLeaderboard).queryByText('Team A')).not.toBeInTheDocument()
```

Add a presentation assertion:

```tsx
expect(appStyles).toContain('.challenge-home-leaderboard')
expect(appStyles).toContain('.challenge-home-leaderboard__header')
```

- [ ] **Step 2: Run the homepage test and verify RED**

Run:

```bash
npx vitest run src/App.test.tsx
```

Expected: FAIL because the workshop homepage does not yet contain a leaderboard region.

- [ ] **Step 3: Render the shared leaderboard after prizes**

In `ChallengeSection.tsx`, import the shared component and typed data:

```tsx
import ChallengeLeaderboard from '../challenge/ChallengeLeaderboard'
import { challengeHub } from '../data/challengeHub'
```

Insert this section after `challenge-prize-pool` and before `challenge-logistics`:

```tsx
<section
  aria-labelledby="challenge-home-leaderboard-title"
  className="challenge-home-leaderboard"
  data-testid="challenge-home-leaderboard"
>
  <header className="challenge-home-leaderboard__header">
    <div>
      <p className="eyebrow">Verified results</p>
      <h3 id="challenge-home-leaderboard-title">Challenge Leaderboard</h3>
    </div>
    <p className="challenge-leaderboard__opening-date">
      Online evaluation begins {challengeHub.leaderboard.openingDate}.
    </p>
  </header>
  <ChallengeLeaderboard
    entries={challengeHub.leaderboard.entries}
    openingDate={challengeHub.leaderboard.openingDate}
  />
</section>
```

- [ ] **Step 4: Add homepage-aligned styling**

In `App.css`, add a deep-navy section that uses the existing Challenge spacing and typography:

```css
.challenge-home-leaderboard {
  padding: clamp(28px, 4vw, 44px);
  margin-bottom: 32px;
  overflow: hidden;
  color: var(--paper);
  background: var(--ink-950);
  border: 1px solid rgba(27, 132, 153, 0.28);
  border-radius: 7px;
}

.challenge-home-leaderboard__header {
  display: flex;
  margin-bottom: 24px;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
}

.challenge-home-leaderboard__header .eyebrow {
  margin: 0 0 8px;
  color: var(--cyan);
}

.challenge-home-leaderboard__header h3 {
  margin: 0;
  color: var(--paper);
  font: 600 clamp(1.8rem, 3.2vw, 2.7rem)/1 var(--font-display);
  letter-spacing: -0.05em;
}

.challenge-home-leaderboard__header > p {
  margin: 0;
  color: var(--slate-light-readable);
  font-size: 0.88rem;
}

@media (max-width: 760px) {
  .challenge-home-leaderboard {
    padding: 28px 18px;
  }

  .challenge-home-leaderboard__header {
    align-items: start;
    flex-direction: column;
    gap: 12px;
  }
}
```

- [ ] **Step 5: Run the homepage test and verify GREEN**

Run:

```bash
npx vitest run src/App.test.tsx
```

Expected: all homepage tests PASS.

- [ ] **Step 6: Commit the homepage leaderboard**

```bash
git add src/App.test.tsx src/components/ChallengeSection.tsx src/App.css
git commit -m "feat: add leaderboard to workshop homepage"
```

### Task 4: Full verification and visual QA

**Files:**
- Verify only

- [ ] **Step 1: Run the complete isolated-worktree test suite**

Run:

```bash
npm test -- --run
```

Expected: all tests PASS.

- [ ] **Step 2: Run lint and production build**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands exit 0 with no TypeScript or asset errors.

- [ ] **Step 3: Check patch hygiene**

Run:

```bash
git diff --check
git status -sb
```

Expected: no whitespace errors and no uncommitted implementation files.

- [ ] **Step 4: Inspect desktop presentation**

Start the production preview and verify at a desktop viewport:

- the Hub phrase `Online evaluation begins August 25, 2026.` stays on one line;
- both pages show the revised public empty state;
- the homepage leaderboard appears after prizes and before logistics;
- the page does not overflow horizontally.

- [ ] **Step 5: Inspect mobile presentation**

At a 390px viewport, verify:

- the page width remains 390px;
- the leaderboard table scrolls inside its viewport;
- the empty state is visible before horizontal scrolling;
- the opening-date phrase may wrap without forcing page-level overflow;
- both homepage disclosures remain independently collapsed by default.

