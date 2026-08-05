import { ArrowLeft } from 'lucide-react'

const ChallengeComingSoon = () => (
  <main className="challenge-coming-soon">
    <div className="challenge-coming-soon__grid" aria-hidden="true" />
    <section
      className="challenge-coming-soon__content"
      aria-labelledby="challenge-title"
    >
      <p className="challenge-coming-soon__eyebrow">PRIMEBOT × IROS 2026</p>
      <h1 id="challenge-title">Towards Bimanual Intelligence</h1>
      <p className="challenge-coming-soon__subtitle">
        A Real-World Household Manipulation Challenge
      </p>
      <p className="challenge-coming-soon__status">
        Full challenge details are coming soon.
      </p>
      <a className="challenge-coming-soon__back" href="/">
        <ArrowLeft aria-hidden="true" size={18} />
        Back to Workshop
      </a>
    </section>
  </main>
)

export default ChallengeComingSoon
