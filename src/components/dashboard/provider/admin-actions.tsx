
"use client";

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminActionsProps {
    professionalId: string;
    currentStatus: 'Aprovado' | 'Pendente' | 'Rejeitado';
    phone: string;
    fullName: string;
}

const getWhatsAppLink = (phone: string | undefined, fullName: string | undefined) => {
    if (!phone) return '#';
    const telefoneClean = phone.replace(/\D/g, '');
    const mensagem = `Olá ${fullName}! Sou da equipe Ajuda em Casa. Como posso ajudá-lo(a)?`;
    return `https://wa.me/55${telefoneClean}?text=${encodeURIComponent(mensagem)}`;
};


export function AdminActions({ professionalId, currentStatus, phone, fullName }: AdminActionsProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusChange = async (newStatus: 'Aprovado' | 'Rejeitado') => {
        const confirmationText = newStatus === 'Aprovado' 
            ? 'Deseja realmente aprovar este cadastro?'
            : 'Deseja realmente rejeitar este cadastro?';
        
        if (window.confirm(confirmationText)) {
            setIsSaving(true);
            try {
                const docRef = doc(db, 'professionals', professionalId);
                await updateDoc(docRef, { status: newStatus });
                setStatus(newStatus);
                toast({ title: 'Sucesso', description: `Cadastro ${newStatus.toLowerCase()} com sucesso!` });
                router.refresh(); // Re-fetches server-side data
            } catch (error) {
                console.error("Error updating status:", error);
                toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao atualizar o status.' });
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="space-y-3">
            {status !== 'Aprovado' && (
                <Button 
                onClick={() => handleStatusChange('Aprovado')}
                disabled={isSaving}
                className="w-full bg-green-600 hover:bg-green-700"
                >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />}
                Aprovar Cadastro
                </Button>
            )}
            
            {status !== 'Rejeitado' && (
                <Button 
                onClick={() => handleStatusChange('Rejeitado')}
                disabled={isSaving}
                variant="destructive"
                className="w-full"
                >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <AlertTriangle className="w-4 h-4" />}
                Rejeitar Cadastro
                </Button>
            )}
            
            <a 
                href={getWhatsAppLink(phone, fullName)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-input text-foreground py-2 px-4 rounded-md hover:bg-muted text-sm"
            >
                <Phone className="w-4 h-4" />
                Contatar via WhatsApp
            </a>
        </div>
    );
}
