
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const redirectToPanel = async (userId: string) => {
      // Check for Professional
      const profDoc = await getDoc(doc(db, "professionals", userId));
      if (profDoc.exists()) {
          router.push(requestedRedirect || '/dashboard/services');
          return;
      }

      // Check for Client
      const clientDoc = await getDoc(doc(db, "clients", userId));
      if (clientDoc.exists()) {
           router.push(requestedRedirect || '/dashboard/clients');
           return;
      }
      
      // Fallback if user exists in Auth but not in DB collections (should not happen in normal flow)
      toast({
          variant: "destructive",
          title: "Erro de Perfil",
          description: "Não foi possível encontrar um perfil associado a esta conta.",
      });
      signOut(auth);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando...",
      });
      await redirectToPanel(userCredential.user.uid);
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user exists in Firestore, if not, create a new client document
        const clientDocRef = doc(db, "clients", user.uid);
        const professionalDocRef = doc(db, "professionals", user.uid);
        
        const clientDocSnap = await getDoc(clientDocRef);
        const professionalDocSnap = await getDoc(professionalDocRef);

        if (!clientDocSnap.exists() && !professionalDocSnap.exists()) {
            await setDoc(doc(db, "clients", user.uid), {
                uid: user.uid,
                fullName: user.displayName,
                email: user.email,
                address: "", // Google sign-in doesn't provide address
                createdAt: serverTimestamp(),
            });
             toast({
                title: "Conta Criada!",
                description: "Seu perfil de cliente foi criado com sucesso.",
            });
        } else {
             toast({
                title: "Login bem-sucedido!",
                description: "Redirecionando...",
            });
        }
        
        await redirectToPanel(user.uid);

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
            disabled={isGoogleLoading || isLoading}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="#"
              className="ml-auto inline-block text-sm underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isGoogleLoading || isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><GoogleIcon /> <span className="ml-2">Google</span></>}
      </Button>
      <div className="mt-4 text-center text-sm">
        Não tem uma conta?{" "}
        <Link href="/register/client" className="underline">
          Cadastre-se como Cliente
        </Link>
        {" ou "}
        <Link href="/register/provider" className="underline">
          Profissional
        </Link>
      </div>
    </div>
  )
}
