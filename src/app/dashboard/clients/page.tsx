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

const mockClients = [
    { id: 1, name: "Carlos Mendes", email: "carlos.mendes@example.com", phone: "(11) 91234-5678", appointments: 5, totalSpent: 750.00 },
    { id: 2, name: "Ana Silva", email: "ana.silva@example.com", phone: "(21) 98765-4321", appointments: 3, totalSpent: 450.00 },
    { id: 3, name: "Pedro Souza", email: "pedro.souza@example.com", phone: "(31) 99988-7766", appointments: 8, totalSpent: 1200.00 },
    { id: 4, name: "Juliana Costa", email: "juliana.costa@example.com", phone: "(41) 98877-6655", appointments: 1, totalSpent: 150.00 },
    { id: 5, name: "Fernanda Lima", email: "fernanda.lima@example.com", phone: "(51) 97766-5544", appointments: 12, totalSpent: 1800.00 },
];

export default function ClientsPage() {
    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-4">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Relatório de Clientes
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Lista de Clientes</CardTitle>
                    <CardDescription>
                        Visualize o histórico e o engajamento dos seus clientes.
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
                                <TableRow key={client.id}>
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
