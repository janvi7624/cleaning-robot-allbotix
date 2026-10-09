'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { observeOnce } from './nhObserver'
import styles from './cleaning.module.css'

type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'li'
  | 'ul'
  | 'p'
  | 'span'

type RevealProps = {
  children: ReactNode
  /** Stagger, in seconds, applied as a transition delay. */
  delay?: number
  /** Extra classes composed alongside the reveal classes. */
  className?: string
  as?: RevealTag
  /** Merged with the transition delay — used for per-item aspect ratios. */
  style?: CSSProperties
}

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. The movement itself lives in CSS (`.reveal` / `.revealIn`), so this
 * component only flips a class — and `prefers-reduced-motion` neutralises it
 * in the stylesheet without any JS branch here.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    return observeOnce(el, () => setShown(true))
  }, [shown])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`${styles.reveal} ${shown ? styles.revealIn : ''} ${className}`.trim()}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
    >
      {children}
    </Tag>
  )
}
