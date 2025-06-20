import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import { events } from './data/events';

export function CalendarPage() {
  const [selected, setSelected] = useState<EventApi | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-6">Calendrier</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="fr"
        events={events.map(e => ({
          title: e.title,
          date: e.date,
          backgroundColor: e.type === 'rehearsal' ? '#bfdbfe' : '#c4b5fd',
          borderColor: e.type === 'rehearsal' ? '#bfdbfe' : '#c4b5fd',
          extendedProps: { location: e.location, type: e.type }
        }))}
        eventClick={(info) => setSelected(info.event)}
        height="auto"
      />
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-dark mb-2">{selected.title}</h2>
            <p className="text-sm mb-2">{selected.extendedProps.location}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.extendedProps.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline"
            >
              Voir sur Google Maps
            </a>
            <button
              className="block mt-2 text-primary text-sm underline"
              onClick={() => {}}
            >
              Voir tous les membres dispo
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
