import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/dm-mono/500.css'
import '../index.css'
import './ChallengeComingSoon.css'
import ChallengeComingSoon from './ChallengeComingSoon'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChallengeComingSoon />
  </StrictMode>,
)
