import type { CSSProperties } from 'react'
import Image from 'next/image'
import { getCleaningRobotFamily, getCleaningModels, type RobotModel } from '@db/queries/robots'
import NhShell from '@/components/cleaning/NhShell'
import Reveal from '@/components/cleaning/Reveal'
import { Eyebrow, SplitHead } from '@/components/cleaning/NhSectionHead'
import { ArrowRight, ArrowUpRight } from '@/components/cleaning/NhIcons'
import nh from '@/components/cleaning/cleaning.module.css'

/** Index that orders a hero element in the load sequence. */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties

const band = (onDark: boolean) => `${nh.section} ${onDark ? nh.onDark : ''}`.trim()

// The same photo was reused across these sections, so they carry no pictures:
// the feature blocks are card grids and the box contents are quantity cards.

type FeatureBlock = {
  sectionLabel: string
  title: string
  subtitle: string
  features: string[]
}

type PackagingBlock = {
  sectionLabel: string
  title: string
  subtitle: string
  includes: { item: string; detail: string }[]
  ctaLabel?: string
  ctaLink?: string
}

export default async function Home() {
  const family = await getCleaningRobotFamily()

  if (!family) {
    return (
      <NhShell>
        <section className={nh.section}>
          <div className={nh.shell}>
            <h1 className={nh.h1}>Unable to load robot data</h1>
            <p className={nh.body}>
              The cleaning robot catalogue could not be reached. Check the
              DATABASE_URL connection and try again.
            </p>
          </div>
        </section>
      </NhShell>
    )
  }

  const models = getCleaningModels(family)
  const [at60s, at20sPro] = models

  const display: FeatureBlock | undefined = family.display
  const navigation: FeatureBlock | undefined = family.navigation
  const voiceAssistant: FeatureBlock | undefined = family.voiceAssistant
  const industries: FeatureBlock | undefined = family.industries
  const packaging: PackagingBlock | undefined = family.packaging

  const featureBlocks = [display, navigation, voiceAssistant, industries].filter(
    (b): b is FeatureBlock => Boolean(b)
  )

  return (
    <NhShell>
      <Header />

      <Hero family={family} />

      <ModelCompare at60s={at60s} at20sPro={at20sPro} />

      {featureBlocks.map((block, i) => (
        <FeatureBlockSection
          key={block.title}
          block={block}
          onDark={i % 2 === 0}
          variant={block === industries ? 'tiles' : 'cards'}
        />
      ))}

      {packaging && <Packaging packaging={packaging} onDark={featureBlocks.length % 2 === 0} />}

      <ClosingCta />

      <Footer />
    </NhShell>
  )
}

