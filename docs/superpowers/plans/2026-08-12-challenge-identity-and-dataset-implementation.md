# Challenge Identity and Dataset Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/challenge/` a distinct warm competition hero and publish the Hugging Face dataset link on the workshop homepage.

**Architecture:** Homepage resource availability remains typed configuration in `src/data/workshop.ts`. The Challenge Hub receives two small identity labels and a hero-only warm treatment in `ChallengeHub.css`; the sections after the hero keep their current visual system.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS custom properties.

---

### Task 1: Publish the Dataset resource on the workshop homepage

**Files:**
- Modify: `src/data/workshop.ts:88-104, 283-290`
- Modify: `src/App.test.tsx:256-273, 1163-1246`

- [ ] **Step 1: Write a failing resource configuration assertion**

Replace the Dataset placeholder expectation with:

```ts
{
  label: 'View Dataset',
  status: 'available',
  url: 'https://huggingface.co/datasets/challenge-2026/challenge_data',
  external: true,
}
```

In the resource rendering test, assert `resources[1]` has that URL plus `target="_blank"`, `rel="noreferrer"`, and `Open`; assert only `resources[2]` has `Coming Soon`.

- [ ] **Step 2: Verify the test fails**

Run `npm test -- src/App.test.tsx`.

Expected: failure because the Dataset item is still a `coming-soon` resource.

- [ ] **Step 3: Implement the typed Dataset resource**

Replace the second entry of `challenge.resources` with:

```ts
{
  label: 'View Dataset',
  status: 'available',
  url: 'https://huggingface.co/datasets/challenge-2026/challenge_data',
  external: true,
},
```

Leave `Explore Challenge Details` and `Evaluation Portal` unchanged. The existing resource renderer provides safe external-link behavior.

- [ ] **Step 4: Verify GREEN and commit**

Run `npm test -- src/App.test.tsx`.

Expected: pass, with one remaining `Coming Soon` resource.

```bash
git add src/data/workshop.ts src/App.test.tsx
git commit -m "feat: publish challenge dataset link"
```

### Task 2: Establish the Challenge Hub's distinct hero identity

**Files:**
- Modify: `src/challenge/ChallengeHub.tsx:33-76`
- Modify: `src/challenge/ChallengeHub.css:82-192, 817-872`
- Modify: `src/challenge/ChallengeHub.test.tsx:11-86`

- [ ] **Step 1: Write failing identity and presentation tests**

Append render assertions:

```ts
expect(screen.getByText('Bimanual Robot Learning Workshop')).toBeVisible()
expect(screen.getByText('Challenge Track · PrimeBot')).toBeVisible()
```

Add a CSS contract:

```ts
expect(hubStyles).toContain('.challenge-hub__hero-parent')
expect(hubStyles).toContain('.challenge-hub__hero-track')
expect(hubStyles).toContain('linear-gradient(135deg, #1a0b08')
expect(hubStyles).toMatch(
  /\.challenge-hub__hero-title-line\s*\{[^}]*display:\s*block;[^}]*white-space:\s*nowrap;/,
)
```

- [ ] **Step 2: Verify the focused test fails**

Run `npm test -- src/challenge/ChallengeHub.test.tsx`.

Expected: the copy and warm Hero declaration are absent.

- [ ] **Step 3: Add semantic identity labels**

At the beginning of `.challenge-hub__hero-content`, replace the hero eyebrow with:

```tsx
<div className="challenge-hub__hero-identity">
  <p className="challenge-hub__hero-parent">
    Bimanual Robot Learning Workshop
  </p>
  <p className="challenge-hub__hero-track">Challenge Track · PrimeBot</p>
</div>
```

Keep the existing `h1`, sponsor credit, tagline, and actions in their current order.

- [ ] **Step 4: Implement Hero-local warm styling**

Add a Hero-only surface and identity styles:

```css
.challenge-hub__hero {
  background: linear-gradient(135deg, #1a0b08 0%, #30130e 48%, #693221 100%);
}

.challenge-hub__hero-parent,
.challenge-hub__hero-track {
  margin: 0;
  font: 600 0.74rem/1.4 var(--font-mono);
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.challenge-hub__hero-parent { color: #f9a581; }

.challenge-hub__hero-track {
  width: max-content;
  margin-top: 12px;
  padding: 6px 10px;
  color: #ffbd9f;
  border: 1px solid rgba(255, 158, 113, 0.5);
}
```

Retune only Hero-local pseudo-element, text, and action contrast. Preserve `.challenge-hub__hero-title-line { display: block; white-space: nowrap; }` and existing compact mobile sizing. Do not recolor overview, prize, or leaderboard sections.

- [ ] **Step 5: Verify GREEN and commit**

Run `npm test -- src/challenge/ChallengeHub.test.tsx` and `npm run lint`.

Expected: tests and lint pass; only the Hero has the new warm color family.

```bash
git add src/challenge/ChallengeHub.tsx src/challenge/ChallengeHub.css src/challenge/ChallengeHub.test.tsx
git commit -m "style: distinguish challenge hub hero"
```

### Task 3: Verify and hand off a local preview

**Files:**
- Verify: `src/App.tsx`, `src/App.css`, `src/data/workshop.ts`
- Verify: `src/challenge/ChallengeHub.tsx`, `src/challenge/ChallengeHub.css`

- [ ] **Step 1: Run full project checks**

Run `npm test`, `npm run lint`, `npm run build`, and `git diff --check`.

Expected: all checks pass and the build emits both `dist/index.html` and `dist/challenge/index.html`.

- [ ] **Step 2: Inspect both pages at desktop and mobile widths**

Run `npm run dev -- --host 127.0.0.1 --port 4177`.

Inspect `http://127.0.0.1:4177/` and `http://127.0.0.1:4177/challenge/` at 1440px and 390px. Confirm homepage navy remains unchanged; Challenge Hero is visibly warm and separate; title stays two phrase lines; Dataset is available; and neither page overflows horizontally.

- [ ] **Step 3: Confirm branch scope before user preview**

Run `git status -sb` and `git log --oneline origin/main..HEAD`.

Expected: only the intended design, plan, Dataset, and Hero commits are ahead of `origin/main`; preview output and `.superpowers/` artifacts are unstaged.
