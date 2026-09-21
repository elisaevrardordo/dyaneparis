'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import DyaneEditorialPage, { type DyaneEditorialMedia } from '@/components/editorial/DyaneEditorialPage'
import { localizedPath } from '@/i18n/paths'

const media = {
  film: 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788775590/OEUVRES_ntymti.mov',
  filmPoster: 'https://res.cloudinary.com/dazhkrimv/video/upload/f_jpg,q_auto,w_1600,so_0/v1788775590/OEUVRES_ntymti.jpg',
}

const galleries: Record<'gallery3' | 'gallery2' | 'gallery6' | 'gallery8', DyaneEditorialMedia[]> = {
  gallery3: [
    { src: '/editorial/la-maison/STATUE%202.png', alt: 'Portrait sculptural de Dyane Paris' },
    { src: '/editorial/la-maison/ART%201.png', alt: 'Recherches artistiques autour de la silhouette Dyane' },
    { src: '/editorial/la-maison/STATUE%201.png', alt: 'Œuvre Dyane Paris présentée en lumière naturelle' },
  ],
  gallery2: [
    { src: '/editorial/la-maison/ART%202.png', alt: 'Composition picturale inspirant la Maison Dyane' },
    { src: '/editorial/la-maison/17.png', alt: 'Détail de la sculpture en porcelaine Dyane Paris' },
  ],
  gallery6: [
    { src: '/editorial/la-maison/COCKTAIL%203.png', alt: 'Service d’un cocktail Dyane Paris' },
    { src: '/editorial/la-maison/PROD%204.mp4', alt: 'Fleur aromatique de la composition Dyane', type: 'video' },
    { src: '/editorial/la-maison/PROD%202.png', alt: 'Geste de production du liquide Dyane' },
    { src: '/editorial/la-maison/PROD%204.png', alt: 'Travail manuel de la porcelaine Dyane' },
    { src: '/editorial/la-maison/PROD%203.png', alt: 'Artisan au cœur de la production Dyane' },
    { src: '/editorial/la-maison/COCKTAIL%204.png', alt: 'Verre Dyane dans un intérieur parisien' },
  ],
  gallery8: [
    { src: '/editorial/la-maison/PROD%205.mp4', alt: 'Agrume sélectionné pour une composition Dyane', type: 'video' },
    { src: '/editorial/la-maison/DRINK.png', alt: 'Dégustation d’un cocktail Dyane Paris' },
    { src: '/editorial/la-maison/PROD%205.png', alt: 'Finition manuelle d’une sculpture Dyane' },
    { src: '/editorial/la-maison/COCKTAIL%202%20.png', alt: 'Détail ambré d’un cocktail Dyane' },
    { src: '/editorial/la-maison/DRINK%202.mp4', alt: 'Service d’une œuvre Dyane Paris', type: 'video' },
    { src: '/editorial/la-maison/PROD%206.png', alt: 'Coulage de la porcelaine dans un moule Dyane' },
    { src: '/editorial/la-maison/PROD.png', alt: 'Alambic de la Maison Dyane' },
    { src: '/editorial/la-maison/COCKTAIL%201%20.png', alt: 'Cocktail doré servi par Dyane Paris' },
  ],
}

export default function LaMaisonClient() {
  const t = useTranslations('maison')
  const locale = useLocale()

  return (
    <DyaneEditorialPage
      eyebrow={t('kicker')}
      title={t('titre')}
      video={{
        src: media.film,
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
      gallery3={galleries.gallery3}
      gallery2={galleries.gallery2}
      gallery6={galleries.gallery6}
      gallery8={galleries.gallery8}
    />
  )
}
