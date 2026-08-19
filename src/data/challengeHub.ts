import { challengeDatasetUrl } from './workshop'

export interface ChallengeHubNavigationItem {
  label: string
  href: '#overview' | '#tasks' | '#evaluation' | '#prizes' | '#leaderboard'
}

export interface ChallengeHubParticipationStep {
  number: '01' | '02' | '03'
  title: string
  description: string
}

export type ChallengeLeaderboardStatus =
  | 'Online Evaluation'
  | 'Finalist'
  | 'Final Result'

export interface ChallengeLeaderboardEntry {
  rank: number
  team: string
  onlineScore: number
  realRobotScore: number | null
  finalScore: number | null
  status: ChallengeLeaderboardStatus
}

export interface ChallengeHubLeaderboard {
  status: 'Results pending'
  openingDate: 'August 25, 2026'
  entries: readonly ChallengeLeaderboardEntry[]
}

export const challengeHub = {
  identity: 'BIMANUAL ROBOT LEARNING WORKSHOP · IROS 2026',
  navigation: [
    { label: 'Overview', href: '#overview' },
    { label: 'Tasks', href: '#tasks' },
    { label: 'Evaluation', href: '#evaluation' },
    { label: 'Prizes', href: '#prizes' },
    { label: 'Leaderboard', href: '#leaderboard' },
  ] satisfies ChallengeHubNavigationItem[],
  hero: {
    titleLines: ['Household Bimanual', 'Manipulation'],
    accent: 'Challenge',
    sponsorPrefix: 'Designed and sponsored by',
    tagline: 'Train from real demonstrations. Evaluate on real robots.',
  },
  factRail: [
    '1,500+ hours',
    'Teleoperation + UMI data',
    'Online + real-robot evaluation',
    'USD 3,000 prize pool',
  ],
  overview: {
    eyebrow: 'About the challenge',
    title: 'From real demonstrations to real robots.',
    description:
      'This challenge focuses on real-world bimanual manipulation in household environments. Participants are free to design their own data mixtures and training strategies using real-robot teleoperation and UMI demonstrations.',
  },
  dataset: {
    eyebrow: 'Dataset access',
    title: 'Built for real-world training.',
    items: [
      'Real-robot teleoperation data',
      'UMI demonstrations',
      'LeRobot V2.1 format',
      'Sample data available',
    ],
    url: challengeDatasetUrl,
    action: 'Explore on Hugging Face',
    note:
      'Complete dataset documentation, field definitions, sample files, and loading examples are maintained on Hugging Face.',
  },
  participationSteps: [
    {
      number: '01',
      title: 'Access the data',
      description: 'Explore sample data and documentation on Hugging Face.',
    },
    {
      number: '02',
      title: 'Train your policy',
      description: 'Choose a data mixture and training strategy.',
    },
    {
      number: '03',
      title: 'Submit for evaluation',
      description:
        'Enter online evaluation; top entries may advance to real-robot testing.',
    },
  ] satisfies ChallengeHubParticipationStep[],
  taskScope:
    'Real-robot evaluation covers up to four household tasks, including washer manipulation and clothing folding.',
  leaderboard: {
    status: 'Results pending',
    openingDate: 'August 25, 2026',
    entries: [] satisfies ChallengeLeaderboardEntry[],
  } satisfies ChallengeHubLeaderboard,
} as const
