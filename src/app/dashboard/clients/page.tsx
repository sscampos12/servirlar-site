
"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { User, Mail, Phone, Calendar, DollarSign, Bell, Loader2, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Appointment {
    id: string;
    professionalName?: string;
    service: string;
    date: string;
    status: string;
    value: number;
}

const mockNotifications = [
    { id: 1, title: "Agendamento Confirmado", description: "Sua faxina com Maria Aparecida foi confirmada para 10/07." },
    { id: 2, title: "Lembrete de Serviço", description: "Seu serviço de passadoria com Ana Paula é amanhã." },
    { id: 3, title: "Pagamento Recebido", description: "O pagamento de R$ 140,00 foi processado com sucesso." },
];

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-center gap-3">
        <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    </div>
);


export default function ClientHistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [clientData, setClientData] = useState<DocumentData | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/dashboard/clients');
            return;
        }

        const fetchData = async () => {
            if (user) {
                try {
                    // Fetch client profile
                    const clientDocRef = doc(db, "clients", user.uid);
                    const clientDocSnap = await getDoc(clientDocRef);
                    if (clientDocSnap.exists()) {
                        setClientData(clientDocSnap.data());
                    }

                    // Fetch client appointments
                    const q = query(collection(db, "schedules"), where("clientId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const appointmentsData: Appointment[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
                    setAppointments(appointmentsData);

                } catch (error) {
                    console.error("Error fetching client data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (!authLoading && user) {
            fetchData();
        }
    }, [user, authLoading, router]);

    const totalSpent = appointments.reduce((sum, app) => sum + (app.value || 0), 0);

     if (isLoading || authLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }
    
    if (!clientData) {
         return (
             <div className="text-center text-muted-foreground p-8">
                Cliente não encontrado ou você não tem permissão para ver esta página.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Minha Conta e Histórico
                </h1>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="space-y-6 xl:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Minhas Informações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow icon={User} label="Nome" value={clientData.fullName} />
                            <DetailRow icon={Mail} label="Email" value={clientData.email} />
                            <DetailRow icon={Home} label="Endereço" value={clientData.address || "Não informado"} />
                            <Separator />
                            <DetailRow icon={Calendar} label="Total de Agendamentos" value={`${appointments.length} serviços`} />
                            <DetailRow icon={DollarSign} label="Valor Total Gasto" value={`R$ ${totalSpent.toFixed(2).replace('.', ',')}`} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Últimas Notificações
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockNotifications.map(notification => (
                                <div key={notification.id} className="flex items-start gap-3">
                                     <div className="flex items-center justify-center bg-primary/10 rounded-full h-8 w-8 flex-shrink-0 mt-1">
                                        <Bell className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4 xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Histórico de Agendamentos</CardTitle>
                             <CardDescription>
                                Visualize todos os seus serviços passados e futuros.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md max-h-[600px] overflow-y-auto">
                                {appointments.length > 0 ? (
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
                                            {appointments.map(app => (
                                                <TableRow key={app.id}>
                                                    <TableCell>
                                                       <div className="font-medium">{app.service}</div>
                                                       <div className="text-xs text-muted-foreground font-mono">R$ {app.value.toFixed(2).replace('.', ',')}</div>
                                                    </TableCell>
                                                    <TableCell>{app.professionalName || 'Aguardando'}</TableCell>
                                                    <TableCell>{new Date(app.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={app.status === 'Finalizado' ? 'default' : app.status === 'Confirmado' ? 'secondary' : 'outline'}>{app.status}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center text-muted-foreground p-8">
                                        Nenhum agendamento encontrado.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
