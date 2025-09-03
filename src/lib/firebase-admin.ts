
'use server'

import * as admin from 'firebase-admin';

// Esta função garante que a inicialização só ocorra uma vez
// e de forma segura no ambiente do servidor.
function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  return app;
}

// Inicializa o app uma vez
const adminApp = initializeAdminApp();

// Exporta as instâncias dos serviços
export const adminAuth = admin.auth(adminApp);
export const adminFirestore = admin.firestore(adminApp);
