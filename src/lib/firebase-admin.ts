// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Adiciona a importação e configuração do dotenv no topo do arquivo
require('dotenv').config();


// Verifica se o Firebase Admin já foi inicializado
if (!admin.apps.length) {
  try {
    // Opção 1: Usando Service Account Key (arquivo JSON)
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: "googleapis.com"
    };

    // Adiciona uma verificação para garantir que as variáveis de ambiente críticas existem
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('As variáveis de ambiente do Firebase Admin SDK não estão definidas. Verifique seu arquivo .env.');
    }


    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    
    console.log('Firebase Admin inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin:', error);
    throw error;
  }
} else {
  console.log('Firebase Admin já foi inicializado');
}

export const initializeAdminApp = () => {
  return {
    db: admin.firestore(),
    auth: admin.auth(),
  };
};

export const db = admin.firestore();
export const auth = admin.auth();

// Funções utilitárias para Firestore
export const createDocument = async (collection: string, data: any) => {
  try {
    const docRef = await db.collection(collection).add(data);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    throw error;
  }
};

export const getDocument = async (collection: string, id: string) => {
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    throw error;
  }
};

export const updateDocument = async (collection: string, id: string, data: any) => {
  try {
    await db.collection(collection).doc(id).update(data);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    throw error;
  }
};

export const deleteDocument = async (collection: string, id: string) => {
  try {
    await db.collection(collection).doc(id).delete();
    return true;
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw error;
  }
};
