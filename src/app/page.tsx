
import { MarketingLayout } from "@/components/marketing-layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Home as HomeIcon, Shield, Star, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
                            <Link href="/schedule">Agendar um Serviço</Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary" className="text-lg h-12">
                            <Link href="/register/provider">Sou Profissional</Link>
                        </Button>
                    </div>
                </div>
                 <div>
                    <Image 
                        src="https://placehold.co/600x400.png"
                        width={600}
                        height={400}
                        alt="Profissional de limpeza sorrindo em uma sala organizada"
                        className="rounded-lg shadow-xl"
                        data-ai-hint="cleaning professional"
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
    </MarketingLayout>
  );
}
