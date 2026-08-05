import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import appStyles from './App.css?raw'
import indexStyles from './index.css?raw'
import { challenge, challengeOrganizers, workshopMeta } from './data/workshop'
import type { ChallengeResource } from './data/workshop'
import viteConfigSource from '../vite.config.ts?raw'
import challengeHtml from '../challenge/index.html?raw'
import sitemapXml from '../public/sitemap.xml?raw'

const protocolRelativeResource: ChallengeResource = {
  label: 'Invalid CDN resource',
  status: 'available',
  // @ts-expect-error Protocol-relative URLs must not be accepted as internal links.
  url: '//cdn.example.com/challenge',
  external: false,
}
void protocolRelativeResource

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

const findCssRules = (source: string, selector: string) => {
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

  return matches
}

const extractCssRules = (source: string, selector: string) => {
  const matches = findCssRules(source, selector)
  if (matches.length === 0) throw new Error(`Missing CSS rule for ${selector}`)
  return matches
}

const extractCssRule = (source: string, selector: string) =>
  extractCssRules(source, selector)[0]

const extractCssProperty = (declarations: string, property: string) => {
  const matches = [
    ...declarations.matchAll(new RegExp(`${property}:\\s*([^;]+);`, 'g')),
  ]
  return matches.at(-1)?.[1].trim()
}

const expectOwnedCssProperties = (
  source: string,
  selector: string,
  properties: Record<string, string>,
) => {
  const rule = extractCssRules(source, selector).at(-1)

  expect(rule?.selectors).toEqual([selector])
  for (const [property, value] of Object.entries(properties)) {
    expect(extractCssProperty(rule?.declarations ?? '', property)).toBe(value)
  }
}

