// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add the assets directory to the watch folders
config.watchFolders = [
  ...(config.watchFolders || []),
  `${__dirname}/src/assets`,
  `${__dirname}/assets`,
];

module.exports = config; 