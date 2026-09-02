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
      href: '#leaderboard',
    })
    expect(challengeHub.leaderboard.status).toBe('Verified results')
    expect(challengeHub.leaderboard.updatedAt).toBe('Updated Sep. 2, 2026')
    expect(challengeHub.leaderboard).not.toHaveProperty('openingDate')
    expect(challengeHub.leaderboard.entries).toHaveLength(13)
    expect(challengeHub.leaderboard.entries[0]).toEqual({
      rank: 1,
      teamId: 'T000012',
      teamName: 'sota',
      totalScore: 92.37289954342617,
    })
  })
})
