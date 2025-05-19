// Import polyfills first to ensure they're loaded before anything else
import './src/utils/polyfills';

import { registerRootComponent } from 'expo';

import App from './src/App';

// Register the root component
registerRootComponent(App); 