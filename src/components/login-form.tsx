
"use client";

import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";


export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const requestedRedirect = searchParams.get('redirect');

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      
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

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "E-mail necessário",
        description: "Por favor, insira seu e-mail no campo correspondente para redefinir a senha.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "E-mail de redefinição enviado",
        description: "Verifique sua caixa de entrada para o link de redefinição de senha.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: "Não foi possível enviar o e-mail de redefinição. Verifique o e-mail digitado.",
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
                <button type="button" onClick={handlePasswordReset} className="ml-auto inline-block text-sm text-primary hover:underline">
                    Esqueceu sua senha?
                </button>
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

        <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
            <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Lembrar de mim
            </Label>
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
