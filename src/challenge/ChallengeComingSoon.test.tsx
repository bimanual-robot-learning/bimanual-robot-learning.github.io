import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ChallengeComingSoon from './ChallengeComingSoon'

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
})
