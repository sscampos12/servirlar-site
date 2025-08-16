

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
import { User, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockClient = { 
    id: 1, 
    name: "Carlos Mendes", 
    email: "carlos.mendes@example.com", 
    phone: "(11) 91234-5678", 
    appointments: 5, 
    totalSpent: 750.00 
};

const mockAppointments = [
    { id: 1, clientId: 1, professional: "Maria Aparecida", service: "Faxina Padrão", date: "2024-07-10", status: "Finalizado", value: 140.00 },
    { id: 2, clientId: 1, professional: "Ana Paula", service: "Passadoria", date: "2024-06-25", status: "Finalizado", value: 74.00 },
    { id: 3, clientId: 1, professional: "Maria Aparecida", service: "Faxina Padrão", date: "2024-06-10", status: "Finalizado", value: 140.00 },
    { id: 4, clientId: 1, professional: "Ana Paula", service: "Passadoria", date: "2024-05-25", status: "Finalizado", value: 148.00 },
    { id: 9, clientId: 1, professional: "João da Silva", service: "Cozinheira", date: "2024-05-11", status: "Finalizado", value: 248.00 },
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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Minha Conta e Histórico
                </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Minhas Informações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow icon={User} label="Nome" value={mockClient.name} />
                            <DetailRow icon={Mail} label="Email" value={mockClient.email} />
                            <DetailRow icon={Phone} label="Telefone" value={mockClient.phone} />
                            <Separator />
                            <DetailRow icon={Calendar} label="Total de Agendamentos" value={`${mockClient.appointments} serviços`} />
                            <DetailRow icon={DollarSign} label="Valor Total Gasto" value={`R$ ${mockClient.totalSpent.toFixed(2).replace('.', ',')}`} />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Histórico de Agendamentos</CardTitle>
                             <CardDescription>
                                Visualize todos os seus serviços passados e futuros.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md max-h-[500px] overflow-y-auto">
                                {mockAppointments.length > 0 ? (
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
                                            {mockAppointments.map(app => (
                                                <TableRow key={app.id}>
                                                    <TableCell>
                                                       <div className="font-medium">{app.service}</div>
                                                       <div className="text-xs text-muted-foreground font-mono">R$ {app.value.toFixed(2).replace('.', ',')}</div>
                                                    </TableCell>
                                                    <TableCell>{app.professional}</TableCell>
                                                    <TableCell>{new Date(app.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={app.status === 'Finalizado' ? 'default' : 'secondary'}>{app.status}</Badge>
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
