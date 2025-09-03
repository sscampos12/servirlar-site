import * as admin from 'firebase-admin';

// Esta função garante que a inicialização só ocorra uma vez
// e de forma segura no ambiente do servidor.
export function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  return app;
}
