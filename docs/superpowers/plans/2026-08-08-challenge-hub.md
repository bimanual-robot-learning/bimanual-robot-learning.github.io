# Challenge Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Replace the /challenge/ coming-soon page with a responsive participant-facing Challenge Hub that directs detailed dataset readers to Hugging Face.

**Architecture:** Add a typed Challenge-Hub content module while continuing to use the challenge timeline, prizes, videos, and organizers already stored in src/data/workshop.ts. Replace the minimal page with a scoped ChallengeHub page and make the existing video gallery configurable so the workshop and Challenge Hub share the same keyboard-accessible interaction.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Vitest 4, Testing Library, lucide-react, CSS custom properties.

---

## File structure

| Path | Responsibility |
| --- | --- |
| src/data/challengeHub.ts | Hub-only title, navigation, fact rail, Hugging Face CTA, participation steps, and future-status copy. |
| src/data/challengeHub.test.ts | Typed-content contract. |
| src/components/ChallengeVideoGallery.tsx | Existing selected-video playlist with optional heading and copy props. |
| src/challenge/ChallengeHub.tsx | Semantic page composition. |
| src/challenge/ChallengeHub.css | Scoped desktop, tablet, phone, focus, and reduced-motion styles. |
| src/challenge/ChallengeHub.test.tsx | Page-level semantic and accessibility contracts. |
| src/challenge/main.tsx | Loads ChallengeHub instead of ChallengeComingSoon. |
| challenge/index.html | Released title, description, and sharing metadata. |

## Task 1: Add the Challenge Hub content model

**Files:**
- Create: src/data/challengeHub.ts
- Create: src/data/challengeHub.test.ts

- [ ] **Step 1: Write the failing content-contract test**

Create src/data/challengeHub.test.ts:

~~~
import { describe, expect, it } from 'vitest'
import { challengeHub } from './challengeHub'

describe('challengeHub content', () => {
  it('keeps the page concise and directs full data details to Hugging Face', () => {
    expect(challengeHub.dataset.url).toBe(
      'https://huggingface.co/datasets/challenge-2026/challenge_data',
    )
    expect(challengeHub.factRail).toEqual([
      '12+ household tasks',
      'Teleoperation + UMI data',
      'Online + real-robot evaluation',
      'USD 2,000 prize pool',
    ])
    expect(challengeHub.participationSteps).toHaveLength(3)
    expect(challengeHub.navigation.map(({ href }) => href)).toEqual([
      '#overview',
      '#tasks',
      '#evaluation',
      '#prizes',
      '#updates',
    ])
  })
})
~~~

- [ ] **Step 2: Verify the test is red**

Run:

~~~
npm test -- src/data/challengeHub.test.ts
~~~

Expected: FAIL because src/data/challengeHub.ts is absent.

- [ ] **Step 3: Implement the exact content contract**

Create src/data/challengeHub.ts:

~~~
export interface ChallengeHubNavigationItem {
  label: string
  href: '#overview' | '#tasks' | '#evaluation' | '#prizes' | '#updates'
}

export interface ChallengeHubParticipationStep {
  number: '01' | '02' | '03'
  title: string
  description: string
}

export const challengeHub = {
  identity: 'BIMANUAL ROBOT LEARNING WORKSHOP · IROS 2026',
  navigation: [
    { label: 'Overview', href: '#overview' },
    { label: 'Tasks', href: '#tasks' },
    { label: 'Evaluation', href: '#evaluation' },
    { label: 'Prizes', href: '#prizes' },
    { label: 'Updates', href: '#updates' },
  ] satisfies ChallengeHubNavigationItem[],
  hero: {
    titleLines: ['Real-World Household', 'Bimanual Manipulation'],
    accent: 'Challenge',
    sponsor: 'Designed and sponsored by PrimeBot',
    tagline: 'Train from real demonstrations. Evaluate on real robots.',
  },
  factRail: [
    '12+ household tasks',
    'Teleoperation + UMI data',
    'Online + real-robot evaluation',
    'USD 2,000 prize pool',
  ],
  overview: {
    eyebrow: 'About the challenge',
    title: 'From real demonstrations to real robots.',
    description:
      'This challenge focuses on real-world bimanual manipulation in household environments. Participants are free to design their own data mixtures and training strategies using real-robot teleoperation and UMI demonstrations.',
  },
  dataset: {
    eyebrow: 'Dataset access',
    title: 'Built for real-world training.',
    items: [
      'Real-robot teleoperation data',
      'UMI demonstrations',
      'LeRobot V2.1 format',
      'Sample data available',
    ],
    url: 'https://huggingface.co/datasets/challenge-2026/challenge_data',
    action: 'Explore on Hugging Face',
    note:
      'Complete dataset documentation, field definitions, sample files, and loading examples are maintained on Hugging Face.',
  },
  participationSteps: [
    {
      number: '01',
      title: 'Access the data',
      description: 'Explore sample data and documentation on Hugging Face.',
    },
    {
      number: '02',
      title: 'Train your policy',
      description: 'Choose a data mixture and training strategy.',
    },
    {
      number: '03',
      title: 'Submit for evaluation',
      description:
        'Enter online evaluation; top entries may advance to real-robot testing.',
    },
  ] satisfies ChallengeHubParticipationStep[],
  taskScope:
    'Real-robot evaluation covers up to four household tasks, including washer manipulation and clothing folding.',
  future: {
    leaderboardTitle: 'Leaderboard',
    leaderboardDescription: 'Opens with online evaluation. Coming soon.',
    updatesTitle: 'Updates',
    updatesDescription:
      'Dataset releases, evaluation notices, and rule changes will be posted here.',
  },
} as const
~~~

