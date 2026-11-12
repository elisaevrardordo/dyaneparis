import styles from '../Legal.module.css'

export default function NoticeDocument() {
    return (
        <article className={styles.document}>
            <div>

                <div className={styles.documentTitle}>
                    <h1>Mentions légales</h1>
                    <p>Dernière modification : 23 février 2026</p>
                </div>

                <div className={styles.intro}>
                    <p>
                        Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), il est précisé aux utilisateurs du site{' '}
                        <a href="https://www.dyaneparis.com">www.dyaneparis.com</a>{' '}
                        l'identité des différents intervenants.
                    </p>
                </div>

                {[
                    {
                        num: '1.',
                        titre: 'Éditeur du site',
                        contenu: (
                            <>
                                <p>
                                    Dyane Paris<br />
                                    SASU au capital social de 5 000 €<br />
                                    Immatriculée au RCS de Paris<br />
                                    SIREN : 943 829 002<br />
                                    SIRET : 943 829 002 00014<br />
                                    TVA intracommunautaire : FR79 943 829 002
                                </p>
                                <p>
                                    Siège social :<br />
                                    14 rue du Dobropol<br />
                                    75017 Paris - France
                                </p>
                                <p>
                                    Téléphone : +33 7 68 32 87 14<br />
                                    E-mail : <a href="mailto:contact@dyaneparis.com">contact@dyaneparis.com</a>
                                </p>
                                <p>
                                    <strong>Directrice de la publication :</strong><br />
                                    Elisa Evrard Ordonez
                                </p>
                            </>
                        ),
                    },
                    {
                        num: '2.',
                        titre: 'Hébergement',
                        contenu: (
                            <p>
                                Le site est hébergé par :<br /><br />
                                Vercel Inc.<br />
                                440 N Barranca Ave #4133<br />
                                Covina, CA 91723, États-Unis<br />
                                Site : <a href="https://www.vercel.com">www.vercel.com</a>
                            </p>
                        ),
                    },
                    {
                        num: '3.',
                        titre: 'Propriété intellectuelle',
                        contenu: (
                            <>
                                <p>
                                    L'ensemble du site (textes, images, illustrations, vidéos, modèles de bouteilles, créations artistiques, logos, marques, éléments graphiques, architecture du site) constitue une œuvre protégée par le Code de la propriété intellectuelle.
                                </p>
                                <p>
                                    Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable est strictement interdite.
                                </p>
                                <p>
                                    Les marques et modèles déposés bénéficient d'une protection légale.
                                </p>
                            </>
                        ),
                    },
                    {
                        num: '4.',
                        titre: "Conditions d'utilisation",
                        contenu: (
                            <>
                                <p>
                                    L'accès au site implique l'acceptation des présentes mentions légales ainsi que des Conditions Générales de Vente.
                                </p>
                                <p>
                                    Le site est réservé aux personnes ayant atteint l'âge légal de consommation d'alcool dans leur pays de résidence (18 ans en France).
                                </p>
                                {['Fournir des informations exactes', 'Ne pas utiliser le site à des fins frauduleuses', 'Ne pas porter atteinte aux droits de Dyane Paris'].map((item, i) => (
                                    <p key={i}>- {item}</p>
                                ))}
                            </>
                        ),
                    },
                    {
                        num: '5.',
                        titre: 'Responsabilité',
                        contenu: (
                            <>
                                <p>
                                    Dyane Paris met tout en œuvre pour assurer l'exactitude des informations publiées.
                                </p>
                                {['Le site peut contenir des erreurs ou interruptions temporaires', 'Dyane Paris ne saurait être tenue responsable des dommages indirects', 'Les liens vers des sites tiers n\'engagent pas sa responsabilité'].map((item, i) => (
                                    <p key={i}>- {item}</p>
                                ))}
                            </>
                        ),
                    },
                    {
                        num: '6.',
                        titre: 'Données personnelles',
                        contenu: (
                            <p>
                                Les données personnelles sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).<br /><br />
                                Pour exercer vos droits : <a href="mailto:contact@dyaneparis.com">contact@dyaneparis.com</a>
                            </p>
                        ),
                    },
                    {
                        num: '7.',
                        titre: 'Accès au site',
                        contenu: (
                            <p>
                                Dyane Paris se réserve le droit de modifier, suspendre ou interrompre tout ou partie du site sans préavis.
                            </p>
                        ),
                    },
                    {
                        num: '8.',
                        titre: 'Droit applicable',
                        contenu: (
                            <p>
                                Les présentes mentions légales sont soumises au droit français.<br /><br />
                                En cas de litige, les règles de compétence prévues par le Code de la consommation s'appliquent.
                            </p>
                        ),
                    },
                    {
                        num: '9.',
                        titre: "Mention relative à l'alcool",
                        contenu: (
                            <p>
                                La vente d'alcool est interdite aux mineurs de moins de 18 ans.<br /><br />
                                L'abus d'alcool est dangereux pour la santé, à consommer avec modération.
                            </p>
                        ),
                    },
                ].map((section) => (
                    <section key={section.num} className={styles.section}>
                        <div className={styles.sectionHeading}>
                            <span className={styles.number}>{section.num}</span>
                            <h2>{section.titre}</h2>
                        </div>
                        {section.contenu}
                    </section>
                ))}

            </div>
        </article>
    )
}
