'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import DyaneEditorialPage from '@/components/editorial/DyaneEditorialPage'
import { localizedPath } from '@/i18n/paths'
import { cloudinaryVideo } from '@/lib/cloudinary'
import { officialEditorialMedia } from '@/content/officialImages'

import { maisonMedia as media, maisonGalleries as galleries } from '@/content/editorialMedia'

export default function LaMaisonClient() {
  const t = useTranslations('maison')
  const locale = useLocale()

  return (
    <DyaneEditorialPage
      eyebrow={t('kicker')}
      title={t('definition_titre')}
      video={{
        src: cloudinaryVideo(media.film, 1600),
        poster: media.filmPoster,
        label: "Film de l'histoire et du savoir-faire Dyane Paris",
      }}
      textBlocks={[
        {
          eyebrow: t('kicker'),
          title: t('definition_titre'),
          body: (
            <>
              <p>{t('definition')}</p>
              <p>{t('intro')}</p>
            </>
          ),
        },
        {
          eyebrow: t('genese_kicker'),
          title: t('genese_titre'),
          body: (
            <>
              <p>{t('genese_p1')}</p>
              <p>{t('genese_p2')}</p>
              <p>{t('genese_p3')}</p>
            </>
          ),
        },
        {
          eyebrow: t('art_kicker'),
          title: t('art_titre'),
          body: (
            <>
              <p>{t('art_p1')}</p>
              <p>{t('art_p2')}</p>
              <p>{t('art_p3')}</p>
              <p>{t('art_p4')}</p>
            </>
          ),
        },
        {
          title: t('temps_titre'),
          body: (
            <>
              <p>{t('temps_p1')}</p>
              <p>{t('temps_p2')}</p>
              <p>{t('temps_p3')}</p>
            </>
          ),
        },
        {
          title: t('contemporaine_titre'),
          body: (
            <>
              <p>{t('contemporaine_p')}</p>
              <p>
                <Link href={localizedPath(locale, '/oeuvres')}>{t('link_oeuvres')}</Link>{' · '}
                <Link href={localizedPath(locale, '/fabrication')}>{t('link_fabrication')}</Link>{' · '}
                <Link href={localizedPath(locale, '/distillation')}>{t('link_distillation')}</Link>
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
