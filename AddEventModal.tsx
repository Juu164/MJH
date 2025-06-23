import React, { useState } from 'react';
import { useEvents } from './useEvents';

interface AddEventModalProps {
  date: string;
  onClose: () => void;
}

export function AddEventModal({ date, onClose }: AddEventModalProps) {
  const { createEvent } = useEvents();
  const [form, setForm] = useState({
    title: '',
    date,
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    type: 'rehearsal' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent({
      title: form.title,
      date: form.date,
      time: form.startTime,
      endTime: form.endTime,
      location: form.location,
      description: form.description,
      type: form.type,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-3 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-dark mb-6">Nouvel événement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  checked={form.type === 'rehearsal'}
                  onChange={() => setForm({ ...form, type: 'rehearsal' })}
                />
                <span>Répétition</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  checked={form.type === 'gig'}
                  onChange={() => setForm({ ...form, type: 'gig' })}
                />
                <span>Concert</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-dark font-medium">
              Annuler
            </button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