function Header() {
  return (
    <header className={nh.header}>
      <div className={`${nh.shell} ${nh.headerInner}`}>
        <div className={nh.headerBrand}>
          <span className={nh.headerBrandName}>Allbotix Cleaning</span>
          <span className={nh.headerBrandTag}>AT20s Pro &amp; AT60s</span>
        </div>
        <a
          href="https://allbotix.ai"
          target="_blank"
          rel="noopener noreferrer"
          className={nh.headerLink}
        >
          allbotix.ai →
        </a>
      </div>
    </header>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Hero({ family }: { family: Record<string, any> }) {
  return (
    <section className={nh.hero}>
      <div className={nh.heroGrain} aria-hidden="true" />
      <div className={`${nh.shell} ${nh.heroGrid}`}>
        {/* Plays on load (CSS keyframes, staggered by --i), not on scroll. */}
        <div className={nh.heroCopy}>
          <div style={stagger(0)}>
            <Eyebrow label={family.category ?? 'Cleaning Robot'} />
          </div>
          <h1 className={nh.h1} style={stagger(1)}>
            Meet the <span className={nh.accentText}>AT20s Pro</span> &amp;{' '}
            <span className={nh.accentText}>AT60s</span>
          </h1>
          <p className={nh.heroLead} style={stagger(2)}>
            Two Allbotix cleaning robots, one lineup: the AT20s Pro for flats
            and apartments, and the AT60s for bungalows and large independent
            homes. Both map a space once and clean it on their own, every
            time after.
          </p>
          <p className={nh.heroDesc} style={stagger(3)}>{family.desc}</p>
          <div className={nh.heroCtas} style={stagger(4)}>
            <a href="mailto:sales@allbotix.ai?subject=AT20s%20Pro%20%2F%20AT60s%20enquiry" className={`${nh.btn} ${nh.btnPrimary}`}>
              Talk to us
              <ArrowRight />
            </a>
          </div>
        </div>

        <div className={nh.heroMedia}>
          <Image
            src={family.src}
            alt={family.name ?? 'Allbotix cleaning robot'}
            fill
            sizes="(max-width: 1023px) 92vw, 46vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}

function ModelCompare({
  at60s,
  at20sPro,
}: {
  at60s?: RobotModel
  at20sPro?: RobotModel
}) {
  const cards = [at20sPro, at60s].filter((m): m is RobotModel => Boolean(m))

  return (
    <section className={band(false)} id="models">
      <div className={nh.shell}>
        <SplitHead
          eyebrow="Available Models"
          title="Choose Your Configuration"
          lead="Two sizes of the same idea — pick the one that fits where you live."
        />

        <div className={nh.compareGrid}>
          {cards.map((model, i) => (
            <Reveal key={model.id} delay={i * 0.12} className={nh.compareItem}>
              <div className={nh.compareCard} data-spot>
                <span className={nh.compareMedia}>
                  <Image
                    src={model.src}
                    alt={model.alt ?? model.name}
                    fill
                    sizes="(max-width: 900px) 92vw, 44vw"
                  />
                </span>
                <div className={nh.compareBody}>
                  {model.previousName && (
                    <p className={nh.compareCode}>{model.previousName}</p>
                  )}
                  <h3 className={nh.compareName}>{model.name}</h3>
                  <p className={nh.compareDesc}>{model.desc}</p>
                  {model.bestFor && (
                    <p className={nh.compareBest}>Best for {model.bestFor}</p>
                  )}
                  {model.pdfLink && (
                    <div className={nh.compareCta}>
                      <a
                        href={model.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={nh.btnText}
                      >
                        Download Spec Sheet
                        <ArrowUpRight />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Columns (of a 6-col grid) each card spans, so 4/5/6 items always fill their rows. */
function cardSpan(count: number, i: number): number {
  if (count === 5) return i < 3 ? 2 : 3
  return count % 3 === 0 ? 2 : 3
}

function FeatureBlockSection({
  block,
  onDark,
  variant,
}: {
  block: FeatureBlock
  onDark: boolean
  variant: 'cards' | 'tiles'
}) {
  const count = block.features.length

  return (
    <section className={band(onDark)}>
      <div className={nh.shell}>
        <SplitHead eyebrow={block.sectionLabel} title={block.title} lead={block.subtitle} />

        <ul className={nh.featGrid}>
          {block.features.map((f, i) => (
            <Reveal
              as="li"
              key={f}
              delay={Math.min(i, 5) * 0.05}
              className={nh.featItem}
              style={{ '--span': variant === 'tiles' ? 2 : cardSpan(count, i) } as CSSProperties}
            >
              {variant === 'tiles' ? (
                <div className={nh.featTile} data-spot>
                  <span className={nh.blockMark} aria-hidden="true" />
                  {f}
                </div>
              ) : (
                <div className={nh.featCard} data-spot>
                  <span className={nh.featNum}>{String(i + 1).padStart(2, '0')}</span>
                  <p className={nh.featText}>{f}</p>
                </div>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** "1x Smart Cleaning Robot (Selected Model)" → { qty: "1", name: "Smart Cleaning Robot (Selected Model)" } */
function splitQuantity(item: string): { qty?: string; name: string } {
  const m = item.match(/^(\d+)\s*[x×]\s*(.+)$/i)
  return m ? { qty: m[1], name: m[2] } : { name: item }
}

function Packaging({
  packaging,
  onDark,
}: {
  packaging: PackagingBlock
  onDark: boolean
}) {
  return (
    <section className={band(onDark)} id="whats-included">
      <div className={nh.shell}>
        <SplitHead
          eyebrow={packaging.sectionLabel}
          title={packaging.title}
          lead={packaging.subtitle}
          aside={
            packaging.ctaLink && (
              <a
                href={packaging.ctaLink}
                className={`${nh.btn} ${nh.btnSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {packaging.ctaLabel ?? 'Download Spec Sheet'}
                <ArrowUpRight />
              </a>
            )
          }
        />

        <ul className={nh.packCards}>
          {packaging.includes.map((inc, i) => {
            const { qty, name } = splitQuantity(inc.item)
            return (
              <Reveal as="li" key={inc.item} delay={i * 0.06} className={nh.packCardItem}>
                <div className={nh.packCard} data-spot>
                  <span className={nh.packQty} aria-hidden={qty ? undefined : true}>
                    {qty ? `${qty}×` : '+'}
                  </span>
                  <p className={nh.packName}>{name}</p>
                  <p className={nh.packDetail}>{inc.detail}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className={nh.cta}>
      <div className={`${nh.shell} ${nh.ctaInner}`}>
        <Reveal>
          <h2 className={`${nh.h2} ${nh.ctaTitleWide}`}>
            Ready to deploy an <span className={nh.accentText}>AT20s Pro</span>{' '}
            or <span className={nh.accentText}>AT60s</span>?
          </h2>
          <p className={nh.ctaLead}>
            Tell us about your space and we&apos;ll help you pick the right model.
          </p>
          <div className={nh.ctaButtons}>
            <a
              href="mailto:sales@allbotix.ai?subject=AT20s%20Pro%20%2F%20AT60s%20enquiry"
              className={`${nh.btn} ${nh.btnPrimary}`}
            >
              Email our team
              <ArrowRight />
            </a>
            <a href="#models" className={`${nh.btn} ${nh.btnSecondary}`}>
              Back to the models
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className={nh.footer}>
      <div className={`${nh.shell} ${nh.footerInner}`}>
        <p className={nh.footerCopy}>
          © {new Date().getFullYear()} Allbotix. All rights reserved.
        </p>
        <a
          href="https://allbotix.ai"
          target="_blank"
          rel="noopener noreferrer"
          className={nh.footerLink}
        >
          allbotix.ai
        </a>
      </div>
    </footer>
  )
}
