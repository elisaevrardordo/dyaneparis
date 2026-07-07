import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.cookies' })
    const path = locale === 'fr' ? '/cookies' : `/${locale}/cookies`
    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/cookies',
                en: 'https://www.dyaneparis.com/en/cookies',
                'x-default': 'https://www.dyaneparis.com/cookies',
            },
        },
    }
}

const font = { fontFamily: 'var(--font-playfair), serif' }

const sections = [
    {
        num: '1.',
        titre: 'Qu\'est-ce qu\'un cookie ?',
        contenu: `Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, téléphone) lors de votre visite sur notre site. Il permet de reconnaître votre navigateur et de mémoriser certaines informations relatives à votre navigation.\n\nLes cookies ne contiennent pas d'informations personnelles permettant de vous identifier directement. Ils sont utilisés pour améliorer votre expérience de navigation et nous permettre de mieux comprendre comment notre site est utilisé.`,
    },
    {
        num: '2.',
        titre: 'Les cookies que nous utilisons',
        contenu: `A. Cookies strictement nécessaires\nCes cookies sont indispensables au fonctionnement du site. Sans eux, certaines fonctionnalités essentielles ne seraient pas disponibles.\n— Maintien de votre session\n— Mémorisation de votre panier\n— Sécurité de votre connexion\n\nB. Cookies de performance et d'analyse\nCes cookies nous permettent de comprendre comment les visiteurs utilisent notre site afin d'améliorer son fonctionnement.\n— Pages les plus visitées\n— Temps passé sur le site\n— Erreurs rencontrées\n\nC. Cookies de personnalisation\nCes cookies permettent de mémoriser vos préférences pour personnaliser votre expérience.\n— Langue sélectionnée\n— Préférences d'affichage\n\nD. Cookies marketing\nCes cookies peuvent être déposés par nos partenaires pour vous présenter des publicités adaptées à vos centres d'intérêt.\n— Réseaux sociaux (Instagram, Facebook)\n— Suivi des campagnes publicitaires`,
    },
    {
        num: '3.',
        titre: 'Durée de conservation',
        contenu: `Les cookies ont une durée de vie limitée :\n— Cookies de session : supprimés à la fermeture de votre navigateur\n— Cookies persistants : conservés entre 1 mois et 13 mois selon leur finalité\n\nPassé ce délai, les cookies sont automatiquement supprimés de votre appareil.`,
    },
    {
        num: '4.',
        titre: 'Gestion de vos préférences',
        contenu: `Vous pouvez à tout moment gérer vos préférences en matière de cookies :\n\nVia votre navigateur : la plupart des navigateurs vous permettent de refuser ou supprimer les cookies dans leurs paramètres.\n— Google Chrome : Paramètres > Confidentialité et sécurité > Cookies\n— Safari : Préférences > Confidentialité\n— Firefox : Paramètres > Vie privée et sécurité\n\nVia notre bandeau cookies : lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies non essentiels.\n\nAttention : le refus de certains cookies peut affecter le bon fonctionnement du site.`,
    },
    {
        num: '5.',
        titre: 'Collecte et utilisation de vos données',
        contenu: `Dans le cadre de votre navigation et de vos commandes, Dyane Paris collecte uniquement les données nécessaires aux finalités suivantes :\n\n— Traitement et suivi de vos commandes\n— Communication relative à votre commande\n— Amélioration de notre site et de nos services\n— Envoi de notre newsletter (avec votre consentement)\n— Respect de nos obligations légales\n\nNous ne vendons jamais vos données personnelles à des tiers.\n\nVos données sont conservées pour la durée strictement nécessaire à chaque finalité, dans le respect du RGPD.`,
    },
    {
        num: '6.',
        titre: 'Partage des données',
        contenu: `Vos données peuvent être transmises à des prestataires techniques dans le cadre de l'exécution de nos services :\n— Prestataires de paiement sécurisé\n— Services de livraison\n— Hébergeur du site (Vercel)\n— Outils d'analyse (anonymisés)\n\nCes prestataires agissent en qualité de sous-traitants et sont contractuellement tenus de respecter la confidentialité de vos données.`,
    },
    {
        num: '7.',
        titre: 'Vos droits',
        contenu: `Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :\n— Droit d'accès : obtenir une copie de vos données\n— Droit de rectification : corriger des données inexactes\n— Droit à l'effacement : demander la suppression de vos données\n— Droit à la portabilité : recevoir vos données dans un format structuré\n— Droit d'opposition : vous opposer à certains traitements\n— Droit à la limitation : restreindre l'utilisation de vos données\n\nPour exercer vos droits, contactez-nous : contact@dyaneparis.com\n\nVous pouvez également introduire une réclamation auprès de la CNIL : www.cnil.fr`,
    },
    {
        num: '8.',
        titre: 'Sécurité',
        contenu: `Dyane Paris met en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou divulgation.\n\nLes transmissions de données sensibles (paiement) sont chiffrées via le protocole SSL/TLS.\n\nNos équipes n'ont accès qu'aux données strictement nécessaires à l'exercice de leurs fonctions.`,
    },
    {
        num: '9.',
        titre: 'Modifications',
        contenu: `La présente politique peut être mise à jour à tout moment pour refléter les évolutions légales ou techniques.\n\nNous vous informerons de toute modification substantielle par e-mail ou via une notification sur le site.\n\nNous vous encourageons à consulter régulièrement cette page.\n\nDernière mise à jour : 23 février 2026`,
    },
    {
        num: '10.',
        titre: 'Contact',
        contenu: `Pour toute question relative à notre politique de cookies ou à la protection de vos données :\n\nDyane Paris\n14 rue du Dobropol\n75017 Paris – France\n\nE-mail : contact@dyaneparis.com\nTéléphone : +33 7 68 32 87 14`,
    },
]

export default function CookiesPage() {
    return (
        <main style={{ background: '#FAF8F5' }}>
            <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px 120px' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>DYANE PARIS</p>
                    <h1 style={{ ...font, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, marginBottom: '16px' }}>Cookies & Données personnelles</h1>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.5 }}>Dernière mise à jour : 23 février 2026</p>
                </div>

                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '24px 32px', marginBottom: '48px' }}>
                    <p style={{ ...font, fontSize: '13px', lineHeight: 1.9, opacity: 0.8, textAlign: 'center' }}>
                        En naviguant sur dyaneparis.com, vous acceptez l'utilisation de cookies conformément à la présente politique.<br />
                        Vous pouvez modifier vos préférences à tout moment.
                    </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    {sections.map((section) => (
                        <div key={section.num} style={{ marginTop: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginBottom: '20px' }}>
                                <span style={{ ...font, fontSize: '11px', letterSpacing: '0.2em', opacity: 0.4 }}>{section.num}</span>
                                <h2 style={{ ...font, fontSize: '18px', fontWeight: 500 }}>{section.titre}</h2>
                            </div>
                            {section.contenu.split('\n\n').map((para, i) => (
                                <p key={i} style={{ ...font, fontSize: '14px', lineHeight: 1.9, opacity: 0.75, marginBottom: '12px' }}>
                                    {para.split('\n').map((line, j) => (
                                        <span key={j}>{line}{j < para.split('\n').length - 1 && <br />}</span>
                                    ))}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

            </div>
        </main>
    )
}
