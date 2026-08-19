import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import './ChallengeLeaderboard.css'

interface ChallengeLeaderboardProps {
  entries: readonly ChallengeLeaderboardEntry[]
  openingDate: string
}

function formatScore(score: number | null) {
  return score === null
    ? '—'
    : score.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function ChallengeLeaderboard({
  entries,
  openingDate,
}: ChallengeLeaderboardProps) {
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
            <th scope="col">Team</th>
            <th scope="col">Online Score</th>
            <th scope="col">Real-Robot Score</th>
            <th scope="col">Final Score</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr className="challenge-leaderboard__empty">
              <td colSpan={6}>
                <div className="challenge-leaderboard__empty-content">
                  <strong>Leaderboard opens {openingDate}</strong>
                  <span>
                    Verified online evaluation results will be published here
                    as submissions are evaluated.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr
                data-testid="challenge-leaderboard-entry"
                key={`${entry.rank}-${entry.team}`}
              >
                <td>{entry.rank}</td>
                <th scope="row">{entry.team}</th>
                <td>{formatScore(entry.onlineScore)}</td>
                <td>{formatScore(entry.realRobotScore)}</td>
                <td>{formatScore(entry.finalScore)}</td>
                <td>{entry.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ChallengeLeaderboard
