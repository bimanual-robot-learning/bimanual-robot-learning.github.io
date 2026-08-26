import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import './ChallengeLeaderboard.css'

interface ChallengeLeaderboardProps {
  entries: readonly ChallengeLeaderboardEntry[]
}

function formatScore(score: number) {
  return score.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getRankAccent(rank: number) {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return undefined
}

function ChallengeLeaderboard({ entries }: ChallengeLeaderboardProps) {
  return (
    <div
      aria-label="Challenge leaderboard table; scroll horizontally to view all columns"
      className="challenge-leaderboard__viewport"
      tabIndex={0}
    >
      <table className="challenge-leaderboard__table">
        <caption className="sr-only">
          Household Bimanual Manipulation Challenge rankings
        </caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Team ID</th>
            <th scope="col">Team Name</th>
            <th scope="col">Total Score</th>
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
            entries.map((entry) => (
              <tr
                data-rank-accent={getRankAccent(entry.rank)}
                data-testid="challenge-leaderboard-entry"
                key={entry.teamId}
              >
                <td>{entry.rank}</td>
                <td>{entry.teamId}</td>
                <th scope="row">{entry.teamName}</th>
                <td>{formatScore(entry.totalScore)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ChallengeLeaderboard
