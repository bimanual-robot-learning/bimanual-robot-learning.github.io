# Real-World Household Manipulation Challenge Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved PrimeBot-sponsored real-world household manipulation Challenge Track, prize pool, timeline, resource status, and organizer group to the Workshop landing page.

**Architecture:** Keep all mutable Challenge copy in the typed `src/data/workshop.ts` source of truth, render the main Challenge as a focused `ChallengeSection` component, and keep organizer rendering in the existing team section so Workshop and Challenge organizers remain visually grouped. Reuse the current design tokens and semantic patterns, add only local image assets, and defer the `/challenge/` route until detailed rules or live resources exist.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, Testing Library, Lucide React, CSS

---

## File Structure

- Create `src/components/ChallengeSection.tsx`: semantic Challenge overview, evaluation flow, household tasks, Prize Pool, timeline, and resource-status presentation.
- Create `public/images/challenge-organizers/kai-li.jpg`: supplied official Kai Li portrait.
- Create `public/images/challenge-organizers/ran-cheng.jpg`: supplied official Ran Cheng portrait.
- Modify `src/data/workshop.ts`: typed Challenge content, optional person affiliations, and Challenge organizer records.
- Modify `src/App.tsx`: navigation, Challenge placement, section numbering, and Challenge Organizer subsection.
- Modify `src/App.css`: light technical Challenge section, dark Prize Pool stage, responsive grids, and Challenge Organizer treatment.
- Modify `src/App.test.tsx`: content, order, semantics, assets, non-interactive Coming Soon states, responsive CSS contracts, and regression counts.

### Task 1: Add Typed Challenge Content and Local Organizer Assets

**Files:**
- Modify: `src/data/workshop.ts`
- Modify: `src/App.test.tsx`
- Create: `public/images/challenge-organizers/kai-li.jpg`
- Create: `public/images/challenge-organizers/ran-cheng.jpg`

- [ ] **Step 1: Write a failing structured-content test**

Change the data import in `src/App.test.tsx` to:

```tsx
import {
  challenge,
  challengeOrganizers,
  workshopMeta,
} from './data/workshop'
```

Add this test before the DOM rendering tests:

```tsx
it('defines the approved Challenge content as structured data', () => {
  expect(challenge.title).toBe(
    'Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge',
  )
  expect(challenge.facts).toHaveLength(3)
  expect(challenge.stages).toHaveLength(3)
  expect(challenge.tasks).toHaveLength(4)
  expect(challenge.prizePoolTotal).toBe('USD 2,000')
  expect(challenge.prizes.map((prize) => prize.amount)).toEqual([
    'USD 1,000',
    'USD 500',
    'USD 500',
  ])
  expect(challenge.timeline).toHaveLength(5)
  expect(challenge.timeline.filter((milestone) => milestone.time)).toHaveLength(3)
  expect(challenge.resources).toEqual([
    { label: 'Dataset', status: 'coming-soon' },
    { label: 'Evaluation Portal', status: 'coming-soon' },
  ])
  expect(challengeOrganizers.map((person) => person.name)).toEqual([
    'Kai Li',
    'Ran Cheng',
    'Yan Shen',
    'Hao Dong',
  ])
  expect(challengeOrganizers.every((person) => person.institution === undefined)).toBe(
    true,
  )
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL during TypeScript transformation because `challenge` and
`challengeOrganizers` are not exported.

- [ ] **Step 3: Add the Challenge types and data**

In `src/data/workshop.ts`, make `Person.institution` optional:

```ts
export interface Person {
  name: string
  institution?: string
  image: string
  imageAlt: string
}
```

Add these interfaces after `SubmissionInfo`:

```ts
export interface ChallengeFact {
  value: string
  label: string
}

export interface ChallengeStage {
  step: string
  title: string
  description: string
}

export interface ChallengeTask {
  title: string
  description: string
}

export interface ChallengePrize {
  place: string
  amount: string
  recipient: string
  accent: 'primary' | 'secondary'
}

export interface ChallengeMilestone {
  label: string
  date: string
  time?: string
}

export interface ChallengeResource {
  label: string
  status: 'coming-soon'
}

