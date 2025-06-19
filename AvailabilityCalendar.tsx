import React, { useState } from 'react';
import { Check, X, Plus, Users } from 'lucide-react';
import { useApp } from './AppContext';

export function AvailabilityCalendar() {
  const { state, dispatch } = useApp();
  const { availabilities, users, currentUser } = state;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAvailability, setNewAvailability] = useState({ date: selectedDate, start: '', end: '' });

  const timeSlots = [
    '14:00-17:00',
    '17:00-20:00',
    '19:00-22:00',
    '20:00-23:00'
  ];

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

  const handleAddAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const timeSlot = `${newAvailability.start}-${newAvailability.end}`;
    dispatch({
      type: 'ADD_AVAILABILITY',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        date: newAvailability.date,
        timeSlot,
        isAvailable: true,
      },
    });
    setShowAddModal(false);
    setNewAvailability({ date: selectedDate, start: '', end: '' });
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
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter disponibilité</span>
        </button>
      </div>

      {userSlots.length > 0 && (
        <div className="mb-8 space-y-2">
          {userSlots.map(slot => (
            <div key={slot.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <span className="text-sm font-medium text-dark">
                {new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                {' \u2022 '}
                {slot.timeSlot.replace('-', ' – ')}
              </span>
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
                {timeSlots.map(slot => (
                  <th key={slot} className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {days.map(date => {
                const dateObj = new Date(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                
                return (
                  <tr key={date} className={isToday ? 'bg-primary/5' : ''}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-dark">
                        {dateObj.toLocaleDateString('fr-FR', { 
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {isToday && (
                        <div className="text-xs text-primary font-medium">
                          Aujourd'hui
                        </div>
                      )}
                    </td>
                    {timeSlots.map(slot => {
                      const slotAvailabilities = getAvailabilityForSlot(date, slot);
                      const available = slotAvailabilities.filter(a => a.isAvailable).length;
                      const total = users.filter(u => u.isActive).length;
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-dark mb-6">Ajouter une disponibilité</h2>
            <form onSubmit={handleAddAvailability} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newAvailability.date}
                  onChange={(e) => setNewAvailability({ ...newAvailability, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début</label>
                <input
                  type="time"
                  value={newAvailability.start}
                  onChange={(e) => setNewAvailability({ ...newAvailability, start: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
                <input
                  type="time"
                  value={newAvailability.end}
                  onChange={(e) => setNewAvailability({ ...newAvailability, end: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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