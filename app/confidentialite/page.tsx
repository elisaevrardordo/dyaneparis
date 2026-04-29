const font = { fontFamily: 'Playfair Display, serif' }

const sections = [
    {
        num: '1.',
        titre: 'Identité du responsable du traitement',
        contenu: `La société Dyane Paris, dont le siège social est situé 14 Rue du Dobropol, 75017 Paris, France, agit en qualité de responsable du traitement au sens du Règlement (UE) 2016/679 (RGPD).\n\nContact : contact@dyaneparis.com`,
    },
    {
        num: '2.',
        titre: 'Champ d\'application',
        contenu: `La présente Politique décrit la manière dont Dyane Paris collecte, utilise, conserve et protège les données personnelles des clients particuliers (B2C) effectuant une commande via le site de la marque.\n\nElle s'applique lorsque vous :\n— Passez une commande\n— Créez un compte client\n— Naviguez sur le site\n— Vous inscrivez à la newsletter\n— Contactez notre service client`,
    },
    {
        num: '3.',
        titre: 'Données personnelles collectées',
        contenu: `Nous pouvons collecter les catégories suivantes :\n\nA. Données d'identification\n— Nom et prénom\n— Adresse postale (facturation / livraison)\n— Adresse e-mail\n— Numéro de téléphone\n\nB. Données liées aux commandes\n— Produits commandés\n— Historique d'achat\n— Montant des transactions\n— Détails de livraison\n— Correspondances avec le service client\n\nC. Données de paiement\nLes paiements sont traités de manière sécurisée via les prestataires agréés. Dyane Paris ne conserve jamais les numéros complets de carte bancaire.\n\nD. Données de navigation\n— Adresse IP\n— Type d'appareil\n— Navigateur\n— Cookies\n— Données d'usage et comportement d'achat`,
    },
]

export default function ConfidentialitePage() {
    return (
        <main style={{ background: '#FAF8F5' }}>
            <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px 120px' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ ...font, fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>DYANE PARIS</p>
                    <h1 style={{ ...font, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, marginBottom: '16px' }}>Politique de confidentialité</h1>
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
