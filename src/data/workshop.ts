export type ScheduleStatus = 'confirmed' | 'tentative' | 'pending'
export type ScheduleKind = 'talk' | 'session' | 'break'

export interface WorkshopMeta {
  eyebrow: string
  title: string
  subtitle: string
  date: string
  time: string
  location: string
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
  institution: string
  image: string
  imageAlt: string
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
  count: string
  prize: string
}

export const workshopMeta: WorkshopMeta = {
  eyebrow: 'Workshop @ IROS 2026',
  title: 'Scaling vs. Structure?',
  subtitle: 'Rethinking Bimanual Manipulation Beyond Single-Arm Policies',
  date: 'September 27, 2026',
  time: '8:00 AM–12:30 PM EDT',
  location: 'Pittsburgh, PA, USA',
  openReviewUrl:
    'https://openreview.net/group?id=IEEE.org%2FIROS%2F2026%2FWorkshop%2FBimanual_Manipulation',
  repositoryUrl: 'https://github.com/bimanual-robot-learning/bimanual-robot-learning.github.io',
}

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

export const submission = {
  description:
    'We welcome short papers and extended abstracts of up to 4 pages, excluding references, describing ongoing or completed work. Submissions should be made through OpenReview.',
  presentation:
    'Accepted submissions will be presented in a poster session, with a subset selected for spotlight talks.',
}

export const awards: AwardItem[] = [
  {
    name: 'Best Workshop Paper Award',
    count: '1 paper',
    prize: 'USD 1,000',
  },
  {
    name: 'Outstanding Workshop Paper Award',
    count: '3 papers · each',
    prize: 'USD 500',
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
