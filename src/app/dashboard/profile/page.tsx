
"use client";

import withAuth from "@/components/auth/with-auth";
import React, { useState, useEffect } from 'react';
import { 
  User,
  Mail,
  Phone,
  Edit,
  BadgeCheck,
  BadgeAlert,
  BadgeX,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProfessionalProfile {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthdate: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Incompleto';
    addressInfo: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || 'Não informado'}</p>
        </div>
    </div>
);


const StatusAlert = ({ status }: { status: ProfessionalProfile['status'] }) => {
    const statusConfig = {
        Pendente: {
            icon: BadgeAlert,
            title: "Perfil em Análise",
            description: "Seus dados foram enviados e estão sendo analisados pela nossa equipe. Entraremos em contato em breve.",
            variant: "default",
            className: "bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-500"
        },
         Aprovado: {
            icon: BadgeCheck,
            title: "Perfil Aprovado!",
            description: "Parabéns! Seu perfil foi aprovado. Agora você já pode visualizar e aceitar serviços disponíveis.",
            variant: "default",
            className: "bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-500"
        },
        Rejeitado: {
            icon: BadgeX,
            title: "Perfil Rejeitado",
            description: "Infelizmente, seu perfil não foi aprovado no momento. Verifique seus dados ou entre em contato com o suporte para mais detalhes.",
            variant: "destructive",
        },
        Incompleto: {
             icon: BadgeAlert,
            title: "Perfil Incompleto",
            description: "Você precisa completar seu cadastro para poder ser analisado e aprovado na plataforma.",
            variant: "destructive",
        }
    };

    const config = statusConfig[status];

    if (!config) return null;

    return (
        <Alert className={config.className} variant={config.variant as any}>
            <config.icon className="h-4 w-4" />
            <AlertTitle className="font-headline">{config.title}</AlertTitle>
            <AlertDescription>
                {config.description}
            </AlertDescription>
        </Alert>
    );
}

function ProfessionalProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            const docRef = doc(db, "professionals", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfile(docSnap.data() as ProfessionalProfile);
            } else {
                console.log("No such document!");
                // Maybe handle this case, e.g., redirect or show an error
            }
            setIsLoading(false);
        };

        fetchProfile();

    }, [user, authLoading, router]);

    if (isLoading || authLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        )
    }

    if (!profile) {
         return (
            <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>Não foi possível carregar seu perfil. Por favor, tente novamente.</AlertDescription>
            </Alert>
        )
    }

    if (profile.status === 'Incompleto') {
        return (
            <>
                <StatusAlert status={profile.status} />
                <div className="text-center mt-6">
                <Button onClick={() => router.push('/dashboard/providers/profile')}>
                    Completar meu Cadastro
                </Button>
                </div>
            </>
        )
    }


    return (
        <div className="space-y-6">
            <StatusAlert status={profile.status} />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Minhas Informações</CardTitle>
                        <CardDescription>Estes são os seus dados cadastrados na plataforma.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Em breve!", description: "A edição de perfil estará disponível em breve."})}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Perfil
                    </Button>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                            <DetailItem icon={User} label="Nome Completo" value={profile.fullName} />
                            <DetailItem icon={Mail} label="Email" value={profile.email} />
                            <DetailItem icon={Phone} label="Telefone" value={profile.phone} />
                            <DetailItem icon={User} label="CPF" value={profile.cpf} />
                    </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Endereço</h3>
                            <DetailItem icon={User} label="Endereço" value={profile.addressInfo?.street} />
                            <DetailItem icon={Mail} label="Cidade" value={profile.addressInfo?.city} />
                            <DetailItem icon={Phone} label="Estado" value={profile.addressInfo?.state} />
                            <DetailItem icon={User} label="CEP" value={profile.addressInfo?.zip} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Dummy toast for now
const toast = ({title, description}: {title: string, description: string}) => {
    alert(`${title}\n${description}`);
}

export default withAuth(ProfessionalProfilePage, ['professional']);
