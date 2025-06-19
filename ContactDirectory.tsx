import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { useApp } from './AppContext';
import { Contact } from '../types';

export function ContactDirectory() {
  const { state, dispatch } = useApp();
  const { contacts } = state;
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'salle' as Contact['type'],
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const contactTypes = [
    { value: 'salle', label: 'Salle' },
    { value: 'association', label: 'Association' },
    { value: 'festival', label: 'Festival' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData = {
      ...formData,
      id: editingContact?.id || Math.random().toString(36).substr(2, 9)
    };

    if (editingContact) {
      dispatch({ type: 'UPDATE_CONTACT', payload: contactData });
    } else {
      dispatch({ type: 'ADD_CONTACT', payload: contactData });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'salle',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      notes: ''
    });
    setEditingContact(null);
    setShowModal(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      dispatch({ type: 'DELETE_CONTACT', payload: id });
    }
  };

  const getTypeBadge = (type: Contact['type']) => {
    const styles = {
      salle: 'bg-primary/10 text-primary',
      association: 'bg-accent/20 text-accent',
      festival: 'bg-accent/20 text-accent',
      autre: 'bg-gray-100 text-dark'
    };

    const labels = {
      salle: 'Salle',
      association: 'Association',
      festival: 'Festival',
      autre: 'Autre'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || contact.type === typeFilter;
    const matchesCity = !cityFilter || contact.city.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesCity;
  });

  const uniqueCities = [...new Set(contacts.map(c => c.city))].sort();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Annuaire des Contacts</h1>
          <p className="text-gray-600">
            Gérez vos contacts : salles, associations, festivals et partenaires
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau contact</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {contactTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">Toutes les villes</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark mb-2">
                  {contact.name}
                </h3>
                {getTypeBadge(contact.type)}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(contact)}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <a 
                  href={`mailto:${contact.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-accent" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className="hover:text-accent transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                <div>
                  <p>{contact.address}</p>
                  <p>{contact.postalCode} {contact.city}</p>
                </div>
              </div>

              {contact.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{contact.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun contact trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            Ajustez vos filtres ou ajoutez un nouveau contact
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">
              {editingContact ? 'Modifier le contact' : 'Nouveau contact'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
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
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Contact['type'] })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {contactTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Notes et informations complémentaires..."
                />
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
                  {editingContact ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}