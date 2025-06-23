import React from 'react';
import { useNotifications } from './useNotifications';

export function NotificationsPage() {
  const { notifications } = useNotifications();
  const sorted = [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-2">
        {sorted.map(n => (
          <li key={n.id} className="border-b pb-2 last:border-b-0">
            <div>{n.message}</div>
            <div className="text-xs text-gray-500">{new Date(n.date).toLocaleString()}</div>
          </li>
        ))}
        {!sorted.length && <li>Aucune notification</li>}
      </ul>
    </div>
  );
}
