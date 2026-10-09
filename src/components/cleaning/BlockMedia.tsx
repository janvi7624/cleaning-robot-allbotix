import Image from 'next/image'
import s from './cleaning.module.css'

/**
 * A feature block's picture — or its video, if `src` points at one. None of
 * this site's images are videos today, but the check costs nothing and
 * keeps this component a drop-in match for the main site's BlockMedia.
 */

const VIDEO = /\.(mp4|webm|mov)$/i

export default function BlockMedia({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  sizes: string
  priority?: boolean
}) {
  if (VIDEO.test(src)) {
    return (
      <video
        className={s.mediaVideo}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        aria-label={alt}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      {...(priority ? { priority: true } : { loading: 'lazy' as const })}
    />
  )
}
