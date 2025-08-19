
"use client";

import React from 'react';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data, in a real app this would come from a hook like useAuth and Firestore
const cliente = {
  id: 1,
  nome: 'Cliente Novo',
  email: 'cliente.novo@example.com',
  telefone: '(11) 91234-5678',
  endereco: 'Rua das Flores, 123 - São Paulo, SP',
  totalGasto: 0.00,
  totalAgendamentos: 0,
  historico: []
};

const DetalhesCliente = ({ cliente }: { cliente: any }) => (
    <div className="flex-1 bg-background overflow-y-auto">
       <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Minhas Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
          
          {/* Histórico de Agendamentos */}
          <Card>
             <CardHeader>
                <CardTitle className="font-headline">Histórico de Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Visualize todos os seus serviços passados e futuros.</p>
                <div className="overflow-y-auto max-h-96">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {cliente.historico.length > 0 ? cliente.historico.map((item: any) => (
                        <TableRow key={item.id}>
                        <TableCell>
                            <div>
                            <p className="font-medium">{item.servico}</p>
                            <p className="text-sm text-muted-foreground">R$ {item.valor.toFixed(2).replace('.',',')}</p>
                            </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.profissional}</TableCell>
                        <TableCell className="text-muted-foreground">{item.data}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">
                            {item.status}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                                Você ainda não possui agendamentos.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );


export default function ClientAccountPage() {
    return <DetalhesCliente cliente={cliente} />
}
