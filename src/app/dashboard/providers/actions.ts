
'use server';

import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAdminApp } from '@/lib/firebase-admin';


type ProfessionalStatus = 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Ativo' | 'Inativo';

export async function updateProfessionalStatus(id: string, newStatus: ProfessionalStatus) {
    try {
        const docRef = doc(db, 'professionals', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, message: 'Profissional não encontrado.' };
        }

        await updateDoc(docRef, { status: newStatus });
        
        // A lógica de envio de e-mail foi removida daqui.
        
        return { success: true, message: `Status atualizado para ${newStatus}` };
    } catch (error) {
        console.error("Error updating status:", error);
        return { success: false, message: 'Falha ao atualizar o status.' };
    }
}

export async function deleteProfessional(id: string) {
    try {
        const adminApp = getAdminApp();
        const adminAuth = adminApp.auth;

        // Deleta do Firestore
        const professionalDocRef = doc(db, 'professionals', id);
        await deleteDoc(professionalDocRef);
        
        // Deleta da coleção de usuários (se existir)
        const userDocRef = doc(db, 'users', id);
        if ((await getDoc(userDocRef)).exists()) {
             await deleteDoc(userDocRef);
        }

        // Deleta do Firebase Authentication
        await adminAuth.deleteUser(id);

        return { success: true, message: 'Profissional deletado com sucesso de todos os sistemas.' };
    } catch (error) {
        console.error("Error deleting professional:", error);
        return { success: false, message: 'Falha ao deletar o profissional.' };
    }
}
