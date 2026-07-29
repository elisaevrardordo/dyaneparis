export function localizedPath(locale: string, path = '') {
    const prefix = locale === 'en' ? '/en' : ''
    return `${prefix}${path}` || '/'
}
