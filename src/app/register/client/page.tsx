"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MarketingLayout } from '@/components/marketing-layout';
import { ClientContract } from '@/components/contracts/client-contract';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ClientRegistrationPage() {
  const [agreedToContract, setAgreedToContract] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToContract) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite os Termos de Serviço para continuar.",
      });
      return;
    }
    toast({
      title: "Cadastro Realizado!",
      description: "Sua conta foi criada com sucesso. Faça o login para começar.",
    });
    // Redirect to login or dashboard
  };

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Crie sua Conta</CardTitle>
            <CardDescription>
              Cadastre-se para encontrar os melhores profissionais para o seu lar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input id="fullName" placeholder="Seu nome" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="address">Endereço Principal</Label>
                  <Input id="address" placeholder="Rua, Número, Bairro" required />
                </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input id="confirmPassword" type="password" required />
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
                <Button type="submit" size="lg" disabled={!agreedToContract} asChild>
                    <Link href="/login">Criar Conta</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
