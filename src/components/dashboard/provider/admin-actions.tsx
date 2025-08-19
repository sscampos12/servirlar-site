
"use client";

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, Phone } from 'lucide-react';

interface AdminActionsProps {
    professionalId: string;
    currentStatus: 'Aprovado' | 'Pendente' | 'Rejeitado';
    phone: string;
    fullName: string;
    updateStatusAction: (id: string, newStatus: 'Aprovado' | 'Rejeitado') => Promise<{ success: boolean, message: string }>;
}

const getWhatsAppLink = (phone: string | undefined, fullName: string | undefined) => {
    if (!phone) return '#';
    const telefoneClean = phone.replace(/\D/g, '');
    const mensagem = `Olá ${fullName}! Sou da equipe Ajuda em Casa. Como posso ajudá-lo(a)?`;
    return `https://wa.me/55${telefoneClean}?text=${encodeURIComponent(mensagem)}`;
};


export function AdminActions({ professionalId, currentStatus, phone, fullName, updateStatusAction }: AdminActionsProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();


    const handleStatusChange = (newStatus: 'Aprovado' | 'Rejeitado') => {
        const confirmationText = newStatus === 'Aprovado' 
            ? 'Deseja realmente aprovar este cadastro?'
            : 'Deseja realmente rejeitar este cadastro?';
        
        if (window.confirm(confirmationText)) {
            startTransition(async () => {
                const result = await updateStatusAction(professionalId, newStatus);
                 if (result.success) {
                    toast({ title: 'Sucesso', description: `Cadastro ${newStatus.toLowerCase()} com sucesso!` });
                } else {
                    toast({ variant: 'destructive', title: 'Erro', description: result.message });
                }
            });
        }
    };

    return (
        <div className="space-y-3">
            {currentStatus !== 'Aprovado' && (
                <Button 
                onClick={() => handleStatusChange('Aprovado')}
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700"
                >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />}
                Aprovar Cadastro
                </Button>
            )}
            
            {currentStatus !== 'Rejeitado' && (
                <Button 
                onClick={() => handleStatusChange('Rejeitado')}
                disabled={isPending}
                variant="destructive"
                className="w-full"
                >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <AlertTriangle className="w-4 h-4" />}
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
