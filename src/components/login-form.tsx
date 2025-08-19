
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, User, Briefcase } from "lucide-react";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.522 5.029A20.003 20.003 0 0 0 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083L43.595 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C44.434 36.338 48 30.751 48 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);


export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const requestedRedirect = searchParams.get('redirect');

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
             // Defaulting new Google sign-ins to client role
             await setDoc(userDocRef, { uid: user.uid, role: "client", name: user.displayName, email: user.email });
             await setDoc(doc(db, "clients", user.uid), { fullName: user.displayName, email: user.email, address: "" });
             toast({ title: "Conta Criada!", description: "Seu perfil de cliente foi criado com sucesso." });
        } else {
             toast({ title: "Login bem-sucedido!", description: "Redirecionando..." });
        }
        
        await redirectToPanel();

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro com o Login Google",
            description: "Não foi possível fazer login com o Google. Tente novamente.",
        });
        console.error(error);
    } finally {
        setIsGoogleLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
       <Button onClick={() => handleDemoLogin('client')} className="w-full h-auto py-3 flex-col" disabled={isLoading || isGoogleLoading}>
          <User />
          <span>Acessar como Cliente</span>
          <span className="text-xs font-normal text-primary-foreground/80">(Acesso de Demonstração)</span>
        </Button>
        <Button onClick={() => handleDemoLogin('professional')} variant="secondary" className="w-full h-auto py-3 flex-col" disabled={isLoading || isGoogleLoading}>
          <Briefcase />
           <span>Acessar como Profissional</span>
           <span className="text-xs font-normal text-secondary-foreground/80">(Acesso de Demonstração)</span>
        </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou com sua conta
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><GoogleIcon /> <span className="ml-2">Google</span></>}
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
