# Audit technique — `dyane.glb` / `dyane-web-v2.glb`

Audit réalisé sur le fichier de travail du projet et vérifié contre le fichier fourni dans Downloads. Les deux originaux ont le même SHA-256 :

`2089d4cdaee37ebfa3a1a0095a10a1450d6270b06e586ded1e97c0fc6eb33464`

## État original

| Mesure | Valeur |
| --- | ---: |
| Taille | 1 597 996 octets (1,60 Mo décimal) |
| Scènes | 1 |
| Nodes | 4 : `scarf`, `cap`, `body`, `body.001` |
| Meshes / primitives | 4 / 4 |
| Draw calls estimés | 4 |
| Sommets | 40 762 |
| Triangles | 61 513 |
| Matériaux | 2 : `Material.005`, `Material.001` |
| Textures / images | 0 / 0 |
| Normales | Présentes sur les 4 meshes, unitaires dans les buffers |
| Tangentes | Absentes sur les 4 meshes |
| Bounding box monde | min `[-0.317510, 0.013805, -0.237896]`, max `[0.344864, 2.173822, 0.236035]` |
| Dimensions | `0.662374 × 2.160017 × 0.473931` unités glTF |
| Décalage du sol | base à `Y = 0.013805` |

### Détail par node

| Node | Sommets | Triangles | UV0 | Triangles dégénérés | Topologie après soudure virtuelle des positions |
| --- | ---: | ---: | --- | ---: | --- |
| `scarf` | 9 932 | 19 110 | absent | 0 | 578 arêtes de bord, 0 non-manifold |
| `cap` | 19 110 | 25 636 | présent | 0 | fermé, 0 non-manifold |
| `body` | 10 207 | 15 310 | présent | 0 | 583 arêtes de bord, 1 arête non-manifold |
| `body.001` | 1 513 | 1 457 | présent mais aplati (`V = 1`) | 7 | plaque plane ouverte, 1 anomalie non-manifold liée aux triangles dégénérés |

`body.001` est la signature plane appliquée devant le socle, pas le socle lui-même. Le socle est géométriquement continu avec `body`; une séparation automatique par hauteur ou composant connecté risquerait donc de couper les jambes ou le drapé.

Les UV de `body` sortent de l'intervalle 0–1 et `scarf` n'a pas d'UV. Ce n'est pas bloquant pour les matériaux unis actuels, mais impose un dépliage manuel avant toute texture artistique directionnelle. L'absence de tangentes est également normale tant qu'aucune normal map tangent-space n'est utilisée.

Les positions dupliquées sont au nombre de 105 sur `scarf`, 6 288 sur `cap`, 2 258 sur `body` et 15 sur `body.001`. Sur `cap` et `body`, elles correspondent majoritairement aux séparations de normales, faces plates et coutures UV; elles ne sont donc pas considérées comme des données inutilement duplicables sans analyse manuelle. Les seuls doublons supprimés sont les 15 sommets de signature devenus non référencés après nettoyage des faces nulles.

Les deux matériaux originaux étaient incompatibles avec une porcelaine réaliste : `Material.005` avait une metalness de `0.5046` et une roughness de `0.4817`; `Material.001` avait une metalness de `0.8716`. Aucun buffer de texture, image, sampler ou extension de compression n'était présent.

L'import Blender 5.2 confirme les normales personnalisées, 3 faces plates sur `body`, 2 053 faces plates sur `cap` et 10 sur `scarf`. Ces faces peuvent correspondre à des limites voulues ou à des coutures d'export; elles ne doivent pas être lissées globalement sans inspection visuelle en lumière rasante.

## Classement des corrections

### A — Matériau et éclairage

- Corriger les deux matériaux source anormalement métalliques (`0.50` et `0.87`).
- Obtenir l'ivoire chaud, la glaçure bordeaux, les reflets de softbox, le modelé du visage et les ombres de contact/projection.
- Conserver `opacity = 1`, `transparent = false`, `transmission = 0`, `depthWrite = true`.
- Aucun microdétail n'est nécessaire à ce stade; la surface reste lisse.

### B — Corrections automatiques sûres appliquées

- Création de `dyane-web-v2.glb`; l'original reste inchangé.
- Suppression des 7 triangles d'aire nulle de `body.001` et des 15 sommets devenus non référencés.
- Ajout d'un pivot racine `Dyane_Root`, centré sur X/Z et aligné à `Y = 0`, sans appliquer ni altérer les vertices.
- Conservation stricte des nodes `body`, `body.001`, `cap`, `scarf` et de leurs transformations relatives.
- Renommage des meshes et matériaux; remplacement des deux matériaux source inutiles.
- Préparation des matériaux `Porcelain_Ivory`, `Glaze_Bordeaux`, `Porcelain_Base`, `Porcelain_Cap` et `Signature_Dark`.
- `Porcelain_Base` reste volontairement réservé et non assigné jusqu'à séparation manuelle du socle.
- Reconditionnement des buffers sans subdivision, soudure, remesh, compression destructive ou recalcul global des normales.

### C — Intervention Blender manuelle

- Séparer proprement le socle de `body`, avec vérification des boucles et des normales.
- Inspecter l'unique arête non-manifold détectée dans `body` et les petits composants isolés avant suppression éventuelle.
- Décider face par face si les zones plates de `cap`, `body` et `scarf` sont intentionnelles; préserver les lèvres, plis, doigts et raccords.
- Créer des UV propres pour `scarf` et rationaliser ceux de `body` avant l'ajout de textures d'œuvres.
- Affiner, si la photographie réelle devient une cible géométrique stricte, le visage, les mèches de cheveux, les doigts, les plis fins du voile, les jambes, les pieds, la jonction bouchon/tête et le bord du socle.

## Comparaison à la photographie réelle

La silhouette générale est cohérente : pose, volume du torse, bras, ouverture du voile, jambes et socle sont reconnaissables. Le GLB est donc suffisamment fidèle pour valider le rendu web et les interactions.

Les écarts encore visibles sont surtout dans les détails sculptés : le visage et les cheveux sont moins définis, les doigts sont plus massifs, certains plis du voile sont moins fins, les pieds et chevilles sont moins précis, et le socle/logo demanderaient une reprise dédiée. La matière, le rouge, la lecture des volumes et l'ancrage au sol relèvent en revanche majoritairement du rendu temps réel.

## État V2 vérifié

| Mesure | Valeur |
| --- | ---: |
| Taille | 1 599 028 octets (1,60 Mo décimal) |
| Nodes | 5, dont les 4 nodes requis et `Dyane_Root` |
| Meshes / primitives / draw calls | 4 / 4 / 4 |
| Sommets | 40 747 |
| Triangles | 61 506 |
| Triangles dégénérés | 0 |
| Sommets non référencés | 0 |
| Dimensions | inchangées à la précision d'import |
| Base | exactement à `Y = 0` en glTF / `Z = 0` dans Blender |

La légère augmentation de 1 032 octets vient des noms explicites et des métadonnées de traçabilité. La géométrie utile est plus petite de 15 sommets et 7 triangles.
