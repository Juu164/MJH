# Module Facturation

## Formules
- **Montant TTC = Montant HT + (Montant HT × Taux TVA / 100)**
- **Montant HT = Montant TTC / (1 + Taux TVA / 100)**
- **TVA = Montant TTC - Montant HT**

## Navigation facture
Trois boutons figurent en tête de page :
- **Créer facture** ouvre le formulaire vierge.
- **Factures non acquittées** affiche uniquement les factures à régler.
- **Factures acquittées** montre celles déjà payées.
Au chargement, seul le formulaire est visible et les listes sont cachées.
Changer de bouton recharge dynamiquement la liste sans rechargement complet.
Chaque facture possède un bouton pour modifier son statut `isPaid` sauvegardé dans `localStorage`.

## Taux de TVA disponibles
- 0 % – opérations exonérées
- 2,1 % – médicaments remboursables
- 5,5 % – produits et services essentiels
- 10 % – restauration et travaux
- 20 % – taux normal
Une option « * » dans le sélecteur affiche ces explications au survol.

## Tests manuels
1. **Calcul HT/TTC** : saisir un montant HT puis choisir un taux de TVA ; le TTC se met à jour (et inversement).
2. **Affichage conditionnel** : au chargement, seul le formulaire doit être visible. Cliquer sur « Factures non acquittées » ou « Factures acquittées » affiche la liste correspondante.
3. **Navigation** : ouvrir le menu ☰, choisir un onglet avec la souris ou le clavier, vérifier que la page change sans rechargement.
4. **Impression** : cliquer sur « Prévisualiser » puis « Imprimer » pour contrôler le rendu A4.
