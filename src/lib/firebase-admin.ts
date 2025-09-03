
import * as admin from 'firebase-admin';

// Esta variável de ambiente é fornecida automaticamente pelo ambiente do Firebase (Cloud Functions, App Hosting)
const serviceAccount = process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : undefined;

let adminApp: admin.app.App;

export function getAdminApp() {
  if (!adminApp) {
    if (admin.apps.length > 0) {
      adminApp = admin.app();
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }
  return {
    auth: admin.auth(adminApp),
    firestore: admin.firestore(adminApp),
  };
}
