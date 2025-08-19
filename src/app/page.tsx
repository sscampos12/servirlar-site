
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Shield, Star, PenSquare, Smartphone, Sofa } from 'lucide-react';


const BenefitCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="text-center">
        <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
                <Icon className="h-8 w-8 text-primary" />
            </div>
        </div>
        <h3 className="font-headline text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

const HowItWorksStep = ({ icon: Icon, step, title, description }: { icon: React.ElementType, step: number, title: string, description: string }) => (
    <div className="relative flex flex-col items-center text-center">
        <div className="relative z-10">
            <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full ring-8 ring-background">
                <Icon className="w-10 h-10 text-primary"/>
            </div>
        </div>
        <h3 className="text-xl font-headline font-bold mt-6 mb-2">{step}. {title}</h3>
        <p className="text-muted-foreground max-w-xs">{description}</p>
    </div>
);


export default function Home() {
  return (
    <MarketingLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-primary/10 py-20 px-4 text-center flex-grow flex flex-col justify-center min-h-[calc(100vh-8rem)]">
          <div className="container mx-auto">
            <h1 className="font-headline font-bold text-4xl md:text-5xl text-primary mb-4 max-w-3xl mx-auto">
              A ajuda que seu lar precisa, com a confiança que você merece.
            </h1>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Encontre diaristas, passadeiras e cozinheiras qualificadas em poucos cliques. Simples, rápido e seguro.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="shadow-md">
                <Link href="/schedule">
                  Agendar um Serviço
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="shadow-md bg-accent text-primary hover:bg-accent/90">
                <Link href="/register/provider">
                  Seja um Profissional
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 px-4 bg-background">
            <div className="container mx-auto text-center">
                <h2 className="font-headline text-3xl font-bold mb-4">Como Funciona?</h2>
                <p className="text-muted-foreground mb-16 max-w-2xl mx-auto">Em três passos simples, seu lar está cuidado.</p>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2">
                        <div className="h-full w-full border-t-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div className="relative grid md:grid-cols-3 gap-y-12 md:gap-x-8">
                        <HowItWorksStep 
                            icon={PenSquare}
                            step={1}
                            title="Descreva o Serviço"
                            description="Informe o serviço que você precisa, escolha a data, horário e duração. É rápido e fácil."
                        />
                        <HowItWorksStep 
                            icon={Smartphone}
                            step={2}
                            title="Receba Confirmação"
                            description="Um profissional qualificado aceitará seu pedido e você será notificado em tempo real."
                        />
                        <HowItWorksStep 
                            icon={Sofa}
                            step={3}
                            title="Relaxe e Avalie"
                            description="O profissional chegará na hora combinada para realizar o serviço. Depois, é só avaliar!"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4 bg-muted">
            <div className="container mx-auto text-center">
                <h2 className="font-headline text-3xl font-bold mb-4">Por que escolher a Ajuda em Casa?</h2>
                <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Sua tranquilidade é nossa prioridade. Oferecemos a melhor experiência com segurança e qualidade.</p>
                <div className="grid md:grid-cols-3 gap-12">
                    <BenefitCard 
                        icon={Shield}
                        title="Segurança em Primeiro Lugar"
                        description="Todos os profissionais passam por uma verificação rigorosa de antecedentes e documentos."
                    />
                    <BenefitCard 
                        icon={Star}
                        title="Qualidade Garantida"
                        description="Contamos com um sistema de avaliação contínua para manter apenas os melhores profissionais."
                    />
                    <BenefitCard 
                        icon={CheckCircle}
                        title="Simplicidade e Praticidade"
                        description="Agende e pague online em poucos minutos, sem burocracia e com total transparência."
                    />
                </div>
            </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
