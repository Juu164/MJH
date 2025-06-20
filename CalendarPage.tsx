import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import { events } from './data/events';
import { useApp } from './AppContext';

export function CalendarPage() {
  const { dispatch } = useApp();
  const [selected, setSelected] = useState<EventApi | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-6">Calendrier</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="fr"
        events={events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          backgroundColor: e.type === 'rehearsal' ? '#60A5FA' : '#A78BFA',
          borderColor: e.type === 'rehearsal' ? '#60A5FA' : '#A78BFA',
          extendedProps: { venue: e.venue, type: e.type }
        }))}
        eventClick={(info) => setSelected(info.event)}
        height="auto"
      />
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-dark mb-2">{selected.title}</h2>
            <p className="text-sm mb-2">{selected.extendedProps.venue}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.extendedProps.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline"
            >
              Voir sur Google Maps
            </a>
            <button
              className="block mt-2 text-primary text-sm underline"
              onClick={() => {
                if (selected) {
                  const date = selected.startStr;
                  setSelected(null);
                  dispatch({ type: 'SET_TAB', payload: 'availability' });
                  setTimeout(() => {
                    const el = document.getElementById(`avail-${date}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
            >
              Voir disponibilités
            </button>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelected(null)}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
