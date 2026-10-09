/**
 * One IntersectionObserver shared by every scroll-reveal on this page.
 *
 * Giving each reveal target its own observer would mean many separate
 * observer instances all doing the same intersection maths on every frame of
 * a scroll; one shared instance batches them into a single callback.
 *
 * Reveals are one-shot: an element is unobserved the first time it lands, so
 * nothing re-animates when you scroll back up.
 */

type RevealCallback = () => void

let observer: IntersectionObserver | null = null

/* WeakMap, not Map: if a target is removed from the DOM without its cleanup
   running, the entry can still be collected rather than pinning the node. */
const callbacks = new WeakMap<Element, RevealCallback>()

function getObserver(): IntersectionObserver {
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const run = callbacks.get(entry.target)
        callbacks.delete(entry.target)
        observer?.unobserve(entry.target)
        run?.()
      }
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.06,
    }
  )

  return observer
}

/**
 * Reveals `el` once it scrolls into view. Returns a cleanup function.
 *
 * Where IntersectionObserver is unavailable the callback runs immediately —
 * content must never be left at `opacity: 0`.
 */
export function observeOnce(el: Element, onReveal: RevealCallback): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    onReveal()
    return () => {}
  }

  callbacks.set(el, onReveal)
  getObserver().observe(el)

  return () => {
    callbacks.delete(el)
    observer?.unobserve(el)
  }
}
