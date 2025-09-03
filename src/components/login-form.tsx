
"use client";

import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
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
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                />
            </div>
        </div>

        <div className="space-y-2">
            <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline">
                    Esqueceu sua senha?
                </Link>
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                />
            </div>
        </div>

        <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Entrar'}
            <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
  )
}
