import { getApp } from '@react-native-firebase/app';
import {
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
} from '@react-native-firebase/app-check';

const DEBUG_TOKEN = '43affa20-a9db-4e33-8305-a7ecea60563d';

export async function iniciarAppCheck() {
  try {
    const provider = new ReactNativeFirebaseAppCheckProvider();
    provider.configure({
      android: {
        provider: __DEV__ ? 'debug' : 'playIntegrity',
        debugToken: DEBUG_TOKEN,
      },
    });
    await initializeAppCheck(getApp(), {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    console.warn('App Check no se pudo iniciar', e);
  }
}