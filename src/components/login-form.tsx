
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Loader2, User, Briefcase } from "lucide-react";


export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const requestedRedirect = searchParams.get('redirect');

  const [isLoading, setIsLoading] = useState(false);

  const redirectToPanel = async () => {
      // This logic should now be handled by the dashboard layout guard
      router.push(requestedRedirect || '/dashboard');
  }

  const handleDemoLogin = async (role: 'client' | 'professional') => {
    setIsLoading(true);

    const email = role === 'client' ? 'cliente@exemplo.com' : 'profissional@exemplo.com';
    const password = '123456';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando...",
      });
      await redirectToPanel();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            if (role === 'client') {
                 await setDoc(doc(db, "users", user.uid), { uid: user.uid, role: "client", name: "Cliente de Teste", email: user.email });
                 await setDoc(doc(db, "clients", user.uid), { fullName: "Cliente de Teste", email: user.email, address: "Endereço de Teste" });
            } else {
                 await setDoc(doc(db, "users", user.uid), { uid: user.uid, role: "professional", name: "Profissional de Teste", email: user.email });
                 await setDoc(doc(db, "professionals", user.uid), { fullName: "Profissional de Teste", email: user.email, status: "Aprovado", createdAt: new Date() });
            }

            toast({
                title: `Conta de Teste (${role}) Criada!`,
                description: "Redirecionando...",
            });
            await redirectToPanel();
        } catch (creationError: any) {
            toast({
                variant: "destructive",
                title: "Erro no Login",
                description: `Não foi possível criar uma conta de teste para ${role}.`,
          });
        }
      } else {
        toast({
            variant: "destructive",
            title: "Erro no Login",
            description: "Credenciais inválidas. Por favor, verifique seu e-mail e senha.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="grid gap-4">
       <Button onClick={() => handleDemoLogin('client')} className="w-full h-auto py-3 flex-col" disabled={isLoading}>
          <User />
          <span>Acessar como Cliente</span>
          <span className="text-xs font-normal text-primary-foreground/80">(Acesso de Demonstração)</span>
        </Button>
        <Button onClick={() => handleDemoLogin('professional')} variant="secondary" className="w-full h-auto py-3 flex-col" disabled={isLoading}>
          <Briefcase />
           <span>Acessar como Profissional</span>
           <span className="text-xs font-normal text-secondary-foreground/80">(Acesso de Demonstração)</span>
        </Button>

      <div className="mt-4 text-center text-sm">
        Não tem uma conta?{" "}
        <Link href="/register" className="underline">
          Cadastre-se
        </Link>
      </div>
    </div>
  )
}
