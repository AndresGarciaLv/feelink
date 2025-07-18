import 'dotenv/config';

export default {
  expo: {
    name: 'FeeLink',
    slug: 'feelink',
    version: '1.0.0',
    orientation: 'portrait',
    owner: 'andresgarciia',
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
      package: 'com.anonymous.FeeLink'
    },
    web: {
      favicon: './src/shared/assets/img/favicon.png'
    },
    updates: {
      url: 'https://u.expo.dev/8c1b1a80-ac46-4d1c-9eef-05185f4cceb4'
    },
   runtimeVersion: '1.0.0',
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: '8c1b1a80-ac46-4d1c-9eef-05185f4cceb4'
      }
    }
  }
};
