import type { ChallengeLeaderboardEntry } from './challengeLeaderboard.generated'

export interface ChallengeFinalLeaderboardEntry extends ChallengeLeaderboardEntry {
  taskProgress: number
  successRate: number
  onlineScore: number
}

// Final weighted scores from 最终排名.xlsx, Sheet1!A3:F8.
// Team IDs are matched to the existing public online leaderboard.
export const challengeFinalLeaderboardEntries = [
  { rank: 1, teamId: 'T000010', teamName: 'Primotion', taskProgress: 43.75, successRate: 20, onlineScore: 93.62, totalScore: 46.599 },
  { rank: 2, teamId: 'T000018', teamName: 'Northstar', taskProgress: 43, successRate: 25, onlineScore: 87.22, totalScore: 46.444 },
  { rank: 3, teamId: 'T000022', teamName: 'XJTU_Talent', taskProgress: 38.25, successRate: 17.5, onlineScore: 85.54, totalScore: 41.483 },
  { rank: 4, teamId: 'T000020', teamName: 'hit_miao', taskProgress: 28, successRate: 12.5, onlineScore: 86.38, totalScore: 35.026 },
  { rank: 5, teamId: 'T000012', teamName: 'sota', taskProgress: 21.75, successRate: 10, onlineScore: 92.37, totalScore: 32.349 },
  { rank: 6, teamId: 'T000028', teamName: 'QQ', taskProgress: 2.25, successRate: 0, onlineScore: 88.06, totalScore: 18.737 },
] as const satisfies readonly ChallengeFinalLeaderboardEntry[]
