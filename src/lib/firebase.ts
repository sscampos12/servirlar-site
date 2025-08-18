// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAFrH7XH1JtVUGB6RWnNOwC4izUTmIKBgg",
    authDomain: "lar-seguro-76fan.firebaseapp.com",
    projectId: "lar-seguro-76fan",
    storageBucket: "lar-seguro-76fan.firebasestorage.app",
    messagingSenderId: "951306744726",
    appId: "1:951306744726:web:d57961e8dc59a8648fe3b7",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
