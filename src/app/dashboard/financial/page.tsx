
"use client"

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar as CalendarIcon, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Appointment {
    id: string;
    clientName: string;
    service: string;
    date: string;
    professionalName: string;
    value: number;
}

const COMMISSION_RATE = 0.25;

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function FinancialPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "schedules"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const schedulesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
            setAppointments(schedulesData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredAppointments = appointments.filter(app => {
        if (!date) return false;
        const appDate = new Date(app.date + 'T00:00:00'); // Ensure correct date parsing
        return format(appDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });

    const dailySummary = filteredAppointments.reduce((acc, app) => {
        const commission = app.value * COMMISSION_RATE;
        const professionalPayment = app.value - commission;
        
        acc.totalRevenue += app.value;
        acc.totalPaidToProfessionals += professionalPayment;
        acc.totalCommission += commission;

        return acc;
    }, {
        totalRevenue: 0,
        totalPaidToProfessionals: 0,
        totalCommission: 0,
    });
    
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-lg font-semibold md:text-2xl mb-4">
          Relatório Financeiro Diário
        </h1>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Filtro por Data</CardTitle>
                <CardDescription>Selecione a data para visualizar o relatório financeiro correspondente.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full md:w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
      </div>

       <div>
            <h2 className="font-headline text-lg font-semibold md:text-xl mb-4">
                Resumo Financeiro do Dia
            </h2>
             <div className="grid gap-4 md:grid-cols-3">
                <StatCard 
                    title="Receita Bruta" 
                    value={`R$ ${dailySummary.totalRevenue.toFixed(2).replace('.', ',')}`}
                    icon={DollarSign} 
                />
                 <StatCard 
                    title="Repasse aos Profissionais" 
                    value={`R$ ${dailySummary.totalPaidToProfessionals.toFixed(2).replace('.', ',')}`}
                    icon={Users} 
                />
                 <StatCard 
                    title="Comissão da Plataforma" 
                    value={`R$ ${dailySummary.totalCommission.toFixed(2).replace('.', ',')}`}
                    icon={TrendingUp} 
                />
            </div>
       </div>

      <div>
        <h2 className="font-headline text-lg font-semibold md:text-xl mb-4">
          Detalhamento das Transações
        </h2>
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Profissional</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead className="text-right">Valor Total (R$)</TableHead>
                                <TableHead className="text-right">Repasse (R$)</TableHead>
                                <TableHead className="text-right">Comissão (R$)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredAppointments.length > 0 ? (
                                filteredAppointments.map((app) => {
                                    const commission = app.value * COMMISSION_RATE;
                                    const professionalPayment = app.value - commission;
                                    return (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.clientName}</TableCell>
                                            <TableCell>{app.professionalName}</TableCell>
                                            <TableCell>{app.service}</TableCell>
                                            <TableCell className="text-right font-mono">{app.value.toFixed(2).replace('.', ',')}</TableCell>
                                            <TableCell className="text-right font-mono text-blue-600">{professionalPayment.toFixed(2).replace('.', ',')}</TableCell>
                                            <TableCell className="text-right font-mono text-green-600">{commission.toFixed(2).replace('.', ',')}</TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        Nenhuma transação encontrada para a data selecionada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}

    