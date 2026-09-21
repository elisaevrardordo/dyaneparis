'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from './FullScreenSlideStack.module.css'

const WHEEL_THRESHOLD = 35
const TRANSITION_DURATION = 360
const GESTURE_RELEASE_DELAY = 120

export default function FullScreenSlideStack({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const viewportRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeSlideRef = useRef(0)
  const wheelAccumulatorRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const transitionEndsAtRef = useRef(0)
  const lastWheelAtRef = useRef(0)
  const releaseTimerRef = useRef<number | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isControlled, setIsControlled] = useState(false)

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMode = () => setIsControlled(pointer.matches && !reducedMotion.matches)

    updateMode()
    pointer.addEventListener('change', updateMode)
    reducedMotion.addEventListener('change', updateMode)
    return () => {
      pointer.removeEventListener('change', updateMode)
      reducedMotion.removeEventListener('change', updateMode)
    }
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || !isControlled) return

    const slideCount = track.querySelectorAll<HTMLElement>('[data-scroll-section]').length

    const clearReleaseTimer = () => {
      if (releaseTimerRef.current) {
        window.clearTimeout(releaseTimerRef.current)
        releaseTimerRef.current = null
      }
    }

    const releaseGesture = () => {
      clearReleaseTimer()
      const now = performance.now()
      const transitionRemaining = transitionEndsAtRef.current - now
      const gestureRemaining = lastWheelAtRef.current + GESTURE_RELEASE_DELAY - now
      const remaining = Math.max(transitionRemaining, gestureRemaining)

      if (remaining > 0) {
        releaseTimerRef.current = window.setTimeout(releaseGesture, remaining)
        return
      }

      isTransitioningRef.current = false
      wheelAccumulatorRef.current = 0
    }

    const scheduleGestureRelease = () => {
      clearReleaseTimer()
      releaseTimerRef.current = window.setTimeout(releaseGesture, GESTURE_RELEASE_DELAY)
    }

    const activateSlide = (nextSlide: number) => {
      activeSlideRef.current = nextSlide
      isTransitioningRef.current = true
      transitionEndsAtRef.current = performance.now() + TRANSITION_DURATION
      wheelAccumulatorRef.current = 0
      viewport.dataset.activeSlide = String(nextSlide)
      setActiveSlide(nextSlide)
      window.dispatchEvent(new Event('home-slide-change'))
      scheduleGestureRelease()
    }

    const handleWheel = (event: WheelEvent) => {
      const outerScroller = viewport.parentElement
      if (outerScroller && outerScroller.scrollTop > 1) return

      const currentSlide = activeSlideRef.current
      const deltaMultiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? viewport.clientHeight
          : 1
      const delta = event.deltaY * deltaMultiplier

      if (isTransitioningRef.current) {
        event.preventDefault()
        lastWheelAtRef.current = performance.now()
        scheduleGestureRelease()
        return
      }

      if (currentSlide === slideCount - 1 && delta > 0) {
        wheelAccumulatorRef.current = 0
        return
      }

      event.preventDefault()
      lastWheelAtRef.current = performance.now()

      wheelAccumulatorRef.current += delta
      scheduleGestureRelease()

      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) return

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1
      const nextSlide = Math.min(slideCount - 1, Math.max(0, currentSlide + direction))
      if (nextSlide !== currentSlide) activateSlide(nextSlide)
      else wheelAccumulatorRef.current = 0
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      clearReleaseTimer()
      viewport.removeEventListener('wheel', handleWheel)
    }
  }, [isControlled])

  const trackStyle = {
    transform: `translate3d(0, -${activeSlide * 100}svh, 0)`,
  } satisfies CSSProperties

  return (
    <main
      ref={viewportRef}
      className={`${className ?? ''} ${styles.viewport}`.trim()}
      data-active-slide={activeSlide}
      data-controlled-scroll={isControlled || undefined}
      data-homepage-slides
      data-section-scroll
    >
      <div ref={trackRef} className={styles.track} style={trackStyle}>
        {children}
      </div>
    </main>
  )
}
