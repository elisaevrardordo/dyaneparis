import styles from '../Legal.module.css'

const sections = [
    {
        num: '1.',
        titre: 'Identité du responsable du traitement',
        contenu: `La société Dyane Paris, dont le siège social est situé 14 Rue du Dobropol, 75017 Paris, France, agit en qualité de responsable du traitement au sens du Règlement (UE) 2016/679 (RGPD).\n\nContact : contact@dyaneparis.com`,
    },
    {
        num: '2.',
        titre: 'Champ d\'application',
        contenu: `La présente Politique décrit la manière dont Dyane Paris collecte, utilise, conserve et protège les données personnelles des clients particuliers (B2C) effectuant une commande via le site de la marque.\n\nElle s'applique lorsque vous :\n- Passez une commande\n- Créez un compte client\n- Naviguez sur le site\n- Vous inscrivez à la newsletter\n- Contactez notre service client`,
    },
    {
        num: '3.',
        titre: 'Données personnelles collectées',
        contenu: `Nous pouvons collecter les catégories suivantes :\n\nA. Données d'identification\n- Nom et prénom\n- Adresse postale (facturation / livraison)\n- Adresse e-mail\n- Numéro de téléphone\n\nB. Données liées aux commandes\n- Produits commandés\n- Historique d'achat\n- Montant des transactions\n- Détails de livraison\n- Correspondances avec le service client\n\nC. Données de paiement\nLes paiements sont traités de manière sécurisée via les prestataires agréés. Dyane Paris ne conserve jamais les numéros complets de carte bancaire.\n\nD. Données de navigation\n- Adresse IP\n- Type d'appareil\n- Navigateur\n- Cookies\n- Données d'usage et comportement d'achat`,
    },
]

export default function PrivacyDocument() {
    return (
        <article className={styles.document}>
            <div>

                <div className={styles.documentTitle}>
                    <h1>Politique de confidentialité</h1>
                    <p>Dernière mise à jour : 23 février 2026</p>
                </div>

                <div className={styles.intro}>
                    {sections.map((section) => (
                        <section key={section.num} className={styles.section}>
                            <div className={styles.sectionHeading}>
                                <span className={styles.number}>{section.num}</span>
                                <h2>{section.titre}</h2>
                            </div>
                            {section.contenu.split('\n\n').map((para, i) => (
                                <p key={i}>
                                    {para.split('\n').map((line, j) => (
                                        <span key={j}>{line}{j < para.split('\n').length - 1 && <br />}</span>
                                    ))}
                                </p>
                            ))}
                        </section>
                    ))}
                </div>

            </div>
        </article>
    )
}
