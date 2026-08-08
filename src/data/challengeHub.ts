export interface ChallengeHubNavigationItem {
  label: string
  href: '#overview' | '#tasks' | '#evaluation' | '#prizes' | '#updates'
}

export interface ChallengeHubParticipationStep {
  number: '01' | '02' | '03'
  title: string
  description: string
}

export const challengeHub = {
  identity: 'BIMANUAL ROBOT LEARNING WORKSHOP · IROS 2026',
  navigation: [
    { label: 'Overview', href: '#overview' },
    { label: 'Tasks', href: '#tasks' },
    { label: 'Evaluation', href: '#evaluation' },
    { label: 'Prizes', href: '#prizes' },
    { label: 'Updates', href: '#updates' },
  ] satisfies ChallengeHubNavigationItem[],
  hero: {
    titleLines: ['Real-World Household', 'Bimanual Manipulation'],
    accent: 'Challenge',
    sponsor: 'Designed and sponsored by PrimeBot',
    tagline: 'Train from real demonstrations. Evaluate on real robots.',
  },
  factRail: [
    '12+ household tasks',
    'Teleoperation + UMI data',
    'Online + real-robot evaluation',
    'USD 2,000 prize pool',
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
    url: 'https://huggingface.co/datasets/challenge-2026/challenge_data',
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
  future: {
    leaderboardTitle: 'Leaderboard',
    leaderboardDescription: 'Opens with online evaluation. Coming soon.',
    updatesTitle: 'Updates',
    updatesDescription:
      'Dataset releases, evaluation notices, and rule changes will be posted here.',
  },
} as const
