
'use server';

import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminAuth } from '@/lib/firebase-admin';


type ProfessionalStatus = 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Ativo' | 'Inativo';

export async function updateProfessionalStatus(id: string, newStatus: ProfessionalStatus) {
    try {
        const docRef = doc(db, 'professionals', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, message: 'Profissional não encontrado.' };
        }

        await updateDoc(docRef, { status: newStatus });
        
        return { success: true, message: `Status atualizado para ${newStatus}` };
    } catch (error) {
        console.error("Error updating status:", error);
        return { success: false, message: 'Falha ao atualizar o status.' };
    }
}

export async function deleteProfessional(id: string) {
    try {
        // Deleta do Firebase Authentication
        await adminAuth.deleteUser(id);

        // Deleta do Firestore
        const professionalDocRef = doc(db, 'professionals', id);
        await deleteDoc(professionalDocRef);
        
        // Deleta da coleção de usuários (se existir)
        const userDocRef = doc(db, 'users', id);
        if ((await getDoc(userDocRef)).exists()) {
             await deleteDoc(userDocRef);
        }

        return { success: true, message: 'Profissional deletado com sucesso de todos os sistemas.' };
    } catch (error: any) {
        console.error("Error deleting professional:", error);
        // Trata caso o usuário já tenha sido deletado da autenticação mas não do firestore
        if (error.code === 'auth/user-not-found') {
            const professionalDocRef = doc(db, 'professionals', id);
            await deleteDoc(professionalDocRef);
            return { success: true, message: 'Profissional (registro órfão) deletado com sucesso.' };
        }
        return { success: false, message: 'Falha ao deletar o profissional.' };
    }
}
