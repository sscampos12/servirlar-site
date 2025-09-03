
"use client";

import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";


export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const requestedRedirect = searchParams.get('redirect');

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando...",
      });
      router.push(requestedRedirect || '/dashboard');
    } catch (error: any) {
       toast({
            variant: "destructive",
            title: "Erro no Login",
            description: "Credenciais inválidas. Por favor, verifique seu e-mail e senha.",
        });
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <form onSubmit={handleLogin} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="seu@email.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
            <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                    Esqueceu sua senha?
                </Link>
            </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Entrar'}
        </Button>
      </form>
  )
}
