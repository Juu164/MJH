import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { useApp } from './AppContext';
import { Availability } from '../types';
import { Role } from './roles';
import { MemberAvailabilityRow, ConfirmationsState } from './MemberAvailabilityRow';

export function AvailabilityCalendar() {
  const { state, dispatch } = useApp();
  const { availabilities, users, currentUser } = state;
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: selectedDate,
    start: '',
    end: ''
  });


  const [dateSlots, setDateSlots] = useState<Record<string, { start: string; end: string }[]>>({});
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [dateSlotForm, setDateSlotForm] = useState<{ start: string; end: string; index: number }>({ start: '', end: '', index: -1 });

  const [confirmations, setConfirmations] = useState<ConfirmationsState>({});

  const getNext30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };


  const handleSaveDateSlot = () => {
    if (!editingDate) return;
    const slots = dateSlots[editingDate] || [];
    if (dateSlotForm.index === -1) {
      setDateSlots({
        ...dateSlots,
        [editingDate]: [...slots, { start: dateSlotForm.start, end: dateSlotForm.end }]
      });
    } else {
      const updated = [...slots];
      updated[dateSlotForm.index] = { start: dateSlotForm.start, end: dateSlotForm.end };
      setDateSlots({ ...dateSlots, [editingDate]: updated });
    }
    setEditingDate(null);
    setDateSlotForm({ start: '', end: '', index: -1 });
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const timeSlot = `${availabilityForm.start}-${availabilityForm.end}`;
    if (editingAvailability) {
      dispatch({
        type: 'UPDATE_AVAILABILITY',
        payload: {
          ...editingAvailability,
          date: availabilityForm.date,
          timeSlot
        }
      });
    } else {
      dispatch({
        type: 'ADD_AVAILABILITY',
        payload: {
          id: Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          date: availabilityForm.date,
          timeSlot,
          isAvailable: true
        }
      });
    }
    setShowModal(false);
    setEditingAvailability(null);
    setAvailabilityForm({ date: selectedDate, start: '', end: '' });
  };

  const days = getNext30Days();
  const userSlots = availabilities
    .filter(a => a.userId === currentUser?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Disponibilités</h1>
          <p className="text-gray-600">
            Gérez vos disponibilités et consultez celles du groupe
          </p>
        </div>
      </div>

      {userSlots.length > 0 && (
        <div className="mb-8 space-y-2">
          {userSlots.map(slot => (
            <div
              key={slot.id}
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex justify-between items-center"
            >
              <span className="text-sm font-medium text-dark">
                {new Date(slot.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long'
                })}
                {' \u2022 '}
                {slot.timeSlot.replace('-', ' – ')}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingAvailability(slot);
                    const [start, end] = slot.timeSlot.split('-');
                    setAvailabilityForm({ date: slot.date, start, end });
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {currentUser?.role === Role.Leader && (
                  <button
                    onClick={() => dispatch({ type: 'DELETE_AVAILABILITY', payload: slot.id })}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}



      {/* Legend */}
      <div className="bg-white rounded-xl p-3 border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Légende</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success rounded" />
            <span className="text-sm text-gray-600">100% disponibles</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded" />
            <span className="text-sm text-gray-600">80%+ disponibles</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent/80 rounded" />
            <span className="text-sm text-gray-600">50-79% disponibles</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent/60 rounded" />
            <span className="text-sm text-gray-600">1-49% disponibles</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded" />
            <span className="text-sm text-gray-600">Aucun disponible</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {days.map(date => {
                const dateObj = new Date(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                const custom = dateSlots[date] || [];
                const total = users.filter(u => u.isActive).length;

                return (
                  <React.Fragment key={date}>
                    <tr id={`avail-${date}`} className={isToday ? 'bg-primary/5' : ''}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-dark">
                          {dateObj.toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        {isToday && (
                          <div className="text-xs text-primary font-medium">Aujourd'hui</div>
                        )}
                        <button
                          onClick={() => {
                            setEditingDate(date);
                            setDateSlotForm({ start: '', end: '', index: -1 });
                          }}
                          className="mt-1 flex items-center space-x-1 text-primary text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Créneau perso</span>
                        </button>
                      </td>
                      {/* fixed time slots removed */}
                   </tr>
                    {custom.map((slot, idx) => {
                      const slotId = `${slot.start}-${slot.end}`;
                      const availableCount = users.filter(u => confirmations[date]?.[slotId]?.[u.id]).length;
                      return (
                        <React.Fragment key={slotId}>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-1" />
                            <td colSpan={1} className="px-4 py-1 flex justify-between items-center text-sm">
                              <span>
                                {slot.start} – {slot.end}
                                <span className="ml-2 text-xs text-gray-500">({availableCount}/{total} disponibles)</span>
                              </span>
                              <span className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingDate(date);
                                    setDateSlotForm({ start: slot.start, end: slot.end, index: idx });
                                  }}
                                  className="p-1 text-gray-500 hover:text-primary"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {currentUser?.role === Role.Leader && (
                                  <button
                                    onClick={() => {
                                      const updated = (dateSlots[date] || []).filter((_, i) => i !== idx);
                                      setDateSlots({ ...dateSlots, [date]: updated });
                                    }}
                                    className="p-1 text-gray-500 hover:text-primary"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </span>
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-1" />
                            <td colSpan={1} className="px-4 py-1">
                              <MemberAvailabilityRow
                                members={users}
                                date={date}
                                slotId={slotId}
                                confirmations={confirmations}
                                setConfirmations={setConfirmations}
                              />
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    {editingDate === date && (
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2" />
                        <td colSpan={1} className="px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={dateSlotForm.start}
                              onChange={e => setDateSlotForm({ ...dateSlotForm, start: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-24"
                            />
                            <input
                              type="time"
                              value={dateSlotForm.end}
                              onChange={e => setDateSlotForm({ ...dateSlotForm, end: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-24"
                            />
                            <button onClick={handleSaveDateSlot} className="text-primary text-sm">Enregistrer</button>
                            <button onClick={() => setEditingDate(null)} className="text-xs text-gray-500">Annuler</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed view for selected date */}
      <div className="mt-8 bg-white rounded-xl p-3 border border-gray-100">
        <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-primary" />
          Détail des disponibilités
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner une date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* fixed time slots view removed */}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-3 w-full max-w-md">
            <h2 className="text-2xl font-bold text-dark mb-6">
              {editingAvailability ? 'Modifier la disponibilité' : 'Ajouter une disponibilité'}
            </h2>
            <form onSubmit={handleSaveAvailability} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={availabilityForm.date}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début</label>
                <input
                  type="time"
                  value={availabilityForm.start}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, start: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
                <input
                  type="time"
                  value={availabilityForm.end}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, end: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAvailability(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-dark font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}