import Link from 'next/link'
import { localizedPath } from '@/i18n/paths'
import styles from './Discovery.module.css'

export default function DiscoveryLinks({ locale, includePress = false }: { locale: string; includePress?: boolean }) {
  const english = locale === 'en'
  const links = [
    ['/galerie', english ? 'Official gallery' : 'Galerie officielle'],
    ['/offrir-un-cocktail-de-luxe', english ? 'The art of giving' : 'L’art d’offrir'],
    ['/cadeaux-noel-cocktails-luxe', english ? 'Christmas gifts' : 'Cadeaux de Noël'],
    ['/cadeaux-entreprise-noel', english ? 'Corporate gifts' : 'Cadeaux d’entreprise'],
  ]
  return (
    <nav className={styles.related} aria-label={english ? 'Explore Dyane Paris' : 'Explorer Dyane Paris'}>
      {includePress ? <Link href={localizedPath(locale, '/contact')}>{english ? 'PRESS AND IMAGE ENQUIRIES - THE CONCIERGE' : 'PRESSE ET DEMANDES D’IMAGES - LA CONCIERGERIE'}</Link> : null}
      {links.map(([href, label]) => <Link href={localizedPath(locale, href)} key={href}>{label}</Link>)}
    </nav>
  )
}
