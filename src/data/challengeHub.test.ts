import { describe, expect, it } from 'vitest'
import { challengeHub } from './challengeHub'

describe('challengeHub content', () => {
  it('keeps the page concise and directs full data details to Hugging Face', () => {
    expect(challengeHub.dataset.url).toBe(
      'https://huggingface.co/datasets/challenge-2026/challenge_data',
    )
    expect(challengeHub.factRail).toEqual([
      '12+ household tasks',
      'Teleoperation + UMI data',
      'Online + real-robot evaluation',
      'USD 2,000 prize pool',
    ])
    expect(challengeHub.participationSteps).toHaveLength(3)
    expect(challengeHub.navigation.map(({ href }) => href)).toEqual([
      '#overview',
      '#tasks',
      '#evaluation',
      '#prizes',
      '#updates',
    ])
  })
})
