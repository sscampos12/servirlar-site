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
import { ArrowLeft, Check, Download, ThumbsDown, ThumbsUp, User, Video, X, Banknote, FileText, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { notFound } from "next/navigation"

const mockProviders = [
    { id: 1, name: "Maria Aparecida", cpf: "123.456.789-00", status: "Aprovado", date: "15/07/2024", email: "maria.aparecida@example.com", phone: "(11) 98765-4321", birthdate: "10/05/1985", pixKey: "maria.pix@banco.com", bankRefs: ["Gerente João - Banco A", "Gerente Ana - Banco B", "Contato Silva - Banco C"], videoUrl: "https://youtu.be/exemplo" },
    { id: 2, name: "João da Silva", cpf: "987.654.321-00", status: "Pendente", date: "14/07/2024", email: "joao.silva@example.com", phone: "(21) 91234-5678", birthdate: "22/08/1990", pixKey: "joao.da.silva@email.com", bankRefs: ["Referência 1", "Referência 2", "Referência 3"] },
    { id: 3, name: "Ana Paula", cpf: "111.222.333-44", status: "Aprovado", date: "13/07/2024", email: "ana.paula@example.com", phone: "(31) 99999-8888", birthdate: "03/11/1992", pixKey: "11122233344", bankRefs: ["Banco X", "Banco Y", "Banco Z"] },
    { id: 4, name: "Carlos de Souza", cpf: "444.555.666-77", status: "Rejeitado", date: "12/07/2024", email: "carlos.souza@example.com", phone: "(41) 98877-6655", birthdate: "15/02/1980", pixKey: "carlos.souza@email.com.br", bankRefs: ["Ref A", "Ref B", "Ref C"] },
];

const InfoField = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-medium">{value || "Não informado"}</span>
    </div>
)

const DetailSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
           {icon}
           <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
)

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const provider = mockProviders.find(p => p.id.toString() === params.id);

    if (!provider) {
        return notFound();
    }
    
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Aprovado": return "default";
            case "Pendente": return "secondary";
            case "Rejeitado": return "destructive";
            default: return "outline";
        }
    }

    const handleAction = (action: "aprovar" | "rejeitar") => {
        toast({
            title: `Profissional ${action === "aprovar" ? "Aprovado" : "Rejeitado"}`,
            description: `${provider.name} foi ${action === "aprovar" ? "aprovado" : "rejeitado"} com sucesso.`
        })
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
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <DetailSection title="Informações Pessoais" icon={<User className="h-5 w-5 text-primary"/>}>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Nome Completo" value={provider.name} />
                        <InfoField label="CPF" value={provider.cpf} />
                        <InfoField label="Data de Nascimento" value={provider.birthdate} />
                        <InfoField label="Data de Cadastro" value={provider.date} />
                        <InfoField label="Email" value={provider.email} />
                        <InfoField label="Telefone" value={provider.phone} />
                    </div>
                </DetailSection>

                <DetailSection title="Informações Financeiras" icon={<Banknote className="h-5 w-5 text-primary"/>}>
                     <div className="space-y-4">
                        <InfoField label="Chave PIX" value={provider.pixKey} />
                         <div>
                            <span className="text-sm text-muted-foreground">Referências Bancárias</span>
                            <ul className="list-disc list-inside font-medium">
                                {provider.bankRefs.map((ref, i) => <li key={i}>{ref}</li>)}
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
