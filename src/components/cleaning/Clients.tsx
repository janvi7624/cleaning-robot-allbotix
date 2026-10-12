import Image from 'next/image'
import { getClientList, getPartnerList } from '@db/queries/clients'
import Reveal from './Reveal'
import { SplitHead } from './NhSectionHead'
import { ArrowUpRight } from './NhIcons'
import nh from './cleaning.module.css'

/**
 * Clients and partners — the same trust-signal band F:/allbotix shows,
 * reading the same `clients` collection (one Mongo database, shared by both
 * apps). Placed right after the model comparison, same position it holds on
 * the main site's product pages: the two models, then who's already
 * running Allbotix robots.
 *
 * Clients and partners stay separate — the first group actually runs
 * Allbotix robots, the second does not. They are two bands of opposite
 * tone (clients dark, partners beige) so the pair reads as two sections
 * rather than one, and the beige band also breaks the run into the dark
 * feature block that follows. Partner plates are white regardless of the
 * band's ground: two of the four marks are JPEGs with no alpha, so a
 * tinted plate would show the white rectangle inside it.
 */
export default async function Clients({ onDark = false }: { onDark?: boolean } = {}) {
  const [clients, partners] = await Promise.all([getClientList(), getPartnerList()])

  return (
    <>
    <section className={`${nh.section} ${onDark ? nh.onDark : ''}`.trim()} id="clients">
      <div className={nh.shell}>
        <SplitHead
          eyebrow="Our Clients"
          title="Trusted by Businesses Across India"
          lead="Robots in service with educational, healthcare, infrastructure and manufacturing organisations."
        />

        <Reveal>
          <ul className={nh.clientGrid}>
            {clients.map((client) => (
              <li key={client.name} className={nh.clientCard}>
                <span className={nh.clientLogo}>
                  <Image
                    src={client.icon}
                    alt={`${client.name} logo`}
                    fill
                    sizes="200px"
                    loading="lazy"
                    unoptimized
                  />
                </span>
                <span>
                  <span className={nh.clientName}>{client.name}</span>
                  <span className={nh.clientDesc}>{client.description}</span>
                </span>

                <a
                  href={client.link}
                  className={nh.clientLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                  <ArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>

    {partners.length > 0 && (
      <section
        className={`${nh.section} ${nh.partnerBand} ${onDark ? '' : nh.onDark}`.trim()}
        id="partners"
      >
        <div className={nh.shell}>
          <Reveal>
            <p className={nh.partnerLabel}>Agency &amp; Technology Partners</p>

            <ul className={nh.partnerGrid}>
              {partners.map((partner) => (
                <li key={partner.name} className={nh.partnerCard}>
                  <a
                    href={partner.link}
                    className={nh.partnerPlate}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-labelledby={`cl-partner-${partner.name.replace(/\W+/g, '-')}`}
                  >
                    <Image
                      src={partner.icon}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 45vw, 240px"
                      loading="lazy"
                      unoptimized
                    />
                  </a>
                  <span
                    className={nh.partnerName}
                    id={`cl-partner-${partner.name.replace(/\W+/g, '-')}`}
                  >
                    {partner.name}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    )}
    </>
  )
}
