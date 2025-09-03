// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Adiciona a importação e configuração do dotenv no topo do arquivo
// Isso é útil para desenvolvimento local, mas o applicationDefault() é preferível para produção
require('dotenv').config();

// Esta função garante que a inicialização só ocorra uma vez
// e de forma segura no ambiente do servidor.
export function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return {
      db: admin.firestore(),
      auth: admin.auth(),
    };
  }

  try {
    // Tenta inicializar com as credenciais padrão do ambiente (ideal para Firebase/Google Cloud)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin inicializado com sucesso usando Application Default Credentials.');
  } catch (e) {
    console.warn(
      'Falha ao inicializar com credenciais padrão. Tentando com variáveis de ambiente manuais...',
      e
    );
    // Fallback para variáveis de ambiente, caso o método padrão falhe ou não esteja configurado
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
       throw new Error('As variáveis de ambiente do Firebase Admin SDK não estão definidas. Verifique a configuração do seu ambiente.');
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin inicializado com sucesso usando variáveis de ambiente.');
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
  };
};

// Funções utilitárias para Firestore
export const createDocument = async (collectionName: string, data: any) => {
    const { db } = initializeAdminApp();
    const docRef = await db.collection(collectionName).add(data);
    return docRef.id;
};

export const getDocument = async (collectionName: string, id: string) => {
    const { db } = initializeAdminApp();
    const doc = await db.collection(collectionName).doc(id).get();
    if (doc.exists) {
        return { id: doc.id, ...doc.data() };
    }
    return null;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
    const { db } = initializeAdminApp();
    await db.collection(collectionName).doc(id).update(data);
    return true;
};

export const deleteDocument = async (collectionName: string, id: string) => {
    const { db } = initializeAdminApp();
    await db.collection(collectionName).doc(id).delete();
    return true;
};
