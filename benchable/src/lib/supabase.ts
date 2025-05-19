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
  // Get the URL for the current device/platform
  const localhost = Platform.OS === 'web' 
    ? 'localhost:8081' 
    : '192.168.2.248:8082'; // Update this IP address if needed (the one shown in Expo start)
    
  // Use a simple, direct URL that Supabase can handle properly
  const redirectUrl = `exp://${localhost}/--/auth-callback`;
  
  return redirectUrl;
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
  // Make sure the browser can detect our URL scheme
  WebBrowser.maybeCompleteAuthSession();
  
  // Get the correct redirect URL
  const redirectUrl = getRedirectUrl();
  console.log('Using redirect URL:', redirectUrl);
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false, // Important: let the redirect happen
        queryParams: {
          // Force Google to always show the account selection screen
          prompt: 'select_account',
        }
      }
    });
    
    if (error) throw error;
    
    if (data?.url) {
      console.log('Opening auth URL in browser...');
      
      // Open URL in auth session and wait for result
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      
      if (result.type === 'success') {
        console.log('Auth successful! Getting session...');
        
        // Extract URL parameters including access_token and refresh_token
        if (result.url && result.url.includes('access_token')) {
          console.log('URL contains auth tokens, processing...');
          
          // Parse the URL hash fragment to get tokens
          const url = new URL(result.url);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          
          // If we have the tokens, manually set the session
          if (access_token && refresh_token) {
            console.log('Found tokens, setting session manually...');
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            
            if (error) {
              console.error('Error setting session:', error);
            } else {
              console.log('Session set successfully!');
              return { session: data.session };
            }
          }
        }
      } else {
        console.log('Auth flow was cancelled or failed:', result.type);
      }
      
      // Check session after browser closes (fallback)
      const session = await supabase.auth.getSession();
      console.log('Session after auth flow:', session.data.session ? 'Found' : 'Not found');
      
      return { session: session.data.session };
    }
    
    return data;
  } catch (err) {
    console.error('Error during Google sign-in:', err);
    throw err;
  }
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