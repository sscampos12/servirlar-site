
'use server';

import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; // Import auth
import { Resend } from 'resend';
import { deleteUser } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

// Inicializa o Resend fora da função para reutilização
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = "ServirLar <onboarding@resend.dev>";

type ProfessionalStatus = 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Ativo' | 'Inativo';

// Função auxiliar para enviar e-mails
async function sendStatusEmail(to: string, fullName: string, newStatus: ProfessionalStatus) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "") {
        console.warn('--- MODO DE SIMULAÇÃO (RESEND_API_KEY não configurada) ---');
        console.log(`E-mail de status '${newStatus}' seria enviado para ${to}`);
        return { success: true, message: 'Simulação de e-mail.' };
    }

    let subject = '';
    let html = '';

    switch(newStatus) {
        case 'Aprovado':
            subject = 'Parabéns! Seu cadastro na ServirLar foi aprovado!';
            html = `<h1>Olá, ${fullName}!</h1><p>Temos uma ótima notícia! Seu perfil foi analisado e <strong>aprovado</strong>.</p><p>Você já pode acessar a plataforma e visualizar os serviços disponíveis para você. Desejamos muito sucesso!</p><p>Atenciosamente,<br>Equipe ServirLar</p>`;
            break;
        case 'Rejeitado':
            subject = 'Atualização sobre seu cadastro na ServirLar';
            html = `<h1>Olá, ${fullName}.</h1><p>Após uma análise do seu perfil, informamos que seu cadastro foi <strong>rejeitado</strong> no momento.</p><p>Caso queira mais informações, por favor, entre em contato com nosso suporte.</p><p>Atenciosamente,<br>Equipe ServirLar</p>`;
            break;
        // Outros status podem ser adicionados aqui se necessário
        default:
            return { success: true, message: "Nenhum e-mail necessário para este status." }; // Não envia email para outros status
    }

    try {
        await resend.emails.send({ from: fromEmail, to, subject, html });
        return { success: true, message: 'E-mail de notificação enviado com sucesso.' };
    } catch (error) {
        console.error("Erro ao enviar e-mail de status:", error);
        // Não retorna erro fatal para a UI, apenas loga.
        return { success: false, message: 'Falha ao enviar e-mail de notificação.' };
    }
}


export async function updateProfessionalStatus(id: string, newStatus: ProfessionalStatus) {
    try {
        const docRef = doc(db, 'professionals', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, message: 'Profissional não encontrado.' };
        }

        const professionalData = docSnap.data();
        await updateDoc(docRef, { status: newStatus });
        
        // CORREÇÃO: Chama a função de envio de e-mail
        if (newStatus === 'Aprovado' || newStatus === 'Rejeitado') {
            await sendStatusEmail(professionalData.email, professionalData.fullName, newStatus);
        }
        
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
