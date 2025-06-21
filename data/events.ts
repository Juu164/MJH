export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  description?: string;
  type: 'rehearsal' | 'gig';
  location: string;
}

export const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Répétition de printemps',
    date: '2025-03-15',
    time: '18:00',
    type: 'rehearsal',
    location: 'Studio A'
  },
  {
    id: '2',
    title: 'Répétition générale',
    date: '2025-05-20',
    time: '19:30',
    type: 'rehearsal',
    location: 'Local de répétition'
  },
  {
    id: '3',
    title: 'Répétition acoustique',
    date: '2025-09-10',
    time: '17:00',
    type: 'rehearsal',
    location: 'Studio B'
  },
  {
    id: '4',
    title: 'Concert au parc',
    date: '2025-07-01',
    time: '20:00',
    type: 'gig',
    location: 'Parc Central'
  },
  {
    id: '5',
    title: "Festival d'été",
    date: '2025-08-15',
    time: '21:00',
    type: 'gig',
    location: 'Grand Théâtre'
  },
  {
    id: '6',
    title: 'Jam du jour',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    type: 'rehearsal',
    location: 'Studio C'
  }
];
