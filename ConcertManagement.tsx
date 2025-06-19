import React, { useState } from 'react';
import { Plus, Music, Calendar, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { useApp } from './AppContext';
import { Concert } from '../types';

export function ConcertManagement() {
  const { state, dispatch } = useApp();
  const { concerts, contacts, currentUser } = state;
  const [showModal, setShowModal] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    contactId: '',
    type: 'concert' as Concert['type'],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const concertData = {
      ...formData,
      id: editingConcert?.id || Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      createdBy: currentUser.id
    };

    if (editingConcert) {
      dispatch({ type: 'UPDATE_CONCERT', payload: { ...editingConcert, ...concertData } });
    } else {
      dispatch({ type: 'ADD_CONCERT', payload: concertData });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      venue: '',
      contactId: '',
      type: 'concert',
      description: ''
    });
    setEditingConcert(null);
    setShowModal(false);
  };

  const handleEdit = (concert: Concert) => {
    setEditingConcert(concert);
    setFormData({
      title: concert.title,
      date: concert.date,
      time: concert.time,
      venue: concert.venue,
      contactId: concert.contactId || '',
      type: concert.type,
      description: concert.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) {
      dispatch({ type: 'DELETE_CONCERT', payload: id });
    }
  };

  const getStatusBadge = (status: Concert['status']) => {
    const styles = {
      pending: 'bg-accent/20 text-accent',
      confirmed: 'bg-accent/20 text-accent',
      cancelled: 'bg-primary/20 text-primary'
    };
    
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      cancelled: 'Annulé'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: Concert['type']) => {
    const styles = {
      concert: 'bg-primary/10 text-primary',
      repetition: 'bg-accent/20 text-accent',
      audition: 'bg-accent/20 text-accent'
    };
    
    const labels = {
      concert: 'Concert',
      repetition: 'Répétition',
      audition: 'Audition'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const sortedConcerts = [...concerts].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Concerts & Événements</h1>
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

      {/* Concerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedConcerts.map((concert) => {
          const contact = contacts.find(c => c.id === concert.contactId);
          const isPast = new Date(concert.date) < new Date();
          
          return (
            <div
              key={concert.id}
              className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow ${
                isPast ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {concert.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeBadge(concert.type)}
                    {getStatusBadge(concert.status)}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(concert)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(concert.id)}
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
                  {new Date(concert.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} à {concert.time}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {concert.venue}
                </div>

                {contact && (
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {contact.name} - {contact.city}
                  </div>
                )}

                {concert.description && (
                  <p className="text-gray-600 mt-3 text-sm">
                    {concert.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingConcert ? 'Modifier l\'événement' : 'Nouvel événement'}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Concert['type'] })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="concert">Concert</option>
                    <option value="repetition">Répétition</option>
                    <option value="audition">Audition</option>
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
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact associé
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Sélectionner un contact</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} - {contact.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Description de l'événement..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {editingConcert ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}