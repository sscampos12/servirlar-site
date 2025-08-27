
import { MarketingLayout } from "@/components/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Home as HomeIcon, Shield, Star, Users, Calendar, Award, MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const StepCard = ({ icon: Icon, title, description, step }: { icon: React.ElementType, title: string, description: string, step: number }) => (
    <div className="relative flex flex-col items-center text-center">
        <div className="absolute -top-6 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-xl border-4 border-background">
            {step}
        </div>
        <Card className="pt-10 w-full flex flex-col flex-grow">
            <CardContent className="flex flex-col items-center flex-grow">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-headline text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{description}</p>
            </CardContent>
        </Card>
    </div>
);


export default function Home() {
  return (
    <MarketingLayout>
      {/* How it Works Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    Processo simples e transparente para contratar nossos serviços
                </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                <StepCard
                    step={1}
                    icon={Heart}
                    title="Escolha o Serviço"
                    description="Selecione o tipo de serviço e suas necessidades específicas."
                />
                 <StepCard
                    step={2}
                    icon={Calendar}
                    title="Agende"
                    description="Defina a data e horário que melhor se encaixam na sua agenda."
                />
                 <StepCard
                    step={3}
                    icon={Users}
                    title="Receba o Profissional"
                    description="Nossos especialistas chegam prontos para transformar seu espaço."
                />
                 <StepCard
                    step={4}
                    icon={Star}
                    title="Avalie"
                    description="Sua opinião é fundamental para mantermos a excelência em nossos serviços."
                />
            </div>
        </div>
      </section>

      {/* CTA Section */}
       <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Pronto para Transformar Seu Espaço?
            </h2>
            <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto mb-12">
              Entre em contato conosco e descubra como a ServirLar pode facilitar sua vida e otimizar seu negócio.
            </p>
             <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/schedule">Agendar um Serviço</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                    <Link href="/register/provider">Sou Profissional</Link>
                </Button>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-gray-300">
                <div className="flex items-center justify-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>(21) 92015-0039</span>
                </div>
                 <div className="flex items-center justify-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>contato@servirlar.com.br</span>
                </div>
                 <div className="flex items-center justify-center gap-3">
                    <HomeIcon className="h-5 w-5 text-primary" />
                    <span>São Paulo, SP</span>
                </div>
            </div>
        </div>
      </section>

    </MarketingLayout>
  );
}
