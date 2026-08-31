import { describe, expect, it } from 'vitest'

import { challengeLeaderboardEntries } from './challengeLeaderboard.generated'

describe('generated challenge leaderboard data', () => {
  it('contains only the verified public rankings', () => {
    expect(challengeLeaderboardEntries).toEqual([
      {
        rank: 1,
        teamId: 'T000012',
        teamName: 'sota',
        totalScore: 92.37289954342617,
      },
      {
        rank: 2,
        teamId: 'T000010',
        teamName: 'Primotion',
        totalScore: 92.19324603152762,
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
        totalScore: 69.17817863110619,
      },
      {
        rank: 5,
        teamId: 'T000019',
        teamName: 'PeaceVLA',
        totalScore: 58.2384178292082,
      },
      {
        rank: 6,
        teamId: 'T000016',
        teamName: 'Nova',
        totalScore: 51.38199473968168,
      },
      {
        rank: 7,
        teamId: 'T000014',
        teamName: 'Spark',
        totalScore: 50.75683078390648,
      },
      {
        rank: 8,
        teamId: 'T000017',
        teamName: 'JustTry',
        totalScore: 49.46441169355271,
      },
      {
        rank: 9,
        teamId: 'T000011',
        teamName: 'Horizon',
        totalScore: 48.118633605621966,
      },
      {
        rank: 10,
        teamId: 'T000013',
        teamName: 'RoboDeamers',
        totalScore: 47.42043671278776,
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