export interface ChallengeInfo {
  eyebrow: string
  title: string
  sponsorLine: string
  introduction: string
  scoringNote: string
  facts: ChallengeFact[]
  stages: ChallengeStage[]
  tasks: ChallengeTask[]
  prizePoolTotal: string
  prizePoolNote: string
  prizes: ChallengePrize[]
  timeline: ChallengeMilestone[]
  resources: ChallengeResource[]
}
```

Append this source-of-truth content after `sponsor`:

```ts
export const challenge: ChallengeInfo = {
  eyebrow: 'Challenge Track · IROS 2026',
  title:
    'Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge',
  sponsorLine: 'Designed and sponsored by',
  introduction:
    'Designed and sponsored by PrimeBot, this challenge focuses on real-world bimanual manipulation in household environments. Participants will train on thousands of hours of real-robot teleoperation and UMI data spanning diverse household tasks, with the freedom to design their own data mixtures and training strategies.',
  scoringNote:
    'Final rankings will be determined by a combination of the online evaluation score and the final real-world evaluation score. Detailed scoring protocols will be announced before online evaluation opens.',
  facts: [
    { value: 'Thousands of hours', label: 'Real-world demonstrations' },
    { value: 'Teleoperation + UMI', label: 'Two complementary data sources' },
    { value: 'Up to 5 finalists', label: 'Selected for real-world evaluation' },
  ],
  stages: [
    {
      step: '01',
      title: 'Train',
      description:
        'Develop data mixtures and training strategies using the released datasets.',
    },
    {
      step: '02',
      title: 'Qualify Online',
      description: 'Submit models through the online evaluation portal.',
    },
    {
      step: '03',
      title: 'Evaluate in the Real World',
      description:
        'Up to five top-performing entries advance to organized real-world evaluations.',
    },
  ],
  tasks: [
    {
      title: 'Open the Washer Door',
      description:
        'Use the gripper to fully open the washing machine door.',
    },
    {
      title: 'Load the Washer',
      description: 'Place two pieces of clothing into the washing machine.',
    },
    {
      title: 'Close the Washer Door',
      description:
        'Use the gripper to close the washing machine door securely.',
    },
    {
      title: 'Fold Clothing',
      description: 'Unfold an item of clothing and fold it neatly.',
    },
  ],
  prizePoolTotal: 'USD 2,000',
  prizePoolNote: 'in total prizes',
  prizes: [
    {
      place: '1st Place',
      amount: 'USD 1,000',
      recipient: 'One winning team',
      accent: 'primary',
    },
    {
      place: '2nd Place',
      amount: 'USD 500',
      recipient: 'One winning team',
      accent: 'secondary',
    },
    {
      place: '3rd Place',
      amount: 'USD 500',
      recipient: 'One winning team',
      accent: 'secondary',
    },
  ],
  timeline: [
    {
      label: 'Sample Data Release',
      date: 'August 7, 2026',
      time: '11:59 PM AOE',
    },
    {
      label: 'Full Dataset Release',
      date: 'August 11, 2026',
      time: '11:59 PM AOE',
    },
    {
      label: 'Online Evaluation Opens',
      date: 'August 25, 2026',
      time: '11:59 PM AOE',
    },
    { label: 'First Real-World Evaluation', date: 'September 11, 2026' },
    { label: 'Final Real-World Evaluation', date: 'September 21, 2026' },
  ],
  resources: [
    { label: 'Dataset', status: 'coming-soon' },
    { label: 'Evaluation Portal', status: 'coming-soon' },
  ],
}

