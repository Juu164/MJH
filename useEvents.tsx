import React, { createContext, useContext, useState, ReactNode } from 'react';
import { events as initialEvents, CalendarEvent } from './data/events';

export type Event = CalendarEvent;

interface EventsContextProps {
  events: Event[];
  createEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const createEvent = (data: Omit<Event, 'id'>) => {
    const newEvent: Event = { id: Math.random().toString(36).slice(2, 9), ...data };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updated: Event) => {
    setEvents(prev => prev.map(e => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EventsContext.Provider value={{ events, createEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
