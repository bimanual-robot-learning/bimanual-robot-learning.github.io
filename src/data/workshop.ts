export type ScheduleStatus = 'confirmed' | 'tentative' | 'pending'
export type ScheduleKind = 'talk' | 'session' | 'break'

export interface WorkshopMeta {
  eyebrow: string
  title: string
  subtitle: string
  date: string
  time: string
  location: string
  conferenceUrl: string
  openReviewUrl: string
  repositoryUrl: string
}

export interface ScheduleEntry {
  time: string
  speakerOrSession: string
  talkTitle: string
  status: ScheduleStatus
  kind: ScheduleKind
}

export interface Person {
  name: string
  institution?: string
  image: string
  imageAlt: string
}

export interface ChallengeFact {
  value: string
  label: string
}

export interface ChallengeStage {
  step: string
  title: string
  description: string
}

export interface ChallengeTask {
  title: string
  description: string
}

export interface ChallengePrize {
  place: string
  amount: string
  accent: 'primary' | 'secondary'
}

export interface ChallengeFinalRanking {
  label: 'Final Ranking'
  formula: string
  note: string
}

export interface ChallengeMilestone {
  label: string
  date: string
  time?: string
}

export type ChallengeResource =
  | {
      label: string
      status: 'coming-soon'
      url?: never
    }
  | {
      label: string
      status: 'available'
      url: string
    }

export interface ChallengeInfo {
  title: string
  sponsorLine: string
  introduction: string
  finalRanking: ChallengeFinalRanking
  facts: ChallengeFact[]
  stages: ChallengeStage[]
  tasks: ChallengeTask[]
  prizePoolTotal: string
  prizes: ChallengePrize[]
  timeline: ChallengeMilestone[]
  resources: ChallengeResource[]
}

export interface TopicGroup {
  label: string
  title: string
  items: string[]
}

export interface IntroductionPoint {
  label: string
  title: string
  description: string
  tone: 'context' | 'scale' | 'structure'
}

export interface AwardItem {
  name: string
  recipientCount: number
  prize: string
  prizeClarification: string
}

export type SubmissionGuidelineLabel =
  | 'Review'
  | 'Format'
  | 'Length'
  | 'Appendices'

export interface SubmissionGuideline {
  label: SubmissionGuidelineLabel
  prefix: string
  link?: {
    label: string
    href: string
  }
  suffix: string
}

export interface SubmissionInfo {
  eyebrow: string
  title: string
  introduction: string
  guidelines: SubmissionGuideline[]
  presentation: string
}

export const workshopMeta: WorkshopMeta = {
  eyebrow: 'Workshop @ IROS 2026',
  title: 'Scaling vs. Structure?',
  subtitle: 'Rethinking Bimanual Manipulation Beyond Single-Arm Policies',
  date: 'September 27, 2026',
  time: '8:00 AM–12:30 PM EDT',
  location: 'Pittsburgh, PA, USA',
  conferenceUrl: 'https://2026.ieee-iros.org/',
  openReviewUrl:
    'https://openreview.net/group?id=IEEE.org%2FIROS%2F2026%2FWorkshop%2FBimanual_Manipulation',
  repositoryUrl: 'https://github.com/bimanual-robot-learning/bimanual-robot-learning.github.io',
}

