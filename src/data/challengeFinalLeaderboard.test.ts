import { describe, expect, it } from 'vitest'
import { challengeFinalLeaderboardEntries } from './challengeFinalLeaderboard'

describe('challenge final leaderboard', () => {
  it('preserves the six final weighted scores and supplied ranking', () => {
    expect(challengeFinalLeaderboardEntries.map((entry) => [
      entry.rank,
      entry.teamId,
      entry.teamName,
      entry.taskProgress,
      entry.successRate,
      entry.onlineScore,
      entry.totalScore,
    ])).toEqual([
      [1, 'T000010', 'Primotion', 43.75, 20, 93.62, 46.599],
      [2, 'T000018', 'Northstar', 43, 25, 87.22, 46.444],
      [3, 'T000022', 'XJTU_Talent', 38.25, 17.5, 85.54, 41.483],
      [4, 'T000020', 'hit_miao', 28, 12.5, 86.38, 35.026],
      [5, 'T000012', 'sota', 21.75, 10, 92.37, 32.349],
      [6, 'T000028', 'QQ', 2.25, 0, 88.06, 18.737],
    ])
  })

  it('matches the source weighting for every team', () => {
    for (const entry of challengeFinalLeaderboardEntries) {
      expect(
        0.5 * entry.taskProgress + 0.3 * entry.successRate + 0.2 * entry.onlineScore,
      ).toBeCloseTo(entry.totalScore, 3)
    }
  })
})
