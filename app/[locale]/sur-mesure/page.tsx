import type { Metadata } from 'next'
import Link from 'next/link'
import EditorialImage from '@/components/editorial/EditorialImage'
import { bespokeMixology } from '@/content/bespokeMixology'
import { localizedPath } from '@/i18n/paths'
import { buildPageMetadata } from '@/lib/seo'
import styles from './SurMesure.module.css'

type Props = { params: Promise<{ locale: string }> }

const frivoleJournal = '/le-journal/journal-de-bord-frivole'

const copy = {
  fr: {
    title: 'Recettes sur mesure',
    introduction: 'Dyane Paris compose des cocktails pour une table, un lieu ou un accord gastronomique.',
    description: 'Découvrez les cocktails sur mesure de Dyane Paris, de L’Écume avec Michel Roth à la recette exclusive de Frivole.',
    journal: 'Lire le journal de bord',
    recipes: [
      {
        title: 'L’Écume',
        collaboration: 'Dyane Paris × Michel Roth',
        context: 'Pensé pour accompagner le caviar lors des World Caviar Awards 2026 à l’Alcazar, à Paris.',
        composition: 'Vodka artisanale, saké Junmai Ginjo, eau de concombre clarifiée, verjus blanc, cordial de citron jaune, solution saline et eau pétillante.',
      },
      {
        title: 'Frivole × Dyane Paris',
        collaboration: 'Avec le mixologue Thibaud Sauvet',
        context: 'Une recette exclusive à 21 % vol., composée pour Frivole.',
        composition: 'Gin artisanal français, sirop de basilic et de yuzu, bitters français et liqueur de sureau. La fraîcheur végétale se prolonge sur une note florale.',
        journal: frivoleJournal,
      },
    ],
  },
  en: {
    title: 'Bespoke recipes',
    introduction: 'Dyane Paris creates cocktails for a table, a venue or a culinary pairing.',
    description: 'Discover the bespoke cocktails of Dyane Paris, from L’Écume with Michel Roth to the exclusive Frivole recipe.',
    journal: 'Read the field notes',
    recipes: [
      {
        title: 'L’Écume',
        collaboration: 'Dyane Paris × Michel Roth',
        context: 'Created to accompany caviar at the 2026 World Caviar Awards at Alcazar in Paris.',
        composition: 'Craft vodka, Junmai Ginjo sake, clarified cucumber water, white verjuice, lemon cordial, saline solution and sparkling water.',
      },
      {
        title: 'Frivole × Dyane Paris',
        collaboration: 'With mixologist Thibaud Sauvet',
        context: 'An exclusive cocktail created for Frivole, at 21% ABV.',
        composition: 'French craft gin, basil and yuzu syrup, French bitters and elderflower liqueur. Fresh herbal notes give way to a floral finish.',
        journal: frivoleJournal,
      },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const language = locale === 'en' ? 'en' : 'fr'
  const text = copy[language]

  return buildPageMetadata({
    locale,
    path: bespokeMixology.path,
    title: text.title,
    description: text.description,
    image: {
      url: bespokeMixology.image,
      alt: bespokeMixology.alt[language],
      caption: text.title,
      description: text.introduction,
    },
  })
}

export default async function SurMesurePage({ params }: Props) {
  const { locale } = await params
  const language = locale === 'en' ? 'en' : 'fr'
  const text = copy[language]

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="sur-mesure-title">
        <div className={styles.intro}>
          <h1 id="sur-mesure-title">{text.title}</h1>
          <p>{text.introduction}</p>
        </div>
        <div className={styles.image}>
          <EditorialImage
            src={bespokeMixology.image}
            alt={bespokeMixology.alt[language]}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 56vw"
            style={{ objectPosition: bespokeMixology.position }}
          />
        </div>
      </section>
      <div className={styles.recipes}>
        {text.recipes.map(recipe => (
          <article className={styles.recipe} key={recipe.title}>
            <p className={styles.collaboration}>{recipe.collaboration}</p>
            <h2>{recipe.title}</h2>
            <p>{recipe.context}</p>
            <p>{recipe.composition}</p>
            {recipe.journal && (
              <Link href={localizedPath(locale, recipe.journal)} className={styles.journalLink}>
                {text.journal}
              </Link>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}
