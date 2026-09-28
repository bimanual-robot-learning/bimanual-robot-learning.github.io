import type { ChallengeLeaderboardEntry } from './challengeLeaderboard.generated'

// Final weighted scores from 最终排名.xlsx, Sheet1!A3:F8.
// Team IDs are matched to the existing public online leaderboard.
export const challengeFinalLeaderboardEntries = [
  { rank: 1, teamId: 'T000010', teamName: 'Primotion', totalScore: 46.599 },
  { rank: 2, teamId: 'T000018', teamName: 'Northstar', totalScore: 46.444 },
  { rank: 3, teamId: 'T000022', teamName: 'XJTU_Talent', totalScore: 41.483 },
  { rank: 4, teamId: 'T000020', teamName: 'hit_miao', totalScore: 35.026 },
  { rank: 5, teamId: 'T000012', teamName: 'sota', totalScore: 32.349 },
  { rank: 6, teamId: 'T000028', teamName: 'QQ', totalScore: 18.737 },
] as const satisfies readonly ChallengeLeaderboardEntry[]
