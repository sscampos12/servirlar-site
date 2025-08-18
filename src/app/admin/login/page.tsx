
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingLayout } from "@/components/marketing-layout";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email !== "contato@ajudaemcasa.com") {
        toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Este e-mail não pertence a um administrador.",
        });
        setIsLoading(false);
        return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Additional check to ensure it's the admin user.
      if (userCredential.user.email === "contato@ajudaemcasa.com") {
        localStorage.setItem("isAdmin", "true"); // Still needed for the initial role check in layout
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para o painel de controle.",
        });
        router.push("/dashboard/providers"); // Redirect directly to the admin's main page
      } else {
        // This case should theoretically not be hit if the email check above is done
        throw new Error("Credenciais de administrador inválidas.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Credenciais Inválidas",
        description: "Por favor, verifique seu e-mail e senha.",
      });
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
