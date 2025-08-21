
"use client";

import withAuth from "@/components/auth/with-auth";
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
  Loader2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { collection, query, onSnapshot, where, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Client {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    status: 'Ativo' | 'Inativo';
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
  const { toast } = useToast();


  useEffect(() => {
    const q = query(collection(db, "clients"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData: Client[] = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() } as Client);
      });
      setClients(clientsData);
      setIsLoading(false);
      
      // If a client was selected, update its data
      if (selectedClient) {
          const updatedClient = clientsData.find(c => c.id === selectedClient.id);
          if(updatedClient) {
              setSelectedClient(updatedClient);
          } else {
              setSelectedClient(null); // Deselect if client is no longer in the list
          }
      }

    });

    return () => unsubscribe();
  }, [selectedClient]);

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

  const handleStatusChange = async (clientId: string, status: 'Ativo' | 'Inativo') => {
      try {
        const docRef = doc(db, 'clients', clientId);
        await updateDoc(docRef, { status });
        toast({ title: 'Sucesso', description: `Status do cliente atualizado para ${status}.`});
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível atualizar o status.'});
      }
  };

  const handleDeleteClient = async (clientId: string) => {
      if (!window.confirm("Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.")) return;
      try {
          await deleteDoc(doc(db, 'clients', clientId));
           // Also delete from 'users' collection if exists
          const userDocRef = doc(db, 'users', clientId);
          if ((await getDoc(userDocRef)).exists()) {
              await deleteDoc(userDocRef);
          }
          toast({ title: 'Sucesso', description: 'Cliente deletado com sucesso.'});
          setSelectedClient(null);
      } catch (error) {
          toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível deletar o cliente.'});
      }
  }


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
       <div className="p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline">Informações do Cliente</CardTitle>
                    <Button variant="outline" size="icon" onClick={() => toast({ title: "Em breve!", description: "A edição de perfil estará disponível em breve."})}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
          
          {/* Histórico de Agendamentos */}
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Histórico de Agendamentos</CardTitle>
                <CardDescription>Visualize todos os serviços passados e futuros.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Gerenciamento de Cadastro</CardTitle>
                <CardDescription>Altere o status ou remova o cadastro do cliente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleStatusChange(client.id, 'Ativo')}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Ativar
                </Button>
                <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleStatusChange(client.id, 'Inativo')}>
                    <XCircle className="mr-2 h-4 w-4" /> Inativar
                </Button>
                <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => handleDeleteClient(client.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Deletar Cadastro
                </Button>
            </CardContent>
        </Card>

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

export default withAuth(DashboardClientes, ['admin']);
