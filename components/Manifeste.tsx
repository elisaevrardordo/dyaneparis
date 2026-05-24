'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

const lora = { fontFamily: 'Lora, serif' }

export default function Manifeste() {
    const t = useTranslations('manifeste')
    const pathname = usePathname()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    return (
        <section style={{ background: '#fff', padding: '72px 24px', textAlign: 'center' }}>
            <div style={{ maxWidth: '920px', margin: '0 auto' }}>
                <p style={{ ...lora, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.65, margin: '0 0 28px' }}>{t('label')}</p>
                <Link
                    href={`/${locale}/la-maison`}
                    style={{ ...lora, display: 'inline-block', padding: '12px 24px', textDecoration: 'none', color: '#000', border: '1px solid rgba(0,0,0,0.20)', fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase' }}
                >
                    {t('cta')}
                </Link>
            </div>
        </section>
    )
}
