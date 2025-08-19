
"use client"

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users,
  DollarSign,
  FileText,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const AgendarServicoAdmin = () => {
  const { toast } = useToast();
  const router = useRouter();
  // Estados do formulário
  const [formData, setFormData] = useState({
    serviceType: '',
    clienteId: '',
    profissionalId: '',
    data: '',
    horario: '',
    duracao: '',
    endereco: '',
    observacoes: '',
    valor: ''
  });

  // Estados para dados do sistema
  const [clientes, setClientes] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Dados simulados (em produção viriam do Firebase)
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClientes([
        { id: '1', nome: 'Ana Silva', email: 'ana.silva@email.com', telefone: '(11) 99999-1111', endereco: 'Rua das Flores, 123 - Centro' },
        { id: '2', nome: 'Carlos Mendes', email: 'carlos.mendes@email.com', telefone: '(11) 99999-2222', endereco: 'Av. Paulista, 456 - Bela Vista' },
        { id: '3', nome: 'Maria Santos', email: 'maria.santos@email.com', telefone: '(11) 99999-3333', endereco: 'Rua Augusta, 789 - Consolação' },
        { id: '4', nome: 'João Oliveira', email: 'joao.oliveira@email.com', telefone: '(11) 99999-4444', endereco: 'Rua Oscar Freire, 321 - Jardins' },
        { id: '5', nome: 'Fernanda Costa', email: 'fernanda.costa@email.com', telefone: '(11) 99999-5555', endereco: 'Rua Consolação, 654 - Centro' }
      ]);

      setProfissionais([
        { id: '1', nome: 'Maria da Silva', servico: 'Faxina Padrão', telefone: '(11) 88888-1111', avaliacao: 4.9, preco: 80.00 },
        { id: '2', nome: 'João Paulo', servico: 'Passadoria', telefone: '(11) 88888-2222', avaliacao: 4.7, preco: 45.00 },
        { id: '3', nome: 'Ana Carolina', servico: 'Cozinheira', telefone: '(11) 88888-3333', avaliacao: 4.8, preco: 120.00 },
        { id: '4', nome: 'Pedro Santos', servico: 'Cuidador(a) de Idosos', telefone: '(11) 88888-4444', avaliacao: 4.9, preco: 150.00 },
        { id: '5', nome: 'Lucia Ferreira', servico: 'Faxina Padrão', telefone: '(11) 88888-5555', avaliacao: 4.6, preco: 75.00 },
        { id: '6', nome: 'Roberto Silva', servico: 'Passadoria', telefone: '(11) 88888-6666', avaliacao: 4.5, preco: 40.00 }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Tipos de serviço
  const tiposServico = [
    { id: 'faxina', nome: 'Faxina Padrão', icon: '🏠' },
    { id: 'passadoria', nome: 'Passadoria', icon: '👕' },
    { id: 'cozinheira', nome: 'Cozinheira', icon: '👩‍🍳' },
    { id: 'cuidador', nome: 'Cuidador(a) de Idosos', icon: '👵' }
  ];

  // Opções de duração
  const opcoesDuracao = [
    { value: '2h', label: '2 horas' },
    { value: '4h', label: '4 horas' },
    { value: '6h', label: '6 horas' },
    { value: '8h', label: '8 horas' },
    { value: 'dia-inteiro', label: 'Dia inteiro' }
  ];

  // Atualizar formulário
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-preencher endereço do cliente
    if (field === 'clienteId') {
      const cliente = clientes.find(c => c.id === value);
      if (cliente) {
        setFormData(prev => ({ ...prev, endereco: cliente.endereco }));
      }
    }

    // Auto-preencher valor do profissional
    if (field === 'profissionalId') {
      const profissional = profissionais.find(p => p.id === value);
      if (profissional) {
        setFormData(prev => ({ ...prev, valor: profissional.preco.toFixed(2) }));
      }
    }
  };

  // Filtrar profissionais por tipo de serviço
  const profissionaisFiltrados = formData.serviceType 
    ? profissionais.filter(p => {
        const serviceMap: { [key: string]: string } = {
          'faxina': 'Faxina Padrão',
          'passadoria': 'Passadoria',
          'cozinheira': 'Cozinheira',
          'cuidador': 'Cuidador(a) de Idosos'
        };
        return p.servico === serviceMap[formData.serviceType];
      })
    : profissionais;

  // Enviar agendamento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Aqui você faria a integração com Firebase
    console.log('Dados do agendamento:', formData);
    
    setEnviando(false);
    toast({
        title: 'Agendamento criado com sucesso!',
        description: 'Cliente e profissional foram notificados.'
    })
    
    // Reset do formulário
    setFormData({
      serviceType: '',
      clienteId: '',
      profissionalId: '',
      data: '',
      horario: '',
      duracao: '',
      endereco: '',
      observacoes: '',
      valor: ''
    });

    router.push("/dashboard");
  };

  // Calcular resumo
  const clienteSelecionado = clientes.find(c => c.id === formData.clienteId);
  const profissionalSelecionado = profissionais.find(p => p.id === formData.profissionalId);
  const servicoSelecionado = tiposServico.find(s => s.id === formData.serviceType);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-headline">Agendar um Novo Serviço</h1>
              <p className="text-muted-foreground">Painel administrativo - Agendamento manual</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form id="agendamento-form" onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-2 font-headline">Detalhes do Serviço</h2>
              <p className="text-muted-foreground mb-6">Preencha as informações abaixo para encontrar o profissional ideal.</p>

              <div className="space-y-6">
                {/* 1. Tipo de Serviço */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    1. Qual serviço você precisa?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {tiposServico.map((servico) => (
                      <button
                        key={servico.id}
                        type="button"
                        onClick={() => handleInputChange('serviceType', servico.id)}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          formData.serviceType === servico.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="text-2xl mb-2">{servico.icon}</div>
                        <div className="font-medium">{servico.nome}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Cliente */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    2. Selecione o cliente
                  </label>
                  <select
                    value={formData.clienteId}
                    onChange={(e) => handleInputChange('clienteId', e.target.value)}
                    className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    required
                  >
                    <option value="">Selecione um cliente...</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.telefone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Profissional */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    3. Selecione o profissional
                  </label>
                  <select
                    value={formData.profissionalId}
                    onChange={(e) => handleInputChange('profissionalId', e.target.value)}
                    className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    required
                    disabled={!formData.serviceType}
                  >
                    <option value="">
                      {formData.serviceType ? 'Selecione um profissional...' : 'Primeiro selecione o tipo de serviço'}
                    </option>
                    {profissionaisFiltrados.map((profissional) => (
                      <option key={profissional.id} value={profissional.id}>
                        {profissional.nome} - ⭐{profissional.avaliacao} - R$ {profissional.preco.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Data e Horário */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      4. Escolha a data
                    </label>
                    <input
                      type="date"
                      value={formData.data}
                      onChange={(e) => handleInputChange('data', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      5. Escolha o horário
                    </label>
                    <input
                      type="time"
                      value={formData.horario}
                      onChange={(e) => handleInputChange('horario', e.target.value)}
                      className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                      required
                    />
                  </div>
                </div>

                {/* 6. Duração */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    6. Qual a duração?
                  </label>
                  <select
                    value={formData.duracao}
                    onChange={(e) => handleInputChange('duracao', e.target.value)}
                    className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    required
                  >
                    <option value="">Selecione...</option>
                    {opcoesDuracao.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Endereço */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    7. Endereço do serviço
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    placeholder="Rua das Flores, 123 - Centro"
                    className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    required
                  />
                </div>

                {/* 8. Valor */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    8. Valor do serviço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => handleInputChange('valor', e.target.value)}
                    placeholder="140.00"
                    className="w-full border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring"
                    required
                  />
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Observações (Opcional)
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Ex: Tenho um cachorro. Por favor, trazer produto para limpar vidro."
                    rows={3}
                    className="w-full border border-input bg-background rounded-lg px-3 py-3 focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Agendamento */}
          <div>
            <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 font-headline">Resumo do Agendamento</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Home className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Serviço</p>
                    <p className="font-medium">
                      {servicoSelecionado ? servicoSelecionado.nome : 'Não selecionado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">
                      {clienteSelecionado ? clienteSelecionado.nome : 'Não selecionado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profissional</p>
                    <p className="font-medium">
                      {profissionalSelecionado ? profissionalSelecionado.nome : 'Não selecionado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {formData.data ? new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não selecionada'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horário e Duração</p>
                    <p className="font-medium">
                      {formData.horario && formData.duracao 
                        ? `${formData.horario} - ${opcoesDuracao.find(o => o.value === formData.duracao)?.label}` 
                        : 'N/A - N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium text-sm">
                      {formData.endereco || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Valor Estimado</span>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {formData.valor || '0,00'}
                  </span>
                </div>

                <button
                  type="submit"
                  form="agendamento-form"
                  disabled={enviando || !formData.serviceType || !formData.clienteId || !formData.profissionalId || !formData.data || !formData.horario}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:bg-muted-foreground disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {enviando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Confirmar e Agendar
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Ao continuar, você concorda com nossos{' '}
                  <span className="text-primary cursor-pointer hover:underline">Termos de Serviço</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default AgendarServicoAdmin;
