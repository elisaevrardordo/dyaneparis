'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import DyaneEditorialPage, { type DyaneEditorialMedia } from '@/components/editorial/DyaneEditorialPage'
import { localizedPath } from '@/i18n/paths'

const media = {
  heroVideo: 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788699063/COCKTAIL_pcevej.mp4',
  heroPoster: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777445316/DSC00599_copie_2_o518xt.jpg',
}

const galleries: Record<'gallery3' | 'gallery2' | 'gallery6' | 'gallery8', DyaneEditorialMedia[]> = {
  gallery3: [
    { src: '/editorial/experiences/BAR%202.png', alt: 'Œuvre Dyane au cœur d’un bar parisien' },
    { src: '/editorial/experiences/EVENT%207.png', alt: 'Invités découvrant une œuvre Dyane Paris' },
    { src: '/editorial/experiences/EVENT.png', alt: 'Expérience Dyane Paris face à la Tour Eiffel' },
  ],
  gallery2: [
    { src: '/editorial/experiences/EVENT%206.png', alt: 'Bar scénographié pour une expérience Dyane' },
    { src: '/editorial/experiences/BAR%201.png', alt: 'Sculpture et cocktail Dyane présentés au bar' },
  ],
  gallery6: [
    { src: '/editorial/experiences/7.png', alt: 'Mise en scène artistique de l’œuvre Dyane' },
    { src: '/editorial/experiences/ART%201.png', alt: 'Dessin d’une personnalisation Dyane' },
    { src: '/editorial/experiences/ART%202.png', alt: 'Sceau de cire de la Maison Dyane' },
    { src: '/editorial/experiences/ART%203.png', alt: 'Illustration florale et cocktail Dyane' },
    { src: '/editorial/experiences/PERSO%202.png', alt: 'Peinture personnalisée sur une sculpture Dyane' },
    { src: '/editorial/experiences/PERSO%203.png', alt: 'Décor textile personnalisé sur une sculpture Dyane' },
  ],
  gallery8: [
    { src: '/editorial/experiences/EVENT%203.png', alt: 'Invitation Dyane Paris lors d’un événement privé' },
    { src: '/editorial/experiences/EVENT%204.png', alt: 'Performance artistique lors d’une expérience Dyane' },
    { src: '/editorial/experiences/BAR%204.png', alt: 'Cocktail floral imaginé par Dyane Paris' },
    { src: '/editorial/experiences/BAR%206.png', alt: 'Cocktail Dyane présenté sur un plateau' },
    { src: '/editorial/experiences/BAR%205.png', alt: 'Attention personnalisée de la Maison Dyane' },
    { src: '/editorial/experiences/EVENT%202%20.png', alt: 'Service de cocktails lors d’un événement Dyane' },
    { src: '/editorial/experiences/BAR%203.png', alt: 'Geste de service d’un cocktail Dyane' },
    { src: '/editorial/experiences/EVENT%205.png', alt: 'Œuvre Dyane installée dans un bar de collection' },
  ],
}

export default function ExperiencesClient() {
  const t = useTranslations('experiences')
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'
  const articlePath = (slug: string) => localizedPath(locale, `/le-journal/${slug}`)

  return (
    <DyaneEditorialPage
      eyebrow={t('kicker')}
      title={t('titre')}
      compactTitle
      video={{
        src: media.heroVideo,
        poster: media.heroPoster,
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
      gallery3={galleries.gallery3}
      gallery2={galleries.gallery2}
      gallery6={galleries.gallery6}
      gallery8={galleries.gallery8}
    />
  )
}
