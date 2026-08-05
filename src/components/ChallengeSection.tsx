import { ArrowUpRight } from 'lucide-react'
import { challenge, sponsor } from '../data/workshop'

function ChallengeSection() {
  return (
    <section
      className="section section--challenge"
      id="challenge"
      aria-labelledby="challenge-title"
      data-testid="challenge-section"
    >
      <div className="page-width challenge-content">
        <header className="challenge-heading">
          <p className="section-index">05 / Challenge Track</p>
          <h2 id="challenge-title">
            <span className="challenge-title__lead">{challenge.titleLead}</span>{' '}
            <span className="challenge-title__highlight">
              {challenge.titleHighlight}
            </span>
          </h2>
          <p className="challenge-sponsor">
            {challenge.sponsorLine}{' '}
            <a href={sponsor.url} target="_blank" rel="noreferrer">
              {sponsor.name}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </p>
        </header>

        <p className="challenge-introduction">{challenge.introduction}</p>

        <dl className="challenge-facts" aria-label="Challenge at a glance">
          {challenge.facts.map((fact) => (
            <div data-testid="challenge-fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section className="challenge-evaluation" aria-labelledby="evaluation-title">
          <p className="eyebrow">How it works</p>
          <h3 id="evaluation-title">Evaluation Format</h3>
          <ol className="challenge-flow">
            {challenge.stages.map((stage) => (
              <li data-testid="challenge-stage" key={stage.step}>
                <span aria-hidden="true">{stage.step}</span>
                <h4>{stage.title}</h4>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
          <div
            className="challenge-final-ranking"
            data-testid="challenge-final-ranking"
          >
            <p className="eyebrow">{challenge.finalRanking.label}</p>
            <strong>{challenge.finalRanking.formula}</strong>
            <p>{challenge.finalRanking.note}</p>
          </div>
        </section>

        <section className="challenge-tasks" aria-labelledby="challenge-tasks-title">
          <p className="eyebrow">Real-Robot Evaluation Scope</p>
          <h3 id="challenge-tasks-title">Household Manipulation Tasks</h3>
          <div className="challenge-task-grid">
            {challenge.tasks.map((task, index) => (
              <article data-testid="challenge-task" key={task.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="challenge-prize-pool"
          aria-labelledby="challenge-prize-title"
          data-testid="challenge-prize-pool"
        >
          <header>
            <h3 className="eyebrow" id="challenge-prize-title">
              Challenge Prize Pool
            </h3>
            <p className="challenge-prize-total">
              {challenge.prizePoolTotal} Total
            </p>
          </header>
          <div className="challenge-prize-grid">
            {challenge.prizes.map((prize) => (
              <article
                data-accent={prize.accent}
                data-testid="challenge-prize"
                key={prize.place}
              >
                <h4>{prize.place}</h4>
                <strong>{prize.amount}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="challenge-timeline" aria-labelledby="challenge-timeline-title">
          <p className="eyebrow">Important dates</p>
          <h3 id="challenge-timeline-title">Challenge timeline</h3>
          <ol>
            {challenge.timeline.map((milestone, index) => (
              <li data-testid="challenge-milestone" key={milestone.label}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h4>{milestone.label}</h4>
                <p>
                  {milestone.date}
                  {milestone.time && <b>{` · ${milestone.time}`}</b>}
                </p>
              </li>
            ))}
          </ol>
          <div className="challenge-resources" aria-label="Challenge resources">
            {challenge.resources.map((resource) =>
              resource.status === 'available' ? (
                <a
                  data-testid="challenge-resource"
                  href={resource.url}
                  key={resource.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>{resource.label}</span>
                  <b>
                    Open
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </b>
                </a>
              ) : (
                <div data-testid="challenge-resource" key={resource.label}>
                  <span>{resource.label}</span>
                  <b>Coming Soon</b>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </section>
  )
}

export default ChallengeSection
