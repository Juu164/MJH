import React, { useState } from 'react';
import { Music, LogOut, Moon, Sun, Bell } from 'lucide-react';
import { useApp } from './AppContext';
import { useNotifications } from './useNotifications';
import { NavMenu } from './NavMenu';
import { Link } from 'react-router-dom';

export function Header() {
  const { state, dispatch } = useApp();
  const { isDarkMode } = state;
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-primary" />
          <span className="font-bold text-dark dark:text-gray-100">CalZik</span>
          <button
            onClick={() => setOpen(true)}
            className="ml-2 p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Menu"
          >
            &#9776;
          </button>
        </div>
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
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 space-y-2 text-sm z-20">
                {notifications.slice(-3).reverse().map(n => (
                  <div key={n.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-1">
                    <div>{n.message}</div>
                    <div className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</div>
                  </div>
                ))}
                {!notifications.length && <div>Aucune notification</div>}
                <Link to="/notifications" className="block text-primary text-right text-xs mt-1">Voir toutes</Link>
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
      <NavMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
