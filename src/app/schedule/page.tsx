
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Clock, Home, Info, DollarSign, Shirt, Soup, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const services = [
  { id: 'faxina', name: 'Faxina Padrão', icon: Home },
  { id: 'passadoria', name: 'Passadoria', icon: Shirt },
  { id: 'cozinheira', name: 'Cozinheira', icon: Soup },
  { id: 'cuidador', name: 'Cuidador(a) de Idosos', icon: UserPlus },
]

const durations = ['4 horas', '6 horas', '8 horas'];
const times = ['08:00', '09:00', '10:00', '13:00', '14:00'];

export default function SchedulePage() {
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>();
  const [address, setAddress] = useState('Rua das Flores, 123 - Centro');
  const [observations, setObservations] = useState('');

  const { toast } = useToast();

  const isFormComplete = selectedService && date && selectedTime && selectedDuration && address;

  const handleSubmit = () => {
    toast({
      title: "Agendamento Confirmado!",
      description: "Seu serviço foi agendado com sucesso. Verifique os detalhes em 'Meus Agendamentos'.",
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="font-headline text-2xl font-semibold mb-6">Agendar um Novo Serviço</h1>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Detalhes do Serviço</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para encontrar o profissional ideal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Selection */}
            <div>
              <Label className="font-semibold">1. Qual serviço você precisa?</Label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                {services.map((service) => (
                  <Button
                    key={service.id}
                    variant={selectedService === service.id ? "secondary" : "outline"}
                    onClick={() => setSelectedService(service.id)}
                    className="h-auto py-3 flex flex-col gap-2"
                  >
                    <service.icon className="w-6 h-6" />
                    <span>{service.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="font-semibold">2. Escolha a data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
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
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time" className="font-semibold">3. Escolha o horário</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration and Address */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="duration" className="font-semibold">4. Qual a duração?</Label>
                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        {durations.map(duration => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="address" className="font-semibold">5. Endereço do serviço</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2" />
                </div>
            </div>
            
            {/* Observations */}
            <div>
              <Label htmlFor="observations" className="font-semibold">Observações (Opcional)</Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Tenho um cachorro. Por favor, trazer produto para limpar vidro."
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <div className="space-y-6">
        <h2 className="font-headline text-xl font-semibold">Resumo do Agendamento</h2>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Seu Pedido</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
                    {selectedService ? services.find(s => s.id === selectedService)?.icon({ className: "h-4 w-4 text-muted-foreground" }) : <Info className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Serviço</p>
                    <p className="font-medium">{selectedService ? services.find(s => s.id === selectedService)?.name : "Não selecionado"}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{date ? format(date, "PPP", { locale: ptBR }) : "Não selecionada"}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Horário e Duração</p>
                    <p className="font-medium">{selectedTime || "N/A"} - {selectedDuration || "N/A"}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-muted rounded-md h-8 w-8">
                    <Home className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">{address || "Não informado"}</p>
                </div>
            </div>

            <div className="border-t pt-4 mt-4">
                 <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Valor Estimado</p>
                    <p className="font-headline text-xl font-bold">R$ 140,00</p>
                 </div>
            </div>
          </CardContent>
        </Card>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" className="w-full" disabled={!isFormComplete}>
              Confirmar e Pagar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmação de Pagamento</AlertDialogTitle>
              <AlertDialogDescription>
                Você será redirecionado para um ambiente seguro para finalizar o pagamento.
                Seu agendamento será confirmado após a aprovação.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Prosseguir para Pagamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        <p className="text-xs text-muted-foreground text-center">
            Ao continuar, você concorda com nossos <a href="/legal" className="underline">Termos de Serviço</a>.
        </p>
      </div>
    </div>
  );
}

    