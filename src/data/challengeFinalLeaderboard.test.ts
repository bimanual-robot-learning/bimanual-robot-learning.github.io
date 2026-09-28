import { describe, expect, it } from 'vitest'
import { challengeFinalLeaderboardEntries } from './challengeFinalLeaderboard'

describe('challenge final leaderboard', () => {
  it('preserves the six final weighted scores and supplied ranking', () => {
    expect(challengeFinalLeaderboardEntries.map((entry) => [
      entry.rank,
      entry.teamId,
      entry.teamName,
      entry.totalScore,
    ])).toEqual([
      [1, 'T000010', 'Primotion', 46.599],
      [2, 'T000018', 'Northstar', 46.444],
      [3, 'T000022', 'XJTU_Talent', 41.483],
      [4, 'T000020', 'hit_miao', 35.026],
      [5, 'T000012', 'sota', 32.349],
      [6, 'T000028', 'QQ', 18.737],
    ])
  })
})
