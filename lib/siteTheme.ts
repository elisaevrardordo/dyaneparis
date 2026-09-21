export type SiteTheme = 'house' | 'experience' | 'journal' | 'archive'

const EXPERIENCE_ROUTES = ['/experiences', '/contact']
const JOURNAL_ROUTES = ['/le-journal', '/journal']

function withoutLocale(pathname: string) {
  const localizedPath = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '')
  return localizedPath || '/'
}

export function getSiteTheme(pathname: string): SiteTheme {
  const path = withoutLocale(pathname)
  if (path === '/oeuvres') {
    return 'archive'
  }

  if (JOURNAL_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))) {
    return 'journal'
  }

  return EXPERIENCE_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))
    ? 'experience'
    : 'house'
}
