"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ArrowLeft, CreditCard } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientContract } from '@/components/contracts/client-contract';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const mockServices = [
    { name: "Faxina Padrão", description: "Limpeza geral para manutenção." },
    { name: "Passadoria", description: "Roupas passadas com cuidado." },
    { name: "Cuidador de Idosos", description: "Atenção e companhia." },
    { name: "Cozinheira", description: "Refeições caseiras e saborosas." },
];

const mockProfessionals = [
  { id: 1, name: "Maria Aparecida", specialization: "Faxina", location: "Centro", rating: 5, imageUrl: "https://placehold.co/100x100.png?text=MA", dataAiHint: "woman portrait" },
  { id: 2, name: "João da Silva", specialization: "Passadoria", location: "Zona Sul", rating: 4, imageUrl: "https://placehold.co/100x100.png?text=JS", dataAiHint: "man portrait" },
  { id: 3, name: "Ana Paula", specialization: "Cuidadora", location: "Zona Norte", rating: 5, imageUrl: "https://placehold.co/100x100.png?text=AP", dataAiHint: "woman face" },
];

export default function SchedulePage() {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [agreedToContract, setAgreedToContract] = useState(false);
    const { toast } = useToast();

    const handleSelectService = (service: any) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleSelectProfessional = (professional: any) => {
        setSelectedProfessional(professional);
        setStep(3);
    };

    const handleConfirmDateTime = () => {
        setStep(4);
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
            setSelectedProfessional(null);
            setAgreedToContract(false);
        }, 2000);
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    }

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
                            <CardTitle className="font-headline">Passo 2: Escolha o Profissional</CardTitle>
                            <CardDescription>Veja os profissionais disponíveis para '{selectedService?.name}'.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockProfessionals.map(p => (
                                <Card key={p.id} className="text-center transition-transform transform hover:scale-105">
                                    <CardContent className="p-4">
                                        <Avatar className="w-24 h-24 mx-auto mb-2">
                                            <AvatarImage src={p.imageUrl} alt={p.name} data-ai-hint={p.dataAiHint} />
                                            <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">{p.name}</h3>
                                        <p className="text-sm text-muted-foreground">{p.specialization}</p>
                                        <div className="flex items-center justify-center mt-2">
                                            <span className="text-md text-accent font-bold">{p.rating}</span>
                                            <Star className="h-4 w-4 text-accent fill-current ml-1" />
                                        </div>
                                        <Button onClick={() => handleSelectProfessional(p)} className="mt-4 w-full">
                                            Agendar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </>
                )}

                {step === 3 && selectedProfessional && (
                     <>
                        <CardHeader>
                            <CardTitle className="font-headline">Passo 3: Escolha a Data e Hora</CardTitle>
                            <CardDescription>Agendando com {selectedProfessional.name}.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row gap-8 items-center justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                            <div className="w-full md:w-auto space-y-4">
                                <Label htmlFor="time">Horário</Label>
                                <Input id="time" type="time" defaultValue="09:00" />
                                <Button onClick={handleConfirmDateTime} className="w-full">Confirmar Data e Hora</Button>
                            </div>
                        </CardContent>
                    </>
                )}

                {step === 4 && selectedProfessional && (
                     <>
                        <CardHeader>
                            <CardTitle className="font-headline">Passo 4: Pagamento e Confirmação</CardTitle>
                            <CardDescription>Revise os detalhes e confirme o agendamento.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-semibold">Resumo do Agendamento</h4>
                                <p><strong>Profissional:</strong> {selectedProfessional.name}</p>
                                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                                <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('pt-BR')}</p>
                                <p className="text-xl font-bold">Total: R$ 150,00</p>
                                
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
