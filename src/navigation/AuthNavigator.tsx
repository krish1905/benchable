import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuth } from '../context/AuthContext';
import { AppNavigator } from './index';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // User is signed in, show main app
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        // User is not signed in, show auth screen
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
} 