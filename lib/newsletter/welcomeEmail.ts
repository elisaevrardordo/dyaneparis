import { localizedPath } from '@/i18n/paths'
import {
    contactEmail, dyaneEmailHtml, emailMedia, escapeEmailHtml, instagramHtml, instagramUrl,
    linkStyle, porcelainHero, sans, siteOrigin, textStyle, titleStyle,
} from '@/lib/email/dyaneEmail'

export { siteOrigin as newsletterSiteOrigin } from '@/lib/email/dyaneEmail'

const copy = {
    fr: {
        subject: "Bienvenue dans l'univers Dyane Paris",
        preheader: "L'art de la mixologie, le geste de la sculpture.",
        greeting: 'Bonjour',
        paragraphs: [
            "Chez Dyane Paris, chaque création naît d'une rencontre entre l'art, la mixologie et le savoir-faire. Chaque sculpture raconte une histoire, chaque dégustation devient une expérience.",
            "Nous sommes heureux de vous accueillir dans l'univers de notre Maison d'Art Liquide.",
            'En rejoignant notre cercle, vous découvrirez nos créations, nos collaborations artistiques et les expériences singulières imaginées par la Maison.',
        ],
        maison: 'DÉCOUVRIR LA MAISON',
        heroAlt: 'Gros plan sur le visage en porcelaine de Dyane No.1',
        creations: 'Découvrez les créations de la Maison',
        no1Alt: 'Sculpture Dyane No.1 au drapé rouge, accompagnée d’un Pornstar Martini',
        no2Alt: 'Sculpture Dyane No.2 au drapé vert, accompagnée d’un Basil Smash',
        help: 'La Maison vous accompagne',
        concierge: 'Pour toute demande personnalisée, écrivez à la Conciergerie Dyane Paris.',
        alcohol: 'L’abus d’alcool est dangereux pour la santé. À consommer avec modération.',
        legal: 'Mentions légales',
        unsubscribe: 'Se désinscrire',
    },
    en: {
        subject: 'Welcome to the world of Dyane Paris',
        preheader: 'The art of mixology, the craft of sculpture.',
        greeting: 'Hello',
        paragraphs: [
            'At Dyane Paris, each creation brings together art, mixology and craftsmanship. Every sculpture tells a story and every tasting becomes an experience.',
            'We are delighted to welcome you into the world of our House of Liquid Art.',
            'As part of our circle, you will discover our creations, artistic collaborations and the distinctive experiences conceived by the Maison.',
        ],
        maison: 'DISCOVER THE MAISON',
        heroAlt: 'Close-up of the porcelain face of Dyane No.1',
        creations: 'Discover the creations of the Maison',
        no1Alt: 'Dyane No.1 porcelain sculpture with red drapery beside a Pornstar Martini',
        no2Alt: 'Dyane No.2 porcelain sculpture with green drapery beside a Basil Smash',
        help: 'The Maison is here to help',
        concierge: 'For any bespoke request, please email the Dyane Paris Concierge.',
        alcohol: 'Alcohol abuse is dangerous for your health. Please drink responsibly.',
        legal: 'Legal notice',
        unsubscribe: 'Unsubscribe',
    },
} as const

export function newsletterWelcomeEmail(
    locale: 'fr' | 'en',
    { firstName, unsubscribeUrl }: { firstName?: string; unsubscribeUrl: string },
) {
    const c = copy[locale]
    const name = firstName?.trim()
    const greeting = name ? `${c.greeting} ${name},` : `${c.greeting},`
    const safeGreeting = escapeEmailHtml(greeting)
    const url = (path: string) => siteOrigin + localizedPath(locale, path)
    const maison = url('/la-maison')
    const legal = url('/mentions-legales')
    const cards = [
        { href: url('/oeuvres/dyane-no1-pornstar-martini'), title: 'DYANE NO.1', alt: c.no1Alt, src: 'dyane-no1-pornstar-martini.jpg' },
        { href: url('/oeuvres/dyane-no2-basil-smash'), title: 'DYANE NO.2', alt: c.no2Alt, src: 'dyane-no2-basil-smash.jpg' },
    ]

    return {
        subject: c.subject,
        text: [
            c.subject, greeting, ...c.paragraphs, `${c.maison}\n${maison}`,
            c.creations, ...cards.map(card => `${card.title}\n${card.href}`),
            c.help, c.concierge, contactEmail,
            `Instagram\n${instagramUrl}`, c.alcohol, `${c.legal}\n${legal}`, `${c.unsubscribe}\n${unsubscribeUrl}`,
        ].join('\n\n'),
        html: dyaneEmailHtml({
            locale, subject: c.subject, preheader: c.preheader,
            rows: `${porcelainHero(c.heroAlt)}
                <tr><td class="gutter section" align="center" style="padding:42px 48px 0;">
                    <h1 class="title" style="${titleStyle}font-size:35px;line-height:1.15;">${c.subject}</h1>
                    <p style="${textStyle}padding-top:26px;">${safeGreeting}</p>
                    ${c.paragraphs.map(paragraph => `<p style="${textStyle}padding-top:19px;">${paragraph}</p>`).join('\n                    ')}
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;"><tr><td align="center" style="border:1px solid #111;background:#fff;">
                        <a href="${maison}" style="display:inline-block;padding:14px 27px;color:#111;font:500 13px/18px ${sans};letter-spacing:.07em;text-decoration:none;mso-padding-alt:0;">
                            <!--[if mso]><i style="mso-font-width:200%;mso-text-raise:16pt;" hidden>&emsp;</i><![endif]--><span style="mso-text-raise:8pt;">${c.maison}</span><!--[if mso]><i style="mso-font-width:200%;" hidden>&emsp;&#8203;</i><![endif]-->
                        </a>
                    </td></tr></table>
                </td></tr>
                <tr><td class="gutter section" align="center" style="padding:70px 48px 0;">
                    <h2 class="title" style="${titleStyle}font-size:32px;line-height:1.15;">${c.creations}</h2>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed;margin-top:28px;">
                        <tr>${cards.map((card, index) => `
                            <td width="50%" valign="top" align="center" style="padding-${index === 0 ? 'right' : 'left'}:6px;">
                                <a href="${card.href}" style="${linkStyle}"><img src="${siteOrigin}${emailMedia}/${card.src}" width="266" alt="${card.alt}" style="display:block;width:100%;max-width:266px;height:auto;border:0;"></a>
                                <a class="card-label" href="${card.href}" style="display:inline-block;margin-top:19px;${linkStyle}font:500 14px/1.5 ${sans};letter-spacing:.07em;">${card.title}</a>
                            </td>`).join('')}
                        </tr>
                    </table>
                </td></tr>
                <tr><td class="gutter section" align="center" style="padding:72px 48px 0;">
                    <h2 class="title" style="${titleStyle}font-size:32px;line-height:1.15;">${c.help}</h2>
                    <p style="${textStyle}padding-top:23px;">${c.concierge}</p>
                    <p style="${textStyle}padding-top:18px;"><a href="mailto:${contactEmail}" style="${linkStyle}font-weight:500;">${contactEmail}</a></p>
                </td></tr>
                <tr><td class="gutter" align="center" style="padding:44px 48px 36px;">
                    ${instagramHtml}
                    <p style="${textStyle}font-size:11px;">${c.alcohol}</p>
                    <p style="${textStyle}font-size:11px;padding-top:10px;"><a href="${legal}" style="${linkStyle}">${c.legal}</a> &nbsp;·&nbsp; <a href="${unsubscribeUrl}" style="${linkStyle}">${c.unsubscribe}</a></p>
                </td></tr>`,
        }),
    }
}
