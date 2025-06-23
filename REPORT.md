# Rapport Sprint UX & Fonctionnalités

## Modifications clés
- Navigation repensée avec un seul bouton ☰ ouvrant un panneau vertical. L'onglet actif est sur fond `#E0F2FF` avec texte `#0369A1`.
- Allègement visuel : padding des cartes réduit à `p-3`, suppression des ombres inutiles.
- Nouvelle interface de facturation `InvoiceWizard` en 5 étapes avec options avancées pour le client.
- Ajout des rôles `Leader`/`Membre` et contrôle des droits (suppression de créneau réservée au leader).
- Système de notifications amélioré avec page dédiée.
- Vue agenda automatique sous 600 px et tableaux scrollables.
- Export `.ics` et lien Google Maps dans la modale d'événement.
- Gestion du quota de stockage (1 Go) avec alerte à 90 %.

## Composants créés
- `Header` / `NavMenu` revu
- `InvoiceWizard`
- `AgendaView`
- `EventModal`
- `NotificationsPage`

## Tests manuels
1. **Navigation** : cliquer sur ☰, changer d’onglet, vérifier le surlignage bleu.
2. **Rôles** : se connecter en membre et constater l’absence de bouton de suppression des créneaux.
3. **Facturation** : suivre les étapes du wizard, tester l’accordéon Options avancées, vérifier les calculs HT/TTC et l’impression.
4. **Mobile** : réduire la fenêtre sous 600 px, le calendrier devient une liste agenda et les tableaux se scrollent horizontalement.
5. **Notifications** : cliquer sur la cloche, consulter le panneau puis la page complète.
6. **Export .ics** : dans la modale d’événement, utiliser « Exporter .ics » puis vérifier l’ajout dans son agenda personnel. Tester également le lien Itinéraire.
7. **Quota documents** : envoyer des fichiers jusqu’à approcher 1 Go et vérifier l’alerte rouge à 90 %.
