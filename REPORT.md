# Module Facturation

## Formules
- **Montant TTC = Montant HT + (Montant HT × Taux TVA / 100)**
- **Montant HT = Montant TTC / (1 + Taux TVA / 100)**
- **TVA = Montant TTC - Montant HT**

## Statuts
Les factures sont enregistrées en localStorage avec un champ `isPaid` indiquant si elles sont acquittées. L'interface présente deux onglets :
- **Factures non acquittées** – nouvelles factures et celles marquées non réglées.
- **Factures acquittées** – après clic sur « Marquer comme acquittée ».
L'action est réversible via le même bouton.

## Tests manuels
1. **Calcul HT/TTC** : saisir un montant HT puis choisir un taux de TVA ; le montant TTC se met à jour. Saisir ensuite le TTC pour vérifier que le HT est recalculé.
2. **Changement de statut** : créer une facture, elle apparaît dans l'onglet *Non acquittée*. Utiliser le bouton pour la marquer acquittée puis vérifier qu'elle change d'onglet.
3. **Menu déroulant** : ouvrir/fermer le bouton ☰ placé avant « Tableau de bord » puis accéder à Administration → Factures.
4. **Impression** : cliquer sur « Prévisualiser » puis « Imprimer » et vérifier le rendu papier (format A4).
