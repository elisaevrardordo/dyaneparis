export const siteOrigin = 'https://www.dyaneparis.com'
export const emailMedia = '/images/newsletter'
export const contactEmail = 'contact@dyaneparis.com'
export const instagramUrl = 'https://www.instagram.com/dyaneparis_/'

const logo = '/images/brand/dyane-paris-newsletter.png'
const serif = "'Cormorant Garamond',Georgia,'Times New Roman',serif"
export const sans = 'Jost,Arial,Helvetica,sans-serif'
export const titleStyle = `margin:0;color:#111;font-family:${serif};font-weight:400;`
export const textStyle = `margin:0;color:#111;font-family:${sans};font-size:15px;font-weight:300;line-height:1.62;`
export const linkStyle = 'color:#111;text-decoration:underline;'

export const instagramHtml = `<p style="${textStyle}padding-bottom:18px;">
    <a href="${instagramUrl}" style="color:#111;text-decoration:none;font-weight:500;font-size:12px;">
        <img src="${siteOrigin}${emailMedia}/instagram.png" width="20" height="20" alt="Instagram" style="border:0;vertical-align:middle;margin-right:5px;">
        @dyaneparis_
    </a>
</p>`

export function escapeEmailHtml(value: string) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function porcelainHero(alt: string) {
    return `<tr><td class="gutter" align="center" style="padding:0 48px;">
                    <img src="${siteOrigin}${emailMedia}/dyane-no1-detail-porcelaine.jpg" width="544" alt="${alt}" style="display:block;width:100%;max-width:544px;height:auto;border:0;">
                </td></tr>
`
}

export function dyaneEmailHtml({ locale, subject, preheader, rows }: {
    locale: 'fr' | 'en'
    subject: string
    preheader: string
    rows: string
}) {
    return `<!doctype html>
<html lang="${locale}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeEmailHtml(subject)}</title>
    <!--[if !mso]><!-->
    <style>
        @font-face {
            font-family: 'Cormorant Garamond';
            src: url('${siteOrigin}${emailMedia}/fonts/cormorant-garamond-regular.woff2') format('woff2');
            font-style: normal;
            font-weight: 400;
            font-display: swap;
        }
        @font-face {
            font-family: Jost;
            src: url('${siteOrigin}${emailMedia}/fonts/jost-light.woff2') format('woff2');
            font-style: normal;
            font-weight: 300;
            font-display: swap;
        }
        @font-face {
            font-family: Jost;
            src: url('${siteOrigin}${emailMedia}/fonts/jost-medium.woff2') format('woff2');
            font-style: normal;
            font-weight: 500;
            font-display: swap;
        }
    </style>
    <!--<![endif]-->
    <style>
        @media (max-width: 480px) {
            .gutter { padding-left: 18px !important; padding-right: 18px !important; }
            .section { padding-top: 46px !important; }
            .title { font-size: 28px !important; }
            .card-label { font-size: 12px !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#fff;color:#111;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeEmailHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
        <tr><td align="center">
            <!--[if mso]><table role="presentation" width="640" align="center"><tr><td><![endif]-->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;">
                <tr><td class="gutter" align="center" style="padding:46px 48px 40px;">
                    <img src="${siteOrigin}${logo}" width="248" alt="Dyane Paris" style="display:block;width:100%;max-width:248px;height:auto;border:0;color:#111;font-family:Georgia,serif;font-size:24px;">
                </td></tr>
${rows}
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
        </td></tr>
    </table>
</body>
</html>`
}
