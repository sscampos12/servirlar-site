
import { MarketingLayout } from "@/components/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <Sparkles className="mx-auto h-12 w-12 text-accent mb-4" />
            <CardTitle className="font-headline text-3xl">Sobre Nós</CardTitle>
            <CardDescription>
                Conheça a história e os valores por trás da ServirLar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-center">
              A <strong>ServirLar</strong> nasceu da necessidade de simplificar a vida moderna, conectando clientes a profissionais de confiança para serviços domésticos e corporativos. Nosso propósito é oferecer praticidade e segurança, garantindo um padrão de excelência em cada atendimento.
            </p>
            <p className="text-center">
              Acreditamos que todo ambiente, seja um lar ou um escritório, merece cuidado e atenção. Por isso, criamos uma plataforma intuitiva e acessível, onde você encontra os melhores profissionais para limpeza, organização, passadoria e muito mais.
            </p>
            <p className="text-center">
                Mais do que um site, a <strong>ServirLar</strong> é uma ponte de confiança: ajudamos quem precisa de serviços de qualidade e damos oportunidade a profissionais que desejam trabalhar de forma justa e transparente.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-8 text-center">
                <div className="flex flex-col items-center">
                    <Target className="h-10 w-10 text-primary mb-3"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">Nossa Missão</h3>
                    <p className="text-sm">Facilitar o dia a dia de famílias e empresas, oferecendo soluções práticas e seguras para limpeza e bem-estar.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Star className="h-10 w-10 text-primary mb-3"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">Nossa Visão</h3>
                    <p className="text-sm">Ser a principal referência em intermediação de serviços de limpeza e cuidados no Brasil, reconhecida pela qualidade e confiança.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Sparkles className="h-10 w-10 text-primary mb-3"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">Nossos Valores</h3>
                    <p className="text-sm">Confiança, respeito, excelência, inovação e compromisso com a satisfação.</p>
                </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
