import type { ChallengeDescriptionSegment } from '../data/workshop'

interface ChallengeStageDescriptionProps {
  segments: ChallengeDescriptionSegment[]
}

function ChallengeStageDescription({
  segments,
}: ChallengeStageDescriptionProps) {
  return (
    <p className="challenge-stage-description">
      {segments.map((segment, index) =>
        segment.url ? (
          <a
            href={segment.url}
            key={`${segment.text}-${index}`}
            rel="noreferrer"
            target="_blank"
          >
            {segment.text}
          </a>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </p>
  )
}

export default ChallengeStageDescription
