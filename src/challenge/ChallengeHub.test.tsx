import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import challengeHtml from '../../challenge/index.html?raw'
import { challengeHub } from '../data/challengeHub'
import {
  challenge,
  challengeOrganizers,
  challengeVideos,
} from '../data/workshop'
import galleryStyles from '../components/ChallengeVideoGallery.css?raw'
import leaderboardStyles from './ChallengeLeaderboard.css?raw'
import hubStyles from './ChallengeHub.css?raw'
import ChallengeHub from './ChallengeHub'
import indexStyles from '../index.css?raw'

describe('ChallengeHub', () => {
  it('renders the refined challenge content and leaderboard contract', () => {
    const { container } = render(<ChallengeHub />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Household Bimanual Manipulation Challenge',
      }),
    ).toBeVisible()
    expect(screen.getByText('Bimanual Robot Learning Workshop')).toBeVisible()
    expect(screen.getByText('Challenge Track · PrimeBot')).toBeVisible()
    expect(
      screen.getByRole('navigation', { name: 'Challenge navigation' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: /view dataset/i })).toHaveAttribute(
      'href',
      'https://huggingface.co/datasets/challenge-2026/challenge_data',
    )
    expect(screen.getAllByTestId('challenge-hub-fact')).toHaveLength(4)
    expect(screen.getByText('1,500+ hours')).toBeVisible()
    expect(screen.queryByText('12+ household tasks')).not.toBeInTheDocument()
    const sponsorLinks = screen.getAllByRole('link', { name: 'PrimeBot' })
    expect(sponsorLinks).toHaveLength(2)
    sponsorLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://www.primebot.cn/')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    })
    expect(container.querySelector('.challenge-hub__hero-media')).toBeNull()
    expect(
      container.querySelector('.challenge-hub__prize-sponsor'),
    ).not.toBeNull()
    const navigation = screen.getByRole('navigation', {
      name: 'Challenge navigation',
    })
    expect(navigation).toHaveTextContent('Leaderboard')
    expect(within(navigation).getByRole('link', { name: 'Leaderboard' })).toHaveAttribute(
      'href',
      '#leaderboard',
    )
    expect(screen.queryByText('Updates', { exact: true })).not.toBeInTheDocument()
    expect(screen.getAllByTestId('challenge-participation-step')).toHaveLength(3)
    expect(screen.getAllByTestId('challenge-hub-stage')).toHaveLength(3)
    expect(screen.getAllByTestId('challenge-hub-milestone')).toHaveLength(4)
    expect(screen.queryByText('Sample Data Release')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('challenge-hub-prize')).toHaveLength(
      challenge.prizes.length,
    )
    expect(screen.getAllByTestId('challenge-hub-organizer')).toHaveLength(
      challengeOrganizers.length,
    )
    const leaderboard = screen.getByRole('region', { name: 'Leaderboard' })
    expect(leaderboard).toHaveAttribute('id', 'leaderboard')
    expect(within(leaderboard).getByText('Verified results')).toBeVisible()
    expect(
      within(leaderboard).getByText('Updated Aug. 31, 2026'),
    ).toBeVisible()
    expect(
      within(leaderboard).getByRole('heading', {
        level: 2,
        name: 'Leaderboard',
      }),
    ).toBeVisible()
    expect(
      within(leaderboard)
        .getAllByRole('columnheader')
        .map(({ textContent }) => textContent),
    ).toEqual(['Rank', 'Team ID', 'Team Name', 'Total Score'])
    expect(
      within(leaderboard).getAllByTestId('challenge-leaderboard-entry'),
    ).toHaveLength(10)
    expect(within(leaderboard).getByText('10 verified teams')).toBeVisible()
    expect(
      within(leaderboard).getByRole('row', {
        name: '1 T12 sota 92.37',
      }),
    ).toBeVisible()
    expect(leaderboard).not.toHaveTextContent('August 25, 2026')
    expect(leaderboard).not.toHaveTextContent('Leaderboard opens')
    expect(leaderboard).not.toHaveTextContent('Online Score')
    expect(leaderboard).not.toHaveTextContent('Real-Robot Score')
    expect(leaderboard).not.toHaveTextContent('Final Score')
    expect(leaderboard).not.toHaveTextContent('Status')
    expect(
      within(leaderboard).queryByTestId('challenge-hub-leaderboard-stage'),
    ).toBeNull()
    expect(within(leaderboard).queryByText('Team A')).not.toBeInTheDocument()

    const gallery = screen.getByRole('region', {
      name: 'See the challenge in action',
    })
    expect(within(gallery).getAllByRole('button')).toHaveLength(
      challengeVideos.length,
    )
  })

  it('renders linked evaluation submission instructions from structured stages', () => {
    render(<ChallengeHub />)

    const evaluation = screen.getByRole('region', {
      name: 'Evaluation format and challenge timeline',
    })
    const stages = within(evaluation).getAllByTestId('challenge-hub-stage')

    expect(stages).toHaveLength(3)
    for (const [index, expectedStage] of challenge.stages.entries()) {
      const stage = stages[index]
      const description = stage.querySelector('.challenge-stage-description')
      const linkSegment = expectedStage.descriptionSegments.find(
        ({ url }) => url,
      )

      expect(description).toHaveTextContent(
        expectedStage.descriptionSegments.map(({ text }) => text).join(''),
      )
      expect(linkSegment).toBeDefined()
      const inlineLink = within(description as HTMLElement).getByRole('link', {
        name: linkSegment?.text,
      })
      expect(inlineLink).toHaveAttribute('href', linkSegment?.url)
      expect(inlineLink).toHaveAttribute('target', '_blank')
      expect(inlineLink).toHaveAttribute('rel', 'noreferrer')
    }

    const timeline = within(evaluation).getByRole('heading', {
      name: 'Challenge Timeline',
      level: 2,
    }).parentElement
    expect(timeline).not.toBeNull()
    const onlineEvaluationMilestone = within(timeline as HTMLElement).getByRole(
      'heading',
      { name: 'Online Evaluation Begins', level: 3 },
    ).parentElement
    expect(onlineEvaluationMilestone).toHaveTextContent(
      'August 25, 2026 · 11:59 PM AOE',
    )
  })

  it('keeps Challenge Hub logistics expanded as ordinary regions', () => {
    render(<ChallengeHub />)

    const logistics = screen.getByRole('region', {
      name: 'Evaluation format and challenge timeline',
    })
    expect(logistics.tagName).toBe('SECTION')
    expect(logistics.querySelector('details')).toBeNull()
    expect(
      within(logistics)
        .getByRole('heading', { name: 'Evaluation Format', level: 2 })
        .closest('section'),
    ).toBeVisible()
    expect(
      within(logistics)
        .getByRole('heading', { name: 'Challenge Timeline', level: 2 })
        .closest('section'),
    ).toBeVisible()
  })
})

