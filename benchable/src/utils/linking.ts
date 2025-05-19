import { LinkingOptions } from '@react-navigation/native';
import { Platform } from 'react-native';

/**
 * Configuration for deep linking in the app.
 * This is used for handling authentication callbacks from OAuth providers.
 */

// Get the correct URL prefix based on the environment
const getPrefix = () => {
  // Get the URL for the current device/platform
  const localhost = Platform.OS === 'web' 
    ? 'localhost:8081' 
    : '192.168.2.248:8082'; // Update this IP address if needed (the one shown in Expo start)

  // Production app would use the custom scheme
  const prefixes = [
    'benchable://', 
    `exp://${localhost}`,
    // Also support URL with auth callback path
    `exp://${localhost}/--/auth-callback`,
    // Support localhost with auth callback
    'http://localhost:3000'
  ];
  
  console.log('Using URL prefixes:', prefixes);
  
  return prefixes;
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: getPrefix(),
  config: {
    screens: {
      Auth: {
        path: 'auth',
        // Add specific screens for auth flow
        screens: {
          Login: '',
          // Special path for auth callback
          Callback: 'auth-callback',
        }
      },
      App: 'app',
    },
    initialRouteName: 'Auth',
  },
}; 