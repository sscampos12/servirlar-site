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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

const mockProviders = [
    { id: 1, name: "Maria Aparecida", cpf: "123.456.789-00", status: "Aprovado", date: "15/07/2024" },
    { id: 2, name: "João da Silva", cpf: "987.654.321-00", status: "Pendente", date: "14/07/2024" },
    { id: 3, name: "Ana Paula", cpf: "111.222.333-44", status: "Aprovado", date: "13/07/2024" },
    { id: 4, name: "Carlos de Souza", cpf: "444.555.666-77", status: "Rejeitado", date: "12/07/2024" },
];

export default function ProvidersPage() {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Aprovado":
                return "default";
            case "Pendente":
                return "secondary";
            case "Rejeitado":
                return "destructive";
            default:
                return "outline";
        }
    }
    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-4">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Gerenciar Profissionais
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Cadastros Recebidos</CardTitle>
                    <CardDescription>
                        Aprove, rejeite e visualize os documentos dos profissionais cadastrados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Data de Cadastro</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockProviders.map((provider) => (
                                <TableRow key={provider.id}>
                                    <TableCell className="font-medium">{provider.name}</TableCell>
                                    <TableCell>{provider.cpf}</TableCell>
                                    <TableCell>{provider.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(provider.status)}>{provider.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="icon" className="mr-2">
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Baixar Documentos</span>
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Ver Detalhes</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
