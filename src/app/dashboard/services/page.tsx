
"use client"

import withAuth from "@/components/auth/with-auth";
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Home,
  Clock,
  MapPin,
  DollarSign,
  User,
  Info,
  ThumbsUp,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

interface Service {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string; // Adicionado para notificação
    service: string;
    address: string;
    date: string;
    time: string;
    duration: string;
    value: number;
    observations: string;
    status: "Pendente" | "Confirmado" | "Finalizado";
    professionalId?: string;
    professionalName?: string;
    chatId?: string;
}


const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium text-sm">{value}</span>
        </div>
    </div>
);


const ServiceCard = ({ service, onAccept, onDecline, isAccepting }: { service: Service, onAccept: (service: Service) => Promise<void>, onDecline: (id: string) => void, isAccepting: boolean }) => {
    
    const handleAccept = async () => {
        await onAccept(service);
    }
    
    const handleDecline = () => {
        onDecline(service.id);
    }
    
  return (
    <Card className={`transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{service.service}</CardTitle>
        <CardDescription>{new Date(service.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow icon={MapPin} label="Endereço" value={`${service.address}`} />
        <InfoRow icon={Clock} label="Horário" value={`${service.time} (${service.duration})`} />
        {service.observations && <InfoRow icon={Info} label="Observações do Cliente" value={<span className="italic">"{service.observations}"</span>} />}
        <Separator />
        <InfoRow icon={DollarSign} label="Valor a Receber" value={<span className="text-lg font-bold text-primary">R$ {(service.value * 0.75).toFixed(2).replace('.', ',')}</span>} />
         <p className="text-xs text-muted-foreground text-right">(Valor total: R$ {service.value.toFixed(2).replace('.', ',')} - Taxa da plataforma: 25%)</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDecline} disabled={isAccepting}>
                <XCircle className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Recusar</span>
            </Button>
            <Button size="sm" onClick={handleAccept} disabled={isAccepting}>
                {isAccepting ? <Loader2 className="animate-spin h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Aceitar</span>
            </Button>
      </CardFooter>
    </Card>
  )
}

function ServicesPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [myServices, setMyServices] = useState<Service[]>([]);
    const [declinedServices, setDeclinedServices] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const availableQuery = query(collection(db, "schedules"), where("status", "==", "Pendente"));
        const unsubscribeAvailable = onSnapshot(availableQuery, (snapshot) => {
            const availableData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            setAvailableServices(availableData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching available services:", error);
            toast({
                variant: "destructive",
                title: "Erro ao buscar serviços",
                description: "Não foi possível carregar os serviços disponíveis.",
            });
            setIsLoading(false);
        });

        const myServicesQuery = query(
            collection(db, "schedules"), 
            where("professionalId", "==", user.uid),
            where("status", "in", ["Confirmado", "Finalizado"])
        );
        const unsubscribeMyServices = onSnapshot(myServicesQuery, (snapshot) => {
            const myServicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            setMyServices(myServicesData);
        }, (error) => {
            console.error("Error fetching my services:", error);
            toast({
                variant: "destructive",
                title: "Erro ao buscar seus serviços",
                description: "Não foi possível carregar os seus serviços agendados.",
            });
        });

        return () => {
            unsubscribeAvailable();
            unsubscribeMyServices();
        };

    }, [user, toast]);

    const sendNotificationEmail = async (to: string, subject: string, html: string) => {
        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, html }),
            });
        } catch (error) {
            console.error("Falha ao enviar e-mail de notificação:", error);
            // Não notificar o usuário para não poluir a interface, apenas logar.
        }
    };


    const handleAcceptService = async (service: Service) => {
        if (!user) {
            toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado para aceitar." });
            return;
        }
        setIsProcessing(service.id);

        const professionalDocRef = doc(db, "professionals", user.uid);
        
        try {
            const professionalDoc = await getDoc(professionalDocRef);
            if (!professionalDoc.exists()) {
                 toast({ variant: "destructive", title: "Erro", description: "Perfil de profissional não encontrado." });
                 setIsProcessing(null);
                return;
            }
            const professionalData = professionalDoc.data();
            
            // 1. Create chat document
            const chatRef = await addDoc(collection(db, "chats"), {
                members: [service.clientId, user.uid],
                createdAt: serverTimestamp(),
                lastMessage: "Serviço aceito! Bem-vindo ao chat.",
                lastMessageAt: serverTimestamp(),
                serviceId: service.id
            });

            // 2. Update service with professional and chatId
            const serviceRef = doc(db, "schedules", service.id);
            await updateDoc(serviceRef, {
                status: "Confirmado",
                professionalId: user.uid,
                professionalName: professionalData.fullName,
                chatId: chatRef.id
            });
            
            toast({
                title: "Serviço Aceito!",
                description: "O agendamento foi adicionado à sua lista e um chat foi criado.",
                className: "bg-green-100 border-green-500 text-green-700",
            });

            // 3. Send notification emails (as per user request)
            // Notify Client
            await sendNotificationEmail(
                service.clientEmail,
                `Seu serviço de ${service.service} foi confirmado!`,
                `<h1>Olá, ${service.clientName}!</h1><p>O profissional <strong>${professionalData.fullName}</strong> aceitou seu serviço. Acesse a plataforma para combinar os detalhes.</p>`
            );

            // Notify Professional
            if (professionalData.email) {
                 await sendNotificationEmail(
                    professionalData.email,
                    `Serviço confirmado: ${service.service}`,
                    `<h1>Parabéns, ${professionalData.fullName}!</h1><p>Você confirmou o serviço para o cliente <strong>${service.clientName}</strong>.</p>`
                );
            }

        } catch (error) {
             console.error(error);
             toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível aceitar o serviço. Outro profissional pode ter aceitado primeiro.",
            });
        } finally {
            setIsProcessing(null);
        }
    };

    const handleDeclineService = (id: string) => {
        setDeclinedServices(prev => [...prev, id]);
    };

     const getStatusVariant = (status: string) => {
        switch (status) {
            case "Confirmado": return "default";
            case "Finalizado": return "secondary";
            default: return "outline";
        }
    }

  return (
    <div className="flex flex-col gap-6">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
            Painel de Serviços
        </h1>
        <Tabs defaultValue="available">
            <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="available">Serviços Disponíveis</TabsTrigger>
                <TabsTrigger value="mine">Meus Serviços</TabsTrigger>
            </TabsList>
            <TabsContent value="available">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Marketplace de Serviços</CardTitle>
                        <CardDescription>
                            Visualize, aceite ou recuse os serviços disponíveis em tempo real.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                             <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : availableServices.filter(s => !declinedServices.includes(s.id)).length > 0 ? (
                            availableServices
                            .filter(service => !declinedServices.includes(service.id))
                            .map(service => (
                                <ServiceCard 
                                    key={service.id} 
                                    service={service} 
                                    onAccept={handleAcceptService}
                                    onDecline={handleDeclineService}
                                    isAccepting={isProcessing === service.id}
                                />
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground p-8">
                                Nenhum serviço disponível no momento. Volte em breve!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="mine">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Meus Serviços Agendados</CardTitle>
                        <CardDescription>
                            Acompanhe os serviços que você aceitou.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : myServices.length > 0 ? (
                            myServices.map(service => (
                                <Card key={service.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="font-headline text-lg">{service.service}</CardTitle>
                                                <CardDescription>{new Date(service.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}</CardDescription>
                                            </div>
                                            <Badge variant={getStatusVariant(service.status) as any}>{service.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <InfoRow icon={User} label="Cliente" value={`${service.clientName}`} />
                                        <InfoRow icon={MapPin} label="Endereço" value={`${service.address}`} />
                                        <InfoRow icon={Clock} label="Horário" value={`${service.time} (${service.duration})`} />
                                        {service.chatId && service.status === 'Confirmado' && (
                                            <Button asChild variant="outline" className="w-full mt-2">
                                                <Link href={`/chat/${service.chatId}`}>
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Abrir Chat
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground p-8">
                                Você ainda não aceitou nenhum serviço.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}


export default withAuth(ServicesPage, ['professional']);
