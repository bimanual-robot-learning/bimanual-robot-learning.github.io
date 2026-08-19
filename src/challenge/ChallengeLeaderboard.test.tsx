import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import ChallengeLeaderboard from './ChallengeLeaderboard'

describe('ChallengeLeaderboard', () => {
  it('renders an empty leaderboard with its table headings and publication notice', () => {
    render(
      <ChallengeLeaderboard entries={[]} openingDate="August 25, 2026" />,
    )

    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual([
      'Rank',
      'Team',
      'Online Score',
      'Real-Robot Score',
      'Final Score',
      'Status',
    ])
    expect(screen.getByText('No results yet')).toBeVisible()
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent ===
          'Online evaluation begins August 25, 2026. Rankings will be published after results are verified.',
      ),
    ).toBeVisible()
    expect(screen.queryAllByTestId('challenge-leaderboard-entry')).toHaveLength(0)
  })

  it('renders verified leaderboard entries and unavailable scores', () => {
    const entries: readonly ChallengeLeaderboardEntry[] = [
      {
        rank: 1,
        team: 'Verified Robotics Team',
        onlineScore: 91.5,
        realRobotScore: null,
        finalScore: null,
        status: 'Finalist',
      },
    ]

    render(
      <ChallengeLeaderboard entries={entries} openingDate="August 25, 2026" />,
    )

    const entry = screen.getByTestId('challenge-leaderboard-entry')
    expect(entry).toHaveTextContent('Verified Robotics Team')
    expect(entry).toHaveTextContent('91.5')
    expect(entry).toHaveTextContent('Finalist')
    expect(entry.querySelectorAll('td')).toHaveLength(5)
    expect(
      Array.from(entry.querySelectorAll('td')).filter(
        (cell) => cell.textContent === '—',
      ),
    ).toHaveLength(2)
  })
})
