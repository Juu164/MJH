import React, { useState } from 'react';
import { Users, UserPlus, Edit, Shield, ShieldCheck, Music, Mail, ToggleLeft as Toggle, Save, X } from 'lucide-react';
import { useApp } from './AppContext';
import { User } from '../types';

export function AdminPanel() {
  const { state, dispatch } = useApp();
  const { users, concerts, availabilities, contacts } = state;
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instrument: '',
    role: 'member' as User['role'],
    isActive: true
  });

  const instruments = [
    'Guitare', 'Basse', 'Batterie', 'Clavier', 'Piano', 'Violon', 
    'Saxophone', 'Trompette', 'Chant', 'Flûte', 'Autre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      ...formData,
      id: editingUser?.id || Math.random().toString(36).substr(2, 9)
    };

    if (editingUser) {
      dispatch({ type: 'UPDATE_USER', payload: userData });
    } else {
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      instrument: '',
      role: 'member',
      isActive: true
    });
    setEditingUser(null);
    setShowUserModal(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      instrument: user.instrument,
      role: user.role,
      isActive: user.isActive
    });
    setShowUserModal(true);
  };

  const handleToggleActive = (user: User) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { ...user, isActive: !user.isActive }
    });
  };

  const handleToggleRole = (user: User) => {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    dispatch({
      type: 'UPDATE_USER',
      payload: { ...user, role: newRole }
    });
  };

  const getStats = () => {
    const activeUsers = users.filter(u => u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const upcomingConcerts = concerts.filter(c => new Date(c.date) >= new Date()).length;
    const totalAvailabilities = availabilities.length;

    return { activeUsers, adminUsers, upcomingConcerts, totalAvailabilities };
  };

  const stats = getStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Administration</h1>
          <p className="text-gray-600">
            Gérez les utilisateurs et les paramètres du système
          </p>
        </div>
        <button
          onClick={() => setShowUserModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <UserPlus className="w-5 h-5" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-dark">{stats.activeUsers}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Utilisateurs actifs</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <span className="text-2xl font-bold text-dark">{stats.adminUsers}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Administrateurs</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Music className="w-6 h-6 text-accent" />
            </div>
            <span className="text-2xl font-bold text-dark">{stats.upcomingConcerts}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Prochains concerts</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Toggle className="w-6 h-6 text-accent" />
            </div>
            <span className="text-2xl font-bold text-dark">{contacts.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Contacts</h3>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-dark flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Gestion des utilisateurs
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instrument
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.instrument}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleRole(user)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        user.role === 'admin'
                          ? 'bg-accent/20 text-accent hover:bg-accent/30'
                          : 'bg-gray-100 text-dark hover:bg-gray-200'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <Users className="w-3 h-3 mr-1" />
                      )}
                      {user.role === 'admin' ? 'Admin' : 'Membre'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        user.isActive
                          ? 'bg-accent/20 text-accent hover:bg-accent/30'
                          : 'bg-primary/20 text-primary hover:bg-primary/30'
                      }`}
                    >
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">
                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument *
                </label>
                <select
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un instrument</option>
                  {instruments.map(instrument => (
                    <option key={instrument} value={instrument}>
                      {instrument}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="member">Membre</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-accent border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Utilisateur actif
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-dark font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'Modifier' : 'Créer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}