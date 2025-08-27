import { MarketingLayout } from "@/components/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Sparkles, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <Sparkles className="mx-auto h-12 w-12 text-accent mb-4" />
            <CardTitle className="font-headline text-3xl">Sobre Nós</CardTitle>
            <CardDescription>
                Conheça a história e os valores da ServirLar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-center">
              A <strong>ServirLar</strong> nasceu para tornar a rotina mais leve e prática, conectando clientes a profissionais de confiança para serviços domésticos. Nosso propósito é oferecer praticidade e segurança, garantindo qualidade em cada atendimento.
            </p>
            <p className="text-center">
              Acreditamos que todo lar merece cuidado, organização e atenção. Por isso, criamos uma plataforma simples e acessível, onde você encontra profissionais capacitados para limpeza, organização, babá, cuidador de idosos e muito mais.
            </p>
            <p className="text-center">
                Mais do que um site, a <strong>ServirLar</strong> é um elo de confiança: ajudamos quem precisa de serviços confiáveis e damos oportunidade a profissionais que desejam trabalhar de forma justa e transparente.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-8 text-center">
                <div className="flex flex-col items-center">
                    <Target className="h-10 w-10 text-primary mb-3"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">Nossa Missão</h3>
                    <p className="text-sm">Facilitar o dia a dia das famílias, oferecendo soluções práticas e seguras.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Star className="h-10 w-10 text-primary mb-3"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">Nossa Visão</h3>
                    <p className="text-sm">Ser a principal referência em intermediação de serviços domésticos no Brasil.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Sparkles className="h-10 w-10 text-primary mb-3"/>
                    <h3 className="font-headline text-xl font-semibold text-foreground">Nossos Valores</h3>
                    <p className="text-sm">Confiança, respeito, qualidade e inovação.</p>
                </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
