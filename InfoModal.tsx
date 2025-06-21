import React from 'react';

interface InfoModalProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

export function InfoModal({ value, onChange, onClose }: InfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={3000}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent resize-none h-[400px]"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {value.length} / 3000
        </div>
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
