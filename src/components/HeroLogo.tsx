import { useEffect, useRef } from 'react'

const BOTTOM = 1042
export const HERO_LOGO_DURATION = 7200
const TOTAL_DURATION = HERO_LOGO_DURATION
const SETTLE_AT = 4600

// LED-meter ballistics: bars jump up quickly but fall back slowly.
const ATTACK_RATE = 5
const DECAY_RATE = 1.1

const BARS = [
  { x: 309, width: 19, top: 307 },
  { x: 338, width: 20, top: 199 },
  { x: 370, width: 20, top: 69 },
  { x: 402, width: 20, top: 199 },
  { x: 434, width: 20, top: 307 },
  { x: 466, width: 20, top: 664 },
  { x: 497, width: 19, top: 620 },
  { x: 527, width: 20, top: 664 },
  { x: 558, width: 20, top: 620 },
  { x: 589, width: 20, top: 570 },
  { x: 619, width: 20, top: 519 },
  { x: 651, width: 19, top: 570 },
  { x: 682, width: 20, top: 620 },
  { x: 713, width: 19, top: 664 },
  { x: 745, width: 20, top: 620 },
  { x: 775, width: 20, top: 664 },
  { x: 806, width: 19, top: 307 },
  { x: 835, width: 20, top: 199 },
  { x: 867, width: 20, top: 69 },
  { x: 899, width: 19, top: 199 },
  { x: 931, width: 20, top: 307 },
]

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

function targetScale(time: number, index: number, maxScale: number) {
  const a = Math.sin(time * 0.0022 + index * 1.73)
  const b = Math.sin(time * 0.0037 + index * 0.61)
  const pulse = Math.abs(a * 0.64 + b * 0.36)
  return clamp(0.14 + pulse * maxScale, 0.14, maxScale)
}

function HeroLogo() {
  const barRefs = useRef<(SVGRectElement | null)[]>([])
  const wordmarkRef = useRef<SVGGElement | null>(null)
  const lastScales = useRef<number[]>([])

  useEffect(() => {
    const setBar = (index: number, scale: number) => {
      const bar = barRefs.current[index]
      if (!bar) return
      const height = (BOTTOM - BARS[index].top) * scale
      bar.setAttribute('y', String(BOTTOM - height))
      bar.setAttribute('height', String(height))
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion) {
      BARS.forEach((_, index) => setBar(index, 1))
      if (wordmarkRef.current) {
        wordmarkRef.current.style.opacity = '1'
        wordmarkRef.current.style.transform = 'none'
      }
      return
    }

    let frame: number
    const startedAt = performance.now()
    let lastTime = startedAt
    BARS.forEach((_, index) => {
      lastScales.current[index] = 0.14
    })

    const render = (now: number) => {
      const elapsed = now - startedAt
      const dt = (now - lastTime) / 1000
      lastTime = now

      BARS.forEach((barConfig, index) => {
        const maxScale = (BOTTOM - 69) / (BOTTOM - barConfig.top)
        const current = lastScales.current[index] ?? 0.14

        if (elapsed < SETTLE_AT) {
          const target = targetScale(elapsed, index, maxScale)
          const rate = target > current ? ATTACK_RATE : DECAY_RATE
          const next = current + (target - current) * (1 - Math.exp(-rate * dt))
          lastScales.current[index] = next
          setBar(index, next)
          return
        }

        const progress = clamp(
          (elapsed - SETTLE_AT) / (TOTAL_DURATION - SETTLE_AT),
          0,
          1
        )
        const from = lastScales.current[index] ?? current
        setBar(index, from + (1 - from) * easeOutCubic(progress))
      })

      const reveal = clamp((elapsed - SETTLE_AT) / 1400, 0, 1)
      if (wordmarkRef.current) {
        wordmarkRef.current.style.opacity = String(reveal)
        wordmarkRef.current.style.transform = `translateY(${
          12 * (1 - easeOutCubic(reveal))
        }px)`
      }

      if (elapsed < TOTAL_DURATION) {
        frame = requestAnimationFrame(render)
      }
    }

    frame = requestAnimationFrame(render)

    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <svg
      className="hero-logo"
      viewBox="0 0 1270 1270"
      role="img"
      aria-label="Miracle Sound Szeged"
    >
      <g className="hero-logo__bars">
        {BARS.map((bar, index) => (
          <rect
            key={bar.x}
            ref={(el) => {
              barRefs.current[index] = el
            }}
            x={bar.x}
            y={BOTTOM}
            width={bar.width}
            height={0}
            rx={2}
          />
        ))}
      </g>

      <g ref={wordmarkRef} className="hero-logo__wordmark">
        <text x="635" y="1155" textAnchor="middle">
          MIRACLE SOUND
        </text>
        <text x="635" y="1205" textAnchor="middle" className="hero-logo__city">
          SZEGED
        </text>
      </g>
    </svg>
  )
}

export default HeroLogo
