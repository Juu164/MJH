export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'rehearsal' | 'gig';
  venue: string;
}

export const events: CalendarEvent[] = [
  { id: '1', title: 'Répétition générale', date: '2024-06-21', type: 'rehearsal', venue: 'Local de répétition' },
  { id: '2', title: 'Concert au parc', date: '2024-06-22', type: 'gig', venue: 'Parc Central' },
  { id: '3', title: "Concert d'été", date: '2024-06-28', type: 'gig', venue: 'Salle des Fêtes' },
];
