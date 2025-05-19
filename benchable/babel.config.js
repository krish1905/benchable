module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add a plugin to handle Node.js module compatibility issues
      [
        'module-resolver',
        {
          alias: {
            // These are the problematic modules in supabase-js that need to be replaced
            'ws': 'react-native-websocket',
            'crypto': 'react-native-crypto',
            'stream': 'stream-browserify'
          },
        },
      ],
    ],
  };
}; 