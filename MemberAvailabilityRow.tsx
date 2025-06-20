import React from 'react';
import { User } from './index';

export interface ConfirmationsState {
  [date: string]: {
    [slotId: string]: {
      [memberId: string]: boolean;
    };
  };
}

interface Props {
  members: User[];
  date: string;
  slotId: string;
  confirmations: ConfirmationsState;
  setConfirmations: React.Dispatch<React.SetStateAction<ConfirmationsState>>;
}

export function MemberAvailabilityRow({ members, date, slotId, confirmations, setConfirmations }: Props) {
  const toggle = (memberId: string) => {
    setConfirmations(prev => {
      const dateConf = prev[date] || {};
      const slotConf = dateConf[slotId] || {};
      const current = slotConf[memberId] || false;
      return {
        ...prev,
        [date]: {
          ...dateConf,
          [slotId]: {
            ...slotConf,
            [memberId]: !current
          }
        }
      };
    });
  };

  const slotConf = confirmations[date]?.[slotId] || {};
  const availableCount = members.filter(m => slotConf[m.id]).length;

  return (
    <div className="space-y-1">
      {members.map(m => {
        const available = slotConf[m.id] ?? false;
        return (
          <div key={m.id} className="flex items-center justify-between text-sm">
            <span>{m.name}</span>
            <button
              onClick={() => toggle(m.id)}
              className={`text-white px-2 py-1 rounded ${available ? 'bg-green-500' : 'bg-red-500'}`}
            >
              {available ? '✅' : '❌'}
            </button>
          </div>
        );
      })}
      <div className="text-xs text-gray-500 mt-1">
        {availableCount}/{members.length} disponibles
      </div>
    </div>
  );
}
