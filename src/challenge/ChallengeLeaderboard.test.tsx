import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import leaderboardStyles from './ChallengeLeaderboard.css?raw'
import ChallengeLeaderboard from './ChallengeLeaderboard'

const selectorSpecificity = (selector: string) => {
  const idCount = selector.match(/#[\w-]+/g)?.length ?? 0
  const classCount = selector.match(/\.[\w-]+/g)?.length ?? 0
  const elementCount = selector
    .split(/[\s>+~]+/)
    .filter((part) => /^[a-z][\w-]*/i.test(part)).length

  return [idCount, classCount, elementCount] as const
}

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
    expect(emptyState).not.toHaveClass('challenge-leaderboard__rank')
    expect(emptyState).not.toHaveClass('challenge-leaderboard__team-id')
    expect(emptyState).not.toHaveClass('challenge-leaderboard__score')
    expect(screen.queryByText(/August 25, 2026/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Leaderboard opens/i)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('challenge-leaderboard-entry')).toHaveLength(0)
  })

  it('contains horizontal movement and exposes readable visual hooks', () => {
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport\s*\{[^}]*width:\s*min\(100%,\s*800px\);[^}]*max-width:\s*100%;[^}]*margin-inline:\s*auto;[^}]*overflow-x:\s*auto;[^}]*overscroll-behavior-x:\s*contain;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport:focus-visible\s*\{/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\s*\{[^}]*min-width:\s*540px;[^}]*table-layout:\s*fixed;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__rank-column\s*\{[^}]*width:\s*12%;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__id-column\s*\{[^}]*width:\s*17%;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__name-column\s*\{[^}]*width:\s*46%;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__score-column\s*\{[^}]*width:\s*25%;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table th,\s*\.challenge-leaderboard__table td\s*\{[^}]*padding:\s*15px\s+12px;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table \.challenge-leaderboard__score-align\s*\{[^}]*text-align:\s*left;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table \.challenge-leaderboard__rank-align\s*\{[^}]*text-align:\s*center;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__rank-badge\s*\{[^}]*display:\s*inline-grid;[^}]*width:\s*28px;[^}]*height:\s*28px;[^}]*place-items:\s*center;[^}]*color:\s*var\(--ink-950\);[^}]*border-radius:\s*50%;/,
    )
    expect(leaderboardStyles).toContain('.challenge-leaderboard__rank')
    expect(leaderboardStyles).toContain('.challenge-leaderboard__team-id')
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table \.challenge-leaderboard__score\s*\{[^}]*color:\s*var\(--cyan\);[^}]*font-weight:\s*800;/,
    )
    expect(leaderboardStyles).not.toMatch(
      /\.challenge-leaderboard__table tbody td:(?:first-child|nth-child\(2\)|last-child)/,
    )
    const generalCellSelector = '.challenge-leaderboard__table tbody td'
    const scoreAlignSelector =
      '.challenge-leaderboard__table .challenge-leaderboard__score-align'
    const rankAlignSelector =
      '.challenge-leaderboard__table .challenge-leaderboard__rank-align'
    const emptyCellSelector =
      '.challenge-leaderboard__table .challenge-leaderboard__empty td'
    expect(selectorSpecificity(generalCellSelector)).toEqual([0, 1, 2])
    const scoreAlignSpecificity = selectorSpecificity(scoreAlignSelector)
    const genericCellSpecificity = selectorSpecificity(
      '.challenge-leaderboard__table td',
    )
    expect(scoreAlignSpecificity).toEqual([0, 2, 0])
    expect(genericCellSpecificity).toEqual([0, 1, 1])
    expect(scoreAlignSpecificity[1]).toBeGreaterThan(genericCellSpecificity[1])
    const rankAlignSpecificity = selectorSpecificity(rankAlignSelector)
    expect(rankAlignSpecificity).toEqual([0, 2, 0])
    expect(rankAlignSpecificity[1]).toBeGreaterThan(genericCellSpecificity[1])
    expect(selectorSpecificity(emptyCellSelector)).toEqual([0, 2, 1])
    expect(leaderboardStyles.indexOf(emptyCellSelector)).toBeGreaterThan(
      leaderboardStyles.indexOf(generalCellSelector),
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table \.challenge-leaderboard__empty td\s*\{[^}]*color:\s*var\(--slate-light-readable\);[^}]*font-family:\s*var\(--font-body\);[^}]*font-size:\s*0\.92rem;[^}]*font-weight:\s*400;[^}]*line-height:\s*1\.6;[^}]*text-align:\s*left;/,
    )
    expect(leaderboardStyles).toContain('font-variant-numeric: tabular-nums')
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table tr\[data-rank-accent="gold"\] > \.challenge-leaderboard__rank \.challenge-leaderboard__rank-badge\s*\{[^}]*background:\s*#f1c75b;[^}]*box-shadow:\s*0\s+0\s+0\s+3px\s+rgba\(241,\s*199,\s*91,\s*0\.22\);/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table tr\[data-rank-accent="silver"\] > \.challenge-leaderboard__rank \.challenge-leaderboard__rank-badge\s*\{[^}]*background:\s*#c7d2d9;[^}]*box-shadow:\s*0\s+0\s+0\s+3px\s+rgba\(199,\s*210,\s*217,\s*0\.22\);/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table tr\[data-rank-accent="bronze"\] > \.challenge-leaderboard__rank \.challenge-leaderboard__rank-badge\s*\{[^}]*background:\s*#d99568;[^}]*box-shadow:\s*0\s+0\s+0\s+3px\s+rgba\(217,\s*149,\s*104,\s*0\.22\);/,
    )
    expect(leaderboardStyles).not.toContain(
      '.challenge-leaderboard__opening-date',
    )
    expect(leaderboardStyles).not.toContain(
      '.challenge-leaderboard__empty-content',
    )
  })

  it('renders two-decimal scores, semantic row headers, and rank medals', () => {
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
    const firstEntry = entries[0]

    render(<ChallengeLeaderboard entries={entries} />)

    const rows = screen.getAllByTestId('challenge-leaderboard-entry')
    expect(rows).toHaveLength(4)
    expect(rows[0]).toHaveAccessibleName('1 T15 npu-eai 73.89')
    expect(rows[1]).toHaveAccessibleName('2 T12 sota 61.80')
    expect(rows[2]).toHaveAccessibleName('3 T10 Primotion 61.00')
    expect(rows[3]).toHaveAccessibleName('4 T11 Horizon 45.32')
    expect(firstEntry.teamId).toBe('T000015')
    expect(rows[0]).toHaveAttribute('data-rank-accent', 'gold')
    expect(rows[1]).toHaveAttribute('data-rank-accent', 'silver')
    expect(rows[2]).toHaveAttribute('data-rank-accent', 'bronze')
    expect(rows[3]).not.toHaveAttribute('data-rank-accent')
    expect(rows[0].querySelector('th[scope="row"]')).toHaveTextContent('npu-eai')
    expect(rows[0].querySelectorAll('td')).toHaveLength(3)
    expect(rows[0].querySelectorAll('td')[0]).toHaveClass(
      'challenge-leaderboard__rank',
    )
    rows.forEach((row) => {
      expect(row.querySelectorAll('td')[0]).toHaveClass(
        'challenge-leaderboard__rank-align',
      )
    })
    expect(rows[0].querySelectorAll('td')[1]).toHaveClass(
      'challenge-leaderboard__team-id',
    )
    rows.forEach((row) => {
      const scoreCell = row.querySelectorAll('td')[2]

      expect(scoreCell).toHaveClass('challenge-leaderboard__score')
      expect(scoreCell).toHaveClass('challenge-leaderboard__score-align')
    })
    expect(screen.getByRole('columnheader', { name: 'Total Score' })).toHaveClass(
      'challenge-leaderboard__score-align',
    )
    expect(screen.getByRole('columnheader', { name: 'Rank' })).toHaveClass(
      'challenge-leaderboard__rank-align',
    )
    expect(rows[0].querySelector('.challenge-leaderboard__rank-badge')).toHaveTextContent(
      '1',
    )
    expect(rows[1].querySelector('.challenge-leaderboard__rank-badge')).toHaveTextContent(
      '2',
    )
    expect(rows[2].querySelector('.challenge-leaderboard__rank-badge')).toHaveTextContent(
      '3',
    )
    expect(rows[3].querySelector('.challenge-leaderboard__rank-badge')).toBeNull()
  })
})