export const challengeOrganizers: Person[] = [
  {
    name: 'Kai Li',
    image: '/images/challenge-organizers/kai-li.jpg',
    imageAlt: 'Portrait of challenge organizer Kai Li',
  },
  {
    name: 'Ran Cheng',
    image: '/images/challenge-organizers/ran-cheng.jpg',
    imageAlt: 'Portrait of challenge organizer Ran Cheng',
  },
  {
    name: 'Yan Shen',
    image: '/images/organizers/yan-shen.jpg',
    imageAlt: 'Portrait of challenge organizer Yan Shen',
  },
  {
    name: 'Hao Dong',
    image: '/images/organizers/hao-dong.jpg',
    imageAlt: 'Portrait of challenge organizer Hao Dong',
  },
]
```

- [ ] **Step 4: Copy the two supplied official images into local assets**

Run:

```bash
mkdir -p public/images/challenge-organizers
cp '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/temp/RWTemp/2026-08/06d54b1171c52361f2d3f76f2b5cf4c9/4f78a17b821dfba5db343e98cbba90e8.jpg' public/images/challenge-organizers/kai-li.jpg
cp '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/temp/RWTemp/2026-08/06d54b1171c52361f2d3f76f2b5cf4c9/311033c309afd88c0e0b43aa316ff188.jpg' public/images/challenge-organizers/ran-cheng.jpg
sips -g pixelWidth -g pixelHeight public/images/challenge-organizers/kai-li.jpg public/images/challenge-organizers/ran-cheng.jpg
```

Expected: Kai Li reports 1279 × 1706 and Ran Cheng reports 831 × 1121.

- [ ] **Step 5: Run the structured-content test and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS, with all existing tests still passing.

- [ ] **Step 6: Commit the typed content and assets**

```bash
git add src/data/workshop.ts src/App.test.tsx public/images/challenge-organizers/kai-li.jpg public/images/challenge-organizers/ran-cheng.jpg
git commit -m "feat: add household challenge content"
```

### Task 2: Render the Challenge and Integrate It into the Landing Page

**Files:**
- Create: `src/components/ChallengeSection.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing order, content, prize, and resource-state tests**

Add these tests to `src/App.test.tsx`:

```tsx
it('places the Challenge between Call for Papers and Organizers', () => {
  render(<App />)

  const cfp = document.querySelector('#call-for-papers')
  const challengeSection = screen.getByTestId('challenge-section')
  const organizersSection = document.querySelector('#organizers')
  const challengeLink = screen.getByRole('link', { name: 'Challenge' })

  expect(cfp?.nextElementSibling).toBe(challengeSection)
  expect(challengeSection.nextElementSibling).toBe(organizersSection)
  expect(challengeLink).toHaveAttribute('href', '#challenge')
})

it('explains the Challenge evaluation flow and household tasks', () => {
  render(<App />)

  const section = screen.getByTestId('challenge-section')
  expect(
    within(section).getByRole('heading', { name: challenge.title, level: 2 }),
  ).toBeInTheDocument()
  expect(within(section).getAllByTestId('challenge-fact')).toHaveLength(3)
  expect(within(section).getAllByTestId('challenge-stage')).toHaveLength(3)
  expect(within(section).getAllByTestId('challenge-task')).toHaveLength(4)
  expect(within(section).getByText(challenge.scoringNote)).toBeInTheDocument()
})

it('features the complete Challenge Prize Pool without multiplier notation', () => {
  render(<App />)

  const prizePool = screen.getByTestId('challenge-prize-pool')
  expect(within(prizePool).getByText('USD 2,000')).toBeInTheDocument()
  expect(within(prizePool).getAllByTestId('challenge-prize')).toHaveLength(3)
  expect(within(prizePool).getByText('USD 1,000')).toBeInTheDocument()
  expect(within(prizePool).getAllByText('USD 500')).toHaveLength(2)
  expect(prizePool).not.toHaveTextContent('×')
})

it('renders five Challenge milestones and two non-interactive resource states', () => {
  render(<App />)

  const section = screen.getByTestId('challenge-section')
  const milestones = within(section).getAllByTestId('challenge-milestone')
  const resources = within(section).getAllByTestId('challenge-resource')

  expect(milestones).toHaveLength(5)
  expect(within(section).getAllByText('11:59 PM AOE')).toHaveLength(3)
  expect(resources).toHaveLength(2)
  for (const resource of resources) {
    expect(resource).toHaveTextContent('Coming Soon')
    expect(resource.closest('a, button')).toBeNull()
    expect(resource).not.toHaveAttribute('tabindex')
  }
})
```

Also add the official Challenge title to the primary-section array in the first
test. In the existing `uses accessible local portraits and safe external calls
to action` test, replace the single PrimeBot assertion with:

