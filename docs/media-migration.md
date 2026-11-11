# DYANE PARIS — sortie de Cloudinary et SEO des images

## Choix d'architecture

- **Source de vérité :** dépôt GitHub du site Next.js, sous \`public/images/\`.
- **URL publique :** \`https://www.dyaneparis.com/images/.../nom-descriptif.webp\`.
- **Livraison :** hébergement de Next.js/Vercel déjà utilisé pour le site (pas d'abonnement Cloudinary requis pour ces images).
- **Originaux :** conserver une copie haute définition indépendante du dépôt Git, avec au moins une seconde sauvegarde.
- **Attention :** GitHub n'est pas le serveur d'images ; éviter les URL \`raw.githubusercontent.com\` et les liens temporaires. Les visiteurs doivent recevoir les images sur le domaine du site.

Le dépôt contient déjà des WebP et des ressources éditoriales locales. Il faut migrer les références restantes plutôt que créer un second pipeline concurrent.

## 1. Récupérer les originaux

Le compte Cloudinary a été suspendu : les URLs de diffusion ne permettent plus nécessairement de récupérer les octets. Restaurer/exporter les médias à partir des fichiers sources, backups, dossiers de production ou en demandant à Cloudinary un accès temporaire d'export.

Ne **jamais** remplacer silencieusement une photo manquante par un visuel sans rapport. Préserver crédit, droits et cohérence de la DA.

## 2. Auditer les dépendances

Depuis la racine du dépôt :

\`\`\`bash
node scripts/audit-cloudinary.mjs --csv
\`\`\`

Cela crée \`reports/cloudinary-assets.csv\` avec les fichiers, lignes et URLs à remplacer. Le bilan distingue les images et les vidéos. Une image WebP ne remplace pas un MP4 : prévoir une migration vidéo indépendante.

Avant de considérer la migration finie :

\`\`\`bash
node scripts/audit-cloudinary.mjs --fail
\`\`\`

Le code de sortie sera 1 tant que des références directes à Cloudinary subsistent.

## 3. Convertir les images sans service externe

\`\`\`bash
python3 -m pip install Pillow
python3 scripts/optimize-webp.py \
  --input "/chemin/vers/photos-originales" \
  --output public/images/cocktails \
  --max-width 1800 \
  --quality 82
\`\`\`

- Conversion sans redimensionnement vers le haut ; orientation EXIF corrigée ; transparence PNG conservée.
- Noms normalisés en minuscules, ASCII, traits d'union.
- Qualité 82 par défaut, à contrôler visuellement sur les pièces en porcelaine et les textures.
- Ne pas réencoder inutilement des fichiers WebP déjà optimisés ; le \`--overwrite\` est volontaire.
- Le script conserve les sous-dossiers mais ne crée **pas** automatiquement des noms sémantiques : renommer les sources ou fichiers selon les sujets avant publication.

Exemples de noms à valider selon la photo réelle :
- \`dyane-paris-pornstar-martini-sculpture-porcelaine.webp\`
- \`dyane-paris-moscow-mule-cocktail-signature.webp\`
- \`dyane-paris-fabrication-sculpture-porcelaine.webp\`
- \`dyane-paris-jeremy-bacquet-mixologie.webp\`

Conserver des images sources jusqu'à 1800 ou 2000 px pour les visuels plein écran, et s'appuyer sur \`next/image\` pour produire des tailles adaptées au navigateur ; éviter de diffuser une version 1800 px pour une vignette.

## 4. Brancher les images dans Next.js

Remplacer les URL Cloudinary uniquement quand le **bon** fichier local est présent. Exemple :

\`\`\`tsx
import Image from 'next/image'

<Image
  src="/images/cocktails/dyane-paris-pornstar-martini-sculpture-porcelaine.webp"
  alt="Sculpture en porcelaine Dyane Paris contenant le cocktail Pornstar Martini"
  width={1200}
  height={1600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
\`\`\`

Pour une image \`fill\`, donner la taille du conteneur et \`sizes\`. Les images de fond CSS ne suffisent pas pour Google Images : une vraie balise HTML \`<img>\` ou le composant Next \`<Image>\` est préférable. Renseigner une alternative concise correspondant au visuel ; en version bilingue, traduire l'alt FR/EN. \`alt=""\` convient aux visuels strictement décoratifs.

Les images réellement prioritaires au-dessus de la ligne de flottaison peuvent être préchargées ; laisser le chargement paresseux aux galeries situées plus bas.

## 5. Référencement Google Images et ChatGPT Search

- Vérifier que **chaque** image est disponible en HTTP 200, sans authentification, et avec \`Content-Type: image/webp\`.
- Utiliser des noms de fichiers descriptifs, stables et des textes proches de l'image (produit, sculpture, cocktail, artisan, événement).
- Vérifier le \`src\` HTML, les attributs \`alt\`, les dimensions/réactivité et la netteté sur mobile.
- Modifier \`app/sitemap.ts\` : ne plus mentionner les images Cloudinary mortes ; inscrire les **images effectivement présentes** sur les pages correspondantes, sur \`https://www.dyaneparis.com/...\`.
- Mettre à jour \`og:image\`, \`primaryImageOfPage\` et les images des données structurées Product / Article pour qu'elles utilisent la source locale. Le site possède déjà des bases SEO structurées.
- \`app/robots.ts\` autorise déjà \`Googlebot-Image\` et \`OAI-SearchBot\` (à revalider en production). Ne pas bloquer leurs requêtes sur les pages et les médias.
- Soumettre/revérifier \`https://www.dyaneparis.com/sitemap.xml\` dans Google Search Console, contrôler l'inspection d'URL et les requêtes en erreur.
- Tester quelques pages avec PageSpeed Insights, Rich Results Test, et constater l'évolution de Google Images après recrawl.

**Important :** WebP et robots.txt favorisent la découvrabilité, mais ne garantissent aucun classement ni aucune citation par ChatGPT.

## 6. Contrôle final avant fusion

\`\`\`bash
npm ci
npm run build
node scripts/audit-cloudinary.mjs --fail
\`\`\`

Le contrôle Cloudinary doit passer lorsque **toutes** les images et vidéos utilisées ont été remplacées. Vérifier visuellement : accueil, galerie, pages produits, journal, fabrication, maison, distillation, affichage mobile, métadonnées, et images sociales.

Ne supprimer \`remotePatterns\` Cloudinary de \`next.config.js\` qu'après ce contrôle. Garder une branche de rollback et préserver les anciens fichiers jusqu'à validation de la nouvelle diffusion.

## État de cette première PR

- Scripts d'audit et de conversion ajoutés.
- Quelques références produits peuvent être redirigées vers des WebP **déjà** présents.
- **Pas de récupération automatique des originaux bloqués** : les images manquantes et les vidéos doivent être fournies et examinées avant la migration complète.
- Aucun changement n'est publié sur le site tant que la PR n'est pas fusionnée puis déployée.
