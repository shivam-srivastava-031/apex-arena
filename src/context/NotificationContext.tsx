import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

const defaultNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'tournament_update',
    title: 'Tournament Starting Soon',
    message: 'BGMI Pro League Season 4 starts in 2 weeks!',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: '/tournaments/t1',
  },
  {
    id: 'n2',
    type: 'match_reminder',
    title: 'Match Reminder',
    message: 'Your match vs Titan Esports is tomorrow at 6 PM.',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    link: '/dashboard',
  },
  {
    id: 'n3',
    type: 'team_invite',
    title: 'Team Invite',
    message: 'You have been invited to join Nova Blitz!',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    link: '/dashboard/teams',
  },
  {
    id: 'n4',
    type: 'tournament_update',
    title: 'Registration Open',
    message: 'COD Mobile Weekend Warriors is now open for registration.',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    link: '/tournaments/t9',
  },
  {
    id: 'n5',
    type: 'match_reminder',
    title: 'Match Result',
    message: 'Shadow Wolves won against Cyber Ninjas 3-1!',
    read: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    link: '/dashboard',
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('esports_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  useEffect(() => {
    localStorage.setItem('esports_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...n,
      id: `n_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
    toast.info(n.title, { description: n.message });
  }, []);

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
