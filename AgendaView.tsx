import React from 'react';
import { Event } from './useEvents';

export function AgendaView({ events }: { events: Event[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return (
    <ul className="space-y-3">
      {sorted.map(ev => (
        <li key={ev.id} className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="font-semibold text-dark">{ev.title}</div>
          <div className="text-sm text-gray-600">
            {new Date(ev.date).toLocaleDateString('fr-FR')} {ev.time}
          </div>
          <div className="text-sm text-gray-600">{ev.location}</div>
        </li>
      ))}
    </ul>
  );
}
