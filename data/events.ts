export interface CalendarEvent {
  date: string;
  type: 'rehearsal' | 'gig';
  title: string;
  location: string;
}

export const events: CalendarEvent[] = [
  { date: '2024-06-21', type: 'rehearsal', title: 'Répétition générale', location: 'Local de répétition' },
  { date: '2024-06-28', type: 'gig', title: 'Concert d\'été', location: 'Salle des Fêtes' },
];
