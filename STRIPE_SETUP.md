# Stripe Checkout — boutique de Noël (configuration avant lancement)

Cette branche ajoute la page `/{locale}/boutique-noel` et l'API `/api/stripe/checkout`.

## Actions manuelles indispensables

1. Créer/activer le compte Stripe de DYANE PARIS et vérifier identité, société, compte bancaire et restrictions applicables aux boissons alcoolisées.
2. Dans Stripe, créer un **shipping rate** fixe pour la France et récupérer `shr_...` ; confirmer frais d'expédition, TVA et politique de livraison avant toute activation publique.
3. Dans Vercel, ajouter les variables **serveur** `STRIPE_SECRET_KEY=sk_test_...`, `STRIPE_SHIPPING_RATE_ID=shr_...`, et `NEXT_PUBLIC_SITE_URL=https://www.dyaneparis.com` (ou URL de prévisualisation durant les tests).
4. Déployer la branche en prévisualisation puis tester les cartes Stripe de test, les échecs, l'annulation, l'adresse, la livraison et la confirmation dans le Dashboard Stripe.
5. Avant mise en production : conditions générales de vente, politique de remboursement, livraison, obligation légale de vérification de l'âge et conformité réglementaire alcool ; vérifier les prix TTC et la taxe applicable.
6. La confirmation d'une commande doit se faire à partir de Stripe (événement `checkout.session.completed` / état `payment_status=paid`), **jamais depuis le seul paramètre `success`**. Brancher un webhook vérifié et un système de traitement des commandes avant d'exploiter les commandes réelles.
7. Ne passer à `sk_live_...` qu'après validation de toute la chaîne. Ne jamais committer les clés Stripe ni les exposer dans `NEXT_PUBLIC_*`.

Les montants codés côté serveur sont 55,00 € pour 25 cl et 185,00 € pour 1,5 L, pour No.1 rouge et No.2 vert. Quantité 1 par commande pour l'instant. L'interface est volontairement provisoire : remplacer les cartes par des photographies approuvées et harmoniser avec la direction artistique Dyane Paris avant lancement.
