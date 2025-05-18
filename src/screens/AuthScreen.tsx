import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmail, signInWithGoogle } from '../lib/supabase';

interface AuthScreenProps {
  navigation: any;
}

export function AuthScreen({ navigation }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle login with email and password
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase
      console.log('Calling signInWithEmail...');
      await signInWithEmail(email, password);
      // Auth state change will be handled by the AuthContext listener
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in');
      console.error('Email sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    console.log('Starting Google sign-in...');
    setLoading(true);
    setError('');

    try {
      // Sign in with Google via Supabase
      console.log('Calling signInWithGoogle...');
      const data = await signInWithGoogle();
      console.log('Sign-in result:', data);
      // The rest of the auth flow will be handled by the redirect and AuthContext
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'An error occurred during Google sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/bench-basic.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>BENCHABLE</Text>
        <Text style={styles.subtitle}>Discover the Best Places to Sit</Text>
        
        <View style={styles.authContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>LOG IN</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={24} color="#000" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'IBMPlexMono-Bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 40,
    fontFamily: 'IBMPlexMono-Regular',
  },
  authContainer: {
    width: '100%',
    maxWidth: 320,
  },
  errorText: {
    color: '#ff4040',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'IBMPlexMono-Regular',
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontFamily: 'IBMPlexMono-Regular',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'IBMPlexMono-Bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    marginHorizontal: 10,
    fontFamily: 'IBMPlexMono-Regular',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: 'IBMPlexMono-Medium',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'IBMPlexMono-Regular',
  },
}); 