```tsx
const primeBotLinks = screen.getAllByRole('link', { name: /PrimeBot/i })
expect(primeBotLinks).toHaveLength(2)
for (const link of primeBotLinks) {
  expect(link).toHaveAttribute('href', 'https://www.primebot.cn/')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noreferrer')
}
```

This preserves the existing Awards sponsor link and adds the Challenge sponsor
link without making the regression test ambiguous.

- [ ] **Step 2: Run the new tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because `ChallengeSection`, `#challenge`, and the Challenge
navigation link do not exist.

- [ ] **Step 3: Create the semantic Challenge component**

Create `src/components/ChallengeSection.tsx`:

```tsx
import { ArrowUpRight } from 'lucide-react'
import { challenge, sponsor } from '../data/workshop'

export function ChallengeSection() {
  return (
    <section
      className="section section--challenge"
      id="challenge"
      aria-labelledby="challenge-title"
      data-testid="challenge-section"
    >
      <div className="challenge-grid" aria-hidden="true" />
      <div className="page-width challenge-content">
        <div className="section-heading challenge-heading">
          <p className="section-index">05 / Challenge Track</p>
          <div>
            <p className="eyebrow challenge-heading__eyebrow">{challenge.eyebrow}</p>
            <h2 id="challenge-title">{challenge.title}</h2>
            <p className="section-description">{challenge.introduction}</p>
            <p className="challenge-sponsor">
              {challenge.sponsorLine}{' '}
              <a href={sponsor.url} target="_blank" rel="noreferrer">
                {sponsor.name}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </p>
          </div>
        </div>

        <dl className="challenge-facts" aria-label="Challenge at a glance">
          {challenge.facts.map((fact) => (
            <div data-testid="challenge-fact" key={fact.value}>
              <dt>{fact.value}</dt>
              <dd>{fact.label}</dd>
            </div>
          ))}
        </dl>

        <section className="challenge-block" aria-labelledby="evaluation-title">
          <header className="challenge-block__heading">
            <p className="eyebrow">Evaluation pipeline</p>
            <h3 id="evaluation-title">From released data to real-world deployment</h3>
          </header>
          <ol className="challenge-flow">
            {challenge.stages.map((stage) => (
              <li data-testid="challenge-stage" key={stage.step}>
                <span>{stage.step}</span>
                <h4>{stage.title}</h4>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
          <p className="challenge-scoring-note">{challenge.scoringNote}</p>
        </section>

        <section className="challenge-block" aria-labelledby="tasks-title">
          <header className="challenge-block__heading">
            <p className="eyebrow">Real-world evaluation scope</p>
            <h3 id="tasks-title">Household manipulation tasks</h3>
          </header>
          <div className="challenge-task-grid">
            {challenge.tasks.map((task, index) => (
              <article data-testid="challenge-task" key={task.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="challenge-prize-pool"
          aria-labelledby="challenge-prize-title"
          data-testid="challenge-prize-pool"
        >
          <div className="challenge-prize-pool__grid" aria-hidden="true" />
          <header>
            <p className="eyebrow">Challenge Prize Pool</p>
            <h3 id="challenge-prize-title">{challenge.prizePoolTotal}</h3>
            <p>{challenge.prizePoolNote}</p>
          </header>
          <div className="challenge-prize-grid">
            {challenge.prizes.map((prize) => (
              <article
                data-accent={prize.accent}
                data-testid="challenge-prize"
                key={prize.place}
              >
                <h4>{prize.place}</h4>
                <strong>{prize.amount}</strong>
                <p>{prize.recipient}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="challenge-timeline" aria-labelledby="challenge-timeline-title">
          <header className="challenge-block__heading">
            <p className="eyebrow">Important dates</p>
            <h3 id="challenge-timeline-title">Challenge timeline</h3>
          </header>
          <ol>
            {challenge.timeline.map((milestone, index) => (
              <li data-testid="challenge-milestone" key={milestone.label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{milestone.label}</h4>
                  <p>
                    {milestone.date}
                    {milestone.time && <b> · {milestone.time}</b>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="challenge-resources" aria-label="Challenge resources">
            {challenge.resources.map((resource) => (
              <div data-testid="challenge-resource" key={resource.label}>
                <span>{resource.label}</span>
                <b>Coming Soon</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Wire navigation and page order**

In `src/App.tsx`, import the new component:

```tsx
import { ChallengeSection } from './components/ChallengeSection'
```

Add this navigation entry before Organizers:

```ts
{ label: 'Challenge', href: '#challenge' },
```

Render `<ChallengeSection />` immediately after the closing `</section>` of
`#call-for-papers` and before `#organizers`. Change the organizer index from
`05 / Team` to `06 / Team`.

