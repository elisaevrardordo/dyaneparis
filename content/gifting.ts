export type GiftingSlug = 'cadeaux-noel-cocktails-luxe' | 'cadeaux-entreprise-noel' | 'offrir-un-cocktail-de-luxe'
type Copy = {
  title: string
  description: string
  eyebrow: string
  heading: string
  intro: string
  sections: { title: string; paragraphs: string[] }[]
  concierge: string
}

export const giftingSlugs: GiftingSlug[] = ['cadeaux-noel-cocktails-luxe', 'cadeaux-entreprise-noel', 'offrir-un-cocktail-de-luxe']

export const giftingPages: Record<GiftingSlug, { image: string; fr: Copy; en: Copy }> = {
  'cadeaux-noel-cocktails-luxe': {
    image: 'no1',
    fr: {
      title: 'Cadeaux de Noël : cocktails d’exception en porcelaine',
      description: 'Pour Noël, offrir un cocktail Dyane Paris dans une sculpture en porcelaine peinte à la main : une dégustation, un objet et un souvenir à conserver.',
      eyebrow: 'NOËL · L’ART D’OFFRIR',
      heading: 'Une œuvre à offrir',
      intro: 'À Noël, une attention peut commencer par une dégustation et se prolonger dans un objet. Dyane Paris imagine des cocktails d’exception prêts à servir, présentés dans des sculptures en porcelaine peintes à la main.',
      sections: [
        { title: 'Pour qui aime les cocktails et les beaux objets', paragraphs: [
          'À une personne qui aime les cocktails, on peut offrir une composition à partager plutôt qu’une bouteille de spiritueux classique. Le cocktail prêt à servir apporte une expérience déjà composée ; la sculpture introduit un autre rapport à l’objet.',
          'Cette idée de cadeau de Noël s’adresse à un destinataire majeur qui apprécie autant la mixologie que l’art de recevoir. Le choix se fait selon ses goûts, son intérieur et la façon dont il aime partager un moment.',
        ] },
        { title: 'Deux expressions de la Maison', paragraphs: [
          'Dyane No.1 réinterprète le Pornstar Martini autour d’une vodka artisanale française infusée à la vanille, du fruit de la passion et d’une touche de framboise sauvage. Une composition fruitée, pensée dans le langage de la Maison d’Art Liquide.',
          'Dyane No.2 accueille le Basil Smash : gin, sirop maison de basilic et yuzu, liqueur de sureau sauvage, sour maison. Cette expression végétale constitue un autre point de départ pour choisir un cadeau selon les préférences du destinataire.',
        ] },
        { title: 'Une autre attention qu’une bouteille de champagne', paragraphs: [
          'Le champagne accompagne naturellement les fêtes. Une création Dyane propose une autre intention : offrir un cocktail composé et une présence sculpturale. Il ne s’agit pas de remplacer un rituel, mais d’en imaginer un autre pour la personne à qui l’on pense.',
          'Après dégustation, le flacon en porcelaine demeure. Il peut rejoindre un intérieur ou une collection et conserver la mémoire du geste qui l’a offert.',
        ] },
        { title: 'Préparer son cadeau de Noël', paragraphs: [
          'Les œuvres sont proposées sur commande auprès de la Conciergerie. Pour une date de remise souhaitée, faites préciser la disponibilité, les conditions d’expédition et le délai de réalisation avant de confirmer votre choix.',
          'Une personnalisation éventuelle se discute en amont. La Maison étudie le projet selon la pièce, la quantité et le calendrier ; aucune livraison avant Noël ne doit être présumée sans confirmation.',
        ] },
      ],
      concierge: 'ÉCHANGER AVEC LA CONCIERGERIE POUR NOËL',
    },
    en: {
      title: 'Christmas gifts: exceptional cocktails in porcelain',
      description: 'Give a Dyane Paris cocktail in a hand-painted porcelain sculpture for Christmas: a tasting experience, an object and a lasting memory.',
      eyebrow: 'CHRISTMAS · THE ART OF GIVING',
      heading: 'A work to give',
      intro: 'At Christmas, a thoughtful gift can begin with a tasting experience and live on as an object. Dyane Paris creates exceptional ready-to-serve cocktails presented in hand-painted porcelain sculptures.',
      sections: [
        { title: 'For someone who loves cocktails and beautiful objects', paragraphs: [
          'For a cocktail enthusiast, a composed drink to share offers an alternative to a conventional bottle of spirits. The ready-to-serve cocktail brings a finished composition, while the sculpture creates a different relationship with the object.',
          'This Christmas gift is intended for an adult who appreciates mixology as much as entertaining. Consider their taste, their home and the way they like to share a moment.',
        ] },
        { title: 'Two expressions of the House', paragraphs: [
          'Dyane No.1 reinterprets the Pornstar Martini with artisanal French vodka infused with vanilla, passion fruit and a touch of wild raspberry. A fruit-led composition in the language of the House of Liquid Art.',
          'Dyane No.2 holds the Basil Smash: gin, house-made basil and yuzu syrup, wild elderflower liqueur and house-made sour. This botanical expression offers another way to choose a gift around its recipient’s preferences.',
        ] },
        { title: 'A different gesture from a bottle of champagne', paragraphs: [
          'Champagne has its place in the festive season. A Dyane creation offers a different intention: a composed cocktail and a sculptural presence. The idea is to imagine a ritual for the person you have in mind.',
          'After tasting, the porcelain vessel remains. It can become part of a home or collection and hold the memory of the gesture behind the gift.',
        ] },
        { title: 'Planning a Christmas gift', paragraphs: [
          'Works are available to order through the Concierge. If you have a particular date in mind, confirm availability, shipping conditions and production timing before finalising your choice.',
          'Possible personalisation should be discussed in advance. The House considers the piece, quantity and calendar; delivery before Christmas must be confirmed individually.',
        ] },
      ],
      concierge: 'DISCUSS A CHRISTMAS GIFT WITH THE CONCIERGE',
    },
  },
  'cadeaux-entreprise-noel': {
    image: 'personnalisation',
    fr: {
      title: 'Cadeaux d’entreprise de Noël : une attention Dyane Paris',
      description: 'Cadeaux clients et attentions de fin d’année : explorez les cocktails en sculptures de porcelaine et les possibilités de personnalisation avec Dyane Paris.',
      eyebrow: 'ENTREPRISES · FIN D’ANNÉE',
      heading: 'Le sens d’une attention',
      intro: 'Un cadeau client haut de gamme peut traduire une relation plutôt qu’un simple calendrier. Dyane Paris réunit cocktail prêt à servir et sculpture en porcelaine dans une attention à déguster, puis à conserver.',
      sections: [
        { title: 'Une attention pour un client ou un partenaire', paragraphs: [
          'À la fin de l’année, le choix d’un cadeau raconte ce que l’on souhaite transmettre : une reconnaissance, un souvenir commun, une invitation à se retrouver. Une œuvre Dyane donne à ce geste une dimension à la fois gustative et matérielle.',
          'Le projet s’adresse à des destinataires majeurs qui souhaitent recevoir un cadeau contenant de l’alcool. Les préférences, les usages et la politique cadeaux de chaque entreprise doivent guider la sélection.',
        ] },
        { title: 'Personnalisation : partir du projet', paragraphs: [
          'Une sculpture peut entrer en dialogue avec une identité ou une intention particulière. La Conciergerie étudie les possibilités de personnalisation selon les contraintes de réalisation et le nombre de pièces envisagé.',
          'Un brief utile précise les destinataires, la quantité, le budget, le calendrier et le souhait artistique. Les exemples de personnalisation présentés par la Maison ne constituent pas la promesse d’une reproduction à l’identique pour chaque commande.',
        ] },
        { title: 'Du cadeau au moment d’hospitalité', paragraphs: [
          'Un projet de fin d’année peut aussi prendre la forme d’un accueil, d’une réception ou d’une expérience de dégustation. Les cocktails prêts à servir permettent de penser le service avec le lieu et le rythme de l’événement.',
          'Pour un hôtel, une maison ou une entreprise, la réflexion porte alors sur l’ensemble : objet offert, présentation, service et relation avec les invités. La page Expériences présente cet univers d’hospitality.',
        ] },
        { title: 'Anticiper les quantités et les dates', paragraphs: [
          'Les projets d’entreprise se préparent avec la Conciergerie. Disponibilité, faisabilité, devis et dates sont confirmés au cas par cas ; les délais d’une commande privée ne doivent pas être transposés automatiquement à une série.',
          'Pour une remise avant Noël, communiquez la date souhaitée dès le premier échange. Toute répartition entre plusieurs adresses ou destination particulière doit être précisée avant confirmation.',
        ] },
      ],
      concierge: 'PRÉSENTER UN PROJET D’ENTREPRISE',
    },
    en: {
      title: 'Corporate Christmas gifts: a gesture by Dyane Paris',
      description: 'Client gifts and year-end gestures: explore cocktails in porcelain sculptures and discuss personalisation with Dyane Paris.',
      eyebrow: 'CORPORATE · YEAR-END GIFTS',
      heading: 'A meaningful gesture',
      intro: 'A considered client gift can express a relationship beyond the calendar. Dyane Paris brings together a ready-to-serve cocktail and a porcelain sculpture in a gesture to taste and then keep.',
      sections: [
        { title: 'For a client or a partner', paragraphs: [
          'A year-end gift expresses something: recognition, a shared memory or an invitation to meet again. A Dyane work gives that gesture both a tasting experience and a lasting physical presence.',
          'The project is intended for adults who welcome a gift containing alcohol. Recipient preferences, customs and each company’s gift policy should guide the selection.',
        ] },
        { title: 'Personalisation begins with the project', paragraphs: [
          'A sculpture can enter into dialogue with a particular identity or intention. The Concierge reviews personalisation possibilities in light of production requirements and the number of pieces envisaged.',
          'A useful brief sets out recipients, quantity, budget, timing and artistic intention. The House’s personalisation examples do not promise an identical reproduction for every order.',
        ] },
        { title: 'From gifting to hospitality', paragraphs: [
          'A year-end project may also take the form of a welcome, a reception or a tasting experience. Ready-to-serve cocktails allow service to be considered alongside the setting and rhythm of an event.',
          'For a hotel, a house or a company, the conversation concerns the whole experience: the object, presentation, service and relationship with guests. The Experiences page introduces this world of hospitality.',
        ] },
        { title: 'Planning quantities and dates', paragraphs: [
          'Corporate projects are planned with the Concierge. Availability, feasibility, quotations and dates are confirmed individually; private-order lead times do not automatically apply to a series.',
          'For a gift before Christmas, share the intended date at the first conversation. Distribution to several addresses or a particular destination should be discussed before confirmation.',
        ] },
      ],
      concierge: 'DISCUSS A CORPORATE PROJECT',
    },
  },
  'offrir-un-cocktail-de-luxe': {
    image: 'no2',
    fr: {
      title: 'Offrir un cocktail de luxe : goût, objet et expérience',
      description: 'Comment choisir un cocktail à offrir ? Dyane Paris relie mixologie, flacon en porcelaine et objet à collectionner pour un cadeau personnel.',
      eyebrow: 'L’ART D’OFFRIR · TOUTE L’ANNÉE',
      heading: 'Le goût et l’objet',
      intro: 'Offrir un cocktail de luxe, c’est choisir une expérience autant qu’une recette. Chez Dyane Paris, le liquide est prêt à servir et le contenant prend la forme d’une sculpture en porcelaine peinte à la main.',
      sections: [
        { title: 'Commencer par les goûts du destinataire', paragraphs: [
          'Le premier critère reste le goût. Une préférence pour les fruits, la vanille ou une expression végétale oriente le choix plus sûrement qu’une occasion. Dyane No.1 réinterprète le Pornstar Martini ; Dyane No.2 propose le Basil Smash.',
          'Pour une personne majeure qui aime découvrir la mixologie, le cocktail déjà composé permet d’entrer dans une interprétation précise. La fiche de chaque œuvre décrit sa composition ; elle mérite d’être consultée avant de choisir.',
        ] },
        { title: 'Comprendre ce que l’on offre', paragraphs: [
          'Un cocktail prêt à servir est une composition élaborée, et non un spiritueux de base à mélanger librement. Le geste de service fait partie du plaisir, mais n’exige pas de reconstruire la recette à partir de plusieurs bouteilles.',
          'La Maison d’Art Liquide associe cette composition à un flacon sculptural. L’objet ne sert pas seulement d’emballage : la silhouette et la porcelaine appartiennent à la création.',
        ] },
        { title: 'Choisir un objet qui demeure', paragraphs: [
          'Le cadeau peut réunir un moment partagé et une présence durable. Une fois la dégustation terminée, la sculpture peut être conservée et intégrée à un intérieur ou à une collection.',
          'Les pages Maison et Fabrication donnent à voir la rencontre entre sculpture, métiers d’art et mixologie. La galerie officielle permet d’observer les créations et leurs détails avant d’engager une commande.',
        ] },
        { title: 'Donner une intention au geste', paragraphs: [
          'Un anniversaire, une invitation à dîner ou un remerciement n’appellent pas nécessairement le même choix. La Conciergerie peut accompagner la sélection d’une œuvre et examiner une éventuelle demande de personnalisation.',
          'Pour les fêtes de fin d’année ou une attention d’entreprise, des pages dédiées précisent les questions de calendrier et de projet. Dans tous les cas, disponibilité et délais se confirment avant la commande.',
        ] },
      ],
      concierge: 'CHOISIR AVEC LA CONCIERGERIE',
    },
    en: {
      title: 'Giving a luxury cocktail: taste, object and experience',
      description: 'How do you choose a cocktail gift? Dyane Paris connects mixology, porcelain vessels and collectible objects in a personal gesture.',
      eyebrow: 'THE ART OF GIVING · THROUGHOUT THE YEAR',
      heading: 'Taste and object',
      intro: 'Giving a luxury cocktail means choosing an experience as well as a recipe. At Dyane Paris, the liquid is ready to serve and its vessel takes the form of a hand-painted porcelain sculpture.',
      sections: [
        { title: 'Begin with the recipient’s taste', paragraphs: [
          'Taste comes first. A preference for fruit, vanilla or botanical notes guides the choice more usefully than the occasion alone. Dyane No.1 reinterprets the Pornstar Martini; Dyane No.2 offers the Basil Smash.',
          'For an adult who enjoys discovering mixology, a composed cocktail introduces a particular interpretation. Each work’s page describes its composition and is worth reading before making a choice.',
        ] },
        { title: 'Understand the gift', paragraphs: [
          'A ready-to-serve cocktail is a finished composition rather than a base spirit to mix freely. Serving remains part of the pleasure without requiring the recipe to be reconstructed from several bottles.',
          'The House of Liquid Art pairs this composition with a sculptural vessel. The object is more than packaging: silhouette and porcelain belong to the creation.',
        ] },
        { title: 'Choose an object that remains', paragraphs: [
          'The gift can bring together a shared moment and a lasting presence. When the tasting is over, the sculpture can be kept as part of a home or collection.',
          'The Maison and Making pages explore the meeting of sculpture, fine craft and mixology. The official gallery offers a closer look at the creations and their details before an order is discussed.',
        ] },
        { title: 'Give the gesture an intention', paragraphs: [
          'A birthday, a dinner invitation and a thank-you may call for different choices. The Concierge can guide the selection of a work and review a possible personalisation request.',
          'Dedicated Christmas and corporate gifting pages discuss timing and project planning. In every case, availability and lead times are confirmed before ordering.',
        ] },
      ],
      concierge: 'CHOOSE WITH THE CONCIERGE',
    },
  },
}
