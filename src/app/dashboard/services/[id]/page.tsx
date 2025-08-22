
"use client";

import withAuth from "@/components/auth/with-auth";
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Loader2, Info, MapPin, Clock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getFunctions, httpsCallable } from "firebase/functions";
import { loadStripe } from "@stripe/stripe-js";
import { Separator } from "@/components/ui/separator";

// --- Configurações Iniciais ---
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (!STRIPE_PUBLIC_KEY) {
    console.error("Chave pública do Stripe não configurada em .env.local");
}
const stripePromise = STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : Promise.resolve(null);
const functions = getFunctions();

const InfoRow = ({ icon: Icon, label, value, blurred = false }: { icon: React.ElementType, label: string, value: string | React.ReactNode, blurred?: boolean }) => (
    <div className={`flex items-start gap-3 transition-all duration-300 ${blurred ? 'blur-sm' : ''}`}>
        <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    </div>
);

function ServiceDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const { id: serviceId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [service, setService] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);

    // Checa por parâmetros de sucesso/cancelamento do Stripe na URL
    useEffect(() => {
        const paymentStatus = searchParams.get('pagamento');
        if (paymentStatus === 'sucesso') {
            toast({
                title: 'Pagamento Realizado com Sucesso!',
                description: 'As informações do serviço foram liberadas.',
                className: "bg-green-100 border-green-500 text-green-700",
            });
            // O onSnapshot vai atualizar a UI, mas podemos forçar um estado visual aqui se quisermos
            setHasPaid(true);
        }
        if (paymentStatus === 'cancelado') {
             toast({
                variant: 'destructive',
                title: 'Pagamento Cancelado',
                description: 'Você pode tentar novamente a qualquer momento.',
            });
        }
    }, [searchParams, toast]);


    useEffect(() => {
        if (!serviceId || !user) {
            setIsLoading(false);
            return;
        };

        const serviceRef = doc(db, "schedules", serviceId as string);
        const unsubscribe = onSnapshot(serviceRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const serviceData = docSnapshot.data();
                setService(serviceData);

                // Verifica o status do pagamento
                const statusPagamento = serviceData.taxa?.statusPagamento;
                const profissionalResponsavel = serviceData.taxa?.profissionalId;
                if (statusPagamento === "PAGO" && profissionalResponsavel === user.uid) {
                    setHasPaid(true);
                } else {
                    setHasPaid(false);
                }

            } else {
                toast({ variant: 'destructive', title: 'Erro', description: 'Serviço não encontrado.' });
                router.push('/dashboard/services');
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao monitorar serviço:", error);
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os detalhes do serviço.' });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [serviceId, user, router, toast]);

    const handlePagarTaxa = async () => {
        if (!auth.currentUser || !serviceId) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário ou serviço inválido.' });
            return;
        }
        if (!stripePromise) {
            toast({ variant: 'destructive', title: 'Erro de Configuração', description: 'A chave do Stripe não está configurada.' });
            return;
        }

        setIsProcessingPayment(true);
        try {
            const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
            const response = await createStripeCheckout({ servicoId });
            
            const { id: sessionId } = response.data as { id: string };

            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe.js não carregou.");
            
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error("Erro ao redirecionar para o Stripe:", error);
                toast({ variant: 'destructive', title: 'Erro no Pagamento', description: 'Não foi possível iniciar o pagamento. Tente novamente.' });
            }
        } catch (error) {
            console.error("Erro ao chamar a Cloud Function:", error);
            toast({ variant: 'destructive', title: 'Erro no Processo', description: 'Ocorreu um erro ao processar o pagamento. Tente novamente mais tarde.' });
        } finally {
            setIsProcessingPayment(false);
        }
    };


    if (isLoading || authLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        )
    }

    if (!service) {
         return (
            <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-medium">Serviço não encontrado</h2>
                <p className="text-muted-foreground">O serviço que você está procurando não existe ou foi removido.</p>
                 <Button onClick={() => router.push('/dashboard/services')} className="mt-4">Voltar aos Serviços</Button>
            </div>
        )
    }

  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                     <div>
                        <CardTitle className="font-headline text-2xl">{service.service}</CardTitle>
                        <CardDescription>Data: {new Date(service.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</CardDescription>
                     </div>
                     {hasPaid ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Pago</span>
                        </div>
                     ) : (
                         <div className="flex items-center gap-2 text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Taxa Pendente</span>
                        </div>
                     )}
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="font-semibold font-headline">Detalhes do Serviço</h3>
                    <InfoRow icon={MapPin} label="Localização" value={`${service.address.split(',').slice(-2).join(', ')}`} />
                    <InfoRow icon={Clock} label="Horário e Duração" value={`${service.time} (${service.duration})`} />
                    {service.observations && <InfoRow icon={Info} label="Observações do Cliente" value={<span className="italic">"{service.observations}"</span>} />}
                    <div className="border-t pt-4">
                         <InfoRow icon={User} label="Nome do Cliente" value={hasPaid ? service.clientName : 'Informação Bloqueada'} blurred={!hasPaid} />
                    </div>
                    <InfoRow icon={Phone} label="Telefone do Cliente" value={hasPaid ? service.clientPhone : 'Informação Bloqueada'} blurred={!hasPaid} />
                    <InfoRow icon={MapPin} label="Endereço Completo" value={hasPaid ? service.address : 'Informação Bloqueada'} blurred={!hasPaid} />
                </div>
                 <div className="bg-muted/50 p-6 rounded-lg flex flex-col justify-center items-center text-center">
                    <h3 className="font-headline text-lg font-semibold">Valor do Serviço</h3>
                    <p className="text-4xl font-bold text-primary my-2">
                        R$ {service.value.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">Este é o valor total que o cliente pagará pelo serviço.</p>

                    <Separator className="my-4" />
                    
                    <h3 className="font-headline text-lg font-semibold">Taxa de Acesso</h3>
                     <p className="text-2xl font-bold text-secondary my-1">
                        R$ 10,00
                    </p>
                    <p className="text-muted-foreground text-xs mb-4">Pagamento único para desbloquear os detalhes de contato.</p>

                    {!hasPaid && (
                        <Button className="w-full" onClick={handlePagarTaxa} disabled={isProcessingPayment}>
                            {isProcessingPayment ? <Loader2 className="animate-spin mr-2" /> : null}
                            {isProcessingPayment ? 'Processando...' : 'Pagar Taxa e Ver Detalhes'}
                        </Button>
                    )}
                     {hasPaid && (
                        <div className="w-full text-center mt-4">
                            <p className="text-green-700 font-medium">Taxa paga! Entre em contato com o cliente para combinar os detalhes.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default withAuth(ServiceDetailPage, ['professional']);