- [ ] **Step 4: Verify the test is green**

Run:

~~~
npm test -- src/data/challengeHub.test.ts
~~~

Expected: PASS.

- [ ] **Step 5: Commit**

~~~
git add src/data/challengeHub.ts src/data/challengeHub.test.ts
git commit -m "feat: add challenge hub content"
~~~

## Task 2: Generalize the existing video gallery

**Files:**
- Modify: src/components/ChallengeVideoGallery.tsx
- Modify: src/components/ChallengeSection.tsx
- Modify: src/App.test.tsx

- [ ] **Step 1: Add a failing configurable-copy test**

Add this test to src/App.test.tsx and import ChallengeVideoGallery:

~~~
it('accepts Challenge Hub copy without changing selected-video behavior', () => {
  render(
    <ChallengeVideoGallery
      eyebrow="Task demonstrations"
      title="See the challenge in action"
      description="Real-world teleoperation and UMI demonstrations."
    />,
  )

  expect(
    screen.getByRole('heading', {
      name: 'See the challenge in action',
      level: 3,
    }),
  ).toBeVisible()
  expect(screen.getByLabelText('Fold Clothing video')).not.toHaveAttribute(
    'autoplay',
  )
})
~~~

- [ ] **Step 2: Verify the test is red**

Run:

~~~
npm test -- src/App.test.tsx -t "accepts Challenge Hub copy"
~~~

Expected: FAIL because ChallengeVideoGallery accepts no props.

- [ ] **Step 3: Add optional typed props**

At the top of ChallengeVideoGallery.tsx, add:

~~~
interface ChallengeVideoGalleryProps {
  eyebrow?: string
  title?: string
  description?: string
}
~~~

Replace the function declaration with:

