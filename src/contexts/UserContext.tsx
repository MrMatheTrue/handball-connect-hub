import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

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
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName: string, userType: UserType) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  togglePremium: () => void;
  setUserType: (type: UserType) => void;
  setProfileId: (profileId: string) => void;
  updateUserRole: (role: 'user' | 'admin') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserProfile = async (user: User) => {
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // Fetch role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const isAdminUser = roleData?.role === 'admin';
    setIsAdmin(isAdminUser);

    // Check for pending profile type from registration
    const pendingType = localStorage.getItem('hz_pending_profile_type') as UserType;
    let currentUserType = (profile?.user_type as UserType) || null;

    if (pendingType && (!currentUserType || currentUserType === 'player')) {
      await supabase.from('profiles').update({ user_type: pendingType } as any).eq('id', user.id);
      currentUserType = pendingType;
      localStorage.removeItem('hz_pending_profile_type');
    }

    const newUser: CurrentUser = {
      id: user.id,
      name: profile?.full_name || user.user_metadata?.full_name || '',
      email: user.email || '',
      type: currentUserType,
      isPremium: profile?.is_premium || false,
      role: isAdminUser ? 'admin' : 'user',
    };

    setCurrentUser(newUser);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchUserProfile(session.user), 0);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, password: string, fullName: string, userType: UserType) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (error) {
      console.error("Signup error:", error);
      return { error: error.message };
    }

    // Update user_type on profile after signup (trigger creates it with default 'player')
    // We'll update it after the session is established
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
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
        isAdmin,
        userType: currentUser?.type ?? null,
        isLoggedIn: !!currentUser,
        loading,
        login,
        signup,
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
