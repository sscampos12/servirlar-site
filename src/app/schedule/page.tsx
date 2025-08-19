
"use client"

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, User, Users } from "lucide-react"
import { useRouter } from 'next/navigation';
import { ScheduleLayout } from './layout';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, DocumentData } from 'firebase/firestore';

const packages: Record<string, number> = {
  "4h": 140.00,
  "6h": 198.00,
  "8h": 240.00,
};

const serviceOptions = [
  "Faxina Padrão", "Passadoria", "Cozinheira",
];

interface Selectable {
    id: string;
    name: string;
    [key: string]: any;
}

export default function SchedulePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [clients, setClients] = useState<Selectable[]>([]);
  const [professionals, setProfessionals] = useState<Selectable[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        setIsDataLoading(true);
        try {
            // Fetch Clients
            const clientsSnapshot = await getDocs(collection(db, "clients"));
            const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().fullName, ...doc.data() }));
            setClients(clientsData);

            // Fetch Approved Professionals
            const professionalsQuery = query(collection(db, "professionals"), where("status", "==", "Aprovado"));
            const professionalsSnapshot = await getDocs(professionalsQuery);
            const professionalsData = professionalsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().fullName, ...doc.data() }));
            setProfessionals(professionalsData);
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar dados",
                description: "Não foi possível carregar a lista de clientes e profissionais."
            });
        } finally {
            setIsDataLoading(false);
        }
    };
    fetchData();
  }, [toast]);

  const handleSubmit = async () => {
    if (!selectedClientId || !selectedProfessionalId || !service || !duration || !date || !time || !address) {
       toast({
           title: "Campos Obrigatórios",
           description: "Por favor, selecione cliente, profissional e preencha todos os campos de agendamento.",
           variant: "destructive"
       });
       return;
   }

    setIsLoading(true);

    try {
        const selectedClient = clients.find(c => c.id === selectedClientId);
        const selectedProfessional = professionals.find(p => p.id === selectedProfessionalId);

        if(!selectedClient || !selectedProfessional) {
            throw new Error("Cliente ou profissional selecionado não encontrado.");
        }

        await addDoc(collection(db, "schedules"), {
            // Client info
            clientId: selectedClient.id,
            clientName: selectedClient.name,
            clientEmail: selectedClient.email,
            clientPhone: selectedClient.phone || '',
            clientCpf: selectedClient.cpf || '', 
            // Professional info
            professionalId: selectedProfessional.id,
            professionalName: selectedProfessional.name,
            // Schedule info
            service,
            duration,
            date,
            time,
            address,
            observations,
            value: packages[duration],
            status: "Pendente", // Admin creates it as pending for client payment
            createdAt: serverTimestamp(),
            createdBy: 'admin', // Flag to know who created it
        });
        
        toast({
            title: "Agendamento Criado!",
            description: "A cobrança foi enviada ao cliente para confirmação do pagamento.",
        });
        // Redirect to a relevant admin page, e.g., the main dashboard
        router.push('/dashboard');

    } catch (error) {
        console.error("Error creating schedule: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao Agendar",
            description: "Não foi possível criar seu agendamento. Tente novamente.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <ScheduleLayout>
      <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Agendar um Novo Serviço (Admin)</CardTitle>
              <CardDescription>
                Preencha os detalhes abaixo para criar um agendamento para um cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isDataLoading ? <Loader2 className="mx-auto h-8 w-8 animate-spin" /> : (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Cliente</Label>
                                <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                                    <SelectTrigger><SelectValue placeholder="Selecione um cliente..." /></SelectTrigger>
                                    <SelectContent>
                                        {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Users className="h-4 w-4" /> Profissional</Label>
                                <Select onValueChange={setSelectedProfessionalId} value={selectedProfessionalId}>
                                    <SelectTrigger><SelectValue placeholder="Selecione um profissional..." /></SelectTrigger>
                                    <SelectContent>
                                        {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Qual serviço você precisa?</Label>
                            <Select onValueChange={setService} value={service}>
                                <SelectTrigger><SelectValue placeholder="Selecione um serviço..." /></SelectTrigger>
                                <SelectContent>
                                    {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Qual a duração do serviço?</Label>
                            <Select onValueChange={setDuration} value={duration}>
                                <SelectTrigger><SelectValue placeholder="Selecione um pacote de horas..." /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(packages).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{key} - R${' '} {value.toFixed(2).replace('.', ',')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Data</Label>
                                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Horário de Início</Label>
                                <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, Número, Bairro, Cidade - Estado" required />
                        </div>
                    
                        <div className="space-y-2">
                            <Label htmlFor="observations">Observações (opcional)</Label>
                            <Textarea id="observations" value={observations} onChange={e => setObservations(e.target.value)} placeholder="Ex: Tenho um cachorro dócil. Por favor, trazer produto para limpar porcelanato." />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button size="lg" onClick={handleSubmit} disabled={isLoading || isDataLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                {isLoading ? "Criando Agendamento..." : "Agendar e Enviar Cobrança"}
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
          </Card>
      </div>
    </ScheduleLayout>
  );
}