export const challenge: ChallengeInfo = {
  title:
    'Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge',
  sponsorLine: 'Designed and sponsored by',
  introduction:
    'This challenge focuses on real-world bimanual manipulation in household environments. Participants will train on thousands of hours of real-robot teleoperation and UMI data spanning diverse household tasks, with the freedom to design their own data mixtures and training strategies.',
  finalRanking: {
    label: 'Final Ranking',
    formula: 'Online evaluation score + final real-robot evaluation score',
    note:
      'Detailed scoring protocols will be announced before online evaluation opens.',
  },
  facts: [
    {
      value: 'Thousands of hours',
      label: 'Real-world demonstrations',
    },
    {
      value: 'Teleoperation + UMI',
      label: 'Complementary data sources',
    },
    {
      value: '4 household tasks',
      label: 'Real-robot evaluation',
    },
  ],
  stages: [
    {
      step: '01',
      title: 'Online Evaluation',
      description: 'Submit trained models through the online evaluation portal.',
    },
    {
      step: '02',
      title: 'Real-Robot Evaluation',
      description:
        'Up to five top-performing entries advance to household task evaluation.',
    },
  ],
  tasks: [
    {
      title: 'Open the Washer Door',
      description:
        'Use the gripper to fully open the washing machine door.',
    },
    {
      title: 'Put Clothing in the Washer',
      description:
        'Put two pieces of clothing into the washing machine.',
    },
    {
      title: 'Close the Washer Door',
      description:
        'Use the gripper to close the washing machine door securely.',
    },
    {
      title: 'Fold Clothing',
      description:
        'Unfold an item of clothing and fold it neatly.',
    },
  ],
  prizePoolTotal: 'USD 2,000',
  prizes: [
    {
      place: '1st Place',
      amount: 'USD 1,000',
      accent: 'primary',
    },
    {
      place: '2nd Place',
      amount: 'USD 500',
      accent: 'secondary',
    },
    {
      place: '3rd Place',
      amount: 'USD 500',
      accent: 'secondary',
    },
  ],
  timeline: [
    {
      label: 'Sample Data Release',
      date: 'August 7, 2026',
      time: '11:59 PM AOE',
    },
    {
      label: 'Full Dataset Release',
      date: 'August 11, 2026',
      time: '11:59 PM AOE',
    },
    {
      label: 'Online Evaluation Opens',
      date: 'August 25, 2026',
      time: '11:59 PM AOE',
    },
    {
      label: 'First Real-World Evaluation',
      date: 'September 11, 2026',
    },
    {
      label: 'Final Real-World Evaluation',
      date: 'September 21, 2026',
    },
  ],
  resources: [
    { label: 'Dataset', status: 'coming-soon' },
    { label: 'Evaluation Portal', status: 'coming-soon' },
  ],
}

export const challengeOrganizers: Person[] = [
  {
    name: 'Kai Li',
    image: '/images/challenge-organizers/kai-li.jpg',
    imageAlt: 'Portrait of challenge organizer Kai Li',
  },
  {
    name: 'Ran Cheng',
    image: '/images/challenge-organizers/ran-cheng.jpg',
    imageAlt: 'Portrait of challenge organizer Ran Cheng',
  },
  {
    name: 'Yan Shen',
    image: '/images/organizers/yan-shen.jpg',
    imageAlt: 'Portrait of challenge organizer Yan Shen',
  },
  {
    name: 'Hao Dong',
    image: '/images/organizers/hao-dong.jpg',
    imageAlt: 'Portrait of challenge organizer Hao Dong',
  },
]

export const introduction: {
  points: IntroductionPoint[]
  conclusion: string
} = {
  points: [
    {
      label: '01 / Context',
      title: 'Context',
      description:
        'Recent advances in data-driven robot learning have accelerated progress in single-arm manipulation through large-scale teleoperation datasets, foundation policies, and vision–language–action models. As these systems begin to exhibit scaling behavior, a natural question emerges: can the same paradigm simply extend to bimanual manipulation, or does dual-arm intelligence demand fundamentally new structural inductive biases?',
      tone: 'context',
    },
    {
      label: '02 / Scaling',
      title: 'Scaling view',
      description:
        'One view holds that bimanual capability can emerge by scaling data and model capacity, supported by diverse demonstrations from teleoperation, simulation, and human video, together with foundation policies.',
      tone: 'scale',
    },
    {
      label: '03 / Structure',
      title: 'Structure view',
      description:
        'Another argues that bimanual manipulation introduces qualitatively new challenges—including inter-arm coupling, role assignment, temporal coordination, and shared physical constraints—that may require new architectures, coordination mechanisms, or hierarchical representations.',
      tone: 'structure',
    },
  ],
  conclusion:
    'This workshop brings together researchers to examine the scaling–structure question and advance our understanding of bimanual robotic intelligence.',
}

