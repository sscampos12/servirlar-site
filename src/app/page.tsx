
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
                    Cuidado e Excelência para Seu <span className="text-primary">Lar</span> e Sua <span className="text-accent">Empresa</span>
                </h1>
                <p className="text-lg md:text-xl max-w-xl text-muted-foreground mb-8">
                    Profissionais qualificados em limpeza, organização e bem-estar, agora atendendo residências e ambientes corporativos com a confiança que você merece.
                </p>
                <div className="flex justify-start gap-4">
                    <Button asChild size="lg">
                        <Link href="/schedule">Serviços para Casa</Link>
                    </Button>
                        <Button asChild size="lg" variant="outline">
                        <Link href="/schedule">Serviços para Empresa</Link>
                    </Button>
                </div>
            </div>
            <div className="hidden md:block">
                 <Image src="https://placehold.co/600x400.png" alt="Ambiente residencial e corporativo limpo e organizado" width={600} height={400} className="rounded-lg shadow-xl" data-ai-hint="living room" />
            </div>
        </div>
      </section>

      {/* Placeholder para a próxima seção */}
       <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    Soluções Completas para Cada Necessidade
                </h2>
                 <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                    Oferecemos serviços especializados tanto para o conforto do seu lar quanto para a produtividade da sua empresa.
                </p>
            </div>
      </section>
    </MarketingLayout>
  );
}
