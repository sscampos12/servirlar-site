
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingLayout } from '@/components/marketing-layout';
import { User, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function RegisterTypePage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-20 px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Como você quer se cadastrar?</CardTitle>
            <CardDescription>
              Escolha o tipo de perfil que melhor descreve você.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild size="lg" className="h-20 text-lg flex-col gap-2">
              <Link href="/register/client">
                <User className="h-6 w-6" />
                <span>Sou Cliente</span>
                <span className="text-xs font-normal text-primary-foreground/80">Quero contratar serviços para meu lar.</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-20 text-lg flex-col gap-2">
              <Link href="/register/provider">
                <Briefcase className="h-6 w-6" />
                <span>Sou Profissional</span>
                 <span className="text-xs font-normal text-secondary-foreground/80">Quero ofertar meus serviços na plataforma.</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
