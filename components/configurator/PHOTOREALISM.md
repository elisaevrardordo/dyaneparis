# Calibration photoréaliste du configurateur

## Diagnostic initial

- Stack : Three.js `0.180`, React Three Fiber `9.6.1`, Drei `10.7.7`.
- Renderer : WebGL antialiasé, DPR plafonné à `1.7`, ombres PCF soft.
- Tone mapping initial : ACES, exposition `1.03`. L’espace de sortie n’était pas déclaré explicitement.
- Le matériau GLB principal était jaune pâle, métallique à `0.50` et `doubleSided`. Le second était noir et métallique à `0.87`.
- Le code remplaçait ces matériaux, mais déclarait le corps, le voile et la signature avec `transparent: true`. Les modèles secondaires descendaient à `opacity: 0.34` et perdaient aussi leur `depthWrite`.
- La porcelaine utilisait une rugosité de `0.42`, un clearcoat peu lisible et une rugosité de clearcoat de `0.72` : combinaison proche du plâtre mat.
- L’ambiante à `0.9`, ajoutée à plusieurs sources fortes, éclairait trop uniformément la forme. Le fond et le corps avaient presque la même valeur.
- L’environnement procédural existait déjà, mais ses grands panneaux se lisaient peu sur les matériaux trop mats.
- Les trois bases étaient déjà recalées avec la bounding box réelle sur `Y = 0`.

La cause principale de l’aspect fantomatique était donc matérielle et scénique : transparence volontaire des instances, suppression du depth writing, contraste fond/ivoire insuffisant et lumière trop frontale. La géométrie n’était pas la cause première.

## Contenu vérifié du GLB

- `scarf` : voile peint, 9 932 sommets, normales présentes.
- `cap` : tête-bouchon, 19 110 sommets, normales et UV présents.
- `body` : corps, jambes et socle dans un même mesh, 10 207 sommets, normales et UV présents.
- `body.001` : plaque de signature presque plane placée devant le socle, et non le socle.

Les normales sont présentes sur toutes les pièces. Les coutures de normales les plus nombreuses se situent sur `cap`; beaucoup correspondent aux coutures topologiques ou UV. Aucune normale n’est recalculée à l’exécution.

## Calibration retenue

- Tone mapping : ACES Filmic, conservé après comparaison avec AgX car il maintient un ivoire plus lumineux et un rubis moins désaturé sur cette scène.
- Exposition : `1.05`.
- Porcelaine : ivoire `#F4EAD9`, roughness `0.24`, IOR `1.5`, specular intensity `0.78`, clearcoat `0.22`, clearcoat roughness `0.14`, environnement `1.18`, metalness `0`, transmission `0`.
- Rouge Bordeaux : `#82142A`, roughness `0.165`, clearcoat `0.48`, clearcoat roughness `0.095`, environnement `1.16`.
- Toutes les pièces produit sont opaques, écrivent dans le depth buffer et restent non métalliques.
- Aucune microtexture n’a été retenue : à la distance normale, elle n’améliorait pas objectivement la référence et aurait ajouté un coût mobile inutile.

## Lumière et ombres

- Grand panneau chaud à gauche pour le modelé et le reflet principal.
- Panneau froid à droite, environ trois fois moins intense.
- Remplissage frontal large et faible.
- Bande supérieure et rim arrière discrets.
- Directionnelle chaude dédiée à l’ombre longue, vers la droite et l’arrière.
- Spot doux quasi vertical dédié au contact sous les socles.
- Sol physique distinct du fond et recevant les deux niveaux d’ombre.

## Limites réellement géométriques

Le rendu corrige la présence physique, la glaçure, les plis, la séparation du fond et l’ancrage. Les points suivants nécessiteraient Blender pour progresser sans artifice :

- séparer le socle de `body` afin de lui attribuer une glaçure légèrement moins brillante ;
- vérifier les coutures de normales du bouchon et préserver les coutures UV lors de toute correction ;
- nommer `body.001` en `signature` et lui donner un très léger décalage propre pour éviter tout risque de z-fighting ;
- affiner, si la photographie doit être suivie plus littéralement, les détails du visage, les mèches, les doigts, les pieds et certains plis du voile ;
- contrôler la jonction tête-bouchon dans Blender : son ombre doit provenir du raccord réel, jamais d’une ligne peinte.

Le GLB original reste inchangé.
