import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Supabase configuration
// Using environment variables for secure configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Get the redirect URL based on the current environment
const getRedirectUrl = () => {
  // Use actual URL scheme in a real app
  if (!Constants.expoConfig) {
    return 'benchable://auth/callback';
  }
  
  // In Expo Go, use the local development server URL
  // This format works better for handling auth callbacks
  const manifest = Constants.expoConfig;
  
  // Get the Expo project ID
  const projectId = manifest.extra?.eas?.projectId;
  if (projectId) {
    return `exp+benchable://expo-development-client/?url=${encodeURIComponent(
      `exp://localhost:19000/--/auth-callback`
    )}`;
  }
  
  // Fallback for Expo Go
  return 'exp://localhost:19000/--/auth-callback';
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Disable realtime subscriptions in React Native to avoid WebSocket issues
  realtime: {
    params: {
      eventsPerSecond: 0,
    },
  },
});

// Authentication helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  // Use the appropriate redirect URL for the current environment
  const redirectUrl = getRedirectUrl();
  
  console.log('Starting OAuth flow with redirectUrl:', redirectUrl);
  
  // Make sure the deep link handler is registered
  WebBrowser.maybeCompleteAuthSession();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: false,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      }
    }
  });
  
  if (error) throw error;
  
  // Open the URL in the browser
  if (data?.url) {
    try {
      console.log('Opening auth URL:', data.url);
      
      // Open the URL in an auth session that will capture the response
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );
      
      console.log('Auth session result:', result.type);
      
      // Check if the auth was successful
      if (result.type === 'success' && result.url) {
        console.log('Authentication successful with URL:', result.url.substring(0, 50) + '...');
      }
      
      // Verify if the user is signed in now
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session after auth flow:', session ? 'Found' : 'Not found');
      
      return data;
    } catch (err) {
      console.error('Error in auth flow:', err);
      throw err;
    }
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Listen for auth state changes
export const subscribeToAuthChanges = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
}; 