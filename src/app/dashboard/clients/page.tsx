
"use client"

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { User, Mail, Phone, Calendar, DollarSign, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockClients = [
    { id: 1, name: "Carlos Mendes", email: "carlos.mendes@example.com", phone: "(11) 91234-5678", appointments: 5, totalSpent: 750.00 },
    { id: 2, name: "Ana Silva", email: "ana.silva@example.com", phone: "(21) 98765-4321", appointments: 3, totalSpent: 450.00 },
    { id: 3, name: "Pedro Souza", email: "pedro.souza@example.com", phone: "(31) 99988-7766", appointments: 8, totalSpent: 1200.00 },
    { id: 4, name: "Juliana Costa", email: "juliana.costa@example.com", phone: "(41) 98877-6655", appointments: 1, totalSpent: 150.00 },
    { id: 5, name: "Fernanda Lima", email: "fernanda.lima@example.com", phone: "(51) 97766-5544", appointments: 12, totalSpent: 1800.00 },
];

const mockAppointments = [
    { id: 1, clientId: 1, professional: "Maria Aparecida", service: "Faxina Padrão", date: "2024-07-10", status: "Finalizado", value: 140.00 },
    { id: 2, clientId: 1, professional: "Ana Paula", service: "Passadoria", date: "2024-06-25", status: "Finalizado", value: 74.00 },
    { id: 5, clientId: 2, professional: "Maria Aparecida", service: "Faxina Padrão", date: "2024-07-12", status: "Confirmado", value: 198.00 },
    { id: 6, clientId: 3, professional: "Maria Aparecida", service: "Cozinheira", date: "2024-07-11", status: "Finalizado", value: 228.00 },
    { id: 7, clientId: 3, professional: "Ana Paula", service: "Faxina Padrão", date: "2024-07-01", status: "Finalizado", value: 240.00 },
    { id: 8, clientId: 5, professional: "João da Silva", service: "Faxina Padrão", date: "2024-07-15", status: "Confirmado", value: 198.00 },
]

type Client = typeof mockClients[0];

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


export default function ClientsPage() {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const clientAppointments = selectedClient ? mockAppointments.filter(app => app.clientId === selectedClient.id) : [];

    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-4">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Relatório de Clientes
                </h1>
            </div>
            <Dialog>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Lista de Clientes</CardTitle>
                        <CardDescription>
                            Visualize o histórico e o engajamento dos seus clientes. Clique em um cliente para ver os detalhes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Contato</TableHead>
                                    <TableHead className="text-center">Agendamentos</TableHead>
                                    <TableHead className="text-right">Valor Gasto (R$)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockClients.map((client) => (
                                    <DialogTrigger asChild key={client.id}>
                                        <TableRow onClick={() => setSelectedClient(client)} className="cursor-pointer">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={`https://placehold.co/100x100.png?text=${client.name.charAt(0)}`} data-ai-hint="person" />
                                                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{client.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{client.email}</div>
                                                <div className="text-sm text-muted-foreground">{client.phone}</div>
                                            </TableCell>
                                            <TableCell className="text-center">{client.appointments}</TableCell>
                                            <TableCell className="text-right font-mono">{client.totalSpent.toFixed(2).replace('.', ',')}</TableCell>
                                        </TableRow>
                                    </DialogTrigger>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {selectedClient && (
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Detalhes do Cliente: {selectedClient.name}</DialogTitle>
                            <DialogDescription>
                                Informações completas e histórico de agendamentos.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                            <div className="space-y-4 md:col-span-1">
                                <h4 className="font-semibold text-foreground">Informações de Contato</h4>
                                <DetailRow icon={User} label="Nome do Cliente" value={selectedClient.name} />
                                <DetailRow icon={Mail} label="Email" value={selectedClient.email} />
                                <DetailRow icon={Phone} label="Telefone" value={selectedClient.phone} />
                                <Separator />
                                <h4 className="font-semibold text-foreground">Métricas</h4>
                                <DetailRow icon={Calendar} label="Total de Agendamentos" value={`${selectedClient.appointments} serviços`} />
                                <DetailRow icon={DollarSign} label="Valor Total Gasto" value={`R$ ${selectedClient.totalSpent.toFixed(2).replace('.', ',')}`} />
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <h4 className="font-semibold text-foreground">Histórico de Agendamentos</h4>
                                <div className="border rounded-md max-h-80 overflow-y-auto">
                                    {clientAppointments.length > 0 ? (
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
                                                {clientAppointments.map(app => (
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
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
