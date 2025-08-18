
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';

export default function Home() {
  const features = [
    {
      title: 'Profissionais Verificados',
      description: 'Todos os prestadores passam por uma rigorosa verificação de antecedentes e referências.',
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Agendamento Flexível',
      description: 'Escolha o melhor dia e horário para o serviço, com total conveniência.',
      icon: <Calendar className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Pagamento Seguro',
      description: 'Pague online com segurança através de nossa plataforma integrada.',
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
  ];

  const testimonials = [
    {
      name: 'Ana Silva',
      quote: 'Contratei uma diarista pelo Ajuda em Casa e o serviço foi impecável! A profissional foi pontual, educada e muito eficiente. Recomendo!',
      avatar: 'AS',
    },
    {
      name: 'Carlos Mendes',
      quote: 'A plataforma é muito fácil de usar. Em poucos cliques, agendei o serviço de passadoria e fiquei muito satisfeito com o resultado.',
      avatar: 'CM',
    },
  ];

  return (
    <MarketingLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-secondary/30 py-20 px-4 text-center">
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
              <Button asChild size="lg" variant="secondary" className="shadow-md">
                <Link href="/register/provider">
                  Seja um Profissional
                </Link>
              </Button>
            </div>
          </div>
        </section>


        {/* How it works */}
        <section className="py-16 bg-background px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2 font-headline">Como Funciona?</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Em três passos simples, seu lar está cuidado. Nosso processo foi desenhado para ser rápido, transparente e seguro.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2"><span className="text-primary text-3xl">1</span>Descreva o Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Informe o serviço que você precisa, escolha um pacote de horas e defina a data e horário ideais para você. É rápido e fácil.</p>
                </CardContent>
              </Card>
               <Card className="text-left">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2"><span className="text-primary text-3xl">2</span>Receba a Confirmação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Um profissional qualificado e verificado aceitará seu pedido. Você será notificado em tempo real assim que o serviço for confirmado.</p>
                </CardContent>
              </Card>
               <Card className="text-left">
                <CardHeader>
                   <CardTitle className="font-headline flex items-center gap-2"><span className="text-primary text-3xl">3</span>Relaxe e Aproveite</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">O profissional chegará no horário combinado para realizar o serviço com excelência, enquanto você cuida do que mais importa.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50 px-4">
          <div className="container mx-auto text-center" id="features">
            <h2 className="text-3xl font-bold mb-12 font-headline">Por que escolher o Ajuda em Casa?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-4">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-background px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 font-headline">O que nossos clientes dizem</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card p-6 text-left">
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={`https://placehold.co/100x100.png?text=${testimonial.avatar}`} data-ai-hint="person" />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{testimonial.name}</p>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
