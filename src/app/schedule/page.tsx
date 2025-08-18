
"use client"

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Send } from "lucide-react"
import { useRouter } from 'next/navigation';
import { ScheduleLayout } from './layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const packages = {
  "2h": 130.60,
  "4h": 185.60,
  "6h": 205.60,
  "8h": 225.60,
};

const serviceOptions = [
  "Faxineira", "Passadeira", "Cozinheira", "Lavadeira",
  "Copeira", "Churrasqueiro", "Garçon",
  "Personal Organizer", "Jardineiro"
];

const propertyTypes = ["Residência", "Empresa", "Apartamento", "Casa"];

const marketingSources = ["Instagram", "Facebook", "Google", "Indicação de amigos", "Outros"];

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [serviceType, setServiceType] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [address, setAddress] = useState({
    cep: "", logradouro: "", numero: "",
    bairro: "", complemento: "", referencia: "",
    cidade: "", estado: ""
  });
  const [marketingSource, setMarketingSource] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async () => {
    if (!user) {
        toast({
            title: "Login Necessário",
            description: "Você precisa estar logado para agendar um serviço.",
            variant: "destructive"
        });
        router.push('/login?redirect=/schedule');
        return;
    }
     if (!serviceType || !selectedPackage || !address.cep || !address.logradouro || !address.numero || !address.bairro || !address.cidade || !address.estado || !phone) {
        toast({
            title: "Campos Obrigatórios",
            description: "Por favor, preencha todos os campos obrigatórios.",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);

    try {
        const clientDoc = await getDoc(doc(db, "users", user.uid));
        const clientData = clientDoc.data();

        await addDoc(collection(db, "serviceRequests"), {
            clientId: user.uid,
            clientName: clientData?.name || user.displayName,
            clientEmail: user.email,
            phone,
            serviceType,
            package: selectedPackage,
            price: packages[selectedPackage as keyof typeof packages],
            propertyType,
            address,
            hasPets,
            marketingSource,
            status: "pending",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        toast({
            title: "Solicitação Enviada!",
            description: "Seu pedido foi enviado. Em breve um profissional entrará em contato.",
        });
        router.push('/dashboard/clients/requests');

    } catch (error) {
        console.error("Error creating schedule: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao Solicitar",
            description: "Não foi possível criar a solicitação. Tente novamente.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <ScheduleLayout>
      <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Solicitar um Serviço</CardTitle>
              <CardDescription>
                Preencha os detalhes abaixo para encontrarmos o profissional perfeito para você.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Informações de Contato */}
                <div className="space-y-4">
                    <h3 className="font-headline text-xl font-semibold">Informações de Contato</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientName">Nome</Label>
                            <Input id="clientName" value={user?.displayName || ''} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ''} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Telefone para Contato</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" required />
                        </div>
                    </div>
                </div>

                {/* Detalhes do Serviço */}
                <div className="space-y-4">
                    <h3 className="font-headline text-xl font-semibold">Detalhes do Serviço</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Qual serviço você precisa?</Label>
                             <Select onValueChange={setServiceType} value={serviceType}>
                                <SelectTrigger><SelectValue placeholder="Selecione um serviço..." /></SelectTrigger>
                                <SelectContent>
                                    {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label>Qual pacote de horas?</Label>
                             <Select onValueChange={setSelectedPackage} value={selectedPackage}>
                                <SelectTrigger><SelectValue placeholder="Selecione um pacote..." /></SelectTrigger>
                                <SelectContent>
                                     {Object.entries(packages).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{key} - R${' '} {value.toFixed(2).replace('.', ',')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                 {/* Informações do Imóvel */}
                <div className="space-y-4">
                    <h3 className="font-headline text-xl font-semibold">Informações do Imóvel</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Tipo de Imóvel</Label>
                             <Select onValueChange={setPropertyType} value={propertyType}>
                                <SelectTrigger><SelectValue placeholder="Selecione o tipo..." /></SelectTrigger>
                                <SelectContent>
                                    {propertyTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end pb-2">
                             <div className="flex items-center space-x-2">
                                <Checkbox id="hasPets" checked={hasPets} onCheckedChange={(checked) => setHasPets(!!checked)} />
                                <Label htmlFor="hasPets">Possui animais de estimação?</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                     <h3 className="font-headline text-xl font-semibold">Endereço de Realização do Serviço</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-1">
                            <Label htmlFor="cep">CEP</Label>
                            <Input id="cep" name="cep" value={address.cep} onChange={handleAddressChange} placeholder="00000-000" />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="logradouro">Logradouro</Label>
                            <Input id="logradouro" name="logradouro" value={address.logradouro} onChange={handleAddressChange} placeholder="Ex: Rua das Flores" />
                        </div>
                    </div>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numero">Número</Label>
                            <Input id="numero" name="numero" value={address.numero} onChange={handleAddressChange} placeholder="123" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input id="bairro" name="bairro" value={address.bairro} onChange={handleAddressChange} placeholder="Centro" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="complemento">Complemento</Label>
                            <Input id="complemento" name="complemento" value={address.complemento} onChange={handleAddressChange} placeholder="Apto 101" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="cidade">Cidade</Label>
                            <Input id="cidade" name="cidade" value={address.cidade} onChange={handleAddressChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="estado">Estado</Label>
                            <Input id="estado" name="estado" value={address.estado} onChange={handleAddressChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="referencia">Ponto de Referência</Label>
                        <Textarea id="referencia" name="referencia" value={address.referencia} onChange={(e) => setAddress(prev => ({...prev, referencia: e.target.value}))} placeholder="Ex: Próximo à padaria" />
                    </div>
                </div>

                {/* Origem */}
                <div className="space-y-2">
                    <Label>Como você conheceu a Lar Seguro?</Label>
                    <Select onValueChange={setMarketingSource} value={marketingSource}>
                        <SelectTrigger><SelectValue placeholder="Selecione uma opção..." /></SelectTrigger>
                        <SelectContent>
                            {marketingSources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-4">
                    <Button size="lg" onClick={handleSubmit} disabled={isLoading}>
                         {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                        {isLoading ? "Enviando Solicitação..." : "Enviar Solicitação"}
                    </Button>
                </div>

            </CardContent>
          </Card>
      </div>
    </ScheduleLayout>
  );
}
