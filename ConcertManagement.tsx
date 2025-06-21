import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { useEvents, Event as EventType } from './useEvents';
import { useNavigate, useParams } from 'react-router-dom';
import { EventFormModal } from './EventFormModal';

export function ConcertManagement() {
  const { events, deleteEvent } = useEvents();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId?: string }>();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

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

  const handleEdit = (ev: EventType) => {
    setEditingEvent(ev);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) {
      deleteEvent(id);
    }
  };


  const getTypeBadge = (type: EventType['type']) => {
    const styles = {
      gig: 'bg-primary/10 text-primary',
      rehearsal: 'bg-accent/20 text-accent',
    };

    const labels = {
      gig: 'Concert',
      rehearsal: 'Répétition',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
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
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel événement</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedEvents.map((event) => {
          const isPast = new Date(event.date) < new Date();

          return (
            <div
              key={event.id}
              className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow ${
                isPast ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeBadge(event.type)}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} à {event.time}
                </div>

                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
              </div>
            </div>
          );
        })}
      {showModal && (
        <EventFormModal event={editingEvent || undefined} onClose={resetForm} />
      )}
      </div>

    </div>
  );
}