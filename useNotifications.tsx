import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface Notification {
  id: string;
  message: string;
  date: string;
  link?: string;
  read?: boolean;
}

interface NotificationsCtx {
  notifications: Notification[];
  add: (notification: Notification) => void;
  remove: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
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

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationsContext.Provider value={{ notifications, add, remove, markAllRead, markRead }}>
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
  const { notifications, remove, markRead } = useNotifications();
  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`border p-3 rounded shadow flex items-start justify-between space-x-4 ${
            n.read ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-blue-50 border-blue-200'
          }`}
        >
          {n.link ? (
            <Link
              to={n.link}
              onClick={() => markRead(n.id)}
              className="flex-1 hover:underline"
            >
              {n.message}
            </Link>
          ) : (
            <span className="flex-1">{n.message}</span>
          )}
          <button
            onClick={() => remove(n.id)}
            className="text-sm text-primary"
          >
            Fermer
          </button>
        </div>
      ))}
    </div>
  );
}

