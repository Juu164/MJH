import React from 'react';
import { Event } from './useEvents';

interface Props {
  event: Event;
  onClose: () => void;
}

export function EventModal({ event, onClose }: Props) {
  const downloadIcs = () => {
    const start = `${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00`;
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${start}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-3 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
        <p className="text-sm mb-2">
          {event.location} - {event.time}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm underline"
        >
          Itinéraire Google Maps
        </a>
        <button onClick={downloadIcs} className="block mt-2 text-primary text-sm underline">
          Exporter .ics
        </button>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-primary text-white px-4 py-2 rounded-lg">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
