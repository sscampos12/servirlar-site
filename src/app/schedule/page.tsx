
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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AgendarServicoAdmin = () => {
  const router = useRouter();
  const { toast } = useToast();
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
  const [cobrancaGerada, setCobrancaGerada] = useState<any>(null);
  const [showCobrancaModal, setShowCobrancaModal] = useState(false);


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

  // Gerar cobrança
  const gerarCobranca = (dadosAgendamento: any) => {
    const cliente = clientes.find(c => c.id === dadosAgendamento.clienteId);
    const profissional = profissionais.find(p => p.id === dadosAgendamento.profissionalId);
    const servico = tiposServico.find(s => s.id === dadosAgendamento.serviceType);
    
    const cobrancaId = 'COB-' + Date.now();
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 3); // 3 dias para vencimento
    
    return {
      id: cobrancaId,
      agendamentoId: 'AGD-' + Date.now(),
      cliente: {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone
      },
      profissional: {
        nome: profissional.nome,
        telefone: profissional.telefone
      },
      servico: {
        tipo: servico?.nome,
        data: new Date(dadosAgendamento.data + 'T00:00:00').toLocaleDateString('pt-BR'),
        horario: dadosAgendamento.horario,
        duracao: opcoesDuracao.find(d => d.value === dadosAgendamento.duracao)?.label,
        endereco: dadosAgendamento.endereco
      },
      financeiro: {
        valor: parseFloat(dadosAgendamento.valor),
        vencimento: vencimento,
        status: 'pendente',
        metodoPagamento: 'pix_ou_cartao'
      },
      observacoes: dadosAgendamento.observacoes,
      criadoEm: new Date(),
      linkPagamento: `https://pay.ajudaemcasa.com/cobranca/${cobrancaId}`,
      pixCopia: `00020126580014br.gov.bcb.pix0136${cobrancaId}520400005303986540${parseFloat(dadosAgendamento.valor).toFixed(2)}5802BR5915AJUDA EM CASA6009SAO PAULO62070503***63042B2D`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Aqui você faria a integração com Firebase
    console.log('Dados do agendamento:', formData);
    
    const novaCobranca = gerarCobranca(formData);
    setCobrancaGerada(novaCobranca);
    setShowCobrancaModal(true);

    setEnviando(false);
    toast({
        title: "Agendamento Criado!",
        description: "A cobrança foi gerada e está pronta para ser enviada.",
    });
  };

  // Fechar modal e resetar formulário
  const fecharModalCobranca = () => {
    setShowCobrancaModal(false);
    setCobrancaGerada(null);
    
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
  };

  // Copiar PIX para área de transferência
  const copiarPix = () => {
    if (cobrancaGerada) {
        navigator.clipboard.writeText(cobrancaGerada.pixCopia);
        toast({ title: 'Código PIX copiado!' });
    }
  };

  // Enviar cobrança por WhatsApp
  const enviarCobrancaPorWhatsApp = () => {
    if (!cobrancaGerada) return;
    const cliente = cobrancaGerada.cliente;
    const mensagem = `
🏠 *AJUDA EM CASA - Nova Cobrança*

Olá ${cliente.nome}! Seu serviço foi agendado com sucesso!

📋 *Detalhes do Serviço:*
• Serviço: ${cobrancaGerada.servico.tipo}
• Data: ${cobrancaGerada.servico.data}
• Horário: ${cobrancaGerada.servico.horario}
• Duração: ${cobrancaGerada.servico.duracao}
• Endereço: ${cobrancaGerada.servico.endereco}

👩‍💼 *Profissional:* ${cobrancaGerada.profissional.nome}

💰 *Valor: R$ ${cobrancaGerada.financeiro.valor.toFixed(2)}*
📅 *Vencimento: ${cobrancaGerada.financeiro.vencimento.toLocaleDateString('pt-BR')}*

🔗 *Link para pagamento:*
${cobrancaGerada.linkPagamento}

Agradecemos pela preferência! 🙏
    `.trim();
    
    const telefoneClean = cliente.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${telefoneClean}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clienteSelecionado = clientes.find(c => c.id === formData.clienteId);
  const profissionalSelecionado = profissionais.find(p => p.id === formData.profissionalId);
  const servicoSelecionado = tiposServico.find(s => s.id === formData.serviceType);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                      Confirmar e Gerar Cobrança
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
    
      {/* Modal de Cobrança Gerada */}
      {showCobrancaModal && cobrancaGerada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="bg-primary text-primary-foreground p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-background/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Agendamento Criado!</h2>
                    <p className="opacity-90">Cobrança gerada automaticamente</p>
                  </div>
                </div>
                <button 
                  onClick={fecharModalCobranca}
                  className="text-primary-foreground hover:bg-background/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {/* Informações da Cobrança */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Detalhes da Cobrança</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID da Cobrança:</span>
                    <p className="font-mono font-medium">{cobrancaGerada.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vencimento:</span>
                    <p className="font-medium">{cobrancaGerada.financeiro.vencimento.toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cliente:</span>
                    <p className="font-medium">{cobrancaGerada.cliente.nome}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <p className="font-bold text-primary">R$ {cobrancaGerada.financeiro.valor.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* PIX Código */}
              <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-secondary-foreground mb-3">Código PIX</h3>
                <div className="bg-background border border-border rounded p-3 mb-3">
                  <code className="text-xs text-muted-foreground break-all">
                    {cobrancaGerada.pixCopia}
                  </code>
                </div>
                <button 
                  onClick={copiarPix}
                  className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded hover:bg-secondary/80 transition-colors"
                >
                  Copiar Código PIX
                </button>
              </div>

              {/* Link de Pagamento */}
              <div className="bg-accent/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-accent-foreground mb-3">Link de Pagamento (Cartão)</h3>
                <div className="bg-background border border-border rounded p-3 mb-3">
                  <a 
                    href={cobrancaGerada.linkPagamento} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all text-sm"
                  >
                    {cobrancaGerada.linkPagamento}
                  </a>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(cobrancaGerada.linkPagamento);
                    toast({ title: 'Link de pagamento copiado!' });
                  }}
                  className="w-full bg-accent text-accent-foreground py-2 px-4 rounded hover:bg-accent/90 transition-colors"
                >
                  Copiar Link de Pagamento
                </button>
              </div>

              {/* Resumo do Serviço */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Resumo do Serviço</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serviço:</span>
                    <span className="font-medium">{cobrancaGerada.servico.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profissional:</span>
                    <span className="font-medium">{cobrancaGerada.profissional.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data/Hora:</span>
                    <span className="font-medium">{cobrancaGerada.servico.data} às {cobrancaGerada.servico.horario}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-medium">{cobrancaGerada.servico.duracao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Endereço:</span>
                    <span className="font-medium text-right max-w-xs">{cobrancaGerada.servico.endereco}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <button 
                  onClick={enviarCobrancaPorWhatsApp}
                  className="w-full bg-[#25D366] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2.02c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.42 1.29 4.88L2 22l5.25-1.38c1.41.78 3.02 1.21 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM12.04 20.1c-1.55 0-3.04-.42-4.32-1.18l-.31-.18-3.21.84.86-3.13-.2-.33c-.85-1.35-1.31-2.91-1.31-4.52 0-4.52 3.67-8.19 8.19-8.19 2.21 0 4.29.87 5.79 2.37s2.37 3.58 2.37 5.79-3.68 8.19-8.19 8.19zm4.4-6.03c-.24-.12-1.42-.7-1.64-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.51.06c-1.32-.54-2.2-.95-3.08-1.85-.2-.23-.42-.49-.61-.77-.19-.28-.02-.43.11-.55.11-.11.24-.28.37-.42s.18-.24.27-.42c.09-.18.05-.33-.01-.45s-.54-1.29-.74-1.77c-.2-.48-.4-.41-.54-.42-.14-.01-.3-.01-.46-.01s-.42.06-.65.3c-.22.24-.85.83-.85 2.01 0 1.18.87 2.33 1 2.49s1.72 2.63 4.15 3.63c.59.24 1.05.38 1.41.48.5.15.94.13 1.3.08.4-.04 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.11-.24-.18-.51-.3z"/></svg>
                  Enviar Cobrança via WhatsApp
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Imprimir
                  </button>
                  <button 
                    onClick={fecharModalCobranca}
                    className="bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors"
                  >
                    Concluído
                  </button>
                </div>
              </div>

              {/* Nota */}
              <div className="mt-6 p-3 bg-accent/20 border border-accent/30 rounded-lg">
                <p className="text-sm text-accent-foreground">
                  <strong>Nota:</strong> O cliente foi notificado automaticamente via email. 
                  O profissional também recebeu as informações do agendamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default AgendarServicoAdmin;
