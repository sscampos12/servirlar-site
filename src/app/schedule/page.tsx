
"use client"

import { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Send } from "lucide-react"
import { useRouter } from 'next/navigation';
import { ScheduleLayout } from './layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const packages: Record<string, number> = {
  "4h": 140.00,
  "6h": 198.00,
  "8h": 240.00,
};

const serviceOptions = [
  "Faxina Padrão", "Passadoria", "Cozinheira",
];

const propertyTypes = ["Residência", "Empresa", "Apartamento", "Casa"];

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
        toast({
            title: "Login Necessário",
            description: "Você precisa estar logado para agendar um serviço.",
            variant: "destructive"
        });
        router.push('/login?redirect=/schedule');
        return;
    }
     if (!service || !duration || !date || !time || !address) {
        toast({
            title: "Campos Obrigatórios",
            description: "Por favor, preencha todos os campos obrigatórios.",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);

    try {
        const clientDocRef = doc(db, "clients", user.uid);
        const clientDocSnap = await getDoc(clientDocRef);

        if (!clientDocSnap.exists()) {
            throw new Error("Perfil de cliente não encontrado.");
        }
        const clientData = clientDocSnap.data();

        await addDoc(collection(db, "schedules"), {
            clientId: user.uid,
            clientName: clientData.fullName,
            clientEmail: clientData.email,
            clientPhone: clientData.phone || '', // assuming phone is in client data
            clientCpf: clientData.cpf || '', // assuming cpf is in client data
            service,
            duration,
            date,
            time,
            address,
            observations,
            value: packages[duration],
            status: "Pendente",
            createdAt: serverTimestamp(),
        });
        
        toast({
            title: "Agendamento quase lá!",
            description: "Sua solicitação foi criada. Finalize o pagamento para confirmar.",
        });
        router.push('/schedule/confirm');

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
              <CardTitle className="font-headline text-3xl">Agendar um Serviço</CardTitle>
              <CardDescription>
                Preencha os detalhes abaixo para encontrarmos o profissional perfeito para você.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <Button size="lg" onClick={handleSubmit} disabled={isLoading}>
                         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isLoading ? "Criando Agendamento..." : "Continuar para Pagamento"}
                    </Button>
                </div>
            </CardContent>
          </Card>
      </div>
    </ScheduleLayout>
  );
}
