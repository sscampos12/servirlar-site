
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientContract } from '@/components/contracts/client-contract';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockServices = [
    { name: "Faxina Padrão", description: "Limpeza geral para manutenção.", pricePerHour: 25 },
    { name: "Passadoria", description: "Roupas passadas com cuidado.", pricePerHour: 30 },
    { name: "Cuidador de Idosos", description: "Atenção e companhia.", pricePerHour: 15 },
    { name: "Cozinheira", description: "Refeições caseiras e saborosas.", pricePerHour: 40 },
];

export default function SchedulePage() {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<{name: string; description: string; pricePerHour: number} | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [agreedToContract, setAgreedToContract] = useState(false);
    const { toast } = useToast();
    const [hours, setHours] = useState("2");
    const [time, setTime] = useState("09:00");

    const handleSelectService = (service: any) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleConfirmDateTime = () => {
        setStep(3);
    }

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreedToContract) {
            toast({ variant: "destructive", title: "Aceite o contrato para continuar." });
            return;
        }
        toast({ title: "Agendamento confirmado!", description: "O profissional foi notificado." });
        // Reset flow
        setTimeout(() => {
            setStep(1);
            setSelectedService(null);
            setAgreedToContract(false);
        }, 2000);
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    }

    const totalPrice = selectedService ? selectedService.pricePerHour * parseInt(hours) : 0;

    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-4">
                {step > 1 && (
                    <Button variant="outline" size="icon" className="mr-4" onClick={goBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <h1 className="font-headline text-lg font-semibold md:text-2xl">Agendar Serviço</h1>
            </div>

            <Card>
                {step === 1 && (
                    <>
                        <CardHeader>
                            <CardTitle className="font-headline">Passo 1: Escolha o Serviço</CardTitle>
                            <CardDescription>Selecione o tipo de serviço que você precisa.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            {mockServices.map(service => (
                                <Card key={service.name} className="hover:shadow-md cursor-pointer" onClick={() => handleSelectService(service)}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        <CardDescription>{service.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </CardContent>
                    </>
                )}

                {step === 2 && (
                     <>
                        <CardHeader>
                            <CardTitle className="font-headline">Passo 2: Escolha a Data e Hora</CardTitle>
                            <CardDescription>Agendando o serviço de {selectedService?.name}.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row gap-8 items-center justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                             <div className="w-full md:w-auto space-y-4">
                                <div className='space-y-2'>
                                    <Label htmlFor="time">Horário de Início</Label>
                                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="hours">Quantidade de Horas</Label>
                                    <Select value={hours} onValueChange={setHours}>
                                        <SelectTrigger id="hours">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(7)].map((_, i) => (
                                                <SelectItem key={i+2} value={(i + 2).toString()}>
                                                    {i + 2} horas
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleConfirmDateTime} className="w-full">Confirmar Data e Hora</Button>
                            </div>
                        </CardContent>
                    </>
                )}

                {step === 3 && (
                     <>
                        <CardHeader>
                            <CardTitle className="font-headline">Passo 3: Pagamento e Confirmação</CardTitle>
                            <CardDescription>Revise os detalhes e confirme o agendamento.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-semibold">Resumo do Agendamento</h4>
                                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                                <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('pt-BR')}</p>
                                <p><strong>Horário:</strong> {time}</p>
                                <p><strong>Duração:</strong> {hours} horas</p>
                                <p className="text-xl font-bold">Total: R$ {totalPrice.toFixed(2)}</p>
                                
                                <form onSubmit={handlePayment} className="space-y-4 pt-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        <Label>Dados de Pagamento</Label>
                                    </div>
                                    <Input placeholder="Número do Cartão / PIN" required />
                                    <Button type="submit" className="w-full" disabled={!agreedToContract}>Confirmar e Pagar</Button>
                                </form>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-semibold">Termos do Serviço</h4>
                                <div className="h-48 overflow-y-scroll bg-muted/50 p-4 rounded-md border">
                                    <ClientContract />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="agreeContract" checked={agreedToContract} onCheckedChange={(checked) => setAgreedToContract(!!checked)} />
                                    <Label htmlFor="agreeContract" className="text-sm">
                                        Li e concordo com o Contrato/Recibo do Cliente.
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}
