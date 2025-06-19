import React from 'react';
import { Calendar, Music, Users, TrendingUp, Clock, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Dashboard() {
  const { state } = useApp();
  const { concerts, availabilities, users, currentUser } = state;

  const upcomingConcerts = concerts
    .filter(c => new Date(c.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const nextRehearsal = concerts
    .filter(c => c.type === 'repetition' && new Date(c.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const totalMembers = users.filter(u => u.isActive).length;
  const confirmedConcerts = concerts.filter(c => c.status === 'confirmed').length;

  const getAvailabilityStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const recentAvailabilities = availabilities.filter(a => a.date >= today);
    const available = recentAvailabilities.filter(a => a.isAvailable).length;
    const total = recentAvailabilities.length || 1;
    return Math.round((available / total) * 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bonjour {currentUser?.name} ! 👋
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de vos prochaines activités musicales.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{totalMembers}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Musiciens actifs</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Music className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{confirmedConcerts}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Concerts confirmés</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{getAvailabilityStats()}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Disponibilité</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{upcomingConcerts.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Prochains événements</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Rehearsal */}
        {nextRehearsal && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Prochaine répétition
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">{nextRehearsal.title}</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(nextRehearsal.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {nextRehearsal.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {nextRehearsal.venue}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Concerts */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2 text-green-600" />
            Prochains concerts
          </h3>
          <div className="space-y-4">
            {upcomingConcerts.length > 0 ? (
              upcomingConcerts.map((concert) => (
                <div key={concert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{concert.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      concert.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : concert.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {concert.status === 'confirmed' ? 'Confirmé' : 
                       concert.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(concert.date).toLocaleDateString('fr-FR')} à {concert.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {concert.venue}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucun concert prévu pour le moment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}