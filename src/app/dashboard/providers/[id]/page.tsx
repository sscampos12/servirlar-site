

"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Edit,
  User,
  CreditCard,
  FileText,
  Calendar,
  Phone,
  Download,
  Play,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  BadgeAlert,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { updateProfessionalStatus, deleteProfessional } from '../actions';

interface Professional {
    id: string;
    fullName: string;
    cpf: string;
    birthdate: string;
    createdAt: any; 
    email: string;
    phone: string;
    pixKey: string;
    references: string;
    videoUrl: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Ativo' | 'Inativo';
}

const StatusBadge = ({ status }: { status: string }) => {
    const configs: any = {
      Aprovado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprovado' },
      Pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      Rejeitado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeitado' },
      Ativo: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Ativo' },
      Inativo: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inativo' }
    };
    
    const config = configs[status] || configs.Pendente;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
};


export default function DetalheProfissionalAdminPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const professionalId = params.id as string;
  const [professionalData, setProfessionalData] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfessional = async () => {
        if(!professionalId) return;
        setIsLoading(true);
        try {
            const docRef = doc(db, 'professionals', professionalId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfessionalData({ id: docSnap.id, ...docSnap.data() } as Professional);
            } else {
                toast({ variant: 'destructive', title: 'Erro', description: 'Profissional não encontrado.' });
                router.push('/dashboard/providers');
            }
        } catch (error) {
            console.error("Error fetching professional:", error);
            toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar dados do profissional.' });
        } finally {
            setIsLoading(false);
        }
    };
    fetchProfessional();
  }, [professionalId, router, toast]);

  const handleUpdateStatus = async (newStatus: Professional['status']) => {
    setIsUpdating(true);
    const result = await updateProfessionalStatus(professionalId, newStatus);
    if(result.success) {
        setProfessionalData(prev => prev ? {...prev, status: newStatus} : null);
        toast({ title: 'Sucesso', description: result.message });
    } else {
        toast({ variant: 'destructive', title: 'Erro', description: result.message });
    }
    setIsUpdating(false);
  }

  const handleDelete = async () => {
     if(window.confirm('Tem certeza que deseja deletar este cadastro? Esta ação não pode ser desfeita.')) {
        setIsUpdating(true);
        const result = await deleteProfessional(professionalId);
        if (result.success) {
            toast({ title: 'Sucesso', description: result.message });
            router.push('/dashboard/providers');
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: result.message });
            setIsUpdating(false);
        }
     }
  }


  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>
  }
  
  if (!professionalData) {
      return <div>Profissional não encontrado.</div>
  }

  const isApprovedPhase = ['Aprovado', 'Ativo', 'Inativo'].includes(professionalData.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Link href="/dashboard/providers" className="p-2 hover:bg-muted rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-foreground font-headline">Detalhes do Profissional</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusBadge status={professionalData.status} />
               <Button onClick={() => router.push(`/dashboard/providers/profile?edit=true&id=${professionalData.id}`)}>
                  <Edit className="w-4 h-4 inline mr-1" />
                  Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Informações Pessoais</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Nome Completo</label>
                  <p className="font-medium">{professionalData.fullName}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">CPF</label>
                  <p className="font-medium">{professionalData.cpf}</p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Data de Nascimento</label>
                  <p className="font-medium">{professionalData.birthdate ? new Date(professionalData.birthdate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Data de Cadastro</label>
                  <p className="font-medium text-muted-foreground">{professionalData.createdAt?.toDate().toLocaleDateString('pt-BR') || 'N/A'}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <p className="font-medium">{professionalData.email}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Telefone</label>
                  <p className="font-medium">{professionalData.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Informações Financeiras</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Chave PIX</label>
                  <p className="font-medium">{professionalData.pixKey || 'Não informado'}</p>
                </div>
              </div>
            </div>
            
             <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Referências Pessoais</h2>
              </div>
              <div className="space-y-4">
                 <p className="text-sm">{professionalData.references || 'Nenhuma referência informada.'}</p>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Histórico de Serviços Prestados</h2>
              </div>
                <div className="text-center text-muted-foreground p-8">
                  Nenhum histórico de serviço disponível.
                </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Documentos e Mídia</h2>
              </div>
              
              <div className="space-y-3">
                <button disabled className="w-full flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted text-left disabled:opacity-50">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Antecedentes Criminais (Em breve)</span>
                </button>
                <button disabled className="w-full flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted text-left disabled:opacity-50">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Foto do RG (Em breve)</span>
                </button>
                 {professionalData.videoUrl ? (
                    <a href={professionalData.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-left">
                        <Play className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Ver Vídeo de Apresentação</span>
                    </a>
                ) : (
                     <button disabled className="w-full flex items-center gap-2 p-3 border border-border rounded-lg text-left disabled:opacity-50">
                        <Play className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Sem vídeo de apresentação</span>
                    </button>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Cadastro</CardTitle>
                <CardDescription>
                  {isApprovedPhase 
                    ? "Gerencie o status de atividade do profissional."
                    : "Aprove ou rejeite este novo cadastro."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isApprovedPhase ? (
                  <>
                    <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleUpdateStatus('Ativo')}
                        disabled={isUpdating || professionalData.status === 'Ativo'}>
                        {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />} Ativar
                    </Button>
                    <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleUpdateStatus('Inativo')}
                        disabled={isUpdating || professionalData.status === 'Inativo'}>
                        {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />} Inativar
                    </Button>
                     <Button 
                        className="w-full" 
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />} Deletar Cadastro
                    </Button>
                  </>
                ) : (
                   <>
                    <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        onClick={() => handleUpdateStatus('Aprovado')}
                        disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />} Aprovar Cadastro
                    </Button>
                    <Button 
                        className="w-full" 
                        variant="destructive"
                        onClick={() => handleUpdateStatus('Rejeitado')}
                        disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <BadgeAlert className="mr-2 h-4 w-4" />} Rejeitar Cadastro
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
