import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { currentUser as mockUser } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('esports_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    const loggedUser = { ...mockUser, email };
    setUser(loggedUser);
    localStorage.setItem('esports_user', JSON.stringify(loggedUser));
  }, []);

  const register = useCallback(async (email: string, username: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = { id: 'u_new', username, email, fullName: username };
    setUser(newUser);
    localStorage.setItem('esports_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('esports_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
