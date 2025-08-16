
"use client"

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarIcon, DollarSign, Users, Clock, Home, Tag, Info, User, CheckCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const dailyData = [
  { date: "Seg", revenue: 250, appointments: 5 },
  { date: "Ter", revenue: 300, appointments: 7 },
  { date: "Qua", revenue: 200, appointments: 4 },
  { date: "Qui", revenue: 450, appointments: 9 },
  { date: "Sex", revenue: 600, appointments: 12 },
  { date: "Sáb", revenue: 800, appointments: 15 },
  { date: "Dom", revenue: 350, appointments: 6 },
];

const weeklyData = [
  { week: "Semana 1", revenue: 2950, appointments: 58 },
  { week: "Semana 2", revenue: 3200, appointments: 65 },
  { week: "Semana 3", revenue: 3500, appointments: 70 },
  { week: "Semana 4", revenue: 3100, appointments: 62 },
];

const monthlyData = [
  { month: "Jan", revenue: 12750, appointments: 255 },
  { month: "Fev", revenue: 13500, appointments: 270 },
  { month: "Mar", revenue: 14200, appointments: 284 },
  { month: "Abr", revenue: 13900, appointments: 278 },
  { month: "Mai", revenue: 15100, appointments: 302 },
];

const chartConfig = {
  revenue: {
    label: "Receita (R$)",
    color: "hsl(var(--chart-1))",
  },
  appointments: {
    label: "Agendamentos",
    color: "hsl(var(--chart-2))",
  },
}

interface Appointment {
    id: number;
    client: string;
    service: string;
    date: Date;
    time: string;
    duration: string;
    address: string;
    status: "Confirmado" | "Pendente" | "Finalizado";
    professional: string;
    value: number;
}

const mockAppointments: Appointment[] = [
    { id: 1, client: "Carlos Mendes", service: "Faxina Padrão", date: new Date(), time: "09:00", duration: "4 horas", address: "Rua das Flores, 123", status: "Confirmado", professional: "Maria Aparecida", value: 140.00 },
    { id: 2, client: "Ana Silva", service: "Passadoria", date: new Date(), time: "14:00", duration: "2 horas", address: "Av. Principal, 456", status: "Confirmado", professional: "João da Silva", value: 74.00 },
    { id: 3, client: "Pedro Souza", service: "Cozinheira", date: new Date(new Date().setDate(new Date().getDate() + 1)), time: "10:00", duration: "6 horas", address: "Praça Central, 789", status: "Pendente", professional: "Maria Aparecida", value: 228.00 },
    { id: 4, client: "Juliana Costa", service: "Faxina Padrão", date: new Date(), time: "08:00", duration: "8 horas", address: "Rua das Palmeiras, 321", status: "Finalizado", professional: "Ana Paula", value: 240.00 },
    { id: 5, client: "Fernanda Lima", service: "Faxina Padrão", date: new Date(), time: "10:00", duration: "6 horas", address: "Rua dos Sonhos, 555", status: "Confirmado", professional: "Maria Aparecida", value: 198.00 },
]

const mockProfessionals = ["Maria Aparecida", "João da Silva", "Ana Paula", "Carlos de Souza"];

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-center gap-3">
        <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);

export default function ReportsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedProfessional, setSelectedProfessional] = useState<string>("todos");
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const filteredAppointments = mockAppointments.filter(app => {
        const isSameDay = format(app.date, 'yyyy-MM-dd') === (date ? format(date, 'yyyy-MM-dd') : '');
        const isSameProfessional = selectedProfessional === 'todos' || app.professional === selectedProfessional;
        return isSameDay && isSameProfessional;
    });

    const paymentSummary = filteredAppointments.reduce((acc, app) => {
        if (app.status === 'Finalizado' || app.status === 'Confirmado') {
            if (!acc[app.professional]) {
                acc[app.professional] = 0;
            }
            acc[app.professional] += app.value;
        }
        return acc;
    }, {} as Record<string, number>);
    
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-lg font-semibold md:text-2xl mb-4">
          Relatórios Gerenciais
        </h1>
        <Tabs defaultValue="weekly">
            <TabsList className="mb-4">
            <TabsTrigger value="daily">Diário</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
            <ReportChart title="Relatório Diário" data={dailyData} dataKey="date" />
            </TabsContent>
            <TabsContent value="weekly">
            <ReportChart title="Relatório Semanal" data={weeklyData} dataKey="week" />
            </TabsContent>
            <TabsContent value="monthly">
            <ReportChart title="Relatório Mensal" data={monthlyData} dataKey="month" />
            </TabsContent>
        </Tabs>
      </div>

      <div>
        <h1 className="font-headline text-lg font-semibold md:text-2xl mb-4">
          Relatório Operacional de Agendamentos
        </h1>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Filtros do Relatório</CardTitle>
                <CardDescription>Selecione a data e o profissional para visualizar os detalhes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                    <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                        <SelectTrigger className="w-full md:w-[280px]">
                            <Users className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filtrar por profissional..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os Profissionais</SelectItem>
                            {mockProfessionals.map(prof => (
                                <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {selectedProfessional === 'todos' && Object.keys(paymentSummary).length > 0 && (
                     <div className="mb-6">
                        <h3 className="font-headline text-lg font-semibold mb-4">Resumo de Pagamentos do Dia</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Object.entries(paymentSummary).map(([professional, total]) => (
                                <Card key={professional}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{professional}</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">R$ {total.toFixed(2).replace('.', ',')}</div>
                                        <p className="text-xs text-muted-foreground">Valor a receber hoje</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <h3 className="font-headline text-lg font-semibold mb-4">Lista de Agendamentos</h3>
                <div className="border rounded-md">
                     <Dialog>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Serviço</TableHead>
                                    <TableHead>Profissional</TableHead>
                                    <TableHead>Horário</TableHead>
                                    <TableHead>Endereço</TableHead>
                                    <TableHead className="text-right">Valor (R$)</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <DialogTrigger asChild key={app.id}>
                                            <TableRow onClick={() => setSelectedAppointment(app)} className="cursor-pointer">
                                                <TableCell className="font-medium">{app.client}</TableCell>
                                                <TableCell>
                                                    <div>{app.service}</div>
                                                    <div className="text-xs text-muted-foreground">{app.duration}</div>
                                                </TableCell>
                                                <TableCell>{app.professional}</TableCell>
                                                <TableCell>{app.time}</TableCell>
                                                <TableCell>{app.address}</TableCell>
                                                <TableCell className="text-right font-mono">{app.value.toFixed(2).replace('.', ',')}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={app.status === 'Confirmado' ? 'default' : app.status === 'Pendente' ? 'secondary' : 'outline'}>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        </DialogTrigger>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">
                                            Nenhum agendamento encontrado para os filtros selecionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         {selectedAppointment && (
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Detalhes do Agendamento</DialogTitle>
                                <DialogDescription>
                                    Informações completas do serviço agendado para {selectedAppointment.client}.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <DetailRow icon={User} label="Cliente" value={selectedAppointment.client} />
                                    <DetailRow icon={Tag} label="Serviço" value={`${selectedAppointment.service} - ${selectedAppointment.duration}`} />
                                    <DetailRow icon={Users} label="Profissional" value={selectedAppointment.professional} />
                                    <DetailRow icon={CalendarIcon} label="Data" value={format(selectedAppointment.date, "PPP", { locale: ptBR })} />
                                    <DetailRow icon={Clock} label="Horário" value={selectedAppointment.time} />
                                    <DetailRow icon={Home} label="Endereço" value={selectedAppointment.address} />
                                    <DetailRow icon={DollarSign} label="Valor" value={`R$ ${selectedAppointment.value.toFixed(2).replace('.', ',')}`} />
                                     <DetailRow icon={Info} label="Status" value={<Badge variant={selectedAppointment.status === 'Confirmado' ? 'default' : selectedAppointment.status === 'Pendente' ? 'secondary' : 'outline'}>{selectedAppointment.status}</Badge>} />
                                </div>
                            </DialogContent>
                        )}
                     </Dialog>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}

function ReportChart({ title, data, dataKey }: { title: string, data: any[], dataKey: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>
          Visualize a receita e o número de agendamentos.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div>
          <h3 className="font-semibold mb-4">Receita</h3>
           <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={dataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
               <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Agendamentos</h3>
           <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <RechartsLineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={dataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line dataKey="appointments" type="monotone" stroke="var(--color-appointments)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

    