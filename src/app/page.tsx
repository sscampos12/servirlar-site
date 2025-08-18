import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing-layout';

export default function Home() {
  return (
    <MarketingLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-primary/10 py-20 px-4 text-center flex-grow flex flex-col justify-center min-h-[calc(100vh-8rem)]">
          <div className="container mx-auto">
            <h1 className="font-headline font-bold text-4xl md:text-5xl text-primary mb-4 max-w-3xl mx-auto">
              A ajuda que seu lar precisa, com a confiança que você merece.
            </h1>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Encontre diaristas, passadeiras e cozinheiras qualificadas em poucos cliques. Simples, rápido e seguro.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="shadow-md">
                <Link href="/schedule">
                  Agendar um Serviço
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="shadow-md bg-accent text-primary hover:bg-accent/90">
                <Link href="/register/provider">
                  Seja um Profissional
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}