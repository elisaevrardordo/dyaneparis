export const heroImages: Record<string, string> = {
    'dyane-paris-pornstar-martini-70-cl': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365386/38_r1fuec.png',
    'dyane-no2-moscow-mule': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365385/39_rzlpeg.png',
    'bouteille-signee-teokaykay': 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443904/img-38_htkd1z.jpg',
}

export const productVideos: Record<string, string> = {
    'dyane-paris-pornstar-martini-70-cl': 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788708147/Sans_titre_Publication_Instagram_4_5_pr3obf.mp4',
    'dyane-no2-moscow-mule': 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788708474/B_Fleur_de_la_Passion._Grande_fleur_solitaire_remarquable_par_sa_couronne_de_filaments_colore%CC%81s._Pe%CC%81tales_clairs_e%CC%81tamines_saillantes_et_pistil_proe%CC%81minent._Fleur_caracte%CC%81ristique_du_genre_Passiflora._zsisam.mp4',
}

export type ProductDetails = {
    nom: string
    sousTitre: string
    description: string
    images: string[]
    plusInfos: string
    livraison: string
    disponibilite: string
    formats?: string[]
}

export const produits: Record<string, ProductDetails> = {
    'dyane-paris-pornstar-martini-70-cl': {
        nom: 'DYANE NO.1 — PORNSTAR MARTINI',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'ALCOOL VINIQUE 96 % ÉLABORÉ EN FRANCE, INFUSÉ AUX GOUSSES DE VANILLE MADAGASCAR BOURBON GOLD. PURÉE DE FRUIT DE LA PASSION, SUBLIMÉE PAR UNE TOUCHE DE FRAMBOISE SAUVAGE. JUS DE CITRON BIOLOGIQUE. EMBOUTEILLÉ EN FRANCE, DANS LA RÉGION D\'AVIGNON.',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365386/38_r1fuec.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687757/63_fimus0.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788442898/Capture_d_e%CC%81cran_2026-09-03_a%CC%80_15.41.35_radfc7.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1785936020/2_ntzgqx.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788706612/B_Fleur_de_la_Passion._Grande_fleur_solitaire_remarquable_par_sa_couronne_de_filaments_colore%CC%81s._Pe%CC%81tales_clairs_e%CC%81tamines_saillantes_et_pistil_proe%CC%81minent._Fleur_caracte%CC%81ristique_du_genre_Passiflo_33_zsbpg0.png',
        ],
        plusInfos: 'VANILLE & PASSION\nSOLAIRE. CHARNELLE. UNE INTERPRÉTATION INTENSE DU FRUIT DE LA PASSION, INFUSÉE DANS UN ALCOOL VINIQUE D\'EXCEPTION ÉLEVÉ EN FÛT DE CHÊNE. L\'ACIDITÉ SE TEND, LA DOUCEUR S\'ÉQUILIBRE. LA VANILLE MADAGASCAR BOURBON GOLD APPORTE UNE RONDEUR SOYEUSE.\nDENSE. LUMINEUSE. UNE ŒUVRE LIQUIDE.\n—\nPROFIL SENSORIEL\nROBE — OR AMBRÉ\nNEZ — PASSION FRAÎCHE, VANILLE CHAUDE\nBOUCHE — PULPEUSE, ÉQUILIBRÉE\nFINALE — LONGUE, SOLAIRE.',
        livraison: 'LIVRAISON ESTIMÉE SOUS DEUX SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'dyane-no2-moscow-mule': {
        nom: 'DYANE NO.2 — MOSCOW MULE',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'ALCOOL VINIQUE INFUSÉ AUX GRAINES DE GINGEMBRE. JUS DE CITRON FRAIS. EAU PURE. ÉLABORÉ ET EMBOUTEILLÉ EN FRANCE.',
        images: [
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788365385/39_rzlpeg.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788687756/61_xv2x3w.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1788643897/B_Fleur_de_la_Passion._Grande_fleur_solitaire_remarquable_par_sa_couronne_de_filaments_colore%CC%81s._Pe%CC%81tales_clairs_e%CC%81tamines_saillantes_et_pistil_proe%CC%81minent._Fleur_caracte%CC%81ristique_du_genre_Passiflo_2_qoe4v6.png',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1781703609/Design_sans_titre_68_azlqdk.png',
        ],
        plusInfos: 'GINGEMBRE & CITRON VERT\nÉCLATANT. STRUCTURÉ. LE GINGEMBRE S\'IMPOSE, INFUSÉ LENTEMENT DANS UN ALCOOL VINIQUE D\'EXCEPTION ÉLEVÉ EN FÛT DE CHÊNE.\nLES GRAINES DE GINGEMBRE FRANÇAISES LIBÈRENT UNE ÉNERGIE NETTE. LE CITRON VERT TRACE UNE FRAÎCHEUR LUMINEUSE. UNE TOUCHE DE VANILLE ET LE BOIS APPORTE L\'ÉQUILIBRE.\nSEC. ÉLÉGANT. VIVANT. UNE ŒUVRE DE CONTRASTE.\n—\nORIGINE : ALCOOL VINIQUE 96 % ÉLABORÉ EN FRANCE. INFUSION DE GINGEMBRE FRANÇAIS. JUS DE CITRON BIOLOGIQUE. ÉLEVAGE EN FÛT DE CHÊNE. ÉLABORÉ ET EMBOUTEILLÉ EN FRANCE, RÉGION D\'AVIGNON.\n—\nPROFIL SENSORIEL\nROBE — CRISTAL ARGENTÉ\nNEZ — GINGEMBRE FRAIS, ZESTE VIF\nBOUCHE — ATTAQUE TONIQUE, TEXTURE SOYEUSE\nFINALE — SÈCHE, PRÉCISE.',
        livraison: 'LIVRAISON ESTIMÉE SOUS DEUX SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
    },
    'bouteille-signee-teokaykay': {
        nom: 'TEO FOR DYANE PARIS',
        sousTitre: 'CONTACTER LA CONCIERGERIE',
        description: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE.',
        images: [
            '/dyane-teo.webp',
            'https://res.cloudinary.com/dazhkrimv/image/upload/v1777443951/img-39_lixyap.jpg',
        ],
        plusInfos: 'PLONGEZ DANS L\'UNIVERS DE DYANE PARIS, MAISON D\'ART LIQUIDE, OÙ L\'ART ET LA HAUTE MIXOLOGIE NE FONT QU\'UN. EN COLLABORATION AVEC TEO KAY KAY, DYANE RÉVÈLE UNE SÉRIE CONFIDENTIELLE DE 25 ŒUVRES. CHAQUE BOUTEILLE, PEINTE À LA MAIN À LA BOMBE, EST UNE PIÈCE UNIQUE, VIVANTE ET IRRÉPÉTABLE. À L\'INTÉRIEUR, LE COCKTAIL PROLONGE L\'ŒUVRE : DES INGRÉDIENTS NOBLES POUR UNE DÉGUSTATION INTENSE ET PRÉCISE. L\'ART SE BOIT, PUIS SE GARDE. CONTIENT UN COCKTAIL SIGNATURE DYANE (28–30 % VOL.) : PORNSTAR MARTINI OU MOSCOW MULE AU CHOIX. UNE PIÈCE RARE, À BOIRE OU À COLLECTIONNER.',
        livraison: 'PRODUCTION SUR COMMANDE. LIVRAISON ESTIMÉE SOUS TROIS SEMAINES.\nLIVRAISON OFFERTE À PARTIR DE 300€',
        disponibilite: 'BATCH 1.\n25 PIÈCES PAR BATCH.\nINSCRIVEZ-VOUS À NOTRE NEWSLETTER POUR ÊTRE INFORMÉ(E) DES PROCHAINS BATCHS.',
        formats: ['PORNSTAR MARTINI', 'MOSCOW MULE'],
    },
}
