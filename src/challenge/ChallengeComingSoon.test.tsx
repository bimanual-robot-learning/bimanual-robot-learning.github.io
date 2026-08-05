import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ChallengeComingSoon from './ChallengeComingSoon'
import challengeStyles from './ChallengeComingSoon.css?raw'

describe('ChallengeComingSoon', () => {
  it('renders the challenge announcement and workshop link', () => {
    render(<ChallengeComingSoon />)

    expect(screen.getByText('PRIMEBOT × IROS 2026')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Towards Bimanual Intelligence',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('A Real-World Household Manipulation Challenge'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Full challenge details are coming soon.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to workshop/i }),
    ).toHaveAttribute('href', '/')
  })

  it('defines responsive, accessible presentation rules', () => {
    expect(challengeStyles).toContain('.challenge-coming-soon {')
    expect(challengeStyles).toContain('min-height: 100svh;')
    expect(challengeStyles).toContain(
      '.challenge-coming-soon__back:focus-visible',
    )
    expect(challengeStyles).toContain('@media (max-width: 600px)')
    expect(challengeStyles).toContain(
      '@media (prefers-reduced-motion: reduce)',
    )
  })
})
