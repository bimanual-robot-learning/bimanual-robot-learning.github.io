import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { challenge, challengeOrganizers, challengeVideos } from '../data/workshop'
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
