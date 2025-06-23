import React from 'react';
import { InfoEditor } from './InfoEditor';

interface InfoModalProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

export function InfoModal({ value, onChange, onClose }: InfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-3 w-full max-w-2xl">
        <InfoEditor value={value} onChange={onChange} />
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
