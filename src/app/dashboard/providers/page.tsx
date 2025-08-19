
"use client";

import withAuth from "@/components/auth/with-auth";
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
import { Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import { collection, query, DocumentData, Timestamp, getDocs, limit, startAfter, endBefore, limitToLast, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Professional {
    id: string;
    fullName: string;
    cpf: string;
    createdAt: Timestamp;
    status: "Aprovado" | "Pendente" | "Rejeitado";
}

const PAGE_SIZE = 10;

function ProvidersPage() {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
    const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null);
    const [isFirstPage, setIsFirstPage] = useState(true);
    const [isLastPage, setIsLastPage] = useState(false);

    const fetchProfessionals = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
        setIsLoading(true);
        try {
            let q;
            if (direction === 'next' && lastVisible) {
                q = query(collection(db, "professionals"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(PAGE_SIZE));
            } else if (direction === 'prev' && firstVisible) {
                q = query(collection(db, "professionals"), orderBy("createdAt", "desc"), endBefore(firstVisible), limitToLast(PAGE_SIZE));
            } else {
                q = query(collection(db, "professionals"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
            }

            const documentSnapshots = await getDocs(q);

            const professionalsData: Professional[] = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                fullName: doc.data().fullName,
                cpf: doc.data().cpf,
                createdAt: doc.data().createdAt,
                status: doc.data().status,
            }));

            if (!documentSnapshots.empty) {
                setProfessionals(professionalsData);
                setFirstVisible(documentSnapshots.docs[0]);
                setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            } else if (direction !== 'initial') {
                // If we're not on the initial load and get no docs, it means we're at an edge
                if (direction === 'next') setIsLastPage(true);
                // No need to change professionals data if there are no new docs
                 return;
            } else {
                setProfessionals([]); // No professionals at all
            }

            // Update page status
            if (direction === 'initial') {
                const nextQuery = query(collection(db, "professionals"), orderBy("createdAt", "desc"), startAfter(documentSnapshots.docs[documentSnapshots.docs.length - 1]), limit(1));
                const nextDocs = await getDocs(nextQuery);
                setIsLastPage(nextDocs.empty);
                setIsFirstPage(true);
            } else if (direction === 'next') {
                 const nextQuery = query(collection(db, "professionals"), orderBy("createdAt", "desc"), startAfter(documentSnapshots.docs[documentSnapshots.docs.length - 1]), limit(1));
                const nextDocs = await getDocs(nextQuery);
                setIsLastPage(nextDocs.empty);
                setIsFirstPage(false);
            } else if (direction === 'prev') {
                 const prevQuery = query(collection(db, "professionals"), orderBy("createdAt", "desc"), endBefore(documentSnapshots.docs[0]), limitToLast(1));
                const prevDocs = await getDocs(prevQuery);
                setIsFirstPage(prevDocs.empty);
                setIsLastPage(false);
            }

        } catch (error) {
            console.error("Error fetching professionals:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchProfessionals();
    }, []);


    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Aprovado": return "default";
            case "Pendente": return "secondary";
            case "Rejeitado": return "destructive";
            default: return "outline";
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
                    <div className="border rounded-md">
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : professionals.length > 0 ? professionals.map((provider) => (
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
                    </div>
                     <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProfessionals('prev')}
                            disabled={isFirstPage || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProfessionals('next')}
                            disabled={isLastPage || isLoading}
                        >
                            Próximo
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(ProvidersPage, ['admin']);
