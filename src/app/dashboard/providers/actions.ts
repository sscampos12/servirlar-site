
'use server';

import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ProfessionalStatus = 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Ativo' | 'Inativo';

export async function updateProfessionalStatus(id: string, newStatus: ProfessionalStatus) {
    try {
        const docRef = doc(db, 'professionals', id);
        await updateDoc(docRef, { status: newStatus });
        return { success: true, message: `Status atualizado para ${newStatus}` };
    } catch (error) {
        console.error("Error updating status:", error);
        return { success: false, message: 'Falha ao atualizar o status.' };
    }
}

export async function deleteProfessional(id: string) {
    try {
        const docRef = doc(db, 'professionals', id);
        await deleteDoc(docRef);
        const userDocRef = doc(db, 'users', id);
        if ((await getDoc(userDocRef)).exists()) {
             await deleteDoc(userDocRef);
        }
        return { success: true, message: 'Profissional deletado com sucesso.' };
    } catch (error) {
        console.error("Error deleting professional:", error);
        return { success: false, message: 'Falha ao deletar o profissional.' };
    }
}
