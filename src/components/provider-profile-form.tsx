// Arquivo: src/components/provider-profile-form.tsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProviderContract } from '@/components/contracts/provider-contract';
import { FileSignature, CheckCircle2, Upload, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, GeoPoint, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { geohashForLocation } from 'geofire-common';

const FileUploadField = ({ id, label }: { id: string, label: string }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={id} name={id} type="file" required className="cursor-pointer" />
      </div>
    </div>
  );
  

export function ProviderProfileForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agreedToContract, setAgreedToContract] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
      cpf: '',
      birthdate: '',
      phone: '',
      pixKey: '',
      bankRef1: '',
      bankRef2: '',
      bankRef3: '',
      references: '',
      videoUrl: '',
      street: '',
      city: '',
      state: '',
      zip: '',
  });

  const { toast } = useToast();

   useEffect(() => {
    if (authLoading) return;
    if (!user) {
        router.push('/login?redirect=/dashboard/providers/profile');
        return;
    };
    
    const editId = searchParams.get('id');
    const isEditing = searchParams.get('edit') === 'true' && editId;
    setIsEditMode(isEditing);

    const checkProfileStatus = async () => {
        const userId = isEditing ? editId : user.uid;
        const professionalDocRef = doc(db, "professionals", userId);
        const docSnap = await getDoc(professionalDocRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
             if (isEditing) {
                setFormData({
                    cpf: data.cpf || '',
                    birthdate: data.birthdate || '',
                    phone: data.phone || '',
                    pixKey: data.pixKey || '',
                    bankRef1: data.bankRef1 || '',
                    bankRef2: data.bankRef2 || '',
                    bankRef3: data.bankRef3 || '',
                    references: data.references || '',
                    videoUrl: data.videoUrl || '',
                    street: data.addressInfo?.street || '',
                    city: data.addressInfo?.city || '',
                    state: data.addressInfo?.state || '',
                    zip: data.addressInfo?.zip || '',
                });
            } else if (data.status !== 'Incompleto') {
                router.replace('/dashboard/profile');
            }
        }
        setIsCheckingProfile(false);
    };

    checkProfileStatus();
  }, [user, authLoading, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const editId = searchParams.get('id');
    const userId = isEditMode && editId ? editId : user?.uid;

    if (!userId) {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Identificação de usuário não encontrada.",
        });
        return;
    }
    
    if (!agreedToContract && !isEditMode) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "Por favor, leia e aceite o Contrato de Prestação de Serviços para continuar.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // A geocodificação (endereço -> lat/lng) deve ser feita aqui.
      // Como não podemos chamar APIs externas, usaremos valores fixos como exemplo.
      // Em um app real, use uma API como a do Google Maps Geocoding.
      const lat = -23.5505; // Exemplo: São Paulo
      const lng = -46.6333;
      const geohash = geohashForLocation([lat, lng]);

      const professionalData = {
        cpf: formData.cpf,
        birthdate: formData.birthdate,
        phone: formData.phone,
        pixKey: formData.pixKey,
        bankRef1: formData.bankRef1,
        bankRef2: formData.bankRef2,
        bankRef3: formData.bankRef3,
        references: formData.references,
        videoUrl: formData.videoUrl,
        addressInfo: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        location: new GeoPoint(lat, lng),
        geohash: geohash,
        status: isEditMode ? 'Aprovado' : 'Pendente',
        updatedAt: serverTimestamp(),
      };

      // TODO: Handle file uploads to Firebase Storage

      // Merge new data with existing professional document
      await updateDoc(doc(db, "professionals", userId), professionalData);
      
      setSubmitted(true);
      toast({
        title: isEditMode ? "Cadastro Atualizado!" : "Cadastro Enviado para Análise!",
        description: isEditMode ? "As informações do perfil foram salvas." : "Seu perfil será analisado por nossa equipe. Avisaremos quando for aprovado.",
      });
      
      router.push(isEditMode ? `/dashboard/providers/${userId}` : '/dashboard/profile');

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

  if (authLoading || isCheckingProfile) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
             <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    )
  }

  return (
    <div className="bg-muted min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <User className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="font-headline text-3xl">{isEditMode ? 'Editar Perfil' : 'Complete seu Perfil'}</CardTitle>
            <CardDescription>
              {isEditMode ? 'Atualize as informações do profissional.' : 'Preencha suas informações para que possamos aprovar seu cadastro.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" required value={formData.cpf} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="birthdate">Data de Nascimento</Label>
                    <Input id="birthdate" name="birthdate" type="date" required value={formData.birthdate} onChange={handleInputChange} />
                    </div>
                </div>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="(00) 90000-0000" required value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pixKey">Chave PIX</Label>
                        <Input id="pixKey" name="pixKey" placeholder="Sua chave PIX" required value={formData.pixKey} onChange={handleInputChange} />
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Endereço</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="street">Rua e Número</Label>
                            <Input id="street" name="street" placeholder="Ex: Rua das Flores, 123" required value={formData.street} onChange={handleInputChange} />
                        </div>
                            <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input id="city" name="city" placeholder="Ex: São Paulo" required value={formData.city} onChange={handleInputChange} />
                        </div>
                            <div className="space-y-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input id="state" name="state" placeholder="Ex: SP" required value={formData.state} onChange={handleInputChange} />
                        </div>
                            <div className="space-y-2">
                            <Label htmlFor="zip">CEP</Label>
                            <Input id="zip" name="zip" placeholder="00000-000" required value={formData.zip} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h4 className="font-medium">Referências Bancárias</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Input id="bankRef1" name="bankRef1" placeholder="Referência Bancária 1" required value={formData.bankRef1} onChange={handleInputChange} />
                        <Input id="bankRef2" name="bankRef2" placeholder="Referência Bancária 2" required value={formData.bankRef2} onChange={handleInputChange} />
                        <Input id="bankRef3" name="bankRef3" placeholder="Referência Bancária 3" required value={formData.bankRef3} onChange={handleInputChange} />
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
                    <Input id="references" name="references" placeholder="Contato de referências" value={formData.references} onChange={handleInputChange} />
                    </div>
                <div className="space-y-2">
                    <Label htmlFor="videoUrl">Vídeo de Apresentação (URL, opcional)</Label>
                    <Input id="videoUrl" name="videoUrl" placeholder="https://youtube.com/seu-video" value={formData.videoUrl} onChange={handleInputChange} />
                </div>
                
                {!isEditMode && (
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
                )}

                <div className="text-center pt-4">
                    <Button type="submit" size="lg" disabled={(!agreedToContract && !isEditMode) || isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSignature className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Enviando...' : isEditMode ? 'Salvar Alterações' : 'Concluir e Enviar para Análise'}
                    </Button>
                </div>
                </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}