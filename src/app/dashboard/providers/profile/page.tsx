
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProviderContract } from '@/components/contracts/provider-contract';
import { FileSignature, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../layout';

export default function CompleteProviderProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [agreedToContract, setAgreedToContract] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Você precisa estar logado para completar o perfil.",
        });
        return;
    }
    
    if (!agreedToContract) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite o Contrato de Prestação de Serviços para continuar.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const professionalData = {
        cpf: formData.get('cpf') as string,
        birthdate: formData.get('birthdate') as string,
        phone: formData.get('phone') as string,
        pixKey: formData.get('pixKey') as string,
        bankRef1: formData.get('bankRef1') as string,
        bankRef2: formData.get('bankRef2') as string,
        bankRef3: formData.get('bankRef3') as string,
        references: formData.get('references') as string,
        videoUrl: formData.get('video') as string,
        status: 'Pendente', // Update status to Pending for review
      };

      // TODO: Handle file uploads to Firebase Storage

      // Merge new data with existing professional document
      await setDoc(doc(db, "professionals", user.uid), professionalData, { merge: true });
      
      setSubmitted(true);
      toast({
        title: "Cadastro Enviado!",
        description: "Seu perfil foi enviado para análise. Entraremos em contato em breve.",
      });
      router.push("/dashboard/services");

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: "Ocorreu um erro ao enviar seu perfil. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadField = ({ id, label }: { id: string, label: string }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={id} name={id} type="file" required className="cursor-pointer" />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Complete seu Perfil</CardTitle>
            <CardDescription>
              Preencha suas informações para que possamos aprovar seu cadastro.
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
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="birthdate">Data de Nascimento</Label>
                    <Input id="birthdate" name="birthdate" type="date" required />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="(00) 90000-0000" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pixKey">Chave PIX</Label>
                        <Input id="pixKey" name="pixKey" placeholder="Sua chave PIX" required />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h4 className="font-medium">Referências Bancárias</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input id="bankRef1" name="bankRef1" placeholder="Referência Bancária 1" required />
                        <Input id="bankRef2" name="bankRef2" placeholder="Referência Bancária 2" required />
                        <Input id="bankRef3" name="bankRef3" placeholder="Referência Bancária 3" required />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="font-headline text-xl font-semibold text-center">Documentação</h3>
                    <p className="text-center text-muted-foreground text-sm">O upload de arquivos ainda não está implementado. Por enquanto, pode selecionar qualquer arquivo.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FileUploadField id="docCriminal" label="Antecedentes Criminais" />
                        <FileUploadField id="docRG" label="Foto do RG" />
                        <FileUploadField id="docResidence" label="Comprovante de Residência" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="references">Referências Profissionais (opcional)</Label>
                    <Input id="references" name="references" placeholder="Contato de referências" />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="video">Vídeo de Apresentação (URL, opcional)</Label>
                  <Input id="video" name="video" placeholder="https://youtube.com/seu-video" />
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
                  <Button type="submit" size="lg" disabled={!agreedToContract || isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSignature className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Enviando...' : 'Assinar Digitalmente e Enviar Perfil para Análise'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
