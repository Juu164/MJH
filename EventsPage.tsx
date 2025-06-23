import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, List as ListIcon, LayoutGrid } from 'lucide-react';
import { NeonButton } from './NeonButton';
import { NeonCard } from './NeonCard';
import { NeonBadge } from './NeonBadge';
import { useEvents, Event as EventType } from './useEvents';
import { useNavigate, useParams } from 'react-router-dom';
import { EventFormModal } from './EventFormModal';
import { FixedSizeList as List } from 'react-window';
import { useDisplayMode } from './useDisplayMode';

export function EventsPage() {
  const { events } = useEvents();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId?: string }>();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [mode, setMode] = useDisplayMode();

  useEffect(() => {
    if (eventId) {
      const ev = events.find(e => e.id === eventId);
      if (ev) {
        setEditingEvent(ev);
        setShowModal(true);
      }
    }
  }, [eventId, events]);

  const resetForm = () => {
    setEditingEvent(null);
    setShowModal(false);
    navigate('/concerts');
  };

  const getTypeBadge = (type: EventType['type']) => {
    const labels = {
      gig: 'Concert',
      rehearsal: 'Répétition',
    };

    const color = type === 'gig' ? 'primary' : 'accent';

    return <NeonBadge color={color}>{labels[type]}</NeonBadge>;
  };

  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Concerts & Événements</h1>
          <p className="text-gray-600">
            Planifiez et gérez vos concerts, répétitions et auditions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode('list')}
            aria-label="Vue liste"
            className={`p-2 border rounded-lg ${mode === 'list' ? 'bg-primary text-white' : 'bg-white'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMode('grid')}
            aria-label="Vue grille"
            className={`p-2 border rounded-lg ${mode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <NeonButton
            onClick={() => {
              setEditingEvent(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvel événement</span>
          </NeonButton>
        </div>
      </div>

      {mode === 'list' ? (
        <List height={600} width="100%" itemCount={sortedEvents.length} itemSize={170}>
          {({ index, style }) => {
            const event = sortedEvents[index];
            const isPast = new Date(event.date) < new Date();
            return (
              <div style={style} className="p-2">
                <NeonCard className={`${isPast ? 'opacity-75' : ''}`}>
                  <h3 className="text-lg font-semibold text-dark mb-2">{event.title}</h3>
                  <div className="flex items-center space-x-2 mb-4">{getTypeBadge(event.type)}</div>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      à {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </NeonCard>
              </div>
            );
          }}
        </List>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEvents.map(event => {
            const isPast = new Date(event.date) < new Date();
            return (
              <NeonCard key={event.id} className={`concert-grid-card ${isPast ? 'opacity-75' : ''}`}>
                <h3 className="text-lg font-semibold text-dark mb-2">{event.title}</h3>
                <div className="flex items-center space-x-2 mb-4">{getTypeBadge(event.type)}</div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    à {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </NeonCard>
            );
          })}
        </div>
      )}
      {showModal && (
        <EventFormModal event={editingEvent || undefined} onClose={resetForm} />
      )}

    </div>
  );
}