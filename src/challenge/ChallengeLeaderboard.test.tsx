import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import leaderboardStyles from './ChallengeLeaderboard.css?raw'
import ChallengeLeaderboard from './ChallengeLeaderboard'

describe('ChallengeLeaderboard', () => {
  it('renders a semantic, scrollable four-column empty leaderboard', () => {
    render(<ChallengeLeaderboard entries={[]} />)

    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual(['Rank', 'Team ID', 'Team Name', 'Total Score'])
    expect(
      screen.getByRole('table', {
        name: 'Household Bimanual Manipulation Challenge rankings',
      }),
    ).toBeVisible()
    const viewport = screen.getByLabelText(
      'Challenge leaderboard table; scroll horizontally to view all columns',
    )
    expect(viewport).toHaveClass('challenge-leaderboard__viewport')
    expect(viewport).toHaveAttribute('tabindex', '0')
    const emptyState = screen.getByText(
      'Verified online evaluation results will be published here as submissions are evaluated.',
    )
    expect(emptyState).toBeVisible()
    expect(emptyState).toHaveAttribute('colspan', '4')
    expect(screen.queryByText(/August 25, 2026/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Leaderboard opens/i)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('challenge-leaderboard-entry')).toHaveLength(0)
  })

  it('contains horizontal movement and exposes readable visual hooks', () => {
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport\s*\{[^}]*max-width:\s*100%;[^}]*overflow-x:\s*auto;[^}]*overscroll-behavior-x:\s*contain;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport:focus-visible\s*\{/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\s*\{[^}]*min-width:\s*620px;/,
    )
    expect(leaderboardStyles).toContain('font-variant-numeric: tabular-nums')
    expect(leaderboardStyles).toContain('[data-rank-accent="gold"]')
    expect(leaderboardStyles).toContain('#f1c75b')
    expect(leaderboardStyles).toContain('[data-rank-accent="silver"]')
    expect(leaderboardStyles).toContain('#c7d2d9')
    expect(leaderboardStyles).toContain('[data-rank-accent="bronze"]')
    expect(leaderboardStyles).toContain('#d99568')
    expect(leaderboardStyles).not.toContain(
      '.challenge-leaderboard__opening-date',
    )
    expect(leaderboardStyles).not.toContain(
      '.challenge-leaderboard__empty-content',
    )
  })

  it('renders two-decimal scores, semantic row headers, and top-three accents', () => {
    const entries: readonly ChallengeLeaderboardEntry[] = [
      {
        rank: 1,
        teamId: 'T000015',
        teamName: 'npu-eai',
        totalScore: 73.89246498024903,
      },
      { rank: 2, teamId: 'T000012', teamName: 'sota', totalScore: 61.8 },
      { rank: 3, teamId: 'T000010', teamName: 'Primotion', totalScore: 61 },
      { rank: 4, teamId: 'T000011', teamName: 'Horizon', totalScore: 45.316 },
    ]

    render(<ChallengeLeaderboard entries={entries} />)

    const rows = screen.getAllByTestId('challenge-leaderboard-entry')
    expect(rows).toHaveLength(4)
    expect(rows[0]).toHaveAccessibleName('1 T000015 npu-eai 73.89')
    expect(rows[1]).toHaveAccessibleName('2 T000012 sota 61.80')
    expect(rows[2]).toHaveAccessibleName('3 T000010 Primotion 61.00')
    expect(rows[3]).toHaveAccessibleName('4 T000011 Horizon 45.32')
    expect(rows[0]).toHaveAttribute('data-rank-accent', 'gold')
    expect(rows[1]).toHaveAttribute('data-rank-accent', 'silver')
    expect(rows[2]).toHaveAttribute('data-rank-accent', 'bronze')
    expect(rows[3]).not.toHaveAttribute('data-rank-accent')
    expect(rows[0].querySelector('th[scope="row"]')).toHaveTextContent('npu-eai')
    expect(rows[0].querySelectorAll('td')).toHaveLength(3)
  })
})
