

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
  ShieldCheck,
  Loader2,
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [pixCopiaECola, setPixCopiaECola] = useState<string | null>(null);

  // Exemplo de dados do agendamento (em um app real, viria do estado global ou props)
  const orderDetails = {
    service: "Faxina Padrão",
    date: "28 de Julho, 2024",
    time: "09:00 (4 horas)",
    professional: "Maria Aparecida",
    total: 140.00,
    clientName: "Cliente Exemplo",
    address: "Rua das Flores, 123 - Centro",
    clientCpf: "123.456.789-00", // CPF para o PIX
    clientEmail: "cliente@exemplo.com", // Email para o Cartão
    clientPhone: "11999998888", // Telefone para o Cartão
  };

  // Estados do formulário de cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setQrCodeImage(null);

    try {
        if (paymentMethod === 'pix') {
            const response = await fetch('/api/pix/gerar-cobranca', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    valor: orderDetails.total,
                    cpf: orderDetails.clientCpf,
                    nome: orderDetails.clientName,
                    descricao: `Serviço: ${orderDetails.service}`,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao gerar cobrança PIX.');
            }
            setQrCodeImage(data.qrcode);
            setPixCopiaECola(data.txid); // Supondo que txid seja o código
        } else if (paymentMethod === 'card') {
            const response = await fetch('/api/cartao-credito/gerar-cobranca', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    valor: orderDetails.total,
                    cpf: orderDetails.clientCpf,
                    nome: cardName,
                    email: orderDetails.clientEmail,
                    telefone: orderDetails.clientPhone,
                    numeroCartao: cardNumber,
                    bandeira: 'visa', // TODO: Detectar bandeira dinamicamente
                    validade: cardExpiry,
                    cvv: cardCvc,
                    descricao: `Serviço: ${orderDetails.service}`,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                 throw new Error(data.details?.end_to_end_id?.[0] || data.error || 'Falha ao processar pagamento com cartão.');
            }
            toast({
                title: "Pagamento Aprovado!",
                description: "Seu agendamento foi confirmado com sucesso.",
            });
            router.push('/dashboard/clients');
        }
    } catch (err: any) {
        setError(err.message);
        toast({
            variant: "destructive",
            title: "Erro no Pagamento",
            description: err.message,
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <ScheduleLayout>
        <div className="max-w-4xl mx-auto">
            <Alert className="mb-6 border-primary bg-primary/5">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle className="font-headline text-primary">Ambiente Seguro</AlertTitle>
              <AlertDescription>
                Seus dados de pagamento são criptografados e processados com segurança.
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
                            <DetailRow icon={Home} label="Serviço" value={orderDetails.service} />
                            <DetailRow icon={Calendar} label="Data" value={orderDetails.date} />
                            <DetailRow icon={Clock} label="Horário" value={orderDetails.time} />
                            <DetailRow icon={User} label="Profissional" value={orderDetails.professional} />
                            <Separator />
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>R$ {orderDetails.total.toFixed(2).replace('.',',')}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Suas Informações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow icon={User} label="Nome" value={orderDetails.clientName} />
                            <DetailRow icon={Home} label="Endereço" value={orderDetails.address} />
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
                             {!qrCodeImage && (
                                <>
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
                                </>
                             )}
                            
                            {paymentMethod === 'card' && !qrCodeImage && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="expiry">Validade</Label>
                                            <Input id="expiry" placeholder="MM/AA" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" value={cardCvc} onChange={e => setCardCvc(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cardName">Nome no Cartão</Label>
                                        <Input id="cardName" placeholder="Seu Nome Completo" value={cardName} onChange={e => setCardName(e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {qrCodeImage ? (
                                <div className="space-y-4 text-center animate-in fade-in">
                                    <p className="text-sm text-muted-foreground">Aponte a câmera do seu celular para o QR Code ou copie o código para pagar.</p>
                                    <div className="flex justify-center">
                                      <img src={qrCodeImage} alt="QR Code para pagamento PIX" />
                                    </div>
                                    <Input readOnly value={pixCopiaECola || ''} />
                                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(pixCopiaECola || '')}>Copiar Código PIX</Button>
                                    <p className="text-xs text-muted-foreground pt-4">Após o pagamento, esta página será atualizada automaticamente.</p>
                                </div>
                            ) : (
                                <Button onClick={handlePayment} size="lg" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Pagar Agora'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </ScheduleLayout>
  );
}
