import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, CalculationHistory } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  // Load state from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('toolsewa_user');
    const storedCount = localStorage.getItem('toolsewa_usage');
    const storedHistory = localStorage.getItem('toolsewa_history');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCount) setUsageCount(parseInt(storedCount, 10));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  const login = (email: string) => {
    // Mock Login
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      isPremium: false,
      joinedDate: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('toolsewa_user', JSON.stringify(newUser));
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('toolsewa_user');
    setUsageCount(0); // Optional: Reset usage on logout or keep it? Keeping it prevents abuse.
  };

  const checkUsageLimit = (): boolean => {
    if (user) return true; // Logged in users have no limit

    if (usageCount >= 2) {
      setShowLoginModal(true);
      return false;
    }

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('toolsewa_usage', newCount.toString());
    return true;
  };

  const addToHistory = (entry: Omit<CalculationHistory, 'id' | 'date'>) => {
    if (!user) return; // Only save history for logged in users
    const newEntry: CalculationHistory = {
      ...entry,
      id: 'hist_' + Date.now(),
      date: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('toolsewa_history', JSON.stringify(updatedHistory));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      usageCount,
      checkUsageLimit,
      history,
      addToHistory,
      showLoginModal,
      setShowLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};