- [ ] **Step 5: Run the component tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS. Styling is intentionally incomplete until Task 4.

- [ ] **Step 6: Commit the semantic Challenge section**

```bash
git add src/components/ChallengeSection.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: render household challenge track"
```

### Task 3: Add the Challenge Organizer Subsection

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing Challenge Organizer tests**

Add:

```tsx
it('shows four Challenge Organizers after the Workshop Organizers without affiliations', () => {
  render(<App />)

  const workshopGrid = screen.getAllByTestId('organizer-card')[0].parentElement
  const challengeTeam = screen.getByTestId('challenge-organizers')
  const cards = within(challengeTeam).getAllByTestId('challenge-organizer-card')

  expect(workshopGrid?.nextElementSibling).toBe(challengeTeam)
  expect(cards).toHaveLength(4)
  expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual([
    'Kai Li',
    'Ran Cheng',
    'Yan Shen',
    'Hao Dong',
  ])
  for (const card of cards) {
    expect(card.querySelector('.person-card__copy p')).toBeNull()
  }
})
```

Update the existing people-count test to continue expecting 5 speaker cards and
7 Workshop organizer cards, then separately expect 4 Challenge organizer cards.
Update the local portrait count from 12 to 16.

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because `challenge-organizers` is not rendered.

- [ ] **Step 3: Extend the existing PersonCard without duplicating it**

Import `challengeOrganizers` in `src/App.tsx`. Change the `kind` type to:

```tsx
kind: 'speaker' | 'organizer' | 'challenge-organizer'
```

Render affiliations conditionally:

```tsx
<div className="person-card__copy">
  <h3>{person.name}</h3>
  {person.institution && <p>{person.institution}</p>}
</div>
```

After `.organizer-grid`, add:

```tsx
<section
  className="challenge-organizers"
  aria-labelledby="challenge-organizers-title"
  data-testid="challenge-organizers"
>
  <header>
    <p className="eyebrow">Challenge team</p>
    <h3 id="challenge-organizers-title">Challenge Organizers</h3>
    <p>
      The team coordinating the challenge, data release, and real-world evaluation.
    </p>
  </header>
  <div className="challenge-organizer-grid">
    {challengeOrganizers.map((organizer) => (
      <PersonCard
        key={organizer.name}
        person={organizer}
        kind="challenge-organizer"
      />
    ))}
  </div>
</section>
```

- [ ] **Step 4: Run organizer tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS with 5 speakers, 7 Workshop Organizers, 4 Challenge Organizers,
and 16 accessible local portrait images.

- [ ] **Step 5: Commit organizer behavior**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: add challenge organizers"
```

### Task 4: Implement the Approved Challenge Visual System

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing visual-contract tests**

Add:

```tsx
it('uses the approved light Challenge field and prominent dark Prize Pool', () => {
  const sectionRule = appStyles.match(/\.section--challenge\s*\{([^}]*)\}/)?.[1]
  const factsRule = appStyles.match(/\.challenge-facts\s*\{([^}]*)\}/)?.[1]
  const taskRule = appStyles.match(/\.challenge-task-grid\s*\{([^}]*)\}/)?.[1]
  const prizePoolRule = appStyles.match(
    /\.challenge-prize-pool\s*\{([^}]*)\}/,
  )?.[1]
  const prizeGridRule = appStyles.match(
    /\.challenge-prize-grid\s*\{([^}]*)\}/,
  )?.[1]
  const teamGridRule = appStyles.match(
    /\.challenge-organizer-grid\s*\{([^}]*)\}/,
  )?.[1]

  expect(sectionRule).toContain('background: var(--paper-soft);')
  expect(factsRule).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
  expect(taskRule).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));')
  expect(prizePoolRule).toContain('background: var(--ink-950);')
  expect(prizeGridRule).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
  expect(teamGridRule).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));')
})
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because the Challenge selectors are absent.

