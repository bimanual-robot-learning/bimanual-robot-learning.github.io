import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import appStyles from './App.css?raw'
import indexStyles from './index.css?raw'

describe('workshop landing page', () => {
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
      'Workshop Organizers',
    ]) {
      expect(screen.getByRole('heading', { name: section })).toBeInTheDocument()
    }
  })

  it('renders all people and the complete schedule from structured content', () => {
    render(<App />)

    expect(screen.getAllByTestId('speaker-card')).toHaveLength(5)
    expect(screen.getAllByTestId('organizer-card')).toHaveLength(7)

    const scheduleTable = screen.getByRole('table', {
      name: 'IROS 2026 workshop schedule',
    })
    expect(within(scheduleTable).getAllByRole('row')).toHaveLength(11)
    expect(within(scheduleTable).getAllByText('Tentative')).toHaveLength(2)
    expect(within(scheduleTable).getAllByText('Pending')).toHaveLength(3)
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
    expect(topicItemRule).toContain('font-size: 0.92rem;')
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
      'font-size: clamp(1.125rem, 1.35vw, 1.25rem);',
    )
    expect(sectionDescriptionRule).toContain('font-weight: 500;')
    expect(sectionDescriptionRule).toContain('line-height: 1.6;')
    expect(sectionDescriptionRule).toContain('color: var(--slate-readable);')
    expect(inverseDescriptionRule).toContain(
      'color: var(--slate-light-readable);',
    )
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

  it("shows Hao Dong's complete organizer affiliation", () => {
    render(<App />)

    const heading = screen.getByRole('heading', { name: 'Hao Dong' })
    const card = heading.closest('[data-testid="organizer-card"]')

    expect(card).not.toBeNull()
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

    expect(screen.getAllByTestId('submission-highlight')).toHaveLength(2)

    const awardItems = screen.getAllByTestId('award-item')
    expect(awardItems).toHaveLength(2)
    expect(within(awardItems[0]).getByText('Best Workshop Paper Award')).toBeInTheDocument()
    expect(within(awardItems[0]).getByText('USD 1,000')).toBeInTheDocument()
    expect(
      within(awardItems[1]).getByText('Outstanding Workshop Paper Award'),
    ).toBeInTheDocument()
    expect(within(awardItems[1]).getByText('USD 500')).toBeInTheDocument()
  })

  it('uses accessible local portraits and safe external calls to action', () => {
    render(<App />)

    const portraits = screen.getAllByRole('img', { name: /Portrait of/ })
    expect(portraits).toHaveLength(12)
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

    expect(screen.getByRole('link', { name: /PrimeBot/i })).toHaveAttribute(
      'href',
      'https://www.primebot.cn/',
    )
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
