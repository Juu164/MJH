import React, { useState } from 'react';
import { Check, X, Plus, Users, Edit, Trash2 } from 'lucide-react';
import { useApp } from './AppContext';
import { Availability } from '../types';
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

  const [timeSlots, setTimeSlots] = useState<string[]>([
    '14:00-17:00',
    '17:00-20:00',
    '19:00-22:00',
    '20:00-23:00'
  ]);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [slotForm, setSlotForm] = useState({ start: '', end: '' });

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

  const getAvailabilityForSlot = (date: string, timeSlot: string) => {
    return availabilities.filter(a => a.date === date && a.timeSlot === timeSlot);
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = total > 0 ? available / total : 0;
    if (percentage === 1) return 'bg-success';
    if (percentage >= 0.8) return 'bg-accent';
    if (percentage >= 0.5) return 'bg-accent/80';
    if (percentage > 0) return 'bg-accent/60';
    return 'bg-primary';
  };

  const handleToggleAvailability = (date: string, timeSlot: string) => {
    if (!currentUser) return;

    const existing = availabilities.find(
      a => a.userId === currentUser.id && a.date === date && a.timeSlot === timeSlot
    );

    if (existing) {
      dispatch({
        type: 'UPDATE_AVAILABILITY',
        payload: { ...existing, isAvailable: !existing.isAvailable }
      });
    } else {
      dispatch({
        type: 'ADD_AVAILABILITY',
        payload: {
          id: Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          date,
          timeSlot,
          isAvailable: true
        }
      });
    }
  };

  const getUserAvailability = (date: string, timeSlot: string) => {
    if (!currentUser) return null;
    return availabilities.find(
      a => a.userId === currentUser.id && a.date === date && a.timeSlot === timeSlot
    );
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
        <button
          onClick={() => {
            setEditingAvailability(null);
            setAvailabilityForm({ date: selectedDate, start: '', end: '' });
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter disponibilité</span>
        </button>
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
                <button
                  onClick={() => dispatch({ type: 'DELETE_AVAILABILITY', payload: slot.id })}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}



      {/* Legend */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                {timeSlots.map((slot, idx) => (
                  <th key={slot} className="px-4 py-3 text-center text-sm font-medium text-gray-600 relative">
                    {editingSlotIndex === idx ? (
                      <div className="absolute left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg space-y-1 z-10">
                        <input
                          type="time"
                          value={slotForm.start}
                          onChange={(e) => setSlotForm({ ...slotForm, start: e.target.value })}
                          className="border border-gray-300 rounded w-24 mb-1 px-1"
                        />
                        <input
                          type="time"
                          value={slotForm.end}
                          onChange={(e) => setSlotForm({ ...slotForm, end: e.target.value })}
                          className="border border-gray-300 rounded w-24 mb-1 px-1"
                        />
                        <div className="flex justify-end space-x-1 text-xs">
                          <button onClick={() => { setEditingSlotIndex(null); }} className="text-gray-500">Annuler</button>
                          <button
                            onClick={() => {
                              const updated = [...timeSlots];
                              updated[idx] = `${slotForm.start}-${slotForm.end}`;
                              setTimeSlots(updated);
                              setEditingSlotIndex(null);
                            }}
                            className="text-primary"
                          >OK</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { const [s, e] = slot.split('-'); setSlotForm({ start: s, end: e }); setEditingSlotIndex(idx); }} className="hover:text-primary">
                        {slot.replace('-', ' – ')}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
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
                      {timeSlots.map(slot => {
                        const slotAvailabilities = getAvailabilityForSlot(date, slot);
                        const available = slotAvailabilities.filter(a => a.isAvailable).length;
                        const userAvailability = getUserAvailability(date, slot);

                        return (
                          <td key={slot} className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleToggleAvailability(date, slot)}
                              className="relative group w-full"
                            >
                              <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center transition-all ${
                                getAvailabilityColor(available, total)
                              } hover:scale-110`}>
                                {userAvailability?.isAvailable ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : userAvailability?.isAvailable === false ? (
                                  <X className="w-5 h-5 text-white" />
                                ) : (
                                  <Plus className="w-5 h-5 text-white opacity-70" />
                                )}
                              </div>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {available}/{total} disponibles
                              </div>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                    {custom.map((slot, idx) => {
                      const slotId = `${slot.start}-${slot.end}`;
                      const availableCount = users.filter(u => confirmations[date]?.[slotId]?.[u.id]).length;
                      return (
                        <React.Fragment key={slotId}>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-1" />
                            <td colSpan={timeSlots.length} className="px-4 py-1 flex justify-between items-center text-sm">
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
                              </span>
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-1" />
                            <td colSpan={timeSlots.length} className="px-4 py-1">
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
                        <td colSpan={timeSlots.length} className="px-4 py-2">
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
      <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-100">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeSlots.map(slot => {
            const slotAvailabilities = getAvailabilityForSlot(selectedDate, slot);
            const availableUsers = slotAvailabilities.filter(a => a.isAvailable);
            const unavailableUsers = slotAvailabilities.filter(a => !a.isAvailable);
            
            return (
              <div key={slot} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-dark mb-3">{slot}</h4>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-accent font-medium mb-1">
                      Disponibles ({availableUsers.length})
                    </p>
                    {availableUsers.map(avail => {
                      const user = users.find(u => u.id === avail.userId);
                      return (
                        <div key={avail.id} className="text-xs text-accent flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          {user?.name} ({user?.instrument})
                        </div>
                      );
                    })}
                  </div>
                  
                  <div>
                    <p className="text-xs text-primary font-medium mb-1">
                      Indisponibles ({unavailableUsers.length})
                    </p>
                    {unavailableUsers.map(avail => {
                      const user = users.find(u => u.id === avail.userId);
                      return (
                        <div key={avail.id} className="text-xs text-primary flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          {user?.name} ({user?.instrument})
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
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