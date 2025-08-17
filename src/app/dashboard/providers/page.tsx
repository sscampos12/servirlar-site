
"use client";

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
import { Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, DocumentData, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Professional {
    id: string;
    fullName: string;
    cpf: string;
    createdAt: Timestamp;
    status: "Aprovado" | "Pendente" | "Rejeitado";
}

export default function ProvidersPage() {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "professionals"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const professionalsData: Professional[] = [];
            querySnapshot.forEach((doc: DocumentData) => {
                const data = doc.data();
                professionalsData.push({
                    id: doc.id,
                    fullName: data.fullName,
                    cpf: data.cpf,
                    createdAt: data.createdAt,
                    status: data.status,
                });
            });
            setProfessionals(professionalsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
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
                                {professionals.length > 0 ? professionals.map((provider) => (
                                    <TableRow key={provider.id}>
                                        <TableCell className="font-medium">{provider.fullName}</TableCell>
                                        <TableCell>{provider.cpf}</TableCell>
                                        <TableCell>{provider.createdAt ? new Date(provider.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(provider.status) as "default" | "secondary" | "destructive" | "outline"}>{provider.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="icon" asChild>
                                              <Link href={`/dashboard/providers/${provider.id}`}>
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Ver Detalhes</span>
                                              </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">Nenhum profissional cadastrado.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
