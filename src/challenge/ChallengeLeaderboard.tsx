import { useId, useLayoutEffect, useRef } from 'react'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import './ChallengeLeaderboard.css'

interface ChallengeLeaderboardProps {
  entries: readonly ChallengeLeaderboardEntry[]
  previewRows?: number
}

function formatScore(score: number) {
  return score.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatTeamId(teamId: string) {
  const finalDigits = teamId.match(/(\d{2})$/)?.[1]
  return finalDigits ? `T${finalDigits}` : teamId
}

function getRankAccent(rank: number) {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return undefined
}

function ChallengeLeaderboard({ entries, previewRows }: ChallengeLeaderboardProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const hintId = useId()
  const isPreview = previewRows !== undefined && previewRows > 0 && entries.length > previewRows

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !isPreview || previewRows === undefined) return
    const table = viewport.querySelector('table')
    const lastVisibleRow = table?.tBodies[0]?.rows[previewRows - 1]
    if (!table || !lastVisibleRow) return

    // Measure real rows rather than assuming a fixed font size or row height.
    // Table-relative coordinates remain stable when the user scrolls.
    const updateHeight = () => {
      const contentHeight = lastVisibleRow.getBoundingClientRect().bottom - table.getBoundingClientRect().top
      if (contentHeight <= 0) return
      const bordersAndScrollbar = viewport.offsetHeight - viewport.clientHeight
      viewport.style.setProperty(
        '--leaderboard-preview-height',
        `${Math.ceil(contentHeight + bordersAndScrollbar)}px`,
      )
    }

    updateHeight()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateHeight)
    observer?.observe(table)
    window.addEventListener('resize', updateHeight)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateHeight)
      viewport.style.removeProperty('--leaderboard-preview-height')
    }
  }, [entries, isPreview, previewRows])

  return (
    <>
      <div
        ref={viewportRef}
        aria-label={isPreview
          ? 'Challenge leaderboard table; scroll vertically for more teams and horizontally for all columns'
          : 'Challenge leaderboard table; scroll horizontally to view all columns'}
        aria-describedby={isPreview ? hintId : undefined}
        className={`challenge-leaderboard__viewport${isPreview ? ' challenge-leaderboard__viewport--preview' : ''}`}
        tabIndex={0}
      >
        <table className="challenge-leaderboard__table">
          <caption className="sr-only">
            Household Bimanual Manipulation Challenge rankings
          </caption>
          <colgroup>
            <col className="challenge-leaderboard__rank-column" />
            <col className="challenge-leaderboard__id-column" />
            <col className="challenge-leaderboard__name-column" />
            <col className="challenge-leaderboard__score-column" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="challenge-leaderboard__rank-align">
                Rank
              </th>
              <th scope="col">Team ID</th>
              <th scope="col">Team Name</th>
              <th scope="col" className="challenge-leaderboard__score-align">
                Total Score
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr className="challenge-leaderboard__empty">
                <td colSpan={4}>
                  Verified online evaluation results will be published here as
                  submissions are evaluated.
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const rankAccent = getRankAccent(entry.rank)

                return (
                  <tr
                    data-rank-accent={rankAccent}
                    data-testid="challenge-leaderboard-entry"
                    key={entry.teamId}
                  >
                    <td className="challenge-leaderboard__rank challenge-leaderboard__rank-align">
                      {rankAccent ? (
                        <span className="challenge-leaderboard__rank-badge">
                          {entry.rank}
                        </span>
                      ) : (
                        entry.rank
                      )}
                    </td>
                    <td className="challenge-leaderboard__team-id">
                      {formatTeamId(entry.teamId)}
                    </td>
                    <th scope="row">{entry.teamName}</th>
                    <td className="challenge-leaderboard__score challenge-leaderboard__score-align">
                      {formatScore(entry.totalScore)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {isPreview && (
        <p className="challenge-leaderboard__scroll-hint" id={hintId}>
          {entries.length} teams · Scroll to view more
        </p>
      )}
    </>
  )
}

export default ChallengeLeaderboard
