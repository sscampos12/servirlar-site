
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ClientContract } from '@/components/contracts/client-contract';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.522 5.029A20.003 20.003 0 0 0 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083L43.595 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C44.434 36.338 48 30.751 48 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);


export function ClientRegistrationForm() {
  const [agreedToContract, setAgreedToContract] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToContract) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite os Termos de Serviço para continuar.",
      });
      return;
    }
    if (password !== confirmPassword) {
        toast({
            variant: "destructive",
            title: "Erro de Validação",
            description: "As senhas não coincidem.",
        });
        return;
    }
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }


    setIsLoading(true);

    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save additional user info to Firestore
        await setDoc(doc(db, "clients", user.uid), {
            fullName: fullName,
            email: user.email,
            address: address,
        });

        toast({
            title: "Cadastro Realizado!",
            description: "Sua conta foi criada com sucesso. Faça o login para começar.",
        });
        router.push('/login');

    } catch (error: any) {
        let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Este email já está em uso. Tente fazer login ou use outro email.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email inválido. Por favor, verifique o formato do email.";
            break;
          case 'auth/weak-password':
            errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
            break;
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const docRef = doc(db, "clients", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(doc(db, "clients", user.uid), {
                fullName: user.displayName,
                email: user.email,
                address: "",
            });
        }
        
        toast({
            title: "Login bem-sucedido!",
            description: "Sua conta foi acessada com sucesso. Redirecionando...",
        });
        router.push('/dashboard/clients');

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
    <div className="space-y-6">
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
        {isGoogleLoading ? "Aguarde..." : <><GoogleIcon /> <span className="ml-2">Cadastrar-se com Google</span></>}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou com seu e-mail
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input id="fullName" name="fullName" placeholder="Seu nome" required value={fullName} onChange={e => setFullName(e.target.value)} disabled={isGoogleLoading} />
          </div>
              <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isGoogleLoading} />
          </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="address">Endereço Principal</Label>
              <Input id="address" name="address" placeholder="Rua, Número, Bairro" required value={address} onChange={e => setAddress(e.target.value)} disabled={isGoogleLoading} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isGoogleLoading} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isGoogleLoading} />
          </div>
          </div>
          
          <div className="space-y-4 pt-4">
          <h3 className="font-headline text-xl font-semibold text-center">Termos do Serviço</h3>
          <div className="h-48 overflow-y-scroll bg-muted/50 p-4 rounded-md border">
              <ClientContract />
          </div>
          <div className="flex items-center space-x-2">
              <Checkbox id="agreeContract" checked={agreedToContract} onCheckedChange={(checked) => setAgreedToContract(!!checked)} />
              <Label htmlFor="agreeContract" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Li e concordo com os Termos do Serviço.
              </Label>
          </div>
          </div>

          <div className="text-center pt-4">
          <Button type="submit" size="lg" disabled={!agreedToContract || isLoading || isGoogleLoading}>
              {isLoading ? "Criando Conta..." : "Criar Conta"}
          </Button>
          </div>
      </form>
    </div>
  );
}
