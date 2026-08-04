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
      <div className="challenge-grid" aria-hidden="true" />
      <div className="page-width challenge-content">
        <div className="section-heading">
          <p className="section-index">05 / Challenge Track</p>
          <div>
            <p className="eyebrow">{challenge.eyebrow}</p>
            <h2 id="challenge-title">{challenge.title}</h2>
            <p className="section-description">{challenge.introduction}</p>
            <p className="challenge-sponsor">
              {challenge.sponsorLine}{' '}
              <a href={sponsor.url} target="_blank" rel="noreferrer">
                {sponsor.name}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </p>
          </div>
        </div>

        <dl className="challenge-facts" aria-label="Challenge at a glance">
          {challenge.facts.map((fact) => (
            <div data-testid="challenge-fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section className="challenge-block" aria-labelledby="evaluation-title">
          <p className="eyebrow">Evaluation pipeline</p>
          <h3 id="evaluation-title">From released data to real-world deployment</h3>
          <ol className="challenge-flow">
            {challenge.stages.map((stage) => (
              <li data-testid="challenge-stage" key={stage.step}>
                <span aria-hidden="true">{stage.step}</span>
                <h4>{stage.title}</h4>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
          <p className="challenge-scoring-note">{challenge.scoringNote}</p>
        </section>

        <section className="challenge-block" aria-labelledby="challenge-tasks-title">
          <p className="eyebrow">Real-world evaluation scope</p>
          <h3 id="challenge-tasks-title">Household manipulation tasks</h3>
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
          <div className="challenge-prize-pool__grid" aria-hidden="true" />
          <header>
            <p className="eyebrow">Challenge Prize Pool</p>
            <h3 id="challenge-prize-title">{challenge.prizePoolTotal}</h3>
            <p>{challenge.prizePoolNote}</p>
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
                <p>{prize.recipient}</p>
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
            {challenge.resources.map((resource) => (
              <div data-testid="challenge-resource" key={resource.label}>
                <span>{resource.label}</span>
                <b>Coming Soon</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default ChallengeSection
