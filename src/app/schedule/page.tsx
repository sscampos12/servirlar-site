

"use client"

import withAuth from "@/components/auth/with-auth";
import React, { useState, useEffect } from 'react';
import { 
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  Home as HomeIcon,
  Info,
  User,
  Briefcase,
  DollarSign,
  Soup,
  Shirt,
  UserPlus
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ScheduleLayout } from './layout';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, doc, getDocs, query, where, DocumentData, getDoc } from 'firebase/firestore';
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

const pricingData = {
    "faxina": { "4": 140, "6": 198, "8": 240 },
    "passadoria": { "4": 148, "6": 210, "8": 264 },
    "cozinheira": { "4": 160, "6": 228, "8": 288 },
    "cuidador": { "4": 168, "6": 240, "8": 304 }
};

const serviceNames: Record<string, string> = {
    faxina: 'Faxina Padrão',
    passadoria: 'Passadoria',
    cozinheira: 'Cozinheira',
    cuidador: 'Cuidador(a) de Idosos'
};

const serviceIcons: Record<string, React.ElementType> = {
    faxina: HomeIcon,
    passadoria: Shirt,
    cozinheira: Soup,
    cuidador: UserPlus,
};

const AdminScheduleForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  
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

  useEffect(() => {
    const fetchData = async () => {
        try {
            const profQuery = query(collection(db, "professionals"), where("status", "in", ["Aprovado", "Ativo"]));
            const profSnap = await getDocs(profQuery);
            setProfessionals(profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const clientQuery = query(collection(db, "clients"));
            const clientSnap = await getDocs(clientQuery);
            setClients(clientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({ variant: "destructive", title: "Erro ao carregar dados", description: "Não foi possível buscar a lista de clientes e profissionais." });
        }
    };
    fetchData();
  }, [toast]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClientChange = (clientId: string) => {
      const selectedClient = clients.find(c => c.id === clientId);
      if (selectedClient) {
          setFormData(prev => ({ ...prev, clientId, address: selectedClient.address || '' }));
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
            clientCpf: selectedClient.cpf || '',
            clientEmail: selectedClient.email,
            clientPhone: selectedClient.phone || '',
            professionalId: formData.professionalId,
            professionalName: selectedProfessional.fullName,
            service: serviceNames[formData.service] || formData.service,
            duration: `${formData.duration} horas`,
            date: formData.date.toISOString().split('T')[0],
            time: formData.time,
            address: formData.address,
            observations: formData.observations,
            value: total,
            status: "Confirmado",
            paymentStatus: formData.paymentStatus,
            createdAt: serverTimestamp(),
            scheduledBy: 'admin',
        });
        toast({ title: "Agendamento Criado!", description: "O agendamento manual foi criado com sucesso." });
        router.push('/dashboard/reports');
    } catch (error) {
        toast({ variant: "destructive", title: "Erro ao agendar", description: "Não foi possível criar o agendamento." });
        console.error("Error creating schedule: ", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="font-headline text-3xl font-semibold mb-4">Agendamento Manual de Serviço</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Detalhes do Agendamento</CardTitle><CardDescription>Preencha as informações para criar um novo serviço.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>1. Selecione o Cliente</Label><Select onValueChange={handleClientChange} value={formData.clientId} required><SelectTrigger><SelectValue placeholder="Selecione um cliente..." /></SelectTrigger><SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.fullName}</SelectItem>))}</SelectContent></Select></div>
                            <div className="space-y-2"><Label>2. Selecione o Profissional</Label><Select onValueChange={(value) => handleInputChange('professionalId', value)} value={formData.professionalId} required><SelectTrigger><SelectValue placeholder="Selecione um profissional..." /></SelectTrigger><SelectContent>{professionals.map(prof => (<SelectItem key={prof.id} value={prof.id}>{prof.fullName}</SelectItem>))}</SelectContent></Select></div>
                        </div>
                        <div><Label className="font-semibold">3. Qual serviço você precisa?</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">{Object.entries(serviceNames).map(([key, name]) => (<Button key={key} type="button" variant={formData.service === key ? "secondary" : "outline"} onClick={() => handleInputChange('service', key)} className="h-auto py-3 flex flex-col gap-2">{React.createElement(serviceIcons[key], { className: "w-6 h-6" })}<span>{name}</span></Button>))}</div></div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>4. Escolha a data</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => handleInputChange('date', date)} initialFocus /></PopoverContent></Popover></div>
                            <div className="space-y-2"><Label>5. Escolha o horário</Label><Select onValueChange={(value) => handleInputChange('time', value)} value={formData.time} required><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="08:00">08:00</SelectItem><SelectItem value="09:00">09:00</SelectItem><SelectItem value="10:00">10:00</SelectItem><SelectItem value="13:00">13:00</SelectItem><SelectItem value="14:00">14:00</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>6. Qual a duração?</Label><Select onValueChange={(value) => handleInputChange('duration', value)} value={formData.duration} required><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="4">4 horas</SelectItem><SelectItem value="6">6 horas</SelectItem><SelectItem value="8">8 horas</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>7. Endereço do serviço</Label><Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required /></div>
                        </div>
                        <div className="space-y-2"><Label>Observações (Opcional)</Label><Textarea value={formData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Ex: Tenho um cachorro. Por favor, trazer produto para limpar vidro." /></div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card><CardHeader><CardTitle>Resumo e Ações</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-4"><h4 className="font-headline font-semibold">Resumo</h4>
                            <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><p className="text-sm truncate">{formData.clientId ? clients.find(c => c.id === formData.clientId)?.fullName : 'N/A'}</p></div>
                            <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-muted-foreground" /><p className="text-sm truncate">{formData.professionalId ? professionals.find(p => p.id === formData.professionalId)?.fullName : 'N/A'}</p></div>
                            <div className="flex items-center gap-3"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{formData.date ? format(formData.date, "PPP", { locale: ptBR }) : 'N/A'}</p></div>
                            <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{formData.time && formData.duration ? `${formData.time} (${formData.duration}h)` : 'N_A'}</p></div>
                        </div>
                        <div className="space-y-2"><Label>8. Status do Pagamento</Label><Select onValueChange={(value) => handleInputChange('paymentStatus', value)} value={formData.paymentStatus} required><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="Em Aberto">Em Aberto</SelectItem><SelectItem value="Pago">Pago</SelectItem></SelectContent></Select></div>
                        <div className="flex justify-between items-center pt-4 border-t"><span className="text-muted-foreground">Valor Total</span><span className="font-bold text-xl">R$ {total.toFixed(2).replace('.', ',')}</span></div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Agendamento Manual'}</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </>
  );
}

const ClientScheduleForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    service: searchParams.get('service') || '',
    duration: searchParams.get('duration') || '',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: '',
    address: '',
    observations: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchClientData = async () => {
        const clientDocRef = doc(db, "clients", user.uid);
        const docSnap = await getDoc(clientDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setClientData(data);
            setFormData(prev => ({...prev, address: data.address || ''}))
        }
    }
    fetchClientData();
  }, [user]);

  const sendNotificationEmail = async (to: string, subject: string, html: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Falha ao ler o corpo do erro da API." }));
        // Lança um erro com a mensagem detalhada para ser pego pelo catch externo
        throw errorData; 
      }
    } catch (error) {
      // O erro detalhado será logado no catch da função que chamou esta.
      // E relançado para parar a execução, se necessário.
      throw error; 
    }
  };

  const notifyAllProfessionals = async (serviceData: any) => {
    try {
        const profQuery = query(collection(db, "professionals"), where("status", "in", ["Aprovado", "Ativo"]));
        const profSnap = await getDocs(profQuery);
        
        const notificationPromises = profSnap.docs.map(profDoc => {
            const profData = profDoc.data();
            if (profData.email) {
                return sendNotificationEmail(
                    profData.email,
                    `Nova Oportunidade: Serviço de ${serviceData.service} Disponível!`,
                    `<h1>Olá, ${profData.fullName}!</h1>
                     <p>Um novo serviço de ${serviceData.service} foi solicitado na sua região e está disponível para você aceitar.</p>
                     <p><strong>Endereço:</strong> ${serviceData.address}</p>
                     <p><strong>Data:</strong> ${new Date(serviceData.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às ${serviceData.time}</p>
                     <p>Acesse a plataforma para ver mais detalhes e aceitar o serviço.</p>`
                );
            }
            return Promise.resolve();
        });

        await Promise.all(notificationPromises);

    } catch (error) {
        // Agora o erro detalhado vindo de sendNotificationEmail será logado aqui
        console.error("Falha detalhada ao notificar profissionais:", error);
        // Opcional: notificar o usuário que a notificação aos profissionais falhou, mas o serviço foi criado.
        toast({
            variant: "destructive",
            title: "Aviso: Falha na Notificação",
            description: "Sua solicitação foi criada, mas houve um erro ao notificar os profissionais por e-mail."
        })
    }
  };

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
    if (!user || !clientData) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar os dados do cliente."});
        return;
    };
    setIsSubmitting(true);
    
    try {
        const scheduleData = {
            clientId: user.uid,
            clientName: clientData.fullName,
            clientCpf: clientData.cpf || '',
            clientEmail: user.email,
            clientPhone: clientData.phone || '',
            service: serviceNames[formData.service] || formData.service,
            duration: `${formData.duration} horas`,
            date: formData.date.toISOString().split('T')[0],
            time: formData.time,
            address: formData.address,
            observations: formData.observations,
            value: total,
            status: "Pendente",
            paymentStatus: 'Pendente',
            createdAt: serverTimestamp(),
            scheduledBy: 'client',
        };

        await addDoc(collection(db, "schedules"), scheduleData);
        
        toast({
            title: "Solicitação Enviada!",
            description: "Seu agendamento foi enviado aos profissionais. Você será notificado quando um deles aceitar.",
        });

        // Notify professionals after successfully creating the schedule
        await notifyAllProfessionals(scheduleData);

        router.push('/dashboard/my-account');

    } catch (error) {
        toast({ variant: "destructive", title: "Erro ao agendar", description: "Não foi possível criar o agendamento. Tente novamente." });
        console.error("Erro detalhado ao criar agendamento:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

   return (
    <>
      <h1 className="font-headline text-3xl font-semibold mb-4 text-center">Solicitar um Serviço</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Detalhes do Serviço</CardTitle><CardDescription>Preencha as informações do serviço que você precisa.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <div><Label className="font-semibold">1. Qual serviço você precisa?</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">{Object.entries(serviceNames).map(([key, name]) => (<Button key={key} type="button" variant={formData.service === key ? "secondary" : "outline"} onClick={() => handleInputChange('service', key)} className="h-auto py-3 flex flex-col gap-2">{React.createElement(serviceIcons[key], { className: "w-6 h-6" })}<span>{name}</span></Button>))}</div></div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>2. Escolha a data</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => handleInputChange('date', date)} initialFocus disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()))} /></PopoverContent></Popover></div>
                            <div className="space-y-2"><Label>3. Escolha o horário</Label><Select onValueChange={(value) => handleInputChange('time', value)} value={formData.time} required><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="08:00">08:00</SelectItem><SelectItem value="09:00">09:00</SelectItem><SelectItem value="10:00">10:00</SelectItem><SelectItem value="13:00">13:00</SelectItem><SelectItem value="14:00">14:00</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>4. Qual a duração?</Label><Select onValueChange={(value) => handleInputChange('duration', value)} value={formData.duration} required><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="4">4 horas</SelectItem><SelectItem value="6">6 horas</SelectItem><SelectItem value="8">8 horas</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>5. Endereço do serviço</Label><Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required /></div>
                        </div>
                        <div className="space-y-2"><Label>Observações (Opcional)</Label><Textarea value={formData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Ex: Tenho um cachorro. Por favor, trazer produto para limpar vidro." /></div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-24"><CardHeader><CardTitle>Resumo e Valor</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                         <div className="p-4 bg-muted/50 rounded-lg space-y-4"><h4 className="font-headline font-semibold">Resumo</h4>
                            <div className="flex items-center gap-3"><HomeIcon className="h-4 w-4 text-muted-foreground" /><p className="text-sm truncate">{formData.service ? serviceNames[formData.service] : 'N/A'}</p></div>
                            <div className="flex items-center gap-3"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{formData.date ? format(formData.date, "PPP", { locale: ptBR }) : 'N/A'}</p></div>
                            <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{formData.time && formData.duration ? `${formData.time} (${formData.duration}h)` : 'N/A'}</p></div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t"><span className="text-muted-foreground">Valor Total Estimado</span><span className="font-bold text-xl">R$ {total.toFixed(2).replace('.', ',')}</span></div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar Solicitação'}</Button>
                        <p className="text-xs text-center text-muted-foreground">Um profissional irá aceitar seu serviço. Você será notificado.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </>
  );
}


const SchedulePage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <ScheduleLayout>
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      </ScheduleLayout>
    );
  }

  if (!user) {
    router.push('/login?redirect=/schedule');
    return null;
  }
  
  return (
    <ScheduleLayout>
        {user.role === 'admin' ? <AdminScheduleForm /> : <ClientScheduleForm user={user} />}
    </ScheduleLayout>
  );
};

export default withAuth(SchedulePage, ['admin', 'client']);


