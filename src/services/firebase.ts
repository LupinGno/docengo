// Conexión única a Firebase. Todos los demás archivos importan `auth` y `db` desde aquí.
// Las llaves se leen del archivo .env (ver .env.example). Nunca las escribas aquí.
import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore -- getReactNativePersistence existe en el paquete para React Native aunque falte en los tipos
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const yaIniciada = getApps().length > 0;

export const app = yaIniciada ? getApp() : initializeApp(firebaseConfig);

// La persistencia con AsyncStorage mantiene la sesión abierta al cerrar la app.
export const auth = yaIniciada
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);
