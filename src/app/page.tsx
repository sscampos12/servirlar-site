import { MarketingLayout } from "@/components/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, HomeIcon, Shield, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Icon className="h-8 w-8" />
        </div>
        <h3 className="font-headline text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

const TestimonialCard = ({ name, role, feedback, avatarSrc, rating }: { name: string, role: string, feedback: string, avatarSrc: string, rating: number }) => (
    <Card className="flex flex-col">
        <CardContent className="p-6 pb-4 flex-grow">
            <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                ))}
            </div>
            <p className="text-muted-foreground italic">"{feedback}"</p>
        </CardContent>
        <CardHeader className="flex-row items-center gap-4 pt-0">
            <Image src={avatarSrc} alt={name} width={40} height={40} className="rounded-full" data-ai-hint="person" />
            <div>
                <CardTitle className="text-base font-bold">{name}</CardTitle>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </CardHeader>
    </Card>
);

export default function HomePage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="py-20 md:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-foreground">
                        Sua casa, seu escritório, seu bem-estar.
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
                        Conectamos você aos melhores profissionais de limpeza e cuidados, com a segurança e a praticidade que você merece. Agende em minutos.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/schedule">Agendar um Serviço</Link>
                        </Button>
                         <Button asChild size="lg" variant="outline">
                            <Link href="/register/provider">Sou Profissional</Link>
                        </Button>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                            Tranquilidade em cada detalhe
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <FeatureCard 
                            icon={Shield}
                            title="Profissionais Verificados"
                            description="Todos os prestadores passam por uma rigorosa checagem de documentos e antecedentes para sua total segurança."
                        />
                        <FeatureCard 
                            icon={Clock}
                            title="Agendamento Flexível"
                            description="Escolha o melhor dia e horário. Nossa plataforma se adapta à sua rotina, não o contrário."
                        />
                         <FeatureCard 
                            icon={CheckCircle}
                            title="Qualidade Garantida"
                            description="Sua satisfação é nossa prioridade. Conte com nosso suporte e a garantia de um serviço bem feito."
                        />
                    </div>
                </div>
            </section>
            
             {/* Como Funciona Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Como funciona?</h2>
                         <p className="text-lg text-muted-foreground mt-4">Simples, rápido e seguro. Em 3 passos você resolve.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader><CardTitle className="font-headline">1. Descreva o Serviço</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground">Escolha o tipo de serviço, a duração e o melhor dia e horário para você.</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="font-headline">2. Receba Confirmação</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground">Um de nossos profissionais qualificados aceitará seu pedido. Você será notificado na hora!</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="font-headline">3. Relaxe e Avalie</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground">O profissional realiza o serviço. Depois, é só avaliar a experiência na plataforma.</p></CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                            Aprovado por quem mais importa: nossos clientes
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TestimonialCard 
                            name="Ana Clara S."
                            role="Cliente de Faxina"
                            feedback="Serviço impecável! A profissional foi pontual, muito educada e deixou minha casa brilhando. Com certeza usarei novamente."
                            avatarSrc="https://placehold.co/100x100.png"
                            rating={5}
                        />
                        <TestimonialCard 
                            name="Mariana Costa"
                            role="Cliente de Passadoria"
                            feedback="Tinha um monte de roupa para passar e a profissional que veio foi super rápida e caprichosa. Salvou minha semana!"
                            avatarSrc="https://placehold.co/100x100.png"
                            rating={5}
                        />
                        <TestimonialCard 
                            name="Beatriz Lima"
                            role="Cliente de Cuidadora"
                            feedback="Contratei uma cuidadora para minha mãe e fiquei muito tranquila. A profissional foi atenciosa e muito carinhosa."
                            avatarSrc="https://placehold.co/100x100.png"
                            rating={5}
                        />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}