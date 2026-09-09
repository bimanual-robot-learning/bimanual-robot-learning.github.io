import { describe, expect, it } from 'vitest'

import { challengeLeaderboardEntries } from './challengeLeaderboard.generated'

describe('generated challenge leaderboard data', () => {
  it('contains only the verified public rankings', () => {
    expect(
      challengeLeaderboardEntries.map(
        ({ rank, teamId, teamName, totalScore }) => [
          rank,
          teamId,
          teamName,
          totalScore,
        ],
      ),
    ).toEqual([
      [1, 'T000010', 'Primotion', 93.62288505564715],
      [2, 'T000012', 'sota', 92.37289954342617],
      [3, 'T000015', 'NPU-EAI', 85.56472369370465],
      [4, 'T000022', 'XJTU_Talent', 85.4081892151743],
      [5, 'T000020', 'hit-miao', 85.12080971560738],
      [6, 'T000018', 'Northstar', 80.27585469615003],
      [7, 'T000028', 'QQ', 77.28630124088222],
      [8, 'T000021', 'cot4b_x2w_step60k', 74.38451757806249],
      [9, 'T000026', 'Stage1_official_validation_under_100m', 66.32770334240178],
      [10, 'T000025', 'Generalist', 61.31186920020299],
      [11, 'T000019', 'PeaceVLA', 59.02255636634523],
      [12, 'T000016', 'Nova', 51.38199473968168],
      [13, 'T000014', 'Spark', 50.75683078390648],
      [14, 'T000017', 'JustTry', 49.46441169355271],
      [15, 'T000011', 'Horizon', 48.118633605621966],
      [16, 'T000013', 'RoboDeamers', 47.42043671278776],
      [17, 'T000024', 'longteam', 42.89436813492114],
      [18, 'T000023', 'ACTVisionOnly', 39.130536713459584],
      [19, 'T000027', 'DBX', 2.843938684624341],
    ])

    for (const entry of challengeLeaderboardEntries) {
      expect(Object.keys(entry).sort()).toEqual(
        ['rank', 'teamId', 'teamName', 'totalScore'].sort(),
      )
      expect(entry.teamName).not.toContain(' - ')
    }
  })
})
