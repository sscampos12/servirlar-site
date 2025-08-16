
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Star, CheckCircle, Soup, Shirt, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      title: 'Profissionais Verificados',
      description: 'Todos os prestadores passam por uma rigorosa verificação de antecedentes e referências.',
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Agendamento Flexível',
      description: 'Escolha o melhor dia e horário para o serviço, com total conveniência.',
      icon: <Star className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Pagamento Seguro',
      description: 'Pague online com segurança através de nossa plataforma integrada.',
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
  ];

  const testimonials = [
    {
      name: 'Ana Silva',
      quote: 'Contratei uma diarista pela Ajuda em Casa e o serviço foi impecável! A profissional foi pontual, educada e muito eficiente. Recomendo!',
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-background relative">
            <div className="absolute inset-0 z-0 opacity-10">
                 <Image 
                    src="https://placehold.co/1920x1080.png" 
                    data-ai-hint="living room background"
                    alt="background" 
                    layout="fill"
                    objectFit="cover"
                 />
            </div>
          <div className="container mx-auto px-4 md:px-6 z-10 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
              <div className="flex justify-center items-center">
                  <div className="relative">
                     <Image
                        src="https://placehold.co/500x500.png"
                        data-ai-hint="professional cleaner person"
                        alt="Hero"
                        width={500}
                        height={500}
                        className="rounded-full object-cover shadow-2xl"
                    />
                    <div className="absolute -bottom-4 -left-12 flex gap-4">
                        <div className="bg-card p-3 rounded-full shadow-lg border border-border"><HomeIcon className="h-8 w-8 text-primary" /></div>
                        <div className="bg-card p-3 rounded-full shadow-lg border border-border"><Soup className="h-8 w-8 text-primary" /></div>
                        <div className="bg-card p-3 rounded-full shadow-lg border border-border"><Shirt className="h-8 w-8 text-primary" /></div>
                    </div>
                  </div>
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-secondary">
                    Conectando você com as melhores profissionais do lar.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Sua casa limpa, suas roupas passadas e suas refeições preparadas com o carinho e a confiança que você merece.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard/schedule">Agende Agora</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="font-headline text-3xl font-bold mb-2">Como Funciona?</h2>
            <p className="text-muted-foreground mb-12">Simples, rápido e seguro.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Busque o Serviço</h3>
                <p className="text-muted-foreground">Escolha o serviço que você precisa e veja os perfis dos profissionais.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Agende e Pague</h3>
                <p className="text-muted-foreground">Selecione a data, horário e pague com segurança pela plataforma.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Receba o Serviço</h3>
                <p className="text-muted-foreground">Um profissional qualificado irá até você para realizar o serviço.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-card">
          <div className="container mx-auto text-center" id="features">
            <h2 className="font-headline text-3xl font-bold mb-12">Por que escolher a Ajuda em Casa?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-headline text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="font-headline text-3xl font-bold mb-12">O que nossos clientes dizem</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card p-6 text-left">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="person" />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <div className="flex text-accent">
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
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
