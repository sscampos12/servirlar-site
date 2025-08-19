
"use client";

import React, { useState, useEffect } from 'react';
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
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Client {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    [key: string]: any; 
}

interface Schedule {
    id: string;
    service: string;
    value: number;
    professionalName: string;
    date: string;
    status: string;
}


const DashboardClientes = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Schedule[]>>({});
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const q = query(collection(db, "clients"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData: Client[] = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() } as Client);
      });
      setClients(clientsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedClient) return;

    const q = query(collection(db, "schedules"), where("clientId", "==", selectedClient.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const scheduleData: Schedule[] = [];
        querySnapshot.forEach((doc) => {
            scheduleData.push({ id: doc.id, ...doc.data() } as Schedule);
        });
        setSchedules(prev => ({ ...prev, [selectedClient.id]: scheduleData }));
    });
    
    return () => unsubscribe();

  }, [selectedClient]);


  // Filtrar clientes
  const filteredClients = clients.filter(client => 
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
    
  const clientSchedules = selectedClient ? (schedules[selectedClient.id] || []) : [];
  const totalSpent = clientSchedules.reduce((acc, schedule) => acc + schedule.value, 0);

  // Componente da lista de clientes
  const ListaClientes = () => (
    <div className="w-96 bg-card border-r border-border h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-headline text-foreground">Clientes</h2>
          <Button size="icon" disabled>
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
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto">
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        ) : filteredClients.length > 0 ? filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
              selectedClient?.id === client.id
                ? 'bg-muted'
                : 'hover:bg-muted/50 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">{client.fullName}</h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{client.email}</p>
          </div>
        )) : (
            <div className="text-center p-8 text-muted-foreground">Nenhum cliente encontrado.</div>
        )}
      </div>
    </div>
  );

  // Componente de detalhes do cliente
  const DetalhesCliente = ({ client }: { client: Client | null }) => {
    if (!client) return <TelaInicial />;
    
    const clientSchedules = schedules[client.id] || [];
    const totalSpent = clientSchedules.reduce((acc, schedule) => acc + schedule.value, 0);

    return (
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
                  <p className="font-medium">{client.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{client.address || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
                  <p className="font-medium">{clientSchedules.length} serviços</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total Gasto</p>
                  <p className="font-medium">R$ {totalSpent.toFixed(2).replace('.',',')}</p>
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
                  {clientSchedules.length > 0 ? clientSchedules.map((item: any) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{item.service}</p>
                          <p className="text-sm text-muted-foreground">R$ {item.value.toFixed(2).replace('.',',')}</p>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{item.professionalName}</td>
                      <td className="py-3 text-muted-foreground">{new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td className="py-3">
                        <Badge variant="secondary">
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                     <tr className="border-b last:border-b-0">
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                            Nenhum agendamento encontrado.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  };

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
      <DetalhesCliente client={selectedClient} />
    </div>
  );
};

export default DashboardClientes;
