import Link from 'next/link'
import { useId } from 'react'
import { cartFontVariables } from '@/components/cart/fonts'
import EditorialImage from '@/components/editorial/EditorialImage'
import { bespokeMixology } from '@/content/bespokeMixology'
import { localizedPath } from '@/i18n/paths'
import styles from './LuxuryHeader.module.css'

const signatureWorks = [
  {
    label: 'Dyane No.1',
    href: '/oeuvres/dyane-no1-pornstar-martini',
    image: '/home/editorial/dyane-paris-no1-sculpture-musee.webp',
    position: '50% 14%',
  },
  {
    label: 'Dyane No.2',
    href: '/oeuvres/dyane-no2-basil-smash',
    image: '/home/editorial/dyane-paris-no2-basil-smash-hotel.webp',
    position: '50% 46%',
  },
]

export default function CollectionsMenu({
  locale,
  onNavigate,
}: {
  locale: 'fr' | 'en'
  onNavigate: () => void
}) {
  const id = useId()
  const en = locale === 'en'
  const groups = [
    {
      id: `${id}-haute-mixologie`,
      wide: true,
      title: en ? 'Haute Mixology' : 'Haute Mixologie',
      works: signatureWorks,
    },
    {
      id: `${id}-sur-mesure`,
      wide: false,
      title: en ? 'Bespoke' : 'Sur-mesure',
      works: [{
        label: en ? 'Bespoke recipes' : 'Recettes sur mesure',
        href: bespokeMixology.path,
        image: '/home/editorial/dyane-paris-sculpture-sur-mesure.webp',
        position: '50% min(0px, 45% + 2cm)',
      }],
    },
  ]

  return (
    <div className={`${styles.collectionsGrid} ${cartFontVariables}`}>
      {groups.map(group => (
        <h2 id={group.id} className={styles.collectionsTitle} data-wide={group.wide} key={group.id}>{group.title}</h2>
      ))}
      {groups.map(group => (
        <div role="group" aria-labelledby={group.id} className={styles.collectionsCards} data-wide={group.wide} key={`${group.id}-cards`}>
          {group.works.map(work => (
            <Link
              key={work.href}
              href={localizedPath(locale, work.href)}
              className={styles.collectionsCard}
              onClick={onNavigate}
            >
              <span className={styles.collectionsLabel}>{work.label}</span>
              <span className={styles.collectionsImage}>
                <EditorialImage
                  src={work.image}
                  alt=""
                  fill
                  sizes="(max-width: 1050px) calc(100vw - 34px), 33vw"
                  style={{ objectPosition: work.position }}
                />
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}
