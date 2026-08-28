import { describe, expect, it } from 'vitest'

import { challengeLeaderboardEntries } from './challengeLeaderboard.generated'

describe('generated challenge leaderboard data', () => {
  it('contains only the verified public rankings', () => {
    expect(challengeLeaderboardEntries).toEqual([
      {
        rank: 1,
        teamId: 'T000012',
        teamName: 'sota',
        totalScore: 91.39079444134364,
      },
      {
        rank: 2,
        teamId: 'T000010',
        teamName: 'Primotion',
        totalScore: 91.2235885623239,
      },
      {
        rank: 3,
        teamId: 'T000015',
        teamName: 'NPU-EAI',
        totalScore: 81.16407845650562,
      },
      {
        rank: 4,
        teamId: 'T000018',
        teamName: 'Northstar',
        totalScore: 63.717478739604296,
      },
      {
        rank: 5,
        teamId: 'T000019',
        teamName: 'PeaceVLA',
        totalScore: 46.477536092119884,
      },
      {
        rank: 6,
        teamId: 'T000011',
        teamName: 'Horizon',
        totalScore: 45.316634329010284,
      },
      {
        rank: 7,
        teamId: 'T000013',
        teamName: 'RoboDeamers',
        totalScore: 38.2048171454412,
      },
      {
        rank: 8,
        teamId: 'T000014',
        teamName: 'Spark',
        totalScore: 32.23415088544078,
      },
      {
        rank: 9,
        teamId: 'T000016',
        teamName: 'Nova',
        totalScore: 25.256173270406542,
      },
      {
        rank: 10,
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
