
"use client"

import React, { useState, useEffect } from 'react';
import { 
  Loader2,
  Lock,
  Calendar as CalendarIcon,
  Clock,
  Home as HomeIcon,
  Info
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
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';


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

const serviceIcons = {
    faxina: HomeIcon,
    passadoria: HomeIcon, // Placeholder, replace with correct icon if available
    cozinheira: HomeIcon, // Placeholder
    cuidador: HomeIcon, // Placeholder
};


const SchedulePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    service: '',
    duration: '',
    date: new Date(),
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
  }, [user, authLoading]);


  const handleInputChange = (field: string, value: any) => {
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
            date: formData.date.toISOString().split('T')[0],
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
        <h1 className="font-headline text-3xl font-semibold mb-4">Agendar um Novo Serviço</h1>
        <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Serviço</CardTitle>
                            <CardDescription>Preencha as informações abaixo para encontrar o profissional ideal.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="font-semibold">1. Qual serviço você precisa?</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                                    {Object.entries(serviceNames).map(([key, name]) => (
                                        <Button 
                                        key={key} 
                                        type="button"
                                        variant={formData.service === key ? "secondary" : "outline"}
                                        onClick={() => handleInputChange('service', key)}
                                        className="h-auto py-3 flex flex-col gap-2"
                                        >
                                        {/* @ts-ignore */}
                                        {React.createElement(serviceIcons[key], { className: "w-6 h-6" })}
                                        <span>{name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">2. Escolha a data</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.date}
                                            onSelect={(date) => handleInputChange('date', date)}
                                            initialFocus
                                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">3. Escolha o horário</Label>
                                    <Select onValueChange={(value) => handleInputChange('time', value)} value={formData.time} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="08:00">08:00</SelectItem>
                                            <SelectItem value="09:00">09:00</SelectItem>
                                            <SelectItem value="10:00">10:00</SelectItem>
                                            <SelectItem value="13:00">13:00</SelectItem>
                                            <SelectItem value="14:00">14:00</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="duration">4. Qual a duração?</Label>
                                    <Select onValueChange={(value) => handleInputChange('duration', value)} value={formData.duration} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="4">4 horas</SelectItem>
                                            <SelectItem value="6">6 horas</SelectItem>
                                            <SelectItem value="8">8 horas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">5. Endereço do serviço</Label>
                                    <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observations">Observações (Opcional)</Label>
                                <Textarea id="observations" value={formData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Ex: Tenho um cachorro. Por favor, trazer produto para limpar vidro." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Resumo do Agendamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                <h4 className="font-headline font-semibold">Seu Pedido</h4>
                                <div className="flex items-center gap-3">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {formData.service ? serviceNames[formData.service as keyof typeof serviceNames] : 'Não selecionado'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : 'N/A'}
                                    </p>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {formData.time && formData.duration ? `${formData.time} (${formData.duration}h)` : 'N/A - N/A'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HomeIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {formData.address || 'Não selecionado'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-muted-foreground">Valor Estimado</span>
                                <span className="font-bold text-xl">R$ {total.toFixed(2).replace('.', ',')}</span>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar e Ir para Pagamento'}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Ao continuar, você concorda com nossos <Link href="/legal" className="underline">Termos de Serviço</Link>.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    </ScheduleLayout>
  );
};

export default SchedulePage;

    