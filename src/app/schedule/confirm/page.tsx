
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
import {
  Home,
  User,
  Calendar,
  Clock,
  CreditCard,
  Landmark,
  ShieldCheck
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { ScheduleLayout } from '@/app/schedule/layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-medium">{value}</span>
    </div>
);


export default function ConfirmationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = () => {
    // TODO: Inserir aqui a lógica de integração com a API de pagamento (EFI)
    // Ex: Chamar a API para gerar a cobrança do cartão ou o QR Code do PIX.
    
    // Simula o redirecionamento para o ambiente de pagamento do banco.
    toast({
        title: "Redirecionando para o pagamento...",
        description: "Você será levado para um ambiente seguro para finalizar a compra.",
    });

    // Em um cenário real, a API de pagamento retornaria uma URL de redirecionamento.
    // Para o protótipo, vamos redirecionar para a home após um tempo.
    setTimeout(() => {
        router.push('/'); 
    }, 2000);
  }
  
  return (
    <ScheduleLayout>
        <div className="max-w-4xl mx-auto">
            <Alert className="mb-6 border-primary bg-primary/5">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle className="font-headline text-primary">Ambiente Seguro</AlertTitle>
              <AlertDescription>
                Seus dados de pagamento são processados com segurança.
              </AlertDescription>
            </Alert>

            <h1 className="font-headline text-2xl font-semibold mb-6 text-center">Finalizar Agendamento</h1>
            <div className="grid gap-8 md:grid-cols-2">
                
                {/* Left Side: Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow icon={Home} label="Serviço" value="Faxina Padrão" />
                            <DetailRow icon={Calendar} label="Data" value="28 de Julho, 2024" />
                            <DetailRow icon={Clock} label="Horário" value="09:00 (4 horas)" />
                            <DetailRow icon={User} label="Profissional" value="Maria Aparecida" />
                            <Separator />
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>R$ 140,00</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Suas Informações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow icon={User} label="Nome" value="Cliente Exemplo" />
                            <DetailRow icon={Home} label="Endereço" value="Rua das Flores, 123 - Centro" />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Payment */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Pagamento</CardTitle>
                            <CardDescription>Escolha sua forma de pagamento preferida.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="card" id="r1" />
                                    <Label htmlFor="r1" className="flex items-center gap-2 cursor-pointer">
                                        <CreditCard className="h-5 w-5"/> Cartão de Crédito
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pix" id="r2" />
                                    <Label htmlFor="r2" className="flex items-center gap-2 cursor-pointer">
                                        <Landmark className="h-5 w-5" /> PIX
                                    </Label>
                                </div>
                            </RadioGroup>
                            
                            <Separator />
                            
                            {paymentMethod === 'card' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="expiry">Validade</Label>
                                            <Input id="expiry" placeholder="MM/AA" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cardName">Nome no Cartão</Label>
                                        <Input id="cardName" placeholder="Seu Nome Completo" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'pix' && (
                                <div className="space-y-4 text-center animate-in fade-in">
                                    <p className="text-sm text-muted-foreground">Aponte a câmera do seu celular para o QR Code ou copie o código para pagar.</p>
                                    <div className="flex justify-center">
                                    <img src="https://placehold.co/200x200.png?text=QR+Code" data-ai-hint="qr code" alt="QR Code para pagamento PIX" />
                                    </div>
                                    <Input readOnly value="00020126...pix-copia-e-cola...5303986" />
                                    <Button variant="outline" size="sm">Copiar Código PIX</Button>
                                </div>
                            )}

                            <Button onClick={handlePayment} size="lg" className="w-full">
                              Ir para o Pagamento Seguro
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </ScheduleLayout>
  );
}
