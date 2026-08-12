import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react'
import ChallengeVideoGallery from '../components/ChallengeVideoGallery'
import { challenge, challengeOrganizers, sponsor } from '../data/workshop'
import { challengeHub } from '../data/challengeHub'

const externalLinkProps = {
  rel: 'noreferrer',
  target: '_blank',
} as const

function ChallengeHub() {
  return (
    <div className="challenge-hub">
      <header className="challenge-hub__header">
        <div className="challenge-hub__header-inner">
          <a className="challenge-hub__brand" href="#top">
            BRL / CHALLENGE 2026
          </a>
          <nav aria-label="Challenge navigation" className="challenge-hub__nav">
            {challengeHub.navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a
            aria-label="Open dataset on Hugging Face"
            className="challenge-hub__header-cta"
            href={challengeHub.dataset.url}
            {...externalLinkProps}
          >
            View Dataset <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </header>

      <main>
        <section
          aria-labelledby="challenge-hub-title"
          className="challenge-hub__hero"
          id="top"
        >
          <div className="challenge-hub__hero-content">
            <div className="challenge-hub__hero-identity">
              <p className="challenge-hub__hero-parent">
                Bimanual Robot Learning Workshop
              </p>
              <p className="challenge-hub__hero-track">
                Challenge Track · PrimeBot
              </p>
            </div>
            <h1
              aria-label={`${challengeHub.hero.titleLines.join(' ')} ${challengeHub.hero.accent}`}
              id="challenge-hub-title"
            >
              {challengeHub.hero.titleLines.map((line, index) => (
                <span className="challenge-hub__hero-title-line" key={line}>
                  {line}
                  {index === challengeHub.hero.titleLines.length - 1 && (
                    <>
                      {' '}
                      <span className="challenge-hub__hero-title-accent">
                        {challengeHub.hero.accent}
                      </span>
                    </>
                  )}
                </span>
              ))}
            </h1>
            <p className="challenge-hub__sponsor">
              {challengeHub.hero.sponsorPrefix}{' '}
              <a href={sponsor.url} {...externalLinkProps}>
                {sponsor.name}
              </a>
            </p>
            <p className="challenge-hub__tagline">{challengeHub.hero.tagline}</p>
            <div className="challenge-hub__hero-actions">
              <a
                className="challenge-hub__action challenge-hub__action--primary"
                href={challengeHub.dataset.url}
                {...externalLinkProps}
              >
                View Dataset <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <a className="challenge-hub__action" href="#tasks">
                Watch Task Demos <ArrowDown aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          aria-label="Challenge facts"
          className="challenge-hub__fact-rail"
        >
          {challengeHub.factRail.map((fact) => (
            <p data-testid="challenge-hub-fact" key={fact}>
              {fact}
            </p>
          ))}
        </section>

        <section
          aria-labelledby="challenge-hub-overview-title"
          className="challenge-hub__section challenge-hub__overview"
          id="overview"
        >
          <div className="challenge-hub__overview-grid">
            <header>
              <p className="challenge-hub__eyebrow">
                {challengeHub.overview.eyebrow}
              </p>
              <h2 id="challenge-hub-overview-title">
                {challengeHub.overview.title}
              </h2>
              <p>{challengeHub.overview.description}</p>
            </header>

            <aside
              aria-labelledby="challenge-hub-dataset-title"
              className="challenge-hub__dataset-panel"
            >
              <p className="challenge-hub__eyebrow">
                {challengeHub.dataset.eyebrow}
              </p>
              <h2 id="challenge-hub-dataset-title">
                {challengeHub.dataset.title}
              </h2>
              <ul>
                {challengeHub.dataset.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={challengeHub.dataset.url} {...externalLinkProps}>
                {challengeHub.dataset.action}
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <p>{challengeHub.dataset.note}</p>
            </aside>
          </div>
        </section>

        <section
          aria-labelledby="challenge-hub-tasks-title"
          className="challenge-hub__section challenge-hub__tasks"
          id="tasks"
        >
          <h2 className="sr-only" id="challenge-hub-tasks-title">
            Task demonstrations
          </h2>
          <ChallengeVideoGallery
            eyebrow="Task demonstrations"
            title="See the challenge in action"
            description="Real-world teleoperation and UMI demonstrations from household manipulation tasks."
          />
        </section>

        <section
          aria-labelledby="challenge-hub-participation-title"
          className="challenge-hub__section challenge-hub__participation"
        >
          <header>
            <p className="challenge-hub__eyebrow">How to participate</p>
            <h2 id="challenge-hub-participation-title">Your path to entry.</h2>
          </header>
          <ol className="challenge-hub__participation-grid">
            {challengeHub.participationSteps.map((step) => (
              <li data-testid="challenge-participation-step" key={step.number}>
                <article>
                  <span aria-hidden="true">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-label="Evaluation format and challenge timeline"
          className="challenge-hub__section challenge-hub__logistics"
          id="evaluation"
        >
          <section aria-labelledby="challenge-hub-evaluation-title">
            <p className="challenge-hub__eyebrow">How it works</p>
            <h2 id="challenge-hub-evaluation-title">Evaluation Format</h2>
            <ol className="challenge-hub__stages">
              {challenge.stages.map((stage) => (
                <li data-testid="challenge-hub-stage" key={stage.step}>
                  <span aria-hidden="true">{stage.step}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </li>
              ))}
              <li data-testid="challenge-hub-stage">
                <span aria-hidden="true">03</span>
                <h3>{challenge.finalRanking.label}</h3>
                <p>{challenge.finalRanking.formula}</p>
              </li>
            </ol>
            <p className="challenge-hub__task-scope">{challengeHub.taskScope}</p>
          </section>

          <section aria-labelledby="challenge-hub-timeline-title">
            <p className="challenge-hub__eyebrow">Important dates</p>
            <h2 id="challenge-hub-timeline-title">Challenge Timeline</h2>
            <ol className="challenge-hub__timeline">
              {challenge.timeline
                .filter((milestone) => milestone.label !== 'Sample Data Release')
                .map((milestone) => (
                <li
                  data-testid="challenge-hub-milestone"
                  key={milestone.label}
                >
                  <h3>{milestone.label}</h3>
                  <p>
                    {milestone.date}
                    {milestone.time && <span>{` · ${milestone.time}`}</span>}
                  </p>
                </li>
                ))}
            </ol>
          </section>
        </section>

        <section
          aria-labelledby="challenge-hub-prizes-title"
          className="challenge-hub__prizes"
          id="prizes"
        >
          <header>
            <p className="challenge-hub__eyebrow">Challenge Prize Pool</p>
            <h2 id="challenge-hub-prizes-title">
              {challenge.prizePoolTotal}
            </h2>
            <p className="challenge-hub__prize-sponsor">
              Sponsored by{' '}
              <a href={sponsor.url} {...externalLinkProps}>
                {sponsor.name}
              </a>
            </p>
          </header>
          <div className="challenge-hub__prize-grid">
            {challenge.prizes.map((prize) => (
              <article
                data-accent={prize.accent}
                data-testid="challenge-hub-prize"
                key={prize.place}
              >
                <h3>{prize.place}</h3>
                <p>{prize.amount}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="challenge-hub-leaderboard-title"
          className="challenge-hub__leaderboard-card"
          id="updates"
        >
          <header>
            <p className="challenge-hub__eyebrow">
              {challengeHub.leaderboard.eyebrow}
            </p>
            <p>{challengeHub.leaderboard.status}</p>
            <h2 id="challenge-hub-leaderboard-title">
              {challengeHub.leaderboard.title}
            </h2>
            <p>{challengeHub.leaderboard.description}</p>
            <p>Opening date: {challengeHub.leaderboard.openingDate}</p>
          </header>
          <ol>
            {challengeHub.leaderboard.stages.map((stage) => (
              <li data-testid="challenge-hub-leaderboard-stage" key={stage}>
                <article>
                  <h3>{stage}</h3>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="challenge-hub-organizers-title"
          className="challenge-hub__section challenge-hub__organizers"
        >
          <header>
            <p className="challenge-hub__eyebrow">The people behind it</p>
            <h2 id="challenge-hub-organizers-title">Challenge Organizers</h2>
          </header>
          <div className="challenge-hub__organizer-grid">
            {challengeOrganizers.map((organizer) => (
              <article
                data-testid="challenge-hub-organizer"
                key={organizer.name}
              >
                <img alt={organizer.imageAlt} src={organizer.image} />
                <div>
                  <h3>{organizer.name}</h3>
                  {organizer.institution && <p>{organizer.institution}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="challenge-hub__footer">
        <a href="/">
          <ArrowLeft aria-hidden="true" size={18} />
          Back to Workshop
        </a>
        <a href={challengeHub.dataset.url} {...externalLinkProps}>
          Dataset on Hugging Face <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </footer>
    </div>
  )
}

export default ChallengeHub
