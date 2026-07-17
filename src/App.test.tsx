import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('workshop landing page', () => {
  it('renders the workshop identity and every primary section', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /Scaling vs\. Structure\?/i, level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Workshop @ IROS 2026')).toBeInTheDocument()
    expect(screen.getAllByText(/8:00 AM–12:30 PM EDT/)).not.toHaveLength(0)

    for (const section of [
      'Introduction',
      'Workshop Schedule',
      'Invited Speakers',
      'Call for Papers',
      'Workshop Organizers',
    ]) {
      expect(screen.getByRole('heading', { name: section })).toBeInTheDocument()
    }
  })

  it('renders all people and the complete schedule from structured content', () => {
    render(<App />)

    expect(screen.getAllByTestId('speaker-card')).toHaveLength(5)
    expect(screen.getAllByTestId('organizer-card')).toHaveLength(7)

    const scheduleTable = screen.getByRole('table', {
      name: 'IROS 2026 workshop schedule',
    })
    expect(within(scheduleTable).getAllByRole('row')).toHaveLength(11)
    expect(within(scheduleTable).getAllByText('Tentative')).toHaveLength(2)
    expect(within(scheduleTable).getAllByText('Pending')).toHaveLength(3)
  })

  it('presents the workshop premise as a single academic reading flow', () => {
    render(<App />)

    const introductionSection = screen.getByTestId('intro-editorial')
    const passages = within(introductionSection).getAllByTestId('intro-passage')

    expect(passages).toHaveLength(3)
    expect(within(passages[0]).getByRole('heading', { name: 'Context' })).toBeInTheDocument()
    expect(
      within(passages[1]).getByRole('heading', { name: 'Scaling view' }),
    ).toBeInTheDocument()
    expect(
      within(passages[2]).getByRole('heading', { name: 'Structure view' }),
    ).toBeInTheDocument()
    expect(within(introductionSection).getByTestId('intro-conclusion')).toBeInTheDocument()
  })

  it('gives CFP topics equal emphasis and highlights submission and award details', () => {
    render(<App />)

    const topicCards = screen.getAllByTestId('topic-card')
    expect(topicCards).toHaveLength(3)
    for (const card of topicCards) {
      expect(card).toHaveAttribute('data-accent', 'shared-blue')
    }

    expect(screen.getAllByTestId('submission-highlight')).toHaveLength(2)

    const awardItems = screen.getAllByTestId('award-item')
    expect(awardItems).toHaveLength(2)
    expect(within(awardItems[0]).getByText('Best Workshop Paper Award')).toBeInTheDocument()
    expect(within(awardItems[0]).getByText('USD 1,000')).toBeInTheDocument()
    expect(
      within(awardItems[1]).getByText('Outstanding Workshop Paper Award'),
    ).toBeInTheDocument()
    expect(within(awardItems[1]).getByText('USD 500')).toBeInTheDocument()
  })

  it('uses accessible local portraits and safe external calls to action', () => {
    render(<App />)

    const portraits = screen.getAllByRole('img')
    expect(portraits).toHaveLength(12)
    for (const portrait of portraits) {
      expect(portrait).toHaveAttribute('src', expect.stringMatching(/^\/images\//))
      expect(portrait).toHaveAttribute('alt', expect.stringMatching(/Portrait of/))
    }

    const submitLinks = screen.getAllByRole('link', { name: /OpenReview/i })
    expect(submitLinks).not.toHaveLength(0)
    for (const link of submitLinks) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }

    expect(screen.getByRole('link', { name: /PrimeBot/i })).toHaveAttribute(
      'href',
      'https://www.primebot.cn/',
    )
    expect(screen.getByRole('link', { name: /GitHub repository/i })).toHaveAttribute(
      'href',
      'https://github.com/bimanual-robot-learning/bimanual-robot-learning.github.io',
    )
  })

  it('toggles the compact navigation for small screens', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggle = screen.getByLabelText('Open navigation')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-label', 'Close navigation')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('link', { name: 'Schedule' }))
    expect(toggle).toHaveAttribute('aria-label', 'Open navigation')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('starts keyboard navigation with a skip link to the main content', async () => {
    const user = userEvent.setup()
    render(<App />)

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skipLink).toHaveAttribute('href', '#main-content')

    await user.tab()
    expect(skipLink).toHaveFocus()
  })
})
