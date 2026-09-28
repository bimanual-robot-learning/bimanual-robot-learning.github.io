import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import { challengeFinalLeaderboardEntries, type ChallengeFinalLeaderboardEntry } from '../data/challengeFinalLeaderboard'
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
  it('shows all three source components before the final weighted score', () => {
    render(<ChallengeLeaderboard entries={challengeFinalLeaderboardEntries} stage="final" />)

    expect(screen.getByText('Swipe to view all scores →')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Rank', 'Team ID', 'Team Name', 'Avg. Task Progress (50%)',
      'Avg. Success Rate (30%)', 'Online Score (20%)', 'Final Score',
    ])
    expect(screen.getByRole('row', {
      name: '1 T10 Primotion 43.75 20.00 93.62 46.599',
    })).toBeVisible()
    expect(screen.getByRole('row', {
      name: '6 T28 QQ 2.25 0.00 88.06 18.737',
    })).toBeVisible()
    expect(screen.getAllByTestId('challenge-leaderboard-entry')).toHaveLength(6)
  })

  it('keeps the final table wide and reserves gold for the weighted score cells', () => {
    expect(leaderboardStyles).toMatch(
      /@media \(max-width: 760px\) \{[\s\S]*?\.challenge-leaderboard__mobile-hint\s*\{[^}]*display:\s*block;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport:has\(\.challenge-leaderboard__table\[data-stage="final"\]\)\s*\{[^}]*width:\s*min\(100%,\s*1120px\);/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\[data-stage="final"\]\s*\{[^}]*min-width:\s*960px;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\[data-stage="final"\] \.challenge-leaderboard__component\s*\{[^}]*color:\s*rgba\(239,\s*247,\s*248,\s*0\.9\);/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\[data-stage="final"\] \.challenge-leaderboard__score\s*\{[^}]*color:\s*#f1c75b;/,
    )
  })

  const previewEntries: ChallengeLeaderboardEntry[] = Array.from(
    { length: 15 },
    (_, index) => ({
      rank: index + 1,
      teamId: `T0000${index + 10}`,
      teamName: `Test team ${index + 1}`,
      totalScore: 90 - index,
    }),
  )

  it('keeps every team in the ten-row preview and explains vertical scrolling', () => {
    render(<ChallengeLeaderboard entries={previewEntries} previewRows={10} />)
    const viewport = screen.getByLabelText(
      'Online evaluation table; scroll vertically for more teams and horizontally for all columns',
    )
    expect(viewport).toHaveClass('challenge-leaderboard__viewport--preview')
    expect(viewport).toHaveAttribute('tabindex', '0')
    expect(viewport).toHaveAccessibleDescription('15 teams · Scroll to view more')
    expect(screen.getAllByTestId('challenge-leaderboard-entry')).toHaveLength(15)
    expect(screen.getByRole('row', { name: '15 T24 Test team 15 76.00' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('removes preview mode when entries no longer exceed ten rows', () => {
    const { rerender } = render(
      <ChallengeLeaderboard entries={previewEntries} previewRows={10} />,
    )
    expect(screen.getByText('15 teams · Scroll to view more')).toBeVisible()
    rerender(<ChallengeLeaderboard entries={previewEntries.slice(0, 10)} previewRows={10} />)
    const viewport = screen.getByLabelText(
      'Online evaluation table; scroll horizontally to view all columns',
    )
    expect(viewport).not.toHaveClass('challenge-leaderboard__viewport--preview')
    expect(viewport).not.toHaveAttribute('aria-describedby')
    expect(viewport.style.getPropertyValue('--leaderboard-preview-height')).toBe('')
    expect(screen.queryByText(/Scroll to view more/)).not.toBeInTheDocument()
    rerender(<ChallengeLeaderboard entries={[]} previewRows={10} />)
    expect(screen.queryByText(/Scroll to view more/)).not.toBeInTheDocument()
  })

  it('leaves the full leaderboard uncapped by default', () => {
    render(<ChallengeLeaderboard entries={previewEntries} />)
    expect(screen.getAllByTestId('challenge-leaderboard-entry')).toHaveLength(15)
    expect(screen.getByLabelText(
      'Online evaluation table; scroll horizontally to view all columns',
    )).not.toHaveClass('challenge-leaderboard__viewport--preview')
    expect(screen.queryByText(/Scroll to view more/)).not.toBeInTheDocument()
  })

  it('scopes the vertical viewport and opaque sticky column headers to preview mode', () => {
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport--preview\s*\{[^}]*max-height:\s*var\(--leaderboard-preview-height\);[^}]*overflow-y:\s*auto;/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport--preview thead th\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*z-index:\s*2;[^}]*background:\s*#091821;/,
    )
    expect(leaderboardStyles).toContain('.challenge-leaderboard__scroll-hint')
  })

  it('renders a semantic, scrollable four-column empty leaderboard', () => {
    render(<ChallengeLeaderboard entries={[]} />)

    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual(['Rank', 'Team ID', 'Team Name', 'Online Score'])
    expect(
      screen.getByRole('table', {
        name: 'Household Bimanual Manipulation Challenge online evaluation rankings',
      }),
    ).toBeVisible()
    const viewport = screen.getByLabelText(
      'Online evaluation table; scroll horizontally to view all columns',
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

  it('renders three-decimal final scores, semantic row headers, and rank medals', () => {
    const entries: readonly ChallengeFinalLeaderboardEntry[] = [
      {
        rank: 1,
        teamId: 'T000015',
        teamName: 'npu-eai',
        taskProgress: 50,
        successRate: 40,
        onlineScore: 60,
        totalScore: 73.892246498024903,
      },
      { rank: 2, teamId: 'T000012', teamName: 'sota', taskProgress: 50, successRate: 40, onlineScore: 60, totalScore: 61.8 },
      { rank: 3, teamId: 'T000010', teamName: 'Primotion', taskProgress: 50, successRate: 40, onlineScore: 60, totalScore: 61 },
      { rank: 4, teamId: 'T000011', teamName: 'Horizon', taskProgress: 50, successRate: 40, onlineScore: 60, totalScore: 45.316 },
    ]
    const firstEntry = entries[0]

    render(<ChallengeLeaderboard entries={entries} stage="final" />)

    const rows = screen.getAllByTestId('challenge-leaderboard-entry')
    expect(rows).toHaveLength(4)
    expect(rows[0]).toHaveAccessibleName('1 T15 npu-eai 50.00 40.00 60.00 73.892')
    expect(rows[1]).toHaveAccessibleName('2 T12 sota 50.00 40.00 60.00 61.800')
    expect(rows[2]).toHaveAccessibleName('3 T10 Primotion 50.00 40.00 60.00 61.000')
    expect(rows[3]).toHaveAccessibleName('4 T11 Horizon 50.00 40.00 60.00 45.316')
    expect(firstEntry.teamId).toBe('T000015')
    expect(rows[0]).toHaveAttribute('data-rank-accent', 'gold')
    expect(rows[1]).toHaveAttribute('data-rank-accent', 'silver')
    expect(rows[2]).toHaveAttribute('data-rank-accent', 'bronze')
    expect(rows[3]).not.toHaveAttribute('data-rank-accent')
    expect(rows[0].querySelector('th[scope="row"]')).toHaveTextContent('npu-eai')
    expect(rows[0].querySelectorAll('td')).toHaveLength(6)
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
      const scoreCell = row.querySelectorAll('td')[5]

      expect(scoreCell).toHaveClass('challenge-leaderboard__score')
      expect(scoreCell).toHaveClass('challenge-leaderboard__score-align')
    })
    expect(screen.getByRole('columnheader', { name: 'Final Score' })).toHaveClass(
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

  it('distinguishes final and online score tables for readers', () => {
    const entry: readonly ChallengeFinalLeaderboardEntry[] = [
      { rank: 1, teamId: 'T000010', teamName: 'Primotion', taskProgress: 43.75, successRate: 20, onlineScore: 93.62, totalScore: 46.599 },
    ]
    const { rerender } = render(<ChallengeLeaderboard entries={entry} stage="final" />)

    expect(screen.getByRole('table')).toHaveAttribute('data-stage', 'final')
    expect(screen.getByRole('columnheader', { name: 'Final Score' })).toBeVisible()
    expect(screen.getByRole('row', { name: '1 T10 Primotion 43.75 20.00 93.62 46.599' })).toBeVisible()
    expect(screen.getByLabelText(
      'Final ranking table; scroll horizontally to view all columns',
    )).toBeVisible()

    rerender(<ChallengeLeaderboard entries={entry} stage="online" />)
    expect(screen.getByRole('table')).toHaveAttribute('data-stage', 'online')
    expect(screen.getByRole('columnheader', { name: 'Online Score' })).toBeVisible()
    expect(screen.getByRole('row', { name: '1 T10 Primotion 46.60' })).toBeVisible()
    expect(screen.getByRole('cell', { name: '1' }).querySelector('.challenge-leaderboard__rank-badge')).toBeNull()
    expect(screen.getByLabelText(
      'Online evaluation table; scroll horizontally to view all columns',
    )).toBeVisible()
  })

  it('uses gold final scores with a neutral heading while online scores stay cyan', () => {
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table thead th\s*\{[^}]*color:\s*rgba\(230,\s*241,\s*243,\s*0\.74\);/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table \.challenge-leaderboard__score\s*\{[^}]*color:\s*var\(--cyan\);/,
    )
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__table\[data-stage="final"\] \.challenge-leaderboard__score\s*\{[^}]*color:\s*#f1c75b;/,
    )
    expect(leaderboardStyles).not.toMatch(
      /\.challenge-leaderboard__table\[data-stage="final"\] tr\[data-rank-accent\] \.challenge-leaderboard__score\s*\{/,
    )
  })

})
