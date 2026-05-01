// module.exports = {
//   presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
//   plugins: ['react-native-reanimated/plugin',
//        ['module:react-native-dotenv', {
//       moduleName: '@env',
//       path: '.env',
//       blocklist: null,
//       allowlist: null,
//       safe: false,
//       allowUndefined: true,
//     }]
//   ],
// };



module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: null,
      safe: false,
      allowUndefined: false,
    }],
    'react-native-reanimated/plugin',
  ],
};