# Challenge Hub Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the `/challenge/` page hierarchy, sponsor treatment, prize pool, timeline, and leaderboard while keeping the workshop homepage unchanged.

**Architecture:** Keep all shared event facts in `src/data/workshop.ts`; extend `src/data/challengeHub.ts` only for Challenge Hub-specific presentational copy. `ChallengeHub.tsx` remains the semantic page composition file, and `ChallengeHub.css` owns all page-scoped layout and visual changes under `.challenge-hub`.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS.

---

### Task 1: Update Challenge Hub content and semantic structure

**Files:**
- Modify: `src/data/challengeHub.ts`
- Modify: `src/data/challengeHub.test.ts`
- Modify: `src/challenge/ChallengeHub.tsx`
- Modify: `src/challenge/ChallengeHub.test.tsx`

- [ ] **Step 1: Write failing content and page-contract tests**

Add assertions that the fact rail contains `1,500+ hours`, excludes `12+ household tasks`, and that the page renders:

```ts
expect(screen.getByRole('link', { name: /PrimeBot/i })).toHaveAttribute(
  'href',
  'https://www.primebot.cn/',
)
expect(screen.queryByText('Sample Data Release')).not.toBeInTheDocument()
expect(screen.queryByText('Updates')).not.toBeInTheDocument()
expect(screen.getByText('Leaderboard opens with online evaluation.')).toBeVisible()
```

Run: `npm test -- src/data/challengeHub.test.ts src/challenge/ChallengeHub.test.tsx`

Expected: FAIL because the existing page still has `12+ household tasks`, text-only sponsor copy, all five milestones, and the two-column updates block.

- [ ] **Step 2: Update Challenge Hub data**

Use the following content shape in `src/data/challengeHub.ts`:

```ts
hero: {
  titleLines: ['Household Bimanual', 'Manipulation'],
  accent: 'Challenge',
  sponsorPrefix: 'Designed and sponsored by',
  tagline: 'Train from real demonstrations. Evaluate on real robots.',
},
factRail: [
  '1,500+ hours',
  'Teleoperation + UMI data',
  'Online + real-robot evaluation',
  'USD 3,000 prize pool',
],
leaderboard: {
  eyebrow: 'Leaderboard',
  status: 'Coming soon',
  title: 'Leaderboard opens with online evaluation.',
  description: 'Scores and final rankings will appear here after the evaluation portal opens.',
  openingDate: 'August 25, 2026',
  stages: ['Online score', 'Real-robot score', 'Final ranking'],
},
```

Remove the old `future.updatesTitle` and `future.updatesDescription` values.
Rename the `#updates` navigation label to `Leaderboard` while preserving the
existing anchor target.

- [ ] **Step 3: Update the semantic page composition**

In `src/challenge/ChallengeHub.tsx`:

1. Render the hero without `challenge-hub__hero-media`.
2. Render two non-wrapping desktop title-line spans, with `Challenge` as the orange accent.
3. Render the sponsor prefix and a linked `PrimeBot` using the existing `sponsor.url`, `target="_blank"`, and `rel="noreferrer"`.
4. Filter the rendered timeline with `milestone.label !== 'Sample Data Release'` while leaving `challenge.timeline` untouched.
5. Render a prize-header sponsor link.
6. Replace the old updates section with one `id="updates"` leaderboard section containing status, opening date, three stages, and no `Updates` heading or CTA.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- src/data/challengeHub.test.ts src/challenge/ChallengeHub.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the structural change**

```bash
git add src/data/challengeHub.ts src/data/challengeHub.test.ts src/challenge/ChallengeHub.tsx src/challenge/ChallengeHub.test.tsx
git commit -m "feat: refine challenge hub content"
```

### Task 2: Refine Challenge Hub visual hierarchy and responsiveness

**Files:**
- Modify: `src/challenge/ChallengeHub.css`
- Modify: `src/challenge/ChallengeHub.test.tsx`

- [ ] **Step 1: Write failing style-contract tests**

Add raw stylesheet assertions for:

```ts
expect(challengeHubStyles).toContain('.challenge-hub__leaderboard-card')
expect(challengeHubStyles).toContain('.challenge-hub__prize-sponsor')
expect(challengeHubStyles).toContain('.challenge-hub__hero-title-line')
expect(challengeHubStyles).toContain('@media (max-width: 760px)')
```

Run: `npm test -- src/challenge/ChallengeHub.test.tsx`

Expected: FAIL because the new selectors do not exist.

- [ ] **Step 2: Implement hero, section, prize, and leaderboard styles**

In `src/challenge/ChallengeHub.css`:

1. Make the hero content occupy the full desktop width; remove desktop grid allocation for image media.
2. Set `.challenge-hub__hero-title-line { display: block; white-space: nowrap; }` on desktop and restore natural wrapping below 760px.
3. Increase `Your path to entry.`, `Evaluation Format`, and `Challenge Timeline` heading sizes and use the existing dark-ink contrast.
4. Keep `.challenge-hub__prizes` pale orange but set its eyebrow, title, sponsor text, borders, and amounts to deep warm-brown/orange; do not use `--cyan` in the prize rules.
5. Add a full-width deep-navy leaderboard card with a small orange status dot, cyan stage labels, three ruled stages, and a subtle progress rail.
6. Keep 44px targets and all responsive layouts at `max-width: 760px`.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- src/challenge/ChallengeHub.test.tsx`

Expected: PASS.

- [ ] **Step 4: Commit the visual change**

```bash
git add src/challenge/ChallengeHub.css src/challenge/ChallengeHub.test.tsx
git commit -m "style: refine challenge hub hierarchy"
```

### Task 3: Verify the isolated Challenge Hub change

**Files:**
- Modify only if verification identifies a concrete defect: `src/challenge/ChallengeHub.tsx`, `src/challenge/ChallengeHub.css`, or their tests.

- [ ] **Step 1: Run complete automated verification**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: all tests pass, lint has no diagnostics, build emits both `dist/index.html` and `dist/challenge/index.html`, and diff check has no output.

- [ ] **Step 2: Inspect desktop and mobile layouts**

Start the local preview and inspect `/challenge/` at 1440px and 390px. Verify title is two desktop lines, sponsor links are visible, no timeline sample-data row is rendered, prize colors remain warm-only, and the single leaderboard module has no update CTA.

- [ ] **Step 3: Commit a concrete polish fix only if required**

```bash
git add src/challenge/ChallengeHub.tsx src/challenge/ChallengeHub.css src/challenge/ChallengeHub.test.tsx
git commit -m "fix: polish challenge hub refinement"
```
