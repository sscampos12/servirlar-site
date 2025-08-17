// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    projectId: "lar-seguro-76fan",
    appId: "1:951306744726:web:d57961e8dc59a8648fe3b7",
    storageBucket: "lar-seguro-76fan.firebasestorage.app",
    apiKey: "AIzaSyAFrH7XH1JtVUGB6RWnNOwC4izUTmIKBgg",
    authDomain: "lar-seguro-76fan.firebaseapp.com",
    messagingSenderId: "951306744726",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };