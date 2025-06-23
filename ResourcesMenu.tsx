import React, { useRef } from 'react';
import { useApp } from './AppContext';
import { Link } from 'react-router-dom';
import { useOutsideClick } from './useOutsideClick';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ResourcesMenu({ open, onClose }: Props) {
  const { dispatch } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 space-y-1 z-30"
    >
      <button
        className="block w-full text-left px-2 py-1 hover:bg-primary/5 rounded"
        onClick={() => {
          dispatch({ type: 'SET_TAB', payload: 'documents' });
          onClose();
        }}
      >
        Stockage de fichier
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-primary/5 rounded"
        onClick={() => {
          dispatch({ type: 'SET_TAB', payload: 'ideas' });
          onClose();
        }}
      >
        Pense-Bête
      </button>
      <Link
        to="/ressources/factures"
        onClick={onClose}
        className="block w-full text-left px-2 py-1 hover:bg-primary/5 rounded"
      >
        Facturation
      </Link>
    </div>
  );
}
