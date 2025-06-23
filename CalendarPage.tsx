import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import { useEvents, Event } from './useEvents';
import { useApp } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { EventFormModal } from './EventFormModal';
import { AddEventModal } from './AddEventModal';
import { AgendaView } from './AgendaView';
import { EventModal } from './EventModal';

export function CalendarPage() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const { events } = useEvents();
  const [selected, setSelected] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [creatingDate, setCreatingDate] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-6">Calendrier</h1>
      {!isMobile && (
        <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="fr"
        dayCellContent={(arg) => {
          const dateStr = arg.date.toISOString().split('T')[0];
          return (
            <div className="h-full">
              <button
                type="button"
                onClick={() => setCreatingDate(dateStr)}
                className="p-1 rounded hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {arg.dayNumberText}
              </button>
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
        eventClick={(info) => {
          const ev = events.find(e => e.id === info.event.id);
          if (ev) setSelected(ev);
        }}
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
      )}
      {isMobile && <AgendaView events={events} />}
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      {editingEvent && (
        <EventFormModal event={editingEvent} onClose={() => setEditingEvent(null)} />
      )}
      {creatingDate && (
        <AddEventModal date={creatingDate} onClose={() => setCreatingDate(null)} />
      )}
    </div>
  );
}
