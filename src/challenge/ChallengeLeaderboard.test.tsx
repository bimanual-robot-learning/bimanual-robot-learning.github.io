import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import leaderboardStyles from './ChallengeLeaderboard.css?raw'
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
    const emptyState = screen.getByText(
      'Leaderboard opens August 25, 2026',
    )
    expect(emptyState).toBeVisible()
    expect(emptyState.parentElement).toHaveClass(
      'challenge-leaderboard__empty-content',
    )
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent ===
          'Verified online evaluation results will be published here as submissions are evaluated.',
      ),
    ).toBeVisible()
    expect(screen.queryByText('No results yet')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('challenge-leaderboard-entry')).toHaveLength(0)
  })

  it('pins empty-state content inside the initial viewport', () => {
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__empty td\s*\{[^}]*text-align:\s*left;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__empty-content\s*\{[^}]*position:\s*sticky;[^}]*left:\s*18px;[^}]*width:\s*min\(520px,\s*calc\(100vw - 112px\)\);[^}]*max-width:\s*calc\(100% - 36px\);[^}]*text-align:\s*left;/,
    )
  })

  it('keeps the opening date intact on desktop without forcing mobile overflow', () => {
    expect(leaderboardStyles).toMatch(
      /@media \(min-width: 761px\) \{[\s\S]*?\.challenge-leaderboard__opening-date\s*\{[^}]*white-space:\s*nowrap;/,
    )
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