export const schedule: ScheduleEntry[] = [
  {
    time: '08:40–08:50',
    speakerOrSession: 'Opening Remarks',
    talkTitle: '—',
    status: 'confirmed',
    kind: 'session',
  },
  {
    time: '08:50–09:15',
    speakerOrSession: 'Prof. Tamim Asfour',
    talkTitle: 'Learning Constraints for Humanoid Bimanual Manipulation',
    status: 'tentative',
    kind: 'talk',
  },
  {
    time: '09:15–09:40',
    speakerOrSession: 'Prof. Yao Mu',
    talkTitle: 'Pending',
    status: 'pending',
    kind: 'talk',
  },
  {
    time: '09:40–10:05',
    speakerOrSession: 'Dr. Joonho Lee',
    talkTitle: 'Bimanual Manipulation for Manufacturing Automation',
    status: 'tentative',
    kind: 'talk',
  },
  {
    time: '10:05–10:30',
    speakerOrSession: 'Spotlight Talks (4 Selected Posters)',
    talkTitle: '—',
    status: 'confirmed',
    kind: 'session',
  },
  {
    time: '10:30–11:00',
    speakerOrSession: 'Poster Session & Coffee Break',
    talkTitle: '—',
    status: 'confirmed',
    kind: 'break',
  },
  {
    time: '11:00–11:25',
    speakerOrSession: 'Dr. Kaifeng Zhang',
    talkTitle: 'Pending',
    status: 'pending',
    kind: 'talk',
  },
  {
    time: '11:25–11:50',
    speakerOrSession: 'Dr. Jose Barreiros',
    talkTitle: 'Pending',
    status: 'pending',
    kind: 'talk',
  },
  {
    time: '11:50–12:20',
    speakerOrSession: 'Panel Discussion & Q&A',
    talkTitle: '—',
    status: 'confirmed',
    kind: 'session',
  },
  {
    time: '12:20–12:30',
    speakerOrSession: 'Award Session & Closing Remarks',
    talkTitle: '—',
    status: 'confirmed',
    kind: 'session',
  },
]

export const speakers: Person[] = [
  {
    name: 'Tamim Asfour',
    institution: 'Karlsruhe Institute of Technology',
    image: '/images/speakers/tamim-asfour.jpg',
    imageAlt: 'Portrait of invited speaker Tamim Asfour',
  },
  {
    name: 'Joonho Lee',
    institution: 'Neuromeka',
    image: '/images/speakers/joonho-lee.jpg',
    imageAlt: 'Portrait of invited speaker Joonho Lee',
  },
  {
    name: 'Yao Mu',
    institution: 'Shanghai Jiao Tong University',
    image: '/images/speakers/yao-mu.jpg',
    imageAlt: 'Portrait of invited speaker Yao Mu',
  },
  {
    name: 'Kaifeng Zhang',
    institution: 'Sharpa',
    image: '/images/speakers/kaifeng-zhang.jpg',
    imageAlt: 'Portrait of invited speaker Kaifeng Zhang',
  },
  {
    name: 'Jose Barreiros',
    institution: 'Amazon',
    image: '/images/speakers/jose-barreiros.jpg',
    imageAlt: 'Portrait of invited speaker Jose Barreiros',
  },
]

