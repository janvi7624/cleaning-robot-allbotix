'use client'

import { useEffect, useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import styles from './cleaning.module.css'

/** Matches `--paper`: the cream the whole page sits on. */
const PAGE_BG = '#f3efe7'

/** Hero picture drifts up to this many px (either way) over the first screens. */
const HERO_SHIFT = 22

/**
 * Root wrapper for the page.
 *
 * Carries the page's design tokens — see `.page` in cleaning.module.css —
 * repaints <body> cream for as long as this route is mounted, and drives the
 * two bits of motion that need JS:
 *
 *  - scroll: writes `--progress` (0–1) and `--hero-y` (px) onto the root and
 *    flips `data-scrolled`, batched to one write per frame;
 *  - pointer: one delegated listener that tells any `[data-spot]` card where
 *    the cursor is, for its hover spotlight.
 *
 * Everything else is CSS. Both effects are skipped under reduced motion.
 */
export default function NhShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.body.style.backgroundColor
    document.body.style.backgroundColor = PAGE_BG
    return () => {
      document.body.style.backgroundColor = previous
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--progress', max > 0 ? String(Math.min(1, y / max)) : '0')
      // Eases from 0 → HERO_SHIFT as the hero scrolls out of view.
      const t = Math.min(1, y / (window.innerHeight * 0.9))
      root.style.setProperty('--hero-y', `${(t * HERO_SHIFT).toFixed(1)}px`)
      root.dataset.scrolled = y > 8 ? 'true' : 'false'
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const card = (e.target as Element).closest<HTMLElement>('[data-spot]')
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.page} ${className}`.trim()}
      onPointerMove={onPointerMove}
    >
      <noscript>
        <style>{`.${styles.reveal}{opacity:1 !important;transform:none !important}.${styles.reveal} *{clip-path:none !important;scale:none !important}.${styles.lineRise}{transform:none !important}.${styles.eyebrowRule}{transform:none !important}`}</style>
      </noscript>
      <div className={styles.progress} aria-hidden="true" />
      {children}
    </div>
  )
}
