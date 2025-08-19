
// ----------------------------------------------------------------
// ORDEM 2: CONTEXTO DE AUTENTICAÇÃO E GERENCIAMENTO DE USUÁRIO
// ----------------------------------------------------------------
// OBJETIVO: Criar um sistema central que monitora o status de login,
//           busca o papel (role) do usuário no Firestore e disponibiliza
//           essas informações para toda a aplicação.
// ----------------------------------------------------------------

"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Importa da ORDEM 1

// Define a estrutura do nosso objeto de usuário
export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
  role: 'admin' | 'client' | 'professional' | null;
}

// Define o que nosso Contexto vai fornecer
interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean; // Informa se a verificação inicial ainda está acontecendo
}

const AuthContext = createContext<AuthContextType>({ user: null, firebaseUser: null, loading: true });

// Componente Provedor que vai envolver nosso app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // "Ouvinte" do Firebase que reage a logins e logouts
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: User | null) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Usuário está logado. Vamos buscar seu perfil no Firestore.
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Perfil encontrado, montamos nosso objeto de usuário
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            name: userDoc.data().name,
            role: userDoc.data().role,
            photoURL: fbUser.photoURL,
          });
        } else {
          // Usuário autenticado mas sem perfil na coleção 'users'.
          // Verificamos a coleção 'professionals' como fallback.
          const professionalDocRef = doc(db, 'professionals', fbUser.uid);
          const professionalDoc = await getDoc(professionalDocRef);
          if (professionalDoc.exists()) {
              setUser({
                uid: fbUser.uid,
                email: fbUser.email,
                name: professionalDoc.data().fullName,
                role: 'professional',
                photoURL: fbUser.photoURL
              });
          } else {
             // Verificamos a coleção 'clients' como fallback final.
            const clientDocRef = doc(db, 'clients', fbUser.uid);
            const clientDoc = await getDoc(clientDocRef);
             if (clientDoc.exists()) {
                setUser({
                    uid: fbUser.uid,
                    email: fbUser.email,
                    name: clientDoc.data().fullName,
                    role: 'client',
                    photoURL: fbUser.photoURL
                });
             } else {
                console.warn("Usuário sem perfil correspondente no Firestore. Deslogando.");
                auth.signOut();
                setUser(null);
             }
          }
        }
      } else {
        // Usuário não está logado.
        setUser(null);
      }
      setLoading(false); // Finaliza o carregamento
    });

    // Limpa o "ouvinte" ao sair da página para evitar problemas
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o acesso ao contexto
export const useAuth = () => useContext(AuthContext);
