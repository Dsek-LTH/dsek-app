module.exports = {
  expo: {
    name: 'D-sektionen',
    slug: 'dsek-app',
    version: '2.0.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'dsek',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#f280a1',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/1e625b79-dfbd-4e9c-802f-3e8451ad87e6',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'se.dsek.member',
      supportsTablet: false,
      infoPlist: {
        NSCameraUsageDescription:
          'Allow access to camera to take profile picture and upload photo to news articles.',
        NSPhotoLibraryAddUsageDescription:
          'Allow access to the photo library to save photos locally.',
        NSPhotoLibraryUsageDescription:
          'Allow access to photos to upload profile pictures or photos to news articles.',
      },
      associatedDomains: [
        'applinks:dsek.se',
        'applinks:www.dsek.se',
        'webcredentials:dsek.se',
        'webcredentials:www.dsek.se',
        'webcredentials:auth.dsek.se',
      ],
      bitcode: false,
    },
    android: {
      package: 'se.dsek',
      icon: './assets/images/icon.png',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#f280a1',
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'https',
              host: 'www.dsek.se',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/images/favicon.png',
    },
    notification: {
      icon: './assets/images/favicon.png',
      color: '#f280a1',
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/images/favicon.png',
          color: '#f280a1',
        },
      ],
      'expo-asset',
    ],
    owner: 'd-sektionen',
    extra: {
      eas: {
        projectId: '1e625b79-dfbd-4e9c-802f-3e8451ad87e6',
      },
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  },
};
