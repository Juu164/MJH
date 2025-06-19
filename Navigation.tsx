import React from 'react';
import { 
  Home, 
  Calendar, 
  Mic, 
  Users, 
  Settings, 
  LogOut,
  Music
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navigation() {
  const { state, dispatch } = useApp();
  const { currentTab, currentUser } = state;

  const tabs = [
    { id: 'dashboard' as const, label: 'Tableau de bord', icon: Home },
    { id: 'availability' as const, label: 'Disponibilités', icon: Calendar },
    { id: 'concerts' as const, label: 'Concerts', icon: Mic },
    { id: 'contacts' as const, label: 'Contacts', icon: Users },
    ...(currentUser?.role === 'admin' ? [{ id: 'admin' as const, label: 'Administration', icon: Settings }] : []),
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">CalZik</span>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
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
            <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.instrument}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                  currentTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">CalZik</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>
    </>
  );
}