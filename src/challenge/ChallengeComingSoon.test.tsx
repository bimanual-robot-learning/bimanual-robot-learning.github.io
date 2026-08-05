import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ChallengeComingSoon from './ChallengeComingSoon'
import challengeStyles from './ChallengeComingSoon.css?raw'

const findClosingBrace = (source: string, openingBrace: number) => {
  let depth = 1

  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') depth -= 1
    if (depth === 0) return index
  }

  throw new Error('Unclosed CSS block')
}

const extractCssBlock = (source: string, marker: string) => {
  const markerStart = source.indexOf(marker)
  expect(markerStart).toBeGreaterThanOrEqual(0)

  const openingBrace = source.indexOf('{', markerStart + marker.length)
  expect(openingBrace).toBeGreaterThan(markerStart)
  const closingBrace = findClosingBrace(source, openingBrace)

  return source.slice(openingBrace + 1, closingBrace)
}

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
    const pageRule = extractCssBlock(challengeStyles, '.challenge-coming-soon')
    const focusRule = extractCssBlock(
      challengeStyles,
      '.challenge-coming-soon__back:focus-visible',
    )
    const mobileRules = extractCssBlock(
      challengeStyles,
      '@media (max-width: 600px)',
    )
    const mobileHeadingRule = extractCssBlock(
      mobileRules,
      '.challenge-coming-soon h1',
    )
    const reducedMotionRules = extractCssBlock(
      challengeStyles,
      '@media (prefers-reduced-motion: reduce)',
    )
    const reducedMotionBackRule = extractCssBlock(
      reducedMotionRules,
      '.challenge-coming-soon__back',
    )

    expect(pageRule).toContain('min-height: 100svh;')
    expect(focusRule).toContain('outline: 3px solid var(--orange);')
    expect(mobileHeadingRule).toContain(
      'font-size: clamp(2.8rem, 14vw, 4rem);',
    )
    expect(reducedMotionBackRule).toContain('transition: none;')
  })
})
