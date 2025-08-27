
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

const WhyChooseUsCard = ({ icon, title, description, iconColor }: { icon: React.ReactNode, title: string, description: string, iconColor: string }) => (
  <div className="text-center p-10 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-headline">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
  </div>
);

const features = [
    {
      id: 1,
      title: "Profissionais Qualificados",
      description: "Equipe rigorosamente selecionada e treinada para garantir excelência em cada serviço.",
      iconColor: "from-blue-500 to-blue-600",
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 13.5l-3-3 1.41-1.41L10.5 14.67l6.09-6.09L18 10l-7.5 7.5z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Flexibilidade e Conveniência",
      description: "Agendamento fácil e serviços personalizados para sua rotina e necessidades específicas.",
      iconColor: "from-green-500 to-green-600",
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Segurança e Transparência",
      description: "Processos claros e sistema de avaliação que garantem sua total tranquilidade.",
      iconColor: "from-blue-500 to-blue-600",
      icon: (
         <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 13.5l-3-3 1.41-1.41L10.5 14.67l6.09-6.09L18 10l-7.5 7.5z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Bem-Estar e Produtividade",
      description: "Transformamos espaços para melhorar sua qualidade de vida e eficiência no trabalho.",
      iconColor: "from-cyan-500 to-cyan-600",
      icon: (
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      )
    }
  ];

const TestimonialCard = ({ name, role, feedback, avatarSrc, rating }: { name: string, role: string, feedback: string, avatarSrc: string, rating: number }) => (
    <Card className="flex flex-col bg-card">
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
                            <Link href="/register/provider">Seja um Profissional</Link>
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

       {/* Why Choose Us Section - New Design */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Por Que Escolher a ServirLar?
            </h2>
            <p className="text-xl text-gray-600">
                Confiança, Qualidade e Praticidade em Cada Detalhe
            </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {features.map((feature) => (
                    <WhyChooseUsCard 
                        key={feature.id}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        iconColor={feature.iconColor}
                    />
                ))}
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
