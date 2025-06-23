import React, { useRef } from 'react';
import { useApp } from './AppContext';
import { useOutsideClick } from './useOutsideClick';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NavMenu({ open, onClose }: Props) {
  const { state, dispatch } = useApp();
  const { currentTab, currentUser } = state;
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);

  const menuItems = [
    { id: 'calendar' as const, label: 'Calendrier' },
    { id: 'contacts' as const, label: 'Contacts' },
    { id: 'documents' as const, label: 'Stockage de fichier' },
    { id: 'ideas' as const, label: 'Pense-Bête' },
    ...(currentUser?.role === 'leader' ? [{ id: 'invoice' as const, label: 'Factures' }] : []),
    { id: 'concerts' as const, label: 'Concerts' },
    ...(currentUser?.role === 'leader' ? [{ id: 'admin' as const, label: 'Administration' }] : []),
  ];

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute left-0 mt-2 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 space-y-2 z-30"
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
  );
}
