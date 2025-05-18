"use client"

// Import polyfills first
import './utils/polyfills';

import { useState, useEffect } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import * as Font from 'expo-font'
import { View, Text } from 'react-native'
import { AuthProvider } from "./context/AuthContext"
import { AuthNavigator } from "./navigation/AuthNavigator"
import { linking } from "./utils/linking"
import * as WebBrowser from 'expo-web-browser'

// Initialize WebBrowser for auth sessions
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'IBMPlexMono-Regular': require('./assets/fonts/IBMPlexMono-Regular.ttf'),
      'IBMPlexMono-Medium': require('./assets/fonts/IBMPlexMono-Medium.ttf'),
      'IBMPlexMono-Bold': require('./assets/fonts/IBMPlexMono-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  // Create a custom theme that includes the fonts structure
  const appTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: "#fff",
      background: "#000",
      card: "#000",
      text: "#fff",
      border: "#333",
      notification: "#fff",
    },
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <NavigationContainer 
          theme={appTheme}
          linking={linking}
        >
          <AuthNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
