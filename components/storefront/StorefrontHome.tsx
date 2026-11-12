import Link from 'next/link'
import CollectionChapters from '@/components/collection/CollectionChapters'
import EditorialImage from '@/components/editorial/EditorialImage'
import EditorialEmblem from '@/components/editorial/EditorialEmblem'
import { sculpturePages, storefront } from '@/content/storefront'
import { localizedPath } from '@/i18n/paths'
import LuxuryProductCard from './LuxuryProductCard'
import CampaignVideo from './CampaignVideo'
import { CraftVideoSlide } from '@/components/home/VerticalCampaignSequence'
import CampaignCaption from '@/components/home/CampaignCaption'
import { cartFontVariables as editorialFonts } from '@/components/cart/fonts'
import s from './Storefront.module.css'

export default function StorefrontHome({ locale }: { locale: 'fr' | 'en' }) {
  const en = locale === 'en'
  const universe = storefront.universe[locale]
  const sections = {
    hero: (
      <section className={s.hero} data-page-hero data-scroll-section data-header-foreground={storefront.hero.foreground} aria-label={en ? 'The world of Dyane Paris' : 'L’univers Dyane Paris'}>
        <h1 className={s.srOnly}>{en ? 'Dyane Paris - House of Liquid Art' : 'Dyane Paris - Maison d’Art Liquide'}</h1>
        {storefront.hero.images.map(photo => (
          <Link className={s.heroTile} href={localizedPath(locale, photo.href)} key={photo.href}>
            <EditorialImage src={photo.src} alt="" fill priority fetchPriority="high" sizes="(max-width: 768px) 100vw, 50vw" style={{ objectPosition: photo.position }} />
            <span className={s.heroCaption}>
              <span className={s.heroTitle}>{en ? photo.titleEn : photo.title}</span>
              <span className={s.heroSubtitle}>{en ? photo.subtitleEn : photo.subtitle}</span>
            </span>
          </Link>
        ))}
      </section>
    ),
    chapters: (
      <div data-scroll-section data-header-foreground="black">
        <CollectionChapters locale={locale} ids={['no1', 'no2']} naturalScroll />
      </div>
    ),
    products: (
      <section className={s.grid} data-scroll-section data-header-foreground="black" aria-label={en ? 'Works from the House' : 'Les œuvres de la Maison'}>
        {sculpturePages.map(work => <LuxuryProductCard work={work} locale={locale} key={work.id} />)}
      </section>
    ),
    universe: (
      <section className={s.universe} data-scroll-section data-header-foreground="white" aria-labelledby="home-universe-title">
        <EditorialImage
          className={s.universeImage}
          src={storefront.universe.src}
          alt={universe.alt}
          fill
          sizes="100vw"
        />
        <div className={s.heroCaption}>
          <h2 className={s.heroTitle} id="home-universe-title">{universe.title}</h2>
          <p className={`${s.heroSubtitle} ${s.universeDescription}`}>{universe.description}</p>
          <Link className={`${s.heroSubtitle} ${s.universeLink}`} href={localizedPath(locale, storefront.universe.href)}>{universe.cta}</Link>
        </div>
      </section>
    ),
    story: <section className={s.story} data-scroll-section data-header-foreground="black" aria-labelledby="maison-story"><EditorialEmblem /><h2 id="maison-story">{en ? 'ART, NOW DRINKABLE.' : 'L’ART SE BOIT.'}</h2><p>{en ? 'DYANE PARIS IS A HOUSE OF LIQUID ART BORN IN PARIS IN 2025. IT BRINGS TOGETHER AUTHOR MIXOLOGY, SCULPTURE AND ARTISTIC CRAFTS. EACH COMPOSITION FINDS ITS PLACE IN A HAND-PAINTED PORCELAIN SCULPTURE, IMAGINED TO REMAIN A COLLECTIBLE OBJECT AFTER THE TASTING.' : 'DYANE PARIS EST UNE MAISON D’ART LIQUIDE NÉE À PARIS EN 2025. ELLE RÉUNIT LA MIXOLOGIE D’AUTEUR, LA SCULPTURE ET LES MÉTIERS D’ART. CHAQUE COMPOSITION PREND PLACE DANS UNE SCULPTURE EN PORCELAINE PEINTE À LA MAIN, IMAGINÉE POUR DEMEURER COMME OBJET À COLLECTIONNER APRÈS LA DÉGUSTATION.'}</p></section>,
    triptych: <section className={s.triptych} data-scroll-section data-header-foreground="black" aria-label={en ? 'Gesture, material and form' : 'Le geste, la matière et la forme'}><CampaignVideo {...storefront.triptych.video} locale={locale} label={en ? 'Serving a Dyane composition' : 'Le service d’une composition Dyane'} />{storefront.triptych.images.map(photo => <figure key={photo.src}><EditorialImage src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) 100vw, 33vw" style={{ objectPosition: photo.position }} /></figure>)}</section>,
    craft: <CraftVideoSlide locale={locale} />,
    film: (
      <div data-scroll-section data-header-foreground="black">
        <CampaignVideo {...storefront.film} locale={locale} label={en ? 'The Dyane Paris campaign film' : 'Le film de campagne Dyane Paris'} className={s.finalFilm}>
          <CampaignCaption
            cinematic
            titleElement="h2"
            lines={[en ? 'THE ART OF ENTERTAINING, REIMAGINED' : 'L’ART DE RECEVOIR AUTREMENT']}
            cta={en ? 'DISCOVER' : 'DÉCOUVRIR'}
            href={localizedPath(locale, '/experiences')}
          />
        </CampaignVideo>
      </div>
    ),
  }
  return <main className={`${s.home} ${editorialFonts}`} data-section-scroll data-storefront>{storefront.sections.map(section => <div key={section} data-storefront-section={section}>{sections[section]}</div>)}</main>
}
