
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';
import Image from 'next/image';
import { Logo } from '@/components/logo';

// Inline SVG icons for the hero section
const BroomIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 8.5L20 14.5" />
    <path d="M11.5 11L5.5 17" />
    <path d="M16 12.5L20 16.5" />
    <path d="M12.5 15.5L10.5 17.5" />
    <path d="M5.121 10.469a5.002 5.002 0 0 0 7.071 7.071l8.364-8.364a1 1 0 0 0-1.414-1.414L10.778 16.126" />
    <path d="M15.536 6.015L17.985 3.566a1 1 0 0 1 1.414 1.414l-2.45 2.45" />
  </svg>
);

const BowlIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5c-6.627 0-12 3.358-12 7.5s5.373 7.5 12 7.5 12-3.358 12-7.5S18.627 5 12 5z" />
    <path d="M5 12.5h14" />
  </svg>
);

const IronIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 16H3.5a1.5 1.5 0 0 1-1.5-1.5V9.5a1.5 1.5 0 0 1 1.5-1.5h17a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5z" />
    <path d="M16 8V6.5a1.5 1.5 0 0 0-1.5-1.5h-5A1.5 1.5 0 0 0 8 6.5V8" />
  </svg>
);


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
        <section className="w-full bg-background">
          <div className="container mx-auto grid lg:grid-cols-2 gap-4 px-4 py-8 md:py-16">
            <div className="bg-[#E0F5F1] rounded-lg p-8 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h2 className="text-2xl font-semibold text-secondary mb-4">Ícones</h2>
                <div className="flex gap-4">
                  <BroomIcon className="text-secondary" />
                  <BowlIcon className="text-primary" />
                  <IronIcon className="text-accent" />
                </div>
              </div>
              <div className="mt-8 self-center">
                 <Image 
                    src="https://placehold.co/400x500.png"
                    data-ai-hint="professional cleaner"
                    alt="Profissional de limpeza sorrindo"
                    width={400}
                    height={500}
                    className="object-cover rounded-t-lg z-10"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-white rounded-t-3xl" />
            </div>
            
            <div className="grid grid-rows-2 gap-4">
               <div className="bg-white rounded-lg p-8 flex flex-col justify-center items-start">
                  <Logo className="h-12 w-12 mb-4 text-primary" />
                  <h1 className="font-headline text-4xl md:text-5xl font-bold text-secondary mb-4">
                    Conectando você com as melhores profissionais do lar.
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    Simples, rápido e seguro.
                  </p>
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/pricing">Agende agora</Link>
                  </Button>
                </div>
                <div className="bg-card rounded-lg relative overflow-hidden">
                     <Image 
                        src="https://placehold.co/600x400.png" 
                        data-ai-hint="living room"
                        alt="Sala de estar com sofá e almofadas verdes"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                     />
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
