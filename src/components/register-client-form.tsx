
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsAndPrivacy } from '@/components/contracts/terms-and-privacy'; // MUDANÇA: Importa o novo componente
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export function ClientRegistrationForm() {
  const [agreedToContract, setAgreedToContract] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToContract) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite os Termos de Uso e a Política de Privacidade para continuar.", // MUDANÇA: Texto do erro
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
            phone: phone,
            address: address,
        });

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            role: "client",
            name: fullName,
            email: user.email,
        });


        toast({
            title: "Cadastro Realizado!",
            description: "Sua conta foi criada com sucesso. Redirecionando...",
        });
        
        // Sign in the user automatically and redirect
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard/my-account');

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

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Crie sua conta com e-mail e senha
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input id="fullName" name="fullName" placeholder="Seu nome" required value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" placeholder="(00) 00000-0000" required value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="address">Endereço Principal</Label>
              <Input id="address" name="address" placeholder="Rua, Número, Bairro, Cidade, Estado" required value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="font-headline text-xl font-semibold text-center">Termos e Políticas</h3>
            <div className="h-48 overflow-y-scroll bg-muted/50 p-4 rounded-md border">
                <TermsAndPrivacy /> 
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="agreeContract" checked={agreedToContract} onCheckedChange={(checked) => setAgreedToContract(!!checked)} />
                <Label htmlFor="agreeContract" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Li e concordo com os Termos de Uso e a Política de Privacidade.
                </Label>
            </div>
          </div>

          <div className="text-center pt-4">
          <Button type="submit" size="lg" disabled={!agreedToContract || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Criar Conta"}
          </Button>
          </div>
      </form>
    </div>
  );
}
