import { describe, expect, it } from 'vitest'

import { challengeLeaderboardEntries } from './challengeLeaderboard.generated'

describe('generated challenge leaderboard data', () => {
  it('contains only the verified public rankings', () => {
    expect(challengeLeaderboardEntries).toHaveLength(8)
    expect(challengeLeaderboardEntries.map(({ rank }) => rank)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ])
    expect(challengeLeaderboardEntries[0]).toEqual({
      rank: 1,
      teamId: 'T000015',
      teamName: 'npu-eai',
      totalScore: 73.89246498024903,
    })
    expect(challengeLeaderboardEntries.at(-1)).toEqual({
      rank: 8,
      teamId: 'T000017',
      teamName: 'JustTry',
      totalScore: 17.26342222271593,
    })

    for (const entry of challengeLeaderboardEntries) {
      expect(Object.keys(entry).sort()).toEqual(
        ['rank', 'teamId', 'teamName', 'totalScore'].sort(),
      )
      expect(entry.teamName).not.toContain(' - ')
    }
  })
})