- [ ] **Step 3: Add the base Challenge styles**

Insert the following block before `.section--organizers` in `src/App.css`:

```css
.section--challenge {
  overflow: hidden;
  background: var(--paper-soft);
}

.challenge-grid {
  position: absolute;
  inset: 0;
  opacity: 0.42;
  background-image:
    linear-gradient(rgba(8, 116, 135, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(8, 116, 135, 0.08) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(180deg, #000, transparent 70%);
  pointer-events: none;
}

.challenge-content {
  position: relative;
}

.challenge-heading h2 {
  max-width: 980px;
}

.challenge-heading__eyebrow {
  margin-bottom: 12px;
  color: var(--cyan-deep);
}

.challenge-heading .section-description {
  max-width: 900px;
}

.challenge-sponsor {
  display: flex;
  margin: 22px 0 0;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 7px;
  color: var(--slate-readable);
  font-weight: 600;
}

.challenge-sponsor a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--orange-deep);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  text-decoration: none;
}

.challenge-facts {
  display: grid;
  padding: 0;
  margin: 0 0 32px 180px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid var(--line-light);
  border-radius: 7px;
}

.challenge-facts > div {
  padding: 24px;
  border-right: 1px solid var(--line-light);
}

.challenge-facts > div:last-child {
  border-right: 0;
}

.challenge-facts dt {
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  font-weight: 650;
  letter-spacing: -0.035em;
}

.challenge-facts dd {
  margin: 7px 0 0;
  color: var(--slate-readable);
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.5;
}

.challenge-block,
.challenge-timeline {
  padding: clamp(28px, 4vw, 42px);
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid var(--line-light);
  border-radius: 7px;
}

.challenge-block__heading {
  margin-bottom: 28px;
}

.challenge-block__heading .eyebrow {
  margin-bottom: 8px;
  color: var(--cyan-deep);
}

.challenge-block__heading h3 {
  max-width: 760px;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.1;
  text-wrap: balance;
}

.challenge-flow {
  display: grid;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  list-style: none;
}

.challenge-flow li,
.challenge-task-grid article {
  position: relative;
  padding: 24px;
  background: rgba(8, 25, 43, 0.035);
  border: 1px solid rgba(8, 25, 43, 0.1);
  border-radius: 5px;
}

.challenge-flow li > span,
.challenge-task-grid article > span {
  color: var(--cyan-deep);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.challenge-flow h4,
.challenge-task-grid h4 {
  margin: 24px 0 10px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 650;
  letter-spacing: -0.025em;
}

.challenge-flow p,
.challenge-task-grid p {
  margin: 0;
  color: var(--slate-readable);
  font-size: 0.94rem;
  font-weight: 500;
  line-height: 1.65;
}

.challenge-scoring-note {
  margin: 18px 0 0;
  padding: 20px 22px;
  color: var(--ink-800);
  background: rgba(82, 216, 230, 0.12);
  border-left: 3px solid var(--cyan-deep);
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.65;
}

.challenge-task-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.challenge-prize-pool {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(34px, 5vw, 54px);
  margin-bottom: 32px;
  color: var(--white);
  background: var(--ink-950);
  border: 1px solid rgba(82, 216, 230, 0.22);
  border-radius: 7px;
}

.challenge-prize-pool__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(82, 216, 230, 0.19) 1px, transparent 1px),
    linear-gradient(90deg, rgba(82, 216, 230, 0.19) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(90deg, #000, transparent 80%);
}

.challenge-prize-pool > header {
  margin-bottom: 30px;
}

.challenge-prize-pool > header .eyebrow {
  color: var(--cyan);
}

.challenge-prize-pool > header h3 {
  margin: 8px 0 4px;
  color: var(--orange);
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.95;
}

.challenge-prize-pool > header > p:last-child {
  margin: 0;
  color: var(--slate-light-readable);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.challenge-prize-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.challenge-prize-grid article {
  padding: 26px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  box-shadow: inset 0 3px 0 var(--cyan);
}

.challenge-prize-grid article[data-accent='primary'] {
  box-shadow: inset 0 3px 0 var(--orange);
}

.challenge-prize-grid h4 {
  margin: 0 0 28px;
  color: var(--slate-light-readable);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.challenge-prize-grid strong {
  display: block;
  color: var(--orange);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.6vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.055em;
  line-height: 1;
  white-space: nowrap;
}

.challenge-prize-grid p {
  margin: 12px 0 0;
  color: var(--slate-light-readable);
  font-size: 0.86rem;
  font-weight: 500;
}

.challenge-timeline > ol {
  display: grid;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  list-style: none;
}

.challenge-timeline > ol li {
  display: grid;
  padding: 0 18px;
  grid-template-rows: auto 1fr;
  border-left: 1px solid var(--line-light);
  gap: 14px;
}

.challenge-timeline > ol li:first-child {
  padding-left: 0;
  border-left: 0;
}

.challenge-timeline > ol li > span {
  color: var(--orange-deep);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
}

.challenge-timeline h4 {
  min-height: 42px;
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: 0.96rem;
  line-height: 1.35;
}

.challenge-timeline li p {
  margin: 0;
  color: var(--slate-readable);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.55;
}

.challenge-timeline li p b {
  color: var(--cyan-deep);
  font-weight: 700;
}

.challenge-resources {
  display: grid;
  margin-top: 30px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.challenge-resources > div {
  display: flex;
  padding: 16px 18px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--slate-readable);
  background: rgba(8, 25, 43, 0.04);
  border: 1px dashed rgba(8, 25, 43, 0.2);
  border-radius: 5px;
}

.challenge-resources span {
  font-weight: 650;
}

.challenge-resources b {
  color: var(--cyan-deep);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.challenge-organizers {
  margin-top: 72px;
  padding-top: 52px;
  border-top: 1px solid var(--line-light);
}

.challenge-organizers > header {
  max-width: 760px;
  margin-bottom: 30px;
}

.challenge-organizers > header .eyebrow {
  margin-bottom: 8px;
  color: var(--cyan-deep);
}

.challenge-organizers > header h3 {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  letter-spacing: -0.045em;
}

.challenge-organizers > header > p:last-child {
  margin: 0;
  color: var(--slate-readable);
  font-size: 1rem;
  line-height: 1.65;
}

.challenge-organizer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.person-card--challenge-organizer {
  display: grid;
  grid-template-columns: 104px 1fr;
  align-items: center;
  background: rgba(255, 255, 255, 0.54);
  border: 1px solid var(--line-light);
  border-radius: 7px;
}

.person-card--challenge-organizer .person-card__media {
  aspect-ratio: 0.84;
  border-radius: 6px 0 0 6px;
}

.person-card--challenge-organizer .person-card__copy {
  padding: 18px;
}
```

