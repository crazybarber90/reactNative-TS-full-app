module.exports = function (api) {
  api.cache(true)
  return {
    //BABEL CONFING
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  }
}
