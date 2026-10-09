import type { CSSProperties, ReactNode } from 'react'
import Reveal from './Reveal'
import styles from './cleaning.module.css'

/** The small label that opens each section. */
export function Eyebrow({ label, className = '' }: { label: string; className?: string }) {
  return (
    <p className={`${styles.eyebrow} ${className}`.trim()}>
      <span className={styles.eyebrowRule} aria-hidden="true" />
      {label}
    </p>
  )
}

/**
 * The headline, one masked line at a time.
 *
 * Each line sits in its own `overflow: hidden` box and rises into it when the
 * section scrolls into view, a tenth of a second after the line above.
 */
function MaskedLines({ lines, accentLine }: { lines: string[]; accentLine: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className={styles.lineMask}>
          <span
            className={styles.lineRise}
            style={{ '--line-delay': `${i * 0.1}s` } as CSSProperties}
          >
            {i === accentLine ? <span className={styles.accentText}>{line}</span> : line}
          </span>
        </span>
      ))}
    </>
  )
}

/**
 * Standard section opener: eyebrow and headline on the left, supporting copy
 * and an optional CTA on the right. One column below 1200px.
 */
export function SplitHead({
  eyebrow,
  title,
  lines,
  accentLine,
  lead,
  aside,
  stack = false,
}: {
  eyebrow: string
  title?: ReactNode
  /** One entry per visual line. Takes precedence over `title`. */
  lines?: string[]
  /** Which line carries the accent. Defaults to the last. */
  accentLine?: number
  lead?: string
  aside?: ReactNode
  /** Drop the empty second column and let the heading use the full width. */
  stack?: boolean
}) {
  return (
    <>
      <Reveal>
        <Eyebrow label={eyebrow} />
      </Reveal>

      <div className={`${styles.splitHead} ${stack ? styles.splitHeadStack : ''}`.trim()}>
        <Reveal delay={0.08}>
          <h2 className={styles.h2}>
            {lines ? (
              <MaskedLines lines={lines} accentLine={accentLine ?? lines.length - 1} />
            ) : (
              <span className={styles.headMask}>
                <span className={styles.lineRise}>{title}</span>
              </span>
            )}
          </h2>
        </Reveal>

        {(lead || aside) && (
          <Reveal delay={0.16} className={styles.splitAside}>
            {lead && <p className={styles.body}>{lead}</p>}
            {aside}
          </Reveal>
        )}
      </div>
    </>
  )
}
