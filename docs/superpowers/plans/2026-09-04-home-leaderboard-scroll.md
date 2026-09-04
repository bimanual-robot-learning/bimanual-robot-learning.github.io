# Homepage leaderboard scroll implementation plan

> **For agentic workers:** Execute inline with superpowers:executing-plans and test-driven-development. Keep this work on its isolated preview branch until user approval.

**Goal:** Show the first ten teams in a vertically scrollable homepage leaderboard, with a full-leaderboard link below it, without changing the challenge page.

**Architecture:** Add an optional `previewRows` prop to the shared table. Only the homepage passes `previewRows={10}`. All entries remain in the semantic table. When entries exceed the limit, measure through the tenth row to set the scroll container height, retain an opaque sticky header, and render a text-only count/scroll hint. Observe table resizing so wrapping and loaded fonts cannot clip the tenth row. Short and empty tables remain naturally sized.

**Tech Stack:** React, TypeScript, CSS, Vitest, browser visual/interaction checks.

## Approved requirements

- Preserve four columns, typography, medal styling, colors, data, and update date.
- Keep title/date/count outside the scroll area.
- Keep all teams accessible by mouse, touch and keyboard; preserve horizontal scrolling on narrow screens.
- Hint: `15 teams · Scroll to view more` (count derived from entries), only when overflow exists.
- User amendment: add a cyan `View full leaderboard ↗` link below the homepage table to `/challenge/#leaderboard`. Keep the scroll hint. The shared table itself stays link-free.
- Challenge page remains fully expanded with no new hint.
- No push or release in this task.

## Task 1 — Test contracts, then shared scrolling behavior

Files: `src/challenge/ChallengeLeaderboard.tsx`, `.css`, `.test.tsx`.

- [x] Add tests with 15 generated entries and `previewRows={10}`: all 15 rows stay mounted, vertical scroll label and described-by hint exist, no links exist.
- [x] Test 0/10 entries and default mode: no cap or hint; rerender from 15 to 10 clears the cap.
- [x] Assert scoped vertical scrolling, sticky opaque column headers, and retained keyboard focus styling.
- [x] Run `npm test -- src/challenge/ChallengeLeaderboard.test.tsx`; expect the new preview tests to fail before implementation.
- [x] Implement optional preview mode with a ref, layout measurement through row ten, ResizeObserver cleanup, and a resize fallback. Set `--leaderboard-preview-height` only after a nonzero measurement. No data slicing, no extra links.
- [x] Scope max-height, sticky headers, and vertical scrollbar styles to the preview modifier; style hint consistently with the existing muted text.

## Task 2 — Homepage wiring and release checks

Files: `src/components/ChallengeSection.tsx`, `src/App.test.tsx`, `src/challenge/ChallengeHub.test.tsx`.

- [x] Homepage renders `<ChallengeLeaderboard entries={challengeHub.leaderboard.entries} previewRows={10} />`.
- [x] Assert homepage has the scroll mode/hint and challenge page does not.
- [x] Run `npm test`, `npm run lint`, `npm run build`, `git diff --check`.
- [x] Browser-test desktop and phone viewport: ten rows fully visible initially; scroll to row fifteen; header stays visible; title/date stay outside; no page-wide horizontal overflow.
- [x] Check keyboard scroll, short tables via component tests, and full challenge page remains uncapped.
- [x] Provide local preview and leave publication pending user approval.

## Verification outcome

- 110 tests passed; lint/build passed; git diff check passed.
- Desktop 1440px: scroll viewport 580px vs table content 835px; first ten rows complete. Scrolling 255px exposes rank fifteen; header remains at the viewport top. PageUp returns to the first row.
- Phone 390px: no page-wide horizontal overflow; table supports 222px horizontal movement and 255px vertical movement; final score and final row accessible.
- Tablet 768px: same ten-row cap, no page overflow.
- Challenge page: 835px natural height, max-height none, no preview modifier or hint.
- No browser warnings/errors observed. Publication remains unrequested; preview branch retained.

## Follow-up — Full leaderboard link

- Added the requested cyan `View full leaderboard ↗` link below the homepage table, aligned to its right edge, retaining the scroll hint.
- Link targets `/challenge/#leaderboard`. Browser testing revealed that initial fragment navigation ran before React rendered the target; the challenge page now honors the incoming anchor on mount.
- Regression test failed before the anchor fix; all 111 tests, lint, build, and diff checks pass afterward.
- Actual link activation reaches the full 15-row leaderboard: target top 78px at desktop 1440px and 110px at mobile 390px, clear of navigation. No page-wide horizontal overflow.
- Local preview only; no commit, merge, or push.
