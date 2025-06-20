import React from 'react';
import {
  Home,
  Calendar,
  CalendarDays,
  Mic,
  StickyNote,
  FileText,
  Users,
  Settings,
  LogOut,
  Music,
  Moon,
  Sun
} from 'lucide-react';
import { useApp } from './AppContext';

export function Navigation() {
  const { state, dispatch } = useApp();
  const { currentTab, currentUser, isDarkMode } = state;

  const tabs = [
    { id: 'dashboard' as const, label: 'Tableau de bord', icon: Home },
    { id: 'availability' as const, label: 'Disponibilités', icon: Calendar },
    { id: 'calendar' as const, label: 'Calendrier', icon: CalendarDays },
    { id: 'concerts' as const, label: 'Concerts', icon: Mic },
    { id: 'contacts' as const, label: 'Contacts', icon: Users },
    { id: 'ideas' as const, label: 'Pense-Bête', icon: StickyNote },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    ...(currentUser?.role === 'admin' ? [{ id: 'admin' as const, label: 'Administration', icon: Settings }] : []),
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white border-b border-gray-200 px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-dark dark:text-gray-100">CalZik</span>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                    currentTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-dark dark:text-gray-100">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.instrument}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Mode sombre"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2 fixed bottom-0 left-0 right-0 z-10 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                  currentTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-dark dark:text-gray-100">CalZik</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 text-gray-500 hover:text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Mode sombre"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:text-gray-400"
            aria-label="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
    </>
  );
}