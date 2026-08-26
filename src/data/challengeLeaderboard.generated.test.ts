import { describe, expect, it } from 'vitest'

import { challengeLeaderboardEntries } from './challengeLeaderboard.generated'

describe('generated challenge leaderboard data', () => {
  it('contains only the verified public rankings', () => {
    expect(challengeLeaderboardEntries).toEqual([
      {
        rank: 1,
        teamId: 'T000015',
        teamName: 'npu-eai',
        totalScore: 73.89246498024903,
      },
      {
        rank: 2,
        teamId: 'T000012',
        teamName: 'sota',
        totalScore: 61.89411995284824,
      },
      {
        rank: 3,
        teamId: 'T000010',
        teamName: 'Primotion',
        totalScore: 61.354957482506116,
      },
      {
        rank: 4,
        teamId: 'T000011',
        teamName: 'Horizon',
        totalScore: 45.316634329010284,
      },
      {
        rank: 5,
        teamId: 'T000013',
        teamName: 'RoboDeamers',
        totalScore: 38.2048171454412,
      },
      {
        rank: 6,
        teamId: 'T000014',
        teamName: 'Spark',
        totalScore: 32.23415088544078,
      },
      {
        rank: 7,
        teamId: 'T000016',
        teamName: 'Nova',
        totalScore: 25.256173270406542,
      },
      {
        rank: 8,
        teamId: 'T000017',
        teamName: 'JustTry',
        totalScore: 17.26342222271593,
      },
    ])

    for (const entry of challengeLeaderboardEntries) {
      expect(Object.keys(entry).sort()).toEqual(
        ['rank', 'teamId', 'teamName', 'totalScore'].sort(),
      )
      expect(entry.teamName).not.toContain(' - ')
    }
  })
})
