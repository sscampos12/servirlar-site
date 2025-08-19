
"use client";

import React, { useState } from 'react';
import { 
  Search,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DashboardClientes = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Lista de clientes (simulada)
  const clientes = [
    {
      id: 1,
      nome: 'Carlos Mendes',
      email: 'carlos.mendes@example.com',
      telefone: '(11) 91234-5678',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      totalGasto: 750.00,
      totalAgendamentos: 5,
      ultimoServico: '10/07/2024',
      status: 'ativo',
      historico: [
        {
          id: 1,
          servico: 'Faxina Padrão',
          valor: 140.00,
          profissional: 'Maria Aparecida',
          data: '10/07/2024',
          status: 'Finalizado'
        },
        {
          id: 2,
          servico: 'Passadoria',
          valor: 74.00,
          profissional: 'Ana Paula',
          data: '25/06/2024',
          status: 'Finalizado'
        },
        {
          id: 3,
          servico: 'Faxina Padrão',
          valor: 140.00,
          profissional: 'Maria Aparecida',
          data: '10/06/2024',
          status: 'Finalizado'
        },
        {
          id: 4,
          servico: 'Passadoria',
          valor: 148.00,
          profissional: 'Ana Paula',
          data: '25/05/2024',
          status: 'Finalizado'
        },
        {
          id: 5,
          servico: 'Cozinheira',
          valor: 248.00,
          profissional: 'João da Silva',
          data: '11/05/2024',
          status: 'Finalizado'
        }
      ]
    },
    {
      id: 2,
      nome: 'Ana Silva',
      email: 'ana.silva@example.com',
      telefone: '(11) 99876-5432',
      endereco: 'Av. Paulista, 456 - São Paulo, SP',
      totalGasto: 420.00,
      totalAgendamentos: 3,
      ultimoServico: '15/07/2024',
      status: 'ativo',
      historico: [
        {
          id: 1,
          servico: 'Faxina Completa',
          valor: 180.00,
          profissional: 'Maria Aparecida',
          data: '15/07/2024',
          status: 'Finalizado'
        },
        {
          id: 2,
          servico: 'Cozinheira',
          valor: 240.00,
          profissional: 'João da Silva',
          data: '01/07/2024',
          status: 'Finalizado'
        }
      ]
    },
    {
      id: 3,
      nome: 'Pedro Souza',
      email: 'pedro.souza@example.com',
      telefone: '(11) 98765-4321',
      endereco: 'Rua Augusta, 789 - São Paulo, SP',
      totalGasto: 890.00,
      totalAgendamentos: 6,
      ultimoServico: '20/07/2024',
      status: 'ativo',
      historico: [
        {
          id: 1,
          servico: 'Faxina Padrão',
          valor: 140.00,
          profissional: 'Maria Aparecida',
          data: '20/07/2024',
          status: 'Finalizado'
        },
        {
          id: 2,
          servico: 'Cozinheira',
          valor: 250.00,
          profissional: 'João da Silva',
          data: '15/07/2024',
          status: 'Finalizado'
        }
      ]
    },
    {
      id: 4,
      nome: 'Fernanda Lima',
      email: 'fernanda.lima@example.com',
      telefone: '(11) 97654-3210',
      endereco: 'Rua Oscar Freire, 321 - São Paulo, SP',
      totalGasto: 320.00,
      totalAgendamentos: 2,
      ultimoServico: '18/07/2024',
      status: 'inativo',
      historico: [
        {
          id: 1,
          servico: 'Faxina Padrão',
          valor: 140.00,
          profissional: 'Maria Aparecida',
          data: '18/07/2024',
          status: 'Finalizado'
        },
        {
          id: 2,
          servico: 'Passadoria',
          valor: 180.00,
          profissional: 'Ana Paula',
          data: '10/07/2024',
          status: 'Finalizado'
        }
      ]
    },
    {
      id: 5,
      nome: 'Roberto Costa',
      email: 'roberto.costa@example.com',
      telefone: '(11) 96543-2109',
      endereco: 'Alameda Santos, 654 - São Paulo, SP',
      totalGasto: 660.00,
      totalAgendamentos: 4,
      ultimoServico: '22/07/2024',
      status: 'ativo',
      historico: [
        {
          id: 1,
          servico: 'Cozinheira',
          valor: 260.00,
          profissional: 'João da Silva',
          data: '22/07/2024',
          status: 'Finalizado'
        },
        {
          id: 2,
          servico: 'Faxina Completa',
          valor: 200.00,
          profissional: 'Maria Aparecida',
          data: '15/07/2024',
          status: 'Finalizado'
        }
      ]
    }
  ];

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    const matchSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  // Componente da lista de clientes
  const ListaClientes = () => (
    <div className="w-96 bg-card border-r border-border h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-headline text-foreground">Clientes</h2>
          <Button size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
          />
        </div>
        
        <div className="flex gap-2">
           <Button
            onClick={() => setFiltroStatus('todos')}
            variant={filtroStatus === 'todos' ? 'secondary' : 'ghost'}
            size="sm"
          >
            Todos
          </Button>
           <Button
            onClick={() => setFiltroStatus('ativo')}
             variant={filtroStatus === 'ativo' ? 'secondary' : 'ghost'}
            size="sm"
          >
            Ativos
          </Button>
           <Button
            onClick={() => setFiltroStatus('inativo')}
            variant={filtroStatus === 'inativo' ? 'secondary' : 'ghost'}
            size="sm"
          >
            Inativos
          </Button>
        </div>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto">
        {clientesFiltrados.length > 0 ? clientesFiltrados.map((cliente) => (
          <div
            key={cliente.id}
            onClick={() => setClienteSelecionado(cliente)}
            className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
              clienteSelecionado?.id === cliente.id
                ? 'bg-muted'
                : 'hover:bg-muted/50 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">{cliente.nome}</h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{cliente.email}</p>
            <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant={cliente.status === 'ativo' ? 'default' : 'destructive'}>
                {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-sm font-medium text-foreground">
                R$ {cliente.totalGasto.toFixed(2).replace('.',',')}
              </span>
            </div>
          </div>
        )) : (
            <div className="text-center p-8 text-muted-foreground">Nenhum cliente encontrado.</div>
        )}
      </div>
    </div>
  );

  // Componente de detalhes do cliente
  const DetalhesCliente = ({ cliente }: { cliente: any }) => (
    <div className="flex-1 bg-background overflow-y-auto">
       <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Informações do Cliente */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-headline mb-4">Informações do Cliente</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{cliente.nome}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{cliente.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{cliente.telefone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{cliente.endereco}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
                  <p className="font-medium">{cliente.totalAgendamentos} serviços</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total Gasto</p>
                  <p className="font-medium">R$ {cliente.totalGasto.toFixed(2).replace('.',',')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Histórico de Agendamentos */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-headline">Histórico de Agendamentos</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Visualize todos os seus serviços passados e futuros.</p>
            
            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Serviço</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Profissional</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cliente.historico.map((item: any) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{item.servico}</p>
                          <p className="text-sm text-muted-foreground">R$ {item.valor.toFixed(2).replace('.',',')}</p>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{item.profissional}</td>
                      <td className="py-3 text-muted-foreground">{item.data}</td>
                      <td className="py-3">
                        <Badge variant="secondary">
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tela inicial quando nenhum cliente está selecionado
  const TelaInicial = () => (
    <div className="flex-1 bg-background flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <User className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Selecione um cliente</h2>
        <p>Escolha um cliente na lista ao lado para ver seus detalhes e histórico.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex h-full">
      <ListaClientes />
      {clienteSelecionado ? (
        <DetalhesCliente cliente={clienteSelecionado} />
      ) : (
        <TelaInicial />
      )}
    </div>
  );
};

export default DashboardClientes;

    