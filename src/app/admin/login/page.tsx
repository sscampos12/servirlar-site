
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingLayout } from "@/components/marketing-layout";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";

const ADMIN_EMAIL = "contato@ajudaemcasa.com";
const ADMIN_PASS = "Admin123!";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminAccess = async () => {
    setIsLoading(true);
    
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o painel de controle.",
      });
      router.push("/dashboard/providers");
    } catch (error: any) {
      // If user not found, create the admin user
      if (error.code === 'auth/user-not-found') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
          const user = newUserCredential.user;

          // Set the role in Firestore
          await setDoc(doc(db, "users", user.uid), {
            role: "admin",
            name: "Administrador",
            email: user.email,
          });

          toast({
            title: "Conta de Administrador Criada!",
            description: "Redirecionando para o painel de controle.",
          });
          router.push("/dashboard/providers");

        } catch (creationError: any) {
           toast({
            variant: "destructive",
            title: "Erro ao Criar Admin",
            description: creationError.message,
          });
        }
      } else if (error.code === 'auth/wrong-password') {
          toast({
            variant: "destructive",
            title: "Erro no Login",
            description: `Senha incorreta. A senha padrão é: ${ADMIN_PASS}`,
          });
      } else {
          toast({
            variant: "destructive",
            title: "Erro no Login",
            description: error.message,
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
            <CardDescription>
              Clique no botão abaixo para acessar o painel de administração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button onClick={handleAdminAccess} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Entrar como Admin"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
