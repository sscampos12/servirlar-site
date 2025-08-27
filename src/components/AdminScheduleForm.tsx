
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Calendar as CalendarIcon, Clock, Home as HomeIcon, User, Briefcase, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, DocumentData, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { serviceIcons, serviceNames, pricingData } from '@/lib/service-data';
import { cn } from '@/lib/utils';

export const AdminScheduleForm = () => {
    const router = useRouter();
    const { toast } = useToast();

    const [clients, setClients] = useState<DocumentData[]>([]);
    const [professionals, setProfessionals] = useState<DocumentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        clientId: '',
        professionalId: '',
        service: '',
        duration: '',
        date: new Date(),
        time: '',
        address: '',
        observations: '',
        value: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const clientsSnapshot = await getDocs(collection(db, "clients"));
                setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                const profsSnapshot = await getDocs(query(collection(db, "professionals"), where("status", "in", ["Aprovado", "Ativo"])));
                setProfessionals(profsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } catch (error) {
                toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar clientes e profissionais.' });
                console.error("Fetch data error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if(field === 'clientId') {
            const selectedClient = clients.find(c => c.id === value);
            if(selectedClient?.address) {
                 setFormData(prev => ({ ...prev, address: selectedClient.address }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const selectedClient = clients.find(c => c.id === formData.clientId);
        const selectedProfessional = professionals.find(p => p.id === formData.professionalId);

        if (!selectedClient || !selectedProfessional) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Cliente e profissional devem ser selecionados." });
            setIsSubmitting(false);
            return;
        }

        try {
            const scheduleData = {
                clientId: selectedClient.id,
                clientName: selectedClient.fullName,
                clientEmail: selectedClient.email,
                professionalId: selectedProfessional.id,
                professionalName: selectedProfessional.fullName,
                service: serviceNames[formData.service as keyof typeof serviceNames] || formData.service,
                duration: `${formData.duration} horas`,
                date: formData.date.toISOString().split('T')[0],
                time: formData.time,
                address: formData.address,
                observations: formData.observations,
                value: formData.value,
                status: "Confirmado" as const, // Admin pode confirmar diretamente
                paymentStatus: 'Pendente',
                createdAt: serverTimestamp(),
                scheduledBy: 'admin',
            };

            await addDoc(collection(db, "schedules"), scheduleData);
            toast({ title: "Agendamento Criado!", description: "O agendamento manual foi criado com sucesso." });
            router.push('/dashboard');

        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível criar o agendamento." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Agendamento Manual (Admin)</CardTitle>
                <CardDescription>Crie um novo agendamento selecionando o cliente e o profissional.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label><User className="inline-block mr-2 h-4 w-4" />Selecione o Cliente</Label>
                            <Select onValueChange={(value) => handleInputChange('clientId', value)} required>
                                <SelectTrigger><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
                                <SelectContent>
                                    {clients.map(client => (
                                        <SelectItem key={client.id} value={client.id}>{client.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label><Briefcase className="inline-block mr-2 h-4 w-4" />Selecione o Profissional</Label>
                            <Select onValueChange={(value) => handleInputChange('professionalId', value)} required>
                                <SelectTrigger><SelectValue placeholder="Escolha um profissional..." /></SelectTrigger>
                                <SelectContent>
                                    {professionals.map(prof => (
                                        <SelectItem key={prof.id} value={prof.id}>{prof.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Serviço</Label>
                        <Select onValueChange={(value) => handleInputChange('service', value)} required>
                            <SelectTrigger><SelectValue placeholder="Escolha o tipo de serviço..." /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(serviceNames).map(([key, name]) => (
                                    <SelectItem key={key} value={key}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                         <div className="space-y-2">
                             <Label>Data</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(date) => handleInputChange('date', date as Date)} initialFocus/></PopoverContent>
                            </Popover>
                         </div>
                        <div className="space-y-2">
                            <Label>Horário</Label>
                            <Select onValueChange={(value) => handleInputChange('time', value)} value={formData.time} required>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="08:00">08:00</SelectItem>
                                    <SelectItem value="09:00">09:00</SelectItem>
                                    <SelectItem value="10:00">10:00</SelectItem>
                                    <SelectItem value="13:00">13:00</SelectItem>
                                    <SelectItem value="14:00">14:00</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Duração</Label>
                            <Select onValueChange={(value) => handleInputChange('duration', value)} value={formData.duration} required>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
                            <Label><HomeIcon className="inline-block mr-2 h-4 w-4" />Endereço do Serviço</Label>
                            <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label><DollarSign className="inline-block mr-2 h-4 w-4" />Valor do Serviço (R$)</Label>
                            <Input type="number" step="0.01" value={formData.value} onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)} required />
                        </div>
                     </div>

                    <div className="space-y-2">
                        <Label>Observações (Opcional)</Label>
                        <Textarea value={formData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Detalhes adicionais para o profissional..." />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                            Criar Agendamento
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
