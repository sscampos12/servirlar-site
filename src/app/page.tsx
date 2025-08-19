
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Shield, Star } from 'lucide-react';

const FeatureCard = ({ title, description }: { title: string, description: string }) => (
  <Card className="text-center shadow-sm hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

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

const TestimonialCard = ({ name, role, feedback, avatarSrc }: { name: string, role: string, feedback: string, avatarSrc: string }) => (
    <Card className="flex flex-col">
        <CardContent className="p-6">
            <p className="text-muted-foreground italic">"{feedback}"</p>
        </CardContent>
        <CardHeader className="flex-row items-center gap-4 pt-0">
            <Avatar>
                <AvatarImage src={avatarSrc} alt={name} data-ai-hint="person" />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base font-bold">{name}</CardTitle>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </CardHeader>
    </Card>
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
                <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Em três passos simples, seu lar está cuidado.</p>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        title="1. Descreva"
                        description="Informe o serviço que você precisa e os detalhes do agendamento. É rápido e fácil."
                    />
                    <FeatureCard 
                        title="2. Receba Confirmação"
                        description="Um profissional qualificado aceitará seu pedido. Você será notificado em tempo real."
                    />
                    <FeatureCard 
                        title="3. Relaxe"
                        description="O profissional chegará no horário combinado para realizar o serviço com excelência."
                    />
                </div>
            </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4 bg-muted">
            <div className="container mx-auto text-center">
                <h2 className="font-headline text-3xl font-bold mb-4">Por que escolher o Lar Seguro?</h2>
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
        
        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-background">
            <div className="container mx-auto text-center">
                <h2 className="font-headline text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
                <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">A satisfação de quem confia na gente é o nosso maior orgulho.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        name="Ana Clara"
                        role="Cliente"
                        feedback="Serviço impecável! A profissional foi pontual, muito educada e deixou minha casa brilhando. Com certeza usarei novamente."
                        avatarSrc="https://placehold.co/100x100.png"
                    />
                     <TestimonialCard 
                        name="Lucas Mendes"
                        role="Cliente"
                        feedback="Plataforma muito fácil de usar. Consegui agendar uma cozinheira para um jantar especial e foi tudo perfeito. Recomendo!"
                        avatarSrc="https://placehold.co/100x100.png"
                    />
                     <TestimonialCard 
                        name="Mariana Costa"
                        role="Cliente"
                        feedback="Tinha um monte de roupa para passar e a profissional que veio foi super rápida e caprichosa. Salvou minha semana!"
                        avatarSrc="https://placehold.co/100x100.png"
                    />
                </div>
            </div>
        </section>

      </div>
    </MarketingLayout>
  );
}
