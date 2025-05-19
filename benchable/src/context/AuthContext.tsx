import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getSession, signOut as supabaseSignOut } from '../lib/supabase';

// Define the shape of our user object
interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  sessionChecked: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Supabase user to our User type
const formatUser = (user: SupabaseUser | null): User | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name,
    picture: user.user_metadata?.avatar_url,
  };
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data and session on app start
  useEffect(() => {
    loadUserAndSession();
    
    // Set up auth change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in - updating context');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out - clearing context');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
        
        setSession(session);
        setUser(session ? formatUser(session.user) : null);
        setIsLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserAndSession = async () => {
    try {
      // Get current session
      const currentSession = await getSession();
      setSession(currentSession);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(formatUser(currentUser));
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add session check function for manual refresh
  const sessionChecked = async () => {
    console.log('Manually checking session status...');
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        console.log('Session found during manual check!');
        setSession(currentSession);
        setUser(formatUser(currentSession.user));
      } else {
        console.log('No session found during manual check');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
        sessionChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 