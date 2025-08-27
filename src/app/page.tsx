
import { MarketingLayout } from "@/components/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Home as HomeIcon, Shield, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
                <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-foreground">
                    Conectamos você aos melhores profissionais para seu <span className="text-primary">Lar</span>
                </h1>
                <p className="text-lg md:text-xl max-w-xl text-muted-foreground mb-8">
                    Encontre e agende serviços de limpeza, passadoria e cuidados com a confiança e a praticidade que você merece.
                </p>
                <div className="flex justify-start gap-4">
                    <Button asChild size="lg">
                        <Link href="/schedule">Agendar um Serviço</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/register/provider">Sou Profissional</Link>
                    </Button>
                </div>
            </div>
            <div className="hidden md:block">
                 <Image src="https://placehold.co/600x400.png" alt="Ambiente residencial limpo e organizado" width={600} height={400} className="rounded-lg shadow-xl" data-ai-hint="living room" />
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Simples, Rápido e Seguro
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Nossa plataforma foi desenhada para sua total tranquilidade, do agendamento à realização do serviço.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card rounded-lg shadow-sm">
                <Clock className="mx-auto h-12 w-12 text-primary mb-4"/>
                <h3 className="font-headline text-xl font-semibold mb-2">Agendamento Fácil</h3>
                <p className="text-muted-foreground">Escolha o serviço, a data e a hora. Em poucos cliques, está tudo resolvido.</p>
            </div>
             <div className="p-6 bg-card rounded-lg shadow-sm">
                <Users className="mx-auto h-12 w-12 text-primary mb-4"/>
                <h3 className="font-headline text-xl font-semibold mb-2">Profissionais de Confiança</h3>
                <p className="text-muted-foreground">Todos os profissionais passam por uma rigorosa verificação de documentos e antecedentes.</p>
            </div>
             <div className="p-6 bg-card rounded-lg shadow-sm">
                <Shield className="mx-auto h-12 w-12 text-primary mb-4"/>
                <h3 className="font-headline text-xl font-semibold mb-2">Pagamento Seguro</h3>
                <p className="text-muted-foreground">Pague online com segurança. O valor só é liberado para o profissional após a sua confirmação.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
       <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                Amado por clientes como você
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto mb-12">
                Veja o que nossos clientes estão dizendo sobre a experiência ServirLar.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="text-left">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">"Plataforma muito fácil de usar. Consegui agendar uma faxina para o mesmo dia e a profissional foi fantástica. Recomendo demais!"</p>
                        <p className="font-bold text-foreground">Ana Clara S.</p>
                    </CardContent>
                </Card>
                 <Card className="text-left">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">"Finalmente um serviço que funciona. O processo é transparente e me sinto segura em contratar pela ServirLar."</p>
                        <p className="font-bold text-foreground">Lucas Mendes</p>
                    </CardContent>
                </Card>
                <Card className="text-left hidden lg:block">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                             <Star className="text-accent fill-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">"Contratei uma cozinheira para um jantar especial e foi tudo perfeito. Comida maravilhosa e serviço impecável."</p>
                        <p className="font-bold text-foreground">Mariana Costa</p>
                    </CardContent>
                </Card>
            </div>
             <Button asChild variant="link" className="mt-8">
                <Link href="/testimonials">Ver mais depoimentos</Link>
            </Button>
        </div>
      </section>

    </MarketingLayout>
  );
}
