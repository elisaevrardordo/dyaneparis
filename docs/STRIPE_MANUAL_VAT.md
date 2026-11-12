# TVA manuelle dans Checkout

Pour Dyane No.1 et Dyane No.2 en 25 cl et 1,5 L, Stripe applique une TVA de 20 % comprise dans le prix. Teo for Dyane reste traité par la Conciergerie et peut être présent dans le même panier sans être inclus dans la commande en ligne des cocktails.

Configurez côté serveur `STRIPE_MANUAL_VAT_FR` et `STRIPE_MANUAL_VAT_MC`. En production, utilisez les deux taux du compte Stripe réel. En prévisualisation, utilisez les taux homologues du compte de test. Les taux doivent être actifs, inclusifs, à 20 %, et associés respectivement aux pays FR et MC. La clé Stripe doit permettre de lire ces taux. Checkout réel reste soumis à ses contrôles de disponibilité habituels, notamment le compte, la base, le secret de notification et l’autorisation d’ouverture.

Le taux est appliqué aux articles et à la ligne de port après validation de l’adresse. Au-dessus de 200 € de sous-total TTC par commande, il n’y a pas de ligne de port payante. Stripe Tax et la collecte de numéros de TVA ne sont pas activés dans ce parcours de vente au détail. Le contrôle de commande utilise les montants et taux renvoyés par Stripe et ignore la ligne de port pour le stock. Il conserve la TVA réellement calculée par Stripe.

| Exemple testé sur Stripe, sans débit | Total TTC | Dont TVA |
|---|---:|---:|
| Cocktail à 55 € + port France à 15 € | 70,00 € | 11,67 € |
| Cocktail à 55 € + port Monaco à 20 € | 75,00 € | 12,50 € |
| Cocktail à 185 € + port Monaco à 20 € | 205,00 € | 34,16 € |
| 4 cocktails à 55 € + port offert | 220,00 € | 36,67 € |

Le cas à 205 € illustre l’arrondi ligne par ligne. Un arrondi sur le total par taux donne 34,17 €, sans modifier le total TTC. Ne changez pas le réglage de facturation général pour ajuster un seul cas. Vérifiez la facture PDF et la confirmation de commande dans la prévisualisation de test avant d’ouvrir les paiements réels. Contrôlez également le changement d’adresse France ↔ Monaco, l’expiration de session et le rejet d’une adresse hors zone dans le navigateur.

Sources : [taux et arrondis Stripe](https://docs.stripe.com/tax/tax-rates#rounding), [frais de transport accessoires, BOFiP §140](https://bofip.impots.gouv.fr/bofip/705-PGP.html/identifiant=BOI-TVA-BASE-10-20-10-20220629).
