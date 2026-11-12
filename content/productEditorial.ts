type EditorialPhoto = { src: string; alt: Record<'fr' | 'en', string> }

type ProductStory = {
  title: string
  articleHref: string
  copy: Record<'fr' | 'en', { articleLabel: string; paragraphs: string[] }>
  photos: EditorialPhoto[]
}

export const productEditorial: Record<string, ProductStory | undefined> = {
  no1: {
    title: 'DYANE NO.1 - PORNSTAR MARTINI',
    articleHref: '/le-journal/pornstar-martini',
    copy: {
      fr: {
        articleLabel: 'LIRE L’HISTOIRE DU PORNSTAR MARTINI',
        paragraphs: [
          'Dyane No.1 est la première création de la Maison d’Art Liquide Dyane Paris. Elle réinterprète le Pornstar Martini autour du fruit de la passion, de la vanille et de la framboise sauvage, dans un cocktail prêt à servir présenté au sein d’une sculpture en porcelaine peinte à la main. Deux formats possèdent chacun leur fiche : 25 cl et 1,5 L. La composition est inspirée du Pornstar Martini, 24 % vol.',
          'Le contenant abandonne les codes de la bouteille traditionnelle pour adopter la silhouette sculpturale de Dyane. Sa porcelaine et ses finitions peintes à la main donnent à chaque création une présence conçue pour demeurer après la dégustation.',
          'Le cocktail est élaboré et embouteillé en France, dans la région d’Avignon, à partir d’une vodka artisanale française travaillée par infusion. La recette recherche un équilibre entre l’intensité du fruit de la passion, l’acidité et la rondeur de la vanille.',
          'Prête à déguster, la composition est pensée pour préserver la constance du service. Une fois le cocktail savouré, la sculpture conserve sa fonction d’objet d’art et peut rejoindre une collection ou un intérieur.',
        ],
      },
      en: {
        articleLabel: 'READ THE STORY OF THE PORNSTAR MARTINI',
        paragraphs: [
          'Dyane No.1 is the first creation by the Dyane Paris House of Liquid Art. It reinterprets the Pornstar Martini through passion fruit, vanilla and wild raspberry, in a ready-to-serve cocktail presented within a hand-painted porcelain sculpture. Each size has its own product page: 25 cl and 1.5 L. The composition is inspired by the Pornstar Martini, 24% vol.',
          'The vessel leaves behind the codes of the traditional bottle for Dyane’s sculptural silhouette. Its porcelain body and hand-painted finishes give every creation a presence designed to remain after the tasting experience.',
          'The cocktail is crafted and bottled in France, near Avignon, using an infused artisanal French vodka. Its recipe seeks balance between the intensity of passion fruit, bright acidity and the rounded character of vanilla.',
          'Ready to taste, the composition is designed to preserve consistency of service. Once the cocktail has been enjoyed, the sculpture remains as an art object for a collection or interior.',
        ],
      },
    },
    photos: [
      {
        src: '/home/editorial/dyane-paris-no1-sculpture-musee.webp',
        alt: { fr: 'Sculpture Dyane No.1 au drapé rouge sur un socle devant un tableau', en: 'Red-draped Dyane No.1 sculpture on a pedestal in front of a painting' },
      },
      {
        src: '/images/officielles/fabrication/dyane-paris-peinture-main-drape-porcelaine.png',
        alt: { fr: 'Un pinceau applique la peinture rouge sur le drapé en porcelaine', en: 'A brush applies red paint to the porcelain drapery' },
      },
      {
        src: '/images/officielles/collections/dyane-paris-sculpture-porcelaine-rouge-interieur-luxe.webp',
        alt: { fr: 'Sculpture Dyane No.1 en porcelaine au drapé rouge dans un intérieur', en: 'Red-draped Dyane No.1 porcelain sculpture in an interior' },
      },
      {
        src: '/images/officielles/collections/dyane-no1-pornstar-martini-flacon-porcelaine.png',
        alt: { fr: 'Détail du drapé rouge de la sculpture Dyane No.1 sur fond noir', en: 'Detail of the red drapery of the Dyane No.1 sculpture against a black background' },
      },
    ],
  },
  no2: {
    title: 'DYANE NO.2 - BASIL SMASH',
    articleHref: '/le-journal/basil-smash',
    copy: {
      fr: {
        articleLabel: 'DÉCOUVRIR LE BASIL SMASH',
        paragraphs: [
          'Dyane No.2 Basil Smash est une création de la Maison d’Art Liquide Dyane Paris. Gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. Ce cocktail prêt à servir est élaboré et embouteillé en France, puis présenté dans une sculpture en porcelaine peinte à la main destinée à être conservée.',
          'La forme signature de Dyane transforme le flacon en présence sculpturale. La porcelaine met en valeur les volumes et les finitions peintes à la main, pour un objet qui prolonge l’expérience au-delà du cocktail.',
          'La recette est élaborée et embouteillée en France. Sa composition : gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. La sculpture en porcelaine prolonge cette création de la Maison.',
          'La composition prête à déguster facilite un service régulier, sans dissocier le liquide de sa mise en scène. Après dégustation, la sculpture demeure et devient un objet à collectionner.',
        ],
      },
      en: {
        articleLabel: 'DISCOVER THE BASIL SMASH',
        paragraphs: [
          'Dyane No.2 Basil Smash is a creation by the Dyane Paris House of Liquid Art. Gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour. This ready-to-serve cocktail is crafted and bottled in France, then presented in a hand-painted porcelain sculpture designed to be kept.',
          'Dyane’s signature form turns the vessel into a sculptural presence. Porcelain reveals its volumes and hand-painted finishes, creating an object that extends the experience beyond the cocktail.',
          'The recipe is crafted and bottled in France. Its composition: gin, house-made basil and yuzu syrup, wild elderflower liqueur, house-made sour. The porcelain sculpture extends this creation by the House.',
          'The ready-to-taste composition supports a consistent service without separating the liquid from its presentation. After tasting, the sculpture remains as a collectible object.',
        ],
      },
    },
    photos: [
      {
        src: '/home/editorial/dyane-paris-no2-basil-smash-hotel.webp',
        alt: { fr: 'Sculpture Dyane No.2 au drapé vert et deux coupes de cocktail', en: 'Green-draped Dyane No.2 sculpture beside two cocktail glasses' },
      },
      {
        src: '/images/officielles/collections/dyane-no2-basil-smash-flacon-porcelaine.png',
        alt: { fr: 'Détail de la sculpture Dyane No.2 au drapé vert', en: 'Detail of the green-draped Dyane No.2 sculpture' },
      },
      {
        src: '/home/shop/dyane-paris-cocktail-packshot-dyaneno2.png',
        alt: { fr: 'Coupe de Basil Smash garnie d’une fleur', en: 'A glass of Basil Smash garnished with a flower' },
      },
      {
        src: '/images/officielles/collections/dyane-paris-dyane-no2-basil-smash-packshot.webp',
        alt: { fr: 'Sculpture Dyane No.2 au drapé vert, vue de face sur une table en marbre', en: 'Front view of the green-draped Dyane No.2 sculpture on a marble table' },
      },
    ],
  },
  teo: {
    title: 'TEO FOR DYANE PARIS',
    articleHref: '/le-journal/teo-for-dyane',
    copy: {
      fr: {
        articleLabel: 'LIRE L’HISTOIRE DE TEO FOR DYANE',
        paragraphs: [
          'Artiste italien reconnu pour sa rencontre singulière entre le street art et l\'univers des grands champagnes, Teo KayKay se distingue par ses couleurs vibrantes, ses motifs graphiques et son approche audacieuse du luxe.',
          'Pour Dyane Paris, il réinterprète la silhouette emblématique de la Maison à travers une édition limitée de 25 sculptures en porcelaine, chacune peinte à la main et pensée comme une œuvre à collectionner.',
          'Chaque pièce renferme un cocktail signature au choix, inspiré du Pornstar Martini ou du Basil Smash, où l\'art contemporain rencontre la haute mixologie.',
        ],
      },
      en: {
        articleLabel: 'READ THE STORY OF TEO FOR DYANE',
        paragraphs: [
          'Italian artist Teo KayKay is known for his distinctive blend of street art and the world of fine Champagne. His vibrant colours, graphic motifs and bold approach to luxury set his work apart.',
          'For Dyane Paris, he reinterprets the House’s signature silhouette in a limited edition of 25 porcelain sculptures, each hand-painted and designed as a collectible work of art.',
          'Each piece holds a choice of signature cocktail inspired by the Pornstar Martini or Basil Smash, bringing contemporary art and haute mixology together.',
        ],
      },
    },
    photos: [
      {
        src: '/images/collections/teo-kaykay-sculpture.webp',
        alt: { fr: 'Sculpture en porcelaine Teo for Dyane ornée de cœurs roses et violets', en: 'Teo for Dyane porcelain sculpture decorated with pink and purple hearts' },
      },
      {
        src: '/images/officielles/collections/dyane-paris-teo-kaykay-detail-edition-artistique.jpg',
        alt: { fr: 'Teo KayKay peint la sculpture en porcelaine dans son atelier', en: 'Teo KayKay painting the porcelain sculpture in his studio' },
      },
      {
        src: '/images/collections/teo-kaykay-detail-peint.webp',
        alt: { fr: 'Détail de la peinture au marqueur sur la sculpture Teo for Dyane', en: 'Detail of marker painting on the Teo for Dyane sculpture' },
      },
    ],
  },
}
