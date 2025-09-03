
'use server'

import * as admin from 'firebase-admin';

// Esta função garante que a inicialização só ocorra uma vez
// e de forma segura no ambiente do servidor.
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  return app;
}

export const adminAuth = admin.auth(getAdminApp());
export const adminFirestore = admin.firestore(getAdminApp());
