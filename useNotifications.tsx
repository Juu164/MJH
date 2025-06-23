import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  message: string;
  date: string;
  read?: boolean;
}

interface NotificationsCtx {
  notifications: Notification[];
  add: (notification: Notification) => void;
  remove: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsCtx | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('notifications');
    if (!stored) return [];
    try {
      const data = JSON.parse(stored) as Array<Partial<Notification>>;
      return data.map(n => ({
        id: n.id,
        message: n.message,
        date: n.date || new Date().toISOString(),
        read: n.read || false,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const add = (notification: Notification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notification.id)) return prev;
      return [...prev, { ...notification, read: false }];
    });
  };

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, add, remove, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}

export function NotificationList() {
  const { notifications, remove } = useNotifications();
  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(n => (
        <div key={n.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded shadow flex items-start justify-between space-x-4">
          <span>{n.message}</span>
          <button onClick={() => remove(n.id)} className="text-sm text-primary">Fermer</button>
        </div>
      ))}
    </div>
  );
}

