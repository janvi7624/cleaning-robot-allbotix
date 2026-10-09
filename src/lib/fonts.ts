import { Inter } from 'next/font/google'

/**
 * This site's single typeface.
 *
 * Defined once and imported wherever it is needed — see Next's font docs on
 * why a shared font object must be defined once rather than called per
 * route. Self-hosted, no render-blocking request, and a metric-matched
 * fallback so there is no layout shift.
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--nh-font',
  display: 'swap',
})
