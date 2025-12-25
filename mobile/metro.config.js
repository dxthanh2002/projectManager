const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Required for better-auth exports resolution
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
