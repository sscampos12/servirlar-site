
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  Calendar,
  Star,
  Activity,
  ArrowUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Role } from "./layout";

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

const mockRecentAppointments = [
    // Array is empty as per the image
];

const mockActivityFeed = [
    { text: "Novo cadastro de profissional", detail: "Maria da Silva se cadastrou.", time: "1h atrás" },
    { text: "Novo agendamento", detail: "João P. agendou uma faxina.", time: "3h atrás" },
]

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [role, setRole] = useState<Role | null>(null);
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userRole = userDocSnap.data().role as Role;
                    setRole(userRole);
                    if (userRole === 'client') {
                        router.replace('/dashboard/my-account');
                    } else {
                        setIsCheckingRole(false);
                    }
                } else {
                    // Default to client if no specific role doc is found but they are in 'clients'
                     const clientDocRef = doc(db, "clients", user.uid);
                     const clientDocSnap = await getDoc(clientDocRef);
                     if (clientDocSnap.exists()) {
                         setRole('client');
                         router.replace('/dashboard/my-account');
                     } else {
                        // Fallback for professional or other roles
                        setIsCheckingRole(false);
                     }
                }
            } else {
                setIsCheckingRole(false); // No user, stop checking
            }
        };

        if (!loading) {
            fetchUserRole();
        }
    }, [user, loading, router]);

    if (loading || isCheckingRole) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Only admins or other roles will see this page. Clients are redirected.
    if (role === 'client') {
        // This is a fallback while redirecting
        return null; 
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold md:text-3xl">
          Painel de Controle
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receita Mensal"
          value="R$ 4.523,18"
          change="+20.1% do mês passado"
          icon={DollarSign}
        />
        <StatCard
          title="Clientes Ativos"
          value="+235"
          change="+180.1% do mês passado"
          icon={Users}
        />
        <StatCard
          title="Agendamentos"
          value="+123"
          change="+19% do mês passado"
          icon={Calendar}
        />
        <StatCard
          title="Avaliação Média"
          value="4.9"
          change="Média de todas as avaliações"
          icon={Star}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Agendamentos Recentes</CardTitle>
            <CardDescription>
              Visualize e gerencie os próximos serviços.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockRecentAppointments.length > 0 ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Profissional</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Map over appointments here */}
                    </TableBody>
                </Table>
            ) : (
                <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                    <p className="text-muted-foreground">Nenhum agendamento recente para exibir.</p>
                </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Atividade</CardTitle>
            <CardDescription>
              Resumo das atividades da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockActivityFeed.map((item, index) => (
                 <div key={index} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                 </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
