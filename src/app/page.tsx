
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
      quote: 'Contratei uma diarista pelo Lar Seguro e o serviço foi impecável! A profissional foi pontual, educada e muito eficiente. Recomendo!',
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
        <section className="bg-muted py-16 px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline font-bold text-4xl text-primary mb-4">
              Como Funciona o Lar Seguro
            </h2>
            <p className="text-lg text-primary/80 leading-relaxed mb-8">
              O Lar Seguro conecta você a profissionais qualificados, como diaristas, passadeiras, cozinheiras, jardineiros e personal organizers. Agendar um serviço é rápido, simples e seguro, com preços fixos por pacotes de horas. Tudo sem surpresas, garantindo confiança e comodidade para o seu lar.
            </p>

            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="shadow-md">
                <Link href="/schedule">
                  Agendar um Serviço
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
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
            <p className="text-muted-foreground mb-12">Em três passos simples, seu lar está cuidado.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">1. Busque</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Escolha o serviço que você precisa e veja os perfis dos profissionais disponíveis na sua região.</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline">2. Agende</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Selecione a melhor data e horário, e pague com total segurança diretamente pela plataforma.</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline">3. Relaxe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Uma profissional qualificada e verificada chegará no horário combinado para realizar o serviço.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted px-4">
          <div className="container mx-auto text-center" id="features">
            <h2 className="text-3xl font-bold mb-12 font-headline">Por que escolher o Lar Seguro?</h2>
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
                <Card key={index} className="bg-card p-6">
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