- [ ] **Step 4: Run visual-contract tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the desktop visual system**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: design challenge track and prize pool"
```

### Task 5: Add Responsive Contracts and Mobile Layouts

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write a failing responsive-contract test**

Add:

```tsx
it('stacks Challenge content safely on narrow screens', () => {
  const mobileStart = appStyles.indexOf('@media (max-width: 720px)')
  const compactStart = appStyles.indexOf('@media (max-width: 480px)', mobileStart)
  const mobileMedia = appStyles.slice(mobileStart, compactStart)
  const stackedRule = mobileMedia.match(
    /\.challenge-facts,\s*\.challenge-flow,\s*\.challenge-task-grid,\s*\.challenge-prize-grid,\s*\.challenge-timeline > ol,\s*\.challenge-resources,\s*\.challenge-organizer-grid\s*\{([^}]*)\}/,
  )?.[1]

  expect(mobileStart).toBeGreaterThanOrEqual(0)
  expect(compactStart).toBeGreaterThan(mobileStart)
  expect(stackedRule).toContain('grid-template-columns: 1fr;')
})
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because the mobile Challenge overrides are absent.

- [ ] **Step 3: Add tablet and mobile overrides**

Inside `@media (max-width: 920px)`, add:

```css
  .challenge-facts {
    margin-left: 0;
  }

  .challenge-timeline > ol {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 24px;
  }

  .challenge-timeline > ol li:nth-child(4) {
    padding-left: 0;
    border-left: 0;
  }
```