describe('workshop landing page', () => {
  it('configures a directly addressable Challenge page', () => {
    expect(viteConfigSource).toContain(
      "challenge: resolve(__dirname, 'challenge/index.html')",
    )
    expect(challengeHtml).toContain(
      '<title>Towards Bimanual Intelligence | IROS 2026 Challenge</title>',
    )
    expect(challengeHtml).toContain(
      'https://bimanual-robot-learning.github.io/challenge/',
    )
    expect(challengeHtml).toContain('/src/challenge/main.tsx')
    expect(sitemapXml).toContain(
      '<loc>https://bimanual-robot-learning.github.io/challenge/</loc>',
    )
  })

  it('stores the approved Challenge content', () => {
    expect(challenge).not.toHaveProperty('eyebrow')
    expect(challenge).not.toHaveProperty('scoringNote')
    expect(challenge).not.toHaveProperty('prizePoolNote')
    expect(challenge.title).toEqual({
      lineOne: 'Real-World Household',
      lineTwo: 'Bimanual Manipulation',
      accent: 'Challenge',
    })
    expect(challenge).not.toHaveProperty('titleLead')
    expect(challenge).not.toHaveProperty('titleHighlight')
    expect(challenge.sponsorLine).toBe('Designed and sponsored by')
    expect(challenge).not.toHaveProperty('introduction')
    expect(challenge.introductionSegments).toEqual([
      {
        text: 'This challenge focuses on real-world bimanual manipulation in household environments. Participants train on ',
        emphasis: false,
      },
      { text: 'thousands of hours', emphasis: true },
      { text: ' of real-robot ', emphasis: false },
      { text: 'teleoperation and UMI data', emphasis: true },
      {
        text: ' spanning diverse household tasks, with the freedom to design their own data mixtures and training strategies.',
        emphasis: false,
      },
    ])
    expect(challenge.participation).toEqual({
      eyebrow: 'Get started',
      title: 'Participate in the Challenge',
      description:
        'The full rules, dataset documentation, submission instructions, and leaderboard will live on the challenge website.',
    })
    expect(challenge).not.toHaveProperty('facts')
    expect(challenge.stages).toEqual([
      {
        step: '01',
        title: 'Online Evaluation',
        description: 'Submit trained models through the online evaluation portal.',
      },
      {
        step: '02',
        title: 'Real-Robot Evaluation',
        description:
          'Up to five top-performing entries advance to household task evaluation.',
      },
    ])
    expect(challenge.finalRanking).toEqual({
      label: 'Final Ranking',
      formula: 'Online evaluation score + final real-robot evaluation score',
      note:
        'Detailed scoring protocols will be announced before online evaluation opens.',
    })
    expect(challenge.tasks).toEqual([
      {
        title: 'Open the Washer Door',
        description: 'Use the gripper to fully open the washing machine door.',
      },
      {
        title: 'Put Clothing in the Washer',
        description: 'Put two pieces of clothing into the washing machine.',
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
        accent: 'primary',
      },
      {
        place: '2nd Place',
        amount: 'USD 500',
        accent: 'secondary',
      },
      {
        place: '3rd Place',
        amount: 'USD 500',
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
      {
        label: 'Explore Challenge Details',
        status: 'available',
        url: '/challenge/',
        external: false,
      },
      { label: 'Dataset', status: 'coming-soon' },
      { label: 'Evaluation Portal', status: 'coming-soon' },
    ])
    expect(
      challengeOrganizers.map(({ name, institution }) => ({ name, institution })),
    ).toEqual([
      { name: 'Kai Li', institution: 'PrimeBot' },
      { name: 'Ran Cheng', institution: 'PrimeBot' },
      { name: 'Yan Shen', institution: 'Peking University' },
      { name: 'Hao Dong', institution: 'PrimeBot · Peking University' },
    ])
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
      'Real-World Household Bimanual Manipulation Challenge',
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

  it('renders the Challenge title and segmented introduction', () => {
    render(<App />)

    const challengeSection = screen.getByTestId('challenge-section')
    const challengeHeading = within(challengeSection).getByRole('heading', {
      name: 'Real-World Household Bimanual Manipulation Challenge',
      level: 2,
    })
    const lineOne = challengeHeading.querySelector('.challenge-title__line-one')
    const lineTwo = challengeHeading.querySelector('.challenge-title__line-two')
    const accent = challengeHeading.querySelector('.challenge-title__accent')

    expect(challengeSection.querySelectorAll('h2')).toHaveLength(1)
    expect(lineOne).toHaveTextContent('Real-World Household')
    expect(lineTwo).toHaveTextContent('Bimanual Manipulation Challenge')
    expect(accent).toHaveTextContent('Challenge')
    expect(challengeHeading.querySelector('.challenge-title__lead')).toBeNull()
    expect(challengeHeading.querySelector('.challenge-title__highlight')).toBeNull()
    expect(within(challengeSection).getByText('05 / Workshop Challenge')).toBeVisible()
    expect(challengeSection).not.toHaveTextContent('Towards Bimanual Intelligence:')

    const introduction = within(challengeSection).getByTestId(
      'challenge-introduction',
    )
    expect(introduction).toHaveClass('challenge-introduction')
    expect(introduction.querySelectorAll('strong')).toHaveLength(2)
    expect(within(introduction).getByText('thousands of hours')).toBeVisible()
    expect(within(introduction).getByText('teleoperation and UMI data')).toBeVisible()
    expect(within(challengeSection).queryByTestId('challenge-fact')).toBeNull()
    expect(challengeSection.querySelector('.challenge-facts')).toBeNull()
  })

  it('places participation before Evaluation and Timeline logistics', () => {
    render(<App />)

    const challengeSection = screen.getByTestId('challenge-section')
    const introduction = within(challengeSection).getByTestId(
      'challenge-introduction',
    )
    const participationHeading = within(challengeSection).getByRole('heading', {
      name: challenge.participation.title,
      level: 3,
    })
    const participation = participationHeading.closest('section')
    const logistics = within(challengeSection).getByTestId('challenge-logistics')

    expect(participation).toHaveClass('challenge-participation')
    expect(participation?.querySelector('header')).toHaveClass(
      'challenge-participation__header',
    )
    expect(participation).toHaveAccessibleName(challenge.participation.title)
    expect(participation).toHaveTextContent(challenge.participation.eyebrow)
    expect(participation).toHaveTextContent(challenge.participation.description)
    expect(introduction.compareDocumentPosition(participation as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect((participation as Node).compareDocumentPosition(logistics)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(logistics).toHaveClass('challenge-logistics')

    const logisticsHeadings = within(logistics).getAllByRole('heading', { level: 3 })
    expect(logisticsHeadings.map(({ textContent }) => textContent)).toEqual([
      'Evaluation Format',
      'Challenge timeline',
    ])

    const stages = within(challengeSection).getAllByTestId('challenge-stage')
    expect(stages).toHaveLength(2)
    expect(
      within(challengeSection).queryByRole('heading', { name: 'Train' }),
    ).not.toBeInTheDocument()
    for (const [index, expectedStage] of challenge.stages.entries()) {
      expect(
        within(stages[index]).getByRole('heading', {
          name: expectedStage.title,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(within(stages[index]).getByText(expectedStage.description)).toBeVisible()
    }

    expect(
      within(challengeSection).getByRole('heading', {
        name: 'Evaluation Format',
        level: 3,
      }),
    ).toBeInTheDocument()
    const finalRanking = within(challengeSection).getByTestId(
      'challenge-final-ranking',
    )
    expect(finalRanking).toHaveTextContent(challenge.finalRanking.label)
    expect(finalRanking).toHaveTextContent(challenge.finalRanking.formula)
    expect(finalRanking).toHaveTextContent(challenge.finalRanking.note)
    const milestones = within(logistics).getAllByTestId('challenge-milestone')
    expect(milestones).toHaveLength(challenge.timeline.length)
    for (const [index, milestone] of challenge.timeline.entries()) {
      expect(milestones[index]).toHaveTextContent(milestone.label)
      expect(milestones[index]).toHaveTextContent(milestone.date)
    }
  })

  it('uses the redesigned Challenge visual system', () => {
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

    expect(styleFor('.section--challenge').background).toBe('var(--paper)')
    expect(styleFor('.section--challenge-organizers').background).toBe(
      'var(--paper)',
    )
    expect(styleFor('.challenge-prize-pool').background).not.toBe(
      'var(--ink-950)',
    )
    expectGridColumns('.challenge-logistics', 2)
    expectGridColumns('.challenge-task-grid', 2)
    expectGridColumns('.challenge-prize-grid', 3)
    expect(styleFor('.challenge-flow').display).toBe('grid')
    expect(styleFor('.challenge-flow').gridTemplateColumns).toBe('1fr')
    expect(styleFor('.challenge-timeline > ol').display).toBe('grid')
    expect(styleFor('.challenge-timeline > ol').gridTemplateColumns).toBe('1fr')
    expectGridColumns('.challenge-organizer-grid', 2)
    expect(styleFor('.challenge-prize-grid').gap).toBe('0px')
    expect(
      extractCssProperty(
        extractCssRule(
          appStyles,
          ".challenge-prize-grid article[data-accent='primary']",
        ).declarations,
        'background',
      ),
    ).toBe('transparent')
    expect(styleFor('.challenge-participation').background).toBe('var(--ink-950)')
    expect(styleFor('.challenge-resource--primary').background).toBe('var(--cyan)')
    expect(styleFor('.challenge-evaluation').background).toBe('rgba(82, 216, 230, 0.08)')
    expect(styleFor('.challenge-timeline').background).toBe('rgba(82, 216, 230, 0.08)')
    const finalRanking = extractCssRule(
      appStyles,
      '.challenge-final-ranking',
    ).declarations
    expect(finalRanking).not.toMatch(/border-(?:top|bottom)\s*:/)
    expect(
      extractCssProperty(
        extractCssRule(
          appStyles,
          '.challenge-prize-pool > header .challenge-prize-total',
        ).declarations,
        'color',
      ),
    ).toBe('var(--orange)')
    expect(styleFor('.challenge-sponsor a').color).toBe('var(--orange-deep)')
    const introduction = extractCssRule(
      appStyles,
      '.challenge-introduction',
    ).declarations
    expect(introduction).toContain('max-width: 1060px;')
    expect(introduction).toContain('border-left: 4px solid var(--cyan-deep);')
    expect(introduction).toContain(
      'font-size: clamp(1.08rem, 1.4vw, 1.18rem);',
    )
    expect(introduction).toContain('font-weight: 500;')
    expect(introduction).toContain('line-height: 1.72;')
    stylesheet.remove()
  })

  it('keeps unrelated Challenge grids responsive without stale logistics rules', () => {
    const mobileMedia = extractCssBlock(appStyles, '@media (max-width: 720px)')
    const compactMedia = extractCssBlock(appStyles, '@media (max-width: 480px)')

    expect(
      extractCssRule(
        appStyles,
        '.person-card--challenge-organizer .person-card__media',
      ).declarations,
    ).toContain('aspect-ratio: 1;')
    expect(
      extractCssProperty(
        extractCssRule(appStyles, '.person-card--challenge-organizer').declarations,
        'grid-template-columns',
      ),
    ).toBe('104px minmax(0, 1fr)')
    const challengeInstitutionRule = extractCssRule(
      appStyles,
      '.person-card__copy p',
    ).declarations
    expect(extractCssProperty(challengeInstitutionRule, 'font-size')).toBe('0.86rem')
    expect(challengeInstitutionRule).not.toContain('white-space: nowrap;')

    const mobileStack = extractCssRule(mobileMedia, '.challenge-task-grid')
    expect(mobileStack.selectors).toEqual(
      expect.arrayContaining([
        '.challenge-task-grid',
        '.challenge-prize-grid',
        '.challenge-organizer-grid',
      ]),
    )
    expect(mobileStack.declarations).toContain('grid-template-columns: 1fr;')

    const mobilePrizeSeparator = extractCssRule(
      mobileMedia,
      '.challenge-prize-grid article + article',
    ).declarations
    expect(mobilePrizeSeparator).toContain(
      'border-top: 1px solid rgba(200, 88, 53, 0.22);',
    )
    expect(mobilePrizeSeparator).toContain('border-left: 0;')

    expect(
      extractCssRule(mobileMedia, '.person-card--challenge-organizer').declarations,
    ).toContain('grid-template-columns: 112px minmax(0, 1fr);')

    expect(
      extractCssRule(compactMedia, '.challenge-heading h2').declarations,
    ).toContain('font-size: 2.5rem;')
    const compactIntroduction = extractCssRule(
      compactMedia,
      '.challenge-introduction',
    ).declarations
    expect(compactIntroduction).toContain('padding-left: 18px;')
    expect(compactIntroduction).toContain('font-size: 1.06rem;')
    const mobilePrizeHeader = extractCssRule(
      mobileMedia,
      '.challenge-prize-pool > header',
    ).declarations
    expect(mobilePrizeHeader).toContain('align-items: flex-start;')
    expect(mobilePrizeHeader).toContain('flex-direction: column;')
    expect(mobilePrizeHeader).toContain('gap: 8px;')
    const compactSponsor = extractCssRule(
      compactMedia,
      '.challenge-sponsor',
    ).declarations
    expect(compactSponsor).toContain('align-items: flex-start;')
    expect(compactSponsor).toContain('flex-direction: column;')
    expect(compactSponsor).toContain('gap: 3px;')
    expect(appStyles).not.toContain('.challenge-block')
  })

  it('gives the Challenge title equal-scale lines with color-only accent emphasis', () => {
    expectOwnedCssProperties(appStyles, '.challenge-title__line-one', {
      display: 'block',
      'white-space': 'nowrap',
    })
    expectOwnedCssProperties(appStyles, '.challenge-title__line-two', {
      display: 'block',
      'white-space': 'nowrap',
    })
    expectOwnedCssProperties(appStyles, '.challenge-title__accent', {
      color: 'var(--orange-deep)',
    })
    for (const selector of [
      '.challenge-title__line-one',
      '.challenge-title__line-two',
    ]) {
      expect(extractCssRule(appStyles, selector).declarations).not.toMatch(/color\s*:/)
    }
    const accent = extractCssRule(appStyles, '.challenge-title__accent').declarations
    expect(accent).not.toMatch(
      /(?:font-size|font-weight|line-height|margin(?:-[a-z]+)?)\s*:/,
    )
    expect(appStyles).not.toContain('.challenge-title__lead')
    expect(appStyles).not.toContain('.challenge-title__highlight')
  })

  it('uses restrained ink emphasis in the Challenge introduction', () => {
    expectOwnedCssProperties(appStyles, '.challenge-introduction strong', {
      color: 'var(--ink-950)',
      'font-weight': '750',
    })
  })

  it('owns the dark participation hierarchy and resource grid', () => {
    expectOwnedCssProperties(appStyles, '.challenge-participation', {
      padding: 'clamp(24px, 3vw, 30px)',
      'margin-bottom': '32px',
      color: 'var(--white)',
      background: 'var(--ink-950)',
      border: '1px solid rgba(82, 216, 230, 0.16)',
      'border-radius': '8px',
    })
    expectOwnedCssProperties(appStyles, '.challenge-participation__header', {
      display: 'grid',
      'margin-bottom': '18px',
      'grid-template-columns': 'minmax(0, 0.9fr) minmax(320px, 1.1fr)',
      'align-items': 'end',
      gap: '28px',
    })
    expectOwnedCssProperties(appStyles, '.challenge-participation__header .eyebrow', {
      margin: '0 0 6px',
      color: 'var(--cyan)',
    })
    expectOwnedCssProperties(appStyles, '.challenge-participation__header h3', {
      margin: '0',
      color: 'var(--white)',
      'font-family': 'var(--font-display)',
      'font-size': 'clamp(1.55rem, 2.4vw, 2rem)',
      'font-weight': '650',
      'letter-spacing': '-0.035em',
    })
    expectOwnedCssProperties(appStyles, '.challenge-participation__header > p', {
      margin: '0',
      color: 'rgba(231, 241, 244, 0.72)',
      'font-size': '0.86rem',
      'line-height': '1.55',
    })
    expectOwnedCssProperties(appStyles, '.challenge-resources', {
      margin: '0',
      padding: '0',
      border: '0',
      'grid-template-columns': 'minmax(0, 1.35fr) repeat(2, minmax(0, 1fr))',
      gap: '12px',
    })
    for (const selector of [
      '.challenge-resources > div',
      '.challenge-resources > a',
    ]) {
      const rule = extractCssRule(appStyles, selector)
      expect(extractCssProperty(rule.declarations, 'background')).toBe(
        'rgba(255, 255, 255, 0.055)',
      )
      expect(extractCssProperty(rule.declarations, 'border')).toBe(
        '1px solid rgba(82, 216, 230, 0.22)',
      )
    }
    expectOwnedCssProperties(appStyles, '.challenge-resource--primary', {
      color: 'var(--ink-950)',
      background: 'var(--cyan)',
    })
    expectOwnedCssProperties(appStyles, '.challenge-resources > a:focus-visible', {
      outline: '3px solid var(--orange)',
      'outline-offset': '3px',
    })
  })

  it('owns matching logistics panels with text-led evaluation and timeline rows', () => {
    expectOwnedCssProperties(appStyles, '.challenge-logistics', {
      display: 'grid',
      'grid-template-columns': 'repeat(2, minmax(0, 1fr))',
      gap: '16px',
      'margin-bottom': '32px',
    })
    for (const selector of ['.challenge-evaluation', '.challenge-timeline']) {
      expectOwnedCssProperties(appStyles, selector, {
        padding: 'clamp(24px, 3vw, 30px)',
        margin: '0',
        background: 'rgba(82, 216, 230, 0.08)',
        border: '1px solid rgba(27, 132, 153, 0.2)',
        'border-radius': '7px',
      })
    }
    expectOwnedCssProperties(appStyles, '.challenge-flow', {
      'grid-template-columns': '1fr',
      gap: '0',
    })
    expectOwnedCssProperties(appStyles, '.challenge-flow li', {
      display: 'grid',
      background: 'transparent',
      border: '0',
      'border-radius': '0',
    })
    expectOwnedCssProperties(appStyles, '.challenge-flow li + li', {
      'border-top': '1px solid rgba(27, 132, 153, 0.18)',
    })
    expectOwnedCssProperties(appStyles, '.challenge-timeline > ol', {
      'grid-template-columns': '1fr',
    })
    expectOwnedCssProperties(appStyles, '.challenge-timeline li', {
      display: 'grid',
      'grid-template-columns': 'minmax(0, 1fr) auto',
      'grid-template-rows': 'auto auto',
      gap: '3px 18px',
      'border-top': '1px solid rgba(27, 132, 153, 0.18)',
    })
    expectOwnedCssProperties(appStyles, '.challenge-timeline li > span', {
      display: 'none',
    })
    expectOwnedCssProperties(appStyles, '.challenge-timeline li p', {
      'grid-column': '2',
      'grid-row': '1 / span 2',
      'align-self': 'center',
      'text-align': 'right',
    })
    expect(appStyles).not.toContain('.challenge-facts')
    expect(appStyles).not.toContain('.challenge-flow li + li::before')
  })

  it('hides decorative Challenge sequence numerals from assistive technology', () => {
    render(<App />)

    const sequenceCards = [
      ...screen.getAllByTestId('challenge-stage'),
      ...screen.getAllByTestId('challenge-task'),
      ...screen.getAllByTestId('challenge-milestone'),
    ]

    expect(sequenceCards).toHaveLength(11)
    for (const card of sequenceCards) {
      expect(card.querySelector(':scope > span')).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('renders the complete Household Manipulation Tasks scope in order', () => {
    render(<App />)

    const tasksHeading = screen.getByRole('heading', {
      name: 'Household Manipulation Tasks',
      level: 3,
    })
    const tasksSection = tasksHeading.closest('section')

    expect(tasksSection).toHaveClass('challenge-tasks')
    expect(tasksSection).not.toHaveClass('challenge-block')

    const taskCards = within(tasksSection as HTMLElement).getAllByTestId(
      'challenge-task',
    )
    expect(taskCards).toHaveLength(challenge.tasks.length)
    for (const [index, expectedTask] of challenge.tasks.entries()) {
      expect(
        within(taskCards[index]).getByRole('heading', {
          name: expectedTask.title,
          level: 4,
        }),
      ).toBeInTheDocument()
      expect(
        within(taskCards[index]).getByText(expectedTask.description, { exact: true }),
      ).toBeVisible()
    }
  })

  it('features the complete Challenge Prize Pool without multiplier notation', () => {
    render(<App />)

    const prizePool = screen.getByTestId('challenge-prize-pool')

    expect(
      within(prizePool).getByRole('heading', {
        name: 'Challenge Prize Pool',
        level: 3,
      }),
    ).toBeInTheDocument()
    expect(prizePool).toHaveAccessibleName('Challenge Prize Pool')
    expect(within(prizePool).getByText('USD 2,000 Total', { exact: true })).toBeVisible()
    expect(within(prizePool).queryByText(/One winning team/i)).not.toBeInTheDocument()
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
    }
    expect(within(prizePool).getAllByText('USD 1,000')).toHaveLength(1)
    expect(within(prizePool).getAllByText('USD 500')).toHaveLength(2)
    expect(prizePool).not.toHaveTextContent('×')
    expect(prizePool.querySelector('.challenge-prize-pool__grid')).not.toBeInTheDocument()
  })

  it('renders five Challenge milestones and the configured resource states', () => {
    render(<App />)

    const challengeSection = screen.getByTestId('challenge-section')
    const milestones = within(challengeSection).getAllByTestId('challenge-milestone')
    const resources = within(challengeSection).getAllByTestId('challenge-resource')
    const participation = within(challengeSection)
      .getByRole('heading', { name: challenge.participation.title })
      .closest('section')

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
    expect(resources).toHaveLength(3)
    expect(participation).toContainElement(resources[0])
    expect(participation).toContainElement(resources[1])
    expect(participation).toContainElement(resources[2])
    expect(resources[0]).toHaveAttribute('href', '/challenge/')
    expect(resources[0]).toHaveClass('challenge-resource--primary')
    expect(resources[0]).not.toHaveAttribute('target')
    expect(resources[0]).not.toHaveAttribute('rel')
    expect(within(resources[0]).getByText('Open')).toBeInTheDocument()
    for (const resource of resources.slice(1)) {
      expect(within(resource).getByText('Coming Soon')).toBeInTheDocument()
      expect(resource.closest('a, button')).toBeNull()
      expect(resource).not.toHaveAttribute('tabindex')
    }
    expect(challengeSection).not.toHaveTextContent(/[→↗]/)
  })

  it('turns an available Challenge resource into a safe external call to action', () => {
    const originalResources = [...challenge.resources]
    challenge.resources.splice(
      1,
      1,
      {
        label: 'Dataset',
        status: 'available',
        url: 'https://huggingface.co/datasets/example/household-challenge',
        external: true,
      },
    )

    try {
      render(<App />)

      const challengeSection = screen.getByTestId('challenge-section')
      const resources = within(challengeSection).getAllByTestId('challenge-resource')
      const datasetLink = within(challengeSection).getByRole('link', { name: /Dataset/i })

      expect(resources).toHaveLength(3)
      expect(
        within(challengeSection).getByRole('link', {
          name: /Explore Challenge Details/i,
        }),
      ).toBeInTheDocument()
      expect(within(challengeSection).getByText('Evaluation Portal')).toBeInTheDocument()
      expect(datasetLink).toHaveAttribute(
        'href',
        'https://huggingface.co/datasets/example/household-challenge',
      )
      expect(datasetLink).toHaveAttribute('target', '_blank')
      expect(datasetLink).toHaveAttribute('rel', 'noreferrer')
      expect(within(datasetLink).queryByText('Coming Soon')).not.toBeInTheDocument()
    } finally {
      challenge.resources.splice(0, challenge.resources.length, ...originalResources)
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

  it('renders independent Workshop and Challenge organizer sections', () => {
    render(<App />)

    const workshopOrganizerSection = screen.getByTestId('workshop-organizers')
    const challengeOrganizerSection = screen.getByTestId('challenge-organizers')
    const workshopOrganizerCards = within(workshopOrganizerSection).getAllByTestId(
      'organizer-card',
    )
    const challengeOrganizerCards = within(challengeOrganizerSection).getAllByTestId(
      'challenge-organizer-card',
    )
    const expectedOrganizers = [
      {
        name: 'Kai Li',
        institution: 'PrimeBot',
        image: '/images/challenge-organizers/kai-li.jpg',
        imageAlt: 'Portrait of challenge organizer Kai Li',
      },
      {
        name: 'Ran Cheng',
        institution: 'PrimeBot',
        image: '/images/challenge-organizers/ran-cheng.jpg',
        imageAlt: 'Portrait of challenge organizer Ran Cheng',
      },
      {
        name: 'Yan Shen',
        institution: 'Peking University',
        image: '/images/organizers/yan-shen.jpg',
        imageAlt: 'Portrait of challenge organizer Yan Shen',
      },
      {
        name: 'Hao Dong',
        institution: 'PrimeBot · Peking University',
        image: '/images/organizers/hao-dong.jpg',
        imageAlt: 'Portrait of challenge organizer Hao Dong',
      },
    ]

    expect(within(workshopOrganizerSection).getByText('06 / Workshop Team')).toBeVisible()
    expect(
      within(workshopOrganizerSection).getByRole('heading', {
        name: 'Workshop Organizers',
        level: 2,
      }),
    ).toBeInTheDocument()
    expect(within(challengeOrganizerSection).getByText('07 / Challenge Team')).toBeVisible()
    expect(
      within(challengeOrganizerSection).getByRole('heading', {
        name: 'Challenge Organizers',
        level: 2,
      }),
    ).toBeInTheDocument()
    expect(workshopOrganizerSection).not.toContainElement(challengeOrganizerSection)
    expect(
      workshopOrganizerSection.compareDocumentPosition(challengeOrganizerSection),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(workshopOrganizerCards).toHaveLength(7)
    expect(
      within(workshopOrganizerCards[0]).getByRole('heading', {
        name: 'Yan Shen',
        level: 3,
      }),
    ).toBeInTheDocument()
    expect(challengeOrganizerCards).toHaveLength(4)
    for (const [index, expectedOrganizer] of expectedOrganizers.entries()) {
      const card = challengeOrganizerCards[index]

      expect(
        within(card).getByRole('heading', {
          name: expectedOrganizer.name,
          level: 3,
        }),
      ).toBeInTheDocument()
      expect(within(card).getByText(expectedOrganizer.institution)).toBeVisible()
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
