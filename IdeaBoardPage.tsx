import React, { useState } from 'react';
import { useApp } from './AppContext';
import { InfoModal } from './InfoModal';
import { InfoEditor } from './InfoEditor';

interface Idea {
  id: string;
  title: string;
  info: string;
  author: string;
  date: string;
  status: 'todo' | 'done';
  isEditing?: boolean;
}

export function IdeaBoardPage() {
  const { state } = useApp();
  const { currentUser } = state;
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newInfo, setNewInfo] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const addIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentUser) return;
    const idea: Idea = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle.trim(),
      info: newInfo.trim(),
      author: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      status: 'todo',
      isEditing: false
    };
    setIdeas(prev => [...prev, idea]);
    setNewTitle('');
    setNewInfo('');
  };

  const setStatus = (id: string, status: Idea['status']) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
  };

  const [editValues, setEditValues] = useState<{ [id: string]: string }>({});
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);

  const startEdit = (id: string, info: string) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, isEditing: true } : i)));
    setEditValues(prev => ({ ...prev, [id]: info }));
  };

  const saveEdit = (id: string) => {
    setIdeas(prev =>
      prev.map(i => (i.id === id ? { ...i, info: editValues[id], isEditing: false } : i))
    );
    setEditValues(prev => {
      const rest = { ...prev };
      delete rest[id];
      return rest;
    });
  };

  const cancelEdit = (id: string) => {
    setIdeas(prev => prev.map(i => (i.id === id ? { ...i, isEditing: false } : i)));
    setEditValues(prev => {
      const rest = { ...prev };
      delete rest[id];
      return rest;
    });
  };

  const pending = ideas.filter(i => i.status !== 'done');
  const done = ideas.filter(i => i.status === 'done');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-4">Pense-Bête</h1>
      <form onSubmit={addIdea} className="mb-6 space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            maxLength={150}
            className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {newTitle.length} / 150
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Info</label>
          <InfoEditor value={newInfo} onChange={setNewInfo} />
          <div className="flex items-center justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="text-primary text-xs underline"
            >
              🔍 Voir plus
            </button>
          </div>
          {showInfoModal && (
            <InfoModal
              value={newInfo}
              onChange={setNewInfo}
              onClose={() => setShowInfoModal(false)}
            />
          )}
        </div>
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
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Info</label>
                  <InfoEditor
                    value={editValues[i.id] || ''}
                    onChange={(val) =>
                      setEditValues(prev => ({ ...prev, [i.id]: val }))
                    }
                  />
                  <div className="flex items-center justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedInfoId(i.id)}
                      className="text-primary text-xs underline"
                    >
                      🔍 Voir plus
                    </button>
                  </div>
                  {expandedInfoId === i.id && (
                    <InfoModal
                      value={editValues[i.id] || ''}
                      onChange={(val) =>
                        setEditValues(prev => ({ ...prev, [i.id]: val }))
                      }
                      onClose={() => setExpandedInfoId(null)}
                    />
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-dark">{i.title}</p>
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
                  onClick={() => startEdit(i.id, i.info)}
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
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Info</label>
                      <InfoEditor
                        value={editValues[i.id] || ''}
                        onChange={(val) =>
                          setEditValues(prev => ({ ...prev, [i.id]: val }))
                        }
                      />
                      <div className="flex items-center justify-end mt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedInfoId(i.id)}
                          className="text-primary text-xs underline"
                        >
                          🔍 Voir plus
                        </button>
                      </div>
                      {expandedInfoId === i.id && (
                        <InfoModal
                          value={editValues[i.id] || ''}
                          onChange={(val) =>
                            setEditValues(prev => ({ ...prev, [i.id]: val }))
                          }
                          onClose={() => setExpandedInfoId(null)}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-dark">{i.title}</p>
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
                      onClick={() => startEdit(i.id, i.info)}
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