Inside `@media (max-width: 720px)`, add:

```css
  .challenge-facts,
  .challenge-flow,
  .challenge-task-grid,
  .challenge-prize-grid,
  .challenge-timeline > ol,
  .challenge-resources,
  .challenge-organizer-grid {
    grid-template-columns: 1fr;
  }

  .challenge-facts > div {
    border-right: 0;
    border-bottom: 1px solid var(--line-light);
  }

  .challenge-facts > div:last-child {
    border-bottom: 0;
  }

  .challenge-timeline > ol {
    gap: 0;
  }

  .challenge-timeline > ol li,
  .challenge-timeline > ol li:nth-child(4) {
    padding: 18px 0;
    grid-template-columns: 38px minmax(0, 1fr);
    grid-template-rows: auto;
    border-top: 1px solid var(--line-light);
    border-left: 0;
    gap: 12px;
  }

  .challenge-timeline > ol li:first-child {
    padding-top: 0;
    border-top: 0;
  }

  .challenge-timeline h4 {
    min-height: 0;
  }

  .person-card--challenge-organizer {
    grid-template-columns: 112px 1fr;
  }
```

Inside `@media (max-width: 480px)`, add:

```css
  .challenge-block,
  .challenge-timeline,
  .challenge-prize-pool {
    padding: 26px 22px;
  }

  .challenge-sponsor {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .challenge-resources > div {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
```

- [ ] **Step 4: Run responsive tests and verify GREEN**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit responsive behavior**

```bash
git add src/App.css src/App.test.tsx
git commit -m "style: make challenge track responsive"
```

### Task 6: Complete Verification and Local Visual Acceptance

**Files:**
- Modify only if verification exposes a scoped defect: `src/App.tsx`, `src/components/ChallengeSection.tsx`, `src/App.css`, `src/App.test.tsx`, or `src/data/workshop.ts`

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass, lint exits 0, and Vite completes a production build
without TypeScript or missing-asset errors.

- [ ] **Step 2: Start a local production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite prints a local preview URL, normally `http://127.0.0.1:4173/`.

- [ ] **Step 3: Inspect desktop, tablet, and mobile layouts**

At 1440 px, 768 px, and 390 px verify:

- CFP ends cleanly before the light Challenge section.
- The official title wraps without orphaned one- or two-word lines.
- Facts, flow, tasks, Prize Pool, timeline, and resource states have a clear
  reading order.
- `USD 2,000` is the dominant Prize Pool element, and the three prizes are equal
  width at desktop/tablet.
- The Prize Pool is not mistaken for Workshop paper Awards.
- Kai Li's illustration and the three photographic portraits remain deliberate
  and consistently framed.
- There is no horizontal overflow or clipped text.

- [ ] **Step 4: Inspect accessibility behavior**

Use keyboard navigation to confirm:

- The new Challenge navigation link is reachable and closes the mobile menu.
- PrimeBot has a visible focus indicator and opens safely in a new tab.
- Coming Soon resources never receive focus.
- Heading order is one Challenge `h2`, then descriptive `h3` headings and card
  `h4` headings.
- Reduced-motion mode removes hover/transition movement as inherited from the
  global rule.

- [ ] **Step 5: Commit any verification-only correction**

If Step 3 or 4 required a scoped correction, run the three commands from Step 1
again, then commit only the corrected files:

```bash
git add src/App.tsx src/components/ChallengeSection.tsx src/App.css src/App.test.tsx src/data/workshop.ts
git commit -m "fix: polish challenge track presentation"
```

If no correction was required, do not create an empty commit.

- [ ] **Step 6: Hand off the local preview for user acceptance**

Report the preview URL and summarize the exact sections added. Do not push to
GitHub until the user has reviewed the local version and explicitly requests a
push.
