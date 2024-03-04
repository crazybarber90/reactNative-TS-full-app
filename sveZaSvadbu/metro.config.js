const path = require('path')

// OVA KONFIGURAACIJA SLUZI KADA HOCEMO DA APLIKACIJA MOZE DA IZADJE IZ ROOT FOLDERA I DA GLEDA U DRUGE FOLDERE KAO STO JE U NASEM SLUCAJU COMMON!!

const extraNodeModules = {
  common: path.resolve(__dirname + '/../common'),
}

const { getDefaultConfig } = require('expo/metro-config')

const watchFolders = [path.resolve(__dirname + '/../common')]
const config = getDefaultConfig(__dirname)
const { resolver } = config

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) =>
        //redirects dependencies referenced from common/ to local node_modules
        name in target
          ? target[name]
          : path.join(process.cwd(), `node_modules/${name}`),
    }),
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  },
  watchFolders,
}

// OVA KONFIGURAACIJA SLUZI KADA HOCEMO DA DEFAULTNO GLEDA SAMO ROOT FOLDER APLIKACIJE
// const {getDefaultConfig} = require('expo/metro-config');
// module.exports = getDefaultConfig(__dirname);
