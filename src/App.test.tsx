import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import appStyles from './App.css?raw'
import indexStyles from './index.css?raw'
import { challenge, challengeOrganizers, workshopMeta } from './data/workshop'

const findClosingBrace = (source: string, openingBrace: number) => {
  let depth = 1
  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') depth -= 1
    if (depth === 0) return index
  }

  throw new Error('Unclosed CSS block')
}

const extractCssBlock = (source: string, marker: string) => {
  const markerStart = source.indexOf(marker)
  expect(markerStart).toBeGreaterThanOrEqual(0)

  const openingBrace = source.indexOf('{', markerStart + marker.length)
  expect(openingBrace).toBeGreaterThan(markerStart)
  const closingBrace = findClosingBrace(source, openingBrace)

  return source.slice(openingBrace + 1, closingBrace)
}

const extractCssRules = (source: string, selector: string) => {
  let cursor = 0
  const matches: Array<{ declarations: string; selectors: string[] }> = []

  while (cursor < source.length) {
    const openingBrace = source.indexOf('{', cursor)
    if (openingBrace === -1) break

    const selectorText = source.slice(cursor, openingBrace).trim()
    const closingBrace = findClosingBrace(source, openingBrace)
    const declarations = source.slice(openingBrace + 1, closingBrace)
    const selectors = selectorText.split(',').map((item) => item.trim())

    if (selectors.includes(selector)) matches.push({ declarations, selectors })
    cursor = closingBrace + 1
  }

  if (matches.length === 0) throw new Error(`Missing CSS rule for ${selector}`)
  return matches
}

const extractCssRule = (source: string, selector: string) =>
  extractCssRules(source, selector)[0]

