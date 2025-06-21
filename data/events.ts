export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'rehearsal' | 'gig';
  location: string;
}

export const events: CalendarEvent[] = [
  { id: '1', title: 'Répétition générale', date: '2024-06-21', time: '19:00', type: 'rehearsal', location: 'Local de répétition' },
  { id: '2', title: 'Concert au parc', date: '2024-06-22', time: '20:00', type: 'gig', location: 'Parc Central' },
  { id: '3', title: "Concert d'été", date: '2024-06-28', time: '21:00', type: 'gig', location: 'Salle des Fêtes' },
];
