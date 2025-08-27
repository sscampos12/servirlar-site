
import { MarketingLayout } from "@/components/marketing-layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Home as HomeIcon, Shield, Star, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow">
        <Icon className="h-10 w-10 text-primary mb-4" />
        <h3 className="font-headline text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
    </div>
);

const WhyChooseUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center p-6">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-headline text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, feedback, avatarSrc, rating }: { name: string, role: string, feedback: string, avatarSrc: string, rating: number }) => (
    <Card className="flex flex-col bg-background">
        <CardContent className="p-6 pb-4 flex-grow">
            <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                ))}
            </div>
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
      {/* Hero Section */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                        Cuidado e excelência para seu <span className="text-primary">lar</span> e sua <span className="text-accent">empresa</span>.
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                        Conectamos você aos melhores profissionais, oferecendo serviços de limpeza, organização e cuidados com a confiança e a qualidade que você merece.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button asChild size="lg" className="text-lg h-12">
                            <Link href="/login">Agendar um Serviço</Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary" className="text-lg h-12">
                            <Link href="/register/provider">Sou Profissional</Link>
                        </Button>
                    </div>
                </div>
                 <div>
                    <Image 
                        src="https://firebasestudio-hosting.web.app/projects/servirlar/assets/hero_image.png"
                        width={600}
                        height={400}
                        alt="Divisão entre um escritório organizado e uma sala de estar aconchegante"
                        className="rounded-lg shadow-xl"
                        data-ai-hint="office living room"
                        priority
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    Sua tranquilidade é nossa prioridade
                </h2>
                <p className="text-lg text-muted-foreground mt-4">
                    Veja por que a ServirLar é a escolha certa para você.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={Shield}
                    title="Segurança e Confiança"
                    description="Todos os profissionais passam por uma rigorosa verificação de antecedentes para sua total tranquilidade."
                />
                 <FeatureCard 
                    icon={Star}
                    title="Qualidade Garantida"
                    description="Nosso compromisso é com a excelência. Se não ficar satisfeito, nós resolvemos."
                />
                 <FeatureCard 
                    icon={Clock}
                    title="Agendamento Flexível"
                    description="Escolha o dia e a hora que melhor se encaixam na sua rotina, tudo de forma online e descomplicada."
                />
            </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                Por Que Escolher a ServirLar?
              </h2>
              <p className="text-lg text-muted-foreground mt-4">
                Confiança, Qualidade e Praticidade em Cada Detalhe
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <WhyChooseUsCard 
                  icon={Users}
                  title="Profissionais Qualificados"
                  description="Equipe rigorosamente selecionada e treinada para garantir excelência em cada serviço."
              />
              <WhyChooseUsCard 
                  icon={Clock}
                  title="Flexibilidade e Conveniência"
                  description="Agendamento fácil e serviços personalizados para sua rotina e necessidades específicas."
              />
              <WhyChooseUsCard 
                  icon={ShieldCheck}
                  title="Segurança e Transparência"
                  description="Processos claros e sistema de avaliação que garantem sua total tranquilidade."
              />
              <WhyChooseUsCard 
                  icon={Star}
                  title="Bem-Estar e Produtividade"
                  description="Transformamos espaços para melhorar sua qualidade de vida e eficiência no trabalho."
              />
            </div>
        </div>
      </section>

       {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                Quem Confia na ServirLar Recomenda
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
                Veja o que nossos clientes falam sobre nossos serviços.
            </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard 
                    name="Ana Clara S."
                    role="Cliente de Faxina"
                    feedback="Serviço impecável! A profissional foi pontual, muito educada e deixou minha casa brilhando. Com certeza usarei novamente."
                    avatarSrc="https://picsum.photos/100/100"
                    rating={5}
                />
                <TestimonialCard 
                    name="Lucas Mendes"
                    role="Cliente de Cozinheira"
                    feedback="Plataforma muito fácil de usar. Consegui agendar uma cozinheira para um jantar especial e foi tudo perfeito. Recomendo!"
                    avatarSrc="https://picsum.photos/100/100"
                    rating={5}
                />
                <TestimonialCard 
                    name="Mariana Costa"
                    role="Cliente de Passadoria"
                    feedback="Tinha um monte de roupa para passar e a profissional que veio foi super rápida e caprichosa. Salvou minha semana!"
                    avatarSrc="https://picsum.photos/100/100"
                    rating={5}
                />
            </div>
            <div className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/testimonials">Ver todos os depoimentos</Link>
                </Button>
            </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