~~~
function ChallengeVideoGallery({
  eyebrow = 'Real-world data',
  title = 'Training Data Examples',
  description =
    'A glimpse of the real-robot teleoperation and UMI demonstrations available to challenge participants.',
}: ChallengeVideoGalleryProps) {
~~~

Replace the three current hard-coded gallery header values with eyebrow, title, and description. Keep the video source, poster, controls, playsInline, preload, selected key, playlist button labels, and aria-pressed behavior unchanged.

- [ ] **Step 4: Preserve the workshop page’s explicit copy**

Replace the workshop call site with:

~~~
<ChallengeVideoGallery
  eyebrow="Real-world data"
  title="Training Data Examples"
  description="A glimpse of the real-robot teleoperation and UMI demonstrations available to challenge participants."
/>
~~~

- [ ] **Step 5: Verify behavior and commit**

Run:

~~~
npm test -- src/App.test.tsx -t "Challenge"
git add src/components/ChallengeVideoGallery.tsx src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m "refactor: reuse challenge video gallery"
~~~

Expected: all selected-video and workshop-gallery tests PASS.

## Task 3: Build the semantic Challenge Hub page

**Files:**
- Create: src/challenge/ChallengeHub.tsx
- Create: src/challenge/ChallengeHub.test.tsx
- Modify: src/challenge/main.tsx
- Delete: src/challenge/ChallengeComingSoon.tsx
- Delete: src/challenge/ChallengeComingSoon.test.tsx

- [ ] **Step 1: Write the failing page contract**

Create src/challenge/ChallengeHub.test.tsx:

~~~
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ChallengeHub from './ChallengeHub'
import { challenge, challengeOrganizers, challengeVideos } from '../data/workshop'

describe('ChallengeHub', () => {
  it('renders the participant journey and future-ready Challenge content', () => {
    render(<ChallengeHub />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Real-World Household Bimanual Manipulation Challenge',
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('navigation', { name: 'Challenge navigation' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: /view dataset/i })).toHaveAttribute(
      'href',
      'https://huggingface.co/datasets/challenge-2026/challenge_data',
    )
    expect(screen.getAllByTestId('challenge-hub-fact')).toHaveLength(4)
    expect(screen.getAllByTestId('challenge-participation-step')).toHaveLength(3)
    expect(screen.getAllByTestId('challenge-hub-stage')).toHaveLength(3)
    expect(screen.getAllByTestId('challenge-hub-milestone')).toHaveLength(
      challenge.timeline.length,
    )
    expect(screen.getAllByTestId('challenge-hub-prize')).toHaveLength(
      challenge.prizes.length,
    )
    expect(screen.getAllByTestId('challenge-hub-organizer')).toHaveLength(
      challengeOrganizers.length,
    )
    expect(
      screen.getByText('Opens with online evaluation. Coming soon.'),
    ).toBeVisible()

    const gallery = screen.getByRole('region', {
      name: 'See the challenge in action',
    })
    expect(within(gallery).getAllByRole('button')).toHaveLength(
      challengeVideos.length,
    )
  })
})
~~~

- [ ] **Step 2: Verify the page test is red**

Run:

~~~
npm test -- src/challenge/ChallengeHub.test.tsx
~~~

Expected: FAIL because ChallengeHub does not exist.

- [ ] **Step 3: Implement the page with the following section boundaries**

Create ChallengeHub.tsx. Import ArrowDown, ArrowLeft, and ArrowUpRight from lucide-react; import ChallengeVideoGallery; import challenge and challengeOrganizers from src/data/workshop.ts; and import challengeHub.

Render these semantic sections in this exact order:

1. Sticky header with a Challenge navigation landmark. It contains the BRL / CHALLENGE 2026 anchor, maps challengeHub.navigation into same-page links, and has an external View Dataset CTA.
2. Hero with id top, h1 assembled from titleLines plus an orange Challenge span, sponsor text, tagline, View Dataset action, and Watch Task Demos anchor. Render the existing washer-put-clothing WebP as decorative hero media with empty alt text.
3. A compact fact rail mapping challengeHub.factRail to challenge-hub-fact elements.
4. Overview with id overview and a bordered Dataset Access panel linking to challengeHub.dataset.url in a new tab.
5. Task Demonstrations with id tasks and this gallery:

~~~
<ChallengeVideoGallery
  eyebrow="Task demonstrations"
  title="See the challenge in action"
  description="Real-world teleoperation and UMI demonstrations from household manipulation tasks."
/>
~~~

6. Participation section mapping the three participationSteps to challenge-participation-step articles.
7. A two-column Evaluation and Challenge Timeline section. Map challenge.stages, then add Final Ranking from challenge.finalRanking, all with challenge-hub-stage. Map timeline items with challenge-hub-milestone and preserve optional time.
8. Pale-orange Prize Pool with id prizes, total from challenge.prizePoolTotal, and mapped challenge-hub-prize items.
9. Navy Updates section with id updates. It contains leaderboard and updates text from challengeHub.future, but no link to a nonexistent leaderboard route.
10. Challenge Organizers grid mapping challengeOrganizers to cards with existing images, alt text, names, and institutions.
11. Footer with Back to Workshop and an external Dataset on Hugging Face link.

Do not add a dataset field table, installation code, file tree, Docker instructions, registration form, contact channel, or empty leaderboard page.

- [ ] **Step 4: Wire the page and remove the old one**

Replace the two ChallengeComingSoon imports and component instance in src/challenge/main.tsx:

~~~
import './ChallengeHub.css'
import ChallengeHub from './ChallengeHub'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChallengeHub />
  </StrictMode>,
)
~~~

Delete the old ComingSoon component and test after this replacement compiles.

- [ ] **Step 5: Verify and commit**

Run:

~~~
npm test -- src/challenge/ChallengeHub.test.tsx
git add src/challenge/ChallengeHub.tsx src/challenge/ChallengeHub.test.tsx src/challenge/main.tsx src/challenge/ChallengeComingSoon.tsx src/challenge/ChallengeComingSoon.test.tsx
git commit -m "feat: add challenge hub page"
~~~

Expected: PASS.

## Task 4: Add responsive page styling and release metadata

**Files:**
- Create: src/challenge/ChallengeHub.css
- Delete: src/challenge/ChallengeComingSoon.css
- Modify: challenge/index.html
- Modify: src/App.test.tsx
- Modify: src/challenge/ChallengeHub.test.tsx

- [ ] **Step 1: Add failing style and metadata assertions**

Append these tests to ChallengeHub.test.tsx:

~~~
import challengeHtml from '../../challenge/index.html?raw'
import hubStyles from './ChallengeHub.css?raw'

