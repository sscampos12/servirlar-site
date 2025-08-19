
"use client";

import React, { useState, useEffect } from 'react';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

interface ClientData {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Schedule {
    id: string;
    service: string;
    value: number;
    professionalName: string;
    date: string;
    status: string;
}

const DetalhesCliente = () => {
    const { user, loading: authLoading } = useAuth();
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchClientData = async () => {
            const clientDocRef = doc(db, "clients", user.uid);
            const clientDocSnap = await getDoc(clientDocRef);
            if (clientDocSnap.exists()) {
                setClientData({ id: clientDocSnap.id, ...clientDocSnap.data() } as ClientData);
            }
        };

        const subscribeToSchedules = () => {
             const q = query(collection(db, "schedules"), where("clientId", "==", user.uid));
             const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const scheduleData: Schedule[] = [];
                querySnapshot.forEach((doc) => {
                    scheduleData.push({ id: doc.id, ...doc.data() } as Schedule);
                });
                setSchedules(scheduleData);
                setIsLoading(false);
             });
             return unsubscribe;
        };

        fetchClientData();
        const unsubscribe = subscribeToSchedules();

        return () => unsubscribe();
        
    }, [user]);

    if (authLoading || isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!clientData) {
        return <p>Dados do cliente não encontrados.</p>;
    }
    
    const totalSpent = schedules.reduce((acc, schedule) => acc + schedule.value, 0);

    return (
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
                    <p className="font-medium">{clientData.fullName}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{clientData.email}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{clientData.phone || 'Não informado'}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">{clientData.address || 'Não informado'}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                    <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
                    <p className="font-medium">{schedules.length} serviços</p>
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
                        {schedules.length > 0 ? schedules.map((item: any) => (
                            <TableRow key={item.id}>
                            <TableCell>
                                <div>
                                <p className="font-medium">{item.service}</p>
                                <p className="text-sm text-muted-foreground">R$ {item.value.toFixed(2).replace('.',',')}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{item.professionalName}</TableCell>
                            <TableCell className="text-muted-foreground">{new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
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
};


export default function ClientAccountPage() {
    return <DetalhesCliente />
}
