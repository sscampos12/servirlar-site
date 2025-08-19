
"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  CreditCard,
  FileText,
  Calendar,
  DollarSign,
  Phone,
  Download,
  Play,
  Check,
  AlertTriangle,
  Users,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Professional {
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

const DetalheProfissionalAdmin = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  
  const [profissionalData, setProfissionalData] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  useEffect(() => {
    if (!id) return;

    const fetchProfissional = async () => {
      try {
        const docRef = doc(db, 'professionals', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfissionalData(docSnap.data() as Professional);
        } else {
          toast({ variant: 'destructive', title: 'Erro', description: 'Profissional não encontrado.' });
          router.push('/dashboard/providers');
        }
      } catch (error) {
        console.error("Error fetching professional:", error);
        toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar dados do profissional.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfissional();
  }, [id, router, toast]);

  const handleStatusChange = async (newStatus: 'Aprovado' | 'Rejeitado') => {
      const confirmationText = newStatus === 'Aprovado' 
          ? 'Deseja realmente aprovar este cadastro?'
          : 'Deseja realmente rejeitar este cadastro?';
      
      if (window.confirm(confirmationText)) {
          setSalvando(true);
          try {
              const docRef = doc(db, 'professionals', id);
              await updateDoc(docRef, { status: newStatus });
              setProfissionalData(prev => prev ? { ...prev, status: newStatus } : null);
              toast({ title: 'Sucesso', description: `Cadastro ${newStatus.toLowerCase()} com sucesso!` });
          } catch (error) {
              console.error("Error updating status:", error);
              toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao atualizar o status.' });
          } finally {
              setSalvando(false);
          }
      }
  };

  const getWhatsAppLink = (phone: string | undefined) => {
    if (!phone) return '#';
    const telefoneClean = phone.replace(/\D/g, '');
    const mensagem = `Olá ${profissionalData?.fullName}! Sou da equipe Ajuda em Casa. Como posso ajudá-lo(a)?`;
    return `https://wa.me/55${telefoneClean}?text=${encodeURIComponent(mensagem)}`;
  };

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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profissionalData) {
      return <div>Profissional não encontrado.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-foreground font-headline">Detalhes do Profissional</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusBadge status={profissionalData.status} />
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
                  <p className="font-medium">{profissionalData.fullName}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">CPF</label>
                  <p className="font-medium">{profissionalData.cpf}</p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Data de Nascimento</label>
                  <p className="font-medium">{profissionalData.birthdate ? new Date(profissionalData.birthdate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Data de Cadastro</label>
                  <p className="font-medium text-muted-foreground">{profissionalData.createdAt?.toDate().toLocaleDateString('pt-BR') || 'N/A'}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <p className="font-medium">{profissionalData.email}</p>
                </div>
                 <div>
                  <label className="block text-sm text-muted-foreground mb-1">Telefone</label>
                  <p className="font-medium">{profissionalData.phone}</p>
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
                  <p className="font-medium">{profissionalData.pixKey || 'Não informado'}</p>
                </div>
              </div>
            </div>
            
             <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Referências Pessoais</h2>
              </div>
              <div className="space-y-4">
                 <p className="text-sm">{profissionalData.references || 'Nenhuma referência informada.'}</p>
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
                 {profissionalData.videoUrl ? (
                    <a href={profissionalData.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-left">
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
              
              <div className="space-y-3">
                {profissionalData.status !== 'Aprovado' && (
                  <button 
                    onClick={() => handleStatusChange('Aprovado')}
                    disabled={salvando}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {salvando ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />}
                    Aprovar Cadastro
                  </button>
                )}
                
                {profissionalData.status !== 'Rejeitado' && (
                  <button 
                    onClick={() => handleStatusChange('Rejeitado')}
                    disabled={salvando}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {salvando ? <Loader2 className="w-4 h-4 animate-spin"/> : <AlertTriangle className="w-4 h-4" />}
                    Rejeitar Cadastro
                  </button>
                )}
                
                <a 
                  href={getWhatsAppLink(profissionalData.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-input text-foreground py-3 px-4 rounded-lg hover:bg-muted"
                >
                  <Phone className="w-4 h-4" />
                  Contatar via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalheProfissionalAdmin;
