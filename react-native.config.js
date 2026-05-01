module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    'react-native-sqlite-storage': {
      platforms: {
        ios: null, // ⛔ force-disable invalid iOS config
      },
    },
  },
};
