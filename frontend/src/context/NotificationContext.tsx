import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { fetchMyNotifications, markNotificationRead, markAllNotificationsRead, createNotification as apiCreateNotification } from '@/services/api';

export type NotificationType = 'tournament_update' | 'match_reminder' | 'team_invite';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from DB
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const data = await fetchMyNotifications();
        if (data) {
          setNotifications(data.map((n: any) => ({
            id: n._id || n.id,
            type: n.type as NotificationType,
            title: n.title,
            message: n.message,
            read: n.read,
            createdAt: n.createdAt,
            link: n.link || undefined,
          })));
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();

    // Poll for notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (user) {
      try {
        await markAllNotificationsRead();
      } catch (err) {
        console.error(err);
      }
    }
  }, [user]);

  const addNotification = useCallback(async (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    if (!user) return;
    try {
      const data = await apiCreateNotification({
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
      });
      if (data) {
        toast.info(n.title, { description: n.message });
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
