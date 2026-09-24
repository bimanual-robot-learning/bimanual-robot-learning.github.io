export interface AcceptedPaper {
  title: string
  url: `https://openreview.net/forum?id=${string}`
  spotlight: boolean
}

// OpenReview's public Accept tab, checked September 24, 2026.
// Preserve the venue's displayed order; presentation type does not affect ranking.
export const acceptedPapers: AcceptedPaper[] = [
  {
    title: 'Scaling Bimanual Household Manipulation from 1,500 hours of Demonstrations to On-Policy Corrections',
    url: 'https://openreview.net/forum?id=A3yIWMIOz0',
    spotlight: false,
  },
  {
    title: 'Scaling Latent Motor Adaptation to Coordinated Bimanual Manipulation',
    url: 'https://openreview.net/forum?id=Z3bwZmJGsD',
    spotlight: false,
  },
  {
    title: 'Egocentric Cross-Embodiment Manipulation with Embodiment Dreaming',
    url: 'https://openreview.net/forum?id=s0f8EIquZ6',
    spotlight: false,
  },
  {
    title: 'ManiLadder: Benchmarking Robot Manipulation Through a Categorized and Multi-Level Task Ladder',
    url: 'https://openreview.net/forum?id=LgUpMaBqCb',
    spotlight: true,
  },
  {
    title: 'When Bimanual Structure Is an Illusion: Amplitude Compression in Single-Arm Tasks',
    url: 'https://openreview.net/forum?id=2R7exsGwuJ',
    spotlight: false,
  },
  {
    title: 'HUGS: Guiding Unified Dexterous Grasp Synthesis Across Modes and Scales via Learned Human Priors',
    url: 'https://openreview.net/forum?id=QA8JLM8J23',
    spotlight: true,
  },
  {
    title: 'Scaling Does Not Fix Sequencing: A Minimal Structural Prior for Long-Horizon Bimanual Manipulation',
    url: 'https://openreview.net/forum?id=PLW3WibeKn',
    spotlight: false,
  },
  {
    title: 'Scaling and Structure Are Not Free: Bimanual Manipulation Within an 8 GB Budget',
    url: 'https://openreview.net/forum?id=jBUSe1yPCs',
    spotlight: false,
  },
  {
    title: 'HoMMI: Learning Whole-Body Mobile Manipulation from Human Demonstrations',
    url: 'https://openreview.net/forum?id=PblWIL4P5g',
    spotlight: true,
  },
  {
    title: 'SLAC: Safe and Efficient Real-Robot Reinforcement Learning via Unsupervised Simulation Pre-Training',
    url: 'https://openreview.net/forum?id=jPSc6JWQr4',
    spotlight: false,
  },
  {
    title: 'CRAFT: Video Diffusion for Bimanual Robot Data Generation',
    url: 'https://openreview.net/forum?id=v6QPJyUZWh',
    spotlight: true,
  },
]
