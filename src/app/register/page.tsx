
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingLayout } from '@/components/marketing-layout';
import { User, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterTypePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <Image 
                src="https://i.postimg.cc/mD4p2yDs/logo-oficial-2.png"
                alt="ServirLar Logo"
                width={180}
                height={40}
              />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-headline">Crie sua Conta</h2>
          <p className="text-gray-600">Junte-se à nossa comunidade</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Como você quer se cadastrar?</CardTitle>
            <CardDescription className="text-center">
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
    </div>
  );
}
