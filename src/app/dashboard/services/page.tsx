
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
  Eye,
  Calendar as CalendarIcon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

interface Service {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string; 
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
    createdAt: any;
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


const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Card className={`transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{service.service}</CardTitle>
        <CardDescription>{new Date(service.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow icon={MapPin} label="Localização" value={`${service.address.split(',').slice(-2).join(', ')}`} />
        <InfoRow icon={Clock} label="Horário" value={`${service.time} (${service.duration})`} />
        {service.observations && <InfoRow icon={Info} label="Observações do Cliente" value={<span className="italic">"{service.observations}"</span>} />}
        <Separator />
        <InfoRow icon={DollarSign} label="Valor do Serviço" value={<span className="text-lg font-bold text-primary">R$ {service.value.toFixed(2).replace('.', ',')}</span>} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
            <Button asChild size="sm">
                <Link href={`/dashboard/services/${service.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes e Pagar Taxa
                </Link>
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const availableQuery = query(collection(db, "schedules"), where("status", "==", "Pendente"), orderBy("createdAt", "desc"));
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
            where("status", "in", ["Confirmado", "Finalizado"]),
            orderBy("date", "desc")
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
                            Visualize os serviços disponíveis, ordedenados dos mais recentes para os mais antigos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                             <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : availableServices.length > 0 ? (
                            availableServices
                            .map(service => (
                                <ServiceCard 
                                    key={service.id} 
                                    service={service} 
                                />
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground p-8">
                                Nenhum serviço disponível no momento.
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
