import React, { useState } from 'react';
import { LogOut, Music, Moon, Sun, Bell } from 'lucide-react';
import { useApp } from './AppContext';
import { useNotifications } from './useNotifications';

export function NavMenu() {
  const { state, dispatch } = useApp();
  const { currentTab, currentUser, isDarkMode } = state;
  const { notifications } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

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

  const menuItems = [
    ...items,
    ...(currentUser?.role === 'admin'
      ? [{ id: 'invoice' as const, label: 'Factures' }]
      : []),
  ];

  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 mr-4">
            <Music className="w-6 h-6 text-primary" />
            <span className="font-bold text-dark dark:text-gray-100">CalZik</span>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Menu"
          >
            &#9776;
          </button>
        </div>
        <nav className="flex space-x-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_TAB', payload: item.id })}
              className={`px-3 py-1 rounded-lg hover:bg-primary/5 ${
                currentTab === item.id ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-2 relative">
          <div className="relative">
            <button
              onClick={() => setShowNotif(s => !s)}
              className="p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-2 space-y-2 text-sm z-20">
                {notifications.slice(-3).reverse().map(n => (
                  <div key={n.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-1">
                    <div>{n.message}</div>
                    <div className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</div>
                  </div>
                ))}
                {!notifications.length && <div>Aucune notification</div>}
              </div>
            )}
          </div>
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
      {menuOpen && (
        <div className="fixed inset-0 z-30 flex" onClick={() => setMenuOpen(false)}>
          <div className="bg-black/50 flex-1" />
          <div
            className="bg-white dark:bg-gray-800 w-64 p-4 space-y-2" 
            onClick={e => e.stopPropagation()}
          >
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  dispatch({ type: 'SET_TAB', payload: item.id });
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
