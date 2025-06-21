import React, { useState } from 'react';
import { useApp } from './AppContext';

interface Idea {
  id: string;
  text: string;
  author: string;
  date: string;
  status: 'todo' | 'done';
  isEditing?: boolean;
}

export function IdeaBoardPage() {
  const { state } = useApp();
  const { currentUser } = state;
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState('');

  const addIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim() || !currentUser) return;
    const idea: Idea = {
      id: Math.random().toString(36).substr(2, 9),
      text: newIdea.trim(),
      author: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      status: 'todo',
      isEditing: false
    };
    setIdeas(prev => [...prev, idea]);
    setNewIdea('');
  };

  const setStatus = (id: string, status: Idea['status']) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
  };

  const [editValues, setEditValues] = useState<{ [id: string]: string }>({});

  const startEdit = (id: string, text: string) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, isEditing: true } : i)));
    setEditValues(prev => ({ ...prev, [id]: text }));
  };

  const saveEdit = (id: string) => {
    setIdeas(prev =>
      prev.map(i => (i.id === id ? { ...i, text: editValues[id], isEditing: false } : i))
    );
    setEditValues(prev => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const cancelEdit = (id: string) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, isEditing: false } : i)));
    setEditValues(prev => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const pending = ideas.filter(i => i.status !== 'done');
  const done = ideas.filter(i => i.status === 'done');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-4">Pense-Bête</h1>
      <form onSubmit={addIdea} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={newIdea}
          onChange={e => setNewIdea(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Nouvelle idée"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
        >
          Ajouter
        </button>
      </form>

      <div className="space-y-4">
        {pending.map(i => (
          <div
            key={i.id}
            className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
          >
            <div>
              {i.isEditing ? (
                <input
                  type="text"
                  value={editValues[i.id] || ''}
                  onChange={e =>
                    setEditValues(prev => ({ ...prev, [i.id]: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              ) : (
                <>
                  <p className="text-sm font-medium text-dark">{i.text}</p>
                  <p className="text-xs text-gray-500">
                    {i.author} – {new Date(i.date).toLocaleDateString('fr-FR')}
                  </p>
                </>
              )}
            </div>
            <div className="flex space-x-2">
              {i.isEditing ? (
                <>
                  <button
                    onClick={() => saveEdit(i.id)}
                    className="bg-primary text-white px-2 py-1 rounded text-xs"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => cancelEdit(i.id)}
                    className="bg-gray-300 text-dark px-2 py-1 rounded text-xs"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(i.id, i.text)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  ✏️ Modifier
                </button>
              )}
              <button
                onClick={() => setStatus(i.id, 'todo')}
                className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
              >
                À traiter
              </button>
              <button
                onClick={() => setStatus(i.id, 'done')}
                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
              >
                Traité
              </button>
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-dark mb-2">Traité</h2>
          <div className="space-y-2">
            {done.map(i => (
              <div
                key={i.id}
                className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
              >
                <div>
                  {i.isEditing ? (
                    <input
                      type="text"
                      value={editValues[i.id] || ''}
                      onChange={e =>
                        setEditValues(prev => ({ ...prev, [i.id]: e.target.value }))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  ) : (
                    <>
                      <p className="text-sm text-dark">{i.text}</p>
                      <p className="text-xs text-gray-500">
                        {i.author} – {new Date(i.date).toLocaleDateString('fr-FR')}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  {i.isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(i.id)}
                        className="bg-primary text-white px-2 py-1 rounded text-xs"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => cancelEdit(i.id)}
                        className="bg-gray-300 text-dark px-2 py-1 rounded text-xs"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(i.id, i.text)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      ✏️ Modifier
                    </button>
                  )}
                  <button
                    onClick={() => setStatus(i.id, 'todo')}
                    className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                  >
                    À traiter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
