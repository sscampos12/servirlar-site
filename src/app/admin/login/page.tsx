
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingLayout } from "@/components/marketing-layout";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";

const ADMIN_EMAIL = "contato@ajudaemcasa.com";
const ADMIN_PASS = "Admin123!";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email !== ADMIN_EMAIL) {
        toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Este e-mail não pertence a um administrador.",
        });
        setIsLoading(false);
        return;
    }
    
    try {
      // Try to sign in first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user.email === ADMIN_EMAIL) {
        localStorage.setItem("isAdmin", "true");
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para o painel de controle.",
        });
        router.push("/dashboard/providers");
      } else {
        throw new Error("Credenciais de administrador inválidas.");
      }
    } catch (error: any) {
      // If user not found, create the admin user
      if (error.code === 'auth/user-not-found' && password === ADMIN_PASS) {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = newUserCredential.user;

          // Set the role in Firestore
          await setDoc(doc(db, "users", user.uid), {
            role: "admin",
            name: "Administrador",
            email: user.email,
          });

          localStorage.setItem("isAdmin", "true");
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
      } else {
          let errorMessage = "Credenciais inválidas. Por favor, verifique seu e-mail e senha.";
          if(error.code === 'auth/wrong-password') {
              errorMessage = `Senha incorreta. A senha padrão é: ${ADMIN_PASS}`;
          }
          toast({
            variant: "destructive",
            title: "Erro no Login",
            description: errorMessage,
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
              Faça login como administrador para gerenciar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@ajudaemcasa.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="A senha padrão é Admin123!"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Entrar como Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
