
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingLayout } from '@/components/marketing-layout';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProviderInitialRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const fullName = formData.get('fullName') as string;

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "As senhas não coincidem.",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create an initial professional document in Firestore
      await setDoc(doc(db, "professionals", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        status: 'Incompleto', // New status for incomplete profiles
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Conta Criada!",
        description: "Agora complete seu perfil para começar a receber propostas.",
      });

      // Redirect to the profile completion page
      router.push('/dashboard/providers/profile');

    } catch (error: any) {
      console.error("Error creating professional account: ", error);
      let errorMessage: React.ReactNode = "Ocorreu um erro ao criar sua conta.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = (
          <span>
            Este e-mail já está em uso. Tente{' '}
            <Link href="/login" className="font-bold underline">
              fazer login
            </Link>
            .
          </span>
        );
      }
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Cadastro de Profissional</CardTitle>
            <CardDescription>
              Junte-se à nossa plataforma. Crie sua conta para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input id="fullName" name="fullName" placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
              </div>
              
              <div className="text-center pt-4">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Conta e Continuar'}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline">
                  Faça Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