export const organizers: Person[] = [
  {
    name: 'Yan Shen',
    institution: 'Peking University',
    image: '/images/organizers/yan-shen.jpg',
    imageAlt: 'Portrait of workshop organizer Yan Shen',
  },
  {
    name: 'Ruihai Wu',
    institution: 'UC Berkeley',
    image: '/images/organizers/ruihai-wu.jpg',
    imageAlt: 'Portrait of workshop organizer Ruihai Wu',
  },
  {
    name: 'Taewhan Kim',
    institution: 'Neuromeka',
    image: '/images/organizers/taewhan-kim.jpg',
    imageAlt: 'Portrait of workshop organizer Taewhan Kim',
  },
  {
    name: 'Chenrui Tie',
    institution: 'National University of Singapore',
    image: '/images/organizers/chenrui-tie.jpg',
    imageAlt: 'Portrait of workshop organizer Chenrui Tie',
  },
  {
    name: 'Yulong Li',
    institution: 'Massachusetts Institute of Technology',
    image: '/images/organizers/yulong-li.jpg',
    imageAlt: 'Portrait of workshop organizer Yulong Li',
  },
  {
    name: 'Kaichun Mo',
    institution: 'NVIDIA',
    image: '/images/organizers/kaichun-mo.jpg',
    imageAlt: 'Portrait of workshop organizer Kaichun Mo',
  },
  {
    name: 'Hao Dong',
    institution: 'Peking University · PrimeBot',
    image: '/images/organizers/hao-dong.jpg',
    imageAlt: 'Portrait of workshop organizer Hao Dong',
  },
]

export const topicGroups: TopicGroup[] = [
  {
    label: '01 / Scale',
    title: 'Scaling-based approaches',
    items: [
      'Large-scale datasets from teleoperation, simulation, and human demonstrations',
      'Vision–language–action models and foundation policies for bimanual tasks',
      'Cross-embodiment learning from human video for bimanual skill acquisition',
    ],
  },
  {
    label: '02 / Structure',
    title: 'Coordination and control',
    items: [
      'Coordination mechanisms, role assignment, and interaction modeling for dual-arm systems',
      'Hierarchical and structured policies for long-horizon bimanual tasks',
      'Learning-based planning and control for multi-arm manipulation',
    ],
  },
  {
    label: '03 / Synthesis',
    title: 'Bridging scaling and structure',
    items: [
      'Hybrid approaches combining large-scale learning with explicit coordination structures',
      'Simulation, real-to-sim transfer, and benchmarking for bimanual manipulation',
      'Evaluation of coordination, physical feasibility, and embodied execution',
    ],
  },
]

export const submission: SubmissionInfo = {
  eyebrow: 'Submission format',
  title: 'Short papers & extended abstracts',
  introduction:
    'We welcome short papers and extended abstracts describing ongoing or completed work.',
  guidelines: [
    {
      label: 'Review',
      prefix:
        'Submissions will undergo double-blind review. Authors must anonymize their manuscripts.',
      suffix: '',
    },
    {
      label: 'Format',
      prefix: 'Use the ',
      link: {
        label: 'standard IEEE conference paper format',
        href: 'https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/authoring-tools-and-templates/',
      },
      suffix: '.',
    },
    {
      label: 'Length',
      prefix: 'Submissions must not exceed 4 pages, excluding references.',
      suffix: '',
    },
    {
      label: 'Appendices',
      prefix:
        'To keep submissions concise and consistent, we kindly ask authors not to include appendices.',
      suffix: '',
    },
  ],
  presentation:
    'Accepted submissions will be presented as posters, with a subset selected for spotlight talks.',
}

export const awards: AwardItem[] = [
  {
    name: 'Best Workshop Paper Award',
    recipientCount: 1,
    prize: 'USD 1,000',
    prizeClarification: 'For the selected paper',
  },
  {
    name: 'Outstanding Workshop Paper Award',
    recipientCount: 3,
    prize: 'USD 500',
    prizeClarification: 'For each paper',
  },
]

export const importantDates = [
  { label: 'Submission deadline', value: 'August 24, 2026 · 11:59 PM AOE' },
  { label: 'Acceptance notification', value: 'September 6, 2026 · 11:59 PM AOE' },
  { label: 'Camera-ready deadline', value: 'September 20, 2026 · 11:59 PM AOE' },
]

export const sponsor = {
  name: 'PrimeBot',
  url: 'https://www.primebot.cn/',
}
