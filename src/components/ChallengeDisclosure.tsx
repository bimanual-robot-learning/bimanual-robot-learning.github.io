import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

type ChallengeDisclosureProps = {
  children: ReactNode
  className: 'challenge-evaluation' | 'challenge-timeline'
  eyebrow: string
  title: string
  titleId: string
}

function ChallengeDisclosure({
  children,
  className,
  eyebrow,
  title,
  titleId,
}: ChallengeDisclosureProps) {
  return (
    <details
      className={`challenge-disclosure ${className}`}
      data-testid="challenge-disclosure"
    >
      <summary>
        <span className="challenge-disclosure__copy">
          <span className="eyebrow">{eyebrow}</span>
          <span
            className="challenge-disclosure__title"
            id={titleId}
            role="heading"
            aria-level={3}
          >
            {title}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="challenge-disclosure__icon"
          size={24}
        />
      </summary>
      <div
        className="challenge-disclosure__body"
        role="region"
        aria-labelledby={titleId}
      >
        {children}
      </div>
    </details>
  )
}

export default ChallengeDisclosure
