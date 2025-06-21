import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import { useEvents, Event } from './useEvents';
import { useApp } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { EventFormModal } from './EventFormModal';
import { AddEventModal } from './AddEventModal';

export function CalendarPage() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const { events } = useEvents();
  const [selected, setSelected] = useState<EventApi | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [creatingDate, setCreatingDate] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-6">Calendrier</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="fr"
        dayCellContent={(arg) => {
          const dateStr = arg.date.toISOString().split('T')[0];
          return (
            <div className="day-cell h-full">
              <button
                type="button"
                onClick={() => setCreatingDate(dateStr)}
                className="add-slot-btn flex items-center justify-center text-xs opacity-50 hover:opacity-100"
              >
                +
              </button>
              <span>{arg.dayNumberText}</span>
            </div>
          );
        }}
        events={events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          backgroundColor: e.type === 'rehearsal' ? '#60A5FA' : '#A78BFA',
          borderColor: e.type === 'rehearsal' ? '#60A5FA' : '#A78BFA',
          extendedProps: {
            location: e.location,
            time: e.time,
            endTime: e.endTime,
            description: e.description,
            type: e.type,
          }
        }))}
        eventClick={(info) => setSelected(info.event)}
        eventDidMount={(info) => {
          info.el.addEventListener('dblclick', () => {
            const ev = events.find(e => e.id === info.event.id);
            if (ev) {
              setEditingEvent(ev);
            }
          });
        }}
        height="auto"
      />
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-dark mb-2">{selected.title}</h2>
            <p className="text-sm mb-2">
              {selected.extendedProps.location} - {selected.extendedProps.time}
              {selected.extendedProps.endTime ? ` - ${selected.extendedProps.endTime}` : ''}
            </p>
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
            <button
              className="block mt-1 text-primary text-sm underline"
              onClick={() => {
                if (selected) {
                  const id = selected.id;
                  setSelected(null);
                  dispatch({ type: 'SET_TAB', payload: 'concerts' });
                  navigate(`/concerts/${id}`);
                }
              }}
            >
              Voir l'événement
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
      {editingEvent && (
        <EventFormModal event={editingEvent} onClose={() => setEditingEvent(null)} />
      )}
      {creatingDate && (
        <AddEventModal date={creatingDate} onClose={() => setCreatingDate(null)} />
      )}
    </div>
  );
}
