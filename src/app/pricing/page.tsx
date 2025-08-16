
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Star, Calendar, Minus, Plus, Building, Home, Soup, Shirt, UserPlus } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing-layout';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const pricingData = {
  "servicos": {
    "faxina": {
      "nome": "Faxina Padrão",
      "icone": Home,
      "precos": { "4": 140, "6": 198, "8": 240 },
      "hora_adicional": 35
    },
    "passadoria": {
      "nome": "Passadoria",
      "icone": Shirt,
      "precos": { "4": 148, "6": 210, "8": 264 },
      "hora_adicional": 40
    },
    "cozinheira": {
      "nome": "Cozinheira",
      "icone": Soup,
      "precos": { "4": 160, "6": 228, "8": 288 },
      "hora_adicional": 45
    },
    "cuidador": {
      "nome": "Cuidador(a) de Idosos",
      "icone": UserPlus,
      "precos": { "4": 168, "6": 240, "8": 304 },
      "hora_adicional": 45
    }
  }
};

type ServiceKey = keyof typeof pricingData.servicos;
type DurationKey = keyof typeof pricingData.servicos.faxina.precos;

export default function PricingPage() {
  const [selectedService, setSelectedService] = useState<ServiceKey>('faxina');
  const [selectedDuration, setSelectedDuration] = useState<DurationKey>('4');
  const [additionalHours, setAdditionalHours] = useState(0);

  const handleAdditionalHours = (amount: number) => {
    setAdditionalHours(prev => Math.max(0, prev + amount));
  };
  
  const calculateTotal = () => {
    if (!selectedService || !selectedDuration) return 0;
    const service = pricingData.servicos[selectedService];
    const basePrice = service.precos[selectedDuration];
    const additionalPrice = additionalHours * service.hora_adicional;
    return basePrice + additionalPrice;
  };

  const total = calculateTotal();
  const totalHours = parseInt(selectedDuration) + additionalHours;
  const pricePerHour = total / totalHours;

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Serviços de confiança para um lar mais feliz.
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o serviço, defina a duração e agende em menos de 2 minutos. Simples, seguro e com a qualidade que você merece.
          </p>
        </div>

        {/* Pricing Calculator Card */}
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
            {/* Left side: Selections */}
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold font-headline">Passo 1: Qual serviço você precisa?</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {Object.entries(pricingData.servicos).map(([key, service]) => (
                    <Button 
                      key={key} 
                      variant={selectedService === key ? "secondary" : "outline"}
                      onClick={() => setSelectedService(key as ServiceKey)}
                      className="h-auto py-3 flex flex-col gap-2"
                    >
                      <service.icone className="w-6 h-6" />
                      <span>{service.nome}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-lg font-semibold font-headline">Passo 2: Qual a duração ideal para você?</Label>
                <div className="flex gap-3 mt-3">
                  {Object.keys(pricingData.servicos.faxina.precos).map(duration => (
                    <Button 
                      key={duration}
                      variant={selectedDuration === duration ? "secondary" : "outline"}
                      onClick={() => setSelectedDuration(duration as DurationKey)}
                      className="flex-1"
                    >
                      {duration} horas
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="additional-hours" className="text-base font-semibold">Horas Adicionais</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button variant="outline" size="icon" onClick={() => handleAdditionalHours(-1)} disabled={additionalHours === 0}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-bold text-lg w-8 text-center">{additionalHours}</span>
                  <Button variant="outline" size="icon" onClick={() => handleAdditionalHours(1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side: Price Display */}
            <div className="bg-muted/50 rounded-lg p-6 text-center flex flex-col justify-center items-center h-full">
              <p className="text-muted-foreground font-semibold">Valor Total:</p>
              <p className="font-headline text-5xl font-bold text-secondary my-2">
                R$ {total.toFixed(2).replace('.', ',')}
              </p>
              {total > 0 && (
                 <p className="text-muted-foreground text-sm">
                  (Equivalente a R$ {pricePerHour.toFixed(2).replace('.', ',')}/hora)
                </p>
              )}
              <Button asChild size="lg" className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard/schedule">Agendar Agora</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Diferenciais Section */}
        <section className="max-w-4xl mx-auto mt-16 text-center">
            <h2 className="font-headline text-3xl font-bold mb-4">Sua tranquilidade é nossa prioridade.</h2>
            <p className="text-muted-foreground mb-8">O que está incluído em todos os nossos serviços?</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-headline text-xl font-semibold mb-2">Profissionais Verificados e Segurados</h3>
                <p className="text-muted-foreground text-sm">Passam por uma rigorosa checagem de antecedentes e possuem seguro contra acidentes.</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
                <Star className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-headline text-xl font-semibold mb-2">Garantia de Satisfação</h3>
                <p className="text-muted-foreground text-sm">Se não ficar satisfeito, nós resolvemos. Sua felicidade é nosso principal objetivo.</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-headline text-xl font-semibold mb-2">Flexibilidade Total</h3>
                <p className="text-muted-foreground text-sm">Agende, reagende ou cancele com facilidade através da nossa plataforma online.</p>
              </div>
            </div>
        </section>

        {/* Tabela de Preços Detalhada */}
        <section className="max-w-4xl mx-auto mt-16">
            <h2 className="font-headline text-3xl font-bold text-center mb-8">Tabela de Preços Completa</h2>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold text-foreground">Serviço</TableHead>
                                <TableHead className="text-center font-semibold text-foreground">4 Horas</TableHead>
                                <TableHead className="text-center font-semibold text-foreground">6 Horas</TableHead>
                                <TableHead className="text-center font-semibold text-foreground">8 Horas</TableHead>
                                <TableHead className="text-right font-semibold text-foreground">Hora Adicional</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.values(pricingData.servicos).map(service => (
                                <TableRow key={service.nome}>
                                    <TableCell className="font-medium">{service.nome}</TableCell>
                                    <TableCell className="text-center">R$ {service.precos['4'].toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell className="text-center">R$ {service.precos['6'].toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell className="text-center">R$ {service.precos['8'].toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell className="text-right">R$ {service.hora_adicional.toFixed(2).replace('.', ',')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </section>
      </div>
    </MarketingLayout>
  );
}

// Minimal Label component for use inside this page
const Label = React.forwardRef<
  React.ElementRef<"label">,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
