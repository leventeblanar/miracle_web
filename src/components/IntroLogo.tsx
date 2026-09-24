import { useEffect, useState } from 'react'
import HeroLogo, { HERO_LOGO_DURATION } from './HeroLogo'

const INTRO_SESSION_KEY = 'miracle-intro-seen'
const LEAVE_DURATION = 1100

type Phase = 'playing' | 'leaving' | 'done'

function getInitialPhase(): Phase {
  if (typeof window === 'undefined') return 'done'

  const alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true'
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return alreadySeen || reduceMotion ? 'done' : 'playing'
}

// Plays the hero logo full-screen as a page-load intro, then "flies" it
// toward the viewer (scaling up while fading out) to reveal the main page
// underneath - the same logo that used to sit permanently in the hero.
function IntroLogo() {
  const [phase, setPhase] = useState<Phase>(getInitialPhase)

  useEffect(() => {
    if (phase !== 'playing') return

    const timer = window.setTimeout(() => setPhase('leaving'), HERO_LOGO_DURATION)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'leaving') return

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true')
      setPhase('done')
    }, LEAVE_DURATION)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      className={`page-intro ${phase === 'leaving' ? 'page-intro--leaving' : ''}`}
      aria-hidden="true"
    >
      <HeroLogo />
    </div>
  )
}

export default IntroLogo
