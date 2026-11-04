import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { Platform } from 'react-native';

// Values come from .env (see .env.example). EXPO_PUBLIC_ variables are inlined
// at build time. These web-app keys are not secrets: access is controlled by
// your Firebase security rules, not by hiding the config.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const isNewApp = getApps().length === 0;
const app = isNewApp ? initializeApp(firebaseConfig) : getApp();

function createAuth() {
  if (!isNewApp) return FirebaseAuth.getAuth(app);

  // Keep users logged in between launches. On native this stores the session
  // in AsyncStorage; on web it uses the browser's local storage.
  // getReactNativePersistence exists at runtime on native but is missing from
  // some firebase typings, so it is read through a loosely typed namespace.
  const persistence =
    Platform.OS === 'web'
      ? FirebaseAuth.browserLocalPersistence
      : (FirebaseAuth as any).getReactNativePersistence(AsyncStorage);

  return FirebaseAuth.initializeAuth(app, { persistence });
}

export const auth = createAuth();
