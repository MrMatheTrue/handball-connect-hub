import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'player' | 'club' | 'agent' | 'coach' | null;

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  isPremium: boolean;
  profileId?: string;
  role?: 'user' | 'admin';
}

interface UserContextType {
  currentUser: CurrentUser | null;
  isPremium: boolean;
  isAdmin: boolean;
  userType: UserType;
  isLoggedIn: boolean;
  login: (user: Omit<CurrentUser, 'id'>) => void;
  logout: () => void;
  togglePremium: () => void;
  setUserType: (type: UserType) => void;
  setProfileId: (profileId: string) => void;
  updateUserRole: (role: 'user' | 'admin') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Simulated user for development - can be toggled
const DEFAULT_USER: CurrentUser = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@handzone.com',
  type: 'player',
  isPremium: false,
  profileId: 'player-1',
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('handzone_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure master user is always admin
      if (parsed.email === 'matheus@handzone.com') {
        parsed.role = 'admin';
      }
      return parsed;
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('handzone_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('handzone_user');
    }
  }, [currentUser]);

  const login = (user: Omit<CurrentUser, 'id'>) => {
    const newUser: CurrentUser = {
      ...user,
      id: `user-${Date.now()}`,
      // Auto-assign admin role for the master email
      role: user.email === 'matheus@handzone.com' ? 'admin' : (user.role || 'user'),
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const togglePremium = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, isPremium: !currentUser.isPremium });
    }
  };

  const setUserType = (type: UserType) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, type });
    }
  };

  const setProfileId = (profileId: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, profileId });
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isPremium: currentUser?.isPremium ?? false,
        isAdmin: currentUser?.role === 'admin' || currentUser?.email === 'matheus@handzone.com',
        userType: currentUser?.type ?? null,
        isLoggedIn: !!currentUser,
        login,
        logout,
        togglePremium,
        setUserType,
        setProfileId,
        updateUserRole: (role: 'user' | 'admin') => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, role });
          }
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
