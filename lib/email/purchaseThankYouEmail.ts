import {
    contactEmail, dyaneEmailHtml, escapeEmailHtml, instagramHtml, instagramUrl,
    linkStyle, porcelainHero, textStyle, titleStyle,
} from './dyaneEmail'

type PurchaseThankYouDetails = {
    locale?: 'fr' | 'en'
    firstName?: string
    orderNumber: string
    items: readonly { name: string; quantity: number }[]
    paidTotal: string
    dispatchMessage?: string
    paymentMessage?: string
}

export function purchaseThankYouEmail({ locale = 'fr', firstName, orderNumber, items, paidTotal, dispatchMessage, paymentMessage }: PurchaseThankYouDetails) {
    const en = locale === 'en'
    const subject = en ? 'Thank you for your order - Dyane Paris' : 'Merci pour votre commande — Dyane Paris'
    const preheader = en ? `Your order no. ${orderNumber} is confirmed.` : `Votre commande n° ${orderNumber} est confirmée.`
    const title = en ? 'Thank you for choosing Dyane Paris' : 'Merci d’avoir choisi Dyane Paris'
    const name = firstName?.trim()
    const greeting = `${en ? 'Hello' : 'Bonjour'}${name ? ` ${name}` : ''},`
    const message = en
        ? 'Your order is confirmed. Thank you for choosing a creation from the House. We hope it finds a place at your table and then in your home.'
        : 'Votre commande est confirmée. Nous vous remercions d’avoir choisi une création de la Maison. Nous espérons qu’elle trouvera sa place à votre table, puis dans votre intérieur.'
    const summaryTitle = en ? `Your order no. ${orderNumber}` : `Votre commande n° ${orderNumber}`
    const articles = items.map(item => `${item.quantity} × ${item.name}`)
    const totalLabel = en ? 'Total paid' : 'Total réglé'
    const orderNotes = [dispatchMessage, paymentMessage].filter((note): note is string => Boolean(note))
    const contact = en
        ? 'For questions about your order or how to serve your cocktail, please write to'
        : 'Pour toute question sur votre commande ou sur le service de votre cocktail, écrivez-nous à'
    const farewell = en ? 'See you soon,' : 'À bientôt,'
    const signature = en ? 'The House of Dyane Paris' : 'La Maison Dyane Paris'
    const moderation = en ? 'Alcohol abuse is dangerous to your health. Drink responsibly.' : 'L’abus d’alcool est dangereux pour la santé. À consommer avec modération.'
    const heroAlt = en ? 'Detail of a Dyane porcelain sculpture' : 'Détail d’une sculpture Dyane en porcelaine'

    return {
        subject,
        text: [
            title, greeting, message,
            [summaryTitle, ...articles, `${totalLabel} · ${paidTotal}`, ...orderNotes].join('\n'),
            `${contact} ${contactEmail}.`, `${farewell}\n${signature}`,
            `Instagram\n${instagramUrl}`, moderation,
        ].join('\n\n'),
        html: dyaneEmailHtml({
            locale, subject, preheader,
            rows: `${porcelainHero(heroAlt)}
                <tr><td class="gutter section" align="center" style="padding:42px 48px 0;">
                    <h1 class="title" style="${titleStyle}font-size:35px;line-height:1.15;">${title}</h1>
                    <p style="${textStyle}padding-top:26px;">${escapeEmailHtml(greeting)}</p>
                    <p style="${textStyle}padding-top:19px;">${message}</p>
                </td></tr>
                <tr><td class="gutter section" align="center" style="padding:48px 48px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:410px;border-top:1px solid #dedad5;border-bottom:1px solid #dedad5;">
                        <tr><td align="center" style="padding:24px 12px;">
                            <h2 class="title" style="${titleStyle}font-size:29px;line-height:1.15;">${escapeEmailHtml(summaryTitle)}</h2>
                            ${articles.map((article, index) => `<p style="${textStyle}padding-top:${index === 0 ? 15 : 6}px;">${escapeEmailHtml(article)}</p>`).join('\n                            ')}
                            <p style="${textStyle}padding-top:13px;"><strong style="font-weight:500;">${totalLabel}</strong> · ${escapeEmailHtml(paidTotal)}</p>${orderNotes.map(note => `
                            <p style="${textStyle}padding-top:6px;">${escapeEmailHtml(note)}</p>`).join('')}
                        </td></tr>
                    </table>
                </td></tr>
                <tr><td class="gutter section" align="center" style="padding:48px 48px 0;">
                    <p style="${textStyle}">${contact} <a href="mailto:${contactEmail}" style="${linkStyle}white-space:nowrap;">${contactEmail}</a>.</p>
                    <p style="${textStyle}padding-top:22px;">${farewell}<br><strong style="font-weight:500;">${signature}</strong></p>
                </td></tr>
                <tr><td class="gutter" align="center" style="padding:44px 48px 36px;">
                    ${instagramHtml}
                    <p style="${textStyle}font-size:11px;">${moderation}</p>
                </td></tr>`,
        }),
    }
}
