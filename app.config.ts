import 'dotenv/config';

export default {
  expo: {
    name: 'FeeLink',
    slug: 'feelink',
    version: '1.0.0',
    orientation: 'portrait',
    "owner": "andresgarciia",
    icon: './src/shared/assets/img/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './src/shared/assets/img/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#9BC4E0'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.FeeLink'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/shared/assets/img/adaptive-icon.png',
        backgroundColor: '#9BC4E0'
      },
      edgeToEdgeEnabled: true,
      package: 'com.anonymous.FeeLink',
      permissions: [
        'BLUETOOTH',
        'BLUETOOTH_ADMIN',
        'BLUETOOTH_CONNECT',
        'BLUETOOTH_SCAN',
        'ACCESS_FINE_LOCATION',
        'android.permission.BLUETOOTH',
        'android.permission.BLUETOOTH_ADMIN',
        'android.permission.BLUETOOTH_CONNECT'
      ]
    },
    plugins: [
      [
        '@config-plugins/react-native-ble-plx',
        {
          isBackgroundEnabled: false
        }
      ]
    ],
    web: {
      favicon: './src/shared/assets/img/favicon.png'
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: 'ec910ac9-3490-4b83-8fc0-916c7e94492b'
      }
    }
  }
};
