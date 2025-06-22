import React from 'react';
import { LogOut, Music, Moon, Sun } from 'lucide-react';
import { useApp } from './AppContext';

export function NavMenu() {
  const { state, dispatch } = useApp();
  const { currentTab, currentUser, isDarkMode } = state;

  const items = [
    { id: 'dashboard' as const, label: 'Tableau de bord' },
    { id: 'availability' as const, label: 'Disponibilités' },
    { id: 'calendar' as const, label: 'Calendrier' },
    { id: 'concerts' as const, label: 'Concerts' },
    { id: 'contacts' as const, label: 'Contacts' },
    { id: 'ideas' as const, label: 'Pense-Bête' },
    { id: 'documents' as const, label: 'Documents' },
    ...(currentUser?.role === 'admin'
      ? [
          { id: 'admin' as const, label: 'Administration' },
        ]
      : []),
  ];

  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-20">
      <div className="flex items-center justify-between p-4">
        <nav className="flex space-x-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_TAB', payload: item.id })}
              className={`px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${currentTab === item.id ? 'bg-primary/10' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-primary" />
          <span className="font-bold text-dark dark:text-gray-100">CalZik</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Mode sombre"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
