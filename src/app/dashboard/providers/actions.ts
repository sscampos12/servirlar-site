"use server";

import { initializeAdminApp } from "@/lib/firebase-admin";
import * as admin from 'firebase-admin';
import { revalidatePath } from "next/cache";

type ProfessionalStatus = 'Aprovado' | 'Rejeitado' | 'Ativo' | 'Inativo';

// Garante que o app admin está inicializado
initializeAdminApp();
const adminFirestore = admin.firestore();
const adminAuth = admin.auth();


export async function updateProfessionalStatusAction(id: string, newStatus: ProfessionalStatus) {
    if (!id) {
        return { success: false, message: "ID do profissional não fornecido." };
    }
    
    try {
        const professionalRef = adminFirestore.collection('professionals').doc(id);
        
        await professionalRef.update({
            status: newStatus
        });
        
        revalidatePath(`/dashboard/providers`);
        revalidatePath(`/dashboard/providers/${id}`);
        
        return { success: true, message: `Status do profissional atualizado para ${newStatus}.` };

    } catch (error: any) {
        console.error("Error updating status:", error);
        return { success: false, message: "Falha ao atualizar o status no servidor." };
    }
}


export async function deleteProfessionalAction(id: string) {
    if (!id) {
        return { success: false, message: "ID do profissional não fornecido." };
    }
    
    try {
        // Deleta do Firestore
        await adminFirestore.collection('professionals').doc(id).delete();
        
        // Deleta o usuário da autenticação
        await adminAuth.deleteUser(id);

        revalidatePath(`/dashboard/providers`);
        
        return { success: true, message: "Profissional deletado com sucesso." };
    } catch (error: any) {
        console.error("Error deleting professional:", error);
        // Se o usuário já foi deletado da autenticação mas não do firestore, pode dar erro.
        if (error.code === 'auth/user-not-found') {
            return { success: true, message: "Profissional já removido da autenticação e agora do banco de dados." };
        }
        return { success: false, message: "Falha ao deletar o profissional no servidor." };
    }
}
