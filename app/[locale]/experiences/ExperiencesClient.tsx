'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import DyaneEditorialPage from '@/components/editorial/DyaneEditorialPage'
import { localizedPath } from '@/i18n/paths'
import { cloudinaryVideo } from '@/lib/cloudinary'
import { officialEditorialMedia, officialImageUrl } from '@/content/officialImages'
import editorialStyles from '@/components/editorial/DyaneEditorialPage.module.css'
import styles from './Experiences.module.css'

import { experiencesMedia as media, experiencesGalleries as galleries } from '@/content/editorialMedia'

export default function ExperiencesClient() {
  const t = useTranslations('experiences')
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const articlePath = (slug: string) => localizedPath(locale, `/le-journal/${slug}`)

  return (
    <DyaneEditorialPage
      className={`${editorialStyles.compact} ${styles.experiencesPage}`}
      eyebrow={t('kicker')}
      title={t('definition_titre')}
      openingAtEnd
      video={{
        src: cloudinaryVideo(media.heroVideo, 1600),
        poster: officialImageUrl(media.heroPoster),
        label: t('video_label'),
      }}
      textBlocks={[
        {
          eyebrow: t('kicker'),
          title: t('definition_titre'),
          body: (
            <>
              <p>{t('definition')}</p>
              <p>{t('intro1')}</p>
              <p>{t('intro2')}</p>
              <Link href={localizedPath(locale, '/oeuvres')}>{t('cta_oeuvres')}</Link>
            </>
          ),
        },
        {
          title: t('signature_titre'),
          className: styles.signatureIntroduction,
          body: (
            <>
              <p>{t('signature_p1')}</p>
              <p>{t('signature_p2')}</p>
              <p>{t('signature_p3')}</p>
              <Link href={articlePath('heure-du-bar-cocktail-hotel')}>{t('cta_bar')}</Link>
            </>
          ),
        },
        {
          title: t('service_titre'),
          body: (
            <>
              <p>{t('service_p1')}</p>
              <p>{t('service_p2')}</p>
              <p>{t('service_p3')}</p>
              <Link href={articlePath('cocktail-minibar-hotel')}>{t('cta_minibar')}</Link>
            </>
          ),
        },
        {
          title: t('sur_mesure_titre'),
          body: (
            <>
              <p>{t('sur_mesure_p1')}</p>
              <p>{t('sur_mesure_p2')}</p>
              <p>{t('sur_mesure_p3')}</p>
              <Link href={localizedPath(locale, '/commission-a-sculpture')}>{t('cta_sur_mesure')}</Link>
            </>
          ),
        },
        {
          title: t('evenement_titre'),
          titleAsEyebrow: true,
          body: (
            <>
              <p>{t('evenement_p1')}</p>
              <p>{t('evenement_p2')}</p>
              <p>{t('evenement_p3')}</p>
              <Link href={localizedPath(locale, '/contact')}>{t('citation_cta')}</Link>
              <p>
                <Link href={localizedPath(locale, '/le-journal/art-de-recevoir-cocktail-hotel')}>{t('link_hotel')}</Link>{' · '}
                <Link href={localizedPath(locale, '/le-journal/cocktail-minibar-hotel')}>{t('link_minibar')}</Link>{' · '}
                <Link href={localizedPath(locale, '/le-journal/cocktail-evenementiel-grands-volumes')}>{t('link_event')}</Link>{' · '}
                <Link href={localizedPath(locale, '/commission-a-sculpture')}>{t('link_commission')}</Link>
              </p>
            </>
          ),
        },
      ]}
      gallery3={galleries.gallery3.map((item) => officialEditorialMedia(item, locale))}
      gallery2={galleries.gallery2.map((item) => officialEditorialMedia(item, locale))}
      gallery6={galleries.gallery6.map((item) => officialEditorialMedia(item, locale))}
      gallery8={galleries.gallery8.map((item) => officialEditorialMedia(item, locale))}
    />
  )
}
