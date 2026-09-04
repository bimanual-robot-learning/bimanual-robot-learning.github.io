import { ArrowUpRight } from 'lucide-react'
import ChallengeLeaderboard from '../challenge/ChallengeLeaderboard'
import { challengeHub } from '../data/challengeHub'
import { challenge, sponsor } from '../data/workshop'
import ChallengeDisclosure from './ChallengeDisclosure'
import ChallengeStageDescription from './ChallengeStageDescription'
import ChallengeVideoGallery from './ChallengeVideoGallery'

function ChallengeSection() {
  const verifiedTeamCount: number = challengeHub.leaderboard.entries.length

  return (
    <section
      className="section section--challenge"
      id="challenge"
      aria-labelledby="challenge-title"
      data-testid="challenge-section"
    >
      <div className="page-width challenge-content">
        <header className="challenge-heading">
          <p className="section-index">05 / Workshop Challenge</p>
          <h2 id="challenge-title">
            <span className="challenge-title__line-one">
              {challenge.title.lineOne}
            </span>{' '}
            <span className="challenge-title__line-two">
              {challenge.title.lineTwo}{' '}
              <span className="challenge-title__accent">
                {challenge.title.accent}
              </span>
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

        <p
          className="challenge-introduction"
          data-testid="challenge-introduction"
        >
          {challenge.introductionSegments.map((segment, index) =>
            segment.emphasis ? (
              <strong key={`${segment.text}-${index}`}>{segment.text}</strong>
            ) : (
              <span key={`${segment.text}-${index}`}>{segment.text}</span>
            ),
          )}
        </p>

        <section
          className="challenge-participation"
          aria-labelledby="challenge-participation-title"
        >
          <header className="challenge-participation__header">
            <p className="eyebrow">{challenge.participation.eyebrow}</p>
            <h3 id="challenge-participation-title">
              {challenge.participation.title}
            </h3>
            <p>{challenge.participation.description}</p>
          </header>
          <div className="challenge-resources" aria-label="Challenge resources">
            {challenge.resources.map((resource) => {
              const className =
                resource.status === 'available'
                  ? 'challenge-resource--primary'
                  : undefined

              return resource.status === 'available' ? (
                <a
                  className={className}
                  data-testid="challenge-resource"
                  href={resource.url}
                  key={resource.label}
                  {...(resource.external
                    ? { rel: 'noreferrer', target: '_blank' }
                    : {})}
                >
                  <span>{resource.label}</span>
                  <b>Open</b>
                </a>
              ) : (
                <div
                  className={className}
                  data-testid="challenge-resource"
                  key={resource.label}
                >
                  <span>{resource.label}</span>
                  <b>Coming Soon</b>
                </div>
              )
            })}
          </div>
        </section>

        <ChallengeVideoGallery
          eyebrow="Real-world data"
          title="Training Data Examples"
          description="A glimpse of the real-robot teleoperation and UMI demonstrations available to challenge participants."
        />

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

        <section
          aria-labelledby="challenge-home-leaderboard-title"
          className="challenge-home-leaderboard"
          data-testid="challenge-home-leaderboard"
        >
          <header className="challenge-home-leaderboard__header">
            <div>
              <p className="challenge-home-leaderboard__meta">
                <span>{challengeHub.leaderboard.status}</span>
                <span className="challenge-home-leaderboard__updated">
                  {challengeHub.leaderboard.updatedAt}
                </span>
              </p>
              <h3 id="challenge-home-leaderboard-title">
                Challenge Leaderboard
              </h3>
            </div>
            <p className="challenge-leaderboard__summary">
              {verifiedTeamCount} verified{' '}
              {verifiedTeamCount === 1 ? 'team' : 'teams'}
            </p>
          </header>
          <ChallengeLeaderboard entries={challengeHub.leaderboard.entries} previewRows={10} />
          <div className="challenge-home-leaderboard__footer">
            <a
              className="text-link challenge-home-leaderboard__full-link"
              href="/challenge/#leaderboard"
            >
              View full leaderboard <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <div className="challenge-logistics" data-testid="challenge-logistics">
          <ChallengeDisclosure
            className="challenge-evaluation"
            eyebrow="How it works"
            title="Evaluation Format"
            titleId="evaluation-title"
          >
            <ol className="challenge-flow">
              {challenge.stages.map((stage, index) => (
                <li data-testid="challenge-stage" key={stage.step}>
                  <span aria-hidden="true">{stage.step}</span>
                  <h4>{stage.title}</h4>
                  <ChallengeStageDescription
                    segments={stage.descriptionSegments}
                  />
                  {index === 1 && (
                    <div className="challenge-evaluation-scope">
                      <h5 id="real-robot-evaluation-scope">
                        Real-Robot Evaluation Scope
                      </h5>
                      <ul aria-labelledby="real-robot-evaluation-scope">
                        {challenge.tasks.map((task) => (
                          <li data-testid="challenge-task" key={task.title}>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
              <li
                className="challenge-flow__ranking"
                data-testid="challenge-stage"
              >
                <span aria-hidden="true">03</span>
                <h4>{challenge.finalRanking.label}</h4>
                <p
                  className="challenge-ranking-formula"
                  data-testid="challenge-final-ranking"
                >
                  {challenge.finalRanking.formula}
                </p>
              </li>
            </ol>
          </ChallengeDisclosure>

          <ChallengeDisclosure
            className="challenge-timeline"
            eyebrow="Important dates"
            title="Challenge Timeline"
            titleId="challenge-timeline-title"
          >
            <ol>
              {challenge.timeline.map((milestone, index) => (
                <li data-testid="challenge-milestone" key={milestone.label}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4>{milestone.label}</h4>
                  <p>
                    {milestone.date}
                    {milestone.time && <b>{` · ${milestone.time}`}</b>}
                  </p>
                </li>
              ))}
            </ol>
          </ChallengeDisclosure>
        </div>

      </div>
    </section>
  )
}

export default ChallengeSection
