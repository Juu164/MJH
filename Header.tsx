import React, { useState } from 'react';
import { Music, LogOut, Moon, Sun, Bell } from 'lucide-react';
import { useApp } from './AppContext';
import { useNotifications } from './useNotifications';
import { NavMenu } from './NavMenu';
import { ResourcesMenu } from './ResourcesMenu';
import { Link } from 'react-router-dom';

export function Header() {
  const { state, dispatch } = useApp();
  const { isDarkMode } = state;
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-20 relative">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOpen(o => !o)}
            className="p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Menu"
          >
            &#9776;
          </button>
          <Music className="w-6 h-6 text-primary" />
          <Link to="/" className="font-bold text-dark dark:text-gray-100">
            CalZik
          </Link>
          <nav className="hidden md:flex ml-6 space-x-4 font-semibold">
            <button
              onClick={() => dispatch({ type: 'SET_TAB', payload: 'calendar' })}
              className={`hover:text-primary ${state.currentTab === 'calendar' ? 'text-primary' : ''}`}
            >
              Calendrier
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_TAB', payload: 'contacts' })}
              className={`hover:text-primary ${state.currentTab === 'contacts' ? 'text-primary' : ''}`}
            >
              Contacts
            </button>
            <div className="relative">
              <button
                onClick={() => setShowResources(s => !s)}
                className={`hover:text-primary ${
                  state.currentTab === 'documents' || state.currentTab === 'ideas'
                    ? 'text-primary'
                    : ''
                }`}
              >
                Ressources &#9662;
              </button>
              <ResourcesMenu open={showResources} onClose={() => setShowResources(false)} />
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_TAB', payload: 'concerts' })}
              className={`hover:text-primary ${state.currentTab === 'concerts' ? 'text-primary' : ''}`}
            >
              Concerts
            </button>
            {state.currentUser?.role === 'leader' && (
              <button
                onClick={() => dispatch({ type: 'SET_TAB', payload: 'admin' })}
                className={`hover:text-primary ${state.currentTab === 'admin' ? 'text-primary' : ''}`}
              >
                Administration
              </button>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-2 relative">
          <Link
            to="/notifications"
            className="relative p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </Link>
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
      <NavMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
