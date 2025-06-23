# MJH

Application de gestion pour le groupe de musique CalZik. Elle permet de suivre les concerts, les disponibilités des membres et de gérer les factures.

## Installation

```
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Navigation

La barre de navigation donne accès aux différentes pages :

- **Tableau de bord** – aperçu général
- **Disponibilités** – plannings des membres
- **Calendrier** – événements à venir
- **Concerts** – gestion des concerts
- **Contacts** – répertoire de contacts
- **Pense-Bête** – prise de notes rapide
- **Documents** – partage de fichiers
- **Administration** – options réservées aux administrateurs

La page *Factures* reste accessible mais n’apparaît plus dans le menu.

## Factures et rappels

Les factures créées sont conservées dans l'IndexedDB du navigateur (via localForage). Un rappel s’affiche automatiquement lorsqu’une facture non acquittée dépasse 30 jours après la date de prestation. Marquer une facture comme payée supprime la notification correspondante.

## Tests

L'application utilise Vitest.

```bash
npm test
```

## Progressive Web App

Une configuration PWA permet d'installer l'application pour un accès hors-ligne.

