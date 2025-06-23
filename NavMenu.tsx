import React from 'react';
import { useApp } from './AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NavMenu({ open, onClose }: Props) {
  const { state, dispatch } = useApp();
  const { currentTab, currentUser } = state;

  const items = [
    { id: 'dashboard' as const, label: 'Tableau de bord' },
    { id: 'availability' as const, label: 'Disponibilités' },
    { id: 'calendar' as const, label: 'Calendrier' },
    { id: 'concerts' as const, label: 'Concerts' },
    { id: 'ideas' as const, label: 'Pense-Bête' },
    { id: 'documents' as const, label: 'Documents' },
    ...(currentUser?.role === 'leader'
      ? [{ id: 'admin' as const, label: 'Administration' }]
      : []),
  ];

  const menuItems = [
    ...items,
    ...(currentUser?.role === 'leader'
      ? [{ id: 'invoice' as const, label: 'Factures' }]
      : []),
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex" onClick={onClose}>
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
              onClose();
            }}
            className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5 ${
              currentTab === item.id ? 'bg-[#E0F2FF] text-[#0369A1]' : ''
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
