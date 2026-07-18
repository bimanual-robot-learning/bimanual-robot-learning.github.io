import { useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  CalendarDays,
  Clock3,
  Code2,
  FileText,
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import {
  awards,
  importantDates,
  introduction,
  organizers,
  schedule,
  speakers,
  sponsor,
  submission,
  topicGroups,
  workshopMeta,
  type Person,
} from './data/workshop'
import './App.css'

const navigation = [
  { label: 'Introduction', href: '#introduction' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Call for Papers', href: '#call-for-papers' },
  { label: 'Organizers', href: '#organizers' },
]

function PersonCard({ person, kind }: { person: Person; kind: 'speaker' | 'organizer' }) {
  const initials = person.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <article className={`person-card person-card--${kind}`} data-testid={`${kind}-card`}>
      <div className="person-card__media">
        <span className="person-card__fallback" aria-hidden="true">
          {initials}
        </span>
        <img src={person.image} alt={person.imageAlt} loading="lazy" />
        <span className="person-card__corner" aria-hidden="true" />
      </div>
      <div className="person-card__copy">
        <h3>{person.name}</h3>
        <p>{person.institution}</p>
      </div>
    </article>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="brand" href="#top" onClick={closeMenu}>
            <span className="brand__mark" aria-hidden="true">
              <i />
              <i />
            </span>
            <span>
              BRL <b>/</b> IROS 2026
            </span>
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-links"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <div
            className={`nav-links${isMenuOpen ? ' nav-links--open' : ''}`}
            id="primary-links"
          >
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </div>

          <a
            className="nav-cta"
            href={workshopMeta.openReviewUrl}
            target="_blank"
            rel="noreferrer"
          >
            Submit
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__media" aria-hidden="true">
            <img src="/images/workshop-hero.jpg" alt="" />
            <div className="hero__media-overlay" />
          </div>

          <div className="hero__content page-width">
            <div className="hero__identity">
              <a
                className="hero__conference-brand"
                href={workshopMeta.conferenceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Visit the official IROS 2026 website"
              >
                <img src="/images/iros-2026-logo.png" alt="IROS 2026 Pittsburgh" />
              </a>

              <div className="hero__eyebrow">
                <span className="live-dot" aria-hidden="true" />
                {workshopMeta.eyebrow}
              </div>
            </div>

            <h1 id="hero-title">
              <span className="hero__title-scale">Scaling</span>{' '}
              <span className="hero__versus">vs.</span>{' '}
              <span className="hero__title-structure">Structure?</span>
            </h1>

            <p className="hero__subtitle">{workshopMeta.subtitle}</p>

            <div className="hero__meta" aria-label="Workshop details">
              <span>
                <CalendarDays size={17} aria-hidden="true" />
                {workshopMeta.date}
              </span>
              <span>
                <Clock3 size={17} aria-hidden="true" />
                {workshopMeta.time}
              </span>
              <span>
                <MapPin size={17} aria-hidden="true" />
                {workshopMeta.location}
              </span>
            </div>

            <div className="hero__actions">
              <a
                className="button button--primary"
                href={workshopMeta.openReviewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Submit via OpenReview
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href="#introduction">
                Explore the workshop
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero__side-note" aria-hidden="true">
            Bimanual intelligence / Pittsburgh / 2026
          </div>
        </section>

        <section className="section section--intro" id="introduction" aria-labelledby="introduction-title">
          <div className="page-width">
            <div className="section-heading">
              <p className="section-index">01 / Premise</p>
              <div>
                <h2 id="introduction-title">Introduction</h2>
                <p className="section-description">
                  A workshop around one deceptively simple question: is bimanual
                  intelligence a problem of scale, structure, or both?
                </p>
              </div>
            </div>

            <div className="intro-editorial" data-testid="intro-editorial">
              {introduction.points.map((point) => (
                <article
                  className={`intro-passage intro-passage--${point.tone}`}
                  data-testid="intro-passage"
                  key={point.title}
                >
                  <p className="intro-passage__label">{point.label}</p>
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </article>
              ))}

              <p className="intro-conclusion" data-testid="intro-conclusion">
                {introduction.conclusion}
              </p>
            </div>
          </div>
        </section>

        <section className="section section--dark" id="schedule" aria-labelledby="schedule-title">
          <div className="page-width">
            <div className="section-heading section-heading--inverse">
              <p className="section-index">02 / Program</p>
              <div>
                <h2 id="schedule-title">Workshop Schedule</h2>
                <p className="section-description">
                  A focused half-day program of invited talks, selected contributions,
                  discussion, and community exchange.
                </p>
              </div>
            </div>

            <div className="schedule-shell">
              <div className="schedule-meta">
                <span>
                  <CalendarDays size={16} aria-hidden="true" />
                  Sunday, September 27
                </span>
                <span>
                  <Clock3 size={16} aria-hidden="true" />
                  EDT · UTC−4
                </span>
              </div>

              <div className="schedule-scroll">
                <table className="schedule-table">
                  <caption className="sr-only">IROS 2026 workshop schedule</caption>
                  <thead>
                    <tr>
                      <th scope="col">Time</th>
                      <th scope="col">Speaker / Session</th>
                      <th scope="col">Talk Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((entry) => (
                      <tr
                        key={`${entry.time}-${entry.speakerOrSession}`}
                        data-kind={entry.kind}
                      >
                        <td data-label="Time" className="schedule-time">
                          {entry.time}
                        </td>
                        <th data-label="Speaker / Session" scope="row">
                          {entry.speakerOrSession}
                        </th>
                        <td data-label="Talk Title" className="schedule-title-cell">
                          {entry.talkTitle !== 'Pending' && (
                            <span>{entry.talkTitle}</span>
                          )}
                          {entry.status !== 'confirmed' && (
                            <span className={`status-badge status-badge--${entry.status}`}>
                              {entry.status === 'tentative' ? 'Tentative' : 'Pending'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--speakers" id="speakers" aria-labelledby="speakers-title">
          <div className="page-width">
            <div className="section-heading">
              <p className="section-index">03 / Voices</p>
              <div>
                <h2 id="speakers-title">Invited Speakers</h2>
                <p className="section-description">
                  Perspectives spanning humanoid intelligence, industrial automation,
                  foundation models, and embodied systems.
                </p>
              </div>
            </div>

            <div className="speaker-grid">
              {speakers.map((speaker) => (
                <PersonCard key={speaker.name} person={speaker} kind="speaker" />
              ))}
            </div>
          </div>
        </section>

        <section
          className="section section--cfp"
          id="call-for-papers"
          aria-labelledby="cfp-title"
        >
          <div className="page-width">
            <div className="section-heading section-heading--inverse">
              <p className="section-index">04 / Contribute</p>
              <div>
                <h2 id="cfp-title">Call for Papers</h2>
                <p className="section-description">
                  We welcome recent work on bimanual manipulation and related problems
                  in robotics and embodied AI.
                </p>
              </div>
            </div>

            <div className="cfp-intro">
              <p>
                Contributions may advance systems that scale data and models, develop
                structures for coordination and control, or connect these two views.
              </p>
              <a
                className="text-link"
                href={workshopMeta.openReviewUrl}
                target="_blank"
                rel="noreferrer"
              >
                OpenReview submission portal
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>

            <div className="topic-grid">
              {topicGroups.map((group) => (
                <article
                  className="topic-card"
                  data-accent="shared-blue"
                  data-testid="topic-card"
                  key={group.label}
                >
                  <p className="topic-card__label">{group.label}</p>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="submission-panel">
              <div className="submission-panel__icon" aria-hidden="true">
                <FileText />
              </div>
              <div>
                <p className="eyebrow">Submission format</p>
                <h3>Short papers & extended abstracts</h3>
              </div>
              <div className="submission-panel__copy">
                <article data-testid="submission-highlight">
                  <span>Submission requirements</span>
                  <p>{submission.description}</p>
                </article>
                <article data-testid="submission-highlight">
                  <span>At the workshop</span>
                  <p>{submission.presentation}</p>
                </article>
              </div>
              <a
                className="button button--orange"
                href={workshopMeta.openReviewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Submit your work
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>

            <div className="cfp-details">
              <article className="detail-card detail-card--awards">
                <div className="detail-card__heading">
                  <Award aria-hidden="true" />
                  <div>
                    <p className="eyebrow">Recognition</p>
                    <h3>Awards</h3>
                  </div>
                </div>
                <p>
                  Outstanding contributions will be recognized through awards generously
                  sponsored by{' '}
                  <a href={sponsor.url} target="_blank" rel="noreferrer">
                    {sponsor.name}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  .
                </p>
                <ul>
                  {awards.map((award) => (
                    <li data-testid="award-item" key={award.name}>
                      <span>
                        <strong>{award.name}</strong>
                        <small>{award.count}</small>
                      </span>
                      <b>{award.prize}</b>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="detail-card detail-card--dates">
                <div className="detail-card__heading">
                  <CalendarDays aria-hidden="true" />
                  <div>
                    <p className="eyebrow">Mark your calendar</p>
                    <h3>Important Dates</h3>
                  </div>
                </div>
                <dl>
                  {importantDates.map((date) => (
                    <div key={date.label}>
                      <dt>{date.label}</dt>
                      <dd>{date.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--organizers" id="organizers" aria-labelledby="organizers-title">
          <div className="page-width">
            <div className="section-heading">
              <p className="section-index">05 / Team</p>
              <div>
                <h2 id="organizers-title">Workshop Organizers</h2>
                <p className="section-description">
                  A cross-institutional team working across robot learning, manipulation,
                  embodied intelligence, and real-world deployment.
                </p>
              </div>
            </div>

            <div className="organizer-grid">
              {organizers.map((organizer) => (
                <PersonCard key={organizer.name} person={organizer} kind="organizer" />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__glow" aria-hidden="true" />
        <div className="page-width site-footer__content">
          <div className="footer-kicker">
            <Sparkles size={17} aria-hidden="true" />
            IROS 2026 · Pittsburgh
          </div>
          <h2>
            Join the conversation on
            <span> bimanual intelligence.</span>
          </h2>
          <div className="site-footer__actions">
            <a
              className="button button--primary"
              href={workshopMeta.openReviewUrl}
              target="_blank"
              rel="noreferrer"
            >
              Submit via OpenReview
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              className="button button--ghost"
              href={workshopMeta.repositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={18} aria-hidden="true" />
              GitHub repository
            </a>
          </div>
          <div className="site-footer__bottom">
            <p>
              {workshopMeta.date} · {workshopMeta.time}
            </p>
            <p>{workshopMeta.location}</p>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