describe('ChallengeHub presentation', () => {
  it('offsets every sticky-navigation target below the header', () => {
    const { container } = render(<ChallengeHub />)
    const targetIds = challengeHub.navigation.map(({ href }) => href.slice(1))
    const targetSelector = `.challenge-hub :is(${targetIds
      .map((targetId) => `#${targetId}`)
      .join(', ')})`

    for (const targetId of targetIds) {
      expect(container.querySelector(`#${targetId}`)).not.toBeNull()
    }
    const globalScrollPadding = indexStyles.match(
      /html\s*\{[^}]*scroll-padding-top:\s*(\d+)px;/,
    )?.[1]
    const desktopStyles = hubStyles.slice(0, hubStyles.indexOf('@media'))
    const mobileTargetRule = hubStyles.match(
      new RegExp(
        `@media \\(max-width: 760px\\) \\{[\\s\\S]*?${targetSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*scroll-margin-top:\\s*(\\d+)px;`,
      ),
    )

    expect(globalScrollPadding).toBe('78')
    expect(desktopStyles).not.toContain(targetSelector)
    expect(mobileTargetRule?.[1]).toBe('32')
    expect(Number(globalScrollPadding) + Number(mobileTargetRule?.[1])).toBeGreaterThan(
      106,
    )
  })

  it('defines responsive and reduced-motion-aware presentation', () => {
    expect(hubStyles).toContain('.challenge-hub__header')
    expect(hubStyles).toContain('.challenge-hub__hero')
    expect(hubStyles).toContain('.challenge-hub__fact-rail')
    expect(hubStyles).toContain('@media (max-width: 760px)')
    expect(hubStyles).toContain('@media (prefers-reduced-motion: reduce)')
    expect(hubStyles).toContain('.challenge-hub a:focus-visible')
  })

  it('defines the refined hero, prize sponsor, and leaderboard styling hooks', () => {
    expect(hubStyles).toContain('.challenge-hub__leaderboard')
    expect(hubStyles).toContain('.challenge-hub__prize-sponsor')
    expect(hubStyles).toContain('.challenge-hub__hero-title-line')
    expect(hubStyles).toContain('@media (max-width: 760px)')
  })

  it('ships an accessible horizontally scrollable leaderboard table', () => {
    expect(hubStyles).not.toMatch(
      /\.challenge-hub__leaderboard\s*\{[^}]*(?:overflow|overflow-x|overflow-y):\s*(?:hidden|clip);/,
    )
    expect(leaderboardStyles).toContain('.challenge-leaderboard__viewport')
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport\s*\{[^}]*width:\s*min\(100%,\s*800px\);[^}]*overflow-x:\s*auto;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\s*\{[^}]*min-width:\s*540px;/,
    )
    expect(leaderboardStyles).toContain('.challenge-leaderboard__empty')
    expect(hubStyles).toMatch(
      /\.challenge-hub__leaderboard-header > \.challenge-leaderboard__summary\s*\{[^}]*text-align:\s*right;/,
    )
    expect(hubStyles).toMatch(
      /@media \(max-width: 760px\) \{[\s\S]*?\.challenge-hub__leaderboard-header > \.challenge-leaderboard__summary\s*\{[^}]*max-width:\s*none;[^}]*text-align:\s*left;/,
    )
  })

  it('limits stage-number styles to direct stage children', () => {
    expect(hubStyles).toContain('.challenge-hub__stages > li > span')
    expect(hubStyles).not.toContain('.challenge-hub__stages span')
  })

  it('gives the hero a distinct workshop and PrimeBot challenge identity', () => {
    expect(hubStyles).toContain('.challenge-hub__hero-parent')
    expect(hubStyles).toContain('.challenge-hub__hero-track')
    expect(hubStyles).toContain(
      'background: linear-gradient(135deg, #1a0b08 0%, #30130e 48%, #693221 100%)',
    )
    expect(hubStyles).toMatch(
      /\.challenge-hub__hero-title-line\s*\{[^}]*display:\s*block;[^}]*white-space:\s*nowrap;/,
    )
  })

  it('keeps the mobile hero title in two compact phrase lines', () => {
    expect(hubStyles).toMatch(
      /@media \(max-width: 760px\) \{[\s\S]*?\.challenge-hub__hero h1\s*\{[^}]*font-size:\s*clamp\(1\.65rem,\s*7\.5vw,\s*2\.8rem\);/,
    )
    expect(hubStyles).toMatch(
      /@media \(max-width: 760px\) \{[\s\S]*?\.challenge-hub__hero-title-line\s*\{[^}]*white-space:\s*nowrap;/,
    )
  })

  it('uses only the active leaderboard card selector', () => {
    expect(hubStyles).not.toContain('.challenge-hub__updates')
  })

  it('keeps the brand touchable and the footer on a stable navy surface', () => {
    expect(hubStyles).toMatch(
      /\.challenge-hub__brand\s*\{[^}]*min-height:\s*44px;/,
    )
    expect(hubStyles).toMatch(
      /\.challenge-hub__footer\s*\{[^}]*background:\s*var\(--ink-950\);/,
    )
    expect(hubStyles).toMatch(
      /\.challenge-hub__nav a\s*\{[^}]*min-height:\s*44px;/,
    )
    expect(hubStyles).toMatch(
      /\.challenge-hub__header-cta\s*\{[^}]*min-height:\s*44px;/,
    )
  })

  it('gives the media-free hero a full-width desktop content shell', () => {
    expect(hubStyles).toMatch(
      /\.challenge-hub__hero\s*\{[^}]*display:\s*block;/,
    )
    expect(hubStyles).toMatch(
      /\.challenge-hub__hero-content\s*\{[^}]*width:\s*min\(100% - 64px,\s*1240px\);[^}]*margin-inline:\s*auto;/,
    )
    expect(hubStyles).not.toContain('.challenge-hub__hero-media')
    expect(hubStyles).not.toContain('grid-template-columns: minmax(0, 1.08fr)')
  })

  it('retains a scrollable touch-friendly navigation row on mobile', () => {
    expect(hubStyles).toMatch(
      /@media \(max-width: 760px\) \{[\s\S]*?\.challenge-hub__nav\s*\{[^}]*display:\s*flex;[^}]*overflow-x:\s*auto;/,
    )
    expect(hubStyles).toMatch(
      /@media \(max-width: 760px\) \{[\s\S]*?\.challenge-hub__nav a\s*\{[^}]*min-height:\s*44px;/,
    )
  })

  it('ships the shared video gallery layout with the Challenge Hub', () => {
    expect(galleryStyles).toContain('.challenge-video-gallery__layout')
    expect(galleryStyles).toContain('.challenge-video-playlist button')
    expect(galleryStyles).toContain('@media (max-width: 920px)')
    expect(galleryStyles).toContain('@media (max-width: 480px)')
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
})
