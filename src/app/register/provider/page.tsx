"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MarketingLayout } from '@/components/marketing-layout';
import { ProviderContract } from '@/components/contracts/provider-contract';
import { FileSignature, CheckCircle2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProviderRegistrationPage() {
  const [agreedToContract, setAgreedToContract] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToContract) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite o Contrato de Prestação de Serviços para continuar.",
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Cadastro Enviado!",
      description: "Seu cadastro foi enviado para análise. Aguarde a aprovação.",
    });
    // Here you would typically send data to a server
  };

  const FileUploadField = ({ id, label }: { id: string, label: string }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={id} type="file" required className="cursor-pointer" />
      </div>
    </div>
  );

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Cadastro de Profissional</CardTitle>
            <CardDescription>
              Junte-se à nossa plataforma e conecte-se a novos clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="font-headline text-2xl font-semibold">Cadastro enviado com sucesso!</h3>
                <p className="text-muted-foreground mt-2">
                  Entraremos em contato em breve após a análise dos seus dados.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input id="fullName" placeholder="Seu nome" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" required />
                  </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="birthdate">Data de Nascimento</Label>
                        <Input id="birthdate" type="date" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" type="tel" placeholder="(00) 90000-0000" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
                
                <div className="space-y-2">
                    <h4 className="font-medium">Referências Bancárias</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input id="bankRef1" placeholder="Referência Bancária 1" required />
                        <Input id="bankRef2" placeholder="Referência Bancária 2" required />
                        <Input id="bankRef3" placeholder="Referência Bancária 3" required />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="font-headline text-xl font-semibold text-center">Documentação</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FileUploadField id="docCriminal" label="Antecedentes Criminais" />
                        <FileUploadField id="docRG" label="Foto do RG" />
                        <FileUploadField id="docResidence" label="Comprovante de Residência" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="references">Referências Profissionais (opcional)</Label>
                    <Input id="references" placeholder="Contato de referências" />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="video">Vídeo de Apresentação (URL, opcional)</Label>
                  <Input id="video" placeholder="https://youtube.com/seu-video" />
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="font-headline text-xl font-semibold text-center">Contrato de Prestação de Serviços</h3>
                  <div className="h-64 overflow-y-scroll bg-muted/50 p-4 rounded-md border">
                    <ProviderContract />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="agreeContract" checked={agreedToContract} onCheckedChange={(checked) => setAgreedToContract(!!checked)} />
                    <Label htmlFor="agreeContract" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Li e concordo com o Contrato de Prestação de Serviços Autônomos.
                    </Label>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button type="submit" size="lg" disabled={!agreedToContract}>
                    <FileSignature className="mr-2 h-4 w-4" />
                    Assinar Digitalmente e Enviar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
