
"use client"

import { useState, useEffect, Suspense } from 'react';
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
  FileText,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { ScheduleLayout } from '@/app/schedule/layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, DocumentData, updateDoc } from 'firebase/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientContract } from '@/components/contracts/client-contract';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-medium">{value}</span>
    </div>
);


function ConfirmationContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreedToServiceTerms, setAgreedToServiceTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [pixCopiaECola, setPixCopiaECola] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<DocumentData | null>(null);
  const orderId = searchParams.get('orderId');

  // Estados do formulário de cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

   useEffect(() => {
    const fetchSchedule = async () => {
      if (user && orderId) {
        setIsLoading(true);
        try {
          const docRef = doc(db, "schedules", orderId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
             const scheduleData = docSnap.data();
             // Security check: ensure the user owns this schedule
             if (scheduleData.clientId === user.uid) {
                setOrderDetails(scheduleData);
             } else {
                 setError("Você não tem permissão para visualizar este agendamento.");
             }
          } else {
             setError("Agendamento não encontrado.");
          }
        } catch (e) {
          setError("Erro ao buscar detalhes do agendamento.");
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      } else if (!orderId) {
        setError("Nenhum pedido especificado.");
        setIsLoading(false);
      }
    };

    if (user) {
        fetchSchedule();
    } else {
        router.push(`/login?redirect=/schedule/confirm${orderId ? `?orderId=${orderId}` : ''}`);
    }
  }, [user, orderId, router]);

  const handlePayment = async () => {
    if (!agreedToServiceTerms) {
        toast({
            variant: "destructive",
            title: "Termos não aceitos",
            description: "Você precisa aceitar os Termos do Serviço para continuar."
        });
        return;
    }
    if (!orderDetails || !orderId) {
        toast({ variant: "destructive", title: "Erro", description: "Detalhes do pedido não encontrados." });
        return;
    }

    setIsLoading(true);
    setError(null);
    setQrCodeImage(null);

    const updatePaymentStatus = async (paymentId: string, paymentMethod: string) => {
        const scheduleRef = doc(db, "schedules", orderId);
        await updateDoc(scheduleRef, {
            paymentStatus: "Pago",
            paymentId: paymentId,
            paymentMethod: paymentMethod,
        });
    }

    try {
        if (paymentMethod === 'pix') {
            const response = await fetch('/api/pix/gerar-cobranca', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    valor: orderDetails.value,
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
            setPixCopiaECola(data.txid);
            // In a real app, we would listen for a webhook to confirm payment.
            // For this demo, we'll just assume payment and update status.
            await updatePaymentStatus(data.txid, 'pix');

        } else if (paymentMethod === 'card') {
            const response = await fetch('/api/cartao-credito/gerar-cobranca', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    valor: orderDetails.value,
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

            await updatePaymentStatus(data.data.charge_id, 'credit_card');

            toast({
                title: "Pagamento Aprovado!",
                description: "Seu agendamento foi confirmado com sucesso.",
            });
            router.push('/dashboard/my-account');
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
  
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }

    if (error || !orderDetails) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error || "Não foi possível carregar os detalhes do seu agendamento."}</AlertDescription>
            </Alert>
        )
    }


  return (
      <Dialog>
        <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-2xl font-semibold mb-6 text-center">Finalizar Agendamento</h1>
            <div className="grid gap-8 md:grid-cols-2">
                
                {/* Left Side: Order Summary & Contract */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow icon={Home} label="Serviço" value={orderDetails.service} />
                            <DetailRow icon={Calendar} label="Data" value={new Date(orderDetails.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
                            <DetailRow icon={Clock} label="Horário" value={`${orderDetails.time} (${orderDetails.duration})`} />
                            <DetailRow icon={User} label="Profissional" value={orderDetails.professionalName || "Aguardando"} />
                            <Separator />
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>R$ {orderDetails.value.toFixed(2).replace('.',',')}</span>
                            </div>
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
                            <Alert className="border-primary bg-primary/5">
                                <ShieldCheck className="h-4 w-4" />
                                <AlertTitle className="font-headline text-primary">Ambiente Seguro</AlertTitle>
                                <AlertDescription>
                                    Seus dados de pagamento são criptografados e processados com segurança.
                                </AlertDescription>
                            </Alert>

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
                            
                             <div className="flex items-start space-x-2 pt-4">
                                <Checkbox id="agreeServiceTerms" checked={agreedToServiceTerms} onCheckedChange={(checked) => setAgreedToServiceTerms(!!checked)} className="mt-1" />
                                <Label htmlFor="agreeServiceTerms" className="text-sm font-normal leading-relaxed">
                                   Eu li e concordo com os 
                                    <DialogTrigger asChild>
                                       <Button variant="link" className="p-1 h-auto -translate-y-1">Termos do Serviço deste Agendamento.</Button>
                                    </DialogTrigger>
                                </Label>
                            </div>


                            {qrCodeImage ? (
                                <div className="space-y-4 text-center animate-in fade-in">
                                    <p className="text-sm text-muted-foreground">Aponte a câmera do seu celular para o QR Code ou copie o código para pagar.</p>
                                    <div className="flex justify-center">
                                      <img src={qrCodeImage} alt="QR Code para pagamento PIX" />
                                    </div>
                                    <Input readOnly value={pixCopiaECola || ''} />
                                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(pixCopiaECola || '')}>Copiar Código PIX</Button>
                                    <p className="text-xs text-muted-foreground pt-4">Após o pagamento, seu serviço será confirmado. Você pode acompanhar na sua área de cliente.</p>
                                    <Button onClick={() => router.push('/dashboard/my-account')}>Ir para Meus Agendamentos</Button>
                                </div>
                            ) : (
                                <Button onClick={handlePayment} size="lg" className="w-full" disabled={isLoading || !agreedToServiceTerms}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Pagar Agora'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl"><FileText /> Termos do Serviço</DialogTitle>
            <DialogDescription>
                Estes termos regem especificamente este agendamento de serviço.
            </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-6">
             <ClientContract />
            </div>
        </DialogContent>
      </Dialog>
  );
}


export default function ConfirmationPage() {
    return (
        <ScheduleLayout>
            <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
                <ConfirmationContent />
            </Suspense>
        </ScheduleLayout>
    )
}
