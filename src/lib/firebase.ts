
// ----------------------------------------------------------------
// ORDEM 1: CONFIGURAÇÃO E CONEXÃO COM O FIREBASE
// ----------------------------------------------------------------
// OBJETIVO: Estabelecer a conexão inicial com os serviços do Firebase.
//           Este arquivo será importado por todos os outros que
//           precisarem de acesso ao Auth, Firestore, etc.
// ----------------------------------------------------------------

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Suas credenciais do Firebase (obtidas no console do Firebase)
// DEVEM estar no seu arquivo .env.local para segurança.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAFrH7XH1JtVUGB6RWnNOwC4izUTmIKBgg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lar-seguro-76fan.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lar-seguro-76fan",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lar-seguro-76fan.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "951306744726",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:951306744726:web:d57961e8dc59a8648fe3b7",
};

// Padrão Singleton: Garante que o Firebase seja inicializado apenas uma vez.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta os serviços que usaremos em todo o aplicativo
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
