
import React from 'react';
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
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AdminActions } from '@/components/dashboard/provider/admin-actions';
import { revalidatePath } from 'next/cache';

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
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
}

async function updateProfessionalStatus(id: string, newStatus: 'Aprovado' | 'Rejeitado') {
    'use server';
    try {
        const docRef = doc(db, 'professionals', id);
        await updateDoc(docRef, { status: newStatus });
        revalidatePath(`/dashboard/providers/${id}`);
        revalidatePath('/dashboard/providers');
        return { success: true, message: `Status atualizado para ${newStatus}` };
    } catch (error) {
        console.error("Error updating status:", error);
        return { success: false, message: 'Falha ao atualizar o status.' };
    }
}


const StatusBadge = ({ status }: { status: string }) => {
    const configs: any = {
      Aprovado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprovado' },
      Pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      Rejeitado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeitado' }
    };
    
    const config = configs[status] || configs.Pendente;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
};


export default async function DetalheProfissionalAdminPage({ params }: { params: { id: string } }) {
  const professionalId = params.id;
  let professionalData: Professional | null = null;
  let errorMessage: string | null = null;

  try {
    const docRef = doc(db, 'professionals', professionalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      professionalData = { id: docSnap.id, ...docSnap.data() } as Professional;
    } else {
      errorMessage = 'Profissional não encontrado.';
    }
  } catch (error) {
    console.error("Error fetching professional:", error);
    errorMessage = 'Falha ao carregar dados do profissional.';
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>
  }
  
  if (!professionalData) {
      return <div>Profissional não encontrado.</div>
  }

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
              <Button disabled>
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

            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-2">Ações do Administrador</h2>
              <p className="text-sm text-muted-foreground mb-4">Aprove, rejeite ou entre em contato com este profissional.</p>
              
              <AdminActions 
                professionalId={professionalId}
                currentStatus={professionalData.status}
                phone={professionalData.phone}
                fullName={professionalData.fullName}
                updateStatusAction={updateProfessionalStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
