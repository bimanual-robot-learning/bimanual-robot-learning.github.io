import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import challengeHtml from '../../challenge/index.html?raw'
import { challenge, challengeOrganizers, challengeVideos } from '../data/workshop'
import hubStyles from './ChallengeHub.css?raw'
import ChallengeHub from './ChallengeHub'

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

describe('ChallengeHub presentation', () => {
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
})
