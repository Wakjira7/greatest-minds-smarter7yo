/**
 * Dynamic Expo / EAS Build Configuration for Standalone Google Play Apps:
 *  Developer: Wakjira
 *  1) App #2 (RECOMMENDED FIRST UPLOAD): "Smarter Than a 7-Year-Old?" (com.wakjira.smarter7yo)
 *     -> EXPO_PUBLIC_APP_VARIANT=smarter7yo
 *  2) App #1: "Greatest Minds: Stoic AI Chat" (com.wakjira.greatestminds)
 *     -> EXPO_PUBLIC_APP_VARIANT=minds
 *  3) App #3: "OmniScan: Offline PDF OCR Pro" (com.wakjira.offlineocr)
 *     -> EXPO_PUBLIC_APP_VARIANT=ocr
 */
module.exports = ({ config }) => {
  const variant = process.env.EXPO_PUBLIC_APP_VARIANT || 'dual';
  const isSmarter = variant === 'smarter7yo';
  const isOcr = variant === 'ocr';

  const appName = isOcr
    ? 'OmniScan: Offline PDF OCR Pro'
    : isSmarter
    ? 'Smarter Than a 7-Year-Old?'
    : 'Greatest Minds: Stoic AI Chat';
  const slug = 'smarter-than-a-7-year-old';
  const androidPackage = isOcr
    ? 'com.wakjira.offlineocr'
    : isSmarter
    ? 'com.wakjira.smarter7yo'
    : 'com.wakjira.greatestminds';
  const iosBundleId = isOcr
    ? 'com.wakjira.offlineocr'
    : isSmarter
    ? 'com.wakjira.smarter7yo'
    : 'com.wakjira.greatestminds';
  const iconPath = isOcr
    ? './assets/icon-ocr.png'
    : isSmarter
    ? './assets/icon-smarter7yo.png'
    : './assets/icon-minds.png';

  return {
    ...config,
    name: appName,
    slug,
    owner: 'wakjira',
    version: '1.0.6',
    orientation: 'portrait',
    icon: iconPath,
    scheme: isOcr ? 'omniscanocr' : isSmarter ? 'smarter7yo' : 'personaadvisor',
    userInterfaceStyle: 'dark',
    newArchEnabled: false,
    splash: {
      image: iconPath,
      resizeMode: 'contain',
      backgroundColor: '#090D16',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleId,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: androidPackage,
      versionCode: 7,
      adaptiveIcon: {
        foregroundImage: iconPath,
        backgroundColor: '#090D16',
      },
      permissions: ['com.google.android.gms.permission.AD_ID'],
      blockedPermissions: [
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.RECORD_AUDIO',
        'android.permission.SYSTEM_ALERT_WINDOW',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router'],
    extra: {
      eas: {
        projectId: 'cb1c49ce-45e3-456d-b83b-5798e8aa7901',
      },
      appVariant: variant,
      releaseMode: process.env.EXPO_PUBLIC_RELEASE_MODE || 'dev',
      androidBuildConfig: {
        compileSdkVersion: 36,
        targetSdkVersion: 36,
        minSdkVersion: 24,
      },
    },
    experiments: {
      typedRoutes: false,
    },
  };
};
