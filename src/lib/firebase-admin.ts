
import * as admin from 'firebase-admin';

// Esta variável de ambiente é fornecida automaticamente pelo ambiente do Firebase (Cloud Functions, App Hosting)
const serviceAccount = process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : undefined;

let adminApp: admin.app.App;

if (!admin.apps.length) {
  adminApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  adminApp = admin.app();
}

const adminAuth = admin.auth(adminApp);
const adminFirestore = admin.firestore(adminApp);

export { adminAuth, adminFirestore };
