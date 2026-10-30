import type { DyaneEditorialMedia } from '@/components/editorial/DyaneEditorialPage'
import { cloudinaryVideoPoster } from '@/lib/cloudinary'

// Shared unchanged selections: the page and its image sitemap cannot drift apart.
export const maisonMedia = {
  film: 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788775590/dyane-paris-sculpture-porcelaine-voile-rouge-detail.mov',
  filmPoster: 'https://res.cloudinary.com/dazhkrimv/video/upload/f_jpg,q_auto,w_1600,so_0/v1788775590/dyane-paris-sculpture-porcelaine-voile-rouge-detail.jpg',
}

export const maisonGalleries: Record<'gallery3' | 'gallery2' | 'gallery6' | 'gallery8', DyaneEditorialMedia[]> = {
  gallery3: [
    { src: '/editorial/la-maison/ART%201.png', alt: 'Recherches artistiques autour de la silhouette Dyane' },
    { src: '/editorial/la-maison/STATUE%202.png', alt: 'Portrait sculptural de Dyane Paris' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596466/dyane-paris-sculpture-porcelaine-rouge-art-floral.png', alt: 'Sculpture Dyane Paris au drapé rouge dans une composition florale' },
  ],
  gallery2: [
    { src: '/editorial/la-maison/ART%202.png', alt: 'Composition picturale inspirant la Maison Dyane' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499960/dyane-paris-sculpture-porcelaine-rouge-interieur-luxe.png', alt: 'Sculpture en porcelaine Dyane Paris au drapé rouge dans un intérieur' },
  ],
  gallery6: [
    { src: '/editorial/la-maison/COCKTAIL%203.png', alt: 'Service d’un cocktail Dyane Paris' },
    { src: '/editorial/la-maison/prod-4-web.m4v', poster: '/editorial/la-maison/PROD%204.png', alt: 'Fleur aromatique de la composition Dyane', type: 'video' },
    { src: '/editorial/la-maison/PROD%202.png', alt: 'Geste de production du liquide Dyane' },
    { src: '/editorial/la-maison/PROD%204.png', alt: 'Travail manuel de la porcelaine Dyane' },
    { src: '/editorial/la-maison/PROD%203.png', alt: 'Artisan au cœur de la production Dyane' },
    { src: '/editorial/la-maison/COCKTAIL%204.png', alt: 'Verre Dyane dans un intérieur parisien' },
  ],
  gallery8: [
    { src: '/editorial/la-maison/prod-5-web.m4v', poster: '/editorial/la-maison/PROD%205.png', alt: 'Agrume sélectionné pour une composition Dyane', type: 'video' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499962/dyane-paris-jeremy-bacquet-cocktails-luxe-bar.png', alt: 'Jérémy Bacquet au bar dans l’univers des cocktails Dyane Paris' },
    { src: '/editorial/la-maison/PROD%205.png', alt: 'Finition manuelle d’une sculpture Dyane' },
    { src: '/editorial/la-maison/COCKTAIL%202%20.png', alt: 'Détail ambré d’un cocktail Dyane' },
    { src: '/editorial/la-maison/drink-2-web.m4v', poster: '/editorial/la-maison/DRINK.png', alt: 'Service d’une œuvre Dyane Paris', type: 'video' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499959/dyane-paris-fabrication-porcelaine-savoir-faire.png', alt: 'Travail de la porcelaine et savoir-faire de fabrication Dyane Paris' },
    { src: '/editorial/la-maison/PROD.png', alt: 'Alambic de la Maison Dyane' },
    { src: '/editorial/la-maison/COCKTAIL%201%20.png', alt: 'Cocktail doré servi par Dyane Paris' },
  ],
}

export const experiencesMedia = {
  heroVideo: 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788699063/dyane-paris-sculptures-porcelaine-argent-duo.mp4',
  heroPoster: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1777445316/DSC00599_copie_2_o518xt.jpg',
}

export const experiencesGalleries: Record<'gallery3' | 'gallery2' | 'gallery6' | 'gallery8', DyaneEditorialMedia[]> = {
  gallery3: [
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596446/dyane-paris-art-de-recevoir-cocktail-signature.png', alt: 'Cocktail signature Dyane Paris dans l’art de recevoir' },
    { src: '/editorial/experiences/EVENT%207.png', alt: 'Invités découvrant une œuvre Dyane Paris' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499963/dyane-paris-collection-sculptures-porcelaine-rouge-verte.png', alt: 'Collection de sculptures en porcelaine Dyane Paris aux drapés rouge et vert' },
  ],
  gallery2: [
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499962/dyane-paris-cocktail-pret-a-servir-service.png', alt: 'Service d’un cocktail prêt à servir Dyane Paris' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499959/dyane-paris-sculpture-porcelaine-objet-decoration.png', alt: 'Sculpture en porcelaine Dyane Paris dans un intérieur' },
  ],
  gallery6: [
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792665186/dyane-paris-cocktail-bar-luxe.png', alt: 'Cocktail Dyane Paris présenté au bar' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499962/dyane-paris-cocktails-luxe-art-de-recevoir.png', alt: 'Cocktails Dyane Paris et art de recevoir' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792665167/dyane-paris-evenements-fashion-week-art-basel.png', alt: 'Événement dans l’univers de Dyane Paris' },
    { src: '/editorial/experiences/PERSO%202.png', alt: 'Peinture personnalisée sur une sculpture Dyane' },
    { src: '/editorial/experiences/ART%203.png', alt: 'Illustration florale et cocktail Dyane' },
    { src: '/editorial/experiences/PERSO%203.png', alt: 'Décor textile personnalisé sur une sculpture Dyane' },
  ],
  gallery8: [
    { src: '/editorial/experiences/EVENT%203.png', alt: 'Invitation Dyane Paris lors d’un événement privé' },
    { src: '/editorial/experiences/EVENT%204.png', alt: 'Performance artistique lors d’une expérience Dyane' },
    { src: '/editorial/experiences/BAR%204.png', alt: 'Cocktail floral imaginé par Dyane Paris' },
    { src: '/editorial/experiences/BAR%206.png', alt: 'Cocktail Dyane présenté sur un plateau' },
    { src: '/editorial/experiences/EVENT%202%20.png', alt: 'Service de cocktails lors d’un événement Dyane' },
    { src: '/editorial/experiences/BAR%205.png', alt: 'Attention personnalisée de la Maison Dyane' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499962/dyane-paris-sculpture-porcelaine-noire-detail.jpg', alt: 'Détail d’une sculpture en porcelaine noire Dyane Paris' },
    { src: '/editorial/experiences/EVENT%205.png', alt: 'Œuvre Dyane installée dans un bar de collection' },
  ],
}

export const FABRICATION_VIDEO_URL = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1788697399/dyane-paris-fabrication-sculpture-modelage-main.mp4'
const ARTISANAL_VIDEO_URL = 'https://res.cloudinary.com/dazhkrimv/video/upload/v1792664691/dyane-paris-fabrication-artisanale.mp4'
// The original turns white at 3.967s; loop only the filmed sequence.
const ARTISANAL_LOOP_URL = ARTISANAL_VIDEO_URL.replace('/upload/', '/upload/eo_3.9/')

export const fabricationGalleries: Record<'gallery3' | 'gallery2' | 'gallery6' | 'gallery8', DyaneEditorialMedia[]> = {
  gallery3: [
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1791499963/dyane-paris-fabrication-sculpture-porcelaine.png', alt: 'Fabrication de la sculpture en porcelaine Dyane Paris' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596559/dyane-paris-sculpture-porcelaine-detail-visage.png', alt: 'Détail du visage de la sculpture en porcelaine Dyane Paris' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792664670/dyane-paris-fabrication-ustensiles-porcelaine.png', alt: 'Ustensiles de fabrication pour la porcelaine Dyane Paris' },
  ],
  gallery2: [
    { src: ARTISANAL_LOOP_URL, poster: cloudinaryVideoPoster(ARTISANAL_VIDEO_URL, 1200), alt: 'Fabrication artisanale de la sculpture en porcelaine Dyane Paris', type: 'video', position: 'center center' },
    { src: '/editorial/fabrication/PEINTURE%202.png', alt: 'Peinture manuelle du drapé Dyane' },
  ],
  gallery6: [
    { src: '/editorial/fabrication/porcelaine-3-web.m4v', poster: '/editorial/fabrication/PORCELAINE%206.png', alt: 'Préparation de la matière en atelier', type: 'video' },
    { src: '/editorial/fabrication/PORCELAINE%206.png', alt: 'Outils de sculpture sur porcelaine' },
    { src: '/editorial/fabrication/porcelaine-4-web.m4v', poster: '/editorial/fabrication/PORCELAINE.png', alt: 'Coulage de la porcelaine Dyane', type: 'video' },
    { src: '/editorial/fabrication/PEINTURE%203.png', alt: 'Pigment rouge de la sculpture Dyane' },
    { src: '/editorial/fabrication/porcelaine-5-web.m4v', poster: '/editorial/fabrication/PORCELAINE%207.png', alt: 'Gestes de précision sur la porcelaine', type: 'video' },
    { src: '/editorial/fabrication/PORCELAINE%208.png', alt: 'Atelier et outils des artisans Dyane' },
  ],
  gallery8: [
    { src: '/editorial/fabrication/INGREDIENTS.png', alt: 'Framboises sélectionnées pour une composition Dyane' },
    { src: '/editorial/fabrication/ingredients-2-web.m4v', poster: '/editorial/fabrication/INGREDIENTS.png', alt: 'Sélection des ingrédients au cœur des cultures', type: 'video' },
    { src: '/editorial/fabrication/PEINTURE%202%20.png', alt: 'Pinceaux de finition de la Maison Dyane' },
    { src: '/editorial/fabrication/ingredients-5-web.m4v', poster: '/editorial/fabrication/INGREDIENTS.png', alt: 'Lavande choisie pour ses qualités aromatiques', type: 'video' },
    { src: 'https://res.cloudinary.com/dazhkrimv/image/upload/v1792596480/dyane-paris-cocktail-luxe-coupe-pornstar-martini-dyaneno1.png', alt: 'Cocktail Pornstar Martini Dyane No.1 présenté en coupe' },
    { src: '/editorial/fabrication/production-1-web.m4v', poster: '/editorial/fabrication/PRODUCTION%202%20.png', alt: 'Contrôle d’une composition liquide Dyane', type: 'video' },
    { src: '/editorial/fabrication/PRODUCTION%202%20.png', alt: 'Fûts de la production française Dyane' },
    { src: '/editorial/fabrication/production-3-web.m4v', poster: '/editorial/fabrication/PRODUCTION%202%20.png', alt: 'Élaboration du liquide Dyane', type: 'video' },
  ],
}

