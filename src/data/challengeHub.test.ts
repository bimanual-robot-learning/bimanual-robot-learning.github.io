import { describe, expect, it } from 'vitest'
import { challengeHub } from './challengeHub'

describe('challengeHub content', () => {
  it('defines the refined challenge and leaderboard content', () => {
    expect(challengeHub.hero).toMatchObject({
      titleLines: ['Household Bimanual', 'Manipulation'],
      accent: 'Challenge',
      sponsorPrefix: 'Designed and sponsored by',
      tagline: 'Train from real demonstrations. Evaluate on real robots.',
    })
    expect(challengeHub.dataset.url).toBe(
      'https://huggingface.co/datasets/challenge-2026/challenge_data',
    )
    expect(challengeHub.factRail).toEqual([
      '1,500+ hours',
      'Teleoperation + UMI data',
      'Online + real-robot evaluation',
      'USD 3,000 prize pool',
    ])
    expect(challengeHub.factRail).not.toContain('12+ household tasks')
    expect(challengeHub.participationSteps).toHaveLength(3)
    expect(challengeHub.navigation).toContainEqual({
      label: 'Leaderboard',
      href: '#updates',
    })
    expect(challengeHub.leaderboard).toEqual({
      eyebrow: 'Leaderboard',
      status: 'Coming soon',
      title: 'Leaderboard opens with online evaluation.',
      description:
        'Scores and final rankings will appear here after the evaluation portal opens.',
      openingDate: 'August 25, 2026',
      stages: ['Online score', 'Real-robot score', 'Final ranking'],
    })
  })
})
