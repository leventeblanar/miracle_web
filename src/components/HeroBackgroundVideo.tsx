import { useEffect, useState } from 'react'
import video3 from '../assets/video/converted/3_long.mp4'
import video4 from '../assets/video/converted/4_long.mp4'
import video5 from '../assets/video/converted/5_long.mp4'
import video6 from '../assets/video/converted/6_long.mp4'
import video7 from '../assets/video/converted/7_long.mp4'

const PLAYLIST = [video4, video6, video7, video5, video3]

function HeroBackgroundVideo() {
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    // The background video (several MB) is only added to the DOM once the
    // browser has had a chance to fire off the critical startup requests
    // (fonts, CSS, JS) - so it doesn't compete with them for bandwidth in
    // the first moments. `.hero__video-stage` keeps its own dark fallback
    // background until then, which is the intended initial state.
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(() => setVideoEnabled(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(() => setVideoEnabled(true), 400)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const advance = () => {
    setLoaded(false)
    setSettled(false)
    setIndex((current) => (current + 1) % PLAYLIST.length)
  }

  return (
    <div className="hero__video-stage" aria-hidden="true">
      {videoEnabled && (
        <video
          key={PLAYLIST[index]}
          className={`hero__video ${loaded ? 'hero__video--loaded' : ''} ${
            settled ? 'hero__video--settled' : ''
          }`}
          src={PLAYLIST[index]}
          autoPlay
          muted
          playsInline
          preload="auto"
          // @ts-expect-error - fetchPriority isn't in React's DOM typings yet
          fetchPriority="low"
          onLoadedData={() => setLoaded(true)}
          onAnimationEnd={(event) => {
            if (event.animationName === 'heroVideoReveal') {
              setSettled(true)
            }
          }}
          onEnded={advance}
          onError={advance}
        />
      )}
    </div>
  )
}

export default HeroBackgroundVideo
