
"use client"

import React, { useState, useEffect } from 'react';
import { 
  Loader2,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ScheduleLayout } from './layout';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from '@/components/login-form';
import { ClientRegistrationForm } from '@/components/register-client-form';


const pricingData = {
    "faxina": { "4": 140, "6": 198, "8": 240 },
    "passadoria": { "4": 148, "6": 210, "8": 264 },
    "cozinheira": { "4": 160, "6": 228, "8": 288 },
    "cuidador": { "4": 168, "6": 240, "8": 304 }
};

const serviceNames = {
    faxina: 'Faxina Padrão',
    passadoria: 'Passadoria',
    cozinheira: 'Cozinheira',
    cuidador: 'Cuidador(a) de Idosos'
};

const SchedulePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    service: '',
    duration: '',
    date: '',
    time: '',
    address: '',
    observations: '',
  });
  
  const [clientData, setClientData] = useState({ name: '', email: '', phone: '', cpf: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
        setIsLoading(false);
        return;
    }

    const fetchClientData = async () => {
        const clientDocRef = doc(db, "clients", user.uid);
        const clientDocSnap = await getDoc(clientDocRef);
        if(clientDocSnap.exists()) {
            const data = clientDocSnap.data();
            setFormData(prev => ({...prev, address: data.address}));
            setClientData({ 
                name: data.fullName, 
                email: data.email,
                phone: data.phone || 'N/A',
                cpf: data.cpf || 'N/A'
            });
        }
        setIsLoading(false);
    };

    fetchClientData();
  }, [user, authLoading, router]);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
      const { service, duration } = formData;
      if (!service || !duration) return 0;
      // @ts-ignore
      return pricingData[service]?.[duration] || 0;
  };
  const total = calculateTotal();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
        await addDoc(collection(db, "schedules"), {
            clientId: user.uid,
            clientName: clientData.name,
            clientEmail: clientData.email,
            clientPhone: clientData.phone,
            clientCpf: clientData.cpf,
            service: serviceNames[formData.service as keyof typeof serviceNames],
            duration: `${formData.duration} horas`,
            date: formData.date,
            time: formData.time,
            address: formData.address,
            observations: formData.observations,
            value: total,
            status: "Pendente",
            createdAt: serverTimestamp(),
        });
        
        toast({
            title: "Agendamento quase lá!",
            description: "Agora, só falta confirmar o pagamento.",
        });
        router.push('/schedule/confirm');

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao agendar",
            description: "Não foi possível criar seu agendamento. Tente novamente.",
        });
        console.error("Error creating schedule: ", error);
        setIsSubmitting(false);
    }
  };
  
    if (authLoading || isLoading) {
        return (
        <ScheduleLayout>
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        </ScheduleLayout>
        );
    }

    if(!user) {
        return (
             <ScheduleLayout>
                <div className="max-w-md mx-auto px-4 py-12">
                    <Card className="w-full">
                        <CardHeader className="text-center">
                            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                            <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
                            <CardDescription>
                                Para agendar serviços, você precisa fazer login ou criar uma conta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Fazer Login</TabsTrigger>
                                <TabsTrigger value="register">Criar Conta</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="pt-6">
                                <LoginForm />
                            </TabsContent>
                            <TabsContent value="register" className="pt-6">
                                <ClientRegistrationForm />
                            </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
             </ScheduleLayout>
        )
    }

  return (
    <ScheduleLayout>
        <Card className="max-w-2xl mx-auto">
             <CardHeader>
                <CardTitle className="font-headline text-3xl">Agendar um Serviço</CardTitle>
                <CardDescription>
                    Preencha os detalhes abaixo para encontrar um profissional.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="service">Serviço</Label>
                             <Select onValueChange={(value) => handleInputChange('service', value)} value={formData.service} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o serviço" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="faxina">Faxina Padrão</SelectItem>
                                    <SelectItem value="passadoria">Passadoria</SelectItem>
                                    <SelectItem value="cozinheira">Cozinheira</SelectItem>
                                    <SelectItem value="cuidador">Cuidador(a) de Idosos</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="duration">Duração</Label>
                             <Select onValueChange={(value) => handleInputChange('duration', value)} value={formData.duration} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a duração" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4">4 horas</SelectItem>
                                    <SelectItem value="6">6 horas</SelectItem>
                                    <SelectItem value="8">8 horas</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>

                     <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} required min={new Date().toISOString().split("T")[0]} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="time">Horário de Início</Label>
                            <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange('time', e.target.value)} required />
                        </div>
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="address">Endereço do Serviço</Label>
                        <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="observations">Observações (opcional)</Label>
                        <Textarea id="observations" value={formData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Ex: O apartamento é no 3º andar, tenho um gato." />
                    </div>
                    
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Resumo do Valor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                             <p className="text-muted-foreground">Valor total do serviço</p>
                             <p className="text-2xl font-bold">R$ {total.toFixed(2).replace('.', ',')}</p>
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continuar para Pagamento'}
                    </Button>

                </form>
            </CardContent>
        </Card>
    </ScheduleLayout>
  );
};

export default SchedulePage;
