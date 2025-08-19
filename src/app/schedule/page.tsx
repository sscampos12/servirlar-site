
"use client"

import React, { useState, useEffect } from 'react';
import { 
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  Home as HomeIcon,
  Info,
  User,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ScheduleLayout } from './layout';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, doc, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    professionalId: '',
    clientId: '',
    paymentStatus: 'Em Aberto',
  });
  
  const [professionals, setProfessionals] = useState<DocumentData[]>([]);
  const [clients, setClients] = useState<DocumentData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
        router.push('/login?redirect=/schedule');
        return;
    }

    const fetchData = async () => {
        try {
            // Fetch approved professionals
            const profQuery = query(collection(db, "professionals"), where("status", "==", "Aprovado"));
            const profSnap = await getDocs(profQuery);
            setProfessionals(profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Fetch clients
            const clientQuery = query(collection(db, "clients"));
            const clientSnap = await getDocs(clientQuery);
            setClients(clientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({ variant: "destructive", title: "Erro ao carregar dados", description: "Não foi possível buscar a lista de clientes e profissionais." });
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [user, authLoading, router, toast]);


  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClientChange = (clientId: string) => {
      const selectedClient = clients.find(c => c.id === clientId);
      if (selectedClient) {
          setFormData(prev => ({
              ...prev,
              clientId: clientId,
              address: selectedClient.address || '',
          }));
      }
  }

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

    const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedProfessional = professionals.find(p => p.id === formData.professionalId);

    if (!selectedClient || !selectedProfessional) {
        toast({ variant: "destructive", title: "Erro de Validação", description: "Por favor, selecione um cliente e um profissional." });
        setIsSubmitting(false);
        return;
    }

    try {
        await addDoc(collection(db, "schedules"), {
            clientId: formData.clientId,
            clientName: selectedClient.fullName,
            professionalId: formData.professionalId,
            professionalName: selectedProfessional.fullName,
            service: serviceNames[formData.service as keyof typeof serviceNames],
            duration: `${formData.duration} horas`,
            date: formData.date.toISOString().split('T')[0],
            time: formData.time,
            address: formData.address,
            observations: formData.observations,
            value: total,
            status: "Confirmado", // Admin schedules are auto-confirmed
            paymentStatus: formData.paymentStatus,
            createdAt: serverTimestamp(),
            scheduledBy: 'admin',
        });
        
        toast({
            title: "Agendamento Criado!",
            description: "O agendamento manual foi criado com sucesso.",
        });
        router.push('/dashboard/reports');

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao agendar",
            description: "Não foi possível criar o agendamento. Tente novamente.",
        });
        console.error("Error creating schedule: ", error);
    } finally {
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

  return (
    <ScheduleLayout>
        <h1 className="font-headline text-3xl font-semibold mb-4">Agendamento Manual de Serviço</h1>
        <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Agendamento</CardTitle>
                            <CardDescription>Preencha as informações para criar um novo serviço.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client">1. Selecione o Cliente</Label>
                                    <Select onValueChange={handleClientChange} value={formData.clientId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um cliente..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map(client => (
                                                <SelectItem key={client.id} value={client.id}>{client.fullName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="professional">2. Selecione o Profissional</Label>
                                    <Select onValueChange={(value) => handleInputChange('professionalId', value)} value={formData.professionalId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um profissional..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {professionals.map(prof => (
                                                <SelectItem key={prof.id} value={prof.id}>{prof.fullName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="font-semibold">3. Qual serviço você precisa?</Label>
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
                                    <Label htmlFor="date">4. Escolha a data</Label>
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
                                    <Label htmlFor="time">5. Escolha o horário</Label>
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
                                    <Label htmlFor="duration">6. Qual a duração?</Label>
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
                                    <Label htmlFor="address">7. Endereço do serviço</Label>
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
                            <CardTitle>Resumo e Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                <h4 className="font-headline font-semibold">Resumo do Agendamento</h4>
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm truncate">
                                        {formData.clientId ? clients.find(c => c.id === formData.clientId)?.fullName : 'Cliente não selecionado'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm truncate">
                                        {formData.professionalId ? professionals.find(p => p.id === formData.professionalId)?.fullName : 'Profissional não selecionado'}
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentStatus">8. Status do Pagamento</Label>
                                <Select onValueChange={(value) => handleInputChange('paymentStatus', value)} value={formData.paymentStatus} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Em Aberto">Em Aberto</SelectItem>
                                        <SelectItem value="Pago">Pago</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-muted-foreground">Valor Total do Serviço</span>
                                <span className="font-bold text-xl">R$ {total.toFixed(2).replace('.', ',')}</span>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Agendamento Manual'}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Ao continuar, você confirma que tem permissão para criar este agendamento.
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

    