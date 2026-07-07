import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo.cgv' })
    const path = locale === 'fr' ? '/cgv' : `/${locale}/cgv`
    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://www.dyaneparis.com${path}`,
            languages: {
                fr: 'https://www.dyaneparis.com/cgv',
                en: 'https://www.dyaneparis.com/en/cgv',
                'x-default': 'https://www.dyaneparis.com/cgv',
            },
        },
    }
}

const font = { fontFamily: 'var(--font-playfair), serif' }

const sections = [
    {
        num: '1.',
        titre: 'Objet',
        contenu: `Les présentes Conditions Générales de Vente (CGV) définissent les droits et obligations de la société Dyane Paris (ci-après « le Vendeur ») et de toute personne physique agissant en qualité de consommateur (ci-après « le Client »).\n\nToute commande implique l'acceptation pleine et entière des présentes CGV.\n\nLes produits proposés (cocktails avec ou sans alcool, bouteilles en porcelaine et accessoires) sont conformes à la législation française en vigueur.`,
    },
    {
        num: '2.',
        titre: 'Commandes',
        contenu: `Toute commande est ferme et définitive après confirmation par e-mail et validation du paiement.\n\nLe Vendeur se réserve le droit de refuser une commande pour motif légitime, notamment :\n— Défaut de paiement\n— Suspicion de fraude\n— Quantités anormalement élevées\n— Non-respect de l'âge légal pour l'achat d'alcool`,
    },
    {
        num: '2 bis.',
        titre: 'Informations produits et allergènes',
        contenu: `Les cocktails Dyane Paris sont des denrées alimentaires susceptibles de contenir des allergènes ou ingrédients spécifiques (épices, fruits, extraits naturels, alcool vinique, etc.).\n\nLa liste des ingrédients et éventuels allergènes est disponible sur la fiche produit ou peut être communiquée sur simple demande.\n\nIl appartient au Client de vérifier la composition du produit avant toute consommation.\n\nDyane Paris ne saurait être tenue responsable en cas de réaction allergique liée à un ingrédient mentionné dans la composition.`,
    },
    {
        num: '3.',
        titre: 'Prix et revente',
        contenu: `Les prix sont indiqués en euros (€), toutes taxes comprises (TTC), hors frais de livraison.\n\nLe prix applicable est celui affiché au moment de la commande.\n\nLes produits commercialisés sur le site sont destinés à un usage personnel et domestique.\n\nToute revente, distribution commerciale, utilisation à des fins professionnelles ou événementielles sans accord écrit préalable de Dyane Paris est strictement interdite.`,
    },
    {
        num: '4.',
        titre: 'Paiement',
        contenu: `Le paiement est exigible immédiatement lors de la commande.\n\nLes paiements sont sécurisés via les prestataires proposés sur le site.\n\nEn cas de rejet du paiement, la commande est automatiquement annulée.`,
    },
    {
        num: '5.',
        titre: 'Livraison',
        contenu: `Les commandes sont préparées sous 5 à 10 jours ouvrés, sauf indication spécifique en cas de précommande.\n\nLes délais de livraison sont indicatifs.\n\nConformément à l'article L216-4 du Code de la consommation, le transfert des risques intervient au moment où le Client prend physiquement possession du produit.\n\nLe Client doit vérifier l'état du colis à réception et signaler toute anomalie immédiatement.\n\nIl appartient au Client résidant hors de France de vérifier que l'importation de boissons alcoolisées est autorisée par la législation du pays de destination.`,
    },
    {
        num: '6.',
        titre: 'Droit de rétractation',
        contenu: `Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose d'un délai de 14 jours pour exercer son droit de rétractation.\n\nExceptions légales (Article L221-28) : le droit de rétractation ne s'applique pas aux :\n— Produits alimentaires périssables (cocktails avec ou sans alcool)\n— Produits descellés\n— Produits personnalisés ou réalisés sur mesure\n\nLes accessoires non périssables peuvent être retournés s'ils sont non ouverts, dans leur emballage d'origine et en parfait état.\n\nLes frais de retour restent à la charge du Client sauf erreur imputable au Vendeur.`,
    },
    {
        num: '7.',
        titre: 'Réclamations',
        contenu: `Toute réclamation doit être adressée à : contact@dyaneparis.com\n\nDans un délai de 48 heures après réception, accompagnée de photos si nécessaire.\n\nAprès vérification, le Vendeur pourra proposer un remplacement ou un remboursement.`,
    },
    {
        num: '8.',
        titre: 'Protection des mineurs – Vente d\'alcool',
        contenu: `Conformément à l'article L3342-1 du Code de la santé publique, la vente d'alcool est interdite aux mineurs.\n\nEn validant sa commande, le Client déclare avoir au moins 18 ans.\n\nLe Vendeur se réserve le droit d'annuler toute commande en cas de doute sur l'âge du Client.`,
    },
    {
        num: '9.',
        titre: 'Garanties légales',
        contenu: `Les produits bénéficient :\n\nGarantie légale de conformité (Articles L217-3 à L217-20 du Code de la consommation) : le Client dispose d'un délai de 2 ans à compter de la délivrance du bien pour agir.\n\nGarantie contre les vices cachés (Article 1641 du Code civil) : le Client peut agir dans un délai de 2 ans à compter de la découverte du vice.\n\nEn cas de défaut, le Client peut demander la réparation, le remplacement ou le remboursement conformément aux dispositions légales.`,
    },
    {
        num: '10.',
        titre: 'Responsabilité',
        contenu: `Le Vendeur ne saurait être tenu responsable :\n— D'une mauvaise conservation du produit après livraison\n— D'un usage non conforme\n— D'allergies ou intolérances non signalées\n\nLa responsabilité du Vendeur est limitée aux dommages directs et prévisibles et ne pourra en aucun cas excéder le montant effectivement payé par le Client pour la commande concernée.\n\nCette limitation ne s'applique pas en cas de faute lourde, faute intentionnelle ou en cas d'atteinte à l'intégrité physique.`,
    },
    {
        num: '11.',
        titre: 'Réserve de propriété',
        contenu: `Les produits demeurent la propriété du Vendeur jusqu'au paiement intégral du prix.`,
    },
    {
        num: '12.',
        titre: 'Propriété intellectuelle',
        contenu: `Tous les éléments relatifs à Dyane Paris (textes, images, designs, concepts, bouteilles, créations artistiques) sont protégés par le droit de la propriété intellectuelle.\n\nToute reproduction ou exploitation sans autorisation est interdite.`,
    },
    {
        num: '13.',
        titre: 'Données personnelles',
        contenu: `Les données sont traitées conformément à la Politique de confidentialité disponible sur le site.\n\nLe Client dispose d'un droit d'accès, de rectification et de suppression conformément au RGPD.`,
    },
    {
        num: '14.',
        titre: 'Force majeure',
        contenu: `Le Vendeur ne pourra être tenu responsable d'un manquement lié à un cas de force majeure au sens de l'article 1218 du Code civil.`,
    },
    {
        num: '15.',
        titre: 'Médiation et litiges',
        contenu: `Les présentes CGV sont soumises au droit français.\n\nEn cas de litige, le Client peut saisir :\n— Le tribunal compétent de son domicile\n— Ou le tribunal du siège social du Vendeur\n\nConformément à l'article L612-1 du Code de la consommation, le Client peut recourir gratuitement à un médiateur de la consommation.`,
    },
]

export default function CGVPage() {
    return (
        <main style={{ background: '#FAF8F5' }}>
            <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px 120px' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>DYANE PARIS</p>
                    <h1 style={{ ...font, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, marginBottom: '16px' }}>Conditions Générales de Vente</h1>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.5 }}>Dernière mise à jour : 23 février 2026</p>
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
