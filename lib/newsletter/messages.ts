export function newsletterSuccess(locale: 'fr' | 'en', preview: boolean) {
  if (preview) return locale === 'en'
    ? 'Test subscription saved locally. No email will be sent from this preview.'
    : 'Inscription de test enregistrée localement. Aucun e-mail ne sera envoyé depuis cet aperçu.'
  return locale === 'en' ? 'Thank you. Your subscription is confirmed.' : 'Merci. Votre inscription est confirmée.'
}

export function newsletterError(locale: 'fr' | 'en', code?: string) {
  if (code === 'unavailable') return locale === 'en'
    ? 'Newsletter registration is temporarily unavailable. Please try again later.'
    : 'L’inscription à la newsletter est momentanément indisponible. Veuillez réessayer plus tard.'
  if (code === 'rate_limited') return locale === 'en'
    ? 'Too many attempts. Please try again in one hour.'
    : 'Trop de tentatives. Veuillez réessayer dans une heure.'
  return locale === 'en'
    ? 'Your subscription could not be confirmed. Please check your email address and try again.'
    : 'Votre inscription n’a pas pu être confirmée. Vérifiez votre adresse e-mail puis réessayez.'
}
