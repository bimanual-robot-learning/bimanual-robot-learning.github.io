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

    expect(
      screen.getByText('BIMANUAL ROBOT LEARNING WORKSHOP · IROS 2026'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Towards Bimanual Intelligence',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('A Real-World Household Manipulation Challenge'),
    ).toBeInTheDocument()
    expect(screen.getByText('Designed and sponsored by')).toBeInTheDocument()
    expect(screen.getByText('PrimeBot')).toBeInTheDocument()
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
    const headingRule = extractCssBlock(
      challengeStyles,
      '.challenge-coming-soon h1',
    )
    const subtitleRule = extractCssBlock(
      challengeStyles,
      '.challenge-coming-soon__subtitle',
    )
    const sponsorRule = extractCssBlock(
      challengeStyles,
      '.challenge-coming-soon__sponsor',
    )
    const sponsorDividerRule = extractCssBlock(
      challengeStyles,
      '.challenge-coming-soon__sponsor::before',
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
    expect(headingRule).toContain(
      'font: 600 clamp(3.25rem, 6.5vw, 5.5rem)/0.98 var(--font-display);',
    )
    expect(subtitleRule).toContain(
      'font: 500 clamp(1.5rem, 3.2vw, 2.25rem)/1.25 var(--font-display);',
    )
    expect(sponsorRule).toContain('display: flex;')
    expect(sponsorDividerRule).toContain('width: 26px;')
    expect(sponsorDividerRule).toContain(
      'background: rgba(82, 216, 230, 0.42);',
    )
    expect(mobileHeadingRule).toContain(
      'font-size: clamp(2.6rem, 12vw, 3.5rem);',
    )
    expect(reducedMotionBackRule).toContain('transition: none;')
  })
})
