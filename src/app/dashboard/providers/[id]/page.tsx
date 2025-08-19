
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
  Users
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use } from 'react';

const DetalheProfissionalAdmin = ({ params }: { params: { id: string } }) => {
  const { id } = use(params);
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  // Estados dos dados do profissional
  const [profissionalData, setProfissionalData] = useState({
    // Informações Pessoais
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '',
    dataCadastro: '',
    email: '',
    telefone: '',
    
    // Informações Financeiras e Pessoais
    chavePix: '',
    referenciasPessoais: [] as string[],
    
    // Métricas
    servicosRealizados: 0,
    totalFaturado: 0,
    
    // Histórico
    historico: [] as any[],
    
    // Status
    status: 'aprovado' // aprovado, pendente, rejeitado
  });

  // Dados temporários para edição
  const [dadosEdicao, setDadosEdicao] = useState<any>({});

  // Carregar dados do profissional (simulado)
  useEffect(() => {
    setTimeout(() => {
      const dadosSimulados = {
        nomeCompleto: 'Maria Aparecida',
        cpf: '123.456.789-00',
        dataNascimento: '1985-05-10',
        dataCadastro: '15/07/2024',
        email: 'maria.aparecida@example.com',
        telefone: '(11) 98765-4321',
        chavePix: 'maria.pix@banco.com',
        referenciasPessoais: [
          'Sra. Ana Silva - (11) 99999-1111 - Trabalhou por 2 anos',
          'Sr. João Santos - (11) 88888-2222 - Trabalhou por 1 ano',
          'Família Oliveira - (11) 77777-3333 - Trabalhou por 3 anos'
        ],
        servicosRealizados: 3,
        totalFaturado: 566.00,
        historico: [
          {
            id: 1,
            cliente: 'Carlos Mendes',
            servico: 'Faxina Padrão',
            data: '10/07/2024',
            status: 'Finalizado',
            valor: 140.00
          },
          {
            id: 2,
            cliente: 'Pedro Souza',
            servico: 'Cozinheira',
            data: '11/07/2024',
            status: 'Finalizado',
            valor: 228.00
          },
          {
            id: 3,
            cliente: 'Fernanda Lima',
            servico: 'Faxina Padrão',
            data: '15/07/2024',
            status: 'Confirmado',
            valor: 198.00
          }
        ],
        status: 'aprovado'
      };
      
      setProfissionalData(dadosSimulados);
      setDadosEdicao(dadosSimulados);
      setLoading(false);
    }, 1000);
  }, []);

  // Alternar modo de edição
  const toggleEditMode = () => {
    if (editMode) {
      // Cancelar edição - reverter dados
      setDadosEdicao({ ...profissionalData });
    }
    setEditMode(!editMode);
  };

  // Salvar alterações
  const salvarAlteracoes = async () => {
    setSalvando(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Atualizar dados principais
    setProfissionalData({ ...dadosEdicao });
    setEditMode(false);
    setSalvando(false);
    
    alert('Dados atualizados com sucesso!');
  };

  // Atualizar campos de edição
  const handleInputChange = (field: string, value: string) => {
    setDadosEdicao((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Ações do administrador
  const aprovarCadastro = async () => {
    if (window.confirm('Deseja aprovar este cadastro?')) {
      setSalvando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfissionalData(prev => ({ ...prev, status: 'aprovado' }));
      setSalvando(false);
      alert('Cadastro aprovado com sucesso!');
    }
  };

  const rejeitarCadastro = async () => {
    const motivo = window.prompt('Motivo da rejeição (opcional):');
    if (motivo !== null) {
      setSalvando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfissionalData(prev => ({ ...prev, status: 'rejeitado' }));
      setSalvando(false);
      alert('Cadastro rejeitado.');
    }
  };

  const getWhatsAppLink = (phone: string | undefined) => {
    if (!phone) {
        return '#';
    }
    const telefoneClean = phone.replace(/\D/g, '');
    const mensagem = `Olá ${profissionalData.nomeCompleto}! Sou da equipe Ajuda em Casa. Como posso ajudá-lo(a)?`;
    return `https://wa.me/55${telefoneClean}?text=${encodeURIComponent(mensagem)}`;
  };

  // Componente de Status
  const StatusBadge = ({ status }: { status: string }) => {
    const configs: any = {
      aprovado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprovado' },
      pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      rejeitado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeitado' }
    };
    
    const config = configs[status] || configs.pendente;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados do profissional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={toggleEditMode}
                    disabled={salvando}
                    className="px-4 py-2 border border-input text-foreground rounded-lg hover:bg-muted disabled:opacity-50"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancelar
                  </button>
                  <button
                    onClick={salvarAlteracoes}
                    disabled={salvando}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {salvando ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Salvando...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 inline mr-1" />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Seção Esquerda - Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informações Pessoais */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Informações Pessoais</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Nome Completo</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={dadosEdicao.nomeCompleto}
                      onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                      className="w-full border border-input bg-background rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  ) : (
                    <p className="font-medium">{profissionalData.nomeCompleto}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">CPF</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={dadosEdicao.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className="w-full border border-input bg-background rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  ) : (
                    <p className="font-medium">{profissionalData.cpf}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Data de Nascimento</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={dadosEdicao.dataNascimento}
                      onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                      className="w-full border border-input bg-background rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  ) : (
                    <p className="font-medium">{new Date(profissionalData.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Data de Cadastro</label>
                  <p className="font-medium text-muted-foreground">{profissionalData.dataCadastro}</p>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={dadosEdicao.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-input bg-background rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  ) : (
                    <p className="font-medium">{profissionalData.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Telefone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={dadosEdicao.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className="w-full border border-input bg-background rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  ) : (
                    <p className="font-medium">{profissionalData.telefone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Financeiras */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Informações Financeiras</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Chave PIX</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={dadosEdicao.chavePix}
                      onChange={(e) => handleInputChange('chavePix', e.target.value)}
                      className="w-full border border-input bg-background rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  ) : (
                    <p className="font-medium">{profissionalData.chavePix}</p>
                  )}
                </div>
                
              </div>
            </div>
            
            {/* Referências Pessoais */}
             <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Referências Pessoais</h2>
              </div>
              <div className="space-y-4">
                 <ul className="list-disc list-inside space-y-1">
                    {profissionalData.referenciasPessoais.map((ref: string, index: number) => (
                      <li key={index} className="text-sm">{ref}</li>
                    ))}
                  </ul>
              </div>
            </div>


            {/* Histórico de Serviços */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Histórico de Serviços Prestados</h2>
              </div>
              
              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Serviços Realizados</p>
                    <p className="text-xl font-bold">{profissionalData.servicosRealizados}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Faturado</p>
                    <p className="text-xl font-bold">R$ {profissionalData.totalFaturado.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Tabela de Histórico */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Serviço</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Data</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Valor (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profissionalData.historico.map((item: any) => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="py-3 px-2">{item.cliente}</td>
                        <td className="py-3 px-2">{item.servico}</td>
                        <td className="py-3 px-2">{item.data}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Finalizado' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-medium">{item.valor.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Seção Direita - Documentos e Ações */}
          <div className="space-y-6">
            
            {/* Documentos e Mídia */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Documentos e Mídia</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted text-left">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Baixar Antecedentes Criminais</span>
                </button>
                
                <button className="w-full flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted text-left">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Baixar Foto do RG</span>
                </button>
                
                <button className="w-full flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted text-left">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Baixar Comprovante de Residência</span>
                </button>
                
                <button className="w-full flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-left">
                  <Play className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Ver Vídeo de Apresentação</span>
                </button>
              </div>
            </div>

            {/* Ações do Administrador */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-2">Ações do Administrador</h2>
              <p className="text-sm text-muted-foreground mb-4">Aprove, rejeite ou entre em contato com este profissional.</p>
              
              <div className="space-y-3">
                {profissionalData.status !== 'aprovado' && (
                  <button 
                    onClick={aprovarCadastro}
                    disabled={salvando}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Aprovar Cadastro
                  </button>
                )}
                
                {profissionalData.status !== 'rejeitado' && (
                  <button 
                    onClick={rejeitarCadastro}
                    disabled={salvando}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Rejeitar Cadastro
                  </button>
                )}
                
                <button 
                  onClick={() => window.open(getWhatsAppLink(profissionalData.telefone), '_blank')}
                  className="w-full flex items-center justify-center gap-2 border border-input text-foreground py-3 px-4 rounded-lg hover:bg-muted"
                >
                  <Phone className="w-4 h-4" />
                  Contatar via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalheProfissionalAdmin;
