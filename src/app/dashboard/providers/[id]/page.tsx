
"use client"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ThumbsDown, ThumbsUp, User, Video, Banknote, FileText, MessageCircle, Calendar, DollarSign, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { notFound, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, DocumentData, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const mockAppointments = [
    { id: 1, client: "Carlos Mendes", service: "Faxina Padrão", date: "2024-07-10", status: "Finalizado", professional: "Maria Aparecida", value: 140.00 },
    { id: 2, client: "Ana Silva", service: "Passadoria", date: "2024-07-12", status: "Confirmado", professional: "João da Silva", value: 74.00 },
    { id: 3, client: "Pedro Souza", service: "Cozinheira", date: "2024-07-11", status: "Finalizado", professional: "Maria Aparecida", value: 228.00 },
    { id: 4, client: "Juliana Costa", service: "Faxina Padrão", date: "2024-07-08", status: "Finalizado", professional: "Ana Paula", value: 240.00 },
    { id: 5, client: "Fernanda Lima", service: "Faxina Padrão", date: "2024-07-15", status: "Confirmado", professional: "Maria Aparecida", value: 198.00 },
];

const InfoField = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-medium break-words">{value || "Não informado"}</span>
    </div>
)

const DetailSection = ({ title, icon, children, className }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) => (
    <Card className={className}>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
           {icon}
           <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
)

interface Professional {
    id: string;
    fullName: string;
    cpf: string;
    birthdate: string;
    createdAt: Timestamp;
    email: string;
    phone: string;
    pixKey: string;
    bankRef1: string;
    bankRef2: string;
    bankRef3: string;
    videoUrl?: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
}

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const [provider, setProvider] = useState<Professional | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProvider = async () => {
            if (params.id) {
                const docRef = doc(db, "professionals", params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProvider({ id: docSnap.id, ...docSnap.data() } as Professional);
                } else {
                    notFound();
                }
                setIsLoading(false);
            }
        };

        fetchProvider();
    }, [params.id]);


    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }
    
    if (!provider) {
        return notFound();
    }

    // TODO: Replace with real data from Firestore
    const providerAppointments = mockAppointments.filter(app => app.professional === provider.fullName);
    const totalAppointments = providerAppointments.length;
    const totalBilled = providerAppointments.reduce((sum, app) => sum + app.value, 0);
    
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Aprovado": return "default";
            case "Pendente": return "secondary";
            case "Rejeitado": return "destructive";
            case "Finalizado": return "default";
            case "Confirmado": return "secondary";
            default: return "outline";
        }
    }

    const handleAction = async (action: "aprovar" | "rejeitar") => {
        const newStatus = action === "aprovar" ? "Aprovado" : "Rejeitado";
        const docRef = doc(db, "professionals", provider.id);
        
        try {
            await updateDoc(docRef, { status: newStatus });
            setProvider(prev => prev ? { ...prev, status: newStatus } : null);
            toast({
                title: `Profissional ${action === "aprovar" ? "Aprovado" : "Rejeitado"}`,
                description: `${provider.fullName} foi ${action === "aprovar" ? "aprovado" : "rejeitado"} com sucesso.`
            });
             router.push("/dashboard/providers");
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível atualizar o status do profissional."
            });
        }
    }

    const getWhatsAppLink = (phone: string) => {
        const justDigits = phone.replace(/\D/g, '');
        return `https://wa.me/55${justDigits}`;
    }
    
    return (
        <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/providers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Detalhes do Profissional
                </h1>
                <Badge variant={getStatusVariant(provider.status) as "default" | "secondary" | "destructive" | "outline"} className="ml-auto text-base px-4 py-1">{provider.status}</Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <DetailSection title="Informações Pessoais" icon={<User className="h-5 w-5 text-primary"/>}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField label="Nome Completo" value={provider.fullName} />
                        <InfoField label="CPF" value={provider.cpf} />
                        <InfoField label="Data de Nascimento" value={provider.birthdate} />
                        <InfoField label="Data de Cadastro" value={provider.createdAt ? new Date(provider.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'} />
                        <InfoField label="Email" value={provider.email} />
                        <InfoField label="Telefone" value={provider.phone} />
                    </div>
                </DetailSection>

                <DetailSection title="Informações Financeiras" icon={<Banknote className="h-5 w-5 text-primary"/>}>
                     <div className="space-y-4">
                        <InfoField label="Chave PIX" value={provider.pixKey} />
                         <div>
                            <span className="text-sm text-muted-foreground">Referências Bancárias</span>
                            <ul className="list-disc list-inside font-medium space-y-1">
                                {provider.bankRef1 && <li>{provider.bankRef1}</li>}
                                {provider.bankRef2 && <li>{provider.bankRef2}</li>}
                                {provider.bankRef3 && <li>{provider.bankRef3}</li>}
                            </ul>
                        </div>
                    </div>
                </DetailSection>

                <DetailSection title="Documentos e Mídia" icon={<FileText className="h-5 w-5 text-primary"/>}>
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start gap-2">
                           <Download className="h-4 w-4"/> Baixar Antecedentes Criminais
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                           <Download className="h-4 w-4"/> Baixar Foto do RG
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                           <Download className="h-4 w-4"/> Baixar Comprovante de Residência
                        </Button>
                        {provider.videoUrl && (
                            <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                               <a href={provider.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4"/> Ver Vídeo de Apresentação
                               </a>
                            </Button>
                        )}
                    </div>
                </DetailSection>
            </div>
            
            <DetailSection 
                title="Histórico de Serviços Prestados" 
                icon={<Calendar className="h-5 w-5 text-primary"/>}
                className="col-span-1 xl:col-span-3"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <h4 className="font-semibold text-foreground">Métricas Gerais</h4>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Serviços Realizados</div>
                                <div className="font-medium">{totalAppointments}</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Total Faturado</div>
                                <div className="font-medium">R$ {totalBilled.toFixed(2).replace('.', ',')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="my-4"/>
                <div className="max-h-80 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor (R$)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providerAppointments.length > 0 ? providerAppointments.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.client}</TableCell>
                                    <TableCell>{app.service}</TableCell>
                                    <TableCell>{new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(app.status) as any}>{app.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{app.value.toFixed(2).replace('.', ',')}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Nenhum serviço encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DetailSection>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Ações do Administrador</CardTitle>
                    <CardDescription>Aprove, rejeite ou entre em contato com este profissional.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                     <Button onClick={() => handleAction("aprovar")} disabled={provider.status === "Aprovado"}>
                        <ThumbsUp className="mr-2 h-4 w-4" /> Aprovar Cadastro
                    </Button>
                    <Button variant="destructive" onClick={() => handleAction("rejeitar")} disabled={provider.status === "Rejeitado"}>
                        <ThumbsDown className="mr-2 h-4 w-4" /> Rejeitar Cadastro
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={getWhatsAppLink(provider.phone)} target="_blank" rel="noopener noreferrer">
                           <MessageCircle className="mr-2 h-4 w-4" /> Contatar via WhatsApp
                        </a>
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}
