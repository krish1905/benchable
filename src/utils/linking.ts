import { LinkingOptions } from '@react-navigation/native';

/**
 * Configuration for deep linking in the app.
 * This is used for handling authentication callbacks from OAuth providers.
 */

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['benchable://'],
  config: {
    screens: {
      Auth: 'auth',
      App: 'app',
    },
  },
}; 