it('defines responsive and reduced-motion-aware presentation', () => {
  expect(hubStyles).toContain('.challenge-hub__header')
  expect(hubStyles).toContain('.challenge-hub__hero')
  expect(hubStyles).toContain('.challenge-hub__fact-rail')
  expect(hubStyles).toContain('@media (max-width: 760px)')
  expect(hubStyles).toContain('@media (prefers-reduced-motion: reduce)')
  expect(hubStyles).toContain('.challenge-hub a:focus-visible')
})

it('publishes released Challenge Hub metadata', () => {
  expect(challengeHtml).toContain(
    '<title>Real-World Household Bimanual Manipulation Challenge | IROS 2026 Workshop</title>',
  )
  expect(challengeHtml).toContain(
    'Train from real demonstrations and evaluate on real robots.',
  )
  expect(challengeHtml).not.toContain('Full challenge details are coming soon.')
})
~~~

- [ ] **Step 2: Verify the contract is red**

Run:

~~~
npm test -- src/challenge/ChallengeHub.test.tsx
~~~

Expected: FAIL because ChallengeHub.css and released metadata do not yet exist.

- [ ] **Step 3: Implement scoped visual rules**

Create ChallengeHub.css with all selectors scoped to .challenge-hub. It must define these layout anchors:

~~~
.challenge-hub { min-width: 320px; color: var(--ink-950); background: var(--paper); }
.challenge-hub__header { position: sticky; top: 0; z-index: 20; background: rgba(7, 16, 29, 0.94); backdrop-filter: blur(16px); }
.challenge-hub__hero { color: var(--paper); background: var(--ink-950); }
.challenge-hub__fact-rail { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.challenge-hub__overview-grid,
.challenge-hub__logistics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.challenge-hub__participation-grid,
.challenge-hub__prize-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.challenge-hub__organizer-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.challenge-hub a:focus-visible { outline: 3px solid var(--orange); outline-offset: 4px; }
~~~

Add a navy grid and dark poster overlay to the hero; a narrow ruled fact rail rather than raised cards; cold-white text sections; a cyan-bordered data panel; Challenge-Hub-only video gallery styling; a pale-orange prize section; and a navy updates/footer section.

At max-width 980px, stack hero media and reduce the fact rail to two columns. At max-width 760px, stack overview, participation, logistics, and prizes; retain two organizer columns; ensure all buttons and links are at least 44px tall. Add a prefers-reduced-motion rule that disables challenge-hub transitions.

- [ ] **Step 4: Update page metadata and existing expectation**

In challenge/index.html, replace all page-title occurrences with:

~~~
Real-World Household Bimanual Manipulation Challenge | IROS 2026 Workshop
~~~

Replace the coming-soon description with:

~~~
Train from real demonstrations and evaluate on real robots in the IROS 2026 Bimanual Robot Learning Workshop challenge.
~~~

In src/App.test.tsx, change its expected challenge-page title string to the same title. Leave canonical URL, Vite multi-page input, sitemap expectation, theme color, favicon, and OG image path unchanged.

- [ ] **Step 5: Verify and commit**

Run:

~~~
npm test -- src/challenge/ChallengeHub.test.tsx src/App.test.tsx
git add src/challenge/ChallengeHub.css challenge/index.html src/App.test.tsx src/challenge/ChallengeHub.test.tsx src/challenge/ChallengeComingSoon.css
git commit -m "style: design challenge hub"
~~~

Expected: PASS.

## Task 5: Complete verification

**Files:**
- Modify only files above if a specific verification failure is found.

- [ ] **Step 1: Run all automated checks**

~~~
npm test
npm run lint
npm run build
~~~

Expected: all tests pass, lint exits zero, and build emits both dist/index.html and dist/challenge/index.html.

- [ ] **Step 2: Review the release build**

Run:

~~~
npm run preview -- --host 127.0.0.1
~~~

Inspect /challenge/ at 1440px, 768px, and 390px.

- [ ] **Step 3: Use this visual and interaction checklist**

- Hero title, PrimeBot sponsor, primary Hugging Face CTA, and demo anchor are readable without scrolling on desktop.
- The fact rail reads as one information unit rather than four competing CTA cards.
- The external Hugging Face links have target blank and noreferrer.
- Selecting each of the five videos replaces caption, poster, and source without autoplay.
- Evaluation and Timeline sit side by side on desktop and do not overflow at 390px.
- All three prize amounts remain readable against pale orange.
- Updates and Leaderboard communicate future availability without dead links.
- Keyboard navigation reveals focus styles for all links and playlist buttons.
- Reduced-motion mode removes transitions.

- [ ] **Step 4: Commit only a real verification fix**

If a checklist item fails, update its implementation and test, then run:

~~~
git add src challenge public
git commit -m "fix: polish challenge hub"
~~~

If no code changes are needed, do not create an empty commit.
