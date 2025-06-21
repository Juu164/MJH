import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { useEvents, Event as EventType } from './useEvents';

export function ConcertManagement() {
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'rehearsal' as EventType['type'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
    };

    if (editingEvent) {
      updateEvent({ ...editingEvent, ...data });
    } else {
      createEvent(data);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'rehearsal',
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleEdit = (ev: EventType) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      type: ev.type,
    });
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
          onClick={() => setShowModal(true)}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType['type'] })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="rehearsal">Répétition</option>
                    <option value="gig">Concert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>



              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-dark font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {editingEvent ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}