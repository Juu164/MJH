export interface User {
  id: string;
  email: string;
  name: string;
  instrument: string;
  role: 'admin' | 'member';
  isActive: boolean;
}

export interface Availability {
  id: string;
  userId: string;
  date: string;
  timeSlot: string;
  isAvailable: boolean;
}

export interface Concert {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  contactId?: string;
  type: 'concert' | 'repetition' | 'audition';
  status: 'pending' | 'confirmed' | 'cancelled';
  description?: string;
  createdBy: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'salle' | 'association' | 'festival' | 'autre';
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  availabilities: Availability[];
  concerts: Concert[];
  contacts: Contact[];
  currentTab:
    | 'dashboard'
    | 'availability'
    | 'calendar'
    | 'concerts'
    | 'contacts'
    | 'ideas'
    | 'documents'
    | 'admin'
    | 'invoice';
  isDarkMode: boolean;
}