describe('workshop landing page', () => {
  it('defines the complete household manipulation challenge content', () => {
    expect(challenge.title).toBe(
      'Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge',
    )
    expect(challenge.facts).toHaveLength(3)
    expect(challenge.stages).toEqual([
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
    ])
    expect(challenge.tasks).toEqual([
      {
        title: 'Open the Washer Door',
        description: 'Use the gripper to fully open the washing machine door.',
      },
      {
        title: 'Load the Washer',
        description: 'Place two pieces of clothing into the washing machine.',
      },
      {
        title: 'Close the Washer Door',
        description: 'Use the gripper to close the washing machine door securely.',
      },
      {
        title: 'Fold Clothing',
        description: 'Unfold an item of clothing and fold it neatly.',
      },
    ])
    expect(challenge.prizePoolTotal).toBe('USD 2,000')
    expect(challenge.prizes).toEqual([
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
    ])
    expect(challenge.timeline).toEqual([
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
      {
        label: 'First Real-World Evaluation',
        date: 'September 11, 2026',
      },
      {
        label: 'Final Real-World Evaluation',
        date: 'September 21, 2026',
      },
    ])
    expect(challenge.timeline.filter(({ time }) => time)).toHaveLength(3)
    expect(challenge.resources).toEqual([
      { label: 'Dataset', status: 'coming-soon' },
      { label: 'Evaluation Portal', status: 'coming-soon' },
    ])
    expect(challengeOrganizers.map(({ name }) => name)).toEqual([
      'Kai Li',
      'Ran Cheng',
      'Yan Shen',
      'Hao Dong',
    ])
    expect(
      challengeOrganizers.every(({ institution }) => institution === undefined),
    ).toBe(true)
  })

  it('renders the workshop identity and every primary section', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /Scaling vs\. Structure\?/i, level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Workshop @ IROS 2026')).toBeInTheDocument()
    expect(screen.getAllByText(/8:00 AM–12:30 PM EDT/)).not.toHaveLength(0)
    expect(document.querySelectorAll('.hero__axis')).toHaveLength(0)

    for (const section of [
      'Introduction',
      'Workshop Schedule',
      'Invited Speakers',
      'Call for Papers',
      'Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge',
      'Workshop Organizers',
    ]) {
      expect(screen.getByRole('heading', { name: section })).toBeInTheDocument()
    }
  })

  it('places the Challenge between Call for Papers and Organizers', () => {
    render(<App />)

    const callForPapers = document.querySelector('#call-for-papers')
    const challengeSection = screen.getByTestId('challenge-section')
    const organizers = document.querySelector('#organizers')

    expect(callForPapers?.nextElementSibling).toBe(challengeSection)
    expect(challengeSection.nextElementSibling).toBe(organizers)
    const primaryNav = screen.getByRole('navigation', { name: 'Primary navigation' })
    const primaryLinks = within(primaryNav).getAllByRole('link')
    const challengeLink = within(primaryNav).getByRole('link', { name: 'Challenge' })
    const organizerLink = within(primaryNav).getByRole('link', { name: 'Organizers' })

    expect(challengeLink).toHaveAttribute('href', '#challenge')
    expect(primaryLinks.indexOf(challengeLink) + 1).toBe(
      primaryLinks.indexOf(organizerLink),
    )
  })

  it('explains the Challenge evaluation flow and household tasks', () => {
    render(<App />)

    const challengeSection = screen.getByTestId('challenge-section')

    expect(
      within(challengeSection).getByRole('heading', {
        name: challenge.title,
        level: 2,
      }),
    ).toBeInTheDocument()
    expect(within(challengeSection).getAllByTestId('challenge-fact')).toHaveLength(3)

    const stages = within(challengeSection).getAllByTestId('challenge-stage')
    expect(stages).toHaveLength(3)
    for (const [index, expectedStage] of challenge.stages.entries()) {
      expect(
        within(stages[index]).getByRole('heading', {
          name: expectedStage.title,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(within(stages[index]).getByText(expectedStage.description)).toBeVisible()
    }

    const tasks = within(challengeSection).getAllByTestId('challenge-task')
    expect(tasks).toHaveLength(4)
    for (const [index, expectedTask] of challenge.tasks.entries()) {
      expect(
        within(tasks[index]).getByRole('heading', {
          name: expectedTask.title,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(within(tasks[index]).getByText(expectedTask.description)).toBeVisible()
    }

    expect(within(challengeSection).getByText(challenge.scoringNote)).toBeVisible()
  })

  it('uses definition semantics for Challenge fact labels and values', () => {
    render(<App />)

    const facts = screen.getAllByTestId('challenge-fact')
    const expectedFacts = [
      { label: 'Real-world demonstrations', value: 'Thousands of hours' },
      {
        label: 'Two complementary data sources',
        value: 'Teleoperation + UMI',
      },
      { label: 'Selected for real-world evaluation', value: 'Up to 5 finalists' },
    ]

    expect(facts).toHaveLength(expectedFacts.length)
    for (const [index, expectedFact] of expectedFacts.entries()) {
      expect(facts[index].querySelector('dt')).toHaveTextContent(expectedFact.label)
      expect(facts[index].querySelector('dd')).toHaveTextContent(expectedFact.value)
    }
  })

  it('uses the approved light Challenge field and prominent dark Prize Pool', () => {
    const stylesheet = document.createElement('style')
    stylesheet.textContent = appStyles
    document.head.append(stylesheet)
    render(<App />)

    const styleFor = (selector: string) => {
      const element = document.querySelector(selector)
      expect(element).not.toBeNull()
      return getComputedStyle(element as Element)
    }
    const expectGridColumns = (selector: string, count: number) => {
      const style = styleFor(selector)
      expect(style.display).toBe('grid')
      expect(style.gridTemplateColumns.replace(/\s+/g, '')).toBe(
        `repeat(${count},minmax(0,1fr))`,
      )
    }

    expect(styleFor('.section--challenge').background).toBe('var(--paper-soft)')
    expect(styleFor('.challenge-prize-pool').background).toBe('var(--ink-950)')
    expectGridColumns('.challenge-facts', 3)
    expectGridColumns('.challenge-flow', 3)
    expectGridColumns('.challenge-task-grid', 2)
    expectGridColumns('.challenge-prize-grid', 3)
    expectGridColumns('.challenge-timeline > ol', 5)
    expectGridColumns('.challenge-resources', 2)
    expectGridColumns('.challenge-organizer-grid', 2)
    expect(styleFor('.challenge-prize-pool > header h3').color).toBe(
      'var(--orange)',
    )
    expect(styleFor('.challenge-sponsor a').color).toBe('var(--orange-deep)')
    stylesheet.remove()
  })

  it('adapts the Challenge layout across tablet, mobile, and compact breakpoints', () => {
    const tabletMedia = extractCssBlock(appStyles, '@media (max-width: 920px)')
    const mobileMedia = extractCssBlock(appStyles, '@media (max-width: 720px)')
    const compactMedia = extractCssBlock(appStyles, '@media (max-width: 480px)')

    expect(extractCssRule(tabletMedia, '.challenge-facts').declarations).toContain(
      'margin-left: 0;',
    )
    const tabletTimeline = extractCssRule(
      tabletMedia,
      '.challenge-timeline > ol',
    ).declarations
    expect(tabletTimeline).toContain(
      'grid-template-columns: repeat(3, minmax(0, 1fr));',
    )
    expect(tabletTimeline).toContain('row-gap: 24px;')
    const tabletFourthMilestone = extractCssRule(
      tabletMedia,
      '.challenge-timeline li:nth-child(4)',
    ).declarations
    expect(tabletFourthMilestone).toContain('padding-left: 0;')
    expect(tabletFourthMilestone).toContain('border-left: 0;')

    const mobileStack = extractCssRule(mobileMedia, '.challenge-facts')
    expect(mobileStack.selectors).toEqual(
      expect.arrayContaining([
        '.challenge-facts',
        '.challenge-flow',
        '.challenge-task-grid',
        '.challenge-prize-grid',
        '.challenge-timeline > ol',
        '.challenge-resources',
        '.challenge-organizer-grid',
      ]),
    )
    expect(mobileStack.declarations).toContain('grid-template-columns: 1fr;')

    const mobileFact = extractCssRule(
      mobileMedia,
      '.challenge-facts > div',
    ).declarations
    expect(mobileFact).toContain('border-right: 0;')
    expect(mobileFact).toContain('border-bottom: 1px solid var(--line-light);')

    const mobileTimeline = extractCssRules(mobileMedia, '.challenge-timeline > ol')
      .map(({ declarations }) => declarations)
      .join('\n')
    expect(mobileTimeline).toContain('gap: 0;')
    const mobileMilestoneRule = extractCssRule(
      mobileMedia,
      '.challenge-timeline li',
    )
    expect(mobileMilestoneRule.selectors).toContain(
      '.challenge-timeline li:nth-child(4)',
    )
    const mobileMilestone = mobileMilestoneRule.declarations
    expect(mobileMilestone).toContain('padding: 18px 0;')
    expect(mobileMilestone).toContain(
      'grid-template-columns: 38px minmax(0, 1fr);',
    )
    expect(mobileMilestone).toContain('grid-template-rows: auto auto;')
    expect(mobileMilestone).toContain('border-top: 1px solid var(--line-light);')
    expect(mobileMilestone).toContain('border-left: 0;')
    expect(mobileMilestone).toContain('gap: 12px;')
    const mobileFirstMilestone = extractCssRule(
      mobileMedia,
      '.challenge-timeline li:first-child',
    ).declarations
    expect(mobileFirstMilestone).toContain('padding-top: 0;')
    expect(mobileFirstMilestone).toContain('border-top: 0;')
    expect(
      extractCssRules(mobileMedia, '.challenge-timeline h4')
        .map(({ declarations }) => declarations)
        .join('\n'),
    ).toContain('min-height: 0;')
    expect(
      extractCssRule(mobileMedia, '.person-card--challenge-organizer').declarations,
    ).toContain('grid-template-columns: 112px minmax(0, 1fr);')

    const compactPanels = extractCssRule(compactMedia, '.challenge-block')
    expect(compactPanels.selectors).toEqual(
      expect.arrayContaining([
        '.challenge-block',
        '.challenge-timeline',
        '.challenge-prize-pool',
      ]),
    )
    expect(compactPanels.declarations).toContain('padding: 26px 22px;')
    const compactSponsor = extractCssRule(
      compactMedia,
      '.challenge-sponsor',
    ).declarations
    expect(compactSponsor).toContain('align-items: flex-start;')
    expect(compactSponsor).toContain('flex-direction: column;')
    expect(compactSponsor).toContain('gap: 3px;')
    const compactResources = extractCssRule(
      compactMedia,
      '.challenge-resources > div',
    ).declarations
    expect(compactResources).toContain('align-items: flex-start;')
    expect(compactResources).toContain('flex-direction: column;')
    expect(compactResources).toContain('gap: 5px;')
  })

  it('hides decorative Challenge sequence numerals from assistive technology', () => {
    render(<App />)

    const sequenceCards = [
      ...screen.getAllByTestId('challenge-stage'),
      ...screen.getAllByTestId('challenge-task'),
      ...screen.getAllByTestId('challenge-milestone'),
    ]

    expect(sequenceCards).toHaveLength(12)
    for (const card of sequenceCards) {
      expect(card.querySelector(':scope > span')).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('features the complete Challenge Prize Pool without multiplier notation', () => {
    render(<App />)

    const prizePool = screen.getByTestId('challenge-prize-pool')

    expect(within(prizePool).getByText('USD 2,000')).toBeInTheDocument()
    const prizes = within(prizePool).getAllByTestId('challenge-prize')
    expect(prizes).toHaveLength(3)
    for (const [index, expectedPrize] of challenge.prizes.entries()) {
      expect(
        within(prizes[index]).getByRole('heading', {
          name: expectedPrize.place,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(within(prizes[index]).getByText(expectedPrize.amount)).toBeVisible()
      expect(within(prizes[index]).getByText(expectedPrize.recipient)).toBeVisible()
    }
    expect(within(prizePool).getAllByText('USD 1,000')).toHaveLength(1)
    expect(within(prizePool).getAllByText('USD 500')).toHaveLength(2)
    expect(prizePool).not.toHaveTextContent('×')
  })

  it('renders five Challenge milestones and two non-interactive resource states', () => {
    render(<App />)

    const challengeSection = screen.getByTestId('challenge-section')
    const milestones = within(challengeSection).getAllByTestId('challenge-milestone')
    const resources = within(challengeSection).getAllByTestId('challenge-resource')

    expect(milestones).toHaveLength(5)
    for (const [index, expectedMilestone] of challenge.timeline.entries()) {
      const milestone = milestones[index]

      expect(
        within(milestone).getByRole('heading', {
          name: expectedMilestone.label,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(milestone).toHaveTextContent(expectedMilestone.date)
      if (expectedMilestone.time) {
        expect(within(milestone).getByText(new RegExp(expectedMilestone.time))).toBeVisible()
      } else {
        expect(milestone).not.toHaveTextContent('AOE')
      }
    }
    expect(challengeSection.textContent?.match(/11:59 PM AOE/g)).toHaveLength(3)
    expect(resources).toHaveLength(2)
    for (const resource of resources) {
      expect(within(resource).getByText('Coming Soon')).toBeInTheDocument()
      expect(resource.closest('a, button')).toBeNull()
      expect(resource).not.toHaveAttribute('tabindex')
    }
  })

  it('renders all people and the complete schedule from structured content', () => {
    render(<App />)

    expect(screen.getAllByTestId('speaker-card')).toHaveLength(5)
    expect(screen.getAllByTestId('organizer-card')).toHaveLength(7)
    expect(screen.getAllByTestId('challenge-organizer-card')).toHaveLength(4)

    const scheduleTable = screen.getByRole('table', {
      name: 'IROS 2026 workshop schedule',
    })
    expect(within(scheduleTable).getAllByRole('row')).toHaveLength(11)
    expect(within(scheduleTable).getAllByText('Tentative')).toHaveLength(2)
    expect(within(scheduleTable).getAllByText('Pending')).toHaveLength(3)
  })

  it('shows four Challenge Organizers after the Workshop Organizers without affiliations', () => {
    render(<App />)

    const workshopOrganizerGrid =
      screen.getAllByTestId('organizer-card')[0].parentElement
    const challengeOrganizerSection = screen.getByTestId('challenge-organizers')
    const challengeOrganizerCards = within(challengeOrganizerSection).getAllByTestId(
      'challenge-organizer-card',
    )
    const expectedOrganizers = [
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

    expect(workshopOrganizerGrid).not.toBeNull()
    expect(
      within(screen.getAllByTestId('organizer-card')[0]).getByRole('heading', {
        name: 'Yan Shen',
        level: 3,
      }),
    ).toBeInTheDocument()
    expect(workshopOrganizerGrid?.nextElementSibling).toBe(challengeOrganizerSection)
    expect(challengeOrganizerCards).toHaveLength(4)
    for (const [index, expectedOrganizer] of expectedOrganizers.entries()) {
      const card = challengeOrganizerCards[index]

      expect(
        within(card).getByRole('heading', {
          name: expectedOrganizer.name,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(card.querySelector('.person-card__copy p')).toBeNull()
      expect(within(card).getByRole('img')).toHaveAttribute(
        'src',
        expectedOrganizer.image,
      )
      expect(within(card).getByRole('img')).toHaveAttribute(
        'alt',
        expectedOrganizer.imageAlt,
      )
    }
  })

  it('uses square invited-speaker cards with airy column spacing', () => {
    const speakerGridRule = appStyles.match(/\.speaker-grid\s*\{([^}]*)\}/)?.[1]
    const speakerMediaRule = appStyles.match(
      /\.person-card--speaker\s+\.person-card__media\s*\{([^}]*)\}/,
    )?.[1]

    expect(speakerGridRule).toContain('width: min(100%, 812px);')
    expect(speakerGridRule).toContain('column-gap: 72px;')
    expect(speakerGridRule).toContain('row-gap: 32px;')
    expect(speakerMediaRule).toContain('aspect-ratio: 1;')
    expect(appStyles).toContain('column-gap: 36px;')
    expect(appStyles).not.toContain('row-gap: 72px;')
    expect(appStyles).not.toContain('row-gap: 56px;')
  })

  it('uses the approved left-aligned badge geometry and readable CFP topic text', () => {
    const tabletMedia = appStyles.match(
      /@media \(max-width: 920px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 720px\)/,
    )?.[1]
    const mobileMedia = appStyles.match(
      /@media \(max-width: 480px\) \{([\s\S]*?)\n\}\s*$/,
    )?.[1]
    const heroIdentityRule = appStyles.match(/\.hero__identity\s*\{([^}]*)\}/)?.[1]
    const conferenceBrandRule = appStyles.match(
      /\.hero__conference-brand\s*\{([^}]*)\}/,
    )?.[1]
    const tabletConferenceBrandRule = tabletMedia?.match(
      /\.hero__conference-brand\s*\{([^}]*)\}/,
    )?.[1]
    const mobileConferenceBrandRule = mobileMedia?.match(
      /\.hero__conference-brand\s*\{([^}]*)\}/,
    )?.[1]
    const heroEyebrowRule = appStyles.match(/\.hero__eyebrow\s*\{([^}]*)\}/)?.[1]
    const heroSubtitleRule = appStyles.match(/\.hero__subtitle\s*\{([^}]*)\}/)?.[1]
    const topicItemRule = appStyles.match(/\.topic-card li\s*\{([^}]*)\}/)?.[1]

    expect(appStyles).not.toContain('.hero__brand-row')
    expect(heroIdentityRule).toContain('display: flex;')
    expect(heroIdentityRule).toContain('align-items: flex-start;')
    expect(heroIdentityRule).toContain('flex-direction: column;')
    expect(heroIdentityRule).toContain('gap: 16px;')
    expect(conferenceBrandRule).not.toContain('position: absolute;')
    expect(conferenceBrandRule).not.toContain('top:')
    expect(conferenceBrandRule).not.toContain('right:')
    expect(conferenceBrandRule).toContain('width: 132px;')
    expect(heroEyebrowRule).toContain('font-size: 0.82rem;')
    expect(heroSubtitleRule).toContain('font-size: clamp(1.3rem, 2.1vw, 1.75rem);')
    expect(topicItemRule).toContain('font-size: 0.95rem;')
    expect(tabletConferenceBrandRule).toContain('width: 112px;')
    expect(mobileConferenceBrandRule).toContain('width: 96px;')
    expect(appStyles).not.toContain('max-width: calc(100% - 132px);')
  })

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
    expect(heroMetaRule).toContain('color: rgba(239, 247, 248, 0.92);')
    expect(heroMetaRule).toContain('font-size: 0.9rem;')
    expect(heroMetaRule).toContain('font-weight: 500;')
    expect(heroMetaRule).toContain('line-height: 1.5;')
    expect(sectionDescriptionRule).toContain(
      'font-size: clamp(1rem, 1.05vw, 1.0625rem);',
    )
    expect(sectionDescriptionRule).toContain('font-weight: 400;')
    expect(sectionDescriptionRule).toContain('line-height: 1.64;')
    expect(sectionDescriptionRule).toContain('color: var(--slate);')
    expect(inverseDescriptionRule).toContain('color: var(--slate-light);')
    expect(narrowNavRule).toContain('font-size: 0.78rem;')
    expect(tabletNavRule).toContain('font-size: 0.8rem;')
  })

  it('uses readable schedule metadata, headers, times, titles, and statuses', () => {
    const scheduleMetaRule = appStyles.match(/\.schedule-meta\s*\{([^}]*)\}/)?.[1]
    const tableHeadRule = appStyles.match(
      /\.schedule-table thead\s*\{([^}]*)\}/,
    )?.[1]
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
    expect(tableHeadRule).toContain('color: var(--slate-light-readable);')
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

  it('uses readable supporting copy for content, affiliations, dates, and footer', () => {
    const introBodyRule = appStyles.match(
      /\.intro-passage > p:last-child\s*\{([^}]*)\}/,
    )?.[1]
    const affiliationRule = appStyles.match(
      /\.person-card__copy p\s*\{([^}]*)\}/,
    )?.[1]
    const topicItemRule = appStyles.match(/\.topic-card li\s*\{([^}]*)\}/)?.[1]
    const submissionHeadingRule = appStyles.match(
      /\.submission-panel h3\s*\{([^}]*)\}/,
    )?.[1]
    const submissionIntroRule = appStyles.match(
      /\.submission-panel__intro\s*\{([^}]*)\}/,
    )?.[1]
    const submissionGuidelineHeadingRule = appStyles.match(
      /\.submission-guideline h4\s*\{([^}]*)\}/,
    )?.[1]
    const submissionGuidelineCopyRule = appStyles.match(
      /\.submission-guideline p\s*\{([^}]*)\}/,
    )?.[1]
    const submissionPresentationCopyRule = appStyles.match(
      /\.submission-presentation p\s*\{([^}]*)\}/,
    )?.[1]
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
    const footerRule = appStyles.match(/\.site-footer__bottom\s*\{([^}]*)\}/)?.[1]

    expect(introBodyRule).toContain('color: var(--slate-readable);')
    expect(introBodyRule).toContain('font-size: 1rem;')
    expect(introBodyRule).toContain('line-height: 1.75;')
    expect(affiliationRule).toContain('color: var(--slate-readable);')
    expect(affiliationRule).toContain('font-size: 0.86rem;')
    expect(affiliationRule).toContain('font-weight: 500;')
    expect(affiliationRule).toContain('line-height: 1.5;')
    expect(topicItemRule).toContain('font-size: 0.95rem;')
    expect(topicItemRule).toContain('line-height: 1.55;')
    expect(submissionHeadingRule).toContain('text-wrap: balance;')
    expect(submissionIntroRule).toContain('color: var(--slate-readable);')
    expect(submissionIntroRule).toContain('font-size: 1rem;')
    expect(submissionIntroRule).toContain('font-weight: 500;')
    expect(submissionIntroRule).toContain('line-height: 1.65;')
    expect(submissionGuidelineHeadingRule).toContain('font-size: 0.75rem;')
    expect(submissionGuidelineHeadingRule).toContain('font-weight: 700;')
    expect(submissionGuidelineCopyRule).toContain('font-size: 0.96rem;')
    expect(submissionGuidelineCopyRule).toContain('font-weight: 500;')
    expect(submissionGuidelineCopyRule).toContain('line-height: 1.65;')
    expect(submissionPresentationCopyRule).toContain('font-size: 1rem;')
    expect(submissionPresentationCopyRule).toContain('font-weight: 600;')
    expect(submissionPresentationCopyRule).toContain('line-height: 1.55;')
    expect(sponsorRule).toContain('color: var(--orange);')
    expect(sponsorRule).toContain('font-size: clamp(1.25rem, 2.2vw, 1.7rem);')
    expect(awardNameRule).toContain('font-size: clamp(1.15rem, 1.8vw, 1.45rem);')
    expect(awardCountRule).toContain('color: var(--cyan);')
    expect(awardCountRule).toContain('font-size: clamp(3.1rem, 5vw, 4.25rem);')
    expect(awardPrizeRule).toContain('color: var(--orange);')
    expect(awardPrizeRule).toContain('font-size: clamp(2.15rem, 3.8vw, 3.25rem);')
    expect(dateLabelRule).toContain('color: var(--slate-readable);')
    expect(dateValueRule).toContain('color: var(--ink-950);')
    expect(footerRule).toContain('font-size: 0.72rem;')
    expect(footerRule).toContain('color: rgba(216, 233, 236, 0.68);')
  })

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
    const tabletAwardBreakdownRule = tabletMedia.match(
      /\.award-card__breakdown\s*\{([^}]*)\}/,
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
    expect(tabletAwardBreakdownRule).toContain(
      'grid-template-columns: minmax(68px, 0.55fr) minmax(0, 1.45fr);',
    )
    expect(tabletAwardBreakdownRule).toContain('gap: 15px;')
    expect(mobileAwardGridRule).toContain('grid-template-columns: 1fr;')
  })

  it('uses a two-column submission grid that stacks on mobile', () => {
    const submissionGuidelinesRule = appStyles.match(
      /\.submission-guidelines\s*\{([^}]*)\}/,
    )?.[1]
    const mobileStart = appStyles.indexOf('@media (max-width: 720px)')
    const compactStart = appStyles.indexOf('@media (max-width: 480px)', mobileStart)

    expect(mobileStart).toBeGreaterThanOrEqual(0)
    expect(compactStart).toBeGreaterThanOrEqual(0)

    const mobileMedia = appStyles.slice(mobileStart, compactStart)
    const mobileSubmissionGuidelinesRule = mobileMedia.match(
      /\.submission-guidelines\s*\{([^}]*)\}/,
    )?.[1]

    expect(submissionGuidelinesRule).toContain('display: grid;')
    expect(submissionGuidelinesRule).toContain(
      'grid-template-columns: repeat(2, minmax(0, 1fr));',
    )
    expect(mobileSubmissionGuidelinesRule).toContain('grid-template-columns: 1fr;')
  })

  it("shows Hao Dong's complete organizer affiliation", () => {
    render(<App />)

    const card = screen
      .getAllByTestId('organizer-card')
      .find((organizerCard) =>
        within(organizerCard).queryByRole('heading', { name: 'Hao Dong' }),
      )

    expect(card).toBeDefined()
    expect(
      within(card as HTMLElement).getByText('Peking University · PrimeBot'),
    ).toBeInTheDocument()
  })

  it('presents the workshop premise as a single academic reading flow', () => {
    render(<App />)

    const introductionSection = screen.getByTestId('intro-editorial')
    const passages = within(introductionSection).getAllByTestId('intro-passage')

    expect(passages).toHaveLength(3)
    expect(within(passages[0]).getByRole('heading', { name: 'Context' })).toBeInTheDocument()
    expect(
      within(passages[1]).getByRole('heading', { name: 'Scaling view' }),
    ).toBeInTheDocument()
    expect(
      within(passages[2]).getByRole('heading', { name: 'Structure view' }),
    ).toBeInTheDocument()
    expect(within(introductionSection).getByTestId('intro-conclusion')).toBeInTheDocument()
  })

  it('gives CFP topics equal emphasis and highlights submission and award details', () => {
    render(<App />)

    const topicCards = screen.getAllByTestId('topic-card')
    expect(topicCards).toHaveLength(3)
    for (const card of topicCards) {
      expect(card).toHaveAttribute('data-accent', 'shared-blue')
    }
    const topicItems = topicCards.flatMap((card) => within(card).getAllByRole('listitem'))
    expect(topicItems).toHaveLength(9)

    const submissionGuidelines = screen.getAllByTestId('submission-guideline')
    expect(submissionGuidelines).toHaveLength(4)
    const submissionHeadings = ['Review', 'Format', 'Length', 'Appendices']
    submissionGuidelines.forEach((guideline, index) => {
      expect(
        within(guideline).getByRole('heading', { name: submissionHeadings[index] }),
      ).toBeInTheDocument()
    })
  })

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

  it('presents complete submission guidance with safe IEEE and OpenReview links', () => {
    render(<App />)

    const submissionPanel = screen.getByTestId('submission-panel')

    expect(
      within(submissionPanel).getByRole('heading', {
        name: 'Short papers & extended abstracts',
      }),
    ).toBeInTheDocument()
    expect(
      within(submissionPanel).getByText(
        'We welcome short papers and extended abstracts describing ongoing or completed work.',
      ),
    ).toBeInTheDocument()

    const expectedGuidelines = [
      [
        'Review',
        'Submissions will undergo double-blind review. Authors must anonymize their manuscripts.',
      ],
      ['Format', 'Use the standard IEEE conference paper format.'],
      ['Length', 'Submissions must not exceed 4 pages, excluding references.'],
      [
        'Appendices',
        'To keep submissions concise and consistent, we kindly ask authors not to include appendices.',
      ],
    ] as const
    const guidelines = within(submissionPanel).getAllByTestId('submission-guideline')

    expect(guidelines).toHaveLength(4)
    for (const [index, [label, copy]] of expectedGuidelines.entries()) {
      expect(
        within(guidelines[index]).getByRole('heading', { name: label }),
      ).toBeInTheDocument()
      expect(guidelines[index].querySelector('p')).toHaveTextContent(copy)
    }

    const ieeeLink = within(submissionPanel).getByRole('link', {
      name: 'standard IEEE conference paper format',
    })
    expect(ieeeLink).toHaveAttribute(
      'href',
      'https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/authoring-tools-and-templates/',
    )
    expect(ieeeLink).toHaveAttribute('target', '_blank')
    expect(ieeeLink).toHaveAttribute('rel', 'noreferrer')

    expect(
      within(submissionPanel).getByText(
        'Accepted submissions will be presented as posters, with a subset selected for spotlight talks.',
      ),
    ).toBeInTheDocument()

    const submitLink = within(submissionPanel).getByRole('link', {
      name: 'Submit your work',
    })
    expect(submitLink).toHaveAttribute('href', workshopMeta.openReviewUrl)
    expect(submitLink).toHaveAttribute('target', '_blank')
    expect(submitLink).toHaveAttribute('rel', 'noreferrer')
  })

  it('uses accessible local portraits and safe external calls to action', () => {
    render(<App />)

    const portraits = screen.getAllByRole('img', { name: /Portrait of/ })
    expect(portraits).toHaveLength(16)
    for (const portrait of portraits) {
      expect(portrait).toHaveAttribute('src', expect.stringMatching(/^\/images\//))
      expect(portrait).toHaveAttribute('alt', expect.stringMatching(/Portrait of/))
    }

    const submitLinks = screen.getAllByRole('link', { name: /OpenReview/i })
    expect(submitLinks).not.toHaveLength(0)
    for (const link of submitLinks) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }

    const primeBotLinks = screen.getAllByRole('link', { name: /PrimeBot/i })
    expect(primeBotLinks).toHaveLength(2)
    for (const link of primeBotLinks) {
      expect(link).toHaveAttribute('href', 'https://www.primebot.cn/')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }
    expect(screen.getByRole('link', { name: /GitHub repository/i })).toHaveAttribute(
      'href',
      'https://github.com/bimanual-robot-learning/bimanual-robot-learning.github.io',
    )
  })

  it('links a locally stored official IROS 2026 logo from the Hero', () => {
    render(<App />)

    const conferenceLink = screen.getByRole('link', {
      name: 'Visit the official IROS 2026 website',
    })
    expect(conferenceLink).toHaveAttribute('href', 'https://2026.ieee-iros.org/')
    expect(conferenceLink).toHaveAttribute('target', '_blank')
    expect(conferenceLink).toHaveAttribute('rel', 'noreferrer')

    const logo = screen.getByRole('img', { name: 'IROS 2026 Pittsburgh' })
    expect(logo).toHaveAttribute('src', '/images/iros-2026-logo.png')
  })

  it('groups the conference badge above the workshop eyebrow', () => {
    render(<App />)

    const title = screen.getByRole('heading', {
      name: /Scaling vs\. Structure\?/i,
      level: 1,
    })
    const hero = title.closest('.hero')
    const heroContent = title.closest('.hero__content')
    const identity = heroContent?.querySelector('.hero__identity')
    const conferenceBadge = screen.getByRole('link', {
      name: 'Visit the official IROS 2026 website',
    })
    const workshopEyebrow = within(heroContent as HTMLElement).getByText(
      'Workshop @ IROS 2026',
    )

    expect(hero).not.toBeNull()
    expect(heroContent).not.toBeNull()
    expect(identity).not.toBeNull()
    expect(identity as HTMLElement).toContainElement(conferenceBadge)
    expect(identity as HTMLElement).toContainElement(workshopEyebrow)
    expect(Array.from((identity as HTMLElement).children)).toEqual([
      conferenceBadge,
      workshopEyebrow,
    ])
    expect(hero?.querySelector(':scope > .hero__conference-brand')).toBeNull()
  })

  it('toggles the compact navigation for small screens', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggle = screen.getByLabelText('Open navigation')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-label', 'Close navigation')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('link', { name: 'Schedule' }))
    expect(toggle).toHaveAttribute('aria-label', 'Open navigation')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('starts keyboard navigation with a skip link to the main content', async () => {
    const user = userEvent.setup()
    render(<App />)

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skipLink).toHaveAttribute('href', '#main-content')

    await user.tab()
    expect(skipLink).toHaveFocus()
  })
})
