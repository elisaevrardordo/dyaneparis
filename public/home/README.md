# Médias de la homepage

Les fichiers présents dans ce dossier sont des **placeholders temporaires créés à partir des médias Dyane déjà présents dans le dépôt**. Ils doivent être remplacés avant la mise en production, en conservant exactement les mêmes noms afin de ne modifier aucun composant.

| Fichier | Usage | Recommandation | Poids cible |
| --- | --- | --- | --- |
| `hero/hero-dyane-desktop.mp4` | Hero vidéo desktop | MP4 H.264, 1920 × 1080 minimum, 16:9, 8–15 s, sans piste audio | ≤ 6 Mo |
| `hero/hero-dyane-mobile.mp4` | Hero vidéo mobile | MP4 H.264, 1080 × 1920, 9:16, 8–15 s, sans piste audio | ≤ 4 Mo |
| `hero/hero-dyane-poster.webp` | Poster immédiat du hero et fallback reduced motion | WebP, 1920 × 1080, 16:9 | ≤ 350 Ko |
| `products/dyane-no1.webp` | Campagne Dyane No.1 | WebP, 1600 × 2400 minimum, 2:3, bouteille entière dans la zone centrale | ≤ 500 Ko |
| `products/dyane-no2.webp` | Campagne Dyane No.2 | WebP, 1600 × 2400 minimum, 2:3, bouteille entière dans la zone centrale | ≤ 500 Ko |
| `customization/customization-fallback.webp` | Fallback statique avant le chargement 3D | WebP, 1600 × 1200, 4:3 | ≤ 350 Ko |
| `presences/presence-paris.webp` | Présence éditoriale 1 | WebP, 1200 × 1600, 3:4 | ≤ 400 Ko |
| `presences/presence-mediterranee.webp` | Présence éditoriale 2 | WebP, 1200 × 1500, 4:5 | ≤ 400 Ko |
| `presences/presence-maison.webp` | Présence éditoriale 3 | WebP, 1200 × 1600, 3:4 | ≤ 400 Ko |
| `editorial/dyane-full-01.webp` | Sculpture plein pied gauche | WebP, 1600 × 2400, 2:3 | ≤ 500 Ko |
| `editorial/dyane-full-02.webp` | Sculpture plein pied droite | WebP, 1600 × 2400, 2:3 | ≤ 500 Ko |
| `film/dyane-film-desktop.mp4` | Film final desktop | MP4 H.264, 1920 × 1080 minimum, 16:9, 6–15 s, sans piste audio | ≤ 6 Mo |
| `film/dyane-film-mobile.mp4` | Film final mobile | MP4 H.264, 1080 × 1920, 9:16, 6–15 s, sans piste audio | ≤ 4 Mo |
| `film/dyane-film-poster.webp` | Poster du film final et fallback reduced motion | WebP, 1920 × 1080, 16:9 | ≤ 350 Ko |

Les vidéos doivent être encodées avec `faststart` afin que leurs métadonnées soient disponibles rapidement. Le poster doit représenter une image suffisamment forte pour que chaque section reste complète lorsque l’autoplay est désactivé ou que `prefers-reduced-motion` est actif.

Les cadrages et positions d’images restent ajustables dans `content/home.ts` via `objectPosition`.
