import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.harvard.srl.SARA.V2',
  appName: 'sarav2',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  cordova: {
    preferences: {
      KeepRunning: 'true',
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      orientation: 'portrait',
      AndroidPersistentFileLocation: 'Compatibility',
      StatusBarOverlaysWebView: 'true',
      AndroidExtraFilesystems: 'files,cache, sdcard, cache-external, files-external',
      'android-targetSdkVersion': '31',
      'android-minSdkVersion': '23',
      CordovaWebViewEngine: 'CDVUIWebViewEngine'
    }
  }
};

export default config;
