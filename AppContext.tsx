import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User, Availability, Concert, Contact } from '../types';

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_TAB'; payload: AppState['currentTab'] }
  | { type: 'ADD_AVAILABILITY'; payload: Availability }
  | { type: 'UPDATE_AVAILABILITY'; payload: Availability }
  | { type: 'ADD_CONCERT'; payload: Concert }
  | { type: 'UPDATE_CONCERT'; payload: Concert }
  | { type: 'DELETE_CONCERT'; payload: string }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'UPDATE_USER'; payload: User };

// Mock data
const mockUsers: User[] = [
  { id: '1', email: 'admin@calzik.fr', name: 'Marie Dupont', instrument: 'Guitare', role: 'admin', isActive: true },
  { id: '2', email: 'pierre@calzik.fr', name: 'Pierre Martin', instrument: 'Batterie', role: 'member', isActive: true },
  { id: '3', email: 'sophie@calzik.fr', name: 'Sophie Bernard', instrument: 'Basse', role: 'member', isActive: true },
  { id: '4', email: 'thomas@calzik.fr', name: 'Thomas Petit', instrument: 'Clavier', role: 'member', isActive: true },
];

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Salle des Fêtes',
    type: 'salle',
    email: 'contact@salledesfetes.fr',
    phone: '01 23 45 67 89',
    address: '12 Place de la Mairie',
    city: 'Lyon',
    postalCode: '69000',
    notes: 'Capacité 200 personnes, sono incluse'
  },
  {
    id: '2',
    name: 'Festival Rock en Stock',
    type: 'festival',
    email: 'programmation@rockenstock.fr',
    phone: '04 56 78 90 12',
    address: '45 Avenue de la Musique',
    city: 'Marseille',
    postalCode: '13000',
    notes: 'Festival annuel, programmation mars-avril'
  }
];

const mockConcerts: Concert[] = [
  {
    id: '1',
    title: 'Concert de Noël',
    date: '2025-12-15',
    time: '20:00',
    venue: 'Salle des Fêtes',
    contactId: '1',
    type: 'concert',
    status: 'confirmed',
    description: 'Concert de fin d\'année',
    createdBy: '1'
  },
  {
    id: '2',
    title: 'Répétition générale',
    date: '2025-12-12',
    time: '19:00',
    venue: 'Local de répétition',
    type: 'repetition',
    status: 'confirmed',
    description: 'Dernière répétition avant le concert',
    createdBy: '1'
  }
];

const mockAvailabilities: Availability[] = [
  { id: '1', userId: '1', date: '2025-12-12', timeSlot: '19:00-22:00', isAvailable: true },
  { id: '2', userId: '2', date: '2025-12-12', timeSlot: '19:00-22:00', isAvailable: true },
  { id: '3', userId: '3', date: '2025-12-12', timeSlot: '19:00-22:00', isAvailable: false },
  { id: '4', userId: '4', date: '2025-12-12', timeSlot: '19:00-22:00', isAvailable: true },
];

const initialState: AppState = {
  currentUser: null,
  users: mockUsers,
  availabilities: mockAvailabilities,
  concerts: mockConcerts,
  contacts: mockContacts,
  currentTab: 'dashboard'
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null, currentTab: 'dashboard' };
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'ADD_AVAILABILITY':
      return {
        ...state,
        availabilities: [...state.availabilities, action.payload]
      };
    case 'UPDATE_AVAILABILITY':
      return {
        ...state,
        availabilities: state.availabilities.map(a =>
          a.id === action.payload.id ? action.payload : a
        )
      };
    case 'ADD_CONCERT':
      return {
        ...state,
        concerts: [...state.concerts, action.payload]
      };
    case 'UPDATE_CONCERT':
      return {
        ...state,
        concerts: state.concerts.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CONCERT':
      return {
        ...state,
        concerts: state.concerts.filter(c => c.id !== action.payload)
      };
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [...state.contacts, action.payload]
      };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(c => c.id !== action.payload)
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u =>
          u.id === action.payload.id ? action.payload : u
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}