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
      [3, 'T000028', 'QQ', 88.05997655444179],
      [4, 'T000018', 'Northstar', 87.21684239491645],
      [5, 'T000020', 'hit-miao', 86.37642646088679],
      [6, 'T000022', 'XJTU_Talent', 85.54352657352001],
      [7, 'T000015', 'NPU-EAI', 84.94469253955613],
      [8, 'T000024', 'longteam', 81.11725747596212],
      [9, 'T000029', 'X', 80.83227484829236],
      [10, 'T000026', 'ExperimentB_stage2_100M', 65.92298821342825],
      [11, 'T000025', 'Generalist', 61.31186920020299],
      [12, 'T000019', 'PeaceVLA', 59.02255636634523],
      [13, 'T000016', 'Nova', 51.38199473968168],
      [14, 'T000014', 'Spark', 50.75683078390648],
      [15, 'T000017', 'JustTry', 49.46441169355271],
      [16, 'T000011', 'Horizon', 48.118633605621966],
      [17, 'T000013', 'RoboDeamers', 47.42043671278776],
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
